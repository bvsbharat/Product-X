// Mock API services for the Weekend Dashboard App

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

// Mock Weather API
export const getWeatherData = async (): Promise<WeatherData> => {
  // Simulate API delay
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

// Mock Events API
export const getEvents = async (): Promise<Event[]> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  return [
    {
      id: '1',
      title: 'Pilates',
      time: '10:00 AM',
      category: 'fitness',
      location: 'Fitness Studio'
    },
    {
      id: '2',
      title: 'Meeting',
      time: '12:30 PM',
      category: 'meeting',
      location: 'Conference Room'
    },
    {
      id: '3',
      title: 'Coffee',
      time: '4:30 PM',
      category: 'social',
      location: 'Local Cafe'
    }
  ];
};

// Mock Workout API
export const getWorkoutData = async (): Promise<WorkoutData> => {
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

// Mock Photo Memories API
export const getPhotoMemories = async (): Promise<PhotoMemory[]> => {
  await new Promise(resolve => setTimeout(resolve, 200));
  
  return [
    {
      id: '1',
      url: 'https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=beautiful%20cityscape%20with%20modern%20architecture%20and%20bridge%20sunny%20day&image_size=landscape_4_3',
      date: 'Wed July 9',
      location: 'New York',
      description: 'Beautiful day exploring the city'
    }
  ];
};

// Mock API for creating events
export const createEvent = async (event: Omit<Event, 'id'>): Promise<Event> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  return {
    ...event,
    id: Date.now().toString()
  };
};

// Mock API for updating events
export const updateEvent = async (id: string, event: Partial<Event>): Promise<Event> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  return {
    id,
    title: event.title || 'Updated Event',
    time: event.time || '12:00 PM',
    category: event.category || 'personal',
    location: event.location,
    description: event.description
  };
};

// Mock API for deleting events
export const deleteEvent = async (id: string): Promise<void> => {
  await new Promise(resolve => setTimeout(resolve, 200));
};

// Mock Emails API
export const getEmails = async (): Promise<Email[]> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  return [
    {
      id: '1',
      subject: 'Weekend Project Update',
      sender: 'Sarah Johnson',
      summary: 'Quick update on the weekend project deliverables and next steps for Monday.',
      content: 'Hi team,\n\nI wanted to provide a quick update on our weekend project. We\'ve successfully completed the initial phase and are ready to move forward with the implementation. The deliverables are on track and we should be ready for Monday\'s presentation.\n\nNext steps:\n- Finalize the documentation\n- Prepare the demo\n- Schedule follow-up meetings\n\nLet me know if you have any questions.\n\nBest regards,\nSarah',
      time: '2 hours ago',
      priority: 'high',
      isRead: false
    },
    {
      id: '2',
      subject: 'Team Meeting Agenda',
      sender: 'Mike Chen',
      summary: 'Agenda for Monday\'s team meeting including quarterly review and planning.',
      content: 'Hello everyone,\n\nHere\'s the agenda for our upcoming team meeting on Monday:\n\n1. Quarterly Review (30 mins)\n2. Project Updates (20 mins)\n3. Resource Planning (15 mins)\n4. Q&A Session (15 mins)\n\nPlease come prepared with your project status updates and any questions you might have.\n\nSee you all on Monday!\n\nMike',
      time: '4 hours ago',
      priority: 'medium',
      isRead: false
    },
    {
      id: '3',
      subject: 'Travel Confirmation',
      sender: 'BookingPro',
      summary: 'Your upcoming trip confirmation with flight details and hotel booking.',
      content: 'Dear Traveler,\n\nYour booking has been confirmed!\n\nFlight Details:\n- Departure: July 15, 2024 at 10:30 AM\n- Arrival: July 15, 2024 at 2:45 PM\n- Flight: AA1234\n\nHotel Details:\n- Check-in: July 15, 2024\n- Check-out: July 18, 2024\n- Hotel: Grand Plaza Downtown\n\nHave a wonderful trip!\n\nBookingPro Team',
      time: '6 hours ago',
      priority: 'high',
      isRead: true
    },
    {
      id: '4',
      subject: 'Security Alert',
      sender: 'IT Security',
      summary: 'Important security update regarding recent login attempts.',
      content: 'SECURITY ALERT\n\nWe detected unusual login attempts on your account from an unrecognized device. If this was you, please ignore this message. If not, please take the following actions immediately:\n\n1. Change your password\n2. Enable two-factor authentication\n3. Review recent account activity\n\nYour account security is our top priority.\n\nIT Security Team',
      time: '8 hours ago',
      priority: 'high',
      isRead: false
    },
    {
      id: '5',
      subject: 'Monthly Newsletter',
      sender: 'Company News',
      summary: 'July newsletter with company updates, achievements, and upcoming events.',
      content: 'July Newsletter\n\nDear Team,\n\nWelcome to our July newsletter! Here are the highlights:\n\n🎉 Achievements:\n- Reached 1M users milestone\n- Launched new product features\n- Team expansion in 3 new cities\n\n📅 Upcoming Events:\n- Summer team building - July 20\n- Product launch event - July 25\n- Quarterly all-hands - July 30\n\nThank you for your continued dedication!\n\nBest,\nCompany News Team',
      time: '1 day ago',
      priority: 'low',
      isRead: true
    },
    {
      id: '6',
      subject: 'Invoice #INV-2024-0789',
      sender: 'Billing Department',
      summary: 'Monthly invoice for July 2024 services and subscription.',
      content: 'Invoice Details\n\nInvoice #: INV-2024-0789\nDate: July 1, 2024\nDue Date: July 31, 2024\n\nServices:\n- Premium Subscription: $99.00\n- Additional Storage: $29.00\n- Support Package: $49.00\n\nTotal Amount: $177.00\n\nPayment methods accepted: Credit card, Bank transfer, PayPal\n\nThank you for your business!\n\nBilling Department',
      time: '2 days ago',
      priority: 'medium',
      isRead: false
    },
    {
      id: '7',
      subject: 'Weekend Social Event',
      sender: 'Events Team',
      summary: 'Join us for a fun weekend social gathering with food, games, and networking.',
      content: 'Weekend Social Event Invitation\n\nYou\'re invited to our weekend social gathering!\n\n📅 When: Saturday, July 13, 2024\n🕕 Time: 6:00 PM - 10:00 PM\n📍 Where: Rooftop Terrace, Downtown Office\n\nWhat to expect:\n- Delicious food and drinks\n- Fun games and activities\n- Great networking opportunities\n- Live music and entertainment\n\nRSVP by Friday to secure your spot!\n\nLooking forward to seeing you there!\n\nEvents Team',
      time: '3 days ago',
      priority: 'low',
      isRead: true
    }
  ];
};