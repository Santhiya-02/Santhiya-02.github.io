/**
 * Chat functionality for Interactive Resume
 * Handles chat modal, message display, and basic AI integration
 */

// Chat state management
const ChatState = {
    isOpen: false,
    messages: [],
    isLoading: false
};

// Initialize chat functionality when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeChatModal();
    initializeChatInput();
    initializeChatButtons();
});

/**
 * Initialize chat modal functionality
 * Handles opening, closing, and displaying the chat interface
 */
function initializeChatModal() {
    const chatToggle = document.getElementById('chat-toggle');
    const chatToggleMobile = document.getElementById('chat-toggle-mobile');
    const chatModal = document.getElementById('chat-modal');
    const closeChat = document.getElementById('close-chat');
    
    // Open chat modal
    function openChat() {
        chatModal.classList.remove('hidden');
        ChatState.isOpen = true;
        
        // Focus on input
        setTimeout(() => {
            const chatInput = document.getElementById('chat-input');
            if (chatInput) {
                chatInput.focus();
            }
        }, 100);
    }
    
    // Close chat modal
    function closeChatModal() {
        chatModal.classList.add('hidden');
        ChatState.isOpen = false;
    }
    
    // Event listeners
    if (chatToggle) {
        chatToggle.addEventListener('click', openChat);
    }
    
    if (chatToggleMobile) {
        chatToggleMobile.addEventListener('click', openChat);
    }
    
    if (closeChat) {
        closeChat.addEventListener('click', closeChatModal);
    }
    
    // Close modal when clicking outside
    if (chatModal) {
        chatModal.addEventListener('click', function(e) {
            if (e.target === chatModal) {
                closeChatModal();
            }
        });
    }
    
    // Close modal with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && ChatState.isOpen) {
            closeChatModal();
        }
    });
}

/**
 * Initialize chat input functionality
 * Handles message sending and input validation
 */
function initializeChatInput() {
    const chatInput = document.getElementById('chat-input');
    const sendButton = document.getElementById('send-message');
    
    if (chatInput && sendButton) {
        // Send message on Enter key
        chatInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
            }
        });
        
        // Send message on button click
        sendButton.addEventListener('click', sendMessage);
        
        // Auto-resize textarea
        chatInput.addEventListener('input', function() {
            this.style.height = 'auto';
            this.style.height = this.scrollHeight + 'px';
        });
    }
}

/**
 * Initialize chat buttons and interactions
 * Handles example questions and quick actions
 */
function initializeChatButtons() {
    // Add example questions to initial message
    const chatMessages = document.getElementById('chat-messages');
    if (chatMessages) {
        addExampleQuestions();
    }
}

/**
 * Send a message in the chat
 * Handles user input and triggers AI response
 */
async function sendMessage() {
    const chatInput = document.getElementById('chat-input');
    const message = chatInput.value.trim();
    
    if (!message) return;
    
    // Clear input
    chatInput.value = '';
    chatInput.style.height = 'auto';
    
    // Add user message to chat
    addMessageToChat(message, 'user');
    
    // Show loading state
    showTypingIndicator();
    
    try {
        // Use RAG pipeline and API proxy if available
        let response;
        if (window.RAGModule && window.API) {
            const context = window.RAGModule.retrieveRelevantContext(message);
            // If not in data, return constrained message
            if (!context || context.trim().length === 0) {
                response = "That’s something I’m working on and will update in future.";
            } else {
                // Prefer secure proxy, fall back to local simulate
                try {
                    response = await window.API.callGeminiProxy(message, context);
                } catch (e) {
                    response = await window.RAGModule.generateRAGResponse(message);
                }
            }
        } else {
            response = await simulateAIResponse(message);
        }
        
        // Remove typing indicator
        removeTypingIndicator();
        
        // Add AI response to chat
        addMessageToChat(response, 'assistant');
        
    } catch (error) {
        console.error('Error sending message:', error);
        removeTypingIndicator();
        addMessageToChat('Sorry, I encountered an error. Please try again.', 'assistant', true);
    }
}

/**
 * Add a message to the chat display
 * @param {string} content - Message content
 * @param {string} sender - Message sender ('user' or 'assistant')
 * @param {boolean} isError - Whether this is an error message
 */
function addMessageToChat(content, sender, isError = false) {
    const chatMessages = document.getElementById('chat-messages');
    if (!chatMessages) return;
    
    const messageDiv = document.createElement('div');
    messageDiv.className = `mb-4 chat-message ${sender === 'user' ? 'text-right' : 'text-left'}`;
    
    const messageContent = document.createElement('div');
    messageContent.className = `inline-block max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
        sender === 'user' 
            ? 'bg-primary text-white' 
            : isError 
                ? 'bg-red-100 text-red-800 border border-red-200'
                : 'bg-white text-gray-800 shadow-sm'
    }`;
    
    messageContent.textContent = content;
    messageDiv.appendChild(messageContent);
    
    chatMessages.appendChild(messageDiv);
    
    // Scroll to bottom
    chatMessages.scrollTop = chatMessages.scrollHeight;
    
    // Store message in state
    ChatState.messages.push({
        content,
        sender,
        timestamp: new Date(),
        isError
    });
}

/**
 * Show typing indicator
 * Displays a loading animation while waiting for AI response
 */
function showTypingIndicator() {
    const chatMessages = document.getElementById('chat-messages');
    if (!chatMessages) return;
    
    const typingDiv = document.createElement('div');
    typingDiv.id = 'typing-indicator';
    typingDiv.className = 'mb-4 text-left chat-message';
    
    const typingContent = document.createElement('div');
    typingContent.className = 'inline-block bg-white text-gray-800 shadow-sm px-4 py-2 rounded-lg';
    typingContent.innerHTML = `
        <div class="flex items-center space-x-1">
            <span class="text-sm text-gray-600">AI is typing</span>
            <div class="flex space-x-1">
                <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 0.1s"></div>
                <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 0.2s"></div>
            </div>
        </div>
    `;
    
    typingDiv.appendChild(typingContent);
    chatMessages.appendChild(typingDiv);
    
    // Scroll to bottom
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

/**
 * Remove typing indicator
 * Removes the loading animation
 */
function removeTypingIndicator() {
    const typingIndicator = document.getElementById('typing-indicator');
    if (typingIndicator) {
        typingIndicator.remove();
    }
}

/**
 * Add example questions to the chat
 * Provides users with suggested questions to ask
 */
function addExampleQuestions() {
    const chatMessages = document.getElementById('chat-messages');
    if (!chatMessages) return;
    
    const exampleDiv = document.createElement('div');
    exampleDiv.className = 'mb-4';
    
    const exampleContent = document.createElement('div');
    exampleContent.className = 'bg-blue-50 border border-blue-200 rounded-lg p-3';
    exampleContent.innerHTML = `
        <p class="text-sm text-blue-800 mb-2 font-medium">Try asking:</p>
        <div class="space-y-1">
            <button class="example-question text-left text-sm text-blue-600 hover:text-blue-800 block w-full text-left">
                "What programming languages do you know?"
            </button>
            <button class="example-question text-left text-sm text-blue-600 hover:text-blue-800 block w-full text-left">
                "Tell me about your experience with React"
            </button>
            <button class="example-question text-left text-sm text-blue-600 hover:text-blue-800 block w-full text-left">
                "What projects have you worked on?"
            </button>
        </div>
    `;
    
    exampleDiv.appendChild(exampleContent);
    chatMessages.appendChild(exampleDiv);
    
    // Add click handlers for example questions
    const exampleButtons = exampleDiv.querySelectorAll('.example-question');
    exampleButtons.forEach(button => {
        button.addEventListener('click', function() {
            const question = this.textContent.trim();
            document.getElementById('chat-input').value = question;
            sendMessage();
        });
    });
}

/**
 * Simulate AI response (placeholder for actual API integration)
 * @param {string} message - User message
 * @returns {Promise<string>} AI response
 */
async function simulateAIResponse(message) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));
    
    // Simple keyword-based responses (will be replaced with actual AI)
    const responses = {
        'hello': 'Hello! I\'m here to help you learn more about my background and experience. What would you like to know?',
        'hi': 'Hi there! Feel free to ask me anything about my skills, projects, or professional experience.',
        'skills': 'I have experience with JavaScript, Python, React, Node.js, and various other technologies. You can see the full list in the Skills section above!',
        'experience': 'I have worked as a Senior Software Engineer and Full Stack Developer. You can find detailed information about my professional experience in the Experience section.',
        'projects': 'I\'ve worked on several interesting projects including an E-Commerce Platform, AI Chatbot, and Task Management App. Check out the Projects section for more details!',
        'contact': 'You can reach me through the contact form or the social links provided in the Contact section. I\'d love to hear from you!'
    };
    
    // Find matching response
    const lowerMessage = message.toLowerCase();
    for (const [keyword, response] of Object.entries(responses)) {
        if (lowerMessage.includes(keyword)) {
            return response;
        }
    }
    
    // Default response
    return 'That\'s an interesting question! While I can provide information about my resume, I\'m still learning to answer more complex queries. Try asking about my skills, experience, or projects.';
}

/**
 * Clear chat history
 * Removes all messages from the chat
 */
function clearChat() {
    const chatMessages = document.getElementById('chat-messages');
    if (chatMessages) {
        chatMessages.innerHTML = '';
        ChatState.messages = [];
        addExampleQuestions();
    }
}

/**
 * Export chat functionality for use in other modules
 */
window.ChatModule = {
    sendMessage,
    addMessageToChat,
    clearChat,
    ChatState
};
