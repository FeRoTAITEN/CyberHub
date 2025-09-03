'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Navigation from '@/components/Navigation';
import {
  ShieldCheckIcon,
  EnvelopeIcon,
  DocumentTextIcon,
  DevicePhoneMobileIcon,
  PlayIcon,
  CheckCircleIcon,
  ArrowLeftIcon,
  TrophyIcon,
  MagnifyingGlassIcon,
  PauseIcon,
  EyeIcon
} from '@heroicons/react/24/outline';
import { useLang } from '../../ClientLayout';
import Link from 'next/link';

// بيانات الحالات
const cases = [
  {
    id: 1,
    title: { en: 'Suspicious Email Analysis', ar: 'تحليل البريد الإلكتروني المشبوه' },
    description: { en: 'Investigate a suspicious email for phishing indicators', ar: 'تحقق من بريد إلكتروني مشبوه للبحث عن مؤشرات التصيد الاحتيالي' },
    icon: EnvelopeIcon,
    color: 'blue',
    evidence: [
      {
        id: 'sender',
        label: { en: 'Sender Address', ar: 'عنوان المرسل' },
        value: 'support@bank-secure.com',
        suspicious: true,
        reason: { en: 'Slight variation from legitimate bank domain', ar: 'تغيير بسيط عن النطاق الرسمي للبنك' }
      },
      {
        id: 'subject',
        label: { en: 'Subject Line', ar: 'سطر الموضوع' },
        value: 'URGENT: Your account has been suspended!',
        suspicious: true,
        reason: { en: 'Uses urgent language to create panic', ar: 'يستخدم لغة عاجلة لخلق الذعر' }
      },
      {
        id: 'content',
        label: { en: 'Email Content', ar: 'محتوى البريد' },
        value: 'Click here immediately to verify your account or it will be deleted.',
        suspicious: true,
        reason: { en: 'Demands immediate action and threatens account deletion', ar: 'يطالب بإجراء فوري ويهدد بحذف الحساب' }
      },
      {
        id: 'link',
        label: { en: 'Suspicious Link', ar: 'رابط مشبوه' },
        value: 'http://bank-secure-verify.com/login',
        suspicious: true,
        reason: { en: 'Fake domain that mimics legitimate bank', ar: 'نطاق مزيف يحاكي البنك الرسمي' }
      }
    ],
    clues: [
      { en: 'Check the sender\'s email address carefully', ar: 'تحقق من عنوان البريد الإلكتروني للمرسل بعناية' },
      { en: 'Look for urgent or threatening language', ar: 'ابحث عن لغة عاجلة أو تهديدية' },
      { en: 'Examine the link destination', ar: 'افحص وجهة الرابط' },
      { en: 'Verify with the official source', ar: 'تحقق من المصدر الرسمي' }
    ]
  },
  {
    id: 2,
    title: { en: 'Malicious File Investigation', ar: 'تحقيق في ملف خبيث' },
    description: { en: 'Analyze a suspicious file for potential malware', ar: 'حلل ملف مشبوه للبحث عن برمجيات خبيثة محتملة' },
    icon: DocumentTextIcon,
    color: 'red',
    evidence: [
      {
        id: 'filename',
        label: { en: 'File Name', ar: 'اسم الملف' },
        value: 'invoice.exe',
        suspicious: true,
        reason: { en: 'Executable file disguised as document', ar: 'ملف تنفيذي متنكر كوثيقة' }
      },
      {
        id: 'size',
        label: { en: 'File Size', ar: 'حجم الملف' },
        value: '2.3 MB',
        suspicious: true,
        reason: { en: 'Unusually large for a simple document', ar: 'كبير بشكل غير عادي لوثيقة بسيطة' }
      },
      {
        id: 'source',
        label: { en: 'Download Source', ar: 'مصدر التحميل' },
        value: 'Unknown website',
        suspicious: true,
        reason: { en: 'Downloaded from untrusted source', ar: 'تم التحميل من مصدر غير موثوق' }
      },
      {
        id: 'extension',
        label: { en: 'File Extension', ar: 'امتداد الملف' },
        value: '.exe',
        suspicious: true,
        reason: { en: 'Executable files can contain malware', ar: 'الملفات التنفيذية يمكن أن تحتوي على برمجيات خبيثة' }
      }
    ],
    clues: [
      { en: 'Check the file extension', ar: 'تحقق من امتداد الملف' },
      { en: 'Verify the file size', ar: 'تحقق من حجم الملف' },
      { en: 'Scan with antivirus software', ar: 'افحص ببرنامج مكافحة الفيروسات' },
      { en: 'Only download from trusted sources', ar: 'احمل فقط من المصادر الموثوقة' }
    ]
  },
  {
    id: 3,
    title: { en: 'Network Traffic Analysis', ar: 'تحليل حركة الشبكة' },
    description: { en: 'Investigate unusual network activity for security threats', ar: 'تحقق من نشاط الشبكة غير العادي للبحث عن التهديدات الأمنية' },
    icon: DevicePhoneMobileIcon,
    color: 'purple',
    evidence: [
      {
        id: 'connection',
        label: { en: 'Suspicious Connection', ar: 'اتصال مشبوه' },
        value: '192.168.1.100 → 45.67.89.123',
        suspicious: true,
        reason: { en: 'Connection to unknown external IP address', ar: 'اتصال بعنوان IP خارجي غير معروف' }
      },
      {
        id: 'frequency',
        label: { en: 'Connection Frequency', ar: 'تكرار الاتصال' },
        value: 'Every 30 seconds',
        suspicious: true,
        reason: { en: 'Unusually frequent connections', ar: 'اتصالات متكررة بشكل غير عادي' }
      },
      {
        id: 'data',
        label: { en: 'Data Transfer', ar: 'نقل البيانات' },
        value: 'Large amounts of data being sent',
        suspicious: true,
        reason: { en: 'Excessive data transfer to unknown destination', ar: 'نقل مفرط للبيانات إلى وجهة غير معروفة' }
      },
      {
        id: 'time',
        label: { en: 'Activity Time', ar: 'وقت النشاط' },
        value: '3:00 AM',
        suspicious: true,
        reason: { en: 'Unusual activity during off-hours', ar: 'نشاط غير عادي خلال ساعات الراحة' }
      }
    ],
    clues: [
      { en: 'Monitor network traffic patterns', ar: 'راقب أنماط حركة الشبكة' },
      { en: 'Check for unusual connection times', ar: 'تحقق من أوقات الاتصال غير العادية' },
      { en: 'Investigate unknown IP addresses', ar: 'تحقق من عناوين IP غير المعروفة' },
      { en: 'Look for excessive data transfer', ar: 'ابحث عن نقل مفرط للبيانات' }
    ]
  }
];

export default function SecurityDetectiveGame() {
  const { lang } = useLang();
  const [currentCase, setCurrentCase] = useState(0);
  const [score, setScore] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [selectedEvidence, setSelectedEvidence] = useState<string[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const [isPaused, setIsPaused] = useState(false);
  const [autoAdvance, setAutoAdvance] = useState(false);
  const nextCaseCalled = useRef(false);

  const currentCaseData = cases[currentCase];

  // Timer effect


  const startGame = () => {
    setGameStarted(true);
    setTimeLeft(60);
  };

  const toggleEvidence = (evidenceId: string) => {
    if (autoAdvance) return; // منع الاختيار بعد انتهاء الوقت
    setSelectedEvidence(prev => 
      prev.includes(evidenceId)
        ? prev.filter(id => id !== evidenceId)
        : [...prev, evidenceId]
    );
  };

  const handleSubmit = () => {
    if (autoAdvance || showResults) return; // منع الإرسال بعد انتهاء الوقت
    
    const suspiciousEvidence = currentCaseData.evidence.filter(e => e.suspicious);
    const correctSelections = selectedEvidence.filter(id => 
      suspiciousEvidence.some(e => e.id === id)
    );
    const incorrectSelections = selectedEvidence.filter(id => 
      !suspiciousEvidence.some(e => e.id === id)
    );

    // Calculate score - only give points if player selected at least one correct evidence
    const correctScore = correctSelections.length * 10;
    const incorrectPenalty = incorrectSelections.length * 5;
    const timeBonus = correctSelections.length > 0 ? Math.floor(timeLeft / 6) : 0;
    const caseScore = Math.max(0, correctScore - incorrectPenalty + timeBonus);
    
    setScore(prev => prev + caseScore);
    setShowResults(true);

    // Auto-advance after showing results
    setTimeout(() => {
      setShowResults(false);
      setSelectedEvidence([]);
      handleNextCase();
    }, 3000);
  };

  const handleNextCase = useCallback(() => {
    if (nextCaseCalled.current) return; // منع الاستدعاءات المتعددة
    
    nextCaseCalled.current = true;
    setAutoAdvance(false);
    if (currentCase < cases.length - 1) {
      setCurrentCase(prev => prev + 1);
      setTimeLeft(60);
    } else {
      setGameCompleted(true);
    }
    
    // إعادة تعيين بعد فترة قصيرة
    setTimeout(() => {
      nextCaseCalled.current = false;
    }, 1000);
  }, [currentCase]);

  // Timer effect with handleNextCase dependency
  useEffect(() => {
    if (!gameStarted || gameCompleted || isPaused) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          // إذا لم يتم اختيار أدلة، انتقل مباشرة بدون نقاط
          setAutoAdvance(true);
          handleNextCase();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [gameStarted, gameCompleted, isPaused, handleNextCase]);

  const resetGame = () => {
    setCurrentCase(0);
    setScore(0);
    setGameStarted(false);
    setGameCompleted(false);
    setSelectedEvidence([]);
    setShowResults(false);
    setTimeLeft(60);
    setIsPaused(false);
    setAutoAdvance(false);
    nextCaseCalled.current = false;
  };

  const togglePause = () => {
    setIsPaused(!isPaused);
  };

  if (!gameStarted) {
    return (
      <div className="min-h-screen gradient-bg">
        <Navigation />
        <main className="max-w-4xl mx-auto px-4 sm:px-8 lg:px-12 py-12">
          {/* Game Intro */}
          <div className="text-center">
            <div className="page-header-icon icon-animate mx-auto mb-6">
              <MagnifyingGlassIcon className="w-16 h-16 text-white" />
            </div>
            <h1 className="page-title title-animate mb-4">
              {lang === 'ar' ? 'محقق الأمن' : 'Security Detective'}
            </h1>
            <p className="page-subtitle subtitle-animate mb-8">
              {lang === 'ar' 
                ? 'حل ألغاز الأمن السيبراني من خلال تحليل الأدلة الرقمية'
                : 'Solve cybersecurity mysteries by analyzing digital evidence'
              }
            </p>

            {/* Game Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 content-animate">
              <div className="stat-card">
                <div className="text-2xl mb-2">🔍</div>
                <div className="stat-value">{cases.length}</div>
                <div className="stat-label">{lang === 'ar' ? 'الحالات' : 'Cases'}</div>
              </div>
              <div className="stat-card">
                <div className="text-2xl mb-2">⏱️</div>
                <div className="stat-value">8-15 min</div>
                <div className="stat-label">{lang === 'ar' ? 'مدة اللعب' : 'Duration'}</div>
              </div>
              <div className="stat-card">
                <div className="text-2xl mb-2">🏆</div>
                <div className="stat-value">150</div>
                <div className="stat-label">{lang === 'ar' ? 'أقصى نقاط' : 'Max Score'}</div>
              </div>
            </div>

            {/* Start Button */}
            <button 
              onClick={startGame}
              className="btn-primary text-lg px-8 py-4 content-animate"
            >
              <PlayIcon className="w-6 h-6 mr-2" />
              {lang === 'ar' ? 'ابدأ التحقيق' : 'Start Investigation'}
            </button>

            {/* Back to Games */}
            <div className="mt-8">
              <Link href="/games" className="text-slate-400 hover:text-white transition-colors">
                <ArrowLeftIcon className="w-5 h-5 inline mr-2" />
                {lang === 'ar' ? 'العودة للألعاب' : 'Back to Games'}
              </Link>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (gameCompleted) {
    const maxScore = cases.length * 50;
    const percentage = Math.min(100, Math.round((score / maxScore) * 100));
    
    return (
      <div className="min-h-screen gradient-bg">
        <Navigation />
        <main className="max-w-4xl mx-auto px-4 sm:px-8 lg:px-12 py-12">
          <div className="text-center">
            <div className="page-header-icon icon-animate mx-auto mb-6">
              <TrophyIcon className="w-16 h-16 text-white" />
            </div>
            <h1 className="page-title title-animate mb-4">
              {lang === 'ar' ? 'تحقيق مكتمل!' : 'Investigation Complete!'}
            </h1>
            <p className="page-subtitle subtitle-animate mb-8">
              {lang === 'ar' 
                ? 'لقد حللت جميع الحالات بنجاح'
                : 'You have successfully analyzed all cases'
              }
            </p>

            {/* Final Score */}
            <div className="card border-blue-500/30 p-8 mb-8 content-animate">
              <div className="text-6xl font-bold text-blue-400 mb-4">{score}</div>
              <div className="text-xl text-slate-300 mb-2">
                {lang === 'ar' ? 'النقاط النهائية' : 'Final Score'}
              </div>
              <div className="text-lg text-slate-400">
                {percentage}% {lang === 'ar' ? 'من النقاط الممكنة' : 'of possible points'}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center content-animate">
              <button onClick={resetGame} className="btn-primary">
                <PlayIcon className="w-5 h-5 mr-2" />
                {lang === 'ar' ? 'العب مرة أخرى' : 'Play Again'}
              </button>
              <Link href="/games" className="btn-secondary">
                <ArrowLeftIcon className="w-5 h-5 mr-2" />
                {lang === 'ar' ? 'العودة للألعاب' : 'Back to Games'}
              </Link>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (currentCase >= cases.length) {
    setGameCompleted(true);
    return null;
  }

  return (
    <div className="min-h-screen gradient-bg">
      <Navigation />
      <main className="max-w-4xl mx-auto px-4 sm:px-8 lg:px-12 py-12">
        {/* Game Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link href="/games" className="text-slate-400 hover:text-white transition-colors">
              <ArrowLeftIcon className="w-6 h-6" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-white">
                {currentCaseData.title[lang]}
              </h1>
              <p className="text-slate-400">
                {lang === 'ar' ? 'الحالة' : 'Case'} {currentCase + 1} {lang === 'ar' ? 'من' : 'of'} {cases.length}
              </p>
            </div>
          </div>
          
          {/* Game Controls */}
          <div className="flex items-center gap-4">
            <button onClick={togglePause} className="p-2 rounded-lg bg-slate-700 hover:bg-slate-600 transition-colors">
              {isPaused ? <PlayIcon className="w-5 h-5 text-white" /> : <PauseIcon className="w-5 h-5 text-white" />}
            </button>
            <div className="text-right">
              <div className="text-2xl font-bold text-white">{score}</div>
              <div className="text-sm text-slate-400">{lang === 'ar' ? 'النقاط' : 'Points'}</div>
            </div>
          </div>
        </div>

        {/* Timer */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-slate-300">{lang === 'ar' ? 'الوقت المتبقي' : 'Time Left'}</span>
            <span className={`text-lg font-bold ${timeLeft <= 15 ? 'text-red-400' : 'text-blue-400'}`}>
              {timeLeft}s
            </span>
          </div>
          <div className="w-full bg-slate-700 rounded-full h-2">
            <div 
              className={`h-2 rounded-full transition-all duration-1000 ${timeLeft <= 15 ? 'bg-red-500' : 'bg-blue-500'}`}
              style={{ width: `${(timeLeft / 60) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Case Description */}
        <div className="card p-6 mb-6 content-animate">
          <div className="text-center mb-4">
            <h2 className="text-lg font-semibold text-white mb-2">
              {currentCaseData.description[lang]}
            </h2>
            <p className="text-slate-400">
              {lang === 'ar' ? 'حدد جميع الأدلة المشبوهة' : 'Identify all suspicious evidence'}
            </p>
          </div>

          {/* Investigation Clues */}
          <div className="bg-slate-800/50 rounded-lg p-4">
            <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
              <EyeIcon className="w-4 h-4" />
              {lang === 'ar' ? 'نصائح التحقيق:' : 'Investigation Tips:'}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {currentCaseData.clues.map((clue, index) => (
                <div key={index} className="flex items-center gap-2 text-xs text-slate-300">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-400"></div>
                  <span>{clue[lang]}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Evidence Analysis */}
        <div className="card p-6 mb-6 content-animate">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <ShieldCheckIcon className="w-5 h-5" />
            {lang === 'ar' ? 'تحليل الأدلة' : 'Evidence Analysis'}
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {currentCaseData.evidence.map((evidence) => (
              <button
                key={evidence.id}
                onClick={() => toggleEvidence(evidence.id)}
                className={`p-4 rounded-lg text-left transition-all duration-200 border-2 ${
                  selectedEvidence.includes(evidence.id)
                    ? 'border-blue-500 bg-blue-500/10'
                    : 'border-slate-600 bg-slate-700 hover:bg-slate-600'
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <span className="text-sm font-medium text-slate-300">
                    {evidence.label[lang]}
                  </span>
                  {selectedEvidence.includes(evidence.id) && (
                    <CheckCircleIcon className="w-5 h-5 text-blue-400 flex-shrink-0" />
                  )}
                </div>
                <p className="text-white font-semibold text-sm">
                  {evidence.value}
                </p>
                {selectedEvidence.includes(evidence.id) && (
                  <p className="text-xs text-slate-400 mt-2">
                    {evidence.reason[lang]}
                  </p>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Submit Button */}
        <div className="text-center content-animate">
          <button
            onClick={handleSubmit}
            disabled={selectedEvidence.length === 0}
            className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <MagnifyingGlassIcon className="w-5 h-5 mr-2" />
            {lang === 'ar' ? 'تحليل النتائج' : 'Analyze Results'}
          </button>
        </div>

        {/* Progress */}
        <div className="text-center mt-8">
          <div className="flex justify-center gap-2 mb-2">
            {cases.map((case_, index) => (
              <div
                key={case_.id}
                className={`w-3 h-3 rounded-full ${
                  index < currentCase 
                    ? 'bg-blue-500' 
                    : index === currentCase 
                    ? 'bg-green-500' 
                    : 'bg-slate-600'
                }`}
              ></div>
            ))}
          </div>
          <p className="text-sm text-slate-400">
            {lang === 'ar' ? 'التقدم العام' : 'Overall Progress'}
          </p>
        </div>
      </main>
    </div>
  );
} 