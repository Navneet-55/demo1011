# ⚡ GyaanForge - Command Reference

## 🚀 Quick Commands

### Development
```bash
# Start development server (with hot reload)
npm run dev

# Quick start with interactive setup
bash start.sh
```

### Production
```bash
# Build for production
npm run build

# Start production server
npm start

# Build and start in one command
npm run build && npm start
```

### Maintenance
```bash
# Lint and format code
npm run lint

# Check for dependency vulnerabilities
npm audit

# Update dependencies (carefully)
npm update

# Clean build cache
rm -rf .next node_modules package-lock.json
npm install --legacy-peer-deps
```

### Deployment
```bash
# Deploy to Vercel
vercel

# Deploy to Vercel with production settings
vercel --prod

# Get deploy logs
vercel logs

# Check deployment status
vercel status
```

### Verification
```bash
# Verify project structure
bash verify.sh

# Check TypeScript for errors
npx tsc --noEmit

# Check bundle size
npm run build

# Analyze bundle (if configured)
npm run analyze
```

---

## 📦 Available Scripts

| Script | Command | Purpose |
|--------|---------|---------|
| **dev** | `next dev` | Start dev server with hot reload |
| **build** | `next build` | Create optimized production build |
| **start** | `next start` | Run production server |
| **lint** | `next lint` | Run ESLint on all files |

---

## 🔧 Environment Commands

### Setup
```bash
# Copy environment template
cp .env.example .env.local

# View environment file (don't share keys!)
cat .env.local

# Verify environment setup
grep OPENAI_API_KEY .env.local
```

### Update Keys
```bash
# Edit environment variables
vim .env.local          # Vim
nano .env.local         # Nano
code .env.local         # VSCode
```

---

## 🧹 Cleanup Commands

### Remove Build Artifacts
```bash
# Remove Next.js build directory
rm -rf .next

# Remove node_modules
rm -rf node_modules

# Remove lock file
rm package-lock.json

# Clean cache
npm cache clean --force
```

### Fresh Install
```bash
# Complete clean slate
rm -rf node_modules package-lock.json .next
npm install --legacy-peer-deps
npm run build
```

---

## 🐛 Debugging Commands

### Check Status
```bash
# Verify Node.js installation
node --version

# Verify npm installation
npm --version

# Check installed packages
npm list

# List global packages
npm list -g
```

### Port Management
```bash
# Find what's using port 3000
lsof -i :3000

# Kill process on port 3000 (macOS/Linux)
kill -9 <PID>

# Use different port
npm run dev -- -p 3001
```

### File Operations
```bash
# List all files
ls -la

# List app directory
ls -la app/

# List components
ls -la components/

# List specific file
cat app/page.tsx

# Check file size
du -h app/page.tsx

# Count lines of code
wc -l app/**/*.tsx
```

---

## 🚢 Deployment Commands

### Vercel
```bash
# Login to Vercel
vercel login

# Deploy to staging
vercel

# Deploy to production
vercel --prod

# Show deployment logs
vercel logs

# Rollback deployment
vercel rollback

# List deployments
vercel list
```

### Docker
```bash
# Build Docker image
docker build -t gyaanforge .

# Run Docker container
docker run -e OPENAI_API_KEY=sk-... -p 3000:3000 gyaanforge

# Stop container
docker stop <container_id>

# View logs
docker logs <container_id>
```

### Manual Server
```bash
# SSH into server
ssh user@server-ip

# Clone repository
git clone <repo-url>
cd gyaanforge

# Install and run
npm install --legacy-peer-deps
npm run build
npm start

# Run in background with PM2
npm i -g pm2
pm2 start npm --name "gyaanforge" -- start
```

---

## 📊 Analysis Commands

### Code Quality
```bash
# Type check
npx tsc --noEmit

# Check for unused imports
npx eslint . --ext .ts,.tsx

# Find console logs
grep -r "console\." app/ components/

# Find TODO comments
grep -r "TODO\|FIXME" app/ components/
```

### Performance
```bash
# Analyze bundle size
npm run build
# Check .next/static/chunks/

# Check First Load JS
npm run build | grep "First Load JS"

# Test lighthouse locally (if configured)
npm run build && npm start
# Then use Chrome DevTools Lighthouse tab
```

### Security
```bash
# Check for vulnerabilities
npm audit

# Fix vulnerabilities automatically
npm audit fix

# Fix with force (breaking changes possible)
npm audit fix --force

# Generate security report
npm audit --json > audit-report.json
```

---

## 🔄 Git Commands

### Version Control
```bash
# Initialize git (if not already done)
git init

# Add all files
git add .

# Commit changes
git commit -m "Initial GyaanForge setup"

# Create main branch
git branch -M main

# Add remote repository
git remote add origin <github-url>

# Push to GitHub
git push -u origin main

# Check status
git status

# View commit history
git log --oneline

# Create feature branch
git checkout -b feature/your-feature

# Merge to main
git checkout main
git merge feature/your-feature
```

---

## 🧪 Testing Commands

### Manual Testing Checklist
```bash
# 1. Start dev server
npm run dev

# 2. Open browser
# http://localhost:3000

# 3. Test checklist:
# - [ ] Page loads without errors
# - [ ] Dark mode toggle works
# - [ ] Mode selector works (all 3 modes)
# - [ ] Input textarea accepts text
# - [ ] Submit button enabled with text
# - [ ] Keyboard shortcut (Cmd/Ctrl+Enter) works
# - [ ] API responds (add valid API key)
# - [ ] Markdown renders correctly
# - [ ] Code highlighting works
# - [ ] Responsive design works (resize window)
# - [ ] No console errors (open DevTools F12)
```

### E2E Testing (Future)
```bash
# Install Playwright for E2E testing
npm install -D @playwright/test

# Run tests
npx playwright test

# View test report
npx playwright show-report
```

---

## 📖 Useful Aliases

### Add to .bashrc or .zshrc
```bash
# Shorten commands
alias gyd="npm run dev"           # Start dev
alias gyb="npm run build"         # Build
alias gys="npm start"             # Start prod
alias gyl="npm run lint"          # Lint
alias gyv="bash verify.sh"        # Verify
alias gyc="git add . && git commit -m" # Quick commit

# Usage examples:
# gyd              # npm run dev
# gyb              # npm run build
# gyc "Fix issue"  # git add and commit
```

---

## 🚨 Common Error Commands

### "Port 3000 already in use"
```bash
# Find and kill process
lsof -i :3000 | tail -1 | awk '{print $2}' | xargs kill -9

# Or use different port
npm run dev -- -p 3001
```

### "Cannot find module"
```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install --legacy-peer-deps
npm run build
```

### "Module not found" after build
```bash
# Clear Next.js cache
rm -rf .next
npm run build

# Check if file actually exists
find . -name "ThemeProvider.tsx"
```

### TypeScript errors
```bash
# Check TypeScript version
npm list typescript

# Update TypeScript
npm update typescript

# Type check without building
npx tsc --noEmit
```

---

## 📡 Network Debugging

### API Testing
```bash
# Test API endpoint directly
curl -X POST http://localhost:3000/api/explain \
  -H "Content-Type: application/json" \
  -d '{"input":"hello","mode":"Beginner"}'

# Test with jq formatting
curl -s -X POST http://localhost:3000/api/explain \
  -H "Content-Type: application/json" \
  -d '{"input":"hello","mode":"Student"}' | jq .
```

### Connection Testing
```bash
# Test API key
curl https://api.openai.com/v1/models \
  -H "Authorization: Bearer $OPENAI_API_KEY"

# Ping OpenAI API
curl -w "@curl-format.txt" -o /dev/null -s https://api.openai.com/v1/models
```

---

## 📚 Documentation Commands

### Generate Docs
```bash
# Extract function documentation
grep -r "\/\*\*" app/ components/ | head -20

# Count total functions
find . -name "*.ts" -o -name "*.tsx" | xargs grep -c "export function" | awk -F: '{sum+=$2} END {print sum}'

# Find all TODO items
grep -r "TODO" app/ components/ --include="*.ts" --include="*.tsx"
```

### README
```bash
# Generate file tree
tree -I 'node_modules|.next' -L 3

# Or use find command
find . -not -path '*/node_modules/*' -not -path '*/.next/*' -type f -name "*.tsx" -o -name "*.ts" -o -name "*.json" | head -30
```

---

## 🎯 Production Checklist Commands

```bash
#!/bin/bash
# Run before deployment

echo "🔍 Pre-deployment Checklist"
echo "=========================="

echo "✓ Checking Node version..."
node --version

echo "✓ Checking env variables..."
[ -f .env.local ] && echo "  .env.local exists" || echo "  ⚠ .env.local missing!"

echo "✓ Building project..."
npm run build

echo "✓ Checking build output..."
[ -d .next ] && echo "  Build successful" || echo "  ⚠ Build failed!"

echo "✓ Running type checks..."
npx tsc --noEmit

echo "✓ Checking for console errors in code..."
grep -r "console.log\|console.error" app/ components/ | grep -v "// " && echo "  ⚠ Found console statements" || echo "  Clean!"

echo ""
echo "✅ Pre-deployment checklist complete!"
```

---

## 🎓 Reference Commands

### Learn More
```bash
# Next.js documentation
open https://nextjs.org/docs

# React documentation
open https://react.dev

# Tailwind CSS documentation
open https://tailwindcss.com/docs

# TypeScript documentation
open https://www.typescriptlang.org/docs

# OpenAI API docs
open https://platform.openai.com/docs
```

---

## 📝 Common Patterns

### Adding New Component
```bash
# Create component file
touch components/NewComponent.tsx

# Add to imports in page.tsx
# import { NewComponent } from '@/components/NewComponent'

# Use in JSX
# <NewComponent />
```

### Adding New API Route
```bash
# Create route directory
mkdir -p app/api/new-endpoint

# Create route handler
touch app/api/new-endpoint/route.ts

# Add POST handler
# export async function POST(req: NextRequest) { ... }
```

### Adding Environment Variable
```bash
# Add to .env.local
echo "NEW_VAR=value" >> .env.local

# Access in code
# process.env.NEW_VAR
```

---

**GyaanForge - Command Reference**  
Last Updated: January 17, 2026  
Version: 1.0.0
