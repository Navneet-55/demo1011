# Animation Patterns Guide

## Philosophy

GyaanForge uses **dual animation strategies**:
- **Marketing routes**: Cinematic scroll-driven animations (Apple-style)
- **App routes**: Subtle micro-interactions only (functional-first)

All animations respect `prefers-reduced-motion: reduce` for accessibility.

## Framer Motion Setup

### Installation
```bash
npm install framer-motion@12.26.2
```

### Import
```typescript
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion'
```

## Marketing Patterns

### 1. Fade + Slide on Scroll
Elements fade in and slide up when entering viewport.

```tsx
import { motion } from 'framer-motion'

<motion.div
  initial={{ opacity: 0, y: 24 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true, margin: "-100px" }}
  transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
>
  <h2>Animated heading</h2>
</motion.div>
```

**Parameters:**
- `initial`: Starting state (invisible, 24px down)
- `whileInView`: Target state when 100px into viewport
- `viewport.once`: Animate only on first view (no repeat)
- `ease`: Custom cubic-bezier for smooth motion

### 2. Stagger Animations
Reveal child elements sequentially with delay.

```tsx
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08 // 80ms delay between children
    }
  }
}

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.5 }
  }
}

<motion.div
  variants={containerVariants}
  initial="hidden"
  whileInView="visible"
  viewport={{ once: true }}
>
  {items.map((item) => (
    <motion.div key={item.id} variants={itemVariants}>
      {item.content}
    </motion.div>
  ))}
</motion.div>
```

### 3. Scroll-Driven Parallax
Elements react to scroll position.

```tsx
import { useScroll, useTransform, motion } from 'framer-motion'
import { useRef } from 'react'

function ParallaxSection() {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"] // Track from element entrance to exit
  })
  
  // Map scroll progress to opacity
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0])
  
  // Map scroll progress to Y position
  const y = useTransform(scrollYProgress, [0, 1], [100, -100])
  
  return (
    <div ref={ref} style={{ height: '150vh' }}>
      <motion.div style={{ opacity, y }}>
        <img src="/hero.jpg" alt="Parallax visual" />
      </motion.div>
    </div>
  )
}
```

### 4. Sticky Media Sections
Media pins while text scrolls (desktop only).

```tsx
<div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
  {/* Sticky media (desktop) */}
  <div className="lg:sticky lg:top-24 h-fit">
    <motion.div
      style={{ opacity }} // Opacity from useScroll hook
      className="aspect-video rounded-2xl bg-gradient-to-br from-purple-500 to-blue-600"
    />
  </div>
  
  {/* Scrolling text chapters */}
  <div className="flex flex-col gap-12">
    {chapters.map((chapter) => (
      <motion.div
        key={chapter.id}
        initial={{ opacity: 0, x: 20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
      >
        <h3>{chapter.title}</h3>
        <p>{chapter.description}</p>
      </motion.div>
    ))}
  </div>
</div>
```

### 5. Modal Transitions
Smooth modal entry/exit with backdrop.

```tsx
import { AnimatePresence, motion } from 'framer-motion'

function VideoModal({ isOpen, onClose }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/80 z-50"
            onClick={onClose}
          />
          
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="bg-white rounded-2xl max-w-4xl w-full">
              {/* Modal content */}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
```

## App Patterns

### 1. Button Micro-Interactions
Subtle scale feedback on hover/tap.

```tsx
<motion.button
  whileHover={{ scale: 1.02 }}
  whileTap={{ scale: 0.98 }}
  transition={{ duration: 0.15 }}
  className="px-4 py-2 bg-blue-600 text-white rounded-lg"
>
  Click me
</motion.button>
```

### 2. Content Entry Fade
Simple fade-in for new content (no slide).

```tsx
<motion.div
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  transition={{ duration: 0.3 }}
>
  <Panel content={data} />
</motion.div>
```

### 3. Loading States
Spinner with continuous rotation.

```tsx
<motion.div
  animate={{ rotate: 360 }}
  transition={{ 
    repeat: Infinity, 
    duration: 1, 
    ease: "linear" 
  }}
  className="w-6 h-6 border-2 border-gray-300 border-t-blue-600 rounded-full"
/>
```

### 4. Toggle Switches
State change with spring physics.

```tsx
const [isOn, setIsOn] = useState(false)

<motion.div
  className="w-12 h-6 bg-gray-300 rounded-full p-1 cursor-pointer"
  animate={{ backgroundColor: isOn ? '#3b82f6' : '#d1d5db' }}
  onClick={() => setIsOn(!isOn)}
>
  <motion.div
    className="w-4 h-4 bg-white rounded-full"
    animate={{ x: isOn ? 24 : 0 }}
    transition={{ type: "spring", stiffness: 500, damping: 30 }}
  />
</motion.div>
```

## Lenis Smooth Scrolling

### Setup (Marketing Only)
Applied in `(marketing)/layout.tsx`:

```tsx
'use client'

import Lenis from '@studio-freight/lenis'
import { useEffect, useRef } from 'react'

export function LenisProvider({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null)
  
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,  // Scroll duration
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Custom easing
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
      infinite: false,
      lerp: 0.05 // Interpolation smoothness (0-1)
    })
    
    lenisRef.current = lenis
    
    function raf(time: number) {
      lenis.raf(time)
      requestAnimationFrame(raf)
    }
    
    requestAnimationFrame(raf)
    
    return () => lenis.destroy()
  }, [])
  
  return <>{children}</>
}
```

### Scroll to Section
With automatic header offset:

```tsx
import { useLenis } from '@studio-freight/react-lenis'

function SubNav() {
  const lenis = useLenis()
  
  const handleClick = (sectionId: string) => {
    const header = document.querySelector('[data-header]')
    const offset = header?.getBoundingClientRect().height || 0
    
    lenis?.scrollTo(`#${sectionId}`, {
      offset: -offset - 16, // Header height + 16px gap
      duration: 1.2
    })
  }
  
  return (
    <button onClick={() => handleClick('features')}>
      Features
    </button>
  )
}
```

## Accessibility: Reduced Motion

### Automatic Handling
Framer Motion respects system preferences by default:

```css
/* Add to globals.css */
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

### Manual Detection
For custom logic:

```tsx
import { useReducedMotion } from 'framer-motion'

function AnimatedComponent() {
  const shouldReduceMotion = useReducedMotion()
  
  return (
    <motion.div
      initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: shouldReduceMotion ? 0 : 0.6 }}
    >
      Content
    </motion.div>
  )
}
```

## Performance Tips

### 1. Use `transform` and `opacity`
These properties are GPU-accelerated and don't trigger layout:

```tsx
// ✅ Good (GPU-accelerated)
<motion.div
  animate={{ opacity: 1, scale: 1.1, x: 100, y: 50 }}
/>

// ❌ Avoid (triggers layout/paint)
<motion.div
  animate={{ width: '100%', height: 200, marginTop: 50 }}
/>
```

### 2. Use `will-change` sparingly
For frequently animated elements:

```tsx
<motion.div
  style={{ willChange: 'transform' }}
  animate={{ x: scrollProgress * 100 }}
/>
```

### 3. Viewport Optimization
Lazy-load animations only when near viewport:

```tsx
<motion.div
  initial={{ opacity: 0 }}
  whileInView={{ opacity: 1 }}
  viewport={{ 
    once: true,          // Animate only once
    margin: "-100px",    // Trigger 100px before entering
    amount: 0.3          // Trigger when 30% visible
  }}
/>
```

### 4. Avoid Layout Animations
Use `layout` prop carefully - it's expensive:

```tsx
// Only when absolutely necessary
<motion.div layout>
  <AnimatePresence>
    {items.map(item => (
      <motion.div key={item.id} layout exit={{ opacity: 0 }}>
        {item.name}
      </motion.div>
    ))}
  </AnimatePresence>
</motion.div>
```

## Easing Functions

### Presets
```typescript
// Built-in Framer Motion easings
ease: "linear"           // Constant speed
ease: "easeIn"           // Slow start
ease: "easeOut"          // Slow end
ease: "easeInOut"        // Slow start + end
ease: "circIn"           // Circular acceleration
ease: "backOut"          // Overshoot + settle
```

### Custom Cubic-Bezier
```typescript
// Apple-style ease (smooth, premium feel)
ease: [0.22, 1, 0.36, 1]

// Quick snap
ease: [0.4, 0, 0.2, 1]

// Bouncy
ease: [0.68, -0.55, 0.265, 1.55]
```

### Spring Physics
```typescript
transition={{ 
  type: "spring",
  stiffness: 300,  // Higher = faster
  damping: 20,     // Higher = less bounce
  mass: 1          // Higher = more inertia
}}
```

## Common Patterns

### Hero Parallax Background
```tsx
const { scrollY } = useScroll()
const y = useTransform(scrollY, [0, 500], [0, 150])

<motion.div style={{ y }} className="absolute inset-0 -z-10">
  <img src="/bg.jpg" alt="" />
</motion.div>
```

### Scroll Progress Indicator
```tsx
const { scrollYProgress } = useScroll()

<motion.div
  style={{ scaleX: scrollYProgress }}
  className="fixed top-0 left-0 right-0 h-1 bg-blue-600 origin-left"
/>
```

### Card Hover Lift
```tsx
<motion.div
  whileHover={{ y: -8, boxShadow: "0 20px 40px rgba(0,0,0,0.1)" }}
  transition={{ duration: 0.2 }}
>
  <Card />
</motion.div>
```

### Notification Toast
```tsx
<AnimatePresence>
  {showToast && (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.95 }}
      className="fixed bottom-4 right-4 bg-black text-white p-4 rounded-lg"
    >
      Notification message
    </motion.div>
  )}
</AnimatePresence>
```

## Debugging

### Visualize Scroll Progress
```tsx
const { scrollYProgress } = useScroll({ target: ref })

useEffect(() => {
  const unsubscribe = scrollYProgress.onChange(v => console.log(v))
  return unsubscribe
}, [scrollYProgress])
```

### Animation Inspector
Framer Motion DevTools (optional):
```bash
npm install framer-motion-devtools
```

```tsx
import { MotionDevTools } from 'framer-motion-devtools'

<MotionDevTools />
```
