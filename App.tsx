
import React, { useState, useCallback } from 'react';
import { HairProfileData, SkincareRoutine, ChatMessage, FaceImage, CartItem, RoutineStep, AlternativeProduct, SkinConditionCategory } from './types';
import Step1Start from './components/Step1Start';
import Step2UserInfo from './components/Step2UserInfo';
import Step2HealthQuestionnaire from './components/Step1HairQuestionnaire';
import Step3HairAnalysis from './components/Step2HairAnalysis';
import Step4Goals from './components/Step3Goals';
import Step5YourPlan from './components/Report';
import Step6DoctorReport from './components/DoctorReport';
import ChatbotPage from './components/ChatbotPage';
import TopHeader from './components/TopHeader';
import Header from './components/Header';
import CartDrawer from './components/CartDrawer';
import Sidebar from './components/Sidebar';
import Step1PastProducts from './components/Step1PastProducts';

const App: React.FC = () => {
  const [step, setStep] = useState<number>(1);
  const [hairProfileData, setHairProfileData] = useState<Partial<HairProfileData>>({});
  const [faceImages, setFaceImages] = useState<FaceImage[]>([]);
  const [analysisResult, setAnalysisResult] = useState<SkinConditionCategory[] | null>(null);
  const [haircareGoals, setHaircareGoals] = useState<string[]>([]);
  const [recommendation, setRecommendation] = useState<SkincareRoutine | null>(null);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [routineTitle, setRoutineTitle] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [pastUserHistory, setPastUserHistory] = useState<any[]>([]);
  const [sessionId, setSessionId] = useState<string | null>(null);

  const saveFullUserProfile = useCallback(async (
    rec: SkincareRoutine | null,
    title: string,
    chat: ChatMessage[] = [],
    sId: string | null = sessionId
  ) => {
    if (!userId) return;
    try {
      await fetch(`/api/users/${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId: sId,
          hairProfileData,
          analysisResult,
          haircareGoals,
          recommendation: rec,
          routineTitle: title,
          chatHistory: chat
        })
      });
    } catch (error) {
      console.error('Error saving full profile:', error);
    }
  }, [userId, hairProfileData, analysisResult, haircareGoals, sessionId]);

  const handleNextStep = () => setStep(prev => prev + 1);
  const handlePrevStep = () => setStep(prev => prev - 1);

  const resetState = useCallback(() => {
    faceImages.forEach(image => URL.revokeObjectURL(image.previewUrl));
    setStep(1);
    setHairProfileData({});
    setFaceImages([]);
    setAnalysisResult(null);
    setHaircareGoals([]);
    setRecommendation(null);
    setChatHistory([]);
    setRoutineTitle('');
    setIsLoading(false);
    setCart([]);
    setIsCartOpen(false);
    setIsMobileMenuOpen(false);
  }, [faceImages]);

  const handleAddToCart = (product: RoutineStep | AlternativeProduct) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.productId === product.productId);
      if (existingItem) {
        return prevCart.map(item =>
          item.productId === product.productId
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        return [...prevCart, { ...product, quantity: 1 }];
      }
    });
  };

  const handleBulkAddToCart = (products: (RoutineStep | AlternativeProduct)[]) => {
    setCart(prevCart => {
      const newCart = [...prevCart];
      const cartMap: Map<string, CartItem> = new Map(newCart.map(item => [item.productId, item]));

      products.forEach(productToAdd => {
        const existingItem = cartMap.get(productToAdd.productId);
        if (existingItem) {
          existingItem.quantity += 1;
        } else {
          const newItem: CartItem = { ...productToAdd, quantity: 1 };
          newCart.push(newItem);
          cartMap.set(newItem.productId, newItem);
        }
      });

      return newCart;
    });
  };

  const handleRemoveFromCart = (productId: string) => {
    setCart(prevCart => prevCart.filter(item => item.productId !== productId));
  };

  const handleUpdateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      handleRemoveFromCart(productId);
    } else {
      setCart(prevCart =>
        prevCart.map(item =>
          item.productId === productId ? { ...item, quantity } : item
        )
      );
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <Step1Start
            onNext={handleNextStep}
            setHairProfileData={setHairProfileData}
            hairProfileData={hairProfileData}
            setUserId={setUserId}
            setPastUserHistory={setPastUserHistory}
          />
        );
      case 2:
        return (
          <Step2UserInfo
            onNext={handleNextStep}
            onBack={handlePrevStep}
            hairProfileData={hairProfileData}
            setHairProfileData={setHairProfileData}
          />
        );
      case 3:
        return (
          <Step2HealthQuestionnaire
            onNext={handleNextStep}
            onBack={handlePrevStep}
            hairProfileData={hairProfileData}
            setHairProfileData={setHairProfileData}
          />
        );
      case 4:
        return (
          <Step3HairAnalysis
            onNext={handleNextStep}
            onBack={handlePrevStep}
            faceImages={faceImages}
            setFaceImages={setFaceImages}
            analysisResult={analysisResult}
            setAnalysisResult={setAnalysisResult}
            setIsLoading={setIsLoading}
            isLoading={isLoading}
          />
        );
      case 5:
        return (
          <Step4Goals
            onBack={handlePrevStep}
            analysisResult={analysisResult}
            setHaircareGoals={setHaircareGoals}
            haircareGoals={haircareGoals}
            pastProducts={hairProfileData}
            setRecommendation={setRecommendation}
            setRoutineTitle={setRoutineTitle}
            setStep={setStep}
            setIsLoading={setIsLoading}
            isLoading={isLoading}
            saveFullUserProfile={saveFullUserProfile}
            setSessionId={setSessionId}
          />
        );
      case 6:
        return (
          <Step5YourPlan
            recommendation={recommendation}
            routineTitle={routineTitle}
            onReset={resetState}
            onBack={handlePrevStep}
            onNext={handleNextStep}
            faceImages={faceImages}
            analysisResult={analysisResult}
            haircareGoals={haircareGoals}
            onAddToCart={handleAddToCart}
            onBulkAddToCart={handleBulkAddToCart}
          />
        );
      case 7:
        return (
          <Step6DoctorReport
            recommendation={recommendation}
            routineTitle={routineTitle}
            onReset={resetState}
            onBack={handlePrevStep}
            onNext={handleNextStep}
            faceImages={faceImages}
            analysisResult={analysisResult}
            haircareGoals={haircareGoals}
          />
        );
      case 8:
        return (
          <ChatbotPage
            analysisResult={analysisResult}
            haircareGoals={haircareGoals}
            recommendation={recommendation}
            chatHistory={chatHistory}
            setChatHistory={setChatHistory}
            onBack={handlePrevStep}
            onReset={resetState}
            saveFullUserProfile={saveFullUserProfile}
          />
        );
      default:
        return <p>Invalid Step</p>;
    }
  };

  const totalCartItems = cart.reduce((total, item) => total + item.quantity, 0);

  return (
    <div className="w-full min-h-screen flex flex-col">
      {/* Mobile Header */}
      <Header
        onMenuClick={() => setIsMobileMenuOpen(true)}
        cartItemCount={totalCartItems}
        onCartClick={() => setIsCartOpen(true)}
        className="lg:hidden"
      />
      {/* Desktop Header */}
      <TopHeader
        cartItemCount={totalCartItems}
        onCartClick={() => setIsCartOpen(true)}
        className="hidden lg:flex mx-auto mt-4"
      />
      <div className="w-full max-w-screen-2xl mx-auto flex-grow grid grid-cols-1 lg:grid-cols-[300px_1fr] lg:gap-8 lg:mt-4">
        <div className="hidden lg:block">
          <Sidebar
            currentStep={step}
            onReset={resetState}
          />
        </div>
        <main className="flex flex-col h-full">
          {renderStep()}
        </main>
      </div>

      <Step1PastProducts
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        currentStep={step}
        onReset={resetState}
      />
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cart}
        onRemove={handleRemoveFromCart}
        onUpdateQuantity={handleUpdateQuantity}
      />
    </div>
  );
};

export default App;
