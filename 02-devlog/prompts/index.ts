import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { GetPromptResult } from "@modelcontextprotocol/sdk/types.js";

export function registerPromptResources(server: McpServer) {
  server.registerPrompt(
    "standup-summary",
    {
      description:
        "Generates a standup update based on the previous day's logs",
    },

    async (params) => {
      const date = new Date();
      date.setDate(date.getDate() - 1);
      const dateStr = date.toISOString().split("T")[0];

      return {
        messages: [
          {
            role: "user",
            content: {
              type: "text",
              text: `Here is my developer log from yesterday (${dateStr}). Please convert this into a bullet-point standup summary for my team.`,
            },
          },
          {
            role: "user",
            content:{
                type: "resource",
                resource:{
                    uri: `log://${dateStr}`,
                    mimeType:'text/markdown',
                    text: ""
                }
            }
          }
        ],
      };
    },
    
  );
}
