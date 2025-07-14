# Deployment Checklist & Troubleshooting

## ✅ Pre-Deployment Checklist

### Required Files ✓

- [x] `package.json` - Dependencies and scripts
- [x] `vercel.json` - Deployment configuration
- [x] `.env.example` - Environment variables template
- [x] `api/chat.js` - Serverless function entry point
- [x] `dist/spa/` - Built frontend assets
- [x] `dist/server/` - Built backend bundle
- [x] `README.md` - Complete documentation

### Environment Variables

Set these in Vercel dashboard:

```bash
OPENAI_API_KEY=sk-...          # Optional: For AI chat features
JWT_SECRET=your-secret-here    # Required: For authentication
NODE_ENV=production           # Auto-set by Vercel
```

### Build Verification

```bash
# Test local build
npm run build
npm start

# Verify endpoints
curl http://localhost:3001/api/ping
```

## 🚀 Vercel Deployment Steps

### Option 1: GitHub Integration (Recommended)

1. **Push to GitHub**:

   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Connect to Vercel**:
   - Visit [vercel.com/new](https://vercel.com/new)
   - Import your repository
   - Set environment variables
   - Deploy

### Option 2: CLI Deployment

1. **Install CLI**:

   ```bash
   npm i -g vercel
   ```

2. **Deploy**:
   ```bash
   vercel --prod
   ```

## 🔧 AI Integration Steps

### 1. Basic OpenAI Integration

```bash
# Set in Vercel environment
OPENAI_API_KEY=sk-your-key-here
```

**Test AI chat**:

- Open dashboard → Click chat icon
- Type: "Help me with expiry management"
- Should get intelligent response

### 2. Advanced LangChain Setup

```bash
# Add to package.json
npm install @langchain/openai @langchain/community langchain
```

**Environment additions**:

```bash
LANGCHAIN_API_KEY=your-key
LANGCHAIN_PROJECT=walmart-smart-perishables
```

### 3. Vector Database (Pinecone)

```bash
npm install @pinecone-database/pinecone
```

**Environment**:

```bash
PINECONE_API_KEY=your-pinecone-key
PINECONE_ENVIRONMENT=us-west1-gcp
```

### 4. Blockchain Integration

```bash
npm install ethers @openzeppelin/contracts
```

**Environment**:

```bash
ETHEREUM_RPC_URL=https://mainnet.infura.io/v3/your-key
PRIVATE_KEY=your-private-key
CONTRACT_ADDRESS=0x...
```

## 🐛 Troubleshooting

### Common Issues

#### 1. Build Failures

**Error**: `Module not found: Can't resolve '@/components'`

**Solution**:

```bash
# Check tsconfig.json paths
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./client/*"]
    }
  }
}
```

#### 2. API Not Working

**Error**: `404 on /api/chat`

**Solutions**:

1. **Check vercel.json routes**:

   ```json
   {
     "routes": [{ "src": "/api/(.*)", "dest": "/api/chat.js" }]
   }
   ```

2. **Verify serverless function**:
   ```bash
   # api/chat.js should export default function
   export default async function handler(req, res) { ... }
   ```

#### 3. Database Issues

**Error**: `SQLITE_CANTOPEN: unable to open database file`

**Solution**: Use in-memory database for serverless:

```typescript
// Update server/database.ts
const db = new sqlite3.Database(":memory:");
```

#### 4. WebSocket Connection Fails

**Error**: `WebSocket connection failed`

**Solution**: WebSockets not supported in serverless. Use polling:

```typescript
// Replace WebSocket with polling
const usePolling = () => {
  useEffect(() => {
    const interval = setInterval(refetchData, 5000);
    return () => clearInterval(interval);
  }, []);
};
```

### Performance Optimization

#### 1. Reduce Bundle Size

```typescript
// vite.config.ts
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ["react", "react-dom"],
          ui: ["@radix-ui/react-dialog", "@radix-ui/react-dropdown-menu"],
        },
      },
    },
  },
});
```

#### 2. Code Splitting

```typescript
// Lazy load components
const ExpiryWatch = lazy(() => import("./pages/ExpiryWatch"));
const ShelfDisplay = lazy(() => import("./pages/ShelfEdgeDisplay"));
```

## 📊 Production Monitoring

### Health Checks

```bash
# API health
curl https://your-app.vercel.app/api/ping

# Expected response
{
  "message": "Walmart Smart Perishables API v2.0",
  "timestamp": "2025-01-17T...",
  "database": "SQLite",
  "ai": "OpenAI Enabled"
}
```

### Performance Metrics

- **First Load**: < 2s
- **API Response**: < 500ms
- **Build Time**: < 30s
- **Bundle Size**: < 1MB

## 🔐 Security Checklist

- [x] Environment variables secured
- [x] JWT secret properly set
- [x] No API keys in code
- [x] CORS configured
- [x] Input validation active
- [x] SQL injection protection

## 📱 Mobile Testing

Test on these viewports:

- **Mobile**: 375px (iPhone)
- **Tablet**: 768px (iPad)
- **Desktop**: 1200px+ (Laptop)

## 🚨 Emergency Rollback

If deployment fails:

```bash
# Revert to previous version
vercel rollback
```

Or redeploy last known good commit:

```bash
git checkout <last-good-commit>
vercel --prod
```

---

**🎯 Success Criteria**

- ✅ Dashboard loads without errors
- ✅ Navigation between pages works
- ✅ AI chatbot responds (with/without OpenAI)
- ✅ Expiry Watch shows sample data
- ✅ API endpoints return valid JSON
- ✅ Mobile responsive design
- ✅ Real-time features (or polling fallback)

**Ready for production! 🚀**
