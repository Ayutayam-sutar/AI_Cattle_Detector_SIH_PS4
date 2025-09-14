import React from 'react';
import { SideProfileIcon, LightIcon, GroundIcon } from '../components/Icons';

const TipCard = ({ icon, title, description }) => (
    <div className="animate-slide-in-elliptic-top-fwd bg-white p-6 rounded-lg shadow-lg border border-emerald-200 text-center hover:shadow-xl transition-shadow duration-300"> {/* MODIFIED CLASSES HERE */}
        <div className="text-emerald-500 w-16 h-16 mx-auto flex items-center justify-center bg-emerald-100 rounded-full mb-4">
            {icon}
        </div>
        <h3 className="text-lg font-bold text-stone-800 mb-2">{title}</h3>
        <p className="text-stone-600">{description}</p>
    </div>
);

const StartAnalysisPage = () => {
    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <header className="text-center mb-12">
                <h1 className="text-4xl font-bold leading-tight text-stone-900">
                    Prepare for Your Analysis
                </h1>
                <p className="mt-2 text-lg text-stone-600">
                    Follow these simple steps to ensure the most accurate AI report for your animal.
                </p>
            </header>

            <section className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                <TipCard
                    icon={<SideProfileIcon />}
                    title="1. Clear Side-Profile"
                    description="Take a photo from the side, showing the entire animal from head to tail against a clean background."
                />
                <TipCard
                    icon={<LightIcon />}
                    title="2. Good, Natural Lighting"
                    description="Take the photo during the day in bright, even light. Avoid harsh shadows or direct sunlight."
                />
                <TipCard
                    icon={<GroundIcon />}
                    title="3. Level Ground"
                    description="Ensure the animal is standing on flat, level ground to provide an accurate view of its posture and build."
                />
            </section>

            <div className="text-center">
                <button
                    onClick={() => window.location.hash = '/analyze'}
                    className="inline-flex items-center justify-center px-8 py-4 border border-transparent text-lg font-medium rounded-md shadow-sm text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
                >
                    I'm Ready, Start Analysis
                </button>
            </div>
        </div>
    );
};

export default StartAnalysisPage;