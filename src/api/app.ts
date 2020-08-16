import express from 'express';
import bodyParser from 'body-parser';
import http, { Server } from 'http';
import { Context } from 'types';
import Controller from './controller';
import router from './router';

export default function (context: Context): Server {
    const app = express();
    app.use(bodyParser.json());

    const controller = new Controller(context);
    // Routes
    app.use('/ripple', router(controller));
    // Health check
    app.get('/', (_, res) => res.sendStatus(200));

    return http.createServer(app);
}
