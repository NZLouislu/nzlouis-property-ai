import dotenv from 'dotenv';
import path from 'path';
import { mdToJira } from 'jira-md-sync';

dotenv.config();

async function main() {
  // Input directory: where you edit markdown files
  // Priority: JIRA_MD_INPUT_DIR > default (jiramd)
  const inputDirEnv = process.env.JIRA_MD_INPUT_DIR || 'jiramd';
  const inputDir = path.isAbsolute(inputDirEnv)
    ? inputDirEnv
    : path.resolve(process.cwd(), inputDirEnv);

  const result = await mdToJira({
    jiraConfig: {
      jiraUrl: process.env.JIRA_URL!,
      email: process.env.JIRA_EMAIL!,
      apiToken: process.env.JIRA_API_TOKEN!,
      projectKey: process.env.JIRA_PROJECT_KEY!,
      issueTypeId: process.env.JIRA_ISSUE_TYPE_ID
    },
    inputDir,
    dryRun: false,  // Set to true to preview without creating issues
    logger: console
  });

  console.log(`✅ Created: ${result.created}`);
  console.log(`⏭️  Skipped: ${result.skipped}`);
  
  if (result.errors.length > 0) {
    console.error('❌ Errors:', result.errors);
    process.exit(1);
  }
}

main().catch(console.error);