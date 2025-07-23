'use client';

import Navigation from '@/components/Navigation';
import { useLang } from '../ClientLayout';
import { useTheme } from '../ClientLayout';
import { useTranslation } from '@/lib/useTranslation';
import { ChartBarIcon } from '@heroicons/react/24/outline';

// Service data in both languages
const servicesData = {
  en: [
    {
      name: 'Security Information and Event Management',
      description: `Our SIEM service provides real‑time monitoring and analysis of your network's security‑related data to identify potential threats and vulnerabilities. Our team of cybersecurity experts uses advanced technology and proven methodologies to detect, respond to, and prevent security incidents, minimizing the risk of data breaches and cyber‑attacks.`
    },
    {
      name: 'Vulnerability Scanning & Penetration Testing - VAPT',
      description: `Our VSPT service is designed to help businesses like yours identify and address potential security threats. Our team of experts uses advanced tools and techniques to scan your systems and networks for vulnerabilities, and then simulates real‑world attacks to test your defenses.`
    },
    {
      name: 'Virtual-Firewall as a Service',
      description: `Our Virtual Firewall service is a cloud‑based solution that provides a secure and scalable way to protect your business network from cyber threats. Our team of experts will monitor and manage your firewall 24/7, ensuring that your business is always protected.`
    },
    {
      name: 'Security Service Edge',
      description: `Security Service Edge (SSE) is a cloud‑native security service built on the industry‑leading Zscaler platform. Our SSE service provides a comprehensive and converged security solution for secure access to applications, data, and services from anywhere, on any device, and at any time. By consolidating multiple security functions into a single platform, including firewall‑as‑a‑service, secure web gateway, cloud access security broker (CASB), and zero‑trust network access (ZTNA), we offer advanced threat protection, data protection, and simplified security management.`
    },
    {
      name: 'Security Device Management - Managed Firewall',
      description: `Our Security Device Management service ensures proactive monitoring and maintenance of your security infrastructure, optimizing device performance, reducing downtime, and enhancing security, while freeing up internal resources.`
    },
    {
      name: 'Web Application Firewall',
      description: `Our Web Application Firewall service is designed to protect your business from cyber threats by effectively monitoring and filtering incoming traffic to your web applications and websites. The Web Application Firewall service ensures the security of your business by detecting and preventing attacks in real‑time.`
    },
    {
      name: 'Secure Email Gateway',
      description: `Salam's Email Security service is a comprehensive solution designed to protect your business emails from various types of cyber threats. Our service is hosted in Saudi Arabia, ensuring compliance with local regulations and data residency requirements.`
    },
    {
      name: 'DDoS Protection',
      description: `Our DDoS Protection service is designed to detect and mitigate Distributed Denial‑of‑Service (DDoS) attacks, ensuring your website and online applications remain available and secure. Our team of experts will monitor your network traffic 24/7, identifying and blocking malicious traffic before it affects your business.`
    },
    {
      name: 'Security Awareness Service',
      description: `Our Security Awareness service is designed to help businesses like yours protect themselves from cyber threats. Our expert team will work with you to educate your employees on the latest security threats, phishing attacks, and best practices to keep your business safe.`
    },
    {
      name: 'Phishing Attack Simulation',
      description: `Our Phishing Attack Simulation service is a controlled, simulated phishing attack on your employees to test their susceptibility to phishing emails. Our expert team will design and execute a customized phishing campaign to mimic real‑world attacks, providing you with valuable insights into your organization's vulnerabilities.`
    },
    {
      name: 'Threat Intelligence',
      description: `Salam’s Threat intelligence (TI) service is the industry’s first threat intelligence platform designed to enable threat operations and management and is the only solution with an integrated Threat Library, Adaptive Workbench and Open Exchange that helps to act upon the most relevant threats facing the organization and to get more out of the existing security.`
    }
  ],
  ar: [
    {
      name: 'إدارة المعلومات والأحداث الأمنية (SIEM)',
      description: 'خدمة SIEM من سلام توفر مراقبة وتحليل لحظي لبيانات الأمن في شبكتك لتحديد التهديدات والثغرات والاستجابة لها بشكل سريع، مع تقارير لمتطلبات الامتثال.'
    },
    {
      name: 'تقييم الثغرات واختبار الاختراق (VAPT)',
      description: 'خدمة VAPT تساعد الشركات على تحديد ومعالجة التهديدات الأمنية باستخدام أدوات وتقنيات متقدمة لفحص الأنظمة والشبكات ومحاكاة هجمات حقيقية.'
    },
    {
      name: 'جدار الحماية الافتراضي كخدمة',
      description: 'خدمة جدار الحماية الافتراضي السحابي توفر حماية قابلة للتوسع للشبكة، مع مراقبة وإدارة على مدار الساعة بواسطة فريق خبراء سلام.'
    },
    {
      name: 'Security Service Edge',
      description: 'حل SSE سحابي مبني على منصة Zscaler يوحد وظائف الأمن مثل FWaaS وSWG وCASB وZTNA لحماية الوصول لتطبيقات وبيانات مؤسستك من أي مكان.'
    },
    {
      name: 'إدارة الأجهزة الأمنية – جدار حماية مدار',
      description: 'خدمة إدارة الأجهزة الأمنية تشمل مراقبة وصيانة استباقية للبنية الأمنية لتحسين الأداء وتقليل الأعطال وتحرير مواردك الداخلية.'
    },
    {
      name: 'جدار حماية تطبيقات الويب (WAF)',
      description: 'حماية متقدمة لتطبيقات الويب من الهجمات الشائعة مثل SQL Injection وXSS عبر جدار حماية مخصص لمستوى التطبيقات.'
    },
    {
      name: 'البوابة الآمنة للبريد الإلكتروني',
      description: 'حل Gateway يحمي البريد الإلكتروني من التهديدات مثل التصيد والبرمجيات الخبيثة، مع فحص محتوى الرسائل والتأكد من أمانها.'
    },
    {
      name: 'الحماية من هجمات DDoS',
      description: 'خدمة دفاع ضد هجمات حجب الخدمة الموزعة لحماية البنية التحتية والتطبيقات من انقطاع الخدمة بسبب ضغط مروري ضار.'
    },
    {
      name: 'التوعية بالأمن السيبراني',
      description: 'خدمة تهدف لتثقيف الموظفين حول أحدث التهديدات وأفضل ممارسات الأمن، مع محاكاة التصيد وتطوير سياسات أمان وخطط استجابة للحوادث.'
    },
    {
      name: 'محاكاة الهجوم عبر التصيد الإلكتروني',
      description: 'خدمة تدريبية لقياس مدى وعي موظفيك عبر إرسال رسائل تصيد محاكاة بهدف تحسين قدرتهم على اكتشاف الهجمات الحقيقية.'
    }
  ]
};

export default function ServicesPage() {
  const { lang } = useLang();
  const { t } = useTranslation(lang);
  const { theme } = useTheme();
  const dir = lang === 'ar' ? 'rtl' : 'ltr';
  const services = servicesData[lang] || servicesData.en;

  // Modern, theme-aware card design with icons
  const isDark = theme === 'default' || theme === 'cyber' || theme === 'midnight';
  const cardBg = isDark ? 'bg-slate-900' : 'bg-white';
  const cardTitle = isDark ? 'text-white' : 'text-slate-900';
  const cardDesc = isDark ? 'text-slate-400' : 'text-slate-600';
  const cardShadow = isDark ? 'shadow-lg' : 'shadow-md';
  const cardHover = isDark ? 'hover:shadow-2xl' : 'hover:shadow-lg';
  const cardClass = `card p-6 rounded-xl border-2 border-transparent ${cardBg} ${cardShadow} transition-all duration-200 hover:-translate-y-1 hover:border-green-500 ${cardHover} flex flex-col h-full items-center text-center`;

  return (
    <div className="min-h-screen gradient-bg">
      <Navigation />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Page Header */}
        <div className="page-header content-animate">
          <div className="page-header-icon icon-animate">
            <ChartBarIcon className="w-12 h-12 text-white" />
          </div>
          <h1 className="page-title title-animate">
            {lang === 'ar' ? 'الخدمات' : 'Services'}
          </h1>
          <p className="page-subtitle subtitle-animate">
            {lang === 'ar' ? 'مجموعة متكاملة من خدمات الأمن السيبراني الحديثة.' : 'A comprehensive suite of modern cybersecurity services.'}
          </p>
        </div>
        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12 content-animate">
          {services.map((service, idx) => (
            <div
              key={idx}
              className={cardClass}
              dir={dir}
              style={{ animationDelay: `${0.1 * (idx + 1)}s` }}
            >
              {/* Service Icon (default: ChartBarIcon) */}
              <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-3 ${isDark ? 'bg-slate-800' : 'bg-slate-200'}`}>
                <ChartBarIcon className={`w-6 h-6 ${isDark ? 'text-green-400' : 'text-green-600'}`} />
              </div>
              <h2 className={`text-lg font-bold mb-2 ${cardTitle}`}>{service.name}</h2>
              <p className={`text-sm ${cardDesc}`}>{service.description}</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
} 