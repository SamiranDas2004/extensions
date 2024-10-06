// Function to format milliseconds into minutes and seconds
function formatTime(ms) {
    const minutes = Math.floor(ms / 60000);
    const seconds = ((ms % 60000) / 1000).toFixed(0);
    return minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
  }
  
  // Load the site times from storage and display them
  chrome.storage.local.get("siteTimes", (data) => {
    const siteTimes = data.siteTimes || {};
    const table = document.getElementById("time-table");
  
    for (const [site, time] of Object.entries(siteTimes)) {
      const row = document.createElement("tr");
      const siteCell = document.createElement("td");
      const timeCell = document.createElement("td");

      
      siteCell.textContent = site;
      timeCell.textContent = formatTime(time);
  
      row.appendChild(siteCell);
      row.appendChild(timeCell);
      table.appendChild(row);
    }
  });
  