import 'mocha';
import { expect } from 'chai';
import BigNumber from 'bignumber.js';
import { getAverageFee } from '../src/calculator';

describe('Calculator tests', function () {
    it('can calculate average fee', function () {
        const fees = [new BigNumber(110), new BigNumber(200), new BigNumber(340), new BigNumber(250)];

        const result = getAverageFee(fees);
        expect(result.toString()).to.equal('225');
    });
});
