export default function decorate(block) {
  const content = block.textContent.trim();

  if (!content) {
    block.classList.add('empty');

    block.innerHTML = `
      <div class="intro-statement-placeholder">
        <span>Intro Statement</span>
        <p>Add content in Universal Editor</p>
      </div>
    `;
  }
}
