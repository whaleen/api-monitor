console.log('Background script loaded!');

// Initialize WebSocket connection
const ws = new WebSocket('ws://localhost:8080');
ws.onopen = () => console.log('WebSocket connected');
ws.onerror = (error) => console.error('WebSocket error:', error);

// Track API requests by request ID
const apiRequests = new Map();

chrome.webRequest.onBeforeRequest.addListener(
    (details) => {
        if (details.method === "POST" && details.requestBody && details.requestBody.raw) {
            try {
                const rawData = details.requestBody.raw[0].bytes;
                const decoder = new TextDecoder('utf-8');
                const jsonStr = decoder.decode(rawData);
                const payload = JSON.parse(jsonStr);

                // Store request info by ID
                apiRequests.set(details.requestId, {
                    method: payload.name,
                    url: details.url,
                    payload
                });
            } catch (err) {
                // Silently ignore non-JSON requests
            }
        }
    },
    { urls: ["<all_urls>"] },
    ["requestBody"]
);

chrome.webRequest.onCompleted.addListener(
    async (details) => {
        // Only process requests we tracked in onBeforeRequest
        const request = apiRequests.get(details.requestId);
        if (request) {

            console.log('API Call:', {
                method: request.method,
                url: request.url,
                requestPayload: request.payload
            });

            // Send to WebSocket if connected
            if (ws.readyState === WebSocket.OPEN) {
                ws.send(JSON.stringify({
                    method: request.method,
                    url: request.url,
                    payload: request.payload,
                    timestamp: Date.now()
                }));
                console.log('We sent API call to WebSocket');
            }

            // Clean up
            apiRequests.delete(details.requestId);
        }
    },
    { urls: ["<all_urls>"] }
);
