# NewLegends: Jodie Devine's Concert Photography Journal & Review Archive

> **"Preserving the kinetic pulse between the barrier & stage."**

A dedicated, media-first concert photography portfolio and music review archive built for **Jodie Devine** under the **NewLegends** brand evolution. Designed with an organic analog film aesthetic, deckled paper borders, 35mm film grain, a 4-axis critical rating audit, multi-city road timelines, interactive mapping, and pit-level barrier perspectives.

---

## 📸 Brand Evolution & Analog Aesthetic

- **Warm Espresso Palette**: Canvas set in `#0c0a09` (Stone 950 deep espresso) layered with warm stone cards (`#171412`, `#211d1a`), amber accents (`#f59e0b`), and vintage cream typography (`#f6f3eb`).
- **35mm Analog Film Grain**: Authentic procedural film noise overlay with on/off toggle and persistent preference saving.
- **Sprocket Perforations & Deckled Edges**: 35mm film contact sheet frame styling, soft organic curves (`rounded-3xl`), and subtle warm stone border glow.
- **Direct Platform Integrations**: Seamless connections to:
  - **[Jumble of Notes](https://jumbleofnotes.wordpress.com/)** (WordPress review blog)
  - **[@jodiedevineart](https://www.instagram.com/jodiedevineart/)** (Instagram photography gallery)
  - **[@jodiejodiejo](https://www.instagram.com/jodiejodiejo/)** (Personal IG behind-the-lens)
  - **[@jodiejodiejo1](https://www.tiktok.com/@jodiejodiejo1)** (TikTok tour clips)
  - **[Jodie Devine Folio](https://jodiedevinef.wixsite.com/jodiefolio)** (Official web photography showcase)

---

## 🎸 Every Logged Concert Included (18 Shows / 11 Cities)

1. **The Strike & Sumsun** — July 10, 2026 · Brighton Music Hall (Boston, MA)
2. **5 Seconds of Summer & The Band CAMINO** — May 29, 2026 · Mohegan Sun Arena (Uncasville, CT)
3. **5 Seconds of Summer & The Band CAMINO** — June 05, 2026 · TD Garden / Stadium (Boston, MA)
4. **5 Seconds of Summer & The Band CAMINO (Residency Night 1)** — June 13, 2026 · Madison Square Garden (New York, NY)
5. **5 Seconds of Summer & The Band CAMINO (Residency Night 2)** — June 14, 2026 · Madison Square Garden (New York, NY)
6. **5 Seconds of Summer & The Band CAMINO** — July 11, 2026 · Kia Forum (Inglewood / Los Angeles, CA)
7. **The Band CAMINO (Special Headline Stop)** — July 31, 2026 · The Muse (Nantucket, MA)
8. **5 Seconds of Summer, The Band CAMINO & Haiden Henderson** — August 03, 2026 · Darien Lake Amphitheater (Buffalo, NY)
9. **5 Seconds of Summer, The Band CAMINO & Haiden Henderson** — August 06, 2026 · Pine Knob Music Theatre (Clarkston, MI)
10. **5 Seconds of Summer, The Band CAMINO & Haiden Henderson** — August 14, 2026 · Coastal Credit Union Music Park (Raleigh, NC)
11. **In Color with Wilt & Jutes** — August 16, 2026 · The Majestic Theatre (Detroit, MI)
12. **In Color with Wilt & Jutes** — August 18, 2026 · Frankie's Bar (Toledo, OH)
13. **Jonas Brothers** — August 20, 2026 · Madison Square Garden (New York, NY)
14. **In Color with Wilt & Jutes (Tour Finale)** — August 27, 2026 · Irving Plaza (New York, NY)
15. **The Band CAMINO (Homecoming Night 1)** — September 04, 2026 · Satellite Music Hall (Memphis, TN)
16. **The Band CAMINO (Homecoming Night 2)** — September 05, 2026 · Satellite Music Hall (Memphis, TN)
17. **Jonas Brothers** — September 25, 2026 · TD Garden (Boston, MA)
18. **Teddy Swims** — October 09, 2026 · TD Garden (Boston, MA)

---

## 📸 Replacing Placeholder Images with Your Real Photography

You have **two easy ways** to replace placeholder photos with your real concert photography:

### Option 1: In-Browser Quick Replacer (Zero Code / Drag & Drop)
1. Click the **"Replace Photos"** button in the top navigation bar, or click **"Replace Photo"** on any individual concert review page.
2. Select the concert from the dropdown list.
3. Click **"Browse & Select Photo"** to pick any photo directly from your device.
   - The app automatically optimizes the photo for web viewing without distortion and saves it directly to browser `localStorage`.
   - Or paste a URL/local path (e.g. `assets/photos/5sos-msg-1.jpg`).
4. Click **"Save Photo"** — all review headers, card previews, and photo vault items update instantly!

### Option 2: Drop Photos into the `assets/photos/` Folder
1. Drop your `.jpg` or `.png` files directly into `assets/photos/` using the standard filenames listed in [`assets/photos/HOW_TO_ADD_PHOTOS.md`](assets/photos/HOW_TO_ADD_PHOTOS.md).
2. Open the **"Replace Photos"** tool on the website and click **"Switch All Shows to assets/photos/*.jpg"**.
3. All 18 shows will immediately link to your local files with one click!

---

## 🗺️ User-Friendly Sitemap Structure

- `#/home` — **Spotlight Hub**: Featured live entries, hero slide mount, quick metrics, and recent road stops.
- `#/reviews` — **Editorial Reviews Archive**: Searchable, filterable catalogue of all 18 concerts with 4-axis rating previews and setlist highlights.
- `#/show/:id` — **Individual Show & Review Pages**: Deep-linked dedicated pages featuring:
  - Custom review narratives & pit field notes
  - Standout editorial quotes
  - Full setlists with song highlight badges
  - 4-axis interactive radar diagram (Energy, Vocals, Crowd Vibe, Venue Acoustics)
  - In-place **"Edit Ratings & Review"** modal that saves directly to `localStorage`
  - High-res photo gallery with one-click lightbox zoom
  - Chronological next/previous show navigation
- `#/timeline` — **Multi-City Road Timeline ("Tour Run")**: Chronological trajectory tracking cross-country runs, mileage, and stop details.
- `#/vault` — **Concert Photo Vault**: Media-first masonry gallery with filter tabs and interactive fullscreen lightbox with camera EXIF data.
- `#/stats` — **Show Analytics & Records**: Tabular stats, headliner leaderboard (The Band CAMINO & 5SOS), 4-axis averages, and interactive Leaflet.js US tour map.
- `#/sitemap` — **Full Sitemap Directory**: Hierarchical index organized by Tour Run, Artist, City, and Platform Hubs.
- `#/about` — **About Jodie**: Artist statement, pit photography philosophy, full gear list (Sony A7IV, G-Master primes, Earasers), and direct social channels.

---

## ⚙️ Core Technical Features

1. **Zero-Dependency Modern Architecture**: Standalone HTML5, Tailwind CSS, Leaflet.js, and Lucide Icons. Runs instantly by opening `index.html` in any browser with no build step required.
2. **Local Storage Synchronization**:
   - Reviews and edits persist in browser `localStorage`.
   - Add new shows via the **"Log a Show"** builder.
   - Edit ratings and narratives on any show with instant UI recalculation.
   - Built-in reset button to restore default archive anytime.
3. **Keyboard Shortcuts**:
   - `/` — Focus search input from anywhere.
   - `ESC` — Close lightbox or open modals.
   - `←` / `→` — Navigate through photos in the lightbox.

---

## 📱 Responsive & Journey Testing

- **Desktop (1440x900)**: Full widescreen grid layouts, interactive radar SVG charts, side-by-side setlists and editorial essays, interactive US map.
- **Mobile (390x844)**: Responsive single-column reflow, mobile touch-friendly navigation drawer, optimized card spacing, full-screen lightbox swipe support.
