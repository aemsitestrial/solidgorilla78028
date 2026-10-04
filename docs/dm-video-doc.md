# DM Video

Enter a supported video URL, then set the optional fields in Universal Editor.

## Fields

| Field | Authored value | Default |
| --- | --- | --- |
| `thumbnail` | Poster image URL, or leave empty | Empty |
| `videoUrl` | Required URL ending in `/play`, `.mp4`, `.webm`, `.ogg`, or `.ogv` | None |
| `autoplay` | `true` or `false` | `false` |
| `loop` | `true` or `false` | `false` |
| `controls` | `true` or `false` | `true` |
| `muted` | `true` or `false` | `false` |

## Source Variations

Use these values for the `videoUrl` field. The other fields can be set independently as shown below.

| Type | Authored `videoUrl` | Result |
| --- | --- | --- |
| Dynamic Media player | `https://media.example.com/content/dam/intro/play` | Responsive iframe player |
| MP4 | `https://media.example.com/videos/intro.mp4` | Native video player |
| WebM | `https://media.example.com/videos/intro.webm` | Native video player |
| OGG | `https://media.example.com/videos/intro.ogg` | Native video player |
| OGV | `https://media.example.com/videos/intro.ogv` | Native video player |

## Playback Variations

Example values for a native video (`videoUrl: https://media.example.com/videos/intro.mp4`):

| Variation | `thumbnail` | `autoplay` | `loop` | `controls` | `muted` |
| --- | --- | --- | --- | --- | --- |
| Standard player | `https://media.example.com/images/intro.jpg` | `false` | `false` | `true` | `false` |
| Autoplay | `https://media.example.com/images/intro.jpg` | `true` | `false` | `true` | `false` |
| Autoplay and loop | `https://media.example.com/images/intro.jpg` | `true` | `true` | `true` | `false` |
| Loop only | `https://media.example.com/images/intro.jpg` | `false` | `true` | `true` | `false` |
| Muted player | `https://media.example.com/images/intro.jpg` | `false` | `false` | `true` | `true` |
| No controls | Leave empty | `false` | `false` | `false` | `false` |
| Muted, no controls | Leave empty | `false` | `false` | `false` | `true` |

The four toggles are independent and can be combined. For `/play` URLs, `autoplay` and `loop` are passed to the embedded player. `thumbnail`, `muted`, and `controls` configure native video only. Autoplay is suppressed when the visitor has enabled reduced motion. Autoplayed native video is muted automatically.

YouTube and other third-party embed links are not supported by this block.