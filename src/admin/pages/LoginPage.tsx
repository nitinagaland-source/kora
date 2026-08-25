import { useState } from 'react';
import { signInWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../../lib/firebase';
import { useNavigate } from 'react-router-dom';

export function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<'login' | 'reset'>('login');
  const [resetSent, setResetSent] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/admin/dashboard');
    } catch {
      setError('Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) { setError('Enter your email address first.'); return; }
    setError('');
    setResetLoading(true);
    try {
      await sendPasswordResetEmail(auth, email);
      setResetSent(true);
    } catch {
      setError('Could not send reset email. Check the address and try again.');
    } finally {
      setResetLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center" style={{background:'#F3F1EC'}}>
      <div className="w-full max-w-md p-8 rounded-2xl shadow-lg" style={{background:'#fff'}}>
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold tracking-widest" style={{fontFamily:'Syne,sans-serif',color:'#111111'}}>KORA</h1>
          <p className="text-sm mt-1" style={{color:'#666'}}>Admin Dashboard</p>
        </div>

        {mode === 'login' ? (
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-widest mb-1" style={{color:'#111111'}}>Email</label>
              <input type="email" value={email} onChange={e=>setEmail(e.target.value)} required className="w-full border rounded-lg px-4 py-3 text-sm outline-none" style={{borderColor:'#C8B89A',background:'#F3F1EC'}} />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-widest mb-1" style={{color:'#111111'}}>Password</label>
              <input type="password" value={password} onChange={e=>setPassword(e.target.value)} required className="w-full border rounded-lg px-4 py-3 text-sm outline-none" style={{borderColor:'#C8B89A',background:'#F3F1EC'}} />
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <button type="submit" disabled={loading} className="w-full py-3 rounded-lg font-bold text-sm tracking-widest uppercase" style={{background:'#111111',color:'#F3F1EC'}}>
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
            <div className="text-center pt-1">
              <button type="button" onClick={() => { setMode('reset'); setError(''); setResetSent(false); }} className="text-xs underline" style={{color:'#888'}}>
                Forgot password?
              </button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleReset} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-widest mb-1" style={{color:'#111111'}}>Email</label>
              <input type="email" value={email} onChange={e=>setEmail(e.target.value)} required className="w-full border rounded-lg px-4 py-3 text-sm outline-none" style={{borderColor:'#C8B89A',background:'#F3F1EC'}} placeholder="Enter your admin email" />
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            {resetSent ? (
              <div className="rounded-lg p-4 text-sm text-center" style={{background:'#e8f5e9',color:'#2e7d32'}}>
                ✓ Reset link sent! Check your inbox.
              </div>
            ) : (
              <button type="submit" disabled={resetLoading} className="w-full py-3 rounded-lg font-bold text-sm tracking-widest uppercase" style={{background:'#111111',color:'#F3F1EC'}}>
                {resetLoading ? 'Sending...' : 'Send Reset Link'}
              </button>
            )}
            <div className="text-center pt-1">
              <button type="button" onClick={() => { setMode('login'); setError(''); }} className="text-xs underline" style={{color:'#888'}}>
                Back to Sign In
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
