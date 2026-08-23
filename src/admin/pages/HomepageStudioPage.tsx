import { useEffect, useState } from 'react';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { ImageUploader } from '../components/ImageUploader';

export function HomepageStudioPage() {
  const [tab, setTab] = useState('announcement');
  const [annText, setAnnText] = useState('');
  const [annBg, setAnnBg] = useState('#111111');
  const [annActive, setAnnActive] = useState(true);
  const [heroTitle, setHeroTitle] = useState('');
  const [heroSubtitle, setHeroSubtitle] = useState('');
  const [heroCta, setHeroCta] = useState('');
  const [heroImage, setHeroImage] = useState('');
  const [msg, setMsg] = useState('');

  useEffect(()=>{
    getDoc(doc(db,'settings','announcement')).then(s=>{if(s.exists()){const d=s.data();setAnnText(d.text||'');setAnnBg(d.bg||'#111111');setAnnActive(d.active??true);}});
    getDoc(doc(db,'homepageContent','hero')).then(s=>{if(s.exists()){const d=s.data();setHeroTitle(d.title||'');setHeroSubtitle(d.subtitle||'');setHeroCta(d.cta||'');setHeroImage(d.image||'');}});
  },[]);

  const saveAnn = async () => {
    await setDoc(doc(db,'settings','announcement'),{text:annText,bg:annBg,active:annActive,updatedAt:serverTimestamp()});
    setMsg('Saved!'); setTimeout(()=>setMsg(''),2000);
  };

  const saveHero = async () => {
    await setDoc(doc(db,'homepageContent','hero'),{title:heroTitle,subtitle:heroSubtitle,cta:heroCta,image:heroImage,updatedAt:serverTimestamp()});
    setMsg('Saved!'); setTimeout(()=>setMsg(''),2000);
  };

  const tabs = [['announcement','Announcement Bar'],['hero','Hero Section']];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4" style={{fontFamily:'Syne,sans-serif',color:'#111111'}}>Homepage Studio</h1>
      <div className="flex gap-2 mb-6">
        {tabs.map(([id,label])=>(
          <button key={id} onClick={()=>setTab(id)} className="px-4 py-2 rounded-lg text-sm font-semibold" style={{background:tab===id?'#111111':'#F3F1EC',color:tab===id?'#F3F1EC':'#111111'}}>{label}</button>
        ))}
      </div>
      {msg && <div className="mb-4 p-3 rounded-lg text-sm" style={{background:'#e8f5e9',color:'#2e7d32'}}>{msg}</div>}
      <div className="rounded-xl p-6 shadow-sm" style={{background:'#fff'}}>
        {tab==='announcement' && (
          <div className="space-y-4">
            <div><label className="block text-xs font-semibold uppercase tracking-widest mb-1">Announcement Text</label>
              <input className="w-full border rounded-lg px-3 py-2 text-sm" style={{borderColor:'#C8B89A',background:'#F3F1EC'}} value={annText} onChange={e=>setAnnText(e.target.value)} placeholder="FREE SHIPPING ON ORDERS ABOVE Rs. 1,999" /></div>
            <div><label className="block text-xs font-semibold uppercase tracking-widest mb-1">Background Color</label>
              <input type="color" value={annBg} onChange={e=>setAnnBg(e.target.value)} className="h-10 w-20 rounded border cursor-pointer" /></div>
            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <input type="checkbox" checked={annActive} onChange={e=>setAnnActive(e.target.checked)}/> Show on storefront
            </label>
            {annText && <div className="rounded-lg p-3 text-center text-sm" style={{background:annBg,color:'#fff'}}>Preview: {annText}</div>}
            <button onClick={saveAnn} className="px-6 py-2 rounded-lg font-bold text-sm" style={{background:'#111111',color:'#F3F1EC'}}>Save</button>
          </div>
        )}
        {tab==='hero' && (
          <div className="space-y-4">
            <div><label className="block text-xs font-semibold uppercase tracking-widest mb-1">Hero Title</label>
              <input className="w-full border rounded-lg px-3 py-2 text-sm" style={{borderColor:'#C8B89A',background:'#F3F1EC'}} value={heroTitle} onChange={e=>setHeroTitle(e.target.value)} /></div>
            <div><label className="block text-xs font-semibold uppercase tracking-widest mb-1">Hero Subtitle</label>
              <input className="w-full border rounded-lg px-3 py-2 text-sm" style={{borderColor:'#C8B89A',background:'#F3F1EC'}} value={heroSubtitle} onChange={e=>setHeroSubtitle(e.target.value)} /></div>
            <div><label className="block text-xs font-semibold uppercase tracking-widest mb-1">CTA Button Text</label>
              <input className="w-full border rounded-lg px-3 py-2 text-sm" style={{borderColor:'#C8B89A',background:'#F3F1EC'}} value={heroCta} onChange={e=>setHeroCta(e.target.value)} /></div>
            <ImageUploader label="Hero Background Image" value={heroImage} onChange={setHeroImage} />
            <button onClick={saveHero} className="px-6 py-2 rounded-lg font-bold text-sm" style={{background:'#111111',color:'#F3F1EC'}}>Save</button>
          </div>
        )}
      </div>
    </div>
  );
}
