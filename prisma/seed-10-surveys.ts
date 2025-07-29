import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  console.log('Starting to create 10 surveys with 15 responses each...');

  // Create 10 comprehensive surveys
  const surveys = [
    {
      title_en: 'Employee Satisfaction & Engagement Survey',
      title_ar: 'استطلاع رضا الموظفين والانخراط',
      questions: [
        {
          question_type: 'text',
          label_en: 'What do you like most about working here?',
          label_ar: 'ما الذي يعجبك أكثر في العمل هنا؟',
          required: true,
          order: 1
        },
        {
          question_type: 'rating',
          label_en: 'How satisfied are you with your work environment?',
          label_ar: 'ما مدى رضاك عن بيئة العمل؟',
          required: true,
          order: 2,
          rating_scale: 'satisfaction',
          rating_options: { "1": "Very Dissatisfied", "2": "Dissatisfied", "3": "Neutral", "4": "Satisfied", "5": "Very Satisfied" }
        },
        {
          question_type: 'rating',
          label_en: 'How satisfied are you with your salary and benefits?',
          label_ar: 'ما مدى رضاك عن الراتب والمزايا؟',
          required: true,
          order: 3,
          rating_scale: 'satisfaction',
          rating_options: { "1": "Very Dissatisfied", "2": "Dissatisfied", "3": "Neutral", "4": "Satisfied", "5": "Very Satisfied" }
        },
        {
          question_type: 'rating',
          label_en: 'How satisfied are you with your manager?',
          label_ar: 'ما مدى رضاك عن مديرك؟',
          required: true,
          order: 4,
          rating_scale: 'satisfaction',
          rating_options: { "1": "Very Dissatisfied", "2": "Dissatisfied", "3": "Neutral", "4": "Satisfied", "5": "Very Satisfied" }
        },
        {
          question_type: 'comments',
          label_en: 'What suggestions do you have for improving employee satisfaction?',
          label_ar: 'ما اقتراحاتك لتحسين رضا الموظفين؟',
          required: false,
          order: 5
        }
      ]
    },
    {
      title_en: 'Cybersecurity Awareness & Training Assessment',
      title_ar: 'تقييم الوعي والتدريب على الأمن السيبراني',
      questions: [
        {
          question_type: 'text',
          label_en: 'What cybersecurity threats concern you the most?',
          label_ar: 'ما هي التهديدات السيبرانية التي تقلقك أكثر؟',
          required: true,
          order: 1
        },
        {
          question_type: 'rating',
          label_en: 'How confident are you in identifying phishing emails?',
          label_ar: 'ما مدى ثقتك في تحديد رسائل التصيد الاحتيالي؟',
          required: true,
          order: 2,
          rating_scale: 'confidence',
          rating_options: { "1": "Not Confident", "2": "Somewhat Confident", "3": "Confident", "4": "Very Confident", "5": "Extremely Confident" }
        },
        {
          question_type: 'rating',
          label_en: 'How often do you update your passwords?',
          label_ar: 'كم مرة تقوم بتحديث كلمات المرور؟',
          required: true,
          order: 3,
          rating_scale: 'frequency',
          rating_options: { "1": "Never", "2": "Rarely", "3": "Sometimes", "4": "Often", "5": "Always" }
        },
        {
          question_type: 'rating',
          label_en: 'How satisfied are you with cybersecurity training provided?',
          label_ar: 'ما مدى رضاك عن التدريب على الأمن السيبراني المقدم؟',
          required: true,
          order: 4,
          rating_scale: 'satisfaction',
          rating_options: { "1": "Very Dissatisfied", "2": "Dissatisfied", "3": "Neutral", "4": "Satisfied", "5": "Very Satisfied" }
        },
        {
          question_type: 'comments',
          label_en: 'What additional cybersecurity training would you like?',
          label_ar: 'ما التدريب الإضافي على الأمن السيبراني الذي تريده؟',
          required: false,
          order: 5
        }
      ]
    },
    {
      title_en: 'Work-Life Balance & Wellbeing Survey',
      title_ar: 'استطلاع التوازن بين العمل والحياة والرفاهية',
      questions: [
        {
          question_type: 'text',
          label_en: 'How do you manage stress at work?',
          label_ar: 'كيف تدير التوتر في العمل؟',
          required: true,
          order: 1
        },
        {
          question_type: 'rating',
          label_en: 'How well do you maintain work-life balance?',
          label_ar: 'ما مدى جودة الحفاظ على التوازن بين العمل والحياة؟',
          required: true,
          order: 2,
          rating_scale: 'balance',
          rating_options: { "1": "Poor", "2": "Fair", "3": "Good", "4": "Very Good", "5": "Excellent" }
        },
        {
          question_type: 'rating',
          label_en: 'How satisfied are you with your work schedule?',
          label_ar: 'ما مدى رضاك عن جدول عملك؟',
          required: true,
          order: 3,
          rating_scale: 'satisfaction',
          rating_options: { "1": "Very Dissatisfied", "2": "Dissatisfied", "3": "Neutral", "4": "Satisfied", "5": "Very Satisfied" }
        },
        {
          question_type: 'rating',
          label_en: 'How often do you take breaks during work hours?',
          label_ar: 'كم مرة تأخذ استراحات خلال ساعات العمل؟',
          required: true,
          order: 4,
          rating_scale: 'frequency',
          rating_options: { "1": "Never", "2": "Rarely", "3": "Sometimes", "4": "Often", "5": "Always" }
        },
        {
          question_type: 'comments',
          label_en: 'What would help improve your work-life balance?',
          label_ar: 'ما الذي يساعد في تحسين التوازن بين العمل والحياة؟',
          required: false,
          order: 5
        }
      ]
    },
    {
      title_en: 'Team Collaboration & Communication Feedback',
      title_ar: 'تقييم التعاون الجماعي والتواصل',
      questions: [
        {
          question_type: 'text',
          label_en: 'What makes team collaboration effective in your experience?',
          label_ar: 'ما الذي يجعل التعاون الجماعي فعالاً في تجربتك؟',
          required: true,
          order: 1
        },
        {
          question_type: 'rating',
          label_en: 'How would you rate communication within your team?',
          label_ar: 'كيف تقيم التواصل داخل فريقك؟',
          required: true,
          order: 2,
          rating_scale: 'communication',
          rating_options: { "1": "Very Poor", "2": "Poor", "3": "Average", "4": "Good", "5": "Excellent" }
        },
        {
          question_type: 'rating',
          label_en: 'How often do you participate in team meetings?',
          label_ar: 'كم مرة تشارك في اجتماعات الفريق؟',
          required: true,
          order: 3,
          rating_scale: 'frequency',
          rating_options: { "1": "Never", "2": "Rarely", "3": "Sometimes", "4": "Often", "5": "Always" }
        },
        {
          question_type: 'rating',
          label_en: 'How satisfied are you with team decision-making processes?',
          label_ar: 'ما مدى رضاك عن عمليات اتخاذ القرار الجماعي؟',
          required: true,
          order: 4,
          rating_scale: 'satisfaction',
          rating_options: { "1": "Very Dissatisfied", "2": "Dissatisfied", "3": "Neutral", "4": "Satisfied", "5": "Very Satisfied" }
        },
        {
          question_type: 'comments',
          label_en: 'How can team collaboration be improved?',
          label_ar: 'كيف يمكن تحسين التعاون الجماعي؟',
          required: false,
          order: 5
        }
      ]
    },
    {
      title_en: 'Technology Tools & Infrastructure Assessment',
      title_ar: 'تقييم أدوات التكنولوجيا والبنية التحتية',
      questions: [
        {
          question_type: 'text',
          label_en: 'Which technology tools do you use most frequently?',
          label_ar: 'ما هي أدوات التكنولوجيا التي تستخدمها بشكل متكرر؟',
          required: true,
          order: 1
        },
        {
          question_type: 'rating',
          label_en: 'How satisfied are you with the current technology tools?',
          label_ar: 'ما مدى رضاك عن أدوات التكنولوجيا الحالية؟',
          required: true,
          order: 2,
          rating_scale: 'satisfaction',
          rating_options: { "1": "Very Dissatisfied", "2": "Dissatisfied", "3": "Neutral", "4": "Satisfied", "5": "Very Satisfied" }
        },
        {
          question_type: 'rating',
          label_en: 'How reliable is the IT infrastructure?',
          label_ar: 'ما مدى موثوقية البنية التحتية لتكنولوجيا المعلومات؟',
          required: true,
          order: 3,
          rating_scale: 'reliability',
          rating_options: { "1": "Very Unreliable", "2": "Unreliable", "3": "Average", "4": "Reliable", "5": "Very Reliable" }
        },
        {
          question_type: 'rating',
          label_en: 'How fast is the internet connection at work?',
          label_ar: 'ما مدى سرعة الاتصال بالإنترنت في العمل؟',
          required: true,
          order: 4,
          rating_scale: 'speed',
          rating_options: { "1": "Very Slow", "2": "Slow", "3": "Average", "4": "Fast", "5": "Very Fast" }
        },
        {
          question_type: 'comments',
          label_en: 'What new technology tools would you recommend?',
          label_ar: 'ما هي أدوات التكنولوجيا الجديدة التي توصي بها؟',
          required: false,
          order: 5
        }
      ]
    },
    {
      title_en: 'Leadership & Management Effectiveness Survey',
      title_ar: 'استطلاع فعالية القيادة والإدارة',
      questions: [
        {
          question_type: 'text',
          label_en: 'What leadership qualities do you value most?',
          label_ar: 'ما هي صفات القيادة التي تقدرها أكثر؟',
          required: true,
          order: 1
        },
        {
          question_type: 'rating',
          label_en: 'How effective is your direct manager?',
          label_ar: 'ما مدى فعالية مديرك المباشر؟',
          required: true,
          order: 2,
          rating_scale: 'effectiveness',
          rating_options: { "1": "Very Ineffective", "2": "Ineffective", "3": "Average", "4": "Effective", "5": "Very Effective" }
        },
        {
          question_type: 'rating',
          label_en: 'How well does management communicate company goals?',
          label_ar: 'ما مدى جودة تواصل الإدارة مع أهداف الشركة؟',
          required: true,
          order: 3,
          rating_scale: 'communication',
          rating_options: { "1": "Very Poor", "2": "Poor", "3": "Average", "4": "Good", "5": "Excellent" }
        },
        {
          question_type: 'rating',
          label_en: 'How satisfied are you with management support?',
          label_ar: 'ما مدى رضاك عن دعم الإدارة؟',
          required: true,
          order: 4,
          rating_scale: 'satisfaction',
          rating_options: { "1": "Very Dissatisfied", "2": "Dissatisfied", "3": "Neutral", "4": "Satisfied", "5": "Very Satisfied" }
        },
        {
          question_type: 'comments',
          label_en: 'What suggestions do you have for improving leadership?',
          label_ar: 'ما اقتراحاتك لتحسين القيادة؟',
          required: false,
          order: 5
        }
      ]
    },
    {
      title_en: 'Professional Development & Career Growth',
      title_ar: 'التطوير المهني ونمو المسيرة',
      questions: [
        {
          question_type: 'text',
          label_en: 'What skills would you like to develop?',
          label_ar: 'ما المهارات التي تريد تطويرها؟',
          required: true,
          order: 1
        },
        {
          question_type: 'rating',
          label_en: 'How satisfied are you with training opportunities?',
          label_ar: 'ما مدى رضاك عن فرص التدريب؟',
          required: true,
          order: 2,
          rating_scale: 'satisfaction',
          rating_options: { "1": "Very Dissatisfied", "2": "Dissatisfied", "3": "Neutral", "4": "Satisfied", "5": "Very Satisfied" }
        },
        {
          question_type: 'rating',
          label_en: 'How clear is your career progression path?',
          label_ar: 'ما مدى وضوح مسار تطور مسيرتك المهنية؟',
          required: true,
          order: 3,
          rating_scale: 'clarity',
          rating_options: { "1": "Very Unclear", "2": "Unclear", "3": "Somewhat Clear", "4": "Clear", "5": "Very Clear" }
        },
        {
          question_type: 'rating',
          label_en: 'How often do you receive feedback on your performance?',
          label_ar: 'كم مرة تتلقى تقييماً على أدائك؟',
          required: true,
          order: 4,
          rating_scale: 'frequency',
          rating_options: { "1": "Never", "2": "Rarely", "3": "Sometimes", "4": "Often", "5": "Always" }
        },
        {
          question_type: 'comments',
          label_en: 'What additional development opportunities would you like?',
          label_ar: 'ما فرص التطوير الإضافية التي تريدها؟',
          required: false,
          order: 5
        }
      ]
    },
    {
      title_en: 'Company Culture & Values Assessment',
      title_ar: 'تقييم ثقافة الشركة والقيم',
      questions: [
        {
          question_type: 'text',
          label_en: 'What aspects of company culture do you appreciate most?',
          label_ar: 'ما جوانب ثقافة الشركة التي تقدرها أكثر؟',
          required: true,
          order: 1
        },
        {
          question_type: 'rating',
          label_en: 'How well do company values align with your personal values?',
          label_ar: 'ما مدى تطابق قيم الشركة مع قيمك الشخصية؟',
          required: true,
          order: 2,
          rating_scale: 'alignment',
          rating_options: { "1": "Not Aligned", "2": "Somewhat Aligned", "3": "Moderately Aligned", "4": "Well Aligned", "5": "Perfectly Aligned" }
        },
        {
          question_type: 'rating',
          label_en: 'How inclusive is the workplace culture?',
          label_ar: 'ما مدى شمولية ثقافة مكان العمل؟',
          required: true,
          order: 3,
          rating_scale: 'inclusivity',
          rating_options: { "1": "Not Inclusive", "2": "Somewhat Inclusive", "3": "Moderately Inclusive", "4": "Inclusive", "5": "Very Inclusive" }
        },
        {
          question_type: 'rating',
          label_en: 'How satisfied are you with company policies?',
          label_ar: 'ما مدى رضاك عن سياسات الشركة؟',
          required: true,
          order: 4,
          rating_scale: 'satisfaction',
          rating_options: { "1": "Very Dissatisfied", "2": "Dissatisfied", "3": "Neutral", "4": "Satisfied", "5": "Very Satisfied" }
        },
        {
          question_type: 'comments',
          label_en: 'What suggestions do you have for improving company culture?',
          label_ar: 'ما اقتراحاتك لتحسين ثقافة الشركة؟',
          required: false,
          order: 5
        }
      ]
    },
    {
      title_en: 'Work Environment & Facilities Survey',
      title_ar: 'استطلاع بيئة العمل والمرافق',
      questions: [
        {
          question_type: 'text',
          label_en: 'What do you like most about your work environment?',
          label_ar: 'ما الذي يعجبك أكثر في بيئة عملك؟',
          required: true,
          order: 1
        },
        {
          question_type: 'rating',
          label_en: 'How satisfied are you with office facilities?',
          label_ar: 'ما مدى رضاك عن مرافق المكتب؟',
          required: true,
          order: 2,
          rating_scale: 'satisfaction',
          rating_options: { "1": "Very Dissatisfied", "2": "Dissatisfied", "3": "Neutral", "4": "Satisfied", "5": "Very Satisfied" }
        },
        {
          question_type: 'rating',
          label_en: 'How comfortable is your workspace?',
          label_ar: 'ما مدى راحة مساحة عملك؟',
          required: true,
          order: 3,
          rating_scale: 'comfort',
          rating_options: { "1": "Very Uncomfortable", "2": "Uncomfortable", "3": "Average", "4": "Comfortable", "5": "Very Comfortable" }
        },
        {
          question_type: 'rating',
          label_en: 'How clean and well-maintained is the office?',
          label_ar: 'ما مدى نظافة وصيانة المكتب؟',
          required: true,
          order: 4,
          rating_scale: 'maintenance',
          rating_options: { "1": "Very Poor", "2": "Poor", "3": "Average", "4": "Good", "5": "Excellent" }
        },
        {
          question_type: 'comments',
          label_en: 'What improvements would you suggest for the work environment?',
          label_ar: 'ما التحسينات التي تقترحها لبيئة العمل؟',
          required: false,
          order: 5
        }
      ]
    },
    {
      title_en: 'Innovation & Creativity in the Workplace',
      title_ar: 'الابتكار والإبداع في مكان العمل',
      questions: [
        {
          question_type: 'text',
          label_en: 'How do you contribute to innovation in your role?',
          label_ar: 'كيف تساهم في الابتكار في دورك؟',
          required: true,
          order: 1
        },
        {
          question_type: 'rating',
          label_en: 'How encouraged are you to think creatively?',
          label_ar: 'ما مدى تشجيعك على التفكير الإبداعي؟',
          required: true,
          order: 2,
          rating_scale: 'encouragement',
          rating_options: { "1": "Not Encouraged", "2": "Somewhat Encouraged", "3": "Moderately Encouraged", "4": "Encouraged", "5": "Very Encouraged" }
        },
        {
          question_type: 'rating',
          label_en: 'How often do you suggest new ideas or improvements?',
          label_ar: 'كم مرة تقترح أفكاراً جديدة أو تحسينات؟',
          required: true,
          order: 3,
          rating_scale: 'frequency',
          rating_options: { "1": "Never", "2": "Rarely", "3": "Sometimes", "4": "Often", "5": "Always" }
        },
        {
          question_type: 'rating',
          label_en: 'How satisfied are you with the company\'s approach to innovation?',
          label_ar: 'ما مدى رضاك عن نهج الشركة تجاه الابتكار؟',
          required: true,
          order: 4,
          rating_scale: 'satisfaction',
          rating_options: { "1": "Very Dissatisfied", "2": "Dissatisfied", "3": "Neutral", "4": "Satisfied", "5": "Very Satisfied" }
        },
        {
          question_type: 'comments',
          label_en: 'What would help foster more innovation in the workplace?',
          label_ar: 'ما الذي يساعد في تعزيز المزيد من الابتكار في مكان العمل؟',
          required: false,
          order: 5
        }
      ]
    }
  ];

  // Sample departments
  const departments = [
    'CYB-Cyber Technology',
    'Cyber Excellence', 
    'CYB-GRC',
    'Architecture & Design',
    'Protection & Defence',
    'Cybersecurity',
    'CYB-IT',
    'Other'
  ];

  // Sample names for responses
  const sampleNames = [
    'أحمد محمد', 'فاطمة علي', 'محمد عبدالله', 'نورا أحمد', 'خالد سعد',
    'سارة خالد', 'عبدالله فهد', 'ريم سلطان', 'ماجد عمر', 'ليلى محمد',
    'عمر خالد', 'أماني أحمد', 'يوسف محمد', 'رانيا علي', 'سعد فهد',
    'هيسا محمد', 'طلال أحمد', 'نورا خالد', 'عبدالله سعد', 'فاطمة عمر',
    'محمد علي', 'سارة فهد', 'خالد أحمد', 'نورا محمد', 'عمر خالد',
    'عبدالرحمن محمد', 'مريم أحمد', 'علي حسن', 'زينب محمد', 'حسن علي',
    'نادية أحمد', 'طارق محمد', 'سلمى علي', 'ياسر أحمد', 'هدى محمد',
    'باسم علي', 'رنا أحمد', 'كريم محمد', 'دينا علي', 'محمد أحمد',
    'سارة محمد', 'أحمد علي', 'فاطمة أحمد', 'علي محمد', 'نورا علي',
    'خالد أحمد', 'مريم محمد', 'عبدالله علي', 'ليلى أحمد', 'يوسف محمد'
  ];

  // Create surveys and responses
  for (let surveyIndex = 0; surveyIndex < surveys.length; surveyIndex++) {
    const survey = surveys[surveyIndex];
    
    console.log(`Creating survey ${surveyIndex + 1}: ${survey.title_en}`);

    // Create survey
    const createdSurvey = await prisma.survey.create({
      data: {
        title_en: survey.title_en,
        title_ar: survey.title_ar,
        created_by: 1,
        questions: {
          create: survey.questions
        }
      },
      include: {
        questions: true
      }
    });

    console.log(`Created survey with ID: ${createdSurvey.id}`);

    // Create 15 responses for this survey
    for (let responseIndex = 0; responseIndex < 15; responseIndex++) {
      const responderName = sampleNames[responseIndex % sampleNames.length];
      const responderDepartment = departments[Math.floor(Math.random() * departments.length)];
      
      console.log(`Creating response ${responseIndex + 1} for survey ${surveyIndex + 1}`);

      // Generate random answers based on question type
      const answers = createdSurvey.questions.map((question, qIndex) => {
        let answerValue = '';
        
        if (question.question_type === 'text') {
          // Generate realistic text answers based on question content
          const textAnswers = [
            'بيئة العمل الودية والزملاء المتعاونون',
            'المرونة في ساعات العمل والفرص المتاحة للتطوير',
            'الرواتب التنافسية والمزايا الجيدة',
            'التقنيات الحديثة والبنية التحتية المتطورة',
            'القيادة الداعمة والرؤية الواضحة للشركة',
            'التدريب المستمر وفرص النمو المهني',
            'الشفافية في التواصل واتخاذ القرارات',
            'الاحترام المتبادل والثقافة الإيجابية',
            'الأمان الوظيفي والاستقرار',
            'التوازن بين العمل والحياة الشخصية',
            'المسؤولية الاجتماعية للشركة',
            'الابتكار والتطوير المستمر',
            'الجودة العالية في الخدمات المقدمة',
            'التعاون الجماعي والعمل كفريق واحد',
            'الاعتراف بالإنجازات والتحفيز'
          ];
          answerValue = textAnswers[Math.floor(Math.random() * textAnswers.length)];
        } else if (question.question_type === 'rating') {
          // Generate random rating (1-5)
          answerValue = (Math.floor(Math.random() * 5) + 1).toString();
        } else if (question.question_type === 'comments') {
          // Generate realistic comments
          const comments = [
            'أتمنى المزيد من التدريب على التقنيات الجديدة',
            'تحسين نظام التقييم السنوي',
            'المزيد من الاجتماعات الجماعية',
            'تحسين التواصل بين الأقسام',
            'إنشاء غرف للاسترخاء',
            'تقليل الاجتماعات المسائية',
            'تحسين بيئة العمل',
            'تحسين أدوات التواصل',
            'إنشاء فرق عمل متنوعة',
            'تحسين نظام التقييم',
            'تحديث البرامج بشكل دوري',
            'المزيد من التدريب على الأدوات',
            'تحسين سرعة الشبكة',
            'المزيد من الخدمات السحابية',
            'تحسين إجراءات التحقق'
          ];
          answerValue = comments[Math.floor(Math.random() * comments.length)];
        }
        
        return {
          question_id: question.id,
          answer: answerValue,
          question_label: question.label_en
        };
      });

      const createdResponse = await prisma.surveyResponse.create({
        data: {
          survey_id: createdSurvey.id,
          responder_name: responderName,
          responder_department: responderDepartment,
          submitted_at: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000), // Random date within last 30 days
          answers: {
            create: answers
          }
        }
      });

      console.log(`Created response with ID: ${createdResponse.id}`);
    }
  }

  console.log('All 10 surveys with 15 responses each created successfully!');
}

main()
  .then(() => {
    console.log('Seeding completed.');
    prisma.$disconnect();
  })
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
    process.exit(1);
  }); 