import React, { useState, useEffect } from 'react';
import { Heart, Eye, Zap } from 'lucide-react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { AboutContent } from '../../types';

const About: React.FC = () => {
  const [aboutContent, setAboutContent] = useState<AboutContent | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAboutContent = async () => {
      try {
        const aboutDoc = await getDoc(doc(db, 'content', 'about'));
        if (aboutDoc.exists()) {
          setAboutContent(aboutDoc.data() as AboutContent);
        }
      } catch (error) {
        console.error('Error loading about content:', error);
      } finally {
        setLoading(false);
      }
    };

    loadAboutContent();
  }, []);

  // Default content fallback
  const defaultContent: AboutContent = {
    id: 'about-default',
    title: 'Turning Fleeting Moments Into Timeless Art',
    subtitle: 'About Me',
    bio: [
      'With over 10 years of experience in photography, I specialize in capturing the authentic emotions and unique stories that make each moment special. My approach combines technical expertise with a keen artistic eye to create images that resonate deeply with my clients.',
      'Whether it\'s a intimate family gathering, a professional branding session, or your special day, I believe every photograph should tell a story. My goal is not just to take pictures, but to create lasting memories that you\'ll treasure for generations.',
      'Based in the heart of the city, I work with clients locally and internationally, bringing creativity, professionalism, and passion to every project.'
    ],
    image: 'https://images.unsplash.com/photo-1554048612-b6a482bc67e5?w=800&q=80',
    credentials: {
      education: [
        'Bachelor of Fine Arts in Photography',
        'Advanced Portrait Photography Certification',
        'Commercial Photography Workshop Graduate'
      ],
      recognition: [
        'International Photography Awards Winner',
        'Featured in Photography Magazine',
        'Top 10 Local Photographer 2023'
      ]
    },
    values: [
      {
        title: 'Passion',
        description: 'Every project is approached with genuine enthusiasm and dedication to capturing your unique story.',
        icon: 'Heart'
      },
      {
        title: 'Vision',
        description: 'A creative eye for detail and composition that transforms ordinary moments into extraordinary images.',
        icon: 'Eye'
      },
      {
        title: 'Excellence',
        description: 'Committed to delivering the highest quality work with meticulous attention to every detail.',
        icon: 'Zap'
      }
    ]
  };

  const content = aboutContent || defaultContent;

  const getIconComponent = (iconName: string) => {
    switch (iconName) {
      case 'Heart': return Heart;
      case 'Eye': return Eye;
      case 'Zap': return Zap;
      default: return Heart;
    }
  };

  if (loading) {
    return (
      <section id="about" className="min-h-screen pt-24 pb-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse space-y-8">
            <div className="text-center mb-16">
              <div className="h-12 bg-gray-200 rounded w-1/3 mx-auto mb-4"></div>
              <div className="w-20 h-1 bg-gray-200 mx-auto"></div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div className="h-96 bg-gray-200 rounded-lg"></div>
              <div className="space-y-4">
                <div className="h-8 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="about" className="min-h-screen pt-24 pb-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">{content.subtitle}</h2>
          <div className="w-20 h-1 bg-gray-900 mx-auto"></div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
          <div className="relative">
            <img
              src={content.image}
              alt="Photographer"
              className="rounded-lg shadow-2xl w-full h-[600px] object-cover"
            />
            <div className="absolute -bottom-6 -right-6 w-48 h-48 bg-gray-900 rounded-lg -z-10"></div>
          </div>

          <div className="space-y-6">
            <h3 className="text-3xl font-bold text-gray-900">
              {content.title}
            </h3>
            {content.bio.map((paragraph, index) => (
              <p key={index} className="text-lg text-gray-600 leading-relaxed">
                {paragraph}
              </p>
            ))}
          </div>
        </div>

        {/* Values */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {content.values.map((value, index) => {
            const IconComponent = getIconComponent(value.icon);
            return (
              <div key={index} className="text-center p-8 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                <div className="flex justify-center mb-4">
                  <div className="p-4 bg-gray-900 rounded-full">
                    <IconComponent className="w-8 h-8 text-white" />
                  </div>
                </div>
                <h4 className="text-xl font-bold text-gray-900 mb-3">{value.title}</h4>
                <p className="text-gray-600">
                  {value.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* Credentials */}
        <div className="mt-20 bg-gray-900 rounded-lg p-12 text-white">
          <h3 className="text-3xl font-bold mb-8 text-center">Credentials & Experience</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h4 className="text-xl font-semibold mb-4">Education</h4>
              <ul className="space-y-2 text-gray-300">
                {content.credentials.education.map((item, index) => (
                  <li key={index}>• {item}</li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-xl font-semibold mb-4">Recognition</h4>
              <ul className="space-y-2 text-gray-300">
                {content.credentials.recognition.map((item, index) => (
                  <li key={index}>• {item}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
