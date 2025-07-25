import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import {
  Calendar,
  Clock,
  AlertTriangle,
  CheckCircle,
  Mail,
  ArrowLeft,
  Star,
  TrendingUp,
  RefreshCw,
} from "lucide-react";
import {
  getWeatherData,
  getEvents,
  getWorkoutData,
  getPhotoMemories,
  generateSummary,
  WeatherData,
  Event,
  WorkoutData,
  PhotoMemory,
  Email,
} from "../services/api";
import { useEmails } from "../hooks/useEmails";
import { useCalendarEvents } from "../hooks/useCalendarEvents";

export default function Home() {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [workout, setWorkout] = useState<WorkoutData | null>(null);
  const [photos, setPhotos] = useState<PhotoMemory[]>([]);
  const [summary, setSummary] = useState<string>(
    "Start your weekend with this briefing."
  );
  const [summaryDetails, setSummaryDetails] = useState<string[]>([
    "This week featured 6 workout sessions totaling 5:29:45,",
    "4 important emails requiring attention, and memorable moments captured in New York.",
    "Your schedule includes pilates, team meetings, and travel confirmations."
  ]);
  const {
    emails,
    emailsLoading,
    emailsError,
    emailSource,
    lastEmailRefresh,
    refreshEmails,
    loadEmailsWithCache,
    getCacheStatus,
    isCacheValid,
  } = useEmails();

  const {
    events,
    eventsLoading,
    eventsError,
    eventSource,
    refreshEvents,
    loadEventsWithCache,
    getCacheStatus: getEventsCacheStatus,
    isCacheValid: isEventsCacheValid,
  } = useCalendarEvents();

  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [expandedEmailId, setExpandedEmailId] = useState<string | null>(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const photoImages = [
    "https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=woman%20sitting%20on%20steps%20in%20front%20of%20modern%20architecture%20building%20with%20geometric%20patterns%20sunny%20day%20urban%20setting&image_size=square",
    "https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=beautiful%20mountain%20landscape%20with%20hiking%20trail%20and%20clear%20blue%20sky%20vacation%20trip&image_size=square",
    "https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=tropical%20beach%20with%20palm%20trees%20and%20crystal%20clear%20water%20summer%20vacation&image_size=square",
    "https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=cozy%20coffee%20shop%20interior%20with%20warm%20lighting%20and%20plants%20travel%20memories&image_size=square",
    "https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=historic%20european%20city%20street%20with%20cobblestones%20and%20old%20buildings%20travel%20photography&image_size=square",
    "https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=beautiful%20sunset%20over%20ocean%20with%20silhouette%20of%20person%20vacation%20moment&image_size=square",
  ];

  const handlePhotoClick = () => {
    setCurrentPhotoIndex((prev) => (prev + 1) % photoImages.length);
  };

  const handleEmailClick = (emailId: string) => {
    setExpandedEmailId(emailId);
  };

  const handleBackToEmailList = () => {
    setExpandedEmailId(null);
  };

  const handleRefreshEmails = useCallback(async () => {
    setIsRefreshing(true);
    try {
      await refreshEmails();
    } finally {
      setIsRefreshing(false);
    }
  }, [refreshEmails]);

  const expandedEmail = emails.find((email) => email.id === expandedEmailId);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [weatherData, workoutData, photosData] = await Promise.all([
          getWeatherData(),
          getWorkoutData(),
          getPhotoMemories(),
        ]);
        setWeather(weatherData);
        setWorkout(workoutData);
        setPhotos(photosData.slice(0, 1));

        // Load events and emails in parallel from cache
        // Both are now loaded automatically from localStorage cache via their respective hooks
        await Promise.all([loadEmailsWithCache(), loadEventsWithCache()]);
      } catch (error) {
        console.error("Failed to load initial data:", error);
      }
    };

    loadData();

    // Note: Removed auto-refresh interval - emails now use cache and only refresh on user action
  }, [loadEmailsWithCache, loadEventsWithCache]);

  // Generate summary when emails and events are loaded
   useEffect(() => {
     const generateDailySummary = async () => {
       if (emails.length > 0 || events.length > 0) {
         try {
           const summaryData = await generateSummary(
             emails.slice(0, 10), // Limit to recent emails
             events
           );
           
           if (summaryData.summary) {
             setSummary(summaryData.summary);
             // Clear the default details when we have a generated summary
             setSummaryDetails([]);
           }
         } catch (error) {
           console.error("Failed to generate summary:", error);
           // Keep default summary on error
         }
       }
     };
 
     generateDailySummary();
   }, [emails, events]);

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">
          Welcome to bharat
        </h1>
        <p className="text-gray-600 text-sm leading-relaxed">
          {summary}
        </p>
        {summaryDetails.map((detail, index) => (
          <p key={index} className="text-gray-500 text-xs leading-relaxed mt-2">
            {detail}
          </p>
        ))}
      </div>

      {/* Special Moments and Weather Section */}
      <div className="grid grid-cols-5 gap-8 mb-10">
        {/* Left Column - Special Moments */}
        <div className="col-span-2">
          <p className="text-gray-600 text-xs mb-3 leading-relaxed">
            Take a look at{" "}
            <span className="text-blue-500">
              special moments from this
              <br />
              week
            </span>
            .
          </p>

          {/* Photo Cards Stack */}
          {photos.length > 0 && (
            <div className="block cursor-pointer" onClick={handlePhotoClick}>
              <div className="relative w-full h-52">
                {/* Background stacked cards - clearly visible and well-spaced */}
                <div className="absolute top-6 left-6 w-full h-full rounded-2xl bg-gradient-to-br from-slate-700 to-slate-800 shadow-xl transform rotate-6 scale-95 border border-slate-600"></div>
                <div className="absolute top-3 left-3 w-full h-full rounded-2xl bg-gradient-to-br from-slate-600 to-slate-700 shadow-xl transform rotate-3 scale-97 border border-slate-500"></div>

                {/* Main photo card */}
                <div className="relative w-full h-full rounded-2xl overflow-hidden shadow-2xl transform hover:scale-[1.02] transition-all duration-300 z-20 border-2 border-white/30">
                  <img
                    src={photoImages[currentPhotoIndex]}
                    alt={`Trip memory ${currentPhotoIndex + 1}`}
                    className="w-full h-full object-cover transition-all duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />
                  <div className="absolute bottom-4 left-4 text-white">
                    <div className="text-xs font-medium opacity-90 mb-1">
                      Wed
                    </div>
                    <div className="text-xl font-bold mb-1">July 9</div>
                    <div className="text-sm opacity-85">New York</div>
                  </div>
                  <div className="absolute top-4 right-4 text-white text-xs bg-black/50 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/30 font-medium">
                    {currentPhotoIndex + 1}/{photoImages.length}
                  </div>
                  {/* Tap indicator */}
                  <div className="absolute top-4 left-4 text-white text-xs bg-black/50 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/30 font-medium animate-pulse">
                    Tap to view
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Column - Weather */}
        <div className="col-span-3">
          <p className="text-gray-600 text-xs mb-3 leading-relaxed">
            Sunny. High 30°C and low 21°C.
          </p>

          {/* Daily Summary Card */}
          <div className="bg-blue-500 text-white rounded-3xl p-4 shadow-lg h-72">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center">
                <Calendar className="w-6 h-6 text-white mr-2" />
                <div>
                  <div className="text-lg font-bold">Today's Summary</div>
                  <div className="text-xs opacity-90">July 12, 2024</div>
                </div>
              </div>
              <div className="text-right">
                <div className="flex items-center text-xs opacity-90">
                  <Clock className="w-3 h-3 mr-1" />
                  <span>3 events</span>
                </div>
              </div>
            </div>

            {/* Priority Highlights */}
            <div className="space-y-2 mb-2">
              <div className="flex items-center justify-between p-2">
                <div className="flex items-center">
                  <AlertTriangle className="w-3 h-3 text-red-300 mr-2" />
                  <div>
                    <div className="text-xs font-medium text-white">
                      Urgent Items
                    </div>
                    <div className="text-xs opacity-90 text-white">
                      {emails.filter(
                        (email) => email.priority === "high" && !email.isRead
                      ).length === 0
                        ? "No urgent items"
                        : `${emails.filter(
                            (email) => email.priority === "high" && !email.isRead
                          ).length} high priority emails`}
                    </div>
                  </div>
                </div>
                <div className="text-xs text-red-300 font-semibold">
                  {
                    emails.filter(
                      (email) => email.priority === "high" && !email.isRead
                    ).length
                  }
                </div>
              </div>

              <div className="flex items-center justify-between p-2">
                <div className="flex items-center">
                  <CheckCircle className="w-3 h-3 text-green-300 mr-2" />
                  <div>
                    <div className="text-xs font-medium text-white">
                      Today's Schedule
                    </div>
                    <div className="text-xs opacity-90 text-white">
                      {events.length > 0 ? (
                        <>
                          Next:{" "}
                          {events[0].title.length > 25
                            ? `${events[0].title.substring(0, 25)}...`
                            : events[0].title}
                          {events[0].time &&
                            ` at ${events[0].time.split(" - ")[0]}`}
                        </>
                      ) : (
                        "No events scheduled"
                      )}
                    </div>
                  </div>
                </div>
                <div className="text-xs text-green-300 font-semibold">
                  {events.length}
                </div>
              </div>
            </div>

            {/* 24-Hour Timeline */}
            <div className="space-y-1 mb-2">
              <div className="font-medium text-xs mb-2">Today's Timeline</div>
              <div className="relative">
                {/* 24-hour line */}
                <div className="relative h-6 bg-white/20 rounded-full">
                  <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-white/30"></div>

                  {/* Hour markers */}
                  <div className="absolute inset-0 flex items-center">
                    {Array.from({ length: 25 }, (_, i) => (
                      <div key={i} className="flex-1 relative">
                        {i % 6 === 0 && (
                          <div className="absolute top-0 left-0 w-px h-full bg-white/40"></div>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Event pointers */}
                  {events.map((event, index) => {
                    // Parse time more robustly
                    const timeStr = event.time;
                    let hour24 = 12; // Default to noon if parsing fails
                    let minutes = 0;

                    try {
                      // Handle time ranges like "12:00 PM - 1:00 PM"
                      const startTime = timeStr.includes(" - ")
                        ? timeStr.split(" - ")[0]
                        : timeStr;
                      const timeParts = startTime.trim().split(" ");

                      if (timeParts.length >= 2) {
                        const [time, period] = timeParts;
                        const [hours, mins] = time.split(":").map(Number);
                        hour24 = hours;
                        minutes = mins || 0;

                        if (period === "PM" && hours !== 12) hour24 += 12;
                        if (period === "AM" && hours === 12) hour24 = 0;
                      }
                    } catch (error) {
                      console.warn("Error parsing event time:", timeStr, error);
                    }

                    const position = ((hour24 + minutes / 60) / 24) * 100;

                    return (
                      <div
                        key={event.id}
                        className="absolute top-1/2 transform -translate-y-1/2 -translate-x-1/2 group cursor-pointer"
                        style={{
                          left: `${Math.min(Math.max(position, 2), 98)}%`,
                        }}
                      >
                        <div className="w-2.5 h-2.5 bg-blue-500 rounded-full border-2 border-blue-300 shadow-lg hover:scale-125 transition-transform duration-200"></div>
                        <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-[100] pointer-events-none">
                          <div className="bg-white rounded-lg px-3 py-2 text-xs text-black font-medium whitespace-nowrap shadow-xl border border-gray-200 min-w-max max-w-xs">
                            <div className="font-semibold text-black">
                              {event.title || "Untitled Event"}
                            </div>
                            <div className="text-xs text-black">
                              {event.time || "Time TBD"}
                            </div>
                            <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-white"></div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Time labels */}
                <div className="flex justify-between mt-1 text-xs opacity-75">
                  <span>12 AM</span>
                  <span>6 AM</span>
                  <span>12 PM</span>
                  <span>6 PM</span>
                  <span>12 AM</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Middle Section - Email Card */}
      <div className="mb-8">
        <p className="text-gray-600 text-xs mb-3 leading-relaxed">
          You have{" "}
          <span className="text-blue-500">
            {emails.filter((email) => !email.isRead).length} unread emails
          </span>{" "}
          that need attention.
        </p>

        <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-6 shadow-lg h-80 flex flex-col">
          {!expandedEmailId ? (
            // Email List View
            <>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <Mail className="w-5 h-5 text-gray-600 mr-3" />
                  <h3 className="text-lg font-semibold text-gray-900">
                    Latest Emails
                  </h3>
                </div>
                <div className="flex items-center space-x-2">
                  {emailSource && (
                    <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded">
                      {emailSource === "MCP Agent"
                        ? "MCP"
                        : emailSource === "API"
                        ? "Live"
                        : "Demo"}
                    </span>
                  )}
                  {eventSource && (
                    <span className="text-xs text-gray-400 bg-blue-100 px-2 py-1 rounded">
                      Events:{" "}
                      {eventSource === "MCP Agent"
                        ? "MCP"
                        : eventSource === "API"
                        ? "Live"
                        : "Demo"}
                    </span>
                  )}
                  <span
                    className={`text-xs px-2 py-1 rounded ${
                      isCacheValid
                        ? "text-green-600 bg-green-50"
                        : "text-orange-600 bg-orange-50"
                    }`}
                  >
                    Emails: {isCacheValid ? "Cached" : "Cache expired"}
                  </span>
                  <span
                    className={`text-xs px-2 py-1 rounded ${
                      isEventsCacheValid
                        ? "text-green-600 bg-green-50"
                        : "text-orange-600 bg-orange-50"
                    }`}
                  >
                    Events: {isEventsCacheValid ? "Cached" : "Cache expired"}
                  </span>
                  <span className="text-xs text-gray-500">
                    Updated{" "}
                    {lastEmailRefresh.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                  <button
                    onClick={handleRefreshEmails}
                    disabled={isRefreshing || emailsLoading}
                    className="p-1 text-gray-500 hover:text-gray-700 transition-colors duration-200 disabled:opacity-50"
                    title="Refresh emails from server"
                  >
                    <RefreshCw
                      className={`w-4 h-4 ${
                        isRefreshing || emailsLoading ? "animate-spin" : ""
                      }`}
                    />
                  </button>
                </div>
              </div>

              <div className="space-y-3 flex-1 overflow-y-auto">
                {emailsLoading ? (
                  <div className="flex items-center justify-center h-32 text-gray-500">
                    <div className="text-center">
                      <RefreshCw className="w-8 h-8 mx-auto mb-2 opacity-50 animate-spin" />
                      <p className="text-sm">Loading emails...</p>
                    </div>
                  </div>
                ) : emailsError ? (
                  <div className="flex items-center justify-center h-32 text-gray-500">
                    <div className="text-center">
                      <AlertTriangle className="w-8 h-8 mx-auto mb-2 opacity-50 text-red-500" />
                      <p className="text-sm text-red-600">
                        Failed to load emails
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {emailsError}
                      </p>
                      <button
                        onClick={handleRefreshEmails}
                        className="text-xs text-blue-500 hover:text-blue-700 mt-2"
                      >
                        Try again
                      </button>
                    </div>
                  </div>
                ) : emails.length === 0 ? (
                  <div className="flex items-center justify-center h-32 text-gray-500">
                    <div className="text-center">
                      <Mail className="w-8 h-8 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">No emails found</p>
                      <button
                        onClick={handleRefreshEmails}
                        className="text-xs text-blue-500 hover:text-blue-700 mt-1"
                      >
                        Try refreshing
                      </button>
                    </div>
                  </div>
                ) : (
                  emails.slice(0, 5).map((email) => (
                    <div
                      key={email.id}
                      className="border-b border-gray-200 pb-3 last:border-b-0 cursor-pointer hover:bg-gray-50 rounded-lg p-2 -m-2 transition-colors duration-200"
                      onClick={() => handleEmailClick(email.id)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4
                            className={`text-sm font-medium ${
                              email.isRead ? "text-gray-600" : "text-gray-900"
                            }`}
                          >
                            {email.subject}
                          </h4>
                          <p className="text-xs text-gray-500 mt-1">
                            {email.sender}
                          </p>
                          <p className="text-xs text-gray-600 mt-2 leading-relaxed">
                            {email.summary}
                          </p>
                        </div>
                        <div className="flex items-center ml-4">
                          <span className="text-xs text-gray-500">
                            {email.time}
                          </span>
                          {!email.isRead && (
                            <div className="w-2 h-2 bg-blue-500 rounded-full ml-2"></div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </>
          ) : (
            // Expanded Email View
            expandedEmail && (
              <div className="animate-in slide-in-from-right duration-300 flex flex-col h-full">
                <div className="flex items-center mb-1">
                  <button
                    onClick={handleBackToEmailList}
                    className="flex items-center text-gray-600 hover:text-gray-900 transition-colors duration-200 mr-1"
                  >
                    <ArrowLeft className="w-3 h-3 mr-0.5" />
                    <span className="text-xs">Back</span>
                  </button>
                  <Mail className="w-3 h-3 text-gray-600 mr-1" />
                  <h3 className="text-sm font-semibold text-gray-900">
                    Email Details
                  </h3>
                </div>

                <div className="flex flex-col flex-1 overflow-hidden">
                  <div className="border-b border-gray-200 pb-1 mb-2">
                    <h4 className="text-sm font-semibold text-gray-900 mb-0.5">
                      {expandedEmail.subject}
                    </h4>
                    <div className="flex items-center justify-between text-xs text-gray-600 mb-0.5">
                      <span>From: {expandedEmail.sender}</span>
                      <span>{expandedEmail.time}</span>
                    </div>
                    <div className="flex items-center">
                      <span
                        className={`inline-block px-1 py-0.5 rounded-full text-xs font-medium ${
                          expandedEmail.priority === "high"
                            ? "bg-red-100 text-red-800"
                            : expandedEmail.priority === "medium"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-green-100 text-green-800"
                        }`}
                      >
                        {expandedEmail.priority} priority
                      </span>
                      {!expandedEmail.isRead && (
                        <div className="w-1 h-1 bg-blue-500 rounded-full ml-1"></div>
                      )}
                    </div>
                  </div>

                  <div className="flex-1 overflow-y-auto">
                    <div className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
                      {expandedEmail.content}
                    </div>
                  </div>
                </div>
              </div>
            )
          )}
        </div>
      </div>

      {/* Bottom Section - 2 Column Layout */}
      <div className="grid grid-cols-2 gap-8">
        {/* Events Section */}
        <div>
          <p className="text-gray-600 text-xs mb-3 leading-relaxed">
            You have{" "}
            <span className="text-blue-500">{events.length} events</span> today.
          </p>

          <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-6 shadow-lg h-64 flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <Calendar className="w-5 h-5 text-gray-600 mr-3" />
                <h3 className="text-lg font-semibold text-gray-900">
                  Today's Events
                </h3>
              </div>
              <div className="flex items-center space-x-2">
                {eventSource && (
                  <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded">
                    {eventSource} • {getEventsCacheStatus()}
                  </span>
                )}
                <button
                  onClick={refreshEvents}
                  disabled={eventsLoading}
                  className="p-1 text-gray-500 hover:text-gray-700 transition-colors duration-200 disabled:opacity-50"
                  title="Refresh events"
                >
                  <RefreshCw
                    className={`w-4 h-4 ${eventsLoading ? "animate-spin" : ""}`}
                  />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto">
              {eventsLoading ? (
                <div className="flex items-center justify-center h-32 text-gray-500">
                  <div className="text-center">
                    <RefreshCw className="w-8 h-8 mx-auto mb-2 opacity-50 animate-spin" />
                    <p className="text-sm">Loading events...</p>
                  </div>
                </div>
              ) : eventsError ? (
                <div className="flex items-center justify-center h-32 text-gray-500">
                  <div className="text-center">
                    <AlertTriangle className="w-8 h-8 mx-auto mb-2 opacity-50 text-red-500" />
                    <p className="text-sm text-red-600">
                      Failed to load events
                    </p>
                    <p className="text-xs text-gray-500 mt-1">{eventsError}</p>
                    <button
                      onClick={refreshEvents}
                      className="text-xs text-blue-500 hover:text-blue-700 mt-2"
                    >
                      Try again
                    </button>
                  </div>
                </div>
              ) : events.length === 0 ? (
                <div className="flex items-center justify-center h-32 text-gray-500">
                  <div className="text-center">
                    <Calendar className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No events today</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Events List */}
                  <div className="space-y-3">
                    {events.map((event) => (
                      <div
                        key={event.id}
                        className="flex items-center p-4 bg-white rounded-lg hover:bg-gray-50 transition-colors border border-gray-200 shadow-sm"
                      >
                        <div className="flex-shrink-0 w-28 text-sm font-medium">
                          <div className="text-blue-600 font-semibold">
                            {event.time?.split(" - ")[0] || "TBD"}
                          </div>
                          {event.time?.includes(" - ") && (
                            <div className="text-xs text-gray-500">
                              to {event.time.split(" - ")[1]}
                            </div>
                          )}
                        </div>
                        <div className="flex-1 ml-4">
                          <div className="font-semibold text-gray-900 text-base">
                            {event.title}
                            {event.description && (
                              <span className="ml-2 text-sm font-normal text-gray-600">
                                - {event.description}
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="flex-shrink-0">
                          <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Schedule Overview */}
                  <div className="mt-6 p-4 bg-gradient-to-r from-gray-50 to-blue-50 rounded-lg border border-gray-200">
                    <h3 className="text-sm font-semibold text-gray-900 mb-2">
                      📊 Schedule Overview
                    </h3>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">
                          Morning (6AM-12PM):
                        </span>
                        <span className="ml-2 font-medium">
                          {
                            events.filter((e) => {
                              const time = e.time?.split(" - ")[0];
                              if (!time) return false;
                              const hour = parseInt(time.split(":")[0]);
                              const period = time.includes("AM") ? "AM" : "PM";
                              return (
                                period === "AM" ||
                                (period === "PM" && hour === 12)
                              );
                            }).length
                          }{" "}
                          events
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-600">
                          Afternoon/Evening:
                        </span>
                        <span className="ml-2 font-medium">
                          {
                            events.filter((e) => {
                              const time = e.time?.split(" - ")[0];
                              if (!time) return false;
                              const hour = parseInt(time.split(":")[0]);
                              const period = time.includes("PM") ? "PM" : "AM";
                              return period === "PM" && hour !== 12;
                            }).length
                          }{" "}
                          events
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Workout Report Section */}
        <div>
          <p className="text-gray-600 text-xs mb-3 leading-relaxed">
            Your <span className="text-blue-500">weekly workout report</span> is
            ready.
          </p>

          {workout && (
            <Link to="/workout" className="block">
              <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-6 shadow-lg h-64 flex flex-col justify-between">
                <div>
                  <div className="text-sm font-medium text-gray-900 mb-2">
                    All exercises
                  </div>
                  <div className="text-xs text-gray-500 mb-4">July 6 - 12</div>

                  <div className="flex items-center justify-between mb-5">
                    <div className="text-2xl font-bold text-blue-600">
                      5:29:45
                    </div>
                    <div className="text-right text-xs">
                      <div className="text-gray-900 font-medium mb-1">
                        6 sessions
                      </div>
                      <div className="text-red-500 font-medium">2,762 Cal</div>
                    </div>
                  </div>
                </div>

                <div>
                  <div className="text-sm font-medium text-gray-900 mb-3">
                    Top exercises
                  </div>

                  <div className="flex items-center justify-between mb-2">
                    <div className="text-green-500 font-medium text-sm">
                      Pilates
                    </div>
                    <div className="text-xs text-gray-500">3 sessions</div>
                    <div className="text-xs text-gray-500">1,480 Cal</div>
                  </div>

                  <div className="w-full bg-gray-200 rounded-full h-1.5 mb-2">
                    <div
                      className="bg-green-500 h-1.5 rounded-full"
                      style={{ width: "75%" }}
                    ></div>
                  </div>

                  <div className="text-right text-xs text-green-500 font-medium">
                    3:23:02
                  </div>
                </div>
              </div>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
