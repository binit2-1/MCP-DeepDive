import * as os from "os";
import type { CallToolResult } from "@modelcontextprotocol/sdk/types.js";

export async function sysStats(): Promise<CallToolResult> {
  try {
    const cpus: os.CpuInfo[] = os.cpus();
    const totalMem = os.totalmem() / (1024 * 1024 * 1024);
    const freeMem = os.freemem() / (1024 * 1024 * 1024);

    const stats: string = `
                SYSTEM STATS:
                -OS: ${os.type()} ${os.release()}
                -CPU: ${cpus[0]?.model} (${cpus.length} cores)
                -MEMORY: ${freeMem.toFixed(2)} GB free / ${totalMem.toFixed(
      2
    )} GB total `;

    return {
      content: [
        {
          type: "text",
          text: stats,
        },
      ],
    };
  } catch (error) {
    if (error instanceof Error) {
      return {
        content: [
          {
            type: "text",
            text: `${error.message}`,
          },
        ],
      };
    }
    return {
      content: [
        {
          type: "text",
          text: `ERR: ${error}`,
        },
      ],
    };
  }
}

