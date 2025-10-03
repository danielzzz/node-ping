/**
 * Callback after probing given host
 */
export type probeCallback = (response: import("./parser/base").PingResponse, error: Error | null) => any;
/**
 * @module ping/ping-sys
 */
/**
 * Callback after probing given host
 * @callback probeCallback
 * @param {import('./parser/base').PingResponse} response - Ping response object
 * @param {Error|null} error - Error object if error occurs, null otherwise
 */
/**
 * Probe a host using ping command with callback interface
 * @param {string} addr - Hostname or ip address
 * @param {probeCallback} cb - Callback
 * @param {import('./index').PingConfig} [config] - Configuration for command ping
 * @return {Promise<import('./parser/base').PingResponse>} Promise from the underlying ping operation
 */
export function probe(addr: string, cb: probeCallback, config?: import("./index").PingConfig): Promise<import("./parser/base").PingResponse>;
//# sourceMappingURL=ping-sys.d.ts.map