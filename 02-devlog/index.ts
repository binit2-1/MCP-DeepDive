import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { SERVER_CONFIG } from "./config.js";
import { registerResources } from "./resources/index.js";

async function main(){
  const server = new McpServer({
    name: SERVER_CONFIG.name,
    version: SERVER_CONFIG.version,
    description: SERVER_CONFIG.description
  })

  registerResources(server)

  const transport = new StdioServerTransport
  await server.connect(transport)
}

main().catch((error) => {
  console.error("Fatal error in main():", error);
  (globalThis as any).process?.exit?.(1);
});