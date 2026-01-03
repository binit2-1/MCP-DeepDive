import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import fs from "fs/promises";
import os from "os";
import path from "path";

const server = new McpServer({
  name: "FedoraOps",
  version: "1.0.0",
  description:
    "A tool server for Fedora system operations and general utilities",
});

const ALLOWED_ROOT = path.join(os.homedir(), "Desktop");

server.registerTool(
  "list_dir",
  {
    description:
      "A tool to look into directory and see what files are in that directory",
    inputSchema: z.object({
      path: z
        .string()
        .describe(
          `The path to the directory to list files from. Must be within ${ALLOWED_ROOT}`
        ),
    }),
  },
  async ({ path: dirPath }) => {
    if (!dirPath.startsWith(ALLOWED_ROOT)) {
      return {
        content: [
          {
            type: "text",
            text: `ERR: Access denied, only paths starting from ${ALLOWED_ROOT} is allowed to scrape`,
          },
        ],
      };
    }
    try {
      const files = await fs.readdir(dirPath, { withFileTypes: true });
      const formatted = files
        .map((f) => (f.isDirectory() ? `[DIR] ${f.name}` : f.name))
        .join("\n");
      return {
        content: [
          {
            type: "text",
            text: `Files in ${dirPath}:\n${formatted}`,
          },
        ],
      };
    } catch (error) {
      if (error instanceof Error) {
        return {
          content: [
            {
              type: "text",
              text: `ERR: Recieved a fatal error ${error.message} cause ${error.cause}`,
            },
          ],
        };
      }
      return {
        content: [
          {
            type: "text",
            text: `ERR: Fatal Error, ${error}`,
          },
        ],
      };
    }
  }
);


const transport = new StdioServerTransport()
server.connect(transport)