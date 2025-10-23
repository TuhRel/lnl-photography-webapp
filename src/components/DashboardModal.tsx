import React, { useState, useEffect } from 'react';
import { Calendar, DollarSign, Download, Image as ImageIcon, X } from 'lucide-react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../config/firebase';
import { useAuth } from '../contexts/AuthContext';
import { ClientSession } from '../types';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';

interface DashboardModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const DashboardModal: React.FC<DashboardModalProps> = ({ isOpen, onClose }) => {
  const { currentUser } = useAuth();
  const [selectedSession, setSelectedSession] = useState<string | null>(null);
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);
  const [userSessions, setUserSessions] = useState<ClientSession[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch user sessions from Firestore
  useEffect(() => {
    if (!isOpen) return;

    const fetchSessions = async () => {
      if (!currentUser) {
        setUserSessions([]);
        setLoading(false);
        return;
      }

      try {
        const sessionsRef = collection(db, 'sessions');
        const querySnapshot = await getDocs(sessionsRef);
        const sessions: ClientSession[] = [];
        
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          // Filter by userId in memory
          if (data.userId === currentUser.uid) {
            sessions.push({
              id: doc.id,
              userId: data.userId,
              serviceId: data.serviceId,
              serviceName: data.serviceName || 'Photography Session',
              date: data.date || new Date().toISOString().split('T')[0],
              amount: data.amount || 0,
              status: data.status || 'processing',
              photos: data.photos || [],
              stripeSessionId: data.stripeSessionId || '',
              createdAt: data.createdAt,
            });
          }
        });
        
        // Sort by date
        sessions.sort((a, b) => {
          const dateA = new Date(a.date).getTime();
          const dateB = new Date(b.date).getTime();
          return dateB - dateA;
        });
        
        setUserSessions(sessions);
      } catch (error) {
        console.error('Error fetching sessions:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSessions();
  }, [currentUser, isOpen]);

  // Download individual photo function - works with Firebase Storage URLs
  const downloadPhoto = async (photoUrl: string, sessionName: string, photoIndex: number) => {
    try {
      console.log('🔽 Starting download for photo:', photoUrl);
      console.log('📝 Session name:', sessionName, 'Photo index:', photoIndex);
      
      // Generate filename
      const fileExtension = photoUrl.split('.').pop()?.split('?')[0] || 'jpg';
      const fileName = `${sessionName.replace(/\s+/g, '_')}_Photo_${photoIndex + 1}.${fileExtension}`;
      
      // Try to fetch and download as blob first (works if CORS is configured)
      try {
        const response = await fetch(photoUrl);
        if (response.ok) {
          const blob = await response.blob();
          const blobUrl = window.URL.createObjectURL(blob);
          
          const link = document.createElement('a');
          link.href = blobUrl;
          link.download = fileName;
          link.style.display = 'none';
          
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          
          // Cleanup blob URL after a short delay
          setTimeout(() => window.URL.revokeObjectURL(blobUrl), 100);
          
          console.log('✅ Download completed (blob method):', fileName);
          return;
        }
      } catch (fetchError) {
        console.log('⚠️ Blob download failed, trying direct link:', fetchError);
      }
      
      // Fallback: Direct link download (may open in new tab if CORS not configured)
      const link = document.createElement('a');
      link.href = photoUrl;
      link.download = fileName;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      link.style.display = 'none';
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      console.log('✅ Download initiated (direct link):', fileName);
      console.log('ℹ️ Note: Configure Firebase Storage CORS for better downloads');
      
    } catch (error) {
      console.error('❌ Error downloading photo:', error);
      alert('Failed to download photo. Please check CORS configuration.');
    }
  };

  // Download all photos from a session (tries ZIP first, falls back to individual downloads)
  const downloadAllPhotos = async (session: ClientSession) => {
    console.log('🚀 downloadAllPhotos called with session:', session.serviceName);
    console.log('📸 Number of photos:', session.photos?.length || 0);
    
    if (!session.photos || session.photos.length === 0) {
      console.log('❌ No photos found in session');
      alert('No photos available for download');
      return;
    }

    // Try ZIP approach first
    try {
      console.log('🔽 Attempting ZIP download for session:', session.serviceName);
      
      // Test if we can fetch the first photo
      const testResponse = await fetch(session.photos[0], { mode: 'cors' });
      if (!testResponse.ok) {
        throw new Error('CORS blocked - falling back to individual downloads');
      }
      
      // If test succeeds, proceed with ZIP
      alert(`Creating ZIP file with ${session.photos.length} photos. This may take a moment...`);
      
      const zip = new JSZip();
      let successCount = 0;
      
      // Download each photo and add to ZIP
      for (let i = 0; i < session.photos.length; i++) {
        console.log(`📥 Adding photo ${i + 1}/${session.photos.length} to ZIP`);
        
        const response = await fetch(session.photos[i], { mode: 'cors' });
        const blob = await response.blob();
        const fileExtension = session.photos[i].split('.').pop()?.split('?')[0] || 'jpg';
        const fileName = `${session.serviceName.replace(/\s+/g, '_')}_Photo_${i + 1}.${fileExtension}`;
        
        zip.file(fileName, blob);
        successCount++;
      }
      
      console.log('📦 Generating ZIP file...');
      
      // Generate and save ZIP file
      const zipBlob = await zip.generateAsync({ type: 'blob' });
      const zipFileName = `${session.serviceName.replace(/\s+/g, '_')}_Photos.zip`;
      saveAs(zipBlob, zipFileName);
      
      console.log('✅ ZIP download completed');
      alert(`✅ Successfully downloaded all ${successCount} photos as ${zipFileName}`);
      
    } catch (error) {
      console.log('❌ ZIP download failed, falling back to individual downloads:', error);
      
      // Fallback to individual downloads
      try {
        alert(`ZIP download blocked by browser security. Downloading ${session.photos.length} photos individually...`);
        
        let successCount = 0;
        
        // Download each photo individually with delays
        for (let i = 0; i < session.photos.length; i++) {
          try {
            console.log(`📥 Downloading individual photo ${i + 1}/${session.photos.length}`);
            await downloadPhoto(session.photos[i], session.serviceName, i);
            successCount++;
            
            // Add delay between downloads to prevent browser blocking
            if (i < session.photos.length - 1) {
              console.log('⏳ Waiting 400ms before next download...');
              await new Promise(resolve => setTimeout(resolve, 400));
            }
          } catch (downloadError) {
            console.error(`❌ Failed to download photo ${i + 1}:`, downloadError);
          }
        }
        
        console.log('✅ Individual downloads completed');
        alert(`✅ Downloaded ${successCount} photos individually to your Downloads folder`);
        
      } catch (fallbackError) {
        console.error('❌ Both ZIP and individual downloads failed:', fallbackError);
        alert('❌ Failed to download photos. Please try downloading them one by one.');
      }
    }
  };

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

  if (!isOpen) return null;

  return (
    <>
      {/* Main Dashboard Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col">
          {/* Header */}
          <div className="p-6 border-b border-gray-200 flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">My Dashboard</h2>
              <p className="text-gray-600 mt-1">
                Welcome back, {currentUser?.email?.split('@')[0]}!
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-6 h-6 text-gray-500" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-gray-50 rounded-lg p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Total Sessions</p>
                    <p className="text-3xl font-bold text-gray-900">{userSessions.length}</p>
                  </div>
                  <div className="p-3 bg-white rounded-full">
                    <Calendar className="w-6 h-6 text-gray-900" />
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Total Spent</p>
                    <p className="text-3xl font-bold text-gray-900">
                      ${userSessions.reduce((sum, s) => sum + (s.amount / 100), 0).toFixed(2)}
                    </p>
                  </div>
                  <div className="p-3 bg-white rounded-full">
                    <DollarSign className="w-6 h-6 text-gray-900" />
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Total Photos</p>
                    <p className="text-3xl font-bold text-gray-900">
                      {userSessions.reduce((sum, s) => sum + s.photos.length, 0)}
                    </p>
                  </div>
                  <div className="p-3 bg-white rounded-full">
                    <ImageIcon className="w-6 h-6 text-gray-900" />
                  </div>
                </div>
              </div>
            </div>

            {/* Sessions List */}
            <div className="bg-gray-50 rounded-lg overflow-hidden">
              <div className="p-4 bg-white border-b border-gray-200">
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
                    <div key={session.id} className="p-6 hover:bg-gray-100 transition-colors">
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
                              ${(session.amount / 100).toFixed(2)}
                            </div>
                            <div className="flex items-center">
                              <ImageIcon className="w-4 h-4 mr-1" />
                              {session.photos.length} photos
                            </div>
                          </div>
                        </div>

                        <div className="flex space-x-3">
                          <button
                            onClick={() => setSelectedSession(session.id)}
                            className="px-6 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
                          >
                            View Photos
                          </button>
                          {session.photos.length > 0 && (
                            <button
                              onClick={(e) => {
                                console.log('🖱️ Download All button clicked for session:', session.serviceName);
                                e.preventDefault();
                                e.stopPropagation();
                                downloadAllPhotos(session);
                              }}
                              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
                              title="Download all photos"
                            >
                              <Download className="w-4 h-4" />
                              <span>Download All</span>
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Photo Gallery Modal */}
      {selectedSession && selectedSessionData && (
        <div className="fixed inset-0 z-[60] bg-black/95 overflow-y-auto">
          <div className="min-h-screen p-4">
            <div className="max-w-6xl mx-auto">
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

              <div className="mb-6">
                <button 
                  onClick={(e) => {
                    console.log('🖱️ Download All Photos button clicked in modal');
                    e.preventDefault();
                    e.stopPropagation();
                    downloadAllPhotos(selectedSessionData);
                  }}
                  className="flex items-center space-x-2 px-6 py-3 bg-white text-gray-900 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <Download className="w-5 h-5" />
                  <span>Download All Photos</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {selectedSessionData.photos.map((photo, idx) => (
                  <div
                    key={idx}
                    className="relative aspect-square rounded-lg overflow-hidden group"
                  >
                    <img
                      src={photo}
                      alt={`Photo ${idx + 1}`}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110 cursor-pointer"
                      onClick={() => setSelectedPhoto(photo)}
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-300 flex items-center justify-center space-x-4">
                      <button
                        onClick={() => setSelectedPhoto(photo)}
                        className="p-2 bg-white/20 hover:bg-white/30 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300"
                        title="View full size"
                      >
                        <ImageIcon className="w-6 h-6 text-white" />
                      </button>
                      <button
                        onClick={(e) => {
                          console.log('🖱️ Individual photo download clicked, index:', idx);
                          e.preventDefault();
                          e.stopPropagation();
                          downloadPhoto(photo, selectedSessionData.serviceName, idx);
                        }}
                        className="p-2 bg-white/20 hover:bg-white/30 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300"
                        title="Download photo"
                      >
                        <Download className="w-6 h-6 text-white" />
                      </button>
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
          className="fixed inset-0 z-[70] bg-black/95 flex items-center justify-center p-4"
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
    </>
  );
};

export default DashboardModal;