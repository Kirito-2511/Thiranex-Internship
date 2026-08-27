/* ============================================================
   app.js — Main Application Logic
   Task-5 Capstone | Thiranex Internship
   ============================================================ */

const App = (() => {
  'use strict';

  /* ── state ── */
  let currentCategory = 'All';
  let currentSort = 'newest';
  let currentSearch = '';
  let currentView = 'grid';
  let priceRange = { min: 0, max: 999 };
  let debounceTimer = null;

  /* ════════════════════════════════════
     INITIALIZATION
     ════════════════════════════════════ */
  function init() {
    initTheme();
    initMobileMenu();
    updateCartBadge();
    detectPage();

    /* global listeners */
    document.addEventListener('cart:updated', () => {
      updateCartBadge();
    });
    document.addEventListener('wishlist:updated', (e) => {
      const action = e.detail.action;
      if (action === 'added') showToast('Added to wishlist ❤️', 'success');
      else showToast('Removed from wishlist', 'info');
    });
  }

  function detectPage() {
    const path = window.location.pathname;
    if (path.includes('product.html'))     initProductPage();
    else if (path.includes('cart.html'))    initCartPage();
    else                                    initCataloguePage();
  }

  /* ════════════════════════════════════
     THEME
     ════════════════════════════════════ */
  function initTheme() {
    const saved = localStorage.getItem('thiranex_theme') || 'light';
    document.documentElement.setAttribute('data-theme', saved);
    const btn = document.getElementById('themeToggle');
    if (btn) {
      updateThemeIcon(btn, saved);
      btn.addEventListener('click', () => {
        const current = document.documentElement.getAttribute('data-theme');
        const next = current === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', next);
        localStorage.setItem('thiranex_theme', next);
        updateThemeIcon(btn, next);
      });
    }
  }

  function updateThemeIcon(btn, theme) {
    btn.innerHTML = theme === 'dark' ? '☀️' : '🌙';
    btn.setAttribute('aria-label', theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
  }

  /* ════════════════════════════════════
     MOBILE MENU
     ════════════════════════════════════ */
  function initMobileMenu() {
    const toggle = document.getElementById('menuToggle');
    const nav = document.getElementById('mainNav');
    if (!toggle || !nav) return;

    toggle.addEventListener('click', () => {
      const expanded = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', !expanded);
      nav.classList.toggle('nav--open');
      toggle.innerHTML = expanded ? '☰' : '✕';
    });

    /* close on link click */
    nav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        nav.classList.remove('nav--open');
        toggle.setAttribute('aria-expanded', 'false');
        toggle.innerHTML = '☰';
      });
    });
  }

  /* ════════════════════════════════════
     CART BADGE
     ════════════════════════════════════ */
  function updateCartBadge() {
    const badges = document.querySelectorAll('.cart-badge');
    const count = CartManager.getCartCount();
    badges.forEach(b => {
      b.textContent = count;
      b.classList.toggle('cart-badge--visible', count > 0);
      if (count > 0) {
        b.classList.remove('cart-badge--pop');
        void b.offsetWidth; /* force reflow */
        b.classList.add('cart-badge--pop');
      }
    });
  }

  /* ════════════════════════════════════
     TOAST NOTIFICATIONS
     ════════════════════════════════════ */
  function showToast(message, type = 'success') {
    let container = document.getElementById('toastContainer');
    if (!container) {
      container = document.createElement('div');
      container.id = 'toastContainer';
      container.className = 'toast-container';
      container.setAttribute('aria-live', 'polite');
      document.body.appendChild(container);
    }
    const icons = { success: '✅', error: '❌', info: 'ℹ️', warning: '⚠️' };
    const toast = document.createElement('div');
    toast.className = `toast toast--${type}`;
    toast.setAttribute('role', 'alert');
    toast.innerHTML = `<span class="toast__icon">${icons[type] || ''}</span><span class="toast__msg">${message}</span>`;
    container.appendChild(toast);
    requestAnimationFrame(() => toast.classList.add('toast--visible'));
    setTimeout(() => {
      toast.classList.remove('toast--visible');
      toast.addEventListener('transitionend', () => toast.remove());
    }, 3000);
  }

  /* ════════════════════════════════════
     STARS RENDERER
     ════════════════════════════════════ */
  function renderStars(rating) {
    let stars = '';
    for (let i = 1; i <= 5; i++) {
      if (i <= Math.floor(rating)) stars += '<span class="star star--full" aria-hidden="true">★</span>';
      else if (i - rating < 1) stars += '<span class="star star--half" aria-hidden="true">★</span>';
      else stars += '<span class="star star--empty" aria-hidden="true">☆</span>';
    }
    return `<span class="stars" role="img" aria-label="${rating} out of 5 stars">${stars}</span>`;
  }

  /* ════════════════════════════════════
     CATALOGUE PAGE
     ════════════════════════════════════ */
  function initCataloguePage() {
    const grid = document.getElementById('productGrid');
    if (!grid) return;

    priceRange.min = Math.floor(ProductManager.getMinPrice());
    priceRange.max = Math.ceil(ProductManager.getMaxPrice());

    renderCategoryFilters();
    initSortSelect();
    initSearchBar();
    initViewToggle();
    initPriceFilter();
    initMobileSidebar();
    renderProducts();
  }

  /* ── categories sidebar ── */
  function renderCategoryFilters() {
    const list = document.getElementById('categoryList');
    if (!list) return;

    const allBtn = createCategoryBtn('All', '🛍️', true);
    list.appendChild(allBtn);

    ProductManager.categories.forEach(cat => {
      const emoji = ProductManager.categoryEmojis[cat] || '📦';
      list.appendChild(createCategoryBtn(cat, emoji, false));
    });
  }

  function createCategoryBtn(name, emoji, active) {
    const li = document.createElement('li');
    const btn = document.createElement('button');
    btn.className = 'sidebar__cat-btn' + (active ? ' sidebar__cat-btn--active' : '');
    btn.setAttribute('aria-pressed', active);
    btn.innerHTML = `<span class="sidebar__cat-emoji">${emoji}</span> ${name}`;
    btn.addEventListener('click', () => {
      document.querySelectorAll('.sidebar__cat-btn').forEach(b => {
        b.classList.remove('sidebar__cat-btn--active');
        b.setAttribute('aria-pressed', 'false');
      });
      btn.classList.add('sidebar__cat-btn--active');
      btn.setAttribute('aria-pressed', 'true');
      currentCategory = name;
      renderProducts();
    });
    li.appendChild(btn);
    return li;
  }

  /* ── sort ── */
  function initSortSelect() {
    const sel = document.getElementById('sortSelect');
    if (!sel) return;
    sel.addEventListener('change', (e) => {
      currentSort = e.target.value;
      renderProducts();
    });
  }

  /* ── search (debounced) ── */
  function initSearchBar() {
    const input = document.getElementById('searchInput');
    if (!input) return;
    input.addEventListener('input', (e) => {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        currentSearch = e.target.value;
        renderProducts();
      }, 300);
    });
  }

  /* ── view toggle ── */
  function initViewToggle() {
    const btns = document.querySelectorAll('.view-toggle__btn');
    btns.forEach(btn => {
      btn.addEventListener('click', () => {
        btns.forEach(b => { b.classList.remove('view-toggle__btn--active'); b.setAttribute('aria-pressed', 'false'); });
        btn.classList.add('view-toggle__btn--active');
        btn.setAttribute('aria-pressed', 'true');
        currentView = btn.dataset.view;
        const grid = document.getElementById('productGrid');
        grid.className = currentView === 'list' ? 'product-grid product-grid--list' : 'product-grid';
        renderProducts();
      });
    });
  }

  /* ── price filter ── */
  function initPriceFilter() {
    const slider = document.getElementById('priceRange');
    const display = document.getElementById('priceDisplay');
    if (!slider || !display) return;

    slider.min = priceRange.min;
    slider.max = priceRange.max;
    slider.value = priceRange.max;
    display.textContent = `$${priceRange.min} – $${priceRange.max}`;

    slider.addEventListener('input', (e) => {
      priceRange.max = Number(e.target.value);
      display.textContent = `$${priceRange.min} – $${priceRange.max}`;
      renderProducts();
    });
  }

  /* ── mobile sidebar ── */
  function initMobileSidebar() {
    const openBtn = document.getElementById('filterToggle');
    const closeBtn = document.getElementById('sidebarClose');
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebarOverlay');
    if (!openBtn || !sidebar) return;

    const toggle = (open) => {
      sidebar.classList.toggle('sidebar--open', open);
      if (overlay) overlay.classList.toggle('sidebar-overlay--visible', open);
      document.body.style.overflow = open ? 'hidden' : '';
    };

    openBtn.addEventListener('click', () => toggle(true));
    if (closeBtn) closeBtn.addEventListener('click', () => toggle(false));
    if (overlay) overlay.addEventListener('click', () => toggle(false));
  }

  /* ── render products ── */
  function renderProducts() {
    const grid = document.getElementById('productGrid');
    const countEl = document.getElementById('productCount');
    if (!grid) return;

    /* skeleton */
    grid.innerHTML = Array.from({ length: 8 }, () =>
      '<div class="skeleton-card"><div class="skeleton-card__img"></div><div class="skeleton-card__line"></div><div class="skeleton-card__line skeleton-card__line--short"></div></div>'
    ).join('');

    setTimeout(() => {
      let list = currentSearch ? ProductManager.search(currentSearch) : ProductManager.getByCategory(currentCategory);
      if (currentCategory !== 'All' && currentSearch) {
        list = list.filter(p => p.category === currentCategory);
      }
      list = ProductManager.filterByPrice(list, priceRange.min, priceRange.max);
      list = ProductManager.sort(list, currentSort);

      if (countEl) countEl.textContent = `${list.length} product${list.length !== 1 ? 's' : ''} found`;

      if (list.length === 0) {
        grid.innerHTML = `
          <div class="empty-state">
            <span class="empty-state__icon">🔍</span>
            <h3 class="empty-state__title">No products found</h3>
            <p class="empty-state__text">Try adjusting your filters or search terms.</p>
          </div>`;
        return;
      }

      grid.innerHTML = list.map(p => renderProductCard(p)).join('');

      /* event delegation */
      grid.addEventListener('click', handleGridClick);
    }, 400);
  }

  function renderProductCard(p) {
    const discount = p.originalPrice ? Math.round((1 - p.price / p.originalPrice) * 100) : 0;
    const wishlisted = CartManager.isWishlisted(p.id);
    const inCart = CartManager.isInCart(p.id);

    return `
    <article class="product-card" data-id="${p.id}" aria-label="${p.name}">
      <div class="product-card__img-wrap">
        <img src="${p.image}" alt="${p.name}" class="product-card__img" loading="lazy" />
        ${p.badge ? `<span class="product-card__badge product-card__badge--${p.badge.toLowerCase().replace(' ', '')}">${p.badge}</span>` : ''}
        ${discount > 0 ? `<span class="product-card__discount">-${discount}%</span>` : ''}
        <button class="product-card__wish ${wishlisted ? 'product-card__wish--active' : ''}" data-action="wishlist" data-id="${p.id}" aria-label="${wishlisted ? 'Remove from' : 'Add to'} wishlist" title="Toggle Wishlist">
          ${wishlisted ? '❤️' : '🤍'}
        </button>
      </div>
      <div class="product-card__body">
        <span class="product-card__category">${ProductManager.categoryEmojis[p.category] || ''} ${p.category}</span>
        <h3 class="product-card__name"><a href="product.html?id=${p.id}" class="product-card__link">${p.name}</a></h3>
        <div class="product-card__rating">
          ${renderStars(p.rating)}
          <span class="product-card__review-count">(${p.reviewCount})</span>
        </div>
        <div class="product-card__price-row">
          <span class="product-card__price">$${p.price.toFixed(2)}</span>
          ${p.originalPrice ? `<span class="product-card__original-price">$${p.originalPrice.toFixed(2)}</span>` : ''}
        </div>
        <div class="product-card__stock ${p.stock < 10 ? 'product-card__stock--low' : ''}">
          ${p.stock < 10 ? `🔥 Only ${p.stock} left` : '✅ In Stock'}
        </div>
        <button class="product-card__cart-btn ${inCart ? 'product-card__cart-btn--added' : ''}" data-action="add-cart" data-id="${p.id}">
          ${inCart ? '✓ In Cart' : '🛒 Add to Cart'}
        </button>
      </div>
    </article>`;
  }

  /* ── grid click handler (event delegation) ── */
  function handleGridClick(e) {
    const btn = e.target.closest('[data-action]');
    if (!btn) return;

    const { action, id } = btn.dataset;
    if (action === 'add-cart') {
      if (CartManager.isInCart(id)) {
        showToast('Already in cart! Go to cart to update.', 'info');
        return;
      }
      CartManager.addToCart(Number(id));
      btn.classList.add('product-card__cart-btn--added');
      btn.innerHTML = '✓ In Cart';
      showToast('Added to cart! 🛒');
    } else if (action === 'wishlist') {
      const result = CartManager.toggleWishlist(Number(id));
      btn.classList.toggle('product-card__wish--active', result === 'added');
      btn.innerHTML = result === 'added' ? '❤️' : '🤍';
    }
  }

  /* ════════════════════════════════════
     PRODUCT DETAIL PAGE
     ════════════════════════════════════ */
  function initProductPage() {
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');
    const container = document.getElementById('productDetail');
    if (!container || !id) return;

    const product = ProductManager.getById(id);
    if (!product) {
      container.innerHTML = `
        <div class="empty-state">
          <span class="empty-state__icon">😕</span>
          <h2 class="empty-state__title">Product Not Found</h2>
          <p class="empty-state__text">The product you are looking for does not exist.</p>
          <a href="index.html" class="btn btn--primary">Back to Catalogue</a>
        </div>`;
      return;
    }

    document.title = `${product.name} | ShopNex`;

    const discount = product.originalPrice ? Math.round((1 - product.price / product.originalPrice) * 100) : 0;
    const wishlisted = CartManager.isWishlisted(product.id);
    const inCart = CartManager.isInCart(product.id);

    container.innerHTML = `
      <nav class="breadcrumb" aria-label="Breadcrumb">
        <ol class="breadcrumb__list">
          <li><a href="index.html">Home</a></li>
          <li><a href="index.html?cat=${encodeURIComponent(product.category)}">${product.category}</a></li>
          <li aria-current="page">${product.name}</li>
        </ol>
      </nav>

      <div class="product-detail">
        <div class="product-detail__gallery">
          <div class="product-detail__main-img-wrap">
            <img id="mainImage" src="${product.images[0]}" alt="${product.name}" class="product-detail__main-img" />
            ${product.badge ? `<span class="product-card__badge product-card__badge--${product.badge.toLowerCase().replace(' ', '')}">${product.badge}</span>` : ''}
          </div>
          <div class="product-detail__thumbs" role="list" aria-label="Product images">
            ${product.images.map((img, i) => `
              <button class="product-detail__thumb ${i === 0 ? 'product-detail__thumb--active' : ''}" data-img="${img}" role="listitem" aria-label="View image ${i + 1}">
                <img src="${img}" alt="${product.name} view ${i + 1}" loading="lazy" />
              </button>
            `).join('')}
          </div>
        </div>

        <div class="product-detail__info">
          <span class="product-card__category">${ProductManager.categoryEmojis[product.category] || ''} ${product.category}</span>
          <h1 class="product-detail__name">${product.name}</h1>
          <div class="product-detail__rating">
            ${renderStars(product.rating)}
            <span class="product-detail__review-link">${product.rating} (${product.reviewCount} reviews)</span>
          </div>
          <div class="product-detail__price-block">
            <span class="product-detail__price">$${product.price.toFixed(2)}</span>
            ${product.originalPrice ? `<span class="product-detail__original">$${product.originalPrice.toFixed(2)}</span>` : ''}
            ${discount > 0 ? `<span class="product-detail__save">Save ${discount}%</span>` : ''}
          </div>
          <p class="product-detail__desc">${product.description}</p>

          <div class="product-detail__stock ${product.stock < 10 ? 'product-detail__stock--low' : ''}">
            ${product.stock < 10 ? `🔥 Only ${product.stock} left in stock — order soon!` : `✅ In Stock (${product.stock} available)`}
          </div>

          <div class="product-detail__actions">
            <div class="product-detail__qty-wrap">
              <label for="qtyInput" class="sr-only">Quantity</label>
              <button class="qty-btn" id="qtyMinus" aria-label="Decrease quantity">−</button>
              <input type="number" id="qtyInput" class="qty-input" value="1" min="1" max="${product.stock}" aria-label="Quantity" />
              <button class="qty-btn" id="qtyPlus" aria-label="Increase quantity">+</button>
            </div>
            <button class="btn btn--primary btn--lg" id="addToCartBtn" data-id="${product.id}">
              ${inCart ? '✓ In Cart — Add More' : '🛒 Add to Cart'}
            </button>
            <button class="btn btn--outline btn--wish" id="wishBtn" data-id="${product.id}" aria-label="Toggle wishlist">
              ${wishlisted ? '❤️ Wishlisted' : '🤍 Add to Wishlist'}
            </button>
          </div>

          <div class="product-detail__features">
            <div class="feature-pill">🚚 Free Shipping over $100</div>
            <div class="feature-pill">🔄 30-Day Returns</div>
            <div class="feature-pill">🛡️ 2-Year Warranty</div>
          </div>
        </div>
      </div>

      <!-- Specs -->
      <section class="product-specs" aria-label="Product specifications">
        <h2 class="section-title">📋 Specifications</h2>
        <div class="specs-grid">
          ${Object.entries(product.specs).map(([k, v]) => `
            <div class="spec-item">
              <span class="spec-item__label">${k}</span>
              <span class="spec-item__value">${v}</span>
            </div>
          `).join('')}
        </div>
      </section>

      <!-- Reviews -->
      <section class="product-reviews" aria-label="Customer reviews">
        <h2 class="section-title">💬 Customer Reviews</h2>
        <div class="reviews-list">
          ${product.reviews.map(r => `
            <article class="review-card">
              <div class="review-card__header">
                <span class="review-card__avatar">${r.user.charAt(0)}</span>
                <div>
                  <span class="review-card__user">${r.user}</span>
                  <span class="review-card__date">${new Date(r.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</span>
                </div>
              </div>
              <div class="review-card__rating">${renderStars(r.rating)}</div>
              <p class="review-card__text">${r.text}</p>
            </article>
          `).join('')}
        </div>
      </section>
    `;

    /* ── thumbnail clicks ── */
    container.querySelectorAll('.product-detail__thumb').forEach(btn => {
      btn.addEventListener('click', () => {
        container.querySelectorAll('.product-detail__thumb').forEach(b => b.classList.remove('product-detail__thumb--active'));
        btn.classList.add('product-detail__thumb--active');
        document.getElementById('mainImage').src = btn.dataset.img;
      });
    });

    /* ── qty controls ── */
    const qtyInput = document.getElementById('qtyInput');
    document.getElementById('qtyMinus').addEventListener('click', () => {
      qtyInput.value = Math.max(1, Number(qtyInput.value) - 1);
    });
    document.getElementById('qtyPlus').addEventListener('click', () => {
      qtyInput.value = Math.min(product.stock, Number(qtyInput.value) + 1);
    });

    /* ── add to cart ── */
    document.getElementById('addToCartBtn').addEventListener('click', () => {
      CartManager.addToCart(product.id, Number(qtyInput.value));
      showToast(`Added ${qtyInput.value} × ${product.name} to cart! 🛒`);
      document.getElementById('addToCartBtn').innerHTML = '✓ In Cart — Add More';
    });

    /* ── wishlist ── */
    document.getElementById('wishBtn').addEventListener('click', () => {
      const result = CartManager.toggleWishlist(product.id);
      document.getElementById('wishBtn').innerHTML = result === 'added' ? '❤️ Wishlisted' : '🤍 Add to Wishlist';
    });
  }

  /* ════════════════════════════════════
     CART PAGE
     ════════════════════════════════════ */
  function initCartPage() {
    renderCart();
    renderWishlistSection();
    document.addEventListener('cart:updated', () => { renderCart(); });
    document.addEventListener('wishlist:updated', () => { renderWishlistSection(); });
  }

  function renderCart() {
    const container = document.getElementById('cartItems');
    const summaryEl = document.getElementById('cartSummary');
    if (!container) return;

    const cart = CartManager.getCart();

    if (cart.length === 0) {
      container.innerHTML = `
        <div class="empty-state">
          <span class="empty-state__icon">🛒</span>
          <h2 class="empty-state__title">Your cart is empty</h2>
          <p class="empty-state__text">Looks like you haven't added anything to your cart yet.</p>
          <a href="index.html" class="btn btn--primary">Continue Shopping</a>
        </div>`;
      if (summaryEl) summaryEl.innerHTML = '';
      return;
    }

    container.innerHTML = `
      <div class="cart-header">
        <h2>Shopping Cart (${CartManager.getCartCount()} items)</h2>
        <button class="btn btn--text btn--danger" id="clearCartBtn">🗑️ Clear Cart</button>
      </div>
      <div class="cart-list" role="list" aria-label="Cart items">
        ${cart.map(item => `
          <div class="cart-item" role="listitem" data-id="${item.id}">
            <a href="product.html?id=${item.id}" class="cart-item__img-link">
              <img src="${item.image}" alt="${item.name}" class="cart-item__img" loading="lazy" />
            </a>
            <div class="cart-item__info">
              <a href="product.html?id=${item.id}" class="cart-item__name">${item.name}</a>
              <span class="cart-item__price">$${item.price.toFixed(2)}</span>
            </div>
            <div class="cart-item__qty-wrap">
              <button class="qty-btn" data-action="qty-minus" data-id="${item.id}" aria-label="Decrease quantity">−</button>
              <span class="cart-item__qty">${item.qty}</span>
              <button class="qty-btn" data-action="qty-plus" data-id="${item.id}" aria-label="Increase quantity">+</button>
            </div>
            <span class="cart-item__subtotal">$${(item.price * item.qty).toFixed(2)}</span>
            <button class="cart-item__remove" data-action="remove" data-id="${item.id}" aria-label="Remove ${item.name}">✕</button>
          </div>
        `).join('')}
      </div>`;

    /* summary */
    if (summaryEl) {
      const sub = CartManager.getSubtotal();
      const tax = CartManager.getTax();
      const ship = CartManager.getShipping();
      const total = CartManager.getTotal();
      summaryEl.innerHTML = `
        <div class="cart-summary glass-card">
          <h3 class="cart-summary__title">Order Summary</h3>
          <div class="cart-summary__row">
            <span>Subtotal</span><span>$${sub.toFixed(2)}</span>
          </div>
          <div class="cart-summary__row">
            <span>Tax (${(CartManager.TAX_RATE * 100).toFixed(0)}%)</span><span>$${tax.toFixed(2)}</span>
          </div>
          <div class="cart-summary__row">
            <span>Shipping</span>
            <span>${ship === 0 ? '<span class="text-success">FREE</span>' : '$' + ship.toFixed(2)}</span>
          </div>
          ${ship > 0 ? `<p class="cart-summary__note">🚚 Free shipping on orders over $${CartManager.FREE_SHIPPING_THRESHOLD}</p>` : ''}
          <hr class="cart-summary__divider" />
          <div class="cart-summary__row cart-summary__row--total">
            <span>Total</span><span>$${total.toFixed(2)}</span>
          </div>
          <button class="btn btn--primary btn--lg btn--block" id="checkoutBtn">
            Proceed to Checkout →
          </button>
          <a href="index.html" class="btn btn--outline btn--block" style="margin-top: .75rem;">← Continue Shopping</a>
        </div>`;
    }

    /* event delegation for cart actions */
    container.addEventListener('click', (e) => {
      const btn = e.target.closest('[data-action]');
      if (!btn) return;
      const { action, id } = btn.dataset;
      const numId = Number(id);

      if (action === 'remove') {
        CartManager.removeFromCart(numId);
        showToast('Item removed from cart', 'info');
      } else if (action === 'qty-minus') {
        const item = CartManager.getCart().find(i => i.id === numId);
        if (item) CartManager.updateQty(numId, item.qty - 1);
      } else if (action === 'qty-plus') {
        const item = CartManager.getCart().find(i => i.id === numId);
        if (item) CartManager.updateQty(numId, item.qty + 1);
      }
    });

    /* clear cart */
    const clearBtn = document.getElementById('clearCartBtn');
    if (clearBtn) {
      clearBtn.addEventListener('click', () => {
        if (confirm('Remove all items from your cart?')) {
          CartManager.clearCart();
          showToast('Cart cleared', 'info');
        }
      });
    }

    /* checkout */
    const checkoutBtn = document.getElementById('checkoutBtn');
    if (checkoutBtn) {
      checkoutBtn.addEventListener('click', () => {
        showToast('🎉 Checkout is a demo — thanks for browsing!', 'success');
      });
    }
  }

  function renderWishlistSection() {
    const container = document.getElementById('wishlistSection');
    if (!container) return;

    const items = CartManager.getWishlistProducts();
    if (items.length === 0) {
      container.innerHTML = `
        <h2 class="section-title" style="margin-top:2rem;">💝 Your Wishlist</h2>
        <div class="empty-state empty-state--sm">
          <span class="empty-state__icon">💝</span>
          <p class="empty-state__text">Your wishlist is empty. Browse products and tap 🤍 to add favourites!</p>
        </div>`;
      return;
    }

    container.innerHTML = `
      <h2 class="section-title" style="margin-top:2rem;">💝 Your Wishlist (${items.length})</h2>
      <div class="wishlist-grid">
        ${items.map(p => `
          <div class="wishlist-item" data-id="${p.id}">
            <a href="product.html?id=${p.id}">
              <img src="${p.image}" alt="${p.name}" class="wishlist-item__img" loading="lazy" />
            </a>
            <div class="wishlist-item__info">
              <a href="product.html?id=${p.id}" class="wishlist-item__name">${p.name}</a>
              <span class="wishlist-item__price">$${p.price.toFixed(2)}</span>
            </div>
            <div class="wishlist-item__actions">
              <button class="btn btn--sm btn--primary" data-action="wish-to-cart" data-id="${p.id}">🛒 Add to Cart</button>
              <button class="btn btn--sm btn--outline" data-action="wish-remove" data-id="${p.id}">✕</button>
            </div>
          </div>
        `).join('')}
      </div>`;

    container.addEventListener('click', (e) => {
      const btn = e.target.closest('[data-action]');
      if (!btn) return;
      const { action, id } = btn.dataset;
      if (action === 'wish-to-cart') {
        CartManager.addToCart(Number(id));
        showToast('Moved to cart! 🛒');
      } else if (action === 'wish-remove') {
        CartManager.toggleWishlist(Number(id));
      }
    });
  }

  /* ── public API ── */
  return { init, showToast, renderStars };
})();

/* ── bootstrap ── */
document.addEventListener('DOMContentLoaded', App.init);
