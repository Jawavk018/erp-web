import { useState } from 'react';
import { Search, Bell, Settings, LogOut, ChevronDown } from 'lucide-react';
import { useThemeStore } from '@store/themeStore';
import { Link } from 'react-router-dom';
import { cn } from '@lib/utils';

interface HeaderProps {
    collapsed?: boolean;
}

export function Header({ collapsed = false }: HeaderProps) {
    const { theme } = useThemeStore();
    const [showProfileMenu, setShowProfileMenu] = useState(false);
    const [showNotifications, setShowNotifications] = useState(false);

    const notifications = [
        { id: 1, title: 'New order received', time: '5 minutes ago', unread: true },
        { id: 2, title: 'Server update completed', time: '2 hours ago', unread: true },
        { id: 3, title: 'New user registered', time: '4 hours ago', unread: false },
        { id: 4, title: 'Database backup completed', time: '8 hours ago', unread: false },
    ];

    return (
        <header
            className={`
                bg-white border-b border-secondary-200 fixed top-0 right-0 
                ${collapsed ? 'md:left-16' : 'md:left-64'} 
                left-0 h-16 z-30 transition-all duration-300
            `}
        >
            <div className="h-full px-4 flex items-center justify-between">
                {/* Search Bar */}
                <div className="flex-1 max-w-xl">

                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search..."
                            className="w-full pl-10 pr-4 py-2 rounded-lg border border-secondary-200 focus:outline-none focus:border-primary-500"
                        />
                        <Search className="w-5 h-5 text-secondary-400 absolute left-3 top-2.5" />
                    </div>
                </div>

                {/* Right Section */}
                <div className="flex items-center space-x-4">
                    {/* Notifications */}
                    <div className="relative">
                        <button
                            onClick={() => setShowNotifications(!showNotifications)}
                            className="p-2 rounded-full hover:bg-secondary-100 relative"
                        >
                            <Bell className="w-6 h-6 text-secondary-600" />
                            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                        </button>

                        {showNotifications && (
                            <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-secondary-200">
                                <div className="p-3 border-b border-secondary-200">
                                    <h3 className="font-semibold text-secondary-900">Notifications</h3>
                                </div>
                                <div className="max-h-96 overflow-y-auto">
                                    {notifications.map((notification) => (
                                        <div
                                            key={notification.id}
                                            className={`p-3 hover:bg-secondary-50 cursor-pointer ${notification.unread ? 'bg-secondary-50' : ''
                                                }`}
                                        >
                                            <p className="text-sm font-medium text-secondary-900">
                                                {notification.title}
                                            </p>
                                            <p className="text-xs text-secondary-500 mt-1">
                                                {notification.time}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Profile Menu */}
                    <div className="relative">
                        <button
                            onClick={() => setShowProfileMenu(!showProfileMenu)}
                            className="flex items-center space-x-3 hover:bg-secondary-50 rounded-lg p-2"
                        >
                            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-primary-500 to-primary-600 flex items-center justify-center">
                                <span className="text-white font-medium text-sm">JD</span>
                            </div>
                            <div className="hidden md:block text-left">
                                <p className="text-sm font-medium text-secondary-900">Padhu</p>
                                <p className="text-xs text-secondary-500">Administrator</p>
                            </div>
                            <ChevronDown className="w-4 h-4 text-secondary-500" />
                        </button>

                        {showProfileMenu && (
                            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-secondary-200">
                                <Link
                                    to="/settings"
                                    className="flex items-center space-x-3 px-4 py-3 hover:bg-secondary-50 text-secondary-700"
                                >
                                    <Settings className="w-5 h-5" />
                                    <span className="text-sm">Settings</span>
                                </Link>
                                <button
                                    onClick={() => {/* Handle logout */ }}
                                    className="w-full flex items-center space-x-3 px-4 py-3 hover:bg-secondary-50 text-secondary-700"
                                >
                                    <LogOut className="w-5 h-5" />
                                    <span className="text-sm">Logout</span>
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Colored line based on theme */}
            <div
                className="h-1 absolute bottom-0 left-0 right-0"
                style={{ backgroundColor: getThemeColor(theme) }}
            ></div>
        </header>
    );
}

function getThemeColor(theme: string): string {
    switch (theme) {
        case 'green':
            return '#22c55e';
        case 'purple':
            return '#a855f7';
        case 'orange':
            return '#f97316';
        default:
            return '#3b82f6';
    }
}
