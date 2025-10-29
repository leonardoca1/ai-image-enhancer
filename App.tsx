import React, { useState, useCallback, useEffect } from 'react';
import type { EnhancementFactor } from './types';
import { enhanceImage } from './services/geminiService';
import ImageUploader from './components/ImageUploader';
import EnhancementControls from './components/EnhancementControls';
import ImageComparator from './components/ImageComparator';
import PasswordProtection from './components/PasswordProtection';

type ImageDimensions = { width: number; height: number } | null;

const App: React.FC = () => {
  const [originalImage, setOriginalImage] = useState<File | null>(null);
  const [originalImageUrl, setOriginalImageUrl] = useState<string | null>(null);
  const [enhancedImageUrl, setEnhancedImageUrl] = useState<string | null>(null);
  const [enhancementFactor, setEnhancementFactor] = useState<EnhancementFactor>('2x');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [originalImageDimensions, setOriginalImageDimensions] = useState<ImageDimensions>(null);
  const [enhancedImageDimensions, setEnhancedImageDimensions] = useState<ImageDimensions>(null);


  const getImageDimensions = (url: string): Promise<{ width: number; height: number }> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        resolve({ width: img.width, height: img.height });
      };
      img.src = url;
    });
  };

  const handleImageUpload = useCallback((file: File) => {
    setOriginalImage(file);
    const url = URL.createObjectURL(file);
    setOriginalImageUrl(url);
    setEnhancedImageUrl(null);
    setEnhancedImageDimensions(null);
    setError(null);

    getImageDimensions(url).then(setOriginalImageDimensions);
  }, []);

  const handleEnhance = useCallback(async () => {
    if (!originalImage) {
      setError("Please upload an image first.");
      return;
    }

    // Validate image size before processing
    if (!originalImageDimensions) {
      setError("Image dimensions not available.");
      return;
    }

    const MAX_DIMENSION = 3840;
    const MAX_FILE_SIZE = 15 * 1024 * 1024; // 15MB
    
    const { width, height } = originalImageDimensions;
    let actualFactor = enhancementFactor;

    // Check if image is too big with current factor
    const factorNum = parseInt(enhancementFactor.replace('x', ''), 10);
    const resultWidth = width * factorNum;
    const resultHeight = height * factorNum;

    // If result would be too big, try with 2x
    if (resultWidth > MAX_DIMENSION || resultHeight > MAX_DIMENSION || originalImage.size > MAX_FILE_SIZE) {
      // Try with 2x
      const result2x = Math.max(width * 2, height * 2);
      
      if (result2x <= MAX_DIMENSION && originalImage.size <= MAX_FILE_SIZE) {
        // Auto-switch to 2x
        actualFactor = '2x';
        setEnhancementFactor('2x');
      } else {
        // Even 2x is too big
        setError("Image is too big. Please use a smaller image.");
        return;
      }
    }

    setIsLoading(true);
    setError(null);
    setEnhancedImageUrl(null);
    setEnhancedImageDimensions(null);

    try {
      const resultUrl = await enhanceImage(originalImage, actualFactor);
      setEnhancedImageUrl(resultUrl);
      getImageDimensions(resultUrl).then(setEnhancedImageDimensions);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : "An unknown error occurred during enhancement.");
    } finally {
      setIsLoading(false);
    }
  }, [originalImage, enhancementFactor, originalImageDimensions]);

  // Handle paste event to load images from clipboard
  useEffect(() => {
    const handlePaste = async (event: ClipboardEvent) => {
      const items = event.clipboardData?.items;
      if (!items) return;

      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        
        // Check if the item is an image
        if (item.type.startsWith('image/')) {
          event.preventDefault();
          
          const blob = item.getAsFile();
          if (blob) {
            // Normalize the image format to ensure compatibility
            const img = new Image();
            const objectUrl = URL.createObjectURL(blob);
            
            img.onload = () => {
              // Create a canvas to convert the image
              const canvas = document.createElement('canvas');
              canvas.width = img.width;
              canvas.height = img.height;
              const ctx = canvas.getContext('2d');
              
              if (ctx) {
                ctx.drawImage(img, 0, 0);
                
                // Convert to PNG (well supported format)
                canvas.toBlob((convertedBlob) => {
                  if (convertedBlob) {
                    const file = new File([convertedBlob], `pasted-image-${Date.now()}.png`, {
                      type: 'image/png',
                    });
                    handleImageUpload(file);
                  }
                }, 'image/png');
              }
              
              URL.revokeObjectURL(objectUrl);
            };
            
            img.onerror = () => {
              URL.revokeObjectURL(objectUrl);
              setError("Failed to load pasted image. Please try uploading it instead.");
            };
            
            img.src = objectUrl;
          }
          break;
        }
      }
    };

    // Add the paste event listener to the document
    document.addEventListener('paste', handlePaste);

    // Cleanup the event listener on component unmount
    return () => {
      document.removeEventListener('paste', handlePaste);
    };
  }, [handleImageUpload]);

  return (
    <PasswordProtection>
      <div className="min-h-screen bg-gray-900 text-white font-sans">
        <div className="container mx-auto px-4 py-8 md:py-12">
          <header className="text-center mb-10 md:mb-16" style={{ overflow: 'visible' }}>
              <h1 className="font-bold tracking-tight text-blue-400" style={{ 
                  fontSize: '4rem',
                  lineHeight: '1.3', 
                  paddingTop: '1.5rem',
                  paddingBottom: '0.5rem',
                  textShadow: '0 0 30px rgba(147, 51, 234, 0.5)',
                  overflow: 'visible',
                  display: 'block',
                  fontFamily: 'system-ui, -apple-system, sans-serif'
              }}>
                  AI Image Enhancer
              </h1>
              <p className="mt-1 text-lg text-gray-400 max-w-2xl mx-auto">
                  Upload your image, choose an enhancement factor, and let AI work its magic to upscale and improve quality.
              </p>
          </header>

          <main className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
              <div className="md:col-span-1 flex flex-col items-center space-y-8">
                  <div className="w-full bg-gray-800/30 backdrop-blur-sm p-6 rounded-2xl border border-gray-700 shadow-2xl">
                      <EnhancementControls
                          factor={enhancementFactor}
                          setFactor={setEnhancementFactor}
                          onEnhance={handleEnhance}
                          isEnhancing={isLoading}
                          isImageUploaded={!!originalImage}
                      />
                  </div>
              </div>

              <div className="md:col-span-2 flex flex-col space-y-8">
                  {error && (
                      <div className="bg-red-500/20 border border-red-500 text-red-300 px-4 py-3 rounded-lg" role="alert">
                          <strong className="font-bold">Error: </strong>
                          <span className="block sm:inline">{error}</span>
                      </div>
                  )}
                   <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                      <div className="bg-gray-800/30 backdrop-blur-sm p-6 rounded-2xl border border-gray-700 shadow-2xl">
                           <ImageUploader 
                              onImageUpload={handleImageUpload} 
                              originalImageUrl={originalImageUrl} 
                              dimensions={originalImageDimensions}
                           />
                      </div>
                      <div className="bg-gray-800/30 backdrop-blur-sm p-6 rounded-2xl border border-gray-700 shadow-2xl min-h-[368px] flex flex-col items-center justify-center">
                          {isLoading && (
                              <div className="text-center">
                                  <div className="animate-pulse text-blue-400 text-lg">Enhancing Image...</div>
                                  <p className="text-gray-500 text-sm mt-2">This may take a moment.</p>
                              </div>
                          )}
                          {!isLoading && enhancedImageUrl && (
                              <ImageComparator 
                                  enhancedImageUrl={enhancedImageUrl}
                                  dimensions={enhancedImageDimensions} 
                              />
                          )}
                          {!isLoading && !enhancedImageUrl && (
                              <div className="text-center text-gray-500">
                                  <p>Your enhanced image will appear here.</p>
                              </div>
                          )}
                      </div>
                  </div>
              </div>
          </main>

          <footer className="text-center mt-16 text-gray-600 text-sm">
              <p>Powered by Gemini API</p>
          </footer>
        </div>
      </div>
    </PasswordProtection>
  );
};

export default App;