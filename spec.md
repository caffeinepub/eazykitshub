# Eazykitshub - Premium Football Jersey Store

## Current State
Functional jersey store with backend: jersey CRUD, orders, admin auth, blob storage. Frontend has basic homepage, store page, jersey detail, cart, checkout, order confirmation, and admin pages. Design is generic/minimal.

## Requested Changes (Diff)

### Add
- Cinematic hero section with stadium/football imagery, bold headline "Wear The Game.", two CTAs (Shop Now, Shop Retro)
- Currency switcher (₦ NGN default, USD, GBP, EUR) with auto-detect via browser locale
- Auto-sliding bestsellers carousel with discount badges, stock urgency, quick-add, wishlist icon
- Category grid: Fans Version, Player Version, Retro, Jersey Polos, National Teams, Club Teams with brief descriptions
- Fans vs Player Version comparison table (Fabric, Fit, Breathability, Match Authenticity, Price Tier)
- Social proof section: star reviews, purchase notification toasts ("Someone in Lagos just bought Arsenal Home Jersey")
- Why Choose Us section with icons
- Newsletter signup with 10% off offer
- Loyalty points display (mock: purchases, referrals, reviews)
- Referral system UI ("Refer a Friend, Get ₦2000 Discount")
- Pre-order badge on select products
- Countdown timer for limited drops
- AI Jersey Finder quiz ("What Club Do You Support?" flow to jersey suggestions)
- Product page: version selector, size chart modal, zoom on hover, bundle discount suggestion, Complete The Look upsell, delivery estimate
- Floating WhatsApp button (+234 8134445712)
- FAQ, Shipping Policy, Return Policy, Size Guide pages
- Blog section ("Latest Football Kit Releases") - static posts
- SEO meta tags on all pages
- Black + White + Neon Green (#39FF14) design system, bold premium sports aesthetic, micro-animations
- Footer with contact: WhatsApp, Instagram @Eazykitshub, Email Eazykits007@gmail.com, Location Nigeria

### Modify
- Navbar: premium dark design with neon green accent, currency switcher, cart count
- HomePage: full cinematic redesign per blueprint above
- StorePage: add category filters, product grid with badges
- JerseyDetailPage: premium product page layout
- CartPage: improved with bundle suggestions
- CheckoutPage: guest checkout, WhatsApp confirmation option
- Footer: full brand footer with all contact details and page links

### Remove
- Generic placeholder styling

## Implementation Plan
1. Redesign index.css with OKLCH-based design tokens: black bg, white text, neon green accent
2. Redesign Navbar with premium dark aesthetic, currency switcher, animated cart
3. Rebuild HomePage with all 8 sections from the blueprint
4. Enhance StorePage with category segmentation and rich product cards
5. Enhance JerseyDetailPage with version selector, size chart modal, zoom, upsells
6. Add floating WhatsApp button globally
7. Add live purchase notification toasts
8. Add AI Jersey Finder quiz modal
9. Add FAQ, Shipping, Returns, Size Guide, Blog pages with routes
10. Enhance Footer with all contact info and links
11. Add currency context for switching
