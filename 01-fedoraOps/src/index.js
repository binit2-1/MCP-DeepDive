"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var mcp_js_1 = require("@modelcontextprotocol/sdk/server/mcp.js");
var stdio_js_1 = require("@modelcontextprotocol/sdk/server/stdio.js");
var zod_1 = require("zod");
var fs = require("fs/promises");
var os = require("os");
var path = require("path");
var server = new mcp_js_1.McpServer({
    name: "FedoraOps",
    version: "1.0.0",
    description: "A tool server for Fedora system operations and general utilities",
});
var ALLOWED_ROOT = path.join(os.homedir(), "Desktop");
//read directory, files
server.registerTool("list_dir", {
    description: "A tool to look into directory and see what files are in that directory",
    inputSchema: zod_1.z.object({
        path: zod_1.z
            .string()
            .describe("The path to the directory to list files from. Must be within ".concat(ALLOWED_ROOT)),
    }),
}, function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
    var files, formatted, error_1;
    var path = _b.path;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                if (!path.startsWith(ALLOWED_ROOT)) {
                    return [2 /*return*/, {
                            content: [
                                {
                                    type: "text",
                                    text: "ERR: Access denied, only paths starting from ".concat(ALLOWED_ROOT, " is allowed to scrape"),
                                },
                            ],
                        }];
                }
                _c.label = 1;
            case 1:
                _c.trys.push([1, 3, , 4]);
                return [4 /*yield*/, fs.readdir(path, { withFileTypes: true })];
            case 2:
                files = _c.sent();
                formatted = files
                    .map(function (f) { return (f.isDirectory() ? "[DIR] ".concat(f.name) : f.name); })
                    .join("\n");
                return [2 /*return*/, {
                        content: [
                            {
                                type: "text",
                                text: "Files in ".concat(path, ":\n").concat(formatted),
                            },
                        ],
                    }];
            case 3:
                error_1 = _c.sent();
                if (error_1 instanceof Error) {
                    return [2 /*return*/, {
                            content: [
                                {
                                    type: "text",
                                    text: "".concat(error_1.message, " "),
                                },
                            ],
                        }];
                }
                return [2 /*return*/, {
                        content: [
                            {
                                type: "text",
                                text: "ERR: Fatal Error, ".concat(error_1),
                            },
                        ],
                    }];
            case 4: return [2 /*return*/];
        }
    });
}); });
//os and system analytics
server.registerTool("system_stats", {
    description: "This tool fetches the current system stats",
}, function () { return __awaiter(void 0, void 0, void 0, function () {
    var cpus, totalMem, freeMem, stats;
    var _a;
    return __generator(this, function (_b) {
        try {
            cpus = os.cpus();
            totalMem = os.totalmem() / (1024 * 1024 * 1024);
            freeMem = os.freemem() / (1024 * 1024 * 1024);
            stats = "\n            SYSTEM STATS:\n            -OS: ".concat(os.type(), " ").concat(os.release(), "\n            -CPU: ").concat((_a = cpus[0]) === null || _a === void 0 ? void 0 : _a.model, " (").concat(cpus.length, " cores)\n            -MEMORY: ").concat(freeMem.toFixed(2), " GB free / ").concat(totalMem.toFixed(2), " GB total ");
            return [2 /*return*/, {
                    content: [
                        {
                            type: "text",
                            text: stats,
                        },
                    ],
                }];
        }
        catch (error) {
            if (error instanceof Error) {
                return [2 /*return*/, {
                        content: [
                            {
                                type: "text",
                                text: "".concat(error.message),
                            },
                        ],
                    }];
            }
            return [2 /*return*/, {
                    content: [
                        {
                            type: "text",
                            text: "ERR: ".concat(error),
                        },
                    ],
                }];
        }
        return [2 /*return*/];
    });
}); });
//read last 10 lines of a file
server.registerTool("read_file", {
    description: "Reads the last 10 lines of a file within the ".concat(ALLOWED_ROOT),
    inputSchema: zod_1.z.object({
        path: zod_1.z
            .string()
            .describe("The path to the list to list files from. Must be within ".concat(ALLOWED_ROOT)),
    }),
}, function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
    var content, lines, lastTen, error_2;
    var path = _b.path;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                if (!path.startsWith(ALLOWED_ROOT)) {
                    return [2 /*return*/, {
                            content: [
                                {
                                    type: "text",
                                    text: "ERR: Access Denied, path should be within ".concat(ALLOWED_ROOT),
                                },
                            ],
                        }];
                }
                _c.label = 1;
            case 1:
                _c.trys.push([1, 3, , 4]);
                return [4 /*yield*/, fs.readFile(path, "utf8")];
            case 2:
                content = _c.sent();
                lines = content.split("\n");
                lastTen = lines.slice(-10).join("\n");
                return [2 /*return*/, {
                        content: [
                            {
                                type: "text",
                                text: "last 10 lines of ".concat(path, ": \n ").concat(lastTen),
                            },
                        ],
                    }];
            case 3:
                error_2 = _c.sent();
                if (error_2 instanceof Error) {
                    return [2 /*return*/, {
                            content: [
                                {
                                    type: "text",
                                    text: "".concat(error_2.message),
                                },
                            ],
                        }];
                }
                return [2 /*return*/, {
                        content: [
                            {
                                type: "text",
                                text: "ERR: ".concat(error_2),
                            },
                        ],
                    }];
            case 4: return [2 /*return*/];
        }
    });
}); });
var transport = new stdio_js_1.StdioServerTransport();
server.connect(transport);
