# Design System Strategy: The Kinetic Precision Framework

## 1. Overview & Creative North Star
**The Creative North Star: "Precision Luminescence"**

This design system moves away from the static, "boxy" nature of traditional e-commerce. For a high-end mobile phone store, we must mirror the industrial design of the products themselves: glass, metal, and light. We achieve a "Samsung-meets-Apple" editorial feel not by following a template, but by mastering the tension between massive white space and high-velocity "Electric Blue" accents. 

The aesthetic is characterized by **Intentional Asymmetry**. We break the grid by allowing hero product imagery to bleed off-canvas or overlap container boundaries, creating a sense of scale and physical presence. This is not a shop; it is a digital showroom.

---

## 2. Colors: The Chromatic Engine
Our palette is rooted in a "Technology Blue" foundation, supported by a sophisticated range of neutrals that provide architectural depth.

### Color Tokens (Material Design Convention)
*   **Primary (`#003ec7`):** Our Electric Blue. Use this for high-impact brand moments and critical CTAs.
*   **Surface / Background (`#f9f9fb`):** A slightly cool, off-white that reduces eye strain compared to pure `#ffffff`.
*   **On-Surface (`#1a1c1d`):** Our "Ink." Used for primary headlines to ensure maximum readability and high-contrast punch.

### The "No-Line" Rule
**Borders are prohibited for sectioning.** To define a new content area, use a background shift from `surface` to `surface-container-low`. This creates a seamless, "molded" look rather than a fragmented layout.

### Surface Hierarchy & Nesting
Think of the UI as layers of machined aluminum and glass:
1.  **Base:** `surface` (The floor)
2.  **Sectioning:** `surface-container-low` (Subtle zoning)
3.  **Interactive Elements:** `surface-container-lowest` (`#ffffff`) (The "Float" layer for cards)

### The "Glass & Gradient" Rule
To elevate the "Electric Blue" beyond a flat hex code, apply a linear gradient from `primary` (`#003ec7`) to `primary_container` (`#0052ff`) at a 135-degree angle. Use this for flagship buttons and hero background accents to simulate the refractive quality of a smartphone screen.

---

## 3. Typography: Editorial Authority
We utilize **Inter** for its mathematical precision and neutral character, allowing the product photography to remain the hero.

*   **Display (`display-lg` to `display-sm`):** 3.5rem to 2.25rem. Tight letter-spacing (-0.02em). Use for product names.
*   **Headline (`headline-lg` to `headline-sm`):** 2rem to 1.5rem. Bold weights only. These act as the "hooks" for storytelling.
*   **Body (`body-lg` to `body-md`):** 1rem to 0.875rem. Increased line-height (1.6) to ensure the "spacious" feel requested.
*   **Labels (`label-md`):** 0.75rem. All-caps with 0.05em tracking for technical specifications (e.g., "5G READY").

---

## 4. Elevation & Depth: Tonal Layering
Traditional drop shadows are too "dirty" for this system. We use **Ambient Softness**.

*   **The Layering Principle:** A product card (`surface-container-lowest`) sits on a `surface-container-low` background. The depth is felt through the color shift, not a line.
*   **Ambient Shadows:** For floating elements (like a "Buy Now" bar), use: `box-shadow: 0 20px 40px rgba(26, 28, 29, 0.04)`. It should be almost invisible, felt rather than seen.
*   **The "Ghost Border" Fallback:** If high-contrast accessibility is required, use `outline-variant` at 15% opacity.
*   **Glassmorphism:** For navigation bars, use `surface` at 80% opacity with a `backdrop-blur: 20px`. This ensures the product colors "bleed" into the UI as the user scrolls.

---

## 5. Components: Machined Elements

### Buttons
*   **Primary:** Gradient (`primary` to `primary_container`), `xl` (12px) rounding, white text. No border.
*   **Secondary:** `surface-container-high` background with `on-surface` text. This feels integrated into the page.
*   **Tertiary:** Pure text with a chevron, using `primary` color.

### Product Cards
*   **Style:** No borders. Background: `surface-container-lowest`. 
*   **Rounding:** `xl` (approx. 12px) to provide a friendly yet professional "hand-feel."
*   **Layout:** Remove all dividers. Use 32px of internal padding to let the product image breathe.

### Input Fields
*   **Style:** Ghost style. Background: `surface-container-highest` with a 2px bottom-only focus state in `primary`. 
*   **Validation:** Error states use `error` (`#ba1a1a`) text, but the container should use a soft `error_container` wash.

### Specialized Component: The "Feature Ribbon"
A horizontally scrolling list of chips (`secondary_fixed_dim`) used for specs (e.g., "128GB", "256GB"). These should have zero border, using only tonal shifts to indicate the "Selected" state.

---

## 6. Do’s and Don’ts

### Do:
*   **Do** use extreme vertical whitespace (e.g., 120px between major sections) to convey luxury.
*   **Do** overlap product images over the edge of their containers to create a 3D effect.
*   **Do** use the `primary` blue sparingly. It is a "laser," not a "paint."

### Don’t:
*   **Don't** use 1px solid borders. It makes the site look like a budget spreadsheet.
*   **Don't** use pure black (`#000000`). It is too heavy for the "Light Gray" aesthetic. Use `on-surface` (`#1a1c1d`).
*   **Don't** crowd the product cards. If you can fit 4 in a row, try 3 to increase the "Premium" feel.
*   **Don't** use standard "drop shadows." If it looks like a shadow from 2010, it's too dark.

---

## 7. Spacing Scale
Maintain a strict 8pt grid, but prioritize these specific increments:
*   **Section Spacing:** 80px, 120px (Desktop); 48px, 64px (Mobile).
*   **Component Padding:** 16px (Internal), 24px (External).
*   **Stacking:** 8px between label and input; 16px between headline and body.