import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, AlertTriangle, CheckCircle, Mail, ArrowLeft, Star, TrendingUp } from 'lucide-react';
import { getWeatherData, getEvents, getWorkoutData, getPhotoMemories, getEmails, WeatherData, Event, WorkoutData, PhotoMemory, Email } from '../services/mockApi';

export default function Home() {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [events, setEvents] = useState<Event[]>([]);
  const [workout, setWorkout] = useState<WorkoutData | null>(null);
  const [photos, setPhotos] = useState<PhotoMemory[]>([]);
  const [emails, setEmails] = useState<Email[]>([]);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [expandedEmailId, setExpandedEmailId] = useState<string | null>(null);

  const photoImages = [
    "https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=woman%20sitting%20on%20steps%20in%20front%20of%20modern%20architecture%20building%20with%20geometric%20patterns%20sunny%20day%20urban%20setting&image_size=square",
    "https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=beautiful%20mountain%20landscape%20with%20hiking%20trail%20and%20clear%20blue%20sky%20vacation%20trip&image_size=square",
    "https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=tropical%20beach%20with%20palm%20trees%20and%20crystal%20clear%20water%20summer%20vacation&image_size=square",
    "https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=cozy%20coffee%20shop%20interior%20with%20warm%20lighting%20and%20plants%20travel%20memories&image_size=square",
    "https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=historic%20european%20city%20street%20with%20cobblestones%20and%20old%20buildings%20travel%20photography&image_size=square",
    "https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=beautiful%20sunset%20over%20ocean%20with%20silhouette%20of%20person%20vacation%20moment&image_size=square"
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

  const expandedEmail = emails.find(email => email.id === expandedEmailId);

  useEffect(() => {
    const loadData = async () => {
      const [weatherData, eventsData, workoutData, photosData, emailsData] = await Promise.all([
        getWeatherData(),
        getEvents(),
        getWorkoutData(),
        getPhotoMemories(),
        getEmails()
      ]);
      setWeather(weatherData);
      setEvents(eventsData.slice(0, 3));
      setWorkout(workoutData);
      setPhotos(photosData.slice(0, 1));
      setEmails(emailsData);
    };

    loadData();
  }, []);



  return (
    <div className="min-h-screen bg-blue-50 px-8 py-10">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Welcome to bharat</h1>
          <p className="text-gray-600 text-sm leading-relaxed">Start your weekend with this briefing.</p>
          <p className="text-gray-500 text-xs leading-relaxed mt-2">This week featured 6 workout sessions totaling 5:29:45,</p>
          <p className="text-gray-500 text-xs leading-relaxed">4 important emails requiring attention, and memorable moments captured in New York.</p>
          <p className="text-gray-500 text-xs leading-relaxed">Your schedule includes pilates, team meetings, and travel confirmations.</p>
        </div>

        {/* Special Moments and Weather Section */}
        <div className="grid grid-cols-5 gap-8 mb-10">
          {/* Left Column - Special Moments */}
          <div className="col-span-2">
            <p className="text-gray-600 text-xs mb-3 leading-relaxed">
              Take a look at <span className="text-blue-500">special moments from this<br />week</span>.
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
                      <div className="text-xs font-medium opacity-90 mb-1">Wed</div>
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
            <p className="text-gray-600 text-xs mb-3 leading-relaxed">Sunny. High 30°C and low 21°C.</p>
            
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
                      <div className="text-xs font-medium text-white">Urgent Items</div>
                      <div className="text-xs opacity-90 text-white">{emails.filter(email => email.priority === 'high' && !email.isRead).length} high priority emails</div>
                    </div>
                  </div>
                  <div className="text-xs text-red-300 font-semibold">
                    {emails.filter(email => email.priority === 'high' && !email.isRead).length}
                  </div>
                </div>

                <div className="flex items-center justify-between p-2">
                  <div className="flex items-center">
                    <CheckCircle className="w-3 h-3 text-green-300 mr-2" />
                    <div>
                      <div className="text-xs font-medium text-white">Today's Schedule</div>
                      <div className="text-xs opacity-90 text-white">Next: {events.length > 0 ? events[0].title : 'No events'} at {events.length > 0 ? events[0].time : ''}</div>
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
                       const timeStr = event.time;
                       const [time, period] = timeStr.split(' ');
                       const [hours, minutes] = time.split(':').map(Number);
                       let hour24 = hours;
                       if (period === 'PM' && hours !== 12) hour24 += 12;
                       if (period === 'AM' && hours === 12) hour24 = 0;
                       const position = ((hour24 + minutes / 60) / 24) * 100;
                       
                       return (
                         <div
                           key={event.id}
                           className="absolute top-1/2 transform -translate-y-1/2 -translate-x-1/2 group cursor-pointer"
                           style={{ left: `${position}%` }}
                         >
                           <div className="w-2.5 h-2.5 bg-white rounded-full border-2 border-blue-300 shadow-lg hover:scale-125 transition-transform duration-200"></div>
                           <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-[100] pointer-events-none">
                             <div className="bg-white rounded-lg px-3 py-2 text-xs text-gray-800 font-medium whitespace-nowrap shadow-xl border border-gray-200 min-w-max">
                               <div className="font-semibold text-gray-900">{event.title}</div>
                               <div className="text-xs text-gray-600">{event.time}</div>
                               {event.description && (
                                 <div className="text-xs text-gray-500 mt-1">{event.description}</div>
                               )}
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
            You have <span className="text-blue-500">{emails.filter(email => !email.isRead).length} unread emails</span> that need attention.
          </p>
          
          <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-6 shadow-lg h-80 flex flex-col">
            {!expandedEmailId ? (
              // Email List View
              <>
                <div className="flex items-center mb-4">
                  <Mail className="w-5 h-5 text-gray-600 mr-3" />
                  <h3 className="text-lg font-semibold text-gray-900">Important Emails</h3>
                </div>
                
                <div className="space-y-3 flex-1 overflow-y-auto">
                  {emails.slice(0, 3).map((email) => (
                    <div 
                      key={email.id} 
                      className="border-b border-gray-200 pb-3 last:border-b-0 cursor-pointer hover:bg-gray-50 rounded-lg p-2 -m-2 transition-colors duration-200"
                      onClick={() => handleEmailClick(email.id)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className={`text-sm font-medium ${
                            email.isRead ? 'text-gray-600' : 'text-gray-900'
                          }`}>
                            {email.subject}
                          </h4>
                          <p className="text-xs text-gray-500 mt-1">{email.sender}</p>
                          <p className="text-xs text-gray-600 mt-2 leading-relaxed">
                            {email.summary}
                          </p>
                        </div>
                        <div className="flex items-center ml-4">
                          <span className="text-xs text-gray-500">{email.time}</span>
                          {!email.isRead && (
                            <div className="w-2 h-2 bg-blue-500 rounded-full ml-2"></div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
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
                    <h3 className="text-sm font-semibold text-gray-900">Email Details</h3>
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
                        <span className={`inline-block px-1 py-0.5 rounded-full text-xs font-medium ${
                          expandedEmail.priority === 'high' ? 'bg-red-100 text-red-800' :
                          expandedEmail.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-green-100 text-green-800'
                        }`}>
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
              You have <span className="text-blue-500">3 events</span> today.
            </p>
            
            <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-6 shadow-lg h-64 flex flex-col justify-center">
              <div className="space-y-5">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-gray-400 rounded-full mr-4"></div>
                    <div>
                      <div className="text-sm font-semibold text-gray-900">10:00 AM</div>
                      <div className="text-xs text-gray-600">Pilates</div>
                    </div>
                  </div>
                  <div className="text-xs text-gray-500">1h</div>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-gray-400 rounded-full mr-4"></div>
                    <div>
                      <div className="text-sm font-semibold text-gray-900">12:30 PM</div>
                      <div className="text-xs text-gray-600">Meeting</div>
                    </div>
                  </div>
                  <div className="text-xs text-gray-500">30m</div>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-gray-400 rounded-full mr-4"></div>
                    <div>
                      <div className="text-sm font-semibold text-gray-900">4:30 PM</div>
                      <div className="text-xs text-gray-600">Coffee</div>
                    </div>
                  </div>
                  <div className="text-xs text-gray-500">45m</div>
                </div>
              </div>
            </div>
          </div>

          {/* Workout Report Section */}
          <div>
            <p className="text-gray-600 text-xs mb-3 leading-relaxed">
              Your <span className="text-blue-500">weekly workout report</span> is ready.
            </p>
            
            {workout && (
              <Link to="/workout" className="block">
                <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-6 shadow-lg h-64 flex flex-col justify-between">
                  <div>
                    <div className="text-sm font-medium text-gray-900 mb-2">All exercises</div>
                    <div className="text-xs text-gray-500 mb-4">July 6 - 12</div>
                    
                    <div className="flex items-center justify-between mb-5">
                      <div className="text-2xl font-bold text-blue-600">5:29:45</div>
                      <div className="text-right text-xs">
                        <div className="text-gray-900 font-medium mb-1">6 sessions</div>
                        <div className="text-red-500 font-medium">2,762 Cal</div>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="text-sm font-medium text-gray-900 mb-3">Top exercises</div>
                    
                    <div className="flex items-center justify-between mb-2">
                      <div className="text-green-500 font-medium text-sm">Pilates</div>
                      <div className="text-xs text-gray-500">3 sessions</div>
                      <div className="text-xs text-gray-500">1,480 Cal</div>
                    </div>
                    
                    <div className="w-full bg-gray-200 rounded-full h-1.5 mb-2">
                      <div className="bg-green-500 h-1.5 rounded-full" style={{ width: '75%' }}></div>
                    </div>
                    
                    <div className="text-right text-xs text-green-500 font-medium">3:23:02</div>
                  </div>
                </div>
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}