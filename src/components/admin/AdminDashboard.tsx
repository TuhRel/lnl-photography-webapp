import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Calendar, 
  DollarSign, 
  Camera, 
  Settings, 
  TrendingUp,
  Clock,
  CheckCircle,
  Image as ImageIcon,
  Briefcase
} from 'lucide-react';
import { AdminStats, ClientSession } from '../../types';
import { useAdmin } from '../../contexts/AdminContext';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../config/firebase';
import ClientManagement from './ClientManagement';
import SessionManagement from './SessionManagement';
import PortfolioEditor from './PortfolioEditor';
import ServiceEditor from './ServiceEditor';
import AboutEditor from './AboutEditor';

const AdminDashboard: React.FC = () => {
  const { isAdmin, userProfile } = useAdmin();
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState<AdminStats>({
    totalClients: 0,
    totalSessions: 0,
    totalRevenue: 0,
    upcomingSessions: 0,
    completedSessions: 0,
    portfolioItems: 0,
    activeServices: 0,
  });

  // Fetch real data from Firestore
  useEffect(() => {
    const fetchStats = async () => {
      if (!isAdmin) {
        console.log('User is not admin, skipping stats fetch');
        return;
      }

      try {
        let totalClients = 0;
        let totalSessions = 0;
        let totalRevenue = 0;
        let upcomingSessions = 0;
        let completedSessions = 0;
        let portfolioItems = 0;
        let activeServices = 0;

        // Fetch users with error handling
        try {
          const usersRef = collection(db, 'users');
          const usersSnapshot = await getDocs(usersRef);
          totalClients = usersSnapshot.size;
        } catch (userError) {
          console.warn('Could not fetch users:', userError);
        }

        // Fetch sessions with error handling
        try {
          const sessionsRef = collection(db, 'sessions');
          const sessionsSnapshot = await getDocs(sessionsRef);
          const allSessions = sessionsSnapshot.docs.map(doc => {
            const data = doc.data();
            return { 
              id: doc.id, 
              ...data,
              photos: data.photos || [] // Ensure photos is always an array
            } as ClientSession;
          });
          
          totalSessions = allSessions.length;
          completedSessions = allSessions.filter(session => session.status === 'completed').length;
          upcomingSessions = allSessions.filter(session => session.status === 'upcoming').length;
          totalRevenue = allSessions
            .filter(session => session.status === 'completed')
            .reduce((sum, session) => sum + (session.amount || 0), 0) / 100; // Convert from cents to dollars
        } catch (sessionError) {
          console.warn('Could not fetch sessions:', sessionError);
        }

        // Fetch portfolio items with error handling
        try {
          const portfolioRef = collection(db, 'portfolio');
          const portfolioSnapshot = await getDocs(portfolioRef);
          portfolioItems = portfolioSnapshot.size;
        } catch (portfolioError) {
          console.warn('Could not fetch portfolio:', portfolioError);
        }

        // Fetch services with error handling
        try {
          const servicesRef = collection(db, 'services');
          const servicesSnapshot = await getDocs(servicesRef);
          activeServices = servicesSnapshot.size;
        } catch (servicesError) {
          console.warn('Could not fetch services:', servicesError);
        }

        setStats({
          totalClients,
          totalSessions,
          totalRevenue,
          upcomingSessions,
          completedSessions,
          portfolioItems,
          activeServices,
        });
      } catch (error) {
        console.error('Error fetching admin stats:', error);
        // Fallback to default stats if there's an error
        setStats({
          totalClients: 0,
          totalSessions: 0,
          totalRevenue: 0,
          upcomingSessions: 0,
          completedSessions: 0,
          portfolioItems: 0,
          activeServices: 0,
        });
      }
    };

    fetchStats();
  }, [isAdmin]);

  if (!isAdmin) {
    return (
      <div className="min-h-screen pt-24 pb-20 bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🚫</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
          <p className="text-gray-600">You don't have permission to access the admin dashboard.</p>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: TrendingUp },
    { id: 'clients', label: 'Clients', icon: Users },
    { id: 'sessions', label: 'Sessions', icon: Calendar },
    { id: 'portfolio', label: 'Portfolio', icon: ImageIcon },
    { id: 'services', label: 'Services', icon: Briefcase },
    { id: 'about', label: 'About', icon: Settings },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return <OverviewTab stats={stats} />;
      case 'clients':
        return <ClientManagement />;
      case 'sessions':
        return <SessionManagement />;
      case 'portfolio':
        return <PortfolioEditor />;
      case 'services':
        return <ServiceEditor />;
      case 'about':
        return <AboutEditor />;
      default:
        return <OverviewTab stats={stats} />;
    }
  };

  return (
    <div className="bg-gray-50 min-h-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Header */}
        <div className="mb-8">
          <p className="text-gray-600">
            Welcome back, {userProfile?.displayName || userProfile?.email?.split('@')[0]}!
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-lg shadow-sm mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm ${
                      activeTab === tab.id
                        ? 'border-gray-900 text-gray-900'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        {renderTabContent()}
      </div>
    </div>
  );
};

const OverviewTab: React.FC<{ stats: AdminStats }> = ({ stats }) => {
  return (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Clients"
          value={stats.totalClients}
          icon={Users}
          color="blue"
        />
        <StatCard
          title="Total Revenue"
          value={`$${stats.totalRevenue.toLocaleString()}`}
          icon={DollarSign}
          color="green"
        />
        <StatCard
          title="Total Sessions"
          value={stats.totalSessions}
          icon={Calendar}
          color="purple"
        />
        <StatCard
          title="Portfolio Items"
          value={stats.portfolioItems}
          icon={Camera}
          color="orange"
        />
      </div>

      {/* Secondary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          title="Upcoming Sessions"
          value={stats.upcomingSessions}
          icon={Clock}
          color="yellow"
        />
        <StatCard
          title="Completed Sessions"
          value={stats.completedSessions}
          icon={CheckCircle}
          color="green"
        />
        <StatCard
          title="Active Services"
          value={stats.activeServices}
          icon={Briefcase}
          color="indigo"
        />
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <QuickActionButton
            title="Add Portfolio Item"
            description="Upload new photography work"
            icon={ImageIcon}
            onClick={() => {}}
          />
          <QuickActionButton
            title="Create Service"
            description="Add a new photography service"
            icon={Briefcase}
            onClick={() => {}}
          />
          <QuickActionButton
            title="View All Clients"
            description="Manage client accounts"
            icon={Users}
            onClick={() => {}}
          />
        </div>
      </div>
    </div>
  );
};

const StatCard: React.FC<{
  title: string;
  value: string | number;
  icon: React.ComponentType<any>;
  color: string;
}> = ({ title, value, icon: Icon, color }) => {
  const colorClasses = {
    blue: 'bg-blue-100 text-blue-600',
    green: 'bg-green-100 text-green-600',
    purple: 'bg-purple-100 text-purple-600',
    orange: 'bg-orange-100 text-orange-600',
    yellow: 'bg-yellow-100 text-yellow-600',
    indigo: 'bg-indigo-100 text-indigo-600',
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600 mb-1">{title}</p>
          <p className="text-3xl font-bold text-gray-900">{value}</p>
        </div>
        <div className={`p-3 rounded-full ${colorClasses[color as keyof typeof colorClasses]}`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
};

const QuickActionButton: React.FC<{
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  onClick: () => void;
}> = ({ title, description, icon: Icon, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left"
    >
      <div className="flex items-start space-x-3">
        <div className="p-2 bg-gray-100 rounded-lg">
          <Icon className="w-5 h-5 text-gray-600" />
        </div>
        <div>
          <h4 className="font-medium text-gray-900">{title}</h4>
          <p className="text-sm text-gray-600">{description}</p>
        </div>
      </div>
    </button>
  );
};

export default AdminDashboard;
