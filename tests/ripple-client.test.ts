import 'mocha';
import { expect } from 'chai';
import { RippleClientConfig } from '../src/types';
import RippleClient from '../src/ripple-client';
// @ts-ignore
import { sleep } from './test-helpers';

describe('Ripple client tests', function () {
    beforeEach(async function () {
        const config: RippleClientConfig = {
            server: 'wss://s1.ripple.com',
            timeoutMs: 10000,
            reconnectWaitTimeMs: 1000,
        };
        this.rippleClient = new RippleClient(config);
    });

    afterEach(async function () {
        await this.rippleClient.terminate();
    });

    it('can connect to ripple server', async function () {
        await this.rippleClient.init();
        expect(this.rippleClient.isConnected()).to.be.true;
    });

    it('can reconnect after disconnecting', async function () {
        await this.rippleClient.init();
        expect(this.rippleClient.isConnected()).to.be.true;
        await this.rippleClient.disconnect();
        await sleep(3000);
        expect(this.rippleClient.isConnected()).to.be.true;
    });

    it('can terminate ripple client', async function () {
        await this.rippleClient.init();
        expect(this.rippleClient.isConnected()).to.be.true;
        await this.rippleClient.terminate();
        expect(this.rippleClient.isConnected()).to.be.false;
    });

    it('should fail if ripple server url is invalid', async function () {
        const config: RippleClientConfig = {
            server: 'wss://s1.ripple-wrong.com',
            timeoutMs: 10000,
            reconnectWaitTimeMs: 1000,
        };
        const rippleClient = new RippleClient(config);
        const resp = await rippleClient.init();
        expect(resp).to.be.false;
    });
});
