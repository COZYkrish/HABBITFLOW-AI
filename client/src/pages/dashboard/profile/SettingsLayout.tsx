import { Outlet, NavLink, useLocation } from 'react-router-dom';
import { User, Shield, Bell, Palette, Globe } from 'lucide-react';

export const SettingsLayout = () => {
  const location = useLocation();

  const navItems = [
    { name: 'General', path: '/dashboard/settings', icon: User, exact: true },
    { name: 'Appearance', path: '/dashboard/settings/appearance', icon: Palette },
    { name: 'Notifications', path: '/dashboard/settings/notifications', icon: Bell },
    { name: 'Language & Region', path: '/dashboard/settings/language', icon: Globe },
    { name: 'Security', path: '/dashboard/settings/security', icon: Shield },
  ];

  return (
    <div className="flex flex-col md:flex-row gap-8 max-w-6xl mx-auto p-4 sm:p-6 lg:p-8">
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 shrink-0">
        <div className="sticky top-24">
          <h2 className="text-xl font-semibold mb-6 px-4">Profile & Settings</h2>
          <nav className="space-y-1">
            {navItems.map((item) => {
              const isActive = item.exact 
                ? location.pathname === item.path 
                : location.pathname.startsWith(item.path);
                
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                    isActive 
                      ? 'bg-primary/10 text-primary font-medium' 
                      : 'text-text-secondary hover:bg-foreground/5 hover:text-text-primary'
                  }`}
                >
                  <item.icon className={`w-5 h-5 ${isActive ? 'text-primary' : 'text-text-secondary'}`} />
                  {item.name}
                </NavLink>
              );
            })}
          </nav>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 min-w-0">
        <div className="bg-surface border border-border rounded-2xl p-6 sm:p-8 min-h-[600px] shadow-sm">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default SettingsLayout;
