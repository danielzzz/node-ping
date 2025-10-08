/**
 * @typedef {typeof import('./linux')} LinuxParser
 * @typedef {typeof import('./win')} WinParser
 * @typedef {typeof import('./mac')} MacParser
 */
/**
 * Create a parser for a given platform
 * @param {string} addr - Hostname or ip address
 * @param {string} platform - Name of the platform
 * @param {PingConfig} [config] - Config object in probe()
 * @return {LinuxParserClass|WinParserClass|MacParserClass} - Parser
 * @throws {Error} If given platform is not supported
 */
export function createParser(addr: string, platform: string, config?: PingConfig): LinuxParserClass | WinParserClass | MacParserClass;
export type LinuxParser = typeof import("./linux");
export type WinParser = typeof import("./win");
export type MacParser = typeof import("./mac");
import LinuxParserClass = require("./linux");
import WinParserClass = require("./win");
import MacParserClass = require("./mac");
//# sourceMappingURL=factory.d.ts.map