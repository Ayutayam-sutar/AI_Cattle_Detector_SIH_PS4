import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import DashboardPage from './pages/DashboardPage';
import AnalyzerPage from './pages/AnalyzerPage';
import DetailsPage from './pages/DetailsPage';
import ProfilePage from './pages/ProfilePage';
import GuidePage from './pages/GuidePage';
import GuideDetailPage from './pages/GuideDetailPage';
import FindVetPage from './pages/FindVetPage';
import Navbar from './components/Navbar';
import Spinner from './components/Spinner';
import StartAnalysisPage from './pages/StartAnalysisPage';
import MarketplacePage from './pages/MarketplacePage';
import ValuatorPage from './pages/ValuatorPage';

// A simple hash-based router component
const Router = () => {
    // We get the hash path, remove the #, and default to '/'
    const [currentPath, setCurrentPath] = useState(window.location.hash.slice(1) || '/');
    const { user, loading } = useAuth();

    useEffect(() => {
        const handleHashChange = () => {
            setCurrentPath(window.location.hash.slice(1) || '/');
        };
        window.addEventListener('hashchange', handleHashChange);
        return () => window.removeEventListener('hashchange', handleHashChange);
    }, []);

    if (loading) {
        return (
            <div className="h-screen w-full flex flex-col items-center justify-center bg-stone-50">
                <div className="flex items-center text-gray-800">
                    <Spinner />
                    <span className="text-xl ml-2">Loading App...</span>
                </div>
            </div>
        );
    }
    
    // Simple routing logic
    const pathSegments = currentPath.split('/');
    const baseRoute = '/' + (pathSegments[1] || '');
    
    // Protected routes
    if (['/dashboard', '/start-analysis', '/analyze', '/details', '/profile', '/guide', '/find-vet', '/marketplace', '/valuator'].includes(baseRoute) && !user) {
        window.location.hash = '/';
        return null;
    }
    
    // Public routes that should redirect if logged in
    if (['/login', '/signup'].includes(baseRoute) && user) {
        window.location.hash = '/dashboard';
        return null;
    }

    let pageComponent;
    switch (baseRoute) {
        case '/':
            pageComponent = user ? <DashboardPage /> : <LandingPage />;
            break;
        case '/login':
            pageComponent = <LoginPage />;
            break;
        case '/signup':
            pageComponent = <SignupPage />;
            break;
        case '/dashboard':
            pageComponent = <DashboardPage />;
            break;
        case '/start-analysis':
            pageComponent = <StartAnalysisPage />;
            break;
        case '/analyze':
            pageComponent = <AnalyzerPage />;
            break;
        case '/details':
            pageComponent = <DetailsPage />;
            break;
        case '/profile':
            pageComponent = <ProfilePage />;
            break;
        case '/guide':
             // Handle both /guide and /guide/topic
            const topic = pathSegments[2];
            pageComponent = topic ? <GuideDetailPage topic={topic} /> : <GuidePage />;
            break;
        case '/find-vet':
            pageComponent = <FindVetPage />;
            break;
        case '/marketplace':
            pageComponent = <MarketplacePage />;
            break;
        case '/valuator':
            pageComponent = <ValuatorPage />;
            break;
        default:
            // 404 - redirect to dashboard if logged in, else landing
            window.location.hash = user ? '/dashboard' : '/';
            pageComponent = user ? <DashboardPage /> : <LandingPage />;
    }

    return <div key={currentPath} className="animate-fade-in">{pageComponent}</div>;
};

const App = () => {
    return (
        <AuthProvider>
            <div className="min-h-screen bg-stone-50 text-stone-900">
                <style>{`
                    @keyframes fade-in {
                        from { opacity: 0; transform: translateY(10px); }
                        to { opacity: 1; transform: translateY(0); }
                    }
                    .animate-fade-in { animation: fade-in 0.5s ease-out forwards; }
                    
                    @keyframes tracking-in-expand {
                        0% { letter-spacing: -0.5em; opacity: 0; }
                        40% { opacity: 0.6; }
                        100% { opacity: 1; }
                    }
                    .animate-tracking-in-expand { 
                        animation: tracking-in-expand 1s cubic-bezier(0.215, 0.610, 0.355, 1.000) both;
                    }
                    
                    @keyframes flip-scale-up-hor {
                        0% { transform: scale(1) rotateX(0); }
                        50% { transform: scale(2.5) rotateX(-90deg); }
                        100% { transform: scale(1) rotateX(-180deg); }
                    }
                    .animate-flip-scale-up-hor { 
                        animation: flip-scale-up-hor 0.5s cubic-bezier(0.455, 0.030, 0.515, 0.955) both;
                    }
                    
                    @keyframes slide-in-elliptic-top-fwd {
                        0% {
                            transform: translateY(-600px) rotateX(-30deg) scale(0);
                            transform-origin: 50% 100%;
                            opacity: 0;
                        }
                        100% {
                            transform: translateY(0) rotateX(0) scale(1);
                            transform-origin: 50% 1400px;
                            opacity: 1;
                        }
                    }
                    .animate-slide-in-elliptic-top-fwd {
                        animation: slide-in-elliptic-top-fwd 0.7s cubic-bezier(0.250, 0.460, 0.450, 0.940) both;
                    }
                    
                    @keyframes bounce-in-top {
                        0% {
                            transform: translateY(-500px);
                            animation-timing-function: ease-in;
                            opacity: 0;
                        }
                        38% {
                            transform: translateY(0);
                            animation-timing-function: ease-out;
                            opacity: 1;
                        }
                        55% {
                            transform: translateY(-65px);
                            animation-timing-function: ease-in;
                        }
                        72% {
                            transform: translateY(0);
                            animation-timing-function: ease-out;
                        }
                        81% {
                            transform: translateY(-28px);
                            animation-timing-function: ease-in;
                        }
                        90% {
                            transform: translateY(0);
                            animation-timing-function: ease-out;
                        }
                        95% {
                            transform: translateY(-8px);
                            animation-timing-function: ease-in;
                        }
                        100% {
                            transform: translateY(0);
                            animation-timing-function: ease-out;
                        }
                    }
                    .animate-bounce-in-top {
                        animation: bounce-in-top 1.1s both;
                    }
                `}</style>
                <Navbar />
                <Router />
            </div>
        </AuthProvider>
    );
};

export default App;