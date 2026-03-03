'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Zap } from 'lucide-react';

function useCountdown(targetHours = 5) {
  const [time, setTime] = useState({ h: targetHours, m: 59, s: 59 });
  useEffect(() => {
    const t = setInterval(() => {
      setTime(prev => {
        if (prev.s > 0) return { ...prev, s: prev.s - 1 };
        if (prev.m > 0) return { ...prev, m: prev.m - 1, s: 59 };
        if (prev.h > 0) return { h: prev.h - 1, m: 59, s: 59 };
        return prev;
      });
    }, 1000);
    return () => clearInterval(t);
  }, []);
  return time;
}

function Digit({ val }: { val: number }) {
  return (
    <span className="bg-gray-900 text-white text-sm font-mono font-bold w-7 h-7 flex items-center justify-center rounded">
      {String(val).padStart(2, '0')}
    </span>
  );
}

export default function FlashSale() {
  const time = useCountdown(5);

  return (
    <Link href="/danh-muc/dien-thoai" className="group block">
      <div className="relative bg-gradient-to-r from-secondary-600 via-secondary-500 to-warning-500 rounded-2xl overflow-hidden">
        {/* Animated shine effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 translate-x-[-150%] group-hover:translate-x-[150%] transition-transform duration-1000" />
        
        <div className="flex items-center justify-between px-5 py-3.5 relative z-10">
          {/* Left: Label */}
          <div className="flex items-center gap-3">
            <div className="bg-yellow-400 text-gray-900 px-3 py-1.5 rounded-xl font-black text-base flex items-center gap-1 shadow-lg">
              <Zap className="w-4 h-4 fill-gray-900" />
              FLASH SALE
            </div>
            <div>
              <p className="text-white font-black text-lg leading-tight">DEAL CHỒNG DEAL</p>
              <p className="text-yellow-200 text-xs">Giảm đến <span className="font-bold text-sm text-white">70%++</span> - Số lượng có hạn!</p>
            </div>
          </div>

          {/* Center: Countdown */}
          <div className="hidden sm:flex items-center gap-1.5">
            <span className="text-white/80 text-xs mr-1">Kết thúc sau:</span>
            <Digit val={time.h} />
            <span className="text-white font-bold">:</span>
            <Digit val={time.m} />
            <span className="text-white font-bold">:</span>
            <Digit val={time.s} />
          </div>

          {/* Right: CTA */}
          <div className="bg-white text-secondary font-bold px-4 py-2 rounded-xl text-sm hover:bg-secondary-50 transition-colors shadow-lg whitespace-nowrap">
            MUA NGAY →
          </div>
        </div>
      </div>
    </Link>
  );
}
