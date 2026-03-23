export function handleMessage(message, sender, sendResponse, deps) {
    const {
        stateManager,
        notificationEngine,
        analytics
    } = deps;

    if (message.type === "GET_QUEUE_STATE") {
        sendResponse({
            position: stateManager.getLastPosition(),
            speed: analytics.calculateSpeed(),
            eta: analytics.calculateETA(),
            initial: stateManager.getInitialPosition()
        });
    }

    if (message.type === "TOGGLE_MONITORING") {
        stateManager.setMonitoring(message.enabled);
        console.log("Monitoring:", message.enabled);
    }

    if (message.type === "QUEUE_POSITION_UPDATE") {
        if (!stateManager.isMonitoring()) return;

        stateManager.processQueueUpdate(message.position, notificationEngine);
    }
}