const productFallback = [];

async function loadProducts() {
  try {
    const response = await fetch('data/products.json', { cache: 'no-store' });
    if (!response.ok) throw new Error('Unable to load product data');
    return await response.json();
  } catch (error) {
    return productFallback;
  }
}

function getProductVariants(product) {
  if (Array.isArray(product.variants) && product.variants.length) {
    return [...product.variants].sort((first, second) => {
      const firstSize = Number(first.size);
      const secondSize = Number(second.size);
      if (Number.isFinite(firstSize) && Number.isFinite(secondSize)) {
        return firstSize - secondSize;
      }
      return 0;
    });
  }

  return [{
    size: product.size || 'Standard',
    sku: product.sku,
    image: product.image,
    name: product.name,
    description: product.description,
    material: product.material,
    grade: product.grade,
    thickness: product.thickness,
    dimensions: product.dimensions,
    finish: product.finish,
    availability: product.availability
  }];
}

function getSelectedVariant(product, selectedSize) {
  const variants = getProductVariants(product);
  return variants.find((variant) => variant.size === selectedSize) || variants[0];
}

function productValue(product, variant, field) {
  return variant[field] || product[field] || '';
}

function getEnquiryProductName(product, variant) {
  const name = productValue(product, variant, 'name');
  return variant.size ? `${name} - ${variant.size}` : name;
}

function getEnquiryHref(product, variant) {
  return `contact.html?product=${encodeURIComponent(getEnquiryProductName(product, variant))}`;
}

function createVariantButtons(product, selectedSize, context) {
  const variants = getProductVariants(product);
  if (variants.length <= 1) return '';

  return `
    <div class="size-selector" aria-label="Choose size">
      <span class="size-label">Size</span>
      <div class="size-options">
        ${variants.map((variant) => `
          <button
            class="size-chip ${variant.size === selectedSize ? 'active' : ''}"
            type="button"
            data-variant-size="${variant.size}"
            data-product-id="${product.id}"
            data-variant-context="${context}"
            aria-pressed="${variant.size === selectedSize ? 'true' : 'false'}">
            ${variant.size}
          </button>
        `).join('')}
      </div>
    </div>`;
}

function createProductCard(product) {
  const variant = getSelectedVariant(product);
  const image = productValue(product, variant, 'image');
  const name = productValue(product, variant, 'name');
  const description = productValue(product, variant, 'description');
  const dimensions = productValue(product, variant, 'dimensions');
  const unit = productValue(product, variant, 'unit');
  const sku = productValue(product, variant, 'sku');
  const availability = productValue(product, variant, 'availability');
  const detailHref = `product.html?id=${encodeURIComponent(product.id)}&size=${encodeURIComponent(variant.size)}`;

  return `
    <article class="product-card reveal" data-category="${product.category}" data-product-card="${product.id}">
      <div class="product-media">
        <img data-card-image src="${image}" alt="${name}" loading="lazy">
        <span class="badge">${product.badge}</span>
      </div>
      <div class="product-body">
        <p class="eyebrow">${product.category}</p>
        <h3 data-card-name>${name}</h3>
        <p data-card-description>${description}</p>
        ${createVariantButtons(product, variant.size, 'card')}
        <div class="product-meta">
          ${sku ? `<span data-card-sku>SKU: ${sku}</span>` : ''}
          ${availability ? `<span data-card-availability>${availability}</span>` : ''}
        </div>
        <dl class="mini-specs">
          <div><dt>Material</dt><dd>${product.material}</dd></div>
          <div><dt>Dimensions</dt><dd data-card-dimensions>${dimensions}</dd></div>
          <div><dt>Unit</dt><dd data-card-unit>${unit || 'Contact us'}</dd></div>
        </dl>
        <a class="btn btn-small" data-card-details-link href="${detailHref}">View Details</a>
      </div>
    </article>`;
}

function updateProductCardVariant(card, product, selectedSize) {
  const variant = getSelectedVariant(product, selectedSize);
  const image = productValue(product, variant, 'image');
  const name = productValue(product, variant, 'name');

  card.querySelector('[data-card-image]').src = image;
  card.querySelector('[data-card-image]').alt = name;
  card.querySelector('[data-card-name]').textContent = name;
  card.querySelector('[data-card-description]').textContent = productValue(product, variant, 'description');
  card.querySelector('[data-card-dimensions]').textContent = productValue(product, variant, 'dimensions');
  card.querySelector('[data-card-unit]').textContent = productValue(product, variant, 'unit') || 'Contact us';
  card.querySelector('[data-card-details-link]').href = `product.html?id=${encodeURIComponent(product.id)}&size=${encodeURIComponent(variant.size)}`;

  const meta = card.querySelector('.product-meta');
  meta.innerHTML = `
    ${productValue(product, variant, 'sku') ? `<span data-card-sku>SKU: ${productValue(product, variant, 'sku')}</span>` : ''}
    ${productValue(product, variant, 'availability') ? `<span data-card-availability>${productValue(product, variant, 'availability')}</span>` : ''}
  `;

  card.querySelectorAll('[data-variant-size]').forEach((button) => {
    const isActive = button.dataset.variantSize === variant.size;
    button.classList.toggle('active', isActive);
    button.setAttribute('aria-pressed', String(isActive));
  });
}

function initProductCardVariantSelectors(container, products) {
  container.addEventListener('click', (event) => {
    const button = event.target.closest('[data-variant-context="card"]');
    if (!button) return;

    const product = products.find((item) => item.id === button.dataset.productId);
    const card = button.closest('[data-product-card]');
    if (!product || !card) return;

    updateProductCardVariant(card, product, button.dataset.variantSize);
  });
}

function renderProducts(products, container) {
  container.innerHTML = products.length
    ? products.map(createProductCard).join('')
    : '<p class="empty-state">No products match your search. Try another name or category.</p>';
  window.initReveal?.();
}

async function initProductsPage() {
  const grid = document.querySelector('[data-products-grid]');
  if (!grid) return;

  const products = await loadProducts();
  const search = document.querySelector('[data-product-search]');
  const filters = document.querySelectorAll('[data-category-filter]');
  initProductCardVariantSelectors(grid, products);

  let activeCategory = 'All';
  const applyFilters = () => {
    const query = search.value.trim().toLowerCase();
    const filtered = products.filter((product) => {
      const categoryMatch = activeCategory === 'All' || product.category === activeCategory;
      const searchMatch = product.name.toLowerCase().includes(query);
      return categoryMatch && searchMatch;
    });
    renderProducts(filtered, grid);
  };

  filters.forEach((button) => {
    button.addEventListener('click', () => {
      filters.forEach((item) => item.classList.remove('active'));
      button.classList.add('active');
      activeCategory = button.dataset.categoryFilter;
      applyFilters();
    });
  });

  search.addEventListener('input', applyFilters);
  renderProducts(products, grid);
}

async function initFeaturedProducts() {
  const grid = document.querySelector('[data-featured-products]');
  if (!grid) return;
  const products = await loadProducts();
  initProductCardVariantSelectors(grid, products);
  const popularProducts = products.filter((product) => product.badge === 'Popular');
  renderProducts((popularProducts.length ? popularProducts : products).slice(0, 3), grid);
}

document.addEventListener('DOMContentLoaded', initProductsPage);
document.addEventListener('DOMContentLoaded', initFeaturedProducts);
