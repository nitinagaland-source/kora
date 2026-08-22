import { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../lib/firebase';
import { LayoutDashboard, Package, Tag, Layers, ShoppingBag, Users, Home, Star, BarChart2, Megaphone, Image, Settings, ClipboardList, LogOut, Menu, X } from 'lucide-react';

const navItems = [
  { to: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/admin/products', icon: Package, label: 'Products' },
  { to: '/admin/categories', icon: Tag, label: 'Categories' },
  { to: '/admin/collections', icon: Layers, label: 'Collections' },
  { to: '/admin/orders', icon: ShoppingBag, label: 'Orders' },
  { to: '/admin/customers', icon: Users, label: 'Customers' },
  { to: '/admin/homepage', icon: Home, label: 'Homepage Studio' },
  { to: '/admin/reviews', icon: Star, label: 'Reviews' },
  { to: '/admin/analytics', icon: BarChart2, label: 'Analytics' },
  { to: '/admin/marketing', icon: Megaphone, label: 'Marketing' },
  { to: '/admin/media', icon: Image, label: 'Media Library' },
  { to: '/admin/settings', icon: Settings, label: 'Settings' },
  { to: '/admin/audit', icon: ClipboardList, label: 'Audit Log' },
];

export function AdminLayout() {
  const [open, setOpen] = useState(true);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/admin/login');
  };

  const linkClass = (isActive: boolean) =>
    'flex items-center gap-3 px-4 py-3 text-sm transition-colors ' +
    (isActive ? 'bg-white/10 text-white font-semibold' : 'text-gray-400 hover:text-white hover:bg-white/5');

  return (
    <div className="flex min-h-screen" style={{background:'#F3F1EC'}}>
      <aside style={{width: open ? 220 : 60, background:'#111111', transition:'width 0.2s', minHeight:'100vh', flexShrink:0}} className="flex flex-col">
        <div className="flex items-center justify-between px-4 py-5">
          {open && <span className="text-white font-bold text-lg tracking-widest" style={{fontFamily:'Syne,sans-serif'}}>KORA</span>}
          <button onClick={() => setOpen(!open)} className="text-white ml-auto">{open ? <X size={18}/> : <Menu size={18}/>}</button>
        </div>
        <nav className="flex-1 overflow-y-auto">
          {navItems.map(({to, icon: Icon, label}) => (
            <NavLink key={to} to={to} className={({isActive}) => linkClass(isActive)}>
              <Icon size={16} className="flex-shrink-0"/>
              {open && <span className="truncate">{label}</span>}
            </NavLink>
          ))}
        </nav>
        <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-4 text-gray-400 hover:text-white">
          <LogOut size={16}/>
          {open && <span className="text-sm">Logout</span>}
        </button>
      </aside>
      <main className="flex-1 overflow-auto">
        <div className="px-8 py-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
