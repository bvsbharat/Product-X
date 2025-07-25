import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { MCPClient, MCPAgent } from 'mcp-use';
import { ChatAnthropic } from '@langchain/anthropic';
import { connectDatabase, disconnectDatabase } from './config/database.js';
import { CacheCleanupService } from './services/cacheCleanup.js';
import mailRoutes from './routes/mail.js';
import eventsRoutes from './routes/events.js';
import agentRoutes from './routes/agent.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;

// Global MCP instances
let mcpClient: MCPClient | null = null;
let mcpAgent: MCPAgent | null = null;
let calendarMcpClient: MCPClient | null = null;
let calendarMcpAgent: MCPAgent | null = null;

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
async function initializeMailMCP() {
  try {
    console.log('🔄 Initializing MCP with Composio mail service...');
    
    // Check for required environment variables
    if (!process.env.ANTHROPIC_API_KEY) {
      console.warn('⚠️ ANTHROPIC_API_KEY not found, falling back to mock data');
      return null;
    }
    
    // Configure MCP client for Gmail
    const mcpConfig = {
      mcpServers: {
        composio_gmail: {
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
    console.log('✅ Mail MCP Client initialized');
    
    // Initialize LLM (Anthropic)
    const llm = new ChatAnthropic({
      model: 'claude-sonnet-4-20250514',
      apiKey: process.env.ANTHROPIC_API_KEY,
      temperature: 0.1
    });
    console.log('✅ Anthropic LLM initialized for mail');
    
    // Initialize MCP agent
    mcpAgent = new MCPAgent({
      llm,
      client: mcpClient,
      maxSteps: 10
    });
    
    // Make MCP instances available to routes
    app.locals.mcpClient = mcpClient;
    app.locals.mcpAgent = mcpAgent;
    
    console.log('✅ Mail MCP Agent initialized successfully');
    
    // Test the connection
    try {
      const testResponse = await mcpAgent.run('List available mail tools and capabilities');
      console.log('🧪 Mail MCP Test Response:', testResponse);
    } catch (testError) {
      console.warn('⚠️ Mail MCP test failed, but agent is initialized:', testError);
    }
    
    return mcpAgent;
    
  } catch (error) {
    console.error('❌ Failed to initialize Mail MCP:', error);
    console.log('📋 Falling back to mock mail data only');
    
    // Set to null to trigger fallback in routes
    mcpClient = null;
    mcpAgent = null;
    app.locals.mcpClient = null;
    app.locals.mcpAgent = null;
    
    return null;
  }
}

// Initialize MCP with Composio calendar service
async function initializeCalendarMCP() {
  try {
    console.log('📅 Initializing MCP with Composio calendar service...');
    
    // Check for required environment variables
    if (!process.env.ANTHROPIC_API_KEY) {
      console.warn('⚠️ ANTHROPIC_API_KEY not found, falling back to mock calendar data');
      return null;
    }
    
    // Configure MCP client for Calendar
    const calendarMcpConfig = {
      mcpServers: {
        composio_calendar: {
          command: 'npx',
          args: [
            '@composio/mcp@latest',
            'start',
            '--url',
            'https://mcp.composio.dev/composio/server/7478b12a-7327-41a6-af9c-cfe84cae7c66/mcp?include_composio_helper_actions=true'
          ],
          env: {
            npm_config_yes: 'true'
          }
        }
      }
    };
    
    // Initialize Calendar MCP client
    calendarMcpClient = MCPClient.fromDict(calendarMcpConfig);
    console.log('✅ Calendar MCP Client initialized');
    
    // Initialize LLM (Anthropic) for calendar
    const calendarLlm = new ChatAnthropic({
      model: 'claude-sonnet-4-20250514',
      apiKey: process.env.ANTHROPIC_API_KEY,
      temperature: 0.1
    });
    console.log('✅ Anthropic LLM initialized for calendar');
    
    // Initialize Calendar MCP agent
    calendarMcpAgent = new MCPAgent({
      llm: calendarLlm,
      client: calendarMcpClient,
      maxSteps: 10
    });
    
    // Make Calendar MCP instances available to routes
    app.locals.calendarMcpClient = calendarMcpClient;
    app.locals.calendarMcpAgent = calendarMcpAgent;
    
    console.log('✅ Calendar MCP Agent initialized successfully');
    
    // Test the calendar connection
    try {
      const testResponse = await calendarMcpAgent.run('List available calendar tools and capabilities');
      console.log('🧪 Calendar MCP Test Response:', testResponse);
    } catch (testError) {
      console.warn('⚠️ Calendar MCP test failed, but agent is initialized:', testError);
    }
    
    return calendarMcpAgent;
    
  } catch (error) {
    console.error('❌ Failed to initialize Calendar MCP:', error);
    console.log('📋 Falling back to mock calendar data only');
    
    // Set to null to trigger fallback in routes
    calendarMcpClient = null;
    calendarMcpAgent = null;
    app.locals.calendarMcpClient = null;
    app.locals.calendarMcpAgent = null;
    
    return null;
  }
}

// Initialize both MCP services
async function initializeMCP() {
  console.log('🚀 Initializing all MCP services...');
  
  // Initialize both mail and calendar MCP services in parallel
  const [mailAgent, calendarAgent] = await Promise.allSettled([
    initializeMailMCP(),
    initializeCalendarMCP()
  ]);
  
  console.log('📊 MCP Initialization Summary:');
  console.log(`  📧 Mail MCP: ${mailAgent.status === 'fulfilled' && mailAgent.value ? 'Connected' : 'Failed/Fallback'}`);
  console.log(`  📅 Calendar MCP: ${calendarAgent.status === 'fulfilled' && calendarAgent.value ? 'Connected' : 'Failed/Fallback'}`);
  
  return {
    mailAgent: mailAgent.status === 'fulfilled' ? mailAgent.value : null,
    calendarAgent: calendarAgent.status === 'fulfilled' ? calendarAgent.value : null
  };
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
    mcpStatus: {
      mail: mcpAgent ? 'connected' : 'disconnected',
      calendar: calendarMcpAgent ? 'connected' : 'disconnected'
    }
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
    console.log('🚀 Starting Weekend Dashboard Backend...');
    
    // Initialize database connection
    await connectDatabase();
    
    // Start cache cleanup service
    CacheCleanupService.start();
    
    // Start HTTP server immediately
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
      console.log(`🔗 CORS enabled for: ${process.env.CORS_ORIGIN || 'http://localhost:5173'}`);
      console.log(`💾 Database: ${process.env.MONGODB_URI ? 'Connected' : 'Not configured'}`);
      console.log(`🧹 Cache cleanup: Active`);
      console.log('✅ HTTP server started successfully!');
    });
    
    // Initialize MCP services in background (non-blocking)
    initializeMCP().then(() => {
      console.log(`🤖 MCP Status:`);
      console.log(`  📧 Mail: ${mcpAgent ? 'Connected' : 'Fallback Mode'}`);
      console.log(`  📅 Calendar: ${calendarMcpAgent ? 'Connected' : 'Fallback Mode'}`);
      console.log('✅ All MCP services initialized!');
    }).catch((error) => {
      console.warn('⚠️ MCP initialization failed, using fallback mode:', error);
    });
    
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n🛑 Received SIGINT, shutting down gracefully...');
  
  try {
    // Stop cache cleanup service
    CacheCleanupService.stop();
    
    // Disconnect from database
    await disconnectDatabase();
    
    console.log('✅ Graceful shutdown completed');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error during shutdown:', error);
    process.exit(1);
  }
});

process.on('SIGTERM', async () => {
  console.log('\n🛑 Received SIGTERM, shutting down gracefully...');
  
  try {
    // Stop cache cleanup service
    CacheCleanupService.stop();
    
    // Disconnect from database
    await disconnectDatabase();
    
    console.log('✅ Graceful shutdown completed');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error during shutdown:', error);
    process.exit(1);
  }
});

startServer();

export default app;