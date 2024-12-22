const quips = ["Check your posture!", "funny response B", "funny response C"]

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

chrome.alarms.clear("Posture Alarm", (wasCleared) => {
    if (wasCleared){
        console.log("ALARM CLEARED");  
    }
    else { 
        console.log("ATTEMPTED CLEAR BUT NO ALARMS FOUND")
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
                var notif = {
                    type: "basic",
                    title: "Posture Checker",
                    iconUrl: "content/48x48_trans.png",
                    message: quips[0],
                    silent: !result.soundsOn,
                    requireInteraction: true
                };
                chrome.notifications.create(notif);
                return
            });
        }
        
        chrome.tabs.sendMessage(tabs[0].id, { action: "checkFullscreen" }, (response) => {
            if (chrome.runtime.lastError) {
                console.log("RUNTIME ERROR: " + chrome.runtime.lastError.message);

                chrome.storage.sync.get("soundsOn", function(result) {
                    var notif = {
                        type: "basic",
                        title: "Posture Checker",
                        iconUrl: "content/48x48_trans.png",
                        message: quips[0],
                        silent: !result.soundsOn,
                        requireInteraction: true
                    };
                    chrome.notifications.create("notifId", notif); // Create notification
                    console.log("NOTIFICATION SENT");
                });
                return;
            }

            if (!response || typeof response.isFullscreen === 'undefined') {
                console.log("INVALID RESPONSE");
                return;
            }
            
            
            if (response.isFullscreen){
                console.log("FULLSCREEN DETECTED, ALARM NOTIFICATION NOT SENT")
                return;
            }

            chrome.storage.sync.get("soundsOn", function(result){
                var notif = {
                    type: "basic",
                    title: "Posture Checker",
                    iconUrl: "content/48x48_trans.png",
                    message: quips[0],
                    silent: !result.soundsOn,
                    requireInteraction: true
                };
        
            chrome.notifications.create("notifId", notif); //Create notification
            console.log("NOTIFICATION SENT")
        
            /*chrome.windows.create({ //Create window (Manifest v3 doesnt let you play sounds without an open window :') )
        
                url: chrome.runtime.getURL("notification.html"),
                height: 1,
                width: 1,
                left: -1000,
                top: -1000,
                type: "popup",
                focused: false,
                state: "normal", 
                
                } , function(window){
        
                setTimeout(function(){ //Close window after sound plays 
                    chrome.windows.remove(window.id);
                }, 700);
            });*/
            })
        })
    })
});

// chrome.runtime.onStartup.addListener(() => { //Reset popup (Useful if chrome was quit whilst timer was active)
    
//     chrome.storage.sync.set({"started": false});
//     console.log("Chrome Starting, popup reset to default")
// });
