import React from 'react';
import { ShoppingCartIcon } from './Icons';

interface TopHeaderProps {
    onCartClick: () => void;
    cartItemCount: number;
    className?: string;
}

const TopHeader: React.FC<TopHeaderProps> = ({ onCartClick, cartItemCount, className = '' }) => {
  return (
    <header className={`w-full max-w-screen-2xl p-4 items-center justify-between bg-white/80 backdrop-blur-sm shadow-md rounded-2xl border border-slate-200/80 ${className}`}>
      <div className="grid grid-cols-3 items-center">
          <div className="w-[200px] justify-self-start">
             <a href="https://dermatics.in" target="_blank" rel="noopener noreferrer">
               <img src="/logo.png" alt="Dermatics India Logo" className="h-10 w-auto" />
             </a>
          </div>
          <div className="text-center justify-self-center">
              <h1 className="text-xl font-bold text-slate-800">AI Haircare Advisor</h1>
              <p className="text-sm text-slate-500">Your personalized path to healthier skin and haircare, powered by Dermatics India.</p>
          </div>
          <div className="flex justify-end w-[200px] justify-self-end">
            <button onClick={onCartClick} className="relative bg-white text-brand-primary p-3 rounded-xl hover:bg-blue-50 transition-colors shadow-md border border-slate-200" aria-label="Open cart">
                <ShoppingCartIcon className="w-6 h-6" />
                {cartItemCount > 0 && (
                    <span className="absolute -top-2 -right-2 block h-5 w-5 rounded-full bg-red-500 ring-2 ring-white text-xs font-bold flex items-center justify-center">{cartItemCount > 9 ? '9+' : cartItemCount}</span>
                )}
            </button>
          </div>
      </div>
    </header>
  );
};

export default TopHeader;