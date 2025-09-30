/**
 * Callback after probing given host
 */
export type probeCallback = (isAlive: boolean, error: Error | null) => any;
/**
 * @module ping/ping-sys
 */
/**
 * Callback after probing given host
 * @callback probeCallback
 * @param {boolean} isAlive - Whether target is alive or not
 * @param {Error|null} error - Error object if error occurs, null otherwise
 */
/**
 * Probe a host using ping command with callback interface
 * @param {string} addr - Hostname or ip address
 * @param {probeCallback} cb - Callback
 * @param {import('./index').PingConfig} [config] - Configuration for command ping
 * @return {Promise} Promise from the underlying ping operation
 */
export function probe(addr: string, cb: probeCallback, config?: import("./index").PingConfig): Promise<any>;
//# sourceMappingURL=ping-sys.d.ts.map