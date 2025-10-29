
import React from 'react';
import type { EnhancementFactor } from '../types';
import Spinner from './Spinner';

interface EnhancementControlsProps {
  factor: EnhancementFactor;
  setFactor: (factor: EnhancementFactor) => void;
  onEnhance: () => void;
  isEnhancing: boolean;
  isImageUploaded: boolean;
}

const EnhancementControls: React.FC<EnhancementControlsProps> = ({
  factor,
  setFactor,
  onEnhance,
  isEnhancing,
  isImageUploaded,
}) => {
  const factors: EnhancementFactor[] = ['2x', '5x'];

  return (
    <div className="w-full flex flex-col space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">Enhancement Factor</label>
        <div className="grid grid-cols-2 gap-3">
          {factors.map((f) => (
            <button
              key={f}
              onClick={() => setFactor(f)}
              className={`px-4 py-3 rounded-md text-sm font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-blue-500 ${
                factor === f
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>
      <button
        onClick={onEnhance}
        disabled={!isImageUploaded || isEnhancing}
        className="w-full flex items-center justify-center bg-blue-600 text-white font-bold py-3 px-4 rounded-lg shadow-lg hover:bg-blue-700 disabled:bg-gray-500 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 disabled:scale-100"
      >
        {isEnhancing ? (
          <>
            <Spinner className="w-5 h-5 mr-3" />
            Enhancing...
          </>
        ) : (
          'Enhance Image'
        )}
      </button>
    </div>
  );
};

export default EnhancementControls;
