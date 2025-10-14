import React from 'react';
import { Heart, Eye, Zap } from 'lucide-react';

const About: React.FC = () => {
  return (
    <section id="about" className="min-h-screen pt-24 pb-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">About Me</h2>
          <div className="w-20 h-1 bg-gray-900 mx-auto"></div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
          <div className="relative">
            <img
              src="https://images.unsplash.com/photo-1554048612-b6a482bc67e5?w=800&q=80"
              alt="Photographer"
              className="rounded-lg shadow-2xl w-full h-[600px] object-cover"
            />
            <div className="absolute -bottom-6 -right-6 w-48 h-48 bg-gray-900 rounded-lg -z-10"></div>
          </div>

          <div className="space-y-6">
            <h3 className="text-3xl font-bold text-gray-900">
              Turning Fleeting Moments Into Timeless Art
            </h3>
            <p className="text-lg text-gray-600 leading-relaxed">
              With over 10 years of experience in photography, I specialize in capturing the 
              authentic emotions and unique stories that make each moment special. My approach 
              combines technical expertise with a keen artistic eye to create images that 
              resonate deeply with my clients.
            </p>
            <p className="text-lg text-gray-600 leading-relaxed">
              Whether it's a intimate family gathering, a professional branding session, or 
              your special day, I believe every photograph should tell a story. My goal is 
              not just to take pictures, but to create lasting memories that you'll treasure 
              for generations.
            </p>
            <p className="text-lg text-gray-600 leading-relaxed">
              Based in the heart of the city, I work with clients locally and internationally, 
              bringing creativity, professionalism, and passion to every project.
            </p>
          </div>
        </div>

        {/* Values */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center p-8 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
            <div className="flex justify-center mb-4">
              <div className="p-4 bg-gray-900 rounded-full">
                <Heart className="w-8 h-8 text-white" />
              </div>
            </div>
            <h4 className="text-xl font-bold text-gray-900 mb-3">Passion</h4>
            <p className="text-gray-600">
              Every project is approached with genuine enthusiasm and dedication to 
              capturing your unique story.
            </p>
          </div>

          <div className="text-center p-8 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
            <div className="flex justify-center mb-4">
              <div className="p-4 bg-gray-900 rounded-full">
                <Eye className="w-8 h-8 text-white" />
              </div>
            </div>
            <h4 className="text-xl font-bold text-gray-900 mb-3">Vision</h4>
            <p className="text-gray-600">
              A creative eye for detail and composition that transforms ordinary 
              moments into extraordinary images.
            </p>
          </div>

          <div className="text-center p-8 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
            <div className="flex justify-center mb-4">
              <div className="p-4 bg-gray-900 rounded-full">
                <Zap className="w-8 h-8 text-white" />
              </div>
            </div>
            <h4 className="text-xl font-bold text-gray-900 mb-3">Excellence</h4>
            <p className="text-gray-600">
              Committed to delivering the highest quality work with meticulous 
              attention to every detail.
            </p>
          </div>
        </div>

        {/* Credentials */}
        <div className="mt-20 bg-gray-900 rounded-lg p-12 text-white">
          <h3 className="text-3xl font-bold mb-8 text-center">Credentials & Experience</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h4 className="text-xl font-semibold mb-4">Education</h4>
              <ul className="space-y-2 text-gray-300">
                <li>• Bachelor of Fine Arts in Photography</li>
                <li>• Advanced Portrait Photography Certification</li>
                <li>• Commercial Photography Workshop Graduate</li>
              </ul>
            </div>
            <div>
              <h4 className="text-xl font-semibold mb-4">Recognition</h4>
              <ul className="space-y-2 text-gray-300">
                <li>• International Photography Awards Winner</li>
                <li>• Featured in Photography Magazine</li>
                <li>• Top 10 Local Photographer 2023</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
