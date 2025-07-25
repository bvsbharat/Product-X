import express from 'express';
import { MCPAgent } from 'mcp-use';

const router = express.Router();

// Test MCP agent endpoint
router.post('/test', async (req: express.Request, res: express.Response) => {
  try {
    const mcpAgent = req.app.locals.mcpAgent as MCPAgent;
    const { query } = req.body;
    
    if (!mcpAgent) {
      return res.status(503).json({
        success: false,
        error: 'MCP Agent not available',
        message: 'MCP agent is not initialized. Check server logs for details.'
      });
    }
    
    if (!query) {
      return res.status(400).json({
        success: false,
        error: 'Missing query parameter',
        message: 'Please provide a query in the request body'
      });
    }
    
    console.log(`🧪 Testing MCP agent with query: ${query}`);
    
    const startTime = Date.now();
    const response = await mcpAgent.run(query);
    const duration = Date.now() - startTime;
    
    console.log(`✅ MCP agent response received in ${duration}ms`);
    
    res.json({
      success: true,
      data: {
        query,
        response,
        duration: `${duration}ms`,
        timestamp: new Date().toISOString()
      },
      message: 'MCP agent query executed successfully'
    });
    
  } catch (error) {
    console.error('❌ MCP agent test failed:', error);
    res.status(500).json({
      success: false,
      error: 'MCP agent query failed',
      message: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    });
  }
});

// Get MCP agent status
router.get('/status', async (req: express.Request, res: express.Response) => {
  try {
    const mcpAgent = req.app.locals.mcpAgent as MCPAgent;
    const mcpClient = req.app.locals.mcpClient;
    
    res.json({
      success: true,
      data: {
        agentAvailable: !!mcpAgent,
        clientAvailable: !!mcpClient,
        timestamp: new Date().toISOString()
      },
      message: mcpAgent ? 'MCP agent is available' : 'MCP agent is not available'
    });
    
  } catch (error) {
    console.error('❌ Error checking MCP status:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to check MCP status',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// List available tools
router.get('/tools', async (req: express.Request, res: express.Response) => {
  try {
    const mcpAgent = req.app.locals.mcpAgent as MCPAgent;
    
    if (!mcpAgent) {
      return res.status(503).json({
        success: false,
        error: 'MCP Agent not available',
        message: 'MCP agent is not initialized'
      });
    }
    
    console.log('🔧 Fetching available tools...');
    
    const toolsResponse = await mcpAgent.run('List all available tools and their descriptions');
    
    res.json({
      success: true,
      data: {
        tools: toolsResponse,
        timestamp: new Date().toISOString()
      },
      message: 'Available tools retrieved successfully'
    });
    
  } catch (error) {
    console.error('❌ Error fetching tools:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch tools',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

export default router;