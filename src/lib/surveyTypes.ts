// Survey question types and rating scales configuration
// All comments in English only

export interface RatingOption {
  value: number;
  label_en: string;
  label_ar: string;
}

export interface RatingScale {
  id: string;
  name_en: string;
  name_ar: string;
  options: RatingOption[];
}

export const RATING_SCALES: RatingScale[] = [
  {
    id: 'satisfaction',
    name_en: 'Satisfaction Scale',
    name_ar: 'مقياس الرضا',
    options: [
      { value: 5, label_en: 'Very Satisfied', label_ar: 'راض جداً' },
      { value: 4, label_en: 'Satisfied', label_ar: 'راض' },
      { value: 3, label_en: 'Neutral', label_ar: 'محايد' },
      { value: 2, label_en: 'Dissatisfied', label_ar: 'غير راض' },
      { value: 1, label_en: 'Very Dissatisfied', label_ar: 'غير راض ابداً' }
    ]
  },
  {
    id: 'expectations',
    name_en: 'Expectations Scale',
    name_ar: 'مقياس التوقعات',
    options: [
      { value: 5, label_en: 'Exceeds Expectations', label_ar: 'تتجاوز التوقعات' },
      { value: 4, label_en: 'Meets Expectations', label_ar: 'تلبي التوقعات' },
      { value: 3, label_en: 'Neutral', label_ar: 'محايد' },
      { value: 2, label_en: 'Below Expectations', label_ar: 'أقل من التوقعات' },
      { value: 1, label_en: 'Far Below Expectations', label_ar: 'أقل بكثير من التوقعات' }
    ]
  },
  {
    id: 'reliability',
    name_en: 'Reliability Scale',
    name_ar: 'مقياس الموثوقية',
    options: [
      { value: 5, label_en: 'Very Reliable', label_ar: 'موثوقة جداً' },
      { value: 4, label_en: 'Reliable', label_ar: 'موثوقة' },
      { value: 3, label_en: 'Neutral', label_ar: 'محايد' },
      { value: 2, label_en: 'Unreliable', label_ar: 'غير موثوقة' },
      { value: 1, label_en: 'Very Unreliable', label_ar: 'غير موثوقة ابداً' }
    ]
  },
  {
    id: 'clarity',
    name_en: 'Clarity Scale',
    name_ar: 'مقياس الوضوح',
    options: [
      { value: 5, label_en: 'Very Clear', label_ar: 'واضحة جداً' },
      { value: 4, label_en: 'Clear', label_ar: 'واضحة' },
      { value: 3, label_en: 'Neutral', label_ar: 'محايد' },
      { value: 2, label_en: 'Unclear', label_ar: 'غير واضحة' },
      { value: 1, label_en: 'Very Unclear', label_ar: 'غير واضحة أبداً' }
    ]
  },
  {
    id: 'agreement',
    name_en: 'Agreement Scale',
    name_ar: 'مقياس الموافقة',
    options: [
      { value: 5, label_en: 'Strongly Agree', label_ar: 'أوافق بشدة' },
      { value: 4, label_en: 'Agree', label_ar: 'أوافق' },
      { value: 3, label_en: 'Neutral', label_ar: 'محايد' },
      { value: 2, label_en: 'Disagree', label_ar: 'لا أوافق' },
      { value: 1, label_en: 'Strongly Disagree', label_ar: 'لا أوافق بشدة' }
    ]
  }
];

export const QUESTION_TYPES = [
  {
    id: 'text',
    name_en: 'Text Answer',
    name_ar: 'إجابة نصية',
    description_en: 'Open text field for free response',
    description_ar: 'حقل نصي مفتوح للإجابة الحرة'
  },
  {
    id: 'rating',
    name_en: 'Rating Scale',
    name_ar: 'مقياس تقييم',
    description_en: 'Choose from predefined rating scales',
    description_ar: 'اختر من مقاييس التقييم المحددة مسبقاً'
  },
  {
    id: 'comments',
    name_en: 'Comments',
    name_ar: 'تعليقات',
    description_en: 'Yes/No with optional comments',
    description_ar: 'نعم/لا مع تعليقات اختيارية'
  }
];

export function getRatingScaleById(id: string): RatingScale | undefined {
  return RATING_SCALES.find(scale => scale.id === id);
}

export function getRatingScaleName(scaleId: string, lang: 'en' | 'ar'): string {
  const scale = getRatingScaleById(scaleId);
  return scale ? (lang === 'ar' ? scale.name_ar : scale.name_en) : '';
}

export function getRatingOptionLabel(scaleId: string, value: number, lang: 'en' | 'ar'): string {
  const scale = getRatingScaleById(scaleId);
  const option = scale?.options.find(opt => opt.value === value);
  return option ? (lang === 'ar' ? option.label_ar : option.label_en) : '';
} 