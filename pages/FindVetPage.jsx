import React, { useState, useMemo } from 'react';

// Custom SVG Icons
const LocationIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-emerald-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const PhoneIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-emerald-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
  </svg>
);

const ExternalLinkIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
  </svg>
);

const vetDirectory = {
    'Gujarat': {
        mainDept: {
            name: 'Animal Husbandry Department, Govt. of Gujarat',
            address: 'Block-8, Dr. Jivraj Mehta Bhavan, Gandhinagar, Gujarat',
            website: 'https://agri.gujarat.gov.in/animal-husbandry-department.htm'
        },
        clinics: [
            { name: 'District Veterinary Polyclinic, Anand', address: 'Amul Dairy Rd, Anand, Gujarat', phone: '+91-2692-240390' },
            { name: 'Government Veterinary Hospital, Rajkot', address: 'Race Course Ring Rd, Rajkot, Gujarat', phone: '+91-281-2475586' },
            { name: 'Jeevdaya Charitable Trust Animal Hospital', address: 'Panjrapole, Ambawadi, Ahmedabad, Gujarat', website: 'https://www.jeevdaya.org/' },
        ]
    },
    'Odisha': {
        mainDept: {
            name: 'Fisheries & Animal Resources Development Department, Govt. of Odisha',
            address: 'Secretariat, Bhubaneswar, Odisha - 751001',
            website: 'https://www.fardodisha.gov.in/'
        },
        clinics: [
            { name: 'District Veterinary Hospital, Bhubaneswar', address: 'Saheed Nagar, Bhubaneswar, Odisha', phone: '+91-674-2540183' },
            { name: 'Government Veterinary Dispensary, Cuttack', address: 'Buxi Bazaar, Cuttack, Odisha', phone: '+91-671-2301543' },
        ]
    },
    'Uttar Pradesh': {
        mainDept: {
            name: 'Animal Husbandry Department, Uttar Pradesh',
            address: 'Badshahbagh, Lucknow, Uttar Pradesh',
            website: 'http://www.animalhusbandry.upsdc.gov.in/'
        },
        clinics: [
            { name: 'Government Veterinary Hospital, Lucknow', address: 'Nirala Nagar, Lucknow, Uttar Pradesh' },
            { name: 'IVRI Polyclinic, Bareilly', address: 'Izatnagar, Bareilly, Uttar Pradesh' },
        ]
    },
    'Maharashtra': {
        mainDept: {
            name: 'Commissioner of Animal Husbandry, Maharashtra State',
            address: 'Aundh, Pune, Maharashtra - 411007',
            website: 'https://ahd.maharashtra.gov.in/'
        },
        clinics: [
            { name: 'Mumbai Veterinary College Hospital', address: 'Parel, Mumbai, Maharashtra', website: 'https://mvc.mafsu.in/hospital/' },
            { name: 'District Veterinary Polyclinic, Pune', address: 'Ganeshkhind Road, Pune, Maharashtra' },
        ]
    },
    'Karnataka': {
        mainDept: {
            name: 'Department of Animal Husbandry and Veterinary Services, Karnataka',
            address: 'Vishweshwaraiah Mini Tower, Dr. B.R. Ambedkar Veedhi, Bengaluru, Karnataka',
            website: 'https://ahvs.karnataka.gov.in/'
        },
        clinics: [
            { name: 'Veterinary Hospital, Hebbal', address: 'Hebbal, Bengaluru, Karnataka' },
            { name: 'Karuna Animal Welfare Association', address: 'Kengeri Satellite Town, Bengaluru, Karnataka', website: 'https://karunaanimalwelfare.org/' },
        ]
    },
    'Punjab': {
        mainDept: {
            name: 'Department of Animal Husbandry, Fisheries & Dairy Development, Punjab',
            address: 'Sector 17, Chandigarh, Punjab',
            website: 'https://pashudhanpunjab.org/'
        },
        clinics: [
            { name: 'Guru Angad Dev Veterinary and Animal Sciences University (GADVASU)', address: 'Ludhiana, Punjab', website: 'https://www.gadvasu.in/' },
            { name: 'SPCA Hospital & Shelter', address: 'Sector 38 West, Chandigarh', },
        ]
    },
    'Rajasthan': {
        mainDept: {
            name: 'Department of Animal Husbandry, Government of Rajasthan',
            address: 'Pashudhan Bhawan, Gandhinagar Mod, Tonk Road, Jaipur, Rajasthan',
            website: 'http://animalhusbandry.rajasthan.gov.in/'
        },
        clinics: [
            { name: 'Government Veterinary Hospital, Jaipur', address: 'Chainpura, Jaipur, Rajasthan' },
            { name: 'SPCA Hospital, Jodhpur', address: 'Near Kaylana Lake, Jodhpur, Rajasthan' },
        ]
    },
    'Madhya Pradesh': {
        mainDept: {
            name: 'Animal Husbandry and Dairying Department, Madhya Pradesh',
            address: 'Kamdhenu Bhawan, Vaishali Nagar, Bhopal, Madhya Pradesh',
            website: 'http://www.mpdah.gov.in/'
        },
        clinics: [
            { name: 'State Veterinary Hospital, Bhopal', address: 'Jahangirabad, Bhopal, Madhya Pradesh' },
            { name: 'Govt. Veterinary Hospital, Indore', address: 'Navlakha, Indore, Madhya Pradesh' },
        ]
    },
    'Andhra Pradesh': {
        mainDept: {
            name: 'Animal Husbandry Department, Govt of Andhra Pradesh',
            address: 'NTR Admin Block, PNBS, Vijayawada, Andhra Pradesh',
            website: 'https://ahd.aptonline.in/'
        },
        clinics: [
            { name: 'Super Specialty Veterinary Hospital, Vijayawada', address: 'Labbipet, Vijayawada, Andhra Pradesh' },
            { name: 'District Veterinary Hospital, Visakhapatnam', address: 'Maharanipeta, Visakhapatnam, Andhra Pradesh' },
        ]
    },
    'Telangana': {
        mainDept: {
            name: 'Animal Husbandry Department, Government of Telangana',
            address: 'Shantinagar, Masab Tank, Hyderabad, Telangana',
            website: 'https://animalhusbandry.telangana.gov.in/'
        },
        clinics: [
            { name: 'Central Veterinary Hospital, Hyderabad', address: 'Narayanguda, Hyderabad, Telangana' },
            { name: 'District Veterinary Hospital, Warangal', address: 'Subedari, Hanamkonda, Warangal, Telangana' },
        ]
    },
    'Tamil Nadu': {
        mainDept: {
            name: 'Department of Animal Husbandry and Veterinary Services, Tamil Nadu',
            address: 'DMS Complex, Teynampet, Chennai, Tamil Nadu',
            website: 'https://www.tn.gov.in/department/ahd'
        },
        clinics: [
            { name: 'Madras Veterinary College Hospital', address: 'Vepery High Road, Vepery, Chennai, Tamil Nadu' },
            { name: 'District Veterinary Polyclinic, Coimbatore', address: 'RS Puram, Coimbatore, Tamil Nadu' },
        ]
    },
    'West Bengal': {
        mainDept: {
            name: 'Animal Resources Development Department, Government of West Bengal',
            address: 'LB-2, Sector-III, Salt Lake City, Kolkata, West Bengal',
            website: 'https://www.wbandard.gov.in/'
        },
        clinics: [
            { name: 'Belgachia Veterinary Hospital', address: 'KBT Sarani, Belgachia, Kolkata, West Bengal' },
            { name: 'Government Veterinary Hospital, Siliguri', address: 'Sevoke Road, Siliguri, West Bengal' },
        ]
    },
    'Bihar': {
        mainDept: {
            name: 'Animal & Fisheries Resources Dept, Govt of Bihar',
            address: 'Vikas Bhawan, New Secretariat, Patna, Bihar',
            website: 'https://ahd.bihar.gov.in/'
        },
        clinics: [
            { name: 'Bihar Veterinary College Hospital', address: 'Patna Airport Road, Sheikhpura, Patna, Bihar' },
            { name: 'Government Veterinary Hospital, Gaya', address: 'Station Road, Gaya, Bihar' },
        ]
    }
};

const states = Object.keys(vetDirectory).sort();

const StateDeptCard = ({ dept }) => (
    <div className="bg-gradient-to-br from-emerald-50 to-blue-50 rounded-xl shadow-lg p-6 border border-emerald-200 w-full mb-8 transition-all duration-300 hover:shadow-xl">
        <h3 className="text-xl font-bold text-emerald-800 mb-3">{dept.name}</h3>
        <p className="text-stone-600 mt-2 flex items-start">
            <LocationIcon />
            <span>{dept.address}</span>
        </p>
        <div className="mt-5">
            <a 
                href={dept.website} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 transition-all duration-200"
            >
                Visit Official Website
                <ExternalLinkIcon />
            </a>
        </div>
    </div>
);

const ClinicCard = ({ clinic }) => (
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
                <a 
                    href={clinic.website} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="inline-flex items-center justify-center w-full px-4 py-2.5 border border-emerald-600 text-emerald-600 font-medium rounded-lg hover:bg-emerald-50 transition-colors duration-200 text-sm"
                >
                    Visit Website
                    <ExternalLinkIcon />
                </a>
            </div>
        )}
    </div>
);

const FindVetPage = () => {
    const [selectedState, setSelectedState] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    const handleStateChange = (e) => {
        const state = e.target.value;
        setSelectedState(state === "" ? null : state);
        setSearchTerm(''); // Reset search on state change
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
                        Find Official Veterinary Resources
                    </h1>
                    <p className="text-base sm:text-lg lg:text-xl text-stone-600 max-w-2xl mx-auto">
                        Select your state to find official government departments and local clinics.
                    </p>
                </header>

                <div className="mb-8 max-w-2xl mx-auto">
                    <label htmlFor="state-select" className="block text-sm font-medium text-stone-700 mb-3 text-center">
                        Step 1: Select Your State
                    </label>
                    <select
                        id="state-select"
                        onChange={handleStateChange}
                        className="w-full px-5 py-3 text-base sm:text-lg border border-stone-300 rounded-full bg-white shadow-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200"
                    >
                        <option value="">-- Please select a state --</option>
                        {states.map(state => <option key={state} value={state}>{state}</option>)}
                    </select>
                </div>

                {selectedStateData ? (
                    <div className="animate-fade-in">
                        <section className="mb-12">
                            <h2 className="text-xl sm:text-2xl font-bold text-center text-stone-800 mb-6">
                                Official State Department
                            </h2>
                            <StateDeptCard dept={selectedStateData.mainDept} />
                        </section>

                        <section className="mt-12">
                            <h2 className="text-xl sm:text-2xl font-bold text-center text-stone-800 mb-6">
                                Find Local Clinics in {selectedState}
                            </h2>
                            <div className="mb-8 max-w-2xl mx-auto">
                                <input 
                                    type="search"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    placeholder={`Search by name, city, or phone in ${selectedState}...`}
                                    className="w-full px-5 py-3 text-sm sm:text-base border border-stone-300 rounded-full bg-white shadow-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200"
                                />
                            </div>
                            
                            {filteredClinics.length > 0 ? (
                                <>
                                    <div className="mb-6 text-center">
                                        <p className="text-sm sm:text-base text-stone-600">
                                            Found {filteredClinics.length} clinic{filteredClinics.length !== 1 ? 's' : ''} in {selectedState}
                                        </p>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {filteredClinics.map((clinic, index) => (
                                            <ClinicCard key={index} clinic={clinic} />
                                        ))}
                                    </div>
                                </>
                            ) : (
                                <div className="text-center py-10">
                                    <div className="bg-white rounded-xl shadow-md p-6 border border-stone-200 max-w-md mx-auto">
                                        <p className="text-stone-600 text-sm sm:text-base">
                                            No clinics found matching your search in {selectedState}.
                                        </p>
                                        <p className="text-stone-500 text-xs sm:text-sm mt-2">
                                            Try adjusting your search terms.
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
                                    <svg 
                                        xmlns="http://www.w3.org/2000/svg" 
                                        className="w-8 h-8 sm:w-10 sm:h-10 text-emerald-500" 
                                        fill="none" 
                                        viewBox="0 0 24 24" 
                                        stroke="currentColor"
                                    >
                                        <path 
                                            strokeLinecap="round" 
                                            strokeLinejoin="round" 
                                            strokeWidth={2} 
                                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" 
                                        />
                                    </svg>
                                </div>
                                <h3 className="text-lg sm:text-xl font-semibold text-stone-800 mb-2">
                                    Get Started
                                </h3>
                                <p className="text-stone-600 text-sm sm:text-base">
                                    Select a state to view veterinary resources and clinics in your area.
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