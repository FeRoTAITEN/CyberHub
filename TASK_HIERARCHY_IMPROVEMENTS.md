# تحسينات هيكل المهام والمهام الفرعية

## نظرة عامة

تم تحسين نظام عرض المهام والمهام الفرعية بشكل كبير لدعم الهيكل الهرمي الكامل للمهام المستوردة من ملفات Microsoft Project XML.

## التحسينات الرئيسية

### 1. تحسين استخراج البيانات
- **هيكل هرمي محسن**: استخراج صحيح للمهام والمهام الفرعية
- **ربط المراحل**: ربط المهام بالمراحل الصحيحة
- **معالجة OutlineLevel**: فهم صحيح لمستويات المهام في XML

### 2. عرض المراحل المحسن
- **تفاصيل المرحلة**: عرض التواريخ والحالة والترتيب
- **شريط التقدم**: عرض تقدم المرحلة بشكل مرئي
- **عدد المهام**: عرض عدد المهام في كل مرحلة

### 3. عرض المهام التفصيلي
- **معلومات شاملة**: المدة، الجهد، التكلفة، التواريخ
- **شريط التقدم**: لكل مهمة
- **المسؤولون**: عرض الموظفين المسؤولين مع نسبة المشاركة
- **الأولوية والحالة**: بألوان مميزة

### 4. المهام الفرعية التفاعلية
- **أزرار التوسيع/الطي**: يمكن توسيع أو طي المهام الفرعية
- **أيقونات واضحة**: ChevronDown/ChevronRight للدلالة على الحالة
- **عرض منظم**: المهام الفرعية تظهر بتصميم مختلف ومميز

## هيكل البيانات المحسن

### استخراج المهام من XML
```typescript
function groupTasksByPhases(tasks: any[]): { phases: any[], rootTasks: any[] } {
  const phases: any[] = [];
  const rootTasks: any[] = [];
  const phaseMap = new Map();
  const taskMap = new Map();

  // First pass: identify phases and create task map
  for (const task of tasks) {
    const outlineLevel = parseInt(extractText(task.OutlineLevel) || '0');
    const isSummary = extractText(task.Summary) === '1';
    const taskUID = extractText(task.UID);
    
    if (outlineLevel === 1 && isSummary) {
      // This is a phase
      const phase = extractPhaseData(task, phases.length);
      phases.push(phase);
      phaseMap.set(taskUID, phase);
    } else if (outlineLevel === 1 && !isSummary) {
      // This is a root level task
      const taskData = extractTaskData(task, rootTasks.length);
      rootTasks.push(taskData);
      taskMap.set(taskUID, taskData);
    } else {
      // This is a subtask
      const taskData = extractTaskData(task, 0);
      taskMap.set(taskUID, taskData);
    }
  }

  // Second pass: assign tasks to phases and create subtask hierarchy
  for (const task of tasks) {
    const outlineLevel = parseInt(extractText(task.OutlineLevel) || '0');
    const parentUID = extractText(task.ParentTaskUID);
    const taskUID = extractText(task.UID);
    
    if (outlineLevel > 1 && parentUID) {
      const taskData = taskMap.get(taskUID);
      const parentTask = taskMap.get(parentUID);
      const phase = phaseMap.get(parentUID);
      
      if (phase && taskData) {
        // Task belongs to a phase
        phase.tasks.push(taskData);
      } else if (parentTask && taskData) {
        // Task is a subtask of another task
        if (!parentTask.subtasks) {
          parentTask.subtasks = [];
        }
        parentTask.subtasks.push(taskData);
      }
    }
  }

  return { phases, rootTasks };
}
```

## ملف XML التجريبي المحسن

تم تحديث ملف `public/sample-project.xml` ليشمل:

### المرحلة الأولى: Assessment
- **Security Assessment** (مهمة رئيسية)
  - Network Security Review (مهمة فرعية)
  - Application Security Testing (مهمة فرعية)

### المرحلة الثانية: Implementation
- **Install Security Tools** (مهمة رئيسية)
  - Install Firewall (مهمة فرعية)
  - Install IDS/IPS (مهمة فرعية)
  - Install SIEM (مهمة فرعية)

### المرحلة الثالثة: Testing
- **Security Testing** (مهمة رئيسية)
  - Penetration Testing (مهمة فرعية)
  - Vulnerability Assessment (مهمة فرعية)

## تحسينات واجهة المستخدم

### 1. عرض المراحل
```jsx
{selectedProject.phases.map((phase: Phase) => (
  <div key={phase.id} className="bg-slate-800/30 rounded-lg p-4">
    <div className="flex items-center justify-between mb-3">
      <h4 className="text-white font-medium">
        {lang === 'ar' ? phase.name_ar : phase.name_en}
      </h4>
      <div className="flex items-center gap-3">
        <span className="text-sm text-slate-400">{phase.progress}%</span>
        <span className="text-sm text-slate-400">
          {phase.tasks?.length || 0} {lang === 'ar' ? 'مهمة' : 'tasks'}
        </span>
      </div>
    </div>
    {/* Phase details and tasks */}
  </div>
))}
```

### 2. عرض المهام مع التوسيع/الطي
```jsx
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

## الميزات الجديدة

### 1. إدارة حالة التوسيع
- **expandedTasks**: حالة توسيع المهام في المراحل
- **expandedSubtasks**: حالة توسيع المهام الفرعية في المهام الجذرية
- **toggleTaskExpansion**: دالة تبديل حالة توسيع المهام
- **toggleSubtaskExpansion**: دالة تبديل حالة توسيع المهام الفرعية

### 2. عرض المعلومات التفصيلية
- **المدة والجهد والتكلفة**: لكل مهمة ومهمة فرعية
- **المسؤولون**: مع نسبة المشاركة والجهد المطلوب
- **أشرطة التقدم**: لكل مستوى
- **الألوان والأيقونات**: للتمييز بين الحالات والأولويات

### 3. التصميم المتجاوب
- **تخطيط شبكي**: يعمل على جميع أحجام الشاشات
- **ألوان متدرجة**: ألوان مختلفة للمهام والمهام الفرعية
- **أيقونات واضحة**: لحالة المهام والأولوية

## كيفية الاستخدام

### 1. استيراد ملف XML
1. انتقل إلى صفحة الامتثال
2. انقر على "استيراد XML"
3. اختر ملف `sample-project.xml` المحسن
4. انتظر رسالة التأكيد

### 2. استعراض المهام
1. انقر على أيقونة العين لأي مشروع
2. استعرض المراحل والمهام
3. انقر على أيقونة السهم لتوسيع المهام الفرعية
4. استعرض تفاصيل كل مهمة

### 3. التفاعل مع المهام
- **توسيع/طي المهام الفرعية**: انقر على أيقونة السهم
- **عرض التفاصيل**: شاهد المدة والجهد والتكلفة
- **عرض المسؤولين**: شاهد الموظفين المسؤولين
- **متابعة التقدم**: شاهد أشرطة التقدم

## النتائج المتوقعة

بعد تطبيق هذه التحسينات، ستتمكن من:

1. **رؤية جميع المهام**: في المراحل والمهام الجذرية
2. **توسيع المهام الفرعية**: لعرض التفاصيل الكاملة
3. **متابعة التقدم**: لكل مستوى من المهام
4. **عرض المسؤولين**: مع تفاصيل المشاركة
5. **استعراض المعلومات**: المدة والجهد والتكلفة

## الخطوات التالية

1. **اختبار الاستيراد**: جرب استيراد الملف المحسن
2. **مراجعة البيانات**: تحقق من صحة المهام والمهام الفرعية
3. **إضافة ميزات**: يمكن إضافة ميزات إضافية مثل:
   - تحرير المهام
   - إضافة مهام جديدة
   - تصدير البيانات
   - مقارنة المشاريع

## الدعم

في حالة وجود أي مشاكل أو أسئلة حول التحسينات، يرجى التواصل مع فريق التطوير. 