import * as dotenv from "dotenv";
import * as path from "path";
import { fileURLToPath } from "url";
import { mdToProject } from "github-projects-md-sync";

// Use process.cwd() as the base directory
// This works for both Jest tests and runtime execution
const currentDir = process.cwd();

// Load environment variables from the root .env file.
dotenv.config({ path: path.resolve(currentDir, ".env") });

async function run() {
  console.log("=== Sync Markdown Files to GitHub Project ===");
  const mdDir = path.join(currentDir, "../stories");
  const projectId = process.env.PROJECT_ID;
  const token = process.env.GITHUB_TOKEN;

  if (!projectId || !token) {
    console.log("Missing PROJECT_ID or GITHUB_TOKEN in .env file");
    process.exit(0);
  }

  const result: any = await mdToProject(projectId, token, mdDir);
  
  // Check if the result has the expected structure with logs
  if (result && typeof result === 'object' && 'result' in result && 'logs' in result) {
    const { result: syncResult, logs } = result as any;
    
    console.log("\n--- Logs ---");
    logs.forEach((log: any) => {
      const message = log.args && log.args.length > 0 ? `${log.message} ${log.args.join(' ')}` : log.message;
      console.log(`[${log.level.toUpperCase()}] ${message}`);
    });
    console.log("------------\n");

    if (syncResult.success) {
      console.log("Successfully synced markdown directory!");
      console.log(`Processed ${syncResult.processedFiles} files (${syncResult.storyCount} stories, ${syncResult.todoCount} todo lists).`);
    } else {
      console.error("Failed to sync markdown directory.");
      if (syncResult.errors && syncResult.errors.length > 0) {
        console.error("\n--- Errors ---");
        syncResult.errors.forEach((error: any) => {
          const message = error.args && error.args.length > 0 ? `${error.message} ${error.args.join(' ')}` : error.message;
          console.error(`[${error.level.toUpperCase()}] ${message}`);
        });
        console.error("--------------\n");
      }
    }
  } else {
    // Fallback for simple void return
    console.log("\nSuccessfully synced markdown directory!");
  }
}

// Check if the script is the main module.
if (process.argv[1] && (process.argv[1].endsWith('md-to-project.ts') || process.argv[1].endsWith('md-to-project.js'))) {
  run().catch((error) => {
    console.error("An unexpected error occurred:", error);
    process.exit(1);
  });
}

export { run as syncMarkdownFilesToProject };
