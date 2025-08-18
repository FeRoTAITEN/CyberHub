# Cyber Hub Architecture Guide

## Project Overview

Cyber Hub is an enterprise-level cybersecurity portal built with Next.js 14, featuring dynamic themes, multi-language support (Arabic/English), and a scalable component architecture designed for horizontal scaling.

## Core Architecture Principles

### 1. Stateless Design
- **Context-based State Management**: Uses React Context for global state (language, theme, font)
- **LocalStorage Persistence**: User preferences stored locally for better performance
- **No Server-Side State Dependencies**: Components can be rendered on any server instance

### 2. Component Reusability
- **Shared Components**: All UI components follow consistent patterns
- **Theme-Aware Styling**: Components automatically adapt to selected themes
- **Language-Agnostic**: Components use translation keys, not hardcoded text

### 3. Scalability Features
- **Auto-scaling Ready**: Stateless components support load balancing
- **Performance Optimized**: Minimal re-renders, efficient state updates
- **Memory Efficient**: Proper cleanup and effect management

## Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── ClientLayout.tsx   # Root layout with context providers
│   ├── layout.tsx         # HTML structure and font loading
│   └── globals.css        # Global styles and theme definitions
├── components/            # Reusable UI components
│   ├── Navigation.tsx     # Main navigation with responsive design
│   ├── ThemeSwitcher.tsx # Theme selection component
│   ├── LanguageSwitcher.tsx # Language switching component
│   ├── FontSwitcher.tsx  # Font selection component
│   └── SwitchersDropdown.tsx # Unified switcher interface
├── lib/                   # Utility functions and hooks
│   ├── useTranslation.ts # Translation hook
│   └── surveyTypes.ts    # Type definitions
└── locales/              # Translation files
    ├── en.json           # English translations
    └── ar.json           # Arabic translations
```

## Theme System

### Available Themes
1. **default** - Cyber Hub Original (dark blue gradient)
2. **light** - Clean & Modern (white/light gray)
3. **midnight** - Deep Slate Gradient
4. **novel** - Classic Termius (cream/yellow)
5. **cyber** - Matrix Style (black/gray)
6. **salam** - Salam Company Brand (green gradient)

### Theme Implementation
```typescript
// Use theme context
const { theme, setTheme } = useTheme();

// Theme-aware styling
const themeColors = {
  default: { modalBg: 'bg-slate-900/95', border: 'border-slate-700' },
  light: { modalBg: 'bg-white/95', border: 'border-slate-200' },
  // ... other themes
};
```

## Language System

### Supported Languages
- **English (en)**: Default language, LTR layout
- **Arabic (ar)**: RTL layout with Arabic fonts

### Translation Implementation
```typescript
// Use translation hook
const { t } = useTranslation(lang);

// Access translations
const title = t('nav.home');
const description = t('home.subtitle');
```

### Adding New Translations
1. Add keys to `src/locales/en.json`
2. Add corresponding Arabic translations to `src/locales/ar.json`
3. Use the `t()` function in components

## Font System

### Available Fonts
- **cairo** - Modern Arabic
- **tajawal** - Professional Arabic
- **noto** - Google Noto Sans Arabic
- **amiri** - Classic Arabic
- **frutiger** - Professional Arabic
- **icomoon** - Icon Font
- **kufi** - Salam Company Font

### Font Implementation
```typescript
// Use font context
const { font, setFont } = useFont();

// Font classes are automatically applied to body
// CSS handles font inheritance for all elements
```

## Component Development Guidelines

### 1. Follow Existing Patterns
```typescript
// ✅ Good: Use established context hooks
const { lang, theme } = useLang();
const { t } = useTranslation(lang);

// ❌ Bad: Don't create new state management
const [localLang, setLocalLang] = useState('en');
```

### 2. Theme-Aware Components
```typescript
// ✅ Good: Theme-responsive styling
const colors = themeColors[theme] || themeColors.default;
return (
  <div className={`${colors.modalBg} ${colors.border}`}>
    {/* Content */}
  </div>
);

// ❌ Bad: Hardcoded colors
return (
  <div className="bg-slate-900 border-slate-700">
    {/* Content */}
  </div>
);
```

### 3. Language Support
```typescript
// ✅ Good: Use translation keys
<h1>{t('page.title')}</h1>
<p>{t('page.description')}</p>

// ❌ Bad: Hardcoded text
<h1>Page Title</h1>
<p>Page description</p>
```

### 4. Responsive Design
```typescript
// ✅ Good: Mobile-first approach
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  {/* Content */}
</div>

// ❌ Bad: Desktop-only design
<div className="grid grid-cols-3 gap-4">
  {/* Content */}
</div>
```

## Performance Best Practices

### 1. Minimize Re-renders
```typescript
// ✅ Good: Memoize expensive components
const MemoizedComponent = React.memo(ExpensiveComponent);

// ✅ Good: Use useCallback for event handlers
const handleClick = useCallback(() => {
  // Handler logic
}, [dependencies]);
```

### 2. Efficient State Updates
```typescript
// ✅ Good: Batch state updates
const updateMultipleStates = () => {
  setLang(newLang);
  setTheme(newTheme);
  setFont(newFont);
};

// ❌ Bad: Multiple separate updates
const updateMultipleStates = () => {
  setLang(newLang);
  // Component re-renders
  setTheme(newTheme);
  // Component re-renders again
  setFont(newFont);
  // Component re-renders again
};
```

### 3. Proper Effect Dependencies
```typescript
// ✅ Good: Minimal dependencies
useEffect(() => {
  // Effect logic
}, [essentialDependency]);

// ❌ Bad: Unnecessary dependencies
useEffect(() => {
  // Effect logic
}, [lang, theme, font, user, settings, preferences]);
```

## Adding New Features

### 1. New Page
```typescript
// src/app/new-feature/page.tsx
'use client';

import { useLang, useTheme } from '@/app/ClientLayout';
import { useTranslation } from '@/lib/useTranslation';

export default function NewFeaturePage() {
  const { lang } = useLang();
  const { theme } = useTheme();
  const { t } = useTranslation(lang);

  return (
    <div className="min-h-screen gradient-bg">
      <div className="container-responsive py-8">
        <div className="page-header">
          <h1 className="page-title title-animate">
            {t('newFeature.title')}
          </h1>
          <p className="page-subtitle subtitle-animate">
            {t('newFeature.description')}
          </p>
        </div>
        
        {/* Page content */}
      </div>
    </div>
  );
}
```

### 2. New Component
```typescript
// src/components/NewComponent.tsx
'use client';

import { useLang, useTheme } from '@/app/ClientLayout';
import { useTranslation } from '@/lib/useTranslation';

interface NewComponentProps {
  // Component props
}

export default function NewComponent({ /* props */ }: NewComponentProps) {
  const { lang } = useLang();
  const { theme } = useTheme();
  const { t } = useTranslation(lang);

  // Theme-aware colors
  const colors = themeColors[theme] || themeColors.default;

  return (
    <div className={`${colors.modalBg} ${colors.border}`}>
      {/* Component content */}
    </div>
  );
}
```

### 3. New API Route
```typescript
// src/app/api/new-feature/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // API logic
    return NextResponse.json({ success: true, data: {} });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    // API logic
    return NextResponse.json({ success: true, data: {} });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
```

## CSS Guidelines

### 1. Theme Classes
```css
/* ✅ Good: Theme-specific styles */
.theme-light .card {
  @apply bg-white/95 border border-slate-200/70;
}

.theme-salam .card {
  background: #fff;
  border: none;
  box-shadow: 0 4px 24px 0 rgba(0,57,49,0.08);
}
```

### 2. Component Classes
```css
/* ✅ Good: Reusable component styles */
.card {
  @apply bg-slate-900/80 backdrop-blur-md border border-slate-700/50 rounded-2xl shadow-2xl p-8;
}

.card-hover {
  @apply card hover:border-green-500/50 hover:shadow-green-500/20 transition-all duration-500;
}
```

### 3. Utility Classes
```css
/* ✅ Good: Utility-first approach */
.gradient-bg {
  background: linear-gradient(135deg, rgb(0, 32, 53) 0%, rgb(0, 20, 35) 50%, rgb(0, 15, 25) 100%);
}

.cyber-glow {
  box-shadow: 0 0 30px rgba(34, 197, 94, 0.4);
}
```

## Testing and Quality Assurance

### 1. Component Testing
- Test theme switching functionality
- Verify language switching and RTL support
- Ensure responsive design works on all breakpoints
- Test font switching and application

### 2. Performance Testing
- Monitor bundle size
- Test with multiple themes active
- Verify memory usage patterns
- Check for memory leaks in effects

### 3. Accessibility Testing
- Verify keyboard navigation
- Test screen reader compatibility
- Ensure proper ARIA labels
- Check color contrast ratios

## Deployment Considerations

### 1. Environment Variables
```bash
# .env.local
NEXT_PUBLIC_APP_NAME=Cyber Hub
NEXT_PUBLIC_API_URL=https://api.cyberhub.com
```

### 2. Build Optimization
```bash
# package.json scripts
"build": "next build",
"build:analyze": "ANALYZE=true next build"
```

### 3. Monitoring
- Implement error tracking (Sentry, LogRocket)
- Add performance monitoring
- Set up uptime monitoring
- Configure alerting for critical issues

## Conclusion

This architecture guide provides the foundation for building scalable, maintainable features in Cyber Hub. Always follow the established patterns and ensure new components integrate seamlessly with the existing theme, language, and font systems.

Remember:
- **Stateless First**: Design for horizontal scaling
- **Theme Aware**: All components should support theme switching
- **Language Support**: Use translation keys, not hardcoded text
- **Performance**: Minimize re-renders and optimize bundle size
- **Consistency**: Follow established patterns and conventions 