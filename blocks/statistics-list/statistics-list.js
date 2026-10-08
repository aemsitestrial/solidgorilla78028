import { moveInstrumentation } from '../../scripts/scripts.js';

const getText = (node) => {
  if (!node) return '';
  return (node.textContent || '').replace(/\s+/g, ' ').trim();
};

const getField = (row, name, index) => {
  const selector = `[data-aue-prop="${name}"]`;
  return (row.matches(selector) ? row : row.querySelector(selector))
    || row.children[index]
    || null;
};

const getStatisticRows = (row) => {
  const childRows = Array.from(row.children || []);
  const hasFieldMarkers = row.matches('[data-aue-prop="title"], [data-aue-prop="value"]')
    || row.querySelector('[data-aue-prop="title"], [data-aue-prop="value"]');

  if (hasFieldMarkers || row.children.length >= 2) return [row];
  if (childRows.length === 1 && childRows[0].children.length >= 2) return childRows;
  if (childRows.length > 1 && childRows.every((child) => child.children.length >= 2)) {
    return childRows;
  }
  return [];
};

const readStats = (block) => {
  const children = Array.from(block.children || []);
  const statistics = children.flatMap(getStatisticRows);
  const headingRow = children.find((row) => row.matches('[data-aue-prop="text"]')
    || row.querySelector('[data-aue-prop="text"]'))
    || children.find((row) => !getStatisticRows(row).length);
  const heading = headingRow?.firstElementChild || headingRow;
  const rawStats = [];

  statistics.forEach((row) => {
    const titleField = getField(row, 'title', 0);
    const valueField = getField(row, 'value', 1);
    const title = getText(titleField) || (!valueField ? getText(row) : '');
    const value = getText(valueField);

    if (title || value) {
      rawStats.push({ source: row, title, value });
    }
  });

  return { heading, stats: rawStats };
};

export default function decorate(block) {
  const { heading, stats } = readStats(block);

  if (!getText(heading) && !stats.length) return;

  const wrapper = document.createElement('div');
  wrapper.className = 'statistics-list-wrapper';

  const content = document.createElement('div');
  content.className = 'statistics-content';

  if (getText(heading)) {
    const headingElement = document.createElement('div');
    headingElement.className = 'statistics-heading';
    headingElement.setAttribute('role', 'heading');
    headingElement.setAttribute('aria-level', '2');

    const headingParagraph = heading.children.length === 1
      && heading.firstElementChild.tagName === 'P'
      ? heading.firstElementChild
      : heading;
    Array.from(headingParagraph.childNodes).forEach((node) => {
      headingElement.append(node.cloneNode(true));
    });

    content.append(headingElement);
  }

  const grid = document.createElement('div');
  grid.className = 'statistics-grid';
  stats.forEach(({ source, title, value }) => {
    const item = document.createElement('div');
    item.className = 'statistics-item';
    moveInstrumentation(source, item);

    const titleElement = document.createElement('div');
    titleElement.className = 'stat-title';
    titleElement.textContent = title;

    const valueElement = document.createElement('div');
    valueElement.className = 'stat-value';
    valueElement.textContent = value;

    item.append(titleElement, valueElement);
    grid.append(item);
  });

  content.append(grid);
  wrapper.append(content);
  block.replaceChildren(wrapper);
}
