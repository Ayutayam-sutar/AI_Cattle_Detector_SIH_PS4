import React, { useState } from 'react';
import { getLivestockValuation } from '../services/geminiService';
import Spinner from '../components/Spinner';
import { useTranslation } from 'react-i18next'; // ADDED

const initialInputs = {
    breed: '',
    age: '',
    milkYield: '',
    health: 'Good',
    location: '',
};

const ValuationSkeleton = () => (
    <div className="text-center w-full animate-pulse">
        <div className="h-6 bg-stone-300 rounded-md w-3/4 mx-auto mb-4"></div>
        <div className="h-12 bg-stone-400 rounded-md w-1/2 mx-auto my-6"></div>
        <div className="mt-6 text-left">
            <div className="h-5 bg-stone-300 rounded-md w-1/3 mb-4"></div>
            <div className="space-y-2">
                <div className="h-4 bg-stone-200 rounded-md w-full"></div>
                <div className="h-4 bg-stone-200 rounded-md w-5/6"></div>
                <div className="h-4 bg-stone-200 rounded-md w-3/4"></div>
            </div>
        </div>
    </div>
);


const ValuatorPage = () => {
    const { t } = useTranslation(); // ADDED
    const [inputs, setInputs] = useState(initialInputs);
    const [valuation, setValuation] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    // ADDED: Array for health options to make them translatable
    const healthOptions = [
        { value: 'Good', label: t('healthGood') },
        { value: 'Fair', label: t('healthFair') },
        { value: 'Needs Attention', label: t('healthNeedsAttention') },
    ];

    const handleInputChange = (e) => {
        setInputs({ ...inputs, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);
        setValuation(null);
        try {
            const result = await getLivestockValuation(inputs);
            setValuation(result);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An unknown error occurred');
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleReset = () => {
        setInputs(initialInputs);
        setValuation(null);
        setError(null);
    };

    const isFormIncomplete = !inputs.breed || !inputs.age || !inputs.milkYield || !inputs.location;

    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <header className="text-center mb-12">
                <h1 className="text-4xl font-bold leading-tight text-stone-900">
                    {t('valuatorPageTitle')}
                </h1>
                <p className="mt-2 text-lg text-stone-600">
                    {t('valuatorPageSubtitle')}
                </p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 animate-slide-in-elliptic-top-fwd">
                <div className="bg-white p-8 rounded-lg shadow-lg border border-stone-200  bg-gradient-to-br from-emerald-50 via-white to-blue-50 ">
                    {valuation && !isLoading ? (
                         <div className="flex flex-col items-center justify-center h-full text-center">
                            <h2 className="text-2xl font-bold text-stone-800 mb-4">{t('valuationComplete')}</h2>
                            <p className="text-stone-600 mb-8">{t('valuationCompleteInfo')}</p>
                            <button 
                                onClick={handleReset}
                                className="w-full inline-flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#557369] hover:bg-[#557339]"
                            >
                                {t('startNewValuation')}
                            </button>
                        </div>
                    ) : (
                        <>
                            <h2 className="text-2xl font-bold text-stone-800 mb-6">{t('enterAnimalDetails')}</h2>
                            <form onSubmit={handleSubmit} className="space-y-6 ">
                                <div>
                                    <label htmlFor="breed" className="block text-sm font-medium text-stone-700">{t('breedLabel')}</label>
                                    <input type="text" name="breed" id="breed" value={inputs.breed} onChange={handleInputChange} required className="mt-1 block w-full px-4 py-3 bg-stone-100 border border-stone-200 rounded-md shadow-sm placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-emerald-500" placeholder={t('breedPlaceholder')} />
                                </div>
                                <div>
                                    <label htmlFor="age" className="block text-sm font-medium text-stone-700">{t('ageLabel')}</label>
                                    <input type="number" name="age" id="age" value={inputs.age} onChange={handleInputChange} required min="0" step="0.5" className="mt-1 block w-full px-4 py-3 bg-stone-100 border border-stone-200 rounded-md shadow-sm placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-emerald-500" placeholder={t('agePlaceholder')} />
                                </div>
                                <div>
                                    <label htmlFor="milkYield" className="block text-sm font-medium text-stone-700">{t('milkYieldLabel')}</label>
                                    <input type="number" name="milkYield" id="milkYield" value={inputs.milkYield} onChange={handleInputChange} required min="0" className="mt-1 block w-full px-4 py-3 bg-stone-100 border border-stone-200 rounded-md shadow-sm placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-emerald-500" placeholder={t('milkYieldPlaceholder')} />
                                </div>
                                <div>
                                    <label htmlFor="health" className="block text-sm font-medium text-stone-700">{t('healthConditionLabel')}</label>
                                    <select name="health" id="health" value={inputs.health} onChange={handleInputChange} className="mt-1 block w-full px-4 py-3 bg-stone-100 border border-stone-200 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500">
                                        {/* CHANGED: Options are now mapped from a translatable array */}
                                        {healthOptions.map(option => (
                                            <option key={option.value} value={option.value}>{option.label}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label htmlFor="location" className="block text-sm font-medium text-stone-700">{t('locationLabel')}</label>
                                    <input type="text" name="location" id="location" value={inputs.location} onChange={handleInputChange} required className="mt-1 block w-full px-4 py-3 bg-stone-100 border border-stone-200 rounded-md shadow-sm placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-emerald-500" placeholder={t('locationPlaceholder')} />
                                </div>
                                <div>
                                    <button type="submit" disabled={isLoading || isFormIncomplete} className="w-full inline-flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#557369] hover:bg-[#557339] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:bg-red-400 disabled:cursor-not-allowed">
                                        {isLoading ? <Spinner /> : t('calculateValueButton')}
                                    </button>
                                </div>
                            </form>
                        </>
                    )}
                </div>

                <div className="flex items-center justify-center bg-stone-100 p-8 rounded-lg border-2 border-dashed border-stone-300 min-h-[300px] ">
                    {isLoading && ( <ValuationSkeleton /> )}
                    {error && (
                         <div className="text-center text-red-600">
                             <p><strong>{t('errorTitle')}</strong></p>
                             <p>{error}</p>
                         </div>
                    )}
                    {valuation && !isLoading && (
                        <div className="text-center animate-fade-in w-full ">
                             <h3 className="text-lg font-medium text-stone-600">{t('estimatedMarketValue')}</h3>
                             <p className="text-4xl lg:text-5xl font-bold text-emerald-600 my-4">{valuation.estimated_market_value_inr}</p>
                             <div className="mt-6 text-left">
                                 <h4 className="font-semibold text-stone-800 mb-2">{t('keyValuationFactors')}</h4>
                                 <ul className="list-disc list-inside text-stone-700 space-y-1">
                                    {valuation.valuation_factors.map((factor, i) => <li key={i}>{factor}</li>)}
                                 </ul>
                             </div>
                        </div>
                    )}
                     {!valuation && !isLoading && !error && (
                         <div className="text-center text-stone-500">
                            <p>{t('valuatorInfoBox')}</p>
                         </div>
                     )}
                </div>
            </div>
        </div>
    );
};

export default ValuatorPage;