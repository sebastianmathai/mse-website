async function initProductDetails() {
  const mount = document.querySelector('[data-product-details]');
  if (!mount) return;

  const params = new URLSearchParams(window.location.search);
  const id = params.get('id') || 'heavy-duty-turner-spatula';
  const requestedSize = params.get('size');
  const products = await loadProducts();
  const product = products.find((item) => item.id === id) || products[0];
  const initialVariant = getSelectedVariant(product, requestedSize);

  const siteOrigin = 'https://msekerala.in';
  const absoluteSiteUrl = (path) => new URL(path, `${siteOrigin}/`).href;

  function setOpenGraphProperty(property, value) {
    const meta = document.querySelector(`meta[property="${property}"]`);
    if (meta && value) meta.setAttribute('content', value);
  }

  function updateProductSchema(productData, variantData, pageUrl, imageUrl) {
    const schema = document.querySelector('[data-product-schema]');
    if (!schema) return;

    const properties = [
      ['Grade', productValue(productData, variantData, 'grade')],
      ['Thickness', productValue(productData, variantData, 'thickness')],
      ['Dimensions', productValue(productData, variantData, 'dimensions')],
      ['Finish', productValue(productData, variantData, 'finish')],
      ['HSN/SAC Code', productValue(productData, variantData, 'hsn')],
      ['Unit', productValue(productData, variantData, 'unit')]
    ].filter(([, value]) => value);

    const structuredData = {
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: productValue(productData, variantData, 'name'),
      description: productValue(productData, variantData, 'description'),
      image: imageUrl,
      url: pageUrl,
      category: productData.category,
      material: productValue(productData, variantData, 'material'),
      brand: {
        '@type': 'Brand',
        name: 'Morning Star Enterprises'
      },
      ...(productValue(productData, variantData, 'sku')
        ? { sku: productValue(productData, variantData, 'sku') }
        : {}),
      additionalProperty: properties.map(([name, value]) => ({
        '@type': 'PropertyValue',
        name,
        value
      }))
    };

    schema.textContent = JSON.stringify(structuredData);
  }

  function renderDetails(selectedSize) {
    const variant = getSelectedVariant(product, selectedSize);
    const image = productValue(product, variant, 'image');
    const name = productValue(product, variant, 'name');
    const descriptionText = productValue(product, variant, 'description');
    const sku = productValue(product, variant, 'sku');
    const availability = productValue(product, variant, 'availability');
    const hsn = productValue(product, variant, 'hsn');
    const unit = productValue(product, variant, 'unit');
    const enquiryHref = getEnquiryHref(product, variant);
    const pageUrl = new URL('/product.html', siteOrigin);
    pageUrl.searchParams.set('id', product.id);
    pageUrl.searchParams.set('size', variant.size);
    const canonicalUrl = pageUrl.href;
    const imageUrl = absoluteSiteUrl(image);

    document.title = `${name} | Morning Star Enterprises`;
    const description = document.querySelector('meta[name="description"]');
    if (description) description.setAttribute('content', descriptionText);
    setOpenGraphProperty('og:title', `${name} | Morning Star Enterprises`);
    setOpenGraphProperty('og:description', descriptionText);
    setOpenGraphProperty('og:image', imageUrl);
    setOpenGraphProperty('og:url', canonicalUrl);
    const canonical = document.querySelector('link[rel="canonical"]');
    if (canonical) canonical.setAttribute('href', canonicalUrl);
    updateProductSchema(product, variant, canonicalUrl, imageUrl);

    const thumbs = [image, 'images/manufacturing-floor.png', 'images/showroom-gallery.png'];
    mount.innerHTML = `
      <div class="detail-grid">
        <section class="detail-gallery" aria-label="${name} image gallery">
          <img class="detail-main-image" data-main-product-image src="${image}" alt="${name}" loading="eager">
          <div class="thumb-row">
            ${thumbs.map((src, index) => `<button class="thumb ${index === 0 ? 'active' : ''}" type="button" data-thumb="${src}" aria-label="View image ${index + 1}"><img src="${src}" alt="${name} thumbnail ${index + 1}" loading="lazy"></button>`).join('')}
          </div>
        </section>
        <section class="detail-content">
          <p class="eyebrow">${product.category}</p>
          <h1>${name}</h1>
          <p class="lead">${descriptionText}</p>
          ${createVariantButtons(product, variant.size, 'detail')}
          <div class="detail-meta">
            ${sku ? `<div><span>SKU</span><strong>${sku}</strong></div>` : ''}
            ${availability ? `<div><span>Availability</span><strong>${availability}</strong></div>` : ''}
          </div>
          <div class="detail-actions">
            <a class="btn" href="${enquiryHref}">Send Enquiry</a>
            <a class="btn btn-secondary" href="products.html">Back to Products</a>
          </div>
        </section>
      </div>
      <section class="section compact">
        <div class="section-heading">
          <p class="eyebrow">Technical Data</p>
          <h2>Specifications</h2>
        </div>
        <div class="table-wrap">
          <table class="spec-table">
            <tbody>
              ${sku ? `<tr><th>SKU</th><td>${sku}</td></tr>` : ''}
              ${availability ? `<tr><th>Availability</th><td>${availability}</td></tr>` : ''}
              ${hsn ? `<tr><th>HSN/SAC Code</th><td>${hsn}</td></tr>` : ''}
              ${unit ? `<tr><th>Unit</th><td>${unit}</td></tr>` : ''}
              <tr><th>Material</th><td>${productValue(product, variant, 'material')}</td></tr>
              <tr><th>Grade</th><td>${productValue(product, variant, 'grade')}</td></tr>
              <tr><th>Thickness</th><td>${productValue(product, variant, 'thickness')}</td></tr>
              <tr><th>Dimensions</th><td>${productValue(product, variant, 'dimensions')}</td></tr>
              <tr><th>Finish</th><td>${productValue(product, variant, 'finish')}</td></tr>
              <tr><th>Applications</th><td>${product.applications.join(', ')}</td></tr>
              <tr><th>Advantages</th><td>${product.advantages.join(', ')}</td></tr>
            </tbody>
          </table>
        </div>
      </section>
      <section class="section compact two-column">
        <div>
          <p class="eyebrow">Features</p>
          <h2>Built for Commercial Use</h2>
        </div>
        <ul class="check-list">${product.features.map((feature) => `<li>${feature}</li>`).join('')}</ul>
      </section>`;

    mount.querySelectorAll('[data-thumb]').forEach((button) => {
      button.addEventListener('click', () => {
        mount.querySelectorAll('[data-thumb]').forEach((item) => item.classList.remove('active'));
        button.classList.add('active');
        mount.querySelector('[data-main-product-image]').src = button.dataset.thumb;
      });
    });

    mount.querySelectorAll('[data-variant-context="detail"]').forEach((button) => {
      button.addEventListener('click', () => {
        const nextSize = button.dataset.variantSize;
        const url = new URL(window.location.href);
        url.searchParams.set('id', product.id);
        url.searchParams.set('size', nextSize);
        window.history.replaceState({}, '', url);
        renderDetails(nextSize);
      });
    });
  }

  renderDetails(initialVariant.size);
}

document.addEventListener('DOMContentLoaded', initProductDetails);
