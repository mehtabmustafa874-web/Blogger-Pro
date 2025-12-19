
import React from 'react';

interface LayoutProps {
  children: React.ReactNode;
  activeView: string;
  onNavigate: (view: any) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, activeView, onNavigate }) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: 'fa-chart-line' },
    { id: 'editor', label: 'Create Post', icon: 'fa-plus' },
    { id: 'reader', label: 'View Blog', icon: 'fa-eye' },
    { id: 'settings', label: 'Settings', icon: 'fa-cog' },
  ];

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 hidden md:flex flex-col">
        <div className="p-6 border-b border-gray-200 flex items-center gap-3">
          <div className="bg-orange-500 p-2 rounded-lg">
            <i className="fa-solid fa-b text-white text-xl"></i>
          </div>
          <h1 className="text-xl font-bold bg-gradient-to-r from-orange-600 to-orange-400 bg-clip-text text-transparent">Blogger Pro</h1>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                activeView === item.id 
                  ? 'bg-orange-50 text-orange-600 font-medium' 
                  : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <i className={`fa-solid ${item.icon} w-5`}></i>
              {item.label}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
            <img src="https://picsum.photos/seed/admin/40/40" className="rounded-full w-10 h-10 border border-white" alt="avatar" />
            <div className="overflow-hidden">
              <p className="text-sm font-semibold truncate">Jane Cooper</p>
              <p className="text-xs text-gray-500 truncate">Admin</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto bg-gray-50 flex flex-col">
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8 sticky top-0 z-10">
          <div className="flex items-center gap-2 text-gray-400 text-sm">
            <span>Pages</span>
            <i className="fa-solid fa-chevron-right text-[10px]"></i>
            <span className="text-gray-900 capitalize font-medium">{activeView}</span>
          </div>
          <div className="flex items-center gap-4">
             <button className="text-gray-400 hover:text-gray-600 relative">
               <i className="fa-solid fa-bell"></i>
               <span className="absolute -top-1 -right-1 w-2 h-2 bg-orange-500 rounded-full border-2 border-white"></span>
             </button>
             <div className="h-6 w-px bg-gray-200"></div>
             <button className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg text-sm font-medium shadow-sm transition-colors flex items-center gap-2"
               onClick={() => onNavigate('editor')}>
               <i className="fa-solid fa-plus"></i>
               New Post
             </button>
          </div>
        </header>

        <div className="p-8 max-w-7xl mx-auto w-full">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
