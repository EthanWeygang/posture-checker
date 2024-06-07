$(document).ready(function() {
    chrome.storage.sync.get(['sliderval', 'buttonstate'], function(result) {
        $("#slider").val(result.sliderval);
        $("#sliderval").text(result.sliderval);

        if (result.buttonstate === "active") { // Checks in storage if the button was active when last closed
            $("#buttoninactive").text("Stop")
            $("#buttoninactive").attr("id", "buttonactive")
        }
    });

   
    $(document).on("click", "#buttoninactive", function(){
        chrome.runtime.sendMessage({time: $("#slider").val()});
        console.log("Alarm message sent");
        $("#buttoninactive").text("Stop");
        $("#buttoninactive").attr("id", "buttonactive"); // Changes button to active
        chrome.storage.sync.set({"buttonstate": "active"}) // Changes storage variable to active
    });

    $(document).on("click", "#buttonactive", function(){
        chrome.runtime.sendMessage({clear: true});
        console.log("Alarm cleared");
        $("#buttonactive").text("Start");
        $("#buttonactive").attr("id", "buttoninactive"); // Changes button to inactive
        chrome.storage.sync.set({"buttonstate": "inactive"}) // Changes storage variable to inactive
    });
    
    $("#slider").on("input", function(){
        $("#sliderval").text($("#slider").val().toString());
        chrome.storage.sync.set({ "sliderval": $("#slider").val() });
    });
});
