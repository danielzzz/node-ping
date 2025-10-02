/**
 * Get the finalized array of command line arguments
 * @param {string} target - hostname or ip address
 * @param {import('../index').PingConfig} [config] - Configuration object for cmd line argument
 * @return {string[]} - Command line argument according to the configuration
 */
export function getCommandArguments(target: string, config?: import("../index").PingConfig): string[];
/**
 * @typedef {Object} LinuxSpawnOptions
 * @property {boolean} shell - Whether to run command inside of a shell
 * @property {Object} env - Environment key-value pairs with LANG set to 'C'
 */
/**
 * Compute an option object for child_process.spawn
 * @return {LinuxSpawnOptions} - Options object for child_process.spawn on Linux
 */
export function getSpawnOptions(): LinuxSpawnOptions;
export type LinuxSpawnOptions = {
    /**
     * - Whether to run command inside of a shell
     */
    shell: boolean;
    /**
     * - Environment key-value pairs with LANG set to 'C'
     */
    env: any;
};
//# sourceMappingURL=linux.d.ts.map