// File: netlify/functions/chat.js

exports.handler = async function (event) {
    if (event.httpMethod !== 'POST') {
      return { statusCode: 405, body: 'Method Not Allowed' };
    }
  
    // This safely gets your key from Netlify's settings
    const apiKey = process.env.GEMINI_API_KEY;
  
    if (!apiKey) {
      return { statusCode: 500, body: 'API key is not set.' };
    }
  
    try {
      const payload = JSON.parse(event.body);
      const googleApiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${apiKey}`;
  
      const response = await fetch(googleApiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
  
      if (!response.ok) {
        const errorText = await response.text();
        return { statusCode: response.status, body: errorText };
      }
  
      const data = await response.json();
  
      return {
        statusCode: 200,
        body: JSON.stringify(data),
      };
  
    } catch (error) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'An internal error occurred.' }),
      };
    }
  };