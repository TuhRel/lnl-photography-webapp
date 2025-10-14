import React, { useState, useEffect } from 'react';
import { Calendar, DollarSign, Download, Image as ImageIcon, X } from 'lucide-react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { useAuth } from '../../contexts/AuthContext';
import { ClientSession } from '../../types';

const Dashboard: React.FC = () => {
  const { currentUser } = useAuth();
  const [selectedSession, setSelectedSession] = useState<string | null>(null);
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);
  const [userSessions, setUserSessions] = useState<ClientSession[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch user sessions from Firestore
  useEffect(() => {
    const fetchSessions = async () => {
      if (!currentUser) {
        setUserSessions([]);
        setLoading(false);
        return;
      }

      try {
        const sessionsRef = collection(db, 'sessions');
        const q = query(
          sessionsRef,
          where('userId', '==', currentUser.uid)
        );
        
        const querySnapshot = await getDocs(q);
        const sessions: ClientSession[] = [];
        
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          sessions.push({
            id: doc.id,
            userId: data.userId,
            serviceId: data.serviceId,
            serviceName: data.serviceName || 'Photography Session',
            date: data.date || new Date().toISOString().split('T')[0],
            price: data.amount ? data.amount / 100 : 0, // Convert from cents
            status: data.status || 'processing',
            photos: data.photos || [],
          });
        });
        
        // Sort by date in memory (most recent first)
        sessions.sort((a, b) => {
          const dateA = new Date(a.date).getTime();
          const dateB = new Date(b.date).getTime();
          return dateB - dateA;
        });
        
        setUserSessions(sessions);
        console.log('✅ Loaded', sessions.length, 'session(s) from Firestore');
      } catch (error) {
        console.error('Error fetching sessions:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSessions();
  }, [currentUser]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'upcoming':
        return 'bg-blue-100 text-blue-800';
      case 'processing':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const selectedSessionData = userSessions.find(s => s.id === selectedSession);

  return (
    <section id="dashboard" className="min-h-screen pt-24 pb-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h2 className="text-4xl font-bold text-gray-900 mb-2">My Dashboard</h2>
          <p className="text-gray-600">
            Welcome back, {currentUser?.email?.split('@')[0]}!
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Sessions</p>
                <p className="text-3xl font-bold text-gray-900">{userSessions.length}</p>
              </div>
              <div className="p-3 bg-gray-100 rounded-full">
                <Calendar className="w-6 h-6 text-gray-900" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Spent</p>
                <p className="text-3xl font-bold text-gray-900">
                  ${userSessions.reduce((sum, s) => sum + s.price, 0)}
                </p>
              </div>
              <div className="p-3 bg-gray-100 rounded-full">
                <DollarSign className="w-6 h-6 text-gray-900" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Photos</p>
                <p className="text-3xl font-bold text-gray-900">
                  {userSessions.reduce((sum, s) => sum + s.photos.length, 0)}
                </p>
              </div>
              <div className="p-3 bg-gray-100 rounded-full">
                <ImageIcon className="w-6 h-6 text-gray-900" />
              </div>
            </div>
          </div>
        </div>

        {/* Sessions List */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-xl font-bold text-gray-900">My Sessions</h3>
          </div>

          {loading ? (
            <div className="p-12 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
              <p className="text-gray-500 mt-4">Loading sessions...</p>
            </div>
          ) : userSessions.length === 0 ? (
            <div className="p-12 text-center">
              <ImageIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg mb-2">No sessions yet</p>
              <p className="text-gray-400">Book your first session to get started!</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {userSessions.map((session) => (
                <div key={session.id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                    <div className="mb-4 md:mb-0">
                      <div className="flex items-center space-x-3 mb-2">
                        <h4 className="text-lg font-semibold text-gray-900">
                          {session.serviceName}
                        </h4>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(session.status)}`}>
                          {session.status.charAt(0).toUpperCase() + session.status.slice(1)}
                        </span>
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 mr-1" />
                          {formatDate(session.date)}
                        </div>
                        <div className="flex items-center">
                          <DollarSign className="w-4 h-4 mr-1" />
                          ${session.price}
                        </div>
                        <div className="flex items-center">
                          <ImageIcon className="w-4 h-4 mr-1" />
                          {session.photos.length} photos
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => setSelectedSession(session.id)}
                      className="px-6 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
                    >
                      View Photos
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Photo Gallery Modal */}
      {selectedSession && selectedSessionData && (
        <div className="fixed inset-0 z-50 bg-black/95 overflow-y-auto">
          <div className="min-h-screen p-4">
            <div className="max-w-6xl mx-auto">
              {/* Header */}
              <div className="flex items-center justify-between mb-8 pt-4">
                <div>
                  <h3 className="text-2xl font-bold text-white mb-1">
                    {selectedSessionData.serviceName}
                  </h3>
                  <p className="text-gray-400">
                    {formatDate(selectedSessionData.date)} • {selectedSessionData.photos.length} photos
                  </p>
                </div>
                <button
                  onClick={() => setSelectedSession(null)}
                  className="p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
                >
                  <X className="w-6 h-6 text-white" />
                </button>
              </div>

              {/* Download All Button */}
              <div className="mb-6">
                <button className="flex items-center space-x-2 px-6 py-3 bg-white text-gray-900 rounded-lg hover:bg-gray-100 transition-colors">
                  <Download className="w-5 h-5" />
                  <span>Download All Photos</span>
                </button>
              </div>

              {/* Photo Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {selectedSessionData.photos.map((photo, idx) => (
                  <div
                    key={idx}
                    className="relative aspect-square rounded-lg overflow-hidden cursor-pointer group"
                    onClick={() => setSelectedPhoto(photo)}
                  >
                    <img
                      src={photo}
                      alt={`Photo ${idx + 1}`}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-300 flex items-center justify-center">
                      <Download className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Full Size Photo Modal */}
      {selectedPhoto && (
        <div
          className="fixed inset-0 z-[60] bg-black/95 flex items-center justify-center p-4"
          onClick={() => setSelectedPhoto(null)}
        >
          <button
            className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
            onClick={() => setSelectedPhoto(null)}
          >
            <X className="w-6 h-6 text-white" />
          </button>
          
          <img
            src={selectedPhoto}
            alt="Full size"
            className="max-w-full max-h-full object-contain"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </section>
  );
};

export default Dashboard;
