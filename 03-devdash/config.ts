import * as path from "path";
import * as os from "os";

export const LOG_DIR = path.join(os.homedir(), "Desktop", "Dev", "Log");

export const SERVER_CONFIG = {
  name: "devLogs",
  version: "1.0.0",
  description: "A tool, Resources and prompts server for managing development logs",
};