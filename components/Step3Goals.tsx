import React, { useMemo, useCallback, useState, useEffect } from 'react';
import { HairProfileData, SkinConditionCategory, SkincareRoutine } from '../types';
import Button from './common/Button';
import { HAIRCARE_GOALS, LOADING_TIPS, LOADING_TIP_STYLES, CATEGORY_STYLES } from '../constants';
import { generateRoutine } from '../services/geminiService';
import { CheckIcon, SparklesIcon, ArrowLeftIcon, ArrowRightIcon } from './Icons';

interface Step3Props {
  onBack: () => void;
  analysisResult: SkinConditionCategory[] | null;
  haircareGoals: string[];
  setHaircareGoals: (goals: string[]) => void;
  pastProducts: Partial<HairProfileData>;
  setRecommendation: (rec: SkincareRoutine) => void;
  setRoutineTitle: (title: string) => void;
  setStep: (step: number) => void;
  setIsLoading: (loading: boolean) => void;
  isLoading: boolean;
  saveFullUserProfile?: (rec: SkincareRoutine | null, title: string, chat?: any[], sId?: string | null) => Promise<void>;
  setSessionId?: (id: string) => void;
}

const EXTENDED_LOADING_TIPS: string[] = [
  "This is taking a bit longer than usual, but we want to get it just right for you.",
  "Analyzing thousands of product combinations to find your perfect match.",
  "Cross-referencing ingredients against your unique hair analysis for maximum effectiveness.",
  "Thanks for your patience! We're putting the final touches on your personalized plan."
];

interface LoadingOverlayProps {
  tips: string[];
  title: string;
}

const LoadingOverlay: React.FC<LoadingOverlayProps> = ({ tips, title }) => {
  const [currentTips, setCurrentTips] = useState(tips);
  const [currentTipIndex, setCurrentTipIndex] = useState(0);
  const [countdown, setCountdown] = useState(60);
  const [isExtendedWait, setIsExtendedWait] = useState(false);

  useEffect(() => {
    const tipInterval = setInterval(() => {
      setCurrentTipIndex((prevIndex) => (prevIndex + 1) % (currentTips.length || 1));
    }, 4000);

    let countdownInterval: ReturnType<typeof setInterval> | undefined;
    if (!isExtendedWait) {
      countdownInterval = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            clearInterval(countdownInterval);
            setIsExtendedWait(true);
            setCurrentTips(EXTENDED_LOADING_TIPS);
            setCurrentTipIndex(0);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      clearInterval(tipInterval);
      if (countdownInterval) {
        clearInterval(countdownInterval);
      }
    };
  }, [currentTips.length, isExtendedWait]);

  const currentTip = currentTips[currentTipIndex];
  const currentStyle = LOADING_TIP_STYLES[currentTipIndex % LOADING_TIP_STYLES.length];
  const Icon = currentStyle.Icon;

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in-up">
      <div className="bg-white rounded-2xl shadow-xl p-4 sm:p-6 text-center max-w-md w-full mx-4 flex flex-col items-center">
        <div className="relative w-20 h-20">
          <div className="absolute inset-0 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            {!isExtendedWait ? (
              <span className="text-base font-bold text-brand-primary tabular-nums">{countdown}s</span>
            ) : (
              <div className="w-3 h-3 bg-blue-600 rounded-full animate-ping"></div>
            )}
          </div>
        </div>
        <h2 className="text-lg font-bold text-slate-800 mt-5">
          {isExtendedWait ? "Putting on the final touches..." : title}
        </h2>
        <div className="w-full mt-4 min-h-[80px]">
          <div
            key={currentTipIndex + (isExtendedWait ? 'ext' : 'reg')}
            className={`p-3 rounded-lg border flex items-start gap-3 animate-fade-in-up ${currentStyle.bg}`}
          >
            <Icon className={`w-6 h-6 flex-shrink-0 ${currentStyle.iconColor}`} />
            <div className={`${currentStyle.text} text-left text-xs`}>
              <strong className="block font-semibold">Helpful Tip</strong>
              <p>{currentTip}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};


const Step3Goals: React.FC<Step3Props> = ({
  onBack, analysisResult, haircareGoals, setHaircareGoals, pastProducts,
  setRecommendation, setRoutineTitle, setStep, setIsLoading, isLoading, saveFullUserProfile, setSessionId
}) => {
  const [customGoal, setCustomGoal] = useState('');

  const getGoalStyle = (goal) => {
    if (goal.relatedConditions.length > 0) {
      const category = goal.relatedConditions[0];
      if (CATEGORY_STYLES[category]) {
        return CATEGORY_STYLES[category];
      }
    }
    return CATEGORY_STYLES['Default'];
  };

  const suggestedGoals = useMemo(() => {
    if (!analysisResult) return new Set();
    const detectedCategories = new Set(analysisResult.map(ar => ar.category));
    const suggestions = new Set<string>();
    HAIRCARE_GOALS.forEach(goal => {
      if (goal.relatedConditions.some(rc => detectedCategories.has(rc))) {
        suggestions.add(goal.id);
      }
    });
    return suggestions;
  }, [analysisResult]);

  const handleGoalToggle = (goalId: string) => {
    const isNoneSelected = goalId === 'none';
    const wasNoneSelected = haircareGoals.includes('none');

    if (isNoneSelected) {
      setHaircareGoals(wasNoneSelected ? [] : ['none']);
    } else {
      const otherGoals = haircareGoals.filter(g => g !== 'none');
      if (otherGoals.includes(goalId)) {
        setHaircareGoals(otherGoals.filter(g => g !== goalId));
      } else {
        setHaircareGoals([...otherGoals, goalId]);
      }
    }
  };

  const handleGenerateRoutine = useCallback(async () => {
    const goalsForApi = haircareGoals
      .map(id => {
        if (id === 'other') {
          return customGoal.trim();
        }
        if (id === 'none') {
          return null;
        }
        return HAIRCARE_GOALS.find(g => g.id === id)?.label || null;
      })
      .filter((g): g is string => !!g);

    setIsLoading(true);
    try {
      const { recommendation, title } = await generateRoutine(pastProducts, analysisResult || [], goalsForApi);
      setRecommendation(recommendation);
      setRoutineTitle(title);
      const newSessionId = Date.now().toString();
      if (setSessionId) setSessionId(newSessionId);
      if (saveFullUserProfile) {
        await saveFullUserProfile(recommendation, title, [], newSessionId);
      }
      setStep(6);
    } catch (error) {
      alert((error as Error).message);
    } finally {
      setIsLoading(false);
    }
  }, [analysisResult, haircareGoals, customGoal, pastProducts, setRecommendation, setRoutineTitle, setStep, setIsLoading, saveFullUserProfile]);

  const isGenerateDisabled = haircareGoals.length === 0 || isLoading || (haircareGoals.includes('other') && !customGoal.trim());

  return (
    <>
      {isLoading && <LoadingOverlay title="Crafting your personalized plan..." tips={LOADING_TIPS} />}
      <div className="animate-fade-in-up flex flex-col w-full lg:h-full bg-white rounded-2xl border-2 border-slate-300">
        <div className="flex-grow overflow-y-auto p-6 sm:p-8 lg:p-10">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">
              Your Goals
            </h2>
            <p className="text-base text-slate-600 mb-8">Select your desired outcomes. We've highlighted some suggestions based on your hair & scalp analysis.</p>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {HAIRCARE_GOALS.map(goal => {
                const isSelected = haircareGoals.includes(goal.id);
                const isSuggested = suggestedGoals.has(goal.id);
                const Icon = goal.icon;
                const style = getGoalStyle(goal);
                return (
                  <div
                    key={goal.id}
                    onClick={() => handleGoalToggle(goal.id)}
                    className={`p-3 rounded-xl border-2 cursor-pointer transition-all duration-200 relative flex flex-col items-center justify-center text-center h-24 group hover:scale-105 hover:-translate-y-1 hover:shadow-xl ${isSelected
                        ? 'border-brand-primary bg-blue-50/80 shadow-lg'
                        : `bg-white`
                      }`}
                  >
                    <Icon className={`w-7 h-7 mb-1.5 transition-colors duration-200 ${isSelected
                      ? 'text-brand-primary'
                      : `${style.tailwind.icon} group-hover:text-brand-primary`
                      }`} />
                    <h4 className={`text-xs font-bold transition-colors duration-200 ${isSelected ? 'text-slate-800' : 'text-slate-600 group-hover:text-slate-800'}`}>{goal.label}</h4>
                    {isSuggested && !isSelected && (
                      <div className="absolute top-2 right-2 p-1 bg-amber-300 rounded-full shadow-sm group-hover:bg-amber-400 transition-colors" title="Suggested based on your analysis">
                        <SparklesIcon className="w-4 h-4 text-amber-800" />
                      </div>
                    )}
                    {isSelected && (
                      <div className="absolute top-2 right-2 h-6 w-6 bg-brand-primary rounded-full flex items-center justify-center shadow-sm">
                        <CheckIcon className="h-4 w-4 text-white" strokeWidth={3} />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
            {haircareGoals.includes('other') && (
              <div className="mt-6 animate-fade-in-up">
                <label htmlFor="custom-goal-input" className="block text-base font-semibold text-brand-text-main mb-2">
                  Please specify your goal:
                </label>
                <input
                  id="custom-goal-input"
                  type="text"
                  value={customGoal}
                  onChange={(e) => setCustomGoal(e.target.value)}
                  className="block w-full bg-white text-brand-text-main placeholder-slate-400 border border-slate-300 rounded-lg py-2.5 px-4 focus:ring-2 focus:ring-brand-primary-light focus:border-brand-primary-light transition-all text-base shadow-sm"
                  placeholder="e.g., Add shine to my hair"
                  autoFocus
                />
              </div>
            )}
          </div>
        </div>

        <div className="flex-shrink-0 flex justify-between p-6 border-t border-slate-200">
          <Button onClick={onBack} variant="ghost" size="md" disabled={isLoading} className="gap-2">
            <ArrowLeftIcon className="w-4 h-4" />
            Previous
          </Button>
          <Button onClick={handleGenerateRoutine} disabled={isGenerateDisabled} size="md" className="gap-2 bg-gradient-to-br from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700">
            {isLoading ? 'Generating...' : 'Generate My Plan'}
            {!isLoading && <ArrowRightIcon className="w-4 h-4" />}
          </Button>
        </div>
      </div>
    </>
  );
};

export default Step3Goals;
