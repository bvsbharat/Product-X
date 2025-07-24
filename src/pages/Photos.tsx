import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Camera, Search, Filter, Calendar, MapPin, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { getPhotoMemories, PhotoMemory } from '../services/mockApi';

interface PhotoGroup {
  date: string;
  photos: PhotoMemory[];
}

export default function Photos() {
  const [photos, setPhotos] = useState<PhotoMemory[]>([]);
  const [filteredPhotos, setFilteredPhotos] = useState<PhotoMemory[]>([]);
  const [photoGroups, setPhotoGroups] = useState<PhotoGroup[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedPhoto, setSelectedPhoto] = useState<PhotoMemory | null>(null);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [viewMode, setViewMode] = useState<'grid' | 'timeline'>('grid');

  useEffect(() => {
    const loadPhotos = async () => {
      const photosData = await getPhotoMemories();
      
      // Add more mock photos for better demonstration
      const additionalPhotos: PhotoMemory[] = [
        {
          id: '4',
          url: 'https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=beautiful%20sunset%20over%20mountains%20landscape%20photography&image_size=landscape_16_9',
          date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          location: 'Rocky Mountains',
          description: 'Beautiful sunset over the Rocky Mountains'
        },
        {
          id: '5',
          url: 'https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=cozy%20coffee%20shop%20interior%20warm%20lighting%20lifestyle%20photography&image_size=square',
          date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
          location: 'Downtown Cafe',
          description: 'Cozy afternoon at the downtown cafe'
        },
        {
          id: '6',
          url: 'https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=group%20of%20friends%20laughing%20together%20outdoor%20picnic%20happy%20moments&image_size=landscape_4_3',
          date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
          location: 'Central Park',
          description: 'Fun picnic with friends in Central Park'
        },
        {
          id: '7',
          url: 'https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=delicious%20homemade%20pasta%20dish%20food%20photography%20restaurant%20style&image_size=square',
          date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
          location: 'Home Kitchen',
          description: 'Homemade pasta dinner'
        },
        {
          id: '8',
          url: 'https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=peaceful%20lake%20reflection%20morning%20mist%20nature%20photography&image_size=landscape_16_9',
          date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
          location: 'Lake Tahoe',
          description: 'Peaceful morning at Lake Tahoe'
        }
      ];
      
      const allPhotos = [...photosData, ...additionalPhotos];
      setPhotos(allPhotos);
      setFilteredPhotos(allPhotos);
      groupPhotosByDate(allPhotos);
    };

    loadPhotos();
  }, []);

  useEffect(() => {
    let filtered = photos;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(photo => 
        photo.location?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by date
    if (selectedDate) {
      filtered = filtered.filter(photo => {
        const photoDate = new Date(photo.date).toDateString();
        const filterDate = new Date(selectedDate).toDateString();
        return photoDate === filterDate;
      });
    }

    setFilteredPhotos(filtered);
    groupPhotosByDate(filtered);
  }, [photos, searchTerm, selectedDate]);

  const groupPhotosByDate = (photosToGroup: PhotoMemory[]) => {
    const groups: { [key: string]: PhotoMemory[] } = {};
    
    photosToGroup.forEach(photo => {
      const date = new Date(photo.date).toDateString();
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(photo);
    });

    const sortedGroups = Object.entries(groups)
      .map(([date, photos]) => ({ date, photos }))
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    setPhotoGroups(sortedGroups);
  };

  const openPhotoViewer = (photo: PhotoMemory) => {
    setSelectedPhoto(photo);
    const index = filteredPhotos.findIndex(p => p.id === photo.id);
    setCurrentPhotoIndex(index);
  };

  const closePhotoViewer = () => {
    setSelectedPhoto(null);
  };

  const navigatePhoto = (direction: 'prev' | 'next') => {
    const newIndex = direction === 'prev' 
      ? Math.max(0, currentPhotoIndex - 1)
      : Math.min(filteredPhotos.length - 1, currentPhotoIndex + 1);
    
    setCurrentPhotoIndex(newIndex);
    setSelectedPhoto(filteredPhotos[newIndex]);
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
        weekday: 'long',
        year: 'numeric',
        month: 'long', 
        day: 'numeric' 
      });
    }
  };

  const formatDateShort = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-blue-50 p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Link to="/" className="mr-4">
              <ArrowLeft className="w-6 h-6 text-gray-600 hover:text-gray-800" />
            </Link>
            <h1 className="text-2xl font-bold text-gray-800">Photo Gallery</h1>
          </div>
          <div className="flex bg-white rounded-lg p-1 shadow-sm">
            <button
              onClick={() => setViewMode('grid')}
              className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                viewMode === 'grid' ? 'bg-blue-500 text-white' : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              Grid
            </button>
            <button
              onClick={() => setViewMode('timeline')}
              className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                viewMode === 'timeline' ? 'bg-blue-500 text-white' : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              Timeline
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
                placeholder="Search photos by title or location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            {/* Date Filter */}
            <div className="flex items-center space-x-2">
              <Calendar className="w-5 h-5 text-gray-400" />
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              {selectedDate && (
                <button
                  onClick={() => setSelectedDate('')}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Photos Display */}
        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-800 flex items-center">
              <Camera className="w-5 h-5 mr-2 text-blue-500" />
              Memories ({filteredPhotos.length})
            </h2>
          </div>

          {filteredPhotos.length > 0 ? (
            viewMode === 'grid' ? (
              /* Grid View */
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {filteredPhotos.map((photo) => (
                  <div
                    key={photo.id}
                    onClick={() => openPhotoViewer(photo)}
                    className="relative group cursor-pointer rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow"
                  >
                    <img
                      src={photo.url}
                      alt={photo.location || 'Photo'}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="absolute bottom-2 left-2 right-2 text-white opacity-0 group-hover:opacity-100 transition-opacity">
                      <h3 className="text-sm font-semibold truncate">{photo.location}</h3>
                      <p className="text-xs opacity-90 flex items-center">
                        <MapPin className="w-3 h-3 mr-1" />
                        {photo.location}
                      </p>
                    </div>
                    <div className="absolute top-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
                      {formatDateShort(photo.date)}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              /* Timeline View */
              <div className="space-y-8">
                {photoGroups.map((group) => (
                  <div key={group.date}>
                    <h3 className="text-lg font-semibold text-gray-800 mb-4 sticky top-4 bg-white py-2">
                      {formatDate(group.date)}
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                      {group.photos.map((photo) => (
                        <div
                          key={photo.id}
                          onClick={() => openPhotoViewer(photo)}
                          className="relative group cursor-pointer rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow"
                        >
                          <img
                            src={photo.url}
                            alt={photo.location || 'Photo'}
                            className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                          <div className="absolute bottom-2 left-2 right-2 text-white opacity-0 group-hover:opacity-100 transition-opacity">
                            <h4 className="text-sm font-semibold truncate">{photo.location}</h4>
                            <p className="text-xs opacity-90 flex items-center">
                              <MapPin className="w-3 h-3 mr-1" />
                              {photo.location}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )
          ) : (
            <div className="text-center py-12">
              <Camera className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">No photos found</p>
              <p className="text-sm text-gray-400 mt-1">
                {searchTerm || selectedDate 
                  ? 'Try adjusting your search or filter'
                  : 'Your photo memories will appear here'
                }
              </p>
            </div>
          )}
        </div>

        {/* Photo Viewer Modal */}
        {selectedPhoto && (
          <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4">
            <div className="relative max-w-4xl max-h-full">
              {/* Close Button */}
              <button
                onClick={closePhotoViewer}
                className="absolute top-4 right-4 text-white hover:text-gray-300 z-10"
              >
                <X className="w-8 h-8" />
              </button>

              {/* Navigation Buttons */}
              {currentPhotoIndex > 0 && (
                <button
                  onClick={() => navigatePhoto('prev')}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300 z-10"
                >
                  <ChevronLeft className="w-8 h-8" />
                </button>
              )}
              
              {currentPhotoIndex < filteredPhotos.length - 1 && (
                <button
                  onClick={() => navigatePhoto('next')}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300 z-10"
                >
                  <ChevronRight className="w-8 h-8" />
                </button>
              )}

              {/* Photo */}
              <img
                src={selectedPhoto.url}
                alt={selectedPhoto.location || 'Photo'}
                className="max-w-full max-h-[80vh] object-contain rounded-lg"
              />

              {/* Photo Info */}
              <div className="absolute bottom-4 left-4 right-4 bg-black/70 text-white p-4 rounded-lg">
                <h3 className="text-xl font-semibold mb-2">{selectedPhoto.location}</h3>
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center">
                    <MapPin className="w-4 h-4 mr-1" />
                    <span>{selectedPhoto.location}</span>
                  </div>
                  <span>{formatDate(selectedPhoto.date)}</span>
                </div>
                <div className="text-xs text-gray-300 mt-2">
                  {currentPhotoIndex + 1} of {filteredPhotos.length}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}