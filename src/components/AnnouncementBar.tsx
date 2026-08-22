import React from 'react';

interface AnnouncementBarProps {
  onTrackOrderClick: () => void;
}

export const AnnouncementBar: React.FC<AnnouncementBarProps> = ({ onTrackOrderClick }) => {
  return (
    <aside aria-label="Announcement" className="bg-[#111111] text-[#F3F1EC] text-[11px] font-label tracking-[0.18em] py-2.5 px-4 sm:px-8 border-b border-[#222222]">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#B85D3B]"></span>
          <span className="hidden sm:inline">COMPLIMENTARY SHIPPING ON ORDERS ABOVE ₹2,999</span>
          <span className="sm:hidden">FREE SHIPPING &gt; ₹2,999</span>
        </div>
        <div className="flex items-center gap-6 text-[10px] sm:text-[11px]">
          <button 
            onClick={onTrackOrderClick}
            className="hover:text-[#B85D3B] transition-colors cursor-pointer"
          >
            TRACK DISPATCH
          </button>
          <span className="text-[#444444]">|</span>
          <span className="hidden md:inline text-[#999999]">STUDIO CONCIERGE: MON–SAT</span>
          <span className="text-[#444444] hidden md:inline">|</span>
          <span className="text-[#E2DFD7]">AW'25 DROP 04</span>
        </div>
      </div>
    </aside>
  );
};
