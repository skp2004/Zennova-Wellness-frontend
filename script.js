/* ================================================================
   ZENNOVA WELLNESS — script.js
   Features:
   - Product rendering with WhatsApp & Email enquiry buttons
   - FAQ accordion (accessible)
   - Scroll-reveal animations (Intersection Observer)
   - Sticky header scroll class
   - Mobile menu toggle
   - Floating WhatsApp button show/hide
================================================================ */

/* =========================================================
   PRODUCT DATA
   To connect your Google Sheet:
   1. Create columns: name | price | weight | badge | description | image
   2. Publish to web (File > Share > Publish to web)
   3. Copy your Sheet ID from the URL and paste below
   4. Change SHEET_NAME if your tab isn't called "Sheet1"
   ========================================================= */

const SHEET_ID   = "PASTE_YOUR_GOOGLE_SHEET_ID_HERE";
const SHEET_NAME = "Sheet1";
const FEED_URL   = `https://opensheet.elk.sh/${SHEET_ID}/${SHEET_NAME}`;

/* =========================================================
   CONTACT CONFIG — edit here to update all links site-wide
   ========================================================= */
const WA_NUMBER      = "917600031262";          // WhatsApp: 91 + 7600031262
const WA_DISPLAY     = "+91 76000 31262";       // Human-readable label
const EMAIL          = "misha.zennovawellness@gmail.com";
const BUSINESS_NAME  = "Zennova Wellness";
const BUSINESS_CITY  = "Ahmedabad, Gujarat";

// High-quality product images from Unsplash
const PRODUCT_IMAGES = {
  atta: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=600&q=85&auto=format&fit=crop",
  sattu: "https://images.unsplash.com/photo-1628088062854-d1870b4553da?w=600&q=85&auto=format&fit=crop",
  flakes: "https://images.unsplash.com/photo-1546548970-71785318a17b?w=600&q=85&auto=format&fit=crop",
  default: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&q=85&auto=format&fit=crop"
};

// Fallback products shown when sheet is not connected yet
const FALLBACK_PRODUCTS = [
  {
    name: "Multigrain Atta",
    price: "₹329",
    weight: "5 kg",
    badge: "Bestseller",
    description: "Wheat, jowar, bajra, ragi & chana — stone-ground fresh in small batches.",
    image: PRODUCT_IMAGES.atta
  },
  {
    name: "Multigrain Atta",
    price: "₹649",
    weight: "10 kg",
    badge: "Family Pack",
    description: "Same stone-ground blend in a monthly-size pack for larger households.",
    image: PRODUCT_IMAGES.atta
  },
  {
    name: "Roasted Sattu",
    price: "₹179",
    weight: "1 kg",
    badge: "New",
    description: "Multigrain sattu for shakes, parathas and quick protein-rich meals.",
    image: PRODUCT_IMAGES.sattu
  },
  {
    name: "Multigrain Flakes",
    price: "₹149",
    weight: "500 g",
    badge: "",
    description: "Light, quick-cooking flakes from the same 5-grain blend — great for breakfast.",
    image: PRODUCT_IMAGES.flakes
  }
];

/* ============ WhatsApp SVG icon (inline) ============ */
const WA_ICON = `<svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>`;

const MAIL_ICON = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>`;

/* ============ Build enquiry URLs for each product ============ */
function buildWaUrl(productName, price, weight) {
  const msg = encodeURIComponent(
    `Hi Zennova Wellness,\n\nI would like to enquire about:\n🌾 *${productName}* (${weight} – ${price})\n\nPlease share availability and delivery details.\n\nThank you!`
  );
  return `https://wa.me/${WA_NUMBER}?text=${msg}`;
}

function buildEmailUrl(productName, price, weight) {
  const subject = encodeURIComponent(`Order Enquiry – ${productName} (${weight})`);
  const body = encodeURIComponent(
    `Hi Zennova Wellness Team,\n\nI would like to place an order for:\n\nProduct: ${productName}\nSize: ${weight}\nPrice: ${price}\n\nPlease let me know the next steps and payment details.\n\nMy details:\nName: \nPhone: \nCity: \n\nThank you!`
  );
  return `mailto:${EMAIL}?subject=${subject}&body=${body}`;
}

/* ============ Pick image based on product name ============ */
function pickImage(p) {
  if (p.image && p.image.trim()) return p.image;
  const name = (p.name || "").toLowerCase();
  if (name.includes("sattu")) return PRODUCT_IMAGES.sattu;
  if (name.includes("flake")) return PRODUCT_IMAGES.flakes;
  return PRODUCT_IMAGES.atta;
}

/* ============ Render products ============ */
function renderProducts(products) {
  const grid = document.getElementById("productGrid");
  if (!products || !products.length) {
    grid.innerHTML = `<div class="product-loading" style="color:var(--ink-soft);font-size:15px;padding:20px 0;">No products found yet — check your sheet connection.</div>`;
    return;
  }

  grid.innerHTML = products.map((p, i) => {
    const img = pickImage(p);

    return `
      <div class="product-card reveal-up" style="--delay:${i * 0.08}s">
        <div class="product-media">
          <img
            src="${img}"
            alt="${p.name || 'Zennova product'}"
            loading="lazy"
          >
        </div>
        <div class="product-body">
          ${p.badge ? `<span class="product-badge">${p.badge}</span>` : ""}
          <h3>
            ${p.name || ""}
            ${p.weight ? `<span class="product-weight"> · ${p.weight}</span>` : ""}
          </h3>
          <div class="desc">${p.description || ""}</div>
        </div>
      </div>
    `;
  }).join("");

  // Trigger reveal animation on new cards
  requestAnimationFrame(() => initReveal());
}

/* ============ Grain icon SVG placeholder ============ */
function grainIconSVG() {
  return `<svg viewBox="0 0 100 100" width="52" height="52" aria-hidden="true">
    <line x1="50" y1="18" x2="50" y2="82" stroke="#C9963A" stroke-width="3" stroke-linecap="round"/>
    <line x1="50" y1="30" x2="38" y2="22" stroke="#2E4D35" stroke-width="2.5" stroke-linecap="round"/>
    <line x1="50" y1="30" x2="62" y2="22" stroke="#2E4D35" stroke-width="2.5" stroke-linecap="round"/>
    <line x1="50" y1="46" x2="36" y2="38" stroke="#2E4D35" stroke-width="2.5" stroke-linecap="round"/>
    <line x1="50" y1="46" x2="64" y2="38" stroke="#2E4D35" stroke-width="2.5" stroke-linecap="round"/>
    <line x1="50" y1="62" x2="38" y2="54" stroke="#2E4D35" stroke-width="2.5" stroke-linecap="round"/>
    <line x1="50" y1="62" x2="62" y2="54" stroke="#2E4D35" stroke-width="2.5" stroke-linecap="round"/>
  </svg>`;
}

/* ============ Load products from sheet or fallback ============ */
async function loadProducts() {
  if (SHEET_ID === "PASTE_YOUR_GOOGLE_SHEET_ID_HERE") {
    renderProducts(FALLBACK_PRODUCTS);
    return;
  }
  try {
    const res = await fetch(FEED_URL);
    if (!res.ok) throw new Error("Sheet fetch failed");
    const data = await res.json();
    renderProducts(data.length ? data : FALLBACK_PRODUCTS);
  } catch (err) {
    console.warn("Falling back to placeholder products:", err);
    renderProducts(FALLBACK_PRODUCTS);
  }
}

/* ============ Scroll Reveal — Intersection Observer ============ */
function initReveal() {
  const revealEls = document.querySelectorAll(
    ".reveal-up:not(.in-view), .reveal-left:not(.in-view), .reveal-right:not(.in-view), .reveal-fade:not(.in-view)"
  );

  if (!revealEls.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in-view");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
  );

  revealEls.forEach((el) => observer.observe(el));
}

/* ============ FAQ Accordion ============ */
function initFAQ() {
  document.querySelectorAll(".faq-item").forEach((item) => {
    const btn = item.querySelector(".faq-q");
    const panel = item.querySelector(".faq-a");
    if (!btn || !panel) return;

    btn.addEventListener("click", () => {
      const isOpen = item.classList.contains("open");

      // Close all open items
      document.querySelectorAll(".faq-item.open").forEach((openItem) => {
        openItem.classList.remove("open");
        const openPanel = openItem.querySelector(".faq-a");
        if (openPanel) openPanel.style.maxHeight = null;
        const openBtn = openItem.querySelector(".faq-q");
        if (openBtn) openBtn.setAttribute("aria-expanded", "false");
      });

      // Open clicked item (unless it was already open)
      if (!isOpen) {
        item.classList.add("open");
        panel.style.maxHeight = panel.scrollHeight + "px";
        btn.setAttribute("aria-expanded", "true");
      }
    });
  });
}

/* ============ Sticky Header Class ============ */
function initStickyHeader() {
  const header = document.getElementById("siteHeader");
  if (!header) return;

  const onScroll = () => {
    header.classList.toggle("scrolled", window.scrollY > 40);
  };

  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
}

/* ============ Mobile Menu Toggle ============ */
function initMobileMenu() {
  const toggle = document.getElementById("menuToggle");
  const navLinks = document.getElementById("navLinks");
  if (!toggle || !navLinks) return;

  toggle.addEventListener("click", () => {
    const isOpen = navLinks.classList.toggle("open");
    toggle.setAttribute("aria-expanded", String(isOpen));

    // Animate hamburger lines
    const lines = toggle.querySelectorAll(".hamburger-line");
    if (isOpen) {
      lines[0].style.transform = "rotate(45deg) translate(5px, 5px)";
      lines[1].style.opacity = "0";
      lines[2].style.transform = "rotate(-45deg) translate(5px, -5px)";
    } else {
      lines[0].style.transform = "";
      lines[1].style.opacity = "";
      lines[2].style.transform = "";
    }
  });

  // Close menu when a link is clicked
  navLinks.querySelectorAll(".nav-link").forEach((link) => {
    link.addEventListener("click", () => {
      navLinks.classList.remove("open");
      toggle.setAttribute("aria-expanded", "false");
      const lines = toggle.querySelectorAll(".hamburger-line");
      lines[0].style.transform = "";
      lines[1].style.opacity = "";
      lines[2].style.transform = "";
    });
  });
}

/* ============ Active nav link on scroll ============ */
function initNavHighlight() {
  const sections = document.querySelectorAll("section[id]");
  const navLinks = document.querySelectorAll(".nav-link");

  const onScroll = () => {
    let current = "";
    sections.forEach((section) => {
      const sectionTop = section.offsetTop - 120;
      if (window.scrollY >= sectionTop) {
        current = section.getAttribute("id");
      }
    });

    navLinks.forEach((link) => {
      link.classList.remove("active");
      if (link.getAttribute("href") === `#${current}`) {
        link.classList.add("active");
      }
    });
  };

  window.addEventListener("scroll", onScroll, { passive: true });
}

/* ============ Parallax on hero grain blobs ============ */
function initHeroParallax() {
  const grains = document.querySelectorAll(".floating-grain");
  if (!grains.length) return;

  window.addEventListener("mousemove", (e) => {
    const cx = window.innerWidth / 2;
    const cy = window.innerHeight / 2;
    const dx = (e.clientX - cx) / cx;
    const dy = (e.clientY - cy) / cy;

    grains.forEach((grain, i) => {
      const factor = (i + 1) * 6;
      grain.style.transform = `translate(${dx * factor}px, ${dy * factor}px)`;
    });
  }, { passive: true });
}

/* ============ Button Ripple Effect ============ */
function initRipple() {
  document.querySelectorAll(".btn").forEach((btn) => {
    btn.addEventListener("click", function (e) {
      const rect = this.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      const x = e.clientX - rect.left - size / 2;
      const y = e.clientY - rect.top - size / 2;

      const ripple = document.createElement("span");
      ripple.classList.add("btn-ripple");
      ripple.style.cssText = `width:${size}px;height:${size}px;left:${x}px;top:${y}px;`;
      this.appendChild(ripple);
      setTimeout(() => ripple.remove(), 600);
    });
  });
}

/* ============ Section-head underline reveal ============ */
function initSectionHeadReveal() {
  const heads = document.querySelectorAll(".section-head");
  if (!heads.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in-view");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.2 }
  );

  heads.forEach((h) => observer.observe(h));
}

/* ============ Product card 3D tilt on mouse move ============ */
function initCardTilt() {
  document.addEventListener("mousemove", (e) => {
    document.querySelectorAll(".product-card").forEach((card) => {
      const rect = card.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = (e.clientX - cx) / (rect.width / 2);
      const dy = (e.clientY - cy) / (rect.height / 2);

      // Only tilt when mouse is within 80px of the card
      const dist = Math.hypot(e.clientX - cx, e.clientY - cy);
      if (dist < rect.width * 0.9) {
        card.style.transform = `perspective(800px) rotateX(${-dy * 4}deg) rotateY(${dx * 4}deg) translateY(-4px)`;
        card.style.boxShadow = `${-dx * 8}px ${-dy * 8}px 32px rgba(28,24,15,0.12)`;
      } else {
        card.style.transform = "";
        card.style.boxShadow = "";
      }
    });
  }, { passive: true });
}

/* ============ Hero Carousel ============ */
const SLIDE_LABELS = [
  "Fresh Grain",
  "Farm Sourced",
  "Stone Ground",
  "Ancient Millets",
  "Our Blend"
];

const SLIDE_INTERVAL = 5500; // ms per slide
const KB_DURATION    = SLIDE_INTERVAL + 400; // Ken Burns lasts a little longer

function initHeroCarousel() {
  const slides   = document.querySelectorAll(".hero-slide");
  const dots     = document.querySelectorAll(".hero-dot");
  const numEl    = document.getElementById("heroSlideNum");
  const textEl   = document.getElementById("heroSlideText");

  if (!slides.length) return;

  // Set Ken Burns duration via CSS custom property
  slides.forEach(s => s.style.setProperty("--kb-dur", KB_DURATION + "ms"));

  let current = 0;
  let timer   = null;

  function goTo(idx) {
    // Remove active from old
    slides[current].classList.remove("active");
    // Reset Ken Burns on old slide
    const oldImg = slides[current].querySelector("img");
    oldImg.style.animation = "none";
    void oldImg.offsetWidth; // reflow

    dots[current].classList.remove("active");

    current = idx;

    // Activate new slide
    slides[current].classList.add("active");
    // Restart Ken Burns on new slide
    const newImg = slides[current].querySelector("img");
    newImg.style.animation = "";

    dots[current].classList.add("active");

    // Update label with fade
    if (numEl && textEl) {
      numEl.classList.add("hsl-changing");
      textEl.classList.add("hsl-changing");
      setTimeout(() => {
        numEl.textContent  = String(current + 1).padStart(2, "0");
        textEl.textContent = SLIDE_LABELS[current] || "";
        numEl.classList.remove("hsl-changing");
        textEl.classList.remove("hsl-changing");
      }, 200);
    }
  }

  function next() {
    goTo((current + 1) % slides.length);
  }

  function startTimer() {
    clearInterval(timer);
    timer = setInterval(next, SLIDE_INTERVAL);
  }

  // Dot clicks
  dots.forEach(dot => {
    dot.addEventListener("click", () => {
      const idx = parseInt(dot.dataset.slide, 10);
      if (idx !== current) {
        goTo(idx);
        startTimer(); // reset interval
      }
    });
  });

  // Pause on hover
  const section = document.getElementById("heroSection");
  if (section) {
    section.addEventListener("mouseenter", () => clearInterval(timer));
    section.addEventListener("mouseleave", startTimer);
  }

  startTimer();
}

/* ============ Hero Scroll Parallax ============ */
function initHeroScrollParallax() {
  const section  = document.getElementById("heroSection");
  const content  = document.querySelector(".hero-content");
  const overlay  = document.getElementById("heroScrollOverlay");
  if (!section || !content) return;

  window.addEventListener("scroll", () => {
    const scrollY  = window.scrollY;
    const heroH    = section.offsetHeight;
    if (scrollY > heroH) return; // skip once hero is off screen

    const progress = Math.min(scrollY / heroH, 1); // 0 → 1

    // Content drifts up + fades
    const translateY = progress * -80;
    const opacity    = 1 - progress * 1.6;
    content.style.transform = `translateY(${translateY}px)`;
    content.style.opacity   = Math.max(opacity, 0);

    // Overlay darkens
    if (overlay) {
      const dark = progress * 0.55;
      overlay.style.background = `rgba(0,0,0,${dark})`;
    }
  }, { passive: true });
}

/* ============ Boot ============ */
document.addEventListener("DOMContentLoaded", () => {
  loadProducts();
  initFAQ();
  initReveal();
  initStickyHeader();
  initMobileMenu();
  initNavHighlight();
  initHeroCarousel();
  initHeroScrollParallax();
  initRipple();
  initSectionHeadReveal();
  initCardTilt();
});
