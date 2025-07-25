import { useEffect, useCallback } from 'react';
import { useStore } from '@/store/useStore';
import { getEvents, Event } from '@/services/api';

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes in milliseconds
const CACHE_KEY = 'calendar_events_cache';

interface CalendarEventCache {
  events: Event[];
  timestamp: Date;
  source: string;
  lastRefresh: Date;
}

export const useCalendarEvents = () => {
  const {
    events,
    eventsLoading,
    eventsError,
    eventsCacheTimestamp,
    eventSource,
    lastEventRefresh,
    setEvents,
    setEventsLoading,
    setEventsError,
    setEventSource,
    updateEventsCacheTimestamp,
    updateLastEventRefresh,
    clearEventsCache,
  } = useStore();

  // Load cached data from localStorage on mount
  useEffect(() => {
    const loadCachedData = () => {
      try {
        const cachedData = localStorage.getItem(CACHE_KEY);
        if (cachedData) {
          const parsed: CalendarEventCache = JSON.parse(cachedData);
          const cacheTimestamp = new Date(parsed.timestamp);
          const lastRefresh = new Date(parsed.lastRefresh);
          
          if (isCacheValid(cacheTimestamp)) {
            setEvents(parsed.events);
            setEventSource(parsed.source);
            updateEventsCacheTimestamp();
            updateLastEventRefresh();
          } else {
            // Cache expired, clear it
            localStorage.removeItem(CACHE_KEY);
            clearEventsCache();
          }
        }
      } catch (error) {
        console.error('Error loading cached calendar events:', error);
        localStorage.removeItem(CACHE_KEY);
      }
    };

    loadCachedData();
  }, []);

  // Save to localStorage when events change
  useEffect(() => {
    if (events.length > 0 && eventsCacheTimestamp && eventSource) {
      try {
        const cacheData: CalendarEventCache = {
          events,
          timestamp: eventsCacheTimestamp,
          source: eventSource,
          lastRefresh: lastEventRefresh,
        };
        localStorage.setItem(CACHE_KEY, JSON.stringify(cacheData));
      } catch (error) {
        console.error('Error saving calendar events to cache:', error);
      }
    }
  }, [events, eventsCacheTimestamp, eventSource, lastEventRefresh]);

  const isCacheValid = useCallback((timestamp: Date | null): boolean => {
    if (!timestamp) return false;
    const now = new Date();
    return (now.getTime() - timestamp.getTime()) < CACHE_DURATION;
  }, []);

  const fetchEventsFromAPI = useCallback(async (forceRefresh = false): Promise<Event[]> => {
    try {
      setEventsLoading(true);
      setEventsError(null);
      
      // Try to fetch from MCP agent first, then fallback to regular API
      let fetchedEvents: Event[];
      let source = 'API';
      
      try {
        // Attempt to fetch from MCP agent
        const response = await fetch('http://localhost:3000/mcp/calendar', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        
        if (response.ok) {
          const mcpData = await response.json();
          fetchedEvents = mcpData.events || [];
          source = 'MCP Agent';
        } else {
          throw new Error('MCP agent not available');
        }
      } catch (mcpError) {
        console.warn('MCP agent unavailable, falling back to regular API:', mcpError);
        fetchedEvents = await getEvents();
        source = 'API';
      }
      
      setEvents(fetchedEvents);
      setEventSource(source);
      updateEventsCacheTimestamp();
      updateLastEventRefresh();
      
      return fetchedEvents;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch calendar events';
      setEventsError(errorMessage);
      console.error('Error fetching calendar events:', error);
      throw error;
    } finally {
      setEventsLoading(false);
    }
  }, [setEvents, setEventsLoading, setEventsError, setEventSource, updateEventsCacheTimestamp, updateLastEventRefresh]);

  const refreshEvents = useCallback(async (): Promise<Event[]> => {
    return fetchEventsFromAPI(true);
  }, [fetchEventsFromAPI]);

  const loadEventsWithCache = useCallback(async (): Promise<Event[]> => {
    // Check if we have valid cached data
    if (events.length > 0 && isCacheValid(eventsCacheTimestamp)) {
      return events;
    }
    
    // If no valid cache, fetch from API
    return fetchEventsFromAPI();
  }, [events, eventsCacheTimestamp, isCacheValid, fetchEventsFromAPI]);

  const getCacheStatus = useCallback(() => {
    if (!eventsCacheTimestamp) return 'No cache';
    return isCacheValid(eventsCacheTimestamp) ? 'Cached' : 'Cache expired';
  }, [eventsCacheTimestamp, isCacheValid]);

  const clearEventsCacheWithStorage = useCallback(() => {
    localStorage.removeItem(CACHE_KEY);
    clearEventsCache();
  }, [clearEventsCache]);

  return {
    // State
    events,
    eventsLoading,
    eventsError,
    eventsCacheTimestamp,
    eventSource,
    lastEventRefresh,
    
    // Actions
    refreshEvents,
    loadEventsWithCache,
    clearEventsCache: clearEventsCacheWithStorage,
    
    // Utilities
    getCacheStatus,
    isCacheValid: (timestamp: Date | null) => isCacheValid(timestamp),
  };
};

export default useCalendarEvents;