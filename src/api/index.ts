import apiApp from './app';
import { ApiConfig, Context } from 'types';
import { Server } from 'net';

export async function start(context: Context, config: ApiConfig): Promise<Server> {
    const app = apiApp(context);
    const server = await new Promise((resolve) => {
        const s = app.listen(config.port, config.host, function () {
            // @ts-ignore
            const host = s.address().address;
            // @ts-ignore
            const port = s.address().port;

            console.log(`API listening at http://${host}:${port}`);
        });
        return resolve(s);
    });
    // @ts-ignore
    return server;
}
