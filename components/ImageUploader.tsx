import React, { useRef } from 'react';

interface ImageUploaderProps {
  onImageUpload: (file: File) => void;
  originalImageUrl: string | null;
  dimensions: { width: number; height: number } | null;
}

const UploadIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
    </svg>
);


const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageUpload, originalImageUrl, dimensions }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onImageUpload(file);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };
  
  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    const file = event.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
        onImageUpload(file);
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
  };

  return (
    <div className="w-full">
      <label htmlFor="image-upload" className="block text-sm font-medium text-gray-300 mb-2 leading-normal pb-0.5">
        Original Image
      </label>
      <div 
        onClick={handleClick}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        className="w-full h-80 bg-gray-800/50 border-2 border-dashed border-gray-600 rounded-xl flex items-center justify-center cursor-pointer hover:border-blue-500 transition-colors duration-300 overflow-hidden"
      >
        <input
          id="image-upload"
          ref={fileInputRef}
          type="file"
          accept="image/png, image/jpeg, image/webp"
          className="hidden"
          onChange={handleFileChange}
        />
        {originalImageUrl ? (
          <img src={originalImageUrl} alt="Original preview" className="h-full w-full object-contain" />
        ) : (
          <div className="text-center flex flex-col items-center">
            <UploadIcon />
            <p className="mt-2 text-gray-400 pb-1 leading-normal">
              <span className="font-semibold text-blue-500">Click to upload</span> or drag and drop
            </p>
            <p className="text-xs text-gray-500 mt-1">PNG, JPG or WEBP</p>
            <p className="text-xs text-gray-500 mt-2">
              or press <kbd className="px-1.5 py-0.5 bg-gray-700 rounded border border-gray-600">⌘V</kbd> to paste
            </p>
          </div>
        )}
      </div>
       {dimensions && (
        <p className="text-center text-xs text-gray-500 mt-2">
          {dimensions.width} x {dimensions.height}px
        </p>
      )}
    </div>
  );
};

export default ImageUploader;