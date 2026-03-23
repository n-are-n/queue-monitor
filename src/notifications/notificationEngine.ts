export const notificationEngine = {

    notify(position) {
        chrome.notifications.create({
            type: "basic",
            iconUrl: "assets/icon.png",
            title: "Queue Update 🚀",
            message: `Queue moved! Current position: ${position}`,
            priority: 2
        });
    }

};