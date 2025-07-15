'use client';

import { useLang } from '@/app/ClientLayout';

export default function TestFontsPage() {
  const { lang } = useLang();

  const testText = lang === 'ar' 
    ? 'مرحباً بك في Cyber Hub - هذا نص تجريبي لاختبار الخطوط المختلفة'
    : 'Welcome to Cyber Hub - This is a test text for different fonts';

  return (
    <div className="min-h-screen gradient-bg p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">
          {lang === 'ar' ? 'اختبار الخطوط' : 'Font Testing'}
        </h1>
        
        <div className="space-y-8">
          {/* Default Font */}
          <div className="card p-6">
            <h2 className="text-xl font-semibold mb-4">Default Font</h2>
            <p className="text-lg">{testText}</p>
          </div>

          {/* Cairo Font */}
          <div className="card p-6 font-cairo">
            <h2 className="text-xl font-semibold mb-4">Cairo Font</h2>
            <p className="text-lg">{testText}</p>
          </div>

          {/* Tajawal Font */}
          <div className="card p-6 font-tajawal">
            <h2 className="text-xl font-semibold mb-4">Tajawal Font</h2>
            <p className="text-lg">{testText}</p>
          </div>

          {/* Noto Sans Arabic Font */}
          <div className="card p-6 font-noto">
            <h2 className="text-xl font-semibold mb-4">Noto Sans Arabic Font</h2>
            <p className="text-lg">{testText}</p>
          </div>

          {/* Amiri Font */}
          <div className="card p-6 font-amiri">
            <h2 className="text-xl font-semibold mb-4">Amiri Font</h2>
            <p className="text-lg">{testText}</p>
          </div>

          {/* Frutiger LT Arabic Font */}
          <div className="card p-6 font-frutiger">
            <h2 className="text-xl font-semibold mb-4">Frutiger LT Arabic Font</h2>
            <p className="text-lg">{testText}</p>
          </div>

          {/* Icomoon Font */}
          <div className="card p-6 font-icomoon">
            <h2 className="text-xl font-semibold mb-4">Icomoon Font</h2>
            <p className="text-lg">{testText}</p>
          </div>
        </div>
      </div>
    </div>
  );
} 