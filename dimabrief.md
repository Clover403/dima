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

referensi tampilan website yang saya inginkan, ini adalah: https://terminal-industries.com/ 
http://relats.com/sustainability

brief from client:
Essential Foundations Web Site DIMA
FINANCE for price purposes.
Content
Pages/Sections ..................................................................................................... 2
Products ............................................................................................................... 3
Services ............................................................................................................... 5
Target audience .................................................................................................... 6
Legal or compliance points that must appear on the website .................................... 6
Brand Book ........................................................................................................... 6
Ideal launch date ................................................................................................... 8
Pages/Sections
1. Regarding the pages/sections I would like one of the pages to be dedicated
primarily to our origin, identity, and philosophy, as this is one of our greatest
differentiators. This page should cover how we started, what we do, and so on.
Additionally, to capture the audience's attention, I would briefly mention the
products and services we offer on this same page.
2. Therefore, we would like a second page explaining our credit model. Another key
differentiator, which is essentially our origin, identity, and institutional philosophy
translated into our operational identity and philosophy, is our core business
model. Here, we would like to explain what this model entails, as it is a
macroeconomic model adapted to the microeconomic level, specifically to the
business/company level. Furthermore, and as a result of the above, we would
also explain our credit granting process.
3. Another page, of course, dedicated to explaining each and every one of our
products in detail. Financial ignorance in general, and especially regarding
leverage, debt, and funding, is very widespread, at least in Mexico. Therefore, it
will be important to be detailed but also concise in the length and content of the
text. We will be fully involved in this aspect, and it will come up later.
4. 5. The same applies to our financial services. A dedicated page for our services.
Speaking of the conversion flow, we'd like a contact section, buttons all over the
web site at specific points where users can request advice and schedule a video
conference directly linked to our calendar. Of course, we'd also include our
contact information via email, phone, and WhatsApp. But specifically for the pre-
qualification process, we'd like to ask for general information such as the loan
amount they're looking for, the term, and other details. This would allow us to
filter leads and avoid generating a huge number of unsolicited leads. I'm not sure
if this warrants a separate page or if it could be integrated into one of the existing
sections.
6. Another page dedicated to talking about us as an institution/organization.
General information could include, for example, the current team, when we were
founded, where we're from, and other relevant details. We'd need to decide
what information to include here, but a page like our CV.
Products
(I will be as concise as possible. Regarding concepts, I will use exact translations.)
It's important to note that most loans can be tailored to each client's circumstances and
needs. Ultimately, what differentiates them are primarily legal matters, specifically the
contract's clauses and conditions, which can be adapted to any situation. That said, I'll
outline the main characteristics of each type and their typical/common uses, although
these uses aren't strictly defined.
a) Simple Credit (the most common or well-known)
It's a fixed-term loan with a set interest rate, defined amounts, and predictable
payments. It allows you to obtain capital for specific projects without affecting
your cash flow.
b) Bridge Credit (Known in english as “Bridging Loan”)
It is a type of simple loan designed to cover the costs of a real estate project
(construction, development, etc.) and the expected revenue.
c) Current Account Credit (Revolving working capital limit or Overdraft
facility/protection in English)
Designed to facilitate the daily management of a company's operations. With
other loans, once you repay the principal, you can no longer access the funds,
and the contract ends when you finish paying it off. With this loan, you can repay
the loan and access the funds again as long as the contract is active. Similar to
a credit card, it's for managing project finances centrally and securely, facilitating
control and monitoring of operations, covering short-term liquidity needs, taking
advantage of business opportunities, optimizing working capital management,
and financing specific projects.
d) Agro-industrial Credit (also known as Agro-industrial lending)
Designed specifically for the agricultural sector, this program allows producers
and businesses in the sector to access capital for investments, working capital,
and modernization projects. The process involves evaluating the agricultural
project, approving the loan, and disbursing the funds, with payments tailored to
the harvest cycles.
e) Factoring (Known in english as Accounts receivable financing or invoice
financing)
This allows you to obtain immediate liquidity by assigning your accounts
receivable (invoices receivable) to a financial institution. You receive an advance
on the value of your invoices, giving you working capital without waiting for your
customers to pay. The financial institution manages the collection of the
invoices.
f) Financial Leasing
It is a product designed for the borrower to use and ultimately acquire an asset
through periodic payments that include principal and interest. Unlike a standard
lease, a service focused solely on temporary use through periodic payments
called rent, the goal here is the transfer of ownership at the end of the contract
in exchange for a payment of the asset's value, known as its "residual value."
Therefore, the asset is recorded on the borrower's balance sheet, allowing them
to deduct both the interest payments and the asset's depreciation. Furthermore,
the lessee assumes the risks and responsibilities associated with the asset, such
as its maintenance and insurance. Essentially, it is a strategic financing tool that
culminates in the lessee's ownership of the asset.
Services
They are all, in some way, advisory and consulting services.
1. Debt Reengineering and Capital Structure
Analysis of the company's current debt and comprehensive design of the
optimal capital structure (debt vs. equity), including maturities, currencies, rates,
and covenants, aligned with the operating cycle and the debt cycle (part of the
macroeconomic model adapted to our credit model). We identify expensive
loans, mismatched maturities (short-term financing long-term), and wasted
collateral. This includes refinancing, consolidation, and debt reengineering.
2. Cycle-Based Financial Strategy - Liability Reengineering (Ray Dalio
Framework)
Diagnosing the business within the economic, credit and sectoral cycle to
anticipate financial decisions, not react to them.
3. Advanced Treasury and Conversion Cycle (Cash-Flow Maximization
Architecture)
Dynamic modeling of operational, financial and strategic cash flow to maximize
available liquidity without sacrificing profitability.
Strategies to accelerate collections and optimize payments to suppliers and
inventory.
4. Strategic Financial Valuation and Value Engineering
To determine the real value of the company for purposes of sale, merger or entry
of investment partners, as well as for internal decisions regarding financing,
expansion or restructuring.
5. Asset Efficiency Audit (CAPEX Intelligence)
We mathematically evaluate whether the machinery or expansion the client
wants to purchase is viable. We don't use hunches, we use calculations. This
avoids the "Risk of Unproductive Investment" (buying machines that don't pay
off their own debt).
6. Financial Governance, Capital Discipline and Financial Succession (Like a
External Strategic CFO)
Ongoing support as an external financial architect, establishing rules, metrics,
and capital decisions. Professionalization of financial decision-making. Creation
of internal committees and dividend policies.
Target audience
These are primarily companies. The industry doesn't matter; they can be from any
sector. The type of company is determined more by its ability to repay than by its size.
It could be a company with a small team but one that generates sufficient revenue
and/or has financially sound and verifiable contracts/projects. For the same reason,
individual entrepreneurs are also eligible; however, they are few because, in terms of
risk, there is less risk in lending to companies than to individuals. That said, while we
don't have an unlimited budget, the loan amount is large enough to compete with even
a bank. Therefore, the loan size, to put it simply, could cover the needs from small
companies to even a AAA-rated company.
Legal or compliance points that must appear on the
website
Legal Notice (paragraph we already have)
Privacy notice (paragraph we already have)
Brand Book
Regarding the brand manual, I received it about 24 hours ago; however, it will undergo
many changes. Nevertheless, I can provide you with the important specifications for
pricing purposes, which will be the ones that ultimately appear in the manual. Of course,
if you need anything else besides this, let me know.
Logo
This is the logo, but as I mentioned, there are pending changes in the manual. For
example, the font for DIMA FINANCE (Brand Name) will be Gill Sans MT. But the shape,
the symbol, is the same.
Tipography
Headings: Playfair Display
Texts: Inter Tight
Colorimetry
Color scheme: I'm sharing the inspiration. These will be the brand colors. This is how all
our branding should look.
Websites I like
I would tell you exactly which ones you present in your content; if I had to specify
which ones, I would tell you the following:
https://terminal-industries.com/
http://relats.com/sustainability
I know they have nothing to do with my line of business. But this is the inspiration, and
to adapt this to my business, I'd like to give you complete freedom to make a proposal.
I already have some inspiration, but I'd like to see what you have in mind first. From what
I see in your content, the probability of you exceeding my own expectations of this idea
of mine is of 100%.
I'm also sharing with you another type of input that I really like outside of your account.
https://vt.tiktok.com/ZS5TMUcPj/
https://vt.tiktok.com/ZS5TMwH83/
Even if you look closely, the type of business they run is completely different, yet they
follow several patterns and share many characteristics, including—and this is one of my
favorites—their visual effects. That's why, before I share my idea with you, I'd like to see
one of yours. Feel free to visually incorporate elements related to this type of business
using the patterns shared by the pages I've attached.