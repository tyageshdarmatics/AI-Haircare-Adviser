

import React from 'react';

export interface HairProfileData {
  // Common
  name?: string;
  phone?: string;
  // Fix: Added optional email property to match form field in Step1Start.tsx
  email?: string;
  age?: string;
  gender?: string;
  
  // Male
  hairfallAmountMale?: string;
  hairlossImageMale?: string;
  hairlossLocationMale?: string;
  familyHistory?: string;
  dandruff?: string;
  scalpItching?: string;
  scalpType?: string;
  breakage?: string;
  suddenShedding?: string;
  sleepQuality?: string;
  stressLevel?: string;
  constipation?: string;
  energyLevels?: string;
  supplements?: string;
  medicalConditions?: string[];
  weightChange?: string;
  medications?: string;
  proteinIntake?: string;
  junkFoodIntake?: string;
  waterIntake?: string;
  alcoholSmoking?: string;
  hairwashFrequency?: string;
  hairTreatments?: string[];
  medicatedProducts?: string;

  // Female
  hairfallAmountFemale?: string;
  hairfallDuration?: string;
  hairVolume?: string;
  hairFeel?: string[];
  hairTreatmentsFemale?: string[];
  dandruffFemale?: string;
  ironLevels?: string;
  hormonalIssues?: string[];
  lifeStages?: string;
  recentChanges?: string[];
  digestionIssues?: string[];
  sleepQualityFemale?: string;
  stressLevelFemale?: string;
  energyLevelsFemale?: string;
  supplementsFemale?: string;
  foodHabits?: string;
  scalpItchingFemale?: string;
  scalpBuildup?: string;
  scalpDryness?: string;

  // Deprecated fields from old questionnaire, kept for potential compatibility
  hairfallAmount?: string;
  hairlossImage?: string;
  hairlossLocation?: string;
  irregularCycles?: string;
  pregnancyStatus?: string;
}


export interface BoundingBox {
  imageId: number;
  box: {
    x1: number;
    y1: number;
    x2: number;
    y2: number;
  };
}

export interface SkinCondition {
  name: string;
  confidence: number;
  location: string;
  boundingBoxes: BoundingBox[];
}

export interface SkinConditionCategory {
  category: string;
  conditions: SkinCondition[];
}

export interface FaceImage {
  file: File;
  previewUrl: string;
}

export interface SkincareGoal {
  id: string;
  label: string;
  relatedConditions: string[];
  icon: React.FC<React.SVGProps<SVGSVGElement>>;
}

export interface ChatMessage {
    id: string;
    sender: 'user' | 'ai';
    text: string;
}

export interface WebsiteProduct {
  id: string;
  name: string;
  url: string;
  description: string;
  keyIngredients: string[];
  suitableFor: string[];
  imageUrl: string;
  variantId: string;
  price: string;
  originalPrice: string;
}

export interface AlternativeProduct {
  productId: string;
  productName: string;
  productUrl: string;
  productImageUrl: string;
  variantId: string;
  price: string;
  originalPrice: string;
  keyIngredients: string[];
}

export interface RoutineStep {
  productId: string;
  stepType: string;
  productName: string;
  productUrl: string;
  productImageUrl: string;
  purpose: string;
  alternatives: AlternativeProduct[];
  variantId: string;
  price: string;
  originalPrice: string;
  keyIngredients: string[];
}

export interface SkincareRoutine {
  introduction: string;
  am: RoutineStep[];
  pm: RoutineStep[];
  keyIngredients: string[];
  lifestyleTips: string[];
  disclaimer: string;
}

export interface CartItem {
  productId: string;
  productName: string;
  productUrl: string;
  productImageUrl: string;
  quantity: number;
  variantId: string;
  price: string;
  originalPrice: string;
  keyIngredients: string[];
}
