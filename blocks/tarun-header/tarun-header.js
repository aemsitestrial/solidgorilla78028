/**
 * Safely extracts property values from Universal Editor dataset, attributes, or child elements
 */
function getProp(block, name, fallback = '') {
  const lower = name.toLowerCase();

  // 1. Direct dataset lookup
  if (block.dataset[name] !== undefined) return block.dataset[name];
  if (block.dataset[lower] !== undefined) return block.dataset[lower];

  // 2. data-aue-prop attribute lookup
  const attrElem = block.querySelector(`[data-aue-prop="${name}"], [data-aue-prop="${lower}"]`);
  if (attrElem) {
    const img = attrElem.querySelector('img');
    if (img) return img.src;
    const anchor = attrElem.querySelector('a');
    if (anchor) return anchor.getAttribute('href') || anchor.textContent.trim();
    return attrElem.dataset.value || attrElem.getAttribute('value') || attrElem.textContent.trim();
  }

  // 3. Fallback table row scanning
  const rows = [...block.children];
  const matchingRow = rows.find((row) => {
    const cols = [...row.children];
    if (cols.length < 2) {
      return false;
    }

    const key = cols[0].textContent.trim().toLowerCase().replace(/[-_]/g, '');
    return key === lower.replace(/[-_]/g, '');
  });

  if (!matchingRow) {
    return fallback;
  }

  const cols = [...matchingRow.children];
  const cell = cols[1];
  const img = cell.querySelector('img');
  if (img) return img.src;
  const anchor = cell.querySelector('a');
  if (anchor) return anchor.getAttribute('href') || anchor.textContent.trim();
  return cell.textContent.trim();
}

/**
 * Toggles mobile menu state and handles background scroll locks
 */
function toggleMobileMenu(nav, button, forceExpanded = null) {
  const isExpanded = forceExpanded !== null
    ? forceExpanded
    : nav.getAttribute('aria-expanded') !== 'true';

  nav.setAttribute('aria-expanded', isExpanded ? 'true' : 'false');
  button.setAttribute('aria-expanded', isExpanded ? 'true' : 'false');
  button.setAttribute('aria-label', isExpanded ? 'Close navigation' : 'Open navigation');

  document.body.style.overflowY = (isExpanded && window.innerWidth < 1024) ? 'hidden' : '';
}

/**
 * Parses authored navigation tree (from block lists or fallback links)
 */
function parseNavigationTree(block) {
  const ul = block.querySelector('ul');
  if (ul) return ul.cloneNode(true);

  // Fallback structure if no list is authored
  const navList = document.createElement('ul');
  const links = [...block.querySelectorAll('a')];
  links.forEach((a) => {
    const li = document.createElement('li');
    li.append(a.cloneNode(true));
    navList.append(li);
  });

  return navList;
}

/**
 * Main decorator for the self-contained Tarun Header block
 */
export default function decorate(block) {
  // 1. Extract Config & Props
  const config = {
    tcsLogo: getProp(block, 'tcsLogo'),
    tcsLogoLink: getProp(block, 'tcsLogoLink', '/'),
    tataLogo: getProp(block, 'tataLogo'),
    tataLogoLink: getProp(block, 'tataLogoLink', 'https://www.tata.com'),
    ctaLabel: getProp(block, 'ctaLabel'),
    ctaLink: getProp(block, 'ctaLink', '#'),
    ctaTarget: getProp(block, 'ctaTarget', '_self'),
    headerStyle: getProp(block, 'headerStyle', 'default').toLowerCase(),
  };

  const navTree = parseNavigationTree(block);

  // 2. Clear block markup
  block.textContent = '';
  if (config.headerStyle !== 'default') {
    block.classList.add(config.headerStyle);
  }

  // 3. Create Shell Elements
  const navWrapper = document.createElement('div');
  navWrapper.className = 'tarun-nav-wrapper';

  const nav = document.createElement('nav');
  nav.id = 'tarun-nav';
  nav.setAttribute('aria-expanded', 'false');

  // --- BRAND PRIMARY (TCS Logo) ---
  const brandPrimary = document.createElement('div');
  brandPrimary.className = 'nav-brand-primary';
  const primaryAnchor = document.createElement('a');
  primaryAnchor.href = config.tcsLogoLink;

  if (config.tcsLogo) {
    const img = document.createElement('img');
    img.src = config.tcsLogo;
    img.alt = 'Tata Consultancy Services';
    primaryAnchor.append(img);
  } else {
    primaryAnchor.textContent = 'TCS';
  }
  brandPrimary.append(primaryAnchor);

  // --- NAVIGATION SECTIONS ---
  const navSections = document.createElement('div');
  navSections.className = 'nav-sections';

  if (navTree) {
    // Process top-level list items and decorate submenus
    navTree.querySelectorAll(':scope > li').forEach((li) => {
      const childUl = li.querySelector('ul');
      if (childUl) {
        li.classList.add('nav-drop');
        li.setAttribute('aria-expanded', 'false');
        li.setAttribute('aria-haspopup', 'true');
        li.setAttribute('tabindex', '0');

        // Toggle dropdown on desktop click
        li.addEventListener('click', (e) => {
          if (window.innerWidth >= 1024) {
            const expanded = li.getAttribute('aria-expanded') === 'true';
            navTree.querySelectorAll('.nav-drop').forEach((d) => d.setAttribute('aria-expanded', 'false'));
            li.setAttribute('aria-expanded', expanded ? 'false' : 'true');
            e.stopPropagation();
          }
        });

        // Toggle on Keyboard Enter/Space
        li.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            const expanded = li.getAttribute('aria-expanded') === 'true';
            li.setAttribute('aria-expanded', expanded ? 'false' : 'true');
          }
        });
      }
    });
    navSections.append(navTree);
  }

  // --- UTILITIES & CTA ---
  const navUtilities = document.createElement('div');
  navUtilities.className = 'nav-utilities';

  if (config.ctaLabel) {
    const ctaBtn = document.createElement('a');
    ctaBtn.className = 'tarun-header-cta';
    ctaBtn.href = config.ctaLink;
    ctaBtn.textContent = config.ctaLabel;
    ctaBtn.target = config.ctaTarget;
    if (config.ctaTarget === '_blank') {
      ctaBtn.rel = 'noopener noreferrer';
    }
    navUtilities.append(ctaBtn);
  }

  // --- BRAND SECONDARY (TATA Logo) ---
  const brandSecondary = document.createElement('div');
  brandSecondary.className = 'nav-brand-secondary';
  const secondaryAnchor = document.createElement('a');
  secondaryAnchor.href = config.tataLogoLink;
  secondaryAnchor.target = '_blank';
  secondaryAnchor.rel = 'noopener noreferrer';

  if (config.tataLogo) {
    const img = document.createElement('img');
    img.src = config.tataLogo;
    img.alt = 'TATA Group';
    secondaryAnchor.append(img);
  } else {
    secondaryAnchor.textContent = 'TATA';
  }
  brandSecondary.append(secondaryAnchor);

  // --- MOBILE HAMBURGER BUTTON ---
  const hamburgerWrapper = document.createElement('div');
  hamburgerWrapper.className = 'nav-hamburger';
  const hamburgerButton = document.createElement('button');
  hamburgerButton.type = 'button';
  hamburgerButton.setAttribute('aria-controls', 'tarun-nav');
  hamburgerButton.setAttribute('aria-label', 'Open navigation');
  hamburgerButton.setAttribute('aria-expanded', 'false');
  hamburgerButton.innerHTML = '<span class="nav-hamburger-icon"></span>';

  hamburgerButton.addEventListener('click', () => toggleMobileMenu(nav, hamburgerButton));
  hamburgerWrapper.append(hamburgerButton);

  // --- ESCAPE KEY LISTENER ---
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      const openDrop = navSections.querySelector('.nav-drop[aria-expanded="true"]');
      if (openDrop) {
        openDrop.setAttribute('aria-expanded', 'false');
        openDrop.focus();
      } else if (nav.getAttribute('aria-expanded') === 'true') {
        toggleMobileMenu(nav, hamburgerButton, false);
        hamburgerButton.focus();
      }
    }
  });

  // 4. Assemble Final Structure
  nav.append(hamburgerWrapper, brandPrimary, navSections, navUtilities, brandSecondary);
  navWrapper.append(nav);
  block.append(navWrapper);
}
