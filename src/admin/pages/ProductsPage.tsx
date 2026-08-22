import { useEffect, useState } from 'react';
import { collection, getDocs, deleteDoc, doc, addDoc, updateDoc, serverTimestamp, writeBatch } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { formatINR } from '../../lib/formatINR';
import { ImageUploader } from '../components/ImageUploader';
import { Plus, Trash2, Edit2, X, Upload } from 'lucide-react';

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
  edition: string;
}

const SEED_PRODUCTS = [
  { name:'The Architectural Track Pant', subtitle:'Washed Charcoal / 420 GSM Terry', category:'track-pants', price:3490, originalPrice:3990, description:'Engineered with a relaxed, straight-leg drape and weighted cuff break. Crafted from 420 GSM loopback organic French terry.', fabricGsm:'420 GSM Loopback Terry', composition:'100% GOTS Certified Organic Cotton', silhouette:'Relaxed straight leg with subtle taper break', sizes:['S','M','L','XL'], isNew:true, isBestseller:true, published:true, edition:'DROP 04 / CORE', primaryImage:'https://images.unsplash.com/photo-1594938298603-c8148c4b4faa?auto=format&fit=crop&w=800&q=80', secondaryImage:'https://images.unsplash.com/photo-1516826957135-700dedea698c?auto=format&fit=crop&w=800&q=80', detailImage:'' },
  { name:'The 280GSM Heavyweight Tee', subtitle:'Onyx Black / Archival Radial Sun Motif', category:'t-shirts', price:1890, originalPrice:0, description:'The foundation of the Sunday uniform. Dense 280 GSM long-staple combed cotton with an architectural boxy drop-shoulder cut.', fabricGsm:'280 GSM Compact Cotton', composition:'100% Combed Long-Staple Cotton', silhouette:'Boxy, dropped shoulder, weighted drape', sizes:['S','M','L','XL'], isNew:false, isBestseller:true, published:true, edition:'CORE UNIFORM', primaryImage:'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=800&q=80', secondaryImage:'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?auto=format&fit=crop&w=800&q=80', detailImage:'' },
  { name:'The Structured Boxy Overshirt', subtitle:'Ink Black / High-Count Crisp Poplin', category:'shirts', price:3890, originalPrice:0, description:'A structural layer designed for all-season transition. Tailored from high-density Japanese cotton poplin.', fabricGsm:'220 GSM Japanese Poplin', composition:'100% Technical Compact Cotton', silhouette:'Relaxed boxy overshirt with straight hem', sizes:['S','M','L','XL'], isNew:false, isBestseller:false, published:true, edition:'', primaryImage:'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=800&q=80', secondaryImage:'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?auto=format&fit=crop&w=800&q=80', detailImage:'' },
  { name:'The Oversized Drop-Shoulder Shirt', subtitle:'Ivory / Washed Texture Poplin', category:'shirts', price:2490, originalPrice:0, description:'Oversized fit with dropped shoulders and relaxed drape. Premium washed texture poplin for that lived-in luxury feel.', fabricGsm:'200 GSM Washed Poplin', composition:'100% Cotton', silhouette:'Oversized drop shoulder', sizes:['S','M','L','XL'], isNew:true, isBestseller:false, published:true, edition:'', primaryImage:'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=800&q=80', secondaryImage:'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?auto=format&fit=crop&w=800&q=80', detailImage:'' },
  { name:'The Graphic Tee', subtitle:'Stone / Archival Print Series', category:'t-shirts', price:1890, originalPrice:0, description:'Bold graphic print on 280 GSM heavyweight cotton. Archival artwork printed with water-based inks.', fabricGsm:'280 GSM Cotton', composition:'100% Combed Cotton', silhouette:'Boxy dropped shoulder', sizes:['S','M','L','XL'], isNew:true, isBestseller:false, published:true, edition:'ARCHIVE SERIES', primaryImage:'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=800&q=80', secondaryImage:'https://images.unsplash.com/photo-1503341504253-dff4815485f1?auto=format&fit=crop&w=800&q=80', detailImage:'' },
  { name:'The Polo Tee', subtitle:'Onyx / Pique Knit', category:'t-shirts', price:1890, originalPrice:0, description:'Classic polo silhouette in premium pique knit. Minimal branding, maximum quality.', fabricGsm:'240 GSM Pique', composition:'100% Cotton Pique', silhouette:'Classic polo', sizes:['S','M','L','XL'], isNew:false, isBestseller:false, published:true, edition:'', primaryImage:'https://images.unsplash.com/photo-1586363104862-3a5e2ab60d99?auto=format&fit=crop&w=800&q=80', secondaryImage:'https://images.unsplash.com/photo-1559582798-678dfc71ccd8?auto=format&fit=crop&w=800&q=80', detailImage:'' },
  { name:'The Oversize Tee Vol.1', subtitle:'Bone White / 320 GSM', category:'oversize-tshirts', price:1990, originalPrice:0, description:'Ultra-heavyweight oversize tee. 320 GSM fabric for premium drape and structure.', fabricGsm:'320 GSM Cotton', composition:'100% Combed Cotton', silhouette:'Ultra oversized', sizes:['S','M','L','XL'], isNew:true, isBestseller:false, published:true, edition:'DROP 01', primaryImage:'https://images.unsplash.com/photo-1620012253295-c15cc3e65df4?auto=format&fit=crop&w=800&q=80', secondaryImage:'https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=800&q=80', detailImage:'' },
  { name:'The Oversize Tee Vol.2', subtitle:'Washed Black / 320 GSM', category:'oversize-tshirts', price:1990, originalPrice:0, description:'The washed black variant of our signature oversize tee. Garment-dyed for that premium washed look.', fabricGsm:'320 GSM Cotton', composition:'100% Combed Cotton', silhouette:'Ultra oversized', sizes:['S','M','L','XL'], isNew:false, isBestseller:true, published:true, edition:'DROP 01', primaryImage:'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=800&q=80', secondaryImage:'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?auto=format&fit=crop&w=800&q=80', detailImage:'' },
  { name:'The Metropolis Hoodie', subtitle:'Deep Onyx / 480 GSM French Terry', category:'hoodies', price:4290, originalPrice:4990, description:'The definitive heavyweight hoodie. 480 GSM loopback terry with a structured hood and kangaroo pocket.', fabricGsm:'480 GSM French Terry', composition:'100% Organic Cotton', silhouette:'Relaxed boxy hoodie', sizes:['S','M','L','XL'], isNew:true, isBestseller:true, published:true, edition:'DROP 04 / CORE', primaryImage:'https://images.unsplash.com/photo-1556821840-3a63f15732ce?auto=format&fit=crop&w=800&q=80', secondaryImage:'https://images.unsplash.com/photo-1578587018452-892bacefd3f2?auto=format&fit=crop&w=800&q=80', detailImage:'' },
  { name:'The Streetwear Hoodie', subtitle:'Washed Grey / 420 GSM', category:'hoodies', price:3990, originalPrice:0, description:'Premium streetwear hoodie with dropped shoulders and raw hem details.', fabricGsm:'420 GSM Terry', composition:'100% Cotton', silhouette:'Oversized streetwear', sizes:['S','M','L','XL'], isNew:false, isBestseller:false, published:true, edition:'', primaryImage:'https://images.unsplash.com/photo-1578587018452-892bacefd3f2?auto=format&fit=crop&w=800&q=80', secondaryImage:'https://images.unsplash.com/photo-1556821840-3a63f15732ce?auto=format&fit=crop&w=800&q=80', detailImage:'' },
  { name:'The Oversize Shirt Vol.1', subtitle:'Chalk White / Textured Poplin', category:'oversize-tshirts', price:2490, originalPrice:0, description:'Oversized shirt silhouette in textured poplin. The perfect layering piece.', fabricGsm:'210 GSM Textured Poplin', composition:'100% Cotton', silhouette:'Oversized boxy shirt', sizes:['S','M','L','XL'], isNew:false, isBestseller:false, published:true, edition:'', primaryImage:'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=800&q=80', secondaryImage:'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=800&q=80', detailImage:'' },
  { name:'The Track Pant Vol.2', subtitle:'Bone White / 380 GSM Terry', category:'track-pants', price:3290, originalPrice:0, description:'The lighter-weight variant of our signature track pant. 380 GSM for a slightly more relaxed feel.', fabricGsm:'380 GSM Terry', composition:'100% Cotton', silhouette:'Straight leg relaxed', sizes:['S','M','L','XL'], isNew:false, isBestseller:false, published:true, edition:'', primaryImage:'https://images.unsplash.com/photo-1594938298603-c8148c4b4faa?auto=format&fit=crop&w=800&q=80', secondaryImage:'https://images.unsplash.com/photo-1516826957135-700dedea698c?auto=format&fit=crop&w=800&q=80', detailImage:'' },
];

const empty: Product = { name:'',subtitle:'',category:'t-shirts',price:0,originalPrice:0,description:'',fabricGsm:'',composition:'',silhouette:'',sizes:[],isNew:false,isBestseller:false,published:true,primaryImage:'',secondaryImage:'',detailImage:'',edition:'' };

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
    if (!confirm('This will import all 12 KORA products into the admin. Continue?')) return;
    setMigrating(true);
    try {
      const batch = writeBatch(db);
      for (const p of SEED_PRODUCTS) {
        const ref = doc(collection(db, 'products'));
        batch.set(ref, { ...p, stock: { S:10, M:10, L:10, XL:10 }, createdAt: serverTimestamp(), updatedAt: serverTimestamp() });
      }
      await batch.commit();
      setMsg('All 12 products imported successfully!');
      load();
    } catch (e) { setMsg('Import failed. Check Firestore rules.'); }
    setMigrating(false);
  };

  const openNew = () => { setForm(empty); setEditing(null); setMsg(''); setShowForm(true); };
  const openEdit = (p: Product) => { setForm(p); setEditing(p); setMsg(''); setShowForm(true); };

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
    if (!confirm('Delete this product? This cannot be undone.')) return;
    await deleteDoc(doc(db, 'products', id));
    load();
  };

  const toggleSize = (s: string) => {
    setForm(f => ({ ...f, sizes: f.sizes.includes(s) ? f.sizes.filter(x => x !== s) : [...f.sizes, s] }));
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold" style={{fontFamily:'Syne,sans-serif',color:'#111111'}}>Products ({products.length})</h1>
        <div className="flex gap-2">
          {products.length === 0 && (
            <button onClick={migrate} disabled={migrating} className="flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-sm border-2" style={{borderColor:'#111111',color:'#111111',background:'#fff'}}>
              <Upload size={16}/> {migrating ? 'Importing...' : 'Import All Products'}
            </button>
          )}
          <button onClick={openNew} className="flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-sm" style={{background:'#111111',color:'#F3F1EC'}}>
            <Plus size={16}/> Add Product
          </button>
        </div>
      </div>

      {msg && <div className="mb-4 p-3 rounded-lg text-sm" style={{background:'#e8f5e9',color:'#2e7d32'}}>{msg}</div>}

      {products.length === 0 && !loading && (
        <div className="rounded-xl p-8 text-center shadow-sm mb-4" style={{background:'#fff'}}>
          <p className="font-semibold mb-2" style={{color:'#111'}}>No products in admin yet</p>
          <p className="text-sm mb-4" style={{color:'#666'}}>Click "Import All Products" to bring all 12 existing KORA products into the admin, or add manually.</p>
        </div>
      )}

      {loading ? <p style={{color:'#666'}}>Loading...</p> : products.length > 0 && (
        <div className="rounded-xl overflow-hidden shadow-sm" style={{background:'#fff'}}>
          <table className="w-full text-sm">
            <thead style={{background:'#F3F1EC'}}>
              <tr>
                {['Image','Name','Category','Price','Status','Actions'].map(h => (
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
