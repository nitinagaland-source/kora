import { Product, LookbookItem } from '../types';
import tshirtImg from '../assets/images/kora_tshirt_upload.png';
import graphicTeeImg from '../assets/images/kora_graphic_tee_upload.png';
import oversizeTshirtImg from '../assets/images/kora_oversize_tshirt_upload.png';
import oversizedShirtImg from '../assets/images/kora_oversized_shirt_upload.png';
import poloTshirtImg from '../assets/images/kora_polo_tshirt_upload.png';
import trackpantsImg from '../assets/images/kora_track_pant_upload.png';
import shirtImg from '../assets/images/kora_shirt_editorial_1787126368595.jpg';
import heroStreetwearImg from '../assets/images/kora_hero_streetwear_1787128110839.jpg';
import hoodieImg from '../assets/images/kora_hoodie_metropolis_upload.png';
import editorialMotionImg from '../assets/images/kora_feature_editorial_upload.png';

export const PRODUCTS: Product[] = [
  {
    id: 'kora-tp-01',
    name: 'The Architectural Track Pant',
    subtitle: 'Washed Charcoal / 420 GSM Terry',
    category: 'track-pants',
    categoryLabel: 'TRACK PANTS',
    price: 3490,
    originalPrice: 3990,
    colors: [
      { name: 'Washed Charcoal', hex: '#2A2A2A' },
      { name: 'Bone White', hex: '#ECE8DF' },
      { name: 'Deep Onyx', hex: '#121212' },
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    description: 'Engineered with a relaxed, straight-leg drape and weighted cuff break. Crafted from 420 GSM loopback organic French terry with custom matte zinc eyelets and an elongated drawcord.',
    details: [
      '420 GSM heavyweight organic cotton loopback terry',
      'Articulated knee darts for unrestricted motion',
      'Hidden RiRi zipper stash pocket at interior hip',
      'Continuous interior drawstring with matte dipped aglets'
    ],
    fabricGsm: '420 GSM Loopback Terry',
    composition: '100% GOTS Certified Organic Cotton',
    silhouette: 'Relaxed straight leg with subtle taper break',
    images: {
      primary: trackpantsImg,
      secondary: editorialMotionImg,
      detail: 'https://images.unsplash.com/photo-1516826957135-700dedea698c?auto=format&fit=crop&w=1000&q=80',
    },
    isBestseller: true,
    isNew: true,
    edition: 'DROP 04 / CORE',
  },
  {
    id: 'kora-ts-01',
    name: 'The 280GSM Heavyweight Tee',
    subtitle: 'Onyx Black / Archival Radial Sun Motif',
    category: 't-shirts',
    categoryLabel: 'T-SHIRTS',
    price: 1890,
    colors: [
      { name: 'Onyx Black', hex: '#111111' },
      { name: 'Bone', hex: '#ECE8DF' },
      { name: 'Raw Clay', hex: '#9C6855' },
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    description: 'The foundation of the Sunday uniform. Dense 280 GSM long-staple combed cotton with an architectural boxy drop-shoulder cut and vibrant archival radial arch motif on both the chest and back panel.',
    details: [
      '280 GSM 100% compact combed long-staple cotton',
      'Dual-sided multi-color radial sun geometric graphic print',
      '1.25" high-density rib knit collar that retains shape without baconing',
      'Pre-shrunk with subtle silicone bio-wash for cool-hand feel'
    ],
    fabricGsm: '280 GSM Compact Cotton',
    composition: '100% Combed Long-Staple Cotton',
    silhouette: 'Boxy, dropped shoulder, weighted drape',
    images: {
      primary: tshirtImg,
      secondary: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=1000&q=80',
      detail: 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?auto=format&fit=crop&w=1000&q=80',
    },
    isBestseller: true,
    edition: 'CORE UNIFORM',
  },
  {
    id: 'kora-sh-01',
    name: 'The Structured Boxy Overshirt',
    subtitle: 'Ink Black / High-Count Crisp Poplin',
    category: 'shirts',
    categoryLabel: 'SHIRTS',
    price: 3890,
    colors: [
      { name: 'Ink Black', hex: '#111111' },
      { name: 'Washed Sage', hex: '#636A5E' },
      { name: 'Raw Natural', hex: '#F0ECE1' },
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    description: 'A structural layer designed for all-season transition. Tailored from high-density Japanese cotton poplin with a straight-cut camp collar, clean blind placket, and tonal smoked mother-of-pearl buttons.',
    details: [
      '220 GSM high-density Japanese cotton poplin',
      'Clean hidden blind button placket with tonal topstitching',
      'Genuine smoke mother-of-pearl laser-engraved buttons',
      'Dual oversized architectural chest pockets with internal pen slot'
    ],
    fabricGsm: '220 GSM Japanese Poplin',
    composition: '100% Technical Compact Cotton',
    silhouette: 'Relaxed boxy overshirt with straight hem',
    images: {
      primary: shirtImg,
      secondary: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=1000&q=80',
      detail: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1000&q=80',
    },
    isNew: true,
    edition: 'AW\'25 SILHOUETTE',
  },
  {
    id: 'kora-ots-02',
    name: 'The Graphic Heavyweight Oversized Tee',
    subtitle: 'Pure White / Motorsport 911 Edition',
    category: 'oversize-tshirts',
    categoryLabel: 'OVERSIZE T-SHIRTS',
    price: 2490,
    colors: [
      { name: 'Pure White', hex: '#FFFFFF' },
      { name: 'Onyx Black', hex: '#121212' },
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    description: 'Constructed from 320 GSM compact combed cotton with high-density motorsport typography. Features minimalist front chest 911 branding paired with an architectural 911 GT3 RS artwork across the back panel.',
    details: [
      '320 GSM ultra-heavyweight combed cotton',
      'Dual placement screen-printed graphic art (minimalist chest imprint & back artwork)',
      'Non-deforming high tension 1.25" rib collar',
      'Deep drop-shoulder architectural streetwear cut'
    ],
    fabricGsm: '320 GSM Compact Cotton',
    composition: '100% Combed Long-Staple Cotton',
    silhouette: 'Extreme oversized silhouette with dropped shoulders',
    images: {
      primary: oversizeTshirtImg,
      secondary: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1000&q=80',
    },
    edition: 'DROP 04 / OVERSIZED',
  },
  {
    id: 'kora-ts-02',
    name: 'The Minimalist Graphic Tee — Form 01',
    subtitle: 'Pure White / Motorsport 911 Graphic',
    category: 't-shirts',
    categoryLabel: 'T-SHIRTS',
    price: 2190,
    colors: [
      { name: 'Pure White', hex: '#FFFFFF' },
      { name: 'Washed Ash', hex: '#4B4B4B' },
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    description: 'High-density silkscreen motorsport tribute. Minimalist front chest 911 typography paired with an architectural high-contrast 911 GT3 RS back print and technical telemetry specs.',
    details: [
      '260 GSM single jersey vintage-wash combed cotton',
      'Dual placement screen-printed graphic art (front chest & full back)',
      'Pre-shrunk architectural boxy drop-shoulder cut',
      'High tension non-deforming 1.25" crewneck ribbing'
    ],
    fabricGsm: '260 GSM Vintage Wash Jersey',
    composition: '100% Organic Cotton',
    silhouette: 'Oversized boxy fit',
    images: {
      primary: graphicTeeImg,
      secondary: 'https://images.unsplash.com/photo-1527719327859-c6ce80353573?auto=format&fit=crop&w=1000&q=80',
    },
    edition: 'LIMITED RUN',
  },
  {
    id: 'kora-sh-02',
    name: 'The Raw Camp-Collar Poplin Shirt',
    subtitle: 'Onyx Black / Embroidered Back Motif',
    category: 'shirts',
    categoryLabel: 'SHIRTS',
    price: 3290,
    colors: [
      { name: 'Onyx Black', hex: '#111111' },
      { name: 'Chalk Bone', hex: '#EDE9E0' },
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    description: 'An architectural short-sleeve camp collar shirt featuring high-density archival embroidery on the center back spine. Structured straight boxy cut with fluid movement.',
    details: [
      '200 GSM crisp compact poplin weave',
      'Intricate multi-tone archival back graphic embroidery',
      'Relaxed camp revere collar design with clean front chest pocket',
      'Side seam slits with reinforced bar-tack stitching'
    ],
    fabricGsm: '200 GSM Poplin',
    composition: '100% Cotton',
    silhouette: 'Relaxed boxy cut, straight hem with side vents',
    images: {
      primary: oversizedShirtImg,
      secondary: editorialMotionImg,
    },
    isNew: true,
    edition: 'AW\'25 SILHOUETTE',
  },
  {
    id: 'kora-ots-01',
    name: 'The 320GSM Architectural Oversized Tee',
    subtitle: 'Washed Clay / Extreme Drop Shoulder',
    category: 'oversize-tshirts',
    categoryLabel: 'OVERSIZE T-SHIRTS',
    price: 2290,
    colors: [
      { name: 'Raw Clay', hex: '#9C6855' },
      { name: 'Deep Onyx', hex: '#121212' },
      { name: 'Bone', hex: '#ECE8DF' },
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    description: 'An exaggerated architectural silhouette cut from ultra-dense 320 GSM compact cotton. Features dropped shoulders, elongated sleeve breaks, and a weighted hem drape that maintains its sculpt without folding.',
    details: [
      '320 GSM ultra-heavyweight long-staple combed cotton',
      'Wide architectural drop-shoulder cut with reinforced armholes',
      'High-tension 1.3" ribbed collar with anti-deformation stitching',
      'Pre-washed and enzyme treated for a structured, velvet-matte finish'
    ],
    fabricGsm: '320 GSM Compact Cotton',
    composition: '100% GOTS Certified Organic Cotton',
    silhouette: 'Extreme oversized boxy cut, elongated sleeves',
    images: {
      primary: oversizeTshirtImg,
      secondary: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1000&q=80',
      detail: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=1000&q=80',
    },
    isNew: true,
    isBestseller: true,
    edition: 'DROP 04 / OVERSIZED',
  },
  {
    id: 'kora-hd-01',
    name: 'The 480GSM Double-Layer Hooded Pullover',
    subtitle: 'Charcoal Black / Archival Glitch Graphic Back',
    category: 'hoodies',
    categoryLabel: 'HOODIES',
    price: 4490,
    originalPrice: 4990,
    colors: [
      { name: 'Charcoal Black', hex: '#1A1A1A' },
      { name: 'Warm Bone', hex: '#EAE6DC' },
      { name: 'Washed Olive', hex: '#3E4237' },
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    description: 'Engineered without eyelets or drawstrings for complete visual minimalism. Constructed from massive 480 GSM French terry with double-layered self-fabric hood construction and architectural landscape glitch graphic back art.',
    details: [
      '480 GSM dense loopback French terry with brushed interior',
      'Dual placement screen-printed graphic art (clean front & architectural back block)',
      'Self-fabric double-layer structured crossover hood (no drawstrings)',
      'Blind interior kangaroo pocket with concealed seam reinforcement'
    ],
    fabricGsm: '480 GSM French Terry',
    composition: '100% Organic Heavyweight Cotton',
    silhouette: 'Relaxed boxy silhouette with structured drape',
    images: {
      primary: hoodieImg,
      secondary: 'https://images.unsplash.com/photo-1509967419530-da38b4704bc6?auto=format&fit=crop&w=1000&q=80',
      detail: 'https://images.unsplash.com/photo-1516826957135-700dedea698c?auto=format&fit=crop&w=1000&q=80',
    },
    isNew: true,
    isBestseller: true,
    edition: 'HEAVYWEIGHT FORM',
  },
  {
    id: 'kora-ts-03',
    name: 'The Structured Heavyweight Polo T-Shirt',
    subtitle: 'Forest Green / Graphic Embroidered Back',
    category: 't-shirts',
    categoryLabel: 'T-SHIRTS',
    price: 2690,
    colors: [
      { name: 'Forest Green', hex: '#1C352D' },
      { name: 'Onyx Black', hex: '#111111' },
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    description: 'A contemporary architectural polo shirt cut from high-density 280 GSM combed cotton in deep forest green. Features subtle chest palm embroidery and an archival geometric graphic artwork across the back panel.',
    details: [
      '280 GSM heavyweight compact combed cotton',
      'Minimalist front chest embroidery and large multi-symbol back print',
      'Structured self-fabric tailored collar with clean button placket',
      'Side split hem with interior herringbone reinforcement'
    ],
    fabricGsm: '280 GSM Heavyweight Cotton',
    composition: '100% Combed Long-Staple Cotton',
    silhouette: 'Relaxed boxy polo silhouette with structured collar',
    images: {
      primary: poloTshirtImg,
      secondary: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=1000&q=80',
    },
    edition: 'AW\'25 SILHOUETTE',
  },
];

export const LOOKBOOK_ITEMS: LookbookItem[] = [
  {
    id: 'look-01',
    lookNumber: 'LOOK 01',
    title: 'THE ARCHITECTURAL RATIO',
    itemsFeatured: ['The 320GSM Architectural Oversized Tee', 'The Architectural Track Pant in Charcoal'],
    image: heroStreetwearImg,
    season: 'AW\'25 / DROP 04',
  },
  {
    id: 'look-02',
    lookNumber: 'LOOK 02',
    title: 'THE MONOCHROME UNIFORM',
    itemsFeatured: ['The Structured Boxy Overshirt in Ink', 'The Technical Pleated Track Pant in Black'],
    image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1200&q=80',
    season: 'AW\'25 / DROP 04',
  },
  {
    id: 'look-03',
    lookNumber: 'LOOK 03',
    title: 'THE SUNDAY REPOSE',
    itemsFeatured: ['The Raw Camp-Collar Shirt in Chalk', 'The Architectural Track Pant in Onyx'],
    image: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=1200&q=80',
    season: 'AW\'25 / DROP 04',
  },
];
