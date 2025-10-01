# Interactive LLM-Powered Resume

A modern, interactive resume website powered by AI that allows visitors to chat with your resume using Retrieval-Augmented Generation (RAG). Built with HTML5, Tailwind CSS, JavaScript, and Google Gemini API.

## 🚀 Features

- **Responsive Design**: Beautiful, mobile-first design using Tailwind CSS
- **Interactive Elements**: Project filters, smooth scrolling, expandable content
- **AI Chat Interface**: Chat with your resume using natural language
- **RAG Implementation**: Context-aware responses based on resume content
- **Secure API Integration**: Protected API keys using serverless functions
- **GitHub Pages Deployment**: Automated deployment with GitHub Actions

## 🏗️ Architecture

### Frontend
- **HTML5**: Semantic markup for accessibility
- **Tailwind CSS**: Utility-first CSS framework for responsive design
- **Vanilla JavaScript**: No framework dependencies for fast loading
- **Modular Structure**: Separated concerns with dedicated JS modules

### AI Integration
- **Google Gemini API**: Large language model for natural language processing
- **RAG (Retrieval-Augmented Generation)**: Context injection for accurate responses
- **Serverless Functions**: Secure API key management with Netlify Functions

### Deployment
- **GitHub Pages**: Free static site hosting
- **GitHub Actions**: Automated CI/CD pipeline
- **Netlify Functions**: Serverless API proxy for security

## 📁 Project Structure

```
rag/
├── index.html              # Main resume page
├── assets/
│   ├── css/
│   │   └── custom.css      # Custom styles and animations
│   └── js/
│       ├── main.js         # Core functionality (navigation, filters)
│       ├── chat.js         # Chat interface and message handling
│       └── rag.js          # RAG implementation and context retrieval
├── .github/
│   └── workflows/
│       └── deploy.yml      # GitHub Actions deployment workflow
├── netlify/
│   └── functions/
│       └── gemini-proxy.js # API key protection serverless function
└── README.md               # Project documentation
```

## 🛠️ Setup Instructions

### Prerequisites
- GitHub account
- Google AI Studio account (for Gemini API)
- Netlify account (for serverless functions)

### Step 1: Clone and Customize

1. **Clone this repository**:
   ```bash
   git clone https://github.com/yourusername/your-username.github.io.git
   cd your-username.github.io
   ```

2. **Customize the resume content**:
   - Edit `assets/js/rag.js` and update the `ResumeData` object with your information
   - Modify `index.html` to reflect your personal details
   - Update contact information, social links, and project details

### Step 2: Get Google Gemini API Key

1. **Visit Google AI Studio**: https://aistudio.google.com/
2. **Sign in** with your Google account
3. **Create a new API key**:
   - Click "Get API key" in the left sidebar
   - Click "Create API key"
   - Copy the generated API key (keep it secure!)

### Step 3: Deploy to GitHub Pages

1. **Push to GitHub**:
   ```bash
   git add .
   git commit -m "Initial commit: Interactive resume with AI chat"
   git push origin main
   ```

2. **Enable GitHub Pages**:
   - Go to your repository settings
   - Scroll to "Pages" section
   - Select "GitHub Actions" as source
   - The deployment will start automatically

3. **Your resume will be live at**: `https://yourusername.github.io`

### Step 4: Secure API Integration (Optional but Recommended)

1. **Deploy to Netlify**:
   - Connect your GitHub repository to Netlify
   - Deploy the site

2. **Add Environment Variable**:
   - Go to Netlify dashboard → Site settings → Environment variables
   - Add `GEMINI_API_KEY` with your API key value

3. **Update JavaScript**:
   - Modify `assets/js/rag.js` to use the Netlify function instead of direct API calls
   - Replace the `simulateGeminiAPI` function with actual API calls to `/api/gemini-proxy`

## 🎨 Customization Guide

### Personal Information
Update the `ResumeData` object in `assets/js/rag.js`:

```javascript
const ResumeData = {
    personalInfo: {
        name: "Your Name",
        title: "Your Title",
        email: "your.email@example.com",
        // ... other details
    },
    // ... rest of the data
};
```

### Styling
- **Colors**: Modify the Tailwind config in `index.html`
- **Custom CSS**: Add styles in `assets/css/custom.css`
- **Fonts**: Update font imports in the HTML head

### Content Sections
- **Experience**: Add/remove experience items in the HTML and ResumeData
- **Projects**: Update project cards and data
- **Skills**: Modify skill categories and technologies
- **Education**: Add educational background

## 🔧 Technical Details

### RAG Implementation
The RAG system works by:
1. **Retrieval**: Extracting relevant information from resume data based on user query
2. **Augmentation**: Injecting context into the AI prompt
3. **Generation**: Using Gemini API to generate contextual responses

### Security Features
- **API Key Protection**: Keys stored as environment variables
- **Input Sanitization**: User input validation and cleaning
- **Rate Limiting**: Built-in request throttling
- **CORS Handling**: Proper cross-origin resource sharing

### Performance Optimizations
- **Lazy Loading**: Images and content loaded on demand
- **Minimal Dependencies**: No heavy frameworks for fast loading
- **CDN Assets**: External libraries served from CDN
- **Responsive Images**: Optimized for different screen sizes

## 🚀 Deployment Options

### Option 1: GitHub Pages (Free)
- Automatic deployment with GitHub Actions
- Custom domain support
- SSL certificate included
- Perfect for static sites

### Option 2: Netlify (Recommended for AI features)
- Serverless functions for API security
- Environment variable management
- Form handling capabilities
- Advanced deployment options

### Option 3: Vercel
- Similar to Netlify with different pricing
- Excellent for React/Next.js projects
- Built-in analytics

## 🔍 Testing and Debugging

### Local Development
1. **Serve locally**:
   ```bash
   # Using Python
   python -m http.server 8000
   
   # Using Node.js
   npx serve .
   
   # Using PHP
   php -S localhost:8000
   ```

2. **Test chat functionality**: Open browser console to see logs

### Debugging Tips
- Check browser console for JavaScript errors
- Verify API key configuration
- Test network requests in browser dev tools
- Validate HTML structure

## 📈 Analytics and Monitoring

### Recommended Tools
- **Google Analytics**: Track visitor behavior
- **Google Search Console**: Monitor SEO performance
- **Hotjar**: User experience analytics
- **Uptime monitoring**: Ensure site availability

### Key Metrics to Track
- Page load times
- Chat interaction rates
- Most asked questions
- User engagement duration

## 🔮 Future Enhancements

### Planned Features
- [ ] **Multi-language support**: Internationalization
- [ ] **Dark mode**: Theme switching
- [ ] **PDF export**: Downloadable resume
- [ ] **Advanced analytics**: Detailed user insights
- [ ] **Voice interaction**: Speech-to-text chat
- [ ] **Video integration**: Video resume sections

### Technical Improvements
- [ ] **Progressive Web App**: Offline functionality
- [ ] **Advanced RAG**: Vector embeddings for better context
- [ ] **Real-time collaboration**: Multiple user sessions
- [ ] **A/B testing**: Optimize user experience
- [ ] **Performance monitoring**: Real-time metrics

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Tailwind CSS**: For the amazing utility-first CSS framework
- **Google Gemini**: For providing the AI capabilities
- **GitHub**: For free hosting and CI/CD
- **Netlify**: For serverless functions and deployment
- **Font Awesome**: For the beautiful icons

## 📞 Support

If you have questions or need help:
- Open an issue on GitHub
- Check the documentation
- Review the code comments
- Contact: your.email@example.com

---

**Built with ❤️ using HTML, Tailwind CSS, JavaScript, and AI**

*Last updated: September 2024*
