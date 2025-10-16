import { useState, useEffect } from 'react';
import Navigation from './components/Navigation';
import Home from './components/sections/Home';
import About from './components/sections/About';
import Services from './components/sections/Services';
import Portfolio from './components/sections/Portfolio';
import AuthModal from './components/AuthModal';
import SmartDashboardModal from './components/SmartDashboardModal';
import { AuthProvider } from './contexts/AuthContext';
import { AdminProvider } from './contexts/AdminContext';

function App() {
  const [currentSection, setCurrentSection] = useState('home');
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isDashboardModalOpen, setIsDashboardModalOpen] = useState(false);

  const handleNavigate = (section: string) => {
    setCurrentSection(section);
    
    // Smooth scroll to section
    const element = document.getElementById(section);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    // Observe sections for active state
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setCurrentSection(entry.target.id);
          }
        });
      },
      { threshold: 0.3 }
    );

    const sections = ['home', 'about', 'services', 'portfolio'];
    sections.forEach((id) => {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <AuthProvider>
      <AdminProvider>
        <div className="min-h-screen bg-white">
          <Navigation
            onNavigate={handleNavigate}
            currentSection={currentSection}
            onAuthClick={() => setIsAuthModalOpen(true)}
            onDashboardClick={() => setIsDashboardModalOpen(true)}
          />

          <main>
            <Home onNavigate={handleNavigate} />
            <About />
            <Services onAuthClick={() => setIsAuthModalOpen(true)} />
            <Portfolio />
          </main>

          <footer className="bg-gray-900 text-white py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div>
                  <h3 className="text-xl font-bold mb-4">Lens & Light</h3>
                  <p className="text-gray-400">
                    Professional photography services capturing your most precious moments.
                  </p>
                </div>
                
                <div>
                  <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
                  <ul className="space-y-2">
                    <li>
                      <button
                        onClick={() => handleNavigate('about')}
                        className="text-gray-400 hover:text-white transition-colors"
                      >
                        About
                      </button>
                    </li>
                    <li>
                      <button
                        onClick={() => handleNavigate('services')}
                        className="text-gray-400 hover:text-white transition-colors"
                      >
                        Services
                      </button>
                    </li>
                    <li>
                      <button
                        onClick={() => handleNavigate('portfolio')}
                        className="text-gray-400 hover:text-white transition-colors"
                      >
                        Portfolio
                      </button>
                    </li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="text-lg font-semibold mb-4">Contact</h4>
                  <ul className="space-y-2 text-gray-400">
                    <li>Email: hello@lensandlight.com</li>
                    <li>Phone: (555) 123-4567</li>
                    <li>Location: New York, NY</li>
                  </ul>
                </div>
              </div>
              
              <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
                <p>&copy; 2024 Lens & Light Photography. All rights reserved.</p>
              </div>
            </div>
          </footer>

          <AuthModal
            isOpen={isAuthModalOpen}
            onClose={() => setIsAuthModalOpen(false)}
          />

          <SmartDashboardModal
            isOpen={isDashboardModalOpen}
            onClose={() => setIsDashboardModalOpen(false)}
          />
        </div>
      </AdminProvider>
    </AuthProvider>
  );
}

export default App;
