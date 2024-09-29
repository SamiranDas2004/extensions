import fetchLocation from "./api/fetchLocation.js";

chrome.runtime.onInstalled.addListener( details=>{
    fetchLocation()
}
)
  

chrome.runtime.onMessage.addListener(data => {
   const {event,prefes}=data
    switch (event) {
        case "onStart":
            handelOnStart(prefes)
            // Add logic to handle the start event
            break;
        case "onStop":
           handelOnStop(prefes)
            break;
        default:
            console.log("Unknown event");
            break;
    }
});



const handelOnStart=(prefes)=>{
    console.log("Starting process with details:", prefes);
    chrome.storage.local.set(prefes)
}

const handelOnStop=(prefes)=>{
    console.log("Stoping process with details:", prefes);
}