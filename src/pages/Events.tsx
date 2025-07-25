import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Calendar, Plus, MapPin, Clock, Filter, Search, RefreshCw, Database, Wifi } from 'lucide-react';
import { Event } from '../services/api';
import { useCalendarEvents } from '../hooks/useCalendarEvents';
import { useStore } from '../store/useStore';

type EventCategory = 'meeting' | 'personal' | 'fitness' | 'social';

interface NewEvent {
  title: string;
  date: string;
  time: string;
  location: string;
  category: EventCategory;
  description: string;
}

export default function Events() {
  const {
    events,
    eventsLoading,
    eventsError,
    eventSource,
    refreshEvents,
    loadEventsWithCache,
    getCacheStatus,
  } = useCalendarEvents();
  
  const { addEvent, useMockData, cacheEnabled } = useStore();
  
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<EventCategory | 'all'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [newEvent, setNewEvent] = useState<NewEvent>({
    title: '',
    date: '',
    time: '',
    location: '',
    category: 'personal',
    description: ''
  });

  useEffect(() => {
    loadEventsWithCache();
  }, [loadEventsWithCache]);

  const handleRefreshEvents = async () => {
    await refreshEvents();
  };

  useEffect(() => {
    let filtered = events;

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(event => event.category === selectedCategory);
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(event => 
        event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.location?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredEvents(filtered);
  }, [events, selectedCategory, searchTerm]);

  const getCategoryColor = (category: EventCategory) => {
    switch (category) {
      case 'meeting': return '#2196F3';
      case 'personal': return '#4CAF50';
      case 'fitness': return '#9C27B0';
      case 'social': return '#FF9800';
      default: return '#9E9E9E';
    }
  };

  const getCategoryBgColor = (category: EventCategory) => {
    switch (category) {
      case 'meeting': return 'bg-blue-100 text-blue-800';
      case 'personal': return 'bg-green-100 text-green-800';
      case 'fitness': return 'bg-purple-100 text-purple-800';
      case 'social': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleCreateEvent = (e: React.FormEvent) => {
    e.preventDefault();
    
    const eventDate = new Date(`${newEvent.date}T${newEvent.time}`);
    const createdEvent: Event = {
      id: Date.now().toString(),
      title: newEvent.title,
      time: `${formatEventDate(eventDate.toISOString())} at ${formatEventTime(eventDate.toISOString())}`,
      category: newEvent.category,
      location: newEvent.location || undefined,
      description: newEvent.description || undefined
    };

    addEvent(createdEvent);
    setNewEvent({
      title: '',
      date: '',
      time: '',
      location: '',
      category: 'personal',
      description: ''
    });
    setShowCreateForm(false);
    // Refresh events to show the updated list
    handleRefreshEvents();
  };

  const formatEventDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return 'Tomorrow';
    } else {
      return date.toLocaleDateString('en-US', { 
        weekday: 'short', 
        month: 'short', 
        day: 'numeric' 
      });
    }
  };

  const formatEventTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  return (
    <div className="min-h-screen bg-blue-50 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Link to="/" className="mr-4">
              <ArrowLeft className="w-6 h-6 text-gray-600 hover:text-gray-800" />
            </Link>
            <h1 className="text-2xl font-bold text-gray-800">Events</h1>
            <div className="ml-3 flex items-center space-x-2">
              {eventSource && (
                <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full flex items-center">
                  <Wifi className="w-3 h-3 mr-1" />
                  {eventSource}
                </span>
              )}
              {useMockData && (
                <span className="px-2 py-1 text-xs bg-orange-100 text-orange-800 rounded-full flex items-center">
                  <Database className="w-3 h-3 mr-1" />
                  Mock Data
                </span>
              )}
              {cacheEnabled && (
                <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">
                  {getCacheStatus()}
                </span>
              )}
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={handleRefreshEvents}
              disabled={eventsLoading}
              className="bg-gray-100 text-gray-700 px-3 py-2 rounded-lg flex items-center hover:bg-gray-200 transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${eventsLoading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
            <button
              onClick={() => setShowCreateForm(true)}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center hover:bg-blue-600 transition-colors"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Event
            </button>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search events..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            {/* Category Filter */}
            <div className="flex items-center space-x-2">
              <Filter className="w-5 h-5 text-gray-400" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value as EventCategory | 'all')}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Categories</option>
                <option value="meeting">Meeting</option>
                <option value="fitness">Fitness</option>
                <option value="personal">Personal</option>
                <option value="social">Social</option>
              </select>
            </div>
          </div>
        </div>

        {/* Events List */}
        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
            <Calendar className="w-5 h-5 mr-2 text-orange-500" />
            Upcoming Events ({filteredEvents.length})
          </h2>
          
          {eventsError && (
            <div className="mb-4 p-3 bg-red-100 border border-red-300 text-red-700 rounded-lg">
              Error loading events: {eventsError}
            </div>
          )}
          
          {eventsLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
              <p className="text-gray-500">Loading events...</p>
            </div>
          ) : filteredEvents.length > 0 ? (
            <div className="space-y-4">
              {filteredEvents.map((event) => (
                <div key={event.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center mb-2">
                        <div
                          className="w-1 h-8 rounded-full mr-3"
                          style={{ backgroundColor: getCategoryColor(event.category) }}
                        />
                        <div>
                          <h3 className="font-semibold text-gray-800">{event.title}</h3>
                          <div className="flex items-center text-sm text-gray-600 mt-1">
                            <Clock className="w-4 h-4 mr-1" />
                            <span>{event.time}</span>
                          </div>
                        </div>
                      </div>
                      
                      {event.location && (
                        <div className="flex items-center text-sm text-gray-600 mb-2 ml-4">
                          <MapPin className="w-4 h-4 mr-1" />
                          <span>{event.location}</span>
                        </div>
                      )}
                      
                      {event.description && (
                        <p className="text-sm text-gray-600 ml-4">{event.description}</p>
                      )}
                    </div>
                    
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryBgColor(event.category)}`}>
                      {event.category}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No events found</p>
              <p className="text-sm text-gray-400 mt-1">
                {searchTerm || selectedCategory !== 'all' 
                  ? 'Try adjusting your search or filter'
                  : 'Create your first event to get started'
                }
              </p>
            </div>
          )}
        </div>

        {/* Create Event Modal */}
        {showCreateForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Create New Event</h2>
              
              <form onSubmit={handleCreateEvent} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                  <input
                    type="text"
                    required
                    value={newEvent.title}
                    onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Event title"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                    <input
                      type="date"
                      required
                      value={newEvent.date}
                      onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
                    <input
                      type="time"
                      required
                      value={newEvent.time}
                      onChange={(e) => setNewEvent({ ...newEvent, time: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Location (Optional)</label>
                  <input
                    type="text"
                    value={newEvent.location}
                    onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Event location"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <select
                    value={newEvent.category}
                    onChange={(e) => setNewEvent({ ...newEvent, category: e.target.value as EventCategory })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="personal">Personal</option>
                    <option value="meeting">Meeting</option>
                    <option value="fitness">Fitness</option>
                    <option value="social">Social</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description (Optional)</label>
                  <textarea
                    value={newEvent.description}
                    onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows={3}
                    placeholder="Event description"
                  />
                </div>
                
                <div className="flex space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowCreateForm(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    Create Event
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}