You are building a premium, elegant, and modern website for DIMA Finance — a financial engineering institution based in Mexico. The site must feel like a world-class financial brand: cinematic, minimal, sophisticated, and scroll-driven. Think of references like Cornrevolution — where every scroll feels intentional, text is sparse but powerful, and animations are deeply satisfying.

---

## TECH STACK
- React 18 + Vite + TypeScript
- Tailwind CSS v3
- GSAP + ScrollTrigger (all scroll-linked animations)
- Lenis (smooth scroll engine)
- Framer Motion (page transitions, hover effects, component animations)
- React Router v6
- Resend (contact form)

---

## FOLDER STRUCTURE
The project is inside /dima/dima-web/
Assets are located at:
- /dima/logo/ → move to dima-web/public/logo/
- /dima/foto/ → move to dima-web/public/foto/

Logo files to use (SVG preferred):
- Dark background → orange_white.svg (white + orange logo)
- Light background → orange_black.svg

---

## BRAND IDENTITY

### Colors
- Background primary: #030035 (deep navy)
- Accent primary: #E5997B (bronze/salmon)
- Accent secondary: #F4F4F5 (light gray)
- Use navy as the dominant background throughout the site

### Typography
- Headings: Playfair Display (Google Fonts) — elegant, serif, authoritative
- Body: Inter Tight (Google Fonts) — clean, modern, readable
- Import both from Google Fonts in index.html

### Visual Language
- Minimal text, maximum impact
- Geometric elements inspired by the DIMA logo shape (diamond/hourglass)
- Illustration style: engraving/sketch-like (not cartoonish, not photographic)
- Photography used sparingly, only in About Us section
- Every element should feel intentional and deliberate

---

## SITE STRUCTURE (6 pages via React Router)
1. / → Home
2. /modelo-crediticio → Credit Model
3. /productos → Products
4. /servicios → Services
5. /contacto → Contact
6. /nosotros → About Us

---

## HOME PAGE (Most important — maximize this)

### Hero Section (CRITICAL)
- Full viewport height (100vh), full width
- Deep navy background (#030035)
- Large Playfair Display heading, white, centered or left-aligned
- Suggested headline: "Ingeniería Financiera para el Crecimiento Real"
- Subheading in Inter Tight, bronze/salmon color, smaller
- Subtle geometric animation in background — inspired by DIMA logo shape (diamond/hourglass forms), drawn slowly using GSAP stroke animation or SVG path animation
- Bronze/salmon thin horizontal line as a divider element
- CTA button: "Conoce Nuestro Modelo" → styled with bronze border, transparent background, hover fills bronze
- On scroll, hero content fades out or slides up smoothly with GSAP ScrollTrigger
- NO stock photos in hero — pure typography + geometric animation

### Section 2 — Who We Are (Scroll-triggered)
- Background stays dark navy
- As user scrolls, text reveals line by line (GSAP SplitText or manual span animation)
- One powerful statement per scroll step
- Bronze/salmon accent on key words
- Inspired by Ray Dalio philosophy — use short, punchy phrases
- Example phrases (placeholder, will be replaced with Spanish copy):
  "No somos un banco."
  "Somos arquitectos de equilibrio."
  "Transformamos la deuda en productividad."

### Section 3 — Products Preview
- Dark card grid or horizontal scroll
- 6 product cards, each with:
  - Bronze/salmon icon or geometric shape
  - Product name in Playfair Display
  - One-line description in Inter Tight
  - Hover: subtle lift + border glow in bronze
  - Cards animate in on scroll with staggered GSAP entrance

### Section 4 — Services Preview
- Similar treatment to products but different layout (alternating left-right or full-width strips)
- Each service has an engraving-style illustration placeholder (use SVG placeholder for now)
- Scroll-triggered reveal

### Section 5 — Credit Model Teaser
- Full-width dark section
- Large background text (very faint, oversized) as texture: "DIMA"
- Foreground: brief explanation of Ray Dalio-based model
- CTA: "Descubre el Modelo" button
- Parallax depth effect on background text using GSAP

### Section 6 — CTA / Contact Banner
- Full-width section, bronze/salmon background or gradient
- Bold heading: "¿Listo para estructurar tu crecimiento?"
- Two CTAs: "Agenda una Videollamada" + "Contáctanos"
- Simple, impactful, no clutter

### Footer
- Dark navy background
- Logo (orange_white.svg)
- Navigation links
- Contact info: email, phone, WhatsApp
- Legal Notice + Privacy Notice links
- Minimal, clean, no noise

---

## ANIMATION PRINCIPLES (Apply globally)
- Initialize Lenis for smooth scroll on app mount, connect to GSAP ScrollTrigger via lenis.on('scroll', ScrollTrigger.update)
- All scroll animations use GSAP ScrollTrigger with scrub or trigger-based approach
- Page transitions use Framer Motion (AnimatePresence + motion.div wrapper)
- Hover animations: Framer Motion whileHover on interactive elements
- NO jarring or fast animations — everything must feel slow, smooth, and intentional
- Easing: prefer CustomEase or "power2.out" throughout
- Never animate more than 2-3 things simultaneously

---

## GLOBAL SETUP REQUIREMENTS
- tailwind.config.ts must include custom colors:
  navy: '#030035'
  bronze: '#E5997B'
  lightgray: '#F4F4F5'
- tailwind.config.ts must include custom fonts:
  display: ['Playfair Display', 'serif']
  body: ['Inter Tight', 'sans-serif']
- Global CSS: html smooth scroll disabled (Lenis handles it), body background #030035 by default
- React Router setup with layout wrapper that includes Navbar + Footer
- Navbar: fixed, transparent on hero, becomes dark navy on scroll (GSAP ScrollTrigger)
- All pages use Framer Motion page transition wrapper

---

## PLACEHOLDER NOTES
The following content will be provided later by the client — use elegant placeholder text for now:
- About Us: team members, founding date, company history
- Legal Notice and Privacy Notice text
- Calendar/booking integration (Calendly or similar — placeholder button for now)
- Final Spanish copywriting for all pages
- Engraving-style illustrations (use geometric SVG placeholders for now)

---

## IMPORTANT RULES
- All text on the site must be in Spanish
- Mobile responsive is required — but prioritize desktop first
- No generic stock photo vibes — every visual decision must feel premium
- Do not use any UI component libraries (no shadcn, no MUI) — build everything custom with Tailwind
- Keep components clean and well-organized in src/components/
- Pages go in src/pages/
- GSAP animations go in custom hooks in src/hooks/
- Start by building the complete Home page first before moving to other pages