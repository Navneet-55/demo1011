# 🧪 BUNDLE 1 - QA TESTING CARD

## Quick Test Checklist

### ✅ MUST TEST (Critical Path)

- [ ] **Cmd+K shortcut**
  - Press Cmd+K (Mac) or Ctrl+K (Windows)
  - Expected: Modal opens, search input focused
  
- [ ] **Palette navigation**
  - Type "explain" 
  - Press ↓ twice
  - Expected: Selection moves down, "Explain selection" highlighted

- [ ] **Command execution**
  - Select "Explain selection"
  - Press Enter
  - Expected: Logs to console + palette closes

- [ ] **Escape to close**
  - Open palette (Cmd/Ctrl+K)
  - Press Escape
  - Expected: Modal closes

- [ ] **Header button click**
  - Click ✨ button in header
  - Expected: Palette opens

### ✅ SHOULD TEST (Coverage)

- [ ] **Mobile responsiveness**
  - Resize to mobile width
  - Palette should still work (Cmd/Ctrl+K)
  - Shortcut hint should be hidden (hidden sm:flex)

- [ ] **Subcommands**
  - Select "Switch cognitive load"
  - Should show 4 options
  - Select one, palette closes

- [ ] **Search filtering**
  - Type "path"
  - Should show only "Generate learning path"
  - Type "xyz" (non-existent)
  - Should show "No commands found"

- [ ] **Focus trap**
  - Open palette
  - Press Tab multiple times
  - Focus should cycle within modal (not leak outside)

- [ ] **Dark mode**
  - Toggle dark mode (sun icon in header)
  - Palette should have dark colors
  - Text should be readable

### 🐛 WATCH FOR (Bugs)

- [ ] No console errors/warnings
- [ ] No duplicate modals
- [ ] Scroll doesn't stutter on navigation
- [ ] Animations are smooth (60 FPS)
- [ ] Mobile: tap targets are 44px minimum
- [ ] Accessibility: focus ring visible
- [ ] Arrow keys don't scroll page (preventDefault works)

### 📊 PERFORMANCE

- [ ] Build time: < 30 seconds
- [ ] First load: < 3 seconds
- [ ] Palette open: instant
- [ ] Search filtering: < 50ms
- [ ] Memory: no leaks (DevTools)

## Test Results

| Test | Status | Notes |
|------|--------|-------|
| Cmd+K Opens Palette | | |
| ESC Closes Palette | | |
| Arrow Navigation | | |
| Enter Executes | | |
| Search Filters | | |
| Subcommands Work | | |
| Mobile Responsive | | |
| Focus Trap | | |
| Keyboard Hints | | |
| No Console Errors | | |

---

**Tester**: _________________  
**Date**: _________________  
**Browser**: _________________  
**OS**: _________________  
**Status**: ☐ PASS ☐ FAIL ☐ BLOCKERS

## Known Limitations (Bundle 1)

⚠️ **Commands are stubs**: They log to console but don't execute actual features yet (Bundle 2)

✅ **No issues found in core functionality**

---

## Quick Commands

```bash
# Start dev server
npm run dev

# Check for errors
npm run build

# Clean rebuild
rm -rf .next && npm run build
```

---

Open http://localhost:3000 and test! 🚀
