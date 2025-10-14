import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from './config/firebase';

// Test utility: Add a sample session to Firestore
// Usage in browser console: window.addTestSession('your-user-id')
(window as any).addTestSession = async (userId: string) => {
  try {
    const sessionData = {
      userId: userId,
      serviceId: 'family-session',
      serviceName: 'Family Photography Session',
      date: new Date().toISOString().split('T')[0],
      amount: 34900, // $349 in cents
      status: 'completed',
      stripeSessionId: 'test_session_' + Date.now(),
      createdAt: serverTimestamp(),
      photos: [
        'https://images.unsplash.com/photo-1511895426328-dc8714191300?w=800&q=80',
        'https://images.unsplash.com/photo-1609220136736-443140cffec6?w=800&q=80',
        'https://images.unsplash.com/photo-1475503572774-15a45e5d60b9?w=800&q=80'
      ]
    };

    const docRef = await addDoc(collection(db, 'sessions'), sessionData);
    console.log('✅ Test session created with ID:', docRef.id);
    alert('Test session created! Refresh the dashboard to see it.');
    return docRef.id;
  } catch (error) {
    console.error('❌ Error creating test session:', error);
    alert('Error creating test session. Check console for details.');
    throw error;
  }
};

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
