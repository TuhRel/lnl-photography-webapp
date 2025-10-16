import { Service, PortfolioItem, ClientSession } from '../types';

export const services: Service[] = [
  {
    id: 'studio-session',
    title: 'Studio Session',
    description: 'Professional studio photography with controlled lighting and backdrops',
    price: 299,
    duration: '2 hours',
    features: [
      'Professional studio setup',
      '50+ edited photos',
      'Multiple backdrop options',
      'Wardrobe changes included',
      'Online gallery access'
    ],
    image: 'https://images.unsplash.com/photo-1554048612-b6a482bc67e5?w=800&q=80'
  },
  {
    id: 'family-session',
    title: 'Family Session',
    description: 'Capture beautiful moments with your loved ones in natural settings',
    price: 349,
    duration: '3 hours',
    features: [
      'Outdoor or indoor location',
      '75+ edited photos',
      'Extended family welcome',
      'Props and styling advice',
      'Print-ready files'
    ],
    image: 'https://images.unsplash.com/photo-1511895426328-dc8714191300?w=800&q=80'
  },
  {
    id: 'creative-session',
    title: 'Creative Session',
    description: 'Artistic and conceptual photography for unique visions',
    price: 449,
    duration: '4 hours',
    features: [
      'Custom concept development',
      '100+ edited photos',
      'Advanced editing & retouching',
      'Creative direction included',
      'Commercial usage rights'
    ],
    image: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=800&q=80'
  },
  {
    id: 'branding-session',
    title: 'Branding Session',
    description: 'Professional headshots and brand photography for businesses',
    price: 399,
    duration: '3 hours',
    features: [
      'Multiple outfit changes',
      '60+ edited photos',
      'Brand consultation',
      'Social media optimized',
      'Commercial license included'
    ],
    image: 'https://images.unsplash.com/photo-1556761175-b413da4baf72?w=800&q=80'
  },
  {
    id: 'wedding-session',
    title: 'Wedding Photography',
    description: 'Full-day wedding coverage capturing every special moment',
    price: 2499,
    duration: '8 hours',
    features: [
      'Full day coverage',
      '500+ edited photos',
      'Second photographer included',
      'Engagement session included',
      'Custom wedding album'
    ],
    image: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=800&q=80'
  },
  {
    id: 'portrait-session',
    title: 'Portrait Session',
    description: 'Individual portrait photography for any occasion',
    price: 249,
    duration: '1.5 hours',
    features: [
      'Indoor or outdoor setting',
      '30+ edited photos',
      'Professional retouching',
      'Styling consultation',
      'Digital download included'
    ],
    image: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=800&q=80'
  }
];

export const portfolioItems: PortfolioItem[] = [
  {
    id: '1',
    title: 'Urban Elegance',
    category: 'Portrait',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=800&q=80'
  },
  {
    id: '2',
    title: 'Golden Hour Family',
    category: 'Family',
    image: 'https://images.unsplash.com/photo-1511895426328-dc8714191300?w=800&q=80'
  },
  {
    id: '3',
    title: 'Corporate Confidence',
    category: 'Branding',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&q=80'
  },
  {
    id: '4',
    title: 'Artistic Vision',
    category: 'Creative',
    image: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800&q=80'
  },
  {
    id: '5',
    title: 'Studio Glamour',
    category: 'Studio',
    image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&q=80'
  },
  {
    id: '6',
    title: 'Eternal Love',
    category: 'Wedding',
    image: 'https://images.unsplash.com/photo-1606800052052-a08af7148866?w=800&q=80'
  },
  {
    id: '7',
    title: 'Natural Beauty',
    category: 'Portrait',
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&q=80'
  },
  {
    id: '8',
    title: 'Professional Edge',
    category: 'Branding',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80'
  },
  {
    id: '9',
    title: 'Joyful Moments',
    category: 'Family',
    image: 'https://images.unsplash.com/photo-1609220136736-443140cffec6?w=800&q=80'
  },
  {
    id: '10',
    title: 'Fashion Forward',
    category: 'Creative',
    image: 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=800&q=80'
  },
  {
    id: '11',
    title: 'Timeless Romance',
    category: 'Wedding',
    image: 'https://images.unsplash.com/photo-1591604466107-ec97de577aff?w=800&q=80'
  },
  {
    id: '12',
    title: 'Studio Perfection',
    category: 'Studio',
    image: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=800&q=80'
  }
];

export const mockClientSessions: ClientSession[] = [
  {
    id: 'session-1',
    userId: 'user123',
    serviceId: 'family-session',
    serviceName: 'Family Session',
    date: '2024-01-15',
    amount: 34900, // $349.00 in cents
    status: 'completed',
    photos: [
      'https://images.unsplash.com/photo-1511895426328-dc8714191300?w=800&q=80',
      'https://images.unsplash.com/photo-1609220136736-443140cffec6?w=800&q=80',
      'https://images.unsplash.com/photo-1475503572774-15a45e5d60b9?w=800&q=80'
    ],
    stripeSessionId: 'cs_test_mock1',
    createdAt: new Date('2024-01-15T10:00:00Z')
  },
  {
    id: 'session-2',
    userId: 'user123',
    serviceId: 'branding-session',
    serviceName: 'Branding Session',
    date: '2023-11-20',
    amount: 39900, // $399.00 in cents
    status: 'completed',
    photos: [
      'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&q=80',
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80'
    ],
    stripeSessionId: 'cs_test_mock2',
    createdAt: new Date('2023-11-20T14:30:00Z')
  }
];
