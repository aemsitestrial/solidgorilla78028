# DM Video Block

## Overview

The DM Video block is used to render Dynamic Media video content in the Franklin site. It accepts a video URL and an optional thumbnail image, then automatically decides the best rendering method based on the URL type.

The rendering logic is implemented in `blocks/dm-video/dm-video.js` and is designed to support two main source types:

1. Dynamic Media `/play` URLs
2. Direct video file URLs such as `.mp4`, `.webm`, `.ogg`, and `.ogv`

---

## Supported URL Types

### 1) Dynamic Media /play URL

This format is used for Dynamic Media-managed video players.

Example:

```text
https://example.com/content/dam/brand/intro-video/play
```

Behavior:
- The block detects that the URL path ends with `/play`
- It renders the video using an iframe
- The full player URL is preserved, including query parameters
- The iframe wrapper is set to a responsive 16:9 layout

### 2) Direct video file URL

This format is used when the source is a direct video file.

Examples:

```text
https://www.w3schools.com/html/mov_bbb.mp4
https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.webm
https://cdn.example.com/videos/product-tour.ogg
https://cdn.example.com/videos/product-tour.ogv
```

Behavior:
- The block detects the media file extension
- It renders the content using a native HTML5 `<video>` element
- It adds built-in controls
- It sets the optional poster image if provided
- It inserts a fallback link for browsers that cannot play the media inline

---

## Block Fields

The block uses the following fields:

- `thumbnail`: optional poster image
- `videoUrl`: required video URL
- `autoplay`: optional toggle to start playback automatically

This is defined in the component model and the block metadata.

---

## Runtime Decision Logic

The block decides how to render the video using the URL path:

- If the URL ends with `/play`, it uses iframe mode
- If the URL ends with a supported video extension, it uses native video mode
- For Dynamic Media asset URLs using `/as/...mp4`, it removes some non-essential query parameters before rendering
- If `autoplay` is enabled, native videos are muted and set to autoplay; `/play` iframe URLs receive autoplay-related query parameters

This behavior is implemented in `resolveDmVideoDelivery()` inside `blocks/dm-video/dm-video.js`.

---

## Examples for Authors

### Example A: Dynamic Media video

```text
Thumbnail: https://images.example.com/thumbs/intro.jpg
Video URL: https://example.com/content/dam/brand/intro-video/play
```

Result:
- Iframe-based Dynamic Media player
- Responsive layout
- Full DM experience

### Example B: MP4 video

```text
Thumbnail: https://images.example.com/thumbs/product-tour.jpg
Video URL: https://cdn.example.com/videos/product-tour.mp4
```

Result:
- Native browser video player
- Video controls visible
- Poster image displayed before playback

### Example C: WebM video

```text
Thumbnail: https://images.example.com/thumbs/demo.jpg
Video URL: https://cdn.example.com/videos/demo.webm
```

Result:
- Native browser video player
- Supported in browsers that accept WebM

### Example D: OGG video

```text
Thumbnail: https://images.example.com/thumbs/summary.jpg
Video URL: https://cdn.example.com/videos/summary.ogg
```

Result:
- Native browser video player
- Playback depends on browser compatibility

---

## Unsupported URL Types

This block does not support typical third-party embedding URLs such as YouTube links.

Example of unsupported URL:

```text
https://youtu.be/FB83Lk5KDxo?si=JGZUY_ipfZvxW1Nm
```

This does not match the accepted patterns for either:
- Dynamic Media `/play` URLs
- Direct video file URLs

Therefore, it is not valid for this block without a separate embed implementation.

---

## Summary

The DM Video block supports multiple media sources, but only those that fit one of the expected patterns:

- a Dynamic Media URL ending in `/play`
- a direct file URL ending in `.mp4`, `.webm`, `.ogg`, or `.ogv`

The component automatically chooses the correct renderer so authors can reuse one block for multiple video delivery approaches.
