# UI Primitives Usage Guide

## Import

```typescript
import { Container, Section, Card, Button, Badge, typography } from '@/components/ui/primitives'
```

## Components

### Container
Responsive max-width wrapper with horizontal padding.

```tsx
// Variants: 'sm' | 'md' | 'lg' | 'xl'
<Container size="lg" className="py-12">
  <h1>Centered content with max-width</h1>
</Container>

// Sizes:
// sm:  max-w-3xl (768px)
// md:  max-w-5xl (1024px)
// lg:  max-w-6xl (1152px)
// xl:  max-w-7xl (1280px)
```

### Section
Vertical spacing wrapper for page sections.

```tsx
<Section className="bg-gray-50 dark:bg-gray-900">
  <Container>
    <h2>Section content</h2>
  </Container>
</Section>

// Default: py-16 sm:py-24 (responsive vertical padding)
```

### Card
Flexible card component with 3 visual variants.

```tsx
// Default: subtle border + shadow
<Card>
  <h3>Card title</h3>
  <p>Card content</p>
</Card>

// Glass: frosted glass effect
<Card variant="glass">
  <p>Translucent backdrop with blur</p>
</Card>

// Gradient: colorful gradient border
<Card variant="gradient">
  <p>Premium gradient border effect</p>
</Card>
```

### Button
Primary interaction component with 3 variants and 2 sizes.

```tsx
// Variants: 'primary' | 'secondary' | 'outline'
// Sizes: 'md' | 'lg'

<Button variant="primary" size="lg">
  Get Started
</Button>

<Button variant="secondary" size="md">
  Learn More
</Button>

<Button variant="outline">
  Documentation
</Button>

// Custom classes
<Button 
  variant="primary" 
  className="bg-gradient-to-r from-purple-600 to-blue-600"
>
  Custom Gradient
</Button>
```

### Badge
Status and label indicators with 4 variants.

```tsx
// Variants: 'default' | 'success' | 'warning' | 'gradient'

<Badge variant="default">
  Beta
</Badge>

<Badge variant="success">
  ✓ Available
</Badge>

<Badge variant="warning">
  ⚠️ Limited
</Badge>

<Badge variant="gradient">
  🔥 Popular
</Badge>
```

## Typography Object

Consistent text styles as reusable class strings.

```tsx
import { typography } from '@/components/ui/primitives'

<h1 className={typography.h1}>
  Main Heading
</h1>

<h2 className={typography.h2}>
  Section Heading
</h2>

<h3 className={typography.h3}>
  Subsection Heading
</h3>

<h4 className={typography.h4}>
  Card Heading
</h4>

<p className={typography.lead}>
  Large intro paragraph
</p>

<p className={typography.body}>
  Regular body text
</p>

<span className={typography.small}>
  Small helper text
</span>
```

### Typography Styles

| Key | Font Size | Line Height | Weight | Color |
|-----|-----------|-------------|--------|-------|
| `h1` | 4xl (2.25rem) | tight | extrabold | default |
| `h2` | 3xl (1.875rem) | tight | bold | default |
| `h3` | 2xl (1.5rem) | snug | bold | default |
| `h4` | xl (1.25rem) | snug | semibold | default |
| `lead` | lg (1.125rem) | relaxed | normal | muted |
| `body` | base (1rem) | normal | normal | default |
| `small` | sm (0.875rem) | normal | medium | muted |

## Combining Primitives

### Marketing Hero Section
```tsx
<Section>
  <Container size="xl">
    <div className="text-center">
      <Badge variant="gradient">
        🚀 New Features
      </Badge>
      <h1 className={`${typography.h1} mt-6 mb-4`}>
        Build faster with AI
      </h1>
      <p className={`${typography.lead} mb-10`}>
        Ship production-ready code in minutes, not hours.
      </p>
      <div className="flex gap-4 justify-center">
        <Button variant="primary" size="lg">
          Get Started Free
        </Button>
        <Button variant="outline" size="lg">
          Watch Demo
        </Button>
      </div>
    </div>
  </Container>
</Section>
```

### Feature Grid
```tsx
<Section className="bg-gray-50 dark:bg-gray-900">
  <Container size="lg">
    <h2 className={`${typography.h2} text-center mb-12`}>
      Features
    </h2>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card>
        <h3 className={typography.h4}>Fast</h3>
        <p className={typography.body}>Lightning-fast performance</p>
      </Card>
      <Card variant="glass">
        <h3 className={typography.h4}>Secure</h3>
        <p className={typography.body}>Enterprise-grade security</p>
      </Card>
      <Card variant="gradient">
        <h3 className={typography.h4}>Scalable</h3>
        <p className={typography.body}>Grows with your team</p>
      </Card>
    </div>
  </Container>
</Section>
```

### Control Panel
```tsx
<div className="flex items-center justify-between p-4 border-b">
  <div className="flex gap-3">
    <Button variant="primary" size="md">
      Save
    </Button>
    <Button variant="secondary" size="md">
      Cancel
    </Button>
  </div>
  <div className="flex gap-2">
    <Badge variant="success">
      ✓ Synced
    </Badge>
    <Badge variant="default">
      Draft
    </Badge>
  </div>
</div>
```

## Best Practices

### 1. Consistent Spacing
Use Container + Section for consistent page layout:
```tsx
<Section>
  <Container>
    {/* Your content */}
  </Container>
</Section>
```

### 2. Semantic Headings
Use typography object for consistent hierarchy:
```tsx
<h1 className={typography.h1}>Page Title</h1>
<h2 className={typography.h2}>Section</h2>
<h3 className={typography.h3}>Subsection</h3>
```

### 3. Visual Hierarchy
Combine variants for emphasis:
```tsx
<Card variant="gradient">
  <Badge variant="gradient">Premium</Badge>
  <h3 className={typography.h3}>Featured Plan</h3>
  <Button variant="primary" size="lg">Choose Plan</Button>
</Card>
```

### 4. Responsive Design
All primitives include dark mode + responsive styles by default:
```tsx
// Automatically adapts to:
// - Dark mode (dark:*)
// - Screen sizes (sm:*, md:*, lg:*)
// - Hover states
// - Focus states (accessibility)
```

### 5. Custom Styling
Use `className` prop to extend styles:
```tsx
<Button 
  variant="primary" 
  className="w-full sm:w-auto shadow-2xl"
>
  Extended Button
</Button>

<Card className="hover:scale-105 transition-transform">
  Interactive Card
</Card>
```

## Dark Mode Support

All primitives automatically support dark mode via Tailwind's `dark:` variant:
- Text colors invert appropriately
- Backgrounds use semantic tokens
- Borders maintain proper contrast
- Shadows adjust for visibility

No additional configuration needed - just use the primitives!

## Accessibility

### Built-in Features
- ✓ Semantic HTML elements (button, section, etc.)
- ✓ Proper color contrast ratios (WCAG AA)
- ✓ Focus visible styles (outline rings)
- ✓ Keyboard navigation support
- ✓ Screen reader friendly

### Manual Additions
Always add when needed:
```tsx
<Button aria-label="Close modal">
  ×
</Button>

<Badge role="status" aria-live="polite">
  {statusText}
</Badge>
```
