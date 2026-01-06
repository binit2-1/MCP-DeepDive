import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { ALLOWED_ROOT } from "../config.js";
import * as fileService from "../services/fileService.js";
import * as systemService from "../services/systemService.js";

export function registerTools(server: McpServer){
    //TOOL1:List Directory
    server.registerTool(
        "list_dir",
        {
            description:"A tool to look into directory and see what files are in that directory",
            inputSchema: z.object({
                path: z.string().describe(`The path to the directory to list files from. Must be within ${ALLOWED_ROOT}`)
            }),
        },
        async({path}) => {
            return await fileService.listDir(path)
        }
    )
    //TOOL2: Read Last 10 Lines of a File
    server.registerTool(
        "read_file",
        {
            description: `Reads the last 10 lines of a file within the ${ALLOWED_ROOT}`,
            inputSchema: z.object({
                path: z.string().describe(`The path to the list to list files from. Must be within ${ALLOWED_ROOT}`)
            })
        },
        async({path})=>{
            return await fileService.readFile(path) 
        }
    )

    //TOOL3: System Stats
    server.registerTool(
        "system_stats",
        {
            description:"This tool fetches the current system stats",
        },
        async()=>{
            return await systemService.sysStats()
        }
    )
}