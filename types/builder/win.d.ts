/**
 * Get the finalized array of command line arguments
 * @param {string} target - hostname or ip address
 * @param {import('../index').PingConfig} [config] - Configuration object for cmd line argument
 * @return {string[]} - Command line argument according to the configuration
 */
export function getCommandArguments(target: string, config?: import("../index").PingConfig): string[];
/**
 * @typedef {Object} WindowsSpawnOptions
 * @property {boolean} windowsHide - Hide the subprocess console window that would normally be created on Windows
 * systems
 */
/**
 * Compute an option object for child_process.spawn
 * @return {WindowsSpawnOptions} - Options object for child_process.spawn on Windows
 */
export function getSpawnOptions(): WindowsSpawnOptions;
export type WindowsSpawnOptions = {
    /**
     * - Hide the subprocess console window that would normally be created on Windows
     * systems
     */
    windowsHide: boolean;
};
//# sourceMappingURL=win.d.ts.map