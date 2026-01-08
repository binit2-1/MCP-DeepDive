import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { SERVER_CONFIG } from "./config.js";
import { registerResources } from "./resources/index.js";
import { registerPromptResources } from "./prompts/index.js";
import { registerTool } from "./tools/index.js";
import express from "express"
import cors from "cors"
import { SSEServerTransport } from "@modelcontextprotocol/sdk/server/sse.js";

async function main(){
  const app = express()
  app.use(cors({
    origin: "*", 
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "mcp-protocol-version"],
  }))


  const server = new McpServer({
    name: SERVER_CONFIG.name,
    version: SERVER_CONFIG.version,
    description: SERVER_CONFIG.description
  })

  registerResources(server)
  registerPromptResources(server)
  registerTool(server)

  let transport: SSEServerTransport| null=null
  app.get("/sse", async(req, res)=>{
    console.log("--> Client connected via SSE");
    transport = new SSEServerTransport("/message", res);
    await server.connect(transport)
    req.on("close", () => {
      console.log("X-- Client disconnected");
      server.close(); 
    });
  })
  app.post('/message', async(req, res)=>{
    if(!transport){
      res.sendStatus(500);
      return;
    }
    await transport.handlePostMessage(req, res)
  })
  
  app.listen(3001, () => {
    console.log("🌐 DevDash Server running on http://localhost:3001/sse");
  });
}




main().catch((error) => {
  console.error("Fatal error in main():", error);
  (globalThis as any).process?.exit?.(1);
});