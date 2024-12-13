$(document).ready(function() {
    
    chrome.storage.sync.get(["os", "sliderval", "started", "soundsOn"], function(result) {
        $("#slider").val(result.sliderval);
        $("#sliderval").text(result.sliderval);

        if (result.started === true) { // Checks in storage if the button was active when last closed
            $("#startbutton").text("Stop");
            $("#slider").attr("disabled", "true");
        }

        if (result.os === "mac"){
            $("#sounds").remove()
        }
        else if ((result.soundsOn) === false) {
            $("#sounds").text("Unmute");
        };
        console.log("started:" + result.started);
    });

    // Toggles timer
   $(document).on("click", "#startbutton", function(){
        chrome.storage.sync.get("started", function(result){
            if (result.started === false){

                chrome.runtime.sendMessage({time: $("#slider").val()});
                $("#startbutton").text("Stop");
                $("#slider").attr("disabled", "true");
                
                chrome.storage.sync.set({"started": true});
                console.log("started -> true");
            }
            else{
                chrome.runtime.sendMessage({clear: true});
                $("#startbutton").text("Start");
                $("#slider").removeAttr("disabled");
                
                chrome.storage.sync.set({"started": false});
                console.log("started -> false");
            }
        });
   });

    // Toggles sounds
    $(document).on("click", "#sounds", function(){
        chrome.storage.sync.get("soundsOn", function(result) {
            
            if (result.soundsOn === true){
                $("#sounds").text("Unmute")
                chrome.storage.sync.set({"soundsOn": false})
            } 
            else{
                $("#sounds").text("Mute")
                chrome.storage.sync.set({"soundsOn": true})
            }
        });
    });
    
    // Updates slider value display
    $("#slider").on("input", function(){
        $("#sliderval").text($("#slider").val().toString());
        chrome.storage.sync.set({ "sliderval": $("#slider").val() });
    });
});
