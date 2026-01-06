import * as fs from "fs/promises";
import { ALLOWED_ROOT } from "../config.js";
import type { CallToolResult } from "@modelcontextprotocol/sdk/types.js";

export async function listDir(path: string): Promise<CallToolResult> {
//   if (!path.startsWith(ALLOWED_ROOT)) {
//     return {
//       content: [
//         {
//           type: "text",
//           text: `ERR: Access denied, only paths starting from ${ALLOWED_ROOT} is allowed to scrape`,
//         },
//       ],
//     };
//   }
  try {
    const files = await fs.readdir(path, { withFileTypes: true });
    const formatted = files
      .map((f) => (f.isDirectory() ? `[DIR] ${f.name}` : f.name))
      .join("\n");
    return {
      content: [
        {
          type: "text",
          text: formatted,
        },
      ],
    };
  } catch (error) {
    if (error instanceof Error) {
      return {
        content: [
          {
            type: "text",
            text: error.message,
          },
        ],
      };
    }
    return {
      content: [
        {
          type: "text",
          text: `${error}`,
        },
      ],
    };
  }
}

export async function readFile(path: string): Promise<CallToolResult> {
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
