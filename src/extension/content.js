// src/extension/content.js
chrome.runtime.onMessage.addListener((message) => {
    if (message.type === 'API_CALL') {
        window.postMessage({
            type: 'API_CALL',
            data: message.data
        }, '*');
    }
});
