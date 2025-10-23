export interface Service {
  id: string;
  title: string;
  description: string;
  price: number;
  duration: string;
  features: string[];
  image: string;
}

export interface PortfolioItem {
  id: string;
  title: string;
  category: string;
  image: string;
  images?: string[];
  featured?: boolean;
}

export interface ClientSession {
  id: string;
  userId?: string;
  serviceId: string;
  serviceName: string;
  date: string;
  amount: number;
  status: 'upcoming' | 'processing' | 'completed';
  photos: string[];
  stripeSessionId: string;
  createdAt: any;
}

export interface User {
  id: string;
  email: string;
  displayName?: string;
  role: 'client' | 'admin';
  createdAt: string;
  lastLogin?: string;
}

export interface AdminStats {
  totalClients: number;
  totalSessions: number;
  totalRevenue: number;
  upcomingSessions: number;
  completedSessions: number;
  portfolioItems: number;
  activeServices: number;
}

export interface AboutContent {
  id: string;
  title: string;
  subtitle: string;
  bio: string[];
  image: string;
  credentials: {
    education: string[];
    recognition: string[];
  };
  values: {
    title: string;
    description: string;
    icon: string;
  }[];
}

export interface HeroContent {
  id: string;
  title: string;
  subtitle: string;
  backgroundImage: string;
  ctaText: string;
  secondaryCtaText: string;
}
