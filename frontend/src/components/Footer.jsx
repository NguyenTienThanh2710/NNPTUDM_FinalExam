import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="w-full mt-20 bg-slate-50 dark:bg-slate-950">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-12 px-8 py-16 max-w-7xl mx-auto">
        <div className="space-y-6">
          <h4 className="text-lg font-bold text-slate-900 dark:text-slate-100 font-headline">Lumina Mobile</h4>
          <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">Precision-engineered digital storefront for the next generation of mobile technology.</p>
        </div>
        <div>
          <h5 className="font-bold mb-6 text-on-surface uppercase text-xs tracking-widest">Shop</h5>
          <ul className="space-y-4">
            <li><Link className="text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors text-sm" to="/products">iPhone</Link></li>
            <li><Link className="text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors text-sm" to="/products">Samsung</Link></li>
            <li><Link className="text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors text-sm" to="/products">Oppo</Link></li>
            <li><Link className="text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors text-sm" to="/products">Pixel</Link></li>
          </ul>
        </div>
        <div>
          <h5 className="font-bold mb-6 text-on-surface uppercase text-xs tracking-widest">Company</h5>
          <ul className="space-y-4">
            <li><Link className="text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors text-sm" to="#">Warranty</Link></li>
            <li><Link className="text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors text-sm" to="#">Privacy Policy</Link></li>
            <li><Link className="text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors text-sm" to="#">Contact Us</Link></li>
            <li><Link className="text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors text-sm" to="#">Newsletter</Link></li>
          </ul>
        </div>
        <div>
          <h5 className="font-bold mb-6 text-on-surface uppercase text-xs tracking-widest">Social</h5>
          <div className="flex gap-4">
            <a className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-slate-600 hover:bg-primary hover:text-white transition-all" href="#">
              <span className="material-symbols-outlined text-lg">language</span>
            </a>
            <a className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-slate-600 hover:bg-primary hover:text-white transition-all" href="#">
              <span className="material-symbols-outlined text-lg">share</span>
            </a>
          </div>
        </div>
      </div>
      <div className="border-t border-slate-200 dark:border-slate-800 py-8 px-8 text-center">
        <p className="text-slate-500 dark:text-slate-400 text-sm">© 2026 Lumina Mobile. Precision Luminescence.</p>
      </div>
    </footer>
  );
}
