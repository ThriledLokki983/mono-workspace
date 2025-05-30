# @mono/styles

Premium SCSS design system for luxury real estate applications with cosmic elegance. Now powered by
**Open Props** with modern CSS custom properties.

## 🎨 Design Philosophy

This design system implements a world-class, ultra-clean user interface following premium design
principles:

- **Minimal yet warm** - Clean layouts with inviting warmth
- **Luxurious but not flashy** - Sophisticated without being ostentatious
- **Smart and trustworthy** - Builds confidence through clear hierarchy
- **Cosmic elegance** - Subtle futuristic elements with generous spacing
- **Modern CSS** - Built with CSS custom properties and Open Props foundation

## ✨ New Features

- **Open Props Integration**: Leveraging the powerful Open Props design token system
- **CSS Custom Properties**: Modern `var()` syntax throughout for better performance and theming
- **Responsive Design**: Enhanced breakpoint system with mobile-first approach
- **Modern SCSS**: Updated to use `@use` and `@forward` syntax

## 📦 Installation

```bash
# Install the styles package
yarn add @mono/styles

# Peer dependency (SCSS compiler)
yarn add -D sass
```

## 🚀 Usage

Import the complete design system in your main SCSS file:

```scss
// Import the complete design system
@import '@mono/styles/src/base-styles.scss';
```

Or import specific modules:

```scss
// Import only foundations (design tokens)
@use '@mono/styles/src/foundations';

// Import specific components
@use '@mono/styles/src/components/buttons';
@use '@mono/styles/src/components/cards';

// Import utilities
@use '@mono/styles/src/utilities';
```

## 🎯 Design Tokens (CSS Custom Properties)

### Colors

Premium earthy-cosmic palette designed for trust and elegance:

```css
/* Primary Colors - now using CSS custom properties */
--color-brand-primary: var(--green-8); /* Deep forest green */
--color-accent-primary: var(--orange-4); /* Warm amber */
--color-background-light: var(--stone-0); /* Clean light background */
--color-background-surface: var(--stone-1); /* Surface elevation */
--color-text-primary: var(--gray-9); /* Primary text */
--color-text-secondary: var(--gray-7); /* Secondary text */
```

### Spacing (Enhanced with Open Props)

All spacing follows Open Props spacing scale with luxury refinements:

```css
/* Enhanced spacing system */
--spacing-xs: var(--size-1); /* 4px - Micro spacing */
--spacing-sm: var(--size-2); /* 8px - Small gaps */
--spacing-md: var(--size-3); /* 12px - Medium spacing */
--spacing-lg: var(--size-4); /* 16px - Standard spacing */
--spacing-xl: var(--size-6); /* 24px - Large spacing */
--spacing-2xl: var(--size-8); /* 32px - Section gaps */
--spacing-3xl: var(--size-12); /* 48px - Large sections */
```

### Typography

Premium typography built on Open Props font system:

```css
/* Enhanced typography system */
--font-family-primary: var(--font-sans); /* Modern sans-serif stack */
--font-family-display: var(--font-serif); /* Display serif */

/* Font sizes using Open Props scale */
--font-size-xs: var(--font-size-0); /* 12px - Captions */
--font-size-base: var(--font-size-2); /* 16px - Body text */
--font-size-lg: var(--font-size-4); /* 20px - Large text */
--font-size-xl: var(--font-size-6); /* 24px - Section headers */
--font-size-2xl: var(--font-size-8); /* 32px - Page titles */
```

## 🔧 Development & Build

### Build Scripts

The package includes several build and development scripts:

```bash
# Build the CSS from SCSS source
npm run build

# Watch for changes and rebuild automatically
npm run build:watch

# Lint SCSS files
npm run lint

# Format files with Prettier
npm run format
```

### Project Structure

```
src/
├── base-styles.scss           # Main entry point
├── foundations/               # Design tokens & Open Props integration
│   ├── _open-props.scss      # Open Props customization
│   ├── _colors.scss          # Color system
│   ├── _typography.scss      # Typography tokens
│   ├── _spacing.scss         # Spacing system
│   └── _breakpoints.scss     # Responsive breakpoints
├── components/               # UI components
│   ├── _buttons.scss         # Button styles
│   ├── _forms.scss           # Form elements
│   ├── _cards.scss           # Card components
│   └── _navigation.scss      # Navigation components
├── layouts/                  # Layout systems
│   ├── _containers.scss      # Container system
│   ├── _grid.scss            # Grid utilities
│   └── _positioning.scss     # Positioning utilities
└── utilities/                # Utility classes
    ├── _colors.scss          # Color utilities
    ├── _spacing.scss         # Spacing utilities
    ├── _typography.scss      # Typography utilities
    └── _backgrounds.scss     # Background utilities
```

### Modern SCSS Features

This design system uses modern SCSS features:

- **`@use` and `@forward`**: Modern module system instead of `@import`
- **CSS Custom Properties**: `var()` syntax throughout for better performance
- **Open Props Integration**: Leveraging a robust design token foundation
- **Mobile-first Breakpoints**: Responsive design with semantic breakpoint names

## 🧩 Components

### Buttons

Premium button styles with cosmic elegance:

```html
<!-- Primary button -->
<button class="btn btn--primary">Get Started</button>

<!-- Secondary button -->
<button class="btn btn--secondary">Learn More</button>

<!-- Button sizes -->
<button class="btn btn--primary btn--sm">Small</button>
<button class="btn btn--primary btn--lg">Large</button>

<!-- Button with icon -->
<button class="btn btn--primary btn--icon-left">
  <span class="btn__icon">🏠</span>
  Find Homes
</button>
```

### Cards

Luxurious card components with soft elevation:

```html
<!-- Basic card -->
<div class="card">
  <div class="card__body">
    <h3 class="card__title">Property Title</h3>
    <p class="card__description">Beautiful description here...</p>
  </div>
</div>

<!-- Interactive card -->
<div class="card card--interactive">
  <div class="card__header">
    <h3 class="card__title">Featured Property</h3>
  </div>
  <div class="card__body">
    <p>Premium property details...</p>
  </div>
</div>
```

### Forms

Clean, accessible form inputs:

```html
<!-- Form group -->
<div class="form-group">
  <label class="form-label form-label--required">Email Address</label>
  <input type="email" class="form-input" placeholder="you@example.com" />
  <div class="form-help">We'll never share your email</div>
</div>

<!-- Input with icon -->
<div class="form-input-group form-input-group--icon-left">
  <span class="form-input-group__icon">🔍</span>
  <input type="text" class="form-input" placeholder="Search properties..." />
</div>
```

## 🏗️ Layout System

### Containers

Responsive container system:

```html
<!-- Standard container -->
<div class="container">
  <div class="section">
    <!-- Content here -->
  </div>
</div>

<!-- Narrow container -->
<div class="container container--narrow">
  <!-- Centered content -->
</div>
```

### Grid System

Flexible CSS Grid system:

```html
<!-- Responsive grid -->
<div class="grid grid--cols-1 grid--md-cols-2 grid--lg-cols-3">
  <div class="card">Property 1</div>
  <div class="card">Property 2</div>
  <div class="card">Property 3</div>
</div>

<!-- Flexbox utilities -->
<div class="flex flex--items-center flex--justify-between">
  <h2>Properties</h2>
  <button class="btn btn--secondary">View All</button>
</div>
```

## 🎛️ Utility Classes

### Spacing

4pt spacing system utilities:

```html
<!-- Margins -->
<div class="mt-xl mb-2xl">Large top margin, extra large bottom</div>

<!-- Padding -->
<div class="p-lg px-xl">Large padding, extra large horizontal</div>
```

### Typography

Text styling utilities:

```html
<!-- Typography scale -->
<h1 class="text-display">Hero Title</h1>
<h2 class="text-heading-lg">Section Header</h2>
<p class="text-body">Regular body text</p>
<span class="text-caption">Small caption text</span>

<!-- Text colors -->
<p class="text-brand">Brand colored text</p>
<p class="text-muted">Muted helper text</p>
```

### Display & Visibility

Responsive display utilities:

```html
<!-- Hide on mobile, show on desktop -->
<div class="hidden md:block">Desktop only content</div>

<!-- Show on mobile, hide on desktop -->
<div class="block md:hidden">Mobile only content</div>
```

## 📱 Responsive Design

All components and utilities include responsive variants:

```scss
// Breakpoints
$breakpoint-sm: 640px;
$breakpoint-md: 768px;
$breakpoint-lg: 1024px;
$breakpoint-xl: 1280px;

// Usage in SCSS
@include screen-md {
  .custom-class {
    // Styles for medium screens and up
  }
}
```

## 🎨 Customization

### Using Design Tokens

Import foundations to access all design tokens:

```scss
@import '@mono/styles/src/foundations';

.custom-component {
  background-color: $color-brand-primary;
  padding: $spacing-lg;
  border-radius: $radius-md;
  box-shadow: $shadow-md;
}
```

### Custom Components

Extend the design system with your own components:

```scss
@import '@mono/styles/src/foundations';

.property-card {
  @extend .card;

  background-color: $color-surface-warm;
  transition: $transition-normal;

  &:hover {
    transform: translateY(-2px);
    box-shadow: $shadow-lg;
  }
}
```

## ✨ Best Practices

1. **Follow the 4pt spacing system** - Use spacing tokens for consistent layouts
2. **Use semantic color tokens** - Prefer `$color-brand-primary` over hex values
3. **Leverage utility classes** - Use utilities for quick styling adjustments
4. **Maintain vertical rhythm** - Use typography scale for consistent text hierarchy
5. **Design mobile-first** - Start with mobile styles, then enhance for larger screens
6. **Use CSS Custom Properties** - Leverage `var()` syntax for better performance and theming
7. **Follow Open Props conventions** - Use established design tokens from Open Props foundation
8. **Leverage utility classes** - Use utilities for quick styling adjustments
9. **Maintain semantic naming** - Prefer `--color-brand-primary` over raw values
10. **Design mobile-first** - Start with mobile styles, then enhance for larger screens
11. **Use modern SCSS syntax** - Prefer `@use` and `@forward` over `@import`

```

```
