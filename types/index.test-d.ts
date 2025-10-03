import { probe as promiseProbe } from "./ping-promise";
import { probe as callbackProbe } from "./ping-sys";


import { PingResponse } from "./parser/base";

import { expectType } from "tsd";
import { PingConfig } from ".";

const pingConfig: PingConfig = {
    numeric: true,
    timeout: 10,
};

expectType<Promise<PingResponse>>(promiseProbe('localhost', pingConfig));
expectType<Promise<PingResponse>>(callbackProbe('localhost', (response, error) => {
    expectType<PingResponse>(response);
    expectType<Error | null>(error);
}, pingConfig));

// just to make sure types are exported correctly
expectType<PingConfig>(pingConfig);
