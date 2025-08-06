"use client";

import Navigation from "@/components/Navigation";
import {
  ShieldCheckIcon,
  EyeIcon,
  UserGroupIcon,
  CogIcon,
  ChartBarIcon,
  DocumentTextIcon,
  ComputerDesktopIcon,
  LockClosedIcon,
  StarIcon,
  TrophyIcon,
  AcademicCapIcon,
  HeartIcon,
  SparklesIcon,
  GlobeAltIcon,
} from "@heroicons/react/24/outline";
import { useLang, useTheme } from "../ClientLayout";
import { useTranslation } from "@/lib/useTranslation";
import Image from "next/image";

export default function AboutPage() {
  const { lang } = useLang();
  const { theme } = useTheme();
  const { t } = useTranslation(lang);
  
  const isSalam = theme === 'salam';

  // ألوان Salam المخصصة
  const salamColors = {
    text: '#003931',
    textSecondary: '#005147',
    accent: '#36C639',
    accentLight: '#73F64B',
    background: '#FFFFFF',
    cardBg: '#F8FFFE',
    cardBorder: '#E6F7F0',
    buttonBg: '#36C639',
    buttonHover: '#2BA32E',
    iconBg: '#E6F7F0',
    iconColor: '#36C639',
    success: '#36C639',
    warning: '#FFA500',
    danger: '#FF4444',
    info: '#36C639'
  };

  // بيانات نائب رئيس القسم
  const deputyManager = {
    name: lang === "ar" ? "أيمن الفاضل" : "Ayman S AlFadhel",
    position:
      lang === "ar"
        ? "نائب رئيس قسم الأمن السيبراني"
        : "VP of Cyber Security Sector",
    image: "/images/deputy-manager.jpg",
    message:
      lang === "ar"
        ? "نفخر بفريق الأمن السيبراني المتميز في شركة Salam، حيث نعمل بجد لضمان حماية الأصول الرقمية للشركة وتطبيق أعلى معايير الأمان. نحن ملتزمون بالابتكار والتطوير المستمر لمواكبة التحديات الأمنية المتزايدة."
        : "We are proud of the distinguished cybersecurity team at Salam Company, where we work hard to ensure the protection of the company's digital assets and apply the highest security standards. We are committed to innovation and continuous development to keep pace with increasing security challenges.",
    experience: lang === "ar" ? "15+ سنة خبرة" : "15+ Years Experience",
    certifications: lang === "ar" ? "CISSP, CISM, CEH" : "CISSP, CISM, CEH",
  };

  // بيانات الموظفين المميزين
  const featuredEmployees = [
    {
      name: lang === "ar" ? "سارة أحمد القحطاني" : "Sara Ahmed Al-Qahtani",
      position:
        lang === "ar" ? "مديرة مراقبة الأمان" : "Security Monitoring Manager",
      image: "/images/employee-1.jpg",
      message:
        lang === "ar"
          ? "العمل في مجال الأمن السيبراني يتطلب تحديثاً مستمراً للمعرفة والمهارات. نحن نواكب أحدث التهديدات والتقنيات لحماية الشركة."
          : "Working in cybersecurity requires continuous updating of knowledge and skills. We keep up with the latest threats and technologies to protect the company.",
      expertise:
        lang === "ar"
          ? "تحليل التهديدات، مراقبة الأمان"
          : "Threat Analysis, Security Monitoring",
    },
    {
      name:
        lang === "ar" ? "محمد عبدالله الحربي" : "Mohammed Abdullah Al-Harbi",
      position:
        lang === "ar"
          ? "مهندس أمن البنية التحتية"
          : "Infrastructure Security Engineer",
      image: "/images/employee-2.jpg",
      message:
        lang === "ar"
          ? "نصمم وننفذ حلول أمنية متقدمة لحماية البنية التحتية التقنية للشركة من التهديدات المتطورة."
          : "We design and implement advanced security solutions to protect the company's technical infrastructure from evolving threats.",
      expertise:
        lang === "ar"
          ? "أمن الشبكات، حماية البنية التحتية"
          : "Network Security, Infrastructure Protection",
    },
    {
      name: lang === "ar" ? "فاطمة علي الدوسري" : "Fatimah Ali Al-Dosari",
      position:
        lang === "ar"
          ? "مختصة الامتثال الأمني"
          : "Security Compliance Specialist",
      image: "/images/employee-3.jpg",
      message:
        lang === "ar"
          ? "نضمن امتثال الشركة لأحدث المعايير واللوائح الأمنية، ونطور السياسات والإجراءات المناسبة."
          : "We ensure the company's compliance with the latest security standards and regulations, and develop appropriate policies and procedures.",
      expertise:
        lang === "ar"
          ? "الامتثال، تطوير السياسات"
          : "Compliance, Policy Development",
    },
  ];

  // بيانات الجوائز والتكريمات
  const awards = [
    {
      title:
        lang === "ar"
          ? "أفضل قسم أمن سيبراني"
          : "Best Cybersecurity Department",
      organization:
        lang === "ar"
          ? "جوائز التميز التقني 2024"
          : "Technology Excellence Awards 2024",
      date: "2024",
      description:
        lang === "ar"
          ? "تكريم قسم الأمن السيبراني كأفضل قسم في مجال الأمن السيبراني على مستوى المملكة"
          : "Honoring the Cybersecurity Sector as the best Sector in cybersecurity at the Kingdom level",
      icon: TrophyIcon,
      color: "bg-yellow-600",
    },
    {
      title:
        lang === "ar"
          ? "شهادة الامتثال الأمني"
          : "Security Compliance Certificate",
      organization:
        lang === "ar"
          ? "الهيئة السعودية للأمن السيبراني"
          : "Saudi Cybersecurity Authority",
      date: "2023",
      description:
        lang === "ar"
          ? "حصول الشركة على شهادة الامتثال لأعلى معايير الأمن السيبراني"
          : "The company obtained a compliance certificate for the highest cybersecurity standards",
      icon: ShieldCheckIcon,
      color: "bg-green-600",
    },
    {
      title:
        lang === "ar" ? "جائزة الابتكار الأمني" : "Security Innovation Award",
      organization:
        lang === "ar"
          ? "منتدى الأمن السيبراني الخليجي"
          : "Gulf Cybersecurity Forum",
      date: "2023",
      description:
        lang === "ar"
          ? "تكريم الابتكارات الأمنية المطبقة في حماية البنية التحتية"
          : "Honoring security innovations applied in infrastructure protection",
      icon: SparklesIcon,
      color: "bg-purple-600",
    },
    {
      title:
        lang === "ar"
          ? "شهادة التدريب المعتمدة"
          : "Certified Training Certificate",
      organization:
        lang === "ar"
          ? "المعهد الدولي للأمن السيبراني"
          : "International Cybersecurity Institute",
      date: "2023",
      description:
        lang === "ar"
          ? "اعتماد برامج التدريب والتوعية الأمنية المقدمة للموظفين"
          : "Accreditation of security training and awareness programs provided to employees",
      icon: AcademicCapIcon,
      color: "bg-blue-600",
    },
  ];

  const services = [
    {
      title:
        lang === "ar" ? "حماية البنية التحتية" : "Infrastructure Protection",
      description:
        lang === "ar"
          ? "حماية الأنظمة والشبكات والبنية التحتية التقنية للشركة"
          : "Protecting systems, networks, and technical infrastructure",
      icon: ComputerDesktopIcon,
      color: "bg-blue-600",
    },
    {
      title:
        lang === "ar" ? "إدارة الهوية والوصول" : "Identity & Access Management",
      description:
        lang === "ar"
          ? "إدارة هويات المستخدمين والتحكم في الصلاحيات والوصول"
          : "Managing user identities and controlling permissions",
      icon: LockClosedIcon,
      color: "bg-green-600",
    },
    {
      title: lang === "ar" ? "مراقبة الأمان" : "Security Monitoring",
      description:
        lang === "ar"
          ? "مراقبة مستمرة للأنظمة للكشف عن التهديدات الأمنية"
          : "Continuous system monitoring to detect security threats",
      icon: ChartBarIcon,
      color: "bg-purple-600",
    },
    {
      title: lang === "ar" ? "استجابة الحوادث" : "Incident Response",
      description:
        lang === "ar"
          ? "التعامل السريع والفعال مع الحوادث الأمنية"
          : "Quick and effective response to security incidents",
      icon: ShieldCheckIcon,
      color: "bg-red-600",
    },
    {
      title: lang === "ar" ? "التدريب والتوعية" : "Training & Awareness",
      description:
        lang === "ar"
          ? "تدريب الموظفين على أفضل الممارسات الأمنية"
          : "Training employees on security best practices",
      icon: UserGroupIcon,
      color: "bg-yellow-600",
    },
    {
      title: lang === "ar" ? "تطوير السياسات" : "Policy Development",
      description:
        lang === "ar"
          ? "وضع وتحديث السياسات والإجراءات الأمنية"
          : "Developing and updating security policies and procedures",
      icon: DocumentTextIcon,
      color: "bg-green-600",
    },
  ];

  const teamStructure = [
    {
      title: lang === "ar" ? "مدير الأمن السيبراني" : "Cyber Security Manager",
      description:
        lang === "ar"
          ? "الإشراف العام على جميع العمليات الأمنية"
          : "General supervision of all security operations",
      count: 1,
    },
    {
      title: lang === "ar" ? "محللو الأمان" : "Security Analysts",
      description:
        lang === "ar"
          ? "تحليل التهديدات والاستجابة للحوادث"
          : "Threat analysis and incident response",
      count: 5,
    },
    {
      title: lang === "ar" ? "مهندسو الأمان" : "Security Engineers",
      description:
        lang === "ar"
          ? "تصميم وتنفيذ الحلول الأمنية"
          : "Designing and implementing security solutions",
      count: 8,
    },
    {
      title: lang === "ar" ? "مختصو الامتثال" : "Compliance Specialists",
      description:
        lang === "ar"
          ? "ضمان الامتثال للمعايير واللوائح"
          : "Ensuring compliance with standards and regulations",
      count: 3,
    },
    {
      title: lang === "ar" ? "مختصو التدريب" : "Training Specialists",
      description:
        lang === "ar"
          ? "التدريب والتوعية الأمنية"
          : "Security training and awareness",
      count: 2,
    },
    {
      title: lang === "ar" ? "مختصو الدعم" : "Support Specialists",
      description:
        lang === "ar"
          ? "الدعم الفني والمساعدة"
          : "Technical support and assistance",
      count: 6,
    },
  ];

  return (
    <div className="min-h-screen gradient-bg">
      <Navigation />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="page-header">
          <div className="page-header-icon icon-animate">
            <ShieldCheckIcon className={`w-12 h-12 ${isSalam ? 'text-[#36C639]' : 'text-white'}`} />
          </div>
          <h1 className={`page-title title-animate ${isSalam ? 'text-[#003931]' : ''}`}>
            {lang === "ar" ? "قسم الأمن السيبراني" : "Cyber Security Sector"}
          </h1>
          <p className={`page-subtitle subtitle-animate ${isSalam ? 'text-white' : ''}`}>
            {lang === "ar"
              ? "نحن نحمي الأصول الرقمية لشركة Salam ونضمن أمانها من خلال أحدث التقنيات وأفضل الممارسات الأمنية"
              : "We protect Salam Company's digital assets and ensure their security through the latest technologies and best security practices"}
          </p>
        </div>

        {/* نائب رئيس القسم */}
        <div className="mb-16 content-animate">
          <h2 className={`heading-2 mb-8 text-center ${isSalam ? 'text-[#003931]' : ''}`}>
            {lang === "ar" ? "كلمة نائب رئيس القسم" : "Deputy Head Message"}
          </h2>
          <div className={`card max-w-4xl mx-auto ${isSalam ? 'bg-[#F8FFFE] border-[#E6F7F0]' : ''}`}>
            <div className="flex flex-col lg:flex-row items-center gap-8">
              <div className="flex-shrink-0">
                <div className={`w-48 h-48 rounded-full overflow-hidden border-4 ${isSalam ? 'border-[#36C639]/30' : 'border-green-500/30'}`}>
                  <div className={`w-full h-full ${isSalam ? 'bg-[#E6F7F0]' : 'bg-slate-700'} flex items-center justify-center`}>
                    <UserGroupIcon className={`w-20 h-20 ${isSalam ? 'text-[#36C639]' : 'text-slate-400'}`} />
                  </div>
                </div>
              </div>
              <div
                className={`flex-1 ${
                  lang === "ar" ? "text-right" : "text-left"
                }`}
              >
                <h3 className={`text-2xl font-bold mb-2 ${isSalam ? 'text-[#003931]' : 'text-white'}`}>
                  {deputyManager.name}
                </h3>
                <p className={`mb-4 ${isSalam ? 'text-[#36C639]' : 'text-green-400'}`}>{deputyManager.position}</p>
                <div className="flex justify-center lg:justify-start gap-4 mb-6">
                  <span className={`text-sm ${isSalam ? 'text-[#005147]' : 'text-slate-400'}`}>
                    {deputyManager.experience}
                  </span>
                  <span className={`text-sm ${isSalam ? 'text-[#005147]' : 'text-slate-400'}`}>•</span>
                  <span className={`text-sm ${isSalam ? 'text-[#005147]' : 'text-slate-400'}`}>
                    {deputyManager.certifications}
                  </span>
                </div>
                <p className={`body-text leading-relaxed ${isSalam ? 'text-[#005147]' : ''}`}>
                  {deputyManager.message}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Mission & Vision */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12 content-animate">
          <div
            className={`card stagger-animate ${
              lang === "ar" ? "text-right" : "text-left"
            } ${isSalam ? 'bg-[#F8FFFE] border-[#E6F7F0]' : ''}`}
          >
            <div className="flex items-center mb-4">
              <div
                className={`w-12 h-12 ${isSalam ? 'bg-[#36C639]' : 'bg-blue-600'} rounded-lg flex items-center justify-center ${
                  lang === "ar" ? "ml-4" : "mr-4"
                }`}
              >
                <EyeIcon className="w-6 h-6 text-white" />
              </div>
              <h2 className={`heading-3 ${isSalam ? 'text-[#003931]' : ''}`}>
                {lang === "ar" ? "رؤيتنا" : "Our Vision"}
              </h2>
            </div>
            <p className={`body-text ${isSalam ? 'text-[#005147]' : ''}`}>
              {lang === "ar"
                ? "أن نكون الشريك الاستراتيجي الموثوق في حماية الأصول الرقمية لشركة Salam، وأن نكون نموذجاً يحتذى به في مجال الأمن السيبراني على المستوى المحلي والإقليمي."
                : "To be the trusted strategic partner in protecting Salam Company's digital assets, and to be a role model in cybersecurity at the local and regional levels."}
            </p>
          </div>

          <div
            className={`card stagger-animate ${
              lang === "ar" ? "text-right" : "text-left"
            } ${isSalam ? 'bg-[#F8FFFE] border-[#E6F7F0]' : ''}`}
          >
            <div className="flex items-center mb-4">
              <div
                className={`w-12 h-12 ${isSalam ? 'bg-[#36C639]' : 'bg-green-600'} rounded-lg flex items-center justify-center ${
                  lang === "ar" ? "ml-4" : "mr-4"
                }`}
              >
                <CogIcon className="w-6 h-6 text-white" />
              </div>
              <h2 className={`heading-3 ${isSalam ? 'text-[#003931]' : ''}`}>
                {lang === "ar" ? "مهمتنا" : "Our Mission"}
              </h2>
            </div>
            <p className={`body-text ${isSalam ? 'text-[#005147]' : ''}`}>
              {lang === "ar"
                ? "حماية الأصول الرقمية للشركة من خلال تطبيق أفضل الممارسات الأمنية، وبناء ثقافة أمنية قوية، وضمان استمرارية الأعمال في بيئة رقمية آمنة."
                : "Protecting the company's digital assets by applying best security practices, building a strong security culture, and ensuring business continuity in a secure digital environment."}
            </p>
          </div>
        </div>

        {/* الموظفين المميزين */}
        <div className="mb-16 content-animate">
          <h2 className={`heading-2 mb-8 text-center ${isSalam ? 'text-[#003931]' : ''}`}>
            {lang === "ar" ? "فريقنا المميز" : "Our Distinguished Team"}
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {featuredEmployees.map((employee, index) => (
              <div
                key={index}
                className={`card-hover group stagger-animate ${isSalam ? 'bg-[#F8FFFE] border-[#E6F7F0]' : ''}`}
                style={{ animationDelay: `${0.1 * (index + 1)}s` }}
              >
                <div className="text-center mb-6">
                  <div className={`w-32 h-32 rounded-full overflow-hidden border-4 ${isSalam ? 'border-[#36C639]/30' : 'border-green-500/30'} mx-auto mb-4`}>
                    <div className={`w-full h-full ${isSalam ? 'bg-[#E6F7F0]' : 'bg-slate-700'} flex items-center justify-center`}>
                      <UserGroupIcon className={`w-16 h-16 ${isSalam ? 'text-[#36C639]' : 'text-slate-400'}`} />
                    </div>
                  </div>
                  <h3 className={`text-xl font-bold mb-2 ${isSalam ? 'text-[#003931]' : 'text-white'}`}>
                    {employee.name}
                  </h3>
                  <p className={`mb-2 ${isSalam ? 'text-[#36C639]' : 'text-green-400'}`}>{employee.position}</p>
                  <p className={`text-sm ${isSalam ? 'text-[#005147]' : 'text-slate-400'}`}>{employee.expertise}</p>
                </div>
                <p className={`body-text text-center ${isSalam ? 'text-[#005147]' : ''}`}>{employee.message}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Services */}
        <div className="mb-12 content-animate">
          <h2 className={`heading-2 mb-8 text-center ${isSalam ? 'text-[#003931]' : ''}`}>
            {lang === "ar" ? "خدماتنا" : "Our Services"}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service, index) => {
              const Icon = service.icon;
              return (
                <div
                  key={index}
                  className={`card-hover group stagger-animate ${isSalam ? 'bg-[#F8FFFE] border-[#E6F7F0]' : ''}`}
                  style={{ animationDelay: `${0.1 * (index + 1)}s` }}
                >
                  <div
                    className={`w-12 h-12 ${isSalam ? 'bg-[#36C639]' : service.color} rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}
                  >
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className={`text-lg font-semibold mb-2 ${isSalam ? 'text-[#003931]' : 'text-white'}`}>
                    {service.title}
                  </h3>
                  <p className={`${isSalam ? 'text-[#005147]' : 'text-slate-400'}`}>{service.description}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* الجوائز والتكريمات */}
        <div className="mb-16 content-animate">
          <h2 className={`heading-2 mb-8 text-center ${isSalam ? 'text-[#003931]' : ''}`}>
            {lang === "ar" ? "الجوائز والتكريمات" : "Awards & Recognition"}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {awards.map((award, index) => {
              const Icon = award.icon;
              return (
                <div
                  key={index}
                  className={`card-hover group stagger-animate ${isSalam ? 'bg-[#F8FFFE] border-[#E6F7F0]' : ''}`}
                  style={{ animationDelay: `${0.1 * (index + 1)}s` }}
                >
                  <div className="flex items-start gap-4">
                    <div
                      className={`w-16 h-16 ${isSalam ? 'bg-[#36C639]' : award.color} rounded-lg flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform`}
                    >
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className={`text-lg font-semibold mb-2 ${isSalam ? 'text-[#003931]' : 'text-white'}`}>
                        {award.title}
                      </h3>
                      <p className={`text-sm mb-2 ${isSalam ? 'text-[#36C639]' : 'text-green-400'}`}>
                        {award.organization}
                      </p>
                      <p className={`text-sm mb-3 ${isSalam ? 'text-[#005147]' : 'text-slate-400'}`}>
                        {award.date}
                      </p>
                      <p className={`text-sm ${isSalam ? 'text-[#005147]' : 'text-slate-300'}`}>
                        {award.description}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Organizational Structure */}
        <div className="mb-12 content-animate">
          <h2 className={`heading-2 mb-8 text-center ${isSalam ? 'text-[#003931]' : ''}`}>
            {lang === "ar" ? "الهيكل التنظيمي" : "Organizational Structure"}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {teamStructure.map((team, index) => (
              <div
                key={index}
                className={`card text-center stagger-animate ${isSalam ? 'bg-[#F8FFFE] border-[#E6F7F0]' : ''}`}
                style={{ animationDelay: `${0.1 * (index + 1)}s` }}
              >
                <div className={`w-16 h-16 ${isSalam ? 'bg-[#E6F7F0]' : 'bg-slate-700'} rounded-full flex items-center justify-center mx-auto mb-4`}>
                  <UserGroupIcon className={`w-8 h-8 ${isSalam ? 'text-[#36C639]' : 'text-green-400'}`} />
                </div>
                <h3 className={`text-lg font-semibold mb-2 ${isSalam ? 'text-[#003931]' : 'text-white'}`}>
                  {team.title}
                </h3>
                <p className={`text-sm mb-3 ${isSalam ? 'text-[#005147]' : 'text-slate-400'}`}>
                  {team.description}
                </p>
                <div className={`text-2xl font-bold ${isSalam ? 'text-[#36C639]' : 'text-green-400'}`}>
                  {team.count}
                </div>
                <p className={`text-sm ${isSalam ? 'text-[#005147]' : 'text-slate-500'}`}>
                  {lang === "ar" ? "موظف" : "Employee"}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Values */}
        <div className={`card content-animate ${isSalam ? 'bg-[#F8FFFE] border-[#E6F7F0]' : ''}`}>
          <h2 className={`heading-2 mb-8 text-center ${isSalam ? 'text-[#003931]' : ''}`}>
            {lang === "ar" ? "قيمنا" : "Our Values"}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center stagger-animate">
              <div className={`w-16 h-16 ${isSalam ? 'bg-[#36C639]' : 'bg-green-600'} rounded-full flex items-center justify-center mx-auto mb-4`}>
                <ShieldCheckIcon className="w-8 h-8 text-white" />
              </div>
              <h3 className={`text-lg font-semibold mb-2 ${isSalam ? 'text-[#003931]' : 'text-white'}`}>
                {lang === "ar" ? "الأمان" : "Security"}
              </h3>
              <p className={`text-sm ${isSalam ? 'text-[#005147]' : 'text-slate-400'}`}>
                {lang === "ar"
                  ? "حماية الأصول والمعلومات بأعلى معايير الأمان"
                  : "Protecting assets and information with highest security standards"}
              </p>
            </div>
            <div className="text-center stagger-animate">
              <div className={`w-16 h-16 ${isSalam ? 'bg-[#36C639]' : 'bg-green-600'} rounded-full flex items-center justify-center mx-auto mb-4`}>
                <CogIcon className="w-8 h-8 text-white" />
              </div>
              <h3 className={`text-lg font-semibold mb-2 ${isSalam ? 'text-[#003931]' : 'text-white'}`}>
                {lang === "ar" ? "الابتكار" : "Innovation"}
              </h3>
              <p className={`text-sm ${isSalam ? 'text-[#005147]' : 'text-slate-400'}`}>
                {lang === "ar"
                  ? "استخدام أحدث التقنيات والحلول المبتكرة"
                  : "Using latest technologies and innovative solutions"}
              </p>
            </div>
            <div className="text-center stagger-animate">
              <div className={`w-16 h-16 ${isSalam ? 'bg-[#36C639]' : 'bg-green-600'} rounded-full flex items-center justify-center mx-auto mb-4`}>
                <UserGroupIcon className="w-8 h-8 text-white" />
              </div>
              <h3 className={`text-lg font-semibold mb-2 ${isSalam ? 'text-[#003931]' : 'text-white'}`}>
                {lang === "ar" ? "التعاون" : "Collaboration"}
              </h3>
              <p className={`text-sm ${isSalam ? 'text-[#005147]' : 'text-slate-400'}`}>
                {lang === "ar"
                  ? "العمل كفريق واحد لتحقيق الأهداف المشتركة"
                  : "Working as one team to achieve common goals"}
              </p>
            </div>
            <div className="text-center stagger-animate">
              <div className={`w-16 h-16 ${isSalam ? 'bg-[#36C639]' : 'bg-green-600'} rounded-full flex items-center justify-center mx-auto mb-4`}>
                <EyeIcon className="w-8 h-8 text-white" />
              </div>
              <h3 className={`text-lg font-semibold mb-2 ${isSalam ? 'text-[#003931]' : 'text-white'}`}>
                {lang === "ar" ? "الشفافية" : "Transparency"}
              </h3>
              <p className={`text-sm ${isSalam ? 'text-[#005147]' : 'text-slate-400'}`}>
                {lang === "ar"
                  ? "الشفافية في جميع العمليات والاتصالات"
                  : "Transparency in all operations and communications"}
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
