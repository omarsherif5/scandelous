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
try {
  const customProds = JSON.parse(localStorage.getItem('sc_custom_products') || '[]');
  const deletedProds = JSON.parse(localStorage.getItem('sc_deleted_products') || '[]');
  
  if (customProds.length > 0) {
    PRODUCTS = PRODUCTS.concat(customProds);
  }
  
  if (deletedProds.length > 0) {
    PRODUCTS = PRODUCTS.filter(p => !deletedProds.includes(p.id));
  }
} catch(e) {
  console.error("Error loading custom products:", e);
}

// --- STOCK TRACKING ---
// Stock overrides: { productId: quantity }
// If a product is NOT in this map, it has unlimited stock.
// Stock is decreased automatically when orders are placed.
function getStockMap() {
  try { return JSON.parse(localStorage.getItem('sc_stock') || '{}'); } catch(e) { return {}; }
}
function saveStockMap(map) {
  localStorage.setItem('sc_stock', JSON.stringify(map));
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
  try { return JSON.parse(localStorage.getItem('sc_promo_codes') || '[]'); } catch(e) { return []; }
}
function savePromoCodes(list) {
  localStorage.setItem('sc_promo_codes', JSON.stringify(list));
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
