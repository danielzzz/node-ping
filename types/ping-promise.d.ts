/**
 * Probe a host using ping command
 * @param {string} addr - Hostname or ip address
 * @param {import('./index').PingConfig} [config] - Configuration for command ping
 * @return {Promise<import('./parser/base').PingResponse>}
 */
export function probe(addr: string, config?: import("./index").PingConfig): Promise<import("./parser/base").PingResponse>;
//# sourceMappingURL=ping-promise.d.ts.map