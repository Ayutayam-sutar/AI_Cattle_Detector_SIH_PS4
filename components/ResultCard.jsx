import React, { useEffect, useState, useRef } from 'react';
import { useOnScreen } from '../hooks/useOnScreen';

const ResultCard = ({ traitScore }) => {
  const { trait, score, maxScore, description } = traitScore;
  const percentage = (score / maxScore) * 100;

  const [ref, isVisible] = useOnScreen({ threshold: 0.2 });
  const [width, setWidth] = useState(0);

  useEffect(() => {
      if (isVisible) {
          setWidth(percentage);
      }
  }, [isVisible, percentage]);

  const getProgressBarColor = (value) => {
    if (value < 40) return 'bg-red-500';
    if (value < 70) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  return (
    <div ref={ref} className="bg-white rounded-lg shadow p-4 border border-gray-200">
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-semibold text-gray-800">{trait}</h3>
        <span className="font-bold text-lg text-green-600">
          {score}/{maxScore}
        </span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2.5 mb-3 overflow-hidden">
        <div
          className={`${getProgressBarColor(percentage)} h-2.5 rounded-full transition-all duration-1000 ease-out`}
          style={{ width: `${width}%` }}
        ></div>
      </div>
      <p className="text-sm text-gray-600">{description}</p>
    </div>
  );
};

export default ResultCard;