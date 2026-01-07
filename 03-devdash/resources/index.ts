import {
  McpServer,
  ResourceTemplate,
} from "@modelcontextprotocol/sdk/server/mcp.js";
import * as logServices from "../services/logServices.js";
import { ReadResourceResult } from "@modelcontextprotocol/sdk/types.js";

export function registerResources(server: McpServer) {
  server.registerResource(
    "read_log",
    new ResourceTemplate("log://{date}", { list: undefined }),
    {
      mimeType: "text/markdown",
    },
    async (uri, variables): Promise<ReadResourceResult> => {
      const date = variables.date;

      if (typeof date !== "string") {
        throw new Error("Missing or invalid 'date' parameter in URI");
      }

      const content = await logServices.readLog(date);
      return {
        contents: [
          {
            uri: uri.href,
            mimeType: "text/markdown",
            text: content,
          },
        ],
      };
    }
  );
}
