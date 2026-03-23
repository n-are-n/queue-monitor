import { handleMessage } from "./messageRouter.js";
import { stateManager } from "../state/queueStateManager.js";
import { notificationEngine } from "../notifications/notificationEngine.js";
import { analytics } from "../utils/analytics.js";
import { loadState } from "../state/storageService.js";

let activeTabId = null;

chrome.tabs.onActivated.addListener((activeInfo) => {
    activeTabId = activeInfo.tabId;
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {

    if (sender.tab && sender.tab.id !== activeTabId) {
        return;
    }

    handleMessage(message, sender, sendResponse, {
        stateManager,
        notificationEngine,
        analytics
    });

    return true;
});

chrome.runtime.onStartup.addListener(loadState);
chrome.runtime.onInstalled.addListener(loadState);