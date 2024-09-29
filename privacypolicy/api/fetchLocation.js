const LOCATION_ENDPOINT = "https://ttp.cbp.dhs.gov/schedulerapi/locations/?temporary=false&inviteOnly=false&operational=true&serviceName=Global+Entry";

export default function fetchLocations () {
    fetch(LOCATION_ENDPOINT)
    .then(response => response.json())
    .then(data => {
       const filteredLOcations=data.map(loc=>({
        "id":loc.id,
        "name":loc.name,
        "shortName":loc.shortName,
        "tzDate":loc.tzData
       }))
       filteredLOcations.sort((a,b)=>a.name.localeCompare(b.name))
       
       chrome.storage.local.set({locations:filteredLOcations})
    })
    .catch(error => {
        console.log(error);
    });
};


