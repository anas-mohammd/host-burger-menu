'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useTheme } from '@/lib/theme';

interface Props {
  onDone: () => void;
}

export default function SplashScreen({ onDone }: Props) {
  const [phase, setPhase] = useState<'in' | 'hold' | 'out'>('in');
  const { theme } = useTheme();

  useEffect(() => {
    // fade-in → hold → fade-out
    const hold = setTimeout(() => setPhase('hold'), 600);
    const out  = setTimeout(() => setPhase('out'),  1800);
    const done = setTimeout(onDone,                  2400);
    return () => { clearTimeout(hold); clearTimeout(out); clearTimeout(done); };
  }, [onDone]);

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#0f0f0f]"
      style={{
        opacity:    phase === 'out' ? 0 : 1,
        transition: phase === 'out' ? 'opacity 0.6s ease' : 'opacity 0.6s ease',
      }}
    >
      {/* Logo */}
      <div
        style={{
          transform:  phase === 'in' ? 'scale(0.85)' : 'scale(1)',
          opacity:    phase === 'in' ? 0 : 1,
          transition: 'transform 0.6s cubic-bezier(0.34,1.56,0.64,1), opacity 0.6s ease',
        }}
      >
        <Image
          src={theme === 'light' ? '/logo-light.svg' : '/logo.svg'}
          alt="logo"
          width={160}
          height={160}
          priority
        />
      </div>

      {/* Dots loader */}
      <div
        className="flex gap-1.5 mt-10"
        style={{
          opacity:    phase === 'in' ? 0 : 1,
          transition: 'opacity 0.4s ease 0.3s',
        }}
      >
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="w-1.5 h-1.5 rounded-full bg-white/30"
            style={{ animation: `bounce 1s ease-in-out ${i * 0.15}s infinite` }}
          />
        ))}
      </div>

      <style>{`
        @keyframes bounce {
          0%, 100% { transform: translateY(0);    opacity: 0.3; }
          50%       { transform: translateY(-6px); opacity: 1;   }
        }
      `}</style>
    </div>
  );
}
