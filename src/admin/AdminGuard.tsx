import { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';
import { Navigate } from 'react-router-dom';

interface Props { children: React.ReactNode; }

export function AdminGuard({ children }: Props) {
  const [status, setStatus] = useState<'loading'|'ok'|'denied'|'unauth'>('loading');

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (!user) { setStatus('unauth'); return; }
      try {
        const snap = await getDoc(doc(db, 'users', user.uid));
        const role = snap.data()?.role;
        const allowed = ['superadmin','admin','editor','fulfillment'];
        setStatus(allowed.includes(role) ? 'ok' : 'denied');
      } catch { setStatus('denied'); }
    });
    return unsub;
  }, []);

  if (status === 'loading') return <div className="flex items-center justify-center min-h-screen" style={{background:'#F3F1EC'}}><p style={{fontFamily:'Syne,sans-serif'}}>Loading...</p></div>;
  if (status === 'unauth') return <Navigate to="/admin/login" replace />;
  if (status === 'denied') return <div className="flex items-center justify-center min-h-screen" style={{background:'#F3F1EC'}}><p className="text-red-500">Access Denied</p></div>;
  return <>{children}</>;
}
