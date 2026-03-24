import { FC, ReactNode, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import './Layout.css';

interface LayoutProps {
    children: ReactNode;
}

export const Layout: FC<LayoutProps> = ({ children }) => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [isDarkMode, setIsDarkMode] = useState(true);
    const [sidebarOpen, setSidebarOpen] = useState(true);

    const handleLogout = (): void => {
        logout();
        navigate('/login', { replace: true });
    };

    const toggleDarkMode = (): void => {
        setIsDarkMode(!isDarkMode);
        document.documentElement.setAttribute('data-theme', isDarkMode ? 'light' : 'dark');
    };

    const toggleSidebar = (): void => {
        setSidebarOpen(!sidebarOpen);
    };

    const navItems = [
        { label: 'Dashboard', path: '/dashboard' },
    ];

    const handleNavClick = (path: string): void => {
        navigate(path);
    };

    return (
        <div className="layout-container" data-theme={isDarkMode ? 'dark' : 'light'}>
            {/* Top Navigation Bar */}
            <header className="topbar">
                <div className="topbar-content">
                    <button
                        onClick={toggleSidebar}
                        className="sidebar-toggle"
                        type="button"
                        title={sidebarOpen ? 'Hide sidebar' : 'Show sidebar'}
                    >
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <line x1="3" y1="6" x2="21" y2="6"></line>
                            <line x1="3" y1="12" x2="21" y2="12"></line>
                            <line x1="3" y1="18" x2="21" y2="18"></line>
                        </svg>
                    </button>
                    <a href="/dashboard" className="topbar-anchor">
                        <div className="anchor-logo">RAG</div>
                    </a>
                    <div className="topbar-brand">
                        <h1 className="app-title">Auth App</h1>
                    </div>
                    <div className="topbar-actions">
                        <button
                            onClick={toggleDarkMode}
                            className="theme-toggle"
                            type="button"
                            title={isDarkMode ? 'Light mode' : 'Dark mode'}
                        >
                            {isDarkMode ? (
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                    <circle cx="12" cy="12" r="5"></circle>
                                    <line x1="12" y1="1" x2="12" y2="3"></line>
                                    <line x1="12" y1="21" x2="12" y2="23"></line>
                                    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                                    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                                    <line x1="1" y1="12" x2="3" y2="12"></line>
                                    <line x1="21" y1="12" x2="23" y2="12"></line>
                                    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                                    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
                                </svg>
                            ) : (
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
                                </svg>
                            )}
                        </button>
                        <div className="topbar-user">
                            <div className="user-info">
                                <span className="user-email">{user?.email}</span>
                                <span className="user-name">{user?.full_name}</span>
                            </div>
                            <button onClick={handleLogout} className="logout-btn" type="button">
                                Sign out
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            <div className="layout-body">
                {/* Left Sidebar Menu */}
                <aside className={`sidebar ${sidebarOpen ? 'open' : 'closed'}`}>
                    <nav className="sidebar-menu">
                        <p className="menu-title">Navigation</p>
                        <ul className="menu-list">
                            {navItems.map((item) => (
                                <li key={item.path}>
                                    <button
                                        className="menu-item"
                                        onClick={() => handleNavClick(item.path)}
                                        type="button"
                                    >
                                        {item.label}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </nav>
                    <div className="sidebar-footer">
                        <p className="sidebar-version">v1.0.0</p>
                    </div>
                </aside>

                {/* Main Content Area */}
                <main className="main-content">
                    <div className="main-header-bar">
                        <button
                            onClick={toggleSidebar}
                            className="sidebar-toggle-desktop"
                            type="button"
                            title={sidebarOpen ? 'Hide sidebar' : 'Show sidebar'}
                        >
                            {sidebarOpen ? '<<' : '>>'}
                        </button>
                    </div>
                    <div className="page-wrapper">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
};
