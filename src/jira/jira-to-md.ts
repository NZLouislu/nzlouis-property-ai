import dotenv from 'dotenv';
import path from 'path';
import { jiraToMd } from 'jira-md-sync';

dotenv.config();

async function main() {
  const args = process.argv.slice(2);
  const issueKey = args[0];
  
  // Output directory: where Jira exports go
  // Priority: JIRA_MD_OUTPUT_DIR > default (jira)
  const outputDirEnv = process.env.JIRA_MD_OUTPUT_DIR || 'jira';
  const outputDir = path.isAbsolute(outputDirEnv)
    ? outputDirEnv
    : path.resolve(process.cwd(), outputDirEnv);

  // Input directory: for preserving labels order
  const inputDirEnv = process.env.JIRA_MD_INPUT_DIR || 'jiramd';
  const inputDir = path.isAbsolute(inputDirEnv)
    ? inputDirEnv
    : path.resolve(process.cwd(), inputDirEnv);

  let jql = process.env.JIRA_JQL;
  
  // Export single issue if key provided
  if (issueKey && /^[A-Z]+-\d+$/.test(issueKey)) {
    jql = `key = ${issueKey}`;
    console.log(`📄 Exporting single issue: ${issueKey}`);
  } else {
    console.log(`📦 Exporting all issues from project`);
  }

  const result = await jiraToMd({
    jiraConfig: {
      jiraUrl: process.env.JIRA_URL!,
      email: process.env.JIRA_EMAIL!,
      apiToken: process.env.JIRA_API_TOKEN!,
      projectKey: process.env.JIRA_PROJECT_KEY!
    },
    outputDir,
    inputDir,  // For preserving labels order
    jql,
    logger: console
  });

  console.log(`✅ Exported ${result.written} files from ${result.totalIssues} issues`);
}

main().catch(console.error);