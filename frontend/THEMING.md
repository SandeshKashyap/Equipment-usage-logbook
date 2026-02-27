# Theming Guide

This application uses shadcn/ui theming system built on top of Tailwind CSS and CSS variables.

## Features

- ✅ Dark mode support
- ✅ Light mode support
- ✅ System preference detection
- ✅ Persistent theme selection (localStorage)
- ✅ Multiple pre-built color themes
- ✅ Easy theme customization

## Using the Theme Toggle

A theme toggle button is available in the header of the Equipment List. Click it to switch between light and dark modes.

## Available Components

### ThemeProvider

Wraps your app to provide theme context.

```tsx
import { ThemeProvider } from '@/components/theme-provider'

function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="your-app-theme">
      {/* Your app */}
    </ThemeProvider>
  )
}
```

**Props:**
- `defaultTheme`: `"light"` | `"dark"` | `"system"` (default: `"system"`)
- `storageKey`: localStorage key for persisting theme (default: `"vite-ui-theme"`)

### ThemeToggle

A button component that toggles between light and dark modes.

```tsx
import { ThemeToggle } from '@/components/theme-toggle'

function Header() {
  return (
    <header>
      <ThemeToggle />
    </header>
  )
}
```

### useTheme Hook

Access and control the theme from any component.

```tsx
import { useTheme } from '@/components/theme-provider'

function MyComponent() {
  const { theme, setTheme } = useTheme()

  return (
    <button onClick={() => setTheme('dark')}>
      Current theme: {theme}
    </button>
  )
}
```

## Customizing Colors

### Method 1: Modify CSS Variables (Quick)

Edit [src/index.css](src/index.css) to change colors:

```css
@layer base {
  :root {
    --primary: 220.9 39.3% 11%;  /* Change primary color */
    --secondary: 220 14.3% 95.9%; /* Change secondary color */
    /* ... other variables */
  }

  .dark {
    --primary: 210 20% 98%;  /* Dark mode primary */
    /* ... other dark mode variables */
  }
}
```

### Method 2: Use Pre-built Themes

We provide several pre-built color themes in [src/lib/themes.ts](src/lib/themes.ts):
- **default**: Slate-based neutral theme (current)
- **blue**: Blue-accented theme
- **green**: Green/emerald theme
- **rose**: Rose/pink theme

To apply a different theme:

1. Choose a theme from `themes.ts`
2. Copy the color values
3. Paste into your `index.css` root variables

### Method 3: Create Custom Theme

Add a new theme to `src/lib/themes.ts`:

```typescript
export const themes = {
  // ... existing themes
  purple: {
    name: "Purple",
    light: {
      primary: "271.5 81.3% 55.9%",
      primaryForeground: "0 0% 100%",
      // ... other colors
    },
    dark: {
      primary: "271.5 81.3% 65.9%",
      primaryForeground: "0 0% 10%",
      // ... other colors
    },
  },
}
```

## Color Variables Reference

All colors use HSL format: `hue saturation% lightness%`

### Base Colors
- `--background`: Main app background
- `--foreground`: Main text color
- `--card`: Card background
- `--card-foreground`: Card text color

### Interactive Colors
- `--primary`: Primary action buttons, links
- `--primary-foreground`: Text on primary color
- `--secondary`: Secondary buttons, backgrounds
- `--secondary-foreground`: Text on secondary color

### Utility Colors
- `--muted`: Muted backgrounds
- `--muted-foreground`: Muted text
- `--accent`: Accent backgrounds (hover states)
- `--accent-foreground`: Text on accent
- `--destructive`: Delete/danger actions
- `--destructive-foreground`: Text on destructive

### Form Elements
- `--border`: Border color for inputs, cards
- `--input`: Input background color
- `--ring`: Focus ring color

### Status Colors (Custom)
- `--success`: Success state (green)
- `--warning`: Warning state (orange)
- `--info`: Info state (blue)

## Dark Mode Classes

Use Tailwind's dark mode variant in your components:

```tsx
<div className="bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100">
  Content that adapts to theme
</div>
```

## Tips

1. **Test Both Modes**: Always check your UI in both light and dark modes
2. **Contrast**: Ensure sufficient contrast for accessibility (WCAG 4.5:1 for text)
3. **Hover States**: Add appropriate dark mode hover states for interactive elements
4. **Status Colors**: Use semantic status colors consistently across your app
5. **Gradients**: Update background gradients for dark mode (see body styles in index.css)

## Resources

- [shadcn/ui Theming](https://ui.shadcn.com/docs/theming)
- [Tailwind CSS Dark Mode](https://tailwindcss.com/docs/dark-mode)
- [HSL Color Picker](https://hslpicker.com/)
