# 🎓 GyaanForge

<div align="center">

**An intelligent AI-powered learning platform that adapts to your skill level**

[![Next.js](https://img.shields.io/badge/Next.js-14.1.0-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Groq](https://img.shields.io/badge/Groq-Llama_3.3_70B-orange?style=for-the-badge)](https://groq.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38bdf8?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)

[Features](#-features) • [Demo](#-demo) • [Installation](#-installation) • [Usage](#-usage) • [Tech Stack](#-tech-stack)

</div>

---

## 🌟 Overview

GyaanForge is a next-generation learning companion that combines the power of AI with adaptive learning principles. Whether you're a complete beginner taking your first steps in programming or a seasoned professional debugging complex systems, GyaanForge tailors its explanations to match your expertise level.

**What makes GyaanForge special?**
- 🎯 **Adaptive Intelligence**: Three distinct learning modes that adjust explanation complexity
- 🌐 **Hybrid AI System**: Seamlessly switches between online AI (Groq) and intelligent offline mode
- 🎨 **Premium UX**: Beautifully crafted interface with smooth animations and transitions
- ⚡ **Lightning Fast**: Powered by Groq's ultra-fast Llama 3.3 70B model
- 🌓 **Smart Theme System**: Automatic dark mode with persistent preferences
- 📱 **Fully Responsive**: Optimized experience across all devices

---

## ✨ Features

### 🎯 Adaptive Learning Modes

**🌱 Beginner Mode**
- Simple, non-technical language with real-world analogies
- Breaks down concepts into digestible chunks
- Includes helpful examples and visual explanations
- Perfect for those just starting their coding journey

**📚 Student Mode**
- Balanced explanations with technical terminology
- Detailed step-by-step breakdowns
- Code structure analysis and best practices
- Ideal for learners actively studying programming

**💼 Pro Mode**
- Concise, technical explanations for experienced developers
- Performance analysis (time/space complexity)
- Architecture patterns and optimization suggestions
- Designed for professionals and advanced practitioners

### 🌐 Online/Offline Hybrid System

**Online Mode (Groq AI)**
- Powered by Groq's Llama 3.3 70B model
- Ultra-fast streaming responses
- Advanced code analysis and explanations
- Context-aware intelligent assistance

**Offline Mode (Smart Fallback)**
- Intelligent local code analysis when offline or API unavailable
- Automatic code type detection (functions, classes, loops, etc.)
- Extracts function/class names and analyzes structure
- Provides metrics like LOC, complexity, and error handling presence
- Mode-specific offline responses matching your learning level

**Automatic Detection**
- Monitors internet connectivity in real-time
- Seamlessly switches between online and offline modes
- Visual indicator shows current mode (green = online, orange = offline)
- Manual toggle available for forced offline mode

### 🎨 Premium UI/UX Features

- **Gradient Accents**: Beautiful gradients throughout the interface
- **Smooth Animations**: Micro-interactions and transitions
- **Icon Integration**: Visual icons for all learning modes and actions
- **Smart Theme Toggle**: System-aware dark mode with persistent preferences
- **Responsive Design**: Mobile-first approach with desktop optimization
- **Accessibility**: ARIA labels, keyboard navigation, screen reader support
- **Loading States**: Elegant loading animations during AI responses
- **Syntax Highlighting**: Code blocks with proper syntax highlighting

### ⚡ Performance & Developer Experience

- **Streaming Responses**: Real-time AI response streaming
- **Keyboard Shortcuts**: `Cmd/Ctrl + Enter` to submit
- **Optimized Build**: Production-ready with Next.js optimization
- **Type Safety**: Full TypeScript coverage
- **Error Handling**: Graceful fallbacks and error messages
- **Environment Management**: Secure API key handling

---

## 🎬 Demo

### Learning Modes in Action

```
Beginner Mode:
"Think of a function like a recipe. Just as a recipe takes ingredients 
(inputs) and gives you a dish (output), a function takes data and 
produces a result!"

Student Mode:
"This is a JavaScript arrow function that takes two parameters and 
returns their sum. Arrow functions provide a concise syntax and 
lexically bind the 'this' value..."

Pro Mode:
"ES6 arrow function with implicit return. Time complexity: O(1), 
Space complexity: O(1). Consider using for pure functions and 
callbacks due to lexical 'this' binding..."
```

### Online/Offline Switching

- **🌐 Online**: Green pulsing indicator → "Using Groq Llama 3.3 70B"
- **📱 Offline**: Orange indicator → "Using Offline Mode"
- **Automatic**: Detects connection loss and switches seamlessly

---

## 🚀 Installation

### Prerequisites

- **Node.js** 18.0 or higher
- **npm** or **yarn** package manager
- **Groq API Key** (free tier available)

### Step 1: Clone the Repository

```bash
git clone https://github.com/Navneet-55/new1.git
cd new1
```

### Step 2: Install Dependencies

```bash
npm install
# or
yarn install
```

### Step 3: Environment Configuration

1. Copy the example environment file:
```bash
cp .env.example .env.local
```

2. Get your free Groq API key:
   - Visit [https://console.groq.com/keys](https://console.groq.com/keys)
   - Sign up for a free account
   - Create a new API key
   - Copy the key (starts with `gsk_`)

3. Add your API key to `.env.local`:
```env
# Groq API Configuration
# Get your free API key from: https://console.groq.com/keys
GROQ_API_KEY=gsk_your_api_key_here
```

### Step 4: Run Development Server

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Step 5: Build for Production

```bash
npm run build
npm start
# or
yarn build
yarn start
```

---

## 📖 Usage

### Basic Usage

1. **Select Your Learning Mode**
   - Click on Beginner 🌱, Student 📚, or Pro 💼 mode
   - The interface adapts to your selection

2. **Enter Your Query**
   - Paste code snippets
   - Ask programming questions
   - Submit error messages for debugging
   - Request explanations of concepts

3. **Get Instant Explanations**
   - Press "Explain" button or use `Cmd/Ctrl + Enter`
   - Watch as AI streams the response in real-time
   - Read tailored explanations matching your skill level

### Advanced Features

**Manual Offline Mode**
- Click the online/offline toggle in the header
- Useful for testing offline functionality
- Conserves API usage when needed

**Theme Switching**
- Click the sun/moon icon to toggle dark mode
- Preference is saved locally
- Automatically detects system theme

**Keyboard Shortcuts**
- `Cmd/Ctrl + Enter`: Submit query
- `Tab`: Navigate between controls
- `Esc`: Clear input (when focused)

### Example Queries

**For Beginners:**
```
"What does this code do?"
const greeting = "Hello World";
console.log(greeting);
```

**For Students:**
```
"Explain this sorting algorithm"
function bubbleSort(arr) {
  for (let i = 0; i < arr.length; i++) {
    for (let j = 0; j < arr.length - i - 1; j++) {
      if (arr[j] > arr[j + 1]) {
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
      }
    }
  }
  return arr;
}
```

**For Professionals:**
```
"Analyze the performance implications"
const memoizedFibonacci = (() => {
  const cache = {};
  return (n) => {
    if (n in cache) return cache[n];
    if (n <= 1) return n;
    cache[n] = memoizedFibonacci(n - 1) + memoizedFibonacci(n - 2);
    return cache[n];
  };
})();
```

---

## 🛠️ Tech Stack

### Core Framework
- **[Next.js 14.1.0](https://nextjs.org/)**: React framework with App Router
- **[React 18.2.0](https://react.dev/)**: UI library with hooks and context
- **[TypeScript 5.0+](https://www.typescriptlang.org/)**: Type-safe development

### AI Integration
- **[Groq SDK](https://www.npmjs.com/package/groq-sdk)**: Official Groq client library
- **Model**: Llama 3.3 70B Versatile (ultra-fast inference)
- **Streaming**: Real-time response streaming via ReadableStream API

### Styling & UI
- **[Tailwind CSS 3.4+](https://tailwindcss.com/)**: Utility-first CSS framework
- **[react-markdown](https://www.npmjs.com/package/react-markdown)**: Markdown rendering
- **[remark-gfm](https://www.npmjs.com/package/remark-gfm)**: GitHub Flavored Markdown
- **[react-syntax-highlighter](https://www.npmjs.com/package/react-syntax-highlighter)**: Code syntax highlighting

### State Management
- **React Context API**: Global state for theme, mode, and online/offline status
- **Local Storage**: Persistent preferences
- **Browser Events**: Online/offline detection via `navigator.onLine`

### Development Tools
- **ESLint**: Code linting
- **PostCSS**: CSS processing
- **Autoprefixer**: CSS vendor prefixing

---

## 📁 Project Structure

```
new/
├── app/                          # Next.js app directory
│   ├── api/                      # API routes
│   │   └── explain/
│   │       └── route.ts          # AI explanation endpoint (Groq + offline)
│   ├── layout.tsx                # Root layout with providers
│   ├── page.tsx                  # Main application page
│   └── globals.css               # Global styles
├── components/                   # React components
│   ├── Header.tsx                # App header with toggles
│   ├── InputPanel.tsx            # Input area with mode selector
│   ├── OutputPanel.tsx           # Response display area
│   ├── ModeToggle.tsx            # Learning mode selector
│   ├── ThemeToggle.tsx           # Dark mode toggle
│   ├── OnlineOfflineToggle.tsx   # Connection status toggle
│   └── LoadingSpinner.tsx        # Loading animation
├── contexts/                     # React contexts
│   ├── ModeContext.tsx           # Learning mode state
│   ├── ThemeContext.tsx          # Dark mode state
│   └── OnlineOfflineContext.tsx  # Connection state
├── types/                        # TypeScript definitions
│   └── index.ts                  # Shared type definitions
├── public/                       # Static assets
├── .env.local                    # Environment variables (gitignored)
├── .env.example                  # Environment template
├── tailwind.config.ts            # Tailwind configuration
├── tsconfig.json                 # TypeScript configuration
├── next.config.js                # Next.js configuration
└── package.json                  # Project dependencies
```

---

## 🔧 Configuration

### Environment Variables

```env
# Required: Groq API Key
GROQ_API_KEY=gsk_your_api_key_here
```

### Model Configuration

The app uses **Llama 3.3 70B Versatile** by default. To change the model, edit [app/api/explain/route.ts](app/api/explain/route.ts):

```typescript
const stream = await groq.chat.completions.create({
  model: 'llama-3.3-70b-versatile', // Change model here
  messages: [{ role: 'user', content: prompt }],
  stream: true,
  temperature: 0.7,
  max_tokens: 1024,
});
```

**Available Groq Models:**
- `llama-3.3-70b-versatile` (recommended)
- `llama-3.1-8b-instant` (faster, smaller)
- `mixtral-8x7b-32768` (deprecated)
- See [Groq Models](https://console.groq.com/docs/models) for full list

### Offline Mode Customization

Offline responses can be customized in [app/api/explain/route.ts](app/api/explain/route.ts) under the `generateLocalResponse` function.

---

## 🌐 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import project on [Vercel](https://vercel.com)
3. Add environment variable: `GROQ_API_KEY`
4. Deploy!

### Other Platforms

The app can be deployed to any platform supporting Next.js:
- **Netlify**: Use Next.js build plugin
- **Railway**: Auto-detects Next.js
- **AWS Amplify**: Full Next.js support
- **Docker**: Create Dockerfile with Node.js 18+

---

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Commit your changes**: `git commit -m 'Add amazing feature'`
4. **Push to the branch**: `git push origin feature/amazing-feature`
5. **Open a Pull Request**

### Development Guidelines

- Follow the existing code style
- Add TypeScript types for all new code
- Test both online and offline modes
- Ensure all three learning modes work correctly
- Update README if adding new features

---

## 🐛 Troubleshooting

### Common Issues

**"Offline mode showing despite API key"**
- Check if your API key is correct in `.env.local`
- Restart the dev server after adding the key
- Verify the model is not deprecated (check Groq console)

**"API calls failing"**
- Ensure you have internet connection
- Check Groq API status: [https://status.groq.com](https://status.groq.com)
- Verify API key has sufficient quota
- Check browser console for detailed errors

**"Dark mode not persisting"**
- Clear browser local storage
- Check browser privacy settings (localStorage must be enabled)

**"Streaming not working"**
- Ensure fetch API streaming is supported (modern browsers)
- Check for ad blockers or privacy extensions blocking requests

---

## 📝 Changelog

### v1.2.0 (Latest)
- ✅ Migrated from OpenAI to Groq API (Llama 3.3 70B)
- ✅ Added hybrid online/offline system with automatic detection
- ✅ Enhanced offline mode with intelligent code analysis
- ✅ Updated to latest Groq model (llama-3.3-70b-versatile)
- ✅ Added connection status toggle and visual indicators
- ✅ Improved UI with icons, gradients, and animations

### v1.1.0
- ✅ Complete UI/UX refinement
- ✅ Added accessibility features
- ✅ Implemented dark mode system
- ✅ Added keyboard shortcuts

### v1.0.0
- ✅ Initial release
- ✅ Three learning modes
- ✅ OpenAI integration
- ✅ Basic streaming support

---

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details

---

## 🙏 Acknowledgments

- **[Groq](https://groq.com/)**: For providing ultra-fast AI inference
- **[Meta AI](https://ai.meta.com/)**: For the Llama 3.3 model
- **[Next.js](https://nextjs.org/)**: For the amazing React framework
- **[Vercel](https://vercel.com/)**: For seamless deployment
- **[Tailwind CSS](https://tailwindcss.com/)**: For the utility-first CSS framework

---

## 📧 Contact & Support

- **Issues**: [GitHub Issues](https://github.com/Navneet-55/new1/issues)
- **Discussions**: [GitHub Discussions](https://github.com/Navneet-55/new1/discussions)
- **Repository**: [github.com/Navneet-55/new1](https://github.com/Navneet-55/new1)

---

<div align="center">

**Built with ❤️ by Navneet**

⭐ Star this repo if you find it helpful!

</div>
