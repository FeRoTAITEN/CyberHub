# Cyber Hub - Developer Quick Reference

## 🚀 Quick Start

### Essential Commands
```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linting
npm run lint
```

### Project Structure
```
src/
├── app/           # Next.js App Router pages
├── components/    # Reusable UI components
├── lib/          # Utility functions and hooks
└── locales/      # Translation files
```

## 🎨 Theme System

### Available Themes
```typescript
type Theme = 'default' | 'light' | 'midnight' | 'novel' | 'cyber' | 'salam';
```

### Using Theme Context
```typescript
import { useTheme } from '@/app/ClientLayout';

function MyComponent() {
  const { theme, setTheme } = useTheme();
  
  return (
    <div className={`theme-${theme}`}>
      {/* Theme-aware content */}
    </div>
  );
}
```

### Theme-Aware Styling
```typescript
const themeColors = {
  default: { modalBg: 'bg-slate-900/95', border: 'border-slate-700' },
  light: { modalBg: 'bg-white/95', border: 'border-slate-200' },
  // ... other themes
};

const colors = themeColors[theme] || themeColors.default;
return <div className={`${colors.modalBg} ${colors.border}`}>...</div>;
```

## 🌍 Language System

### Available Languages
```typescript
type Language = 'en' | 'ar';
```

### Using Language Context
```typescript
import { useLang } from '@/app/ClientLayout';

function MyComponent() {
  const { lang, setLang } = useLang();
  const dir = lang === 'ar' ? 'rtl' : 'ltr';
  
  return (
    <div lang={lang} dir={dir}>
      {/* Language-aware content */}
    </div>
  );
}
```

### Using Translations
```typescript
import { useTranslation } from '@/lib/useTranslation';

function MyComponent() {
  const { lang } = useLang();
  const { t } = useTranslation(lang);
  
  return (
    <h1>{t('page.title')}</h1>
    <p>{t('page.description')}</p>
  );
}
```

### Adding New Translations
1. Add to `src/locales/en.json`:
```json
{
  "newFeature": {
    "title": "New Feature",
    "description": "Description of the new feature"
  }
}
```

2. Add to `src/locales/ar.json`:
```json
{
  "newFeature": {
    "title": "ميزة جديدة",
    "description": "وصف الميزة الجديدة"
  }
}
```

## 🔤 Font System

### Available Fonts
```typescript
type Font = 'cairo' | 'tajawal' | 'noto' | 'amiri' | 'frutiger' | 'icomoon' | 'kufi' | '';
```

### Using Font Context
```typescript
import { useFont } from '@/app/ClientLayout';

function MyComponent() {
  const { font, setFont } = useFont();
  
  return (
    <div className={font ? `font-${font}` : ''}>
      {/* Font-aware content */}
    </div>
  );
}
```

## 📱 Responsive Design

### Breakpoints
```css
/* Mobile first approach */
.sm: 640px   /* Small devices */
.md: 768px   /* Medium devices */
.lg: 1024px  /* Large devices */
.xl: 1280px  /* Extra large devices */
```

### Responsive Classes
```typescript
// Responsive grid
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">

// Responsive text
<h1 className="text-2xl md:text-3xl lg:text-4xl">

// Responsive spacing
<div className="p-4 md:p-6 lg:p-8">
```

## 🧩 Component Patterns

### Basic Component Structure
```typescript
'use client';

import { useLang, useTheme } from '@/app/ClientLayout';
import { useTranslation } from '@/lib/useTranslation';

interface ComponentProps {
  // Define props
}

export default function ComponentName({ /* props */ }: ComponentProps) {
  const { lang } = useLang();
  const { theme } = useTheme();
  const { t } = useTranslation(lang);

  return (
    <div className="component-classes">
      {/* Component content */}
    </div>
  );
}
```

### Theme-Aware Component
```typescript
function ThemeAwareComponent() {
  const { theme } = useTheme();
  
  const themeColors = {
    default: { bg: 'bg-slate-900', text: 'text-white' },
    light: { bg: 'bg-white', text: 'text-slate-900' },
    // ... other themes
  };
  
  const colors = themeColors[theme] || themeColors.default;
  
  return (
    <div className={`${colors.bg} ${colors.text}`}>
      {/* Theme-aware content */}
    </div>
  );
}
```

### Responsive Component
```typescript
function ResponsiveComponent() {
  return (
    <div className="
      grid 
      grid-cols-1 
      md:grid-cols-2 
      lg:grid-cols-3 
      gap-4 
      p-4 
      md:p-6 
      lg:p-8
    ">
      {/* Responsive content */}
    </div>
  );
}
```

## 🎯 Common CSS Classes

### Layout Classes
```css
.container-responsive    /* Responsive container */
.gradient-bg           /* Default background */
.card                  /* Card component */
.card-hover            /* Hoverable card */
.card-glass            /* Glass effect card */
```

### Button Classes
```css
.btn-primary           /* Primary button */
.btn-secondary        /* Secondary button */
.btn-danger           /* Danger button */
.btn-success          /* Success button */
.btn-outline          /* Outline button */
```

### Form Classes
```css
.input-field          /* Input field styling */
.form-group           /* Form group container */
.form-label           /* Form label */
.form-error           /* Form error message */
```

### Animation Classes
```css
.title-animate         /* Title animation */
.subtitle-animate      /* Subtitle animation */
.content-animate       /* Content animation */
.stagger-animate       /* Staggered animation */
```

## 🔧 Utility Functions

### LocalStorage Helpers
```typescript
// Save to localStorage
const saveToStorage = (key: string, value: string) => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, value);
  } catch (error) {
    console.warn(`Failed to save ${key} to localStorage:`, error);
  }
};

// Load from localStorage
const loadFromStorage = (key: string, defaultValue: string) => {
  if (typeof window === 'undefined') return defaultValue;
  try {
    const stored = localStorage.getItem(key);
    return stored || defaultValue;
  } catch (error) {
    console.warn(`Failed to load ${key} from localStorage:`, error);
    return defaultValue;
  }
};
```

### Font Application
```typescript
const applyFontToBody = (font: Font) => {
  if (typeof window === 'undefined') return;
  
  const body = document.body;
  body.classList.remove('font-cairo', 'font-tajawal', 'font-noto', 'font-amiri', 'font-frutiger', 'font-icomoon', 'font-kufi');
  
  if (font) {
    body.classList.add(`font-${font}`);
  }
};
```

## 📝 Best Practices

### 1. Always Use Context Hooks
```typescript
// ✅ Good
const { lang, theme } = useLang();
const { t } = useTranslation(lang);

// ❌ Bad
const [localLang, setLocalLang] = useState('en');
```

### 2. Theme-Aware Styling
```typescript
// ✅ Good
const colors = themeColors[theme] || themeColors.default;
return <div className={`${colors.bg} ${colors.text}`}>...</div>;

// ❌ Bad
return <div className="bg-slate-900 text-white">...</div>;
```

### 3. Translation Keys
```typescript
// ✅ Good
<h1>{t('page.title')}</h1>

// ❌ Bad
<h1>Page Title</h1>
```

### 4. Responsive Design
```typescript
// ✅ Good
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">

// ❌ Bad
<div className="grid grid-cols-3">
```

### 5. Performance
```typescript
// ✅ Good: Memoize expensive components
const MemoizedComponent = React.memo(ExpensiveComponent);

// ✅ Good: Use useCallback for handlers
const handleClick = useCallback(() => {
  // Handler logic
}, [dependencies]);
```

## 🚨 Common Pitfalls

### 1. Forgetting 'use client'
```typescript
// ❌ Bad: Server component trying to use hooks
import { useLang } from '@/app/ClientLayout';

// ✅ Good: Client component
'use client';
import { useLang } from '@/app/ClientLayout';
```

### 2. Missing Theme Support
```typescript
// ❌ Bad: Hardcoded colors
<div className="bg-slate-900 text-white">

// ✅ Good: Theme-aware colors
<div className={`${colors.bg} ${colors.text}`}>
```

### 3. Ignoring RTL Support
```typescript
// ❌ Bad: Fixed margins
<div className="ml-4">

// ✅ Good: RTL-aware margins
<div className={lang === 'ar' ? 'mr-4' : 'ml-4'}>
```

### 4. Not Using Translation Keys
```typescript
// ❌ Bad: Hardcoded text
<button>Submit</button>

// ✅ Good: Translation key
<button>{t('form.submit')}</button>
```

## 🔍 Debugging Tips

### 1. Check Context Values
```typescript
function DebugComponent() {
  const { lang, theme } = useLang();
  const { font } = useFont();
  
  console.log('Current state:', { lang, theme, font });
  
  return <div>Debug info in console</div>;
}
```

### 2. Theme Testing
```typescript
// Test all themes
const themes: Theme[] = ['default', 'light', 'midnight', 'novel', 'cyber', 'salam'];

themes.forEach(theme => {
  setTheme(theme);
  // Check component appearance
});
```

### 3. Language Testing
```typescript
// Test both languages
const languages: Language[] = ['en', 'ar'];

languages.forEach(lang => {
  setLang(lang);
  // Check RTL/LTR and translations
});
```

## 📚 Additional Resources

- **Architecture Guide**: `ARCHITECTURE_GUIDE.md`
- **Project Summary**: `PROJECT_SUMMARY.md`
- **Component Library**: `src/components/`
- **Translation Files**: `src/locales/`
- **Global Styles**: `src/app/globals.css`

---

**Remember**: Always follow the established patterns, use the context hooks, and ensure your components are theme-aware, language-supportive, and responsive! 