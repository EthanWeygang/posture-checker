const quips = ["Check your posture!", "Are you sitting straight?", "You require back-up!", "Posture check!", "Sit up! Thank me later :)"];

chrome.storage.sync.get(["started", "soundsOn"], function(result) {
    if (result.started === undefined) {
        chrome.storage.sync.set({ "started": false });
        console.log("STORAGE SET TO DEFAULT");
    }

    if (result.soundsOn === undefined) {
        chrome.storage.sync.set({ "soundsOn": true });
        console.log("SOUNDS SET TO DEFAULT");
    }
});

chrome.runtime.getPlatformInfo(function(result){
    chrome.storage.sync.set({"os" : result.os})
    console.log("USER IS ON " + result.os)
})

// Handle installation and updates
chrome.runtime.onInstalled.addListener((details) => {
    if (details.reason === "install") {
        console.log("Extension installed for the first time");
    } else if (details.reason === "update") {
        // Try to restore alarm state after update
        chrome.storage.sync.get(["started", "sliderval"], function(result) {
            if (result.started === true && result.sliderval) {
                chrome.alarms.create("Posture Alarm", {
                    delayInMinutes: parseInt(result.sliderval),
                    periodInMinutes: parseInt(result.sliderval)
                });
                console.log("RESTORED ALARM AFTER UPDATE FOR " + result.sliderval + " MINUTE(S)");
            }
        });
        console.log("Extension updated from " + details.previousVersion + " to " + chrome.runtime.getManifest().version);
    }
});



chrome.runtime.onMessage.addListener(function(request){ // Makes listener which executes code every time button is pressed

    if (request.time){ //If message is to set an alarm

        chrome.alarms.create("Posture Alarm", { //Create alarm
            delayInMinutes: parseInt(request.time),
            periodInMinutes: parseInt(request.time)
        })
        console.log("ALARM CREATED FOR " + request.time + " MINUTE(S)");
    }
    else if (request.clear){ //If message is to clear alarm
        
        chrome.alarms.clear("Posture Alarm", (wasCleared) => { //Clear alarm and recieve result
            if (wasCleared){
                console.log("ALARM CLEARED");
            }
            else { 
                console.log("ATTEMPTED CLEAR BUT NO ALARMS FOUND")
            }
        }); 
        
    };
});

chrome.alarms.onAlarm.addListener(() => { //Add listener which executes when alarm finishes
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs.length === 0) {
            console.log("NO ACTIVE TABS");

            chrome.storage.sync.get("soundsOn", function(result) {
                // Select a random message from the quips array
                const randomQuip = quips[Math.floor(Math.random() * quips.length)];
                var notif = {
                    type: "basic",
                    title: "Posture Checker",
                    iconUrl: "content/48x48_trans.png",
                    message: randomQuip,
                    silent: !result.soundsOn,
                    requireInteraction: true
                };
                // Use timestamp as unique ID to prevent overwriting
                const notificationId = "posture_" + Date.now();
                chrome.notifications.create(notificationId, notif);
                console.log("NOTIFICATION SENT (NO ACTIVE TABS)");
                return
            });
        }


        // Inject content script if not already present
        const tabId = tabs[0].id;

        chrome.scripting.executeScript(
            {
                target: { tabId },
                files: ["content.js"],
            },() => {
                if (chrome.runtime.lastError) {
                    console.log("Script injection failed: " + chrome.runtime.lastError.message);
                    return;
                }});




            
            sendNotification();
            
            function sendNotification() {
                chrome.storage.sync.get("soundsOn", function(result) {
                    const randomQuip = quips[Math.floor(Math.random() * quips.length)];
                    var notif = {
                        type: "basic",
                        title: "Posture Checker",
                        iconUrl: "content/48x48_trans.png",
                        message: randomQuip,
                        silent: !result.soundsOn,
                        requireInteraction: true
                    };
                    const notificationId = "posture_" + Date.now();
                    chrome.notifications.create(notificationId, notif);
                    console.log("NOTIFICATION SENT");
                });}
        

        
        // Always set a timeout to ensure notification is sent even if message response fails
        // const timeoutId = setTimeout(() => {
        //     console.log("RESPONSE TIMEOUT - SENDING NOTIFICATION ANYWAY");
        //     sendNotification();
        // }, 2000); // 2 second timeout
        
        // chrome.tabs.sendMessage(tabs[0].id, { action: "checkFullscreen" }, (response) => {
        //     if (chrome.runtime.lastError) {
        //         console.log("RUNTIME ERROR: " + chrome.runtime.lastError.message);
        //         clearTimeout(timeoutId); // Clear the timeout since we're handling it now
        //         sendNotification();
        //         return;
        //     }
 
        //     if (!response || typeof response.isFullscreen === 'undefined') {
        //         console.log("INVALID RESPONSE - SENDING NOTIFICATION ANYWAY");
        //         clearTimeout(timeoutId); // Clear the timeout since we're handling it now
        //         sendNotification();
        //         return;
        //     }
            
        //     // Clear the timeout since we got a valid response
        //     clearTimeout(timeoutId);
            
        //     // If in fullscreen, don't send notification
        //     if (response.isFullscreen){
        //         console.log("FULLSCREEN DETECTED, ALARM NOTIFICATION NOT SENT");
        //         return;
        //     }
            

        //     }
            
            
        //     /*chrome.windows.create({ //Create window (Manifest v3 doesnt let you play sounds without an open window :') ) This is an unused feature but I'm keeping it here for future reference
        
        //         url: chrome.runtime.getURL("notification.html"),
        //         height: 1,
        //         width: 1,
        //         left: -1000,
        //         top: -1000,
        //         type: "popup",
        //         focused: false,
        //         state: "normal", 
                
        //         } , function(window){
        
        //         setTimeout(function(){ //Close window after sound plays 
        //             chrome.windows.remove(window.id);
        //         }, 700);
        //     });*/
        // })
    })
});

// Restore the timer state when Chrome starts up
chrome.runtime.onStartup.addListener(() => {
    chrome.storage.sync.get(["started", "sliderval"], function(result) {
        // If the timer was active when Chrome was closed, restart it
        if (result.started === true && result.sliderval) {
            chrome.alarms.create("Posture Alarm", {
                delayInMinutes: parseInt(result.sliderval),
                periodInMinutes: parseInt(result.sliderval)
            });
            console.log("RESTORED ALARM ON STARTUP FOR " + result.sliderval + " MINUTE(S)");
        } else {
            // Otherwise reset to default state
            chrome.storage.sync.set({"started": false});
            console.log("Chrome Starting, popup reset to default");
        }
    });
});
