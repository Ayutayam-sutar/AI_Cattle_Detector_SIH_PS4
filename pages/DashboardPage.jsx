import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { AddIcon, ValuatorIcon, MarketplaceIcon, GuideIcon, VetIcon, TotalAnalysisIcon, TopBreedIcon, NoHistoryIcon } from '../components/Icons';

const HistoryCard = ({ item }) => {
    
    const detailsId = item._id || item.id;
    
    
    const primaryBreed = item.reportData?.advanced_breed_detector?.primary_breed || 'Unknown Breed';
    const healthStatus = item.reportData?.ai_veterinary_assistant?.overall_health_status || 'Unknown';
    
    return (
        <div 
            onClick={() => window.location.hash = `/details/${detailsId}`} 
            className="group cursor-pointer bg-white rounded-xl shadow-sm hover:shadow-lg border border-gray-100 overflow-hidden transform hover:-translate-y-1 transition-all duration-300 hover:border-emerald-200"
        >
            <div className="relative">
                <img 
                    src={item.image} 
                    alt={primaryBreed} 
                    className="w-full h-48 sm:h-40 object-cover group-hover:scale-105 transition-transform duration-300" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
            <div className="p-4">
                <h3 className="font-semibold text-lg text-gray-800 truncate mb-2 group-hover:text-emerald-600 transition-colors">
                    {primaryBreed}
                </h3>
                <div className="flex items-center mb-3">
                    <div className={`w-2 h-2 rounded-full mr-2 ${
                        healthStatus === 'Good' ? 'bg-green-500' :
                        healthStatus === 'Fair' ? 'bg-yellow-500' : 'bg-red-500'
                    }`}></div>
                    <p className="text-sm text-gray-600">{healthStatus}</p>
                </div>
                <p className="text-xs text-gray-400 flex items-center">
                    <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {/* FIX: The database provides `createdAt` */}
                    {new Date(item.createdAt).toLocaleDateString('en-US', { 
                        month: 'short', 
                        day: 'numeric', 
                        year: 'numeric'
                    })}
                </p>
            </div>
        </div>
    )
}

const StatCard = ({ title, value, icon, trend }) => ( <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100"> <div className="flex items-center justify-between"> <div className="flex items-center"> <div className="p-3 rounded-xl bg-emerald-50 text-emerald-600 mr-4 group-hover:bg-emerald-100 transition-colors"> {icon} </div><div> <p className="text-sm font-medium text-gray-500 mb-1">{title}</p><p className="text-2xl font-bold text-gray-900">{value}</p></div></div>{trend && ( <div className="text-right"> <span className="text-xs text-green-600 font-medium">+12%</span> <p className="text-xs text-gray-400">vs last month</p></div>)} </div></div> );
const QuickActionButton = ({ title, icon, onClick, description }) => ( <button onClick={onClick} className="group flex flex-col items-center justify-center space-y-3 bg-white p-6 rounded-xl shadow-sm hover:shadow-lg border border-gray-100 text-gray-700 hover:border-emerald-200 transition-all duration-300 transform hover:-translate-y-1 min-h-[140px]"> <div className="p-4 bg-emerald-50 rounded-xl text-emerald-600 group-hover:bg-emerald-100 group-hover:scale-110 transition-all duration-300"> {icon} </div><div className="text-center"> <span className="font-semibold text-sm sm:text-base block mb-1 group-hover:text-emerald-600 transition-colors">{title}</span> {description && <span className="text-xs text-gray-500 hidden sm:block">{description}</span>} </div></button> )
const WelcomeSection = ({ userName }) => { const currentHour = new Date().getHours(); const greeting = currentHour < 12 ? 'Good morning' : currentHour < 18 ? 'Good afternoon' : 'Good evening'; return ( <div className="bg-gradient-to-br from-emerald-50 via-white to-blue-50 rounded-2xl p-6 sm:p-8 mb-8 border border-emerald-100"> <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between"> <div> <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2"> {greeting}, {userName}! </h1> <p className="text-gray-600 text-base"> Monitor your livestock health and manage your farm efficiently </p></div><div className="mt-4 sm:mt-0"> <div className="bg-white px-4 py-2 rounded-lg shadow-sm border border-emerald-100"> <p className="text-xs text-gray-500">Today</p><p className="font-semibold text-gray-900">{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}</p></div></div></div></div> ); };

const DashboardPage = () => {
    const { user } = useAuth();
    const [history, setHistory] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    
    useEffect(() => {
        const fetchHistory = async () => {
            setIsLoading(true);
            try {
                const storedUser = sessionStorage.getItem('cattle-classifier-user');
                const user = storedUser ? JSON.parse(storedUser) : null;
                if (!user || !user.token) {
                    setHistory([]);
                    return;
                }
                const response = await fetch('http://localhost:3001/api/analyses', {
                    headers: { 'Authorization': `Bearer ${user.token}` }
                });
                if (!response.ok) throw new Error('Failed to fetch analysis history.');
                const data = await response.json();
                setHistory(data);
            } catch (error) {
                console.error("Failed to fetch history:", error);
                setHistory([]);
            } finally {
                setIsLoading(false);
            }
        };
        fetchHistory();
    }, []);

    const stats = useMemo(() => {
        if (!history || history.length === 0) {
            return { totalAnalyses: 0, mostCommonBreed: 'No data yet', conditionCounts: {} };
        }
        const totalAnalyses = history.length;
        const breedCounts = history.reduce((acc, item) => {
            
            const breed = item.reportData?.advanced_breed_detector?.primary_breed;
            if (breed) {
                acc[breed] = (acc[breed] || 0) + 1;
            }
            return acc;
        }, {});
        const mostCommonBreed = Object.keys(breedCounts).length > 0 ? Object.entries(breedCounts).sort((a, b) => b[1] - a[1])[0][0] : 'No data yet';
        const conditionCounts = history.reduce((acc, item) => {
            
            const condition = item.reportData?.ai_veterinary_assistant?.overall_health_status;
            if (condition) {
                acc[condition] = (acc[condition] || 0) + 1;
            }
            return acc;
        }, {});
        return { totalAnalyses, mostCommonBreed, conditionCounts };
    }, [history]);

    const filteredHistory = useMemo(() => {
        if (!history) return [];
        
        return history.filter(item => 
            (item.reportData?.advanced_breed_detector?.primary_breed || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
            (item.reportData?.ai_veterinary_assistant?.overall_health_status || '').toLowerCase().includes(searchTerm.toLowerCase())
        ).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }, [history, searchTerm]);

    const allActions = [ { title: "Smart Valuator", description: "Get market value", icon: <ValuatorIcon />, onClick: () => window.location.hash = '/valuator' }, { title: "Marketplace", description: "Buy & sell cattle", icon: <MarketplaceIcon />, onClick: () => window.location.hash = '/marketplace' }, { title: "Cattle Guide", description: "Learn best practices", icon: <GuideIcon />, onClick: () => window.location.hash = '/guide' }, { title: "Find Vet", description: "Locate nearby vets", icon: <VetIcon />, onClick: () => window.location.hash = '/find-vet' } ];

    if (isLoading) { return ( <div className="min-h-screen bg-stone-50 flex items-center justify-center"> <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div></div> ); }

    return (
        <div className="min-h-screen bg-stone-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-12">
                <WelcomeSection userName={user?.name || 'Farmer'} />
                <section className="mb-12 text-center">
                    <button
                        onClick={() => window.location.hash = '/start-analysis'}
                        
                        className="inline-flex items-center justify-center w-full sm:w-auto px-8 py-4 border border-transparent text-lg font-bold rounded-xl shadow-lg text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transform hover:scale-105 transition-transform duration-300"
                    >
                        <AddIcon />
                        <span className="ml-3">Start New Analysis</span>
                    </button>
                </section>
                <section className="mb-12">
                    <h2 className="text-xl font-bold text-gray-900 mb-4 px-1">Farm Statistics</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                        <StatCard title="Total Analyses" value={stats.totalAnalyses} icon={<TotalAnalysisIcon />} trend={stats.totalAnalyses > 0} />
                        <StatCard title="Top Breed" value={stats.mostCommonBreed} icon={<TopBreedIcon />} />
                        <div className="sm:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                            <div className="flex items-center justify-between mb-4"> <h3 className="text-lg font-semibold text-gray-900">Health Overview</h3> <div className="text-sm text-gray-500">{stats.totalAnalyses} total</div></div>
                            {stats.totalAnalyses > 0 ? (
                                <div className="space-y-3">
                                    {['Good', 'Fair', 'Needs Attention'].map(condition => {
                                        const count = stats.conditionCounts[condition] || 0;
                                        const percentage = stats.totalAnalyses > 0 ? Math.round((count / stats.totalAnalyses) * 100) : 0;
                                        const colors = { 'Good': 'bg-green-500', 'Fair': 'bg-yellow-500', 'Needs Attention': 'bg-red-500' };
                                        return ( <div key={condition} className="flex items-center justify-between"> <div className="flex items-center flex-1 mr-4"> <div className={`w-3 h-3 rounded-full mr-3 ${colors[condition]}`}></div><span className="text-sm font-medium text-gray-700">{condition}</span> </div><div className="flex items-center space-x-3"> <div className="w-24 bg-gray-200 rounded-full h-2"> <div className={`h-2 rounded-full ${colors[condition]}`} style={{width: `${percentage}%`}}></div></div><span className="text-sm font-bold text-gray-900 w-8 text-right">{count}</span> </div></div> );
                                    })}
                                </div>
                            ) : ( <div className="text-center py-8"> <div className="text-gray-400 mb-2">📊</div><p className="text-sm text-gray-500">No data to display yet</p></div> )}
                        </div>
                    </div>
                </section>
                <section className="mb-12">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 space-y-4 sm:space-y-0">
                        <h2 className="text-xl font-bold text-gray-900">Analysis History</h2>
                        <div className="relative">
                            <input type="search" placeholder="Search by breed or health status..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full sm:w-80 pl-10 pr-4 py-2 border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors" />
                            <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"> <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /> </svg>
                        </div>
                    </div>
                    <main>
                        {filteredHistory.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                                {filteredHistory.map(item => ( <HistoryCard key={item._id} item={item} /> ))}
                            </div>
                        ) : (
                            <div className="text-center py-16 border-2 border-dashed border-gray-200 rounded-xl bg-white">
                                <div className="mb-4"> <NoHistoryIcon /> </div>
                                <h3 className="text-lg font-medium text-gray-900 mb-2">{searchTerm ? 'No matching results' : 'No analyses yet'}</h3>
                                <p className="text-gray-500 mb-6 max-w-md mx-auto">{searchTerm ? 'Try adjusting your search terms.' : 'Start your first cattle analysis to see your history here.'}</p>
                                {!searchTerm && ( <button onClick={() => window.location.hash = '/start-analysis'} className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg shadow-sm text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-colors"> <AddIcon /> <span className="ml-2">Start Your First Analysis</span> </button> )}
                            </div>
                        )}
                    </main>
                </section>
                <section>
                    <h2 className="text-xl font-bold text-gray-900 mb-4 px-1">More Tools</h2>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
                        {allActions.map((action, index) => ( <QuickActionButton key={index} title={action.title} description={action.description} icon={action.icon} onClick={action.onClick} /> ))}
                    </div>
                </section>
            </div>
        </div>
    );
};

export default DashboardPage;