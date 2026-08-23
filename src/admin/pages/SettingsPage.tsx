import { useEffect, useState } from 'react';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../lib/firebase';

export function SettingsPage() {
  const [tab, setTab] = useState('store');
  const [storeName, setStoreName] = useState('KORA');
  const [storeEmail, setStoreEmail] = useState('');
  const [storePhone, setStorePhone] = useState('');
  const [freeShipping, setFreeShipping] = useState(1999);
  const [flatShipping, setFlatShipping] = useState(99);
  const [gstRate, setGstRate] = useState(12);
  const [gstin, setGstin] = useState('');
  const [msg, setMsg] = useState('');

  useEffect(() => {
    getDoc(doc(db,'settings','store')).then(s=>{
      if(s.exists()){const d=s.data();setStoreName(d.name||'KORA');setStoreEmail(d.email||'');setStorePhone(d.phone||'');}
    });
    getDoc(doc(db,'settings','shipping')).then(s=>{
      if(s.exists()){const d=s.data();setFreeShipping(d.freeThreshold||1999);setFlatShipping(d.flatRate||99);}
    });
    getDoc(doc(db,'settings','gst')).then(s=>{
      if(s.exists()){const d=s.data();setGstRate(d.rate||12);setGstin(d.gstin||'');}
    });
  },[]);

  const save = async () => {
    await setDoc(doc(db,'settings','store'),{name:storeName,email:storeEmail,phone:storePhone,updatedAt:serverTimestamp()});
    await setDoc(doc(db,'settings','shipping'),{freeThreshold:freeShipping,flatRate:flatShipping,updatedAt:serverTimestamp()});
    await setDoc(doc(db,'settings','gst'),{rate:gstRate,gstin,updatedAt:serverTimestamp()});
    setMsg('Settings saved!');
    setTimeout(()=>setMsg(''),3000);
  };

  const tabs = [['store','Store'],['shipping','Shipping'],['gst','GST'],['integrations','Integrations']];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4" style={{fontFamily:'Syne,sans-serif',color:'#111111'}}>Settings</h1>
      <div className="flex gap-2 mb-6">
        {tabs.map(([id,label])=>(
          <button key={id} onClick={()=>setTab(id)} className="px-4 py-2 rounded-lg text-sm font-semibold" style={{background:tab===id?'#111111':'#F3F1EC',color:tab===id?'#F3F1EC':'#111111'}}>{label}</button>
        ))}
      </div>
      {msg && <div className="mb-4 p-3 rounded-lg text-sm" style={{background:'#e8f5e9',color:'#2e7d32'}}>{msg}</div>}
      <div className="rounded-xl p-6 shadow-sm" style={{background:'#fff'}}>
        {tab === 'store' && (
          <div className="space-y-4">
            <p className="font-semibold mb-2" style={{color:'#111'}}>Store Information</p>
            {[['Store Name',storeName,setStoreName],['Store Email',storeEmail,setStoreEmail],['Store Phone',storePhone,setStorePhone]].map(([label,val,setter])=>(
              <div key={label as string}>
                <label className="block text-xs font-semibold uppercase tracking-widest mb-1">{label as string}</label>
                <input className="w-full border rounded-lg px-3 py-2 text-sm" style={{borderColor:'#C8B89A',background:'#F3F1EC'}} value={val as string} onChange={e=>(setter as (v:string)=>void)(e.target.value)} />
              </div>
            ))}
          </div>
        )}
        {tab === 'shipping' && (
          <div className="space-y-4">
            <p className="font-semibold mb-2" style={{color:'#111'}}>Shipping Settings</p>
            <div><label className="block text-xs font-semibold uppercase tracking-widest mb-1">Flat Rate Shipping (Rs.)</label>
              <input type="number" className="w-full border rounded-lg px-3 py-2 text-sm" style={{borderColor:'#C8B89A',background:'#F3F1EC'}} value={flatShipping} onChange={e=>setFlatShipping(Number(e.target.value))} /></div>
            <div><label className="block text-xs font-semibold uppercase tracking-widest mb-1">Free Shipping Above (Rs.)</label>
              <input type="number" className="w-full border rounded-lg px-3 py-2 text-sm" style={{borderColor:'#C8B89A',background:'#F3F1EC'}} value={freeShipping} onChange={e=>setFreeShipping(Number(e.target.value))} /></div>
          </div>
        )}
        {tab === 'gst' && (
          <div className="space-y-4">
            <p className="font-semibold mb-2" style={{color:'#111'}}>GST Settings</p>
            <div><label className="block text-xs font-semibold uppercase tracking-widest mb-1">GST Rate %</label>
              <input type="number" className="w-full border rounded-lg px-3 py-2 text-sm" style={{borderColor:'#C8B89A',background:'#F3F1EC'}} value={gstRate} onChange={e=>setGstRate(Number(e.target.value))} /></div>
            <div><label className="block text-xs font-semibold uppercase tracking-widest mb-1">GSTIN</label>
              <input className="w-full border rounded-lg px-3 py-2 text-sm" style={{borderColor:'#C8B89A',background:'#F3F1EC'}} value={gstin} onChange={e=>setGstin(e.target.value)} placeholder="22AAAAA0000A1Z5" /></div>
            <div className="p-3 rounded-lg text-sm" style={{background:'#F3F1EC',color:'#666'}}>Currency is locked to <strong>Rs.</strong> (Indian Rupee)</div>
          </div>
        )}
        {tab === 'integrations' && (
          <div className="space-y-3">
            <p className="font-semibold mb-2" style={{color:'#111'}}>Connected Integrations</p>
            {[
              ['Firebase','kora-prod-299bd','Connected','#e8f5e9','#2e7d32'],
              ['Cloudinary','qqfx65pe','Connected','#e8f5e9','#2e7d32'],
              ['Razorpay','—','Not configured','#fff3e0','#e65100'],
            ].map(([name,val,status,bg,color])=>(
              <div key={name as string} className="flex items-center justify-between p-4 rounded-lg border" style={{borderColor:'#E2DFD7'}}>
                <div><p className="font-semibold text-sm" style={{color:'#111'}}>{name as string}</p><p className="text-xs" style={{color:'#888'}}>{val as string}</p></div>
                <span className="text-xs px-3 py-1 rounded-full font-semibold" style={{background:bg as string,color:color as string}}>{status as string}</span>
              </div>
            ))}
          </div>
        )}
        {tab !== 'integrations' && (
          <button onClick={save} className="mt-6 px-6 py-2 rounded-lg font-bold text-sm" style={{background:'#111111',color:'#F3F1EC'}}>Save Settings</button>
        )}
      </div>
    </div>
  );
}
