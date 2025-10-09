import * as dotenv from "dotenv";
import * as path from "path";
import { projectToMd } from "github-projects-md-sync";

const currentDir = process.cwd();
dotenv.config({ path: path.resolve(currentDir, ".env") });

async function run() {
  console.log("=== Sync GitHub Project to Markdown Files ===");
  const projectId = process.env.PROJECT_ID;
  const token = process.env.GITHUB_TOKEN;

  if (!projectId || !token) {
    console.log("Missing PROJECT_ID or GITHUB_TOKEN in .env file");
    process.exit(0);
  }

  const arg = process.argv[2];
  const customDir = arg && !arg.startsWith("-") ? path.resolve(currentDir, arg) : path.resolve(currentDir, "stories");

  const result: any = await projectToMd(projectId, token, customDir);

  if (result && typeof result === "object" && "result" in result && "logs" in result) {
    const { result: syncResult, logs } = result as any;
    console.log("\n--- Logs ---");
    logs.forEach((log: any) => {
      const message = log.args && log.args.length > 0 ? `${log.message} ${log.args.join(" ")}` : log.message;
      console.log(`[${log.level.toUpperCase()}] ${message}`);
    });
    console.log("------------\n");
    if (syncResult.success) {
      console.log("Project items synced to markdown files successfully!");
      console.log(`Processed ${syncResult.processedItems} items, created ${syncResult.createdFiles} files, updated ${syncResult.updatedFiles} files.`);
    } else {
      console.error("Failed to sync project to markdown.");
      if (syncResult.errors && syncResult.errors.length > 0) {
        console.error("\n--- Errors ---");
        syncResult.errors.forEach((error: any) => {
          const message = error.args && error.args.length > 0 ? `${error.message} ${error.args.join(" ")}` : error.message;
          console.error(`[${error.level.toUpperCase()}] ${message}`);
        });
        console.error("--------------\n");
      }
    }
  } else {
    console.log("\nProject items synced to markdown files successfully!");
  }
}

if (process.argv[1] && (process.argv[1].endsWith("project-to-md.ts") || process.argv[1].endsWith("project-to-md.js"))) {
  run().catch((error) => {
    console.error("An unexpected error occurred:", error);
    process.exit(1);
  });
}

export { run as syncProjectItemsToMarkdown };