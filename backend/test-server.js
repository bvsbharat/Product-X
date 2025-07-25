import express from 'express';
import cors from 'cors';

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// Test route
app.get('/api/test', (req, res) => {
  res.json({ message: 'Backend server is working!', timestamp: new Date().toISOString() });
});

// Mock emails route
app.get('/api/mail', (req, res) => {
  const mockEmails = [
    {
      id: '1',
      subject: 'Test Email 1',
      sender: 'test@example.com',
      summary: 'This is a test email',
      content: 'Test email content',
      time: new Date().toLocaleString(),
      priority: 'medium',
      isRead: false
    }
  ];
  
  res.json({
    success: true,
    data: mockEmails,
    source: 'mock',
    timestamp: new Date().toISOString()
  });
});

// Mock events route
app.get('/api/events', (req, res) => {
  const mockEvents = [
    {
      id: '1',
      title: 'Test Meeting',
      time: 'Today at 2:00 PM',
      category: 'meeting',
      description: 'Test meeting description'
    }
  ];
  
  res.json({
    success: true,
    data: mockEvents,
    source: 'mock',
    timestamp: new Date().toISOString()
  });
});

app.listen(PORT, () => {
  console.log(`✅ Test backend server running on http://localhost:${PORT}`);
});