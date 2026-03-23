let queueState = {
    initialPosition: null,
    lastPosition: null,
    lastNotifiedPosition: null,
    history: [],
    lastUpdateTime: null
};

let isMonitoring = false;
let lastProcessedPosition = null;

export const stateManager = {

    setMonitoring(value) {
        isMonitoring = value;
    },

    isMonitoring() {
        return isMonitoring;
    },

    getLastPosition() {
        return queueState.lastPosition;
    },

    getInitialPosition() {
        return queueState.initialPosition;
    },

    processQueueUpdate(current, notificationEngine) {

        if (current === lastProcessedPosition) return;
        lastProcessedPosition = current;

        if (!queueState.initialPosition) {
            queueState.initialPosition = current;
            queueState.lastPosition = current;
            queueState.lastNotifiedPosition = current;
            return;
        }

        if (current > queueState.lastPosition) {
            console.log("Queue reset detected");
            return;
        }

        const now = Date.now();

        queueState.history.push({ position: current, time: now });

        if (queueState.history.length > 20) {
            queueState.history.shift();
        }

        queueState.lastUpdateTime = now;

        const previous = queueState.lastPosition;
        queueState.lastPosition = current;

        const movement = previous - current;

        if (queueState.lastNotifiedPosition - current >= 1000) {
            queueState.lastNotifiedPosition = current;
            notificationEngine.notify(current);
        }
    },

    getState() {
        return queueState;
    },

    setState(newState) {
        queueState = newState;
    }
};