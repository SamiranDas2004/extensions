chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.type === "getSiteInfo") {
        const siteUrl = request.url;

        // Fetch Privacy Policy
        fetchPrivacyPolicy(siteUrl).then(privacyPolicy => {
            // Fetch Site Safety
            fetchSiteSafety(siteUrl).then(isSafe => {
                console.log(`Privacy Policy url: ${privacyPolicy}, Is Safe: ${isSafe}`);
                sendResponse({ privacyPolicy, isSafe });
            }).catch(error => {
                console.error('Error fetching site safety:', error);
                sendResponse({ privacyPolicy, isSafe: null }); // Handle error gracefully
            });
        }).catch(error => {
            console.error('Error fetching privacy policy:', error);
            sendResponse({ privacyPolicy: null, isSafe: null }); // Handle error gracefully
        });

        // Required to return true to indicate an async response
        return true;
    }
});
function fetchPrivacyPolicy(siteUrl) {
    // List of common privacy policy URL patterns to check
    const privacyPolicyUrls = [
        `https://${siteUrl}/privacy-policy`,
        `https://${siteUrl}/privacy-notice`,
        `https://${siteUrl}/legal/privacy-policy`,
        `https://${siteUrl}/privacy`,
        `https://${siteUrl}/policies/privacy`,
        `https://${siteUrl}/terms-and-privacy`,
        `https://${siteUrl}/privacy-statement`
    ];

    // Function to sequentially check each URL
    const checkNextUrl = (index = 0) => {
        if (index >= privacyPolicyUrls.length) {
            // If all URLs have been checked and none were found, return null
            throw new Error('Privacy Policy not found on any common URLs');
        }

        const urlToCheck = privacyPolicyUrls[index];
        console.log(`Fetching Privacy Policy from: ${urlToCheck}`);
        return fetch(urlToCheck)
            .then(response => {
                if (response.ok) {
                    // Return the URL if it exists
                    return urlToCheck;
                } else {
                    // Try the next URL if this one doesn't work
                    return checkNextUrl(index + 1);
                }
            })
            .catch(error => {
                console.error(`Error fetching privacy policy from ${urlToCheck}:`, error);
                // Try the next URL even if there's a fetch error
                return checkNextUrl(index + 1);
            });
    };

    // Start the process of checking URLs
    return checkNextUrl().catch(error => {
        console.error('Final error fetching privacy policy:', error);
        return null; // Return null if no privacy policy was found
    });
}


function fetchSiteSafety(siteUrl) {
    // Google Safe Browsing API integration
    const apiKey = 'AIzaSyCuMa1v1AJaIqq7lin6sJNC8zctnkXDG4s'; // Replace with your API key
    return fetch(`https://safebrowsing.googleapis.com/v4/threatMatches:find?key=${apiKey}`, {
        method: 'POST',
        body: JSON.stringify({
            client: { clientId: "yourCompany", clientVersion: "1.5.2" },
            threatInfo: {
                threatTypes: ["MALWARE", "SOCIAL_ENGINEERING"],
                platformTypes: ["ANY_PLATFORM"],
                threatEntryTypes: ["URL"],
                threatEntries: [{ url: `https://${siteUrl}` }]
            }
        }),
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(res => res.json())
    .then(data => {
        console.log('Safe Browsing API Response:', data);
        return !data.matches; // If matches found, site is unsafe
    });
}
