# Morning Star Enterprises Website

A static, responsive company website for Morning Star Enterprises, a manufacturer and supplier of commercial stainless steel kitchen equipment.

## Project Structure

```text
/
├── index.html
├── products.html
├── product.html
├── gallery.html
├── about.html
├── contact.html
├── css/
│   ├── style.css
│   ├── products.css
│   └── responsive.css
├── js/
│   ├── main.js
│   ├── products.js
│   └── product-details.js
├── data/
│   └── products.json
├── images/
└── README.md
```

## How to Add Products

Edit `data/products.json` and add a new product object with the same fields used by the existing products:

- `id`: unique URL-safe identifier
- `name`: product name
- `category`: `Spatula`, `Laddle`, or `Spoon`
- `badge`: short label such as `New` or `Popular`
- `image`: relative image path
- `description`, `material`, `grade`, `thickness`, `dimensions`, `finish`
- `features`, `applications`, and `advantages` arrays

Product cards and product details are loaded dynamically with `fetch()` from `data/products.json`.

## Deploy to GitHub Pages

1. Push the project to a GitHub repository.
2. Open the repository on GitHub.
3. Go to `Settings` → `Pages`.
4. Select the branch, usually `main`.
5. Select `/root` as the publishing source.
6. Save and wait for GitHub Pages to publish the site.

All links are relative, so the site works from a GitHub Pages project URL.

## Customize Company Information

Update company address, phone, WhatsApp number, and email in:

- `index.html`
- `products.html`
- `product.html`
- `gallery.html`
- `about.html`
- `contact.html`

Update the WhatsApp floating link by changing the `https://wa.me/...` URL in each page.

## Replace Images

Put new images inside the `images/` folder and update references in:

- HTML pages for hero, gallery, and section images
- `data/products.json` for product images
- CSS only if changing the hero or page background image filenames

Use optimized `.jpg`, `.png`, or `.webp` files and keep descriptive alt text for SEO and accessibility.

## Local Preview

You can open `index.html` directly in a browser. For the most accurate product-data behavior, especially while editing `data/products.json`, preview through a local static server or deploy to GitHub Pages.
