import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

function getFieldValue(row, index) {
  return row.children[index]?.textContent.trim() || '';
}

function setVariation(row, item) {
  const variation = getFieldValue(row, 3).toLowerCase();
  item.classList.add(variation === 'graphic' ? 'tcs-cards-card-graphic' : 'tcs-cards-card-article');
}

export default function decorate(block) {
  const list = document.createElement('ul');
  list.className = 'tcs-cards-list';

  [...block.children].forEach((row) => {
    const item = document.createElement('li');
    item.className = 'tcs-cards-card';
    moveInstrumentation(row, item);
    setVariation(row, item);

    const cells = [...row.children];
    const imageCell = cells[0];
    const contentCell = cells[2] || cells[1];
    const image = imageCell?.querySelector('picture > img');

    if (image && item.classList.contains('tcs-cards-card-article')) {
      const picture = createOptimizedPicture(image.src, image.alt, false, [{ width: '750' }]);
      moveInstrumentation(image, picture.querySelector('img'));
      const media = document.createElement('div');
      media.className = 'tcs-cards-card-image';
      media.append(picture);
      item.append(media);
    }

    const content = document.createElement('div');
    content.className = 'tcs-cards-card-content';
    while (contentCell?.firstElementChild) content.append(contentCell.firstElementChild);

    if (item.classList.contains('tcs-cards-card-graphic') && image) {
      item.style.setProperty('--tcs-cards-graphic-image', `url("${image.src.replace(/["\\]/g, '\\$&')}")`);
    }

    item.append(content);
    list.append(item);
  });

  block.replaceChildren(list);
}
