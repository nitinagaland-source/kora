import { useEffect, useState } from 'react';
import { collection, getDocs, deleteDoc, doc, addDoc, updateDoc, serverTimestamp, writeBatch } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { formatINR } from '../../lib/formatINR';
import { ImageUploader } from '../components/ImageUploader';
import { Plus, Trash2, Edit2, X, Upload } from 'lucide-react';

const POLO_COLORS = [
  { name: 'Orange',       hex: '#F47920' },
  { name: 'Cosco Green',  hex: '#7EC826' },
  { name: 'Pink',         hex: '#F4A7B9' },
  { name: 'Royal Blue',   hex: '#1B3F8B' },
  { name: 'Lemon Yellow', hex: '#F5E642' },
  { name: 'White',        hex: '#F5F5F5' },
  { name: 'Red',          hex: '#D0021B' },
  { name: 'Dark Grey',    hex: '#3A3A3A' },
  { name: 'Firozi Blue',  hex: '#00AEEF' },
  { name: 'Maroon',       hex: '#800020' },
  { name: 'Bottle Green', hex: '#1A4731' },
  { name: 'Sky Blue',     hex: '#87CEEB' },
  { name: 'Navy Blue',    hex: '#0A1045' },
  { name: 'Light Grey',   hex: '#C8C8C8' },
];

interface Product {
  id?: string;
  name: string;
  subtitle: string;
  category: string;
  productType: string;
  price: number;
  originalPrice: number;
  description: string;
  fabricGsm: string;
  composition: string;
  silhouette: string;
  sizes: string[];
  poloColors: string[];
  isNew: boolean;
  isBestseller: boolean;
  published: boolean;
  primaryImage: string;
  secondaryImage: string;
  detailImage: string;
  edition: string;
}

const SEED_PRODUCTS = [
  { name:'The Architectural Track Pant', subtitle:'Washed Charcoal / 420 GSM Terry', category:'track-pants', productType:'standard', poloColors:[], price:3490, originalPrice:3990, description:'Engineered with a relaxed, straight-leg drape and weighted cuff break.', fabricGsm:'420 GSM Loopback Terry', composition:'100% GOTS Certified Organic Cotton', silhouette:'Relaxed straight leg with subtle taper break', sizes:['S','M','L','XL'], isNew:true, isBestseller:true, published:true, edition:'DROP 04 / CORE', primaryImage:'https://images.unsplash.com/photo-1594938298603-c8148c4b4faa?auto=format&fit=crop&w=800&q=80', secondaryImage:'https://images.unsplash.com/photo-1516826957135-700dedea698c?auto=format&fit=crop&w=800&q=80', detailImage:'' },
  { name:'The 280GSM Heavyweight Tee', subtitle:'Onyx Black / Archival Radial Sun Motif', category:'t-shirts', productType:'standard', poloColors:[], price:1890, originalPrice:0, description:'The foundation of the Sunday uniform.', fabricGsm:'280 GSM Compact Cotton', composition:'100% Combed Long-Staple Cotton', silhouette:'Boxy, dropped shoulder, weighted drape', sizes:['S','M','L','XL'], isNew:false, isBestseller:true, published:true, edition:'CORE UNIFORM', primaryImage:'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=800&q=80', secondaryImage:'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?auto=format&fit=crop&w=800&q=80', detailImage:'' },
  { name:'The Polo Tee', subtitle:'Pique Knit / Multi-Color', category:'t-shirts', productType:'polo', poloColors:['Orange','Cosco Green','Pink','Royal Blue','Lemon Yellow','White','Red','Dark Grey','Firozi Blue','Maroon','Bottle Green','Sky Blue','Navy Blue','Light Grey'], price:1890, originalPrice:0, description:'Classic polo silhouette in premium pique knit.', fabricGsm:'240 GSM Pique', composition:'100% Cotton Pique', silhouette:'Classic polo', sizes:['S','M','L','XL'], isNew:false, isBestseller:false, published:true, edition:'', primaryImage:'https://images.unsplash.com/photo-1586363104862-3a5e2ab60d99?auto=format&fit=crop&w=800&q=80', secondaryImage:'https://images.unsplash.com/photo-1559582798-678dfc71ccd8?auto=format&fit=crop&w=800&q=80', detailImage:'' },
];

const empty: Product = { name:'', subtitle:'', category:'t-shirts', productType:'standard', price:0, originalPrice:0, description:'', fabricGsm:'', composition:'', silhouette:'', sizes:[], poloColors:[], isNew:false, isBestseller:false, published:true, primaryImage:'', secondaryImage:'', detailImage:'', edition:'' };

export function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [form, setForm] = useState<Product>(empty);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');
  const [migrating, setMigrating] = useState(false);

  const load = async () => {
    setLoading(true);
    const snap = await getDocs(collection(db, 'products'));
    setProducts(snap.docs.map(d => ({ id: d.id, ...d.data() } as Product)));
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const migrate = async () => {
    if (!confirm('Import products? Continue?')) return;
    setMigrating(true);
    try {
      const batch = writeBatch(db);
      for (const p of SEED_PRODUCTS) {
        const ref = doc(collection(db, 'products'));
        batch.set(ref, { ...p, stock: { S:10, M:10, L:10, XL:10 }, createdAt: serverTimestamp(), updatedAt: serverTimestamp() });
      }
      await batch.commit();
      setMsg('Products imported!');
      load();
    } catch { setMsg('Import failed.'); }
    setMigrating(false);
  };

  const openNew = () => { setForm(empty); setEditing(null); setMsg(''); setShowForm(true); };
  const openEdit = (p: Product) => { setForm({ ...p, poloColors: p.poloColors || [], productType: p.productType || 'standard' }); setEditing(p); setMsg(''); setShowForm(true); };

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

  const togglePoloColor = (colorName: string) => {
    setForm(f => ({
      ...f,
      poloColors: f.poloColors.includes(colorName)
        ? f.poloColors.filter(c => c !== colorName)
        : [...f.poloColors, colorName]
    }));
  };

  const selectAllPoloColors = () => setForm(f => ({ ...f, poloColors: POLO_COLORS.map(c => c.name) }));
  const clearAllPoloColors = () => setForm(f => ({ ...f, poloColors: [] }));

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold" style={{fontFamily:'Syne,sans-serif',color:'#111111'}}>Products ({products.length})</h1>
        <div className="flex gap-2">
          {products.length === 0 && (
            <button onClick={migrate} disabled={migrating} className="flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-sm border-2" style={{borderColor:'#111111',color:'#111111',background:'#fff'}}>
              <Upload size={16}/> {migrating ? 'Importing...' : 'Import Products'}
            </button>
          )}
          <button onClick={openNew} className="flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-sm" style={{background:'#111111',color:'#F3F1EC'}}>
            <Plus size={16}/> Add Product
          </button>
        </div>
      </div>

      {msg && <div className="mb-4 p-3 rounded-lg text-sm" style={{background:'#e8f5e9',color:'#2e7d32'}}>{msg}</div>}

      {loading ? <p style={{color:'#666'}}>Loading...</p> : products.length > 0 && (
        <div className="rounded-xl overflow-hidden shadow-sm" style={{background:'#fff'}}>
          <table className="w-full text-sm">
            <thead style={{background:'#F3F1EC'}}>
              <tr>
                {['Image','Name','Category','Type','Price','Status','Actions'].map(h => (
                  <th key={h} className="text-left px-4 py-3 font-semibold text-xs uppercase tracking-widest" style={{color:'#111'}}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {products.map(p => (
                <tr key={p.id} className="border-t" style={{borderColor:'#F3F1EC'}}>
                  <td className="px-4 py-3">
                    {p.primaryImage ? <img src={p.primaryImage} className="w-12 h-12 object-cover rounded-lg" /> : <div className="w-12 h-12 rounded-lg" style={{background:'#F3F1EC'}}/>}
                  </td>
                  <td className="px-4 py-3 font-semibold" style={{color:'#111'}}>{p.name}</td>
                  <td className="px-4 py-3" style={{color:'#666'}}>{p.category}</td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-1 rounded-full text-xs font-semibold" style={{background: p.productType === 'polo' ? '#e3f2fd' : '#F3F1EC', color: p.productType === 'polo' ? '#1565c0' : '#666'}}>
                      {p.productType === 'polo' ? `Polo (${(p.poloColors||[]).length} colors)` : 'Standard'}
                    </span>
                  </td>
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
          <div className="h-full overflow-y-auto p-6" style={{width:580,background:'#fff'}}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold" style={{fontFamily:'Syne,sans-serif'}}>{editing ? 'Edit Product' : 'New Product'}</h2>
              <button onClick={() => setShowForm(false)}><X size={20}/></button>
            </div>
            <div className="space-y-4">

              {/* Product Type */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-widest mb-1">Product Type</label>
                <div className="flex gap-3">
                  {['standard','polo'].map(type => (
                    <button key={type} type="button" onClick={() => setForm(f => ({...f, productType: type}))}
                      className="px-5 py-2 rounded-lg text-sm font-semibold border-2 capitalize transition-colors"
                      style={{borderColor: form.productType === type ? '#111111' : '#ddd', background: form.productType === type ? '#111111' : '#fff', color: form.productType === type ? '#fff' : '#111'}}>
                      {type === 'polo' ? '🎽 Polo' : '👕 Standard'}
                    </button>
                  ))}
                </div>
              </div>

              {[['Name *','name'],['Subtitle','subtitle'],['Edition','edition'],['Fabric GSM','fabricGsm'],['Composition','composition'],['Silhouette','silhouette']].map(([label,field]) => (
                <div key={field}>
                  <label className="block text-xs font-semibold uppercase tracking-widest mb-1">{label}</label>
                  <input className="w-full border rounded-lg px-3 py-2 text-sm" style={{borderColor:'#C8B89A',background:'#F3F1EC'}} value={(form as Record<string,unknown>)[field] as string} onChange={e=>setForm(f=>({...f,[field]:e.target.value}))} />
                </div>
              ))}

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

              {/* Sizes */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-widest mb-2">Sizes Available</label>
                <div className="flex gap-2">
                  {['S','M','L','XL'].map(s => (
                    <button key={s} type="button" onClick={()=>toggleSize(s)} className="px-4 py-2 rounded-lg text-sm font-semibold border-2 transition-colors"
                      style={{borderColor: form.sizes.includes(s) ? '#111111' : '#ddd', background: form.sizes.includes(s) ? '#111111' : '#fff', color: form.sizes.includes(s) ? '#fff' : '#111'}}>
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              {/* Polo Colors — only shown when productType is polo */}
              {form.productType === 'polo' && (
                <div className="p-4 rounded-xl border-2" style={{borderColor:'#1565c0', background:'#f0f7ff'}}>
                  <div className="flex items-center justify-between mb-3">
                    <label className="text-xs font-semibold uppercase tracking-widest" style={{color:'#1565c0'}}>
                      🎽 Polo Colors Available ({form.poloColors.length}/14)
                    </label>
                    <div className="flex gap-2">
                      <button type="button" onClick={selectAllPoloColors} className="text-xs px-2 py-1 rounded font-semibold" style={{background:'#1565c0',color:'#fff'}}>All</button>
                      <button type="button" onClick={clearAllPoloColors} className="text-xs px-2 py-1 rounded font-semibold" style={{background:'#ddd',color:'#333'}}>None</button>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {POLO_COLORS.map(color => {
                      const selected = form.poloColors.includes(color.name);
                      return (
                        <button key={color.name} type="button" onClick={() => togglePoloColor(color.name)}
                          className="flex items-center gap-2 px-3 py-2 rounded-lg border-2 text-xs font-semibold transition-all text-left"
                          style={{borderColor: selected ? '#111111' : '#ddd', background: selected ? '#111111' : '#fff', color: selected ? '#fff' : '#333'}}>
                          <span className="w-5 h-5 rounded-full border-2 flex-shrink-0" style={{background: color.hex, borderColor: color.name === 'White' ? '#ddd' : color.hex}}></span>
                          {color.name}
                          {selected && <span className="ml-auto">✓</span>}
                        </button>
                      );
                    })}
                  </div>
                  <p className="text-xs mt-2" style={{color:'#666'}}>Only ticked colors will appear as swatches for customers on the storefront.</p>
                </div>
              )}

              <div className="flex gap-4">
                {[['isNew','New Arrival'],['isBestseller','Bestseller'],['published','Published']].map(([field,label]) => (
                  <label key={field} className="flex items-center gap-2 text-sm cursor-pointer">
                    <input type="checkbox" checked={(form as Record<string,unknown>)[field] as boolean} onChange={e=>setForm(f=>({...f,[field]:e.target.checked}))} />
                    {label}
                  </label>
                ))}
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
