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

//read directory, files
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
  async ({ path }) => {
    if (!path.startsWith(ALLOWED_ROOT)) {
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
      const files = await fs.readdir(path, { withFileTypes: true });
      const formatted = files
        .map((f) => (f.isDirectory() ? `[DIR] ${f.name}` : f.name))
        .join("\n");
      return {
        content: [
          {
            type: "text",
            text: `Files in ${path}:\n${formatted}`,
          },
        ],
      };
    } catch (error) {
      if (error instanceof Error) {
        return {
          content: [
            {
              type: "text",
              text: `${error.message} `,
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

//os and system analytics
server.registerTool(
  "system_stats",
  {
    description: "This tool fetches the current system stats",
  },
  async () => {
    try {
      const cpus: os.CpuInfo[] = os.cpus();
      const totalMem = os.totalmem() / (1024 * 1024 * 1024);
      const freeMem = os.freemem() / (1024 * 1024 * 1024);

      const stats: string = `
            SYSTEM STATS:
            -OS: ${os.type()} ${os.release()}
            -CPU: ${cpus[0]?.model} (${cpus.length} cores)
            -MEMORY: ${freeMem.toFixed(2)} GB free / ${totalMem.toFixed(
        2
      )} GB total `;

      return {
        content: [
          {
            type: "text",
            text: stats,
          },
        ],
      };
    } catch (error) {
      if (error instanceof Error) {
        return {
          content: [
            {
              type: "text",
              text: `${error.message}`,
            },
          ],
        };
      }
      return {
        content: [
          {
            type: "text",
            text: `ERR: ${error}`,
          },
        ],
      };
    }
  }
);

server.registerTool(
  "read_file",
  {
    description: `Reads the last 10 lines of a file within the ${ALLOWED_ROOT}`,
    inputSchema: z.object({
      path: z
        .string()
        .describe(
          `The path to the list to list files from. Must be within ${ALLOWED_ROOT}`
        ),
    }),
  },
  async ({ path }) => {
    if (!path.startsWith(ALLOWED_ROOT)) {
      return {
        content: [
          {
            type: "text",
            text: `ERR: Access Denied, path should be within ${ALLOWED_ROOT}`,
          },
        ],
      };
    }
    try {
      const content = await fs.readFile(path, "utf8");
      const lines = content.split("\n");
      const lastTen = lines.slice(-10).join("\n");

      return {
        content: [
          {
            type: "text",
            text: `last 10 lines of ${path}: \n ${lastTen}`,
          },
        ],
      };
    } catch (error) {
      if (error instanceof Error) {
        return {
          content: [
            {
              type: "text",
              text: `${error.message}`,
            },
          ],
        };
      }
      return {
        content: [
          {
            type: "text",
            text: `ERR: ${error}`,
          },
        ],
      };
    }
  }
);

const transport = new StdioServerTransport();
server.connect(transport);
