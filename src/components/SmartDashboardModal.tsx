import React from 'react';
import { useAdmin } from '../contexts/AdminContext';
import DashboardModal from './DashboardModal';
import AdminDashboardModal from './AdminDashboardModal';

interface SmartDashboardModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SmartDashboardModal: React.FC<SmartDashboardModalProps> = ({ isOpen, onClose }) => {
  const { isAdmin, loading } = useAdmin();

  // Don't render anything while loading admin status
  if (loading) {
    return null;
  }

  // Render appropriate dashboard based on user role
  if (isAdmin) {
    return (
      <AdminDashboardModal
        isOpen={isOpen}
        onClose={onClose}
      />
    );
  } else {
    return (
      <DashboardModal
        isOpen={isOpen}
        onClose={onClose}
      />
    );
  }
};

export default SmartDashboardModal;
