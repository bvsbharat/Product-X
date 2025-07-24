import { create } from 'zustand';
import { WeatherData, Event, WorkoutData, PhotoMemory } from '@/services/mockApi';

interface AppState {
  // Weather state
  weather: WeatherData | null;
  weatherLoading: boolean;
  
  // Events state
  events: Event[];
  eventsLoading: boolean;
  
  // Workout state
  workout: WorkoutData | null;
  workoutLoading: boolean;
  
  // Photo memories state
  photoMemories: PhotoMemory[];
  photosLoading: boolean;
  
  // Actions
  setWeather: (weather: WeatherData) => void;
  setWeatherLoading: (loading: boolean) => void;
  
  setEvents: (events: Event[]) => void;
  setEventsLoading: (loading: boolean) => void;
  addEvent: (event: Event) => void;
  updateEvent: (id: string, event: Partial<Event>) => void;
  removeEvent: (id: string) => void;
  
  setWorkout: (workout: WorkoutData) => void;
  setWorkoutLoading: (loading: boolean) => void;
  
  setPhotoMemories: (photos: PhotoMemory[]) => void;
  setPhotosLoading: (loading: boolean) => void;
}

export const useStore = create<AppState>((set) => ({
  // Initial state
  weather: null,
  weatherLoading: false,
  
  events: [],
  eventsLoading: false,
  
  workout: null,
  workoutLoading: false,
  
  photoMemories: [],
  photosLoading: false,
  
  // Weather actions
  setWeather: (weather) => set({ weather }),
  setWeatherLoading: (weatherLoading) => set({ weatherLoading }),
  
  // Events actions
  setEvents: (events) => set({ events }),
  setEventsLoading: (eventsLoading) => set({ eventsLoading }),
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
}));