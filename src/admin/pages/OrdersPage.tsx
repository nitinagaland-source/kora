import { useEffect, useState } from 'react';
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';
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
  items: { name: string; qty: number; price?: number; color?: string; size?: string }[];
}

const STATUSES = ['PROCESSING', 'PACKED', 'SHIPPED', 'DELIVERED', 'RETURNED'];

const STATUS_COLORS: Record<string, { bg: string; text: string }> = {
  PROCESSING: { bg: '#fff3e0', text: '#e65100' },
  PACKED:     { bg: '#e3f2fd', text: '#1565c0' },
  SHIPPED:    { bg: '#ede7f6', text: '#4527a0' },
  DELIVERED:  { bg: '#c8e6c9', text: '#1b5e20' },
  RETURNED:   { bg: '#fce4ec', text: '#880e4f' },
};

export function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<string | null>(null);

  const load = () => {
    setLoading(true);
    getDocs(collection(db, 'orders'))
      .then(snap => {
        const list = snap.docs.map(d => ({ id: d.id, ...d.data() } as Order));
        list.sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
        setOrders(list);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    setUpdating(orderId);
    try {
      await updateDoc(doc(db, 'orders', orderId), { status: newStatus });
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
    } catch (err) {
      console.error('Status update failed:', err);
    }
    setUpdating(null);
  };

  const handlePaymentStatusChange = async (orderId: string, newStatus: string) => {
    setUpdating(orderId + '_pay');
    try {
      await updateDoc(doc(db, 'orders', orderId), { paymentStatus: newStatus });
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, paymentStatus: newStatus } : o));
    } catch (err) {
      console.error('Payment status update failed:', err);
    }
    setUpdating(null);
  };

  const sc = (s: string) => STATUS_COLORS[s] || { bg: '#f5f5f5', text: '#333' };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold" style={{ fontFamily: 'Syne,sans-serif', color: '#111111' }}>
          Orders ({orders.length})
        </h1>
        <button onClick={load} className="text-xs px-3 py-1.5 rounded-lg border font-semibold" style={{ borderColor: '#C8B89A', color: '#111' }}>
          Refresh
        </button>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : orders.length === 0 ? (
        <div className="rounded-xl p-8 text-center" style={{ background: '#fff' }}>
          <p className="font-semibold mb-1" style={{ color: '#111' }}>No orders yet</p>
          <p className="text-sm" style={{ color: '#666' }}>Orders placed on the storefront will appear here.</p>
        </div>
      ) : (
        <div className="rounded-xl overflow-hidden shadow-sm" style={{ background: '#fff' }}>
          <table className="w-full text-sm">
            <thead style={{ background: '#F3F1EC' }}>
              <tr>
                {['Order ID', 'Customer', 'Date', 'Items', 'Total', 'Status', 'Payment', 'Details'].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-widest" style={{ color: '#111' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {orders.map(o => (
                <>
                  <tr key={o.id} className="border-t" style={{ borderColor: '#F3F1EC' }}>
                    <td className="px-4 py-3 font-mono text-xs font-bold">{o.orderId || o.id.slice(0, 8)}</td>
                    <td className="px-4 py-3 font-semibold">{o.customerName}</td>
                    <td className="px-4 py-3 text-xs" style={{ color: '#666' }}>
                      {o.createdAt ? new Date(o.createdAt.seconds * 1000).toLocaleDateString('en-IN') : '-'}
                    </td>
                    <td className="px-4 py-3">{o.items?.length || 0}</td>
                    <td className="px-4 py-3 font-semibold">{formatINR(o.total)}</td>

                    {/* Status Dropdown */}
                    <td className="px-4 py-3">
                      <select
                        value={o.status}
                        disabled={updating === o.id}
                        onChange={e => handleStatusChange(o.id, e.target.value)}
                        className="text-xs font-semibold px-2 py-1 rounded-full border-0 outline-none cursor-pointer"
                        style={{
                          background: sc(o.status).bg,
                          color: sc(o.status).text,
                          opacity: updating === o.id ? 0.5 : 1,
                        }}
                      >
                        {STATUSES.map(s => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </td>

                    {/* Payment Status Dropdown */}
                    <td className="px-4 py-3">
                      <select
                        value={o.paymentStatus || 'PENDING'}
                        disabled={updating === o.id + '_pay'}
                        onChange={e => handlePaymentStatusChange(o.id, e.target.value)}
                        className="text-xs px-2 py-1 rounded-full border-0 outline-none cursor-pointer"
                        style={{
                          background: o.paymentStatus === 'PAID' ? '#c8e6c9' : '#fff3e0',
                          color: o.paymentStatus === 'PAID' ? '#1b5e20' : '#e65100',
                          opacity: updating === o.id + '_pay' ? 0.5 : 1,
                        }}
                      >
                        <option value="PENDING">PENDING</option>
                        <option value="PAID">PAID</option>
                        <option value="FAILED">FAILED</option>
                        <option value="REFUNDED">REFUNDED</option>
                      </select>
                    </td>

                    {/* Expand toggle */}
                    <td className="px-4 py-3">
                      <button
                        onClick={() => setExpanded(expanded === o.id ? null : o.id)}
                        className="text-xs underline"
                        style={{ color: '#666' }}
                      >
                        {expanded === o.id ? 'Hide' : 'View'}
                      </button>
                    </td>
                  </tr>

                  {/* Expanded order items row */}
                  {expanded === o.id && (
                    <tr key={o.id + '_expanded'} style={{ background: '#fafafa' }}>
                      <td colSpan={8} className="px-6 py-4">
                        <p className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: '#888' }}>Order Items</p>
                        <div className="space-y-1">
                          {o.items?.map((item, idx) => (
                            <div key={idx} className="flex items-center gap-4 text-xs" style={{ color: '#333' }}>
                              <span className="font-semibold">{item.name}</span>
                              {item.color && <span style={{ color: '#888' }}>Color: {item.color}</span>}
                              {item.size && <span style={{ color: '#888' }}>Size: {item.size}</span>}
                              <span style={{ color: '#888' }}>Qty: {item.qty}</span>
                              {item.price && <span className="font-mono">{formatINR(item.price * item.qty)}</span>}
                            </div>
                          ))}
                        </div>
                        {o.email && (
                          <p className="text-xs mt-2" style={{ color: '#888' }}>Email: {o.email}</p>
                        )}
                      </td>
                    </tr>
                  )}
                </>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
