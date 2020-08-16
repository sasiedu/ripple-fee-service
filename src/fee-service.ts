import RippleClient from 'ripple-client';
import { FormattedLedger } from 'ripple-lib/dist/npm/ledger/parse/ledger';
import BigNumber from 'bignumber.js';
import { Fee, Transaction } from 'types';

class FeeService {
    private readonly ripple: RippleClient;
    private terminating: boolean;
    private highFees: Array<Fee>;

    constructor(rippleClient: RippleClient) {
        this.ripple = rippleClient;
        this.terminating = false;
        this.highFees = [];
    }

    async start(): Promise<boolean> {
        if (!this.ripple.isConnected()) {
            return false;
        }
        this.ripple.on('ledger', this.onNewLedger.bind(this));
        return true;
    }

    getHighFees(): Array<Fee> {
        return this.highFees;
    }

    async onNewLedger(ledger: FormattedLedger): Promise<void> {
        if (this.terminating) {
            return;
        }
        try {
        } catch (error) {
            console.error(error);
        }
        return this.processLedger(ledger.ledgerVersion);
    }

    protected async processLedger(ledgerVersion: number): Promise<void> {
        try {
            console.log(`Processing ledger(${ledgerVersion})`);
            const ledger = await this.ripple.getLedger({
                ledgerVersion,
                includeTransactions: true,
                includeAllData: true,
            });

            const highestFee = this.highestTransactionFeeInLedger(ledger.transactions as Array<Transaction>);
            this.highFees = this.addFeeToArray(
                this.highFees,
                highestFee,
                ledger.ledgerVersion,
                ledger.ledgerHash,
                ledger.transactions ? ledger.transactions.length : 0,
            );
        } catch (error) {
            console.error(error);
        }
    }

    protected highestTransactionFeeInLedger(transactions?: Array<Transaction>): BigNumber {
        if (!transactions || transactions.length < 1) {
            return new BigNumber(0);
        }

        if (transactions.length === 1) {
            return new BigNumber(this.ripple.xrpToDrops(transactions[0].outcome.fee));
        }

        let fee = new BigNumber(0);
        for (const tx of transactions) {
            const txFee = new BigNumber(this.ripple.xrpToDrops(tx.outcome.fee));
            if (txFee.isGreaterThan(fee)) {
                fee = txFee;
            }
        }
        return fee;
    }

    protected addFeeToArray(
        fees: Array<Fee>,
        fee: BigNumber,
        version: number,
        hash: string,
        count: number,
    ): Array<Fee> {
        const newFee: Fee = {
            ledgerVersion: version,
            ledgerHash: hash,
            feeDrops: fee,
            transactionCount: count,
        };
        const newArray = [newFee].concat(fees);
        if (newArray.length > 30) {
            newArray.pop();
        }
        return newArray;
    }

    async stop(): Promise<void> {
        this.terminating = true;
        this.ripple.removeListener('ledger', this.onNewLedger.bind(this));
    }
}

export default FeeService;
