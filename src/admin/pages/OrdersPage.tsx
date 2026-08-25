import { useEffect, useState } from 'react';
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { formatINR } from '../../lib/formatINR';

interface Order {
  id: string;
  orderId: string;
  customerName: string;
  email: string;
  phone: string;
  city: string;
  streetAddress: string;
  zipCode: string;
  paymentMethod: string;
  total: number;
  status: string;
  paymentStatus: string;
  trackingNumber: string;
  createdAt: { seconds: number } | null;
  items: { name: string; qty: number; price?: number; color?: string; size?: string }[];
}

const STATUSES = ['PROCESSING', 'PACKED', 'SHIPPED', 'DELIVERED', 'RETURNED'];

const SC: Record<string, { bg: string; text: string }> = {
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
  const [awbEdit, setAwbEdit] = useState<Record<string, string>>({});
  const [awbSaving, setAwbSaving] = useState<string | null>(null);

  const load = () => {
    setLoading(true);
    getDocs(collection(db, 'orders'))
      .then(snap => {
        const list = snap.docs.map(d => ({ id: d.id, ...d.data() } as Order));
        list.sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
        setOrders(list);
        // Init AWB edit state
        const awbMap: Record<string, string> = {};
        list.forEach(o => { awbMap[o.id] = o.trackingNumber || ''; });
        setAwbEdit(awbMap);
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
    } catch (err) { console.error(err); }
    setUpdating(null);
  };

  const handlePaymentStatusChange = async (orderId: string, newStatus: string) => {
    setUpdating(orderId + '_pay');
    try {
      await updateDoc(doc(db, 'orders', orderId), { paymentStatus: newStatus });
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, paymentStatus: newStatus } : o));
    } catch (err) { console.error(err); }
    setUpdating(null);
  };

  const handleSaveAwb = async (orderId: string) => {
    const newAwb = awbEdit[orderId] || '';
    setAwbSaving(orderId);
    try {
      await updateDoc(doc(db, 'orders', orderId), { trackingNumber: newAwb });
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, trackingNumber: newAwb } : o));
    } catch (err) { console.error(err); }
    setAwbSaving(null);
  };

  const sc = (s: string) => SC[s] || { bg: '#f5f5f5', text: '#333' };

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

      {loading ? <p>Loading...</p> : orders.length === 0 ? (
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
                    <td className="px-4 py-3">
                      <p className="font-semibold">{o.customerName}</p>
                      {o.phone && <p className="text-xs" style={{ color: '#888' }}>{o.phone}</p>}
                    </td>
                    <td className="px-4 py-3 text-xs" style={{ color: '#666' }}>
                      {o.createdAt ? new Date(o.createdAt.seconds * 1000).toLocaleDateString('en-IN') : '-'}
                    </td>
                    <td className="px-4 py-3">{o.items?.length || 0}</td>
                    <td className="px-4 py-3 font-semibold">{formatINR(o.total)}</td>
                    <td className="px-4 py-3">
                      <select
                        value={o.status}
                        disabled={updating === o.id}
                        onChange={e => handleStatusChange(o.id, e.target.value)}
                        className="text-xs font-semibold px-2 py-1 rounded-full border-0 outline-none cursor-pointer"
                        style={{ background: sc(o.status).bg, color: sc(o.status).text, opacity: updating === o.id ? 0.5 : 1 }}
                      >
                        {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </td>
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
                    <td className="px-4 py-3">
                      <button onClick={() => setExpanded(expanded === o.id ? null : o.id)} className="text-xs underline" style={{ color: '#666' }}>
                        {expanded === o.id ? 'Hide' : 'View'}
                      </button>
                    </td>
                  </tr>

                  {expanded === o.id && (
                    <tr key={o.id + '_exp'} style={{ background: '#fafafa' }}>
                      <td colSpan={8} className="px-6 py-5">
                        <div className="grid grid-cols-2 gap-8">

                          {/* Customer Details */}
                          <div>
                            <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: '#888' }}>Customer Details</p>
                            <div className="space-y-1.5 text-xs" style={{ color: '#333' }}>
                              <p><span className="font-semibold" style={{color:'#111'}}>Name:</span> {o.customerName || '—'}</p>
                              <p><span className="font-semibold" style={{color:'#111'}}>Email:</span> {o.email || <span style={{color:'#aaa'}}>Not provided</span>}</p>
                              <p><span className="font-semibold" style={{color:'#111'}}>Phone:</span> {o.phone || <span style={{color:'#aaa'}}>Not provided</span>}</p>
                              <p><span className="font-semibold" style={{color:'#111'}}>Address:</span> {o.streetAddress || <span style={{color:'#aaa'}}>Not provided</span>}</p>
                              <p><span className="font-semibold" style={{color:'#111'}}>City / ZIP:</span> {o.city ? `${o.city}${o.zipCode ? ' — ' + o.zipCode : ''}` : <span style={{color:'#aaa'}}>Not provided</span>}</p>
                              <p><span className="font-semibold" style={{color:'#111'}}>Payment Method:</span> {o.paymentMethod ? o.paymentMethod.toUpperCase() : <span style={{color:'#aaa'}}>Not provided</span>}</p>
                            </div>

                            {/* AWB / Tracking Number — manual entry */}
                            <div className="mt-4">
                              <p className="text-xs font-semibold uppercase tracking-widest mb-1.5" style={{ color: '#888' }}>AWB / Tracking Number</p>
                              <div className="flex gap-2 items-center">
                                <input
                                  type="text"
                                  value={awbEdit[o.id] || ''}
                                  onChange={e => setAwbEdit(prev => ({ ...prev, [o.id]: e.target.value }))}
                                  placeholder="Enter AWB number..."
                                  className="border rounded-lg px-3 py-1.5 text-xs font-mono flex-1 outline-none"
                                  style={{ borderColor: '#C8B89A', background: '#F3F1EC' }}
                                />
                                <button
                                  onClick={() => handleSaveAwb(o.id)}
                                  disabled={awbSaving === o.id}
                                  className="px-3 py-1.5 rounded-lg text-xs font-semibold"
                                  style={{ background: '#111111', color: '#F3F1EC', opacity: awbSaving === o.id ? 0.5 : 1 }}
                                >
                                  {awbSaving === o.id ? 'Saving...' : 'Save'}
                                </button>
                              </div>
                            </div>
                          </div>

                          {/* Order Items */}
                          <div>
                            <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: '#888' }}>Order Items</p>
                            <div className="space-y-2">
                              {o.items?.map((item, idx) => (
                                <div key={idx} className="text-xs p-2 rounded-lg" style={{ background: '#F3F1EC' }}>
                                  <p className="font-semibold" style={{ color: '#111' }}>{item.name}</p>
                                  <div className="flex gap-3 mt-0.5 flex-wrap" style={{ color: '#666' }}>
                                    {item.color && <span>Color: {item.color}</span>}
                                    {item.size && <span>Size: {item.size}</span>}
                                    <span>Qty: {item.qty}</span>
                                    {item.price && <span className="font-mono font-semibold" style={{color:'#111'}}>{formatINR(item.price * item.qty)}</span>}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>

                        </div>
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
