function analyzePage() {
	const dominioActual = window.location.hostname;
	const suspiciousElements = [];
	
	//Rule 1 - Forms with an external action
	const forms = document.getElementsByTagName('form');
	for (let i = 0; i < forms.length; i++) {
	    const dominioAction = new URL(forms[i].action).hostname;
	    if (dominioAction !== dominioActual) {
	        suspiciousElements.push(`Form with an external action: ${dominioAction}`);
	    }
	}
	
	//Rule 2 - Empty links or links with JavaScript: void
	const links = document.getElementsByTagName('a'); 
	for (let i = 0; i < links.length; i ++){
	    const path = links[i].href
	    if (path.includes('#') || path.toLowerCase().includes('javascript') || path.trim() === '') {
	        suspiciousElements.push(`Suspicious link: ${path}`);
	    }
	}
	
//Rule 3 - External Scripts
	const scripts = document.getElementsByTagName('script');
	for (let i = 0; i < scripts.length; i++) {
       const src = scripts[i].src;
        if (src.length > 0) {
            const source = new URL(src).hostname;
            if (source !== dominioActual) {
                suspiciousElements.push(`Script from a suspicious source: ${source}`);
            }
        }
    }
    
    return {
        suspicious: suspiciousElements.length > 0,
        reasons: suspiciousElements
    };
}

const pageResult = analyzePage();
chrome.runtime.sendMessage({ type: 'PAGE_ANALYSIS', data: pageResult });
