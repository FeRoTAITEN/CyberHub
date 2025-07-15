'use client';

import { useState, useEffect } from 'react';
import Navigation from '@/components/Navigation';
import { 
  ShieldCheckIcon,
  LockClosedIcon,
  ExclamationTriangleIcon,
  ComputerDesktopIcon,
  CheckCircleIcon,
  XCircleIcon,
  ArrowLeftIcon,
  PlayIcon,
  PauseIcon,
  TrophyIcon,
  StarIcon,
  ClockIcon,
  UserIcon,
  CogIcon
} from '@heroicons/react/24/outline';
import { useLang } from '../../ClientLayout';
import { useTranslation } from '@/lib/useTranslation';
import Link from 'next/link';

// بيانات المراحل
const levels = [
  {
    id: 1,
    title: { en: 'Password Security', ar: 'أمان كلمات المرور' },
    description: { en: 'Choose strong passwords and avoid common mistakes', ar: 'اختر كلمات مرور قوية وتجنب الأخطاء الشائعة' },
    icon: LockClosedIcon,
    color: 'green',
    scenarios: [
      {
        id: 1,
        question: { en: 'Which password is the strongest?', ar: 'أي كلمة مرور هي الأقوى؟' },
        options: [
          { 
            text: { en: 'password123', ar: 'password123' }, 
            correct: false,
            feedback: { en: 'Too common and predictable', ar: 'شائعة جداً وقابلة للتوقع' }
          },
          { 
            text: { en: 'MyName2024!', ar: 'MyName2024!' }, 
            correct: true,
            feedback: { en: 'Excellent! Mix of letters, numbers, and symbols', ar: 'ممتاز! مزيج من الأحرف والأرقام والرموز' }
          },
          { 
            text: { en: '123456789', ar: '123456789' }, 
            correct: false,
            feedback: { en: 'Sequential numbers are very weak', ar: 'الأرقام المتسلسلة ضعيفة جداً' }
          },
          { 
            text: { en: 'qwerty', ar: 'qwerty' }, 
            correct: false,
            feedback: { en: 'Common keyboard pattern', ar: 'نمط لوحة المفاتيح الشائع' }
          }
        ]
      },
      {
        id: 2,
        question: { en: 'What should you do if you suspect your password was compromised?', ar: 'ماذا يجب أن تفعل إذا اشتبهت في اختراق كلمة المرور؟' },
        options: [
          { 
            text: { en: 'Wait and see if anything happens', ar: 'انتظر وانظر ما سيحدث' }, 
            correct: false,
            feedback: { en: 'Never wait! Act immediately', ar: 'لا تنتظر أبداً! تصرف فوراً' }
          },
          { 
            text: { en: 'Change it immediately and enable 2FA', ar: 'غيّرها فوراً وفعّل المصادقة الثنائية' }, 
            correct: true,
            feedback: { en: 'Perfect! Quick action prevents damage', ar: 'ممتاز! التصرف السريع يمنع الضرر' }
          },
          { 
            text: { en: 'Tell only your close friends', ar: 'أخبر أصدقاءك المقربين فقط' }, 
            correct: false,
            feedback: { en: 'Security incidents should be reported properly', ar: 'يجب الإبلاغ عن الحوادث الأمنية بشكل صحيح' }
          },
          { 
            text: { en: 'Use the same password for all accounts', ar: 'استخدم نفس كلمة المرور لجميع الحسابات' }, 
            correct: false,
            feedback: { en: 'Never reuse passwords across accounts', ar: 'لا تعيد استخدام كلمات المرور عبر الحسابات' }
          }
        ]
      }
    ]
  },
  {
    id: 2,
    title: { en: 'Phishing Detection', ar: 'اكتشاف التصيد الاحتيالي' },
    description: { en: 'Identify and avoid phishing attempts', ar: 'حدد وتجنب محاولات التصيد الاحتيالي' },
    icon: ExclamationTriangleIcon,
    color: 'red',
    scenarios: [
      {
        id: 1,
        question: { en: 'You receive an email claiming to be from your bank asking for your password. What should you do?', ar: 'تستلم بريد إلكتروني يدعي أنه من بنكك ويطلب كلمة المرور. ماذا يجب أن تفعل؟' },
        options: [
          { 
            text: { en: 'Reply with your password immediately', ar: 'رد بكلمة المرور فوراً' }, 
            correct: false,
            feedback: { en: 'Banks never ask for passwords via email', ar: 'البنوك لا تطلب كلمات المرور عبر البريد الإلكتروني' }
          },
          { 
            text: { en: 'Click the link in the email to verify', ar: 'انقر على الرابط في البريد للتحقق' }, 
            correct: false,
            feedback: { en: 'Never click links in suspicious emails', ar: 'لا تنقر على الروابط في الرسائل المشبوهة' }
          },
          { 
            text: { en: 'Delete the email and contact your bank directly', ar: 'احذف البريد واتصل ببنكك مباشرة' }, 
            correct: true,
            feedback: { en: 'Excellent! Always verify through official channels', ar: 'ممتاز! تحقق دائماً عبر القنوات الرسمية' }
          },
          { 
            text: { en: 'Forward it to all your contacts', ar: 'أعد توجيهه لجميع جهات الاتصال' }, 
            correct: false,
            feedback: { en: 'Don\'t spread suspicious emails', ar: 'لا تنشر الرسائل المشبوهة' }
          }
        ]
      }
    ]
  },
  {
    id: 3,
    title: { en: 'Malware Protection', ar: 'حماية من البرمجيات الخبيثة' },
    description: { en: 'Learn to protect against malicious software', ar: 'تعلم حماية نفسك من البرمجيات الخبيثة' },
    icon: ComputerDesktopIcon,
    color: 'orange',
    scenarios: [
      {
        id: 1,
        question: { en: 'What is the best way to protect against malware?', ar: 'ما هي أفضل طريقة للحماية من البرمجيات الخبيثة؟' },
        options: [
          { 
            text: { en: 'Never use antivirus software', ar: 'لا تستخدم برامج مكافحة الفيروسات أبداً' }, 
            correct: false,
            feedback: { en: 'Antivirus is essential for protection', ar: 'برامج مكافحة الفيروسات ضرورية للحماية' }
          },
          { 
            text: { en: 'Keep software updated and use antivirus', ar: 'حافظ على تحديث البرامج واستخدم مكافحة الفيروسات' }, 
            correct: true,
            feedback: { en: 'Perfect! Multiple layers of protection', ar: 'ممتاز! طبقات متعددة من الحماية' }
          },
          { 
            text: { en: 'Download files from any website', ar: 'حمل الملفات من أي موقع' }, 
            correct: false,
            feedback: { en: 'Only download from trusted sources', ar: 'احمل فقط من المصادر الموثوقة' }
          },
          { 
            text: { en: 'Disable all security features', ar: 'عطّل جميع ميزات الأمان' }, 
            correct: false,
            feedback: { en: 'Security features protect you', ar: 'ميزات الأمان تحميك' }
          }
        ]
      }
    ]
  }
];

export default function CyberGuardianGame() {
  const { lang } = useLang();
  const { t } = useTranslation(lang);
  const [currentLevel, setCurrentLevel] = useState(0);
  const [currentScenario, setCurrentScenario] = useState(0);
  const [score, setScore] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);
  const [isPaused, setIsPaused] = useState(false);
  // أضف متغير لتتبع إذا تم اختيار إجابة
  const [autoAdvance, setAutoAdvance] = useState(false);

  const currentLevelData = levels[currentLevel];
  const currentScenarioData = currentLevelData?.scenarios[currentScenario];

  // متغير وسيط لمعرفة هل انتهت الأسئلة في المرحلة الحالية
  const isLastScenario = currentScenario >= currentLevelData.scenarios.length;
  const isLastLevel = currentLevel >= levels.length;

  // عدل المؤقت:
  useEffect(() => {
    if (!gameStarted || gameCompleted || isPaused) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          // إذا لم يتم اختيار إجابة، انتقل مباشرة بدون نقاط
          setAutoAdvance(true);
          handleNextScenario();
          return 30;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [gameStarted, gameCompleted, isPaused]);

  // استخدم useEffect للانتقال التلقائي عند تجاوز عدد الأسئلة
  useEffect(() => {
    if (!gameCompleted && currentScenario >= currentLevelData.scenarios.length) {
      if (currentLevel < levels.length - 1) {
        setCurrentLevel(currentLevel + 1);
        setCurrentScenario(0);
        setTimeLeft(30);
      } else {
        setGameCompleted(true);
      }
    }
    // eslint-disable-next-line
  }, [currentScenario, currentLevel, gameCompleted]);

  const startGame = () => {
    setGameStarted(true);
    setTimeLeft(30);
  };

  // عدل handleAnswerSelect بحيث لا يسمح بالإجابة إذا autoAdvance=true
  const handleAnswerSelect = (answerIndex: number) => {
    if (selectedAnswer !== null || autoAdvance) return; // منع الإجابة بعد انتهاء الوقت
    setSelectedAnswer(answerIndex);
    setShowFeedback(true);
    const isCorrect = currentScenarioData.options[answerIndex].correct;
    if (isCorrect) {
      setScore(prev => prev + 10 + Math.floor(timeLeft / 3)); // Bonus points for speed
    }
    setTimeout(() => {
      setSelectedAnswer(null);
      setShowFeedback(false);
      handleNextScenario();
    }, 2000);
  };

  // في handleNextScenario أعد autoAdvance إلى false
  const handleNextScenario = () => {
    setAutoAdvance(false);
    // إذا تجاوزنا عدد الأسئلة في المرحلة الحالية، انتقل تلقائياً للمرحلة التالية أو النتيجة
    if (currentScenario >= currentLevelData.scenarios.length) {
      // إذا هناك مرحلة أخرى انتقل لها
      if (currentLevel < levels.length - 1) {
        setCurrentLevel(currentLevel + 1);
        setCurrentScenario(0);
        setTimeLeft(30);
      } else {
        // انتهت اللعبة
        setGameCompleted(true);
      }
    } else {
      setCurrentScenario(prev => prev + 1);
      setTimeLeft(30);
    }
  };



  const resetGame = () => {
    setCurrentLevel(0);
    setCurrentScenario(0);
    setScore(0);
    setGameStarted(false);
    setGameCompleted(false);
    setSelectedAnswer(null);
    setShowFeedback(false);
    setTimeLeft(30);
    setIsPaused(false);
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
              <ShieldCheckIcon className="w-16 h-16 text-white" />
            </div>
            <h1 className="page-title title-animate mb-4">
              {lang === 'ar' ? 'حارس الأمن السيبراني' : 'Cyber Security Guardian'}
            </h1>
            <p className="page-subtitle subtitle-animate mb-8">
              {lang === 'ar' 
                ? 'احمِ شركتك من الهجمات السيبرانية باتخاذ القرارات الصحيحة'
                : 'Protect your company from cyber attacks by making the right decisions'
              }
            </p>

            {/* Game Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 content-animate">
              <div className="stat-card">
                <div className="text-2xl mb-2">🎯</div>
                <div className="stat-value">{levels.length}</div>
                <div className="stat-label">{lang === 'ar' ? 'المراحل' : 'Levels'}</div>
              </div>
              <div className="stat-card">
                <div className="text-2xl mb-2">⏱️</div>
                <div className="stat-value">5-10 min</div>
                <div className="stat-label">{lang === 'ar' ? 'مدة اللعب' : 'Duration'}</div>
              </div>
              <div className="stat-card">
                <div className="text-2xl mb-2">🏆</div>
                <div className="stat-value">100</div>
                <div className="stat-label">{lang === 'ar' ? 'أقصى نقاط' : 'Max Score'}</div>
              </div>
            </div>

            {/* Start Button */}
            <button 
              onClick={startGame}
              className="btn-primary text-lg px-8 py-4 content-animate"
            >
              <PlayIcon className="w-6 h-6 mr-2" />
              {lang === 'ar' ? 'ابدأ اللعب' : 'Start Playing'}
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
    const maxScore = levels.reduce((total, level) => total + level.scenarios.length, 0) * 15;
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
              {lang === 'ar' ? 'أحسنت!' : 'Congratulations!'}
            </h1>
            <p className="page-subtitle subtitle-animate mb-8">
              {lang === 'ar' 
                ? 'لقد أكملت جميع المراحل بنجاح'
                : 'You have successfully completed all levels'
              }
            </p>

            {/* Final Score */}
            <div className="card border-green-500/30 p-8 mb-8 content-animate">
              <div className="text-6xl font-bold text-green-400 mb-4">{score}</div>
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

  // إذا انتهت الأسئلة في المرحلة الحالية ولم تنتهِ اللعبة بعد، انتظر انتقال المرحلة أو إنهاء اللعبة
  if (isLastScenario && !gameCompleted) {
    return (
      <div className="min-h-screen gradient-bg">
        <Navigation />
        <main className="max-w-4xl mx-auto px-4 sm:px-8 lg:px-12 py-12 flex items-center justify-center">
          <div className="card p-8 text-center">
            <h2 className="text-xl font-semibold text-white mb-2">
              {lang === 'ar' ? 'انتظر قليلاً...' : 'Please wait...'}
            </h2>
            <p className="text-slate-400">
              {lang === 'ar' ? 'جاري الانتقال للمرحلة التالية أو إنهاء اللعبة' : 'Moving to the next level or finishing the game'}
            </p>
          </div>
        </main>
      </div>
    );
  }

  if (!currentScenarioData || !currentScenarioData.question) {
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
                {currentLevelData.title[lang]}
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

        {/* Timer */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-slate-300">{lang === 'ar' ? 'الوقت المتبقي' : 'Time Left'}</span>
            <span className={`text-lg font-bold ${timeLeft <= 10 ? 'text-red-400' : 'text-green-400'}`}>
              {timeLeft}s
            </span>
          </div>
          <div className="w-full bg-slate-700 rounded-full h-2">
            <div 
              className={`h-2 rounded-full transition-all duration-1000 ${timeLeft <= 10 ? 'bg-red-500' : 'bg-green-500'}`}
              style={{ width: `${(timeLeft / 30) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Question Card */}
        <div className="card p-8 mb-6 content-animate">
          <div className="text-center mb-6">
            <h2 className="text-xl font-semibold text-white mb-2">
              {currentScenarioData?.question?.[lang] || (lang === 'ar' ? 'جاري التحميل...' : 'Loading...')}
            </h2>
            <p className="text-slate-400">
              {lang === 'ar' ? 'السؤال' : 'Question'} {currentScenario + 1} {lang === 'ar' ? 'من' : 'of'} {currentLevelData?.scenarios?.length || 0}
            </p>
          </div>

          {/* Answer Options */}
          <div className="space-y-3">
            {currentScenarioData?.options?.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswerSelect(index)}
                disabled={selectedAnswer !== null}
                className={`w-full p-4 rounded-lg text-left transition-all duration-200 ${
                  selectedAnswer === index
                    ? option.correct
                      ? 'bg-green-600 text-white border-green-500'
                      : 'bg-red-600 text-white border-red-500'
                    : 'bg-slate-700 hover:bg-slate-600 text-slate-300 hover:text-white border border-slate-600'
                } ${selectedAnswer !== null ? 'cursor-default' : 'cursor-pointer'}`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium">{option.text[lang]}</span>
                  {selectedAnswer === index && (
                    option.correct ? 
                      <CheckCircleIcon className="w-6 h-6 text-white" /> : 
                      <XCircleIcon className="w-6 h-6 text-white" />
                  )}
                </div>
                
                {/* Feedback */}
                {showFeedback && selectedAnswer === index && (
                  <div className="mt-3 p-3 bg-slate-800 rounded-lg">
                    <p className="text-sm">
                      {option.feedback[lang]}
                    </p>
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Progress */}
        <div className="text-center">
          <div className="flex justify-center gap-2 mb-2">
            {levels.map((level, index) => (
              <div
                key={level.id}
                className={`w-3 h-3 rounded-full ${
                  index < currentLevel 
                    ? 'bg-green-500' 
                    : index === currentLevel 
                    ? 'bg-blue-500' 
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