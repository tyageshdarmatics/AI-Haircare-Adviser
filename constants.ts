
import React from 'react';
import { SkincareGoal } from "./types";
import { AcneIcon, OilDropIcon, TextureIcon, SparklesIcon, ZapIcon, HydrationIcon, WindIcon, RednessIcon, ShieldCheckIcon, FolderIcon, HeartIcon, SunIcon, MinusIcon, User } from "./components/Icons";

export const HAIRCARE_GOALS: SkincareGoal[] = [
  { id: "reduce_hair_fall", label: "Reduce Hair Fall", relatedConditions: ["Diffuse Thinning", "Pattern Hair Loss"], icon: MinusIcon },
  { id: "promote_growth", label: "Promote Hair Growth", relatedConditions: ["Pattern Hair Loss", "Hairline Recession", "Patchy Hair Loss"], icon: SparklesIcon },
  { id: "scalp_health", label: "Improve Scalp Health", relatedConditions: ["Scalp Conditions"], icon: ShieldCheckIcon },
  { id: "dandruff_control", label: "Control Dandruff", relatedConditions: ["Scalp Conditions"], icon: AcneIcon },
  { id: "strengthen_hair", label: "Strengthen & Reduce Breakage", relatedConditions: ["Hair Breakage"], icon: ZapIcon },
  { id: "volume_thickness", label: "Increase Volume & Thickness", relatedConditions: ["Diffuse Thinning", "Pattern Hair Loss"], icon: WindIcon },
  { id: "maintain_healthy", label: "Maintain Healthy Hair", relatedConditions: ["Healthy Hair & Scalp"], icon: HeartIcon },
  { id: "other", label: "Other", relatedConditions: [], icon: FolderIcon },
];

export const COMMON_DURATIONS: string[] = [
  "1 Week",
  "2 Weeks",
  "1 Month",
  "3 Months",
  "6 Months",
  "1 Year",
  "2 Years",
  "More than 2 years",
];

export const COMMON_PRODUCTS: string[] = [
  "Broad-Spectrum Sunscreen SPF 50",
  "Gentle Hydrating Cleanser",
  "Glycolic Acid Toner",
  "Hyaluronic Acid Serum",
  "Lightweight Moisturizer",
  "Niacinamide Serum",
  "Retinol Cream",
  "Rich Moisturizer",
  "Salicylic Acid Cleanser",
  "Vitamin C Serum",
];

export const CATEGORY_STYLES: Record<string, {
    name: string;
    icon: React.FC<any>;
    hex: string;
    tailwind: {
        bg: string;
        border: string;
        text: string;
        icon: string;
        progress: string;
        legendBorder: string;
        legendBg: string;
    };
}> = {
    'Healthy Hair & Scalp': {
        name: 'Healthy Hair & Scalp', icon: ShieldCheckIcon, hex: '#22c55e', tailwind: {
            bg: 'bg-green-50', border: 'border-green-200', text: 'text-green-800', icon: 'text-green-500',
            progress: 'bg-green-500', legendBorder: 'border-green-500', legendBg: 'bg-green-100',
        }
    },
    'Pattern Hair Loss': {
        name: 'Pattern Hair Loss', icon: User, hex: '#6366f1', tailwind: {
            bg: 'bg-indigo-50', border: 'border-indigo-200', text: 'text-indigo-800', icon: 'text-indigo-500',
            progress: 'bg-indigo-500', legendBorder: 'border-indigo-500', legendBg: 'bg-indigo-100',
        }
    },
    'Diffuse Thinning': {
        name: 'Diffuse Thinning', icon: WindIcon, hex: '#06b6d4', tailwind: {
            bg: 'bg-cyan-50', border: 'border-cyan-200', text: 'text-cyan-800', icon: 'text-cyan-500',
            progress: 'bg-cyan-500', legendBorder: 'border-cyan-500', legendBg: 'bg-cyan-100',
        }
    },
    'Patchy Hair Loss': {
        name: 'Patchy Hair Loss', icon: MinusIcon, hex: '#f97316', tailwind: {
            bg: 'bg-orange-50', border: 'border-orange-200', text: 'text-orange-800', icon: 'text-orange-500',
            progress: 'bg-orange-500', legendBorder: 'border-orange-500', legendBg: 'bg-orange-100',
        }
    },
    'Hairline Recession': {
        name: 'Hairline Recession', icon: TextureIcon, hex: '#a855f7', tailwind: {
            bg: 'bg-purple-50', border: 'border-purple-200', text: 'text-purple-800', icon: 'text-purple-500',
            progress: 'bg-purple-500', legendBorder: 'border-purple-500', legendBg: 'bg-purple-100',
        }
    },
    'Scalp Conditions': {
        name: 'Scalp Conditions', icon: RednessIcon, hex: '#ef4444', tailwind: {
            bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-800', icon: 'text-red-500',
            progress: 'bg-red-500', legendBorder: 'border-red-500', legendBg: 'bg-red-100',
        }
    },
    'Hair Breakage': {
        name: 'Hair Breakage', icon: ZapIcon, hex: '#eab308', tailwind: {
            bg: 'bg-yellow-50', border: 'border-yellow-200', text: 'text-yellow-800', icon: 'text-yellow-500',
            progress: 'bg-yellow-500', legendBorder: 'border-yellow-500', legendBg: 'bg-yellow-100',
        }
    },
    'Hair Quality': {
        name: 'Hair Quality', icon: TextureIcon, hex: '#db2777', tailwind: {
            bg: 'bg-pink-50', border: 'border-pink-200', text: 'text-pink-800', icon: 'text-pink-500',
            progress: 'bg-pink-500', legendBorder: 'border-pink-500', legendBg: 'bg-pink-100',
        }
    },
    'Hair & Scalp Type': {
        name: 'Hair & Scalp Type', icon: SparklesIcon, hex: '#10b981', tailwind: {
            bg: 'bg-emerald-50', border: 'border-emerald-200', text: 'text-emerald-800', icon: 'text-emerald-500',
            progress: 'bg-emerald-500', legendBorder: 'border-emerald-500', legendBg: 'bg-emerald-100',
        }
    },
    'Default': {
        name: 'Default', icon: FolderIcon, hex: '#6b7280', tailwind: {
            bg: 'bg-slate-100', border: 'border-slate-200', text: 'text-slate-800', icon: 'text-slate-500',
            progress: 'bg-slate-500', legendBorder: 'border-slate-500', legendBg: 'bg-slate-200',
        }
    }
};

export const getCategoryStyle = (category: string) => {
    const key = Object.keys(CATEGORY_STYLES).find(k => k !== 'Default' && category.toLowerCase().includes(k.toLowerCase().split(' ')[0])) || 'Default';
    return CATEGORY_STYLES[key];
};

export const LOADING_TIPS: string[] = [
  "Consistency is key! Follow your new haircare routine regularly for best results.",
  "A balanced diet rich in protein, iron, and vitamins is crucial for hair health.",
  "Avoid tight hairstyles that can pull on your hair follicles and cause breakage.",
  "Gentle scalp massages can help improve blood circulation and promote growth.",
  "Drink plenty of water to keep your hair and scalp hydrated from the inside out.",
  "Protect your hair from harsh sun exposure, just like you would for your skin.",
  "Aim for 7-9 hours of quality sleep each night for optimal hair repair and growth.",
  "Be patient. Seeing the full benefits of a new routine can take several weeks or months."
];

export const LOADING_TIP_STYLES = [
  {
    Icon: SparklesIcon,
    bg: 'bg-amber-50 border-amber-200',
    text: 'text-amber-800',
    iconColor: 'text-amber-500',
  },
  {
    Icon: HydrationIcon,
    bg: 'bg-blue-50 border-blue-200',
    text: 'text-blue-800',
    iconColor: 'text-blue-500',
  },
  {
    Icon: SunIcon,
    bg: 'bg-orange-50 border-orange-200',
    text: 'text-orange-800',
    iconColor: 'text-orange-500',
  },
  {
    Icon: HeartIcon,
    bg: 'bg-rose-50 border-rose-200',
    text: 'text-rose-800',
    iconColor: 'text-rose-500',
  },
];