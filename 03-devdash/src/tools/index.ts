import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import * as logServices from "../services/logServices.js"

export function registerTool(server: McpServer){
    server.registerTool(
        "append_log",
        {
            description: "Appends a new entry to today's developer log",
            inputSchema:z.object({
                entry: z.string().describe("The text content to add to the log. Should be a single line or short paragraph."),
                category: z.enum(["update", "bug", "learning", "idea"]).default("update").describe("The type of log entry")
            })
        },
        async({entry, category}) => {
            try{
                const formattedEntry = `[${category.toUpperCase()}] ${entry}`

                await logServices.appendLog(formattedEntry)

                return{
                    content:[
                        {
                            type: 'text',
                            text: `Successfully appended to log: "${formattedEntry}"`
                        }
                    ]
                }
            } catch(error){
                if (error instanceof Error){
                    return{
                        content:[
                            {
                                type:"text",
                                text: error.message
                            }
                        ]
                    }
                }
                return{
                    content:[
                        {
                            type: "text",
                            text: `${error}`
                        }
                    ]
                }
            }
        } 
    )
}