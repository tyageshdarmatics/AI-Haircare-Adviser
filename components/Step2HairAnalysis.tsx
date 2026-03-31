import React, { useCallback, useState, useEffect, useRef } from 'react';
import { SkinConditionCategory, FaceImage } from '../types';
import Button from './common/Button';
import { analyzeImage } from '../services/geminiService';
import { UploadCloud, CheckCircle, X, CameraIcon, TriangleAlertIcon, ArrowLeftIcon, ArrowRightIcon, Plus, SparklesIcon } from './Icons';
import CameraCapture from './CameraCapture';
import { getCategoryStyle } from '../constants';
import Card from './common/Card';

interface Step3HairAnalysisProps {
  onNext: () => void;
  onBack: () => void;
  faceImages: FaceImage[];
  setFaceImages: (files: FaceImage[] | ((prevFiles: FaceImage[]) => FaceImage[])) => void;
  analysisResult: SkinConditionCategory[] | null;
  setAnalysisResult: (result: SkinConditionCategory[] | null) => void;
  setIsLoading: (loading: boolean) => void;
  isLoading: boolean;
}

const Step3HairAnalysis: React.FC<Step3HairAnalysisProps> = ({
  onNext, onBack, faceImages, setFaceImages, analysisResult, setAnalysisResult, setIsLoading, isLoading,
}) => {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [hoveredCondition, setHoveredCondition] = useState<string | null>(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const [imageRenderInfo, setImageRenderInfo] = useState<{ width: number; height: number; top: number; left: number; } | null>(null);

  const imageRef = useRef<HTMLImageElement>(null);
  const imageContainerRef = useRef<HTMLDivElement>(null);

  const calculateImageRenderInfo = useCallback(() => {
    if (imageRef.current && imageContainerRef.current) {
      const image = imageRef.current;
      const container = imageContainerRef.current;

      const containerWidth = container.clientWidth;
      const containerHeight = container.clientHeight;
      if (containerWidth === 0 || containerHeight === 0) return;
      const containerAspect = containerWidth / containerHeight;

      const naturalWidth = image.naturalWidth;
      const naturalHeight = image.naturalHeight;
      if (naturalWidth === 0 || naturalHeight === 0) return;
      const imageAspect = naturalWidth / naturalHeight;

      let scaledWidth, scaledHeight, left, top;

      if (imageAspect > containerAspect) {
        // Image is wider than container, so it's pillarboxed (limited by width)
        scaledWidth = containerWidth;
        scaledHeight = scaledWidth / imageAspect;
        top = (containerHeight - scaledHeight) / 2;
        left = 0;
      } else {
        // Image is taller than or same aspect as container, so it's letterboxed (limited by height)
        scaledHeight = containerHeight;
        scaledWidth = scaledHeight * imageAspect;
        left = (containerWidth - scaledWidth) / 2;
        top = 0;
      }
      setImageRenderInfo({ width: scaledWidth, height: scaledHeight, top, left });
    } else {
      setImageRenderInfo(null);
    }
  }, []);

  useEffect(() => {
    if (!isLoading) return;
    setCountdown(60);
    const timer = setInterval(() => {
      setCountdown(prev => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [isLoading]);
  
  useEffect(() => {
    setImageRenderInfo(null); // Reset on image change
    // `calculateImageRenderInfo` will be called by the image's `onLoad` event
    window.addEventListener('resize', calculateImageRenderInfo);
    return () => {
      window.removeEventListener('resize', calculateImageRenderInfo);
    };
  }, [activeImageIndex, faceImages, calculateImageRenderInfo]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newImages = Array.from(e.target.files).map(file => ({
        file,
        previewUrl: URL.createObjectURL(file as Blob)
      }));
      setFaceImages(prevImages => [...prevImages, ...newImages]);
      setAnalysisResult(null); 
      setHoveredCondition(null);
      e.target.value = ''; 
    }
  };

  const handleRemoveImage = (indexToRemove: number) => {
    setFaceImages(prevImages => {
      const imageToRemove = prevImages[indexToRemove];
      if (imageToRemove) URL.revokeObjectURL(imageToRemove.previewUrl);
      const updatedImages = prevImages.filter((_, index) => index !== indexToRemove);
      if (activeImageIndex >= updatedImages.length && updatedImages.length > 0) {
        setActiveImageIndex(updatedImages.length - 1);
      } else if (updatedImages.length === 0) {
        setActiveImageIndex(0);
        setImageRenderInfo(null);
      }
      return updatedImages;
    });
  };

  const handlePhotoCapture = useCallback(async (dataUrl: string) => {
    setIsCameraOpen(false);
    const dataURLtoFile = async (dataUrl: string, filename: string): Promise<File> => {
        const res = await fetch(dataUrl);
        const blob = await res.blob();
        return new File([blob], filename, { type: 'image/jpeg' });
    };
    try {
        const file = await dataURLtoFile(dataUrl, `capture-${Date.now()}.jpg`);
        const newImage: FaceImage = { file, previewUrl: URL.createObjectURL(file) };
        setFaceImages(prevImages => [...prevImages, newImage]);
        setAnalysisResult(null);
        setHoveredCondition(null);
    } catch (error) {
        console.error("Error converting data URL to file:", error);
        alert("Could not process the captured image.");
    }
  }, [setFaceImages, setAnalysisResult]);


  const handleAnalyze = useCallback(async () => {
    if (faceImages.length === 0) return;
    setIsLoading(true);
    setAnalysisResult(null);
    setHoveredCondition(null);
    try {
      const filesToAnalyze = faceImages.map(img => img.file);
      const response = await analyzeImage(filesToAnalyze);
      if (response.error) {
        alert(response.message || "The uploaded image is not valid. Please upload a clear photo of your hair or scalp.");
        setAnalysisResult(null);
      } else {
        setAnalysisResult(response.analysis);
      }
    } catch (error) {
      alert((error as Error).message);
    } finally {
      setIsLoading(false);
    }
  }, [faceImages, setAnalysisResult, setIsLoading]);

  const activeImage = faceImages[activeImageIndex];
  
  return (
    <div className="animate-fade-in-up flex flex-col w-full lg:h-full bg-white rounded-2xl border-2 border-slate-300">
        <div className="flex-grow overflow-y-auto p-6 sm:p-8 lg:p-10">
            <h2 className="text-2xl font-bold text-brand-text-main mb-2">
                Hair & Scalp Analysis
            </h2>
            <p className="text-brand-text-muted mt-1 mb-6">Upload photos for our AI to analyze, or skip to continue.</p>

            {faceImages.length === 0 && !analysisResult && (
              <div className="rounded-lg bg-blue-50 p-4 text-sm text-blue-800 border border-blue-200 mb-8 flex items-start gap-3" role="status">
                <SparklesIcon className="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold">Photo upload is optional</p>
                  <p className="leading-relaxed mt-1">
                      No photo? No problem. We can generate a personalized plan based on your questionnaire answers. Simply use the "Skip & Continue" button below to proceed.
                  </p>
                </div>
              </div>
            )}

            {analysisResult ? (
              // POST-ANALYSIS VIEW
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                <div className="flex flex-col gap-4">
                    <div ref={imageContainerRef} className="relative w-full aspect-video bg-slate-100 rounded-lg border border-slate-200 flex items-center justify-center overflow-hidden">
                      {activeImage ? (
                          <>
                              <img ref={imageRef} src={activeImage.previewUrl} onLoad={calculateImageRenderInfo} alt={`Hair preview ${activeImageIndex + 1}`} className="w-full h-full object-contain" />
                              {imageRenderInfo && (
                                  <div className="absolute pointer-events-none" style={{
                                      width: `${imageRenderInfo.width}px`,
                                      height: `${imageRenderInfo.height}px`,
                                      top: `${imageRenderInfo.top}px`,
                                      left: `${imageRenderInfo.left}px`,
                                  }}>
                                      {analysisResult.flatMap(cat =>
                                          cat.conditions.flatMap(cond =>
                                              cond.boundingBoxes
                                                  .filter(bbox => bbox.imageId === activeImageIndex)
                                                  .map((bbox, i) => {
                                                      const style = getCategoryStyle(cat.category);
                                                      const isHovered = hoveredCondition === cond.name;
                                                      const opacity = hoveredCondition === null ? 0.7 : (isHovered ? 1 : 0.2);
                                                      const zIndex = isHovered ? 20 : 10;
                                                      const transform = isHovered ? 'scale(1.03)' : 'scale(1)';
                                                      return (
                                                          <div
                                                              key={`${cond.name}-${i}`}
                                                              className="absolute transition-all duration-200 ease-in-out rounded-sm pointer-events-auto"
                                                              style={{
                                                                  border: `3px solid ${style.hex}`,
                                                                  top: `${bbox.box.y1 * 100}%`,
                                                                  left: `${bbox.box.x1 * 100}%`,
                                                                  width: `${(bbox.box.x2 - bbox.box.x1) * 100}%`,
                                                                  height: `${(bbox.box.y2 - bbox.box.y1) * 100}%`,
                                                                  opacity, transform, zIndex,
                                                                  boxShadow: `0 0 15px ${style.hex}${isHovered ? '80' : '00'}`
                                                              }}
                                                          >
                                                              {isHovered && (
                                                                  <span className={`absolute -top-6 left-0 text-xs font-semibold px-1.5 py-0.5 rounded whitespace-nowrap ${style.tailwind.legendBg}`} style={{ color: style.hex, borderColor: style.hex, borderWidth: '1px' }}>
                                                                      {cond.name}
                                                                  </span>
                                                              )}
                                                          </div>
                                                      );
                                                  })
                                          )
                                      )}
                                  </div>
                              )}
                          </>
                      ) : ( <p className="text-slate-500">No image available</p> )}
                    </div>
                    {faceImages.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                          {faceImages.map((image, index) => (
                              <div key={image.previewUrl} className="relative w-16 h-16">
                                  <img src={image.previewUrl} alt={`Thumbnail ${index + 1}`} onClick={() => setActiveImageIndex(index)} className={`w-full h-full object-cover rounded-md shadow-sm cursor-pointer transition-all ${activeImageIndex === index ? 'ring-2 ring-blue-500 scale-105' : 'opacity-70 hover:opacity-100'}`} />
                                  <button onClick={() => handleRemoveImage(index)} className="absolute -top-1.5 -right-1.5 bg-red-500 text-white rounded-full p-1 transition-transform hover:scale-110" aria-label="Remove image">
                                      <X className="w-2.5 h-2.5" />
                                  </button>
                              </div>
                          ))}
                          <label htmlFor="face-image-upload-2" className="flex items-center justify-center w-16 h-16 bg-slate-100 rounded-lg border-2 border-dashed border-slate-300 text-slate-500 hover:bg-slate-200 hover:border-blue-400 transition-colors cursor-pointer">
                            <Plus className="w-6 h-6"/>
                            <input id="face-image-upload-2" type="file" accept="image/*" multiple onChange={handleFileChange} className="sr-only" />
                          </label>
                          <button
                              onClick={() => setIsCameraOpen(true)}
                              className="flex items-center justify-center w-16 h-16 bg-slate-100 rounded-lg border-2 border-dashed border-slate-300 text-slate-500 hover:bg-slate-200 hover:border-blue-400 transition-colors cursor-pointer"
                              title="Use camera"
                          >
                              <CameraIcon className="w-6 h-6" />
                          </button>
                      </div>
                  )}
                </div>
                <div className="flex flex-col justify-center">
                  <div className="animate-fade-in-up">
                      <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-3 text-lg font-bold text-green-600">
                              <CheckCircle className="w-8 h-8 text-green-500" />
                              <h3>Analysis Complete!</h3>
                          </div>
                          <Button onClick={handleAnalyze} disabled={faceImages.length === 0} isLoading={isLoading} size="sm" variant="secondary">
                            Re-analyze
                          </Button>
                      </div>
                      <div className="max-h-[27rem] overflow-y-auto pr-2 -mr-2">
                        {analysisResult.map((category) => {
                            const style = getCategoryStyle(category.category);
                            const Icon = style.icon;
                            return (
                                <div key={category.category} className="py-4 border-b border-slate-200 last:border-b-0">
                                    <h4 className={`font-bold text-base mb-3 flex items-center gap-2 ${style.tailwind.text}`}>
                                        <Icon className={`w-5 h-5 ${style.tailwind.icon}`} />
                                        {category.category}
                                    </h4>
                                    <ul className="space-y-1.5">
                                    {category.conditions.map((condition) => (
                                        <li key={condition.name} className={`flex justify-between items-center text-sm transition-all rounded-md p-2 -mx-2 cursor-pointer ${hoveredCondition === condition.name ? `bg-blue-50` : 'hover:bg-slate-50'}`} onMouseEnter={() => setHoveredCondition(condition.name)} onMouseLeave={() => setHoveredCondition(null)}>
                                            <div className="flex-grow pr-2">
                                                <span className="text-slate-700 font-semibold block">{condition.name}</span>
                                                <span className="text-slate-500 text-xs">{condition.location}</span>
                                            </div>
                                            <span className={`font-semibold text-right text-sm flex-shrink-0 ${style.tailwind.text}`}>{condition.confidence}%</span>
                                        </li>
                                    ))}
                                    </ul>
                                </div>
                            )
                        })}
                      </div>
                  </div>
                </div>
              </div>
            ) : faceImages.length === 0 ? (
              // PRE-ANALYSIS, NO IMAGES UPLOADED VIEW
              <>
                <div className="rounded-lg bg-red-50 p-4 text-xs text-red-800 border border-red-200 mb-8 flex items-start gap-3" role="alert">
                    <TriangleAlertIcon className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
                    <p className="leading-relaxed">
                        For best results, upload clear, well-lit photos of your scalp and hair loss areas — including front, top/crown, and side views if applicable. Adding multiple images helps ensure more accurate results.
                    </p>
                </div>
                <div className="flex flex-col items-center justify-center gap-6 text-center mt-8">
                    <label 
                        htmlFor="face-image-upload-initial" 
                        className="relative block w-full max-w-lg cursor-pointer rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 p-8 text-center transition-colors hover:border-blue-400 hover:bg-blue-50/50"
                    >
                        <UploadCloud className="mx-auto h-12 w-12 text-slate-400" />
                        <span className="mt-4 block text-base font-semibold text-slate-700">Drag & drop photos here</span>
                        <span className="mt-1 block text-sm text-slate-500">or click to browse</span>
                        <input id="face-image-upload-initial" type="file" accept="image/*" multiple onChange={handleFileChange} className="sr-only" />
                    </label>
                    <div className="flex items-center gap-4 w-full max-w-lg">
                        <div className="h-px flex-grow bg-slate-200"></div>
                        <span className="text-slate-500 font-semibold text-sm">OR</span>
                        <div className="h-px flex-grow bg-slate-200"></div>
                    </div>
                    <Button onClick={() => setIsCameraOpen(true)} variant="secondary" size="md" className="gap-2">
                        <CameraIcon className="w-5 h-5"/>
                        Use Camera
                    </Button>
                </div>
              </>
            ) : (
              // PRE-ANALYSIS, IMAGES UPLOADED VIEW
              <div className="flex flex-col items-center gap-6">
                 <div className="w-full max-w-lg flex flex-col gap-4">
                    <div ref={imageContainerRef} className="relative w-full aspect-video bg-slate-100 rounded-lg border border-slate-200 flex items-center justify-center overflow-hidden">
                      {activeImage ? (
                          <img ref={imageRef} src={activeImage.previewUrl} onLoad={calculateImageRenderInfo} alt={`Hair preview ${activeImageIndex + 1}`} className="w-full h-full object-contain" />
                      ) : ( <p className="text-slate-500">No image selected</p> )}
                      {isLoading && (
                          <div className="absolute inset-0 bg-brand-dark/80 backdrop-blur-sm flex flex-col items-center justify-center text-center p-4 rounded-lg z-10 animate-fade-in-up overflow-hidden">
                              <div className="absolute inset-0 w-full h-full bg-[linear-gradient(to_right,rgba(59,130,246,0.1)_1px,transparent_1px),linear-gradient(to_bottom,rgba(59,130,246,0.1)_1px,transparent_1px)] bg-[size:2rem_2rem] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)]"></div>
                              <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
                                  <div className="absolute left-0 w-full h-1 bg-brand-primary-light/80 shadow-[0_0_20px_theme(colors.brand.primary.light)] animate-scan-line"></div>
                              </div>
                              <div className="relative animate-pulse-soft-blue w-16 h-16 border-2 border-brand-primary-light/50 rounded-full flex items-center justify-center">
                                  <span className="text-xl font-bold text-brand-primary-light font-mono tabular-nums">{countdown}s</span>
                              </div>
                              <p className="text-xs font-semibold text-white mt-3 z-10 tracking-widest">ANALYSING</p>
                              <p className="text-[10px] text-slate-300 z-10">Please wait while our AI scans your image...</p>
                          </div>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {faceImages.map((image, index) => (
                            <div key={image.previewUrl} className="relative w-16 h-16">
                                <img src={image.previewUrl} alt={`Thumbnail ${index + 1}`} onClick={() => setActiveImageIndex(index)} className={`w-full h-full object-cover rounded-md shadow-sm cursor-pointer transition-all ${activeImageIndex === index ? 'ring-2 ring-blue-500 scale-105' : 'opacity-70 hover:opacity-100'}`} />
                                <button onClick={() => handleRemoveImage(index)} className="absolute -top-1.5 -right-1.5 bg-red-500 text-white rounded-full p-1 transition-transform hover:scale-110" aria-label="Remove image">
                                    <X className="w-2.5 h-2.5" />
                                </button>
                            </div>
                        ))}
                        <label htmlFor="face-image-upload-more" className="flex items-center justify-center w-16 h-16 bg-slate-100 rounded-lg border-2 border-dashed border-slate-300 text-slate-500 hover:bg-slate-200 hover:border-blue-400 transition-colors cursor-pointer" title="Add more images">
                            <Plus className="w-6 h-6"/>
                            <input id="face-image-upload-more" type="file" accept="image/*" multiple onChange={handleFileChange} className="sr-only" />
                        </label>
                        <button
                            onClick={() => setIsCameraOpen(true)}
                            className="flex items-center justify-center w-16 h-16 bg-slate-100 rounded-lg border-2 border-dashed border-slate-300 text-slate-500 hover:bg-slate-200 hover:border-blue-400 transition-colors cursor-pointer"
                            title="Use camera"
                        >
                            <CameraIcon className="w-6 h-6" />
                        </button>
                    </div>
                 </div>
                  <Button onClick={handleAnalyze} disabled={faceImages.length === 0 || isLoading} isLoading={isLoading} size="md" className="w-full max-w-sm">
                      {isLoading ? 'Analyzing...' : 'Analyze My Hair & Scalp'}
                  </Button>
              </div>
            )}
        </div>
        <div className="flex-shrink-0 flex justify-between p-6 border-t border-slate-200">
          <Button onClick={onBack} variant="ghost" size="md" className="gap-2">
            <ArrowLeftIcon className="w-4 h-4" />
            Previous
          </Button>
          {analysisResult ? (
            <Button onClick={onNext} size="md" className="gap-2 bg-gradient-to-br from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700">
              Next
              <ArrowRightIcon className="w-4 h-4" />
            </Button>
          ) : (
             <Button 
                onClick={() => {
                    setAnalysisResult(null); // Ensure analysis is cleared before proceeding
                    onNext();
                }} 
                variant="secondary" 
                size="md" 
                className="gap-2"
            >
              Skip & Continue
              <ArrowRightIcon className="w-4 h-4" />
            </Button>
          )}
        </div>
        {isCameraOpen && <CameraCapture onCapture={handlePhotoCapture} onClose={() => setIsCameraOpen(false)} />}
    </div>
  );
};

export default Step3HairAnalysis;