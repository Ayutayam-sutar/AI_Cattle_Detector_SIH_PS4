import React from 'react';
import ImageUploader from '../components/ImageUploader';
import { getPashuSahayakReport, detectBreedWithYOLOv8 } from '../services/geminiService';
import CameraCapture from '../components/CameraCapture';
import { CameraIcon as TakePhotoIcon } from '../components/Icons';
import { useTranslation } from 'react-i18next'; // ADDED

// CHANGED: Component now accepts the 't' function as a prop
const LoadingOverlay = ({ t }) => (
  <div className="absolute inset-0 bg-white bg-opacity-90 flex flex-col items-center justify-center z-50 rounded-lg text-center p-4">
      <style>{`
        .cow-scanner { width: 150px; height: 100px; position: relative; background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="rgba(0,0,0,0.2)" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M14.25 9.75 16.5 12l-2.25 2.25m-4.5 0L7.5 12l2.25-2.25M6 20.25h12A2.25 2.25 0 0 0 20.25 18V9.75a2.25 2.25 0 0 0-2.25-2.25H6A2.25 2.25 0 0 0 3.75 9.75v8.25A2.25 2.25 0 0 0 6 20.25Z" /></svg>'); background-size: contain; background-repeat: no-repeat; background-position: center; }
        .scan-line { position: absolute; top: 0; left: 0; right: 0; height: 3px; background-color: #16a34a; box-shadow: 0 0 10px #16a34a; animation: scan 2s infinite cubic-bezier(0.4, 0, 0.2, 1); }
        @keyframes scan { 0%, 100% { top: 0%; } 50% { top: 100%; } }
      `}</style>
    <div className="cow-scanner"><div className="scan-line"></div></div>
    <p className="text-gray-800 text-lg mt-4 animate-pulse">{t('loadingAnalysis')}</p>
    <p className="text-gray-600 text-sm mt-2">{t('loadingWait')}</p>
    <p className="text-gray-600 text-sm mt-10">{t('loadingDisclaimer')}</p>
  </div>
);

const AnalyzerPage = () => {
    const { t } = useTranslation(); // ADDED
    const [selectedImage, setSelectedImage] = React.useState(null);
    const [isCameraOpen, setIsCameraOpen] = React.useState(false);
    const [location, setLocation] = React.useState('');
    const [language, setLanguage] = React.useState('English');
    const [isLoading, setIsLoading] = React.useState(false);
    const [error, setError] = React.useState(null);
    const [yoloResult, setYoloResult] = React.useState(null);
    const [loadingMessage, setLoadingMessage] = React.useState('');

    // ADDED: Array of language options for the dropdown
    const languageOptions = [
        { value: 'English', label: t('langEnglish') }, { value: 'Hindi', label: t('langHindi') },
        { value: 'Odia', label: t('langOdia') }, { value: 'Bengali', label: t('langBengali') },
        { value: 'Telugu', label: t('langTelugu') }, { value: 'Tamil', label: t('langTamil') },
        { value: 'Marathi', label: t('langMarathi') }
    ];

    const dataURLtoFile = (dataurl, filename) => {
        const arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1], bstr = atob(arr[1]);
        let n = bstr.length;
        const u8arr = new Uint8Array(n);
        while (n--) { u8arr[n] = bstr.charCodeAt(n); }
        return new File([u8arr], filename, { type: mime });
    };

    const handleFileSelect = (file) => {
        setError(null);
        const reader = new FileReader();
        reader.onload = () => {
            setSelectedImage({ file: file, dataUrl: reader.result, mimeType: file.type });
        };
        reader.readAsDataURL(file);
    };
    
    const handleCapture = (dataUrl) => {
        setError(null);
        setIsCameraOpen(false);
        const file = dataURLtoFile(dataUrl, `capture_${Date.now()}.jpeg`);
        setSelectedImage({ file: file, dataUrl: dataUrl, mimeType: 'image/jpeg' });
    }
    
    const handleCloseCamera = () => setIsCameraOpen(false);

    const handleAnalyze = async () => {
        if (!selectedImage || !selectedImage.file) {
            setError(t('errorSelectImage')); return;
        }
        if (!location.trim()) {
            setError(t('errorEnterLocation')); return;
        }

        setIsLoading(true);
        setError(null);
        setYoloResult(null);

        try {
            setLoadingMessage(t('loadingMessageYolo'));
            const yoloResultData = await detectBreedWithYOLOv8(selectedImage.file);
            const detectedBreedName = yoloResultData && yoloResultData.length > 0 ? yoloResultData[0].breed : null;
            setYoloResult(yoloResultData);

            setLoadingMessage(t('loadingMessageGemini'));
            const finalReport = await getPashuSahayakReport(
                selectedImage.dataUrl.split(',')[1], selectedImage.mimeType, location, language, detectedBreedName
            );
            
            setLoadingMessage(t('loadingMessageSaving'));
            const user = JSON.parse(sessionStorage.getItem('cattle-classifier-user'));
            
            if (!user || !user.token) { throw new Error(t('errorLoginToSave')); }

            const response = await fetch('http://localhost:3001/api/analyses', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${user.token}` },
                body: JSON.stringify({
                    image: selectedImage.dataUrl, location: location, analysisData: finalReport, yoloData: yoloResultData
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || t('errorFailedToSave'));
            }
            const savedAnalysis = await response.json();
            window.location.hash = `/details/${savedAnalysis._id}`;
        } catch (err) {
            console.error("Full hybrid analysis failed:", err);
            setError(err instanceof Error ? err.message : t('errorUnexpected'));
            setIsLoading(false);
        }
    };

    // CHANGED: Stepper now uses translation keys
    const steps = [t('stepperSelectImage'), t('stepperAddDetails')];
    const currentStep = !selectedImage ? 0 : 1;

    return (
        <>
            {isCameraOpen && <CameraCapture onCapture={handleCapture} onClose={handleCloseCamera} />}
            <div className="animate-bounce-in-top max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 ">
                <div className="mb-8 ">
                    <h1 className="text-3xl font-bold mb-4 text-center">{t('analyzerPageTitle')}</h1>
                    <div className="flex items-center justify-center">
                        {steps.map((step, index) => (
                            <React.Fragment key={step}>
                                <div className="flex items-center">
                                    <div className={`flex items-center justify-center h-8 w-8 rounded-full transition-colors ${index <= currentStep ? 'bg-emerald-600 text-white' : 'bg-stone-200 text-stone-600'}`}>{index + 1}</div>
                                    <p className={`ml-3 font-medium transition-colors ${index <= currentStep ? 'text-emerald-600' : 'text-stone-500'}`}>{step}</p>
                                </div>
                                {index < steps.length - 1 && <div className="flex-auto border-t-2 mx-4 border-stone-200"></div>}
                            </React.Fragment>
                        ))}
                    </div>
                </div>
                
                <div className="relative bg-white p-8 rounded-lg shadow-lg min-h-[550px] flex flex-col items-center justify-center animate-bounce-in-top">
                    {/* CHANGED: Pass 't' function as a prop */}
                    {isLoading && <LoadingOverlay t={t} />}
                    
                    {selectedImage ? (
                        <div className="w-full flex flex-col items-center text-center">
                            <p className="text-stone-600 mb-4">{t('reviewAndAddDetails')}</p>
                            <img src={selectedImage.dataUrl} alt="Selected preview" className="max-w-md w-full h-auto rounded-md shadow-md mb-6" />
                            <div className="w-full max-w-md space-y-4 mb-6">
                                <div>
                                    <label htmlFor="location" className="block text-sm font-medium text-stone-700 text-left">{t('locationLabel')}</label>
                                    <input type="text" id="location" value={location} onChange={(e) => setLocation(e.target.value)} className="mt-1 block w-full px-4 py-3 bg-stone-100 border border-stone-200 rounded-md shadow-sm placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-emerald-500" placeholder={t('locationPlaceholder')} />
                                </div>
                                <div>
                                    <label htmlFor="language" className="block text-sm font-medium text-stone-700 text-left">{t('languageForAdviceLabel')}</label>
                                    <select id="language" value={language} onChange={(e) => setLanguage(e.target.value)} className="mt-1 block w-full px-4 py-3 bg-stone-100 border border-stone-200 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500">
                                        {/* CHANGED: Options are now mapped from a translatable array */}
                                        {languageOptions.map(option => (
                                            <option key={option.value} value={option.value}>{option.label}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            
                            {error && <p className="my-4 text-center text-red-500">{error}</p>}

                            <div className="flex space-x-4">
                                <button onClick={() => setSelectedImage(null)} className="px-8 py-3 border border-stone-300 text-base font-medium rounded-md shadow-sm text-stone-700 bg-white hover:bg-stone-50 disabled:opacity-50" disabled={isLoading}>
                                    {t('changeImageButton')}
                                </button>
                                <button onClick={handleAnalyze} disabled={isLoading || !location.trim()} className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:bg-red-300 disabled:cursor-not-allowed">
                                    {t('analyzeNowButton')}
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="w-full flex flex-col items-center text-center max-w-lg">
                            <p className="text-stone-600 mb-6">{t('selectImagePrompt')}</p>
                            <ImageUploader onFileSelect={handleFileSelect} />
                            <div className="relative my-6 w-full flex items-center">
                                <div className="flex-grow border-t border-stone-300"></div>
                                <span className="flex-shrink mx-4 text-stone-500">{t('orSeparator')}</span>
                                <div className="flex-grow border-t border-stone-300"></div>
                            </div>
                            <button onClick={() => setIsCameraOpen(true)} className="rounded-xl w-full inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-emerald-600 hover:bg-emerald-700">
                                <TakePhotoIcon className="h-6 w-6 mr-3" />
                                {t('takeAPhotoButton')}
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default AnalyzerPage;