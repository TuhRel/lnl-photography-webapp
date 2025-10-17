import React, { useState, useEffect } from 'react';
import { Save } from 'lucide-react';
import { HeroContent } from '../../types';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../../config/firebase';
import ImageUpload from '../common/ImageUpload';

const HeroEditor: React.FC = () => {
  const [heroContent, setHeroContent] = useState<HeroContent>({
    id: 'hero-1',
    title: 'Capturing Moments,\nCreating Memories',
    subtitle: 'Professional photography that tells your unique story',
    backgroundImage: 'https://images.unsplash.com/photo-1452587925148-ce544e77e70d?w=1920&q=80',
    ctaText: 'View Portfolio',
    secondaryCtaText: 'Book Session'
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const loadHeroContent = async () => {
      try {
        const heroDoc = await getDoc(doc(db, 'content', 'hero'));
        if (heroDoc.exists()) {
          const data = heroDoc.data() as HeroContent;
          setHeroContent(data);
        }
        // If document doesn't exist, keep default content
      } catch (error) {
        console.error('Error loading hero content:', error);
        // Keep default content on error
      } finally {
        setLoading(false);
      }
    };

    loadHeroContent();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      await setDoc(doc(db, 'content', 'hero'), heroContent);
      alert('Hero section updated successfully!');
    } catch (error) {
      console.error('Error saving hero content:', error);
      alert('Error saving changes. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="space-y-4">
            {[...Array(6)].map((_, i) => (
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
            <h2 className="text-xl font-semibold text-gray-900">Hero Section Editor</h2>
            <p className="text-sm text-gray-600 mt-1">
              Edit your homepage hero section content and background
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

      {/* Content Editor */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-6">Hero Content</h3>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Text Content */}
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Main Title
              </label>
              <textarea
                value={heroContent.title}
                onChange={(e) => setHeroContent(prev => ({ ...prev, title: e.target.value }))}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                placeholder="Enter main hero title..."
              />
              <p className="text-xs text-gray-500 mt-1">Use \n for line breaks</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Subtitle
              </label>
              <textarea
                value={heroContent.subtitle}
                onChange={(e) => setHeroContent(prev => ({ ...prev, subtitle: e.target.value }))}
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                placeholder="Enter hero subtitle..."
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Primary Button Text
                </label>
                <input
                  type="text"
                  value={heroContent.ctaText}
                  onChange={(e) => setHeroContent(prev => ({ ...prev, ctaText: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                  placeholder="e.g., View Portfolio"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Secondary Button Text
                </label>
                <input
                  type="text"
                  value={heroContent.secondaryCtaText}
                  onChange={(e) => setHeroContent(prev => ({ ...prev, secondaryCtaText: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                  placeholder="e.g., Book Session"
                />
              </div>
            </div>
          </div>

          {/* Right Column - Background Image */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Background Image
            </label>
            
            <ImageUpload
              currentImageUrl={heroContent.backgroundImage}
              onImageChange={(url) => setHeroContent(prev => ({ ...prev, backgroundImage: url }))}
              folder="hero"
              aspectRatio="video"
              placeholder="Upload hero background image"
              className="w-full"
            />
            
            <p className="text-xs text-gray-500 mt-2">
              Recommended: High-resolution image (1920x1080 or larger)
            </p>
          </div>
        </div>
      </div>

      {/* Preview */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Preview</h3>
        
        <div className="relative h-64 rounded-lg overflow-hidden">
          <div 
            className="absolute inset-0 z-0"
            style={{
              backgroundImage: `url(${heroContent.backgroundImage})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          >
            <div className="absolute inset-0 bg-black/40"></div>
          </div>
          
          <div className="relative z-10 h-full flex items-center justify-center text-center text-white px-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold mb-2 leading-tight">
                {heroContent.title.split('\n').map((line, index) => (
                  <React.Fragment key={index}>
                    {line}
                    {index < heroContent.title.split('\n').length - 1 && <br />}
                  </React.Fragment>
                ))}
              </h1>
              <p className="text-sm md:text-base mb-4 text-gray-200 font-light">
                {heroContent.subtitle}
              </p>
              <div className="flex flex-col sm:flex-row gap-2 justify-center">
                <button className="px-4 py-2 bg-white text-gray-900 rounded text-sm font-medium">
                  {heroContent.ctaText}
                </button>
                <button className="px-4 py-2 border border-white text-white rounded text-sm font-medium">
                  {heroContent.secondaryCtaText}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroEditor;
