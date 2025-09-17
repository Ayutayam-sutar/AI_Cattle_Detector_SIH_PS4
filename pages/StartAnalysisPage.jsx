import React from 'react';
import { SideProfileIcon, LightIcon, GroundIcon } from '../components/Icons';
import { useTranslation } from 'react-i18next'; // ADDED

const TipCard = ({ icon, title, description }) => (
    <div className="animate-slide-in-elliptic-top-fwd bg-white p-6 rounded-lg shadow-lg border border-emerald-200 text-center hover:shadow-xl transition-shadow duration-300">
        <div className="text-emerald-500 w-16 h-16 mx-auto flex items-center justify-center bg-emerald-100 rounded-full mb-4">
            {icon}
        </div>
        <h3 className="text-lg font-bold text-stone-800 mb-2">{title}</h3>
        <p className="text-stone-600">{description}</p>
    </div>
);

const StartAnalysisPage = () => {
    const { t } = useTranslation(); // ADDED

    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <header className="text-center mb-12">
                <h1 className="text-4xl font-bold leading-tight text-stone-900">
                    {t('prepareAnalysisTitle')}
                </h1>
                <p className="mt-2 text-lg text-stone-600">
                    {t('prepareAnalysisSubtitle')}
                </p>
            </header>

            <section className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                {/* CHANGED: Props are now passed using the 't' function */}
                <TipCard
                    icon={<SideProfileIcon />}
                    title={t('tip1Title')}
                    description={t('tip1Desc')}
                />
                <TipCard
                    icon={<LightIcon />}
                    title={t('tip2Title')}
                    description={t('tip2Desc')}
                />
                <TipCard
                    icon={<GroundIcon />}
                    title={t('tip3Title')}
                    description={t('tip3Desc')}
                />
            </section>

            <div className="text-center">
                <button
                    onClick={() => window.location.hash = '/analyze'}
                    className="inline-flex items-center justify-center px-8 py-4 border border-transparent text-lg font-medium rounded-md shadow-sm text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
                >
                    {t('readyStartAnalysisButton')}
                </button>
            </div>
        </div>
    );
};

export default StartAnalysisPage;