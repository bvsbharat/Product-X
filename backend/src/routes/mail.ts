import express from 'express';
import { MCPAgent } from 'mcp-use';

const router = express.Router();

export interface Email {
  id: string;
  subject: string;
  sender: string;
  summary: string;
  content: string; // Placeholder - actual content loaded on demand
  time: string;
  priority: 'high' | 'medium' | 'low';
  isRead: boolean;
}

// Removed promotional email filtering - letting the agent handle filtering

// Removed Gmail API parsing function - using simplified agent approach

// Removed log extraction function - using simplified agent approach

// Removed complex parsing function - using simplified agent approach

// Removed unread count parsing function - using simplified agent approach

// Get emails with simplified MCP agent integration
router.get('/', async (req: express.Request, res: express.Response) => {
  try {
    const mcpAgent = req.app.locals.mcpAgent as MCPAgent;
    
    if (!mcpAgent) {
      return res.status(503).json({
        success: false,
        error: 'MCP agent not available',
        message: 'Gmail integration is not configured or unavailable'
      });
    }
    
    console.log('🔄 Fetching emails via MCP agent...');
    
    // Use natural language prompt like the Airbnb example
    // Let the agent handle the tool calls and return structured data
    const emailQuery = `Get the latest 5 primary emails from my Gmail inbox. For each email, return a JSON object with:
- id: email ID
- subject: email subject
- sender: sender email address
- summary: email snippet/preview
- time: email date/time
- isRead: whether the email is read

Filter out promotional, marketing, and spam emails. Only return important personal or work emails. Return the result as a JSON array.`;
    
    const mcpResponse = await mcpAgent.run(emailQuery);
    console.log('📧 MCP agent response:', typeof mcpResponse === 'string' ? mcpResponse.substring(0, 300) + '...' : mcpResponse);
    
    // Try to parse the agent's response as structured data
    let emails: Email[] = [];
    
    if (typeof mcpResponse === 'string') {
      // Look for JSON array in the response
      const jsonMatch = mcpResponse.match(/\[\s*\{[\s\S]*?\}\s*\]/);
      if (jsonMatch) {
        try {
          const parsedEmails = JSON.parse(jsonMatch[0]);
          emails = parsedEmails.map((email: any) => ({
            id: email.id || Math.random().toString(36).substr(2, 9),
            subject: email.subject || 'No Subject',
            sender: email.sender || email.from || 'Unknown Sender',
            summary: email.summary || email.snippet || 'No preview available',
            content: 'Content available on demand',
            time: email.time || email.date || new Date().toLocaleString(),
            priority: 'medium' as const,
            isRead: email.isRead || false
          }));
        } catch (parseError) {
          console.error('❌ Failed to parse JSON from agent response:', parseError);
        }
      }
      
      // Fallback: extract from text format
      if (emails.length === 0) {
        const emailBlocks = mcpResponse.split(/Email \d+:|\*\*Email \d+\*\*/);
        for (let i = 1; i < emailBlocks.length && i <= 5; i++) {
          const block = emailBlocks[i];
          const subjectMatch = block.match(/Subject:?\s*(.+?)\n/i) || block.match(/\*\*Subject\*\*:?\s*(.+?)\n/i);
          const senderMatch = block.match(/From:?\s*(.+?)\n/i) || block.match(/Sender:?\s*(.+?)\n/i);
          const summaryMatch = block.match(/Summary:?\s*(.+?)\n/i) || block.match(/Snippet:?\s*(.+?)\n/i);
          
          if (subjectMatch && senderMatch) {
            emails.push({
              id: `email-${i}`,
              subject: subjectMatch[1].trim(),
              sender: senderMatch[1].trim(),
              summary: summaryMatch ? summaryMatch[1].trim() : 'No preview available',
              content: 'Content available on demand',
              time: new Date().toLocaleString(),
              priority: 'medium' as const,
              isRead: false
            });
          }
        }
      }
    }
    
    if (emails.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'No emails found',
        message: 'No emails could be retrieved or parsed from Gmail'
      });
    }
    
    res.json({
      success: true,
      data: emails,
      source: 'mcp-agent',
      timestamp: new Date().toISOString(),
      message: `Retrieved ${emails.length} emails via MCP agent`
    });
    
  } catch (error) {
    console.error('❌ Error fetching emails:', error);
    
    res.status(500).json({ 
      success: false,
      error: 'Failed to fetch emails from Gmail',
      message: error instanceof Error ? error.message : 'Unknown error occurred while fetching emails'
    });
  }
});

// Get unread emails count
router.get('/unread-count', async (req: express.Request, res: express.Response) => {
  try {
    const mcpAgent = req.app.locals.mcpAgent as MCPAgent;
    
    if (!mcpAgent) {
      return res.status(503).json({
        success: false,
        error: 'MCP agent not available',
        message: 'Gmail integration is not configured'
      });
    }
    
    const mcpResponse = await mcpAgent.run('Get the count of unread emails in my Gmail primary inbox. Return only the number.');
    
    // Extract number from response
    let unreadCount = 0;
    if (typeof mcpResponse === 'string') {
      const numberMatch = mcpResponse.match(/\d+/);
      if (numberMatch) {
        unreadCount = parseInt(numberMatch[0], 10);
      }
    }
    
    res.json({
      success: true,
      data: { unreadCount },
      source: 'mcp-agent',
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('❌ Error fetching unread count:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to fetch unread count',
      message: error instanceof Error ? error.message : 'Unknown error occurred while fetching unread count'
    });
  }
});

// Mark email as read
router.patch('/:emailId/read', async (req: express.Request, res: express.Response) => {
  try {
    const { emailId } = req.params;
    const mcpAgent = req.app.locals.mcpAgent as MCPAgent;
    
    if (!mcpAgent) {
      return res.status(503).json({
        success: false,
        error: 'MCP agent not available',
        message: 'Gmail integration is not configured'
      });
    }
    
    const mcpResponse = await mcpAgent.run(`Mark email with ID ${emailId} as read in Gmail`);
    
    res.json({
      success: true,
      data: { emailId, status: 'read' },
      message: 'Email marked as read via MCP',
      mcpResponse,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('❌ Error marking email as read:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to mark email as read',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

export default router;