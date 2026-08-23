import { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { formatINR } from '../../lib/formatINR';

interface Customer { id: string; fullName: string; email: string; phone: string; totalOrders: number; totalSpent: number; createdAt: { seconds: number } | null; }

export function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    getDocs(collection(db, 'customers')).then(snap => {
      setCustomers(snap.docs.map(d => ({ id: d.id, ...d.data() } as Customer)));
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const filtered = customers.filter(c => c.fullName?.toLowerCase().includes(search.toLowerCase()) || c.email?.toLowerCase().includes(search.toLowerCase()));

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4" style={{fontFamily:'Syne,sans-serif',color:'#111111'}}>Customers ({customers.length})</h1>
      <input placeholder="Search by name or email..." className="w-full border rounded-lg px-4 py-2 text-sm mb-4" style={{borderColor:'#C8B89A',background:'#F3F1EC'}} value={search} onChange={e=>setSearch(e.target.value)} />
      {loading ? <p>Loading...</p> : filtered.length === 0 ? (
        <div className="rounded-xl p-8 text-center" style={{background:'#fff'}}><p style={{color:'#666'}}>No customers yet. They appear here after placing an order.</p></div>
      ) : (
        <div className="rounded-xl overflow-hidden shadow-sm" style={{background:'#fff'}}>
          <table className="w-full text-sm">
            <thead style={{background:'#F3F1EC'}}>
              <tr>{['Name','Email','Phone','Orders','Total Spent','Joined'].map(h=>(
                <th key={h} className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-widest" style={{color:'#111'}}>{h}</th>
              ))}</tr>
            </thead>
            <tbody>
              {filtered.map(c => (
                <tr key={c.id} className="border-t" style={{borderColor:'#F3F1EC'}}>
                  <td className="px-4 py-3 font-semibold">{c.fullName}</td>
                  <td className="px-4 py-3" style={{color:'#666'}}>{c.email}</td>
                  <td className="px-4 py-3" style={{color:'#666'}}>{c.phone || '-'}</td>
                  <td className="px-4 py-3">{c.totalOrders || 0}</td>
                  <td className="px-4 py-3 font-semibold">{formatINR(c.totalSpent || 0)}</td>
                  <td className="px-4 py-3 text-xs" style={{color:'#888'}}>{c.createdAt ? new Date(c.createdAt.seconds*1000).toLocaleDateString('en-IN') : '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
