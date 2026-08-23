import { useEffect, useState } from 'react';
import { collection, getDocs, doc, setDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { ImageUploader } from '../components/ImageUploader';
import { Edit2, X } from 'lucide-react';

interface Category {
  id: string;
  displayName: string;
  slug: string;
  description: string;
  heroImage: string;
  thumbnailImage: string;
  sortOrder: number;
  active: boolean;
}

const DEFAULT_CATEGORIES: Category[] = [
  { id:'track-pants', displayName:'Track Pants', slug:'track-pants', description:'Architectural drape and weighted break.', heroImage:'', thumbnailImage:'', sortOrder:1, active:true },
  { id:'t-shirts', displayName:'T-Shirts', slug:'t-shirts', description:'Boxy cut with non-deforming 1.25 inch neck rib.', heroImage:'', thumbnailImage:'', sortOrder:2, active:true },
  { id:'shirts', displayName:'Shirts', slug:'shirts', description:'Structured Japanese poplin and blind placket.', heroImage:'', thumbnailImage:'', sortOrder:3, active:true },
  { id:'oversize-tshirts', displayName:'Oversize Tees', slug:'oversize-tshirts', description:'320 GSM cotton and 480 GSM French terry.', heroImage:'', thumbnailImage:'', sortOrder:4, active:true },
  { id:'hoodies', displayName:'Hoodies', slug:'hoodies', description:'Heavyweight form in loopback terry.', heroImage:'', thumbnailImage:'', sortOrder:5, active:true },
];

export function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Category | null>(null);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');
  const [seeding, setSeeding] = useState(false);

  const load = async () => {
    setLoading(true);
    const snap = await getDocs(collection(db, 'categories'));
    if (snap.empty) {
      setCategories(DEFAULT_CATEGORIES);
    } else {
      setCategories(snap.docs.map(d => ({ id: d.id, ...d.data() } as Category)));
    }
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const seedCategories = async () => {
    setSeeding(true);
    for (const cat of DEFAULT_CATEGORIES) {
      await setDoc(doc(db, 'categories', cat.id), { ...cat, createdAt: serverTimestamp(), updatedAt: serverTimestamp() });
    }
    setMsg('All 5 categories saved to database!');
    load();
    setSeeding(false);
  };

  const save = async () => {
    if (!editing) return;
    setSaving(true);
    try {
      await setDoc(doc(db, 'categories', editing.id), { ...editing, updatedAt: serverTimestamp() }, { merge: true });
      setMsg('Category saved!');
      setEditing(null);
      load();
    } catch { setMsg('Error saving'); }
    setSaving(false);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold" style={{fontFamily:'Syne,sans-serif',color:'#111111'}}>Categories</h1>
        <button onClick={seedCategories} disabled={seeding} className="px-4 py-2 rounded-lg text-sm font-semibold border-2" style={{borderColor:'#111111',color:'#111111'}}>
          {seeding ? 'Saving...' : 'Save All to Database'}
        </button>
      </div>

      {msg && <div className="mb-4 p-3 rounded-lg text-sm" style={{background:'#e8f5e9',color:'#2e7d32'}}>{msg}</div>}

      <p className="text-sm mb-4" style={{color:'#666'}}>Edit category names, descriptions and images. Changes reflect on the frontend instantly.</p>

      {loading ? <p>Loading...</p> : (
        <div className="grid gap-4" style={{gridTemplateColumns:'1fr 1fr'}}>
          {categories.map(cat => (
            <div key={cat.id} className="rounded-xl p-4 shadow-sm" style={{background:'#fff'}}>
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="font-bold" style={{fontFamily:'Syne,sans-serif',color:'#111'}}>{cat.displayName}</p>
                  <p className="text-xs" style={{color:'#888'}}>/{cat.slug}</p>
                </div>
                <div className="flex gap-2 items-center">
                  <span className="text-xs px-2 py-1 rounded-full" style={{background: cat.active ? '#e8f5e9' : '#fce4ec', color: cat.active ? '#2e7d32' : '#c62828'}}>
                    {cat.active ? 'Active' : 'Hidden'}
                  </span>
                  <button onClick={() => setEditing({...cat})} className="p-2 rounded-lg" style={{background:'#F3F1EC'}}><Edit2 size={14}/></button>
                </div>
              </div>
              {cat.thumbnailImage && <img src={cat.thumbnailImage} className="w-full h-32 object-cover rounded-lg mb-2" />}
              <p className="text-sm" style={{color:'#666'}}>{cat.description}</p>
            </div>
          ))}
        </div>
      )}

      {editing && (
        <div className="fixed inset-0 z-50 flex items-start justify-end" style={{background:'rgba(0,0,0,0.5)'}}>
          <div className="h-full overflow-y-auto p-6" style={{width:500,background:'#fff'}}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold" style={{fontFamily:'Syne,sans-serif'}}>Edit: {editing.displayName}</h2>
              <button onClick={() => setEditing(null)}><X size={20}/></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-widest mb-1">Display Name</label>
                <input className="w-full border rounded-lg px-3 py-2 text-sm" style={{borderColor:'#C8B89A',background:'#F3F1EC'}} value={editing.displayName} onChange={e=>setEditing(c=>c?{...c,displayName:e.target.value}:c)} />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-widest mb-1">Description</label>
                <textarea rows={2} className="w-full border rounded-lg px-3 py-2 text-sm" style={{borderColor:'#C8B89A',background:'#F3F1EC'}} value={editing.description} onChange={e=>setEditing(c=>c?{...c,description:e.target.value}:c)} />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-widest mb-1">Sort Order</label>
                <input type="number" className="w-full border rounded-lg px-3 py-2 text-sm" style={{borderColor:'#C8B89A',background:'#F3F1EC'}} value={editing.sortOrder} onChange={e=>setEditing(c=>c?{...c,sortOrder:Number(e.target.value)}:c)} />
              </div>
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input type="checkbox" checked={editing.active} onChange={e=>setEditing(c=>c?{...c,active:e.target.checked}:c)} />
                Active (visible on frontend)
              </label>
              <ImageUploader label="Hero Image (large banner)" value={editing.heroImage} onChange={url=>setEditing(c=>c?{...c,heroImage:url}:c)} />
              <ImageUploader label="Thumbnail Image (category strip)" value={editing.thumbnailImage} onChange={url=>setEditing(c=>c?{...c,thumbnailImage:url}:c)} />
            </div>
            <button onClick={save} disabled={saving} className="w-full mt-6 py-3 rounded-lg font-bold text-sm tracking-widest uppercase" style={{background:'#111111',color:'#F3F1EC'}}>
              {saving ? 'Saving...' : 'Save Category'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
