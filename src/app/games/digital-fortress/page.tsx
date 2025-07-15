'use client';

import { useState, useEffect, useRef } from 'react';
import Navigation from '@/components/Navigation';
import { 
  PuzzlePieceIcon,
  ShieldCheckIcon,
  FireIcon,
  ComputerDesktopIcon,
  CheckCircleIcon,
  XCircleIcon,
  ArrowLeftIcon,
  PlayIcon,
  PauseIcon,
  TrophyIcon,
  ClockIcon,
  CogIcon,
  WrenchScrewdriverIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';
import { useLang } from '../../ClientLayout';
import { useTranslation } from '@/lib/useTranslation';
import Link from 'next/link';

// بيانات المراحل
const levels = [
  {
    id: 1,
    title: { en: 'Firewall Configuration', ar: 'تكوين جدران الحماية' },
    description: { en: 'Set up and configure firewall rules to protect your network', ar: 'قم بإعداد وتكوين قواعد جدران الحماية لحماية شبكتك' },
    icon: ShieldCheckIcon,
    color: 'green',
    budget: 1000,
    components: [
      {
        id: 'basic-firewall',
        name: { en: 'Basic Firewall', ar: 'جدار حماية أساسي' },
        cost: 200,
        security: 30,
        description: { en: 'Basic packet filtering firewall', ar: 'جدار حماية أساسي لتصفية الحزم' },
        required: true
      },
      {
        id: 'advanced-firewall',
        name: { en: 'Advanced Firewall', ar: 'جدار حماية متقدم' },
        cost: 400,
        security: 60,
        description: { en: 'Stateful inspection firewall with deep packet inspection', ar: 'جدار حماية متقدم مع فحص الحزم العميق' },
        required: false
      },
      {
        id: 'ids',
        name: { en: 'Intrusion Detection System', ar: 'نظام كشف التسلل' },
        cost: 300,
        security: 40,
        description: { en: 'Monitors network traffic for suspicious activity', ar: 'يراقب حركة الشبكة للبحث عن النشاط المشبوه' },
        required: false
      },
      {
        id: 'ips',
        name: { en: 'Intrusion Prevention System', ar: 'نظام منع التسلل' },
        cost: 500,
        security: 70,
        description: { en: 'Actively blocks suspicious traffic and attacks', ar: 'يمنع بنشاط حركة المرور والهجمات المشبوهة' },
        required: false
      }
    ],
    threats: [
      { en: 'Port scanning attacks', ar: 'هجمات فحص المنافذ' },
      { en: 'DDoS attacks', ar: 'هجمات حجب الخدمة' },
      { en: 'Malware propagation', ar: 'انتشار البرمجيات الخبيثة' }
    ]
  },
  {
    id: 2,
    title: { en: 'Access Control System', ar: 'نظام التحكم في الوصول' },
    description: { en: 'Implement strong authentication and authorization controls', ar: 'نفذ ضوابط قوية للمصادقة والتفويض' },
    icon: CogIcon,
    color: 'blue',
    budget: 800,
    components: [
      {
        id: 'password-auth',
        name: { en: 'Password Authentication', ar: 'المصادقة بكلمة المرور' },
        cost: 100,
        security: 20,
        description: { en: 'Basic username and password authentication', ar: 'مصادقة أساسية باسم المستخدم وكلمة المرور' },
        required: true
      },
      {
        id: '2fa',
        name: { en: 'Two-Factor Authentication', ar: 'المصادقة الثنائية' },
        cost: 200,
        security: 50,
        description: { en: 'Requires additional verification beyond password', ar: 'يتطلب تحقق إضافي بجانب كلمة المرور' },
        required: false
      },
      {
        id: 'biometric',
        name: { en: 'Biometric Authentication', ar: 'المصادقة البيومترية' },
        cost: 400,
        security: 80,
        description: { en: 'Fingerprint, facial recognition, or iris scanning', ar: 'بصمة الإصبع، التعرف على الوجه، أو مسح القزحية' },
        required: false
      },
      {
        id: 'rbac',
        name: { en: 'Role-Based Access Control', ar: 'التحكم في الوصول القائم على الأدوار' },
        cost: 300,
        security: 60,
        description: { en: 'Assign permissions based on user roles', ar: 'تعيين الصلاحيات بناءً على أدوار المستخدمين' },
        required: false
      }
    ],
    threats: [
      { en: 'Password attacks', ar: 'هجمات كلمات المرور' },
      { en: 'Social engineering', ar: 'الهندسة الاجتماعية' },
      { en: 'Privilege escalation', ar: 'تصعيد الصلاحيات' }
    ]
  },
  {
    id: 3,
    title: { en: 'Monitoring & Response', ar: 'المراقبة والاستجابة' },
    description: { en: 'Deploy monitoring systems and incident response capabilities', ar: 'نشر أنظمة المراقبة وقدرات الاستجابة للحوادث' },
    icon: ChartBarIcon,
    color: 'purple',
    budget: 1200,
    components: [
      {
        id: 'log-monitoring',
        name: { en: 'Log Monitoring', ar: 'مراقبة السجلات' },
        cost: 150,
        security: 25,
        description: { en: 'Monitor system and application logs', ar: 'مراقبة سجلات النظام والتطبيقات' },
        required: true
      },
      {
        id: 'siem',
        name: { en: 'SIEM System', ar: 'نظام SIEM' },
        cost: 600,
        security: 75,
        description: { en: 'Security Information and Event Management', ar: 'إدارة المعلومات الأمنية وأحداث الأمان' },
        required: false
      },
      {
        id: 'threat-intel',
        name: { en: 'Threat Intelligence', ar: 'استخبارات التهديدات' },
        cost: 400,
        security: 55,
        description: { en: 'Real-time threat intelligence feeds', ar: 'تغذيات استخبارات التهديدات في الوقت الفعلي' },
        required: false
      },
      {
        id: 'automated-response',
        name: { en: 'Automated Response', ar: 'الاستجابة الآلية' },
        cost: 500,
        security: 65,
        description: { en: 'Automatically respond to security incidents', ar: 'الاستجابة تلقائياً للحوادث الأمنية' },
        required: false
      }
    ],
    threats: [
      { en: 'Advanced persistent threats', ar: 'التهديدات المتقدمة المستمرة' },
      { en: 'Zero-day exploits', ar: 'استغلال الثغرات الجديدة' },
      { en: 'Insider threats', ar: 'التهديدات الداخلية' }
    ]
  }
];

export default function DigitalFortressGame() {
  const { lang } = useLang();
  const { t } = useTranslation(lang);
  const [currentLevel, setCurrentLevel] = useState(0);
  const [score, setScore] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [selectedComponents, setSelectedComponents] = useState<string[]>([]);
  const [budget, setBudget] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [timeLeft, setTimeLeft] = useState(90);
  const [isPaused, setIsPaused] = useState(false);
  const [autoAdvance, setAutoAdvance] = useState(false);
  const nextLevelCalled = useRef(false);

  const currentLevelData = levels[currentLevel];

  // Initialize budget for current level
  useEffect(() => {
    if (gameStarted && !gameCompleted) {
      setBudget(currentLevelData.budget);
    }
  }, [currentLevel, gameStarted, gameCompleted]);

  // Timer effect
  useEffect(() => {
    if (!gameStarted || gameCompleted || isPaused) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          // إذا لم يتم اختيار مكونات، انتقل مباشرة بدون نقاط
          setAutoAdvance(true);
          handleEvaluate();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [gameStarted, gameCompleted, isPaused]);

  const startGame = () => {
    setGameStarted(true);
    setTimeLeft(90);
    setBudget(currentLevelData.budget);
  };

  const toggleComponent = (componentId: string) => {
    if (autoAdvance) return; // منع الاختيار بعد انتهاء الوقت
    
    const component = currentLevelData.components.find(c => c.id === componentId);
    if (!component) return;

    if (selectedComponents.includes(componentId)) {
      // Remove component
      setSelectedComponents(prev => prev.filter(id => id !== componentId));
      setBudget(prev => prev + component.cost);
    } else {
      // Add component
      if (budget >= component.cost) {
        setSelectedComponents(prev => [...prev, componentId]);
        setBudget(prev => prev - component.cost);
      }
    }
  };

  const handleEvaluate = () => {
    if (autoAdvance || showResults) return; // منع الإرسال بعد انتهاء الوقت
    
    const selectedComps = currentLevelData.components.filter(c => 
      selectedComponents.includes(c.id)
    );
    
    // Check if required components are selected
    const requiredComps = currentLevelData.components.filter(c => c.required);
    const hasRequired = requiredComps.every(c => selectedComponents.includes(c.id));
    
    if (!hasRequired) {
      // Failed - missing required components
      setScore(prev => prev + 0);
    } else {
      // Calculate security score
      const totalSecurity = selectedComps.reduce((sum, comp) => sum + comp.security, 0);
      const maxSecurity = currentLevelData.components.reduce((sum, comp) => sum + comp.security, 0);
      const securityPercentage = (totalSecurity / maxSecurity) * 100;
      
      // Bonus for budget efficiency
      const budgetEfficiency = (budget / currentLevelData.budget) * 100;
      const budgetBonus = Math.floor(budgetEfficiency / 10);
      
      // Time bonus
      const timeBonus = Math.floor(timeLeft / 9);
      
      const levelScore = Math.floor(securityPercentage) + budgetBonus + timeBonus;
      setScore(prev => prev + levelScore);
    }

    setShowResults(true);

    // Auto-advance after showing results
    setTimeout(() => {
      setShowResults(false);
      setSelectedComponents([]);
      handleNextLevel();
    }, 3000);
  };

  const handleNextLevel = () => {
    if (nextLevelCalled.current) return; // منع الاستدعاءات المتعددة
    
    nextLevelCalled.current = true;
    setAutoAdvance(false);
    if (currentLevel < levels.length - 1) {
      setCurrentLevel(prev => prev + 1);
      setTimeLeft(90);
      setBudget(levels[currentLevel + 1].budget);
    } else {
      setGameCompleted(true);
    }
    
    // إعادة تعيين بعد فترة قصيرة
    setTimeout(() => {
      nextLevelCalled.current = false;
    }, 1000);
  };



  const resetGame = () => {
    setCurrentLevel(0);
    setScore(0);
    setGameStarted(false);
    setGameCompleted(false);
    setSelectedComponents([]);
    setBudget(0);
    setShowResults(false);
    setTimeLeft(90);
    setIsPaused(false);
    setAutoAdvance(false);
    nextLevelCalled.current = false;
  };

  const togglePause = () => {
    setIsPaused(!isPaused);
  };

  const getSelectedComponents = () => {
    return currentLevelData.components.filter(c => selectedComponents.includes(c.id));
  };

  const getTotalSecurity = () => {
    return getSelectedComponents().reduce((sum, comp) => sum + comp.security, 0);
  };

  if (!gameStarted) {
    return (
      <div className="min-h-screen gradient-bg">
        <Navigation />
        <main className="max-w-4xl mx-auto px-4 sm:px-8 lg:px-12 py-12">
          {/* Game Intro */}
          <div className="text-center">
            <div className="page-header-icon icon-animate mx-auto mb-6">
              <PuzzlePieceIcon className="w-16 h-16 text-white" />
            </div>
            <h1 className="page-title title-animate mb-4">
              {lang === 'ar' ? 'باني الحصن الرقمي' : 'Digital Fortress Builder'}
            </h1>
            <p className="page-subtitle subtitle-animate mb-8">
              {lang === 'ar' 
                ? 'ابنِ واحمِ حصنك الرقمي من الهجمات السيبرانية'
                : 'Build and defend your digital fortress against cyber attacks'
              }
            </p>

            {/* Game Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 content-animate">
              <div className="stat-card">
                <div className="text-2xl mb-2">🏰</div>
                <div className="stat-value">{levels.length}</div>
                <div className="stat-label">{lang === 'ar' ? 'المراحل' : 'Levels'}</div>
              </div>
              <div className="stat-card">
                <div className="text-2xl mb-2">⏱️</div>
                <div className="stat-value">12-20 min</div>
                <div className="stat-label">{lang === 'ar' ? 'مدة اللعب' : 'Duration'}</div>
              </div>
              <div className="stat-card">
                <div className="text-2xl mb-2">🏆</div>
                <div className="stat-value">300</div>
                <div className="stat-label">{lang === 'ar' ? 'أقصى نقاط' : 'Max Score'}</div>
              </div>
            </div>

            {/* Start Button */}
            <button 
              onClick={startGame}
              className="btn-primary text-lg px-8 py-4 content-animate"
            >
              <PlayIcon className="w-6 h-6 mr-2" />
              {lang === 'ar' ? 'ابدأ البناء' : 'Start Building'}
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
    const maxScore = levels.length * 100;
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
              {lang === 'ar' ? 'حصن مكتمل!' : 'Fortress Complete!'}
            </h1>
            <p className="page-subtitle subtitle-animate mb-8">
              {lang === 'ar' 
                ? 'لقد بنيت حصنك الرقمي بنجاح'
                : 'You have successfully built your digital fortress'
              }
            </p>

            {/* Final Score */}
            <div className="card border-purple-500/30 p-8 mb-8 content-animate">
              <div className="text-6xl font-bold text-purple-400 mb-4">{score}</div>
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

  if (currentLevel >= levels.length) {
    setGameCompleted(true);
    return null;
  }

  return (
    <div className="min-h-screen gradient-bg">
      <Navigation />
      <main className="max-w-6xl mx-auto px-4 sm:px-8 lg:px-12 py-12">
        {/* Game Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link href="/games" className="text-slate-400 hover:text-white transition-colors">
              <ArrowLeftIcon className="w-6 h-6" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-white">
                {currentLevelData?.title?.[lang] || (lang === 'ar' ? 'جاري التحميل...' : 'Loading...')}
              </h1>
              <p className="text-slate-400">
                {lang === 'ar' ? 'المرحلة' : 'Level'} {currentLevel + 1} {lang === 'ar' ? 'من' : 'of'} {levels.length}
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

        {/* Timer and Budget */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Timer */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-slate-300">{lang === 'ar' ? 'الوقت المتبقي' : 'Time Left'}</span>
              <span className={`text-lg font-bold ${timeLeft <= 20 ? 'text-red-400' : 'text-purple-400'}`}>
                {timeLeft}s
              </span>
            </div>
            <div className="w-full bg-slate-700 rounded-full h-2">
              <div 
                className={`h-2 rounded-full transition-all duration-1000 ${timeLeft <= 20 ? 'bg-red-500' : 'bg-purple-500'}`}
                style={{ width: `${(timeLeft / 90) * 100}%` }}
              ></div>
            </div>
          </div>

          {/* Budget */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-slate-300">{lang === 'ar' ? 'الميزانية المتبقية' : 'Budget Remaining'}</span>
              <span className={`text-lg font-bold ${budget < 100 ? 'text-red-400' : 'text-green-400'}`}>
                ${budget}
              </span>
            </div>
            <div className="w-full bg-slate-700 rounded-full h-2">
                              <div 
                  className={`h-2 rounded-full transition-all duration-300 ${budget < 100 ? 'bg-red-500' : 'bg-green-500'}`}
                  style={{ width: `${(budget / (currentLevelData?.budget || 1)) * 100}%` }}
                ></div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Level Description */}
          <div className="lg:col-span-1">
            <div className="card p-6 content-animate">
              <div className="text-center mb-4">
                <h2 className="text-lg font-semibold text-white mb-2">
                  {currentLevelData?.description?.[lang] || (lang === 'ar' ? 'جاري التحميل...' : 'Loading...')}
                </h2>
                <p className="text-slate-400 text-sm">
                  {lang === 'ar' ? 'اختر المكونات الأمنية المناسبة' : 'Choose appropriate security components'}
                </p>
              </div>

              {/* Threats */}
              <div className="bg-slate-800/50 rounded-lg p-4">
                <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                  <FireIcon className="w-4 h-4 text-red-400" />
                  {lang === 'ar' ? 'التهديدات المحتملة:' : 'Potential Threats:'}
                </h3>
                <div className="space-y-2">
                  {currentLevelData?.threats?.map((threat, index) => (
                    <div key={index} className="flex items-center gap-2 text-xs text-slate-300">
                      <div className="w-1.5 h-1.5 rounded-full bg-red-400"></div>
                      <span>{threat[lang]}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Current Security Score */}
              <div className="mt-4 p-4 bg-slate-800/50 rounded-lg">
                <h3 className="text-sm font-semibold text-white mb-2">
                  {lang === 'ar' ? 'مستوى الأمان الحالي' : 'Current Security Level'}
                </h3>
                <div className="text-2xl font-bold text-green-400 mb-1">
                  {getTotalSecurity()}%
                </div>
                <div className="w-full bg-slate-700 rounded-full h-2">
                  <div 
                    className="h-2 bg-green-500 rounded-full transition-all duration-300"
                    style={{ width: `${getTotalSecurity()}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          {/* Components Selection */}
          <div className="lg:col-span-2">
            <div className="card p-6 content-animate">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <WrenchScrewdriverIcon className="w-5 h-5" />
                {lang === 'ar' ? 'اختيار المكونات الأمنية' : 'Security Components Selection'}
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {currentLevelData?.components?.map((component) => {
                  const isSelected = selectedComponents.includes(component.id);
                  const canAfford = budget >= component.cost;
                  const isRequired = component.required;
                  
                  return (
                    <button
                      key={component.id}
                      onClick={() => toggleComponent(component.id)}
                      disabled={!canAfford && !isSelected}
                      className={`p-4 rounded-lg text-left transition-all duration-200 border-2 ${
                        isSelected
                          ? 'border-purple-500 bg-purple-500/10'
                          : canAfford
                          ? 'border-slate-600 bg-slate-700 hover:bg-slate-600'
                          : 'border-slate-600 bg-slate-800 opacity-50 cursor-not-allowed'
                      }`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-white">
                            {component.name[lang]}
                          </span>
                          {isRequired && (
                            <span className="px-2 py-1 bg-red-500/20 text-red-400 text-xs rounded">
                              {lang === 'ar' ? 'مطلوب' : 'Required'}
                            </span>
                          )}
                        </div>
                        {isSelected && (
                          <CheckCircleIcon className="w-5 h-5 text-purple-400 flex-shrink-0" />
                        )}
                      </div>
                      
                      <p className="text-white font-semibold text-sm mb-2">
                        ${component.cost}
                      </p>
                      
                      <p className="text-xs text-slate-300 mb-3">
                        {component.description[lang]}
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-slate-400">
                          {lang === 'ar' ? 'الأمان:' : 'Security:'} {component.security}%
                        </span>
                        <div className="w-16 bg-slate-700 rounded-full h-1.5">
                          <div 
                            className="h-1.5 bg-green-500 rounded-full"
                            style={{ width: `${component.security}%` }}
                          ></div>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Evaluate Button */}
        <div className="text-center mt-8 content-animate">
          <button
            onClick={handleEvaluate}
            className="btn-primary"
          >
            <ShieldCheckIcon className="w-5 h-5 mr-2" />
            {lang === 'ar' ? 'تقييم الحصن' : 'Evaluate Fortress'}
          </button>
        </div>

        {/* Progress */}
        <div className="text-center mt-8">
          <div className="flex justify-center gap-2 mb-2">
            {levels.map((level, index) => (
              <div
                key={level.id}
                className={`w-3 h-3 rounded-full ${
                  index < currentLevel 
                    ? 'bg-purple-500' 
                    : index === currentLevel 
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