#!/bin/bash

# GyaanForge Project Verification Checklist
# Run this script to verify all components are in place

echo "🔍 GyaanForge Verification Checklist"
echo "===================================="
echo ""

# Configuration Files
echo "📋 Configuration Files:"
[ -f "package.json" ] && echo "✓ package.json" || echo "✗ package.json MISSING"
[ -f "tsconfig.json" ] && echo "✓ tsconfig.json" || echo "✗ tsconfig.json MISSING"
[ -f "tailwind.config.ts" ] && echo "✓ tailwind.config.ts" || echo "✗ tailwind.config.ts MISSING"
[ -f "postcss.config.js" ] && echo "✓ postcss.config.js" || echo "✗ postcss.config.js MISSING"
[ -f "next.config.js" ] && echo "✓ next.config.js" || echo "✗ next.config.js MISSING"
[ -f ".eslintrc.json" ] && echo "✓ .eslintrc.json" || echo "✗ .eslintrc.json MISSING"
echo ""

# App Files
echo "🎯 Application Files:"
[ -f "app/layout.tsx" ] && echo "✓ app/layout.tsx" || echo "✗ app/layout.tsx MISSING"
[ -f "app/page.tsx" ] && echo "✓ app/page.tsx" || echo "✗ app/page.tsx MISSING"
[ -f "app/globals.css" ] && echo "✓ app/globals.css" || echo "✗ app/globals.css MISSING"
[ -f "app/api/explain/route.ts" ] && echo "✓ app/api/explain/route.ts" || echo "✗ app/api/explain/route.ts MISSING"
echo ""

# Components
echo "🧩 Components:"
[ -f "components/ThemeProvider.tsx" ] && echo "✓ ThemeProvider.tsx" || echo "✗ ThemeProvider.tsx MISSING"
[ -f "components/ModeProvider.tsx" ] && echo "✓ ModeProvider.tsx" || echo "✗ ModeProvider.tsx MISSING"
[ -f "components/Header.tsx" ] && echo "✓ Header.tsx" || echo "✗ Header.tsx MISSING"
[ -f "components/ModeToggle.tsx" ] && echo "✓ ModeToggle.tsx" || echo "✗ ModeToggle.tsx MISSING"
[ -f "components/InputPanel.tsx" ] && echo "✓ InputPanel.tsx" || echo "✗ InputPanel.tsx MISSING"
[ -f "components/OutputPanel.tsx" ] && echo "✓ OutputPanel.tsx" || echo "✗ OutputPanel.tsx MISSING"
echo ""

# Documentation
echo "📚 Documentation:"
[ -f "README.md" ] && echo "✓ README.md" || echo "✗ README.md MISSING"
[ -f "IMPLEMENTATION_COMPLETE.md" ] && echo "✓ IMPLEMENTATION_COMPLETE.md" || echo "✗ IMPLEMENTATION_COMPLETE.md MISSING"
[ -f ".env.example" ] && echo "✓ .env.example" || echo "✗ .env.example MISSING"
echo ""

# Project Structure
echo "📁 Project Structure:"
[ -d "app" ] && echo "✓ app/" || echo "✗ app/ MISSING"
[ -d "components" ] && echo "✓ components/" || echo "✗ components/ MISSING"
[ -d "public" ] && echo "✓ public/" || echo "✗ public/ MISSING"
echo ""

# Dependencies
echo "📦 Dependency Check:"
if [ -d "node_modules" ]; then
    echo "✓ node_modules installed"
    NEXT=$(npm list next | grep next | head -1)
    echo "  └─ $NEXT"
else
    echo "✗ node_modules NOT installed - run: npm install --legacy-peer-deps"
fi
echo ""

# Build Status
echo "🔨 Build Check:"
if [ -d ".next" ]; then
    echo "✓ .next build directory exists (production build done)"
else
    echo "⚠ .next not found - run: npm run build"
fi
echo ""

echo "✅ Verification Complete!"
echo ""
echo "Next Steps:"
echo "1. Ensure .env.local has OPENAI_API_KEY"
echo "2. Run: npm run dev"
echo "3. Open: http://localhost:3000"
echo ""
echo "To build for production:"
echo "npm run build && npm start"
