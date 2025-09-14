import React from 'react';
import AnimatedCounter from '../components/AnimatedCounter';
import Footer from '../components/Footer';
import { useOnScreen } from '../hooks/useOnScreen';
import { CameraIcon, BrainIcon, ReportIcon } from '../components/Icons';

const Section = ({ children }) => {
  const [ref, isVisible] = useOnScreen({ threshold: 0.1 });
  return (
    <div
      ref={ref}
      className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
    >
      {children}
    </div>
  );
};

const LandingPage = () => {
    return (
        <>
        <div className="relative pt-16 pb-32 flex content-center items-center justify-center min-h-[75vh]">
            <div className="absolute top-0 w-full h-full bg-center bg-cover" style={{backgroundImage: "url('https://plus.unsplash.com/premium_photo-1682092653066-66b555b08979?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8ZmFybWVyJTIwd2l0aCUyMGNvdyUyMGluZGlhbnxlbnwwfHwwfHx8MA%3D%3D"}}>
                 <span id="blackOverlay" className="w-full h-full absolute opacity-55 bg-black"></span>
            </div>
            <div className="container relative mx-auto text-center">
                <h1 className="animate-tracking-in-expand text-white font-semibold text-5xl ">
                    AI Precision for India's Dairy Future.
                </h1>
                <p className="mt-10 text-lg text-gray-300 animate-fade-in" style={{ animationDelay: '1s' }}>
                    Automating Animal Type Classification for the Rashtriya Gokul Mission.
                </p>
                <div className="mt-12">
                    <button onClick={() => window.location.hash = '/signup'} className="get-started-btn text-white font-bold px-6 py-3 rounded-md shadow outline-none focus:outline-none mr-1 mb-1 bg-[#557369] border border-white active:bg-indigo-600 uppercase text-sm hover:shadow-lg ease-linear transition-all duration-150 transform hover:scale-105">Get Started</button>
                    <button onClick={() => window.location.hash = '/login'} className="login-btn ml-4 text-white font-bold px-6 py-3 rounded-md shadow outline-none focus:outline-none mr-1 mb-1 bg-transparent border border-white active:bg-gray-700 uppercase text-sm hover:shadow-lg ease-linear transition-all duration-150 transform hover:scale-105">Login</button>
                </div>
            </div>
        </div>

        <section className="bg-gray-900  ">
            <div className="container mx-auto px-4">
                <Section>
                    <div className="flex flex-wrap items-center ">
                        <div className="w-full md:w-5/12 px-4 mr-auto ml-auto">
                            <h3 className="text-3xl mb-2 font-semibold leading-normal text-white mt-8">How It Works</h3>
                            <p className="text-lg font-light leading-relaxed mt-4 mb-4 text-gray-400">
                                Our platform simplifies cattle evaluation into three easy steps. Just capture an image, let our AI analyze it, and receive an instant, data-driven decision.
                            </p>
                        </div>

                        <div className="w-full md:w-6/12 px-4 mr-auto ml-auto">
                           <div className="relative flex flex-col min-w-0 break-words w-full mb-6 mt-10 shadow-lg rounded-lg bg-gray-800">
                                <div className="px-4 py-5 mt-2 flex-auto">
                                    <div className="flex items-start mb-5">
                                        <div className="text-white p-3 text-center inline-flex items-center justify-center w-12 h-12 shadow-lg rounded-full bg-indigo-500 mr-5"><CameraIcon/></div>
                                        <div>
                                            <h6 className="text-xl font-semibold text-white">1. Capture</h6>
                                            <p className="mt-2 text-gray-400">Upload a clear side-profile image of the animal. No special equipment needed—just your phone.</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start mb-4">
                                        <div className="text-white p-3 text-center inline-flex items-center justify-center w-12 h-12 shadow-lg rounded-full bg-indigo-500 mr-5"><BrainIcon/></div>
                                        <div>
                                            <h6 className="text-xl font-semibold text-white">2. Analyze</h6>
                                            <p className="mt-2 text-gray-400">Our AI, powered by Google Gemini, performs a detailed analysis against RGM guidelines in seconds.</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start">
                                        <div className="text-white p-3 text-center inline-flex items-center justify-center w-12 h-12 shadow-lg rounded-full bg-indigo-500 mr-5"><ReportIcon/></div>
                                        <div>
                                            <h6 className="text-xl font-semibold text-white">3. Decide</h6>
                                            <p className="mt-2 text-gray-400">Receive an objective, consistent, and detailed report card for each animal, ready for decision-making.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </Section>
                <Section>
                    <div className="container mx-auto px-4 py-20">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl font-semibold text-white">Driving Impact at a National Scale</h2>
                            <p className="mt-2 text-lg text-gray-400">Leveraging AI to support a cornerstone of India's economy.</p>
                        </div>
                        <div className="flex flex-wrap justify-center text-center gap-y-8">
                            <div className="w-full sm:w-1/2 lg:w-1/3 px-4">
                                <div className="p-6 bg-gray-800 rounded-lg shadow-lg h-full">
                                    <h3 className="text-5xl font-bold text-indigo-400">
                                        <AnimatedCounter target={185} suffix=" Million+" />
                                    </h3>
                                    <p className="mt-2 text-lg font-semibold text-gray-300">Cattle To Be Impacted</p>
                                </div>
                            </div>
                             <div className="w-full sm:w-1/2 lg:w-1/3 px-4">
                                <div className="p-6 bg-gray-800 rounded-lg shadow-lg h-full">
                                    <h3 className="text-5xl font-bold text-indigo-400">
                                        <AnimatedCounter target={5} prefix="₹" suffix="+ Lakh Crore" />
                                    </h3>
                                    <p className="mt-2 text-lg font-semibold text-gray-300">Dairy Industry Value</p>
                                </div>
                            </div>
                            <div className="w-full sm:w-1/2 lg:w-1/3 px-4">
                                <div className="p-6 bg-gray-800 rounded-lg shadow-lg h-full">
                                    <h3 className="text-5xl font-bold text-indigo-400">
                                        <AnimatedCounter target={95} suffix="%+" />
                                    </h3>
                                    <p className="mt-2 text-lg font-semibold text-gray-300">Scoring Consistency</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </Section>
            </div>
        </section>

        <Footer />
        </>
    );
};

export default LandingPage;