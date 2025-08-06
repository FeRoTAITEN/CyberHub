# نظام الامتثال وإدارة المشاريع (Compliance & Project Management System)

## نظرة عامة

نظام الامتثال وإدارة المشاريع هو جزء من منصة Cyber Hub، يوفر إدارة شاملة للمشاريع مع دعم استيراد ملفات Microsoft Project بصيغة XML.

## الميزات الرئيسية

### 1. إدارة المشاريع
- إنشاء وإدارة المشاريع
- تتبع حالة المشاريع (نشط، مكتمل، معلق، ملغي)
- تحديد أولويات المشاريع (منخفض، متوسط، عالي، حرج)
- حساب نسب التقدم تلقائياً

### 2. إدارة المراحل (Phases)
- تقسيم المشاريع إلى مراحل
- تتبع تقدم كل مرحلة
- ترتيب المراحل حسب الأولوية

### 3. إدارة المهام (Tasks)
- إنشاء مهام رئيسية وفرعية
- تعيين موظفين للمهام
- تتبع نسب الإنجاز
- تحديد المواعيد النهائية

### 4. استيراد ملفات XML
- دعم استيراد ملفات Microsoft Project بصيغة XML
- استخراج تلقائي للمشاريع والمراحل والمهام
- حفظ ملفات XML الأصلية للرجوع إليها

### 5. واجهة مستخدم متقدمة
- تصميم حديث ومتجاوب
- دعم اللغة العربية والإنجليزية
- نظام ثيمات متعدد
- خطوط عربية مخصصة

## البنية التقنية

### قاعدة البيانات
```sql
-- نماذج إدارة المشاريع
Project (المشاريع)
Phase (المراحل)
Task (المهام)
TaskAssignment (تعيينات المهام)
```

### API Endpoints
- `GET /api/projects` - جلب جميع المشاريع
- `POST /api/projects` - إنشاء مشروع جديد
- `POST /api/projects/import-xml` - استيراد ملف XML

### التقنيات المستخدمة
- **Frontend**: Next.js 15, React 19, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, Prisma ORM
- **Database**: PostgreSQL
- **XML Parsing**: xml2js
- **UI Components**: Heroicons, Framer Motion

## كيفية الاستخدام

### 1. الوصول للصفحة
- انتقل إلى `/compliance` في التطبيق
- أو اختر "الامتثال" من قائمة التنقل

### 2. استيراد مشروع من XML
1. اضغط على زر "استيراد XML"
2. اختر ملف Microsoft Project بصيغة XML
3. اضغط "استيراد"
4. سيتم إنشاء المشروع تلقائياً مع جميع المراحل والمهام

### 3. عرض تفاصيل المشروع
- اضغط على أيقونة العين لرؤية تفاصيل المشروع
- ستظهر المراحل والمهام مع نسب التقدم
- يمكن رؤية المهام الفرعية والتعيينات

### 4. إدارة المشاريع
- عرض جميع المشاريع في قائمة واحدة
- تصفية حسب الحالة والأولوية
- البحث في المشاريع

## هيكل ملف XML المدعوم

```xml
<?xml version="1.0" encoding="UTF-8"?>
<Project>
  <Name>اسم المشروع</Name>
  <Description>وصف المشروع</Description>
  <StartDate>تاريخ البداية</StartDate>
  <FinishDate>تاريخ الانتهاء</FinishDate>
  
  <Phases>
    <Phase>
      <Name>اسم المرحلة</Name>
      <Description>وصف المرحلة</Description>
      <Start>تاريخ البداية</Start>
      <Finish>تاريخ الانتهاء</Finish>
      <Status>الحالة</Status>
      <PercentComplete>نسبة الإنجاز</PercentComplete>
      <Order>الترتيب</Order>
    </Phase>
  </Phases>
  
  <Tasks>
    <Task>
      <Name>اسم المهمة</Name>
      <Description>وصف المهمة</Description>
      <Start>تاريخ البداية</Start>
      <Finish>تاريخ الانتهاء</Finish>
      <Status>الحالة</Status>
      <Priority>الأولوية</Priority>
      <PercentComplete>نسبة الإنجاز</PercentComplete>
      <Order>الترتيب</Order>
      <Subtasks>
        <Subtask>
          <!-- نفس هيكل المهمة -->
        </Subtask>
      </Subtasks>
    </Task>
  </Tasks>
</Project>
```

## الإعداد والتشغيل

### 1. تثبيت المتطلبات
```bash
npm install xml2js @types/xml2js
```

### 2. تشغيل Migration
```bash
npx prisma migrate dev --name add_project_management
```

### 3. تشغيل Seed (اختياري)
```bash
npx tsx prisma/seed-projects.ts
```

### 4. تشغيل التطبيق
```bash
npm run dev
```

## الملفات المهمة

- `src/app/compliance/page.tsx` - صفحة الامتثال الرئيسية
- `src/app/api/projects/route.ts` - API للمشاريع
- `src/app/api/projects/import-xml/route.ts` - API لاستيراد XML
- `prisma/schema.prisma` - نموذج قاعدة البيانات
- `prisma/seed-projects.ts` - بيانات تجريبية
- `public/sample-project.xml` - ملف XML تجريبي

## الميزات المستقبلية

- [ ] تحرير المشاريع والمهام
- [ ] إضافة تعليقات وملاحظات
- [ ] نظام تنبيهات للمواعيد
- [ ] تقارير وإحصائيات متقدمة
- [ ] تصدير المشاريع بصيغ مختلفة
- [ ] دعم ملفات Microsoft Project (.mpp)
- [ ] نظام تعاون متقدم
- [ ] تكامل مع أنظمة خارجية

## الدعم والمساهمة

للمساهمة في تطوير النظام أو الإبلاغ عن مشاكل، يرجى التواصل مع فريق التطوير.

---

**ملاحظة**: جميع التعليقات في الكود مكتوبة باللغة الإنجليزية وفقاً لمتطلبات المشروع. 