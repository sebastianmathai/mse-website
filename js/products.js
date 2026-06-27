const productFallback = [
  {"id":"heavy-duty-turner-spatula","name":"Heavy Duty Turner Spatula","category":"Spatula","badge":"Popular","image":"images/product-spatula.png","description":"A robust flat turner spatula built for hotels, restaurants, and high-volume commercial kitchens.","material":"Stainless Steel","grade":"SS 304 Food Grade","thickness":"1.5 mm blade","dimensions":"380 mm L x 80 mm W","finish":"Brushed mirror polish","features":["Wide reinforced blade","Heat-resistant all-steel handle","Smooth rounded edges","Hanging loop"],"applications":["Griddles","Bakeries","Catering kitchens","Hotel kitchens"],"advantages":["Corrosion resistant","Easy to sanitize","Long service life","Balanced grip"]},
  {"id":"perforated-frying-spatula","name":"Perforated Frying Spatula","category":"Spatula","badge":"New","image":"images/product-spatula.png","description":"A perforated stainless steel spatula designed for draining oil while lifting fried and grilled items.","material":"Stainless Steel","grade":"SS 304 Food Grade","thickness":"1.2 mm blade","dimensions":"360 mm L x 75 mm W","finish":"Satin brushed","features":["Perforated blade","Seamless handle joint","Commercial gauge steel","Dishwasher safe"],"applications":["Frying stations","QSR kitchens","Canteens","Food courts"],"advantages":["Fast oil drainage","Hygienic construction","Low maintenance","Reliable daily use"]},
  {"id":"deep-bowl-service-ladle","name":"Deep Bowl Service Ladle","category":"Laddle","badge":"Popular","image":"images/product-ladle.png","description":"A long-handle deep bowl ladle made for controlled serving in busy food service operations.","material":"Stainless Steel","grade":"SS 304 Food Grade","thickness":"1.0 mm bowl","dimensions":"410 mm L x 95 mm bowl","finish":"High gloss polish","features":["Deep formed bowl","Long tubular handle","Reinforced neck","Hanging loop"],"applications":["Soup counters","Buffets","Industrial kitchens","Catering service"],"advantages":["Accurate serving","Rust resistant","Comfortable reach","Easy cleaning"]},
  {"id":"portion-control-ladle","name":"Portion Control Ladle","category":"Laddle","badge":"New","image":"images/product-ladle.png","description":"A commercial ladle engineered for consistent portions and dependable daily use.","material":"Stainless Steel","grade":"SS 304 Food Grade","thickness":"1.0 mm bowl","dimensions":"350 mm L x 75 mm bowl","finish":"Mirror polished bowl, brushed handle","features":["Measured bowl profile","Rounded lip","One-piece handle","Food-safe finish"],"applications":["Catering lines","Cloud kitchens","Canteens","Restaurant prep"],"advantages":["Consistent portions","Professional finish","Durable welds","Simple storage"]},
  {"id":"oval-serving-spoon","name":"Oval Serving Spoon","category":"Spoon","badge":"Popular","image":"images/product-spoon.png","description":"A polished oval serving spoon suitable for preparation, plating, and buffet service.","material":"Stainless Steel","grade":"SS 304 Food Grade","thickness":"1.2 mm bowl","dimensions":"340 mm L x 65 mm W","finish":"Brushed satin","features":["Deep oval bowl","Smooth rim","Strong tubular handle","Hanging hole"],"applications":["Buffets","Restaurants","Hotels","Food preparation"],"advantages":["Food-safe surface","Excellent durability","Easy to handle","Elegant appearance"]},
  {"id":"solid-kitchen-spoon","name":"Solid Kitchen Spoon","category":"Spoon","badge":"New","image":"images/product-spoon.png","description":"A solid stainless steel kitchen spoon made for stirring, mixing, and serving at scale.","material":"Stainless Steel","grade":"SS 304 Food Grade","thickness":"1.1 mm bowl","dimensions":"380 mm L x 70 mm W","finish":"Bright polished","features":["Solid bowl","Balanced handle","Rounded safe edges","Commercial construction"],"applications":["Bulk cooking","Institutional kitchens","Hotels","Catering"],"advantages":["Withstands heavy use","Hygienic","Non-reactive","Quick to clean"]}
];

async function loadProducts() {
  try {
    const response = await fetch('data/products.json', { cache: 'no-store' });
    if (!response.ok) throw new Error('Unable to load product data');
    return await response.json();
  } catch (error) {
    return productFallback;
  }
}

function createProductCard(product) {
  return `
    <article class="product-card reveal" data-category="${product.category}">
      <div class="product-media">
        <img src="${product.image}" alt="${product.name}" loading="lazy">
        <span class="badge">${product.badge}</span>
      </div>
      <div class="product-body">
        <p class="eyebrow">${product.category}</p>
        <h3>${product.name}</h3>
        <p>${product.description}</p>
        <dl class="mini-specs">
          <div><dt>Material</dt><dd>${product.material}</dd></div>
          <div><dt>Dimensions</dt><dd>${product.dimensions}</dd></div>
          <div><dt>Finish</dt><dd>${product.finish}</dd></div>
        </dl>
        <a class="btn btn-small" href="product.html?id=${encodeURIComponent(product.id)}">View Details</a>
      </div>
    </article>`;
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
  renderProducts(products.filter((product) => product.badge === 'Popular').slice(0, 3), grid);
}

document.addEventListener('DOMContentLoaded', initProductsPage);
document.addEventListener('DOMContentLoaded', initFeaturedProducts);
