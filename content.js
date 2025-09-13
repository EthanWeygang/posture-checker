
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "checkFullscreen") {
        try {
            // Check for fullscreen using multiple methods for better reliability
            const isFullscreen = 
                document.fullscreenElement !== null || 
                document.webkitFullscreenElement !== null || 
                document.mozFullScreenElement !== null ||
                document.msFullscreenElement !== null;
                
            sendResponse({ isFullscreen: isFullscreen });
        } catch (error) {
            // If there's any error, default to not fullscreen to ensure notification is sent
            console.error("Fullscreen check error:", error);
            sendResponse({ isFullscreen: false });
        }
    }
    return true; // Keep the message channel open for async response
});