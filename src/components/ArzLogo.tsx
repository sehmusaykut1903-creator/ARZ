import React from 'react';

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

  // Premium Vector Shield Emblem (Navy & Red AFAD / Corporate style)
  const ShieldIcon = () => (
    <svg 
      viewBox="0 0 100 100" 
      className="w-full h-full"
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Outer shield frame */}
      <path 
        d="M50 5L85 20V50C85 72 50 95 50 95C50 95 15 72 15 50V20L50 5Z" 
        fill="#003366" 
        stroke="#FFFFFF" 
        strokeWidth="3"
        strokeLinejoin="round"
      />
      {/* Red inner stripe representing timing and action */}
      <path 
        d="M50 12L76 24V48C76 66 50 83 50 83C50 83 24 66 24 48V24L50 12Z" 
        fill="#ED1C24" 
        opacity="0.9"
      />
      {/* Stylized sharp 'A' cutout representing ARZ */}
      <path 
        d="M50 22L36 58H45L50 44L55 58H64L50 22ZM50 33L53 41H47L50 33Z" 
        fill="#FFFFFF" 
      />
      {/* Small bright cyan status anchor representing live data */}
      <circle cx="50" cy="68" r="4" fill="#00FFFF" />
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
      <div className={`shrink-0 ${isVertical ? 'w-16 h-16' : 'w-11 h-11'} p-0.5 filter drop-shadow-sm`}>
        <ShieldIcon />
      </div>

      {showText && (
        <div className={`flex flex-col items-start leading-none ${isVertical ? 'items-center mt-2' : ''}`}>
          <div className="flex items-center gap-1.5">
            <span className={`font-black tracking-tighter italic ${isVertical ? 'text-4xl' : 'text-3.5xl'} ${textClassName || 'text-[#003366]'}`}>
              ARZ
            </span>
            <span className="w-2.5 h-2.5 bg-red-650 rounded-full mt-2 lg:mt-3 shadow-[0_0_12px_rgba(237,28,36,0.8)] animate-pulse" style={{ backgroundColor: '#ED1C24' }} />
          </div>
          <span className={`font-black uppercase tracking-[0.25em] text-[#003366]/80 mt-1.5 ${isVertical ? 'text-[11px]' : 'text-[9px]'} whitespace-nowrap`}>
            AFET RAPORLAMA VE ZAMANLAMA
          </span>
        </div>
      )}
    </div>
  );
};

export default ArzLogo;
