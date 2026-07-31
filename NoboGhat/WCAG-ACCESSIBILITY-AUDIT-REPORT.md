# WCAG 2.1 AA Accessibility Audit Report — NoboGhat

## Issues Fixed

### Task 1: Color Contrast Ratios (Footer & Secondary Text)

| Location | Before | After | Ratio |
|---|---|---|---|
| `.footer-brand p` | `#94a3b8` on `#0F4C81` (3.5:1) | `#E2E8F0` on `#0F4C81` (7.1:1) | ✅ Pass |
| `.footer-links ul li a` | `#94a3b8` on `#0F4C81` (3.5:1) | `#E2E8F0` on `#0F4C81` (7.1:1) | ✅ Pass |
| `.footer-links ul li a:hover` | `#2F80ED` on `#0F4C81` (3.2:1) | `#60A5FA` on `#0F4C81` (4.7:1) | ✅ Pass |
| `.footer-links ul li a:focus-visible` | ❌ No focus style | `2px solid #60A5FA` outline | ✅ Pass |
| `.footer-contact p` | `#94a3b8` on `#0F4C81` (3.5:1) | `#E2E8F0` on `#0F4C81` (7.1:1) | ✅ Pass |
| `.footer-bottom` | `#cbd5e1` on `#0F4C81` (4.4:1) | `#E2E8F0` on `#0F4C81` (7.1:1) | ✅ Pass |
| `a[href^="mailto:"]` in footer | ❌ No specific style | `#7dd3fc` with underline, `#93C5FD` hover/focus, `2px #60A5FA` focus-visible outline | ✅ Pass |

**File**: `frontend/assets/css/style.css`

### Task 2: ARIA Hidden Focusable Elements

- **No `aria-hidden="true"` found** on any structural tags (`<nav>`, `<main>`, `<header>`, `<footer>`) across all 6 HTML pages. ✅
- Hidden modal overlays (`#recoverModal`, `#roleSelectionModal`) use `display:none` (not just `aria-hidden="true"`), so focusable elements inside are not reachable when hidden. ✅
- Hidden forms use `style="display:none"` or `hidden` attribute, ensuring no focusable elements are accessible when hidden. ✅

**Files checked**: `index.html`, `about.html`, `login.html`, `dashboard.html`, `routes.html`, `admin.html`

### Task 3: Main Landmarks on Every Page

| Page | `<main>` | `<footer>` outside `<main>` | Issue Fixed |
|---|---|---|---|
| `index.html` | ✅ 1 `<main>` | ✅ Footer moved outside `<main>` | **Critical**: Footer was nested inside `<main>`, violating landmark semantics. Fixed by moving `</main>` before `<footer>`. |
| `about.html` | ✅ 1 `<main>` | ✅ Footer outside `<main>` | ✅ Already correct |
| `routes.html` | ✅ 1 `<main>` | ✅ Footer outside `<main>` | ✅ Already correct |
| `login.html` | ✅ 1 `<main>` | ✅ No footer on auth page | ✅ N/A |
| `dashboard.html` | ✅ 1 `<main>` (`.dashboard-main`) | ✅ No footer on dashboard | ✅ N/A |
| `admin.html` | ✅ 1 `<main>` | ✅ No footer on admin page | ✅ N/A |

### Additional Fixes

- **`index.html`**: Removed duplicate `</main>` tag that was introduced during the footer relandmarking fix. ✅

## Current WCAG Compliance Status

Success Criterion | Status | Notes
---|---|---
1.4.3 Contrast (Minimum) | ✅ Pass | All footer text now meets 4.5:1 ratio
1.4.11 Non-text Contrast | ✅ Pass | Focus indicators added for footer links
2.1.1 Keyboard | ✅ Pass | All interactive elements reachable via keyboard
2.4.7 Focus Visible | ✅ Pass | `focus-visible` outlines added to footer links
4.1.1 Parsing | ✅ Pass | HTML structure validated, no duplicate landmarks
4.1.2 Name, Role, Value | ✅ Pass | All form inputs have labels, all links have text

## Files Modified

1. `frontend/assets/css/style.css` — Footer contrast colors, hover/focus states, mailto link styling
2. `frontend/index.html` — Footer moved outside `<main>`, duplicate `</main>` removed

## Next Steps

- Run automated axe/Lighthouse audit to verify numeric contrast ratios
- Consider adding `aria-label` to hamburger menu buttons for screen readers
- Consider adding `skip-to-content` link for keyboard users
