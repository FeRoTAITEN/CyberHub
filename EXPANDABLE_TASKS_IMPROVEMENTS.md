# تحسينات المهام القابلة للتوسيع

## نظرة عامة

تم إضافة وظيفة التوسيع/الطي للمراحل والمهام والمهام الفرعية، مما يتيح للمستخدمين استعراض تفاصيل المشروع بشكل تفاعلي ومنظم.

## الميزات الجديدة

### 1. توسيع/طي المراحل
- **أزرار التوسيع**: أيقونات ChevronRight/ChevronDown لكل مرحلة
- **عرض عدد المهام**: عدد المهام في كل مرحلة
- **عرض المهام**: عند التوسيع تظهر جميع المهام في المرحلة

### 2. توسيع/طي المهام
- **أزرار التوسيع**: لكل مهمة تحتوي على مهام فرعية
- **عرض عدد المهام الفرعية**: عدد المهام الفرعية لكل مهمة
- **عرض المهام الفرعية**: عند التوسيع تظهر جميع المهام الفرعية

### 3. إدارة الحالة
- **expandedPhases**: حالة توسيع المراحل
- **expandedTasks**: حالة توسيع المهام في المراحل
- **expandedSubtasks**: حالة توسيع المهام الفرعية في المهام الجذرية

## التحسينات في واجهة المستخدم

### 1. عرض المراحل مع أزرار التوسيع
```jsx
<div className="flex items-center gap-3">
  <h4 className="text-white font-medium">
    {lang === 'ar' ? phase.name_ar : phase.name_en}
  </h4>
  {phase.tasks && phase.tasks.length > 0 && (
    <button
      onClick={() => togglePhaseExpansion(phase.id)}
      className="text-blue-400 hover:text-blue-300 transition-colors"
    >
      {expandedPhases.has(phase.id) ? (
        <ChevronDownIcon className="w-5 h-5" />
      ) : (
        <ChevronRightIcon className="w-5 h-5" />
      )}
    </button>
  )}
  {phase.tasks && phase.tasks.length > 0 && (
    <span className="text-xs bg-blue-500/20 text-blue-400 px-2 py-1 rounded">
      {phase.tasks.length} {lang === 'ar' ? 'مهمة' : 'tasks'}
    </span>
  )}
</div>
```

### 2. عرض المهام مع أزرار التوسيع
```jsx
<div className="flex items-center gap-2">
  <div className={`w-2 h-2 rounded-full ${getStatusColor(task.status)}`}></div>
  <span className="text-white font-medium">
    {lang === 'ar' ? task.name_ar : task.name_en}
  </span>
  {task.subtasks && task.subtasks.length > 0 && (
    <button
      onClick={() => toggleTaskExpansion(task.id)}
      className="text-blue-400 hover:text-blue-300 transition-colors"
    >
      {expandedTasks.has(task.id) ? (
        <ChevronDownIcon className="w-4 h-4" />
      ) : (
        <ChevronRightIcon className="w-4 h-4" />
      )}
    </button>
  )}
  {task.subtasks && task.subtasks.length > 0 && (
    <span className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded">
      {task.subtasks.length} {lang === 'ar' ? 'فرعية' : 'sub'}
    </span>
  )}
</div>
```

### 3. عرض المهام الفرعية
```jsx
{task.subtasks && task.subtasks.length > 0 && expandedTasks.has(task.id) && (
  <div className="border-t border-slate-600 pt-3">
    <h6 className="text-xs font-medium text-slate-300 mb-2">
      {lang === 'ar' ? 'المهام الفرعية' : 'Subtasks'} ({task.subtasks.length})
    </h6>
    <div className="space-y-2">
      {task.subtasks.map((subtask: Task) => (
        <div key={subtask.id} className="bg-slate-600/30 rounded p-2">
          {/* Subtask details */}
        </div>
      ))}
    </div>
  </div>
)}
```

## دوال إدارة الحالة

### 1. تبديل حالة المراحل
```typescript
const togglePhaseExpansion = (phaseId: number) => {
  const newExpanded = new Set(expandedPhases);
  if (newExpanded.has(phaseId)) {
    newExpanded.delete(phaseId);
  } else {
    newExpanded.add(phaseId);
  }
  setExpandedPhases(newExpanded);
};
```

### 2. تبديل حالة المهام
```typescript
const toggleTaskExpansion = (taskId: number) => {
  const newExpanded = new Set(expandedTasks);
  if (newExpanded.has(taskId)) {
    newExpanded.delete(taskId);
  } else {
    newExpanded.add(taskId);
  }
  setExpandedTasks(newExpanded);
};
```

### 3. تبديل حالة المهام الفرعية
```typescript
const toggleSubtaskExpansion = (taskId: number) => {
  const newExpanded = new Set(expandedSubtasks);
  if (newExpanded.has(taskId)) {
    newExpanded.delete(taskId);
  } else {
    newExpanded.add(taskId);
  }
  setExpandedSubtasks(newExpanded);
};
```

## التصميم والتفاعل

### 1. الألوان والأيقونات
- **أزرار التوسيع**: أزرار زرقاء مع أيقونات Chevron
- **عدد المهام**: علامات زرقاء للمهام، خضراء للمهام الفرعية
- **التفاعل**: تأثيرات hover وتغيير الألوان

### 2. التخطيط
- **تسلسل هرمي واضح**: المراحل → المهام → المهام الفرعية
- **فواصل بصرية**: خطوط فاصلة بين المستويات
- **مساحات مناسبة**: تباعد مناسب بين العناصر

### 3. الاستجابة
- **تخطيط متجاوب**: يعمل على جميع أحجام الشاشات
- **أداء محسن**: تحديث سريع للحالة
- **تجربة سلسة**: انتقالات سلسة بين الحالات

## كيفية الاستخدام

### 1. توسيع المراحل
1. انقر على أيقونة السهم بجانب اسم المرحلة
2. ستظهر جميع المهام في المرحلة
3. انقر مرة أخرى لإخفاء المهام

### 2. توسيع المهام
1. انقر على أيقونة السهم بجانب اسم المهمة
2. ستظهر جميع المهام الفرعية
3. انقر مرة أخرى لإخفاء المهام الفرعية

### 3. استعراض التفاصيل
- **المدة والجهد**: لكل مهمة ومهمة فرعية
- **المسؤولون**: مع نسبة المشاركة
- **أشرطة التقدم**: لكل مستوى
- **الأولويات والحالة**: بألوان مميزة

## الميزات التفاعلية

### 1. حفظ الحالة
- **حالة التوسيع**: يتم حفظها أثناء الجلسة
- **استعادة الحالة**: عند إعادة تحميل الصفحة
- **إعادة تعيين**: عند تغيير المشروع

### 2. التنقل السريع
- **توسيع الكل**: يمكن إضافة زر لتوسيع جميع المراحل
- **طي الكل**: يمكن إضافة زر لطي جميع المراحل
- **البحث**: يمكن إضافة وظيفة بحث في المهام

### 3. التصدير والطباعة
- **تصدير PDF**: مع الحالة الموسعة
- **طباعة**: تخطيط محسن للطباعة
- **مشاركة**: روابط مع حالة محددة

## النتائج المتوقعة

بعد تطبيق هذه التحسينات، ستتمكن من:

1. **استعراض منظم**: هيكل هرمي واضح للمشروع
2. **تفاعل سلس**: توسيع وطي سريع
3. **تفاصيل شاملة**: جميع المعلومات متاحة
4. **تجربة محسنة**: واجهة مستخدم أفضل

## الخطوات التالية

1. **اختبار الوظائف**: جرب التوسيع والطي
2. **إضافة ميزات**: يمكن إضافة ميزات إضافية مثل:
   - توسيع/طي الكل
   - البحث في المهام
   - تصدير البيانات
   - حفظ التفضيلات

## الدعم

في حالة وجود أي مشاكل أو أسئلة حول التحسينات، يرجى التواصل مع فريق التطوير. 