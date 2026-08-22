import { formatINR } from '../../lib/formatINR';

export function DashboardPage() {
  const kpis = [
    { label: 'Total Revenue', value: formatINR(0), sub: 'All time' },
    { label: 'Total Orders', value: '0', sub: 'All time' },
    { label: 'Products', value: '12', sub: 'In catalog' },
    { label: 'Customers', value: '0', sub: 'Registered' },
  ];
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6" style={{fontFamily:'Syne,sans-serif',color:'#111111'}}>Dashboard</h1>
      <div className="grid grid-cols-2 gap-4 mb-8" style={{gridTemplateColumns:'repeat(4,1fr)'}}>
        {kpis.map(k => (
          <div key={k.label} className="rounded-xl p-6 shadow-sm" style={{background:'#fff'}}>
            <p className="text-xs uppercase tracking-widest font-semibold mb-1" style={{color:'#888'}}>{k.label}</p>
            <p className="text-2xl font-bold" style={{fontFamily:'Syne,sans-serif',color:'#111111'}}>{k.value}</p>
            <p className="text-xs mt-1" style={{color:'#aaa'}}>{k.sub}</p>
          </div>
        ))}
      </div>
      <div className="rounded-xl p-6 shadow-sm" style={{background:'#fff'}}>
        <p className="text-sm font-semibold mb-2" style={{color:'#111111'}}>Welcome to KORA Admin</p>
        <p className="text-sm" style={{color:'#666'}}>Use the sidebar to manage products, orders, customers, and more.</p>
      </div>
    </div>
  );
}
