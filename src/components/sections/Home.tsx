import React from 'react';
import { ArrowRight, Camera, Award, Users } from 'lucide-react';

interface HomeProps {
  onNavigate: (section: string) => void;
}

const Home: React.FC<HomeProps> = ({ onNavigate }) => {
  return (
    <section id="home" className="min-h-screen pt-16">
      {/* Hero Section */}
      <div className="relative h-[90vh] flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1452587925148-ce544e77e70d?w=1920&q=80)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <div className="absolute inset-0 bg-black/40"></div>
        </div>
        
        <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            Capturing Moments,<br />Creating Memories
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-gray-200 font-light">
            Professional photography that tells your unique story
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => onNavigate('portfolio')}
              className="px-8 py-4 bg-white text-gray-900 rounded-lg font-medium hover:bg-gray-100 transition-all transform hover:scale-105 flex items-center justify-center space-x-2"
            >
              <span>View Portfolio</span>
              <ArrowRight className="w-5 h-5" />
            </button>
            <button
              onClick={() => onNavigate('services')}
              className="px-8 py-4 bg-transparent border-2 border-white text-white rounded-lg font-medium hover:bg-white hover:text-gray-900 transition-all transform hover:scale-105"
            >
              Book a Session
            </button>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <div className="p-4 bg-gray-900 rounded-full">
                  <Camera className="w-8 h-8 text-white" />
                </div>
              </div>
              <h3 className="text-4xl font-bold text-gray-900 mb-2">500+</h3>
              <p className="text-gray-600">Sessions Completed</p>
            </div>
            
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <div className="p-4 bg-gray-900 rounded-full">
                  <Users className="w-8 h-8 text-white" />
                </div>
              </div>
              <h3 className="text-4xl font-bold text-gray-900 mb-2">300+</h3>
              <p className="text-gray-600">Happy Clients</p>
            </div>
            
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <div className="p-4 bg-gray-900 rounded-full">
                  <Award className="w-8 h-8 text-white" />
                </div>
              </div>
              <h3 className="text-4xl font-bold text-gray-900 mb-2">15+</h3>
              <p className="text-gray-600">Awards Won</p>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Work Preview */}
      <div className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Featured Work</h2>
            <p className="text-xl text-gray-600">A glimpse into recent projects</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=800&q=80',
              'https://images.unsplash.com/photo-1511895426328-dc8714191300?w=800&q=80',
              'https://images.unsplash.com/photo-1606800052052-a08af7148866?w=800&q=80'
            ].map((img, idx) => (
              <div 
                key={idx}
                className="relative h-80 rounded-lg overflow-hidden group cursor-pointer"
                onClick={() => onNavigate('portfolio')}
              >
                <img 
                  src={img} 
                  alt={`Featured ${idx + 1}`}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-300"></div>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <button
              onClick={() => onNavigate('portfolio')}
              className="px-8 py-3 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 transition-colors inline-flex items-center space-x-2"
            >
              <span>View Full Portfolio</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Home;
