const prefersReducedMotion = window.matchMedia(
  '(prefers-reduced-motion: reduce)',
);

function getFirstUrlFromText(text) {
  if (!text) return '';

  const match = text.match(
    /https?:\/\/[^\s<>"']+/i,
  );

  return match ? match[0] : '';
}

function isTruthy(value) {
  return ['true', '1', 'yes', 'on', 'autoplay']
    .includes(
      String(value || '')
        .trim()
        .toLowerCase(),
    );
}

function getBooleanFromRow(row) {
  if (!row) return false;

  const checkbox = row.querySelector(
    'input[type="checkbox"]',
  );

  if (checkbox) return checkbox.checked;

  const ariaChecked = row
    .querySelector('[aria-checked]')
    ?.getAttribute('aria-checked');

  if (ariaChecked) {
    return isTruthy(ariaChecked);
  }

  return isTruthy(row.textContent);
}

function getAuthoredBoolean(
  block,
  propName,
  positionalRow,
) {
  const ueRow = block.querySelector(
    `[data-aue-prop="${propName}"]`,
  );

  if (ueRow) {
    return getBooleanFromRow(ueRow);
  }

  return getBooleanFromRow(positionalRow);
}

function getFieldValue(
  block,
  propName,
  fallback = '',
) {
  const field = block.querySelector(
    `[data-aue-prop="${propName}"]`,
  );

  if (!field) return fallback;

  const input = field.querySelector('input');

  if (input) {
    return input.value;
  }

  return field.textContent?.trim() || fallback;
}

function getNumberField(block, propName) {
  const value = getFieldValue(
    block,
    propName,
  );

  if (!value) return null;

  const number = Number(value);

  return Number.isNaN(number)
    ? null
    : number;
}

function getUrlFromRow(row) {
  if (!row) return '';

  const anchor = row.querySelector('a[href]');

  if (anchor?.href) {
    return anchor.href;
  }

  const image = row.querySelector('img[src]');

  if (image?.src) {
    return image.src;
  }

  return getFirstUrlFromText(
    row.textContent?.trim(),
  );
}

function getPosterUrlFromRow(row) {
  if (!row) return '';

  const pictureImg = row.querySelector(
    'picture img[src]',
  );

  if (pictureImg?.src) {
    return pictureImg.src;
  }

  return getUrlFromRow(row);
}

function resolveDmVideoDelivery(
  rawUrl,
) {
  try {
    const url = new URL(
      rawUrl,
      window.location.href,
    );

    const path = url.pathname;

    if (/\/play\/?$/i.test(path)) {
      return {
        href: url.href,
        mode: 'iframe',
      };
    }

    if (
      /\.(mp4|webm|ogg|ogv)(\?|$)/i.test(
        path,
      )
    ) {
      return {
        href: url.href,
        mode: 'progressive',
      };
    }

    return {
      href: rawUrl,
      mode: 'progressive',
    };
  } catch (e) {
    return {
      href: rawUrl,
      mode: 'progressive',
    };
  }
}

function withPlaybackParams(
  rawUrl,
  autoplay,
  loop,
) {
  try {
    const url = new URL(
      rawUrl,
      window.location.href,
    );

    if (autoplay) {
      url.searchParams.set(
        'autoplay',
        '1',
      );
      url.searchParams.set(
        'muted',
        '1',
      );
      url.searchParams.set(
        'playsinline',
        '1',
      );
    }

    if (loop) {
      url.searchParams.set(
        'loop',
        '1',
      );
    }

    return url.href;
  } catch (e) {
    return rawUrl;
  }
}

function getMimeTypeFromUrl(url) {
  const lower = url.toLowerCase();

  if (lower.includes('.mp4')) {
    return 'video/mp4';
  }

  if (lower.includes('.webm')) {
    return 'video/webm';
  }

  if (
    lower.includes('.ogg')
    || lower.includes('.ogv')
  ) {
    return 'video/ogg';
  }

  return '';
}

export default function decorate(
  block,
) {
  const rows = [...block.children];

  const thumbnailUrl = getPosterUrlFromRow(rows[0]);

  const rawVideoUrl = getUrlFromRow(rows[1]);

  const autoplay = getAuthoredBoolean(
    block,
    'autoplay',
    rows[2],
  )
    && !prefersReducedMotion.matches;

  const loop = getAuthoredBoolean(
    block,
    'loop',
    rows[3],
  );

  const controls = getAuthoredBoolean(
    block,
    'controls',
    rows[4],
  );

  const muted = getAuthoredBoolean(
    block,
    'muted',
    rows[5],
  );

  const videoTitle = getFieldValue(
    block,
    'videoTitle',
    'Video',
  );

  const captionsUrl = getFieldValue(
    block,
    'captionsUrl',
  );

  const aspectRatio = getFieldValue(
    block,
    'aspectRatio',
    '16:9',
  );

  const fullWidth = getAuthoredBoolean(
    block,
    'fullWidth',
  );

  const startTime = getNumberField(
    block,
    'startTime',
  );

  const endTime = getNumberField(
    block,
    'endTime',
  );

  const showDownload = getAuthoredBoolean(
    block,
    'showDownload',
  );

  if (!rawVideoUrl) {
    return;
  }

  const {
    href: videoHref,
    mode,
  } = resolveDmVideoDelivery(
    rawVideoUrl,
  );

  block.textContent = '';

  if (fullWidth) {
    block.classList.add(
      'full-width',
    );
  }

  switch (aspectRatio) {
    case '4:3':
      block.classList.add(
        'aspect-4-3',
      );
      break;

    case '1:1':
      block.classList.add(
        'aspect-1-1',
      );
      break;

    case '21:9':
      block.classList.add(
        'aspect-21-9',
      );
      break;

    default:
      break;
  }

  if (mode === 'iframe') {
    const wrap = document.createElement(
      'div',
    );

    wrap.className = 'dm-video-iframe-wrap';

    const iframe = document.createElement(
      'iframe',
    );

    iframe.className = 'dm-video-iframe';

    iframe.src = autoplay || loop
      ? withPlaybackParams(
        videoHref,
        autoplay,
        loop,
      )
      : videoHref;

    iframe.title = videoTitle;

    iframe.loading = 'lazy';

    iframe.allowFullscreen = true;

    iframe.setAttribute(
      'allow',
      'accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture',
    );

    wrap.append(iframe);

    block.append(wrap);

    return;
  }

  const video = document.createElement(
    'video',
  );

  video.className = 'dm-video-player';

  video.controls = controls;

  video.preload = 'none';

  video.loop = loop;

  video.playsInline = true;

  video.muted = muted || autoplay;

  video.setAttribute(
    'aria-label',
    videoTitle,
  );

  if (autoplay) {
    video.autoplay = true;
  }

  if (thumbnailUrl) {
    video.poster = thumbnailUrl;
  }

  const source = document.createElement(
    'source',
  );

  source.src = videoHref;

  const mimeType = getMimeTypeFromUrl(
    videoHref,
  );

  if (mimeType) {
    source.type = mimeType;
  }

  video.append(source);

  if (captionsUrl) {
    const track = document.createElement(
      'track',
    );

    track.kind = 'captions';

    track.label = 'English';

    track.srclang = 'en';

    track.src = captionsUrl;

    video.append(track);
  }

  block.append(video);

  if (showDownload) {
    const link = document.createElement(
      'a',
    );

    link.className = 'dm-video-download';

    link.href = videoHref;

    link.download = '';

    link.textContent = 'Download Video';

    block.append(link);
  }

  if (startTime !== null) {
    video.addEventListener(
      'loadedmetadata',
      () => {
        video.currentTime = startTime;
      },
    );
  }

  if (endTime !== null) {
    video.addEventListener(
      'timeupdate',
      () => {
        if (
          video.currentTime
          >= endTime
        ) {
          video.pause();
        }
      },
    );
  }

  video.addEventListener(
    'play',
    () => {
      console.log(
        'dm-video-play',
      );
    },
  );

  video.addEventListener(
    'pause',
    () => {
      console.log(
        'dm-video-pause',
      );
    },
  );

  video.addEventListener(
    'ended',
    () => {
      console.log(
        'dm-video-complete',
      );
    },
  );
}
