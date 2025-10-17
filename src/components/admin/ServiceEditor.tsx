import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Edit, 
  Trash2, 
  DollarSign, 
  Clock,
  Save,
  X,
  Check,
  Minus
} from 'lucide-react';
import { Service } from '../../types';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../../config/firebase';
import ImageUpload from '../common/ImageUpload';

const ServiceEditor: React.FC = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadServices = async () => {
      try {
        const servicesCollection = collection(db, 'services');
        const servicesSnapshot = await getDocs(servicesCollection);
        const servicesList: Service[] = [];
        
        servicesSnapshot.forEach((doc) => {
          const data = doc.data();
          servicesList.push({
            id: doc.id,
            title: data.title || '',
            description: data.description || '',
            price: data.price || 0,
            duration: data.duration || '',
            features: data.features || [],
            image: data.image || ''
          });
        });
        
        setServices(servicesList);
      } catch (error) {
        console.error('Error loading services:', error);
      } finally {
        setLoading(false);
      }
    };

    loadServices();
  }, []);

  const handleAddService = () => {
    const newService: Service = {
      id: `service-${Date.now()}`,
      title: '',
      description: '',
      price: 0,
      duration: '',
      features: [''],
      image: '',
    };
    setEditingService(newService);
    setIsEditing(true);
  };

  const handleEditService = (service: Service) => {
    setEditingService({ ...service });
    setIsEditing(true);
  };

  const handleSaveService = async () => {
    if (!editingService) return;

    try {
      const existingService = services.find(service => service.id === editingService.id);
      
      if (existingService) {
        // Update existing service
        await updateDoc(doc(db, 'services', editingService.id), {
          title: editingService.title,
          description: editingService.description,
          price: editingService.price,
          duration: editingService.duration,
          features: editingService.features,
          image: editingService.image
        });
        
        setServices(prev => prev.map(service => 
          service.id === editingService.id ? editingService : service
        ));
      } else {
        // Add new service
        const docRef = await addDoc(collection(db, 'services'), {
          title: editingService.title,
          description: editingService.description,
          price: editingService.price,
          duration: editingService.duration,
          features: editingService.features,
          image: editingService.image
        });
        
        const newService = { ...editingService, id: docRef.id };
        setServices(prev => [...prev, newService]);
      }

      setIsEditing(false);
      setEditingService(null);
      alert('Service saved successfully!');
    } catch (error) {
      console.error('Error saving service:', error);
      alert('Error saving service. Please try again.');
    }
  };

  const handleDeleteService = async (id: string) => {
    if (confirm('Are you sure you want to delete this service?')) {
      try {
        await deleteDoc(doc(db, 'services', id));
        setServices(prev => prev.filter(service => service.id !== id));
        alert('Service deleted successfully!');
      } catch (error) {
        console.error('Error deleting service:', error);
        alert('Error deleting service. Please try again.');
      }
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditingService(null);
  };

  const addFeature = () => {
    if (editingService) {
      setEditingService({
        ...editingService,
        features: [...editingService.features, '']
      });
    }
  };

  const removeFeature = (index: number) => {
    if (editingService) {
      setEditingService({
        ...editingService,
        features: editingService.features.filter((_, i) => i !== index)
      });
    }
  };

  const updateFeature = (index: number, value: string) => {
    if (editingService) {
      const newFeatures = [...editingService.features];
      newFeatures[index] = value;
      setEditingService({
        ...editingService,
        features: newFeatures
      });
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="grid grid-cols-2 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-64 bg-gray-200 rounded"></div>
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
            <h2 className="text-xl font-semibold text-gray-900">Service Editor</h2>
            <p className="text-sm text-gray-600 mt-1">
              Manage your photography services and pricing
            </p>
          </div>
          <button
            onClick={handleAddService}
            className="mt-4 sm:mt-0 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>Add Service</span>
          </button>
        </div>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {services.map((service) => (
          <div key={service.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
            {/* Service Image */}
            <div className="relative h-48 bg-gray-100">
              {service.image ? (
                <img
                  src={service.image}
                  alt={service.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <div className="text-gray-400">No Image</div>
                </div>
              )}
              
              {/* Price Badge */}
              <div className="absolute top-4 right-4 bg-white px-3 py-1 rounded-full shadow-lg">
                <div className="flex items-center space-x-1">
                  <DollarSign className="w-4 h-4 text-gray-900" />
                  <span className="font-bold text-gray-900">{service.price}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="absolute top-4 left-4 flex space-x-2">
                <button
                  onClick={() => handleEditService(service)}
                  className="p-2 bg-white rounded-full shadow-lg hover:bg-gray-50 transition-colors"
                  title="Edit Service"
                >
                  <Edit className="w-4 h-4 text-gray-700" />
                </button>
                <button
                  onClick={() => handleDeleteService(service.id)}
                  className="p-2 bg-white rounded-full shadow-lg hover:bg-gray-50 transition-colors"
                  title="Delete Service"
                >
                  <Trash2 className="w-4 h-4 text-red-600" />
                </button>
              </div>
            </div>

            {/* Service Details */}
            <div className="p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-2">{service.title}</h3>
              
              <div className="flex items-center text-gray-600 mb-3">
                <Clock className="w-4 h-4 mr-2" />
                <span className="text-sm">{service.duration}</span>
              </div>

              <p className="text-gray-600 mb-4 text-sm leading-relaxed">
                {service.description}
              </p>

              {/* Features */}
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-gray-900">Features:</h4>
                {service.features.slice(0, 3).map((feature, idx) => (
                  <div key={idx} className="flex items-start">
                    <Check className="w-4 h-4 text-green-600 mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-gray-600">{feature}</span>
                  </div>
                ))}
                {service.features.length > 3 && (
                  <p className="text-sm text-gray-500">
                    +{service.features.length - 3} more features
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {services.length === 0 && (
        <div className="bg-white rounded-lg shadow-sm p-12 text-center">
          <DollarSign className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-lg mb-2">No services found</p>
          <p className="text-gray-400">Add your first photography service to get started</p>
        </div>
      )}

      {/* Edit Modal */}
      {isEditing && editingService && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" onClick={handleCancelEdit}></div>

            <div className="inline-block w-full max-w-4xl p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-lg">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-medium text-gray-900">
                  {services.find(service => service.id === editingService.id) ? 'Edit' : 'Add'} Service
                </h3>
                <button
                  onClick={handleCancelEdit}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left Column - Image Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Service Image
                  </label>
                  
                  <ImageUpload
                    currentImageUrl={editingService.image}
                    onImageChange={(url) => setEditingService(prev => prev ? { ...prev, image: url } : null)}
                    folder="services"
                    aspectRatio="video"
                    placeholder="Upload service showcase image"
                    className="w-full"
                  />
                  
                  <p className="text-xs text-gray-500 mt-2">
                    Recommended: High-quality image showcasing your service
                  </p>
                </div>

                {/* Right Column - Form Fields */}
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Service Title
                    </label>
                    <input
                      type="text"
                      value={editingService.title}
                      onChange={(e) => setEditingService(prev => prev ? { ...prev, title: e.target.value } : null)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                      placeholder="e.g., Family Session"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Price ($)
                      </label>
                      <input
                        type="number"
                        value={editingService.price}
                        onChange={(e) => setEditingService(prev => prev ? { ...prev, price: parseInt(e.target.value) || 0 } : null)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                        placeholder="299"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Duration
                      </label>
                      <input
                        type="text"
                        value={editingService.duration}
                        onChange={(e) => setEditingService(prev => prev ? { ...prev, duration: e.target.value } : null)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                        placeholder="2 hours"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description
                    </label>
                    <textarea
                      value={editingService.description}
                      onChange={(e) => setEditingService(prev => prev ? { ...prev, description: e.target.value } : null)}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                      placeholder="Describe what this service includes..."
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <label className="block text-sm font-medium text-gray-700">
                        Features
                      </label>
                      <button
                        type="button"
                        onClick={addFeature}
                        className="text-sm text-gray-900 hover:text-gray-700 flex items-center space-x-1"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Add Feature</span>
                      </button>
                    </div>
                    
                    <div className="space-y-2 max-h-40 overflow-y-auto">
                      {editingService.features.map((feature, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <input
                            type="text"
                            value={feature}
                            onChange={(e) => updateFeature(index, e.target.value)}
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent text-sm"
                            placeholder="Feature description"
                          />
                          <button
                            type="button"
                            onClick={() => removeFeature(index)}
                            className="p-2 text-red-600 hover:text-red-800"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
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
                  onClick={handleSaveService}
                  disabled={!editingService.title || !editingService.description || editingService.price <= 0}
                  className="px-4 py-2 text-sm font-medium text-white bg-gray-900 rounded-lg hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Service</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ServiceEditor;
