export default function decorate(block) {
  const rows = Array.from(block.children);

  if (!rows.length) return;

  const heading = rows[0]?.textContent?.trim() || '';
  const stats = [];

  rows.slice(1).forEach((row) => {
    const children = Array.from(row.children);

    if (children.length >= 2) {
      const title = children[0]?.textContent?.trim() || '';
      const value = children[1]?.textContent?.trim() || '';

      if (title || value) {
        stats.push({ title, value });
      }
      return;
    }

    const text = row.textContent?.trim() || '';
    if (text) {
      stats.push({ title: text, value: '' });
    }
  });

  block.innerHTML = `
    <div class="statistics-list-wrapper">
      <div class="statistics-content">
        <h2 class="statistics-heading">${heading}</h2>
        <div class="statistics-grid">
          ${stats.map(({ title, value }) => `
            <div class="statistics-item">
              <div class="stat-title">${title}</div>
              <div class="stat-value">${value}</div>
            </div>
          `).join('')}
        </div>
      </div>
    </div>
  `;
}
