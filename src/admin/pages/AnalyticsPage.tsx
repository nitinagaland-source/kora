import { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { formatINR } from '../../lib/formatINR';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

export function AnalyticsPage() {
  const [orders, setOrders] = useState<{total:number; createdAt:{seconds:number}|null; status:string}[]>([]);
  const [products, setProducts] = useState<{name:string; category:string}[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      getDocs(collection(db,'orders')),
      getDocs(collection(db,'products')),
    ]).then(([oSnap, pSnap]) => {
      setOrders(oSnap.docs.map(d=>d.data() as {total:number;createdAt:{seconds:number}|null;status:string}));
      setProducts(pSnap.docs.map(d=>d.data() as {name:string;category:string}));
      setLoading(false);
    });
  }, []);

  const totalRevenue = orders.reduce((s,o)=>s+o.total,0);
  const avgOrder = orders.length ? Math.round(totalRevenue/orders.length) : 0;

  const catCounts: Record<string,number> = {};
  products.forEach(p => { catCounts[p.category] = (catCounts[p.category]||0)+1; });
  const catData = Object.entries(catCounts).map(([name,count])=>({name,count}));

  const kpis = [
    { label:'Total Revenue', value: formatINR(totalRevenue) },
    { label:'Total Orders', value: orders.length.toString() },
    { label:'Avg Order Value', value: formatINR(avgOrder) },
    { label:'Products', value: products.length.toString() },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6" style={{fontFamily:'Syne,sans-serif',color:'#111111'}}>Analytics</h1>
      {loading ? <p>Loading...</p> : (
        <>
          <div className="grid gap-4 mb-6" style={{gridTemplateColumns:'repeat(4,1fr)'}}>
            {kpis.map(k=>(
              <div key={k.label} className="rounded-xl p-5 shadow-sm" style={{background:'#fff'}}>
                <p className="text-xs uppercase tracking-widest font-semibold mb-1" style={{color:'#888'}}>{k.label}</p>
                <p className="text-2xl font-bold" style={{fontFamily:'Syne,sans-serif',color:'#111'}}>{k.value}</p>
              </div>
            ))}
          </div>
          <div className="rounded-xl p-6 shadow-sm mb-4" style={{background:'#fff'}}>
            <p className="font-semibold mb-4" style={{color:'#111'}}>Products by Category</p>
            {catData.length > 0 ? (
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={catData}>
                  <XAxis dataKey="name" tick={{fontSize:11}} />
                  <YAxis tick={{fontSize:11}} />
                  <Tooltip />
                  <Bar dataKey="count" fill="#111111" radius={[4,4,0,0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : <p style={{color:'#666'}}>No data yet.</p>}
          </div>
        </>
      )}
    </div>
  );
}
