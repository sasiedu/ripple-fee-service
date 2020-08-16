import FeeService from 'fee-service';
import { Context } from 'types';
import { getAverageFee } from '../calculator';

class Controller {
    private readonly feeService: FeeService;
    private readonly context: Context;

    constructor(context: Context) {
        this.context = context;
        this.feeService = this.context.feeService;
    }

    getHighestAverageFee(req: any, res: any): void {
        const fees = this.feeService.getHighFees();
        const count = req.valid.blocks > 0 ? req.valid.blocks : 30;

        const selectedFees = (count > fees.length ? fees : fees.slice(0, count)).map((fee) => fee.feeDrops);
        const averageFee = getAverageFee(selectedFees);
        res.status(200).json({
            feeInDrops: averageFee.toString(),
            feeInXrp: this.context.rippleClient.dropsToXrp(averageFee.toString()),
        });
    }
}

export default Controller;
