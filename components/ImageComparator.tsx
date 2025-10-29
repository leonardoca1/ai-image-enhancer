import React from 'react';

interface ImageComparatorProps {
  enhancedImageUrl: string;
  dimensions: { width: number; height: number } | null;
}

const DownloadIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
    </svg>
);


const ImageComparator: React.FC<ImageComparatorProps> = ({ enhancedImageUrl, dimensions }) => {
  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-2">
         <label className="block text-sm font-medium text-gray-300">
            Enhanced Image
        </label>
        <a
          href={enhancedImageUrl}
          download="enhanced-image.png"
          className="inline-flex items-center px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-md hover:bg-green-700 transition-colors duration-300"
        >
          <DownloadIcon />
          Download
        </a>
      </div>
      <div className="w-full h-80 bg-gray-800/50 border border-gray-700 rounded-xl flex items-center justify-center overflow-hidden">
        <img src={enhancedImageUrl} alt="Enhanced result" className="h-full w-full object-contain" />
      </div>
      {dimensions && (
        <p className="text-center text-xs text-gray-500 mt-2">
            {dimensions.width} x {dimensions.height}px
        </p>
      )}
    </div>
  );
};

export default ImageComparator;