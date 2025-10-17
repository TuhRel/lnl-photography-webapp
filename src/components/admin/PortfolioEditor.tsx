import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Image as ImageIcon, 
  Search,
  Filter,
  Save,
  X
} from 'lucide-react';
import { PortfolioItem } from '../../types';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../../config/firebase';
import ImageUpload from '../common/ImageUpload';

const PortfolioEditor: React.FC = () => {
  const [portfolioItems, setPortfolioItems] = useState<PortfolioItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [isEditing, setIsEditing] = useState(false);
  const [editingItem, setEditingItem] = useState<PortfolioItem | null>(null);
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

  const filteredItems = portfolioItems.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || 
                           item.category.toLowerCase() === filterCategory.toLowerCase();
    return matchesSearch && matchesCategory;
  });

  const handleAddItem = () => {
    const newItem: PortfolioItem = {
      id: `portfolio-${Date.now()}`,
      title: '',
      category: 'Portrait',
      image: '',
    };
    setEditingItem(newItem);
    setIsEditing(true);
  };

  const handleEditItem = (item: PortfolioItem) => {
    setEditingItem({ ...item });
    setIsEditing(true);
  };

  const handleSaveItem = async () => {
    if (!editingItem) return;

    try {
      const existingItem = portfolioItems.find(item => item.id === editingItem.id);
      
      if (existingItem) {
        // Update existing item
        await updateDoc(doc(db, 'portfolio', editingItem.id), {
          title: editingItem.title,
          category: editingItem.category,
          image: editingItem.image,
          images: editingItem.images || []
        });
        
        setPortfolioItems(prev => prev.map(item => 
          item.id === editingItem.id ? editingItem : item
        ));
      } else {
        // Add new item
        const docRef = await addDoc(collection(db, 'portfolio'), {
          title: editingItem.title,
          category: editingItem.category,
          image: editingItem.image,
          images: editingItem.images || []
        });
        
        const newItem = { ...editingItem, id: docRef.id };
        setPortfolioItems(prev => [...prev, newItem]);
      }

      setIsEditing(false);
      setEditingItem(null);
      alert('Portfolio item saved successfully!');
    } catch (error) {
      console.error('Error saving portfolio item:', error);
      alert('Error saving portfolio item. Please try again.');
    }
  };

  const handleDeleteItem = async (id: string) => {
    if (confirm('Are you sure you want to delete this portfolio item?')) {
      try {
        await deleteDoc(doc(db, 'portfolio', id));
        setPortfolioItems(prev => prev.filter(item => item.id !== id));
        alert('Portfolio item deleted successfully!');
      } catch (error) {
        console.error('Error deleting portfolio item:', error);
        alert('Error deleting portfolio item. Please try again.');
      }
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditingItem(null);
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="grid grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-48 bg-gray-200 rounded"></div>
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
            <h2 className="text-xl font-semibold text-gray-900">Portfolio Editor</h2>
            <p className="text-sm text-gray-600 mt-1">
              Manage your photography portfolio items
            </p>
          </div>
          <button
            onClick={handleAddItem}
            className="mt-4 sm:mt-0 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>Add Portfolio Item</span>
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search portfolio items..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
            />
          </div>

          {/* Category Filter */}
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent appearance-none bg-white"
            >
              {categories.map(category => (
                <option key={category} value={category.toLowerCase()}>
                  {category}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Portfolio Grid */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <div key={item.id} className="group relative">
              <div className="aspect-square rounded-lg overflow-hidden bg-gray-100">
                {item.image ? (
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <ImageIcon className="w-12 h-12 text-gray-300" />
                  </div>
                )}
                
                {/* Overlay */}
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-300 flex items-center justify-center">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex space-x-2">
                    <button
                      onClick={() => handleEditItem(item)}
                      className="p-2 bg-white rounded-full hover:bg-gray-100 transition-colors"
                      title="Edit"
                    >
                      <Edit className="w-4 h-4 text-gray-700" />
                    </button>
                    <button
                      onClick={() => handleDeleteItem(item.id)}
                      className="p-2 bg-white rounded-full hover:bg-gray-100 transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4 text-red-600" />
                    </button>
                  </div>
                </div>
              </div>
              
              <div className="mt-3">
                <h3 className="font-medium text-gray-900">{item.title}</h3>
                <p className="text-sm text-gray-500">{item.category}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredItems.length === 0 && (
          <div className="text-center py-12">
            <ImageIcon className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg mb-2">No portfolio items found</p>
            <p className="text-gray-400">
              {searchTerm || filterCategory !== 'all' 
                ? 'Try adjusting your search or filter criteria'
                : 'Add your first portfolio item to get started'
              }
            </p>
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {isEditing && editingItem && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" onClick={handleCancelEdit}></div>

            <div className="inline-block w-full max-w-2xl p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-lg">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-medium text-gray-900">
                  {portfolioItems.find(item => item.id === editingItem.id) ? 'Edit' : 'Add'} Portfolio Item
                </h3>
                <button
                  onClick={handleCancelEdit}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-6">
                {/* Form Fields */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Left Column - Image */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Portfolio Image
                    </label>
                    
                    <ImageUpload
                      currentImageUrl={editingItem.image}
                      onImageChange={(url) => setEditingItem(prev => prev ? { ...prev, image: url } : null)}
                      folder="portfolio"
                      aspectRatio="square"
                      placeholder="Upload portfolio image"
                      className="w-full"
                    />
                  </div>

                  {/* Right Column - Details */}
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Title
                      </label>
                      <input
                        type="text"
                        value={editingItem.title}
                        onChange={(e) => setEditingItem(prev => prev ? { ...prev, title: e.target.value } : null)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                        placeholder="Enter portfolio item title"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Category
                      </label>
                      <select
                        value={editingItem.category}
                        onChange={(e) => setEditingItem(prev => prev ? { ...prev, category: e.target.value } : null)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                      >
                        {categories.slice(1).map(category => (
                          <option key={category} value={category}>
                            {category}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-8">
                <button
                  onClick={handleCancelEdit}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveItem}
                  disabled={!editingItem.title || !editingItem.image}
                  className="px-4 py-2 text-sm font-medium text-white bg-gray-900 rounded-lg hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Item</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PortfolioEditor;
