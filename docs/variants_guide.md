# Developer Guide: Flat Variants & Dynamic SKU System

This guide explains how the flat product variant system is managed, from the database schema and backend APIs down to the frontend forms, selectors, and state layers.

---

## 🧭 System Overview

Different products require different variant configurations:
* **Clothing:** Configured with `Color` (each with color-specific photos) and `Size` combinations.
* **Footwear:** Only configured with `Size` values.
* **Textiles:** Configured with `Fabric` (e.g. Cotton, Linen), `Color`, and `Size` combinations.

To support all these configurations dynamically under a single database model, we implemented a **Flat Cartesian SKU Matrix with Dynamic Option Extraction**.

```
                +-----------------------+
                |    Variants Matrix    |
                | [Red-S, White-M, ...] |
                +-----------+-----------+
                            |
                            v Dynamic Extraction (getOptionsFromVariants)
                +-----------+-----------+
                |   Derived Option Set  |
                |   [Color, Size, ...]  |
                +-----------------------+
```

---

## 💾 1. Backend Layer

### Database Schema (`product.model.js`)

We defined all properties inline directly in the `Product` model schema to avoid external `priceSchema` and `imageSchema` sub-models:

1. **Inline structures**: Both `price` and `images` are specified inline using fields directly.
2. **`variants`**: A flat array representing active variant combinations. Each variant combination carries its own `attributes` Map, `stock` count, optional inline `price` override, and variant-specific `images` gallery.

```javascript
// models/product.model.js

const productSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true,
        enum: ['SHIRTS', 'DENIM', 'ACCESSORIES', 'ESSENTIALS'],
        default: 'ESSENTIALS'
    },
    seller: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    price: {
        amount: {
            type: Number,
            required: true
        },
        currency: {
            type: String,
            required: true,
            enum: ['INR', 'USD', 'EUR', 'GBP'],
            default: 'INR'
        }
    },
    images: [
        {
            url: {
                type: String,
                required: true
            },
            fileId: {
                type: String
            }
        }
    ],
    hasVariants: {
        type: Boolean,
        default: false
    },
    stock: {
        type: Number,
        default: 0
    },
    variants: [
        {
            images: [
                {
                    url: {
                        type: String,
                        required: true
                    },
                    fileId: {
                        type: String
                    }
                }
            ],
            stock: {
                type: Number,
                default: 0
            },
            attributes: {
                type: Map,
                of: String
            },
            price: {
                amount: {
                    type: Number
                },
                currency: {
                    type: String,
                    enum: ['INR', 'USD', 'EUR', 'GBP']
                }
            }
        }
    ]
}, { timestamps: true });
```

---

### File Upload & Variant Image Mapping (`product.controller.js`)

Multer does not natively parse nested files inside objects in `multipart/form-data`. To upload color/variant-specific images in a single request, we use an index-mapping flow:

1. The frontend appends all new files (main images first, followed by variant-specific images) into a single flat array: `images`.
2. Each variant entry contains a list of `newImageIndices` representing the index of its images in the files array.
3. The backend uploads all files flat, receives their final URLs/IDs, and resolves the mapping indices:

```javascript
// controllers/product.controller.js
const parsedVariants = rawVariants.map(v => {
    const variantImages = [];
    if (v.images) variantImages.push(...v.images); // Keep existing
    if (v.newImageIndices) {
        v.newImageIndices.forEach(idx => {
            if (images[idx]) variantImages.push(images[idx]);
        });
    }
    return {
        attributes: v.attributes,
        stock: Number(v.stock) || 0,
        price: v.price ? { amount: Number(v.price.amount), currency: v.price.currency } : undefined,
        images: variantImages
    };
});
```

---

### Backend APIs (`product.routes.js`)

Variants are managed in bulk during product creation/update, or individually using dedicated REST endpoints:

* **Create / Update Product:**
  * `POST /api/product/create`
  * `PUT /api/product/update/:id`
* **Granular Variant CRUD (Uses Mongoose native subdocument `_id`):**
  * `POST /api/product/:id/variants` - Add a variant SKU.
  * `PUT /api/product/:id/variants/:variantId` - Adjust stock/price of a variant.
  * `DELETE /api/product/:id/variants/:variantId` - Remove a variant SKU.

---

## 🏗️ 2. Seller Forms Integration (`CreateProduct.jsx` & `EditProduct.jsx`)

The forms contain a dedicated **Inventory & Variants** section:

1. **Toggle:** If checked, displays the variants designer; otherwise, displays a single "Product Stock Qty" input.
2. **Options Tags Builder:** Let sellers select standard options (`Color`, `Size`, `Fabric`) or enter custom names, then type values (e.g. `Red`, `White`) which render as badge pills.
3. **Cartesian Generator:** Whenever options/tags change, a `useEffect` automatically computes all possible combinations and merges them with the current state to preserve already typed stock/price values.
4. **Row Deletion (Dependent Variants):** Sellers can delete specific rows from the combinations table. For instance, removing `White - S` signifies that size `S` is not made in `White`, establishing a **dependent relationship**.
5. **Color Galleries:** Dynamically displays a file upload zone for every color added. Previews uploaded files locally before submission and maps them to all variants of that color.

---

## 🛍️ 3. Buyer Selection Flow (`ProductDetails.jsx`)

When a buyer visits a product detail view, the page handles variant selection dynamically:

### Dynamic Options Extraction
Since options are not stored as a separate schema array in the DB, the buyer page extracts them dynamically from the active `variants` list on load:

```javascript
const getOptionsFromVariants = (variantsList) => {
    const optionsMap = {};
    variantsList.forEach(v => {
        const attrs = v.attributes || {};
        const entries = attrs instanceof Map ? Array.from(attrs.entries()) : Object.entries(attrs);
        entries.forEach(([key, val]) => {
            if (!optionsMap[key]) optionsMap[key] = new Set();
            optionsMap[key].add(val);
        });
    });
    return Object.entries(optionsMap).map(([name, set]) => ({
        name,
        values: Array.from(set)
    }));
};
```

### Dynamic Color Image Extraction
Color galleries are extracted dynamically by looking up the first variant matching a color value that contains images:

```javascript
const getResolvedColorImages = () => {
    const extracted = [];
    const colorOption = resolvedOptions.find(o => o.name.toLowerCase() === 'color');
    if (colorOption) {
        colorOption.values.forEach(color => {
            const match = singleProduct.variants.find(v => {
                const attrs = v.attributes || {};
                const entries = attrs instanceof Map ? Array.from(attrs.entries()) : Object.entries(attrs);
                const colorEntry = entries.find(([k]) => k.toLowerCase() === 'color');
                return colorEntry && colorEntry[1] === color && v.images?.length > 0;
            });
            if (match) extracted.push({ color, images: match.images });
        });
    }
    return extracted;
};
```

### Dependent Options Disabling
To prevent users from selecting non-existent combinations, we evaluate selections on every click:

```javascript
const getOptionValueState = (optionName, optionValue) => {
    // 1. Form a hypothetical selection
    const hypSelections = { ...selectedOptions, [optionName]: optionValue };
    
    // 2. Check if a combination matching this hypothesis exists in the database
    const matches = singleProduct.variants.filter(v => 
        Object.entries(hypSelections).every(([key, val]) => {
            const attrs = v.attributes || {};
            const attrVal = attrs[key] || (typeof attrs.get === 'function' ? attrs.get(key) : null);
            return attrVal === val;
        })
    );
    
    if (matches.length === 0) return 'unavailable'; // Disables button (line-through)
    
    const hasStock = matches.some(v => v.stock > 0);
    return hasStock ? 'available' : 'out-of-stock'; // Renders out-of-stock warning
};
```

### Image Gallery Swapping
We resolve the gallery images dynamically:
1. If the selected color has images in `resolvedColorImages`, use them.
2. If the active variant has its own images, use them.
3. Otherwise, fall back to the base product `images`.
*Whenever the resolved gallery changes, `activeImageIndex` is reset to `0` to prevent out-of-bounds crashes.*

### Price & Stock Overrides
* **Price:** Checks if the active combination has a `price` override; otherwise, displays the base product price.
* **Stock & CTA:** If the chosen configuration has `stock === 0`, the quantity counter disables, the CTA button changes to `Sold Out`, and the "Add to Bag" action is blocked.
