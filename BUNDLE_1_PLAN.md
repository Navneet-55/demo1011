# Bundle 1: Command Palette + UI Primitives - FILE PLAN

## 📋 REPO SCAN SUMMARY

### Current Architecture
✅ **Next.js 14 App Router** with TypeScript (strict mode)  
✅ **Streaming API** at `/app/api/explain/route.ts`  
✅ **10 Features Implemented**: Cognitive Load, Knowledge Graph, Error Debugger, Timebox, Perspective, Practice, Quiz, Stuck Detector, Meta Trace, Future-You  
✅ **Storage**: localStorage + storage-wrapper.ts with versioning  
✅ **UI Components**: 24+ React components using Tailwind CSS  
✅ **No heavy deps**: Uses groq-sdk, d3, react-markdown, react-syntax-highlighter  
✅ **Types**: Centralized in `/types/` directory (index.ts, api-contract.ts, learning-features.ts, etc.)  
✅ **Layout**: Header (sticky) → Main content area (InputPanel, OutputPanel) → Tabbed interface (Knowledge Graph, Error Debugger, etc.)

### Key Files for Integration
- **Main page**: `/app/page.tsx` (533 lines) - renders Header, InputPanel, OutputPanel, all panels
- **Header**: `/components/Header.tsx` - sticky, has theme toggle, mode toggle, online/offline toggle
- **API route**: `/app/api/explain/route.ts` (490 lines) - handles explain requests with streaming
- **Types**: `/types/index.ts` - ExplainRequest, ExplanationTrace, Intent, Mode, CognitiveLoadMode, etc.
- **Tools**: `/lib/tools.ts` - defines tool registry (currently: learn, debug, docs, summarize, test)
- **Storage**: `/lib/storage-wrapper.ts` - localStorage with versioning
- **Constants**: `/lib/constants.ts` - LEARNING_CONSTANTS, STORAGE_KEYS, etc.

### UI/UX Current State
- Header has: Logo, ModeToggle (Beginner/Student/Pro), OnlineOfflineToggle, DarkModeToggle
- Main area: Input panel (top) → Output panel (bottom with streaming)
- Right sidebar: Tabs (Knowledge Graph, Error Debugger, etc.)
- No command palette
- No drawer system
- No smart suggestion chips

---

## 🎯 BUNDLE 1: COMMAND PALETTE + UI PRIMITIVES

**Goal**: Build foundation components and basic command palette that opens/closes, navigates with keyboard, and mobile-responsive.  
**Success Criteria**: Cmd/Ctrl+K opens modal, arrow keys navigate, Enter executes, ESC closes, works on mobile.

### File Plan (Exact Paths)

```
NEW FILES TO CREATE:
├── lib/commands.ts (300 lines)
│   - Command registry (TS-typed)
│   - Handler skeleton functions
│   - Command categories
│
├── components/CommandPalette.tsx (250 lines)
│   - Modal overlay + search input
│   - Command list with keyboard nav
│   - Groups support
│   - Mobile responsive (full-screen on small screens)
│
├── components/ui/Modal.tsx (80 lines)
│   - Reusable modal base
│   - Focus trap, ESC handling
│   - Smooth animations (fade/slide)
│
├── components/ui/Drawer.tsx (100 lines)
│   - Right-side drawer base
│   - Smooth slide-in/out
│   - Focus management
│
├── lib/keyboard-shortcuts.ts (80 lines)
│   - useKeyboardShortcut hook
│   - Global Cmd/Ctrl+K listener
│   - Keyboard event handling
│
└── MODIFIED FILES:
    ├── app/page.tsx
    │   - Add state for palette open/close
    │   - Add keyboard listener
    │   - Render <CommandPalette /> component
    │
    └── components/Header.tsx
        - Add subtle sparkle/command icon button
        - Show Cmd/Ctrl+K hint on desktop
        - Mobile: sparkle button only

TYPES ADDITION:
├── types/commands.ts (NEW - 50 lines)
│   - Command interface
│   - CommandGroup interface
│   - CommandHandler type
```

### Design Details

#### CommandPalette Component
- **Trigger**: Cmd/Ctrl+K keyboard shortcut OR sparkle icon button in header
- **Layout**: 
  - Overlay (backdrop): semi-transparent dark, closes on backdrop click
  - Modal: centered, max-w-md, smooth fade-in/slide-down
  - Search input: auto-focused, placeholder "Search commands..."
  - Command list: scrollable, groups with separators
  - Selected item: highlight with hover state + focus ring
- **Keyboard navigation**: 
  - ↑↓ to move between commands
  - Enter to execute
  - ESC to close
  - Type to filter
- **Mobile**: Full-screen modal (inset-4 or similar), large touch targets

#### Modal Component (Reusable)
```tsx
interface ModalProps {
  isOpen: boolean
  onClose: () => void
  children: React.ReactNode
  size?: 'sm' | 'md' | 'lg' | 'fullscreen'
  closeOnBackdrop?: boolean
  closeOnEsc?: boolean
  focusTrap?: boolean
}
```

#### Drawer Component (Reusable)
```tsx
interface DrawerProps {
  isOpen: boolean
  onClose: () => void
  side?: 'left' | 'right'
  children: React.ReactNode
  title?: string
  closeOnBackdrop?: boolean
  focusTrap?: boolean
}
```

#### Commands Registry
```ts
interface Command {
  id: string
  label: string
  description: string
  icon: string
  category: 'general' | 'learning' | 'tools' | 'settings'
  shortcut?: string
  subcommands?: Command[] // for Switch perspective, etc.
  handler: (context: CommandContext) => Promise<void> | void
}

// Initial commands (handlers are stubs for Bundle 1):
1. "Explain selection" (icon: 📝) → calls existing explain flow
2. "Compare concepts" (icon: ⚖️) → opens comparison UI
3. "Generate learning path" (icon: 🗺️) → opens path generator
4. "Explain diff / PR" (icon: 📋) → opens diff input
5. "Start quiz" (icon: 🧪) → triggers existing quiz
6. "Toggle Future-You" (icon: 🔮) → toggles existing state
7. "Switch perspective" (icon: 👁️) → submenu (conceptual, implementation, etc.)
8. "Switch timebox" (icon: ⏱️) → submenu (5min, 10min, 20min, unlimited)
9. "Switch cognitive load" (icon: ⚖️) → submenu (overwhelmed, balanced, speed, mastery)
10. "Open Vault" (icon: 💎) → opens learning vault drawer
```

### Animations (CSS Transitions)
- Modal backdrop: fade-in 150ms ease-out
- Modal box: slide-down from top 200ms ease-out (or zoom + fade)
- Command list items: hover state (bg-blue-500/10, scale 1.02)
- Drawer: slide-in from right 250ms ease-out
- All: respect `prefers-reduced-motion`

### Accessibility
- Focus trap in modal (FocusScope or manual)
- ARIA labels on all buttons
- Semantic HTML (nav for command list, etc.)
- Keyboard-only navigation works
- Screen reader announces command groups

### TypeScript (Strict)
- No `any` types
- Command handlers receive typed context
- Error boundaries on handler execution
- Safe access patterns (optional chaining, nullish coalescing)

---

## 📊 FILE STRUCTURE (Visual)

```
components/
├── CommandPalette.tsx         ← NEW
├── ui/
│   ├── Modal.tsx              ← NEW
│   ├── Drawer.tsx             ← NEW
│   └── index.tsx              ← (ADD exports)
│
lib/
├── commands.ts                ← NEW
└── keyboard-shortcuts.ts       ← NEW

types/
├── commands.ts                ← NEW

app/
└── page.tsx                   ← MODIFY (add palette state, keyboard listener)

components/
└── Header.tsx                 ← MODIFY (add icon button, hint)
```

---

## ✅ VERIFICATION CHECKLIST FOR BUNDLE 1

- [ ] All files compile with 0 TypeScript errors
- [ ] `npm run build` succeeds (310 kB target)
- [ ] Cmd/Ctrl+K opens CommandPalette modal
- [ ] Modal closes on ESC
- [ ] Modal closes on backdrop click
- [ ] Arrow keys navigate commands (visual highlight)
- [ ] Enter executes selected command (handler logs or shows result)
- [ ] Text search filters commands (fuzzy or exact)
- [ ] Mobile: full-screen modal, works on touch
- [ ] Header shows sparkle icon button (clickable alternative to Cmd+K)
- [ ] Focus trap works (tab within modal, doesn't leak)
- [ ] Animations smooth, no jank (60 FPS)
- [ ] Keyboard shortcuts work on macOS (Cmd+K) and Windows/Linux (Ctrl+K)
- [ ] No console errors or warnings
- [ ] Existing features unaffected (Knowledge Graph, Error Debugger, etc. still work)

---

## 🔄 INTEGRATION POINTS

### With Existing Code
1. **App state** (page.tsx): Add `isPaletteOpen` state
2. **Header**: Add button + shortcut hint text
3. **Types**: Add Command types to `/types/commands.ts`
4. **Storage**: Use existing `storageUtils` if needed for command history (future)
5. **API**: No new API calls yet (Bundle 2 will wire to AI)

### Backward Compatibility
- Zero breaking changes
- All 10 existing features continue to work
- Command palette is opt-in via keyboard shortcut
- No new required environment variables

---

## 🚀 NEXT STEPS AFTER BUNDLE 1

Bundle 2 will:
- Wire commands to existing AI flows (explain, compare, diff)
- Add streaming response handling
- Integrate with selection detection
- Add result panels

---

**Status**: Ready for implementation  
**Estimated Lines of Code**: 800-1000  
**Dependencies Added**: None (use only React hooks)  
**Breaking Changes**: None

