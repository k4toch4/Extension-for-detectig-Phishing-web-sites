const URLSCAN_API_KEY = ' USER HERE YOU API KEY '

//Function that waits N milliseconds
function wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function scanURL(url) {
    //Step 1 - Submit the URL to URLscan
    const scanResponse = await fetch('https://urlscan.io/api/scan/', {
        method: 'POST',
        headers: {
            'API-KEY': URLSCAN_API_KEY,
            'Content-Type': 'applications/json'
        },
        body: JSON.stringify({url: url, visibility: 'unlisted'})
    });
    
    const scanData = await scanResponse.json();
    const uuid = scanData.uuid;
    
    //Step 2 - Wait 15 seconds
    await wait(15000);
    
    //Step 3 - We ask for the result
    const resultResponse = await fetch(`https://urlscan.io/api/v1/result/${uuid}/`);
    const resultData = await resultResponse.json();
    
    return {
        malicious: resultData.veredicts?.overall?.malicious || false,
        score: resultData.veredicts?.overall?.score || 0,
        tags: resultData.veredicts?.overall.tags || []
    };
}
    
//Listen for messages from popup.js
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if(message.type === 'SCAN_URL') {
        scanURL(message.url)
            .then(result => sendResponse({ success: true, data: result }))
            .catch(err => sendResponse({ success: false, error: err.message }));
            
        return true; // Keeps the channel open for an asynchronous response
    }
    
    if(message.type === 'PAGE_ANALYSIS') {
        chrome.storage.local.set({ pageAnalysis: message.data });
    }
});
