/**
 * Check out linux platform
 * @param {string} p - Platform name to check
 * @return {boolean} - True if platform is Linux-based, false otherwise
 */
export function isLinux(p: string): boolean;
/**
 * Check out macos platform
 * @param {string} p - Platform name to check
 * @return {boolean} - True if platform is macos-based, false otherwise
 */
export function isMacOS(p: string): boolean;
/**
 * Check out window platform
 * @param {string} p - Platform name to check
 * @return {boolean} - True if platform is window-based, false otherwise
 */
export function isWindow(p: string): boolean;
/**
 * Check whether given platform is supported
 * @param {string} p - Name of the platform
 * @return {boolean} - True or False
 */
export function isPlatformSupport(p: string): boolean;
/**
 * Return a path to the ping executable in the system
 * @param {string} platform - Name of the platform
 * @param {boolean} v6 - Ping via ipv6 or not
 * @return {string} - Executable path for system command ping
 * @throws {Error} if given platform is not supported
 */
export function getExecutablePath(platform: string, v6: boolean): string;
/**
 * @typedef {typeof linuxBuilder} LinuxBuilder
 * @typedef {typeof winBuilder} WindowsBuilder
 * @typedef {typeof macBuilder} MacBuilder
 */
/**
 * Create a builder
 * @param {string} platform - Name of the platform
 * @return {LinuxBuilder|WindowsBuilder|MacBuilder} - Argument builder
 * @throws {Error} if given platform is not supported
 */
export function createBuilder(platform: string): LinuxBuilder | WindowsBuilder | MacBuilder;
export type LinuxBuilder = typeof linuxBuilder;
export type WindowsBuilder = typeof winBuilder;
export type MacBuilder = typeof macBuilder;
import linuxBuilder = require("./linux");
import winBuilder = require("./win");
import macBuilder = require("./mac");
//# sourceMappingURL=factory.d.ts.map