# Testing Checklist

## Quick Start

```bash
cd /Users/navneet/Downloads/new
npm run dev
```

Visit: http://localhost:3000

---

## 1. Marketing Landing Page (/)

### Visual Elements
- [ ] Page loads without errors
- [ ] Hero section visible with gradient badge "🔥 New Features"
- [ ] Two CTAs present: "Try GyaanForge" (primary) + "Watch Demo" (outline)
- [ ] Parallax visual placeholder (16:9 ratio, gradient background)
- [ ] 7 feature highlights in grid layout
- [ ] 3-column mode comparison (Beginner/Student/Mastery)
- [ ] 2 sticky media sections (Hybrid Intelligence + Architecture)
- [ ] Performance stats section
- [ ] Documentation CTA with purple gradient background
- [ ] Try section with video modal trigger

### Animations
- [ ] Hero fades in on load
- [ ] Highlights grid items stagger reveal (watch for sequential animation)
- [ ] Sticky media sections: media pins while text scrolls (desktop only)
- [ ] Sticky media opacity fades on scroll
- [ ] Video modal: smooth open/close transitions
- [ ] Video modal: backdrop darkens background
- [ ] All animations disabled if system prefers reduced motion

### Smooth Scrolling
- [ ] Page scrolls smoothly (buttery feel, not jumpy)
- [ ] Sub-nav is sticky at top
- [ ] Sub-nav section links scroll smoothly to anchors
- [ ] Sub-nav highlights active section (center-based detection)
- [ ] Sub-nav offset accounts for header height automatically

### Interactions
- [ ] "Try GyaanForge" button → navigates to /learn
- [ ] "Watch Demo" button → opens video modal
- [ ] Video modal close button (×) works
- [ ] Video modal ESC key closes modal
- [ ] Video modal backdrop click closes modal
- [ ] Sub-nav section links scroll to respective sections

### Dark Mode
- [ ] Toggle theme button in header (if Header present)
- [ ] Text colors invert properly
- [ ] Backgrounds invert properly
- [ ] Borders maintain visibility
- [ ] Gradient badges remain colorful
- [ ] Cards maintain proper contrast

### Responsive (resize browser)
- [ ] Desktop (>1024px): Sticky media sections work
- [ ] Tablet (768-1024px): Grid collapses to 2 columns
- [ ] Mobile (<768px): Sticky media sections stack vertically
- [ ] Mobile: Sub-nav scrolls horizontally or stacks
- [ ] Mobile: Hero text sizes appropriately
- [ ] Mobile: Buttons stack or remain inline

---

## 2. Features Page (/features)

### Visual Elements
- [ ] Page loads at /features
- [ ] Title: "Powerful Features for Every Learner"
- [ ] 3 category sections: Learning Modes, Intelligence, Developer Experience
- [ ] 9 feature cards total (3 per category)
- [ ] Each card: icon + title + description
- [ ] Proper spacing between categories

### Animations
- [ ] Cards fade in when scrolling into view
- [ ] No stagger (all cards in viewport animate together)
- [ ] Smooth scroll enabled (Lenis)

### Navigation
- [ ] Sub-nav present (if using MarketingSubNav)
- [ ] Back to home link works
- [ ] Dark mode toggle works

---

## 3. Learning App (/learn)

### Header
- [ ] GyaanForge logo with hammer emoji (⚒️)
- [ ] Mode toggle: Beginner/Student/Pro (centered)
- [ ] Quick actions menu (3-dot menu)
- [ ] Online/Offline toggle
- [ ] Theme toggle (sun/moon icon)

### Control Bar
- [ ] "Learning Mode" label
- [ ] 4 cognitive load buttons: Overwhelmed / Balanced / Speed / Mastery
- [ ] Active button has black bg (light mode) or white bg (dark mode)
- [ ] Inactive buttons have gray text
- [ ] Status badge: "🌐 Online" (green) or "📡 Offline Mode" (yellow)

### Input Panel
- [ ] Textarea visible with placeholder text
- [ ] Placeholder changes based on selected mode (Beginner/Student/Pro)
- [ ] Can type text freely
- [ ] Character count visible (bottom right)
- [ ] Submit button or Cmd/Ctrl+Enter hint visible

### Output Panel
- [ ] "Explanation" header with gradient text
- [ ] "AI-powered adaptive learning" subtitle
- [ ] Word count visible when output present
- [ ] Empty state when no output yet

### Functionality
- [ ] Type query in input panel
- [ ] Press Cmd+Enter (Mac) or Ctrl+Enter (Windows)
- [ ] Output panel streams response token-by-token
- [ ] Loading indicator appears during streaming
- [ ] Markdown renders correctly (headings, lists, code blocks)
- [ ] Syntax highlighting works for code blocks
- [ ] Links are clickable
- [ ] Tables render (if applicable)

### Cognitive Load Modes
- [ ] Switch to "Overwhelmed" → explanations should be simpler (ELI5 style)
- [ ] Switch to "Balanced" → moderate detail
- [ ] Switch to "Speed" → concise bullet points
- [ ] Switch to "Mastery" → deep technical detail

### Quick Actions
- [ ] Click quick actions menu (3 dots)
- [ ] "Clear Input" → clears textarea
- [ ] "Example Query" → populates textarea with sample
- [ ] "Toggle Dark Mode" → switches theme
- [ ] "Export Notes" → downloads .md file with output

### Animations (Micro-interactions)
- [ ] Cognitive load buttons: scale on hover (subtle)
- [ ] Cognitive load buttons: scale on tap/click (subtle)
- [ ] Input/Output panels: fade in on page load
- [ ] No scroll-driven animations (clean, functional)

### Dark Mode
- [ ] Toggle theme
- [ ] Header background changes
- [ ] Control bar background changes
- [ ] Input panel background changes
- [ ] Output panel background changes
- [ ] Text remains readable
- [ ] Borders maintain visibility

### Responsive
- [ ] Desktop: Input and Output side-by-side
- [ ] Mobile: Input and Output stack vertically
- [ ] Header: Mode toggle centered, actions on right
- [ ] Control bar: Stacks on mobile

---

## 4. API Endpoint (/api/explain)

### Direct Test (optional)
```bash
curl -X POST http://localhost:3000/api/explain \
  -H "Content-Type: application/json" \
  -d '{"query":"Explain async/await","mode":"Student","cognitiveLoad":"balanced"}'
```

- [ ] Response streams back (Server-Sent Events)
- [ ] Tokens arrive incrementally
- [ ] Complete explanation returns
- [ ] No errors in terminal/console

### Integrated Test (via /learn)
- [ ] Submit query from /learn page
- [ ] Watch Network tab in DevTools
- [ ] POST request to /api/explain
- [ ] Response status 200
- [ ] Response body streams

---

## 5. Cross-Browser Testing

### Chrome
- [ ] All routes load
- [ ] Smooth scrolling works
- [ ] Animations play correctly
- [ ] Dark mode works
- [ ] No console errors

### Firefox
- [ ] All routes load
- [ ] Smooth scrolling works
- [ ] Animations play correctly
- [ ] Dark mode works
- [ ] No console errors

### Safari
- [ ] All routes load
- [ ] Smooth scrolling works
- [ ] Animations play correctly
- [ ] Dark mode works
- [ ] No console errors
- [ ] Backdrop blur works (glass effect)

### Edge
- [ ] All routes load
- [ ] Smooth scrolling works
- [ ] Animations play correctly
- [ ] Dark mode works
- [ ] No console errors

---

## 6. Accessibility Testing

### Keyboard Navigation
- [ ] Tab through all interactive elements
- [ ] Focus indicators visible (blue/purple rings)
- [ ] Enter/Space activates buttons
- [ ] Cmd/Ctrl+Enter submits in textarea
- [ ] ESC closes video modal

### Reduced Motion
**Enable in System Preferences:**
- macOS: System Preferences → Accessibility → Display → Reduce motion
- Windows: Settings → Ease of Access → Display → Show animations

**Then test:**
- [ ] Marketing landing: No scroll reveals
- [ ] Marketing landing: No stagger animations
- [ ] Marketing landing: No parallax effects
- [ ] Learning app: No fade-ins
- [ ] Learning app: No button scale effects

### Screen Reader (optional)
- [ ] VoiceOver (Mac) or NVDA (Windows)
- [ ] Headers announced correctly (h1, h2, h3)
- [ ] Buttons have clear labels
- [ ] Form inputs have labels/placeholders
- [ ] ARIA attributes respected

---

## 7. Performance Testing

### Lighthouse Audit
1. Open DevTools (F12)
2. Go to Lighthouse tab
3. Select "Performance" + "Accessibility" + "Best Practices"
4. Run audit

**Target Scores:**
- [ ] Performance: >85
- [ ] Accessibility: >90
- [ ] Best Practices: >90

### Bundle Size
Already verified in build:
- [ ] Landing: 141 kB ✅
- [ ] Features: 92.7 kB ✅
- [ ] Learn: 400 kB ✅

### Loading Speed
- [ ] Landing page: <2s First Contentful Paint
- [ ] Features page: <1.5s First Contentful Paint
- [ ] Learn page: <2.5s First Contentful Paint (larger bundle)

---

## 8. Error Scenarios

### Network Errors
- [ ] Disconnect internet
- [ ] Try submitting query in /learn
- [ ] Offline mode badge shows "📡 Offline Mode"
- [ ] Graceful error message or local fallback

### Invalid Input
- [ ] Submit empty query in /learn
- [ ] Should show validation error or do nothing
- [ ] No JavaScript errors in console

### 404 Routes
- [ ] Visit /nonexistent-page
- [ ] Should show 404 page
- [ ] No console errors

---

## 9. Build & Production

### Production Build
```bash
npm run build
```

- [ ] Build completes successfully
- [ ] No TypeScript errors
- [ ] No ESLint errors
- [ ] All routes listed in build output
- [ ] Bundle sizes match expectations

### Production Server
```bash
npm run build
npm run start
```

- [ ] Server starts on port 3000
- [ ] All routes accessible
- [ ] Smooth scrolling works
- [ ] Animations work
- [ ] API endpoint functional

---

## 10. Developer Experience

### Code Quality
- [ ] All files have proper imports
- [ ] No unused imports or variables
- [ ] TypeScript types are correct
- [ ] Components are properly typed
- [ ] No `any` types (except necessary)

### Documentation
- [ ] ARCHITECTURE.md comprehensive
- [ ] UI_PRIMITIVES.md clear examples
- [ ] ANIMATION_GUIDE.md detailed patterns
- [ ] IMPLEMENTATION_SUMMARY.md complete
- [ ] ROUTE_MAP.md visual structure

### Code Organization
- [ ] Route groups properly separated
- [ ] UI primitives in /components/ui/
- [ ] Marketing components in /components/marketing/
- [ ] Hooks in /hooks/
- [ ] Contexts in /contexts/
- [ ] Types in /types/

---

## Issues Found

### High Priority
1. _____________________________________________
2. _____________________________________________
3. _____________________________________________

### Medium Priority
1. _____________________________________________
2. _____________________________________________
3. _____________________________________________

### Low Priority / Nice-to-Have
1. _____________________________________________
2. _____________________________________________
3. _____________________________________________

---

## Sign-Off

### Tested By
Name: ___________________________
Date: ___________________________

### Testing Environment
- OS: ___________________________
- Browser(s): ___________________________
- Screen Size: ___________________________
- Node Version: ___________________________
- npm Version: ___________________________

### Overall Status
- [ ] ✅ All tests passed - Ready for deployment
- [ ] ⚠️ Minor issues found - Deploy with caution
- [ ] ❌ Major issues found - Do not deploy

### Notes
________________________________________________
________________________________________________
________________________________________________
________________________________________________
