import React from 'react';
import { Shield } from 'lucide-react';

interface ArzLogoProps {
  className?: string;
  textClassName?: string;
  showText?: boolean;
  variant?: 'horizontal' | 'vertical' | 'icon';
}

export const ArzLogo: React.FC<ArzLogoProps> = ({ 
  className = "", 
  textClassName = "",
  showText = true,
  variant = 'horizontal'
}) => {
  const isVertical = variant === 'vertical';
  const isIcon = variant === 'icon';

  if (isIcon) {
    return (
      <div className={`bg-gradient-to-br from-[#003366] to-[#001F3D] text-white rounded-[1.25rem] flex items-center justify-center shadow-premium border-2 border-red-600/30 w-11 h-11 ${className}`}>
        <span className="font-black italic text-xl tracking-tighter">A</span>
      </div>
    );
  }

  return (
    <div className={`flex ${isVertical ? 'flex-col items-center text-center' : 'items-center'} gap-3 ${className}`}>
      <div className="flex flex-col items-start leading-none group">
        <div className="flex items-center gap-1">
          <span className={`font-black tracking-tighter italic ${isVertical ? 'text-4xl' : 'text-3xl'} brand-title ${textClassName || 'text-[#003366]'}`}>
            ARZ
          </span>
          <div className="w-2 h-2 bg-red-600 rounded-full mt-3 shadow-[0_0_10px_#ED1C24] animate-pulse" />
        </div>
        <span className={`brand-subtitle font-black uppercase tracking-[0.2em] text-[#003366]/60 mt-1 ${isVertical ? 'text-[12px]' : 'text-[10px]'}`}>
          Afet Raporlama ve Zamanlama
        </span>
      </div>
    </div>
  );
};

export default ArzLogo;
