import React from 'react';
import AIAssistant from '../components/AIAssistant';
import { HousingIcon, BreedGuideIcon, CalvingIcon, NutritionIcon, HealthIcon } from '../components/Icons';

const guideTopics = [
    { slug: 'housing', title: 'General Care & Housing', icon: <HousingIcon />, description: 'Protect cattle from weather and predators.' },
    { slug: 'breeds', title: 'How to Identify Breeds', icon: <BreedGuideIcon />, description: 'Understand breed traits for better management.' },
    { slug: 'calving', title: 'Healthy Calving (Birth)', icon: <CalvingIcon />, description: 'Best practices for a successful birthing period.' },
    { slug: 'nutrition', title: 'Proper Feeding & Nutrition', icon: <NutritionIcon />, description: 'The cornerstone of cattle health and productivity.' },
    { slug: 'health', title: 'Health & Safety', icon: <HealthIcon />, description: 'Preventative healthcare and biosecurity measures.' },
]

const GuideCard = ({ topic }) => {
    return (
        <button
            onClick={() => window.location.hash = `/guide/${topic.slug}`}
            className="bg-gradient-to-br from-emerald-50 via-white to-blue-50  w-full h-full text-left bg-white rounded-lg shadow-lg p-6 border border-stone-200 transform hover:-translate-y-1 hover:shadow-xl transition-all duration-300 flex flex-col"
        >
            <div className="flex-shrink-0 text-emerald-500 mb-4">{topic.icon}</div>
            <h3 className="flex-grow font-bold text-xl text-stone-800 mb-2">{topic.title}</h3>
            <p className="text-stone-600">{topic.description}</p>
        </button>
    )
}

const GuidePage = () => {
    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 ">
            <header className="mb-12 text-center">
                <h1 className="text-4xl font-bold leading-tight text-stone-900">
                    Cattle Care Guide
                </h1>
                <p className="mt-2 text-lg text-stone-600">
                    Essential knowledge for healthy and productive livestock. Click a topic to learn more.
                </p>
            </header>

            <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
                {guideTopics.map(topic => <GuideCard key={topic.slug} topic={topic} />)}
            </section>
            
            <section>
                 <AIAssistant />
            </section>
        </div>
    );
};

export default GuidePage;