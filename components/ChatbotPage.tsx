import React from 'react';
import { SkinConditionCategory, ChatMessage, SkincareRoutine } from '../types';
import Button from './common/Button';
import Chatbot from './Chatbot';
import { ArrowLeftIcon, RefreshCw } from './Icons';

interface ChatbotPageProps {
  onBack: () => void;
  onReset: () => void;
  analysisResult: SkinConditionCategory[] | null;
  haircareGoals: string[];
  recommendation: SkincareRoutine | null;
  chatHistory: ChatMessage[];
  setChatHistory: React.Dispatch<React.SetStateAction<ChatMessage[]>>;
  pastUserHistory?: any[];
  saveFullUserProfile?: (rec: SkincareRoutine | null, title: string, chat: ChatMessage[]) => Promise<void>;
}

const ChatbotPage: React.FC<ChatbotPageProps> = ({
  onBack,
  onReset,
  analysisResult,
  haircareGoals,
  recommendation,
  chatHistory,
  setChatHistory,
  pastUserHistory,
  saveFullUserProfile,
}) => {
  return (
    <div className="animate-fade-in-up flex flex-col w-full h-full bg-white rounded-2xl border-2 border-slate-300">
      <div className="flex-grow overflow-y-auto flex flex-col p-6 sm:p-8 lg:p-10">
        <div className="flex-shrink-0">
          <h2 className="text-2xl font-bold text-slate-900 mb-2">
            AI Assistant
          </h2>
          <p className="text-base text-slate-600 mb-6">
            Ask questions about your plan.
          </p>
        </div>

        <div className="flex-grow min-h-0">
          <Chatbot
            analysisResult={analysisResult}
            haircareGoals={haircareGoals}
            recommendation={recommendation}
            chatHistory={chatHistory}
            setChatHistory={setChatHistory}
            pastUserHistory={pastUserHistory}
            saveFullUserProfile={saveFullUserProfile}
            routineTitle={recommendation ? 'Your Plan' : ''} // or pass routineTitle if available
          />
        </div>
      </div>


      <div className="flex-shrink-0 flex justify-between items-center p-6 border-t border-slate-200 gap-4">
        <Button onClick={onBack} variant="ghost" size="md" className="gap-2">
          <ArrowLeftIcon className="w-4 h-4" />
          Previous
        </Button>
        <Button onClick={onReset} variant="primary" size="md" className="gap-2 bg-gradient-to-br from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700">
          <RefreshCw className="w-4 h-4" />
          Start Over
        </Button>
      </div>
    </div>
  );
};

export default ChatbotPage;
