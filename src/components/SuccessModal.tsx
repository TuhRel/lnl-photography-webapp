import React from 'react';
import { X, CheckCircle, Calendar, Download, Mail, Phone } from 'lucide-react';

interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  sessionId: string | null;
  onViewDashboard: () => void;
}

const SuccessModal: React.FC<SuccessModalProps> = ({ 
  isOpen, 
  onClose, 
  sessionId,
  onViewDashboard 
}) => {
  if (!isOpen) return null;

  const handleViewDashboard = () => {
    onViewDashboard();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors z-10"
        >
          <X className="w-5 h-5 text-gray-500" />
        </button>

        <div className="p-8 md:p-12">
          {/* Success Icon */}
          <div className="flex justify-center mb-6">
            <div className="bg-green-100 rounded-full p-6 animate-bounce">
              <CheckCircle className="w-16 h-16 text-green-600" />
            </div>
          </div>

          {/* Success Message */}
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
              Payment Successful!
            </h2>
            <p className="text-lg text-gray-600">
              Thank you for booking with Lens & Light Photography.
            </p>
          </div>

          {/* Session Details */}
          {sessionId && (
            <div className="bg-gray-50 rounded-lg p-6 mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Calendar className="w-5 h-5 mr-2 text-blue-600" />
                Booking Confirmation
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Transaction ID:</span>
                  <span className="font-mono text-gray-900 text-xs bg-white px-3 py-1 rounded">
                    {sessionId.slice(0, 24)}...
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Status:</span>
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-green-100 text-green-700">
                    <CheckCircle className="w-4 h-4 mr-1" />
                    Confirmed
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Date:</span>
                  <span className="text-gray-900 font-medium">
                    {new Date().toLocaleDateString('en-US', { 
                      month: 'long', 
                      day: 'numeric', 
                      year: 'numeric' 
                    })}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Next Steps */}
          <div className="bg-blue-50 rounded-lg p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              What Happens Next?
            </h3>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-semibold mr-3 mt-0.5">
                  1
                </div>
                <span>You'll receive a confirmation email with your booking details within the next few minutes.</span>
              </li>
              <li className="flex items-start">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-semibold mr-3 mt-0.5">
                  2
                </div>
                <span>Our team will contact you within 24 hours to schedule your photography session.</span>
              </li>
              <li className="flex items-start">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-semibold mr-3 mt-0.5">
                  3
                </div>
                <span>After your session, photos will be available in your dashboard for download.</span>
              </li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            <button
              onClick={handleViewDashboard}
              className="flex-1 inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
            >
              <Download className="w-5 h-5 mr-2" />
              View Dashboard
            </button>
            <button
              onClick={onClose}
              className="flex-1 inline-flex items-center justify-center px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-semibold"
            >
              Continue Browsing
            </button>
          </div>

          {/* Support Section */}
          <div className="pt-6 border-t border-gray-200">
            <p className="text-center text-sm text-gray-600 mb-3">
              Need help or have questions?
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center text-sm">
              <a
                href="mailto:hello@lensandlight.com"
                className="inline-flex items-center justify-center text-blue-600 hover:text-blue-700 font-medium"
              >
                <Mail className="w-4 h-4 mr-1" />
                hello@lensandlight.com
              </a>
              <span className="hidden sm:inline text-gray-400">•</span>
              <a
                href="tel:+15551234567"
                className="inline-flex items-center justify-center text-blue-600 hover:text-blue-700 font-medium"
              >
                <Phone className="w-4 h-4 mr-1" />
                (555) 123-4567
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuccessModal;