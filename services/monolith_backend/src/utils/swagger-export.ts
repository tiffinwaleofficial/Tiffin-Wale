/**
 * Swagger JSON Export Utility
 *
 * Fetches Swagger JSON from running backend and saves it to public/swagger.json
 * Assumes backend is already running
 */

import { writeFileSync, existsSync, mkdirSync } from "fs";
import { join } from "path";

// Get the project root directory
// When run with Bun, process.cwd() will be the backend directory
const projectRoot = process.cwd();
const publicDir = join(projectRoot, "public");
const swaggerJsonPath = join(publicDir, "swagger.json");

interface SwaggerExportOptions {
  baseUrl?: string;
  apiPrefix?: string;
  outputPath?: string;
}

/**
 * Export Swagger JSON from running backend
 * @param options Configuration options
 */
export async function exportSwagger(
  options: SwaggerExportOptions = {},
): Promise<void> {
  const {
    baseUrl = process.env.BACKEND_URL || "http://localhost:8080",
    apiPrefix = process.env.API_PREFIX || "api",
    outputPath = swaggerJsonPath,
  } = options;

  try {
    console.log("🔄 Fetching Swagger JSON from backend...");
    console.log(`📍 URL: ${baseUrl}/${apiPrefix}-docs-json`);

    // Fetch Swagger JSON from running backend
    const response = await fetch(`${baseUrl}/${apiPrefix}-docs-json`);

    if (!response.ok) {
      throw new Error(
        `Failed to fetch Swagger JSON: ${response.status} ${response.statusText}\n` +
          `Make sure the backend is running at ${baseUrl}`,
      );
    }

    const swaggerJson = await response.json();

    // Ensure public directory exists
    if (!existsSync(publicDir)) {
      console.log("📁 Creating public directory...");
      mkdirSync(publicDir, { recursive: true });
    }

    // Check if file exists and overwrite
    if (existsSync(outputPath)) {
      console.log("⚠️  Existing swagger.json found, overwriting...");
    }

    // Write Swagger JSON to file
    writeFileSync(outputPath, JSON.stringify(swaggerJson, null, 2), "utf-8");

    console.log("✅ Swagger JSON exported successfully!");
    console.log(`📄 Saved to: ${outputPath}`);
    console.log(
      `📊 Total endpoints: ${Object.keys(swaggerJson.paths || {}).length}`,
    );
  } catch (error) {
    console.error("❌ Error exporting Swagger JSON:", error);
    throw error;
  }
}

/**
 * CLI entry point for Bun
 * Run with: bun run src/utils/swagger-export.ts
 */
// Check if this file is being run directly
const isMainModule =
  process.argv[1]?.endsWith("swagger-export.ts") ||
  process.argv[1]?.includes("swagger-export");

if (isMainModule) {
  exportSwagger()
    .then(() => {
      process.exit(0);
    })
    .catch((error) => {
      console.error("Failed to export Swagger JSON:", error.message);
      process.exit(1);
    });
}
