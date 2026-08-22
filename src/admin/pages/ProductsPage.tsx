import { useEffect, useState } from 'react';
import { collection, getDocs, deleteDoc, doc, addDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { formatINR } from '../../lib/formatINR';
import { ImageUploader } from '../components/ImageUploader';
import { Plus, Trash2, Edit2, X } from 'lucide-react';

interface Product {
  id?: string;
  name: string;
  subtitle: string;
  category: string;
  price: number;
  originalPrice: number;
  description: string;
  fabricGsm: string;
  composition: string;
  silhouette: string;
  sizes: string[];
  isNew: boolean;
  isBestseller: boolean;
  published: boolean;
  primaryImage: string;
  secondaryImage: string;
  detailImage: string;
}

const empty: Product = { name:'',subtitle:'',category:'t-shirts',price:0,originalPrice:0,description:'',fabricGsm:'',composition:'',silhouette:'',sizes:[],isNew:false,isBestseller:false,published:true,primaryImage:'',secondaryImage:'',detailImage:'' };

export function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [form, setForm] = useState<Product>(empty);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');

  const load = async () => {
    setLoading(true);
    const snap = await getDocs(collection(db, 'products'));
    setProducts(snap.docs.map(d => ({ id: d.id, ...d.data() } as Product)));
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const openNew = () => { setForm(empty); setEditing(null); setShowForm(true); };
  const openEdit = (p: Product) => { setForm(p); setEditing(p); setShowForm(true); };

  const save = async () => {
    if (!form.name) { setMsg('Name is required'); return; }
    setSaving(true);
    try {
      const data = { ...form, updatedAt: serverTimestamp() };
      if (editing?.id) {
        await updateDoc(doc(db, 'products', editing.id), data);
      } else {
        await addDoc(collection(db, 'products'), { ...data, createdAt: serverTimestamp(), stock: { S:10, M:10, L:10, XL:10 } });
      }
      setMsg('Saved!');
      setShowForm(false);
      load();
    } catch { setMsg('Error saving'); }
    setSaving(false);
  };

  const remove = async (id: string) => {
    if (!confirm('Delete this product?')) return;
    await deleteDoc(doc(db, 'products', id));
    load();
  };

  const toggleSize = (s: string) => {
    setForm(f => ({ ...f, sizes: f.sizes.includes(s) ? f.sizes.filter(x => x !== s) : [...f.sizes, s] }));
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold" style={{fontFamily:'Syne,sans-serif',color:'#111111'}}>Products</h1>
        <button onClick={openNew} className="flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-sm" style={{background:'#111111',color:'#F3F1EC'}}>
          <Plus size={16}/> Add Product
        </button>
      </div>

      {msg && <div className="mb-4 p-3 rounded-lg text-sm" style={{background:'#e8f5e9',color:'#2e7d32'}}>{msg}</div>}

      {loading ? <p style={{color:'#666'}}>Loading...</p> : (
        <div className="rounded-xl overflow-hidden shadow-sm" style={{background:'#fff'}}>
          <table className="w-full text-sm">
            <thead style={{background:'#F3F1EC'}}>
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-xs uppercase tracking-widest" style={{color:'#111'}}>Image</th>
                <th className="text-left px-4 py-3 font-semibold text-xs uppercase tracking-widest" style={{color:'#111'}}>Name</th>
                <th className="text-left px-4 py-3 font-semibold text-xs uppercase tracking-widest" style={{color:'#111'}}>Category</th>
                <th className="text-left px-4 py-3 font-semibold text-xs uppercase tracking-widest" style={{color:'#111'}}>Price</th>
                <th className="text-left px-4 py-3 font-semibold text-xs uppercase tracking-widest" style={{color:'#111'}}>Status</th>
                <th className="text-left px-4 py-3 font-semibold text-xs uppercase tracking-widest" style={{color:'#111'}}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.length === 0 && <tr><td colSpan={6} className="px-4 py-8 text-center" style={{color:'#999'}}>No products yet. Click Add Product.</td></tr>}
              {products.map(p => (
                <tr key={p.id} className="border-t" style={{borderColor:'#F3F1EC'}}>
                  <td className="px-4 py-3">
                    {p.primaryImage ? <img src={p.primaryImage} className="w-12 h-12 object-cover rounded-lg" /> : <div className="w-12 h-12 rounded-lg" style={{background:'#F3F1EC'}}/>}
                  </td>
                  <td className="px-4 py-3 font-semibold" style={{color:'#111'}}>{p.name}</td>
                  <td className="px-4 py-3" style={{color:'#666'}}>{p.category}</td>
                  <td className="px-4 py-3 font-semibold" style={{color:'#111'}}>{formatINR(p.price)}</td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-1 rounded-full text-xs font-semibold" style={{background: p.published ? '#e8f5e9' : '#fce4ec', color: p.published ? '#2e7d32' : '#c62828'}}>
                      {p.published ? 'Published' : 'Draft'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button onClick={() => openEdit(p)} className="p-2 rounded-lg" style={{background:'#F3F1EC'}}><Edit2 size={14}/></button>
                      <button onClick={() => remove(p.id!)} className="p-2 rounded-lg" style={{background:'#fce4ec'}}><Trash2 size={14} color="#c62828"/></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-start justify-end" style={{background:'rgba(0,0,0,0.5)'}}>
          <div className="h-full overflow-y-auto p-6" style={{width:560,background:'#fff'}}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold" style={{fontFamily:'Syne,sans-serif'}}>{editing ? 'Edit Product' : 'New Product'}</h2>
              <button onClick={() => setShowForm(false)}><X size={20}/></button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-widest mb-1">Name *</label>
                <input className="w-full border rounded-lg px-3 py-2 text-sm" style={{borderColor:'#C8B89A',background:'#F3F1EC'}} value={form.name} onChange={e=>setForm(f=>({...f,name:e.target.value}))} />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-widest mb-1">Subtitle</label>
                <input className="w-full border rounded-lg px-3 py-2 text-sm" style={{borderColor:'#C8B89A',background:'#F3F1EC'}} value={form.subtitle} onChange={e=>setForm(f=>({...f,subtitle:e.target.value}))} />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-widest mb-1">Category</label>
                <select className="w-full border rounded-lg px-3 py-2 text-sm" style={{borderColor:'#C8B89A',background:'#F3F1EC'}} value={form.category} onChange={e=>setForm(f=>({...f,category:e.target.value}))}>
                  <option value="t-shirts">T-Shirts</option>
                  <option value="track-pants">Track Pants</option>
                  <option value="shirts">Shirts</option>
                  <option value="oversize-tshirts">Oversize T-Shirts</option>
                  <option value="hoodies">Hoodies</option>
                </select>
              </div>
              <div className="flex gap-3">
                <div className="flex-1">
                  <label className="block text-xs font-semibold uppercase tracking-widest mb-1">Price (Rs.)</label>
                  <input type="number" className="w-full border rounded-lg px-3 py-2 text-sm" style={{borderColor:'#C8B89A',background:'#F3F1EC'}} value={form.price} onChange={e=>setForm(f=>({...f,price:Number(e.target.value)}))} />
                </div>
                <div className="flex-1">
                  <label className="block text-xs font-semibold uppercase tracking-widest mb-1">Original Price (Rs.)</label>
                  <input type="number" className="w-full border rounded-lg px-3 py-2 text-sm" style={{borderColor:'#C8B89A',background:'#F3F1EC'}} value={form.originalPrice} onChange={e=>setForm(f=>({...f,originalPrice:Number(e.target.value)}))} />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-widest mb-1">Description</label>
                <textarea rows={3} className="w-full border rounded-lg px-3 py-2 text-sm" style={{borderColor:'#C8B89A',background:'#F3F1EC'}} value={form.description} onChange={e=>setForm(f=>({...f,description:e.target.value}))} />
              </div>
              <div className="flex gap-3">
                <div className="flex-1">
                  <label className="block text-xs font-semibold uppercase tracking-widest mb-1">Fabric GSM</label>
                  <input className="w-full border rounded-lg px-3 py-2 text-sm" style={{borderColor:'#C8B89A',background:'#F3F1EC'}} value={form.fabricGsm} onChange={e=>setForm(f=>({...f,fabricGsm:e.target.value}))} />
                </div>
                <div className="flex-1">
                  <label className="block text-xs font-semibold uppercase tracking-widest mb-1">Composition</label>
                  <input className="w-full border rounded-lg px-3 py-2 text-sm" style={{borderColor:'#C8B89A',background:'#F3F1EC'}} value={form.composition} onChange={e=>setForm(f=>({...f,composition:e.target.value}))} />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-widest mb-1">Silhouette</label>
                <input className="w-full border rounded-lg px-3 py-2 text-sm" style={{borderColor:'#C8B89A',background:'#F3F1EC'}} value={form.silhouette} onChange={e=>setForm(f=>({...f,silhouette:e.target.value}))} />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-widest mb-2">Sizes</label>
                <div className="flex gap-2">
                  {['S','M','L','XL'].map(s => (
                    <button key={s} type="button" onClick={()=>toggleSize(s)} className="px-4 py-2 rounded-lg text-sm font-semibold border-2 transition-colors" style={{borderColor: form.sizes.includes(s) ? '#111111' : '#ddd', background: form.sizes.includes(s) ? '#111111' : '#fff', color: form.sizes.includes(s) ? '#fff' : '#111'}}>
                      {s}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 text-sm cursor-pointer">
                  <input type="checkbox" checked={form.isNew} onChange={e=>setForm(f=>({...f,isNew:e.target.checked}))} />
                  New Arrival
                </label>
                <label className="flex items-center gap-2 text-sm cursor-pointer">
                  <input type="checkbox" checked={form.isBestseller} onChange={e=>setForm(f=>({...f,isBestseller:e.target.checked}))} />
                  Bestseller
                </label>
                <label className="flex items-center gap-2 text-sm cursor-pointer">
                  <input type="checkbox" checked={form.published} onChange={e=>setForm(f=>({...f,published:e.target.checked}))} />
                  Published
                </label>
              </div>
              <ImageUploader label="Primary Image" value={form.primaryImage} onChange={url=>setForm(f=>({...f,primaryImage:url}))} />
              <ImageUploader label="Secondary Image" value={form.secondaryImage} onChange={url=>setForm(f=>({...f,secondaryImage:url}))} />
              <ImageUploader label="Detail Image (optional)" value={form.detailImage} onChange={url=>setForm(f=>({...f,detailImage:url}))} />
            </div>

            {msg && <p className="mt-3 text-sm" style={{color:'#c62828'}}>{msg}</p>}
            <button onClick={save} disabled={saving} className="w-full mt-6 py-3 rounded-lg font-bold text-sm tracking-widest uppercase" style={{background:'#111111',color:'#F3F1EC'}}>
              {saving ? 'Saving...' : 'Save Product'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
