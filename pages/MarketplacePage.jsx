import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next'; // ADDED

const marketDirectory = {
    'Odisha': [
        { name: 'OMFED (Odisha State Cooperative Milk Producers\' Federation)', location: 'Bhubaneswar, Odisha', products: ['Fresh Milk', 'Ghee', 'Curd'], website: 'http://www.omfed.com/' },
        { name: 'Pragati Milk', location: 'Cuttack, Odisha', products: ['Milk', 'Paneer', 'Butter'], website: 'https://pragatidairy.com/' },
        { name: 'Milky Moo', location: 'Bhubaneswar, Odisha', products: ['Value-added Milk Products', 'Paneer'], website: 'https://www.milkymoo.com/' },
    ],
    // ... your other state data
};

const states = Object.keys(marketDirectory).sort();

const ExternalLinkIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2 group-hover:translate-x-0.5 transition-transform duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
  </svg>
);

// CHANGED: Component now accepts the 't' function as a prop
const BuyerCard = ({ buyer, t }) => (
    <div className="bg-gradient-to-br from-emerald-50 via-white to-blue-50 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-4 sm:p-6 border border-emerald-100 w-full flex flex-col transform hover:-translate-y-1">
        <div className="flex-grow">
            <h3 className="text-lg sm:text-xl font-bold text-stone-800 leading-tight mb-2">{buyer.name}</h3>
            <p className="text-sm sm:text-base text-stone-500 mb-4">{buyer.location}</p>
            <div className="mb-4">
                <p className="font-semibold text-stone-700 mb-3 text-sm">{t('productsSourced')}</p>
                <div className="flex flex-wrap gap-1.5 sm:gap-2">
                    {buyer.products.map(product => (
                        <span key={product} className="px-2 py-1 sm:px-3 sm:py-1 text-xs font-medium bg-emerald-100 text-emerald-800 rounded-full border border-emerald-200">
                            {product}
                        </span>
                    ))}
                </div>
            </div>
        </div>
        <div className="mt-4 pt-4 border-t border-stone-100">
            <a href={buyer.website} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center w-full px-4 py-2.5 sm:py-3 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-[#557369] hover:from-emerald-700 hover:bg-[#557339] transition-all duration-200 group hover:p-4 hover:relative">
                {t('visitWebsite')}
                <ExternalLinkIcon />
            </a>
        </div>
    </div>
);

const MarketplacePage = () => {
    const { t } = useTranslation(); // ADDED
    const [selectedState, setSelectedState] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    const handleStateChange = (e) => {
        const state = e.target.value;
        setSelectedState(state === "" ? null : state);
        setSearchTerm('');
    };

    const selectedStateBuyers = selectedState ? marketDirectory[selectedState] : null;

    const filteredBuyers = useMemo(() => {
        if (!selectedStateBuyers) return [];
        const lowercasedFilter = searchTerm.toLowerCase();
        return selectedStateBuyers.filter(buyer =>
            buyer.name.toLowerCase().includes(lowercasedFilter) ||
            buyer.location.toLowerCase().includes(lowercasedFilter) ||
            buyer.products.some(prod => prod.toLowerCase().includes(lowercasedFilter))
        );
    }, [selectedStateBuyers, searchTerm]);

    return (
        <div className="min-h-screen ">
            <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-6 sm:py-8 lg:py-12">
                <header className="mb-6 sm:mb-8 text-center">
                    <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold leading-tight text-stone-900 mb-2 sm:mb-3">
                        {t('marketplacePageTitle')}
                    </h1>
                    <p className="text-base sm:text-lg lg:text-xl text-stone-600 max-w-2xl mx-auto">
                        {t('marketplacePageSubtitle')}
                    </p>
                </header>

                <div className="mb-6 sm:mb-8 max-w-2xl mx-auto">
                    <label htmlFor="state-select" className="block text-sm font-medium text-stone-700 mb-2 sm:mb-3 text-center">
                        {t('step1SelectState')}
                    </label>
                    <select
                        id="state-select"
                        onChange={handleStateChange}
                        className="w-full px-4 sm:px-5 py-3 sm:py-4 text-base sm:text-lg border border-stone-300 rounded-full bg-white shadow-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200"
                    >
                        <option value="">{t('selectStateDefault')}</option>
                        {states.map(state => <option key={state} value={state}>{state}</option>)}
                    </select>
                </div>
                
                {selectedState ? (
                    <div className="animate-fade-in">
                        <div className="mb-6 sm:mb-8 max-w-2xl mx-auto">
                            <label htmlFor="search-input" className="block text-sm font-medium text-stone-700 mb-2 text-center">
                                {t('step2SearchBuyers')}
                            </label>
                            <input 
                                id="search-input"
                                type="search"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder={t('marketplaceSearchPlaceholder', { state: selectedState })}
                                className="w-full px-4 sm:px-5 py-3 sm:py-4 text-sm sm:text-base border border-stone-300 rounded-full bg-white shadow-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200"
                            />
                        </div>
                        
                        {filteredBuyers.length > 0 ? (
                            <>
                                <div className="mb-6 text-center">
                                    <p className="text-sm sm:text-base text-stone-600">
                                        {t('buyersFound', { count: filteredBuyers.length, state: selectedState })}
                                    </p>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
                                    {/* CHANGED: Pass 't' function as a prop */}
                                    {filteredBuyers.map((buyer, index) => <BuyerCard key={index} buyer={buyer} t={t} />)}
                                </div>
                            </>
                        ) : (
                            <div className="text-center py-12 sm:py-16">
                                <div className="bg-white rounded-xl shadow-md p-6 sm:p-8 border border-stone-200 max-w-md mx-auto">
                                    <p className="text-stone-600 text-sm sm:text-base">
                                        {t('noBuyersFound', { state: selectedState })}
                                    </p>
                                    <p className="text-stone-500 text-xs sm:text-sm mt-2">
                                        {t('adjustSearchOrBrowse')}
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="text-center py-12 sm:py-16">
                        <div className="border-2 border-dashed border-emerald-200 rounded-xl p-8 sm:p-12 bg-white/50 backdrop-blur-sm">
                            <div className="max-w-sm mx-auto">
                                <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 bg-gradient-to-br from-emerald-100 to-blue-100 rounded-full flex items-center justify-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 sm:w-10 sm:h-10 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" /></svg>
                                </div>
                                <h3 className="text-lg sm:text-xl font-semibold text-stone-800 mb-2">
                                    {t('getStarted')}
                                </h3>
                                <p className="text-stone-600 text-sm sm:text-base">
                                    {t('getStartedPrompt')}
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MarketplacePage;