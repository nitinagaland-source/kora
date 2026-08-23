import React, { useEffect, useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { ProductCategory } from '../types';
import tshirtImg from '../assets/images/kora_tshirt_upload.png';
import trackpantsImg from '../assets/images/kora_track_pant_upload.png';
import shirtImg from '../assets/images/kora_shirt_editorial_1787126368595.jpg';
import { db } from '../lib/firebase';
import { collection, getDocs } from 'firebase/firestore';

interface CategoryStripProps {
  onSelectCategory: (category: ProductCategory) => void;
}

const FALLBACKS: Record<string, string> = {
  'track-pants': trackpantsImg,
  't-shirts': tshirtImg,
  'shirts': shirtImg,
};

export const CategoryStrip: React.FC<CategoryStripProps> = ({ onSelectCategory }) => {
  const [categoryImages, setCategoryImages] = useState<Record<string, string>>({});

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const snap = await getDocs(collection(db, 'categories'));
        const imgs: Record<string, string> = {};
        snap.forEach((doc) => {
          const data = doc.data();
          if (data.slug && data.thumbnailImage) {
            imgs[data.slug] = data.thumbnailImage;
          }
        });
        setCategoryImages(imgs);
      } catch (err) {
        console.error('Failed to fetch category images:', err);
      }
    };
    fetchImages();
  }, []);

  const getImage = (slug: string, fallback: string) =>
    categoryImages[slug] || fallback;

  const categories = [
    {
      id: 'track-pants' as ProductCategory,
      number: '01',
      title: 'TRACK PANTS',
      subtitle: 'Architectural drape & weighted break.',
      specs: '420 GSM French Terry',
      slug: 'track-pants',
      fallback: trackpantsImg,
    },
    {
      id: 't-shirts' as ProductCategory,
      number: '02',
      title: 'T-SHIRTS',
      subtitle: 'Boxy cut with non-deforming 1.25" neck rib.',
      specs: '280 GSM Combed Cotton',
      slug: 't-shirts',
      fallback: tshirtImg,
    },
    {
      id: 'shirts' as ProductCategory,
      number: '03',
      title: 'SHIRTS',
      subtitle: 'Structured Japanese poplin & blind placket.',
      specs: '220 GSM Technical Poplin',
      slug: 'shirts',
      fallback: shirtImg,
    },
  ];

  return (
    <section className="w-full bg-[#111111] text-[#F3F1EC] py-14 sm:py-20 border-t border-b border-[#222222]">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">

        {/* Section Header */}
        <div className="flex items-end justify-between mb-10 pb-4 border-b border-[#262626]">
          <div className="space-y-1">
            <span className="text-[10px] font-label text-[#888888] tracking-[0.24em] block">
              CORE DISCIPLINES
            </span>
            <h2 className="text-xl sm:text-2xl font-display font-bold tracking-tight text-[#F3F1EC]">
              THE ESSENTIAL TRILOGY
            </h2>
          </div>
          <span className="text-[11px] font-label text-[#666666] tracking-[0.2em] hidden sm:block">
            SPECIALIZED IN THREE SILHOUETTES
          </span>
        </div>

        {/* 3-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
          {categories.map((cat) => (
            <div
              key={cat.id}
              onClick={() => {
                onSelectCategory(cat.id);
                const el = document.getElementById('products-section');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="group cursor-pointer flex flex-col justify-between border-b md:border-b-0 md:border-r border-[#262626] last:border-r-0 pb-8 md:pb-0 md:pr-8 last:pr-0 transition-colors"
            >
              <div>
                <div className="relative aspect-[4/4.8] w-full overflow-hidden bg-[#1D1D1D] mb-6">
                  <img
                    src={getImage(cat.slug, cat.fallback)}
                    alt={cat.title}
                    className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
                    loading="lazy"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-3 left-3 bg-[#111111]/80 backdrop-blur-xs text-[#F3F1EC] text-[9px] font-label px-2 py-0.5 tracking-[0.16em]">
                    {cat.number}
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="text-lg sm:text-xl font-display font-bold tracking-tight text-[#F3F1EC] group-hover:text-[#E2DFD7] transition-colors">
                    {cat.title}
                  </h3>
                  <p className="text-[13px] text-[#A0A0A0] leading-relaxed font-sans max-w-xs">
                    {cat.subtitle}
                  </p>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-[#222222] flex items-center justify-between text-[11px] font-label tracking-[0.2em] text-[#E2DFD7] group-hover:text-[#B85D3B] transition-colors">
                <span>SHOP {cat.title}</span>
                <ArrowRight size={14} className="transform group-hover:translate-x-1.5 transition-transform" />
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
