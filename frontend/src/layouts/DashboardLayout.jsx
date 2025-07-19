import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  Menu, 
  X, 
  Home, 
  User, 
  Users, 
  MessageCircle, 
  Settings, 
  LogOut,
  Sparkles,
  Bell
} from 'lucide-react';

const DashboardLayout = ({ children, title, subtitle }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const role = localStorage.getItem('role');
  const userName = localStorage.getItem('userName');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('userName');
    localStorage.removeItem('userId');
    navigate('/login');
  };

  // Get current path for navigation highlighting
  const getCurrentPath = () => {
    const path = location.pathname;
    if (path.includes('/dashboard/investor')) return 'investor';
    if (path.includes('/dashboard/entrepreneur')) return 'entrepreneur';
    if (path.includes('/profile/')) return 'profile';
    if (path.includes('/settings')) return 'settings';
    if (path.includes('/messages')) return 'messages';
    if (path.includes('/help')) return 'help';
    return '';
  };

  const currentPath = getCurrentPath();

  // Update navigation array with proper routing
  const navigation = [
    {
      name: 'Dashboard',
      href: `/dashboard/${role}`,
      icon: Home,
      current: currentPath === 'investor' || currentPath === 'entrepreneur'
    },
    {
      name: 'Profile',
      href: `/profile/${role}/${localStorage.getItem('userId')}`,
      icon: User,
      current: currentPath === 'profile'
    },
    {
      name: role === 'investor' ? 'Entrepreneurs' : 'Investors',
      href: role === 'investor' ? '/dashboard/investor' : '/dashboard/entrepreneur',
      icon: Users,
      current: false // This will be handled by the main dashboard
    },
    {
      name: 'Messages',
      href: `/dashboard/${role}/messages`,
      icon: MessageCircle,
      current: currentPath === 'messages'
    },
    {
      name: 'Settings',
      href: `/dashboard/${role}/settings`,
      icon: Settings,
      current: currentPath === 'settings'
    },
    {
      name: 'Help',
      href: `/dashboard/${role}/help`,
      icon: Sparkles,
      current: currentPath === 'help'
    }
  ];

  const SIDEBAR_WIDTH = {
    desktop: 'w-64',
    tablet: 'w-20',
  };

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-gray-50 to-indigo-100">
      {/* Sidebar */}
      <aside className={`fixed z-30 top-0 left-0 h-full w-64 bg-[#333] text-white flex flex-col shadow-xl border-r border-gray-700 transition-all duration-300 lg:w-64 md:w-20 sm:w-20 min-w-[64px] ${sidebarOpen ? 'block' : 'hidden'} lg:block`}
        style={{ zIndex: 30 }}
        aria-label="Sidebar navigation"
      >
        <div className="flex items-center h-16 px-4 border-b border-gray-700">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-bold text-white hidden lg:block">FundFlow</span>
          </div>
          <button
            className="ml-auto text-gray-400 hover:text-white focus:outline-none lg:hidden"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close sidebar"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        <nav className="flex-1 overflow-y-auto py-4 px-2">
          <ul className="space-y-1">
            {navigation.map((item) => (
              <li key={item.name} className="my-1">
                <Link
                  to={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 font-medium text-white border border-transparent focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-[#333] hover:bg-blue-600/80 hover:text-white active:bg-blue-700/90 ${
                    item.current ? 'bg-blue-100 text-blue-900 border-l-4 border-blue-500 shadow-md' : ''
                  }`}
                  tabIndex={0}
                  aria-current={item.current ? 'page' : undefined}
                  style={{ minHeight: 44 }}
                  onClick={() => setSidebarOpen(false)}
                >
                  <span className="icon flex items-center justify-center w-6 h-6">{<item.icon />}</span>
                  <span className="label truncate hidden md:inline-block">{item.name}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="mt-auto p-2">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 rounded-lg w-full font-medium text-red-200 hover:bg-red-600/80 hover:text-white transition-all border border-transparent focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2 focus:ring-offset-[#333]"
          >
            <span className="icon flex items-center justify-center w-6 h-6"><LogOut /></span>
            <span className="label truncate hidden md:inline-block">Logout</span>
          </button>
        </div>
      </aside>

      {/* Overlay for mobile sidebar */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-20 bg-black bg-opacity-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Main content */}
      <div className="flex-1 min-w-0 ml-0 lg:ml-64 md:ml-20 transition-all duration-300">
        {/* Topbar */}
        <div className="sticky top-0 z-20 bg-white/10 backdrop-blur-xl shadow-lg border-b border-white/20 flex items-center h-16 px-4 sm:px-6 lg:px-8">
          <button
            type="button"
            className="lg:hidden mr-4 p-2 text-white bg-gradient-to-br from-indigo-500 via-purple-500 to-blue-500 shadow-lg rounded-xl border border-white/20 backdrop-blur-md transition-all duration-300 hover:scale-110 hover:shadow-2xl focus:outline-none focus:ring-4 focus:ring-indigo-300/40"
            onClick={() => setSidebarOpen(true)}
            aria-label="Open sidebar menu"
          >
            <Menu className="h-6 w-6" />
          </button>
          <div className="flex-1 flex items-center min-w-0">
            <div className="ml-2 lg:ml-0 min-w-0">
              <h1 className="text-xl font-bold text-gray-900 truncate">{title}</h1>
              {subtitle && <p className="text-sm text-gray-500 break-words max-w-full">{subtitle}</p>}
            </div>
          </div>
          <div className="flex items-center gap-4 ml-4">
            <button className="relative p-2 text-gray-600 hover:text-gray-900">
              <Bell className="h-6 w-6" />
              <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
            </button>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
                <span className="text-sm font-medium text-white">
                  {userName ? userName.charAt(0).toUpperCase() : 'U'}
                </span>
              </div>
              <div className="hidden sm:block">
                <p className="text-sm font-medium text-gray-900">{userName || 'User'}</p>
                <p className="text-xs text-gray-500 capitalize">{role}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="py-6">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
