export = LinuxParser;
/**
 * @module ping/parser/linux
 */
/**
 * @class LinuxParser
 * @param {string} addr - Hostname or ip addres
 * @param {import('../index').PingConfig} config - Config object in probe()
 */
declare function LinuxParser(addr: string, config: import("../index").PingConfig): void;
declare class LinuxParser {
    /**
     * @module ping/parser/linux
     */
    /**
     * @class LinuxParser
     * @param {string} addr - Hostname or ip addres
     * @param {import('../index').PingConfig} config - Config object in probe()
     */
    constructor(addr: string, config: import("../index").PingConfig);
    /**
     * Process output's body
     * @param {string} line - A line from system ping
     */
    _processHeader(line: string): void;
    /**
     * Process output's body
     * @param {string} line - A line from system ping
     */
    _processBody(line: string): void;
    /**
     * Process output's footer
     * @param {string} line - A line from system ping
     */
    _processFooter(line: string): void;
}
//# sourceMappingURL=linux.d.ts.map