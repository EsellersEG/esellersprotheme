import { ShopifyDocTopic } from '../types';

export const SHOPIFY_DOC_TOPICS: ShopifyDocTopic[] = [
  {
    id: "cli-commands",
    title: "Shopify CLI Theme Commands",
    category: "cli",
    summary: "Essential CLI commands for developing, previewing, and pushing Shopify themes.",
    link: "https://shopify.dev/docs/storefronts/themes/tools/cli/cli-2/commands",
    snippet: `# Initialize or Clone Theme
shopify theme init e-sellers-pro-theme

# Run local Development Server with live preview
shopify theme dev --store=my-store.myshopify.com

# Push local theme files to live/unpublished shop
shopify theme push --store=my-store.myshopify.com

# Pull active live theme into local repository
shopify theme pull --store=my-store.myshopify.com

# Run Theme Check linter for performance & accessibility
shopify theme check

# Share preview URL with clients
shopify theme share`
  },
  {
    id: "os2-schema",
    title: "Shopify OS 2.0 Section Schema Types",
    category: "schema",
    summary: "JSON Schema input setting types available for section and block customization.",
    link: "https://shopify.dev/docs/storefronts/themes/architecture/sections/section-schema",
    snippet: `{% schema %}
{
  "name": "Section Name",
  "tag": "section",
  "class": "section-class",
  "settings": [
    { "type": "text", "id": "heading", "label": "Heading", "default": "Title" },
    { "type": "inline_richtext", "id": "subheading", "label": "Subheading" },
    { "type": "image_picker", "id": "image", "label": "Image" },
    { "type": "product", "id": "product_item", "label": "Select Product" },
    { "type": "collection", "id": "collection_item", "label": "Select Collection" },
    { "type": "color", "id": "bg_color", "label": "Background", "default": "#ffffff" },
    { "type": "range", "id": "padding_top", "min": 0, "max": 100, "step": 4, "unit": "px", "default": 36 },
    { "type": "select", "id": "alignment", "label": "Alignment", "options": [
      { "value": "left", "label": "Left" },
      { "value": "center", "label": "Center" }
    ], "default": "left" }
  ],
  "blocks": [
    {
      "type": "column",
      "name": "Column Block",
      "settings": [
        { "type": "text", "id": "title", "label": "Title" }
      ]
    }
  ],
  "presets": [
    {
      "name": "E-sellers Pro Default",
      "blocks": [{ "type": "column" }, { "type": "column" }]
    }
  ]
}
{% endschema %}`
  },
  {
    id: "liquid-filters",
    title: "OS 2.0 Modern Liquid Tags & Image Filters",
    category: "liquid",
    summary: "Modern performance filters replacing legacy img_url and include tags.",
    snippet: `{% comment %} MODERN IMAGE FILTER (OS 2.0) {% endcomment %}
<img 
  src="{{ section.settings.image | image_url: width: 1200 }}" 
  alt="{{ section.settings.image.alt | escape }}" 
  loading="lazy" 
  width="1200" 
  height="{{ 1200 | divided_by: section.settings.image.aspect_ratio }}" 
  srcset="
    {{ section.settings.image | image_url: width: 400 }} 400w,
    {{ section.settings.image | image_url: width: 800 }} 800w,
    {{ section.settings.image | image_url: width: 1200 }} 1200w
  "
>

{% comment %} REUSABLE SNIPPET RENDERING {% endcomment %}
{% render 'card-product', product: product, show_vendor: true %}

{% comment %} CONDITIONAL TRANSLATION {% endcomment %}
{{ 'products.product.add_to_cart' | t }}`
  },
  {
    id: "templates-json",
    title: "JSON Templates & Section Groups",
    category: "os2",
    summary: "OS 2.0 allows merchants to add, remove, and reorder sections on any page.",
    snippet: `{
  "sections": {
    "announcement": { "type": "announcement-bar" },
    "hero": {
      "type": "hero-banner",
      "settings": { "heading": "E-sellers Pro Launch" }
    },
    "grid": {
      "type": "featured-collection",
      "settings": { "products_to_show": 4 }
    }
  },
  "order": ["announcement", "hero", "grid"]
}`
  }
];
