import React from 'react';
import { Check, Clock, DollarSign } from 'lucide-react';
import { services } from '../../data/mockData';
import { createCheckoutSession } from '../../config/stripe';
import { useAuth } from '../../contexts/AuthContext';

interface ServicesProps {
  onAuthClick: () => void;
}

const Services: React.FC<ServicesProps> = ({ onAuthClick }) => {
  const { currentUser } = useAuth();

  const handleBooking = async (serviceId: string, price: number, serviceName: string) => {
    if (!currentUser) {
      alert('Please sign in to book a service');
      onAuthClick();
      return;
    }

    try {
      await createCheckoutSession(serviceId, price, serviceName);
    } catch (error) {
      console.error('Booking error:', error);
      alert('There was an error processing your booking. Please try again.');
    }
  };

  return (
    <section id="services" className="min-h-screen pt-24 pb-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Services</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Professional photography services tailored to your needs
          </p>
          <div className="w-20 h-1 bg-gray-900 mx-auto mt-6"></div>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service) => (
            <div
              key={service.id}
              className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
            >
              {/* Service Image */}
              <div className="relative h-64 overflow-hidden">
                <img
                  src={service.image}
                  alt={service.title}
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                />
                <div className="absolute top-4 right-4 bg-white px-4 py-2 rounded-full shadow-lg">
                  <div className="flex items-center space-x-1">
                    <DollarSign className="w-4 h-4 text-gray-900" />
                    <span className="font-bold text-gray-900">{service.price}</span>
                  </div>
                </div>
              </div>

              {/* Service Details */}
              <div className="p-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{service.title}</h3>
                
                <div className="flex items-center text-gray-600 mb-4">
                  <Clock className="w-4 h-4 mr-2" />
                  <span className="text-sm">{service.duration}</span>
                </div>

                <p className="text-gray-600 mb-6 leading-relaxed">
                  {service.description}
                </p>

                {/* Features */}
                <div className="space-y-2 mb-6">
                  {service.features.map((feature, idx) => (
                    <div key={idx} className="flex items-start">
                      <Check className="w-5 h-5 text-green-600 mr-2 flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-gray-600">{feature}</span>
                    </div>
                  ))}
                </div>

                {/* Book Button */}
                <button
                  onClick={() => handleBooking(service.id, service.price, service.title)}
                  className="w-full py-3 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 transition-colors"
                >
                  Book Now
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Additional Info */}
        <div className="mt-16 bg-white rounded-lg p-8 shadow-lg">
          <h3 className="text-2xl font-bold text-gray-900 mb-4 text-center">
            What's Included in Every Session
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <div className="text-center">
              <div className="text-4xl mb-2">📸</div>
              <h4 className="font-semibold text-gray-900 mb-2">Professional Equipment</h4>
              <p className="text-sm text-gray-600">
                High-end cameras and lighting for stunning results
              </p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-2">✨</div>
              <h4 className="font-semibold text-gray-900 mb-2">Expert Editing</h4>
              <p className="text-sm text-gray-600">
                Professional retouching and color grading included
              </p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-2">☁️</div>
              <h4 className="font-semibold text-gray-900 mb-2">Online Gallery</h4>
              <p className="text-sm text-gray-600">
                Secure online access to download your photos
              </p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-12 text-center">
          <p className="text-gray-600 mb-4">
            Not sure which service is right for you?
          </p>
          <button className="px-8 py-3 bg-white text-gray-900 border-2 border-gray-900 rounded-lg font-medium hover:bg-gray-900 hover:text-white transition-colors">
            Contact for Custom Quote
          </button>
        </div>
      </div>
    </section>
  );
};

export default Services;
