import React from 'react';
import { BackIcon } from '../components/Icons';
import { useTranslation } from 'react-i18next';

const guideContent = {
    housing: {
        title: 'General Care & Housing',
        content: (
            <>
                <p className="lead">Proper housing is one of the most critical factors in maintaining a healthy and productive herd. It protects cattle from extreme weather conditions, prevents diseases, and ensures their safety from predators.</p>
                <h3 className="section-title">Key Housing Principles</h3>
                <ul className="list">
                    <li><strong>Space:</strong> Provide adequate space for each animal to rest, stand, and move comfortably. Overcrowding leads to stress and rapid spread of disease. A general guideline is 40-50 square feet per adult animal.</li>
                    <li><strong>Ventilation:</strong> Good airflow is essential to remove moisture, ammonia, and pathogens. Ensure shelters have open ridges, side-wall openings, or fans, but avoid direct drafts on the animals.</li>
                    <li><strong>Dry Bedding:</strong> A clean, dry resting area is non-negotiable. Use materials like straw, sand, or rubber mats. Wet bedding is a breeding ground for bacteria that can cause mastitis and foot rot.</li>
                    <li><strong>Clean Water Access:</strong> Cattle require constant access to clean, fresh water. Water troughs should be cleaned daily to prevent algae and contamination.</li>
                    <li><strong>Secure Fencing:</strong> Sturdy, well-maintained fences are crucial for animal safety and to prevent them from wandering.</li>
                </ul>
                <h3 className="section-title">Daily Management</h3>
                 <ul className="list">
                     <li><strong>Daily Observation:</strong> Spend time with your herd every day. Watch for any changes in behavior, appetite, or posture. Early detection is key to managing health issues effectively.</li>
                     <li><strong>Manure Management:</strong> Regularly remove manure from housing areas to reduce pests and disease transmission. A clean environment is a healthy environment.</li>
                </ul>
            </>
        )
    },
    breeds: {
        title: 'How to Identify Breeds',
        content: (
             <>
                <p className="lead">Understanding the different breeds of cattle is fundamental for effective farm management, breeding programs, and maximizing productivity for either milk or draught purposes.</p>
                <h3 className="section-title">Primary Indian Breeds</h3>
                 <ul className="list">
                    <li><strong>Gir:</strong> Originating from Gujarat, they are known for their high milk production and heat tolerance. Key features include a prominent, rounded forehead and long, pendulous ears that curl up at the tip.</li>
                    <li><strong>Sahiwal:</strong> From the Punjab region, this is a premier dairy breed known for its high-quality milk. They are typically reddish-dun in color and have a heavier build.</li>
                    <li><strong>Red Sindhi:</strong> A popular dairy breed known for its hardiness and adaptability. They are deep, rich red in color but can vary.</li>
                    <li><strong>Kankrej:</strong> A dual-purpose breed from Gujarat, valued for both milk and draught power. They are recognized by their lyre-shaped horns.</li>
                </ul>
                <h3 className="section-title">Using the AI Classifier</h3>
                <p>This application is designed to help you with breed identification. For the best results:</p>
                 <ul className="list">
                    <li><strong>Take a Clear Side-Profile Photo:</strong> Ensure the entire body of the animal is visible, from head to tail.</li>
                    <li><strong>Good Lighting:</strong> Take photos during the day in bright, even light. Avoid harsh shadows.</li>
                    <li><strong>Unobstructed View:</strong> Make sure there are no objects or other animals blocking the view.</li>
                </ul>
            </>
        )
    },
    calving: {
        title: 'Healthy Calving (Birth)',
        content: (
             <>
                <p className="lead">The calving period is a critical time for both the cow and the calf. Proper management can significantly reduce complications and ensure a healthy start for the newborn.</p>
                <h3 className="section-title">Preparing for Calving</h3>
                <ul className="list">
                    <li><strong>Separate Birthing Area:</strong> Two to three weeks before the due date, move the pregnant cow to a clean, dry, and quiet pasture or pen. This "maternity ward" should be well-bedded and isolated from the rest of the herd.</li>
                    <li><strong>Nutrition:</strong> Ensure the cow has access to high-quality feed and minerals, but avoid over-feeding, which can lead to oversized calves and difficult births.</li>
                    <li><strong>Observation:</strong> Watch for signs of impending birth, such as a swelling udder, relaxed pelvic ligaments, and isolation from the herd.</li>
                </ul>
                <h3 className="section-title">Post-Calving Care</h3>
                <ul className="list">
                    <li><strong>Colostrum is Critical:</strong> The calf must receive colostrum (the first milk) within the first 2-4 hours of life. It contains essential antibodies. The calf should consume about 10% of its body weight in colostrum within 12 hours.</li>
                    <li><strong>Navel Care:</strong> Disinfect the newborn calf's navel with an iodine solution to prevent infection.</li>
                    <li><strong>Monitor Both Cow and Calf:</strong> Ensure the cow has passed the placenta (afterbirth) within 12 hours and that the calf is active and nursing properly.</li>
                </ul>
            </>
        )
    },
    nutrition: {
        title: 'Proper Feeding & Nutrition',
        content: (
            <>
                <p className="lead">Nutrition is the cornerstone of cattle health, milk production, and reproductive efficiency. A balanced diet tailored to the animal's life stage is essential for a profitable dairy operation.</p>
                <h3 className="section-title">Components of a Balanced Diet</h3>
                <ul className="list">
                    <li><strong>Forages (Roughage):</strong> This should form the bulk of the diet. Good quality green fodder, hay, and silage are crucial for rumen health. Aim to provide as much green fodder as the animal will consume.</li>
                    <li><strong>Concentrates:</strong> These are high-energy, high-protein feeds like grains (maize, barley), oil cakes (groundnut cake, cottonseed cake), and bran. They are vital for high-yielding dairy animals.</li>
                    <li><strong>Mineral Mixture:</strong> Essential for all metabolic functions, bone health, and fertility. Provide a good quality mineral mixture daily, mixed with the concentrate feed, as local soils are often deficient.</li>
                    <li><strong>Water:</strong> Clean, fresh water must be available at all times. A lactating cow can drink over 100 litres of water a day.</li>
                </ul>
                <h3 className="section-title">Feeding Strategy</h3>
                 <ul className="list">
                     <li><strong>Feed according to production:</strong> A high-yielding cow requires more concentrate feed than a dry cow. A general rule is to provide 1 kg of concentrate for every 2.5 litres of milk produced, in addition to maintenance rations.</li>
                     <li><strong>Provide Dry Matter:</strong> Ensure the animal gets enough dry fodder (straw) to meet its dry matter intake requirements, which is crucial for proper digestion.</li>
                     <li><strong>Avoid sudden changes:</strong> Introduce any new feed gradually over a period of 7-10 days to allow the animal's digestive system to adapt.</li>
                </ul>
            </>
        )
    },
    health: {
        title: 'Health & Safety',
        content: (
             <>
                <p className="lead">Proactive health management and biosecurity are far more effective and economical than treating diseases after they occur. A healthy herd is a productive herd.</p>
                <h3 className="section-title">Preventative Healthcare</h3>
                <ul className="list">
                    <li><strong>Vaccination Schedule:</strong> Work with a local veterinarian to establish a vaccination schedule for diseases prevalent in your area, such as Foot-and-Mouth Disease (FMD), Haemorrhagic Septicaemia (HS), and Blackleg (BQ).</li>
                    <li><strong>Deworming:</strong> Regularly deworm your entire herd to control internal and external parasites. The schedule will depend on your region and management practices.</li>
                    <li><strong>Isolation/Quarantine:</strong> Any new animal brought to the farm must be quarantined for at least 30 days. During this time, observe it for any signs of illness before introducing it to the main herd.</li>
                </ul>

                <h3 className="section-title">Biosecurity Measures</h3>
                <ul className="list">
                    <li><strong>Farm Access:</strong> Limit unnecessary visitors and vehicles on your farm. Provide footbaths with disinfectant at the entrance of sheds.</li>
                    <li><strong>Cleanliness:</strong> Keep feeding and watering troughs clean. Regularly disinfect the farm premises.</li>
                    <li><strong>Disposal:</strong> Properly dispose of any dead animals as per local regulations to prevent the spread of disease. Do not allow other animals to access the carcass.</li>
                     <li><strong>Know When to Call a Vet:</strong> Do not hesitate to contact a veterinarian if you notice signs of serious illness, such as high fever, loss of appetite, difficulty breathing, or sudden drop in milk production.</li>
                </ul>
            </>
        )
    },
};

const defaultContent = {
    title: 'Topic Not Found',
    content: <p>The requested guide topic could not be found. Please return to the main guide page and select a valid topic.</p>
}


const GuideDetailPage = ({ topic }) => {
    const { title, content } = guideContent[topic] || defaultContent;

    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <style>{`
                .prose-custom .lead {
                    font-size: 1.25rem;
                    color: #57534e; /* stone-600 */
                    margin-bottom: 1.5rem;
                }
                .prose-custom .section-title {
                    font-size: 1.5rem;
                    font-weight: 700;
                    color: #059669; /* emerald-600 */
                    margin-top: 2rem;
                    margin-bottom: 1rem;
                    border-bottom: 2px solid #d1fae5; /* emerald-100 */
                    padding-bottom: 0.5rem;
                }
                .prose-custom .list {
                    list-style-type: disc;
                    padding-left: 1.5rem;
                    display: flex;
                    flex-direction: column;
                    gap: 0.75rem;
                }
            `}</style>
             <div className="mb-8">
                 <button onClick={() => window.location.hash = '/guide'} className="inline-flex items-center text-emerald-600 hover:underline bg-transparent border-none cursor-pointer">
                    <BackIcon />
                    Back to Cattle Care Guide
                </button>
            </div>
            <article className="bg-gradient-to-br from-emerald-50 via-white to-blue-50 animate-bounce-in-top  rounded-lg shadow-lg p-8 sm:p-12 prose-custom">
                <h1 className="text-4xl font-bold text-stone-900 mb-6">{title}</h1>
                <div className="text-stone-700 text-lg leading-relaxed">
                    {content}
                </div>
            </article>
        </div>
    )
};

export default GuideDetailPage;