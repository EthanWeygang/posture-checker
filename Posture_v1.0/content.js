
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {

    if (message.action === "checkFullscreen") {

        const isFullscreen = document.fullscreenElement !== null;
        sendResponse({ isFullscreen });
    }
    return true;
});