# Cyber Hub Platform - Continuation Prompt

## 🎯 المشروع الأساسي
**Cyber Hub** - منصة أمن سيبراني على مستوى المؤسسة لشركة Salam

## 🏗️ التقنيات المستخدمة

### **Frontend:**
- **Next.js 14** (App Router)
- **React 18** (Hooks: useState, useEffect, useRef)
- **TypeScript**
- **Tailwind CSS** (مع دعم الثيمات الديناميكية)
- **Heroicons** (React Icons)
- **Framer Motion** (للحركات)

### **Backend:**
- **Next.js API Routes** (`/api/*`)
- **Prisma ORM**
- **PostgreSQL** (Database)
- **File System** (fs, path) للتعامل مع الملفات

### **Database:**
- **PostgreSQL** مع Prisma Schema
- **Migrations** محدثة
- **Seed Files** للبيانات التجريبية

## 🎨 نظام الثيمات والتصميم

### **الثيمات المدعومة:**
1. **Default Theme** - الألوان الافتراضية
2. **Light Theme** - الثيم الفاتح
3. **Midnight Theme** - الثيم الداكن
4. **Novel Theme** - الثيم الأدبي
5. **Cyber Theme** - الثيم السيبراني
6. **Salam Theme** - ثيم شركة سلام (الأحدث)

### **Salam Theme Colors:**
```css
Primary Colors:
- Strong Green: #36C639 (الأزرار الثانوية، الأيقونات الرئيسية)
- Bright Green: #73F64B (التأكيدات الساطعة)

Secondary Colors:
- Light Background: #F8FFFE (خلفيات البطاقات)
- Card Border: #E6F7F0 (حدود البطاقات)
- Text Primary: #003931 (العناوين الرئيسية)
- Text Secondary: #005147 (النصوص الثانوية)
```

### **الإحصائيات في Salam Theme:**
- **Stat Value**: `#00F000` (Vibrant Green)
- **Stat Label**: `#000000` (Black)
- **Positive Change**: `#00F000` (Vibrant Green)
- **Negative Change**: `#FF4444` (Red)

## 🌐 نظام اللغات (i18n)

### **اللغات المدعومة:**
- **العربية** (`ar.json`)
- **الإنجليزية** (`en.json`)

### **Hook المستخدم:**
```typescript
import { useTranslation } from '@/lib/useTranslation';
const { t } = useTranslation(lang);
```

## 📁 هيكل المشروع الحالي

### **الصفحات المكتملة:**
- ✅ **Home** (`/`) - الصفحة الرئيسية
- ✅ **About** (`/about`) - عن القسم
- ✅ **News** (`/news`) - الأخبار والتحديثات
- ✅ **Governance** (`/governance`) - الحوكمة (تم تغييرها من policies)
- ✅ **Staff** (`/staff`) - دليل الموظفين
- ✅ **QA** (`/qa`) - الأسئلة الشائعة
- ✅ **Games** (`/games`) - الألعاب التعليمية
- ✅ **Projects** (`/projects`) - إدارة المشاريع
- ✅ **GRC** (`/grc`) - إدارة الحوكمة والمخاطر والامتثال
- ✅ **Excellent** (`/excellent`) - التميز وإدارة المشاريع
- ✅ **Shifts** (`/shifts`) - إدارة المناوبات
- ✅ **Surveys** (`/surveys`) - الاستطلاعات

### **API Routes المكتملة:**
- ✅ `/api/policies` - إدارة السياسات
- ✅ `/api/standards` - إدارة المعايير
- ✅ `/api/procedures` - إدارة الإجراءات
- ✅ `/api/employees` - إدارة الموظفين
- ✅ `/api/departments` - إدارة الأقسام
- ✅ `/api/projects` - إدارة المشاريع
- ✅ `/api/shifts` - إدارة المناوبات
- ✅ `/api/surveys` - إدارة الاستطلاعات

## 🔧 المشاكل المحلولة

### **API Issues:**
- ✅ **Procedures API** - تم إصلاح عدم تطابق Schema
- ✅ **Data Transformation** - تحويل البيانات بين Prisma Model و Frontend Interface
- ✅ **Error Handling** - معالجة الأخطاء في API calls

### **Theme Issues:**
- ✅ **Salam Theme Colors** - تم تطبيق ألوان ثيم سلام
- ✅ **View Button Colors** - تم تحديث ألوان أزرار العرض
- ✅ **Consistent Styling** - تصميم متناسق عبر جميع الصفحات

### **Navigation Issues:**
- ✅ **Governance Route** - تم تغيير `/policies` إلى `/governance`
- ✅ **Translation Updates** - تحديث جميع الترجمات
- ✅ **Quick Links** - تحديث الروابط السريعة

## 🎯 المهام المطلوبة للاستكمال

### **1. تحسينات التصميم:**
- [ ] تطبيق Salam Theme على الصفحات المتبقية
- [ ] تحسين تجربة المستخدم (UX)
- [ ] إضافة المزيد من الحركات والانتقالات

### **2. وظائف إضافية:**
- [ ] نظام التنبيهات المتقدم
- [ ] لوحة تحكم للإدارة
- [ ] نظام التقارير المتقدم
- [ ] إدارة المستخدمين والصلاحيات

### **3. تحسينات تقنية:**
- [ ] تحسين الأداء (Performance)
- [ ] إضافة المزيد من الاختبارات
- [ ] تحسين الأمان
- [ ] إضافة المزيد من API endpoints

### **4. ميزات جديدة:**
- [ ] نظام إدارة المخاطر
- [ ] نظام الامتثال
- [ ] نظام التدريب والتعليم
- [ ] نظام إدارة الحوادث

## 📋 التعليمات المهمة

### **عند العمل على المشروع:**
1. **احترم التصميم الحالي** - استخدم نفس الألوان والأنماط
2. **دعم Salam Theme** - تأكد من تطبيق ألوان ثيم سلام
3. **دعم اللغتين** - أضف الترجمات للعربية والإنجليزية
4. **استخدم TypeScript** - اكتب كود آمن ومُحدد الأنواع
5. **اتبع هيكل المشروع** - استخدم نفس أسماء الملفات والمجلدات
6. **اختبر API** - تأكد من عمل جميع الـ endpoints
7. **استخدم ESLint** - تأكد من جودة الكود

### **عند إضافة ميزات جديدة:**
1. **أضف الترجمات أولاً** في `src/locales/ar.json` و `src/locales/en.json`
2. **أنشئ API route** في `src/app/api/`
3. **أنشئ الصفحة** في `src/app/`
4. **أضف الرابط** في `src/components/Navigation.tsx`
5. **اختبر في كلا اللغتين**

### **عند العمل على Database:**
1. **حدّث Schema** في `prisma/schema.prisma`
2. **أنشئ Migration** باستخدام `npx prisma migrate dev`
3. **أنشئ Seed File** في `prisma/seed-*.ts`
4. **اختبر البيانات** عبر API

## 🚀 كيفية البدء

### **تشغيل المشروع:**
```bash
npm install
npm run dev
```

### **Database:**
```bash
npx prisma generate
npx prisma db push
npm run seed
```

### **Build:**
```bash
npm run build
```

## 📞 معلومات الاتصال
- **المشروع**: Cyber Hub Platform
- **الشركة**: Salam Company
- **الهدف**: منصة أمن سيبراني شاملة
- **الحالة**: في التطوير النشط

## 🎨 ملاحظات التصميم
- **الألوان الأساسية**: أخضر سلام (#36C639, #73F64B)
- **الخطوط**: Frutiger Arabic للعربية، خطوط افتراضية للإنجليزية
- **التصميم**: حديث ومتجاوب مع دعم كامل للهاتف المحمول
- **الثيمات**: ديناميكية مع إمكانية التبديل الفوري

---
**ملاحظة**: هذا المشروع يتطلب فهم عميق لـ Next.js، React، TypeScript، و Tailwind CSS. تأكد من اتباع أفضل الممارسات والحفاظ على جودة الكود. 