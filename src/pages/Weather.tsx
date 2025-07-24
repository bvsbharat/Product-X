import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Cloud, Sun, CloudRain, MapPin, Thermometer, Droplets, Wind, Eye } from 'lucide-react';
import { getWeatherData, WeatherData } from '../services/mockApi';

interface HourlyWeather {
  time: string;
  temperature: number;
  condition: string;
  precipitation: number;
}

interface DailyForecast {
  day: string;
  high: number;
  low: number;
  condition: string;
  precipitation: number;
}

export default function Weather() {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [hourlyData, setHourlyData] = useState<HourlyWeather[]>([]);
  const [weeklyForecast, setWeeklyForecast] = useState<DailyForecast[]>([]);

  useEffect(() => {
    const loadWeatherData = async () => {
      const weatherData = await getWeatherData();
      setWeather(weatherData);

      // Generate mock hourly data for next 24 hours
      const hourly: HourlyWeather[] = [];
      const now = new Date();
      for (let i = 0; i < 24; i++) {
        const time = new Date(now.getTime() + i * 60 * 60 * 1000);
        hourly.push({
          time: time.toLocaleTimeString('en-US', { hour: 'numeric', hour12: true }),
          temperature: weatherData.current.temperature + Math.floor(Math.random() * 10) - 5,
          condition: ['Sunny', 'Cloudy', 'Partly Cloudy'][Math.floor(Math.random() * 3)],
          precipitation: Math.floor(Math.random() * 30)
        });
      }
      setHourlyData(hourly);

      // Generate mock weekly forecast
      const weekly: DailyForecast[] = [];
      const days = ['Today', 'Tomorrow', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
      for (let i = 0; i < 7; i++) {
        weekly.push({
          day: days[i],
          high: weatherData.current.high + Math.floor(Math.random() * 10) - 5,
          low: weatherData.current.low + Math.floor(Math.random() * 8) - 4,
          condition: ['Sunny', 'Cloudy', 'Rainy', 'Partly Cloudy'][Math.floor(Math.random() * 4)],
          precipitation: Math.floor(Math.random() * 40)
        });
      }
      setWeeklyForecast(weekly);
    };

    loadWeatherData();
  }, []);

  const getWeatherIcon = (condition: string, size: string = 'w-6 h-6') => {
    switch (condition.toLowerCase()) {
      case 'sunny':
        return <Sun className={`${size} text-yellow-400`} />;
      case 'cloudy':
      case 'partly cloudy':
        return <Cloud className={`${size} text-gray-400`} />;
      case 'rainy':
        return <CloudRain className={`${size} text-blue-400`} />;
      default:
        return <Sun className={`${size} text-yellow-400`} />;
    }
  };

  if (!weather) {
    return (
      <div className="min-h-screen bg-blue-50 flex items-center justify-center">
        <div className="text-lg text-gray-600">Loading weather data...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-blue-50 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center mb-6">
          <Link to="/" className="mr-4">
            <ArrowLeft className="w-6 h-6 text-gray-600 hover:text-gray-800" />
          </Link>
          <h1 className="text-2xl font-bold text-gray-800">Weather Details</h1>
        </div>

        {/* Current Weather */}
        <div className="bg-blue-500 text-white rounded-2xl p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center mb-2">
                <MapPin className="w-4 h-4 mr-1" />
                <span className="text-sm opacity-90">{weather.current.location}</span>
              </div>
              <div className="text-6xl font-bold mb-2">{weather.current.temperature}°</div>
              <div className="text-xl opacity-90 mb-2">{weather.current.condition}</div>
              <div className="text-sm opacity-75">
                Feels like {weather.current.temperature + 2}°
              </div>
            </div>
            <div className="text-right">
              {getWeatherIcon(weather.current.condition, 'w-16 h-16')}
              <div className="text-sm opacity-75 mt-2">
                H: {weather.current.high}° L: {weather.current.low}°
              </div>
            </div>
          </div>

          {/* Weather Details */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-blue-400">
            <div className="text-center">
              <Wind className="w-5 h-5 mx-auto mb-1 opacity-75" />
              <div className="text-xs opacity-75">Wind</div>
              <div className="text-sm font-semibold">12 mph</div>
            </div>
            <div className="text-center">
              <Droplets className="w-5 h-5 mx-auto mb-1 opacity-75" />
              <div className="text-xs opacity-75">Humidity</div>
              <div className="text-sm font-semibold">65%</div>
            </div>
            <div className="text-center">
              <Eye className="w-5 h-5 mx-auto mb-1 opacity-75" />
              <div className="text-xs opacity-75">Visibility</div>
              <div className="text-sm font-semibold">10 mi</div>
            </div>
            <div className="text-center">
              <Thermometer className="w-5 h-5 mx-auto mb-1 opacity-75" />
              <div className="text-xs opacity-75">UV Index</div>
              <div className="text-sm font-semibold">6</div>
            </div>
          </div>
        </div>

        {/* Hourly Forecast */}
        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <h2 className="text-xl font-bold text-gray-800 mb-4">24-Hour Forecast</h2>
          <div className="overflow-x-auto">
            <div className="flex space-x-4 pb-2">
              {hourlyData.slice(0, 12).map((hour, index) => (
                <div key={index} className="flex-shrink-0 text-center p-3 bg-gray-50 rounded-lg min-w-[80px]">
                  <div className="text-xs text-gray-600 mb-2">{hour.time}</div>
                  <div className="flex justify-center mb-2">
                    {getWeatherIcon(hour.condition, 'w-5 h-5')}
                  </div>
                  <div className="text-sm font-semibold text-gray-800">{hour.temperature}°</div>
                  <div className="text-xs text-blue-500 mt-1">{hour.precipitation}%</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 7-Day Forecast */}
        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <h2 className="text-xl font-bold text-gray-800 mb-4">7-Day Forecast</h2>
          <div className="space-y-3">
            {weeklyForecast.map((day, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center flex-1">
                  <div className="w-16 text-sm font-medium text-gray-800">
                    {day.day}
                  </div>
                  <div className="flex items-center ml-4">
                    {getWeatherIcon(day.condition)}
                    <span className="ml-2 text-sm text-gray-600">{day.condition}</span>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-xs text-blue-500">{day.precipitation}%</div>
                  <div className="text-sm text-gray-600">{day.low}°</div>
                  <div className="text-sm font-semibold text-gray-800 w-8 text-right">{day.high}°</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Weather Alerts */}
        <div className="bg-orange-50 border border-orange-200 rounded-2xl p-6">
          <h2 className="text-xl font-bold text-orange-800 mb-4">Weather Alerts</h2>
          <div className="bg-orange-100 rounded-lg p-4">
            <div className="flex items-start">
              <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 mr-3 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-orange-800">High UV Index Warning</h3>
                <p className="text-sm text-orange-700 mt-1">
                  UV index will reach 8-9 today. Wear sunscreen and limit outdoor exposure during peak hours (10 AM - 4 PM).
                </p>
                <p className="text-xs text-orange-600 mt-2">Valid until 6:00 PM today</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}