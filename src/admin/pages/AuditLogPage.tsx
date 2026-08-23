import { useEffect, useState } from 'react';
import { collection, getDocs, orderBy, query, limit } from 'firebase/firestore';
import { db } from '../../lib/firebase';

interface Log { id: string; user: string; action: string; entity: string; details: string; timestamp: { seconds: number } | null; }

export function AuditLogPage() {
  const [logs, setLogs] = useState<Log[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDocs(query(collection(db,'auditLog'), limit(100))).then(snap => {
      setLogs(snap.docs.map(d=>({id:d.id,...d.data()} as Log)));
      setLoading(false);
    }).catch(()=>setLoading(false));
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6" style={{fontFamily:'Syne,sans-serif',color:'#111111'}}>Audit Log</h1>
      {loading ? <p>Loading...</p> : logs.length === 0 ? (
        <div className="rounded-xl p-8 text-center" style={{background:'#fff'}}><p style={{color:'#666'}}>No audit logs yet. Admin actions will be recorded here.</p></div>
      ) : (
        <div className="rounded-xl overflow-hidden shadow-sm" style={{background:'#fff'}}>
          <table className="w-full text-sm">
            <thead style={{background:'#F3F1EC'}}>
              <tr>{['Timestamp','User','Action','Entity','Details'].map(h=>(
                <th key={h} className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-widest" style={{color:'#111'}}>{h}</th>
              ))}</tr>
            </thead>
            <tbody>
              {logs.map(l=>(
                <tr key={l.id} className="border-t" style={{borderColor:'#F3F1EC'}}>
                  <td className="px-4 py-3 text-xs" style={{color:'#888'}}>{l.timestamp?new Date(l.timestamp.seconds*1000).toLocaleString('en-IN'):'-'}</td>
                  <td className="px-4 py-3">{l.user}</td>
                  <td className="px-4 py-3"><span className="px-2 py-1 rounded text-xs font-semibold" style={{background:'#F3F1EC'}}>{l.action}</span></td>
                  <td className="px-4 py-3" style={{color:'#666'}}>{l.entity}</td>
                  <td className="px-4 py-3 text-xs" style={{color:'#666'}}>{l.details}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
