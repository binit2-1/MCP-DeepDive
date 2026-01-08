import { useEffect, useState } from 'react';
import { createMcpClient } from './mcpClient';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';

function App() {
  const [client, setClient] = useState<Client | null>(null);
  const [status, setStatus] = useState("Connecting...");
  const [output, setOutput] = useState("");

  // 1. Initialize Connection on Load
  useEffect(() => {
    createMcpClient()
      .then((c) => {
        setClient(c);
        setStatus("Connected ✅");
      })
      .catch((err) => {
        console.error(err);
        setStatus("Connection Failed ❌");
      });
  }, []);

  // 2. Function to Run the "Standup" Prompt
  const generateStandup = async () => {
    if (!client) return;
    setStatus("Generating Standup...");
    
    try {
      // Call the Prompt we defined in the server
      const result = await client.getPrompt({ 
        name: "standup-summary" 
      });

      // The result contains messages. We want the text content.
      // Usually it's the first message's text.
      const text = result.messages[0].content;
      
      // If it's a resource (embedded), we might need to look deeper, 
      // but let's dump the raw JSON first to see what we get.
      setOutput(JSON.stringify(result, null, 2));
      setStatus("Done!");
    } catch (e: any) {
      setOutput("Error: " + e.message);
    }
  };

  return (
    <div className="container">
      <h1>🚀 DevDash</h1>
      <p>Status: <strong>{status}</strong></p>

      <div style={{ marginTop: '20px' }}>
        <button onClick={generateStandup} disabled={!client}>
          📝 Generate Yesterday's Standup
        </button>
      </div>

      <h3>Output:</h3>
      <pre>{output || "Click the button to fetch data..."}</pre>
    </div>
  );
}

export default App;