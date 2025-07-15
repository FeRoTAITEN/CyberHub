'use client';

import { useState, useMemo } from 'react';
import Navigation from '@/components/Navigation';
import { 
  QuestionMarkCircleIcon,
  MagnifyingGlassIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  DocumentTextIcon,
  ShieldCheckIcon,
  LockClosedIcon,
  ComputerDesktopIcon,
  UserIcon,
  GlobeAltIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';
import { useLang } from '../ClientLayout';
import { useTranslation } from '@/lib/useTranslation';

// بيانات الأسئلة والأجوبة
const qaData = [
  {
    id: 1,
    category: 'general',
    question: {
      en: 'What is cybersecurity?',
      ar: 'ما هو الأمن السيبراني؟'
    },
    answer: {
      en: 'Cybersecurity is the practice of protecting systems, networks, and programs from digital attacks. These cyberattacks are usually aimed at accessing, changing, or destroying sensitive information, extorting money from users, or interrupting normal business processes.',
      ar: 'الأمن السيبراني هو ممارسة حماية الأنظمة والشبكات والبرامج من الهجمات الرقمية. هذه الهجمات السيبرانية تهدف عادة إلى الوصول إلى المعلومات الحساسة أو تغييرها أو تدميرها، أو ابتزاز المال من المستخدمين، أو تعطيل العمليات التجارية العادية.'
    },
    tags: ['basics', 'security'],
    difficulty: 'beginner'
  },
  {
    id: 2,
    category: 'passwords',
    question: {
      en: 'How to create a strong password?',
      ar: 'كيف أنشئ كلمة مرور قوية؟'
    },
    answer: {
      en: 'A strong password should be at least 12 characters long and include a mix of uppercase and lowercase letters, numbers, and special characters. Avoid using personal information like birthdays or names. Consider using a passphrase or password manager.',
      ar: 'يجب أن تكون كلمة المرور القوية بطول 12 حرف على الأقل وتتضمن مزيجاً من الأحرف الكبيرة والصغيرة والأرقام والرموز الخاصة. تجنب استخدام المعلومات الشخصية مثل أعياد الميلاد أو الأسماء. فكر في استخدام عبارة مرور أو مدير كلمات المرور.'
    },
    tags: ['passwords', 'security'],
    difficulty: 'beginner'
  },
  {
    id: 3,
    category: 'phishing',
    question: {
      en: 'How to identify phishing emails?',
      ar: 'كيف أميز رسائل التصيد الاحتيالي؟'
    },
    answer: {
      en: 'Phishing emails often have urgent language, poor grammar, suspicious links, and requests for personal information. Check the sender\'s email address carefully, hover over links to see the actual URL, and never click on suspicious attachments.',
      ar: 'رسائل التصيد الاحتيالي غالباً ما تحتوي على لغة عاجلة وأخطاء نحوية وروابط مشبوهة وطلبات للمعلومات الشخصية. تحقق من عنوان البريد الإلكتروني للمرسل بعناية، مرر المؤشر فوق الروابط لرؤية الرابط الفعلي، ولا تنقر أبداً على المرفقات المشبوهة.'
    },
    tags: ['phishing', 'email', 'security'],
    difficulty: 'intermediate'
  },
  {
    id: 4,
    category: 'malware',
    question: {
      en: 'What is malware and how to protect against it?',
      ar: 'ما هو البرمجيات الخبيثة وكيف أحمي نفسي منها؟'
    },
    answer: {
      en: 'Malware is malicious software designed to harm systems or steal data. To protect against malware: keep software updated, use antivirus software, avoid suspicious downloads, enable firewalls, and be cautious with email attachments.',
      ar: 'البرمجيات الخبيثة هي برامج ضارة مصممة لإلحاق الضرر بالأنظمة أو سرقة البيانات. لحماية نفسك من البرمجيات الخبيثة: حافظ على تحديث البرامج، استخدم برامج مكافحة الفيروسات، تجنب التحميلات المشبوهة، فعّل جدران الحماية، وكن حذراً مع مرفقات البريد الإلكتروني.'
    },
    tags: ['malware', 'protection', 'security'],
    difficulty: 'intermediate'
  },
  {
    id: 5,
    category: 'vpn',
    question: {
      en: 'What is a VPN and when should I use it?',
      ar: 'ما هو VPN ومتى يجب أن أستخدمه؟'
    },
    answer: {
      en: 'A VPN (Virtual Private Network) encrypts your internet connection and hides your IP address. Use a VPN when connecting to public Wi-Fi, accessing sensitive data remotely, or when you want to protect your privacy online.',
      ar: 'VPN (الشبكة الخاصة الافتراضية) تشفر اتصالك بالإنترنت وتخفي عنوان IP الخاص بك. استخدم VPN عند الاتصال بشبكات Wi-Fi العامة، أو الوصول إلى البيانات الحساسة عن بُعد، أو عندما تريد حماية خصوصيتك عبر الإنترنت.'
    },
    tags: ['vpn', 'privacy', 'network'],
    difficulty: 'intermediate'
  },
  {
    id: 6,
    category: 'social',
    question: {
      en: 'How to stay safe on social media?',
      ar: 'كيف أبقى آمناً على وسائل التواصل الاجتماعي؟'
    },
    answer: {
      en: 'Use strong privacy settings, be careful about what you share publicly, avoid clicking on suspicious links, don\'t share personal information, use two-factor authentication, and be cautious of friend requests from unknown people.',
      ar: 'استخدم إعدادات خصوصية قوية، كن حذراً مما تشاركه علناً، تجنب النقر على الروابط المشبوهة، لا تشارك المعلومات الشخصية، استخدم المصادقة الثنائية، وكن حذراً من طلبات الصداقة من أشخاص غير معروفين.'
    },
    tags: ['social-media', 'privacy', 'security'],
    difficulty: 'beginner'
  },
  {
    id: 7,
    category: 'encryption',
    question: {
      en: 'What is encryption and why is it important?',
      ar: 'ما هو التشفير ولماذا هو مهم؟'
    },
    answer: {
      en: 'Encryption converts data into a code to prevent unauthorized access. It\'s crucial for protecting sensitive information like passwords, financial data, and personal communications. Modern encryption uses complex algorithms that are virtually impossible to break.',
      ar: 'التشفير يحول البيانات إلى رمز لمنع الوصول غير المصرح به. إنه ضروري لحماية المعلومات الحساسة مثل كلمات المرور والبيانات المالية والاتصالات الشخصية. التشفير الحديث يستخدم خوارزميات معقدة من المستحيل كسرها تقريباً.'
    },
    tags: ['encryption', 'security', 'data-protection'],
    difficulty: 'advanced'
  },
  {
    id: 8,
    category: 'incident',
    question: {
      en: 'What should I do if I suspect a security breach?',
      ar: 'ماذا يجب أن أفعل إذا اشتبهت في حدوث خرق أمني؟'
    },
    answer: {
      en: 'Immediately disconnect from the internet, change all passwords, contact your IT department or security team, document everything, preserve evidence, and follow your organization\'s incident response procedures.',
      ar: 'افصل عن الإنترنت فوراً، غيّر جميع كلمات المرور، اتصل بقسم تكنولوجيا المعلومات أو فريق الأمان، وثق كل شيء، احفظ الأدلة، واتبع إجراءات الاستجابة للحوادث في مؤسستك.'
    },
    tags: ['incident-response', 'breach', 'security'],
    difficulty: 'intermediate'
  },
  {
    id: 9,
    category: 'backup',
    question: {
      en: 'How often should I backup my data?',
      ar: 'كم مرة يجب أن أحفظ نسخة احتياطية من بياناتي؟'
    },
    answer: {
      en: 'For critical business data, backup daily or even multiple times per day. For personal data, weekly backups are usually sufficient. Use the 3-2-1 rule: 3 copies, 2 different media types, 1 off-site location.',
      ar: 'للبيانات التجارية الحرجة، احفظ نسخة احتياطية يومياً أو حتى عدة مرات في اليوم. للبيانات الشخصية، النسخ الاحتياطية الأسبوعية كافية عادة. استخدم قاعدة 3-2-1: 3 نسخ، نوعين مختلفين من الوسائط، موقع واحد خارجي.'
    },
    tags: ['backup', 'data-protection', 'recovery'],
    difficulty: 'beginner'
  },
  {
    id: 10,
    category: 'compliance',
    question: {
      en: 'What are common cybersecurity compliance standards?',
      ar: 'ما هي معايير الامتثال الأمني السيبراني الشائعة؟'
    },
    answer: {
      en: 'Common standards include ISO 27001, NIST Cybersecurity Framework, GDPR, HIPAA, PCI DSS, and SOC 2. These frameworks provide guidelines for implementing security controls and protecting sensitive data.',
      ar: 'المعايير الشائعة تشمل ISO 27001، إطار عمل الأمن السيبراني NIST، GDPR، HIPAA، PCI DSS، وSOC 2. هذه الأطر توفر إرشادات لتنفيذ ضوابط الأمان وحماية البيانات الحساسة.'
    },
    tags: ['compliance', 'standards', 'regulations'],
    difficulty: 'advanced'
  }
];

// فئات الأسئلة
const categories = [
  { id: 'all', name: { en: 'All Questions', ar: 'جميع الأسئلة' }, icon: QuestionMarkCircleIcon },
  { id: 'general', name: { en: 'General Security', ar: 'الأمان العام' }, icon: ShieldCheckIcon },
  { id: 'passwords', name: { en: 'Passwords', ar: 'كلمات المرور' }, icon: LockClosedIcon },
  { id: 'phishing', name: { en: 'Phishing', ar: 'التصيد الاحتيالي' }, icon: ExclamationTriangleIcon },
  { id: 'malware', name: { en: 'Malware', ar: 'البرمجيات الخبيثة' }, icon: ComputerDesktopIcon },
  { id: 'vpn', name: { en: 'VPN & Privacy', ar: 'VPN والخصوصية' }, icon: GlobeAltIcon },
  { id: 'social', name: { en: 'Social Media', ar: 'وسائل التواصل' }, icon: UserIcon },
  { id: 'encryption', name: { en: 'Encryption', ar: 'التشفير' }, icon: DocumentTextIcon },
  { id: 'incident', name: { en: 'Incident Response', ar: 'الاستجابة للحوادث' }, icon: CheckCircleIcon },
  { id: 'backup', name: { en: 'Backup & Recovery', ar: 'النسخ الاحتياطي' }, icon: DocumentTextIcon },
  { id: 'compliance', name: { en: 'Compliance', ar: 'الامتثال' }, icon: ShieldCheckIcon }
];

export default function QAPage() {
  const { lang } = useLang();
  const { t } = useTranslation(lang);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [expandedItems, setExpandedItems] = useState<number[]>([]);

  // تصفية الأسئلة حسب البحث والفئة
  const filteredQA = useMemo(() => {
    return qaData.filter(item => {
      const matchesSearch = searchTerm === '' || 
        item.question[lang].toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.answer[lang].toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchTerm, selectedCategory, lang]);

  const toggleExpanded = (id: number) => {
    setExpandedItems(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  // إحصائيات Q&A
  const stats = [
    { label: lang === 'ar' ? 'إجمالي الأسئلة' : 'Total Questions', value: qaData.length.toString(), icon: '❓' },
    { label: lang === 'ar' ? 'الأسئلة المطروحة' : 'Questions Asked', value: '1,247', icon: '💬' }
  ];

  return (
    <div className="min-h-screen gradient-bg">
      <Navigation />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header Section */}
        <div className="page-header">
          <div className="page-header-icon icon-animate">
            <QuestionMarkCircleIcon className="w-12 h-12 text-white" />
          </div>
          <h1 className="page-title title-animate">
            {lang === 'ar' ? 'الأسئلة الشائعة' : 'Q&A'}
          </h1>
          <p className="page-subtitle subtitle-animate">
            {lang === 'ar' 
              ? 'إجابات على أكثر الأسئلة شيوعاً في مجال الأمن السيبراني'
              : 'Answers to the most common cybersecurity questions'}
          </p>
        </div>

        {/* Dashboard Grid Layout */}
        {/* Vertical Layout: إحصائيات ثم البحث والفلاتر */}
        <div className="flex flex-col gap-6 mb-6 content-animate">
          {/* إحصائيات */}
          <div className="card p-6">
            <h2 className="heading-2 mb-4 flex items-center gap-2">
              <span className="text-2xl">📊</span>
              <span>{lang === 'ar' ? 'إحصائيات الأسئلة' : 'Q&A Statistics'}</span>
            </h2>
            <div className="grid grid-cols-2 gap-4">
          {stats.map((stat, index) => (
                <div key={index} className="text-center p-3 bg-slate-800 rounded-lg stat-card">
              <div className="text-2xl mb-2">{stat.icon}</div>
                  <div className="text-xl font-bold text-green-400 mb-1">{stat.value}</div>
                  <div className="text-slate-300 text-xs mb-2">{stat.label}</div>
            </div>
          ))}
        </div>
          </div>
          {/* البحث والفلاتر */}
          <div className="card p-6">
            <h2 className="heading-2 mb-4 flex items-center gap-2">
              <MagnifyingGlassIcon className="w-5 h-5 text-green-400" />
              <span>{lang === 'ar' ? 'بحث وفلاتر' : 'Search & Filters'}</span>
            </h2>
            {/* Search Bar */}
            <div className="relative mb-6">
              <MagnifyingGlassIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder={lang === 'ar' ? 'ابحث في الأسئلة والأجوبة...' : 'Search questions and answers...'}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-field pl-12 pr-4 py-3"
              />
            </div>
            {/* Category Filter */}
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => {
                const Icon = category.icon;
                return (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      selectedCategory === category.id
                        ? 'bg-green-600 text-white shadow-lg'
                        : 'bg-slate-700 text-slate-300 hover:bg-slate-600 hover:text-white'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{category.name[lang]}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* عدد النتائج */}
        <div className="mb-6 content-animate">
          <p className="text-slate-300">
            {lang === 'ar' 
              ? `تم العثور على ${filteredQA.length} سؤال`
              : `Found ${filteredQA.length} questions`}
          </p>
        </div>

        {/* قائمة الأسئلة والأجوبة */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 content-animate">
          {filteredQA.length === 0 ? (
            <div className="card p-8 text-center col-span-full">
              <QuestionMarkCircleIcon className="w-16 h-16 text-slate-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">
                {lang === 'ar' ? 'لا توجد نتائج' : 'No results found'}
              </h3>
              <p className="text-slate-400">
                {lang === 'ar' 
                  ? 'جرب تغيير كلمات البحث أو الفئة المحددة'
                  : 'Try changing your search terms or selected category'}
              </p>
            </div>
          ) : (
            filteredQA.map((item, index) => {
              const isExpanded = expandedItems.includes(item.id);
                             const category = categories.find(cat => cat.id === item.category);
              return (
                <div key={item.id} className="card stagger-animate transition-all duration-300">
                  <button
                    onClick={() => toggleExpanded(item.id)}
                    className="w-full text-right md:text-left p-6 hover:bg-slate-700/50 transition-all duration-200 rounded-lg"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <span className="px-2 py-1 bg-slate-700 text-xs font-medium rounded text-slate-300">
                            {item.difficulty}
                          </span>
                          {category && (
                            <span className="px-2 py-1 bg-green-600/20 text-green-400 text-xs font-medium rounded">
                              {category.name[lang]}
                            </span>
                          )}
                        </div>
                        <h3 className="text-lg font-semibold text-white mb-2 pr-8">
                          {item.question[lang]}
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          {item.tags.map((tag) => (
                            <span 
                              key={tag}
                              className="px-2 py-1 bg-slate-800 text-xs text-slate-400 rounded"
                            >
                              #{tag}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="flex-shrink-0">
                        {isExpanded ? (
                          <ChevronUpIcon className="w-6 h-6 text-slate-400" />
                        ) : (
                          <ChevronDownIcon className="w-6 h-6 text-slate-400" />
                        )}
                      </div>
                    </div>
                  </button>
                  {isExpanded && (
                    <div className="px-6 pb-6">
                      <div className="border-t border-slate-700 pt-4">
                        <p className="text-slate-300 leading-relaxed">
                          {item.answer[lang]}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* قسم المساعدة */}
        <div className="mt-12 content-animate">
          <div className="card border-green-500/30 p-8">
            <div className={`flex items-start ${lang === 'ar' ? 'space-x-reverse space-x-4' : 'space-x-4'}`}>
              <QuestionMarkCircleIcon className="w-7 h-7 text-green-400 mt-1 flex-shrink-0" />
              <div>
                <h3 className="text-xl font-semibold text-white mb-4">
                  {lang === 'ar' ? 'هل لديك سؤال آخر؟' : 'Have another question?'}
                </h3>
                <p className="text-slate-300 leading-relaxed text-base mb-4">
                  {lang === 'ar' 
                    ? 'إذا لم تجد إجابة لسؤالك هنا، يمكنك التواصل مع فريق الأمن السيبراني للحصول على المساعدة.'
                    : 'If you couldn\'t find an answer to your question here, you can contact the cybersecurity team for assistance.'}
                </p>
                <button className="btn-primary">
                  {lang === 'ar' ? 'تواصل معنا' : 'Contact Us'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
} 