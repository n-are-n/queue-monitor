console.log("Content script loaded");

function isQueuePage() {
    const text = document.body.innerText.toLowerCase();

    return (
        text.includes("queue") ||
        text.includes("people ahead") ||
        text.includes("your position")
    );
}

function extractQueuePosition() {

    const elements = document.querySelectorAll("body *");

    for (let el of elements) {

        const text = el.innerText;

        if (!text) continue;

        if (
            text.toLowerCase().includes("people ahead") ||
            text.toLowerCase().includes("your position")
        ) {
            const match = text.match(/(\d{2,6})/);
            if (match) return parseInt(match[1]);
        }
    }

    return null;
}

function fallbackScan() {

    chrome.storage.local.get("isMonitoring", (data) => {

        if (!data.isMonitoring) return;

        const position = extractQueuePosition();

        if (position) {
            chrome.runtime.sendMessage({
                type: "QUEUE_POSITION_UPDATE",
                position
            });
        }
    });
}

function observeQueueChanges() {

    const observer = new MutationObserver(() => {

        chrome.storage.local.get("isMonitoring", (data) => {

            if (!data.isMonitoring) return;
            if (!isQueuePage()) return;

            const position = extractQueuePosition();

            if (position) {
                chrome.runtime.sendMessage({
                    type: "QUEUE_POSITION_UPDATE",
                    position: position
                });
            }
        });

    });

    observer.observe(document.body, {
        childList: true,
        subtree: true,
        characterData: true
    });
}

(function () {

    const OriginalWebSocket = window.WebSocket;

    window.WebSocket = function (...args) {

        const socket = new OriginalWebSocket(...args);

        socket.addEventListener("message", (event) => {

            try {
                const data = JSON.parse(event.data);

                if (data.position || data.queuePosition) {

                    chrome.runtime.sendMessage({
                        type: "QUEUE_POSITION_UPDATE",
                        position: data.position || data.queuePosition
                    });
                }

            } catch (e) {
                // ignore non-JSON messages
            }
        });

        return socket;
    };

})();

function initDetection() {

    // 1. WebSocket (best)
    setupWebSocketListener();

    // 2. DOM observer
    observeQueueChanges();

    // 3. Fallback polling
    setInterval(fallbackScan, 7000);
}

