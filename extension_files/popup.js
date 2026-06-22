// this executes when you open the popup
document.addEventListener('DOMContentLoaded', async () => {
    const statusEl = document.getElementById('status');
    
    // ask the browser what is the active windows open
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    
    const result = analyzeURL(tab.url);
    
    if (result.suspicious) {
    statusEl.textContent = `Suspicious: ${result.reasons.join(', ')}`;
    statusEl.style.color = 'red';
    } else {
    statusEl.textContent = 'URL: It seems legitimate';
    statusEl.style.color = 'green';
    }
    
    // Luego enviamos a URLScan (tarde ~15 seg)
    const apiEl = document.getElementById('api-result');
    apiEl.textContent = 'Consulting URLScan...';
    
    chrome.runtime.sendMessage({ type: 'SCAN_URL', url: tab.url }, (response) => {
        if (response.success) {
            const d = response.data;
            apiEl.textContent = d.malicious
                ? `URLScan: MALICIOUS (score: ${d.score})`
                : `URLScan: Clean (score: ${d.score})`
                apiEl.style.color = d.malicious ? 'red' : 'green';
            } else {
                apiEl.textContent = `Error: ${response.error}`;
            }
    });
    
    chrome.storage.local.get('pageAnalysis', (data) => {
        const domEl = document.getElementById('dom-result');
        if (data.pageAnalysis && data.pageAnalysis.suspicious) {
            domEl.textContent = `DOM: ${data.pageAnalysis.reasons.join(', ')}`;
            domEl.style.color = 'orange';
        } else {
            domEl.textContent = 'DOM: no suspicious items';
            domEl.style.color = 'green';
        }
    });
});
