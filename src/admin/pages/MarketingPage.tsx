import { useEffect, useState } from 'react';
import { doc, getDoc, setDoc, collection, getDocs, addDoc, deleteDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { formatINR } from '../../lib/formatINR';
import { Plus, Trash2 } from 'lucide-react';

interface Coupon { id?: string; code: string; type: 'percent'|'flat'; value: number; minOrder: number; maxUses: number; usedCount: number; active: boolean; expiry: string; }
const emptyCoupon: Coupon = { code:'', type:'percent', value:10, minOrder:0, maxUses:100, usedCount:0, active:true, expiry:'' };

export function MarketingPage() {
  const [tab, setTab] = useState<'coupons'|'announcement'>('coupons');
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [form, setForm] = useState<Coupon>(emptyCoupon);
  const [announcement, setAnnouncement] = useState('');
  const [annBg, setAnnBg] = useState('#111111');
  const [annActive, setAnnActive] = useState(true);
  const [msg, setMsg] = useState('');

  const loadCoupons = () => getDocs(collection(db,'coupons')).then(s=>setCoupons(s.docs.map(d=>({id:d.id,...d.data()} as Coupon))));
  const loadAnn = () => getDoc(doc(db,'settings','announcement')).then(s=>{ if(s.exists()){const d=s.data();setAnnouncement(d.text||'');setAnnBg(d.bg||'#111111');setAnnActive(d.active??true);}});

  useEffect(()=>{ loadCoupons(); loadAnn(); },[]);

  const saveCoupon = async () => {
    if(!form.code){ setMsg('Code required'); return; }
    await addDoc(collection(db,'coupons'),{...form,createdAt:serverTimestamp()});
    setMsg('Coupon created!'); setForm(emptyCoupon); loadCoupons();
  };
  const deleteCoupon = async (id: string) => { await deleteDoc(doc(db,'coupons',id)); loadCoupons(); };
  const saveAnnouncement = async () => {
    await setDoc(doc(db,'settings','announcement'),{text:announcement,bg:annBg,active:annActive,updatedAt:serverTimestamp()});
    setMsg('Announcement saved!');
  };

  const tabs = ['coupons','announcement'] as const;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4" style={{fontFamily:'Syne,sans-serif',color:'#111111'}}>Marketing</h1>
      <div className="flex gap-2 mb-6">
        {tabs.map(t=>(
          <button key={t} onClick={()=>{setTab(t);setMsg('');}} className="px-4 py-2 rounded-lg text-sm font-semibold capitalize" style={{background:tab===t?'#111111':'#F3F1EC',color:tab===t?'#F3F1EC':'#111111'}}>
            {t==='announcement'?'Announcement Bar':t.charAt(0).toUpperCase()+t.slice(1)}
          </button>
        ))}
      </div>
      {msg && <div className="mb-4 p-3 rounded-lg text-sm" style={{background:'#e8f5e9',color:'#2e7d32'}}>{msg}</div>}

      {tab === 'coupons' && (
        <div>
          <div className="rounded-xl p-5 shadow-sm mb-4" style={{background:'#fff'}}>
            <p className="font-semibold mb-3 text-sm">Create New Coupon</p>
            <div className="grid gap-3" style={{gridTemplateColumns:'1fr 1fr 1fr'}}>
              <div><label className="block text-xs font-semibold uppercase tracking-widest mb-1">Code</label>
                <input className="w-full border rounded-lg px-3 py-2 text-sm" style={{borderColor:'#C8B89A',background:'#F3F1EC'}} value={form.code} onChange={e=>setForm(f=>({...f,code:e.target.value.toUpperCase()}))} /></div>
              <div><label className="block text-xs font-semibold uppercase tracking-widest mb-1">Type</label>
                <select className="w-full border rounded-lg px-3 py-2 text-sm" style={{borderColor:'#C8B89A',background:'#F3F1EC'}} value={form.type} onChange={e=>setForm(f=>({...f,type:e.target.value as 'percent'|'flat'}))}>
                  <option value="percent">Percentage %</option><option value="flat">Flat Amount Rs.</option>
                </select></div>
              <div><label className="block text-xs font-semibold uppercase tracking-widest mb-1">Value</label>
                <input type="number" className="w-full border rounded-lg px-3 py-2 text-sm" style={{borderColor:'#C8B89A',background:'#F3F1EC'}} value={form.value} onChange={e=>setForm(f=>({...f,value:Number(e.target.value)}))} /></div>
              <div><label className="block text-xs font-semibold uppercase tracking-widest mb-1">Min Order (Rs.)</label>
                <input type="number" className="w-full border rounded-lg px-3 py-2 text-sm" style={{borderColor:'#C8B89A',background:'#F3F1EC'}} value={form.minOrder} onChange={e=>setForm(f=>({...f,minOrder:Number(e.target.value)}))} /></div>
              <div><label className="block text-xs font-semibold uppercase tracking-widest mb-1">Max Uses</label>
                <input type="number" className="w-full border rounded-lg px-3 py-2 text-sm" style={{borderColor:'#C8B89A',background:'#F3F1EC'}} value={form.maxUses} onChange={e=>setForm(f=>({...f,maxUses:Number(e.target.value)}))} /></div>
              <div><label className="block text-xs font-semibold uppercase tracking-widest mb-1">Expiry Date</label>
                <input type="date" className="w-full border rounded-lg px-3 py-2 text-sm" style={{borderColor:'#C8B89A',background:'#F3F1EC'}} value={form.expiry} onChange={e=>setForm(f=>({...f,expiry:e.target.value}))} /></div>
            </div>
            <button onClick={saveCoupon} className="mt-3 flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold" style={{background:'#111111',color:'#F3F1EC'}}>
              <Plus size={14}/> Create Coupon
            </button>
          </div>
          <div className="rounded-xl overflow-hidden shadow-sm" style={{background:'#fff'}}>
            <table className="w-full text-sm">
              <thead style={{background:'#F3F1EC'}}>
                <tr>{['Code','Type','Value','Min Order','Used/Max','Expiry','Status',''].map(h=>(
                  <th key={h} className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-widest" style={{color:'#111'}}>{h}</th>
                ))}</tr>
              </thead>
              <tbody>
                {coupons.length === 0 && <tr><td colSpan={8} className="px-4 py-6 text-center" style={{color:'#999'}}>No coupons yet.</td></tr>}
                {coupons.map(c=>(
                  <tr key={c.id} className="border-t" style={{borderColor:'#F3F1EC'}}>
                    <td className="px-4 py-3 font-mono font-bold">{c.code}</td>
                    <td className="px-4 py-3">{c.type==='percent'?'%':'Rs.'}</td>
                    <td className="px-4 py-3">{c.type==='percent'?c.value+'%':formatINR(c.value)}</td>
                    <td className="px-4 py-3">{c.minOrder>0?formatINR(c.minOrder):'-'}</td>
                    <td className="px-4 py-3">{c.usedCount}/{c.maxUses}</td>
                    <td className="px-4 py-3 text-xs" style={{color:'#666'}}>{c.expiry||'-'}</td>
                    <td className="px-4 py-3"><span className="px-2 py-1 rounded-full text-xs" style={{background:c.active?'#e8f5e9':'#fce4ec',color:c.active?'#2e7d32':'#c62828'}}>{c.active?'Active':'Inactive'}</span></td>
                    <td className="px-4 py-3"><button onClick={()=>deleteCoupon(c.id!)} className="p-1 rounded" style={{background:'#fce4ec'}}><Trash2 size={13} color="#c62828"/></button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab === 'announcement' && (
        <div className="rounded-xl p-6 shadow-sm" style={{background:'#fff'}}>
          <div className="space-y-4">
            <div><label className="block text-xs font-semibold uppercase tracking-widest mb-1">Announcement Text</label>
              <input className="w-full border rounded-lg px-3 py-2 text-sm" style={{borderColor:'#C8B89A',background:'#F3F1EC'}} value={announcement} onChange={e=>setAnnouncement(e.target.value)} placeholder="FREE SHIPPING ON ORDERS ABOVE Rs. 1,999" /></div>
            <div><label className="block text-xs font-semibold uppercase tracking-widest mb-1">Background Color</label>
              <input type="color" value={annBg} onChange={e=>setAnnBg(e.target.value)} className="h-10 w-20 rounded border cursor-pointer" /></div>
            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <input type="checkbox" checked={annActive} onChange={e=>setAnnActive(e.target.checked)} /> Show on storefront
            </label>
            {announcement && (
              <div className="rounded-lg p-3 text-center text-sm" style={{background:annBg,color:'#fff'}}>Preview: {announcement}</div>
            )}
            <button onClick={saveAnnouncement} className="px-6 py-2 rounded-lg font-bold text-sm" style={{background:'#111111',color:'#F3F1EC'}}>Save Announcement</button>
          </div>
        </div>
      )}
    </div>
  );
}
