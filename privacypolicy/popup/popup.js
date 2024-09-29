
    const locationIdElement = document.getElementById("locationId");
    const startDateElement = document.getElementById("startDate");
    const endDateElement = document.getElementById("endDate");

    const startButton = document.getElementById("startButton");
    const stopButton = document.getElementById("stopButton");

   

    // Initial Status: Assume the process is stopped
    stoppedSpan.style.display = "inline";
    runningSpan.style.display = "none";

    // function validateInputs() {
    //     let isValid = true;

    //     if (!locationIdElement.value) {
    //         locationIdError.style.display = "block";
    //         isValid = false;
    //     } else {
    //         locationIdError.style.display = "none";
    //     }

    //     if (!startDateElement.value) {
    //         startDateError.style.display = "block";
    //         isValid = false;
    //     } else {
    //         startDateError.style.display = "none";
    //     }

    //     if (!endDateElement.value) {
    //         endDateError.style.display = "block";
    //         isValid = false;
    //     } else {
    //         endDateError.style.display = "none";
    //     }

    //     return isValid;
    // }

    startButton.onclick = function () {
            stoppedSpan.style.display = "none";
            runningSpan.style.display = "inline";

        const    prefes={
                locationId: locationIdElement.value,
                startDate: startDateElement.value,
                endDate: endDateElement.value,
                tzData:locationIdElement.options[locationIdElement.selectedIndex].getAttribute('data-tz')
            }
            // Send message to background script to start
            chrome.runtime.sendMessage({
                event: 'onStart',prefes
                
            });
        
    };

    stopButton.onclick = function () {
        // Hide running, show stopped
        runningSpan.style.display = "none";
        stoppedSpan.style.display = "inline";
        const    prefes={
            locationId: locationIdElement.value,
            startDate: startDateElement.value,
            endDate: endDateElement.value
        }
        // Send message to background script to stop
        chrome.runtime.sendMessage({ event: 'onStop',prefes });
    };


    chrome.storage.local.get(["locationId","startDate","endDate","locations"],(result)=>{
        const {locationId,startDate,endDate,locations}=result
        setLocations(locations)
        if (locationId) {
            locationIdElement.value=locationId;
        }
        if (startDate) {
            startDateElement.value=startDate;
        }
        if (endDate) {
            endDateElement.value=endDate
        }
console.log("locations",locations);

    })


const setLocations=(locations)=>{
    locations.forEach(location=>{
        let optionElement=document.createElement("option")
        optionElement.value=location.id
        optionElement.innerHTML=location.name
        locationIdElement.appendChild(optionElement);
       optionElement.setAttribute('data-tz',location.tzData)
    })
}