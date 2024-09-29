let siteTimes = {};
let activeTabId = null;
let activeSite = null;
let startTime = null;

// Listen for when the user switches tabs
chrome.tabs.onActivated.addListener(({ tabId }) => {
  updateActiveTab(tabId);
});

// Listen for when the content of a tab changes (e.g., page load)
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tabId === activeTabId) {
    updateActiveTab(tabId);
  }
});

// Handle idle state changes
chrome.idle.onStateChanged.addListener((newState) => {
  if (newState === "idle" || newState === "locked") {
    stopTracking();
  } else if (newState === "active") {
    startTracking();
  }
});

// Function to update the active tab and start tracking time
function updateActiveTab(tabId) {
  chrome.tabs.get(tabId, (tab) => {
    if (tab && tab.url) {
      const url = new URL(tab.url).hostname;

      if (activeTabId !== null && activeSite !== null) {
        stopTracking();
      }

      activeTabId = tabId;
      activeSite = url;
      startTracking();
    }
  });
}

// Start tracking time for the active site
function startTracking() {
  startTime = Date.now();
}

// Stop tracking time and save the duration
function stopTracking() {
  if (startTime && activeSite) {
    const endTime = Date.now();
    const timeSpent = endTime - startTime;

    if (!siteTimes[activeSite]) {
      siteTimes[activeSite] = 0;
    }

    siteTimes[activeSite] += timeSpent;

    // Store the data in Chrome storage
    chrome.storage.local.set({ siteTimes });
  }

  startTime = null;
  activeSite = null;
}

// Clear the tracked time at the start of each new day
function resetDailyTracking() {
  const now = new Date();
  const currentDay = now.getDate();

  chrome.storage.local.get("lastResetDay", (data) => {
    const lastResetDay = data.lastResetDay || 0;

    if (lastResetDay !== currentDay) {
      chrome.storage.local.set({ siteTimes: {}, lastResetDay: currentDay });
    }
  });
}

// Reset daily tracking at extension start
resetDailyTracking();
