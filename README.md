This is a basic extension I designed to better understand two things: first, to understand some of the strategies phishing sites use for malicious activities, and second, to better understand the interaction between the extension and the browser. It analyzes the website you're currently visiting to determine whether it might be a malicious site.
We will implement three analysis criteria to determine whether a site might be suspicious or not:

First, we analyze the webpage's DOM, looking for hyperlinks, scripts, or other suspicious elements. 
Second, we analyze the URL structure locally to see if it is unusually long, contains many subdomains, or has other unusual characteristics.
Third, we use the URLScan API to send the URL to its database and analyze it again.

This extension follows this information flow:
1. The user navigates to a page
2. content_script.js is automatically injected → parses the DOM → saves data to storage
3. The user clicks the icon
4. popup.js runs → parses the URL locally → reads from storage → sends a message to background
5. background.js queries URLScan → responds to the popup
6. The popup displays the three verdicts

## Installation:
You need to create an account on URLScan and manage an API key; you must implement it here in background.js

Firefox:
1-Go to about:debugging
2-This Firefox
3-Load temporary add-on
4- Select “manifest.json”

Chrome:
1-Go to chrome://extensions
2-Enable “developer mode”
3-Click “Load Unpacker”
4-Select the extension folder

All done! You can now use the extension locally.

## Next steps
The goal is to be able to publish this extension in the respective browser stores, so some elements will need to be modified.

The first thing I’ll look to modify is the hardcoded API key, which currently poses no risk since it’s running locally, but would be a major vulnerability if deployed to production. To address this, I’ll implement a FastAPI system in the future.

Another important element is modifying the extension’s graphical interface.

Finally, more complex and comprehensive detection rules will be added.
