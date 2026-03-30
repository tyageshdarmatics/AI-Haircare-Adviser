import React from 'react';
import { ShoppingCartIcon, MenuIcon } from './Icons';

interface HeaderProps {
    onMenuClick: () => void;
    onCartClick: () => void;
    cartItemCount: number;
    className?: string;
}

const Header: React.FC<HeaderProps> = ({ onMenuClick, onCartClick, cartItemCount, className = '' }) => {
  return (
    <header className={`w-full p-4 flex items-center justify-between bg-white/80 backdrop-blur-sm shadow-soft sticky top-0 z-30 border-b border-slate-200/80 ${className}`}>
      <div className="flex-1">
        <button onClick={onMenuClick} className="bg-brand-primary text-white p-3 rounded-xl hover:bg-brand-primary-hover transition-colors" aria-label="Open menu">
          <MenuIcon className="w-5 h-5" />
        </button>
      </div>
      <div className="flex-1 flex justify-center">
         <a href="https://dermatics.in" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 group">
           <img src="/logo.png" alt="Dermatics India Logo" className="h-10 w-auto" />
        </a>
      </div>
      <div className="flex-1 flex justify-end">
        <button onClick={onCartClick} className="relative bg-brand-primary text-white p-3 rounded-xl hover:bg-brand-primary-hover transition-colors" aria-label="Open cart">
            <ShoppingCartIcon className="w-5 h-5" />
            {cartItemCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 flex items-center justify-center h-5 w-5 rounded-full bg-red-500 text-white text-[10px] font-bold ring-2 ring-white">{cartItemCount > 9 ? '9+' : cartItemCount}</span>
            )}
        </button>
      </div>
    </header>
  );
};

export default Header;