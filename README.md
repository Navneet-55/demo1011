# GyaanForge

AI-powered learning and developer productivity web app that adapts explanations based on your experience level.

## Features

- 🎯 **Adaptive Learning**: Three modes (Beginner, Student, Pro) with customized explanations
- 🌓 **Dark Mode**: System-aware with persistent preference
- ⚡ **Real-time Streaming**: AI responses stream in real-time
- 🎨 **Premium UI**: Clean, minimal design with smooth transitions
- 📱 **Responsive**: Desktop-first with mobile optimization
- ⌨️ **Keyboard Shortcuts**: Cmd/Ctrl + Enter to submit

## Getting Started

### Prerequisites

- Node.js 18+ 
- OpenAI API key

### Installation

1. Install dependencies:
```bash
npm install
```

2. Create `.env.local` file:
```bash
cp .env.example .env.local
```

3. Add your OpenAI API key to `.env.local`:
```
OPENAI_API_KEY=your_api_key_here
```

### Development

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build

```bash
npm run build
npm start
```

## Usage

1. Select your experience level (Beginner/Student/Pro)
2. Paste code, error messages, or ask questions
3. Press "Explain" or use Cmd/Ctrl + Enter
4. Get AI-powered explanations tailored to your level

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **AI**: OpenAI GPT-4 with Vercel AI SDK
- **Markdown**: react-markdown with syntax highlighting

## License

MIT
