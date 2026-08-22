import React from 'react';
import { Truck, RotateCcw, ShieldCheck, LockKeyhole } from 'lucide-react';

export const TrustStrip: React.FC = () => {
  const trustPoints = [
    {
      icon: Truck,
      title: 'FAST DISPATCH',
      subtitle: 'Dispatched within 24 hours',
    },
    {
      icon: RotateCcw,
      title: '7-DAY STUDIO EXCHANGE',
      subtitle: 'Complimentary doorstep exchange',
    },
    {
      icon: ShieldCheck,
      title: 'ARTISANAL DENSITY',
      subtitle: '280–420 GSM tested textiles',
    },
    {
      icon: LockKeyhole,
      title: 'SECURE CHECKOUT',
      subtitle: '256-bit encrypted payments',
    },
  ];

  return (
    <section className="w-full bg-[#F3F1EC] border-b border-[#E2DFD7] py-10 sm:py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 divide-y sm:divide-y-0 sm:divide-x divide-[#E2DFD7]/70">
          {trustPoints.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div 
                key={idx} 
                className={`flex items-start sm:items-center space-x-3.5 pt-4 sm:pt-0 ${idx !== 0 ? 'sm:pl-6' : ''}`}
              >
                <div className="text-[#111111] p-2 bg-[#EAE7DF] border border-[#DDD9CE]">
                  <Icon size={20} strokeWidth={1.4} />
                </div>
                <div className="space-y-0.5">
                  <h4 className="text-[11px] font-label font-bold tracking-[0.16em] text-[#111111]">
                    {item.title}
                  </h4>
                  <p className="text-[12px] text-[#666666] font-sans">
                    {item.subtitle}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
