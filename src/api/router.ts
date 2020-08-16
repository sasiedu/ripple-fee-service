import PromiseRouter from 'express-promise-router';
import { validateParams, schemas } from './validation';
import Controller from 'api/controller';

const router = PromiseRouter();

export default function (controller: Controller) {
    router
        .route('/transactionFee/average')
        .get(validateParams(schemas.averageFee), controller.getHighestAverageFee.bind(controller));

    return router;
}
