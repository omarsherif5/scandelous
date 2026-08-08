// ============================================================
//  s.candle.ous — PRODUCT DATA FILE
//  Edit this file to change products, prices, and images.
//  All changes here automatically reflect on the website.
// ============================================================

let PRODUCTS = [
  {
    id: 1,
    name: "Soft Pink Cloud Tray",
    category: "tray",
    scent: "Soft Pink · Decorative Resin",
    price: 350,
    badge: "Best Seller",
    images: [],
    desc: "Created for the woman who finds joy in life’s little rituals. Whether it’s your favorite lip gloss, delicate jewelry, or treasured keepsakes, this cloud tray adds a touch of warmth, elegance, and femininity to every space.\n\n• Elegant cloud-shaped design\n• Perfect for jewelry, beauty products, and small accessories\n• Decorative and functional\n• A thoughtful gift for yourself or someone special",
    burnTime: "",
    weight: "200g",
    inStock: true,
    color: "#F5DAD5",
  },
  {
    id: 2,
    name: "Pure White Cloud Tray",
    category: "tray",
    scent: "Classic White · Decorative Resin",
    price: 350,
    badge: "",
    images: [],
    desc: "Created for the woman who finds joy in life’s little rituals. Whether it’s your favorite lip gloss, delicate jewelry, or treasured keepsakes, this cloud tray adds a touch of warmth, elegance, and femininity to every space.\n\n• Elegant cloud-shaped design\n• Perfect for jewelry, beauty products, and small accessories\n• Decorative and functional\n• A thoughtful gift for yourself or someone special",
    burnTime: "",
    weight: "200g",
    inStock: true,
    color: "#FDFDFD",
  },
  {
    id: 3,
    name: "Warm Taupe Cloud Tray",
    category: "tray",
    scent: "Warm Taupe · Decorative Resin",
    price: 350,
    badge: "New",
    images: [],
    desc: "Created for the woman who finds joy in life’s little rituals. Whether it’s your favorite lip gloss, delicate jewelry, or treasured keepsakes, this cloud tray adds a touch of warmth, elegance, and femininity to every space.\n\n• Elegant cloud-shaped design\n• Perfect for jewelry, beauty products, and small accessories\n• Decorative and functional\n• A thoughtful gift for yourself or someone special",
    burnTime: "",
    weight: "200g",
    inStock: true,
    color: "#BCAEA5",
  }
];

// --- LOAD CUSTOM PRODUCTS & FILTER DELETED ONES ---
// Firebase will handle custom products asynchronously
// See index.html and admin.html for the database loading logic

// --- STOCK TRACKING ---
// Stock overrides: { productId: quantity }
window.FB_STOCK = {};
window.FB_PROMO_CODES = [];
window.DB_REF = null;

function getStockMap() {
  return window.FB_STOCK;
}
function saveStockMap(map) {
  window.FB_STOCK = map;
  if(window.DB_REF) {
    window.DB_REF.child('sc_stock').set(JSON.stringify(map)).catch(function(err) {
      console.error('Failed to save stock to Firebase:', err);
    });
  }
}
function getProductStock(id) {
  var map = getStockMap();
  return map.hasOwnProperty(id) ? map[id] : null; // null = unlimited
}
function setProductStock(id, qty) {
  var map = getStockMap();
  map[id] = Math.max(0, qty);
  saveStockMap(map);
}
function decreaseStock(id, amount) {
  var map = getStockMap();
  if (map.hasOwnProperty(id)) {
    map[id] = Math.max(0, map[id] - amount);
    saveStockMap(map);
  }
}
function isInStock(id) {
  var stock = getProductStock(id);
  return stock === null || stock > 0;
}

// --- PROMO CODES ---
function getPromoCodes() {
  return window.FB_PROMO_CODES;
}
function savePromoCodes(list) {
  window.FB_PROMO_CODES = list;
  if(window.DB_REF) {
    window.DB_REF.child('sc_promo_codes').set(JSON.stringify(list)).catch(function(err) {
      console.error('Failed to save promo codes to Firebase:', err);
    });
  }
}

// ─────────────────────────────────────────────────────
//  STORE SETTINGS — edit these to match your business
// ─────────────────────────────────────────────────────
const STORE_SETTINGS = {
  ownerEmail: 'lailawael3@gmail.com',  // ← YOUR email address — orders will be sent here
  name: "s.candle.ous",
  currency: "EGP ",             // displayed next to prices (e.g. "£" or "€")
  currencyCode: "EGP",
  shippingFee: 80,         // flat shipping fee in EGP (set 0 for free)
  freeShippingOver: 1000,  // free shipping for orders above this amount (set 0 to disable)
  adminPassword: "layla",  // password to access the admin panel
  whatsapp: "+201100032419",       // ← YOUR WHATSAPP NUMBER (include country code, e.g. +20...)
  email: "lailawael3@gmail.com",
  instagram: "https://www.instagram.com/s.candle.ous/#",
};
