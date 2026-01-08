import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { SSEClientTransport } from "@modelcontextprotocol/sdk/client/sse.js";

export async function createMcpClient() {
  // 1. Define the Transport
  // Point to your Express server's SSE endpoint
  const transport = new SSEClientTransport(
    new URL("http://127.0.0.1:3001/sse"),
  );

  // 2. Create the Client
  const client = new Client(
    {
      name: "devdash-client",
      version: "1.0.0",
    },
    {
      capabilities: {
        
      },
    }
  );

  // 3. Connect!
  await client.connect(transport);
  
  return client;
}