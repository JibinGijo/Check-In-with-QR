import React, { ReactNode, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { QrCode, Users, Upload, BarChart3, Scan, Menu, X } from 'lucide-react';

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  
  const navigation = [
    { name: 'Dashboard', href: '/', icon: BarChart3 },
    { name: 'Attendees', href: '/attendees', icon: Users },
    { name: 'Import CSV', href: '/import', icon: Upload },
    { name: 'QR Codes', href: '/qr-codes', icon: QrCode },
    { name: 'Scanner', href: '/scanner', icon: Scan },
  ];
  
  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Mobile menu */}
      <div className="lg:hidden">
        <div className="fixed inset-0 flex z-40">
          {/* Mobile menu button */}
          <div className="fixed top-0 left-0 right-0 bg-white shadow-sm z-10 px-4 py-2 flex items-center justify-between">
            <h1 className="text-xl font-bold text-blue-600">Check-In System</h1>
            <button
              type="button"
              className="p-2 rounded-md text-gray-500 hover:text-gray-600 hover:bg-gray-100"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
          
          {/* Mobile menu panel */}
          {isMobileMenuOpen && (
            <div className="fixed inset-0 z-40">
              <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setIsMobileMenuOpen(false)}></div>
              <div className="relative flex-1 flex flex-col max-w-xs w-full pt-16 pb-4 bg-white">
                <div className="flex-1 h-0 overflow-y-auto">
                  <nav className="px-2 space-y-1">
                    {navigation.map((item) => (
                      <Link
                        key={item.name}
                        to={item.href}
                        className={`group flex items-center px-4 py-3 text-base font-medium rounded-md ${
                          isActive(item.href)
                            ? 'bg-blue-100 text-blue-600'
                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                        }`}
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <item.icon
                          className={`mr-4 h-6 w-6 ${
                            isActive(item.href) ? 'text-blue-500' : 'text-gray-400 group-hover:text-gray-500'
                          }`}
                        />
                        {item.name}
                      </Link>
                    ))}
                  </nav>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Desktop sidebar */}
      <div className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 lg:border-r lg:border-gray-200 lg:bg-white">
        <div className="flex-1 flex flex-col min-h-0">
          <div className="flex items-center h-16 flex-shrink-0 px-6 border-b border-gray-200">
            <h1 className="text-xl font-bold text-blue-600">Check-In System</h1>
          </div>
          <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
            <nav className="flex-1 px-3 space-y-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`group flex items-center px-4 py-3 text-sm font-medium rounded-md ${
                    isActive(item.href)
                      ? 'bg-blue-100 text-blue-600'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <item.icon
                    className={`mr-3 h-5 w-5 ${
                      isActive(item.href) ? 'text-blue-500' : 'text-gray-400 group-hover:text-gray-500'
                    }`}
                  />
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </div>
      
      {/* Main content */}
      <div className="lg:pl-64 flex flex-col">
        <main className="flex-1">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 lg:pt-8 pb-12">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;