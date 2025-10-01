/**
 * API helper to call the Netlify Gemini proxy securely
 * Configure NETLIFY_FUNCTION_BASE if you use a custom domain
 */
(function(global) {
    var NETLIFY_FUNCTION_BASE = '';

    function setBaseUrl(url) {
        NETLIFY_FUNCTION_BASE = url || '';
    }

    function callGeminiProxy(message, context) {
        var endpoint = (NETLIFY_FUNCTION_BASE || '') + '/.netlify/functions/gemini-proxy';
        return fetch(endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: message, context: context })
        }).then(function(res) {
            if (!res.ok) throw new Error('Proxy request failed');
            return res.json();
        }).then(function(data) {
            return data.response || 'No response.';
        });
    }

    global.API = {
        setBaseUrl: setBaseUrl,
        callGeminiProxy: callGeminiProxy
    };
})(window);




