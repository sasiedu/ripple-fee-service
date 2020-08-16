import BigNumber from 'bignumber.js';

export function getAverageFee(fees: Array<BigNumber>): BigNumber {
    if (fees.length < 1) {
        return new BigNumber(0);
    }

    const sumCallback = (acc: BigNumber, curr: BigNumber) => acc.plus(curr);
    const sum = fees.reduce(sumCallback, new BigNumber(0));
    return sum.div(fees.length).decimalPlaces(0);
}
