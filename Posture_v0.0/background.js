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

    if (request.time){ //If message is to set alarm

        chrome.alarms.create("Posture Alarm", { //Create alarm
            periodInMinutes: 1,
            delayInMinutes: parseInt(request.time)
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
    chrome.storage.sync.get("soundsOn", function(result){
        if (result.soundsOn == true){
            var notif = {
                type: "basic",
                title: "Posture Checker",
                iconUrl: "content/48x48_trans.png",
                message: quips[0],
                silent: false,
                requireInteraction: true}
        }
        else {
            var notif = {
                type: "basic",
                title: "Posture Checker",
                iconUrl: "content/48x48_trans.png",
                message: quips[0],
                silent: true,
                requireInteraction: true}
        }

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
});

// chrome.runtime.onStartup.addListener(() => { //Resent popup (Useful if chrome was quit whilst timer was active)
    
//     chrome.storage.sync.set({"buttonstate": "inactive"})
//     console.log("Chrome Starting, popup reset to default")
// });
