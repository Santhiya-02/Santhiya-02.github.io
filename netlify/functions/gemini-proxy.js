/**
 * Netlify Function: Gemini API Proxy for Resume Chatbot
 */

// Use the official Google AI library
const { GoogleGenerativeAI } = require('@google/generative-ai');

// --- START: PASTE YOUR RESUME DATA HERE ---
const resumeData = `
Santhiya Sasikumar
Coimbatore
santhiyasasikumar0205@gmail.com | 9994009450 | https://www.linkedin.com/in/santhiya-sasikumar-bb5614297

Profile Summary
Santhiya is a Computer Science Engineering student with proficient skills in programming, problem-solving, Java, and C. She has a passion for technology-driven solutions and is looking for an internship to apply her knowledge.

Technical Skills
Languages: C, Java, Python, javascript
Database: MySQL
Frontend: HTML, CSS
Platforms: AWS, Cloud

Education
KPR Institute of Engineering and Technology (2023-2027)
BE in Computer Science and Engineering
CGPA: 8.7/10

G. Ramaswamy Naidu MHSS (2022-2023)
HSC, Percentage: 92.8%

Experience
Java Development Intern - OctaNet Solutions (Jan 2025-Feb 2025)
Developed Java applications and REST APIs with MySQL.
Utilized Spring Boot, Git, and Agile methodologies.

IoT Intern - Enthu Technology Solutions (Dec 2024 - Jan 2025)
Constructed IoT solutions including Smart Irrigation and Air Quality Monitoring.
Worked with microcontrollers, sensors, and automation.

Projects
IoT-Based Agriculture Monitoring System
Created an ESP32-based system for monitoring soil, temperature, and humidity.
Enabled automated irrigation and real-time cloud monitoring.

Autonomous Line Follower Robot
Built a robot for path tracking using IR sensors and motor drivers.
Implemented PID-based control to ensure smooth navigation.

Weapon Detection Model
Developed a real-time weapon detection system using deep learning (YOLOv8/Computer Vision) to identify firearms and sharp objects from surveillance feeds, enhancing security and threat response.

Certifications
Introduction to Web Development - Coursera (Nov 2024)
Introduction to Java - Coursera (Mar 2025)
Prompt Design in Vertex AI - Google Cloud (Aug 2024)
Develop GenAI Apps with Gemini and Streamlit - Google Cloud (May 2024)
CCNA Introduction to Networks - Cisco (Nov 2024)

Achievements
Scored 92.8% in HSC exams, served as School Pupil Leader, solved 100+ LeetCode problems.

Coding Profiles:
HackerRank: hackerrank.com/santhiyasasikum1
LeetCode: leetcode.com/santhiyasasikumar

Additional Information
Languages: English, Tamil, and basic knowledge of Hindi, German, and Sanskrit.
Interests: Badminton and Gardening
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
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: 'Method Not Allowed' };
    }

    try {
        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            return { statusCode: 500, body: JSON.stringify({ error: 'API key not configured' }) };
        }

        const { message } = JSON.parse(event.body);
        if (!message) {
            return { statusCode: 400, body: JSON.stringify({ error: 'Message is required' }) };
        }

        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({
            model: "gemini-pro",
            systemInstruction: systemPrompt,
        });

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