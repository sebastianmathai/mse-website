async function initProductDetails() {
  const mount = document.querySelector('[data-product-details]');
  if (!mount) return;

  const params = new URLSearchParams(window.location.search);
  const id = params.get('id') || 'heavy-duty-turner-spatula';
  const products = await loadProducts();
  const product = products.find((item) => item.id === id) || products[0];

  document.title = `${product.name} | Morning Star Enterprises`;
  const description = document.querySelector('meta[name="description"]');
  if (description) description.setAttribute('content', product.description);

  const thumbs = [product.image, 'images/manufacturing-floor.png', 'images/showroom-gallery.png'];
  mount.innerHTML = `
    <div class="detail-grid">
      <section class="detail-gallery" aria-label="${product.name} image gallery">
        <img class="detail-main-image" data-main-product-image src="${product.image}" alt="${product.name}" loading="eager">
        <div class="thumb-row">
          ${thumbs.map((src, index) => `<button class="thumb ${index === 0 ? 'active' : ''}" type="button" data-thumb="${src}" aria-label="View image ${index + 1}"><img src="${src}" alt="${product.name} thumbnail ${index + 1}" loading="lazy"></button>`).join('')}
        </div>
      </section>
      <section class="detail-content">
        <p class="eyebrow">${product.category}</p>
        <h1>${product.name}</h1>
        <p class="lead">${product.description}</p>
        <div class="detail-actions">
          <a class="btn" href="contact.html?product=${encodeURIComponent(product.name)}">Send Enquiry</a>
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
            <tr><th>Material</th><td>${product.material}</td></tr>
            <tr><th>Grade</th><td>${product.grade}</td></tr>
            <tr><th>Thickness</th><td>${product.thickness}</td></tr>
            <tr><th>Dimensions</th><td>${product.dimensions}</td></tr>
            <tr><th>Finish</th><td>${product.finish}</td></tr>
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

  document.querySelectorAll('[data-thumb]').forEach((button) => {
    button.addEventListener('click', () => {
      document.querySelectorAll('[data-thumb]').forEach((item) => item.classList.remove('active'));
      button.classList.add('active');
      document.querySelector('[data-main-product-image]').src = button.dataset.thumb;
    });
  });
}

document.addEventListener('DOMContentLoaded', initProductDetails);
