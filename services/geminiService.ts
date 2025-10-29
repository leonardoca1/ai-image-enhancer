import { GoogleGenAI, Modality } from "@google/genai";
import type { EnhancementFactor } from '../types';

const fileToGenerativePart = async (file: File) => {
  const base64EncodedDataPromise = new Promise<string>((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve((reader.result as string).split(',')[1]);
    reader.readAsDataURL(file);
  });
  return {
    inlineData: { data: await base64EncodedDataPromise, mimeType: file.type },
  };
};

const getPromptForFactor = (factor: EnhancementFactor): string => {
    const scale = factor.replace('x', '');
    // A prompt that prioritizes detail retention over smoothness and requests logo removal.
    return `Migliora questa immagine per prepararla a un ingrandimento di ${scale} volte. Concentrati sull'aumento dei dettagli, della nitidezza e della chiarezza generale, preservando la texture naturale. Riduci il rumore e gli artefatti in modo sottile, ma dai la priorità alla conservazione dei dettagli fini piuttosto che a un risultato perfettamente liscio. L'immagine finale dovrebbe apparire come una versione a più alta risoluzione dell'originale. 

IMPORTANTE: Se l'immagine ha uno sfondo trasparente, mantieni la trasparenza esattamente come nell'originale. Non aggiungere sfondi bianchi, neri o di qualsiasi colore. Preserva perfettamente il canale alpha e i bordi dell'immagine senza artefatti o contorni bianchi.

Assicurati che l'immagine finale non contenga loghi o filigrane.`;
}

// Extract alpha mask from original image
const extractAlphaMask = (imageUrl: string): Promise<ImageData | null> => {
    return new Promise((resolve) => {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => {
            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext('2d', { alpha: true });
            
            if (!ctx) {
                resolve(null);
                return;
            }
            
            ctx.drawImage(img, 0, 0);
            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            resolve(imageData);
        };
        img.onerror = () => resolve(null);
        img.src = imageUrl;
    });
};

const upscaleImageOnClient = (imageUrl: string, factor: EnhancementFactor, originalMimeType: string, alphaMask: ImageData | null): Promise<string> => {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => {
            const scale = parseInt(factor.replace('x', ''), 10);
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d', { alpha: true });

            if (!ctx) {
                return reject(new Error('Could not get canvas context'));
            }

            canvas.width = img.width * scale;
            canvas.height = img.height * scale;
            
            // Clear canvas to ensure transparency
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            ctx.imageSmoothingQuality = 'high';
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

            // Reapply alpha mask if exists
            if (alphaMask) {
                const enhancedImageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                
                // Scale the alpha mask
                const maskCanvas = document.createElement('canvas');
                maskCanvas.width = alphaMask.width;
                maskCanvas.height = alphaMask.height;
                const maskCtx = maskCanvas.getContext('2d');
                if (maskCtx) {
                    maskCtx.putImageData(alphaMask, 0, 0);
                    
                    // Upscale the mask
                    const scaledMaskCanvas = document.createElement('canvas');
                    scaledMaskCanvas.width = canvas.width;
                    scaledMaskCanvas.height = canvas.height;
                    const scaledMaskCtx = scaledMaskCanvas.getContext('2d');
                    
                    if (scaledMaskCtx) {
                        scaledMaskCtx.imageSmoothingQuality = 'high';
                        scaledMaskCtx.drawImage(maskCanvas, 0, 0, canvas.width, canvas.height);
                        const scaledMaskData = scaledMaskCtx.getImageData(0, 0, canvas.width, canvas.height);
                        
                        // Apply the alpha mask to the enhanced image
                        for (let i = 0; i < enhancedImageData.data.length; i += 4) {
                            enhancedImageData.data[i + 3] = scaledMaskData.data[i + 3];
                        }
                        
                        ctx.putImageData(enhancedImageData, 0, 0);
                    }
                }
            }

            // Always use PNG to preserve transparency
            const outputFormat = originalMimeType === 'image/png' ? 'image/png' : originalMimeType;
            resolve(canvas.toDataURL(outputFormat));
        };
        img.onerror = (err) => {
            reject(err);
        };
        img.src = imageUrl;
    });
};

export const enhanceImage = async (imageFile: File, factor: EnhancementFactor): Promise<string> => {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    if (!apiKey) {
        throw new Error("VITE_GEMINI_API_KEY environment variable not set. Please add it to your .env.local file.");
    }
    
    try {
        // Extract alpha mask from original image BEFORE sending to API
        const reader = new FileReader();
        const originalImageUrl = await new Promise<string>((resolve, reject) => {
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = reject;
            reader.readAsDataURL(imageFile);
        });
        
        const alphaMask = await extractAlphaMask(originalImageUrl);
        
        const ai = new GoogleGenAI({ apiKey });

        const imagePart = await fileToGenerativePart(imageFile);
        const textPart = { text: getPromptForFactor(factor) };

        console.log('Sending request to Gemini API...');
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-image',
            contents: {
                parts: [imagePart, textPart]
            },
            config: {
                responseModalities: [Modality.IMAGE],
            },
        });
        
        console.log('Received response from Gemini API:', response);
        
        const firstPart = response.candidates?.[0]?.content?.parts?.[0];

        if (firstPart && 'inlineData' in firstPart && firstPart.inlineData) {
            const base64ImageBytes: string = firstPart.inlineData.data;
            const mimeType = firstPart.inlineData.mimeType;
            const enhancedImageUrl = `data:${mimeType};base64,${base64ImageBytes}`;
            
            // Now, upscale the AI-enhanced image on the client-side and reapply alpha mask
            return await upscaleImageOnClient(enhancedImageUrl, factor, imageFile.type, alphaMask);
        }

        throw new Error("Failed to get enhanced image from API response.");
    } catch (error) {
        console.error('Error in enhanceImage:', error);
        if (error instanceof Error) {
            throw new Error(`API Error: ${error.message}`);
        }
        throw error;
    }
};