chrome.runtime.onMessage.addListener(function(request){

    const quips = ["Check your posture!", "funny response B", "funny response C"]

    if (request.time){ //If message is to set alarm
        
        chrome.alarms.clearAll() //Clear previous alarm - CHROME CANT KEEP UP IF SPAMMED. CANT FIX?
        console.log("Alarm cleared")// Maybe make a check to see if theres multiple alarms when executing notificaiton, if there is then clear.
        chrome.alarms.create("Posture Alarm", { //Create alarm
            periodInMinutes: 1,
            delayInMinutes: parseInt(request.time)
        })
        console.log("Alarm created");
    }
    else if (request.clear){ //If message is to clear alarm
        chrome.alarms.clear("Posture Alarm"); //Clear alarm
        console.log("Alarm cleared");
    };

    
    chrome.alarms.onAlarm.addListener(() => { //When alarm is triggered

        var notif = {
            type: "basic",
            title: "Posture Checker",
            iconUrl: "content/48x48_trans.png",
            message: quips[0],
            silent: true
        };
        chrome.notifications.create("notifId", notif); //Create notification

        chrome.windows.create({ //Create window

            url: chrome.runtime.getURL("notification.html"),
            type: "popup",
            focused: false,
            state: "minimized"
            } , function(window){

            setTimeout(function(){ //Close window after 1 second
                chrome.windows.remove(window.id);
            }, 1500);
        });
    });
});
