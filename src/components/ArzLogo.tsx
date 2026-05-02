import React from 'react';

interface ArzLogoProps {
  className?: string;
  textClassName?: string;
  showText?: boolean;
  variant?: 'horizontal' | 'vertical' | 'icon';
}

export const ArzLogo: React.FC<ArzLogoProps> = ({ 
  className = "", 
  showText = true,
  variant = 'horizontal'
}) => {
  const sizes = {
    sm: 'h-8',
    md: 'h-12',
    lg: 'h-24',
    xl: 'h-32'
  };

  const logoSize = variant === 'vertical' ? sizes.xl : sizes.md;

  return (
    <div className={`flex ${variant === 'vertical' ? 'flex-col items-center' : 'items-center'} gap-4 ${className}`}>
      <img 
        src="/assets/arz-logo.png" 
        alt="ARZ Logo" 
        className={`${logoSize} w-auto object-contain pointer-events-none select-none`}
        onError={(e) => {
          // Fallback if image not found
          (e.target as HTMLImageElement).src = 'https://placehold.co/400x400/003366/white?text=ARZ';
        }}
      />
    </div>
  );
};

export default ArzLogo;
