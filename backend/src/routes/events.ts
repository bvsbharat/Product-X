import express from 'express';

const router = express.Router();

export interface Event {
  id: string;
  title: string;
  time: string;
  category: 'meeting' | 'personal' | 'fitness' | 'social';
  location?: string;
  description?: string;
  date?: string;
}

// Get events with mock data only (calendar MCP removed due to access issues)
router.get('/', async (req: express.Request, res: express.Response) => {
  try {
    console.log('📅 Fetching calendar events using mock data...');
    
    // Use mock data directly since MCP doesn't have calendar access
    const events: Event[] = await getMockEvents();
    
    res.json({
      success: true,
      data: events,
      source: 'mock',
      timestamp: new Date().toISOString(),
      message: 'Using mock calendar data'
    });
    
  } catch (error) {
    console.error('❌ Error fetching events:', error);
    res.status(500).json({ 
      error: 'Failed to fetch events',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
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



// Helper function to get mock events
async function getMockEvents(): Promise<Event[]> {
  try {
    const mockEvents: Event[] = [
      {
        id: '1',
        title: 'Team Meeting',
        time: 'Today at 10:00 AM',
        category: 'meeting',
        location: 'Conference Room A',
        description: 'Weekly team sync meeting',
        date: new Date().toISOString().split('T')[0]
      },
      {
        id: '2',
        title: 'Gym Session',
        time: 'Today at 6:00 PM',
        category: 'fitness',
        location: 'Local Gym',
        description: 'Cardio and strength training',
        date: new Date().toISOString().split('T')[0]
      },
      {
        id: '3',
        title: 'Dinner with Friends',
        time: 'Tomorrow at 7:30 PM',
        category: 'social',
        location: 'Italian Restaurant',
        description: 'Monthly dinner meetup',
        date: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0]
      }
    ];
    
    return mockEvents;
  } catch (error) {
    console.error('Error getting mock events:', error);
    return [];
  }
}

export default router;