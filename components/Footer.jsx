import React from 'react';

const Footer = () => {
    return (
        <footer className="bg-gray-900 border-t border-gray-800">
            <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 text-center">
                <div className="flex justify-center space-x-6 mb-4">
                     <a href="https://dahd.gov.in/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white">Department of Animal Husbandry & Dairying</a>
                     <a href="https://dahd.gov.in/schemes/programmes/rashtriya_gokul_mission" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white">Rashtriya Gokul Mission</a>
                     
                </div>
                <p className="text-center text-sm text-gray-400">
                    &copy; {new Date().getFullYear()} PashuDrisht. All rights reserved.
                </p>
                
            </div>
        </footer>
    );
};

export default Footer;