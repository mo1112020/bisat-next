'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard, Package, FileText, ShoppingBag,
  Star, MessageSquare, LogOut, Menu, X, Images, Globe,
  Tag, Settings2, Sliders,
} from 'lucide-react';

const NAV = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/products', label: 'Products', icon: Package },
  { href: '/admin/categories', label: 'Categories', icon: Tag },
  { href: '/admin/store-config', label: 'Store Config', icon: Settings2 },
  { href: '/admin/blog', label: 'Blog Posts', icon: FileText },
  { href: '/admin/orders', label: 'Orders', icon: ShoppingBag },
  { href: '/admin/reviews', label: 'Reviews', icon: Star },
  { href: '/admin/testimonials', label: 'Testimonials', icon: MessageSquare },
  { href: '/admin/cdn', label: 'CDN Images', icon: Images },
  { href: '/admin/site-images', label: 'Site Images', icon: Globe },
  { href: '/admin/settings', label: 'Site Settings', icon: Sliders },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (pathname === '/admin/login') return <>{children}</>;

  const handleLogout = async () => {
    await fetch('/api/admin/logout', { method: 'POST' });
    router.push('/admin/login');
  };

  const Sidebar = () => (
    <aside className="w-64 bg-gray-950 border-r border-white/5 flex flex-col h-full">
      {/* Logo */}
      <div className="px-6 py-6 border-b border-white/5">
        <p className="text-yellow-500 text-[9px] uppercase tracking-[0.4em] font-bold mb-1">Admin Panel</p>
        <h1 className="text-2xl font-serif text-white">Bisāṭ</h1>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {NAV.map(({ href, label, icon: Icon }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                active
                  ? 'bg-yellow-500/10 text-yellow-500'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Icon size={17} />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="px-3 py-4 border-t border-white/5">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-400 hover:text-red-400 hover:bg-red-400/5 transition-all w-full"
        >
          <LogOut size={17} />
          Logout
        </button>
      </div>
    </aside>
  );

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Desktop sidebar */}
      <div className="hidden md:flex flex-col flex-shrink-0">
        <Sidebar />
      </div>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black/60" onClick={() => setSidebarOpen(false)} />
          <div className="relative flex flex-col h-full w-64">
            <Sidebar />
          </div>
        </div>
      )}

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between flex-shrink-0">
          <button
            onClick={() => setSidebarOpen(true)}
            className="md:hidden text-gray-500 hover:text-gray-700"
          >
            <Menu size={20} />
          </button>
          <p className="text-sm text-gray-400 hidden md:block">
            Bisāṭ Admin — <span className="text-gray-600 font-medium">adminbaba</span>
          </p>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-sm text-gray-400 hover:text-red-500 transition-colors"
          >
            <LogOut size={15} />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
