export default function decorate(block) {
  const rows = [...block.children];

  if (!rows.length) return;

  const heading = rows[0]?.textContent?.trim();

  block.innerHTML = '';

  const wrapper = document.createElement('div');
  wrapper.className = 'statistics-list-wrapper';

  const content = document.createElement('div');
  content.className = 'statistics-content';

  const title = document.createElement('h2');
  title.className = 'statistics-heading';
  title.textContent = heading;

  content.append(title);

  const statsGrid = document.createElement('div');
  statsGrid.className = 'statistics-grid';

  rows.slice(1).forEach((row) => {
    const cols = row.querySelectorAll('div');

    if (cols.length >= 2) {
      const item = document.createElement('div');
      item.className = 'statistics-item';

      const statTitle = document.createElement('div');
      statTitle.className = 'stat-title';
      statTitle.textContent = cols[0].textContent.trim();

      const statValue = document.createElement('div');
      statValue.className = 'stat-value';
      statValue.textContent = cols[1].textContent.trim();

      item.append(statTitle, statValue);
      statsGrid.append(item);
    }
  });

  content.append(statsGrid);
  wrapper.append(content);
  block.append(wrapper);
}
