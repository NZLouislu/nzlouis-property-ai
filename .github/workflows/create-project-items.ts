import * as fs from 'fs';
import { marked } from 'marked';
import { GraphQLClient, gql } from 'graphql-request';

// Function to parse story markdown file
function parseStoryFile(filePath: string): {
  storyId: string;
  title: string;
  description: string;
  acceptanceCriteria: string;
  technicalImplementation: string;
  status: string;
} {
  console.log(`[parse] start file: ${filePath}`);
  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split('\n');
  
  let title = '';
  let description = '';
  let acceptanceCriteria = '';
  let technicalImplementation = '';
  let storyId = '';
  let status = '';
  
  // Extract story ID
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].startsWith('### Story ID')) {
      if (i + 1 < lines.length) {
        storyId = lines[i + 1].trim();
        console.log(`[parse] found Story ID: ${storyId}`);
      }
      break;
    }
  }
  
  // Extract status
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].startsWith('### Status')) {
      if (i + 1 < lines.length) {
        status = lines[i + 1].trim();
        console.log(`[parse] found Status: ${status}`);
      }
      break;
    }
  }
  
  // Extract title (assumed to be the first H2 header)
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].startsWith('## Story: ')) {
      title = lines[i].substring(10).trim();
      console.log(`[parse] found title: ${title}`);
      break;
    }
  }
  
  // Extract sections with improved logic
  let currentSection = '';
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    console.log(`[parse] Processing line ${i}: "${line}" (current section: ${currentSection})`);
    
    // Check for content section headers
    if (line.startsWith('### Description')) {
      currentSection = 'description';
      console.log(`[parse] Starting Description section`);
      continue;
    } else if (line.startsWith('### Acceptance Criteria')) {
      currentSection = 'acceptance';
      console.log(`[parse] Starting Acceptance Criteria section`);
      continue;
    } else if (line.startsWith('### Technical Implementation') || line.startsWith('### Technical Notes')) {
      currentSection = 'technical';
      console.log(`[parse] Starting Technical section`);
      continue;
    } else if (line.startsWith('### Story ID') || line.startsWith('### Status')) {
      // These are metadata sections, don't affect content collection
      console.log(`[parse] Found metadata section: ${line}`);
      continue;
    } else if (line.startsWith('### ')) {
      // Check if this is a known content section
      const knownSections = ['Description', 'Acceptance Criteria', 'Technical Implementation', 'Technical Notes'];
      const isKnownSection = knownSections.some(section => line.includes(section));
      
      if (!isKnownSection) {
        // Unknown section header, stop current section
        console.log(`[parse] Unknown section header, stopping current section: ${line}`);
        currentSection = '';
      }
      continue;
    } else if (line.startsWith('## ') && line.length > 3) {
      // Main headers, stop current section
      console.log(`[parse] Main header found, stopping current section: ${line}`);
      currentSection = '';
      continue;
    }
    
    // Add content to the appropriate section
    if (currentSection === 'description' && line.trim() !== '') {
      description += line + '\n';
      console.log(`[parse] Added to description: "${line}"`);
    } else if (currentSection === 'acceptance' && line.trim() !== '') {
      acceptanceCriteria += line + '\n';
      console.log(`[parse] Added to acceptance criteria: "${line}"`);
    } else if (currentSection === 'technical' && line.trim() !== '') {
      technicalImplementation += line + '\n';
      console.log(`[parse] Added to technical: "${line}"`);
    }
  }
  
  // If no story ID found, generate one from file name
  if (!storyId) {
    const fileName = filePath.split('/').pop()?.replace('.md', '') || '';
    const repositoryName = process.env.GITHUB_REPOSITORY ? process.env.GITHUB_REPOSITORY.split('/')[1] : 'nzlouis-property-ai';
    storyId = `${repositoryName}-${fileName}`;
    console.log(`[parse] Generated Story ID: ${storyId}`);
  }
  
  // Clean up the extracted content
  description = description.trim();
  acceptanceCriteria = acceptanceCriteria.trim();
  technicalImplementation = technicalImplementation.trim();
  
  console.log(`[parse] Final summary:`);
  console.log(`[parse] - Story ID: ${storyId}`);
  console.log(`[parse] - Title: "${title}"`);
  console.log(`[parse] - Description length: ${description.length}`);
  console.log(`[parse] - Acceptance Criteria length: ${acceptanceCriteria.length}`);
  console.log(`[parse] - Technical Implementation length: ${technicalImplementation.length}`);
  console.log(`[parse] - Status: ${status}`);
  
  return {
    storyId,
    title,
    description,
    acceptanceCriteria,
    technicalImplementation,
    status
  };
}

// Function to check if an item with the same story ID already exists
async function findExistingItem(client: GraphQLClient, projectId: string, storyId: string): Promise<string | null> {
  console.log(`[find] Checking for existing item with storyId: ${storyId}`);
  
  const query = gql`
    query($projectId: ID!, $first: Int!, $after: String) {
      node(id: $projectId) {
        ... on ProjectV2 {
          items(first: $first, after: $after) {
            nodes {
              id
              fieldValues(first: 100) {
                nodes {
                  ... on ProjectV2ItemFieldTextValue {
                    text
                    field {
                      ... on ProjectV2FieldCommon {
                        name
                      }
                    }
                  }
                }
              }
            }
            pageInfo {
              hasNextPage
              endCursor
            }
          }
        }
      }
    }
  `;
  
  try {
    let hasNextPage = true;
    let cursor: string | null = null;
    
    while (hasNextPage) {
      const variables = {
        projectId: projectId,
        first: 100,
        after: cursor
      };
      
      const response: any = await client.request(query, variables);
      const items = response.node.items.nodes;
      
      for (const item of items) {
        // Look for an item with a matching Story ID field
        for (const fieldValue of item.fieldValues.nodes) {
          if (fieldValue.field && fieldValue.field.name === 'Story ID' && fieldValue.text === storyId) {
            console.log(`[find] Found existing item with matching Story ID: ${item.id}`);
            return item.id;
          }
        }
      }
      
      const pageInfo = response.node.items.pageInfo;
      hasNextPage = pageInfo.hasNextPage;
      cursor = pageInfo.endCursor;
    }
    
    console.log(`[find] No existing item found with storyId: ${storyId}`);
    return null;
  } catch (error: any) {
    console.error(`[find] Error searching for existing item:`, error.message);
    return null;
  }
}

// Function to get project field IDs
async function getProjectFields(client: GraphQLClient, projectId: string): Promise<{[key: string]: any}> {
  console.log(`[fields] Getting project fields for project: ${projectId}`);
  
  const query = gql`
    query($projectId: ID!) {
      node(id: $projectId) {
        ... on ProjectV2 {
          fields(first: 100) {
            nodes {
              ... on ProjectV2Field {
                id
                name
                dataType
              }
              ... on ProjectV2SingleSelectField {
                id
                name
                dataType
                options {
                  id
                  name
                }
              }
              ... on ProjectV2IterationField {
                id
                name
                dataType
                configuration {
                  iterations {
                    id
                    startDate
                  }
                }
              }
            }
          }
        }
      }
    }
  `;
  
  try {
    const response: any = await client.request(query, { projectId });
    const fields = response.node.fields.nodes;
    
    // Create a map of field names to field IDs and options
    const fieldMap: {[key: string]: any} = {};
    fields.forEach((field: any) => {
      fieldMap[field.name] = {
        id: field.id,
        dataType: field.dataType,
        options: field.options || []
      };
    });
    
    console.log(`[fields] Retrieved ${fields.length} fields`);
    console.log(`[fields] Available field names: ${Object.keys(fieldMap).join(', ')}`);
    
    // Log detailed field information
    Object.keys(fieldMap).forEach(fieldName => {
      const field = fieldMap[fieldName];
      console.log(`[fields] Field "${fieldName}": id=${field.id}, dataType=${field.dataType}, options=${field.options.length}`);
    });
    
    // Check if required fields exist
    const requiredFields = ['Description', 'Acceptance Criteria', 'Technical Implementation'];
    const missingFields = requiredFields.filter(field => !fieldMap[field]);
    
    if (missingFields.length > 0) {
      console.warn(`[fields] WARNING: Missing required fields in project: ${missingFields.join(', ')}`);
      console.warn(`[fields] Please add these custom fields to your GitHub project for full functionality.`);
    }
    
    return fieldMap;
  } catch (error: any) {
    console.error(`[fields] Error getting project fields:`, error.message);
    return {};
  }
}

// Function to set additional fields on a newly created item
async function setItemFields(client: GraphQLClient, projectId: string, itemId: string, storyData: any, storyId: string): Promise<void> {
  console.log(`[set-fields] Setting fields for item: ${itemId}`);
  
  // Get project field IDs
  const fields = await getProjectFields(client, projectId);
  
  const updateItemTextMutation = gql`
    mutation($projectId: ID!, $fieldId: ID!, $itemId: ID!, $value: String!) {
      updateProjectV2ItemFieldValue(input: { projectId: $projectId, itemId: $itemId, fieldId: $fieldId, value: {text: $value} }) {
        projectV2Item {
          id
        }
      }
    }
  `;
  
  const updateItemSingleSelectMutation = gql`
    mutation($projectId: ID!, $fieldId: ID!, $itemId: ID!, $value: String!) {
      updateProjectV2ItemFieldValue(input: { projectId: $projectId, itemId: $itemId, fieldId: $fieldId, value: { singleSelectOptionId: $value } }) {
        projectV2Item {
          id
        }
      }
    }
  `;
  
  try {
    // Set description - try multiple possible field names
    const descriptionFieldNames = ['Description', 'Desc', 'Summary'];
    const descriptionField = descriptionFieldNames.find(name => fields[name]);
    if (descriptionField && fields[descriptionField]) {
      console.log(`[set-fields] Setting description using field "${descriptionField}" for item: ${itemId}`);
      console.log(`[set-fields] Description content length: ${storyData.description.length}`);
      await client.request(updateItemTextMutation, {
        projectId: projectId,
        itemId: itemId,
        fieldId: fields[descriptionField].id,
        value: storyData.description
      });
    } else {
      console.log(`[set-fields] No description field found. Available fields: ${Object.keys(fields).join(', ')}`);
      console.log(`[set-fields] To fully utilize this feature, please add a 'Description' custom field to your GitHub project.`);
    }
    
    // Set acceptance criteria - try multiple possible field names
    const acceptanceFieldNames = ['Acceptance Criteria', 'Acceptance', 'AC', 'Criteria'];
    const acceptanceField = acceptanceFieldNames.find(name => fields[name]);
    if (acceptanceField && fields[acceptanceField]) {
      console.log(`[set-fields] Setting acceptance criteria using field "${acceptanceField}" for item: ${itemId}`);
      console.log(`[set-fields] Acceptance criteria content length: ${storyData.acceptanceCriteria.length}`);
      await client.request(updateItemTextMutation, {
        projectId: projectId,
        itemId: itemId,
        fieldId: fields[acceptanceField].id,
        value: storyData.acceptanceCriteria
      });
    } else {
      console.log(`[set-fields] No acceptance criteria field found. Available fields: ${Object.keys(fields).join(', ')}`);
      console.log(`[set-fields] To fully utilize this feature, please add an 'Acceptance Criteria' custom field to your GitHub project.`);
    }
    
    // Set technical implementation/notes - try multiple possible field names
    const technicalFieldNames = ['Technical Notes', 'Technical Implementation', 'Technical Details', 'Implementation', 'Tech Notes'];
    const technicalField = technicalFieldNames.find(name => fields[name]);
    if (technicalField && fields[technicalField]) {
      console.log(`[set-fields] Setting technical notes using field "${technicalField}" for item: ${itemId}`);
      console.log(`[set-fields] Technical implementation content length: ${storyData.technicalImplementation.length}`);
      await client.request(updateItemTextMutation, {
        projectId: projectId,
        itemId: itemId,
        fieldId: fields[technicalField].id,
        value: storyData.technicalImplementation
      });
    } else {
      console.log(`[set-fields] No technical field found. Available fields: ${Object.keys(fields).join(', ')}`);
      console.log(`[set-fields] To fully utilize this feature, please add a 'Technical Implementation' custom field to your GitHub project.`);
    }
    
    // Set Story ID
    if (fields['Story ID']) {
      console.log(`[set-fields] Setting Story ID (${storyId}) for item: ${itemId}`);
      await client.request(updateItemTextMutation, {
        projectId: projectId,
        itemId: itemId,
        fieldId: fields['Story ID'].id,
        value: storyId
      });
    }
    
    // Set status field
    if (fields['Status'] && storyData.status) {
      const statusField = fields['Status'];
      const statusOption = statusField.options.find((option: any) => option.name.toLowerCase() === storyData.status.toLowerCase());
      
      if (statusOption) {
        console.log(`[set-fields] Setting status to ${storyData.status} for item: ${itemId}`);
        await client.request(updateItemSingleSelectMutation, {
          projectId: projectId,
          itemId: itemId,
          fieldId: statusField.id,
          value: statusOption.id
        });
        console.log(`[set-fields] Status set to ${storyData.status} successfully`);
      } else {
        console.log(`[set-fields] Status option ${storyData.status} not found for Status field`);
        console.log(`[set-fields] Available options: ${JSON.stringify(statusField.options)}`);
      }
    } else if (fields['Status']) {
      // Default to "Backlog" if no status specified
      const statusField = fields['Status'];
      const backlogOption = statusField.options.find((option: any) => option.name === 'Backlog');
      
      if (backlogOption) {
        console.log(`[set-fields] Setting status to Backlog for item: ${itemId}`);
        await new Promise(resolve => setTimeout(resolve, 1000));
        await client.request(updateItemSingleSelectMutation, {
          projectId: projectId,
          itemId: itemId,
          fieldId: statusField.id,
          value: backlogOption.id
        });
        console.log(`[set-fields] Status set to Backlog successfully`);
      } else {
        console.log(`[set-fields] Backlog option not found for Status field`);
        console.log(`[set-fields] Available options: ${JSON.stringify(statusField.options)}`);
      }
    } else {
      console.log(`[set-fields] Status field not found in project`);
    }
    
    console.log(`[set-fields] Successfully set all available fields for item: ${itemId}`);
  } catch (error: any) {
    console.error(`[set-fields] Error setting fields for item ${itemId}:`, error.message);
  }
}

// Function to update an existing project item
async function updateProjectItem(client: GraphQLClient, projectId: string, itemId: string, storyData: any): Promise<void> {
  console.log(`[update] Updating existing item: ${itemId}`);
  
  // Get project field IDs
  const fields = await getProjectFields(client, projectId);
  
  const updateItemTextMutation = gql`
    mutation($projectId: ID!, $fieldId: ID!, $itemId: ID!, $value: String!) {
      updateProjectV2ItemFieldValue(input: { projectId: $projectId, itemId: $itemId, fieldId: $fieldId, value: {text: $value} }) {
        projectV2Item {
          id
        }
      }
    }
  `;
  
  const updateItemSingleSelectMutation = gql`
    mutation($projectId: ID!, $fieldId: ID!, $itemId: ID!, $value: String!) {
      updateProjectV2ItemFieldValue(input: { projectId: $projectId, itemId: $itemId, fieldId: $fieldId, value: { singleSelectOptionId: $value } }) {
        projectV2Item {
          id
        }
      }
    }
  `;
  
  try {
    // Update title field
    const titleFieldNames = ['Title', 'Name', 'Summary'];
    const titleField = titleFieldNames.find(name => fields[name]);
    if (titleField && fields[titleField]) {
      console.log(`[update] Updating title using field "${titleField}" for item: ${itemId}`);
      await client.request(updateItemTextMutation, {
        projectId: projectId,
        itemId: itemId,
        fieldId: fields[titleField].id,
        value: storyData.title
      });
    } else {
      console.log(`[update] No title field found. Available fields: ${Object.keys(fields).join(', ')}`);
    }
    
    // Update description field
    const descriptionFieldNames = ['Description', 'Desc', 'Summary'];
    const descriptionField = descriptionFieldNames.find(name => fields[name]);
    if (descriptionField && fields[descriptionField]) {
      console.log(`[update] Updating description using field "${descriptionField}" for item: ${itemId}`);
      console.log(`[update] Description content length: ${storyData.description.length}`);
      await client.request(updateItemTextMutation, {
        projectId: projectId,
        itemId: itemId,
        fieldId: fields[descriptionField].id,
        value: storyData.description
      });
    } else {
      console.log(`[update] No description field found. Available fields: ${Object.keys(fields).join(', ')}`);
      console.log(`[update] To fully utilize this feature, please add a 'Description' custom field to your GitHub project.`);
    }
    
    // Update acceptance criteria field
    const acceptanceFieldNames = ['Acceptance Criteria', 'Acceptance', 'AC', 'Criteria'];
    const acceptanceField = acceptanceFieldNames.find(name => fields[name]);
    if (acceptanceField && fields[acceptanceField]) {
      console.log(`[update] Updating acceptance criteria using field "${acceptanceField}" for item: ${itemId}`);
      console.log(`[update] Acceptance criteria content length: ${storyData.acceptanceCriteria.length}`);
      await client.request(updateItemTextMutation, {
        projectId: projectId,
        itemId: itemId,
        fieldId: fields[acceptanceField].id,
        value: storyData.acceptanceCriteria
      });
    } else {
      console.log(`[update] No acceptance criteria field found. Available fields: ${Object.keys(fields).join(', ')}`);
      console.log(`[update] To fully utilize this feature, please add an 'Acceptance Criteria' custom field to your GitHub project.`);
    }
    
    // Update technical implementation/notes field
    const technicalFieldNames = ['Technical Notes', 'Technical Implementation', 'Technical Details', 'Implementation', 'Tech Notes'];
    const technicalField = technicalFieldNames.find(name => fields[name]);
    if (technicalField && fields[technicalField]) {
      console.log(`[update] Updating technical notes using field "${technicalField}" for item: ${itemId}`);
      console.log(`[update] Technical implementation content length: ${storyData.technicalImplementation.length}`);
      await client.request(updateItemTextMutation, {
        projectId: projectId,
        itemId: itemId,
        fieldId: fields[technicalField].id,
        value: storyData.technicalImplementation
      });
    } else {
      console.log(`[update] No technical field found. Available fields: ${Object.keys(fields).join(', ')}`);
      console.log(`[update] To fully utilize this feature, please add a 'Technical Implementation' custom field to your GitHub project.`);
    }
    
    // Update status field
    if (fields['Status'] && storyData.status) {
      const statusField = fields['Status'];
      const statusOption = statusField.options.find((option: any) => option.name.toLowerCase() === storyData.status.toLowerCase());
      
      if (statusOption) {
        console.log(`[update] Updating status to ${storyData.status} for item: ${itemId}`);
        await client.request(updateItemSingleSelectMutation, {
          projectId: projectId,
          itemId: itemId,
          fieldId: statusField.id,
          value: statusOption.id
        });
        console.log(`[update] Status updated to ${storyData.status} successfully`);
      } else {
        console.log(`[update] Status option ${storyData.status} not found for Status field`);
        console.log(`[update] Available options: ${JSON.stringify(statusField.options)}`);
      }
    } else if (fields['Status']) {
      // Default to "Backlog" if no status specified
      const statusField = fields['Status'];
      const backlogOption = statusField.options.find((option: any) => option.name === 'Backlog');
      
      if (backlogOption) {
        console.log(`[update] Updating status to Backlog for item: ${itemId}`);
        await client.request(updateItemSingleSelectMutation, {
          projectId: projectId,
          itemId: itemId,
          fieldId: statusField.id,
          value: backlogOption.id
        });
        console.log(`[update] Status updated to Backlog successfully`);
      } else {
        console.log(`[update] Backlog option not found for Status field`);
        console.log(`[update] Available options: ${JSON.stringify(statusField.options)}`);
      }
    } else {
      console.log(`[update] Status field not found in project`);
    }
    
    console.log(`[update] Successfully updated available fields for item: ${itemId}`);
  } catch (error: any) {
    console.error(`[update] Error updating project item ${itemId}:`, error.message);
  }
}

// Function to create a new project item
async function createProjectItem(client: GraphQLClient, projectId: string, storyData: any): Promise<string | null> {
  console.log(`[create] Creating new item with title: ${storyData.title}`);
  
  // First, create an issue to associate with the project item
  const createIssueMutation = gql`
    mutation($repositoryId: ID!, $title: String!, $body: String) {
      createIssue(input: { repositoryId: $repositoryId, title: $title, body: $body }) {
        issue {
          id
        }
      }
    }
  `;
  
  try {
    // Get repository ID first
    const repoInfoQuery = gql`
      query($owner: String!, $name: String!) {
        repository(owner: $owner, name: $name) {
          id
        }
      }
    `;
    
    const [owner, repo] = process.env.GITHUB_REPOSITORY?.split('/') || ['', ''];
    const repoInfo: any = await client.request(repoInfoQuery, { owner, name: repo });
    const repositoryId = repoInfo.repository.id;
    
    // Create an issue for the story
    const issueResponse: any = await client.request(createIssueMutation, {
      repositoryId: repositoryId,
      title: storyData.title,
      body: storyData.description
    });
    
    const issueId = issueResponse.createIssue.issue.id;
    console.log(`[create] Created issue with ID: ${issueId}`);
    
    // Now add the issue to the project
    const addProjectItemMutation = gql`
      mutation($projectId: ID!, $contentId: ID!) {
        addProjectV2ItemById(input: { projectId: $projectId, contentId: $contentId }) {
          item {
            id
          }
        }
      }
    `;
    
    const projectItemResponse: any = await client.request(addProjectItemMutation, {
      projectId: projectId,
      contentId: issueId
    });
    
    const newItemId = projectItemResponse.addProjectV2ItemById.item.id;
    console.log(`[create] Successfully created new project item with ID: ${newItemId}`);
    return newItemId;
  } catch (error: any) {
    console.error(`[create] Error creating project item:`, error.message);
    return null;
  }
}

// Main execution
async function main(): Promise<void> {
  console.log('[main] Starting main execution');
  const changedFilesRaw = process.env.CHANGED_FILES || '';
  console.log(`[main] CHANGED_FILES raw: "${changedFilesRaw}"`);
  const changedFiles = changedFilesRaw.split(' ').filter(Boolean);
  console.log(`[main] files count: ${changedFiles.length}`);
  const projectId = process.env.PROJECT_ID;
  console.log(`[main] projectId: ${projectId}`);
  
  if (!projectId) {
    console.error('[main] PROJECT_ID is not set');
    process.exit(1);
  }
  
  const client = new GraphQLClient('https://api.github.com/graphql', {
    headers: {
      authorization: `Bearer ${process.env.GITHUB_TOKEN}`
    }
  });
  
  for (const file of changedFiles) {
    if (file.endsWith('.md')) {
      try {
        console.log(`[main] Processing file: ${file}`);
        const storyData = parseStoryFile(file);
        console.log(`[main] Parsed story data:`);
        console.log(`[main] - Title: "${storyData.title}"`);
        console.log(`[main] - Story ID: "${storyData.storyId}"`);
        console.log(`[main] - Status: "${storyData.status}"`);
        console.log(`[main] - Description: ${storyData.description.length} characters`);
        console.log(`[main] - Acceptance Criteria: ${storyData.acceptanceCriteria.length} characters`);
        console.log(`[main] - Technical Implementation: ${storyData.technicalImplementation.length} characters`);
        
        // Validate that we have the essential content
        if (!storyData.title) {
          console.error(`[main] ERROR: No title found for file ${file}`);
        }
        if (!storyData.description) {
          console.error(`[main] ERROR: No description found for file ${file}`);
        }
        if (!storyData.acceptanceCriteria) {
          console.warn(`[main] WARNING: No acceptance criteria found for file ${file}`);
        }
        if (!storyData.technicalImplementation) {
          console.warn(`[main] WARNING: No technical implementation found for file ${file}`);
        }
        
        // Check if an item with this story ID already exists
        const existingItemId = await findExistingItem(client, projectId, storyData.storyId);
        
        if (existingItemId) {
          // Update existing item
          console.log(`[main] Updating existing item with ID: ${existingItemId}`);
          await updateProjectItem(client, projectId, existingItemId, storyData);
        } else {
          // Create new item
          console.log(`[main] Creating new item for story: ${storyData.title}`);
          const newItemId = await createProjectItem(client, projectId, storyData);
          if (newItemId) {
            console.log(`[main] Successfully created new item with ID: ${newItemId}`);
            await setItemFields(client, projectId, newItemId, storyData, storyData.storyId);
          } else {
            console.error(`[main] Failed to create new item for story: ${storyData.title}`);
          }
        }
      } catch (error: any) {
        console.error(`[main] Error processing ${file}:`, error.message);
        console.error(`[main] Error stack:`, error.stack);
      }
    }
  }
  
  console.log('[main] Finished processing all files');
}

main().then(() => {
  console.log('[main] Script execution completed successfully');
}).catch((error: any) => {
  console.error('[main] Script execution failed:', error.message);
  process.exit(1);
});