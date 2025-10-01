/**
 * RAG (Retrieval-Augmented Generation) Implementation
 * Handles resume-specific question answering using context injection
 */

// Resume data - now loaded dynamically from JSON with fallback to inline data
let ResumeData = {
    personalInfo: {
        name: "Your Name",
        title: "Software Engineer & AI Enthusiast",
        email: "your.email@example.com",
        phone: "+1 (555) 123-4567",
        location: "Your City, Country",
        summary: "Passionate developer with expertise in full-stack development, machine learning, and building scalable applications. Always eager to learn new technologies and solve complex problems."
    },
    
    experience: [
        {
            title: "Senior Software Engineer",
            company: "Tech Company Inc.",
            period: "2022 - Present",
            description: "Led development of microservices architecture serving 100k+ users. Implemented CI/CD pipelines reducing deployment time by 60%. Mentored junior developers and conducted code reviews.",
            details: [
                "Architected and developed RESTful APIs using Node.js and Express",
                "Implemented automated testing achieving 90% code coverage",
                "Collaborated with cross-functional teams to deliver features on time",
                "Optimized database queries resulting in 40% performance improvement"
            ],
            technologies: ["JavaScript", "Node.js", "React", "AWS", "Docker"]
        },
        {
            title: "Full Stack Developer",
            company: "StartupXYZ",
            period: "2020 - 2022",
            description: "Developed full-stack web applications from concept to deployment. Built responsive frontend interfaces and robust backend services. Integrated third-party APIs and payment systems.",
            details: [
                "Built responsive web applications using React and Vue.js",
                "Developed REST APIs using Python Flask and Django",
                "Managed PostgreSQL databases and implemented data migrations",
                "Deployed applications on cloud platforms (AWS, Heroku)"
            ],
            technologies: ["Python", "React", "Vue.js", "PostgreSQL", "Git"]
        }
    ],
    
    projects: [
        {
            name: "E-Commerce Platform",
            category: "web",
            description: "A full-stack e-commerce solution with payment integration and admin dashboard.",
            technologies: ["React", "Node.js", "MongoDB", "Stripe"],
            details: "Built a complete e-commerce platform with user authentication, product management, shopping cart, and payment processing using Stripe API."
        },
        {
            name: "AI Chatbot",
            category: "ai",
            description: "Intelligent chatbot using natural language processing and machine learning.",
            technologies: ["Python", "TensorFlow", "NLP", "Flask"],
            details: "Developed an AI-powered chatbot that can understand and respond to user queries using natural language processing techniques."
        },
        {
            name: "Task Management App",
            category: "mobile",
            description: "Cross-platform mobile app for productivity and task management.",
            technologies: ["React Native", "Firebase", "Redux", "TypeScript"],
            details: "Created a mobile application for task management with real-time synchronization and offline capabilities."
        }
    ],
    
    skills: {
        languages: ["JavaScript", "Python", "TypeScript", "Java"],
        frontend: ["React", "Vue.js", "Tailwind CSS", "HTML5/CSS3"],
        backend: ["Node.js", "Express", "Django", "FastAPI"],
        tools: ["Git", "Docker", "AWS", "MongoDB"]
    },
    
    education: [
        {
            degree: "Bachelor of Science in Computer Science",
            institution: "University Name",
            year: "2016 - 2020",
            details: "Graduated with honors, focusing on software engineering and artificial intelligence."
        }
    ]
};

// Attempt to load resume data dynamically from JSON at startup
(function loadResumeJsonAtStartup() {
    if (window.ResumeDataLoader && typeof window.ResumeDataLoader.load === 'function') {
        window.ResumeDataLoader.load()
            .then(function(jsonData) {
                if (jsonData && typeof jsonData === 'object') {
                    ResumeData = jsonData;
                }
            })
            .catch(function() {
                // Keep fallback ResumeData
            });
    }
})();

// RAG Configuration
const RAGConfig = {
    maxContextLength: 4000,
    temperature: 0.7,
    maxTokens: 500,
    systemPrompt: `You are a helpful and professional AI assistant answering questions about a software engineer's resume. Your goal is to help recruiters and potential employers understand the candidate's skills, experience, and qualifications.

IMPORTANT RULES:
1. You MUST use ONLY the information provided in the resume context below
2. Do not make up any information or answer questions that are not related to this resume
3. If the answer is not in the context, politely say "I can only answer questions based on the information in the resume"
4. Be professional, concise, and helpful
5. When discussing specific technologies or experiences, reference the actual details from the resume
6. If asked about contact information, direct them to the contact section

Resume Context:
---`
};

/**
 * Initialize RAG functionality
 * Sets up the RAG system for resume-specific question answering
 */
document.addEventListener('DOMContentLoaded', function() {
    initializeRAG();
});

/**
 * Initialize RAG system
 * Prepares the RAG system for use
 */
function initializeRAG() {
    console.log('RAG system initialized');
    
    // Override the simulateAIResponse function with RAG implementation
    if (window.ChatModule) {
        // Store original function
        window.ChatModule.originalSimulateAIResponse = window.ChatModule.simulateAIResponse;
        
        // Replace with RAG implementation
        window.ChatModule.simulateAIResponse = generateRAGResponse;
    }
}

/**
 * Generate RAG response using resume context
 * @param {string} userQuestion - The user's question
 * @returns {Promise<string>} AI response based on resume context
 */
async function generateRAGResponse(userQuestion) {
    try {
        // Retrieve relevant context from resume data
        const context = retrieveRelevantContext(userQuestion);
        
        // Construct the augmented prompt
        const augmentedPrompt = constructAugmentedPrompt(userQuestion, context);
        
        // For now, simulate API call (will be replaced with actual Gemini API)
        const response = await simulateGeminiAPI(augmentedPrompt);
        
        return response;
        
    } catch (error) {
        console.error('Error generating RAG response:', error);
        return 'I apologize, but I encountered an error while processing your question. Please try again.';
    }
}

/**
 * Retrieve relevant context from resume data
 * @param {string} question - User's question
 * @returns {string} Relevant context from resume
 */
function retrieveRelevantContext(question) {
    const lowerQuestion = question.toLowerCase();
    let context = '';
    
    // Check for personal information queries
    if (lowerQuestion.includes('name') || lowerQuestion.includes('who are you')) {
        context += `Personal Information: ${ResumeData.personalInfo.name} - ${ResumeData.personalInfo.title}\n`;
        context += `Summary: ${ResumeData.personalInfo.summary}\n`;
        context += `Contact: ${ResumeData.personalInfo.email}, ${ResumeData.personalInfo.phone}\n\n`;
    }
    
    // Check for experience queries
    if (lowerQuestion.includes('experience') || lowerQuestion.includes('work') || lowerQuestion.includes('job') || lowerQuestion.includes('career')) {
        context += 'Professional Experience:\n';
        ResumeData.experience.forEach(exp => {
            context += `- ${exp.title} at ${exp.company} (${exp.period})\n`;
            context += `  Description: ${exp.description}\n`;
            context += `  Technologies: ${exp.technologies.join(', ')}\n\n`;
        });
    }
    
    // Check for skills queries
    if (lowerQuestion.includes('skill') || lowerQuestion.includes('technology') || lowerQuestion.includes('programming') || lowerQuestion.includes('language')) {
        context += 'Technical Skills:\n';
        Object.entries(ResumeData.skills).forEach(([category, skills]) => {
            context += `${category.charAt(0).toUpperCase() + category.slice(1)}: ${skills.join(', ')}\n`;
        });
        context += '\n';
    }
    
    // Check for project queries
    if (lowerQuestion.includes('project') || lowerQuestion.includes('portfolio') || lowerQuestion.includes('work')) {
        context += 'Projects:\n';
        ResumeData.projects.forEach(project => {
            context += `- ${project.name} (${project.category})\n`;
            context += `  Description: ${project.description}\n`;
            context += `  Technologies: ${project.technologies.join(', ')}\n\n`;
        });
    }
    
    // Check for education queries
    if (lowerQuestion.includes('education') || lowerQuestion.includes('degree') || lowerQuestion.includes('university') || lowerQuestion.includes('school')) {
        context += 'Education:\n';
        ResumeData.education.forEach(edu => {
            context += `- ${edu.degree} from ${edu.institution} (${edu.year})\n`;
            context += `  ${edu.details}\n\n`;
        });
    }
    
    // If no specific context found, provide general information
    if (!context) {
        context = `General Information:\n`;
        context += `Name: ${ResumeData.personalInfo.name}\n`;
        context += `Title: ${ResumeData.personalInfo.title}\n`;
        context += `Summary: ${ResumeData.personalInfo.summary}\n`;
        context += `Key Skills: ${Object.values(ResumeData.skills).flat().join(', ')}\n`;
    }
    
    return context;
}

/**
 * Construct augmented prompt for AI
 * @param {string} userQuestion - User's question
 * @param {string} context - Retrieved context from resume
 * @returns {string} Augmented prompt
 */
function constructAugmentedPrompt(userQuestion, context) {
    return `${RAGConfig.systemPrompt}
${context}
---

User Question: ${userQuestion}

Please provide a helpful and accurate response based on the resume information above.`;
}

/**
 * Simulate Gemini API call (placeholder for actual implementation)
 * @param {string} prompt - The augmented prompt
 * @returns {Promise<string>} AI response
 */
async function simulateGeminiAPI(prompt) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));
    
    // Simple keyword-based responses based on context
    const lowerPrompt = prompt.toLowerCase();
    
    // Extract user question from prompt
    const questionMatch = prompt.match(/User Question: (.+)/);
    const userQuestion = questionMatch ? questionMatch[1].toLowerCase() : '';
    
    // Generate contextual responses
    if (userQuestion.includes('name') || userQuestion.includes('who are you')) {
        return `I'm ${ResumeData.personalInfo.name}, a ${ResumeData.personalInfo.title}. ${ResumeData.personalInfo.summary}`;
    }
    
    if (userQuestion.includes('experience') || userQuestion.includes('work')) {
        const latestExp = ResumeData.experience[0];
        return `I'm currently working as a ${latestExp.title} at ${latestExp.company} since ${latestExp.period}. ${latestExp.description} I have experience with ${latestExp.technologies.join(', ')}.`;
    }
    
    if (userQuestion.includes('skill') || userQuestion.includes('technology')) {
        const allSkills = Object.values(ResumeData.skills).flat();
        return `I have expertise in various technologies including ${allSkills.slice(0, 8).join(', ')}. You can see my complete skill set organized by category in the Skills section above.`;
    }
    
    if (userQuestion.includes('project')) {
        const projectNames = ResumeData.projects.map(p => p.name).join(', ');
        return `I've worked on several projects including ${projectNames}. Each project demonstrates different aspects of my technical skills and problem-solving abilities. You can find detailed information about each project in the Projects section above.`;
    }
    
    if (userQuestion.includes('contact') || userQuestion.includes('reach')) {
        return `You can reach me at ${ResumeData.personalInfo.email} or ${ResumeData.personalInfo.phone}. I'm located in ${ResumeData.personalInfo.location}. Feel free to use the contact form or social links provided in the Contact section.`;
    }
    
    // Default contextual response
    return `Based on my resume, I'm a ${ResumeData.personalInfo.title} with experience in ${Object.values(ResumeData.skills).flat().slice(0, 5).join(', ')}. I've worked on various projects and have professional experience in software development. Is there something specific you'd like to know about my background?`;
}

/**
 * Get resume data for external use
 * @returns {Object} Resume data object
 */
function getResumeData() {
    return ResumeData;
}

/**
 * Update resume data
 * @param {Object} newData - New resume data
 */
function updateResumeData(newData) {
    Object.assign(ResumeData, newData);
}

/**
 * Search resume data for specific information
 * @param {string} query - Search query
 * @returns {Array} Matching results
 */
function searchResumeData(query) {
    const results = [];
    const lowerQuery = query.toLowerCase();
    
    // Search in experience
    ResumeData.experience.forEach(exp => {
        if (exp.title.toLowerCase().includes(lowerQuery) || 
            exp.company.toLowerCase().includes(lowerQuery) ||
            exp.description.toLowerCase().includes(lowerQuery)) {
            results.push({ type: 'experience', data: exp });
        }
    });
    
    // Search in projects
    ResumeData.projects.forEach(project => {
        if (project.name.toLowerCase().includes(lowerQuery) ||
            project.description.toLowerCase().includes(lowerQuery)) {
            results.push({ type: 'project', data: project });
        }
    });
    
    // Search in skills
    Object.entries(ResumeData.skills).forEach(([category, skills]) => {
        skills.forEach(skill => {
            if (skill.toLowerCase().includes(lowerQuery)) {
                results.push({ type: 'skill', data: { category, skill } });
            }
        });
    });
    
    return results;
}

// Export RAG functionality
window.RAGModule = {
    generateRAGResponse,
    getResumeData,
    updateResumeData,
    searchResumeData,
    retrieveRelevantContext,
    constructAugmentedPrompt
};
