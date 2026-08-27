/* ============================================================
   cart.js — Cart & Wishlist Module
   Task-5 Capstone | Thiranex Internship
   ============================================================ */

const CartManager = (() => {
  'use strict';

  const CART_KEY = 'thiranex_cart';
  const WISH_KEY = 'thiranex_wishlist';
  const TAX_RATE = 0.08;
  const FREE_SHIPPING_THRESHOLD = 100;
  const SHIPPING_COST = 9.99;

  /* ── helpers ── */
  function _load(key) {
    try { return JSON.parse(localStorage.getItem(key)) || []; }
    catch { return []; }
  }
  function _save(key, data) { localStorage.setItem(key, JSON.stringify(data)); }
  function _dispatch(name, detail) { document.dispatchEvent(new CustomEvent(name, { detail })); }

  /* ════════════════════════════════════
     CART
     ════════════════════════════════════ */
  function getCart() { return _load(CART_KEY); }

  function addToCart(productId, qty = 1) {
    const cart = getCart();
    const product = ProductManager.getById(productId);
    if (!product) return false;

    const existing = cart.find(i => i.id === product.id);
    if (existing) {
      existing.qty = Math.min(existing.qty + qty, product.stock);
    } else {
      cart.push({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        qty: Math.min(qty, product.stock),
        stock: product.stock
      });
    }
    _save(CART_KEY, cart);
    _dispatch('cart:updated', { cart, action: 'add', productId: product.id });
    return true;
  }

  function removeFromCart(productId) {
    let cart = getCart().filter(i => i.id !== Number(productId));
    _save(CART_KEY, cart);
    _dispatch('cart:updated', { cart, action: 'remove', productId });
  }

  function updateQty(productId, qty) {
    const cart = getCart();
    const item = cart.find(i => i.id === Number(productId));
    if (!item) return;
    if (qty <= 0) { removeFromCart(productId); return; }
    item.qty = Math.min(qty, item.stock);
    _save(CART_KEY, cart);
    _dispatch('cart:updated', { cart, action: 'update', productId });
  }

  function clearCart() {
    _save(CART_KEY, []);
    _dispatch('cart:updated', { cart: [], action: 'clear' });
  }

  function getCartCount() {
    return getCart().reduce((sum, i) => sum + i.qty, 0);
  }

  function getSubtotal() {
    return getCart().reduce((sum, i) => sum + i.price * i.qty, 0);
  }

  function getTax() { return getSubtotal() * TAX_RATE; }

  function getShipping() {
    const cart = getCart();
    if (cart.length === 0) return 0;
    return getSubtotal() >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
  }

  function getTotal() { return getSubtotal() + getTax() + getShipping(); }

  function isInCart(productId) {
    return getCart().some(i => i.id === Number(productId));
  }

  /* ════════════════════════════════════
     WISHLIST
     ════════════════════════════════════ */
  function getWishlist() { return _load(WISH_KEY); }

  function toggleWishlist(productId) {
    let list = getWishlist();
    const id = Number(productId);
    const idx = list.indexOf(id);
    let action;
    if (idx > -1) { list.splice(idx, 1); action = 'removed'; }
    else { list.push(id); action = 'added'; }
    _save(WISH_KEY, list);
    _dispatch('wishlist:updated', { list, action, productId: id });
    return action;
  }

  function isWishlisted(productId) {
    return getWishlist().includes(Number(productId));
  }

  function getWishlistProducts() {
    return getWishlist().map(id => ProductManager.getById(id)).filter(Boolean);
  }

  return {
    getCart, addToCart, removeFromCart, updateQty, clearCart,
    getCartCount, getSubtotal, getTax, getShipping, getTotal, isInCart,
    getWishlist, toggleWishlist, isWishlisted, getWishlistProducts,
    TAX_RATE, FREE_SHIPPING_THRESHOLD, SHIPPING_COST
  };
})();
