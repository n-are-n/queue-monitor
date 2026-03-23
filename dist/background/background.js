"use strict";
console.log("Background service worker started");
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log("Message received in background:", message);
    if (message.type === "START_MONITORING")
        console.log("Monitoring triggered (Phase 1 placeholder)");
});
