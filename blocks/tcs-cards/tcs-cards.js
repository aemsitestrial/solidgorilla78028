import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

function getField(row, index) {
  return row.children[index] || null;
}

function getText(row, index) {
  return getField(row, index)?.textContent.trim() || '';
}

function createGraphicBackground(row, item) {
  const backgroundColor = getText(row, 11);
  const backgroundImage = getField(row, 12)?.querySelector('picture > img');

  if (backgroundColor) item.style.setProperty('--tcs-cards-card-background', backgroundColor);
  if (backgroundColor.toLowerCase() === '#ffffff') item.classList.add('tcs-cards-card-graphic-light');

  if (backgroundImage) {
    const picture = createOptimizedPicture(backgroundImage.src, backgroundImage.alt, false, [{ width: '750' }]);
    moveInstrumentation(backgroundImage, picture.querySelector('img'));
    picture.className = 'tcs-cards-card-background-image';
    item.append(picture);
  }
}

export default function decorate(block) {
  const list = document.createElement('ul');
  list.className = 'tcs-cards-list';

  [...block.children].forEach((row) => {
    const item = document.createElement('li');
    item.className = 'tcs-cards-card';
    moveInstrumentation(row, item);

    const variation = getText(row, 0).toLowerCase();
    const isGraphic = variation === 'graphic';
    item.classList.add(isGraphic ? 'tcs-cards-card-graphic' : 'tcs-cards-card-article');

    const image = getField(row, 1)?.querySelector('picture > img');
    if (image && !isGraphic) {
      const picture = createOptimizedPicture(image.src, image.alt, false, [{ width: '750' }]);
      moveInstrumentation(image, picture.querySelector('img'));
      const media = document.createElement('div');
      media.className = 'tcs-cards-card-image';
      media.append(picture);
      item.append(media);
    }

    if (isGraphic) createGraphicBackground(row, item);

    const content = document.createElement('div');
    content.className = 'tcs-cards-card-content';

    const metadata = document.createElement('div');
    metadata.className = 'tcs-cards-card-metadata';
    [getText(row, 3), getText(row, 4), getText(row, 5)].forEach((value, index) => {
      if (!value) return;
      const label = document.createElement('span');
      label.textContent = value;
      if (index === 0) label.className = 'tcs-cards-card-category';
      if (index === 1) label.className = 'tcs-cards-card-tag';
      if (index === 2) label.className = 'tcs-cards-card-read-time';
      metadata.append(label);
    });
    if (metadata.childElementCount) content.append(metadata);

    if (!isGraphic && getText(row, 6)) {
      const date = document.createElement('p');
      date.className = 'tcs-cards-card-date';
      date.textContent = `Published ${getText(row, 6)}`;
      content.append(date);
    }

    const title = getText(row, 7);
    if (title) {
      const heading = document.createElement('h3');
      heading.textContent = title;
      content.append(heading);
    }

    const summaryField = getField(row, 8);
    if (!isGraphic && summaryField?.textContent.trim()) {
      const summary = document.createElement('div');
      summary.className = 'tcs-cards-card-summary';
      while (summaryField.firstChild) summary.append(summaryField.firstChild);
      content.append(summary);
    }

    const ctaLabel = getText(row, 9);
    const ctaLink = getText(row, 10);
    if (ctaLabel && ctaLink) {
      const cta = document.createElement('a');
      cta.className = 'tcs-cards-card-cta';
      cta.href = ctaLink;
      cta.textContent = ctaLabel;
      content.append(cta);
    }

    item.append(content);
    list.append(item);
  });

  block.replaceChildren(list);
}
