import React, { useState, useEffect, useRef } from 'react';
import Spinner from '../components/Spinner';
import { PositiveIcon, NeutralIcon, ConcernIcon, BreedDetectorIcon, VetAssistantIcon, LocalAdvisorIcon, BackIcon, ShareIcon } from '../components/Icons';

import html2canvas from 'html2canvas';

const InfoCard = ({ title, children, icon }) => (
    <div className="bg-white rounded-lg shadow-lg p-6 border border-stone-200">
        <div className="flex items-center border-b border-stone-200 pb-4 mb-4">
            <div className="text-emerald-600 mr-4">{icon}</div>
            <h2 className="text-xl font-bold text-stone-800">{title}</h2>
        </div>
        <div className="space-y-3 text-stone-700">{children}</div>
    </div>
);

const DetailsPage = () => {
    const [record, setRecord] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isSharing, setIsSharing] = useState(false);
    const reportRef = useRef(null);
    
    useEffect(() => {
        const fetchAnalysisDetails = async () => {
            setLoading(true);
            setError(null);
            try {
                
                const recordId = window.location.hash.split('/')[2];
                if (!recordId) {
                    throw new Error('Record ID not found in URL.');
                }

                
                const storedUser = sessionStorage.getItem('cattle-classifier-user');
                const user = storedUser ? JSON.parse(storedUser) : null;
                if (!user || !user.token) {
                    throw new Error('You must be logged in to view this page.');
                }

                
                const response = await fetch(`http://localhost:3001/api/analyses/${recordId}`, {
                    headers: {
                        'Authorization': `Bearer ${user.token}`
                    }
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || 'Could not load analysis');
                }

                const data = await response.json();
                setRecord(data);

            } catch (err) {
                console.error("Failed to fetch details:", err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchAnalysisDetails();
    }, []); 

    const handleShare = async () => {
        if (!reportRef.current || isSharing) return;

        setIsSharing(true);
        try {
            const element = reportRef.current;
            const canvas = await html2canvas(element, { scale: 2, backgroundColor: '#f5f5f4', useCORS: true }); 
            const link = document.createElement('a');
            link.download = `pashudrishti-report-${record?._id || Date.now()}.png`;
            link.href = canvas.toDataURL('image/png');
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (shareError) {
            console.error("Failed to generate report image:", shareError);
            setError("Sorry, there was an error generating the report image.");
        } finally {
            setIsSharing(false);
        }
    };

    if (loading) {
        return (
            <div className="h-[calc(100vh-64px)] w-full flex items-center justify-center">
                <div className="flex items-center text-stone-700"><Spinner /><span className="ml-2">Loading record...</span></div>
            </div>
        );
    }

    if (error || !record) {
        return (
            <div className="h-[calc(100vh-64px)] w-full flex items-center justify-center text-center px-4">
                <div>
                    <h2 className="text-xl font-semibold text-red-500">Could not load analysis</h2>
                    <p className="text-stone-600 mt-2">{error || 'The requested record does not exist.'}</p>
                    <button onClick={() => window.location.hash = '/dashboard'} className="mt-6 inline-block px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700">Back to Dashboard</button>
                </div>
            </div>
        );
    }
    
    const getConditionBadgeColor = (condition) => {
        if (!condition) return 'bg-stone-100 text-stone-800';
        switch (condition.toLowerCase()) {
            case 'good': return 'bg-emerald-100 text-emerald-800';
            case 'fair': return 'bg-yellow-100 text-yellow-800';
            case 'needs attention': return 'bg-red-100 text-red-800';
            default: return 'bg-stone-100 text-stone-800';
        }
    }
    
    const getObservationStatusStyle = (status) => {
        switch (status) {
            case 'Positive': return { icon: <PositiveIcon />, color: 'text-emerald-600' };
            case 'Neutral': return { icon: <NeutralIcon />, color: 'text-blue-600' };
            case 'Concern': return { icon: <ConcernIcon />, color: 'text-red-600' };
            default: return { icon: <NeutralIcon />, color: 'text-stone-600' };
        }
    };

    const { reportData, yoloData } = record;
    const { advanced_breed_detector, ai_veterinary_assistant, hyper_local_advisor } = reportData;

    return (
        <div className="bg-stone-50 min-h-screen">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="mb-6 flex justify-between items-center">
                     <button onClick={() => window.history.back()} className="inline-flex items-center text-emerald-600 hover:underline bg-transparent border-none cursor-pointer">
                         <BackIcon />
                         Back
                     </button>
                     <button
                         onClick={handleShare}
                         disabled={isSharing}
                         className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:bg-emerald-400"
                     >
                         {isSharing ? (<><Spinner /><span>Generating...</span></>) : (<><ShareIcon /><span>Share Report</span></>)}
                     </button>
                </div>
                
                <div ref={reportRef} className="bg-stone-50 p-4 sm:p-8 rounded-lg">
                    <header className="text-center mb-8">
                        <h1 className="text-3xl font-bold text-stone-900">Pashu Sahayak AI Report</h1>
                        <p className="text-md text-stone-500">Analyzed on {new Date(record.createdAt).toLocaleString()}</p>
                    </header>

                    <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                        <div className="lg:col-span-2">
                            <img src={record.image} alt={advanced_breed_detector.primary_breed} className="w-full h-auto object-cover rounded-lg shadow-xl" />
                        </div>

                        <div className="lg:col-span-3 space-y-8">
                           <InfoCard title="Gemini AI: Detailed Breed Analysis" icon={<BreedDetectorIcon />}>
                                <p><strong>Primary Breed (Gemini):</strong> <span className="font-bold text-emerald-700">{advanced_breed_detector.primary_breed}</span></p>
                                <p><strong>Confidence Score (Gemini):</strong> <span className="font-semibold">{(advanced_breed_detector.confidence_score * 100).toFixed(1)}%</span></p>
                                
                                {/* {yoloData && yoloData.length > 0 && (
                                    <p className="text-sm text-stone-600 pt-2 border-t mt-2">
                                        <strong>Initial Detection (Local Model):</strong> {yoloData[0].breed} at {Math.round(yoloData[0].confidence * 100)+28}% confidence.
                                    </p>
                                )} */}

                                <div className="pt-3 mt-3 border-t border-stone-200">
                                    <h4 className="font-semibold text-stone-800 mb-2">Breed Profile</h4>
                                    <p><strong>Origin:</strong> <span>{advanced_breed_detector.breed_origin}</span></p>
                                    <p><strong>Formation:</strong> <span>{advanced_breed_detector.breed_formation}</span></p>
                                </div>
                                
                                <div className="pt-3 mt-3 border-t border-stone-200">
                                    <h4 className="font-semibold text-stone-800 mb-2">Key Identifiers</h4>
                                    <ul className="list-disc list-inside text-sm text-stone-600 space-y-1">
                                        {advanced_breed_detector.key_identifiers.map((id, i) => <li key={i}>{id}</li>)}
                                    </ul>
                                </div>

                                {advanced_breed_detector.secondary_breeds && advanced_breed_detector.secondary_breeds.length > 0 && (
                                    <div className="pt-3 mt-3 border-t border-stone-200">
                                        <h4 className="font-semibold text-stone-800 mb-2">Possible Cross-Breed Influence</h4>
                                        <ul className="space-y-1">
                                            {advanced_breed_detector.secondary_breeds.map((sb, i) => (
                                                <li key={i} className="text-sm">
                                                    <strong>{sb.breed}:</strong> <span className="text-stone-600">~{(sb.confidence_score * 100).toFixed(0)}% confidence</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </InfoCard>
                            
                           <InfoCard title="AI Veterinary Assistant" icon={<VetAssistantIcon />}>
                                <div className="space-y-4">
                                    <p><strong>Overall Health:</strong> <span className={`px-2 py-1 rounded-full text-sm font-medium ${getConditionBadgeColor(ai_veterinary_assistant.overall_health_status)}`}>{ai_veterinary_assistant.overall_health_status}</span></p>
                                    <h4 className="font-semibold text-stone-800 pt-4 border-t border-stone-200">Detailed Observations:</h4>
                                    <ul className="space-y-3">
                                        {ai_veterinary_assistant.detailed_observations.map((obs, i) => {
                                            const { icon, color } = getObservationStatusStyle(obs.status);
                                            return (
                                                <li key={i} className="flex items-start">
                                                    <span className={`mr-3 mt-1 flex-shrink-0 ${color}`}>{icon}</span>
                                                    <div>
                                                        <span className="font-semibold">{obs.area}:</span> {obs.observation}
                                                    </div>
                                                </li>
                                            );
                                        })}
                                    </ul>

                                    <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-md">
                                       <p className="font-semibold text-emerald-800">Recommendation:</p>
                                       <p>{ai_veterinary_assistant.veterinary_recommendation}</p>
                                    </div>
                                </div>
                            </InfoCard>
                            
                           <InfoCard title={`Hyper-Local Advisor (${hyper_local_advisor.language})`} icon={<LocalAdvisorIcon />}>
                               <div className="prose prose-sm max-w-none text-stone-700">
                                   <h4>Feeding Tip</h4>
                                   <p>{hyper_local_advisor.feeding_tip}</p>
                                   <h4>Housing Tip</h4>
                                   <p>{hyper_local_advisor.housing_tip}</p>
                                   <h4>Seasonal Tip</h4>
                                   <p>{hyper_local_advisor.seasonal_tip}</p>
                               </div>
                            </InfoCard>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DetailsPage;