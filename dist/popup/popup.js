"use strict";
const startBtn = document.getElementById('button');
const statusText = document.getElementById('status');
startBtn.addEventListener("click", async () => {
    statusText.innerText = "Status: Starting...";
    await chrome.runtime.sendMessage({
        type: "START_MONITORING"
    });
    statusText.innerText = "Status: Monitoring (placeholder)";
});
