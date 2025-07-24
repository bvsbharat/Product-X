import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Activity, Calendar, Clock, Flame, Target, TrendingUp } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { getWorkoutData, WorkoutData } from '../services/mockApi';

interface WorkoutSession {
  id: string;
  date: string;
  type: string;
  duration: number;
  calories: number;
  intensity: 'Low' | 'Medium' | 'High';
}

interface WeeklyData {
  week: string;
  sessions: number;
  calories: number;
  minutes: number;
}

interface ExerciseTypeData {
  name: string;
  value: number;
  color: string;
}

export default function Workout() {
  const [workoutData, setWorkoutData] = useState<WorkoutData | null>(null);
  const [sessions, setSessions] = useState<WorkoutSession[]>([]);
  const [weeklyData, setWeeklyData] = useState<WeeklyData[]>([]);
  const [exerciseTypes, setExerciseTypes] = useState<ExerciseTypeData[]>([]);
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month'>('week');

  useEffect(() => {
    const loadWorkoutData = async () => {
      const data = await getWorkoutData();
      setWorkoutData(data);

      // Generate mock workout sessions
      const mockSessions: WorkoutSession[] = [
        {
          id: '1',
          date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
          type: 'Running',
          duration: 45,
          calories: 420,
          intensity: 'High'
        },
        {
          id: '2',
          date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          type: 'Strength Training',
          duration: 60,
          calories: 380,
          intensity: 'Medium'
        },
        {
          id: '3',
          date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
          type: 'Yoga',
          duration: 30,
          calories: 150,
          intensity: 'Low'
        },
        {
          id: '4',
          date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
          type: 'Cycling',
          duration: 90,
          calories: 650,
          intensity: 'High'
        },
        {
          id: '5',
          date: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
          type: 'Swimming',
          duration: 40,
          calories: 320,
          intensity: 'Medium'
        }
      ];
      setSessions(mockSessions);

      // Generate weekly progress data
      const weekly: WeeklyData[] = [
        { week: 'Week 1', sessions: 3, calories: 950, minutes: 135 },
        { week: 'Week 2', sessions: 4, calories: 1200, minutes: 180 },
        { week: 'Week 3', sessions: 2, calories: 700, minutes: 90 },
        { week: 'Week 4', sessions: 5, calories: 1400, minutes: 225 },
        { week: 'This Week', sessions: data.weeklyStats.sessions, calories: data.weeklyStats.calories, minutes: parseInt(data.weeklyStats.totalTime.split(':')[0]) * 60 + parseInt(data.weeklyStats.totalTime.split(':')[1]) }
      ];
      setWeeklyData(weekly);

      // Generate exercise type distribution
      const types: ExerciseTypeData[] = [
        { name: 'Running', value: 35, color: '#2196F3' },
        { name: 'Strength', value: 25, color: '#4CAF50' },
        { name: 'Cycling', value: 20, color: '#FF9800' },
        { name: 'Yoga', value: 15, color: '#9C27B0' },
        { name: 'Swimming', value: 5, color: '#00BCD4' }
      ];
      setExerciseTypes(types);
    };

    loadWorkoutData();
  }, []);

  const getIntensityColor = (intensity: string) => {
    switch (intensity) {
      case 'High': return 'bg-red-100 text-red-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'Low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString('en-US', { 
        weekday: 'short', 
        month: 'short', 
        day: 'numeric' 
      });
    }
  };

  if (!workoutData) {
    return (
      <div className="min-h-screen bg-blue-50 flex items-center justify-center">
        <div className="text-lg text-gray-600">Loading workout data...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-blue-50 p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Link to="/" className="mr-4">
              <ArrowLeft className="w-6 h-6 text-gray-600 hover:text-gray-800" />
            </Link>
            <h1 className="text-2xl font-bold text-gray-800">Workout Analytics</h1>
          </div>
          <div className="flex bg-white rounded-lg p-1 shadow-sm">
            <button
              onClick={() => setSelectedPeriod('week')}
              className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                selectedPeriod === 'week' ? 'bg-blue-500 text-white' : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              Week
            </button>
            <button
              onClick={() => setSelectedPeriod('month')}
              className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                selectedPeriod === 'month' ? 'bg-blue-500 text-white' : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              Month
            </button>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Sessions</p>
                <p className="text-2xl font-bold text-green-500">{workoutData.weeklyStats.sessions}</p>
              </div>
              <Activity className="w-8 h-8 text-green-500" />
            </div>
          </div>
          
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Minutes</p>
                <p className="text-2xl font-bold text-blue-500">{parseInt(workoutData.weeklyStats.totalTime.split(':')[0]) * 60 + parseInt(workoutData.weeklyStats.totalTime.split(':')[1])}</p>
              </div>
              <Clock className="w-8 h-8 text-blue-500" />
            </div>
          </div>
          
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Calories Burned</p>
                <p className="text-2xl font-bold text-orange-500">{workoutData.weeklyStats.calories}</p>
              </div>
              <Flame className="w-8 h-8 text-orange-500" />
            </div>
          </div>
          
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Weekly Goal</p>
                <p className="text-2xl font-bold text-purple-500">{Math.round(((parseInt(workoutData.weeklyStats.totalTime.split(':')[0]) * 60 + parseInt(workoutData.weeklyStats.totalTime.split(':')[1])) / 150) * 100)}%</p>
              </div>
              <Target className="w-8 h-8 text-purple-500" />
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Weekly Progress Chart */}
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
              <TrendingUp className="w-5 h-5 mr-2 text-blue-500" />
              Weekly Progress
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="week" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="sessions" fill="#4CAF50" name="Sessions" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Exercise Type Distribution */}
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Exercise Distribution</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={exerciseTypes}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, value }) => `${name} ${value}%`}
                >
                  {exerciseTypes.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Calories Trend */}
        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Calories Burned Trend</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={weeklyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="week" />
              <YAxis />
              <Tooltip />
              <Line 
                type="monotone" 
                dataKey="calories" 
                stroke="#FF9800" 
                strokeWidth={3}
                dot={{ fill: '#FF9800', strokeWidth: 2, r: 6 }}
                name="Calories"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Recent Sessions */}
        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
            <Calendar className="w-5 h-5 mr-2 text-green-500" />
            Recent Sessions
          </h2>
          <div className="space-y-4">
            {sessions.map((session) => (
              <div key={session.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center mb-2">
                      <h3 className="font-semibold text-gray-800 mr-3">{session.type}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getIntensityColor(session.intensity)}`}>
                        {session.intensity}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">{formatDate(session.date)}</p>
                  </div>
                  
                  <div className="flex items-center space-x-6 text-sm">
                    <div className="text-center">
                      <div className="flex items-center text-gray-600">
                        <Clock className="w-4 h-4 mr-1" />
                        <span>{session.duration} min</span>
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center text-gray-600">
                        <Flame className="w-4 h-4 mr-1" />
                        <span>{session.calories} cal</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}