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
  
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  return [
    {
      id: '1',
      title: 'Morning Pilates Class',
      time: '8:30 AM',
      category: 'fitness',
      location: 'CorePower Yoga Studio',
      description: 'Advanced pilates session focusing on core strength and flexibility. Bring your own mat and water bottle.',
      date: today.toISOString().split('T')[0]
    },
    {
      id: '2',
      title: 'Q3 Strategy Planning Meeting',
      time: '10:00 AM',
      category: 'meeting',
      location: 'Conference Room B, 15th Floor',
      description: 'Quarterly business review and strategic planning session with department heads. Agenda includes budget review, goal setting, and resource allocation.',
      date: today.toISOString().split('T')[0]
    },
    {
      id: '3',
      title: 'Lunch with Sarah & Mike',
      time: '12:30 PM',
      category: 'social',
      location: 'The Garden Bistro, Downtown',
      description: 'Catch up lunch with college friends. Discussing upcoming reunion plans and sharing life updates.',
      date: today.toISOString().split('T')[0]
    },
    {
      id: '4',
      title: 'Client Presentation Prep',
      time: '2:00 PM',
      category: 'meeting',
      location: 'Meeting Room 3A',
      description: 'Final preparation for tomorrow\'s client presentation. Review slides, practice demo, and coordinate with team members.',
      date: today.toISOString().split('T')[0]
    },
    {
      id: '5',
      title: 'Evening Yoga Session',
      time: '6:30 PM',
      category: 'fitness',
      location: 'Zen Wellness Center',
      description: 'Relaxing hatha yoga class to unwind after a busy day. Perfect for stress relief and mindfulness.',
      date: today.toISOString().split('T')[0]
    },
    {
      id: '6',
      title: 'Dinner at Riverside Restaurant',
      time: '7:30 PM',
      category: 'social',
      location: 'Riverside Restaurant & Bar',
      description: 'Anniversary dinner celebration. Reservation for two at the waterfront table with city skyline view.',
      date: today.toISOString().split('T')[0]
    },
    {
      id: '7',
      title: 'Weekend Hiking Trip',
      time: '7:00 AM',
      category: 'fitness',
      location: 'Blue Ridge Trail, Mountain Park',
      description: 'Full day hiking adventure with the outdoor club. 8-mile trail with scenic viewpoints and waterfall stops. Pack lunch and plenty of water.',
      date: tomorrow.toISOString().split('T')[0]
    },
    {
      id: '8',
      title: 'Family Brunch',
      time: '11:00 AM',
      category: 'personal',
      location: 'Mom\'s House, Suburban Ave',
      description: 'Monthly family gathering with homemade brunch. Catching up with siblings and planning summer vacation together.',
      date: tomorrow.toISOString().split('T')[0]
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
      subject: 'Q3 Financial Review - Action Required',
      sender: 'David Chen (CFO)',
      summary: 'Quarterly financial review meeting scheduled for Monday. Please review attached budget reports and prepare departmental updates.',
      content: 'Dear Team Leaders,\n\nI hope this email finds you well. As we approach the end of Q3, it\'s time for our comprehensive financial review.\n\n📅 Meeting Details:\n• Date: Monday, July 15th\n• Time: 9:00 AM - 11:00 AM\n• Location: Executive Conference Room\n• Virtual: Teams link will be shared\n\n📊 Agenda:\n1. Q3 Performance Analysis (30 mins)\n2. Budget Variance Review (20 mins)\n3. Q4 Forecasting (30 mins)\n4. Department Updates (30 mins)\n5. Strategic Planning Discussion (10 mins)\n\n📋 Action Items:\n• Review attached Q3 budget reports\n• Prepare 5-minute department update\n• Submit Q4 budget requests by Friday\n• Bring laptops for real-time data analysis\n\nAttachments:\n- Q3_Financial_Summary.xlsx\n- Budget_Variance_Report.pdf\n- Q4_Planning_Template.docx\n\nThis review is crucial for our year-end planning and strategic decisions. Your insights and preparation will be invaluable.\n\nPlease confirm your attendance by replying to this email.\n\nBest regards,\nDavid Chen\nChief Financial Officer',
      time: '45 minutes ago',
      priority: 'high',
      isRead: false
    },
    {
      id: '2',
      subject: 'New Product Launch Campaign - Creative Assets Ready',
      sender: 'Emma Rodriguez (Marketing)',
      summary: 'Creative assets for the new product launch are ready for review. Feedback needed by EOD tomorrow for production timeline.',
      content: 'Hi Marketing Team,\n\nExciting news! Our creative team has completed the initial assets for the upcoming product launch campaign.\n\n🎨 Assets Ready for Review:\n• Hero banner designs (5 variations)\n• Social media content pack (Instagram, LinkedIn, Twitter)\n• Email newsletter templates (3 designs)\n• Product demo video (2-minute version)\n• Press release template\n• Landing page mockups\n\n📅 Timeline:\n• Review Period: Today - Tomorrow 5:00 PM\n• Feedback Consolidation: Wednesday morning\n• Final Revisions: Wednesday - Thursday\n• Production Start: Friday\n• Campaign Launch: July 22nd\n\n👀 Review Focus Areas:\n- Brand consistency and messaging\n- Visual appeal and engagement potential\n- Call-to-action effectiveness\n- Mobile responsiveness\n- Accessibility compliance\n\n📁 Access:\nAll assets are available in our shared drive: /Marketing/Product_Launch_2024/Creative_Assets\n\nPlease use the feedback template provided and submit your comments by tomorrow at 5:00 PM. This timeline is critical for our launch date.\n\nLooking forward to your insights!\n\nBest,\nEmma Rodriguez\nMarketing Director',
      time: '2 hours ago',
      priority: 'high',
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
      subject: 'System Maintenance Window - July 16th',
      sender: 'IT Operations Team',
      summary: 'Scheduled system maintenance this weekend. Some services will be temporarily unavailable. Please plan accordingly.',
      content: '🔧 SCHEDULED SYSTEM MAINTENANCE NOTICE\n\nDear Team,\n\nWe will be performing critical system maintenance to improve performance and security.\n\n📅 Maintenance Window:\n• Date: Saturday, July 16th\n• Time: 11:00 PM - 3:00 AM (EST)\n• Duration: Approximately 4 hours\n• Impact: Partial service interruption\n\n🚫 Affected Services:\n• Email servers (intermittent outages)\n• File sharing systems\n• VPN connections\n• Internal applications\n• Database backups\n\n✅ Available Services:\n• Emergency contact systems\n• Basic internet access\n• Mobile applications (limited functionality)\n\n🔄 What We\'re Updating:\n• Security patches and updates\n• Database optimization\n• Server hardware upgrades\n• Network infrastructure improvements\n• Backup system enhancements\n\n📋 Preparation Steps:\n• Save all work before 10:30 PM Saturday\n• Download any files you might need\n• Plan offline activities during maintenance\n• Update your local software if prompted\n\n📞 Emergency Contact:\nFor urgent issues during maintenance: +1-555-IT-HELP\n\nWe apologize for any inconvenience and appreciate your patience as we work to improve our systems.\n\nBest regards,\nIT Operations Team',
      time: '6 hours ago',
      priority: 'medium',
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
      subject: 'Weekend Team Building Event - RSVP Required',
      sender: 'Jessica Park (HR)',
      summary: 'Annual team building event this Saturday at Adventure Park. Activities include zip-lining, team challenges, and BBQ lunch.',
      content: '🎉 ANNUAL TEAM BUILDING EVENT 🎉\n\nDear Team,\n\nGet ready for an exciting day of team building and fun!\n\n📅 Event Details:\n• Date: Saturday, July 13th\n• Time: 9:00 AM - 5:00 PM\n• Location: Adventure Park & Recreation Center\n• Address: 1234 Outdoor Way, Green Valley\n• Transportation: Shuttle buses from office at 8:30 AM\n\n🏃‍♂️ Activities Planned:\n• Morning: Team challenge course (9:30 AM - 12:00 PM)\n• Lunch: BBQ and networking (12:00 PM - 1:30 PM)\n• Afternoon: Zip-lining and rock climbing (1:30 PM - 4:00 PM)\n• Wrap-up: Group reflection and awards (4:00 PM - 5:00 PM)\n\n👕 What to Bring:\n• Comfortable athletic wear\n• Closed-toe shoes (required for activities)\n• Water bottle\n• Sunscreen and hat\n• Positive attitude and team spirit!\n\n🍔 Meals Provided:\n• Welcome coffee and pastries\n• BBQ lunch with vegetarian options\n• Afternoon snacks and beverages\n• Dietary restrictions will be accommodated\n\n🏆 Team Challenges:\nCompete in fun activities to win prizes including:\n- Extra vacation day\n- Premium parking spots\n- Team lunch vouchers\n- Company swag packages\n\n⚠️ Important Notes:\n• Weather backup plan: Indoor facility available\n• First aid team on-site\n• Professional photographers will capture memories\n• Return shuttle departs at 5:30 PM\n\n📝 RSVP Required by Wednesday, July 10th\nPlease confirm attendance and any dietary restrictions.\n\nThis is a great opportunity to strengthen our team bonds and have some well-deserved fun!\n\nBest regards,\nJessica Park\nHuman Resources Manager',
      time: '1 day ago',
       priority: 'medium',
       isRead: false
     },
     {
       id: '8',
       subject: 'Client Success Story - Feature Request',
       sender: 'Alex Thompson (Sales)',
       summary: 'Major client achieved 40% efficiency improvement using our platform. They\'re requesting a case study feature for their industry conference.',
       content: '🎯 AMAZING CLIENT SUCCESS STORY! 🎯\n\nTeam,\n\nI have incredible news to share about our client, TechFlow Industries!\n\n📈 Results Achieved:\n• 40% increase in operational efficiency\n• 25% reduction in processing time\n• $2.3M annual cost savings\n• 95% user adoption rate\n• Zero critical incidents since implementation\n\n🏆 Client Feedback:\n"Your platform has transformed our operations beyond our expectations. The intuitive interface and powerful automation features have revolutionized how we work. Our team productivity has skyrocketed, and we\'re seeing results we never thought possible." - Sarah Mitchell, CTO\n\n📊 Key Metrics (6-month period):\n• Tasks automated: 15,000+\n• Hours saved weekly: 120\n• Error reduction: 78%\n• Employee satisfaction: +45%\n• Customer response time: -60%\n\n🎤 Opportunity:\nTechFlow has been invited to present at the Industry Innovation Conference (Sept 15-17) and wants to feature our partnership as a case study. This is HUGE exposure for us!\n\n📝 Next Steps:\n• Marketing: Develop case study materials\n• Product: Prepare demo for conference\n• Legal: Review partnership agreement\n• Sales: Coordinate with TechFlow team\n\n🎯 Conference Details:\n• Event: Industry Innovation Conference 2024\n• Dates: September 15-17\n• Location: Convention Center, Chicago\n• Expected Attendance: 5,000+ industry leaders\n• Our Speaking Slot: September 16, 2:00 PM\n\nThis success story validates our product vision and opens doors to similar enterprise clients. Let\'s leverage this momentum!\n\nCongratulations to everyone who contributed to this success!\n\nBest,\nAlex Thompson\nSenior Sales Manager',
       time: '3 hours ago',
       priority: 'high',
       isRead: false
     }
  ];
};