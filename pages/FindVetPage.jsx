import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next'; // ADDED

// Custom SVG Icons
const LocationIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-emerald-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg> );
const PhoneIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-emerald-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg> );
const ExternalLinkIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg> );

const vetDirectory = {
    // ... your vet data
};

const states = Object.keys(vetDirectory).sort();

// CHANGED: Component now accepts the 't' function as a prop
const StateDeptCard = ({ dept, t }) => (
    <div className="bg-gradient-to-br from-emerald-50 to-blue-50 rounded-xl shadow-lg p-6 border border-emerald-200 w-full mb-8 transition-all duration-300 hover:shadow-xl">
        <h3 className="text-xl font-bold text-emerald-800 mb-3">{dept.name}</h3>
        <p className="text-stone-600 mt-2 flex items-start">
            <LocationIcon />
            <span>{dept.address}</span>
        </p>
        <div className="mt-5">
            <a href={dept.website} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 transition-all duration-200">
                {t('visitOfficialWebsite')}
                <ExternalLinkIcon />
            </a>
        </div>
    </div>
);

// CHANGED: Component now accepts the 't' function as a prop
const ClinicCard = ({ clinic, t }) => (
    <div className=" bg-gradient-to-br from-emerald-50 via-white to-blue-50 rounded-xl shadow-md p-6 border border-stone-200 w-full flex flex-col transition-all duration-300 hover:shadow-lg">
        <div className="flex-grow">
            <h3 className="text-lg font-bold text-stone-800 mb-3">{clinic.name}</h3>
            <p className="text-stone-600 mb-3 flex items-start">
                <LocationIcon />
                <span>{clinic.address}</span>
            </p>
            {clinic.phone && (
                <p className="text-stone-600 flex items-center">
                    <PhoneIcon />
                    <span>{clinic.phone}</span>
                </p>
            )}
        </div>
        {clinic.website && (
            <div className="mt-5 pt-4 border-t border-stone-100">
                <a href={clinic.website} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center w-full px-4 py-2.5 border border-emerald-600 text-emerald-600 font-medium rounded-lg hover:bg-emerald-50 transition-colors duration-200 text-sm">
                    {t('visitWebsite')}
                    <ExternalLinkIcon />
                </a>
            </div>
        )}
    </div>
);

const FindVetPage = () => {
    const { t } = useTranslation(); // ADDED
    const [selectedState, setSelectedState] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    const handleStateChange = (e) => {
        const state = e.target.value;
        setSelectedState(state === "" ? null : state);
        setSearchTerm('');
    };

    const selectedStateData = selectedState ? vetDirectory[selectedState] : null;

    const filteredClinics = useMemo(() => {
        if (!selectedStateData) return [];
        const lowercasedFilter = searchTerm.toLowerCase();
        return selectedStateData.clinics.filter(clinic =>
            clinic.name.toLowerCase().includes(lowercasedFilter) ||
            clinic.address.toLowerCase().includes(lowercasedFilter) ||
            (clinic.phone && clinic.phone.toLowerCase().includes(lowercasedFilter))
        );
    }, [selectedStateData, searchTerm]);

    return (
        <div className="min-h-screen py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
                <header className="mb-8 text-center">
                    <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold leading-tight text-stone-900 mb-3">
                        {t('findVetPageTitle')}
                    </h1>
                    <p className="text-base sm:text-lg lg:text-xl text-stone-600 max-w-2xl mx-auto">
                        {t('findVetPageSubtitle')}
                    </p>
                </header>

                <div className="mb-8 max-w-2xl mx-auto">
                    <label htmlFor="state-select" className="block text-sm font-medium text-stone-700 mb-3 text-center">
                        {t('step1SelectState')}
                    </label>
                    <select
                        id="state-select"
                        onChange={handleStateChange}
                        className="w-full px-5 py-3 text-base sm:text-lg border border-stone-300 rounded-full bg-white shadow-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200"
                    >
                        <option value="">{t('selectStateDefault')}</option>
                        {states.map(state => <option key={state} value={state}>{state}</option>)}
                    </select>
                </div>

                {selectedStateData ? (
                    <div className="animate-fade-in">
                        <section className="mb-12">
                            <h2 className="text-xl sm:text-2xl font-bold text-center text-stone-800 mb-6">
                                {t('officialStateDepartment')}
                            </h2>
                            {/* CHANGED: Pass 't' function as a prop */}
                            <StateDeptCard dept={selectedStateData.mainDept} t={t} />
                        </section>

                        <section className="mt-12">
                            <h2 className="text-xl sm:text-2xl font-bold text-center text-stone-800 mb-6">
                                {t('findLocalClinicsIn', { state: selectedState })}
                            </h2>
                            <div className="mb-8 max-w-2xl mx-auto">
                                <input 
                                    type="search"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    placeholder={t('findVetSearchPlaceholder', { state: selectedState })}
                                    className="w-full px-5 py-3 text-sm sm:text-base border border-stone-300 rounded-full bg-white shadow-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200"
                                />
                            </div>
                            
                            {filteredClinics.length > 0 ? (
                                <>
                                    <div className="mb-6 text-center">
                                        <p className="text-sm sm:text-base text-stone-600">
                                            {t('clinicsFound', { count: filteredClinics.length, state: selectedState })}
                                        </p>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {/* CHANGED: Pass 't' function as a prop */}
                                        {filteredClinics.map((clinic, index) => (
                                            <ClinicCard key={index} clinic={clinic} t={t} />
                                        ))}
                                    </div>
                                </>
                            ) : (
                                <div className="text-center py-10">
                                    <div className="bg-white rounded-xl shadow-md p-6 border border-stone-200 max-w-md mx-auto">
                                        <p className="text-stone-600 text-sm sm:text-base">
                                            {t('noClinicsFound', { state: selectedState })}
                                        </p>
                                        <p className="text-stone-500 text-xs sm:text-sm mt-2">
                                            {t('adjustSearchTermsVet')}
                                        </p>
                                    </div>
                                </div>
                            )}
                        </section>
                    </div>
                ) : (
                    <div className="text-center py-12 sm:py-16">
                        <div className="border-2 border-dashed border-emerald-200 rounded-xl p-8 sm:p-12 bg-white/50 backdrop-blur-sm">
                            <div className="max-w-sm mx-auto">
                                <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 bg-gradient-to-br from-emerald-100 to-blue-100 rounded-full flex items-center justify-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 sm:w-10 sm:h-10 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                                </div>
                                <h3 className="text-lg sm:text-xl font-semibold text-stone-800 mb-2">
                                    {t('getStarted')}
                                </h3>
                                <p className="text-stone-600 text-sm sm:text-base">
                                    {t('getStartedVetPrompt')}
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default FindVetPage;