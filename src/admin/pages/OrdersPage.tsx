import { useEffect, useState } from 'react';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { formatINR } from '../../lib/formatINR';

interface Order {
  id: string;
  orderId: string;
  customerName: string;
  email: string;
  total: number;
  status: string;
  paymentStatus: string;
  createdAt: { seconds: number } | null;
  items: { name: string; qty: number }[];
}

export function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDocs(collection(db, 'orders')).then(snap => {
      setOrders(snap.docs.map(d => ({ id: d.id, ...d.data() } as Order)));
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const statusColor = (s: string) => {
    const m: Record<string,string> = { PROCESSING:'#fff3e0', PACKED:'#e3f2fd', SHIPPED:'#e8f5e9', DELIVERED:'#c8e6c9', RETURNED:'#fce4ec' };
    return m[s] || '#f5f5f5';
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6" style={{fontFamily:'Syne,sans-serif',color:'#111111'}}>Orders ({orders.length})</h1>
      {loading ? <p>Loading...</p> : orders.length === 0 ? (
        <div className="rounded-xl p-8 text-center" style={{background:'#fff'}}>
          <p className="font-semibold mb-1" style={{color:'#111'}}>No orders yet</p>
          <p className="text-sm" style={{color:'#666'}}>Orders placed on the storefront will appear here.</p>
        </div>
      ) : (
        <div className="rounded-xl overflow-hidden shadow-sm" style={{background:'#fff'}}>
          <table className="w-full text-sm">
            <thead style={{background:'#F3F1EC'}}>
              <tr>{['Order ID','Customer','Date','Items','Total','Status','Payment'].map(h=>(
                <th key={h} className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-widest" style={{color:'#111'}}>{h}</th>
              ))}</tr>
            </thead>
            <tbody>
              {orders.map(o => (
                <tr key={o.id} className="border-t" style={{borderColor:'#F3F1EC'}}>
                  <td className="px-4 py-3 font-mono text-xs">{o.orderId || o.id.slice(0,8)}</td>
                  <td className="px-4 py-3 font-semibold">{o.customerName}</td>
                  <td className="px-4 py-3 text-xs" style={{color:'#666'}}>{o.createdAt ? new Date(o.createdAt.seconds*1000).toLocaleDateString('en-IN') : '-'}</td>
                  <td className="px-4 py-3">{o.items?.length || 0}</td>
                  <td className="px-4 py-3 font-semibold">{formatINR(o.total)}</td>
                  <td className="px-4 py-3"><span className="px-2 py-1 rounded-full text-xs font-semibold" style={{background:statusColor(o.status),color:'#111'}}>{o.status}</span></td>
                  <td className="px-4 py-3"><span className="px-2 py-1 rounded-full text-xs" style={{background:'#e8f5e9',color:'#2e7d32'}}>{o.paymentStatus || 'PENDING'}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
