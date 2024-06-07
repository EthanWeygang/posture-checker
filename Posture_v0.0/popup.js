$(document).ready(function() {
    chrome.storage.sync.get(['sliderval'], function(result) {
        $("#slider").val(result.sliderval);
        $("#sliderval").text(result.sliderval);
        $("buttonactive").text = chrome.alarms
    });
   
    $("#button").click(function(){
        chrome.runtime.sendMessage({time: $("#slider").val()});
        console.log("Alarm message sent");
        $("#button").id = "buttonactive"; // Changes button to active
    });

    $("#buttonactive").click(function(){
        chrome.runtime.sendMessage({clear: true});
        console.log("Alarm cleared");
        $("#buttonactive").id = "button"; // Changes button to inactive
    });
    
    $("#slider").on("input", function(){
        $("#sliderval").text($("#slider").val().toString());
        chrome.storage.sync.set({ "sliderval": $("#slider").val() });
    });
});