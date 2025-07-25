import { create } from 'zustand';
import { WeatherData, Event, WorkoutData, PhotoMemory, Email } from '@/services/api';

interface AppState {
  // Weather state
  weather: WeatherData | null;
  weatherLoading: boolean;
  
  // Events state
  events: Event[];
  eventsLoading: boolean;
  eventsError: string | null;
  eventsCacheTimestamp: Date | null;
  eventSource: string | null;
  lastEventRefresh: Date;
  
  // Workout state
  workout: WorkoutData | null;
  workoutLoading: boolean;
  
  // Photo memories state
  photoMemories: PhotoMemory[];
  photosLoading: boolean;
  
  // Email state with caching
  emails: Email[];
  emailsLoading: boolean;
  emailsError: string | null;
  emailsCacheTimestamp: Date | null;
  emailSource: string | null;
  lastEmailRefresh: Date;
  
  // Actions
  setWeather: (weather: WeatherData) => void;
  setWeatherLoading: (loading: boolean) => void;
  
  setEvents: (events: Event[]) => void;
  setEventsLoading: (loading: boolean) => void;
  setEventsError: (error: string | null) => void;
  setEventSource: (source: string | null) => void;
  updateEventsCacheTimestamp: () => void;
  updateLastEventRefresh: () => void;
  clearEventsCache: () => void;
  addEvent: (event: Event) => void;
  updateEvent: (id: string, event: Partial<Event>) => void;
  removeEvent: (id: string) => void;
  
  setWorkout: (workout: WorkoutData) => void;
  setWorkoutLoading: (loading: boolean) => void;
  
  setPhotoMemories: (photos: PhotoMemory[]) => void;
  setPhotosLoading: (loading: boolean) => void;
  
  // Email actions
  setEmails: (emails: Email[]) => void;
  setEmailsLoading: (loading: boolean) => void;
  setEmailsError: (error: string | null) => void;
  setEmailSource: (source: string | null) => void;
  updateEmailsCacheTimestamp: () => void;
  updateLastEmailRefresh: () => void;
  clearEmailsCache: () => void;
}

export const useStore = create<AppState>((set) => ({
  // Initial state
  weather: null,
  weatherLoading: false,
  
  events: [],
  eventsLoading: false,
  eventsError: null,
  eventsCacheTimestamp: null,
  eventSource: null,
  lastEventRefresh: new Date(),
  
  workout: null,
  workoutLoading: false,
  
  photoMemories: [],
  photosLoading: false,
  
  emails: [],
  emailsLoading: false,
  emailsError: null,
  emailsCacheTimestamp: null,
  emailSource: null,
  lastEmailRefresh: new Date(),
  
  // Weather actions
  setWeather: (weather) => set({ weather }),
  setWeatherLoading: (weatherLoading) => set({ weatherLoading }),
  
  // Events actions
  setEvents: (events) => set({ events }),
  setEventsLoading: (eventsLoading) => set({ eventsLoading }),
  setEventsError: (eventsError) => set({ eventsError }),
  setEventSource: (eventSource) => set({ eventSource }),
  updateEventsCacheTimestamp: () => set({ eventsCacheTimestamp: new Date() }),
  updateLastEventRefresh: () => set({ lastEventRefresh: new Date() }),
  clearEventsCache: () => set({ 
    events: [], 
    eventsCacheTimestamp: null, 
    eventSource: null,
    eventsError: null 
  }),
  addEvent: (event) => set((state) => ({ events: [...state.events, event] })),
  updateEvent: (id, updatedEvent) => set((state) => ({
    events: state.events.map(event => 
      event.id === id ? { ...event, ...updatedEvent } : event
    )
  })),
  removeEvent: (id) => set((state) => ({
    events: state.events.filter(event => event.id !== id)
  })),
  
  // Workout actions
  setWorkout: (workout) => set({ workout }),
  setWorkoutLoading: (workoutLoading) => set({ workoutLoading }),
  
  // Photo memories actions
  setPhotoMemories: (photoMemories) => set({ photoMemories }),
  setPhotosLoading: (photosLoading) => set({ photosLoading }),
  
  // Email actions
  setEmails: (emails) => set({ emails }),
  setEmailsLoading: (emailsLoading) => set({ emailsLoading }),
  setEmailsError: (emailsError) => set({ emailsError }),
  setEmailSource: (emailSource) => set({ emailSource }),
  updateEmailsCacheTimestamp: () => set({ emailsCacheTimestamp: new Date() }),
  updateLastEmailRefresh: () => set({ lastEmailRefresh: new Date() }),
  clearEmailsCache: () => set({ 
    emails: [], 
    emailsCacheTimestamp: null, 
    emailSource: null,
    emailsError: null 
  }),
}));