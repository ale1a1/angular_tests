# ITCSS Architecture Guide

## Overview

This project uses **ITCSS (Inverted Triangle CSS)** — a scalable CSS architecture by Harry Roberts. ITCSS organizes stylesheets in 7 layers, from generic to specific, preventing specificity wars and making CSS highly maintainable.

## The Inverted Triangle Concept

```
                      ↓
              SPECIFICITY ↑
              
         TRUMPS (utilities)
             ↑ HIGH
        COMPONENTS
        OBJECTS
        ELEMENTS
        GENERIC
        TOOLS
     SETTINGS
     ↓ LOW
```

- **Bottom layers**: Low specificity, wide reach (affects many elements)
- **Top layers**: High specificity, narrow reach (specific components)
- **Result**: Specificity increases only when moving up the triangle

## The 7 ITCSS Layers

### 1. **SETTINGS** (`settings/`)
- Design tokens and configuration
- **Produces NO CSS output** — only variables
- Contains: Colors, spacing, typography scales, breakpoints, z-indexes
- **Import first** — all other layers depend on these

**Usage:**
```scss
$color-primary: #1890ff;
$spacing-md: 1rem;
$font-size-base: 1rem;
```

---

### 2. **TOOLS** (`tools/`)
- Reusable mixins and SCSS functions
- **Produces NO CSS output** — only @mixin and @function definitions
- Can use variables from settings
- Contains: Responsive mixins, flex helpers, text utilities, focus rings

**Usage:**
```scss
@include mq($breakpoint-md) {
  // Mobile-first responsive styles
}

@include flex-center {
  // Centers content both axes
}
```

---

### 3. **GENERIC** (`generic/`)
- Browser resets, normalize, box-sizing
- **Very wide reach** — affects all elements
- **Minimal CSS output** — wide rules only
- Contains: Universal reset, box-sizing, body defaults

**Files:**
- `reset.scss` — Remove default margins, set base font
- `box-sizing.scss` — Apply border-box model

---

### 4. **ELEMENTS** (`elements/`)
- Bare HTML element styling
- **No class selectors** — only element selectors (h1, p, button, input, etc.)
- Last layer where we style unclassed elements
- Contains: Typography (h1-h6, p), form elements

**Usage:**
```scss
h1 {
  font-size: $font-size-3xl;
  font-weight: $font-weight-bold;
}

input[type="text"] {
  padding: $spacing-sm;
  border: 1px solid $color-border;
}
```

**Key Rule:** No `<div class="button">` — only bare `<button>` or `<h1>`

---

### 5. **OBJECTS** (`objects/`)
- Layout patterns and structural components
- **Use class names** like `.o-container`, `.o-grid`, `.o-flex`
- **Non-decorated** design patterns (reusable building blocks)
- Technology-agnostic (work with any framework)
- Contains: Grid systems, flex layouts, media objects

**Usage:**
```html
<div class="o-container">
  <div class="o-grid-3">
    <div>Item 1</div>
    <div>Item 2</div>
    <div>Item 3</div>
  </div>
</div>
```

**Key Concept:** Objects are layout and structure tools, not finished UI.

---

### 6. **COMPONENTS** (`components/`)
- **Specific, decorated UI components**
- Use class names like `.c-btn`, `.c-card`, `.c-navbar`
- Use BEM naming: `.c-btn--primary`, `.c-btn__icon`
- The "meat" of your CSS (most styling happens here)
- Can also live alongside component files (e.g., `navbar.component.scss`)

**Usage:**
```html
<button class="c-btn c-btn--primary">
  <span class="c-btn__icon">✓</span>
  Save
</button>
```

**BEM Naming Convention:**
- **Block**: `.c-btn` (the component)
- **Element**: `.c-btn__icon` (part of the component)
- **Modifier**: `.c-btn--primary` (variant or state)

---

### 7. **TRUMPS** (`trumps/`)
- **Overrides and utilities** (HIGHEST SPECIFICITY)
- Use `!important` here (it's expected)
- Use **sparingly** — only for truly exceptional cases
- Contains: Utility classes, exceptions, hacks

**Usage:**
```scss
.u-hidden {
  display: none !important;
}

.u-text-center {
  text-align: center !important;
}
```

**Rule:** If you find yourself using many trumps, refactor CSS structure instead.

---

## Class Naming Convention

**Prefixes indicate layer:**

| Prefix | Layer | Example | Use Case |
|--------|-------|---------|----------|
| `.o-` | Objects | `.o-container`, `.o-grid` | Layout, structure |
| `.c-` | Components | `.c-btn`, `.c-card` | UI components |
| `.u-` | Trumps/Utilities | `.u-hidden`, `.u-text-center` | Exceptions, helpers |
| — | Elements | `h1`, `button`, `input` | Bare HTML |

---

## Folder Structure

```
src/styles/
├── main.scss                 # Orchestrator (imports all layers)
├── settings/
│   ├── variables.scss        # Colors, spacing, typography
│   ├── breakpoints.scss      # Media query breakpoints
│   └── z-indexes.scss        # Z-index values
├── tools/
│   ├── mixins.scss           # Reusable SCSS mixins
│   └── functions.scss        # SCSS functions
├── generic/
│   ├── reset.scss            # Browser reset
│   └── box-sizing.scss       # Box-sizing: border-box
├── elements/
│   ├── typography.scss       # h1, p, strong, etc
│   └── forms.scss            # input, button, select, etc
├── objects/
│   ├── layout.scss           # Flex, container, stack
│   └── grid.scss             # Grid system
├── components/
│   ├── buttons.scss          # .c-btn component
│   └── cards.scss            # .c-card component
└── trumps/
    ├── utilities.scss        # .u-* utility classes
    └── overrides.scss        # Exceptions and hacks
```

---

## Do's and Don'ts

### ✓ DO

- ✓ Keep settings pure (no CSS output, only variables)
- ✓ Use semantic, descriptive naming (`.c-button`, not `.c-b`)
- ✓ Keep specificity low in early layers
- ✓ Use utilities (trumps) for true exceptions only
- ✓ Import layers in the correct order
- ✓ Use variables for colors, spacing, sizing
- ✓ Use mixins for repeated patterns
- ✓ Group related styles in appropriate layers

### ✗ DON'T

- ✗ Put component styles in generic/elements layers
- ✗ Add new specificity where it doesn't belong
- ✗ Use `!important` outside the trumps layer
- ✗ Skip layers (import tools before settings)
- ✗ Create utility classes for everything
- ✗ Use magic numbers (always use variables)
- ✗ Nest selectors deeply (max 3 levels)

---

## Benefits of ITCSS

1. **Specificity Management** — Increases only when necessary
2. **Scalability** — Add new styles without breaking existing ones
3. **Predictability** — Clear location for every style rule
4. **Maintainability** — Easy to find and modify styles
5. **Collaboration** — Team members understand structure
6. **Performance** — Organized and optimizable CSS

---

## Example: Creating a New Component

When creating a new component, follow this process:

### 1. Create Component Files
```scss
// src/app/components/my-component/my-component.component.scss
.c-my-component {
  padding: $spacing-md;
  background: $color-white;
  border-radius: $border-radius-lg;
  box-shadow: $shadow-md;
}
```

### 2. Or Add to Main Components Layer
```scss
// src/styles/components/my-new.scss
.c-my-new {
  // Styles here
}

// Then import in main.scss
@import 'components/my-new';
```

### 3. Use in HTML with BEM
```html
<div class="c-my-component">
  <h3 class="c-my-component__title">Title</h3>
  <div class="c-my-component__body">Content</div>
  <button class="c-my-component__action c-my-component__action--primary">
    Action
  </button>
</div>
```

---

## Important Notes

- **Always import in order** — Settings → Tools → Generic → Elements → Objects → Components → Trumps
- **Use variables** — Never hardcode colors, spacing, or sizes
- **Use mixins** — Avoid repeating media queries and complex patterns
- **One specificity worth** — Each CSS rule should be as specific as needed, no more
- **Prefer objects for layout** — Objects are reusable across many components

---

## Related Resources

- [ITCSS by Harry Roberts](https://itcss.io/) — Original concept and philosophy
- [BEM Naming Methodology](http://getbem.com/) — Block Element Modifier naming
- [SCSS/SASS Documentation](https://sass-lang.com/documentation/) — Preprocessor syntax

---

## Questions?

Refer to the TODO comments in each file for detailed explanations of specific concepts.
