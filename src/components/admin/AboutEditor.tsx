import React, { useState, useEffect } from 'react';
import { 
  Save, 
  Plus, 
  Minus, 
  Heart, 
  Eye, 
  Zap,
  Upload
} from 'lucide-react';
import { AboutContent } from '../../types';

const AboutEditor: React.FC = () => {
  const [aboutContent, setAboutContent] = useState<AboutContent>({
    id: 'about-1',
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
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    // Simulate loading from database
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  const handleSave = async () => {
    setSaving(true);
    // Simulate saving to database
    setTimeout(() => {
      setSaving(false);
      alert('About section updated successfully!');
    }, 1500);
  };

  const addBioParagraph = () => {
    setAboutContent(prev => ({
      ...prev,
      bio: [...prev.bio, '']
    }));
  };

  const removeBioParagraph = (index: number) => {
    setAboutContent(prev => ({
      ...prev,
      bio: prev.bio.filter((_, i) => i !== index)
    }));
  };

  const updateBioParagraph = (index: number, value: string) => {
    setAboutContent(prev => ({
      ...prev,
      bio: prev.bio.map((paragraph, i) => i === index ? value : paragraph)
    }));
  };

  const addEducation = () => {
    setAboutContent(prev => ({
      ...prev,
      credentials: {
        ...prev.credentials,
        education: [...prev.credentials.education, '']
      }
    }));
  };

  const removeEducation = (index: number) => {
    setAboutContent(prev => ({
      ...prev,
      credentials: {
        ...prev.credentials,
        education: prev.credentials.education.filter((_, i) => i !== index)
      }
    }));
  };

  const updateEducation = (index: number, value: string) => {
    setAboutContent(prev => ({
      ...prev,
      credentials: {
        ...prev.credentials,
        education: prev.credentials.education.map((item, i) => i === index ? value : item)
      }
    }));
  };

  const addRecognition = () => {
    setAboutContent(prev => ({
      ...prev,
      credentials: {
        ...prev.credentials,
        recognition: [...prev.credentials.recognition, '']
      }
    }));
  };

  const removeRecognition = (index: number) => {
    setAboutContent(prev => ({
      ...prev,
      credentials: {
        ...prev.credentials,
        recognition: prev.credentials.recognition.filter((_, i) => i !== index)
      }
    }));
  };

  const updateRecognition = (index: number, value: string) => {
    setAboutContent(prev => ({
      ...prev,
      credentials: {
        ...prev.credentials,
        recognition: prev.credentials.recognition.map((item, i) => i === index ? value : item)
      }
    }));
  };

  const updateValue = (index: number, field: 'title' | 'description', value: string) => {
    setAboutContent(prev => ({
      ...prev,
      values: prev.values.map((val, i) => 
        i === index ? { ...val, [field]: value } : val
      )
    }));
  };

  const getIconComponent = (iconName: string) => {
    switch (iconName) {
      case 'Heart':
        return Heart;
      case 'Eye':
        return Eye;
      case 'Zap':
        return Zap;
      default:
        return Heart;
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="space-y-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="h-4 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">About Section Editor</h2>
            <p className="text-sm text-gray-600 mt-1">
              Edit your about page content and personal information
            </p>
          </div>
          <button
            onClick={handleSave}
            disabled={saving}
            className="mt-4 sm:mt-0 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors flex items-center space-x-2 disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Saving...' : 'Save Changes'}</span>
          </button>
        </div>
      </div>

      {/* Basic Information */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Basic Information</h3>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Section Title
              </label>
              <input
                type="text"
                value={aboutContent.subtitle}
                onChange={(e) => setAboutContent(prev => ({ ...prev, subtitle: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Main Heading
              </label>
              <input
                type="text"
                value={aboutContent.title}
                onChange={(e) => setAboutContent(prev => ({ ...prev, title: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Profile Image
            </label>
            <div className="aspect-square w-48 rounded-lg overflow-hidden bg-gray-100 border-2 border-dashed border-gray-300 mb-3">
              {aboutContent.image ? (
                <img
                  src={aboutContent.image}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center">
                  <Upload className="w-8 h-8 text-gray-400 mb-2" />
                  <p className="text-sm text-gray-500">Upload Image</p>
                </div>
              )}
            </div>
            <input
              type="url"
              value={aboutContent.image}
              onChange={(e) => setAboutContent(prev => ({ ...prev, image: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
              placeholder="https://example.com/image.jpg"
            />
          </div>
        </div>
      </div>

      {/* Biography */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900">Biography</h3>
          <button
            onClick={addBioParagraph}
            className="text-sm text-gray-900 hover:text-gray-700 flex items-center space-x-1"
          >
            <Plus className="w-4 h-4" />
            <span>Add Paragraph</span>
          </button>
        </div>

        <div className="space-y-4">
          {aboutContent.bio.map((paragraph, index) => (
            <div key={index} className="flex space-x-3">
              <textarea
                value={paragraph}
                onChange={(e) => updateBioParagraph(index, e.target.value)}
                rows={3}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                placeholder="Enter biography paragraph..."
              />
              {aboutContent.bio.length > 1 && (
                <button
                  onClick={() => removeBioParagraph(index)}
                  className="p-2 text-red-600 hover:text-red-800"
                >
                  <Minus className="w-4 h-4" />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Core Values */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Core Values</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {aboutContent.values.map((value, index) => {
            const IconComponent = getIconComponent(value.icon);
            return (
              <div key={index} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center mb-3">
                  <div className="p-2 bg-gray-100 rounded-lg mr-3">
                    <IconComponent className="w-5 h-5 text-gray-600" />
                  </div>
                  <input
                    type="text"
                    value={value.title}
                    onChange={(e) => updateValue(index, 'title', e.target.value)}
                    className="flex-1 px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-gray-900 focus:border-transparent text-sm font-medium"
                  />
                </div>
                <textarea
                  value={value.description}
                  onChange={(e) => updateValue(index, 'description', e.target.value)}
                  rows={3}
                  className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-gray-900 focus:border-transparent text-sm"
                  placeholder="Value description..."
                />
              </div>
            );
          })}
        </div>
      </div>

      {/* Credentials */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Credentials & Experience</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Education */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-md font-medium text-gray-900">Education</h4>
              <button
                onClick={addEducation}
                className="text-sm text-gray-900 hover:text-gray-700 flex items-center space-x-1"
              >
                <Plus className="w-4 h-4" />
                <span>Add</span>
              </button>
            </div>
            <div className="space-y-2">
              {aboutContent.credentials.education.map((item, index) => (
                <div key={index} className="flex space-x-2">
                  <input
                    type="text"
                    value={item}
                    onChange={(e) => updateEducation(index, e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent text-sm"
                    placeholder="Education item..."
                  />
                  {aboutContent.credentials.education.length > 1 && (
                    <button
                      onClick={() => removeEducation(index)}
                      className="p-2 text-red-600 hover:text-red-800"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Recognition */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-md font-medium text-gray-900">Recognition</h4>
              <button
                onClick={addRecognition}
                className="text-sm text-gray-900 hover:text-gray-700 flex items-center space-x-1"
              >
                <Plus className="w-4 h-4" />
                <span>Add</span>
              </button>
            </div>
            <div className="space-y-2">
              {aboutContent.credentials.recognition.map((item, index) => (
                <div key={index} className="flex space-x-2">
                  <input
                    type="text"
                    value={item}
                    onChange={(e) => updateRecognition(index, e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent text-sm"
                    placeholder="Recognition item..."
                  />
                  {aboutContent.credentials.recognition.length > 1 && (
                    <button
                      onClick={() => removeRecognition(index)}
                      className="p-2 text-red-600 hover:text-red-800"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutEditor;
