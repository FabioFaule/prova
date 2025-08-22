(function () {
  const root = document.querySelector('.lw-card');
  if (!root) return;

  // storiesData verrà iniettato dal flusso n8n direttamente nell’HTML
  // Esempio: <script>const storiesData = { ... }</script>

  function formatStoryText(text) {
    if (!text) return "";
    text = text.replace(/\*\*(.*?)\*\*/g, '<strong class="highlighted-word">$1</strong>');
    return text.replace(/\*(.*?)\*/g, '<em>$1</em>');
  }

  function showStory(level) {
    const container = root.querySelector('.lw-story-container');
    if (!container || !storiesData || !storiesData[level]) return;

    const story = storiesData[level];

    let difficultWordsHtml = '';
    if (story.difficultWords && Object.keys(story.difficultWords).length > 0) {
      difficultWordsHtml = `
        <div class="difficult-words">
          <h3>📚 Parole Difficili:</h3>
          <div class="words-list">
            ${Object.entries(story.difficultWords).map(([word, definition]) =>
              `<div class="word-item"><strong>${word}</strong>: ${definition}</div>`
            ).join('')}
          </div>
        </div>
      `;
    }

    container.innerHTML = `
      <div class="story-title">${story.title || ''}</div>
      <div class="story-level-badge">Livello ${story.level || ''}</div>
      <div class="story-content">${formatStoryText(story.content || '')}</div>
      ${difficultWordsHtml}
    `;
    container.classList.add('show');
  }

  // Bind bottoni
  root.querySelectorAll('.lw-level-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      root.querySelectorAll('.lw-level-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      showStory(btn.getAttribute('data-level'));
    });
  });
})();
