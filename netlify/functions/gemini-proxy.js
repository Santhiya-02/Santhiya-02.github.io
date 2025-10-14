/**
 * Netlify Function: Gemini API Proxy for Resume Chatbot
 */

// Use the official Google AI library
const { GoogleGenerativeAI } = require('@google/generative-ai');

// --- START: PASTE YOUR RESUME DATA HERE ---
const resumeData = `
Santhiya Sasikumar
Software Developer

SUMMARY
A highly motivated and detail-oriented developer...
(etc... paste your full resume content here)
`;
// --- END: RESUME DATA ---

// This is our single, clean system prompt with the resume data included.
const systemPrompt = `You are Santhiya's expert resume assistant. Your sole purpose is to answer questions based ONLY on the resume content provided below. Before you answer, you MUST perform the following evaluation steps:

**EVALUATION STEPS:**
1.  **Relevance Check:** Is the user's question about Santhiya's skills, experience, or qualifications mentioned in the resume?
    * If YES, proceed to the next step.
    * If NO, you must stop immediately and respond with: "I can only answer questions about Santhiya's resume."

2.  **Factual Grounding Check:** Can the answer be formed using ONLY the text from the resume provided?
    * If YES, formulate a concise answer based strictly on the text.
    * If NO, do not infer or invent information. Respond with: "That information is not available in the provided resume."

3.  **Persona Check:** Ensure your final response is professional, helpful, and direct.

Strictly adhere to these evaluation steps. Do not break character or deviate from these rules.

Here is the resume:
---
${resumeData}
---
`;

exports.handler = async (event) => {
    // Only allow POST requests
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: 'Method Not Allowed' };
    }

    try {
        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            console.error('GEMINI_API_KEY not found.');
            return { statusCode: 500, body: JSON.stringify({ error: 'API key not configured' }) };
        }

        const { message } = JSON.parse(event.body);
        if (!message) {
            return { statusCode: 400, body: JSON.stringify({ error: 'Message is required' }) };
        }

        // Initialize the Google AI client
        const genAI = new GoogleGenerativeAI(apiKey);
        
        // Get the model and apply our system prompt
        const model = genAI.getGenerativeModel({
            model: "gemini-pro",
            systemInstruction: systemPrompt,
        });

        // Generate content based on the user's message
        const result = await model.generateContent(message);
        const response = result.response;
        const responseText = response.text();

        return {
            statusCode: 200,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ response: responseText }),
        };

    } catch (error) {
        console.error('Error in function:', error);
        return {
            statusCode: 500,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ error: 'Internal server error' }),
        };
    }
};