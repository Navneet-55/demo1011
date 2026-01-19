# Deployment Guide

## Prerequisites
- Node.js 18+
- npm 9+
- Groq API key (get from https://console.groq.com/keys)

## Local Development

```bash
# 1. Clone repository
git clone https://github.com/Navneet-55/new1.git
cd new1

# 2. Install dependencies
npm install

# 3. Setup environment
cp .env.example .env.local
# Edit .env.local and add your GROQ_API_KEY

# 4. Start dev server
npm run dev
# Open http://localhost:3000
```

## Production Build

```bash
# Build
npm run build

# Start server
npm start

# Or use PM2 for process management
npm install -g pm2
pm2 start npm --name gyaanforge -- start
pm2 save
pm2 startup
```

## Deployment Options

### Vercel (Recommended)
```bash
npm install -g vercel
vercel deploy --prod
```

Add environment variables in Vercel dashboard:
- `GROQ_API_KEY`: Your API key

### Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

```bash
docker build -t gyaanforge .
docker run -p 3000:3000 -e GROQ_API_KEY=your_key gyaanforge
```

### Railway, Render, etc.
1. Connect repository
2. Set build command: `npm run build`
3. Set start command: `npm start`
4. Add `GROQ_API_KEY` environment variable
5. Deploy

## Environment Variables

```env
# Required
GROQ_API_KEY=your_groq_api_key_here

# Optional
NODE_ENV=production
```

## Troubleshooting

### "API key not found"
- Check `.env.local` has `GROQ_API_KEY`
- Verify key is valid at https://console.groq.com/keys
- Restart dev server after env changes

### "Build fails"
```bash
# Clear cache and rebuild
rm -rf .next node_modules
npm install
npm run build
```

### "Port 3000 already in use"
```bash
# Use different port
PORT=3001 npm run dev
```

### "TypeScript errors"
```bash
npm run type-check
```

## Performance Tips

- Use Vercel for automatic optimizations
- Enable compression in nginx/CDN
- Use CloudFront or similar CDN
- Monitor bundle size: `npm run build`

## Security

- Never commit `.env.local`
- Use `.env.example` for template
- Rotate API keys regularly
- Use HTTPS in production
- Update dependencies: `npm audit fix`

## Monitoring

```bash
# Check production build size
npm run build
# Shows breakdown in .next/

# Test production build locally
npm run build
npm start
```

## Support

- Docs: [README.md](README.md)
- Architecture: [ARCHITECTURE.md](ARCHITECTURE.md)
- Issues: [GitHub Issues](https://github.com/Navneet-55/new1/issues)
