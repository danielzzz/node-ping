export var sys: typeof import("./ping-sys");
export var promise: typeof import("./ping-promise");
/**
 * Cross platform config representation
 */
export type PingConfig = {
    /**
     * - Map IP address to hostname or not
     */
    numeric?: boolean;
    /**
     * - Time to wait for a response, in seconds.
     * The option affects only timeout  in  absence  of any responses,
     * otherwise ping waits for two RTTs.
     */
    timeout?: number;
    /**
     * - Specify a timeout, in seconds,
     * before ping exits regardless of how many packets have been sent or received.
     * In this case ping does not stop after count packet are sent,
     * it waits either for deadline expire or until count probes are answered
     * or for some error notification from network.
     * This option is only available on linux and mac.
     */
    deadline?: number;
    /**
     * - Exit after sending number of ECHO_REQUEST
     */
    min_reply?: number;
    /**
     * - Use IPv4 (default) or IPv6
     */
    v6?: boolean;
    /**
     * - source address for sending the ping
     */
    sourceAddr?: string;
    /**
     * - Specifies the number of data bytes to be sent
     *  Default: Linux / MAC: 56 Bytes,
     *           Windows: 32 Bytes
     */
    packetSize?: number;
    /**
     * - Enables ignoring replies from different addresses
     * Default: Linux: false
     * Other platforms do not need this option.
     * If set to true and a reply is received from an address which does not match the parsed
     * `PingResponse.numeric_host`, the ping response is ignored.
     * This helps against detecting a host as alive by accident when another host replies to the ping.
     * This workaround addresses an imperfection in the ping implementation within the package iputils.*
     */
    ignoreDifferentAddressReply?: boolean;
    /**
     * - Optional options does not provided
     */
    extra?: string[];
};
//# sourceMappingURL=index.d.ts.map