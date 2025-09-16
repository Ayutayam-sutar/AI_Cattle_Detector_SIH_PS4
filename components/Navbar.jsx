import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
    const { user, logout } = useAuth();
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const dropdownRef = useRef(null);
    const mobileMenuRef = useRef(null);

    
    const [activeHash, setActiveHash] = useState(window.location.hash);

    
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setDropdownOpen(false);
            }
            if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target)) {
                setMobileMenuOpen(false);
            }
        };
        
        
        const handleHashChange = () => {
            setActiveHash(window.location.hash);
        };

        document.addEventListener("mousedown", handleClickOutside);
        window.addEventListener('hashchange', handleHashChange); 

        
        handleHashChange();

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            window.removeEventListener('hashchange', handleHashChange); 
        };
    }, []);

   
    const navItems = [
        { 
            name: 'Dashboard', 
            hash: '/dashboard',
            icon: (
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="m8 5 4-3 4 3" />
                </svg>
            )
        },
        { 
            name: 'Valuator', 
            hash: '/valuator',
            icon: (
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
            )
        },
        { 
            name: 'Marketplace', 
            hash: '/marketplace',
            icon: (
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
            )
        },
        { 
            name: 'Guide', 
            hash: '/guide',
            icon: (
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
            )
        },
        { 
            name: 'Find Vet', 
            hash: '/find-vet',
            icon: (
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
            )
        }
    ];
    
    const linkButtonClassName = "bg-transparent border-none cursor-pointer text-stone-700 hover:text-emerald-600 hover:bg-emerald-50 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 flex items-center whitespace-nowrap";
    const mobileLinkButtonClassName = "w-full text-left flex items-center px-4 py-3 text-base text-stone-700 hover:bg-emerald-50 hover:text-emerald-600 transition-colors duration-200 border-b border-stone-100 last:border-b-0";

    const handleNavigation = (hash) => {
        window.location.hash = hash;
        setDropdownOpen(false);
        setMobileMenuOpen(false);
    };

    return (
        <header className="bg-white shadow-lg border-b-2 border-emerald-100 sticky top-0 z-50">
            <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-18">
                    {/* Logo Section */}
                    <div className="flex items-center">
                        <a 
                            href={user ? "#/dashboard" : "#/"} 
                            className="flex items-center space-x-3 py-2 hover:opacity-80 transition-opacity"
                        >
                            <div className="relative">
                                <img 
                                    src="pages/logo.png" 
                                    className="h-12 w-12 rounded-full border-2 border-emerald-200 shadow-sm" 
                                    alt="PashuDrishti Logo" 
                                />
                            </div>
                            <div>
                                <h1 className="animate-tracking-in-expand font-bold text-xl text-emerald-700">PashuDrishti</h1>
                            </div>
                        </a>
                    </div>

                    {/* Desktop Navigation */}
                    <div className="hidden lg:flex items-center space-x-2">
                        {user ? (
                            <>
                                {navItems.map((item) => {
                                    
                                    const isActive = activeHash === `#${item.hash}`;
                                    return (
                                        <button
                                            key={item.hash}
                                            onClick={() => handleNavigation(item.hash)}
                                            
                                            className={`${linkButtonClassName} ${isActive ? 'bg-emerald-50 text-emerald-600 font-semibold' : ''}`}
                                        >
                                            {item.icon}
                                            {item.name}
                                        </button>
                                    );
                                })}

                                {/* User Dropdown */}
                                <div className="relative ml-4" ref={dropdownRef}>
                                    <button 
                                        onClick={() => setDropdownOpen(!dropdownOpen)} 
                                        className="flex items-center space-x-3 p-3 rounded-xl hover:bg-stone-50 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all duration-200"
                                    >
                                        <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                                            <span className="text-emerald-700 font-semibold text-lg">
                                                {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                                            </span>
                                        </div>
                                        <div className="text-left hidden xl:block">
                                            <p className="text-stone-700 text-sm font-medium">{user.name}</p>
                                            <p className="text-stone-500 text-xs">Farmer</p>
                                        </div>
                                        <svg 
                                            xmlns="http://www.w3.org/2000/svg" 
                                            className={`h-5 w-5 text-stone-500 transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`} 
                                            viewBox="0 0 20 20" 
                                            fill="currentColor"
                                        >
                                            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                        </svg>
                                    </button>

                                    {/* Dropdown Menu */}
                                    {dropdownOpen && (
                                        <div className="origin-top-right absolute right-0 mt-2 w-56 rounded-xl shadow-xl py-2 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none border border-stone-100">
                                            <div className="px-4 py-3 border-b border-stone-100">
                                                <p className="text-sm font-medium text-stone-700">{user.name}</p>
                                                <p className="text-xs text-stone-500">Signed in as Farmer</p>
                                            </div>
                                            <button 
                                                onClick={() => handleNavigation('/profile')} 
                                                className="flex items-center w-full px-4 py-3 text-sm text-stone-700 hover:bg-stone-50 transition-colors"
                                            >
                                                <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                                </svg>
                                                Profile
                                            </button>
                                            <button
                                                onClick={() => { logout(); setDropdownOpen(false); }}
                                                className="flex items-center w-full px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors"
                                            >
                                                <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                                </svg>
                                                Logout
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </>
                        ) : (
                            <div className="flex items-center space-x-4">
                                <button 
                                    onClick={() => handleNavigation('/login')} 
                                    className="px-6 py-2 border border-emerald-600 text-emerald-600 rounded-lg font-medium hover:bg-emerald-50 transition-colors duration-200"
                                >
                                    Login
                                </button>
                                <button 
                                    onClick={() => handleNavigation('/signup')} 
                                    className="px-6 py-2 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 shadow-md transition-all duration-200"
                                >
                                    Get Started
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="lg:hidden">
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="inline-flex items-center justify-center p-3 rounded-lg text-stone-600 hover:text-emerald-600 hover:bg-stone-50 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-emerald-500 transition-colors"
                        >
                            <span className="sr-only">Open main menu</span>
                            {mobileMenuOpen ? (
                                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            ) : (
                                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                </svg>
                            )}
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                {mobileMenuOpen && (
                    <div className="lg:hidden" ref={mobileMenuRef}>
                        <div className="px-2 pt-2 pb-6 space-y-1 bg-white border-t border-stone-200 mt-4">
                            {user ? (
                                <>
                                    {/* User info in mobile */}
                                    <div className="flex items-center space-x-3 px-4 py-4 bg-emerald-50 rounded-lg mb-4">
                                        <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center">
                                            <span className="text-emerald-700 font-semibold text-lg">
                                                {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                                            </span>
                                        </div>
                                        <div>
                                            <p className="font-medium text-stone-700">{user.name}</p>
                                            <p className="text-sm text-stone-500">Farmer</p>
                                        </div>
                                    </div>

                                    {navItems.map((item) => (
                                        <button
                                            key={item.hash}
                                            onClick={() => handleNavigation(item.hash)}
                                            className={mobileLinkButtonClassName}
                                        >
                                            {item.icon}
                                            {item.name}
                                        </button>
                                    ))}

                                    <button 
                                        onClick={() => handleNavigation('/profile')} 
                                        className={mobileLinkButtonClassName}
                                    >
                                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                        </svg>
                                        Profile
                                    </button>

                                    <button
                                        onClick={() => { logout(); setMobileMenuOpen(false); }}
                                        className="w-full text-left flex items-center px-4 py-3 text-base text-red-600 hover:bg-red-50 transition-colors duration-200 rounded-lg mt-2"
                                    >
                                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                        </svg>
                                        Logout
                                    </button>
                                </>
                            ) : (
                                <div className="space-y-3 px-2 pt-4">
                                    <button 
                                        onClick={() => handleNavigation('/login')} 
                                        className="w-full flex items-center justify-center px-6 py-3 border border-emerald-600 text-emerald-600 rounded-lg font-medium hover:bg-emerald-50 transition-colors duration-200"
                                    >
                                        Login
                                    </button>
                                    <button 
                                        onClick={() => handleNavigation('/signup')} 
                                        className="w-full flex items-center justify-center px-6 py-3 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 shadow-md transition-colors duration-200"
                                    >
                                        Get Started
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </nav>
        </header>
    );
};

export default Navbar;