import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  MoreVertical, 
  Mail, 
  Calendar,
  User,
  Shield,
  ShieldCheck
} from 'lucide-react';
import { User as UserType } from '../../types';
import { useAdmin } from '../../contexts/AdminContext';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../../config/firebase';

const ClientManagement: React.FC = () => {
  const { updateUserRole } = useAdmin();
  const [clients, setClients] = useState<UserType[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState<'all' | 'client' | 'admin'>('all');
  const [loading, setLoading] = useState(true);

  // Fetch real data from Firestore with real-time updates
  useEffect(() => {
    const usersRef = collection(db, 'users');
    
    // Set up real-time listener
    const unsubscribe = onSnapshot(usersRef, (snapshot) => {
      const usersData: UserType[] = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        const userData: UserType = {
          id: doc.id,
          email: data.email || '',
          displayName: data.displayName || undefined,
          role: data.role || 'client', // Ensure role always has a value
          createdAt: data.createdAt || new Date().toISOString(),
          lastLogin: data.lastLogin || undefined,
        };
        usersData.push(userData);
      });
      
      // Sort by creation date (newest first)
      usersData.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      
      setClients(usersData);
      setLoading(false);
    }, (error) => {
      console.error('Error fetching users:', error);
      setLoading(false);
    });

    // Cleanup listener on unmount
    return () => unsubscribe();
  }, []);

  const filteredClients = clients.filter(client => {
    const matchesSearch = client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (client.displayName?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false);
    const matchesRole = filterRole === 'all' || client.role === filterRole;
    return matchesSearch && matchesRole;
  });

  const handleRoleChange = async (userId: string, newRole: 'client' | 'admin') => {
    try {
      await updateUserRole(userId, newRole);
      setClients(prev => prev.map(client => 
        client.id === userId ? { ...client, role: newRole } : client
      ));
    } catch (error) {
      console.error('Failed to update user role:', error);
      alert('Failed to update user role. Please try again.');
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

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Client Management</h2>
            <p className="text-sm text-gray-600 mt-1">
              Manage user accounts and permissions
            </p>
          </div>
          <div className="mt-4 sm:mt-0">
            <span className="text-sm text-gray-500">
              {filteredClients.length} of {clients.length} users
            </span>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="p-6 border-b border-gray-200 bg-gray-50">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by email or name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
            />
          </div>

          {/* Role Filter */}
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value as 'all' | 'client' | 'admin')}
              className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent appearance-none bg-white"
            >
              <option value="all">All Roles</option>
              <option value="client">Clients</option>
              <option value="admin">Admins</option>
            </select>
          </div>
        </div>
      </div>

      {/* Client List */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                User
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Role
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Joined
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Last Login
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredClients.map((client) => (
              <tr key={client.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10">
                      <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                        <User className="w-5 h-5 text-gray-600" />
                      </div>
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">
                        {client.displayName || 'No name'}
                      </div>
                      <div className="text-sm text-gray-500 flex items-center">
                        <Mail className="w-4 h-4 mr-1" />
                        {client.email}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    {client.role === 'admin' ? (
                      <ShieldCheck className="w-4 h-4 text-green-600 mr-2" />
                    ) : (
                      <Shield className="w-4 h-4 text-gray-400 mr-2" />
                    )}
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      client.role === 'admin' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {client.role ? client.role.charAt(0).toUpperCase() + client.role.slice(1) : 'Unknown'}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-1" />
                    {formatDate(client.createdAt)}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {client.lastLogin ? formatDate(client.lastLogin) : 'Never'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex items-center space-x-2">
                    <select
                      value={client.role}
                      onChange={(e) => handleRoleChange(client.id, e.target.value as 'client' | 'admin')}
                      className="text-sm border border-gray-300 rounded px-2 py-1 focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                    >
                      <option value="client">Client</option>
                      <option value="admin">Admin</option>
                    </select>
                    <button className="text-gray-400 hover:text-gray-600">
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Empty State */}
      {filteredClients.length === 0 && (
        <div className="p-12 text-center">
          <User className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-lg mb-2">No users found</p>
          <p className="text-gray-400">
            {searchTerm || filterRole !== 'all' 
              ? 'Try adjusting your search or filter criteria'
              : 'Users will appear here as they sign up'
            }
          </p>
        </div>
      )}
    </div>
  );
};

export default ClientManagement;
