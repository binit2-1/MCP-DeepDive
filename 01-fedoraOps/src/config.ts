import * as os from "os";
import * as path from "path";

export const ALLOWED_ROOT = path.join(os.homedir(), "Desktop");

export const SERVER_CONFIG = {
  name: "FedoraOps",
  version: "1.0.0",
  description: "A tool server for Fedora system operations and general utilities",
};