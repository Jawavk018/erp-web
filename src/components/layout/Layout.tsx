import { Outlet } from 'react-router-dom';
import { Sidebar } from '@components/layout/Sidebar';
import { Header } from '@components/layout/Header';
import { useThemeStore } from '@store/themeStore';
import { useState, useEffect } from 'react';

export function Layout() {
  const { theme, getThemeColors } = useThemeStore();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  useEffect(() => {
    // Apply theme colors to CSS variables
    const themeColors = getThemeColors();
    const root = document.documentElement;
    Object.entries(themeColors).forEach(([key, value]) => {
      if (typeof value === 'object') {
        Object.entries(value).forEach(([subKey, subValue]) => {
          root.style.setProperty(`--${key}-${subKey}`, subValue);
        });
      } else {
        root.style.setProperty(`--${key}`, value);
      }
    });
  }, [theme, getThemeColors]);

  return (
    <div className={`app-container theme-${theme}`}>
      <Header collapsed={sidebarCollapsed} />
      <Sidebar onCollapse={(collapsed) => setSidebarCollapsed(collapsed)} />
      <main
        className={`
          transition-all duration-300 
          min-h-screen
          pt-16
          ${sidebarCollapsed ? 'md:ml-16' : 'md:ml-72'}
          p-4 md:p-8
        `}
      >
        <Outlet />
      </main>
    </div>
  );
}