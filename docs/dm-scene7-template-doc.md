# DM Scene7 Template Block

## Overview

The DM Scene7 Template block is used to render a Dynamic Media Scene7 image template as a standard responsive image. It is designed for static image assets, not for video playback.

The rendering logic is implemented in `blocks/dm-scene7-template/dm-scene7-template.js`.

---

## What it does

The block accepts a Scene7 image URL and optional alt text. It validates that the URL is a real Dynamic Media Scene7 image template URL and then creates a plain `<img>` element.

It does not create:
- an iframe
- a video player
- a media SDK loader
- custom animation behavior

It simply renders a responsive image.

---

## Supported URL Pattern

The URL must match the Scene7 image pattern:

```text
https://<host>.scene7.com/is/image/<asset-path>?wid=...&hei=...&qlt=...&fmt=...
```

Examples:

```text
https://s7d1.scene7.com/is/image/S7learn/backpack?wid=1600&hei=900&qlt=80&fmt=jpg
https://s7d1.scene7.com/is/image/S7learn/backpack?wid=1000&hei=1000&qlt=85&fmt=jpeg
https://s7d1.scene7.com/is/image/S7learn/backpack?wid=800&hei=500&qlt=75&fmt=png
https://s7d1.scene7.com/is/image/S7learn/backpack?wid=800&hei=500&qlt=75&fmt=webp
```

The validation logic checks:
- the pathname contains `/is/image/`

If the URL does not contain `/is/image/`, the block will not render.

---

## Block Fields

The block contains two fields:

- `image`: the full Scene7 template URL
- `imageAlt`: alt text for accessibility

---

## End-to-End Flow

1. Author pastes a full Scene7 image URL into the `image` field.
2. Optional alt text is added into `imageAlt`.
3. The module reads the value from the authoring field or the first row content.
4. It validates the URL to confirm it is a valid Scene7 `/is/image/` URL.
5. It creates a standard HTML `<img>` tag.
6. It sets the `src`, `alt`, `loading`, and `decoding` attributes.
7. It appends the image to the block.

---

## Rendering Behavior

The block renders a plain image element and not a video or player. The CSS makes the image responsive:

```css
.dm-scene7-template.block img {
  display: block;
  width: 100%;
  height: auto;
}
```

This means it behaves like a regular image banner or product graphic.

---

## Example Content

### Example 1: Hero banner

```text
Image: https://s7d1.scene7.com/is/image/S7learn/backpack?wid=1600&hei=900&qlt=80&fmt=jpg
Alt: Hero banner
```

Result: The image appears as a wide banner on the page.

### Example 2: Product image

```text
Image: https://s7d1.scene7.com/is/image/S7learn/backpack?wid=800&hei=800&qlt=85&fmt=png
Alt: Product shot
```

Result: The image appears as a product image inside a card or gallery section.

### Example 3: Invalid example

```text
Image: https://youtu.be/FB83Lk5KDxo?si=JGZUY_ipfZvxW1Nm
Alt: Demo video
```

Result: This is not a Scene7 `/is/image/` URL, so it will not render in this block.

---

## Summary

The DM Scene7 Template block is a static image renderer for Dynamic Media Scene7 assets. It is meant for banners, product images, and editorial graphics. The URL must be a valid Dynamic Media `/is/image/` URL, and the block outputs a responsive image element with alt text.

Use this block for still images only. Use the DM Video block for video playback.
