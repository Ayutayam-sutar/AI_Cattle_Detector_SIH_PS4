import React, { useRef, useEffect, useState } from 'react';

const CameraCapture = ({ onCapture, onClose }) => {
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const [isCameraReady, setIsCameraReady] = useState(false);
    const [isFlashing, setIsFlashing] = useState(false);
    const [error, setError] = useState(null);
    const [cameraFacingMode, setCameraFacingMode] = useState('environment'); 

    
    useEffect(() => {
        let stream = null;
        
        const startCamera = async () => {
            setError(null);

            
            if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
                setError("Camera API is not available on this browser.");
                return;
            }
            if (!window.isSecureContext) {
                 setError("Camera access is only available on secure connections (https:// or localhost).");
                 return;
            }

            try {
                
                let constraints = { 
                    video: { 
                        width: { ideal: 1920 },
                        height: { ideal: 1080 },
                        facingMode: cameraFacingMode
                    } 
                };
                
                
                if (cameraFacingMode === 'environment') {
                    try {
                        stream = await navigator.mediaDevices.getUserMedia(constraints);
                    } catch (envError) {
                        console.log("Back camera not available, trying front camera");
                        constraints.video.facingMode = 'user';
                        stream = await navigator.mediaDevices.getUserMedia(constraints);
                        setCameraFacingMode('user');
                    }
                } else {
                    stream = await navigator.mediaDevices.getUserMedia(constraints);
                }
                
                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                    videoRef.current.onloadedmetadata = () => {
                        videoRef.current.play().then(() => {
                            setIsCameraReady(true);
                        }).catch(e => {
                            console.error("Error playing video:", e);
                            setError("Could not start camera preview.");
                        });
                    };
                }
            } catch (err) {
                console.error("Error accessing camera:", err);
                let errorMessage = "Could not access the camera. Please check your device settings.";
                if (err instanceof Error) {
                    if (err.name === "NotAllowedError" || err.name === "PermissionDeniedError") {
                        errorMessage = "Camera permission was denied. Please enable it in your browser settings to use this feature.";
                    } else if (err.name === "NotFoundError" || err.name === "DevicesNotFoundError") {
                        errorMessage = "No camera was found on this device.";
                    } else if (err.name === "NotReadableError" || err.name === "TrackStartError") {
                        errorMessage = "The camera is already in use by another application.";
                    } else if (err.name === "OverconstrainedError") {
                        
                        try {
                            let constraints = { 
                                video: { 
                                    width: { ideal: 1920 },
                                    height: { ideal: 1080 },
                                    facingMode: 'user'
                                } 
                            };
                            stream = await navigator.mediaDevices.getUserMedia(constraints);
                            setCameraFacingMode('user');
                            if (videoRef.current) {
                                videoRef.current.srcObject = stream;
                                videoRef.current.onloadedmetadata = () => {
                                    videoRef.current.play().then(() => {
                                        setIsCameraReady(true);
                                    });
                                };
                            }
                            return;
                        } catch (fallbackError) {
                            errorMessage = "Camera is not available or accessible.";
                        }
                    }
                }
                setError(errorMessage);
                setIsCameraReady(false);
            }
        };

        startCamera();

        
        return () => {
            if (videoRef.current && videoRef.current.srcObject) {
                videoRef.current.srcObject.getTracks().forEach(track => track.stop());
            }
        };
    }, [cameraFacingMode]);

    const handleCapture = () => {
        if (!videoRef.current || !canvasRef.current || !isCameraReady) {
            setError("Camera is not ready. Please wait a moment.");
            return;
        }

        setIsFlashing(true); 

        setTimeout(() => {
            const video = videoRef.current;
            const canvas = canvasRef.current;
            const context = canvas.getContext('2d');
            
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            
            if (context) {
                
                context.clearRect(0, 0, canvas.width, canvas.height);
                
                
                if (cameraFacingMode === 'user') {
                    context.translate(canvas.width, 0);
                    context.scale(-1, 1);
                    context.drawImage(video, 0, 0, canvas.width, canvas.height);
                    context.setTransform(1, 0, 0, 1, 0, 0); 
                } else {
                    context.drawImage(video, 0, 0, canvas.width, canvas.height);
                }

                const dataUrl = canvas.toDataURL('image/jpeg', 0.9); 
                onCapture(dataUrl);
            } else {
                setError("Failed to capture image. Please try again.");
            }
            setIsFlashing(false);
        }, 100); 
    };

    const switchCamera = async () => {
        
        if (videoRef.current && videoRef.current.srcObject) {
            videoRef.current.srcObject.getTracks().forEach(track => track.stop());
        }
        
        setIsCameraReady(false);
        setCameraFacingMode(prevMode => prevMode === 'user' ? 'environment' : 'user');
    };

    return (
        <div className="fixed inset-0 bg-black z-50 flex flex-col items-center justify-center text-white overflow-hidden">
            {/* Video Feed */}
            <video 
                ref={videoRef} 
                autoPlay 
                playsInline 
                muted
                className="w-full h-full object-cover"
            ></video>
            <canvas ref={canvasRef} className="hidden"></canvas>
            
            {/* Flash Animation */}
            {isFlashing && <div className="absolute inset-0 bg-white opacity-80 animate-ping"></div>}

            {/* Guide Frame Overlay */}
            {isCameraReady && (
                 <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <div className="w-11/12 max-w-2xl aspect-[4/3] border-4 border-white/50 rounded-2xl shadow-2xl" style={{boxShadow: '0 0 0 9999px rgba(0,0,0,0.5)'}}></div>
                    <p className="mt-4 text-lg font-medium bg-black/50 px-4 py-2 rounded-lg">
                        Position the animal's side profile inside the frame
                    </p>
                </div>
            )}
            
            {/* Loading or Error State Overlay */}
            {(!isCameraReady || error) && (
                <div className="absolute inset-0 bg-black bg-opacity-80 flex flex-col items-center justify-center text-center p-6">
                    {error ? (
                        <>
                            <div className="w-16 h-16 flex items-center justify-center bg-red-500/20 rounded-full mb-4">
                                <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                </svg>
                            </div>
                            <p className="text-red-400 font-semibold mb-6 max-w-sm">{error}</p>
                            <button 
                                onClick={onClose} 
                                className="px-6 py-3 rounded-full bg-white/10 text-white font-semibold backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-colors"
                            >
                                Back to Analyzer
                            </button>
                        </>
                    ) : (
                        <>
                            <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                            <p className="mt-4 text-lg">Starting camera...</p>
                        </>
                    )}
                </div>
            )}

            {/* Camera Switch Button (only show if camera is ready and no error) */}
            {isCameraReady && !error && navigator.mediaDevices && navigator.mediaDevices.enumerateDevices && (
                <button 
                    onClick={switchCamera}
                    className="absolute top-4 right-4 p-3 rounded-full bg-white/10 backdrop-blur-sm text-white"
                    aria-label="Switch camera"
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                </button>
            )}

            {/* Bottom Controls */}
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent flex justify-between items-center">
                <button 
                    onClick={onClose} 
                    className="px-6 py-3 rounded-full bg-white/10 text-white font-semibold backdrop-blur-sm text-lg"
                >
                    Cancel
                </button>
                <button 
                    onClick={handleCapture} 
                    disabled={!isCameraReady}
                    aria-label="Capture photo"
                    className="w-20 h-20 rounded-full bg-white disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center transition-transform active:scale-90"
                >
                    <div className="w-16 h-16 rounded-full bg-white ring-4 ring-inset ring-black/30"></div>
                </button>
                {/* This empty div helps center the shutter button perfectly using justify-between */}
                <div className="w-[88px]"></div>
            </div>
        </div>
    );
};

export default CameraCapture;