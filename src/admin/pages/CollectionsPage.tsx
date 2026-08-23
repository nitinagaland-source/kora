import { useEffect, useState } from 'react';
import { collection, getDocs, addDoc, deleteDoc, doc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { Plus, Trash2 } from 'lucide-react';

interface Collection { id?: string; name: string; slug: string; description: string; published: boolean; }
const empty: Collection = { name:'', slug:'', description:'', published:true };

export function CollectionsPage() {
  const [cols, setCols] = useState<Collection[]>([]);
  const [form, setForm] = useState<Collection>(empty);
  const [msg, setMsg] = useState('');

  const load = () => getDocs(collection(db,'collections')).then(s=>setCols(s.docs.map(d=>({id:d.id,...d.data()} as Collection))));
  useEffect(()=>{ load(); },[]);

  const save = async () => {
    if(!form.name){setMsg('Name required');return;}
    await addDoc(collection(db,'collections'),{...form,createdAt:serverTimestamp()});
    setMsg('Collection created!'); setForm(empty); load();
  };
  const remove = async (id:string) => { if(confirm('Delete?')) { await deleteDoc(doc(db,'collections',id)); load(); }};

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6" style={{fontFamily:'Syne,sans-serif',color:'#111111'}}>Collections</h1>
      {msg && <div className="mb-4 p-3 rounded-lg text-sm" style={{background:'#e8f5e9',color:'#2e7d32'}}>{msg}</div>}
      <div className="rounded-xl p-5 shadow-sm mb-4" style={{background:'#fff'}}>
        <p className="font-semibold mb-3 text-sm">New Collection</p>
        <div className="grid gap-3" style={{gridTemplateColumns:'1fr 1fr'}}>
          <div><label className="block text-xs font-semibold uppercase tracking-widest mb-1">Name</label>
            <input className="w-full border rounded-lg px-3 py-2 text-sm" style={{borderColor:'#C8B89A',background:'#F3F1EC'}} value={form.name} onChange={e=>setForm(f=>({...f,name:e.target.value}))} /></div>
          <div><label className="block text-xs font-semibold uppercase tracking-widest mb-1">Slug</label>
            <input className="w-full border rounded-lg px-3 py-2 text-sm" style={{borderColor:'#C8B89A',background:'#F3F1EC'}} value={form.slug} onChange={e=>setForm(f=>({...f,slug:e.target.value.toLowerCase().replace(/\s+/g,'-')}))} /></div>
          <div className="col-span-2"><label className="block text-xs font-semibold uppercase tracking-widest mb-1">Description</label>
            <input className="w-full border rounded-lg px-3 py-2 text-sm" style={{borderColor:'#C8B89A',background:'#F3F1EC'}} value={form.description} onChange={e=>setForm(f=>({...f,description:e.target.value}))} /></div>
        </div>
        <button onClick={save} className="mt-3 flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold" style={{background:'#111111',color:'#F3F1EC'}}>
          <Plus size={14}/> Create Collection
        </button>
      </div>
      <div className="space-y-2">
        {cols.map(c=>(
          <div key={c.id} className="flex items-center justify-between p-4 rounded-xl shadow-sm" style={{background:'#fff'}}>
            <div><p className="font-semibold" style={{color:'#111'}}>{c.name}</p><p className="text-xs" style={{color:'#888'}}>/{c.slug}</p></div>
            <button onClick={()=>remove(c.id!)} className="p-2 rounded" style={{background:'#fce4ec'}}><Trash2 size={14} color="#c62828"/></button>
          </div>
        ))}
        {cols.length===0 && <p className="text-center text-sm py-6" style={{color:'#999'}}>No collections yet.</p>}
      </div>
    </div>
  );
}
