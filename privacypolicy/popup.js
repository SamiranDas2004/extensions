document.addEventListener('DOMContentLoaded', () => {
    // Get the current active tab
    chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
      const currentTab = tabs[0];
      console.log(tabs[0]);
      
      if (!currentTab || !currentTab.url) {
        document.getElementById('info').innerText = 'No active tab found.';
        return;
      }
  
      const url = new URL(currentTab.url);
      const hostname = url.hostname;
  
      // Send message to background script
      chrome.runtime.sendMessage({ type: "getSiteInfo", url: hostname }, response => {
        if (chrome.runtime.lastError) {
          document.getElementById('info').innerText = 'Error: ' + chrome.runtime.lastError.message;
          return;
        }
  
        if (response.error) {
          document.getElementById('info').innerText = 'Error: ' + response.error;
          return;
        }
  
        const { privacyPolicy, isSafe } = response;
  console.log(isSafe,'url' ,privacyPolicy)
  
        let privacyPolicyHTML = privacyPolicy ?
          `<p>Privacy Policy: <a href="${privacyPolicy}" target="_blank">Read</a></p>` :
          '<p>Privacy Policy: Not found.</p>';
  
        let safetyStatus = isSafe ? 'Safe' : 'Unsafe';
        let safetyClass = isSafe ? 'safe' : 'unsafe';
  
        let safetyHTML = `<p>Safety: <span class="${safetyClass}">${safetyStatus}</span></p>`;
  
        document.getElementById('info').innerHTML = privacyPolicyHTML + safetyHTML;
      });
    });
  });
  