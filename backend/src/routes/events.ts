import express from 'express';
import { CacheService } from '../models/Cache.js';

const router = express.Router();

export interface Event {
  id: string;
  title: string;
  time: string;
  category?: 'meeting' | 'personal' | 'fitness' | 'social';
  location?: string;
  description?: string;
  date?: string;
}

// Get events with MCP calendar integration and MongoDB caching
router.get('/', async (req: express.Request, res: express.Response) => {
  try {
    console.log('📅 Fetching calendar events...');
    
    // Generate cache key for events
    const cacheKey = CacheService.generateKey('events', 'calendar', 'today_tomorrow');
    
    // Check cache first
    const cachedEvents = await CacheService.get(cacheKey);
    if (cachedEvents) {
      console.log('🎯 Returning cached calendar events');
      return res.json({
        success: true,
        data: cachedEvents,
        source: 'MongoDB Cache',
        timestamp: new Date().toISOString(),
        message: 'Calendar events retrieved from cache'
      });
    }
    
    const calendarMcpAgent = req.app.locals.calendarMcpAgent;
    let events: Event[] = [];
    let source = 'mock';
    let message = 'Using mock calendar data';
    
    // Try Calendar MCP first if available
    if (calendarMcpAgent) {
      try {
        console.log('🔄 Attempting to fetch calendar events via Calendar MCP...');
        
        const mcpResponse = await calendarMcpAgent.run(
          'Get my calendar events for today and tomorrow. Please return them as a simple JSON array with only title and time: [{"title": "event_title", "time": "start_time - end_time"}]. Keep it clean and simple with just these two essential fields.'
        );
        
        console.log('📅 MCP Calendar Response:', mcpResponse);
        
        // Try to parse the MCP response
        if (mcpResponse && typeof mcpResponse === 'string') {
          // Attempt to extract structured data from the response
          const parsedEvents = parseMCPCalendarResponse(mcpResponse);
          if (parsedEvents.length > 0) {
            events = parsedEvents;
            source = 'Calendar MCP Agent';
            message = 'Calendar events fetched via Calendar MCP';
            console.log('✅ Successfully parsed MCP calendar events:', events.length);
            
            // Cache the successful MCP response for 5 minutes
            await CacheService.set(cacheKey, events, 'events', 300, {
              source: 'Calendar MCP',
              query: 'today_tomorrow_events',
              eventCount: events.length
            });
          } else {
            throw new Error('No events found in MCP response');
          }
        } else {
          throw new Error('Invalid MCP response format');
        }
        
      } catch (mcpError) {
        console.warn('⚠️ Calendar MCP fetch failed, falling back to mock data:', mcpError);
        events = await getMockEvents();
      }
    } else {
      console.log('📋 Calendar MCP not available, using mock data');
      events = await getMockEvents();
    }
    
    res.json({
      success: true,
      data: events,
      source,
      timestamp: new Date().toISOString(),
      message
    });
    
  } catch (error) {
    console.error('❌ Error fetching events:', error);
    
    // Fallback to mock data on any error
    try {
      const fallbackEvents = await getMockEvents();
      res.json({
        success: true,
        data: fallbackEvents,
        source: 'mock',
        timestamp: new Date().toISOString(),
        message: 'Fallback to mock data due to error',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    } catch (fallbackError) {
      res.status(500).json({ 
        error: 'Failed to fetch events',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }
});

// Create a new event (mock implementation only)
router.post('/', async (req: express.Request, res: express.Response) => {
  try {
    const { title, date, time, location, description, category } = req.body;
    
    if (!title || !date || !time) {
      return res.status(400).json({ error: 'Title, date, and time are required' });
    }

    console.log('📅 Creating new event using mock implementation...');
    
    // Create mock event directly
    const newEvent: Event = {
      id: Date.now().toString(),
      title,
      time: `${date} at ${time}`,
      category: category || 'personal',
      location,
      description,
      date
    };
    
    res.status(201).json({
      success: true,
      data: newEvent,
      message: 'Event created successfully (mock implementation)',
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Error creating event:', error);
    res.status(500).json({ 
      error: 'Failed to create event',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});



// Helper function to parse MCP calendar response
function parseMCPCalendarResponse(response: string): Event[] {
  try {
    console.log('📅 Raw MCP Response:', response);
    
    // Handle case where response indicates no calendar tools available
    if (response.includes('calendar functionality') || 
        response.includes('calendar tools') || 
        response.includes('Google Calendar tools')) {
      console.log('📅 MCP indicates calendar tools not available');
      return [];
    }
    
    // Try to extract structured data from markdown table format
    if (response.includes('|') && response.includes('ID') && response.includes('Title')) {
      return parseMarkdownTableFormat(response);
    }
    
    // Try to extract JSON from the response with better error handling
    const jsonMatch = response.match(/\[.*?\]/s);
    if (jsonMatch) {
      try {
        const jsonString = jsonMatch[0];
        console.log('📅 Attempting to parse JSON:', jsonString);
        const parsed = JSON.parse(jsonString);
        
        if (Array.isArray(parsed)) {
          return parsed.map((event: any, index: number) => ({
            id: event.id || `mcp-${index + 1}`,
            title: event.title || event.summary || 'Untitled Event',
            time: formatEventTime(event.time || event.start || 'Time TBD'),
            date: new Date().toISOString().split('T')[0]
          }));
        }
      } catch (jsonError) {
        console.warn('📅 JSON parsing failed:', jsonError);
        // Continue to text parsing
      }
    }
    
    // Try to extract events from structured text patterns
    const events = parseTextualResponse(response);
    if (events.length > 0) {
      return events;
    }
    
    // If no structured data found, return empty array
    console.log('📅 No parseable calendar events found in response');
    return [];
    
  } catch (error) {
    console.error('Error parsing MCP calendar response:', error);
    return [];
  }
}

// Helper function to parse textual responses
function parseTextualResponse(response: string): Event[] {
  const events: Event[] = [];
  const lines = response.split('\n').filter(line => line.trim());
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    // Look for patterns like "Event: Title at Time" or "Title - Time"
    if (line.includes(':') && (line.toLowerCase().includes('meeting') || 
        line.toLowerCase().includes('event') || 
        line.toLowerCase().includes('appointment') ||
        line.toLowerCase().includes('call') ||
        line.toLowerCase().includes('lunch') ||
        line.toLowerCase().includes('dinner'))) {
      
      const parts = line.split(':');
      if (parts.length >= 2) {
        events.push({
          id: `mcp-text-${i + 1}`,
          title: parts[0].trim(),
          time: formatEventTime(parts[1]?.trim() || 'Time TBD'),
          date: new Date().toISOString().split('T')[0]
        });
      }
    }
    
    // Look for bullet points or numbered lists
    const bulletMatch = line.match(/^[\-\*\d+\.\)\s]*(.+?)\s+(?:at|from|@)\s+(.+)$/i);
    if (bulletMatch) {
      events.push({
        id: `mcp-bullet-${i + 1}`,
        title: bulletMatch[1].trim(),
        time: formatEventTime(bulletMatch[2].trim()),
        date: new Date().toISOString().split('T')[0]
      });
    }
  }
  
  return events;
}

// Helper function to parse markdown table format
function parseMarkdownTableFormat(response: string): Event[] {
  try {
    const events: Event[] = [];
    const lines = response.split('\n');
    let isInTable = false;
    let headerFound = false;
    
    for (const line of lines) {
      const trimmedLine = line.trim();
      
      // Skip empty lines
      if (!trimmedLine) continue;
      
      // Check if we're in a table
      if (trimmedLine.includes('|') && trimmedLine.includes('ID') && trimmedLine.includes('Title')) {
        isInTable = true;
        headerFound = true;
        continue;
      }
      
      // Skip separator line
      if (trimmedLine.includes('|---') || trimmedLine.includes('|---|')) {
        continue;
      }
      
      // Parse table rows
      if (isInTable && headerFound && trimmedLine.includes('|')) {
        const columns = trimmedLine.split('|').map(col => col.trim()).filter(col => col);
        
        if (columns.length >= 4) {
          const id = columns[0].replace(/`/g, '').trim();
          const title = columns[1].trim();
          const time = formatEventTime(columns[2].trim());
          const category = mapToCategory(columns[3].replace(/\*\*/g, '').trim());
          const location = columns[4] && columns[4] !== 'Not specified' ? columns[4].trim() : undefined;
          const description = columns[5] ? columns[5].trim() : undefined;
          
          if (id && title) {
            events.push({
              id,
              title,
              time,
              date: new Date().toISOString().split('T')[0]
            });
          }
        }
      }
      
      // Stop parsing if we hit a non-table line after starting a table
      if (isInTable && !trimmedLine.includes('|') && !trimmedLine.includes('**Today**') && !trimmedLine.includes('**Tomorrow**')) {
        break;
      }
    }
    
    console.log('📅 Parsed events from markdown table:', events);
    return events;
  } catch (error) {
    console.error('Error parsing markdown table format:', error);
    return [];
  }
}

// Helper function to format event time
function formatEventTime(timeStr: string): string {
  try {
    // Handle time ranges like "12:00 PM - 1:00 PM (PDT)"
    if (timeStr.includes(' - ')) {
      const [startTime, endTime] = timeStr.split(' - ');
      const cleanStartTime = startTime.trim();
      const cleanEndTime = endTime.replace(/\s*\([^)]*\)/, '').trim(); // Remove timezone
      return `${cleanStartTime} - ${cleanEndTime}`;
    }
    
    // Handle single times
    const cleanTime = timeStr.replace(/\s*\([^)]*\)/, '').trim(); // Remove timezone
    return cleanTime || 'Time TBD';
  } catch (error) {
    console.error('Error formatting time:', error);
    return timeStr || 'Time TBD';
  }
}

// Helper function to map categories
function mapToCategory(category: string): 'meeting' | 'personal' | 'fitness' | 'social' {
  const cat = category.toLowerCase();
  if (cat.includes('meeting') || cat.includes('work') || cat.includes('business')) return 'meeting';
  if (cat.includes('fitness') || cat.includes('gym') || cat.includes('workout')) return 'fitness';
  if (cat.includes('social') || cat.includes('dinner') || cat.includes('party')) return 'social';
  return 'personal';
}

// Helper function to get mock events
async function getMockEvents(): Promise<Event[]> {
  try {
    const mockEvents: Event[] = [
      {
        id: '1',
        title: 'Team Meeting',
        time: '10:00 AM - 11:00 AM',
        date: new Date().toISOString().split('T')[0]
      },
      {
        id: '2',
        title: 'Gym Session',
        time: '6:00 PM - 7:30 PM',
        date: new Date().toISOString().split('T')[0]
      },
      {
        id: '3',
        title: 'Dinner with Friends',
        time: '7:30 PM - 9:00 PM',
        date: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0]
      },
      {
        id: '4',
        title: 'Project Review',
        time: '2:00 PM - 3:00 PM',
        date: new Date().toISOString().split('T')[0]
      },
      {
        id: '5',
        title: 'Coffee Break',
        time: '3:30 PM - 4:00 PM',
        date: new Date().toISOString().split('T')[0]
      }
    ];
    
    return mockEvents;
  } catch (error) {
    console.error('Error getting mock events:', error);
    return [];
  }
}

export default router;