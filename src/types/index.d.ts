import BigNumber from 'bignumber.js';
import RippleClient from 'ripple-client';
import FeeService from 'fee-service';

export type RippleClientConfig = {
    server: string;
    timeoutMs: number;
    trace?: boolean;
    authorization?: string;
    reconnectWaitTimeMs: number;
};

export type Config = {
    nodeEnv: string;
    ripple: RippleClientConfig;
};

export type Fee = {
    ledgerVersion: number;
    ledgerHash: string;
    feeDrops: BigNumber;
    transactionCount: number;
};

export type Transaction = {
    type: string;
    address: string;
    outcome: {
        fee: string;
    };
};

export type Context = {
    rippleClient: RippleClient;
    feeService: FeeService;
};

export type Schema = {
    body: object;
    params: object;
    query: object;
};

export type ApiConfig = {
    host: string;
    port: number;
};
