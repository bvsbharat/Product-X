import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { MCPClient, MCPAgent } from 'mcp-use';
import { ChatAnthropic } from '@langchain/anthropic';
import mailRoutes from './routes/mail.js';
import eventsRoutes from './routes/events.js';
import agentRoutes from './routes/agent.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3002;

// Global MCP instances
let mcpClient: MCPClient | null = null;
let mcpAgent: MCPAgent | null = null;

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Initialize MCP with Composio mail service
async function initializeMCP() {
  try {
    console.log('🔄 Initializing MCP with Composio mail service...');
    
    // Check for required environment variables
    if (!process.env.ANTHROPIC_API_KEY) {
      console.warn('⚠️ ANTHROPIC_API_KEY not found, falling back to mock data');
      return null;
    }
    
    // Configure MCP client with unified Composio server (includes both mail and calendar)
    const mcpConfig = {
      mcpServers: {
        composio_unified: {
          command: 'npx',
          args: [
            '@composio/mcp@latest',
            'start',
            '--url',
            'https://mcp.composio.dev/composio/server/c08c2d17-c720-437c-961a-ccbd3d413ea6/mcp?include_composio_helper_actions=true'
          ],
          env: {
            npm_config_yes: 'true'
          }
        }
      }
    };
    
    // Initialize MCP client
    mcpClient = MCPClient.fromDict(mcpConfig);
    console.log('✅ MCP Client initialized');
    
    // Initialize LLM (Anthropic)
    const llm = new ChatAnthropic({
      model: 'claude-sonnet-4-20250514',
      apiKey: process.env.ANTHROPIC_API_KEY,
      temperature: 0.1
    });
    console.log('✅ Anthropic LLM initialized');
    
    // Initialize MCP agent
    mcpAgent = new MCPAgent({
      llm,
      client: mcpClient,
      maxSteps: 10
    });
    
    // Make MCP instances available to routes
    app.locals.mcpClient = mcpClient;
    app.locals.mcpAgent = mcpAgent;
    
    console.log('✅ MCP Agent initialized successfully');
    
    // Test the connection
    try {
      const testResponse = await mcpAgent.run('List available tools and capabilities');
      console.log('🧪 MCP Test Response:', testResponse);
    } catch (testError) {
      console.warn('⚠️ MCP test failed, but agent is initialized:', testError);
    }
    
    return mcpAgent;
    
  } catch (error) {
    console.error('❌ Failed to initialize MCP:', error);
    console.log('📋 Falling back to mock data only');
    
    // Set to null to trigger fallback in routes
    mcpClient = null;
    mcpAgent = null;
    app.locals.mcpClient = null;
    app.locals.mcpAgent = null;
    
    return null;
  }
}

// Routes
app.use('/api/mail', mailRoutes);
app.use('/api/events', eventsRoutes);
app.use('/api/agent', agentRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    mcpStatus: mcpAgent ? 'connected' : 'disconnected'
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Weekend Dashboard Backend API',
    version: '1.0.0',
    endpoints: {
      health: '/api/health',
      events: '/api/events',
      mail: '/api/mail',
      agent: '/api/agent'
    }
  });
});

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error:', err);
  res.status(500).json({
    error: 'Internal server error',
    message: err.message
  });
});

// Start server
async function startServer() {
  try {
    // Initialize MCP first
    await initializeMCP();
    
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
      console.log(`🔗 CORS enabled for: ${process.env.CORS_ORIGIN || 'http://localhost:5173'}`);
      console.log(`🤖 MCP Status: ${mcpAgent ? 'Connected' : 'Fallback Mode'}`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

startServer();

export default app;