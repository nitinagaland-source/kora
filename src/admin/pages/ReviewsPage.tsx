import { useEffect, useState } from 'react';
import { collection, getDocs, updateDoc, doc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { Star } from 'lucide-react';

interface Review { id: string; productName: string; customerName: string; rating: number; text: string; status: string; createdAt: { seconds: number } | null; }

export function ReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    getDocs(collection(db, 'reviews')).then(snap => {
      setReviews(snap.docs.map(d => ({ id: d.id, ...d.data() } as Review)));
      setLoading(false);
    }).catch(() => setLoading(false));
  };
  useEffect(() => { load(); }, []);

  const updateStatus = async (id: string, status: string) => {
    await updateDoc(doc(db, 'reviews', id), { status });
    load();
  };

  const statusColor: Record<string,string> = { Pending:'#fff3e0', Approved:'#e8f5e9', Rejected:'#fce4ec' };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6" style={{fontFamily:'Syne,sans-serif',color:'#111111'}}>Reviews ({reviews.length})</h1>
      {loading ? <p>Loading...</p> : reviews.length === 0 ? (
        <div className="rounded-xl p-8 text-center" style={{background:'#fff'}}><p style={{color:'#666'}}>No reviews yet. They appear here after customers submit them.</p></div>
      ) : (
        <div className="space-y-3">
          {reviews.map(r => (
            <div key={r.id} className="rounded-xl p-4 shadow-sm" style={{background:'#fff'}}>
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-semibold text-sm" style={{color:'#111'}}>{r.customerName} <span style={{color:'#888'}}>on</span> {r.productName}</p>
                  <div className="flex gap-1 my-1">{[1,2,3,4,5].map(s=><Star key={s} size={12} fill={s<=r.rating?'#111':'none'} color="#111"/>)}</div>
                  <p className="text-sm" style={{color:'#444'}}>{r.text}</p>
                </div>
                <div className="flex gap-2 ml-4">
                  <span className="px-2 py-1 rounded-full text-xs" style={{background:statusColor[r.status]||'#f5f5f5',color:'#111'}}>{r.status}</span>
                  {r.status !== 'Approved' && <button onClick={()=>updateStatus(r.id,'Approved')} className="text-xs px-3 py-1 rounded" style={{background:'#e8f5e9',color:'#2e7d32'}}>Approve</button>}
                  {r.status !== 'Rejected' && <button onClick={()=>updateStatus(r.id,'Rejected')} className="text-xs px-3 py-1 rounded" style={{background:'#fce4ec',color:'#c62828'}}>Reject</button>}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
