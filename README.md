# Walmart Smart Perishables Dashboard

A full-stack AI-powered dashboard for managing perishable inventory with dynamic pricing and real-time analytics.

## 🚀 Features

- **AI-Enhanced Expiry Watch**: Smart markdown recommendations with machine learning
- **Real-time Dashboard**: Live KPIs, sales forecasting, and inventory tracking
- **Dynamic Pricing**: Automated discount suggestions with confidence scoring
- **GenAI Integration**: OpenAI-powered chat assistant and demand forecasting
- **WebSocket Updates**: Real-time price changes across all connected devices
- **Responsive Design**: Mobile-optimized interface with professional styling

## 🔧 Technology Stack

### Frontend

- **React 18** with TypeScript
- **Tailwind CSS** + Radix UI components
- **React Router** for navigation
- **TanStack Query** for data fetching
- **WebSocket** for real-time updates

### Backend

- **Node.js** + Express.js
- **SQLite** database with automatic seeding
- **OpenAI API** integration
- **JWT** authentication
- **WebSocket** server for real-time features

### Infrastructure

- **Vite** for build tooling
- **Vercel** for serverless deployment
- **Serverless HTTP** for API functions

## 📦 Quick Start

### Prerequisites

- Node.js 18+
- npm or yarn
- OpenAI API key (optional, fallback responses included)

### Installation

1. **Clone and install**:

   ```bash
   git clone <repository-url>
   cd walmart-smart-perishables
   npm install
   ```

2. **Environment setup**:

   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

3. **Development**:

   ```bash
   npm run dev
   ```

   App runs on `http://localhost:8080`

4. **Production build**:
   ```bash
   npm run build
   npm start
   ```

## 🌐 Vercel Deployment

### One-Click Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/your-username/walmart-smart-perishables)

### Manual Deployment

1. **Install Vercel CLI**:

   ```bash
   npm i -g vercel
   ```

2. **Deploy**:

   ```bash
   vercel --prod
   ```

3. **Environment Variables** (in Vercel dashboard):
   ```
   OPENAI_API_KEY=your_openai_key_here
   JWT_SECRET=your_jwt_secret_here
   NODE_ENV=production
   ```

## 🔐 Environment Variables

| Variable         | Description                    | Required                |
| ---------------- | ------------------------------ | ----------------------- |
| `OPENAI_API_KEY` | OpenAI API key for AI features | No (fallback available) |
| `JWT_SECRET`     | Secret for JWT token signing   | Yes                     |
| `NODE_ENV`       | Environment mode               | Auto-set                |
| `DATABASE_URL`   | SQLite database path           | Auto-configured         |

## 🤖 AI Features

### Current Implementation

- **Chat Assistant**: Context-aware responses with fallback system
- **Markdown Recommendations**: Dynamic discount suggestions (15-30%)
- **Demand Forecasting**: Historical data analysis
- **Real-time Updates**: WebSocket integration

### Advanced AI Integration Options

#### 1. LangChain Integration

```bash
npm install @langchain/openai @langchain/community langchain
```

**Use Cases**:

- **Document QA**: Query internal policy documents
- **Supply Chain Analysis**: Complex multi-step reasoning
- **Automated Reporting**: Generate executive summaries

**Implementation Example**:

```typescript
import { ChatOpenAI } from "@langchain/openai";
import { PromptTemplate } from "@langchain/core/prompts";

const template = PromptTemplate.fromTemplate(`
  Analyze inventory data: {data}
  Generate markdown recommendations for {timeframe}
  Consider: seasonality, demand patterns, competitor pricing
`);
```

#### 2. Vector Database (Pinecone)

```bash
npm install @pinecone-database/pinecone
```

**Use Cases**:

- **Semantic Search**: Find similar product patterns
- **Recommendation Engine**: Cross-category insights
- **Knowledge Base**: Store and query best practices

#### 3. Blockchain Transparency

```bash
npm install ethers @openzeppelin/contracts
```

**Features**:

- **Supply Chain Tracking**: Immutable product journey
- **Quality Verification**: Tamper-proof certifications
- **Customer Trust**: QR code verification

**Smart Contract Example**:

```solidity
contract PerishableTracker {
    struct Product {
        string sku;
        uint256 bottledDate;
        uint256 expiryDate;
        string origin;
        bool verified;
    }

    mapping(bytes32 => Product) public products;
}
```

#### 4. Advanced Analytics

```bash
npm install @tensorflow/tfjs plotly.js d3
```

**Features**:

- **Machine Learning**: Demand prediction models
- **Advanced Visualizations**: Interactive charts
- **Anomaly Detection**: Unusual pattern alerts

## 📱 API Documentation

### Authentication

```bash
POST /api/auth/login
Body: { "email": "admin@walmart.com", "password": "admin123" }
```

### Inventory Management

```bash
GET /api/protected/stores/1234/inventory
GET /api/protected/stores/1234/expiring
PUT /api/protected/inventory/:itemId
```

### AI Features

```bash
POST /api/protected/chat
POST /api/protected/recommendations
GET /api/protected/stores/1234/forecast
```

## 🗄️ Database Schema

### Core Tables

- **stores**: Store locations and metadata
- **inventory_items**: Product catalog with pricing
- **sales_data**: Transaction history
- **customer_feedback**: User reviews and preferences
- **demand_forecasts**: AI prediction data
- **users**: Authentication and roles

## 🔒 Security

- **JWT Authentication**: Secure API access
- **Role-based Access**: Associate/Manager/Admin levels
- **Input Validation**: Zod schema validation
- **Rate Limiting**: API protection (production)
- **Environment Variables**: Secure configuration

## 🧪 Testing

```bash
npm test                 # Run test suite
npm run typecheck       # TypeScript validation
npm run format.fix      # Code formatting
```

## 📈 Performance

- **Bundle Size**: ~815KB (optimized)
- **Build Time**: <10 seconds
- **API Response**: <200ms average
- **Real-time Updates**: <50ms WebSocket latency

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📄 License

MIT License - see LICENSE file for details.

## 📞 Support

- **Documentation**: [Wiki](./docs/)
- **Issues**: [GitHub Issues](./issues)
- **Discussions**: [GitHub Discussions](./discussions)

---

**Built with ❤️ for Walmart Associates**
