import React from 'react';
import { useTranslation } from 'react-i18next';

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
  const { t } = useTranslation();
  const isVertical = variant === 'vertical';
  const isIcon = variant === 'icon';

  // Premium Vector Shield Emblem (Navy & Red AFAD / Corporate style)
  const ShieldIcon = () => (
    <svg 
      viewBox="0 0 100 100" 
      className="w-full h-full"
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Left Navy Shield Curve */}
      <path 
        d="M38 23 C22 25 15 31 13 41 C11 56 18 68 28 78 L32 82" 
        stroke="#06224A" 
        strokeWidth="6.5" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
      />
      {/* Outer-Right Red Curve that sweeps from right to bottom, then folds back inside as an elegant loop */}
      <path 
        d="M52 23 C68 25 75 31 77 41 C79 56 72 68 52 85 L50 87 C50 87 45 81 41 78 L28 60" 
        stroke="#ED1C24" 
        strokeWidth="6.5" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
      />
      {/* Inner Navy 'A' structure which forms the center core */}
      <path 
        d="M26 62 L43 27 L55 55" 
        stroke="#06224A" 
        strokeWidth="6.5" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
      />
    </svg>
  );

  if (isIcon) {
    return (
      <div className={`flex items-center justify-center shrink-0 w-11 h-11 transition-all duration-300 hover:scale-105 ${className}`}>
        <div className="w-full h-full p-0.5 filter drop-shadow-md">
          <ShieldIcon />
        </div>
      </div>
    );
  }

  return (
    <div className={`flex ${isVertical ? 'flex-col items-center text-center' : 'items-center'} gap-3.5 ${className}`}>
      {/* Icon portion of horizontal / vertical logo */}
      <div className={`shrink-0 ${isVertical ? 'w-16 h-16' : 'w-11 h-11'} p-0.5`}>
        <ShieldIcon />
      </div>

      {showText && (
        <div className={`flex flex-col items-start leading-none ${isVertical ? 'items-center mt-2' : ''}`}>
          <div className="flex items-center">
            <span className={`font-black italic tracking-tighter ${isVertical ? 'text-4.5xl' : 'text-4xl'} ${textClassName || 'text-[#06224A]'}`}>
              ARZ
            </span>
          </div>
          <span className={`font-medium text-[#06224A] mt-1 ${isVertical ? 'text-[11px]' : 'text-[10px]'} whitespace-nowrap`}>
            {t('app_logo_subtitle', 'Afet Raporlama ve Zamanlama')}
          </span>
        </div>
      )}
    </div>
  );
};

export default ArzLogo;
