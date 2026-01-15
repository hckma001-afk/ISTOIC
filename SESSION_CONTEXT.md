# SESSION CONTEXT & CONTINUATION GUIDE

## 🎯 PROJECT OVERVIEW
**ISTOIC AI** - Premium AI Chat & Productivity App
- **Tech Stack**: React + TypeScript + Vite + Capacitor
- **Target Platforms**: iOS Web, iOS PWA, iOS Capacitor
- **Theme**: Premium Dark Theme (exceeds ChatGPT quality) + Bento Grid System

---

## ✅ COMPLETED IN THIS SESSION

### 1. **Premium Dark Theme Implementation**
- **File**: `index.css`
- **Changes**: 
  - Dark background: `#0a0a0b` (premium, darker than ChatGPT)
  - 3-level surface hierarchy
  - Bento gradient system (purple, teal, orange, green, red, blue)
  - Premium multi-layer shadows
  - iOS optimizations (safe area, dynamic viewport)

### 2. **Bento Grid System**
- **Files**: 
  - `components/ui/Card.tsx` - 12+ bento variants
  - `components/ui/GlassCard.tsx` - Gradient support
  - `constants/bentoTheme.ts` - Theme constants
  - `index.css` - Bento utilities & animations
- **Features**:
  - Gradient cards (purple, teal, orange, green, red, blue)
  - Solid variant cards
  - Bento-specific styling (24px radius, shadows, spacing)
  - Responsive grid system

### 3. **Dashboard Bento Layout**
- **File**: `features/dashboard/DashboardView.tsx`
- **Changes**: Converted to bento grid with gradient cards
- **Layout**: 12-column grid with varied card sizes

### 4. **SmartNotes Features Restored**
- **Files Created**:
  - `features/smartNotes/NoteBatchActions.tsx` - Batch selection & actions
  - `features/smartNotes/NoteAgentConsole.tsx` - AI agent console (4 agents)
- **Files Updated**:
  - `features/smartNotes/NotesListView.tsx` - Added selection mode
  - `features/smartNotes/SmartNotesView.tsx` - Integrated agent console
  - `constants/registry.ts` - Added new UI registry entries

### 5. **TypeScript Fixes**
- Fixed all import path errors
- Fixed type errors in Card, GlassCard, NeuralLink, etc.
- Installed missing packages (@tanstack/react-query, framer-motion)

---

## 📁 KEY FILES & STRUCTURE

### Core Theme Files
```
index.css                    # Main CSS with dark theme + bento system
tailwind.config.ts           # Tailwind config with custom colors
constants/bentoTheme.ts      # Bento color constants (NEW)
App.tsx                      # Main app with theme management
```

### Component Files
```
components/ui/Card.tsx       # Card with bento variants
components/ui/GlassCard.tsx # Glass card with gradients
components/ui/Button.tsx    # Button component
components/ui/Dialog.tsx    # Dialog component
```

### Feature Modules
```
features/dashboard/DashboardView.tsx    # Bento grid dashboard
features/smartNotes/                    # Notes module (complete)
features/aiChat/                        # AI Chat (needs update)
features/aiTools/                       # AI Tools (needs update)
features/systemHealth/                  # System Health (needs update)
features/settings/                      # Settings (needs update)
```

### Services
```
services/noteAgentService.ts  # AI agents for notes
services/neuralLink.ts        # Neural link service
services/melsaKernel.ts       # AI kernel
```

---

## 🎨 DESIGN SYSTEM

### Color Palette (Dark Theme)
```css
--bg: #0a0a0b                    /* Premium dark background */
--surface: #121214               /* Card background */
--surface-2: #1a1a1c            /* Elevated surface */
--text: #fafafa                  /* Primary text */
--text-muted: #a1a1a6           /* Secondary text */

/* Bento Gradients */
--bento-purple: #8b5cf6
--bento-teal: #14b8a6
--bento-orange: #f97316
--bento-green: #10b981
--bento-red: #ef4444
--bento-blue: #3b82f6
```

### Bento Card Usage
```tsx
<Card tone="bento-purple" padding="bento" interactive bento>
  <div className="bento-card-content">
    <h3 className="bento-card-title">Title</h3>
    <p className="bento-card-description">Description</p>
  </div>
</Card>
```

### Bento Grid Layout
```tsx
<section className="bento-grid grid grid-cols-12 gap-[var(--bento-gap)]">
  {/* Cards with col-span-* for sizing */}
</section>
```

---

## 🚀 NEXT STEPS - MODULES TO UPDATE

### Priority 1: AI Chat Module
**Files to Update**:
- `features/aiChat/AIChatView.tsx`
- `features/aiChat/components/ChatWindow.tsx`
- `features/aiChat/components/ChatHistory.tsx`
- `features/aiChat/components/ChatInput.tsx`

**Tasks**:
- Apply bento styling to chat messages
- Update chat cards with gradient variants
- Improve message bubbles design
- Add bento-style model picker
- Optimize for iOS (safe area, keyboard)

**Keywords**: `aiChat`, `chatWindow`, `messageBubble`, `chatHistory`, `bentoChat`

---

### Priority 2: AI Tools Module
**Files to Update**:
- `features/aiTools/AIToolsView.tsx`
- Tool generation components
- Image/Video generation UI

**Tasks**:
- Convert tool cards to bento style
- Add gradient backgrounds for different tools
- Improve tool selection UI
- Add loading states with bento cards

**Keywords**: `aiTools`, `toolGeneration`, `imageGenerator`, `videoGenerator`, `bentoTools`

---

### Priority 3: System Health Module
**Files to Update**:
- `features/systemHealth/SystemHealthView.tsx`
- Status cards
- Log viewer

**Tasks**:
- Apply bento grid to status cards
- Use gradient variants for different statuses
- Improve log display
- Add system metrics cards

**Keywords**: `systemHealth`, `statusCards`, `systemMetrics`, `logViewer`, `bentoSystem`

---

### Priority 4: Settings Module
**Files to Update**:
- `features/settings/SettingsView.tsx`
- Setting cards
- Configuration panels

**Tasks**:
- Apply bento styling to settings cards
- Improve setting categories layout
- Add gradient accents for important settings
- Optimize settings navigation

**Keywords**: `settings`, `settingsView`, `configPanels`, `bentoSettings`

---

## 🔑 KEY PROMPTS FOR CONTINUATION

### For AI Chat Module:
```
"Update AI Chat module to use bento grid styling. Apply gradient cards to chat messages, 
improve message bubbles with premium dark theme, add bento-style model picker, and optimize 
for iOS safe area. Use the same bento gradient system (purple, teal, orange) from DashboardView."
```

### For AI Tools Module:
```
"Convert AI Tools module to bento grid layout. Use gradient cards for different tool types 
(image generation = orange gradient, video = purple gradient, etc.). Apply the same premium 
dark theme and iOS optimizations from DashboardView."
```

### For System Health:
```
"Update System Health module with bento grid cards. Use gradient variants for different 
status types (success = green, warning = orange, error = red). Apply premium dark theme 
styling consistent with DashboardView."
```

### For Settings:
```
"Apply bento grid styling to Settings module. Use gradient cards for setting categories, 
improve layout with bento grid system, and ensure iOS safe area support. Match the premium 
dark theme from DashboardView."
```

---

## 📋 IMPORTANT CONTEXT

### iOS Optimizations Applied
- Safe area support: `env(safe-area-inset-*)`
- Dynamic viewport: `100dvh`, `100dvw`
- Touch optimizations: `touch-action: manipulation`
- Input zoom prevention: `font-size: 16px` minimum
- Overscroll prevention: `overscroll-behavior: none`

### Bento System Rules
1. **Card Radius**: `24px` (--bento-radius)
2. **Gap**: `16px` (--bento-gap)
3. **Padding**: `24px` (--bento-padding)
4. **Shadows**: Use `--shadow-bento` for cards
5. **Gradients**: Use `tone="bento-{color}"` variants

### Theme Consistency
- All components should use CSS variables
- Dark theme is primary (light mode will be added later)
- Bento cards should have `bento` prop and `bento-card-content` wrapper
- Interactive cards need `interactive` prop

---

## 🎯 CONTINUATION STRATEGY

### Step 1: Read This File
```
"Read SESSION_CONTEXT.md to understand what was done in previous session"
```

### Step 2: Check Current State
```
"Check the current state of [MODULE_NAME] module and identify what needs bento styling"
```

### Step 3: Apply Bento System
```
"Apply bento grid system to [MODULE_NAME] following the same pattern as DashboardView. 
Use gradient cards, premium dark theme, and iOS optimizations."
```

### Step 4: Test & Verify
```
"Verify iOS safe area support, touch interactions, and visual consistency with DashboardView"
```

---

## 📝 QUICK REFERENCE

### Bento Color Variants
- `bento-purple` / `bento-solid-purple`
- `bento-teal` / `bento-solid-teal`
- `bento-orange` / `bento-solid-orange`
- `bento-green` / `bento-solid-green`
- `bento-red` / `bento-solid-red`
- `bento-blue` / `bento-solid-blue`

### Key Imports
```typescript
import { Card } from '../../components/ui/Card';
import { BENTO_GRADIENTS, getBentoColorByIndex } from '../../constants/bentoTheme';
```

### CSS Classes
- `.bento-grid` - Grid container
- `.bento-card` - Card base
- `.bento-card-content` - Content wrapper
- `.bento-card-title` - Title styling
- `.bento-card-description` - Description styling
- `.bento-card-icon` - Icon container

---

## 🔍 SEARCH KEYWORDS

When searching codebase, use these terms:
- `bento` - Find all bento-related code
- `gradient` - Find gradient implementations
- `Card tone` - Find card variant usage
- `safe-area` - Find iOS optimizations
- `100dvh` - Find viewport height fixes

---

## ⚠️ IMPORTANT NOTES

1. **Never remove** the bento system from `index.css`
2. **Always use** CSS variables for colors (never hardcode)
3. **Maintain** iOS safe area support in all new components
4. **Follow** the same bento card pattern from DashboardView
5. **Test** on iOS Safari/PWA/Capacitor after changes

---

## 📚 RELATED DOCUMENTATION

- `CSS_VARIABLES_COMPLETE_REFERENCE.md` - CSS variable guide
- `PROFESSIONAL_STYLING_GUIDE.md` - Styling guidelines
- `constants/bentoTheme.ts` - Bento color constants
- `NOTES_REDESIGN_DELIVERY.md` - Notes module redesign

---

**Last Updated**: Current Session
**Status**: Dark Theme + Bento System Complete, Ready for Module Updates
