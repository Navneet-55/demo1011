# GyaanForge Route Map

## Visual Structure

```
┌─────────────────────────────────────────────────────────────────┐
│                         ROOT DOMAIN                              │
│                    https://gyaanforge.com                        │
└─────────────────────────────────────────────────────────────────┘
                              │
            ┌─────────────────┴──────────────────┐
            │                                    │
┌───────────▼──────────┐              ┌─────────▼──────────┐
│   MARKETING ROUTES   │              │    APP ROUTES      │
│   (marketing)/       │              │    (app)/          │
│                      │              │                    │
│  - Smooth scroll     │              │  - No smooth scroll│
│  - Cinematic UX      │              │  - Functional UI   │
│  - Lenis provider    │              │  - Micro-motions   │
└──────────────────────┘              └────────────────────┘
           │                                     │
     ┌─────┴─────┬──────────┐            ┌─────┴──────┐
     │           │          │            │            │
┌────▼────┐ ┌───▼────┐ ┌───▼────┐  ┌───▼──────┐ ┌───▼───────┐
│    /    │ │/features│ │  /pro  │  │  /learn  │ │/api/explain│
│         │ │         │ │        │  │          │ │            │
│ Landing │ │Features │ │ Legacy │  │  Main    │ │  Streaming │
│  Page   │ │ Detail  │ │  Page  │  │Learning  │ │ AI Endpoint│
│         │ │         │ │        │  │Interface │ │            │
│ 141 kB  │ │ 92.7 kB │ │ 148 kB │  │  400 kB  │ │   Dynamic  │
└─────────┘ └─────────┘ └────────┘  └──────────┘ └────────────┘
```

## Route Details

### Marketing Routes (/)

#### Landing Page: `/`
**File**: `app/(marketing)/page.tsx`
**Layout**: `app/(marketing)/layout.tsx` (includes LenisProvider)

**Sections**:
1. Sub-navigation (sticky)
2. Hero (gradient badge + CTAs)
3. Highlights grid (7 features)
4. Mode comparison (3 columns)
5. Hybrid intelligence (sticky media)
6. Architecture (sticky media)
7. Performance stats
8. Documentation CTA
9. Try section (video modal)

**Bundle**: 10.7 kB page + 141 kB shared JS
**Rendering**: Static (prerendered)

---

#### Features Page: `/features`
**File**: `app/(marketing)/features/page.tsx`
**Layout**: `app/(marketing)/layout.tsx` (includes LenisProvider)

**Categories**:
1. Learning Modes (3 cards)
2. Intelligence (3 cards)
3. Developer Experience (3 cards)

**Bundle**: 3.25 kB page + 92.7 kB shared JS
**Rendering**: Static (prerendered)

---

### App Routes (/learn)

#### Learning Interface: `/learn`
**File**: `app/(app)/learn/page.tsx`
**Layout**: `app/(app)/layout.tsx` (minimal wrapper)

**Components**:
- Header (logo, mode toggle, quick actions, theme toggle)
- Control bar (cognitive load selector, status badge)
- Input panel (textarea with mode-specific placeholder)
- Output panel (markdown rendering with syntax highlighting)

**Features**:
- Streaming AI responses
- Cognitive load adaptation (4 modes)
- Online/offline status
- Export notes (markdown)
- Mode integration (Beginner/Student/Pro)

**Bundle**: 275 kB page + 400 kB shared JS
**Rendering**: Dynamic (server-rendered on demand)

---

### API Routes

#### Explain Endpoint: `/api/explain`
**File**: `app/api/explain/route.ts`

**Method**: POST
**Input**: `{ query: string, mode: string, cognitiveLoad: string }`
**Output**: Streaming text (Server-Sent Events)

**Features**:
- Adaptive explanations based on mode + cognitive load
- Streaming token delivery
- Error handling with fallback responses

**Bundle**: 0 B (server-side only)
**Rendering**: Dynamic (API endpoint)

---

## Navigation Flow

### User Journey: First Visit

```
User lands at /
     │
     ├─► Sees hero with gradient badge "New Features"
     ├─► Scrolls through highlights (7 features with stagger reveal)
     ├─► Views mode comparison (Beginner/Student/Mastery)
     ├─► Explores hybrid intelligence (sticky media section)
     ├─► Reviews architecture (sticky media section)
     ├─► Checks performance stats
     ├─► Reads documentation CTA
     └─► Clicks "Try GyaanForge" → Redirects to /learn
```

### User Journey: Learning Session

```
User at /learn
     │
     ├─► Selects cognitive load mode (overwhelmed/balanced/speed/mastery)
     ├─► Selects learning mode (Beginner/Student/Pro)
     ├─► Enters query in input panel
     ├─► Submits (Cmd/Ctrl+Enter)
     ├─► Sees streaming AI response in output panel
     ├─► Reads markdown-rendered explanation
     └─► Exports notes or clears input for next query
```

### User Journey: Feature Exploration

```
User at /
     │
     ├─► Clicks "Features" in sub-nav
     ├─► Navigated to /features
     ├─► Browses learning modes section
     ├─► Browses intelligence section
     ├─► Browses developer experience section
     └─► Returns to / or navigates to /learn
```

---

## Component Tree

### Marketing Layout Tree
```
(marketing)/layout.tsx
├─► LenisProvider
│   └─► {children}
│       ├─► page.tsx (Landing)
│       │   ├─► MarketingSubNav
│       │   ├─► Hero
│       │   ├─► HighlightsGrid
│       │   ├─► CompareBlock
│       │   ├─► StickyMediaSection × 2
│       │   ├─► Container (stats)
│       │   ├─► Container (docs CTA)
│       │   ├─► Container (try section)
│       │   └─► VideoModal
│       │
│       └─► features/page.tsx
│           └─► Container
│               └─► Card × 9 (3 categories)
```

### App Layout Tree
```
(app)/layout.tsx
└─► {children}
    └─► learn/page.tsx
        ├─► Header
        │   ├─► Logo
        │   ├─► ModeToggle
        │   ├─► QuickActions
        │   ├─► OnlineOfflineToggle
        │   └─► Theme Toggle
        ├─► Control Bar
        │   ├─► Cognitive Load Selector (segmented control)
        │   └─► Status Badge (online/offline)
        ├─► Main Content
        │   ├─► InputPanel
        │   │   └─► Textarea (mode-specific placeholder)
        │   └─► OutputPanel
        │       └─► ReactMarkdown (syntax highlighting)
```

---

## Shared Infrastructure

### Context Providers (Root Layout)
```
app/layout.tsx
└─► html
    └─► body
        └─► ThemeProvider
            └─► ModeProvider
                └─► OnlineOfflineProvider
                    └─► KnowledgeGraphProvider
                        └─► ErrorDebuggerProvider
                            └─► LearningSessionProvider
                                └─► {children} (route-specific layouts)
```

**Available to all routes**:
- Theme context (dark/light mode)
- Mode context (Beginner/Student/Pro)
- Online/Offline context
- Knowledge graph context
- Error debugger context
- Learning session context

---

## Animation Zones

### Marketing Routes (Cinematic)
```
/              /features
│              │
├─► Scroll     ├─► Scroll
│   reveals    │   reveals
├─► Stagger    ├─► Fade-in
├─► Parallax   │   cards
├─► Sticky     │
│   media      │
└─► Modals     │
```

**Effects**:
- Scroll-driven opacity/position
- Viewport-triggered animations
- Stagger delays (80ms)
- Sticky positioning (desktop)
- Modal entry/exit transitions

### App Routes (Functional)
```
/learn
│
├─► Micro-
│   interactions
│   (buttons)
├─► Fade-in
│   (content)
└─► No scroll
    effects
```

**Effects**:
- Scale on hover/tap (1.02/0.98)
- Opacity transitions (300ms)
- No scroll-driven animations
- No parallax or sticky effects

---

## Performance Metrics

### Bundle Sizes
| Route | Page Size | First Load JS | Rendering |
|-------|-----------|---------------|-----------|
| `/` | 10.7 kB | 141 kB | Static |
| `/features` | 3.25 kB | 92.7 kB | Static |
| `/learn` | 275 kB | 400 kB | Dynamic |
| `/pro` | 17.9 kB | 148 kB | Static |
| `/api/explain` | 0 B | N/A | Dynamic |

### Shared Chunks (84.4 kB)
- `69-xxx.js`: 29.1 kB (React + utilities)
- `fd9d1056-xxx.js`: 53.4 kB (Next.js core)
- Other: 1.96 kB (misc)

### Page-Specific Additions
- **Landing** (+56.6 kB): Lenis + Framer Motion + marketing components
- **Features** (+8.3 kB): Framer Motion only
- **Learn** (+315.6 kB): Full app features (streaming, markdown, syntax highlighting)

---

## URL Examples

### Marketing
```
https://gyaanforge.com/
https://gyaanforge.com/features
https://gyaanforge.com/#overview
https://gyaanforge.com/#highlights
https://gyaanforge.com/#modes
```

### App
```
https://gyaanforge.com/learn
https://gyaanforge.com/learn?mode=beginner
https://gyaanforge.com/learn?mode=student&load=balanced
```

### API
```
POST https://gyaanforge.com/api/explain
Content-Type: application/json
Body: { "query": "...", "mode": "student", "cognitiveLoad": "balanced" }
```

---

## Browser Testing Checklist

### Marketing Routes
- [ ] Landing page loads at `/`
- [ ] Smooth scrolling works (Lenis)
- [ ] Sub-nav highlights active section
- [ ] Sub-nav scrolls to section on click
- [ ] Hero gradient badge visible
- [ ] Highlights grid staggers correctly
- [ ] Sticky media sections work (desktop)
- [ ] Video modal opens/closes
- [ ] Dark mode toggles properly
- [ ] Mobile responsive (hamburger menu if needed)
- [ ] Features page loads at `/features`
- [ ] Feature cards animate on scroll

### App Routes
- [ ] Learn page loads at `/learn`
- [ ] Header displays correctly
- [ ] Mode toggle switches modes
- [ ] Cognitive load selector works
- [ ] Status badge shows online/offline
- [ ] Input panel accepts text
- [ ] Submit works (Cmd/Ctrl+Enter)
- [ ] Output streams in real-time
- [ ] Markdown renders with syntax highlighting
- [ ] Export notes downloads .md file
- [ ] Quick actions menu functional
- [ ] Theme toggle switches dark/light
- [ ] No smooth scrolling (standard scroll)

### Accessibility
- [ ] Reduced motion disables animations
- [ ] Keyboard navigation works
- [ ] Focus indicators visible
- [ ] ARIA labels present
- [ ] Screen reader friendly

---

## Development Commands

```bash
# Start dev server
npm run dev

# Visit marketing landing
open http://localhost:3000/

# Visit features page
open http://localhost:3000/features

# Visit learning app
open http://localhost:3000/learn

# Build for production
npm run build

# Check bundle sizes
npm run build | grep "Route (app)"
```
