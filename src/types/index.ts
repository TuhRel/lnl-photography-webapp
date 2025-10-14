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
}

export interface ClientSession {
  id: string;
  userId: string;
  serviceId: string;
  serviceName: string;
  date: string;
  price: number;
  photos: string[];
  status: 'completed' | 'upcoming' | 'processing';
}
