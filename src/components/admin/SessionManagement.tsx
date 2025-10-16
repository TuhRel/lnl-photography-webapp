import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  DollarSign, 
  User as UserIcon, 
  Camera, 
  Filter,
  Search,
  Plus,
  Edit,
  Trash2,
  Eye
} from 'lucide-react';
import { ClientSession, User } from '../../types';
import { collection, onSnapshot, doc, updateDoc } from 'firebase/firestore';
import { db } from '../../config/firebase';

const SessionManagement: React.FC = () => {
  const [sessions, setSessions] = useState<ClientSession[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'completed' | 'upcoming' | 'processing'>('all');
  const [loading, setLoading] = useState(true);
  const [selectedSession, setSelectedSession] = useState<ClientSession | null>(null);

  // Fetch real data from Firestore with real-time updates
  useEffect(() => {
    const sessionsRef = collection(db, 'sessions');
    
    // Set up real-time listener
    const unsubscribe = onSnapshot(sessionsRef, (snapshot) => {
      const sessionsData: ClientSession[] = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        const sessionData: ClientSession = {
          id: doc.id,
          userId: data.userId,
          serviceId: data.serviceId || '',
          serviceName: data.serviceName || 'Unknown Service',
          date: data.date || new Date().toISOString().split('T')[0],
          amount: data.amount || 0,
          status: data.status || 'upcoming',
          photos: data.photos || [], // Ensure photos is always an array
          stripeSessionId: data.stripeSessionId || '',
          createdAt: data.createdAt,
        };
        sessionsData.push(sessionData);
      });
      
      // Sort by date (newest first)
      sessionsData.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      
      setSessions(sessionsData);
      setLoading(false);
    }, (error) => {
      console.error('Error fetching sessions:', error);
      setLoading(false);
    });

    // Cleanup listener on unmount
    return () => unsubscribe();
  }, []);

  // Fetch users for display names
  useEffect(() => {
    const usersRef = collection(db, 'users');
    
    const unsubscribe = onSnapshot(usersRef, (snapshot) => {
      const usersData: User[] = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        usersData.push({
          id: doc.id,
          email: data.email || '',
          displayName: data.displayName || undefined,
          role: data.role || 'client',
          createdAt: data.createdAt || new Date().toISOString(),
          lastLogin: data.lastLogin || undefined,
        });
      });
      setUsers(usersData);
    }, (error) => {
      console.error('Error fetching users:', error);
    });

    return () => unsubscribe();
  }, []);

  // Helper function to get user display name
  const getUserDisplayName = (userId?: string) => {
    if (!userId) return 'Unknown User';
    const user = users.find(u => u.id === userId);
    return user?.displayName || user?.email?.split('@')[0] || 'Unknown User';
  };

  const filteredSessions = sessions.filter(session => {
    const userName = getUserDisplayName(session.userId).toLowerCase();
    const matchesSearch = session.serviceName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         session.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         userName.includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || session.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

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
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const updateSessionStatus = async (sessionId: string, newStatus: 'completed' | 'upcoming' | 'processing') => {
    try {
      const sessionRef = doc(db, 'sessions', sessionId);
      await updateDoc(sessionRef, {
        status: newStatus
      });
      // The real-time listener will automatically update the UI
    } catch (error) {
      console.error('Error updating session status:', error);
      alert('Failed to update session status. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-20 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Session Management</h2>
            <p className="text-sm text-gray-600 mt-1">
              Manage photography sessions and bookings
            </p>
          </div>
          <button className="mt-4 sm:mt-0 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors flex items-center space-x-2">
            <Plus className="w-4 h-4" />
            <span>Add Session</span>
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search sessions, clients, or IDs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
            />
          </div>

          {/* Status Filter */}
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as any)}
              className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent appearance-none bg-white"
            >
              <option value="all">All Status</option>
              <option value="upcoming">Upcoming</option>
              <option value="processing">Processing</option>
              <option value="completed">Completed</option>
            </select>
          </div>
        </div>
      </div>

      {/* Sessions List */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Session
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Client
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date & Time
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Revenue
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Photos
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredSessions.map((session) => (
                <tr key={session.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {session.serviceName}
                      </div>
                      <div className="text-sm text-gray-500">
                        ID: {session.id}
                      </div>
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-2" />
                        {formatDate(session.date)}
                      </div>
                      <div className="flex items-center">
                        <DollarSign className="w-4 h-4 mr-2" />
                        ${(session.amount / 100).toFixed(2)}
                      </div>
                      <div className="flex items-center">
                        <Camera className="w-4 h-4 mr-2" />
                        {session.photos?.length || 0} photos
                      </div>
                      {session.stripeSessionId && (
                        <div className="text-xs text-blue-600">
                          Stripe: {session.stripeSessionId.slice(-8)}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-8 w-8">
                        <div className="h-8 w-8 rounded-full bg-gray-300 flex items-center justify-center">
                          <UserIcon className="w-4 h-4 text-gray-600" />
                        </div>
                      </div>
                      <div className="ml-3">
                        <div className="text-sm font-medium text-gray-900">
                          {getUserDisplayName(session.userId)}
                        </div>
                        {session.userId && (
                          <div className="text-xs text-gray-500">
                            ID: {session.userId.slice(-8)}
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center text-sm text-gray-500">
                      <Calendar className="w-4 h-4 mr-1" />
                      {formatDate(session.date)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <select
                      value={session.status}
                      onChange={(e) => updateSessionStatus(session.id, e.target.value as any)}
                      className={`px-2 py-1 text-xs font-medium rounded-full border-0 ${getStatusColor(session.status)}`}
                    >
                      <option value="upcoming">Upcoming</option>
                      <option value="processing">Processing</option>
                      <option value="completed">Completed</option>
                    </select>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center text-sm text-gray-900">
                      <DollarSign className="w-4 h-4 mr-1" />
                      ${(session.amount / 100).toFixed(2)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center text-sm text-gray-500">
                      <Camera className="w-4 h-4 mr-1" />
                      {session.photos?.length || 0} photos
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => setSelectedSession(session)}
                        className="text-gray-600 hover:text-gray-900"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        className="text-gray-600 hover:text-gray-900"
                        title="Edit Session"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        className="text-red-600 hover:text-red-900"
                        title="Delete Session"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Empty State */}
        {filteredSessions.length === 0 && (
          <div className="p-12 text-center">
            <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg mb-2">No sessions found</p>
            <p className="text-gray-400">
              {searchTerm || filterStatus !== 'all' 
                ? 'Try adjusting your search or filter criteria'
                : 'Sessions will appear here as clients book services'
              }
            </p>
          </div>
        )}
      </div>

      {/* Session Details Modal */}
      {selectedSession && (
        <SessionDetailsModal
          session={selectedSession}
          onClose={() => setSelectedSession(null)}
        />
      )}
    </div>
  );
};

const SessionDetailsModal: React.FC<{
  session: ClientSession;
  onClose: () => void;
}> = ({ session, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" onClick={onClose}></div>

        <div className="inline-block w-full max-w-2xl p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-lg">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-medium text-gray-900">Session Details</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              ×
            </button>
          </div>

          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Service</label>
                <p className="mt-1 text-sm text-gray-900">{session.serviceName}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Status</label>
                <span className={`mt-1 inline-block px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(session.status)}`}>
                  {session.status.charAt(0).toUpperCase() + session.status.slice(1)}
                </span>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Date</label>
                <p className="mt-1 text-sm text-gray-900">{formatDate(session.date)}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Amount</label>
                <p className="mt-1 text-sm text-gray-900">${(session.amount / 100).toFixed(2)}</p>
                {session.stripeSessionId && (
                  <p className="mt-1 text-xs text-blue-600">
                    Stripe ID: {session.stripeSessionId}
                  </p>
                )}
              </div>
            </div>

            {session.photos && session.photos.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Photos ({session.photos.length})
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {session.photos.map((photo, idx) => (
                    <img
                      key={idx}
                      src={photo}
                      alt={`Photo ${idx + 1}`}
                      className="w-full h-24 object-cover rounded-lg"
                    />
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
            >
              Close
            </button>
            <button className="px-4 py-2 text-sm font-medium text-white bg-gray-900 rounded-lg hover:bg-gray-800">
              Edit Session
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  function getStatusColor(status: string) {
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
  }

  function formatDate(dateString: string) {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
};

export default SessionManagement;
