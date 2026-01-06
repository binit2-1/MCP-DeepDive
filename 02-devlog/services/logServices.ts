import * as fs from "fs/promises";
import * as path from "path";
import * as os from "os";
import { LOG_DIR } from "../config";

export async function ensureDir() {
    await fs.mkdir(LOG_DIR, {recursive:true});
}

export async function readLog(date:string): Promise<string> {
    await ensureDir();
    const filePath = path.join(LOG_DIR, `${date}.md`)
    try{
        return await fs.readFile(filePath, 'utf8');
    } catch{
        return "No logs Available";
    }
}

export async function appendLog(entry:string) {
    await ensureDir();
    const date = new Date().toISOString().split('T')[0]
    const filePath = path.join(LOG_DIR, `${date}.md`)
    const timestamp = new Date().toLocaleString();
    await fs.appendFile(filePath, `[${timestamp}] ${entry}\n`)
}

