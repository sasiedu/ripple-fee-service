import { RippleAPI } from 'ripple-lib';
import { RippleClientConfig } from 'types';

class RippleClient extends RippleAPI {
    private readonly config: RippleClientConfig;
    private isTerminating: boolean;

    constructor(config: RippleClientConfig) {
        super({
            server: config.server,
            timeout: config.timeoutMs,
            trace: config.trace || false,
            authorization: config.authorization,
        });
        this.config = config;
        this.isTerminating = false;
    }

    async init(): Promise<boolean> {
        try {
            await this.connect();
        } catch (error) {
            console.error(error);
            return false;
        }
        this.setupListeners();
        return this.isConnected();
    }

    private async reconnect(): Promise<void> {
        if (!this.isConnected()) {
            console.log('Reconnecting...');
            try {
                await this.connect();
            } catch (error) {
                console.error(error);
                if (!this.isTerminating) {
                    setTimeout(this.reconnect.bind(this), this.config.reconnectWaitTimeMs);
                }
            }
        }
    }

    private setupListeners(): void {
        this.on('error', (errorCode, errorMessage) => {
            console.error(errorCode + ': ' + errorMessage);
            if (!this.isTerminating) {
                setTimeout(this.reconnect.bind(this), this.config.reconnectWaitTimeMs);
            }
        });

        this.on('disconnected', (code) => {
            console.error(`Disconnected with code: ${code}`);
            if (!this.isTerminating) {
                setTimeout(this.reconnect.bind(this), this.config.reconnectWaitTimeMs);
            }
        });
    }

    async terminate(): Promise<void> {
        this.isTerminating = true;
        if (this.isConnected()) {
            try {
                await this.disconnect();
            } catch (error) {
                console.error(`Error terminating ripple client: ${error.message}`);
            }
        }
    }
}

export default RippleClient;
