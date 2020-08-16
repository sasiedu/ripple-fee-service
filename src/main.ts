import { ApiConfig, Context, RippleClientConfig } from './types';
import RippleClient from './ripple-client';
import FeeService from './fee-service';
import { start as apiStart } from './api';

function getRippleConfig(): RippleClientConfig {
    return {
        server: process.env.RIPPLE_SERVER_URI || 'wss://s1.ripple.com',
        timeoutMs: process.env.RIPPLE_SERVER_TIMEOUT_MS ? parseInt(process.env.RIPPLE_SERVER_TIMEOUT_MS) : 60000,
        authorization: process.env.RIPPLE_SERVER_AUTHORIZATION,
        reconnectWaitTimeMs: process.env.RIPPLE_SERVER_RECONNECT_WAIT_TIME_MS
            ? parseInt(process.env.RIPPLE_SERVER_RECONNECT_WAIT_TIME_MS)
            : 60000,
    };
}

function getApiConfig(): ApiConfig {
    return {
        host: '0.0.0.0',
        port: process.env.PORT ? parseInt(process.env.PORT) : 3333,
    };
}

async function main(): Promise<void> {
    console.log('Ripple Fee Service starting....');

    const rippleConfig = getRippleConfig();
    const rippleClient = new RippleClient(rippleConfig);
    await rippleClient.init();

    const feeService = new FeeService(rippleClient);
    await feeService.start();

    const context: Context = {
        rippleClient,
        feeService,
    };

    const apiConfig = getApiConfig();
    await apiStart(context, apiConfig);
}

main().catch((error) => {
    console.error(error);
});
