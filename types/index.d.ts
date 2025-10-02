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
     *           Window: 32 Bytes
     */
    packetSize?: number;
    /**
     * - Optional options does not provided
     */
    extra?: string[];
};
//# sourceMappingURL=index.d.ts.map