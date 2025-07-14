# 🚀 Replit Setup Guide - Walmart Smart Perishables Dashboard

## 📋 Quick Start (Import to Replit)

### Option 1: GitHub Import (Recommended)

1. Go to [Replit](https://replit.com)
2. Click "Create Repl" → "Import from GitHub"
3. Paste your repository URL
4. Click "Import from GitHub"

### Option 2: Upload Files

1. Create new Repl → "Node.js"
2. Upload all project files
3. Ensure `.replit` and `replit.nix` are included

## ⚙️ Configuration

### Environment Variables (.env)

Create `.env` file in Replit:

```bash
# Optional: OpenAI for AI features (can work without)
OPENAI_API_KEY=your_openai_key_here

# Required: JWT secret for authentication
JWT_SECRET=your_jwt_secret_key_here

# Auto-configured
NODE_ENV=development
PORT=8080
```

### Secrets (Replit Dashboard)

Instead of `.env`, use Replit Secrets:

- Go to "Tools" → "Secrets"
- Add: `OPENAI_API_KEY` (optional)
- Add: `JWT_SECRET` (required)

## 🏃‍♂️ Running the App

### Automatic (Recommended)

- Click the "Run" button
- Replit will automatically install dependencies and start the dev server
- App will be available on the generated URL

### Manual Commands

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Or use Replit-specific script
npm run replit:dev
```

## 🔧 Troubleshooting

### Common Issues & Solutions

#### 1. **Build Errors**

```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

#### 2. **SQLite Issues**

```bash
# Test database
npm run db:test

# If fails, install SQLite
nix-env -iA nixpkgs.sqlite
```

#### 3. **Port Issues**

- Replit auto-assigns ports
- App configured to use `process.env.PORT` or default 8080
- Should work automatically

#### 4. **TypeScript Errors**

```bash
# Check TypeScript
npm run typecheck

# If errors, try:
npx tsc --noEmit
```

#### 5. **Missing Dependencies**

```bash
# Reinstall everything
npm install --force
```

#### 6. **WebSocket Issues**

- WebSockets may not work in Replit dev environment
- App has fallback to polling for real-time features
- Full functionality available on deployment

## 🎯 Features Available in Replit

### ✅ Working Features

- **Dashboard Home**: Real-time KPIs and charts
- **Expiry Watch**: AI-enhanced inventory management
- **AI Chatbot**: Context-aware assistant (with fallback responses)
- **Shelf Display**: Progressive pricing simulator
- **Customer Feedback**: Review management
- **Authentication**: JWT-based login system

### ⚠️ Limited Features

- **WebSocket Real-time**: May fall back to polling
- **OpenAI Integration**: Requires API key, has fallback responses

### 🔑 Default Login

```
Email: admin@walmart.com
Password: admin123
```

## 📁 Project Structure in Replit

```
walmart-smart-perishables/
├── 📱 Frontend (client/)
│   ├── React + TypeScript components
│   ├── Tailwind CSS styling
│   └── Real-time hooks
├── 🖥️ Backend (server/)
│   ├── Express.js API
│   ├── SQLite database
│   └── AI integration
├── ⚙️ Config Files
│   ├── .replit (Replit configuration)
│   ├── replit.nix (Dependencies)
│   └── package.json (Scripts & deps)
└── 📚 Documentation
```

## 🚀 Deployment from Replit

### Replit Deployments

1. Click "Deploy" in Replit
2. Choose "Autoscale" or "Reserved VM"
3. Configure environment variables
4. Deploy!

### External Deployment

```bash
# Build for production
npm run build

# Files ready in dist/
# Upload dist/ to hosting service
```

## 🔍 Debug Tips

### Check Logs

- Use Replit console for error messages
- Check "Tools" → "Console" for detailed logs

### Performance

- Initial install may take 2-3 minutes
- Subsequent runs are faster
- Use "Always On" for production

### Database

- SQLite file created automatically
- Check `walmart_perishables.db` exists
- Pre-seeded with sample data

## 🎉 Success Indicators

When everything works correctly:

1. **Console shows**:

   ```
   🚀 Smart Perishables API Server Started
   📍 URL: http://localhost:8080
   📊 Dashboard: http://localhost:8080
   🔌 API: http://localhost:8080/api
   💾 Database: SQLite (walmart_perishables.db)
   ```

2. **Browser shows**:

   - Professional Walmart-branded dashboard
   - Working navigation between pages
   - AI chatbot in bottom-right
   - Sample inventory data in Expiry Watch

3. **Features working**:
   - Click through all nav items
   - Chat with AI assistant
   - Apply markdown recommendations
   - View real-time data updates

## 📞 Need Help?

- Check console for error messages
- Ensure all files uploaded correctly
- Verify environment variables set
- Try refreshing or restarting the Repl

**Ready to go! Your Walmart Smart Perishables Dashboard should be running perfectly in Replit! 🎯**
