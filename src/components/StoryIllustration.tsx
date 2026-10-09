import React from 'react';

interface StoryIllustrationProps {
  pageNumber: number; // 0 for cover, 1..10 for pages
  className?: string;
  isAudioPlaying?: boolean;
}

const PAGE_ATMOSPHERES: Record<number, { bgGradient: string; sunbeam: string }> = {
  0: { bgGradient: 'from-[#fff5dc] via-[#fdebc5] to-[#dbf3ca]', sunbeam: 'from-amber-200/40 to-transparent' },
  1: { bgGradient: 'from-[#fff9e2] via-[#fef0cb] to-[#dcf4c6]', sunbeam: 'from-yellow-200/40 to-transparent' },
  2: { bgGradient: 'from-[#fef4d8] via-[#fdecc4] to-[#d4f2bc]', sunbeam: 'from-amber-200/45 to-transparent' },
  3: { bgGradient: 'from-[#fff2d2] via-[#fde5b9] to-[#daf0be]', sunbeam: 'from-orange-200/35 to-transparent' },
  4: { bgGradient: 'from-[#f0f9ff] via-[#fef3cd] to-[#dcfce7]', sunbeam: 'from-sky-200/40 to-transparent' },
  5: { bgGradient: 'from-[#e0f4ff] via-[#fef9c3] to-[#d9f99d]', sunbeam: 'from-cyan-200/35 to-transparent' },
  6: { bgGradient: 'from-[#fef3c7] via-[#fde68a] to-[#d5f4be]', sunbeam: 'from-amber-200/50 to-transparent' },
  7: { bgGradient: 'from-[#fef5db] via-[#fde2a3] to-[#c7e99e]', sunbeam: 'from-orange-300/35 to-transparent' },
  8: { bgGradient: 'from-[#fef1cb] via-[#fddfa0] to-[#bfe7a3]', sunbeam: 'from-amber-300/40 to-transparent' },
  9: { bgGradient: 'from-[#fed7aa] via-[#fef08a] to-[#bbf7d0]', sunbeam: 'from-yellow-300/45 to-transparent' },
  10: { bgGradient: 'from-[#fee2e2] via-[#fef08a] to-[#bbf7d0]', sunbeam: 'from-rose-200/35 to-transparent' },
};

export const StoryIllustration: React.FC<StoryIllustrationProps> = ({
  pageNumber,
  className = '',
  isAudioPlaying = false,
}) => {
  const atmosphere = PAGE_ATMOSPHERES[pageNumber] || PAGE_ATMOSPHERES[0];

  return (
    <div
      className={`relative w-full h-full min-h-[160px] sm:min-h-[200px] max-h-[360px] flex items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-b ${atmosphere.bgGradient} border border-[#eddcb6] transition-all duration-500 ${
        isAudioPlaying
          ? 'shadow-[inset_0_0_24px_rgba(245,158,11,0.22),0_0_20px_rgba(251,191,36,0.25)] ring-2 ring-amber-300/60'
          : 'shadow-[inset_0_2px_8px_rgba(180,120,50,0.10)]'
      } ${className}`}
    >
      {/* 3D Global SVG Defs with Volumetric Shading & Warm Lighting */}
      <svg className="absolute w-0 h-0" aria-hidden="true">
        <defs>
          {/* Soft 3D Glow Filter */}
          <filter id="softGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>

          {/* 3D Soft Drop Shadow for characters */}
          <radialGradient id="charShadow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#2b4c1e" stopOpacity="0.45" />
            <stop offset="60%" stopColor="#2b4c1e" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#2b4c1e" stopOpacity="0" />
          </radialGradient>

          {/* 3D Lush Tree Foliage Spheres */}
          <radialGradient id="foliage3DLight" cx="38%" cy="32%" r="65%">
            <stop offset="0%" stopColor="#bbf7d0" />
            <stop offset="25%" stopColor="#4ade80" />
            <stop offset="70%" stopColor="#16a34a" />
            <stop offset="100%" stopColor="#14532d" />
          </radialGradient>
          <radialGradient id="foliage3DDeep" cx="35%" cy="30%" r="70%">
            <stop offset="0%" stopColor="#86efac" />
            <stop offset="40%" stopColor="#22c55e" />
            <stop offset="80%" stopColor="#15803d" />
            <stop offset="100%" stopColor="#052e16" />
          </radialGradient>

          {/* 3D Trunk Gradient */}
          <linearGradient id="trunk3D" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#633112" />
            <stop offset="35%" stopColor="#9a5523" />
            <stop offset="70%" stopColor="#b8682d" />
            <stop offset="100%" stopColor="#542407" />
          </linearGradient>

          {/* The Big Red Apple: Rich Volumetric 3D Glossy Sphere */}
          <radialGradient id="apple3DGloss" cx="32%" cy="28%" r="70%">
            <stop offset="0%" stopColor="#ffb4b4" />
            <stop offset="15%" stopColor="#ff4d4d" />
            <stop offset="55%" stopColor="#dc2626" />
            <stop offset="85%" stopColor="#991b1b" />
            <stop offset="100%" stopColor="#450a0a" />
          </radialGradient>
          <linearGradient id="appleLeaf3D" x1="20%" y1="0%" x2="80%" y2="100%">
            <stop offset="0%" stopColor="#bef264" />
            <stop offset="50%" stopColor="#65a30d" />
            <stop offset="100%" stopColor="#365314" />
          </linearGradient>

          {/* Pinky 3D Clay Shading */}
          <radialGradient id="pinkyBody3D" cx="35%" cy="30%" r="70%">
            <stop offset="0%" stopColor="#ffd1dc" />
            <stop offset="30%" stopColor="#f472b6" />
            <stop offset="75%" stopColor="#db2777" />
            <stop offset="100%" stopColor="#9d174d" />
          </radialGradient>
          <radialGradient id="pinkySnout3D" cx="40%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#ffe4e6" />
            <stop offset="50%" stopColor="#fb7185" />
            <stop offset="100%" stopColor="#be123c" />
          </radialGradient>

          {/* Toto 3D Volumetric Bunny Fur */}
          <radialGradient id="totoBody3D" cx="35%" cy="28%" r="72%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="45%" stopColor="#f8fafc" />
            <stop offset="80%" stopColor="#e2e8f0" />
            <stop offset="100%" stopColor="#94a3b8" />
          </radialGradient>
          <radialGradient id="totoEarInner" cx="40%" cy="40%" r="60%">
            <stop offset="0%" stopColor="#ffe4e6" />
            <stop offset="60%" stopColor="#fbcfe8" />
            <stop offset="100%" stopColor="#f472b6" />
          </radialGradient>

          {/* Buddy 3D Warm Caramel/Chocolate Bear */}
          <radialGradient id="buddyBody3D" cx="35%" cy="28%" r="75%">
            <stop offset="0%" stopColor="#df8e3d" />
            <stop offset="30%" stopColor="#b45309" />
            <stop offset="75%" stopColor="#78350f" />
            <stop offset="100%" stopColor="#451a03" />
          </radialGradient>
          <radialGradient id="buddyMuzzle3D" cx="40%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#fffbeb" />
            <stop offset="60%" stopColor="#fde68a" />
            <stop offset="100%" stopColor="#d97706" />
          </radialGradient>

          {/* Warm Sun Rays */}
          <radialGradient id="sunRays" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#fef08a" stopOpacity="0.8" />
            <stop offset="60%" stopColor="#fde047" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#fde047" stopOpacity="0" />
          </radialGradient>
        </defs>
      </svg>

      {/* Atmospheric Soft Clouds, Sun & Volumetric Sunbeams */}
      <div className="absolute top-2 right-6 w-24 h-24 rounded-full bg-gradient-to-br from-amber-300/40 via-yellow-200/20 to-transparent blur-lg pointer-events-none" />
      <div className={`absolute -top-10 -right-10 w-64 h-64 bg-gradient-to-bl ${atmosphere.sunbeam} blur-xl pointer-events-none rotate-12`} />
      <div className="absolute top-3 left-8 text-2xl opacity-40 pointer-events-none animate-float-slow">☁️</div>
      <div className="absolute top-1 right-24 text-3xl opacity-35 pointer-events-none">☁️</div>

      {/* Floating Fairytale Golden Dust Motes */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-8 left-14 w-2 h-2 rounded-full bg-amber-300/60 blur-[0.5px] animate-light-mote" />
        <div className="absolute top-16 right-20 w-2.5 h-2.5 rounded-full bg-yellow-200/70 blur-[0.8px] animate-float-slow" />
        <div className="absolute bottom-16 left-28 w-2 h-2 rounded-full bg-amber-400/50 blur-[0.5px] animate-light-mote" style={{ animationDelay: '1.4s' }} />
        <div className="absolute top-6 right-36 w-1.5 h-1.5 rounded-full bg-white/75 blur-[0.3px] animate-fairytale-glow" />
      </div>

      {/* Soft Picture-Book Vignette & Inner Light Rim */}
      <div className="absolute inset-0 pointer-events-none rounded-2xl shadow-[inset_0_0_20px_rgba(180,120,40,0.12),inset_0_1px_3px_rgba(255,255,255,0.8)]" />

      {pageNumber === 0 && <CoverScene />}
      {pageNumber === 1 && <Page1Scene isAudioPlaying={isAudioPlaying} />}
      {pageNumber === 2 && <Page2Scene isAudioPlaying={isAudioPlaying} />}
      {pageNumber === 3 && <Page3Scene isAudioPlaying={isAudioPlaying} />}
      {pageNumber === 4 && <Page4Scene isAudioPlaying={isAudioPlaying} />}
      {pageNumber === 5 && <Page5Scene isAudioPlaying={isAudioPlaying} />}
      {pageNumber === 6 && <Page6Scene isAudioPlaying={isAudioPlaying} />}
      {pageNumber === 7 && <Page7Scene isAudioPlaying={isAudioPlaying} />}
      {pageNumber === 8 && <Page8Scene isAudioPlaying={isAudioPlaying} />}
      {pageNumber === 9 && <Page9Scene isAudioPlaying={isAudioPlaying} />}
      {pageNumber === 10 && <Page10Scene isAudioPlaying={isAudioPlaying} />}
    </div>
  );
};

/* --- 3D Character Drawing Elements --- */

// 3D Pinky Piglet
const Pinky3D = ({
  x = 0,
  y = 0,
  scale = 1,
  action = 'normal',
}: {
  x?: number;
  y?: number;
  scale?: number;
  action?: 'normal' | 'hungry' | 'lookUp' | 'jump' | 'happy';
}) => {
  return (
    <g transform={`translate(${x}, ${y}) scale(${scale})`}>
      {/* 3D Soft Shadow */}
      <ellipse cx="40" cy="74" rx="26" ry="8" fill="url(#charShadow)" />

      {/* Body Sphere */}
      <circle cx="40" cy="48" r="23" fill="url(#pinkyBody3D)" />
      {/* Soft Tummy Highlight */}
      <ellipse cx="40" cy="52" rx="14" ry="12" fill="#ffd5df" opacity="0.65" />

      {/* 3D Ears */}
      <path d="M 22 26 Q 14 12 28 17 Z" fill="url(#pinkyBody3D)" />
      <path d="M 23 24 Q 18 15 27 18 Z" fill="#ffd1dc" opacity="0.8" />
      <path d="M 58 26 Q 66 12 52 17 Z" fill="url(#pinkyBody3D)" />
      <path d="M 57 24 Q 62 15 53 18 Z" fill="#ffd1dc" opacity="0.8" />

      {/* 3D Head Sphere */}
      <circle cx="40" cy="34" r="21" fill="url(#pinkyBody3D)" />
      {/* Specular Head Rim Highlight */}
      <ellipse cx="36" cy="24" rx="8" ry="4" fill="#ffffff" opacity="0.45" transform="rotate(-15 36 24)" />

      {/* Cheeks with Warm Glow */}
      <circle cx="25" cy="38" r="5" fill="#f43f5e" opacity="0.45" filter="url(#softGlow)" />
      <circle cx="55" cy="38" r="5" fill="#f43f5e" opacity="0.45" filter="url(#softGlow)" />

      {/* Eyes */}
      {action === 'lookUp' ? (
        <>
          <ellipse cx="32" cy="27" rx="3.5" ry="4.5" fill="#1e1b4b" />
          <circle cx="33.5" cy="25" r="1.6" fill="#ffffff" />
          <ellipse cx="48" cy="27" rx="3.5" ry="4.5" fill="#1e1b4b" />
          <circle cx="49.5" cy="25" r="1.6" fill="#ffffff" />
        </>
      ) : action === 'hungry' ? (
        <>
          <path d="M 28 29 Q 32 25 36 29" stroke="#1e1b4b" strokeWidth="2.5" fill="none" strokeLinecap="round" />
          <path d="M 44 29 Q 48 25 52 29" stroke="#1e1b4b" strokeWidth="2.5" fill="none" strokeLinecap="round" />
        </>
      ) : (
        <>
          <circle cx="32" cy="30" r="3.5" fill="#1e1b4b" />
          <circle cx="33.5" cy="28.5" r="1.4" fill="#ffffff" />
          <circle cx="48" cy="30" r="3.5" fill="#1e1b4b" />
          <circle cx="49.5" cy="28.5" r="1.4" fill="#ffffff" />
        </>
      )}

      {/* 3D Volumetric Snout */}
      <ellipse cx="40" cy="38" rx="10" ry="7.5" fill="url(#pinkySnout3D)" />
      <ellipse cx="37" cy="38" rx="2" ry="2.5" fill="#4c0519" />
      <ellipse cx="43" cy="38" rx="2" ry="2.5" fill="#4c0519" />
      <ellipse cx="39" cy="34" rx="5" ry="2" fill="#ffffff" opacity="0.4" />

      {/* Mouth */}
      <path d="M 37 46 Q 40 49 43 46" stroke="#881337" strokeWidth="2" fill="none" strokeLinecap="round" />

      {/* 3D Rounded Feet */}
      <ellipse cx="28" cy="68" rx="6" ry="5" fill="url(#pinkyBody3D)" />
      <ellipse cx="52" cy="68" rx="6" ry="5" fill="url(#pinkyBody3D)" />
      <ellipse cx="27" cy="66" rx="3" ry="1.5" fill="#ffffff" opacity="0.4" />
      <ellipse cx="51" cy="66" rx="3" ry="1.5" fill="#ffffff" opacity="0.4" />
    </g>
  );
};

// 3D Toto Rabbit
const Toto3D = ({
  x = 0,
  y = 0,
  scale = 1,
  action = 'normal',
}: {
  x?: number;
  y?: number;
  scale?: number;
  action?: 'normal' | 'jump' | 'reach' | 'happy';
}) => {
  return (
    <g transform={`translate(${x}, ${y}) scale(${scale})`}>
      {/* 3D Soft Shadow */}
      <ellipse cx="36" cy="74" rx="22" ry="7" fill="url(#charShadow)" />

      {/* 3D Bunny Ears */}
      {action === 'jump' ? (
        <>
          <ellipse cx="24" cy="4" rx="6.5" ry="19" fill="url(#totoBody3D)" transform="rotate(-15 24 4)" />
          <ellipse cx="24" cy="4" rx="3.5" ry="13" fill="url(#totoEarInner)" transform="rotate(-15 24 4)" />
          <ellipse cx="48" cy="4" rx="6.5" ry="19" fill="url(#totoBody3D)" transform="rotate(15 48 4)" />
          <ellipse cx="48" cy="4" rx="3.5" ry="13" fill="url(#totoEarInner)" transform="rotate(15 48 4)" />
        </>
      ) : (
        <>
          <ellipse cx="28" cy="8" rx="6.5" ry="19" fill="url(#totoBody3D)" transform="rotate(-8 28 8)" />
          <ellipse cx="28" cy="8" rx="3.5" ry="13" fill="url(#totoEarInner)" transform="rotate(-8 28 8)" />
          <ellipse cx="44" cy="8" rx="6.5" ry="19" fill="url(#totoBody3D)" transform="rotate(8 44 8)" />
          <ellipse cx="44" cy="8" rx="3.5" ry="13" fill="url(#totoEarInner)" transform="rotate(8 44 8)" />
        </>
      )}

      {/* 3D Body Sphere */}
      <circle cx="36" cy="52" r="19" fill="url(#totoBody3D)" />
      {/* Soft Fluffy Tummy */}
      <ellipse cx="36" cy="54" rx="12" ry="11" fill="#ffffff" opacity="0.8" />

      {/* 3D Head Sphere */}
      <circle cx="36" cy="28" r="17" fill="url(#totoBody3D)" />
      {/* Head Highlight */}
      <ellipse cx="32" cy="18" rx="6" ry="3" fill="#ffffff" opacity="0.6" />

      {/* Cheeks with Warm Glow */}
      <circle cx="24" cy="32" r="4.5" fill="#fda4af" opacity="0.6" filter="url(#softGlow)" />
      <circle cx="48" cy="32" r="4.5" fill="#fda4af" opacity="0.6" filter="url(#softGlow)" />

      {/* 3D Glossy Blue Eyes */}
      <ellipse cx="29" cy="26" rx="3" ry="4.2" fill="#0284c7" />
      <ellipse cx="29" cy="26" rx="2" ry="3" fill="#0369a1" />
      <circle cx="30" cy="24.5" r="1.4" fill="#ffffff" />
      <ellipse cx="43" cy="26" rx="3" ry="4.2" fill="#0284c7" />
      <ellipse cx="43" cy="26" rx="2" ry="3" fill="#0369a1" />
      <circle cx="44" cy="24.5" r="1.4" fill="#ffffff" />

      {/* Nose & Mouth */}
      <polygon points="36,32 33,29 39,29" fill="#f43f5e" />
      <path d="M 36 32 L 36 35 M 36 35 Q 32 37 31 35 M 36 35 Q 40 37 41 35" stroke="#475569" strokeWidth="1.5" fill="none" strokeLinecap="round" />

      {/* Arms */}
      {action === 'reach' ? (
        <>
          <path d="M 22 45 Q 16 30 18 16" stroke="url(#totoBody3D)" strokeWidth="7" strokeLinecap="round" fill="none" />
          <circle cx="18" cy="16" r="4.5" fill="#ffffff" />
          <path d="M 50 45 Q 56 30 54 16" stroke="url(#totoBody3D)" strokeWidth="7" strokeLinecap="round" fill="none" />
          <circle cx="54" cy="16" r="4.5" fill="#ffffff" />
        </>
      ) : (
        <>
          <ellipse cx="22" cy="48" rx="5" ry="8" fill="url(#totoBody3D)" />
          <ellipse cx="50" cy="48" rx="5" ry="8" fill="url(#totoBody3D)" />
        </>
      )}

      {/* Feet */}
      <ellipse cx="26" cy="69" rx="8" ry="5" fill="url(#totoBody3D)" />
      <ellipse cx="46" cy="69" rx="8" ry="5" fill="url(#totoBody3D)" />
    </g>
  );
};

// 3D Buddy Bear
const Buddy3D = ({
  x = 0,
  y = 0,
  scale = 1,
  action = 'normal',
}: {
  x?: number;
  y?: number;
  scale?: number;
  action?: 'normal' | 'shake' | 'stand' | 'strong' | 'happy';
}) => {
  return (
    <g transform={`translate(${x}, ${y}) scale(${scale})`}>
      {/* 3D Soft Shadow */}
      <ellipse cx="50" cy="98" rx="36" ry="10" fill="url(#charShadow)" />

      {/* 3D Ears */}
      <circle cx="28" cy="22" r="12" fill="url(#buddyBody3D)" />
      <circle cx="28" cy="22" r="6" fill="#fde68a" opacity="0.8" />
      <circle cx="72" cy="22" r="12" fill="url(#buddyBody3D)" />
      <circle cx="72" cy="22" r="6" fill="#fde68a" opacity="0.8" />

      {/* 3D Volumetric Bear Body */}
      <ellipse cx="50" cy="66" rx="35" ry="32" fill="url(#buddyBody3D)" />
      {/* Warm Belly Shading */}
      <ellipse cx="50" cy="68" rx="23" ry="20" fill="url(#buddyMuzzle3D)" opacity="0.85" />

      {/* 3D Head Sphere */}
      <circle cx="50" cy="38" r="27" fill="url(#buddyBody3D)" />
      {/* Top Head Specular Glow */}
      <ellipse cx="44" cy="22" rx="10" ry="4" fill="#fde68a" opacity="0.4" transform="rotate(-10 44 22)" />

      {/* 3D Muzzle */}
      <ellipse cx="50" cy="45" rx="15" ry="11" fill="url(#buddyMuzzle3D)" />
      <polygon points="50,42 43,37 57,37" fill="#2d1303" />
      <path d="M 50 42 L 50 48 M 50 48 Q 44 52 42 49 M 50 48 Q 56 52 58 49" stroke="#2d1303" strokeWidth="2.5" fill="none" strokeLinecap="round" />

      {/* Warm Kind Eyes */}
      <circle cx="40" cy="33" r="3.8" fill="#1c1917" />
      <circle cx="41.5" cy="31.5" r="1.4" fill="#ffffff" />
      <circle cx="60" cy="33" r="3.8" fill="#1c1917" />
      <circle cx="61.5" cy="31.5" r="1.4" fill="#ffffff" />

      {/* Arms */}
      {action === 'strong' ? (
        <>
          <path d="M 22 55 Q 6 48 10 32" stroke="url(#buddyBody3D)" strokeWidth="14" strokeLinecap="round" fill="none" />
          <circle cx="10" cy="32" r="6" fill="url(#buddyBody3D)" />
          <path d="M 78 55 Q 94 48 90 32" stroke="url(#buddyBody3D)" strokeWidth="14" strokeLinecap="round" fill="none" />
          <circle cx="90" cy="32" r="6" fill="url(#buddyBody3D)" />
        </>
      ) : action === 'shake' ? (
        <>
          <path d="M 22 60 Q 6 52 0 44" stroke="url(#buddyBody3D)" strokeWidth="13" strokeLinecap="round" fill="none" />
          <path d="M 78 60 Q 94 52 100 44" stroke="url(#buddyBody3D)" strokeWidth="13" strokeLinecap="round" fill="none" />
        </>
      ) : (
        <>
          <ellipse cx="18" cy="64" rx="9" ry="14" fill="url(#buddyBody3D)" transform="rotate(15 18 64)" />
          <ellipse cx="82" cy="64" rx="9" ry="14" fill="url(#buddyBody3D)" transform="rotate(-15 82 64)" />
        </>
      )}

      {/* Rounded 3D Feet */}
      <ellipse cx="32" cy="94" rx="14" ry="8" fill="url(#buddyBody3D)" />
      <ellipse cx="68" cy="94" rx="14" ry="8" fill="url(#buddyBody3D)" />
      <circle cx="32" cy="93" r="4" fill="#fde68a" opacity="0.6" />
      <circle cx="68" cy="93" r="4" fill="#fde68a" opacity="0.6" />
    </g>
  );
};

// 3D Apple Tree with The Big Red Apple
const AppleTree3D = ({
  x = 220,
  y = 10,
  appleScale = 1,
  appleWobble = false,
  showApple = true,
}: {
  x?: number;
  y?: number;
  appleScale?: number;
  appleWobble?: boolean;
  showApple?: boolean;
}) => {
  return (
    <g transform={`translate(${x}, ${y})`}>
      {/* 3D Trunk with Ambient Occlusion & Grain */}
      <path
        d="M 85 90 C 80 145 68 195 62 240 L 118 240 C 112 195 100 145 95 90 Z"
        fill="url(#trunk3D)"
      />
      {/* Wood bark 3D curves */}
      <path d="M 80 135 Q 86 165 78 195" stroke="#451a03" strokeWidth="2.5" fill="none" opacity="0.4" />
      <path d="M 98 115 Q 94 150 99 190" stroke="#451a03" strokeWidth="2.5" fill="none" opacity="0.4" />

      {/* 3D Branches */}
      <path d="M 75 110 Q 40 85 18 90" stroke="url(#trunk3D)" strokeWidth="10" strokeLinecap="round" fill="none" />
      <path d="M 105 105 Q 140 80 162 85" stroke="url(#trunk3D)" strokeWidth="10" strokeLinecap="round" fill="none" />

      {/* 3D Volumetric Tree Canopy (Soft pillowy layered foliage balls) */}
      <circle cx="90" cy="70" r="62" fill="url(#foliage3DDeep)" />
      <circle cx="48" cy="62" r="50" fill="url(#foliage3DLight)" />
      <circle cx="132" cy="58" r="50" fill="url(#foliage3DDeep)" />
      <circle cx="90" cy="32" r="46" fill="url(#foliage3DLight)" />
      <circle cx="68" cy="46" r="40" fill="url(#foliage3DLight)" />
      <circle cx="116" cy="42" r="38" fill="url(#foliage3DLight)" />

      {/* Specular Leaf Highlights */}
      <ellipse cx="50" cy="40" rx="14" ry="7" fill="#dcfce7" opacity="0.4" transform="rotate(-20 50 40)" />
      <ellipse cx="90" cy="18" rx="16" ry="8" fill="#dcfce7" opacity="0.45" />
      <ellipse cx="120" cy="30" rx="12" ry="6" fill="#dcfce7" opacity="0.35" transform="rotate(20 120 30)" />

      {/* The Big Red Apple on High Branch */}
      {showApple && (
        <g
          transform={`translate(45, 60) scale(${appleScale})`}
          className={appleWobble ? 'animate-sway' : ''}
        >
          {/* Stem */}
          <path d="M 12 0 C 15 6 13 12 10 15" stroke="#78350f" strokeWidth="3.5" fill="none" strokeLinecap="round" />
          {/* 3D Leaf */}
          <path d="M 12 4 Q 24 2 26 12 Q 18 14 12 4 Z" fill="url(#appleLeaf3D)" />
          <path d="M 12 4 Q 19 8 26 12" stroke="#ecfccb" strokeWidth="1" fill="none" opacity="0.8" />

          {/* Big Juicy Apple Body: 3D Glossy Sphere */}
          <path
            d="M 10 12 C 3 10 -6 19 -3 30 C 0 41 8 45 10 45 C 12 45 20 41 23 30 C 26 19 17 10 10 12 Z"
            fill="url(#apple3DGloss)"
            filter="url(#softGlow)"
          />
          {/* Glassy Specular Curved Highlight */}
          <ellipse cx="4" cy="23" rx="4" ry="7.5" fill="#ffffff" opacity="0.75" transform="rotate(-22 4 23)" />
          <circle cx="3" cy="18" r="2" fill="#ffffff" opacity="0.9" />
          {/* Ambient Warm Sparkle */}
          <path d="M 19 18 L 21 20 L 19 22 L 17 20 Z" fill="#fef08a" opacity="0.9" />
        </g>
      )}
    </g>
  );
};

/* --- 3D Scene Renderers for Cover and 10 Pages --- */

const CoverScene: React.FC = () => (
  <svg viewBox="0 0 460 260" className="w-full h-full max-h-[300px]">
    {/* Rolling 3D Grass Hills */}
    <path d="M -20 215 Q 180 180 480 215 L 480 270 L -20 270 Z" fill="#86efac" />
    <path d="M -20 230 Q 240 205 480 230 L 480 270 L -20 270 Z" fill="#4ade80" />

    {/* Flowers with 3D petals */}
    <circle cx="50" cy="235" r="4.5" fill="#fb7185" />
    <circle cx="50" cy="235" r="2.2" fill="#fef08a" />
    <circle cx="120" cy="245" r="4.5" fill="#38bdf8" />
    <circle cx="120" cy="245" r="2.2" fill="#fef08a" />
    <circle cx="390" cy="238" r="4.5" fill="#fb7185" />

    {/* 3D Apple Tree with The Big Red Apple */}
    <AppleTree3D x={180} y={-10} appleScale={1.35} />

    {/* 3D Animated Characters (No title text inside picture, as requested) */}
    <Buddy3D x={290} y={118} scale={1.08} action="happy" />
    <Pinky3D x={95} y={148} scale={1.08} action="lookUp" />
    <Toto3D x={175} y={142} scale={1.08} action="happy" />
  </svg>
);

const Page1Scene: React.FC<{ isAudioPlaying?: boolean }> = ({ isAudioPlaying }) => (
  <svg viewBox="0 0 460 250" className="w-full h-full max-h-[300px]">
    {/* Sunny Forest 3D Meadow */}
    <path d="M 0 185 Q 230 165 460 185 L 460 250 L 0 250 Z" fill="#86efac" />
    <path d="M 0 210 Q 230 195 460 210 L 460 250 L 0 250 Z" fill="#4ade80" />

    {/* 3D Background Forest Trees with Volumetric Light */}
    <circle cx="40" cy="140" r="35" fill="url(#foliage3DDeep)" opacity="0.6" />
    <circle cx="110" cy="135" r="40" fill="url(#foliage3DLight)" opacity="0.5" />
    <circle cx="350" cy="135" r="45" fill="url(#foliage3DDeep)" opacity="0.6" />
    <circle cx="410" cy="140" r="40" fill="url(#foliage3DLight)" opacity="0.5" />

    {/* Warm Sun in the Sky */}
    <circle cx="395" cy="45" r="32" fill="url(#sunRays)" />
    <circle cx="395" cy="45" r="22" fill="#fde047" />

    {/* 3D Pinky walking hungrily */}
    <g className={isAudioPlaying ? 'animate-soft-bounce' : ''}>
      <Pinky3D x={180} y={130} scale={1.25} action="hungry" />
    </g>

    {/* Thought Bubble: Thinking of delicious food */}
    <g transform="translate(245, 95)">
      <circle cx="0" cy="20" r="4" fill="#ffffff" opacity="0.9" />
      <circle cx="8" cy="10" r="6" fill="#ffffff" opacity="0.95" />
      <rect x="15" y="-15" width="60" height="34" rx="17" fill="#ffffff" stroke="#f472b6" strokeWidth="2" filter="url(#softGlow)" />
      <text x="45" y="8" textAnchor="middle" fontSize="18">🤤 🍎</text>
    </g>

    {/* Flower blossoms */}
    <circle cx="70" cy="225" r="5" fill="#f43f5e" />
    <circle cx="110" cy="235" r="5" fill="#38bdf8" />
    <circle cx="320" cy="225" r="5" fill="#f59e0b" />
    <circle cx="370" cy="232" r="5" fill="#ec4899" />
  </svg>
);

const Page2Scene: React.FC<{ isAudioPlaying?: boolean }> = ({ isAudioPlaying }) => (
  <svg viewBox="0 0 460 250" className="w-full h-full max-h-[300px]">
    <path d="M 0 195 Q 230 175 460 195 L 460 250 L 0 250 Z" fill="#86efac" />
    <path d="M 0 218 Q 230 200 460 218 L 460 250 L 0 250 Z" fill="#4ade80" />

    {/* Tall Apple Tree with Big Red Apple */}
    <AppleTree3D x={220} y={-5} appleScale={1.38} />

    {/* 3D Pinky looking up in awe */}
    <g className={isAudioPlaying ? 'animate-soft-bounce' : ''}>
      <Pinky3D x={110} y={140} scale={1.18} action="lookUp" />
    </g>

    {/* Dialogue bubble */}
    <g transform="translate(45, 70)">
      <rect x="0" y="0" width="140" height="38" rx="14" fill="#ffffff" stroke="#ec4899" strokeWidth="2" filter="url(#softGlow)" />
      <polygon points="70,38 80,48 85,38" fill="#ffffff" />
      <text x="70" y="24" textAnchor="middle" fill="#db2777" fontWeight="bold" fontSize="13" fontFamily="'Fredoka', cursive">
        "I want the apple!" 🍎
      </text>
    </g>
  </svg>
);

const Page3Scene: React.FC<{ isAudioPlaying?: boolean }> = ({ isAudioPlaying }) => (
  <svg viewBox="0 0 460 250" className="w-full h-full max-h-[300px]">
    <path d="M 0 205 Q 230 185 460 205 L 460 250 L 0 250 Z" fill="#86efac" />

    {/* Tall Tree */}
    <AppleTree3D x={230} y={-5} appleScale={1.38} />

    {/* Pinky JUMPING high in the air (Hop! Hop!) */}
    <g transform="translate(130, 90)" className="animate-soft-bounce">
      <path d="M 15 75 Q 20 85 10 95" stroke="#f472b6" strokeWidth="3" strokeLinecap="round" fill="none" />
      <path d="M 65 75 Q 60 85 70 95" stroke="#f472b6" strokeWidth="3" strokeLinecap="round" fill="none" />
      <Pinky3D x={0} y={0} scale={1.18} action="jump" />
    </g>

    {/* Jump dust clouds */}
    <ellipse cx="155" cy="205" rx="14" ry="6" fill="#fef08a" opacity="0.6" />
    <ellipse cx="195" cy="205" rx="16" ry="7" fill="#fef08a" opacity="0.6" />

    {/* Hop! Hop! Exclamation */}
    <g transform="translate(55, 45)">
      <rect x="0" y="0" width="125" height="34" rx="12" fill="#fff1f2" stroke="#f43f5e" strokeWidth="2" filter="url(#softGlow)" />
      <text x="62" y="22" textAnchor="middle" fill="#be123c" fontWeight="bold" fontSize="12" fontFamily="'Fredoka', cursive">
        Hop! Hop! Too high!
      </text>
    </g>
  </svg>
);

const Page4Scene: React.FC<{ isAudioPlaying?: boolean }> = ({ isAudioPlaying }) => (
  <svg viewBox="0 0 460 250" className="w-full h-full max-h-[300px]">
    <path d="M 0 200 Q 230 180 460 200 L 460 250 L 0 250 Z" fill="#86efac" />

    <AppleTree3D x={240} y={-5} appleScale={1.35} />

    {/* Pinky standing looking relieved */}
    <Pinky3D x={130} y={145} scale={1.08} action="lookUp" />

    {/* Toto the Rabbit coming in with cheerful wave */}
    <g className={isAudioPlaying ? 'animate-soft-bounce' : ''}>
      <Toto3D x={40} y={135} scale={1.18} action="happy" />
    </g>

    {/* Dialogue: "I can help you!" says Toto */}
    <g transform="translate(15, 60)">
      <rect x="0" y="0" width="135" height="36" rx="12" fill="#ffffff" stroke="#0ea5e9" strokeWidth="2" filter="url(#softGlow)" />
      <polygon points="45,36 52,46 58,36" fill="#ffffff" />
      <text x="67" y="23" textAnchor="middle" fill="#0369a1" fontWeight="bold" fontSize="12" fontFamily="'Fredoka', cursive">
        "I can help you!" 🐰
      </text>
    </g>
  </svg>
);

const Page5Scene: React.FC<{ isAudioPlaying?: boolean }> = ({ isAudioPlaying }) => (
  <svg viewBox="0 0 460 250" className="w-full h-full max-h-[300px]">
    <path d="M 0 205 Q 230 185 460 205 L 460 250 L 0 250 Z" fill="#86efac" />

    <AppleTree3D x={240} y={-5} appleScale={1.38} />

    <Pinky3D x={80} y={150} scale={1.02} action="lookUp" />

    {/* Toto bouncing very high (Boing! Boing!) */}
    <g transform="translate(160, 45)" className="animate-soft-bounce">
      <path d="M 28 85 Q 24 95 36 105 Q 24 115 36 125" stroke="#38bdf8" strokeWidth="3.5" fill="none" strokeLinecap="round" />
      <Toto3D x={0} y={0} scale={1.18} action="jump" />
    </g>

    {/* Boing! Boing! Banner */}
    <g transform="translate(180, 15)">
      <rect x="0" y="0" width="115" height="30" rx="10" fill="#f0f9ff" stroke="#0284c7" strokeWidth="2" filter="url(#softGlow)" />
      <text x="57" y="20" textAnchor="middle" fill="#0369a1" fontWeight="bold" fontSize="12" fontFamily="'Fredoka', cursive">
        Boing! Boing!
      </text>
    </g>
  </svg>
);

const Page6Scene: React.FC<{ isAudioPlaying?: boolean }> = ({ isAudioPlaying }) => (
  <svg viewBox="0 0 460 250" className="w-full h-full max-h-[300px]">
    <path d="M 0 200 Q 230 180 460 200 L 460 250 L 0 250 Z" fill="#86efac" />

    <AppleTree3D x={270} y={-10} appleScale={1.35} />

    <Pinky3D x={20} y={150} scale={0.98} action="lookUp" />
    <Toto3D x={80} y={145} scale={0.98} action="happy" />

    {/* Buddy the Bear arriving strong & big */}
    <g className={isAudioPlaying ? 'animate-soft-bounce' : ''}>
      <Buddy3D x={145} y={105} scale={1.18} action="strong" />
    </g>

    {/* "I can help you!" says Buddy */}
    <g transform="translate(150, 35)">
      <rect x="0" y="0" width="145" height="36" rx="12" fill="#ffffff" stroke="#d97706" strokeWidth="2" filter="url(#softGlow)" />
      <polygon points="60,36 70,46 78,36" fill="#ffffff" />
      <text x="72" y="23" textAnchor="middle" fill="#b45309" fontWeight="bold" fontSize="12" fontFamily="'Fredoka', cursive">
        "I can help you!" 🐻
      </text>
    </g>
  </svg>
);

const Page7Scene: React.FC<{ isAudioPlaying?: boolean }> = ({ isAudioPlaying }) => (
  <svg viewBox="0 0 460 250" className="w-full h-full max-h-[300px]">
    <path d="M 0 205 Q 230 185 460 205 L 460 250 L 0 250 Z" fill="#86efac" />

    {/* Shaking Tree with wobbling Apple */}
    <g className="animate-sway">
      <AppleTree3D x={230} y={-10} appleScale={1.35} appleWobble={true} />
    </g>

    {/* Fluttering green leaves falling */}
    <path d="M 260 90 Q 268 95 264 105" stroke="#16a34a" strokeWidth="4" strokeLinecap="round" fill="none" />
    <path d="M 320 120 Q 328 130 322 140" stroke="#16a34a" strokeWidth="4" strokeLinecap="round" fill="none" />
    <path d="M 240 130 Q 248 140 242 150" stroke="#16a34a" strokeWidth="4" strokeLinecap="round" fill="none" />

    {/* Buddy shaking tree */}
    <Buddy3D x={180} y={110} scale={1.12} action="shake" />

    <Pinky3D x={40} y={150} scale={0.92} action="lookUp" />
    <Toto3D x={95} y={145} scale={0.92} action="normal" />

    {/* Shake! Shake! banner */}
    <g transform="translate(100, 30)">
      <rect x="0" y="0" width="135" height="34" rx="12" fill="#fffbeb" stroke="#d97706" strokeWidth="2" filter="url(#softGlow)" />
      <text x="67" y="22" textAnchor="middle" fill="#92400e" fontWeight="bold" fontSize="12" fontFamily="'Fredoka', cursive">
        Shake! Shake! 🍃
      </text>
    </g>
  </svg>
);

const Page8Scene: React.FC<{ isAudioPlaying?: boolean }> = ({ isAudioPlaying }) => (
  <svg viewBox="0 0 460 260" className="w-full h-full max-h-[310px]">
    <path d="M 0 215 Q 230 195 460 215 L 460 260 L 0 260 Z" fill="#86efac" />

    {/* Apple Tree with Apple right above the acrobatic tower */}
    <AppleTree3D x={190} y={-15} appleScale={1.38} />

    {/* The Acrobatic Friendship Tower! */}
    {/* Base: Buddy Standing Strong */}
    <Buddy3D x={140} y={120} scale={1.12} action="stand" />

    {/* Middle: Pinky on Buddy's shoulders */}
    <Pinky3D x={160} y={70} scale={0.9} action="lookUp" />

    {/* Top: Toto on Pinky reaching */}
    <Toto3D x={175} y={20} scale={0.84} action="reach" />

    {/* Teamwork Together Banner */}
    <g transform="translate(20, 45)">
      <rect x="0" y="0" width="130" height="38" rx="14" fill="#ffffff" stroke="#16a34a" strokeWidth="2" filter="url(#softGlow)" />
      <text x="65" y="23" textAnchor="middle" fill="#15803d" fontWeight="bold" fontSize="12" fontFamily="'Fredoka', cursive">
        "Together!" 🤝
      </text>
    </g>
  </svg>
);

const Page9Scene: React.FC<{ isAudioPlaying?: boolean }> = ({ isAudioPlaying }) => (
  <svg viewBox="0 0 460 260" className="w-full h-full max-h-[310px]">
    <path d="M 0 215 Q 230 195 460 215 L 460 260 L 0 260 Z" fill="#86efac" />

    {/* Tree without the apple on branch (Toto has it!) */}
    <AppleTree3D x={190} y={-15} showApple={false} />

    {/* Friendship Tower with Toto holding the Apple */}
    <Buddy3D x={140} y={120} scale={1.12} action="happy" />
    <Pinky3D x={160} y={70} scale={0.9} action="happy" />

    <g transform="translate(175, 15)">
      <Toto3D x={0} y={0} scale={0.86} action="reach" />
      {/* 3D Glossy Apple in Toto's hands */}
      <g transform="translate(20, -5)">
        <circle cx="10" cy="10" r="14" fill="url(#apple3DGloss)" filter="url(#softGlow)" />
        <ellipse cx="6" cy="6" rx="3.5" ry="5.5" fill="#ffffff" opacity="0.8" />
        <path d="M 10 -2 Q 14 -6 16 -1" stroke="#78350f" strokeWidth="2.5" fill="none" />
        <path d="M 12 -4 Q 18 -8 20 -2 Z" fill="url(#appleLeaf3D)" />
        <text x="-12" y="5" fontSize="14">✨</text>
        <text x="26" y="8" fontSize="14">✨</text>
      </g>
    </g>

    {/* Hooray Banner */}
    <g transform="translate(30, 30)">
      <rect x="0" y="0" width="125" height="40" rx="14" fill="#fef08a" stroke="#eab308" strokeWidth="2" filter="url(#softGlow)" />
      <text x="62" y="25" textAnchor="middle" fill="#854d0e" fontWeight="bold" fontSize="13" fontFamily="'Fredoka', cursive">
        "Hooray! 🎉"
      </text>
    </g>
  </svg>
);

const Page10Scene: React.FC<{ isAudioPlaying?: boolean }> = ({ isAudioPlaying }) => (
  <svg viewBox="0 0 460 250" className="w-full h-full max-h-[300px]">
    <path d="M 0 190 Q 230 170 460 190 L 460 250 L 0 250 Z" fill="#86efac" />

    {/* 3D Red and White Picnic Blanket */}
    <g transform="translate(110, 160)">
      <polygon points="20,0 220,0 240,70 0,70" fill="#fee2e2" stroke="#fca5a5" strokeWidth="2" />
      <line x1="60" y1="0" x2="45" y2="70" stroke="#f87171" strokeWidth="2.5" />
      <line x1="120" y1="0" x2="110" y2="70" stroke="#f87171" strokeWidth="2.5" />
      <line x1="180" y1="0" x2="175" y2="70" stroke="#f87171" strokeWidth="2.5" />
      <line x1="10" y1="35" x2="230" y2="35" stroke="#f87171" strokeWidth="2.5" />

      {/* 3D Plate with 3 Apple Slices */}
      <ellipse cx="120" cy="40" rx="36" ry="17" fill="#ffffff" stroke="#cbd5e1" strokeWidth="2" filter="url(#softGlow)" />
      <path d="M 100 38 Q 106 30 112 39 Z" fill="#ef4444" stroke="#991b1b" strokeWidth="1.5" />
      <path d="M 115 36 Q 121 28 127 37 Z" fill="#ef4444" stroke="#991b1b" strokeWidth="1.5" />
      <path d="M 130 38 Q 136 30 142 39 Z" fill="#ef4444" stroke="#991b1b" strokeWidth="1.5" />
    </g>

    {/* 3D Happy Friends sharing */}
    <Buddy3D x={290} y={105} scale={1.08} action="happy" />
    <Pinky3D x={55} y={135} scale={1.08} action="happy" />
    <Toto3D x={160} y={110} scale={1.02} action="happy" />

    {/* Yum Yum Sweet Banner */}
    <g transform="translate(155, 18)">
      <rect x="0" y="0" width="155" height="36" rx="14" fill="#ffffff" stroke="#f43f5e" strokeWidth="2" filter="url(#softGlow)" />
      <text x="77" y="24" textAnchor="middle" fill="#be123c" fontWeight="bold" fontSize="13" fontFamily="'Fredoka', cursive">
        Yum! Yum! Sweet! 🍎
      </text>
    </g>
  </svg>
);
