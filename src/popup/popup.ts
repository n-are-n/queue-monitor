const startBtn = document.getElementById("startBtn");
const statusText = document.getElementById("status");

startBtn.addEventListener("click", () => {

    chrome.storage.local.get("isMonitoring", (data) => {

        const newState = !data.isMonitoring;

        chrome.storage.local.set({ isMonitoring: newState });

        statusText.innerText = newState
            ? "Status: Monitoring ON"
            : "Status: Monitoring OFF";

        chrome.runtime.sendMessage({
            type: "TOGGLE_MONITORING",
            enabled: newState
        });
    });
});


const positionEl = document.getElementById("position");
const speedEl = document.getElementById("speed");
const etaEl = document.getElementById("eta");

function updateUI() {

    chrome.runtime.sendMessage({ type: "GET_QUEUE_STATE" }, (data) => {

        if (!data) return;

        positionEl.innerText = `Position: ${data.position || "-"}`;
        speedEl.innerText = `Speed: ${data.speed || 0}/min`;
        etaEl.innerText = `ETA: ${data.eta}`;
    });
}

// Refresh every 3 seconds
setInterval(updateUI, 3000);