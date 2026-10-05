export default function decorate(block) {
  if (!block.textContent.trim()) {
    block.innerHTML = `
      <div class="intro-statement-placeholder">
        Intro Statement
      </div>
    `;
  }
}
