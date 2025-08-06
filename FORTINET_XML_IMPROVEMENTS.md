# تحسينات دعم ملفات Fortinet XML

## نظرة عامة

تم تحسين نظام استيراد ملفات Microsoft Project XML لدعم ملفات Fortinet & F5 بشكل خاص، مع إصلاح مشاكل عرض المهام والمهام الفرعية والنسب المئوية للتقدم.

## المشاكل التي تم إصلاحها

### 1. مشكلة عدم عرض المهام
- **المشكلة**: الملفات لا تعرض المهام والمهام الفرعية
- **السبب**: تنسيق مختلف في هيكل XML
- **الحل**: تحسين منطق استخراج البيانات

### 2. مشكلة النسب المئوية
- **المشكلة**: نسب التقدم غير صحيحة
- **السبب**: تنسيق مختلف لحقول التقدم
- **الحل**: دعم حقول `PercentComplete` و `PercentWorkComplete`

### 3. مشكلة المدة والجهد
- **المشكلة**: المدة والجهد لا تظهر بشكل صحيح
- **السبب**: تنسيق Microsoft Project للمدة
- **الحل**: تحليل تنسيق `PT328H0M0S`

## التحسينات المنجزة

### 1. تحسين استخراج المهام
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
    
    // Skip the root project task (UID 0)
    if (taskUID === '0') {
      continue;
    }
    
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
    
    // Skip the root project task
    if (taskUID === '0') {
      continue;
    }
    
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

### 2. تحسين استخراج النسب المئوية
```typescript
function extractTaskData(task: any, order: number): any {
  const duration = extractText(task.Duration);
  const work = extractText(task.Work);
  const cost = extractText(task.Cost);
  const percentComplete = extractText(task.PercentComplete);
  const percentWorkComplete = extractText(task.PercentWorkComplete);
  
  return {
    id: extractText(task.UID) || extractText(task.ID),
    name_en: extractText(task.Name) || `Task ${order + 1}`,
    name_ar: extractText(task.Name) || `مهمة ${order + 1}`,
    description: extractText(task.Description) || extractText(task.Notes),
    start_date: extractDate(task.Start) || extractDate(task.StartDate) || new Date().toISOString(),
    end_date: extractDate(task.Finish) || extractDate(task.FinishDate) || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    status: extractText(task.Status) || 'active',
    priority: extractText(task.Priority) || 'medium',
    progress: extractProgress(percentComplete) || extractProgress(percentWorkComplete) || 0,
    order: order,
    duration: parseDuration(duration) || 0,
    work: parseDuration(work) || 0,
    cost: extractNumber(cost) || 0,
    subtasks: [],
    assignments: extractTaskAssignments(task),
  };
}
```

### 3. تحسين تحليل المدة
```typescript
function parseDuration(durationStr: string | null): number {
  if (!durationStr) return 0;
  
  // Handle Microsoft Project duration format: PT328H0M0S
  const match = durationStr.match(/PT(\d+)H(\d+)M(\d+)S/);
  if (match) {
    const hours = parseInt(match[1]) || 0;
    const minutes = parseInt(match[2]) || 0;
    const seconds = parseInt(match[3]) || 0;
    return hours + (minutes / 60) + (seconds / 3600);
  }
  
  // Handle simple hour format: "8h", "8.5h"
  const hourMatch = durationStr.match(/(\d+(?:\.\d+)?)h/i);
  if (hourMatch) {
    return parseFloat(hourMatch[1]);
  }
  
  // Handle simple number (assume hours)
  const numMatch = durationStr.match(/(\d+(?:\.\d+)?)/);
  if (numMatch) {
    return parseFloat(numMatch[1]);
  }
  
  return 0;
}
```

### 4. تحسين استخراج الموارد
```typescript
function extractResourceData(resource: any): any {
  const resourceUID = extractText(resource.UID);
  const resourceName = extractText(resource.Name);
  
  // Skip resource with UID 0 (usually a placeholder)
  if (resourceUID === '0' || !resourceName) {
    return null;
  }
  
  return {
    id: resourceUID || extractText(resource.ID),
    name_en: resourceName || 'Resource',
    name_ar: resourceName || 'مورد',
    email: extractText(resource.EmailAddress) || `${resourceName.toLowerCase().replace(/\s+/g, '.')}@company.com`,
    role: extractText(resource.Title) || extractText(resource.Role) || 'Team Member',
    type: extractText(resource.Type) || 'work',
    max_units: extractNumber(resource.MaxUnits) || 100,
    standard_rate: extractNumber(resource.StandardRate) || 0,
    overtime_rate: extractNumber(resource.OvertimeRate) || 0,
    work: parseDuration(extractText(resource.Work)) || 0,
    actual_work: parseDuration(extractText(resource.ActualWork)) || 0,
    percent_work_complete: extractProgress(extractText(resource.PercentWorkComplete)) || 0,
  };
}
```

## هيكل ملف Fortinet XML

### المهام الرئيسية
- **Project Initiation** (UID: 124) - 100% مكتمل
- **Planning** (UID: 129) - 100% مكتمل
- **Design** (UID: 133) - 100% مكتمل
- **Site & Prerequisites Readiness Check** (UID: 137) - 100% مكتمل
- **Delivery** (UID: 141) - 100% مكتمل
- **Implementation** (UID: 145) - 77% مكتمل
- **Review and Testing** (UID: 149) - 0% مكتمل
- **Go Live** (UID: 153) - 0% مكتمل
- **Documentation** (UID: 157) - 0% مكتمل
- **Handing Over** (UID: 161) - 0% مكتمل
- **Closure** (UID: 165) - 0% مكتمل

### الموارد
- **Salam** (UID: 1) - 78% مكتمل
- **Barq Systems** (UID: 2) - 93% مكتمل

### المهام الفرعية
كل مرحلة تحتوي على مهام فرعية متعددة مع تفاصيل كاملة عن:
- المدة والجهد
- نسب التقدم
- المسؤولون
- التبعيات

## التحسينات في واجهة المستخدم

### 1. عرض النسب المئوية الصحيحة
- **PercentComplete**: نسبة إكمال المهمة
- **PercentWorkComplete**: نسبة إكمال العمل
- **عرض مرئي**: أشرطة التقدم الملونة

### 2. عرض المدة والجهد
- **تحليل صحيح**: تنسيق Microsoft Project
- **عرض بالساعات**: تحويل تلقائي
- **تفاصيل كاملة**: لكل مهمة ومهمة فرعية

### 3. عرض المسؤولين
- **تصفية الموارد**: تجاهل الموارد الفارغة
- **معلومات شاملة**: العمل الفعلي والمتبقي
- **نسب المشاركة**: مع التفاصيل

## كيفية الاستخدام

### 1. استيراد ملف Fortinet XML
1. انتقل إلى صفحة الامتثال
2. انقر على "استيراد XML"
3. اختر ملف `SALAM DR Fortinet & F5 Project Plan V2.1.xml`
4. انتظر رسالة التأكيد

### 2. استعراض البيانات المستوردة
1. انقر على أيقونة العين لأي مشروع
2. استعرض المراحل والمهام
3. انقر على أيقونة السهم لتوسيع المهام الفرعية
4. شاهد النسب المئوية الصحيحة

### 3. التحقق من البيانات
- **المراحل**: 11 مرحلة رئيسية
- **المهام**: مئات المهام والمهام الفرعية
- **الموارد**: 2 مورد رئيسي
- **التقدم**: نسب دقيقة للتقدم

## النتائج المتوقعة

بعد تطبيق هذه التحسينات، ستتمكن من:

1. **رؤية جميع المهام**: في المراحل والمهام الجذرية
2. **توسيع المهام الفرعية**: لعرض التفاصيل الكاملة
3. **متابعة التقدم الدقيق**: نسب مئوية صحيحة
4. **عرض المسؤولين**: مع تفاصيل العمل
5. **استعراض المعلومات**: المدة والجهد والتكلفة

## الخطوات التالية

1. **اختبار الاستيراد**: جرب استيراد ملف Fortinet XML
2. **مراجعة البيانات**: تحقق من صحة المهام والنسب
3. **إضافة ميزات**: يمكن إضافة ميزات إضافية مثل:
   - تصدير التقارير
   - تحرير البيانات
   - مقارنة المشاريع
   - تحليل الأداء

## الدعم

في حالة وجود أي مشاكل أو أسئلة حول التحسينات، يرجى التواصل مع فريق التطوير. 