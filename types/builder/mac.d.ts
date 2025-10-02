/**
 * Get the finalized array of command line arguments
 * @param {string} target - hostname or ip address
 * @param {import('../index').PingConfig} [config] - Configuration object for cmd line argument
 * @return {string[]} - Command line argument according to the configuration
 * @throws {Error} If there are errors on building arguments with given inputs
 */
export function getCommandArguments(target: string, config?: import("../index").PingConfig): string[];
/**
 * Compute an option object for child_process.spawn
 * @return {{}}
 */
export function getSpawnOptions(): {};
//# sourceMappingURL=mac.d.ts.map