// API services for the Weekend Dashboard App - Backend Integration

const API_BASE_URL = 'http://localhost:3001/api';

export interface WeatherData {
  current: {
    temperature: number;
    condition: string;
    icon: string;
    location: string;
    high: number;
    low: number;
    sunset: string;
  };
  forecast: Array<{
    day: string;
    high: number;
    low: number;
    condition: string;
    icon: string;
  }>;
  hourly: Array<{
    time: string;
    temperature: number;
    precipitation: number;
  }>;
}

export interface Event {
  id: string;
  title: string;
  time: string;
  category: 'meeting' | 'personal' | 'fitness' | 'social';
  location?: string;
  description?: string;
  date?: string;
}

export interface WorkoutData {
  weeklyStats: {
    totalTime: string;
    sessions: number;
    calories: number;
    topExercise: string;
  };
  exercises: Array<{
    name: string;
    sessions: number;
    calories: number;
    duration: string;
  }>;
  history: Array<{
    id: string;
    date: string;
    type: string;
    duration: string;
    calories: number;
  }>;
}

export interface PhotoMemory {
  id: string;
  url: string;
  date: string;
  location: string;
  description: string;
}

export interface Email {
  id: string;
  subject: string;
  sender: string;
  summary: string;
  content: string;
  time: string;
  priority: 'high' | 'medium' | 'low';
  isRead: boolean;
}

// Helper function to handle API requests with fallback to mock data
const apiRequest = async <T>(endpoint: string, options?: RequestInit, fallbackData?: T): Promise<T> => {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data.data || data;
  } catch (error) {
    console.warn('API request failed, falling back to mock data:', error);
    if (fallbackData) {
      return fallbackData;
    }
    throw error;
  }
};

// Mock data for fallback
const mockEvents: Event[] = [
  {
    id: '1',
    title: 'Pilates',
    time: '10:00 AM',
    category: 'fitness',
    location: 'Fitness Studio',
    date: new Date().toISOString().split('T')[0]
  },
  {
    id: '2',
    title: 'Meeting',
    time: '12:30 PM',
    category: 'meeting',
    location: 'Conference Room',
    date: new Date().toISOString().split('T')[0]
  },
  {
    id: '3',
    title: 'Coffee',
    time: '4:30 PM',
    category: 'social',
    location: 'Local Cafe',
    date: new Date().toISOString().split('T')[0]
  }
];

const mockEmails: Email[] = [
  {
    id: '1',
    subject: 'Weekly Team Meeting',
    sender: 'manager@company.com',
    summary: 'Agenda for this week\'s team meeting including project updates.',
    content: 'Hi team, please find the agenda for our weekly meeting...',
    time: '2 hours ago',
    priority: 'high',
    isRead: false
  },
  {
    id: '2',
    subject: 'Project Update',
    sender: 'colleague@company.com',
    summary: 'Latest updates on the dashboard project.',
    content: 'The dashboard project is progressing well...',
    time: '4 hours ago',
    priority: 'medium',
    isRead: true
  }
];

// Events API
export const getEvents = async (): Promise<Event[]> => {
  try {
    // Try backend API first
    const response = await fetch(`${API_BASE_URL}/events`);
    if (response.ok) {
      const data = await response.json();
      return data.data || data;
    }
    throw new Error('Backend API failed');
  } catch (error) {
    console.warn('Backend API failed, using mock data:', error);
    return mockEvents;
  }
};

export const createEvent = async (event: Omit<Event, 'id'>): Promise<Event> => {
  return apiRequest<Event>('/events', {
    method: 'POST',
    body: JSON.stringify(event),
  });
};

// Email API
export const getEmails = async (): Promise<Email[]> => {
  return apiRequest<Email[]>('/mail', undefined, mockEmails);
};

export const getUnreadEmailCount = async (): Promise<{ unreadCount: number }> => {
  return apiRequest<{ unreadCount: number }>('/mail/unread-count', undefined, { unreadCount: 1 });
};

export const markEmailAsRead = async (emailId: string): Promise<{ emailId: string; status: string }> => {
  return apiRequest<{ emailId: string; status: string }>(`/mail/${emailId}/read`, {
    method: 'PATCH',
  }, { emailId, status: 'read' });
};

// Agent API
export const queryAgent = async (query: string, maxSteps?: number): Promise<{ query: string; result: string; maxSteps: number }> => {
  const mockResponse = {
    query,
    result: `Mock response for: ${query}. This is a simulated AI assistant response.`,
    maxSteps: maxSteps || 5
  };
  return apiRequest<{ query: string; result: string; maxSteps: number }>('/agent/query', {
    method: 'POST',
    body: JSON.stringify({ query, maxSteps }),
  }, mockResponse);
};

export const getAvailableTools = async (): Promise<Array<{ name: string; description: string; server: string }>> => {
  const mockTools = [
    { name: 'calendar', description: 'Manage calendar events', server: 'calendar-server' },
    { name: 'email', description: 'Handle email operations', server: 'email-server' },
    { name: 'weather', description: 'Get weather information', server: 'weather-server' }
  ];
  return apiRequest<Array<{ name: string; description: string; server: string }>>('/agent/tools', undefined, mockTools);
};

// Summary API
export const generateSummary = async (emails: Email[], events: Event[]): Promise<{ summary: string; fallback?: boolean }> => {
  const fallbackSummary = "📅 Your day is shaping up nicely! 📧 You have some emails to review and 🗓️ several events on your calendar. Stay organized and have a productive day! ✨";
  
  try {
    const response = await fetch(`${API_BASE_URL}/agent/summary`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ emails, events }),
    });
    
    if (!response.ok) {
      throw new Error(`Summary API failed: ${response.status}`);
    }
    
    const data = await response.json();
    return {
      summary: data.data.summary,
      fallback: data.data.fallback || false
    };
  } catch (error) {
    console.warn('Summary API failed, using fallback:', error);
    return {
      summary: fallbackSummary,
      fallback: true
    };
  }
};

// Weather API (fallback to mock data for now)
export const getWeatherData = async (): Promise<WeatherData> => {
  // For now, return mock data since we don't have a weather backend endpoint
  // In a real implementation, this would call the backend weather service
  await new Promise(resolve => setTimeout(resolve, 500));
  
  return {
    current: {
      temperature: 27,
      condition: 'Sunny',
      icon: 'sun',
      location: 'New York',
      high: 30,
      low: 21,
      sunset: '8:31 PM'
    },
    forecast: [
      { day: 'Today', high: 30, low: 21, condition: 'Sunny', icon: 'sun' },
      { day: 'Tomorrow', high: 28, low: 19, condition: 'Partly Cloudy', icon: 'cloud-sun' },
      { day: 'Wednesday', high: 25, low: 18, condition: 'Cloudy', icon: 'cloud' },
      { day: 'Thursday', high: 23, low: 16, condition: 'Rainy', icon: 'cloud-rain' },
      { day: 'Friday', high: 26, low: 20, condition: 'Sunny', icon: 'sun' },
      { day: 'Saturday', high: 29, low: 22, condition: 'Sunny', icon: 'sun' },
      { day: 'Sunday', high: 31, low: 24, condition: 'Hot', icon: 'sun' }
    ],
    hourly: [
      { time: '9:00 AM', temperature: 24, precipitation: 0 },
      { time: '10:00 AM', temperature: 26, precipitation: 0 },
      { time: '11:00 AM', temperature: 27, precipitation: 0 },
      { time: '12:00 PM', temperature: 29, precipitation: 0 },
      { time: '1:00 PM', temperature: 30, precipitation: 0 },
      { time: '2:00 PM', temperature: 30, precipitation: 0 },
      { time: '3:00 PM', temperature: 29, precipitation: 0 },
      { time: '4:00 PM', temperature: 28, precipitation: 0 }
    ]
  };
};

// Workout API (fallback to mock data for now)
export const getWorkoutData = async (): Promise<WorkoutData> => {
  // For now, return mock data since we don't have a workout backend endpoint
  // In a real implementation, this would call the backend workout service
  await new Promise(resolve => setTimeout(resolve, 400));
  
  return {
    weeklyStats: {
      totalTime: '5:29:45',
      sessions: 6,
      calories: 2762,
      topExercise: 'Pilates'
    },
    exercises: [
      {
        name: 'Pilates',
        sessions: 3,
        calories: 1480,
        duration: '3:23:02'
      },
      {
        name: 'Running',
        sessions: 2,
        calories: 890,
        duration: '1:45:30'
      },
      {
        name: 'Yoga',
        sessions: 1,
        calories: 392,
        duration: '0:21:13'
      }
    ],
    history: [
      {
        id: '1',
        date: 'July 12',
        type: 'Pilates',
        duration: '1:15:00',
        calories: 520
      },
      {
        id: '2',
        date: 'July 11',
        type: 'Running',
        duration: '0:45:00',
        calories: 450
      },
      {
        id: '3',
        date: 'July 10',
        type: 'Yoga',
        duration: '0:21:13',
        calories: 392
      }
    ]
  };
};

// Photo Memories API (fallback to mock data for now)
export const getPhotoMemories = async (): Promise<PhotoMemory[]> => {
  // For now, return mock data since we don't have a photos backend endpoint
  // In a real implementation, this would call the backend photos service
  await new Promise(resolve => setTimeout(resolve, 600));
  
  return [
    {
      id: '1',
      url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop',
      date: 'July 10, 2024',
      location: 'Central Park, NYC',
      description: 'Beautiful morning walk in the park'
    },
    {
      id: '2',
      url: 'https://images.unsplash.com/photo-1551632811-561732d1e306?w=400&h=300&fit=crop',
      date: 'July 8, 2024',
      location: 'Brooklyn Bridge',
      description: 'Sunset view from the bridge'
    },
    {
      id: '3',
      url: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400&h=300&fit=crop',
      date: 'July 5, 2024',
      location: 'Coffee Shop',
      description: 'Perfect latte art'
    }
  ];
};