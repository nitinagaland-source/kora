import React, { useState } from 'react';
import { X, Layers, Droplets, Wind, Sparkles, ShieldCheck } from 'lucide-react';

interface FabricationGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FabricationGuideModal: React.FC<FabricationGuideModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [selectedFabric, setSelectedFabric] = useState<'terry' | 'interlock' | 'jersey' | 'poplin'>('terry');

  if (!isOpen) return null;

  const fabrics = [
    {
      id: 'terry' as const,
      name: '420 GSM FRENCH TERRY',
      category: 'TRACK PANTS & HEAVY HOODIES',
      density: '420 GSM (12.4 oz/yd²)',
      composition: '100% Ring-Spun Combed Cotton',
      features: [
        'Diagonal loopback interior engineered for moisture absorption and thermal insulation',
        'Pre-shrunk with zero-twist high-tension knit structure to eliminate side-seam torquing',
        'Substantial structural drape that holds architectural break over footwear',
      ],
      care: 'Machine wash cold inside out (30°C). Flat dry in shade. Do not tumble dry.',
    },
    {
      id: 'interlock' as const,
      name: '280 GSM COMPACT INTERLOCK',
      category: 'CORE ESSENTIAL T-SHIRTS',
      density: '280 GSM (8.3 oz/yd²)',
      composition: '100% Long-Staple Pima Cotton',
      features: [
        'Double-knit interlock weave creating mirror-smooth face on both interior and exterior',
        '1.25" reinforced high-density rib collar with internal elastane memory ribbing',
        'Zero show-through opacity with silky cool-touch handfeel',
      ],
      care: 'Gentle cycle cold. Low spin. Medium iron on reverse side.',
    },
    {
      id: 'jersey' as const,
      name: '320 GSM HEAVYWEIGHT JERSEY',
      category: 'OVERSIZE ARCHITECTURAL TEES',
      density: '320 GSM (9.4 oz/yd²)',
      composition: '100% Combed Compact Cotton',
      features: [
        'Rigid structural boxy silhouette that creates a stand-off distance from the torso',
        'High air-permeability despite substantial tactile weight',
        'Enzyme-washed for a weathered velvety texture and deep pigment absorption',
      ],
      care: 'Wash cold with like darks. Hang dry immediately. Avoid direct harsh sunlight.',
    },
    {
      id: 'poplin' as const,
      name: '240 GSM CRISP TAILORED POPLIN',
      category: 'STRUCTURED OVERSHIRTS & BUTTON-DOWNS',
      density: '240 GSM (7.1 oz/yd²)',
      composition: '100% Egyptian Giza Cotton Twill',
      features: [
        'Micro-sanded matte finish with razor-sharp collar stand and cuffs',
        'High-density 100/2 double-ply yarn construction for tear resistance',
        'Natural wrinkle-rebound properties and tailored drape',
      ],
      care: 'Steam iron warm. Dry clean recommended or delicate hand wash cold.',
    },
  ];

  const current = fabrics.find((f) => f.id === selectedFabric) || fabrics[0];

  return (
    <div 
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-3xl bg-[#F3F1EC] border border-[#E2DFD7] text-[#111111] p-6 sm:p-8 shadow-2xl relative my-8"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-[#111111] hover:text-[#666666] transition-colors cursor-pointer"
          aria-label="Close fabrication guide modal"
        >
          <X size={20} />
        </button>

        {/* Header */}
        <div className="space-y-2 mb-6 border-b border-[#E2DFD7] pb-5">
          <div className="flex items-center gap-2 text-[10px] font-label text-[#777777] tracking-[0.2em] uppercase">
            <Layers size={12} className="text-[#B85D3B]" />
            <span>KORA TEXTILE ARCHITECTURE</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-display font-black tracking-tight text-[#111111]">
            FABRICATION &amp; TEXTILE GUIDE
          </h2>
          <p className="text-xs sm:text-sm text-[#666666] font-sans leading-relaxed">
            We mill our textiles from raw combed cottons with custom high-density knit gauges, balancing heavy physical mass with effortless breathable drape.
          </p>
        </div>

        {/* Fabric Tabs */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-6">
          {fabrics.map((fab) => {
            const isActive = fab.id === selectedFabric;
            return (
              <button
                key={fab.id}
                type="button"
                onClick={() => setSelectedFabric(fab.id)}
                className={`p-3 text-left border transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#111111] text-[#F3F1EC] border-[#111111]'
                    : 'bg-[#EAE7DF] text-[#666666] border-[#D8D4CA] hover:text-[#111111] hover:border-[#111111]'
                }`}
              >
                <div className="text-[9px] font-mono tracking-wider opacity-70">
                  {fab.density.split(' ')[0]} {fab.density.split(' ')[1]}
                </div>
                <div className="text-[11px] font-label font-bold tracking-tight uppercase truncate">
                  {fab.name.replace(/^\d+\s+GSM\s+/, '')}
                </div>
              </button>
            );
          })}
        </div>

        {/* Fabric Detail Box */}
        <div className="p-5 bg-[#EAE7DF] border border-[#D8D4CA] space-y-4 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#D8D4CA] pb-3">
            <div>
              <span className="text-[9px] font-label text-[#B85D3B] tracking-[0.16em]">
                {current.category}
              </span>
              <h3 className="text-lg font-display font-bold text-[#111111]">
                {current.name}
              </h3>
            </div>
            <div className="text-xs font-mono text-[#555555]">
              <span className="text-[#111111] font-bold">COMPOSITION:</span> {current.composition}
            </div>
          </div>

          <div className="space-y-2">
            <div className="text-[10px] font-label text-[#777777] tracking-[0.16em] uppercase">
              TECHNICAL ATTRIBUTES
            </div>
            <ul className="space-y-2 text-xs font-mono text-[#444444]">
              {current.features.map((feat, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-[#B85D3B] font-bold text-xs mt-0.5">•</span>
                  <span>{feat}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="pt-3 border-t border-[#D8D4CA] flex items-start gap-2.5 text-xs font-mono bg-[#E2DFD7] p-3">
            <Droplets size={16} className="text-[#B85D3B] shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-[#111111]">CARE INSTRUCTIONS: </span>
              <span className="text-[#555555]">{current.care}</span>
            </div>
          </div>
        </div>

        {/* Footer info strip */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-center sm:text-left text-xs font-mono text-[#666666] pt-2 border-t border-[#E2DFD7]">
          <div className="flex items-center gap-2 justify-center sm:justify-start">
            <Sparkles size={14} className="text-[#B85D3B]" />
            <span>Anti-pilling enzyme treatment</span>
          </div>
          <div className="flex items-center gap-2 justify-center sm:justify-start">
            <Wind size={14} className="text-[#B85D3B]" />
            <span>Zero chemical harsh brighteners</span>
          </div>
          <div className="flex items-center gap-2 justify-center sm:justify-start">
            <ShieldCheck size={14} className="text-[#B85D3B]" />
            <span>Tested for 50+ wash cycles</span>
          </div>
        </div>
      </div>
    </div>
  );
};
