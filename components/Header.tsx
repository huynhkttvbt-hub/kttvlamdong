
import React from 'react';
import { Database, CheckCircle, AlertCircle } from 'lucide-react';

interface HeaderProps {
  activeMenuName: string;
  activeSubMenuName: string;
  isConfigured: boolean;
}

const Header: React.FC<HeaderProps> = ({ activeMenuName, activeSubMenuName, isConfigured }) => {
  return (
    <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between sticky top-0 z-10 shadow-sm">
      <div className="flex flex-col">
        <h2 className="text-lg font-black text-slate-800 uppercase tracking-tight flex items-center gap-2">
          {activeMenuName} 
          <span className="text-blue-500">/</span> 
          <span className="text-slate-400 font-bold">{activeSubMenuName}</span>
        </h2>
        <div className="flex items-center gap-2 text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">
          <span>Hệ thống quản lý số liệu Lâm Đồng</span>
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        {/* Connection Status Badge */}
        <div className={`hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full border ${
          isConfigured ? 'bg-emerald-50 border-emerald-100 text-emerald-600' : 'bg-slate-50 border-slate-200 text-slate-400'
        }`}>
          {isConfigured ? <CheckCircle size={14} /> : <AlertCircle size={14} />}
          <span className="text-[10px] font-black uppercase tracking-wider">
            {isConfigured ? 'DB Connected' : 'DB Not Linked'}
          </span>
        </div>

        <div className="w-px h-8 bg-slate-200 mx-1 hidden sm:block"></div>

        <div className="flex items-center gap-3">
          <div className="flex flex-col items-end hidden md:block">
            <span className="text-xs font-black text-slate-700">Admin Lâm Đồng</span>
            <span className="text-[9px] font-bold text-slate-400 uppercase">Quản trị viên</span>
          </div>
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white font-black text-sm shadow-lg shadow-blue-200 border-2 border-white">
            LD
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
