# UI Primitives Quick Reference

## Import Statement
```tsx
import { Container, Section, Card, Button, Badge, typography } from '@/components/ui/primitives'
```

---

## Container
Responsive max-width wrapper with horizontal padding.

```tsx
<Container size="lg">
  {/* Content */}
</Container>
```

| Size | Max Width | Pixels |
|------|-----------|--------|
| `sm` | max-w-3xl | 768px  |
| `md` | max-w-5xl | 1024px |
| `lg` | max-w-6xl | 1152px |
| `xl` | max-w-7xl | 1280px |

**Props**: `size?: 'sm' | 'md' | 'lg' | 'xl'`, `className?: string`, `children: ReactNode`

---

## Section
Vertical spacing wrapper (default: `py-16 sm:py-24`).

```tsx
<Section className="bg-gray-50">
  <Container>
    {/* Content */}
  </Container>
</Section>
```

**Props**: `className?: string`, `children: ReactNode`

---

## Card
Flexible card component with 3 variants.

```tsx
<Card variant="default">  {/* Subtle border + shadow */}
<Card variant="glass">    {/* Frosted glass effect */}
<Card variant="gradient"> {/* Colorful gradient border */}
```

| Variant | Use Case |
|---------|----------|
| `default` | Standard content cards, feature blocks |
| `glass` | Hero sections, overlays, premium feel |
| `gradient` | CTAs, featured items, highlights |

**Props**: `variant?: 'default' | 'glass' | 'gradient'`, `className?: string`, `children: ReactNode`

---

## Button
Primary interaction component.

```tsx
<Button variant="primary" size="lg">Get Started</Button>
<Button variant="secondary" size="md">Learn More</Button>
<Button variant="outline">Documentation</Button>
```

| Variant | Background | Text | Border | Use Case |
|---------|-----------|------|--------|----------|
| `primary` | Black/White | White/Black | None | Main CTAs |
| `secondary` | Gray-100/800 | Black/White | None | Secondary actions |
| `outline` | Transparent | Black/White | Black/White | Tertiary actions |

| Size | Padding | Text Size |
|------|---------|-----------|
| `md` | px-6 py-2.5 | base (16px) |
| `lg` | px-8 py-3.5 | lg (18px) |

**Props**: `variant?: 'primary' | 'secondary' | 'outline'`, `size?: 'md' | 'lg'`, `className?: string`, `children: ReactNode`

---

## Badge
Status and label indicators.

```tsx
<Badge variant="default">Beta</Badge>
<Badge variant="success">✓ Available</Badge>
<Badge variant="warning">⚠️ Limited</Badge>
<Badge variant="gradient">🔥 Popular</Badge>
```

| Variant | Background | Text | Use Case |
|---------|-----------|------|----------|
| `default` | Gray-100/800 | Black/White | General labels |
| `success` | Green-100/900 | Green-800/300 | Success states |
| `warning` | Yellow-100/900 | Yellow-800/300 | Warnings, alerts |
| `gradient` | Purple→Blue | White | Featured, premium |

**Props**: `variant?: 'default' | 'success' | 'warning' | 'gradient'`, `className?: string`, `children: ReactNode`

---

## Typography Object
Consistent text styles as class strings.

```tsx
<h1 className={typography.h1}>Main Heading</h1>
<p className={typography.lead}>Large intro paragraph</p>
<p className={typography.body}>Regular body text</p>
```

| Key | Classes | Result |
|-----|---------|--------|
| `h1` | `text-4xl font-extrabold leading-tight` | 36px, 900 weight, tight line-height |
| `h2` | `text-3xl font-bold leading-tight` | 30px, 700 weight, tight line-height |
| `h3` | `text-2xl font-bold leading-snug` | 24px, 700 weight, snug line-height |
| `h4` | `text-xl font-semibold leading-snug` | 20px, 600 weight, snug line-height |
| `lead` | `text-lg text-gray-600 dark:text-gray-300 leading-relaxed` | 18px, muted color, relaxed line-height |
| `body` | `text-base text-gray-900 dark:text-gray-100 leading-normal` | 16px, default color, normal line-height |
| `small` | `text-sm font-medium text-gray-500 dark:text-gray-400` | 14px, medium weight, muted color |

---

## Common Patterns

### Hero Section
```tsx
<Section>
  <Container size="xl">
    <div className="text-center">
      <Badge variant="gradient">🚀 New</Badge>
      <h1 className={`${typography.h1} mt-6 mb-4`}>
        Build faster
      </h1>
      <p className={`${typography.lead} mb-10`}>
        Ship in minutes, not hours.
      </p>
      <div className="flex gap-4 justify-center">
        <Button variant="primary" size="lg">Get Started</Button>
        <Button variant="outline" size="lg">Learn More</Button>
      </div>
    </div>
  </Container>
</Section>
```

### Feature Grid
```tsx
<Section className="bg-gray-50 dark:bg-gray-900">
  <Container size="lg">
    <h2 className={`${typography.h2} text-center mb-12`}>Features</h2>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card>
        <h3 className={typography.h4}>Fast</h3>
        <p className={typography.body}>Lightning speed</p>
      </Card>
      <Card variant="glass">
        <h3 className={typography.h4}>Secure</h3>
        <p className={typography.body}>Enterprise-grade</p>
      </Card>
      <Card variant="gradient">
        <h3 className={typography.h4}>Scalable</h3>
        <p className={typography.body}>Grows with you</p>
      </Card>
    </div>
  </Container>
</Section>
```

### Control Panel
```tsx
<div className="flex items-center justify-between p-4 border-b">
  <div className="flex gap-3">
    <Button variant="primary">Save</Button>
    <Button variant="secondary">Cancel</Button>
  </div>
  <div className="flex gap-2">
    <Badge variant="success">✓ Synced</Badge>
    <Badge variant="default">Draft</Badge>
  </div>
</div>
```

---

## Tailwind Classes (for custom styling)

### Spacing
- Padding: `p-4` (16px), `px-6` (24px horizontal), `py-8` (32px vertical)
- Margin: `m-4` (16px), `mx-auto` (center horizontally), `my-12` (48px vertical)
- Gap: `gap-4` (16px), `gap-6` (24px)

### Layout
- Flex: `flex`, `flex-col`, `items-center`, `justify-between`
- Grid: `grid`, `grid-cols-2`, `grid-cols-1 md:grid-cols-3`
- Container: `max-w-4xl`, `w-full`, `mx-auto`

### Colors
- Text: `text-gray-900`, `dark:text-gray-100`
- Background: `bg-white`, `dark:bg-gray-950`
- Border: `border-gray-200`, `dark:border-gray-800`

### Typography
- Size: `text-sm`, `text-base`, `text-lg`, `text-xl`, `text-2xl`
- Weight: `font-medium`, `font-semibold`, `font-bold`
- Line height: `leading-tight`, `leading-normal`, `leading-relaxed`

### Effects
- Shadow: `shadow-sm`, `shadow-md`, `shadow-lg`
- Rounded: `rounded-lg`, `rounded-xl`, `rounded-2xl`
- Opacity: `opacity-50`, `opacity-75`, `opacity-100`

---

## Dark Mode

All primitives auto-support dark mode via `dark:*` variants:

```tsx
// Light mode: white bg, black text
// Dark mode: black bg, white text
<Button variant="primary">Click me</Button>

// Light mode: gray-100 bg
// Dark mode: gray-800 bg
<Card variant="default">Content</Card>

// Light mode: gray-900 text
// Dark mode: gray-100 text
<p className={typography.body}>Text</p>
```

**No manual dark mode code needed** - just use the primitives!

---

## Responsive Breakpoints

| Breakpoint | Min Width | Example |
|------------|-----------|---------|
| `sm:` | 640px | `sm:text-lg` |
| `md:` | 768px | `md:grid-cols-2` |
| `lg:` | 1024px | `lg:px-8` |
| `xl:` | 1280px | `xl:max-w-7xl` |
| `2xl:` | 1536px | `2xl:text-6xl` |

```tsx
// Mobile: single column, small text
// Tablet+: 2 columns, larger text
<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
  <Card>
    <h3 className="text-lg md:text-xl">Title</h3>
  </Card>
</div>
```

---

## Accessibility

### Built-in
- ✅ Semantic HTML (`<button>`, `<section>`)
- ✅ Focus rings (`focus:ring-2 focus:ring-blue-500`)
- ✅ Color contrast (WCAG AA compliant)
- ✅ Dark mode support

### Add manually
```tsx
<Button aria-label="Close dialog">×</Button>
<Badge role="status" aria-live="polite">Online</Badge>
```

---

## Cheat Sheet

### "I want to..."

**Center content with max-width**
→ `<Container size="lg">{content}</Container>`

**Add vertical spacing to a section**
→ `<Section>{content}</Section>`

**Create a content card**
→ `<Card>{content}</Card>`

**Make a premium card**
→ `<Card variant="gradient">{content}</Card>`

**Add a primary CTA button**
→ `<Button variant="primary" size="lg">Get Started</Button>`

**Add a secondary action button**
→ `<Button variant="secondary">Learn More</Button>`

**Add a status badge**
→ `<Badge variant="success">✓ Available</Badge>`

**Style a heading**
→ `<h1 className={typography.h1}>Title</h1>`

**Style body text**
→ `<p className={typography.body}>Content</p>`

**Style muted helper text**
→ `<span className={typography.small}>Helper text</span>`

---

## Testing Primitive Components

```tsx
// Test in a new page: app/test-primitives/page.tsx
export default function TestPrimitivesPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      <Section>
        <Container size="lg">
          <h1 className={typography.h1}>Testing Primitives</h1>
          
          <div className="mt-8 flex gap-4">
            <Button variant="primary">Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="outline">Outline</Button>
          </div>
          
          <div className="mt-8 flex gap-2">
            <Badge variant="default">Default</Badge>
            <Badge variant="success">Success</Badge>
            <Badge variant="warning">Warning</Badge>
            <Badge variant="gradient">Gradient</Badge>
          </div>
          
          <div className="mt-8 grid grid-cols-3 gap-4">
            <Card variant="default">Default Card</Card>
            <Card variant="glass">Glass Card</Card>
            <Card variant="gradient">Gradient Card</Card>
          </div>
        </Container>
      </Section>
    </div>
  )
}
```

Visit `/test-primitives` to see all components in action!
