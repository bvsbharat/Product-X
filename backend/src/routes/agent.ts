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

// Generate summary from email and calendar data
router.post('/summary', async (req: express.Request, res: express.Response) => {
  try {
    const mcpAgent = req.app.locals.mcpAgent as MCPAgent;
    const { emails, events } = req.body;
    
    if (!mcpAgent) {
      return res.status(503).json({
        success: false,
        error: 'MCP Agent not available',
        message: 'MCP agent is not initialized. Using fallback summary.'
      });
    }
    
    if (!emails || !events) {
      return res.status(400).json({
        success: false,
        error: 'Missing data',
        message: 'Please provide both emails and events data'
      });
    }
    
    console.log(`📝 Generating summary for ${emails.length} emails and ${events.length} events`);
    
    // Create a detailed prompt for the LLM
    const prompt = `
You are a personal assistant creating a brief, engaging daily summary. Based on the following data, write a single paragraph (2-3 sentences) that summarizes the day ahead in a friendly, emoji-rich way.

EMAILS DATA:
${emails.map((email: any) => `- ${email.subject} (Priority: ${email.priority}, Read: ${email.isRead})`).join('\n')}

CALENDAR EVENTS:
${events.map((event: any) => `- ${event.title} at ${event.time}${event.description ? ' - ' + event.description : ''}`).join('\n')}

Guidelines:
- Use relevant emojis throughout
- Mention key highlights like urgent emails, important meetings
- Keep it concise but informative
- Make it sound personal and engaging
- Focus on what's most important for the day

Write only the summary paragraph, nothing else.`;
    
    const startTime = Date.now();
    const response = await mcpAgent.run(prompt);
    const duration = Date.now() - startTime;
    
    console.log(`✅ Summary generated in ${duration}ms`);
    
    res.json({
      success: true,
      data: {
        summary: response,
        duration: `${duration}ms`,
        timestamp: new Date().toISOString()
      },
      message: 'Summary generated successfully'
    });
    
  } catch (error) {
    console.error('❌ Summary generation failed:', error);
    
    // Fallback summary if LLM fails
    const fallbackSummary = "📅 Your day is shaping up nicely! 📧 You have some emails to review and 🗓️ several events on your calendar. Stay organized and have a productive day! ✨";
    
    res.json({
      success: true,
      data: {
        summary: fallbackSummary,
        fallback: true,
        timestamp: new Date().toISOString()
      },
      message: 'Using fallback summary due to LLM unavailability'
    });
  }
});

export default router;