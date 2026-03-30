import React, { useState } from 'react';
import { SkincareRoutine, FaceImage, SkinConditionCategory } from '../types';
import Button from './common/Button';
import { ArrowLeftIcon, ArrowRightIcon, Download, RefreshCw } from './Icons';
import { getCategoryStyle, HAIRCARE_GOALS } from '../constants';

interface DoctorReportProps {
  recommendation: SkincareRoutine | null;
  routineTitle: string;
  onReset: () => void;
  onBack: () => void;
  onNext: () => void;
  faceImages: FaceImage[];
  analysisResult: SkinConditionCategory[] | null;
  haircareGoals: string[];
}

const DoctorReport: React.FC<DoctorReportProps> = ({
  recommendation,
  routineTitle,
  onReset,
  onBack,
  onNext,
  faceImages,
  analysisResult,
  haircareGoals
}) => {
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async () => {
    const reportElement = document.getElementById('doctor-report-content');
    if (!reportElement || !window.html2canvas || !window.jspdf) return;

    setIsDownloading(true);
    try {
        const originalBg = reportElement.style.backgroundColor;
        reportElement.style.backgroundColor = '#FFFFFF';
        window.scrollTo(0, 0);
        
        const canvas = await window.html2canvas(reportElement, { 
            scale: 2, 
            useCORS: true,
            backgroundColor: '#ffffff',
            logging: false
        });
        
        reportElement.style.backgroundColor = originalBg;
        
        const imgData = canvas.toDataURL('image/png');
        const pdf = new window.jspdf.jsPDF({ orientation: 'p', unit: 'px', format: 'a4' });
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();
        const ratio = canvas.width / pdfWidth;
        const canvasHeightOnPdf = canvas.height / ratio;

        let heightLeft = canvasHeightOnPdf;
        let position = 0;
        
        pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, canvasHeightOnPdf, undefined, 'FAST');
        heightLeft -= pdfHeight;

        while (heightLeft > 0) {
            position -= pdfHeight;
            pdf.addPage();
            pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, canvasHeightOnPdf, undefined, 'FAST');
            heightLeft -= pdfHeight;
        }

        pdf.save('Dermatics_India_Haircare_Report.pdf');

    } catch (error) {
        console.error("Failed to download PDF:", error);
        alert("Sorry, there was an error creating the PDF. Please try again.");
    } finally {
        setIsDownloading(false);
    }
  };


  if (!recommendation) {
    return (
        <div className="text-center p-8 bg-white rounded-lg shadow-xl border border-slate-200">
            <h2 className="text-2xl font-bold text-slate-800 mb-4">Report Data Missing</h2>
            <p className="text-slate-600">We couldn't find the necessary recommendation data. Please go back and complete the previous steps.</p>
            <Button onClick={onBack} variant="primary" size="lg" className="mt-6 gap-2">
              <ArrowLeftIcon className="w-5 h-5"/>
              Go Back
            </Button>
        </div>
    )
  }

  const primaryImage = faceImages.length > 0 ? faceImages[0].previewUrl : null;
  const goalLabels = haircareGoals.map(id => {
    const goal = HAIRCARE_GOALS.find(g => g.id === id);
    return goal ? goal.label : id;
  });


  return (
    <div className="animate-fade-in-up flex flex-col w-full lg:h-full bg-white rounded-2xl border-2 border-slate-300">
      <div className="flex-grow overflow-y-auto p-6 sm:p-8 lg:p-10">
          <div className="flex items-center justify-between mb-4">
          <div>
              <h2 className="text-2xl font-extrabold text-slate-900">
                AI Trichologist's Report
              </h2>
              <p className="text-base text-slate-600">Here is a summary of your analysis and personalized plan.</p>
          </div>
          <Button onClick={handleDownload} isLoading={isDownloading} variant="secondary" size="sm" className="gap-2">
              <Download className="w-4 h-4"/>
              {isDownloading ? 'Downloading...' : 'Download'}
          </Button>
          </div>

          <div className="bg-white rounded-2xl border-2 border-slate-200 p-4 sm:p-6 lg:p-8 shadow-inner-soft">
          <div id="doctor-report-content" className="space-y-8">
              <div className="text-center border-b pb-4">
              <h1 className="text-2xl font-bold text-slate-800">{routineTitle}</h1>
              <p className="text-slate-500">Personalized Haircare Plan</p>
              <p className="text-xs text-slate-400 mt-1">Generated on: {new Date().toLocaleDateString()}</p>
              </div>

              {analysisResult && analysisResult.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="md:col-span-2">
                      <h3 className="text-lg font-semibold text-slate-700 mb-3 border-b pb-2">AI Hair & Scalp Analysis Findings</h3>
                      {analysisResult.map(category => {
                          const style = getCategoryStyle(category.category);
                          const Icon = style.icon;
                          return (
                              <div key={category.category} className="mb-3">
                                  <h4 className={`font-bold text-base flex items-center gap-2 ${style.tailwind.text}`}>
                                      <Icon className={`w-5 h-5 ${style.tailwind.icon}`} />
                                      {category.category}
                                  </h4>
                                  <ul className="list-disc list-inside pl-2 text-sm text-slate-600">
                                      {category.conditions.map(c => <li key={c.name}>{c.name} ({c.location})</li>)}
                                  </ul>
                              </div>
                          );
                      })}
                  </div>
                  {primaryImage && (
                      <div className="flex justify-center items-start">
                          <img src={primaryImage} alt="Your Hair/Scalp" className="rounded-lg shadow-md max-h-48 border"/>
                      </div>
                  )}
                </div>
              )}
              
              <div>
              <h3 className="text-lg font-semibold text-slate-700 mb-3 border-b pb-2">Your Haircare Goals</h3>
              <ul className="list-disc list-inside text-slate-600 space-y-1">
                  {goalLabels.map(goal => <li key={goal}>{goal}</li>)}
              </ul>
              </div>

              <div>
              <h3 className="text-lg font-semibold text-slate-700 mb-3 border-b pb-2">Recommended Routine</h3>
              <p className="text-sm text-slate-600 mb-4 italic">{recommendation.introduction}</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                  <h4 className="font-bold text-md text-slate-800 mb-2">Main Routine</h4>
                  <ul className="space-y-3">
                      {recommendation.am.map(step => (
                      <li key={step.productId} className="text-sm">
                          <strong className="text-slate-700 block">{step.stepType}: {step.productName}</strong>
                          <p className="text-slate-500 pl-2 border-l-2 border-slate-200 ml-1 mt-0.5">{step.purpose}</p>
                      </li>
                      ))}
                  </ul>
                  </div>
                  {recommendation.pm.length > 0 && (
                  <div>
                      <h4 className="font-bold text-md text-slate-800 mb-2">Secondary Routine</h4>
                      <ul className="space-y-3">
                      {recommendation.pm.map(step => (
                          <li key={step.productId} className="text-sm">
                          <strong className="text-slate-700 block">{step.stepType}: {step.productName}</strong>
                          <p className="text-slate-500 pl-2 border-l-2 border-slate-200 ml-1 mt-0.5">{step.purpose}</p>
                          </li>
                      ))}
                      </ul>
                  </div>
                  )}
              </div>
              </div>
              
              <div>
              <h3 className="text-lg font-semibold text-slate-700 mb-3 border-b pb-2">Additional Advice</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                      <div>
                          <h4 className="font-bold text-slate-800 mb-2">Key Ingredients</h4>
                          <ul className="list-disc list-inside text-slate-600 space-y-1">
                              {recommendation.keyIngredients.map(ing => <li key={ing}>{ing}</li>)}
                          </ul>
                      </div>
                      <div>
                          <h4 className="font-bold text-slate-800 mb-2">Lifestyle Tips</h4>
                          <ul className="list-disc list-inside text-slate-600 space-y-1">
                              {recommendation.lifestyleTips.map(tip => <li key={tip}>{tip}</li>)}
                          </ul>
                      </div>
                  </div>
              </div>

              <div className="pt-4 border-t">
                  <h4 className="font-bold text-slate-800 mb-2">Disclaimer</h4>
                  <p className="text-xs text-slate-500">{recommendation.disclaimer}</p>
              </div>

          </div>
          </div>
      </div>

      <div className="flex-shrink-0 flex justify-between items-center p-6 border-t border-slate-200 gap-4">
        <Button onClick={onBack} variant="ghost" size="md" className="gap-2">
            <ArrowLeftIcon className="w-4 h-4" />
            Previous
        </Button>
        <Button onClick={onNext} variant="primary" size="md" className="gap-2 bg-gradient-to-br from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700">
            Next
            <ArrowRightIcon className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};

export default DoctorReport;