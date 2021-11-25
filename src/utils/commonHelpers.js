import { Listener } from 'symbol-sdk';

export class CommonHelpers {
    /**
     * Helper method to sleep for ms miliseconds
     * @param {string} text
     * @return {boolean}
     */
    static sleep(ms: number): Promise<void> {
        return new Promise(resolve => {
            setTimeout(() => {
                resolve();
            }, ms);
        });
    }

    /**
     * Helper method to retry opening websocket n times asynchronously
     */
    static async retryNTimes(
        listener: Listener,
        trials: number,
        interval: number
    ) {
        if (trials < 1) {
            throw new Error('could not connect');
        }
        let attemptCount = 0;
        while (!listener.isOpen()) {
            try {
                return await listener.open();
            } catch (error) {
                if (++attemptCount >= trials) {
                    throw error;
                }
            }
            await this.sleep(interval);
        }
    }
}
