# GyaanForge Architecture

## Overview
GyaanForge is an enterprise-grade AI learning companion with a dual-route architecture:
- **(marketing)**: Cinematic storytelling pages with Apple-like premium design
- **(app)**: Clean, functional learning interface with subtle micro-interactions

## Route Structure

```
app/
├── (marketing)/          # Marketing & public pages
│   ├── layout.tsx        # LenisProvider for smooth scrolling
│   ├── page.tsx          # Landing page at /
│   └── features/
│       └── page.tsx      # Features detail at /features
│
├── (app)/                # Learning application
│   ├── layout.tsx        # Minimal wrapper (no smooth scroll)
│   └── learn/
│       └── page.tsx      # Main learning interface at /learn
│
└── api/
    └── explain/          # Streaming AI explanations
```

## UI System

### Primitives (`/components/ui/primitives.tsx`)
Reusable design system components:
- **Container**: 4 responsive sizes (sm, md, lg, xl)
- **Section**: Vertical spacing wrapper
- **Card**: 3 variants (default, glass, gradient)
- **Button**: 3 variants (primary, secondary, outline) × 2 sizes (md, lg)
- **Badge**: 4 variants (default, success, warning, gradient)
- **typography**: Consistent text styles (h1-h4, lead, body, small)

### Marketing Components (`/components/marketing/`)
- **MarketingSubNav**: Sticky sub-nav with active section highlighting + Lenis scroll
- **Hero**: Gradient badge, headline, dual CTAs, parallax visual placeholder
- **HighlightsGrid**: 7 learning features with stagger reveal animation
- **StickyMediaSection**: Desktop sticky media + scrolling text chapters
- **CompareBlock**: 3-column mode comparison (Beginner/Student/Mastery)
- **VideoModal**: Accessible demo modal with AnimatePresence

## Animation Strategy

### Marketing (Cinematic)
- **Scroll reveals**: Fade + slide animations triggered by viewport intersection
- **Stagger animations**: Sequential reveal for grids/lists (0.08s delay)
- **Parallax**: Subtle opacity transforms based on scroll progress
- **Sticky sections**: Media pinned while text scrolls (desktop only)

### App (Functional)
- **Micro-interactions only**: Scale on hover/tap for buttons/controls
- **Subtle fades**: 300ms opacity transitions for content entry
- **No scroll effects**: Clean, distraction-free learning environment

### Accessibility
- `prefers-reduced-motion: reduce` → All animations disabled
- ARIA labels and semantic HTML throughout
- Keyboard navigation for all interactive elements

## Smooth Scrolling

### LenisProvider (`/app/(marketing)/layout.tsx`)
- Auto-detects header height via `data-header` attribute
- Applies offset to `scrollTo()` calls for sub-nav anchors
- Lerp smoothing: `lerp: 0.05`, `duration: 1.2`
- Only active in (marketing) routes

## Learning Modes

### Cognitive Load Adaptation
```typescript
type CognitiveLoadMode = 'overwhelmed' | 'balanced' | 'speed' | 'mastery'
```

- **Overwhelmed**: ELI5 analogies, minimal jargon, step-by-step
- **Balanced**: Clear explanations with moderate detail
- **Speed**: Concise bullet points, skip basics
- **Mastery**: Deep technical detail, edge cases, internals

### Hybrid Intelligence
- **Online**: Full LLM capabilities via API streaming
- **Offline**: Local regex + pattern matching for common errors
- **Seamless fallback**: Automatic mode detection

## Key Features

### 1. Streaming Responses
```typescript
// /api/explain route
const response = await fetch('/api/explain', {
  method: 'POST',
  body: JSON.stringify({ query, mode, cognitiveLoad })
})

const reader = response.body?.getReader()
// Incremental UI updates as tokens arrive
```

### 2. Knowledge Graphs
- Builds concept dependency trees during learning
- Identifies prerequisite gaps
- Suggests next topics based on mastery

### 3. Stuck Detection
- Monitors repeated queries on same topic
- Auto-suggests simpler explanations or alternative approaches
- Tracks learning velocity

### 4. Markdown Rendering
- Syntax highlighting via `react-syntax-highlighter`
- GitHub Flavored Markdown (tables, task lists, strikethrough)
- Auto-detects language for code blocks

## Tech Stack

### Core
- **Next.js 14.1.0**: App Router, route groups, streaming
- **React 18**: Client components, hooks, suspense
- **TypeScript**: Strict mode, comprehensive type safety
- **Tailwind CSS 3.4.1**: Utility-first styling

### Animation
- **Framer Motion 12.26.2**: Declarative animations, gestures, layout animations
- **Lenis 1.3.17**: Smooth scrolling with inertia

### Validation & Parsing
- **Zod**: Runtime schema validation for API contracts
- **ReactMarkdown**: Markdown rendering with plugins
- **remark-gfm**: GitHub Flavored Markdown support

## Build Output
```
Route (app)                              Size     First Load JS
├ ○ /                                    10.7 kB         141 kB
├ ○ /features                            3.25 kB        92.7 kB
├ ○ /learn                               275 kB          400 kB
└ λ /api/explain                         0 B                0 B

○  (Static)   prerendered as static content
λ  (Dynamic)  server-rendered on demand
```

## Development

### Local Setup
```bash
npm install
npm run dev       # Development server on http://localhost:3000
npm run build     # Production build
npm run lint      # ESLint validation
```

### Routes
- `/` - Marketing landing page
- `/features` - Features detail page
- `/learn` - Main learning interface
- `/api/explain` - Streaming AI endpoint

## Design Philosophy

### Marketing Pages
- **Apple-inspired**: Premium feel, cinematic storytelling
- **Smooth scrolling**: Lenis for buttery 60fps
- **Scroll-driven UX**: Sticky sections, parallax, reveals
- **Conversion-focused**: Clear CTAs, feature highlights

### App Interface
- **Functional-first**: Zero friction, maximum clarity
- **Adaptive UI**: Responds to cognitive load mode
- **Streaming-native**: Real-time feedback as AI generates
- **Offline-capable**: Graceful degradation without connectivity

## Future Enhancements
- [ ] Session persistence (IndexedDB for offline storage)
- [ ] Export to Notion/Markdown/PDF
- [ ] Multi-language support (i18n)
- [ ] Voice input for queries
- [ ] Collaborative learning sessions
- [ ] Progress analytics dashboard
