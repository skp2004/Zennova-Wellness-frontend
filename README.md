# Zennova Wellness — website

Plain HTML/CSS/JS. No build step, no backend, no framework. Open `index.html` in a browser and it works.

## Connect your Google Sheet (product list)

1. In Google Sheets, name the first row's columns exactly:
   `name | price | weight | badge | description | image`
2. File → Share → set to "Anyone with the link can view."
3. Copy the Sheet ID from the URL between `/d/` and `/edit`.
4. Open `script.js`, and near the top set:
   ```js
   const SHEET_ID = "your-sheet-id-here";
   const SHEET_NAME = "Sheet1"; // your tab name
   ```
5. Save — the product grid on the homepage will now pull live from your sheet.

Until you connect a sheet, the site shows placeholder products so it never looks broken.

## Deploy (free, ~2 minutes)

- **Netlify**: drag this folder onto app.netlify.com/drop
- **Vercel**: `vercel` in this folder (no config needed, it's static)
- **GitHub Pages**: push this folder to a repo, enable Pages on the `main` branch

## Files

- `index.html` — all page content and sections
- `styles.css` — design tokens (colors, type, spacing) — edit the `:root` block to reskin
- `script.js` — Google Sheet fetch + FAQ accordion
- `logo.svg` — wordmark + grain mark, editable text/colors directly in the file

## Swapping in real photos

Replace the `image` column values in your sheet with real product photo URLs (JPG/WebP). Until then, cards show a simple grain-icon placeholder so the grid never looks empty.
