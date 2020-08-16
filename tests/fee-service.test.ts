import 'mocha';
import sinon from 'sinon';
import { expect } from 'chai';
import { RippleClientConfig } from '../src/types';
import RippleClient from '../src/ripple-client';
import FeeService from '../src/fee-service';
// @ts-ignore
import { sleep } from './test-helpers';
import BigNumber from 'bignumber.js';

class FeeServiceTest extends FeeService {}

describe('Fee service tests', function () {
    const sandbox = sinon.createSandbox();

    beforeEach(async function () {
        const config: RippleClientConfig = {
            server: 'wss://s1.ripple.com',
            timeoutMs: 10000,
            reconnectWaitTimeMs: 1000,
        };
        this.rippleClient = new RippleClient(config);
        this.feeService = new FeeServiceTest(this.rippleClient);
    });

    afterEach(async function () {
        sandbox.restore();
        await this.feeService.stop();
        await this.rippleClient.terminate();
    });

    it('can start fee service', async function () {
        await this.rippleClient.init();
        const resp = await this.feeService.start();
        expect(resp).to.be.true;
    });

    it('should not start fee service is ripple is not connected', async function () {
        const resp = await this.feeService.start();
        expect(resp).to.be.false;
    });

    it('can listen for ledger', async function () {
        sinon.spy(this.feeService, 'onNewLedger');
        await this.rippleClient.init();
        const resp = await this.feeService.start();
        expect(resp).to.be.true;
        this.rippleClient.emit('ledger', {
            baseFeeXRP: '0.00001',
            ledgerHash: '6F1AED21A77D696F01D60A18EF25D321FED6B390D50E46DC79A06142FD8E92B9',
            ledgerVersion: 57531533,
            ledgerTimestamp: '2020-08-15T20:07:31.000Z',
            reserveBaseXRP: '20',
            reserveIncrementXRP: '5',
            transactionCount: 73,
            validatedLedgerVersions: '56327994-57531533',
        });
        expect(this.feeService.onNewLedger.calledOnce).to.be.true;
    });

    it('can listen for ledger after reconnection', async function () {
        sinon.spy(this.feeService, 'onNewLedger');
        await this.rippleClient.init();
        const resp = await this.feeService.start();
        expect(resp).to.be.true;
        await this.rippleClient.disconnect();
        await sleep(3000);
        this.rippleClient.emit('ledger', {
            baseFeeXRP: '0.00001',
            ledgerHash: '6F1AED21A77D696F01D60A18EF25D321FED6B390D50E46DC79A06142FD8E92B9',
            ledgerVersion: 57531533,
            ledgerTimestamp: '2020-08-15T20:07:31.000Z',
            reserveBaseXRP: '20',
            reserveIncrementXRP: '5',
            transactionCount: 73,
            validatedLedgerVersions: '56327994-57531533',
        });
        expect(this.feeService.onNewLedger.calledOnce).to.be.true;
    });

    it('given a ledgerVersion, should return a ledger with all transactions', async function () {
        await this.rippleClient.init();
        let error = null;
        try {
            await this.feeService.processLedger(57531533);
        } catch (e) {
            error = e;
        }
        expect(error).to.equal(null);
        expect(this.feeService.getHighFees().length).to.equal(1);
        expect(this.feeService.getHighFees()).to.eql([
            {
                ledgerVersion: 57531533,
                ledgerHash: '6F1AED21A77D696F01D60A18EF25D321FED6B390D50E46DC79A06142FD8E92B9',
                transactionCount: 73,
                feeDrops: new BigNumber(50000),
            },
        ]);
    });

    it('should return highest fee in transaction array', async function () {
        const txns = [
            { type: 'payment', address: '0x01', outcome: { fee: '0.0001' } },
            { type: 'payment', address: '0x02', outcome: { fee: '0.0005' } },
            { type: 'payment', address: '0x03', outcome: { fee: '0.0003' } },
            { type: 'payment', address: '0x04', outcome: { fee: '0.0007' } },
            { type: 'payment', address: '0x05', outcome: { fee: '0.0006' } },
        ];

        const value = this.feeService.highestTransactionFeeInLedger(txns);
        expect(value.toString()).to.equal('700');
    });

    it('can add new fee to fee array', async function () {
        const fees = [
            { ledgerVersion: 1, ledgerHash: '0x01', feeDrops: new BigNumber(1), transactionCount: 1 },
            { ledgerVersion: 2, ledgerHash: '0x02', feeDrops: new BigNumber(2), transactionCount: 2 },
        ];
        const result = this.feeService.addFeeToArray(fees, new BigNumber(3), 3, '0x03', 3);
        expect(result.length).to.equal(3);
        expect(result).to.eql([
            { ledgerVersion: 3, ledgerHash: '0x03', feeDrops: new BigNumber(3), transactionCount: 3 },
            { ledgerVersion: 1, ledgerHash: '0x01', feeDrops: new BigNumber(1), transactionCount: 1 },
            { ledgerVersion: 2, ledgerHash: '0x02', feeDrops: new BigNumber(2), transactionCount: 2 },
        ]);
    });
});
