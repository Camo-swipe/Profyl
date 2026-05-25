import React from "react";

interface LogoProps {
  className?: string;
  size?: number;
}

export function LogoIcon({ className = "", size = 32 }: LogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        {/* Main purple/blue gradient from image */}
        <linearGradient id="logoP_grad" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#0066ff" />
          <stop offset="50%" stopColor="#4f46e5" />
          <stop offset="100%" stopColor="#bc25f7" />
        </linearGradient>
        
        {/* Mask to cut out the profile face */}
        <mask id="logoP_faceMask">
          {/* Main filled area retains P */}
          <rect width="100" height="100" fill="white" />
          
          {/* Face profile cutout (facing right) */}
          <path
            d="M51 32 
               C52.5 32, 54.5 35, 54.8 38 
               C55 40, 57 43.5, 59 45.5 
               C59.5 46, 61.2 47.2, 61.5 48 
               C61.8 48.8, 59.2 49.5, 58.2 49.8 
               C57 50.2, 55.5 50.8, 56.5 53 
               C57.2 54.5, 59 55.2, 57.5 56.8 
               C56 58.2, 53.5 58.5, 52.2 61 
               C51.2 63, 44 64.5, 43 72
               L42 85 
               H63 
               V25 
               H51 
               Z"
            fill="black"
          />
        </mask>
      </defs>

      {/* Squares breaking off (pixels) on the left of stem */}
      {/* High-tech pixels fading / breaking out */}
      <rect x="33.5" y="14.5" width="4.5" height="4.5" fill="#bc25f7" opacity="0.9" />
      <rect x="25.5" y="19" width="4" height="4" fill="#a855f7" opacity="0.8" />
      <rect x="30.5" y="21" width="5.5" height="5.5" fill="#7c3aed" opacity="0.95" />
      <rect x="35.5" y="20.5" width="6.5" height="6.5" fill="#e0f2fe" opacity="1" />
      <rect x="25.5" y="25" width="4.5" height="4.5" fill="#4f46e5" opacity="0.85" />
      <rect x="28.5" y="27" width="6.5" height="6.5" fill="#3b82f6" opacity="0.95" />
      <rect x="34.5" y="28" width="5.5" height="5.5" fill="#e0f2fe" opacity="1" />
      <rect x="43" y="25.5" width="4.5" height="4.5" fill="#bc25f7" />
      <rect x="37.8" y="30.5" width="4.5" height="4.5" fill="#60a5fa" opacity="0.9" />
      <rect x="36.5" y="33" width="3.5" height="3.5" fill="#3b82f6" opacity="0.9" />
      {/* Tiny scatter square */}
      <rect x="21" y="29.5" width="3" height="3" fill="#6366f1" opacity="0.7" />

      {/* Main letter P shape, with the face silhouette masked out */}
      <path
        d="M38.5 37.5 
           C38.5 35, 39 21, 52 17.5 
           C65 14, 82 18, 82 45 
           C82 66, 68 68, 52 68
           H43.5 
           V85 
           C38.5 85, 35 70, 35 48 
           Z"
        fill="url(#logoP_grad)"
        mask="url(#logoP_faceMask)"
      />
    </svg>
  );
}

export function LogoText({ className = "" }: { className?: string }) {
  return (
    <span className={`flex items-center tracking-normal font-sans font-extrabold text-[#0d1527] dark:text-white ${className}`}>
      Profy
      <span className="relative inline-block ml-0.5 select-none text-transparent">
        l
        <span 
          className="absolute inset-[1px] bottom-[-2px] inset-x-[1.5px] rounded-[1.5px] bg-gradient-to-b from-[#7c3aed] to-[#bc25f7]"
          style={{ width: "4px", height: "18px" }}
        />
      </span>
    </span>
  );
}

export default function FullLogo({ className = "", size = 32 }: LogoProps) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <LogoIcon size={size} />
      <LogoText className="text-lg md:text-xl lg:text-2xl" />
    </div>
  );
}
