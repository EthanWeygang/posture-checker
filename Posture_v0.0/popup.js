$(document).ready(function() {
    // Prepares popup when opened
    chrome.storage.sync.get(['sliderval', 'started', 'soundsOn'], function(result) {
        $("#slider").val(result.sliderval);
        $("#sliderval").text(result.sliderval);

        if (result.started === true) { // Checks in storage if the button was active when last closed
            $("#startbutton").text("Stop");
            $("#slider").attr("disabled", "true");
        }

        if ((result.soundsOn) === false){
            $("#sounds").text("Muted");
        }
    });

    // Toggles timer
   $(document).on("click", "#startbutton", function(){
        chrome.storage.sync.get("started", function(result){
            if (result.started === false){

                chrome.runtime.sendMessage({time: $("#slider").val()});
                $("#startbutton").text("Stop");
                $("#slider").attr("disabled", "true");
                
                chrome.storage.sync.set({"started": true});
            }
            else{
                chrome.runtime.sendMessage({clear: true});
                $("#startbutton").text("Start");
                $("#slider").removeAttr("disabled");
                
                chrome.storage.sync.set({"started": false});
            }
        });
   });

    // Toggles sounds
    $(document).on("click", "#sounds", function(){
        chrome.storage.sync.get("soundsOn", function(result) {
            
            if (result.soundsOn === true){
                $("#sounds").text("Muted")
                chrome.storage.sync.set({"soundsOn": false})
            } 
            else{
                $("#sounds").text("Unmuted")
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
