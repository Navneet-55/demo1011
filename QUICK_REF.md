# Quick Reference

## Commands
```bash
npm run dev           # Development
npm run build         # Production build
npm start             # Production start
npm run lint:fix      # Fix linting issues
npm run type-check    # TypeScript check
```

## Environment
```bash
GROQ_API_KEY=gsk_your_key_here
```

## Routes
- `/` - Main app (redirects to /learn)
- `/learn` - Learning interface
- `/features` - Feature showcase
- `/api/explain` - AI API

## 7 Learning Features
1. Knowledge Graph - Concept relationships
2. Error Debugger - Code analysis
3. Cognitive Load - Learning capacity
4. Timebox - Time management
5. Perspective - View selection
6. Practice - Interactive exercises
7. Quiz - Self-assessment

## Tech Stack
- Next.js 14.1 - Framework
- TypeScript 5.3 - Language
- Tailwind 3.4 - Styling
- Framer Motion 12.26 - Animation
- Groq SDK 0.37 - AI

## Files to Know
- `app/layout.tsx` - Root layout
- `app/(app)/learn/page.tsx` - Main page
- `components/` - UI components
- `contexts/` - State management
- `lib/` - Utilities
- `types/` - TypeScript types

## Deployment
```bash
vercel deploy --prod
# or
npm run build
npm start
```

---
[Full Docs](README.md) | [Architecture](ARCHITECTURE.md) | [Deploy](DEPLOYMENT_GUIDE.md)
