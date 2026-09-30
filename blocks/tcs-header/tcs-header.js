export default function decorate(block) {
  const rows = [...block.children];
  const fields = rows.length === 1 && rows[0].children.length >= 4
    ? [...rows[0].children]
    : rows;
  const fieldClasses = [
    'tcs-header-tcs-logo',
    'tcs-header-tata-logo',
    'tcs-header-language-value',
    'tcs-header-menu',
  ];

  fields.slice(0, fieldClasses.length).forEach((field, index) => {
    field.classList.add(fieldClasses[index]);
  });

  const [tcsLogo, tataLogo] = fields;

  const brand = document.createElement('div');
  brand.className = 'tcs-header-brand';

  if (tcsLogo) {
    const tcsLink = document.createElement('a');
    tcsLink.href = 'https://www.tcs.com';
    tcsLink.target = '_blank';
    tcsLink.rel = 'noopener noreferrer';
    tcsLink.className = 'tcs-header-logo-link';
    tcsLink.setAttribute('aria-label', 'TCS Home');
    tcsLink.append(tcsLogo);
    brand.append(tcsLink);
  }

  if (tataLogo) {
    const tataLink = document.createElement('a');
    tataLink.href = 'https://www.tata.com';
    tataLink.target = '_blank';
    tataLink.rel = 'noopener noreferrer';
    tataLink.className = 'tcs-header-logo-link';
    tataLink.setAttribute('aria-label', 'Tata Website');
    tataLink.append(tataLogo);
    brand.append(tataLink);
  }

  block.prepend(brand);

  const languageField = block.querySelector('.tcs-header-language-value');
  const languageLabel = languageField?.textContent.trim() || 'Global (EN)';
  languageField?.remove();

  const language = document.createElement('div');
  language.className = 'tcs-header-language-select';
  language.innerHTML = `<button type="button" class="tcs-header-language-button" aria-expanded="false">${languageLabel}</button>`;
  language.querySelector('button').addEventListener('click', (e) => {
    const expanded = e.currentTarget.getAttribute('aria-expanded') === 'true';
    e.currentTarget.setAttribute('aria-expanded', expanded ? 'false' : 'true');
  });

  const menu = block.querySelector('.tcs-header-menu');
  menu?.setAttribute('aria-expanded', 'false');

  const hamburger = document.createElement('button');
  hamburger.type = 'button';
  hamburger.className = 'tcs-header-hamburger';
  hamburger.setAttribute('aria-expanded', 'false');
  hamburger.setAttribute('aria-label', 'Open menu');
  hamburger.innerHTML = '<span class="tcs-header-hamburger-icon"></span>';
  hamburger.addEventListener('click', () => {
    const expanded = hamburger.getAttribute('aria-expanded') === 'true';
    hamburger.setAttribute('aria-expanded', expanded ? 'false' : 'true');
    hamburger.setAttribute('aria-label', expanded ? 'Open menu' : 'Close menu');
    menu?.setAttribute('aria-expanded', expanded ? 'false' : 'true');
  });

  const tools = document.createElement('div');
  tools.className = 'tcs-header-tools';
  tools.append(language, hamburger);
  block.append(tools);
}
