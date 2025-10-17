import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { PortfolioItem } from '../../types';

const Portfolio: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [portfolioItems, setPortfolioItems] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState(true);

  const categories = ['All', 'Portrait', 'Family', 'Wedding', 'Branding', 'Creative', 'Studio'];

  useEffect(() => {
    const loadPortfolioItems = async () => {
      try {
        const portfolioCollection = collection(db, 'portfolio');
        const portfolioSnapshot = await getDocs(portfolioCollection);
        const items: PortfolioItem[] = [];
        
        portfolioSnapshot.forEach((doc) => {
          const data = doc.data();
          items.push({
            id: doc.id,
            title: data.title || '',
            category: data.category || '',
            image: data.image || '',
            images: data.images || []
          });
        });
        
        setPortfolioItems(items);
      } catch (error) {
        console.error('Error loading portfolio items:', error);
      } finally {
        setLoading(false);
      }
    };

    loadPortfolioItems();
  }, []);

  const filteredItems = selectedCategory === 'All'
    ? portfolioItems
    : portfolioItems.filter(item => item.category === selectedCategory);

  if (loading) {
    return (
      <section id="portfolio" className="min-h-screen pt-24 pb-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Portfolio</h2>
            <div className="w-20 h-1 bg-gray-900 mx-auto mt-6"></div>
          </div>
          <div className="animate-pulse grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="aspect-square bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="portfolio" className="min-h-screen pt-24 pb-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Portfolio</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Explore my recent work and creative projects
          </p>
          <div className="w-20 h-1 bg-gray-900 mx-auto mt-6"></div>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-6 py-2 rounded-full font-medium transition-all ${
                selectedCategory === category
                  ? 'bg-gray-900 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Portfolio Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="group relative aspect-square overflow-hidden rounded-lg cursor-pointer"
              onClick={() => setSelectedImage(item.image)}
            >
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              
              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h3 className="text-white text-xl font-bold mb-1">{item.title}</h3>
                  <p className="text-gray-300 text-sm">{item.category}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredItems.length === 0 && (
          <div className="text-center py-20">
            <p className="text-gray-500 text-lg">No items found in this category.</p>
          </div>
        )}
      </div>

      {/* Lightbox Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <button
            className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
            onClick={() => setSelectedImage(null)}
          >
            <X className="w-6 h-6 text-white" />
          </button>
          
          <img
            src={selectedImage}
            alt="Full size"
            className="max-w-full max-h-full object-contain"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </section>
  );
};

export default Portfolio;
