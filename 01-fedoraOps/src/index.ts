import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { SERVER_CONFIG } from "./config.js";
import { registerTools } from "./tools/fedoraTools.js";

async function main(){
  const server = new McpServer({
    name: SERVER_CONFIG.name,
    version: SERVER_CONFIG.version,
    description: SERVER_CONFIG.description
  })

  registerTools(server)

  const transport = new StdioServerTransport
  await server.connect(transport)
}

main().catch((error) => {
  console.error("Fatal error in main():", error);
  process.exit(1);
});