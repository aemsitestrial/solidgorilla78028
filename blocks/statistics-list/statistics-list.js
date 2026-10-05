const getText = (node) => {
  if (!node) return '';
  return (node.textContent || '').replace(/\s+/g, ' ').trim();
};

export default function decorate(block) {
  const rows = Array.from(block.children || []);

  if (!rows.length) return;

  const heading = getText(rows[0]) || '';
  const stats = [];

  rows.slice(1).forEach((row) => {
    const directItems = Array.from(row.children || []);

    if (directItems.length) {
      directItems.forEach((item) => {
        const title = getText(item.children[0]) || getText(item);
        const value = getText(item.children[1]) || '';

        if (title || value) {
          stats.push({ title, value });
        }
      });
      return;
    }

    const text = getText(row);
    if (text) {
      stats.push({ title: text, value: '' });
    }
  });

  if (!stats.length && heading) {
    stats.push({ title: '', value: heading });
  }

  block.innerHTML = `
    <div class="statistics-list-wrapper">
      <div class="statistics-content">
        <h2 class="statistics-heading">${heading}</h2>
        <div class="statistics-grid">
          ${stats.map(({ title, value }) => `
            <div class="statistics-item">
              ${title ? `<div class="stat-title">${title}</div>` : ''}
              ${value ? `<div class="stat-value">${value}</div>` : ''}
            </div>
          `).join('')}
        </div>
      </div>
    </div>
  `;
}
