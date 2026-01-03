import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
const server = new McpServer({
    name: "FedoraOps",
    version: "1.0.0",
    description: "A tool server for Fedora system operations and general utilities"
});
server.registerTool("add_numbers", {
    description: 'Adds two number which are given as inputs',
    inputSchema: z.object({
        a: z.number().describe("First input number"),
        b: z.number().describe("Second input number")
    })
}, async ({ a, b }) => {
    return {
        content: [{
                type: 'text',
                text: String(a + b)
            }]
    };
});
async function main() {
    const transport = new StdioServerTransport();
    await server.connect(transport);
    console.error("Fedora Ops Server running on stdio...");
}
main().catch((error) => {
    console.error("Fatal error in main():", error);
    process.exit(1);
});
//# sourceMappingURL=index.js.map