import { ThemeFile } from '../types';

export const ESELLERS_THEME_INFO = {
  name: "E-sellers Pro",
  developer: "E-sellers",
  email: "info@e-sellers.net",
  version: "1.0.0",
  website: "https://e-sellers.net"
};

export const INITIAL_THEME_FILES: ThemeFile[] = [
  {
    path: "layout/theme.liquid",
    category: "layout",
    language: "liquid",
    content: `{% comment %}
  Theme: E-sellers Pro
  Developer: E-sellers
  Contact: info@e-sellers.net
{% endcomment %}
<!doctype html>
<html class="no-js" lang="{{ request.locale.iso_code }}">
  <head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width,initial-scale=1">
    <meta name="theme-color" content="{{ settings.colors_accent }}">

    <link rel="canonical" href="{{ canonical_url }}">
    <link rel="preconnect" href="https://cdn.shopify.com" crossorigin>

    <title>
      {{ page_title }}
      {%- if current_tags %} &ndash; tagged "{{ current_tags | join: ', ' }}"{% endif -%}
      {%- if current_page != 1 %} &ndash; Page {{ current_page }}{% endif -%}
      {%- unless page_title contains shop.name %} &ndash; {{ shop.name }}{% endunless -%}
    </title>

    {% if page_description %}
      <meta name="description" content="{{ page_description | escape }}">
    {% endif %}

    {{ content_for_header }}

    <link rel="stylesheet" href="{{ 'e-sellers-pro.css' | asset_url }}">
    <script src="{{ 'e-sellers-pro.js' | asset_url }}" defer="defer"></script>

    {% style %}
      :root {
        --es-color-primary: {{ settings.colors_primary | default: '#111827' }};
        --es-color-accent: {{ settings.colors_accent | default: '#2563eb' }};
        --es-color-bg: {{ settings.colors_background | default: '#ffffff' }};
        --es-color-text: {{ settings.colors_text | default: '#1f2937' }};
        --es-font-heading: 'Plus Jakarta Sans', sans-serif;
        --es-font-body: 'Inter', sans-serif;
      }
    {% endstyle %}
  </head>

  <body class="es-theme-body">
    <a class="es-skip-link" href="#MainContent">Skip to content</a>

    {% sections 'header-group' %}

    <main id="MainContent" class="es-main-content" role="main" tabindex="-1">
      {{ content_for_layout }}
    </main>

    {% sections 'footer-group' %}

    {% render 'cart-drawer' %}
  </body>
</html>`
  },
  {
    path: "sections/header.liquid",
    category: "sections",
    language: "liquid",
    content: `{% comment %}
  Theme: E-sellers Pro
  Section: Header Navigation
  Developer: E-sellers (info@e-sellers.net)
{% endcomment %}

<header class="es-header es-header--{{ section.settings.logo_position }}" style="background-color: {{ section.settings.bg_color }}; color: {{ section.settings.text_color }};">
  <div class="es-container es-header__inner">
    <div class="es-header__logo">
      <a href="/" class="es-logo-link">
        {% if section.settings.logo != blank %}
          <img src="{{ section.settings.logo | image_url: width: 300 }}" alt="{{ shop.name }}" width="150" height="40" loading="eager">
        {% else %}
          <span class="es-logo-text">{{ shop.name | default: 'E-sellers Pro' }}</span>
        {% endif %}
      </a>
    </div>

    <nav class="es-header__nav" role="navigation">
      <ul class="es-nav-list">
        {% for link in section.settings.menu.links %}
          <li class="es-nav-item">
            <a href="{{ link.url }}" class="es-nav-link {% if link.active %}es-nav-link--active{% endif %}">
              {{ link.title }}
            </a>
          </li>
        {% else %}
          <li class="es-nav-item"><a href="/" class="es-nav-link es-nav-link--active">Home</a></li>
          <li class="es-nav-item"><a href="/collections/all" class="es-nav-link">Shop All</a></li>
          <li class="es-nav-item"><a href="/pages/about" class="es-nav-link">About E-sellers</a></li>
          <li class="es-nav-item"><a href="/pages/contact" class="es-nav-link">Contact</a></li>
        {% endfor %}
      </ul>
    </nav>

    <div class="es-header__actions">
      <button class="es-icon-btn" aria-label="Search">
        <svg class="es-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
      </button>
      <a href="/cart" class="es-icon-btn es-cart-trigger" id="es-cart-toggle" aria-label="Cart">
        <svg class="es-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/></svg>
        <span class="es-cart-badge">{{ cart.item_count | default: 2 }}</span>
      </a>
    </div>
  </div>
</header>

{% schema %}
{
  "name": "Header",
  "tag": "header",
  "class": "section-header",
  "settings": [
    {
      "type": "image_picker",
      "id": "logo",
      "label": "Logo Image"
    },
    {
      "type": "link_list",
      "id": "menu",
      "label": "Main Navigation Menu",
      "default": "main-menu"
    },
    {
      "type": "color",
      "id": "bg_color",
      "label": "Background Color",
      "default": "#ffffff"
    },
    {
      "type": "color",
      "id": "text_color",
      "label": "Text Color",
      "default": "#111827"
    }
  ],
  "presets": [
    {
      "name": "Header",
      "category": "Header"
    }
  ]
}
{% endschema %}`
  },
  {
    path: "sections/hero-banner.liquid",
    category: "sections",
    language: "liquid",
    content: `{% comment %}
  Theme: E-sellers Pro
  Section: Hero Banner (OS 2.0)
  Developer: E-sellers (info@e-sellers.net)
{% endcomment %}

{% style %}
  .es-hero-{{ section.id }} {
    min-height: {{ section.settings.banner_height }}px;
    background-color: {{ section.settings.bg_color }};
  }
  .es-hero-{{ section.id }} .es-hero__overlay {
    background: rgba(0, 0, 0, {{ section.settings.overlay_opacity | divided_by: 100.0 }});
  }
{% endstyle %}

<section class="es-hero es-hero-{{ section.id }}">
  {% if section.settings.image != blank %}
    <img
      src="{{ section.settings.image | image_url: width: 2000 }}"
      alt="{{ section.settings.heading | escape }}"
      class="es-hero__image"
      loading="eager"
      width="2000"
      height="1000"
    >
  {% else %}
    <div class="es-hero__placeholder">
      <div class="es-hero__gradient"></div>
    </div>
  {% endif %}

  <div class="es-hero__overlay"></div>

  <div class="es-container es-hero__content text-{{ section.settings.text_alignment }}">
    {% if section.settings.subheading != blank %}
      <p class="es-hero__subheading">{{ section.settings.subheading }}</p>
    {% endif %}

    <h1 class="es-hero__title">{{ section.settings.heading | default: 'Build High-Converting Stores with E-sellers Pro' }}</h1>

    {% if section.settings.text != blank %}
      <div class="es-hero__text">{{ section.settings.text }}</div>
    {% endif %}

    {% if section.settings.button_label != blank %}
      <div class="es-hero__buttons">
        <a href="{{ section.settings.button_link | default: '/collections/all' }}" class="es-btn es-btn--primary">
          {{ section.settings.button_label }}
        </a>
      </div>
    {% endif %}
  </div>
</section>

{% schema %}
{
  "name": "Hero Banner",
  "tag": "section",
  "class": "section-hero",
  "settings": [
    {
      "type": "text",
      "id": "heading",
      "label": "Heading",
      "default": "Build High-Converting Stores with E-sellers Pro"
    },
    {
      "type": "text",
      "id": "subheading",
      "label": "Subheading",
      "default": "Next-Gen Shopify Theme Engine by E-sellers"
    },
    {
      "type": "richtext",
      "id": "text",
      "label": "Body Text",
      "default": "<p>Designed for speed, conversion rate optimization, and seamless section modularity.</p>"
    },
    {
      "type": "text",
      "id": "button_label",
      "label": "Button Label",
      "default": "Explore Collection"
    },
    {
      "type": "url",
      "id": "button_link",
      "label": "Button Link"
    },
    {
      "type": "image_picker",
      "id": "image",
      "label": "Background Image"
    },
    {
      "type": "range",
      "id": "overlay_opacity",
      "min": 0,
      "max": 90,
      "step": 5,
      "unit": "%",
      "label": "Image Overlay Opacity",
      "default": 30
    },
    {
      "type": "range",
      "id": "banner_height",
      "min": 300,
      "max": 800,
      "step": 50,
      "unit": "px",
      "label": "Minimum Banner Height",
      "default": 550
    },
    {
      "type": "select",
      "id": "text_alignment",
      "label": "Text Alignment",
      "options": [
        { "value": "left", "label": "Left" },
        { "value": "center", "label": "Center" },
        { "value": "right", "label": "Right" }
      ],
      "default": "center"
    }
  ],
  "presets": [
    {
      "name": "Hero Banner",
      "category": "Image & Video"
    }
  ]
}
{% endschema %}`
  },
  {
    path: "sections/featured-collection.liquid",
    category: "sections",
    language: "liquid",
    content: `{% comment %}
  Theme: E-sellers Pro
  Section: Featured Collection Grid
  Developer: E-sellers (info@e-sellers.net)
{% endcomment %}

<section class="es-section es-featured-collection" style="background-color: {{ section.settings.bg_color }};">
  <div class="es-container">
    <div class="es-section-header">
      <h2 class="es-section-title">{{ section.settings.title | default: 'Featured Collection' }}</h2>
      {% if section.settings.subtitle != blank %}
        <p class="es-section-subtitle">{{ section.settings.subtitle }}</p>
      {% endif %}
    </div>

    <div class="es-grid es-grid--{{ section.settings.columns_desktop }}-col">
      {% assign collection = collections[section.settings.collection] %}
      {% if collection != blank and collection.products.size > 0 %}
        {% for product in collection.products limit: section.settings.products_to_show %}
          {% render 'card-product', product: product %}
        {% endfor %}
      {% else %}
        {% for i in (1..section.settings.products_to_show) %}
          <div class="es-card-product es-card-product--placeholder">
            <div class="es-card-product__image-box">
              <span class="es-placeholder-tag">Product {{ i }}</span>
            </div>
            <div class="es-card-product__content">
              <span class="es-card-product__vendor">E-sellers Pro</span>
              <h3 class="es-card-product__title">Sample E-commerce Item {{ i }}</h3>
              <div class="es-card-product__price">$49.00 USD</div>
            </div>
          </div>
        {% endfor %}
      {% endif %}
    </div>
  </div>
</section>

{% schema %}
{
  "name": "Featured Collection",
  "tag": "section",
  "class": "section-featured-collection",
  "settings": [
    {
      "type": "text",
      "id": "title",
      "label": "Heading",
      "default": "Best Sellers"
    },
    {
      "type": "text",
      "id": "subtitle",
      "label": "Subheading",
      "default": "Handpicked top performing products for your store"
    },
    {
      "type": "collection",
      "id": "collection",
      "label": "Collection"
    },
    {
      "type": "range",
      "id": "products_to_show",
      "min": 2,
      "max": 12,
      "step": 1,
      "label": "Maximum products to show",
      "default": 4
    },
    {
      "type": "range",
      "id": "columns_desktop",
      "min": 2,
      "max": 5,
      "step": 1,
      "label": "Number of columns on desktop",
      "default": 4
    }
  ],
  "presets": [
    {
      "name": "Featured Collection",
      "category": "Products"
    }
  ]
}
{% endschema %}`
  },
  {
    path: "sections/footer.liquid",
    category: "sections",
    language: "liquid",
    content: `{% comment %}
  Theme: E-sellers Pro
  Section: Footer
  Developer: E-sellers (info@e-sellers.net)
{% endcomment %}

<footer class="es-footer" style="background-color: {{ section.settings.bg_color }}; color: {{ section.settings.text_color }};">
  <div class="es-container es-footer__inner">
    <div class="es-footer__brand">
      <h3 class="es-footer__title">{{ shop.name | default: 'E-sellers Pro' }}</h3>
      <p class="es-footer__description">
        {{ section.settings.brand_text | default: 'High performance Shopify theme created by E-sellers. Developed for speed, modularity, and growth.' }}
      </p>
      <p class="es-footer__contact">
        Contact: <a href="mailto:{{ section.settings.contact_email | default: 'info@e-sellers.net' }}">{{ section.settings.contact_email | default: 'info@e-sellers.net' }}</a>
      </p>
    </div>

    <div class="es-footer__nav">
      <h4 class="es-footer__heading">Quick Links</h4>
      <ul class="es-footer__list">
        <li><a href="/collections/all">Shop All</a></li>
        <li><a href="/pages/about">About Developer</a></li>
        <li><a href="/policies/privacy-policy">Privacy Policy</a></li>
        <li><a href="/policies/terms-of-service">Terms of Service</a></li>
      </ul>
    </div>

    <div class="es-footer__newsletter">
      <h4 class="es-footer__heading">Subscribe & Save</h4>
      <p>Get instant updates on new arrivals & Shopify theme updates.</p>
      {% form 'customer', class: 'es-newsletter-form' %}
        <input type="hidden" name="contact[tags]" value="newsletter">
        <div class="es-input-group">
          <input type="email" name="contact[email]" placeholder="Your email address" required class="es-input">
          <button type="submit" class="es-btn es-btn--primary">Join</button>
        </div>
      {% endform %}
    </div>
  </div>

  <div class="es-footer__bottom">
    <div class="es-container es-footer__bottom-inner">
      <p>&copy; {{ 'now' | date: "%Y" }} {{ shop.name }}. Theme: <strong>E-sellers Pro</strong> by <strong>E-sellers</strong> (<a href="mailto:info@e-sellers.net">info@e-sellers.net</a>).</p>
    </div>
  </div>
</footer>

{% schema %}
{
  "name": "Footer",
  "tag": "footer",
  "settings": [
    {
      "type": "text",
      "id": "brand_text",
      "label": "Brand Description",
      "default": "E-sellers Pro - Premier Shopify Theme Architecture."
    },
    {
      "type": "text",
      "id": "contact_email",
      "label": "Support Email",
      "default": "info@e-sellers.net"
    },
    {
      "type": "color",
      "id": "bg_color",
      "label": "Background Color",
      "default": "#0f172a"
    },
    {
      "type": "color",
      "id": "text_color",
      "label": "Text Color",
      "default": "#f8fafc"
    }
  ]
}
{% endschema %}`
  },
  {
    path: "snippets/card-product.liquid",
    category: "snippets",
    language: "liquid",
    content: `{% comment %}
  Snippet: Card Product
  Theme: E-sellers Pro
{% endcomment %}

<div class="es-card-product">
  <a href="{{ product.url | default: '#' }}" class="es-card-product__link">
    <div class="es-card-product__image-wrapper">
      {% if product.featured_media != blank %}
        <img
          src="{{ product.featured_media | image_url: width: 600 }}"
          alt="{{ product.title | escape }}"
          class="es-card-product__image"
          loading="lazy"
          width="600"
          height="600"
        >
      {% else %}
        <div class="es-card-product__placeholder-box">
          <svg class="es-placeholder-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
        </div>
      {% endif %}

      {% if product.compare_at_price > product.price %}
        <span class="es-badge es-badge--sale">Sale</span>
      {% endif %}
    </div>

    <div class="es-card-product__info">
      <span class="es-card-product__vendor">{{ product.vendor | default: 'E-sellers Pro' }}</span>
      <h3 class="es-card-product__title">{{ product.title | default: 'Sample Product Title' }}</h3>
      {% render 'price', product: product %}
    </div>
  </a>

  <div class="es-card-product__actions">
    <button class="es-btn es-btn--secondary es-btn--full" data-add-to-cart="{{ product.id }}">
      Add to Cart
    </button>
  </div>
</div>`
  },
  {
    path: "snippets/price.liquid",
    category: "snippets",
    language: "liquid",
    content: `{% comment %}
  Snippet: Price Formatter
  Theme: E-sellers Pro
{% endcomment %}

<div class="es-price">
  <span class="es-price__regular">
    {{ product.price | money_with_currency | default: '$49.00 USD' }}
  </span>
  {% if product.compare_at_price > product.price %}
    <span class="es-price__compare">
      {{ product.compare_at_price | money_with_currency | default: '$69.00 USD' }}
    </span>
  {% endif %}
</div>`
  },
  {
    path: "snippets/cart-drawer.liquid",
    category: "snippets",
    language: "liquid",
    content: `{% comment %}
  Snippet: Cart Drawer
  Theme: E-sellers Pro
{% endcomment %}

<div id="es-cart-drawer" class="es-drawer" aria-hidden="true">
  <div class="es-drawer__overlay"></div>
  <div class="es-drawer__content">
    <div class="es-drawer__header">
      <h2 class="es-drawer__title">Your Shopping Cart</h2>
      <button class="es-drawer__close" id="es-cart-close" aria-label="Close cart">&times;</button>
    </div>

    <div class="es-drawer__body">
      <div class="es-cart-item">
        <div class="es-cart-item__media">
          <div class="es-cart-item__placeholder"></div>
        </div>
        <div class="es-cart-item__details">
          <h4 class="es-cart-item__title">E-sellers Pro Premium Item</h4>
          <span class="es-cart-item__variant">Size: M | Color: Black</span>
          <div class="es-cart-item__price">$49.00 USD</div>
          <div class="es-cart-item__qty">
            <button class="es-qty-btn">-</button>
            <span>1</span>
            <button class="es-qty-btn">+</button>
          </div>
        </div>
      </div>
    </div>

    <div class="es-drawer__footer">
      <div class="es-drawer__subtotal">
        <span>Subtotal</span>
        <span class="es-drawer__subtotal-price">$49.00 USD</span>
      </div>
      <p class="es-drawer__note">Taxes and shipping calculated at checkout</p>
      <a href="/checkout" class="es-btn es-btn--primary es-btn--full">Proceed to Checkout</a>
    </div>
  </div>
</div>`
  },
  {
    path: "templates/index.json",
    category: "templates",
    language: "json",
    content: JSON.stringify({
      "sections": {
        "hero_banner": {
          "type": "hero-banner",
          "settings": {
            "heading": "Welcome to E-sellers Pro",
            "subheading": "Premium Shopify OS 2.0 Theme Engine",
            "text": "<p>Empowering e-commerce brands with fast, section-based modular themes.</p>",
            "button_label": "Shop Best Sellers",
            "button_link": "/collections/all"
          }
        },
        "featured_collection": {
          "type": "featured-collection",
          "settings": {
            "title": "Featured Best Sellers",
            "subtitle": "Discover our top products curated for quality and speed",
            "products_to_show": 4,
            "columns_desktop": 4
          }
        }
      },
      "order": [
        "hero_banner",
        "featured_collection"
      ]
    }, null, 2)
  },
  {
    path: "templates/product.json",
    category: "templates",
    language: "json",
    content: JSON.stringify({
      "sections": {
        "main_product": {
          "type": "product-main",
          "settings": {
            "enable_sticky_info": true,
            "show_vendor": true
          }
        }
      },
      "order": [
        "main_product"
      ]
    }, null, 2)
  },
  {
    path: "config/settings_schema.json",
    category: "config",
    language: "json",
    content: JSON.stringify([
      {
        "name": "theme_info",
        "theme_name": "E-sellers Pro",
        "theme_version": "1.0.0",
        "theme_author": "E-sellers",
        "theme_documentation_url": "https://e-sellers.net",
        "theme_support_email": "info@e-sellers.net"
      },
      {
        "name": "Colors",
        "settings": [
          {
            "type": "color",
            "id": "colors_primary",
            "label": "Primary Color",
            "default": "#111827"
          },
          {
            "type": "color",
            "id": "colors_accent",
            "label": "Accent Color",
            "default": "#2563eb"
          },
          {
            "type": "color",
            "id": "colors_background",
            "label": "Background Color",
            "default": "#ffffff"
          },
          {
            "type": "color",
            "id": "colors_text",
            "label": "Text Color",
            "default": "#1f2937"
          }
        ]
      }
    ], null, 2)
  },
  {
    path: "assets/e-sellers-pro.css",
    category: "assets",
    language: "css",
    content: `/* E-sellers Pro Theme Stylesheet */
:root {
  --es-font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
  --es-radius: 8px;
  --es-transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

body.es-theme-body {
  margin: 0;
  padding: 0;
  font-family: var(--es-font-family);
  color: var(--es-color-text, #1f2937);
  background-color: var(--es-color-bg, #ffffff);
  line-height: 1.6;
}

.es-container {
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 1.5rem;
}

.es-header {
  border-bottom: 1px solid #e5e7eb;
  position: sticky;
  top: 0;
  z-index: 50;
  backdrop-filter: blur(8px);
}

.es-header__inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 72px;
}

.es-logo-text {
  font-size: 1.35rem;
  font-weight: 800;
  letter-spacing: -0.025em;
  color: var(--es-color-primary, #111827);
  text-decoration: none;
}

.es-nav-list {
  display: flex;
  list-style: none;
  gap: 2rem;
  margin: 0;
  padding: 0;
}

.es-nav-link {
  text-decoration: none;
  font-weight: 500;
  font-size: 0.95rem;
  color: #4b5563;
  transition: var(--es-transition);
}

.es-nav-link:hover, .es-nav-link--active {
  color: var(--es-color-accent, #2563eb);
}

.es-header__actions {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.es-icon-btn {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.5rem;
  position: relative;
  color: #374151;
}

.es-icon {
  width: 22px;
  height: 22px;
}

.es-cart-badge {
  position: absolute;
  top: 2px;
  right: 2px;
  background-color: var(--es-color-accent, #2563eb);
  color: white;
  font-size: 0.7rem;
  font-weight: 700;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Hero Section */
.es-hero {
  position: relative;
  display: flex;
  align-items: center;
  overflow: hidden;
  color: #ffffff;
}

.es-hero__image {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.es-hero__placeholder {
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
}

.es-hero__overlay {
  position: absolute;
  inset: 0;
}

.es-hero__content {
  position: relative;
  z-index: 10;
  padding-top: 4rem;
  padding-bottom: 4rem;
}

.es-hero__title {
  font-size: 3rem;
  font-weight: 800;
  line-height: 1.1;
  margin: 0.5rem 0 1rem;
}

.es-hero__subheading {
  font-size: 0.875rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: #93c5fd;
  font-weight: 700;
}

.es-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.75rem 1.75rem;
  font-weight: 600;
  font-size: 0.95rem;
  border-radius: var(--es-radius);
  text-decoration: none;
  cursor: pointer;
  transition: var(--es-transition);
  border: 1px solid transparent;
}

.es-btn--primary {
  background-color: var(--es-color-accent, #2563eb);
  color: #ffffff;
}

.es-btn--primary:hover {
  background-color: #1d4ed8;
}

.es-btn--secondary {
  background-color: #f3f4f6;
  color: #1f2937;
}

.es-btn--secondary:hover {
  background-color: #e5e7eb;
}

/* Grid & Cards */
.es-section {
  padding: 4rem 0;
}

.es-section-header {
  text-align: center;
  margin-bottom: 3rem;
}

.es-section-title {
  font-size: 2rem;
  font-weight: 800;
  margin: 0 0 0.5rem;
}

.es-grid {
  display: grid;
  gap: 2rem;
}

.es-grid--4-col {
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
}

.es-card-product {
  background: #ffffff;
  border-radius: var(--es-radius);
  border: 1px solid #e5e7eb;
  overflow: hidden;
  transition: var(--es-transition);
}

.es-card-product:hover {
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.08);
  transform: translateY(-2px);
}

.es-card-product__image-wrapper {
  position: relative;
  aspect-ratio: 1;
  background-color: #f8fafc;
  display: flex;
  align-items: center;
  justify-content: center;
}

.es-card-product__info {
  padding: 1.25rem;
}

.es-card-product__title {
  font-size: 1rem;
  font-weight: 600;
  margin: 0.25rem 0;
  color: #111827;
}

.es-badge--sale {
  position: absolute;
  top: 10px;
  left: 10px;
  background-color: #ef4444;
  color: white;
  padding: 2px 8px;
  font-size: 0.75rem;
  font-weight: 700;
  border-radius: 4px;
}

/* Footer */
.es-footer {
  padding: 4rem 0 0;
  margin-top: 4rem;
}

.es-footer__inner {
  display: grid;
  grid-template-columns: 2fr 1fr 1.5fr;
  gap: 3rem;
  padding-bottom: 3rem;
}

.es-footer__bottom {
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  padding: 1.5rem 0;
  font-size: 0.875rem;
  color: #94a3b8;
}
`
  },
  {
    path: "assets/e-sellers-pro.js",
    category: "assets",
    language: "javascript",
    content: `/* E-sellers Pro Theme JavaScript Engine */
console.log("E-sellers Pro Theme Engine Loaded. Author: E-sellers (info@e-sellers.net)");

document.addEventListener("DOMContentLoaded", function() {
  const cartToggle = document.getElementById("es-cart-toggle");
  const cartDrawer = document.getElementById("es-cart-drawer");
  const cartClose = document.getElementById("es-cart-close");

  if (cartToggle && cartDrawer) {
    cartToggle.addEventListener("click", function(e) {
      e.preventDefault();
      cartDrawer.setAttribute("aria-hidden", "false");
      cartDrawer.classList.add("es-drawer--open");
    });
  }

  if (cartClose && cartDrawer) {
    cartClose.addEventListener("click", function() {
      cartDrawer.setAttribute("aria-hidden", "true");
      cartDrawer.classList.remove("es-drawer--open");
    });
  }
});
`
  },
  {
    path: "locales/en.default.json",
    category: "locales",
    language: "json",
    content: JSON.stringify({
      "general": {
        "theme_name": "E-sellers Pro",
        "developer": "E-sellers",
        "support_email": "info@e-sellers.net"
      },
      "products": {
        "product": {
          "add_to_cart": "Add to cart",
          "sold_out": "Sold out",
          "unavailable": "Unavailable"
        }
      },
      "cart": {
        "general": {
          "title": "Shopping Cart",
          "empty": "Your cart is currently empty.",
          "checkout": "Proceed to Checkout"
        }
      }
    }, null, 2)
  }
];
