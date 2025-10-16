import { collection, addDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { ClientSession, User } from '../types';

// Sample users data
const sampleUsers: Omit<User, 'id'>[] = [
  {
    email: 'john.doe@email.com',
    displayName: 'John Doe',
    role: 'client',
    createdAt: '2024-01-15T10:30:00Z',
    lastLogin: '2024-10-15T14:20:00Z',
  },
  {
    email: 'sarah.smith@email.com',
    displayName: 'Sarah Smith',
    role: 'client',
    createdAt: '2024-02-20T09:15:00Z',
    lastLogin: '2024-10-14T16:45:00Z',
  },
  {
    email: 'mike.johnson@email.com',
    displayName: 'Mike Johnson',
    role: 'client',
    createdAt: '2024-03-10T11:20:00Z',
    lastLogin: '2024-10-13T10:30:00Z',
  },
];

// Sample sessions data (matching your Stripe schema)
const sampleSessions: Omit<ClientSession, 'id'>[] = [
  {
    userId: 'user-1',
    serviceId: 'family-session',
    serviceName: 'Family Session',
    date: '2024-10-20',
    amount: 34900, // $349.00 in cents
    status: 'upcoming',
    photos: [],
    stripeSessionId: 'cs_test_a1BYShUahHHg3bB1C11nnF4cKC4wXDXc1D558tcUfWsV16wF81gkVz5Qmu',
    createdAt: new Date('2024-10-14T20:11:21.000Z')
  },
  {
    userId: 'user-2',
    serviceId: 'branding-session',
    serviceName: 'Branding Session',
    date: '2024-10-15',
    amount: 39900, // $399.00 in cents
    status: 'completed',
    photos: [
      'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&q=80',
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80'
    ],
    stripeSessionId: 'cs_test_b2CZTiVbiIIh4cC2D22ooG5dLD5xYEYd2E669udVgXtW27xG92hlWa6Rnv',
    createdAt: new Date('2024-10-13T18:30:15.000Z')
  },
  {
    userId: 'user-3',
    serviceId: 'wedding-session',
    serviceName: 'Wedding Photography',
    date: '2024-10-18',
    amount: 249900, // $2499.00 in cents
    status: 'processing',
    photos: [
      'https://images.unsplash.com/photo-1606800052052-a08af7148866?w=800&q=80'
    ],
    stripeSessionId: 'cs_test_c3DaUjWcjJJi5dD3E33ppH6eNE6yZFZe3F770veWhYuX38yH03imXb7Sow',
    createdAt: new Date('2024-10-16T14:45:30.000Z')
  },
  {
    userId: 'user-4',
    serviceId: 'portrait-session',
    serviceName: 'Portrait Session',
    date: '2024-10-12',
    amount: 24900, // $249.00 in cents
    status: 'completed',
    photos: [
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=800&q=80',
      'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=800&q=80'
    ],
    stripeSessionId: 'cs_test_d4EbVkXdkKKj6eE4F44qqI7fOF7zAGAf4G881wfXiZvY49zI14jnYc8Tpx',
    createdAt: new Date('2024-10-10T12:20:45.000Z')
  },
  {
    userId: 'user-5',
    serviceId: 'studio-session',
    serviceName: 'Studio Session',
    date: '2024-10-25',
    amount: 29900, // $299.00 in cents
    status: 'upcoming',
    photos: [],
    stripeSessionId: 'cs_test_e5FcWlYelLLk7fF5G55rrJ8gPG8aAHBg5H992xgYjAwZ50aJ25koZd9Uqy',
    createdAt: new Date('2024-10-15T16:55:12.000Z')
  }
];

export const populateSampleData = async () => {
  try {
    console.log('🌱 Populating sample data...');

    // Add sample users
    console.log('👥 Adding sample users...');
    for (const user of sampleUsers) {
      await addDoc(collection(db, 'users'), user);
    }

    // Add sample sessions
    console.log('📅 Adding sample sessions...');
    for (const session of sampleSessions) {
      await addDoc(collection(db, 'sessions'), session);
    }

    console.log('✅ Sample data populated successfully!');
  } catch (error) {
    console.error('❌ Error populating sample data:', error);
  }
};

// Function to clear all data (use with caution!)
export const clearAllData = async () => {
  try {
    console.log('🗑️ This function would clear all data. Implement with caution.');
    // Implementation would require additional Firestore operations
  } catch (error) {
    console.error('❌ Error clearing data:', error);
  }
};

// You can call this function from the browser console to populate data:
// import { populateSampleData } from './src/utils/populateSampleData';
// populateSampleData();
