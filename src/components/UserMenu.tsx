import { useRef, useState, useEffect } from 'react';
import { UserIcon, ArrowRightOnRectangleIcon } from '@heroicons/react/24/outline';

interface UserMenuProps {
  username: string;
  lang: 'en' | 'ar';
}

export default function UserMenu({ username, lang }: UserMenuProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [open]);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className={`flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-slate-700 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-slate-900 ${open ? 'ring-2 ring-green-500' : ''}`}
        aria-label={lang === 'ar' ? 'قائمة المستخدم' : 'User menu'}
        aria-expanded={open}
      >
        <UserIcon className="w-5 h-5" />
        <span className="font-medium truncate max-w-[120px]">{username}</span>
        <svg className={`w-4 h-4 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} viewBox="0 0 20 20" fill="none"><path d="M6 8l4 4 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
      </button>
      {open && (
        <div className={`absolute top-full ${lang === 'ar' ? 'left-0' : 'right-0'} mt-2 w-40 card-glass p-2 border border-slate-700 rounded-xl shadow-2xl z-50`}> 
          <button
            className="flex items-center gap-3 w-full px-4 py-2 rounded-lg text-sm font-medium text-red-400 hover:bg-red-500/10 transition-all duration-200"
            onClick={() => {/* ضع هنا منطق تسجيل الخروج */}}
          >
            <ArrowRightOnRectangleIcon className="w-5 h-5" />
            <span>{lang === 'ar' ? 'تسجيل الخروج' : 'Logout'}</span>
          </button>
        </div>
      )}
      {/* Backdrop لإغلاق القائمة عند الضغط خارجها */}
      {open && <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />}
    </div>
  );
} 