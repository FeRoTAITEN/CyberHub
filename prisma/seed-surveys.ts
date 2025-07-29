import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  console.log('Starting to create sample surveys and responses...');

  // Create 5 sample surveys
  const surveys = [
    {
      title_en: 'Employee Satisfaction Survey',
      title_ar: 'استطلاع رضا الموظفين',
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
          question_type: 'comments',
          label_en: 'Do you have any suggestions for improvement?',
          label_ar: 'هل لديك أي اقتراحات للتحسين؟',
          required: false,
          order: 3
        }
      ]
    },
    {
      title_en: 'Cybersecurity Awareness Assessment',
      title_ar: 'تقييم الوعي بالأمن السيبراني',
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
          question_type: 'comments',
          label_en: 'What additional cybersecurity training would you like?',
          label_ar: 'ما التدريب الإضافي على الأمن السيبراني الذي تريده؟',
          required: false,
          order: 3
        }
      ]
    },
    {
      title_en: 'Work-Life Balance Survey',
      title_ar: 'استطلاع التوازن بين العمل والحياة',
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
          question_type: 'comments',
          label_en: 'What would help improve your work-life balance?',
          label_ar: 'ما الذي يساعد في تحسين التوازن بين العمل والحياة؟',
          required: false,
          order: 3
        }
      ]
    },
    {
      title_en: 'Team Collaboration Feedback',
      title_ar: 'تقييم التعاون الجماعي',
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
          question_type: 'comments',
          label_en: 'How can team collaboration be improved?',
          label_ar: 'كيف يمكن تحسين التعاون الجماعي؟',
          required: false,
          order: 3
        }
      ]
    },
    {
      title_en: 'Technology Tools Assessment',
      title_ar: 'تقييم أدوات التكنولوجيا',
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
          question_type: 'comments',
          label_en: 'What new technology tools would you recommend?',
          label_ar: 'ما هي أدوات التكنولوجيا الجديدة التي توصي بها؟',
          required: false,
          order: 3
        }
      ]
    }
  ];

  // Sample responses data
  const sampleResponses = [
    // Survey 1 responses
    [
      { name: 'أحمد محمد', department: 'CYB-Cyber Technology' },
      { name: 'فاطمة علي', department: 'Cyber Excellence' },
      { name: 'محمد عبدالله', department: 'CYB-GRC' },
      { name: 'نورا أحمد', department: 'Architecture & Design' },
      { name: 'خالد سعد', department: 'Protection & Defence' }
    ],
    // Survey 2 responses
    [
      { name: 'سارة خالد', department: 'Cybersecurity' },
      { name: 'عبدالله فهد', department: 'CYB-IT' },
      { name: 'ريم سلطان', department: 'Other' },
      { name: 'ماجد عمر', department: 'CYB-Cyber Technology' },
      { name: 'ليلى محمد', department: 'Cyber Excellence' }
    ],
    // Survey 3 responses
    [
      { name: 'عمر خالد', department: 'CYB-GRC' },
      { name: 'أماني أحمد', department: 'Architecture & Design' },
      { name: 'يوسف محمد', department: 'Protection & Defence' },
      { name: 'رانيا علي', department: 'Cybersecurity' },
      { name: 'سعد فهد', department: 'CYB-IT' }
    ],
    // Survey 4 responses
    [
      { name: 'هيسا محمد', department: 'Other' },
      { name: 'طلال أحمد', department: 'CYB-Cyber Technology' },
      { name: 'نورا خالد', department: 'Cyber Excellence' },
      { name: 'عبدالله سعد', department: 'CYB-GRC' },
      { name: 'فاطمة عمر', department: 'Architecture & Design' }
    ],
    // Survey 5 responses
    [
      { name: 'محمد علي', department: 'Protection & Defence' },
      { name: 'سارة فهد', department: 'Cybersecurity' },
      { name: 'خالد أحمد', department: 'CYB-IT' },
      { name: 'نورا محمد', department: 'Other' },
      { name: 'عمر خالد', department: 'CYB-Cyber Technology' }
    ]
  ];

  // Sample answers for each response
  const sampleAnswers = [
    // Survey 1 answers
    [
      {
        text: 'بيئة العمل الودية والزملاء المتعاونون',
        rating: '4',
        yesNo: 'نعم',
        comment: 'أتمنى المزيد من التدريب على التقنيات الجديدة'
      },
      {
        text: 'المرونة في ساعات العمل والفرص المتاحة للتطوير',
        rating: '5',
        yesNo: 'نعم',
        comment: 'تحسين نظام التقييم السنوي'
      },
      {
        text: 'الرواتب التنافسية والمزايا الجيدة',
        rating: '3',
        yesNo: 'لا',
        comment: ''
      },
      {
        text: 'التقنيات الحديثة والبنية التحتية المتطورة',
        rating: '4',
        yesNo: 'نعم',
        comment: 'المزيد من الاجتماعات الجماعية'
      },
      {
        text: 'القيادة الداعمة والرؤية الواضحة للشركة',
        rating: '5',
        yesNo: 'نعم',
        comment: 'تحسين التواصل بين الأقسام'
      }
    ],
    // Survey 2 answers
    [
      {
        text: 'الهجمات الإلكترونية المتطورة وبرامج الفدية',
        rating: '4',
        yesNo: 'نعم',
        comment: 'المزيد من التدريب على الأمن السيبراني'
      },
      {
        text: 'سرقة البيانات الشخصية والتصيد الاحتيالي',
        rating: '5',
        yesNo: 'نعم',
        comment: 'تحسين أنظمة الحماية'
      },
      {
        text: 'البرمجيات الخبيثة والهجمات على البنية التحتية',
        rating: '3',
        yesNo: 'لا',
        comment: ''
      },
      {
        text: 'الهجمات على الشبكات والأنظمة',
        rating: '4',
        yesNo: 'نعم',
        comment: 'تحديث بروتوكولات الأمان'
      },
      {
        text: 'التهديدات الداخلية وسرقة المعلومات',
        rating: '5',
        yesNo: 'نعم',
        comment: 'تحسين إجراءات التحقق'
      }
    ],
    // Survey 3 answers
    [
      {
        text: 'ممارسة الرياضة بانتظام والقراءة',
        rating: '4',
        yesNo: 'نعم',
        comment: 'المزيد من المرونة في ساعات العمل'
      },
      {
        text: 'التأمل واليوجا لتقليل التوتر',
        rating: '5',
        yesNo: 'نعم',
        comment: 'إنشاء غرف للاسترخاء'
      },
      {
        text: 'قضاء الوقت مع العائلة والأصدقاء',
        rating: '3',
        yesNo: 'لا',
        comment: ''
      },
      {
        text: 'ممارسة الهوايات والأنشطة الترفيهية',
        rating: '4',
        yesNo: 'نعم',
        comment: 'تقليل الاجتماعات المسائية'
      },
      {
        text: 'النوم الجيد والتغذية الصحية',
        rating: '5',
        yesNo: 'نعم',
        comment: 'تحسين بيئة العمل'
      }
    ],
    // Survey 4 answers
    [
      {
        text: 'التواصل المفتوح والشفافية في المعلومات',
        rating: '4',
        yesNo: 'نعم',
        comment: 'المزيد من الاجتماعات الجماعية'
      },
      {
        text: 'التعاون المتبادل واحترام وجهات النظر',
        rating: '5',
        yesNo: 'نعم',
        comment: 'تحسين أدوات التواصل'
      },
      {
        text: 'التخطيط المشترك وتوزيع المهام',
        rating: '3',
        yesNo: 'لا',
        comment: ''
      },
      {
        text: 'الدعم المتبادل وحل المشاكل معاً',
        rating: '4',
        yesNo: 'نعم',
        comment: 'إنشاء فرق عمل متنوعة'
      },
      {
        text: 'الاحتفال بالنجاحات والتعلم من الأخطاء',
        rating: '5',
        yesNo: 'نعم',
        comment: 'تحسين نظام التقييم'
      }
    ],
    // Survey 5 answers
    [
      {
        text: 'Microsoft Office وSlack وZoom',
        rating: '4',
        yesNo: 'نعم',
        comment: 'تحديث البرامج بشكل دوري'
      },
      {
        text: 'Jira وConfluence وTeams',
        rating: '5',
        yesNo: 'نعم',
        comment: 'المزيد من التدريب على الأدوات'
      },
      {
        text: 'Visual Studio Code وGit وDocker',
        rating: '3',
        yesNo: 'لا',
        comment: ''
      },
      {
        text: 'Figma وAdobe Creative Suite',
        rating: '4',
        yesNo: 'نعم',
        comment: 'تحسين سرعة الشبكة'
      },
      {
        text: 'AWS وAzure وGoogle Cloud',
        rating: '5',
        yesNo: 'نعم',
        comment: 'المزيد من الخدمات السحابية'
      }
    ]
  ];

  // Create surveys and responses
  for (let i = 0; i < surveys.length; i++) {
    const survey = surveys[i];
    const responses = sampleResponses[i];
    const answers = sampleAnswers[i];

    console.log(`Creating survey ${i + 1}: ${survey.title_en}`);

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

    // Create responses for this survey
    for (let j = 0; j < responses.length; j++) {
      const response = responses[j];
      const answerData = answers[j];

      console.log(`Creating response ${j + 1} for survey ${i + 1}`);

      const createdResponse = await prisma.surveyResponse.create({
        data: {
          survey_id: createdSurvey.id,
          responder_name: response.name,
          responder_department: response.department,
          submitted_at: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000), // Random date within last 30 days
          answers: {
            create: createdSurvey.questions.map((question, qIndex) => {
              let answerValue = '';
              
              if (question.question_type === 'text') {
                answerValue = answerData.text;
              } else if (question.question_type === 'rating') {
                answerValue = answerData.rating;
              } else if (question.question_type === 'comments') {
                if (answerData.yesNo === 'نعم') {
                  answerValue = 'Yes';
                } else {
                  answerValue = 'No';
                }
                // Add comment if exists
                if (answerData.comment) {
                  return [
                    {
                      question_id: question.id,
                      answer: answerValue + '_yesno'
                    },
                    {
                      question_id: question.id,
                      answer: answerData.comment + '_comment'
                    }
                  ];
                }
              }
              
              return {
                question_id: question.id,
                answer: answerValue
              };
            }).flat()
          }
        }
      });

      console.log(`Created response with ID: ${createdResponse.id}`);
    }
  }

  console.log('All surveys and responses created successfully!');
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