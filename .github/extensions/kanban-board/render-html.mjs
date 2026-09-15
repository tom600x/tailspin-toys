export function renderKanbanHtml(instanceId, issues) {
  const topIssues = issues.filter(i => i.isTopPriority);
  const remainingIssues = issues.filter(i => !i.isTopPriority && i.state === "OPEN");
  const closedIssues = issues.filter(i => i.state === "CLOSED");

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Work Triage Kanban Board</title>
  <style>
    :root {
      --bg-primary: var(--background-color-default, #0d1117);
      --bg-secondary: #161b22;
      --bg-tertiary: #21262d;
      --bg-card: #1c2128;
      --bg-highlight: #1f2937;
      --border-color: var(--border-color-default, #30363d);
      --text-main: var(--text-color-default, #f0f6fc);
      --text-muted: var(--text-color-muted, #8b949e);
      --accent-blue: #58a6ff;
      --accent-green: #3fb950;
      --accent-amber: #d29922;
      --accent-purple: #bc8cff;
      --accent-red: #f85149;
    }

    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    body {
      background: var(--bg-primary);
      color: var(--text-main);
      font-family: var(--font-sans, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif);
      font-size: 14px;
      line-height: 1.5;
      padding: 1.25rem;
    }

    header {
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      align-items: center;
      gap: 1rem;
      padding-bottom: 1rem;
      margin-bottom: 1.5rem;
      border-bottom: 1px solid var(--border-color);
    }

    .header-title-group {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }

    .header-icon {
      font-size: 1.75rem;
    }

    h1 {
      font-size: 1.4rem;
      font-weight: 600;
      color: var(--text-main);
    }

    .subtitle {
      font-size: 0.85rem;
      color: var(--text-muted);
    }

    .header-actions {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }

    .search-input {
      background: var(--bg-secondary);
      border: 1px solid var(--border-color);
      color: var(--text-main);
      padding: 0.45rem 0.8rem;
      border-radius: 6px;
      font-size: 0.85rem;
      outline: none;
      min-width: 220px;
      transition: border-color 0.2s;
    }

    .search-input:focus {
      border-color: var(--accent-blue);
      box-shadow: 0 0 0 2px rgba(88, 166, 255, 0.2);
    }

    .stats-bar {
      display: flex;
      gap: 0.75rem;
      margin-bottom: 1.5rem;
      flex-wrap: wrap;
    }

    .stat-chip {
      background: var(--bg-secondary);
      border: 1px solid var(--border-color);
      padding: 0.35rem 0.75rem;
      border-radius: 20px;
      font-size: 0.8rem;
      display: flex;
      align-items: center;
      gap: 0.4rem;
    }

    .stat-chip.priority {
      border-color: rgba(210, 153, 34, 0.5);
      background: rgba(210, 153, 34, 0.1);
      color: #e3b341;
    }

    .stat-chip.backlog {
      border-color: rgba(88, 166, 255, 0.5);
      background: rgba(88, 166, 255, 0.1);
      color: var(--accent-blue);
    }

    .stat-chip.completed {
      border-color: rgba(63, 185, 80, 0.5);
      background: rgba(63, 185, 80, 0.1);
      color: var(--accent-green);
    }

    .section-container {
      margin-bottom: 2rem;
    }

    .section-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 1rem;
      padding-bottom: 0.4rem;
      border-bottom: 2px solid var(--border-color);
    }

    .section-header.priority-header {
      border-bottom-color: var(--accent-amber);
    }

    .section-title {
      font-size: 1.1rem;
      font-weight: 600;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .priority-tag {
      background: #e3b341;
      color: #121008;
      font-size: 0.7rem;
      font-weight: 700;
      padding: 0.15rem 0.5rem;
      border-radius: 12px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    /* Top priority 3 cards grid */
    .priority-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
      gap: 1.25rem;
    }

    .card {
      background: var(--bg-card);
      border: 1px solid var(--border-color);
      border-radius: 8px;
      padding: 1.25rem;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      position: relative;
      transition: transform 0.15s, border-color 0.15s, box-shadow 0.15s;
    }

    .card:hover {
      border-color: #58a6ff;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
    }

    .card.top-1 {
      border-top: 4px solid var(--accent-amber);
      background: linear-gradient(180deg, rgba(210, 153, 34, 0.08) 0%, var(--bg-card) 20%);
    }

    .card.top-2 {
      border-top: 4px solid var(--accent-blue);
      background: linear-gradient(180deg, rgba(88, 166, 255, 0.08) 0%, var(--bg-card) 20%);
    }

    .card.top-3 {
      border-top: 4px solid var(--accent-purple);
      background: linear-gradient(180deg, rgba(188, 140, 255, 0.08) 0%, var(--bg-card) 20%);
    }

    .card-top {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 0.75rem;
    }

    .rank-badge {
      font-size: 0.75rem;
      font-weight: 700;
      padding: 0.2rem 0.6rem;
      border-radius: 6px;
      display: inline-flex;
      align-items: center;
      gap: 0.3rem;
    }

    .rank-badge.rank-1 { background: rgba(210, 153, 34, 0.2); color: #f2cc60; border: 1px solid #d29922; }
    .rank-badge.rank-2 { background: rgba(88, 166, 255, 0.2); color: #79c0ff; border: 1px solid #58a6ff; }
    .rank-badge.rank-3 { background: rgba(188, 140, 255, 0.2); color: #d2a8ff; border: 1px solid #bc8cff; }

    .issue-num {
      color: var(--text-muted);
      font-family: var(--font-mono, monospace);
      font-size: 0.85rem;
    }

    .card-title {
      font-size: 1rem;
      font-weight: 600;
      color: var(--text-main);
      margin-bottom: 0.75rem;
      line-height: 1.35;
    }

    .category-pill {
      display: inline-block;
      font-size: 0.72rem;
      background: var(--bg-tertiary);
      color: var(--text-muted);
      padding: 0.15rem 0.5rem;
      border-radius: 4px;
      margin-bottom: 0.75rem;
    }

    .justification-box {
      background: rgba(210, 153, 34, 0.1);
      border-left: 3px solid #d29922;
      padding: 0.65rem 0.75rem;
      border-radius: 0 6px 6px 0;
      margin-bottom: 0.85rem;
      font-size: 0.82rem;
    }

    .justification-box.blue {
      background: rgba(88, 166, 255, 0.1);
      border-left-color: #58a6ff;
    }

    .justification-box.purple {
      background: rgba(188, 140, 255, 0.1);
      border-left-color: #bc8cff;
    }

    .justification-title {
      font-weight: 600;
      color: #e3b341;
      margin-bottom: 0.25rem;
      display: flex;
      align-items: center;
      gap: 0.35rem;
    }

    .justification-box.blue .justification-title { color: #58a6ff; }
    .justification-box.purple .justification-title { color: #bc8cff; }

    .justification-text {
      color: #c9d1d9;
      line-height: 1.4;
    }

    .content-box {
      background: var(--bg-secondary);
      border: 1px solid var(--border-color);
      padding: 0.65rem 0.75rem;
      border-radius: 6px;
      margin-bottom: 0.85rem;
      font-size: 0.82rem;
    }

    .content-title {
      font-weight: 600;
      color: var(--text-muted);
      margin-bottom: 0.25rem;
    }

    .content-text {
      color: #adbac7;
      line-height: 1.4;
    }

    .criteria-box {
      margin-bottom: 1rem;
    }

    .criteria-toggle {
      background: none;
      border: none;
      color: var(--accent-blue);
      cursor: pointer;
      font-size: 0.78rem;
      padding: 0;
      text-decoration: underline;
    }

    .criteria-list {
      margin-top: 0.4rem;
      padding-left: 1.2rem;
      font-size: 0.78rem;
      color: var(--text-muted);
    }

    .criteria-list li {
      margin-bottom: 0.25rem;
    }

    .card-footer {
      margin-top: auto;
      padding-top: 0.75rem;
      border-top: 1px solid var(--border-color);
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 0.5rem;
    }

    .btn-add-context {
      background: #238636;
      color: #ffffff;
      border: 1px solid rgba(240, 246, 252, 0.1);
      padding: 0.45rem 0.85rem;
      border-radius: 6px;
      font-weight: 600;
      font-size: 0.82rem;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 0.4rem;
      transition: background-color 0.2s, transform 0.1s;
      width: 100%;
      justify-content: center;
    }

    .btn-add-context:hover {
      background: #2ea043;
    }

    .btn-add-context:active {
      transform: scale(0.98);
    }

    .btn-add-context.added {
      background: var(--bg-tertiary);
      color: var(--accent-green);
      border-color: var(--accent-green);
      cursor: default;
    }

    .btn-secondary {
      background: var(--bg-tertiary);
      color: var(--text-main);
      border: 1px solid var(--border-color);
      padding: 0.4rem 0.7rem;
      border-radius: 6px;
      font-size: 0.8rem;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 0.35rem;
      transition: background 0.15s;
    }

    .btn-secondary:hover {
      background: var(--border-color);
    }

    /* Remainder grid */
    .remainder-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 1rem;
    }

    .remainder-card {
      background: var(--bg-card);
      border: 1px solid var(--border-color);
      border-radius: 6px;
      padding: 1rem;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      transition: border-color 0.15s;
    }

    .remainder-card:hover {
      border-color: var(--accent-blue);
    }

    .remainder-card .card-title {
      font-size: 0.92rem;
      margin-bottom: 0.5rem;
    }

    .remainder-card .content-text {
      font-size: 0.8rem;
      color: var(--text-muted);
      margin-bottom: 0.75rem;
      line-height: 1.35;
    }

    /* Toast notification */
    #toast {
      position: fixed;
      bottom: 1.5rem;
      right: 1.5rem;
      background: #1f6feb;
      color: #ffffff;
      padding: 0.75rem 1.25rem;
      border-radius: 8px;
      font-size: 0.88rem;
      font-weight: 500;
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4);
      display: flex;
      align-items: center;
      gap: 0.6rem;
      transform: translateY(100px);
      opacity: 0;
      transition: transform 0.25s cubic-bezier(0.175, 0.885, 0.32, 1.275), opacity 0.25s;
      z-index: 1000;
    }

    #toast.show {
      transform: translateY(0);
      opacity: 1;
    }

    #toast.success {
      background: #238636;
    }

    /* Completed section styling */
    .completed-section {
      opacity: 0.75;
      transition: opacity 0.2s;
    }

    .completed-section:hover {
      opacity: 1;
    }

    .completed-card {
      border-left: 3px solid var(--accent-green);
    }
  </style>
</head>
<body>
  <header>
    <div class="header-title-group">
      <span class="header-icon">📋</span>
      <div>
        <h1>Work Triage Kanban Board</h1>
        <div class="subtitle">Tailspin Toys • Repository Issue Prioritization</div>
      </div>
    </div>
    <div class="header-actions">
      <input type="text" id="searchInput" class="search-input" placeholder="🔍 Filter issues..." aria-label="Filter issues" />
    </div>
  </header>

  <div class="stats-bar">
    <div class="stat-chip priority">
      <span>🔥</span>
      <strong>3</strong> Top Priority Items
    </div>
    <div class="stat-chip backlog">
      <span>📋</span>
      <strong>${remainingIssues.length}</strong> Backlog Items
    </div>
    <div class="stat-chip completed">
      <span>✅</span>
      <strong>${closedIssues.length}</strong> Completed
    </div>
  </div>

  <!-- Top Priority Section -->
  <section class="section-container">
    <div class="section-header priority-header">
      <div class="section-title">
        <span>🔥</span>
        <span>Top Priority — Needs Attention Right Now</span>
      </div>
      <span class="priority-tag">Immediate Focus</span>
    </div>

    <div class="priority-grid" id="priorityGrid">
      ${topIssues.map(issue => `
        <article class="card top-${issue.rank}" data-issue="${issue.number}" data-title="${issue.title.toLowerCase()} ${issue.category.toLowerCase()}">
          <div>
            <div class="card-top">
              <span class="rank-badge rank-${issue.rank}">
                <span>★</span> Rank #${issue.rank} Priority
              </span>
              <span class="issue-num">#${issue.number}</span>
            </div>

            <div class="category-pill">${issue.category}</div>
            <h2 class="card-title">${issue.title}</h2>

            <div class="justification-box ${issue.rank === 2 ? 'blue' : issue.rank === 3 ? 'purple' : ''}">
              <div class="justification-title">
                <span>🎯</span>
                <span>Why it's at the top:</span>
              </div>
              <div class="justification-text">${issue.justification}</div>
            </div>

            <div class="content-box">
              <div class="content-title">📝 Issue Description & Scope:</div>
              <div class="content-text">${issue.description}</div>
            </div>

            <div class="criteria-box">
              <button type="button" class="criteria-toggle" onclick="toggleCriteria(${issue.number})">
                👁️ View Acceptance Criteria (${issue.acceptanceCriteria.length})
              </button>
              <ul class="criteria-list" id="criteria-${issue.number}" style="display: none;">
                ${issue.acceptanceCriteria.map(c => `<li>${c}</li>`).join('')}
              </ul>
            </div>
          </div>

          <div class="card-footer">
            <button
              type="button"
              class="btn-add-context"
              id="btn-add-${issue.number}"
              onclick="addToSessionContext(${issue.number}, this)"
              data-testid="add-context-issue-${issue.number}"
            >
              <span>⚡</span>
              <span>Add to Session Context</span>
            </button>
          </div>
        </article>
      `).join('')}
    </div>
  </section>

  <!-- Remainder / Backlog Section -->
  <section class="section-container">
    <div class="section-header">
      <div class="section-title">
        <span>📋</span>
        <span>Backlog & Remaining Work</span>
      </div>
      <span style="font-size: 0.8rem; color: var(--text-muted);">${remainingIssues.length} open issues</span>
    </div>

    <div class="remainder-grid" id="remainderGrid">
      ${remainingIssues.map(issue => `
        <article class="remainder-card" data-issue="${issue.number}" data-title="${issue.title.toLowerCase()} ${issue.category.toLowerCase()}">
          <div>
            <div class="card-top">
              <span class="category-pill">${issue.category}</span>
              <span class="issue-num">#${issue.number}</span>
            </div>

            <h3 class="card-title">${issue.title}</h3>
            <p class="content-text">${issue.description}</p>

            <div class="criteria-box">
              <button type="button" class="criteria-toggle" onclick="toggleCriteria(${issue.number})">
                👁️ Acceptance Criteria (${issue.acceptanceCriteria.length})
              </button>
              <ul class="criteria-list" id="criteria-${issue.number}" style="display: none;">
                ${issue.acceptanceCriteria.map(c => `<li>${c}</li>`).join('')}
              </ul>
            </div>
          </div>

          <div class="card-footer">
            <button
              type="button"
              class="btn-add-context"
              id="btn-add-${issue.number}"
              onclick="addToSessionContext(${issue.number}, this)"
              data-testid="add-context-issue-${issue.number}"
            >
              <span>➕</span>
              <span>Add to Session Context</span>
            </button>
          </div>
        </article>
      `).join('')}
    </div>
  </section>

  <!-- Completed Section -->
  <section class="section-container completed-section">
    <div class="section-header">
      <div class="section-title">
        <span>✅</span>
        <span>Completed Work</span>
      </div>
      <span style="font-size: 0.8rem; color: var(--text-muted);">${closedIssues.length} closed</span>
    </div>

    <div class="remainder-grid">
      ${closedIssues.map(issue => `
        <article class="remainder-card completed-card">
          <div class="card-top">
            <span class="category-pill">${issue.category}</span>
            <span class="issue-num">#${issue.number}</span>
          </div>
          <h3 class="card-title" style="text-decoration: line-through; color: var(--text-muted);">${issue.title}</h3>
          <p class="content-text">${issue.description}</p>
        </article>
      `).join('')}
    </div>
  </section>

  <div id="toast" role="alert" aria-live="assertive"></div>

  <script>
    function showToast(message, isSuccess = true) {
      const toast = document.getElementById('toast');
      toast.textContent = message;
      toast.className = isSuccess ? 'show success' : 'show';
      setTimeout(() => {
        toast.className = '';
      }, 4000);
    }

    function toggleCriteria(issueNum) {
      const list = document.getElementById('criteria-' + issueNum);
      if (list) {
        list.style.display = list.style.display === 'none' ? 'block' : 'none';
      }
    }

    async function addToSessionContext(issueNumber, btnElement) {
      const originalHtml = btnElement.innerHTML;
      btnElement.disabled = true;
      btnElement.innerHTML = '<span>⏳</span> <span>Adding to session...</span>';

      try {
        const response = await fetch('/api/add-context', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ issueNumber })
        });

        const data = await response.json();
        if (data.success) {
          btnElement.className = 'btn-add-context added';
          btnElement.innerHTML = '<span>✓</span> <span>Added to Context</span>';
          showToast('🚀 Issue #' + issueNumber + ' added to current session context!');
        } else {
          btnElement.disabled = false;
          btnElement.innerHTML = originalHtml;
          showToast('❌ ' + (data.error || 'Failed to add to context'), false);
        }
      } catch (err) {
        btnElement.disabled = false;
        btnElement.innerHTML = originalHtml;
        showToast('❌ Network error adding issue to context', false);
      }
    }

    // Client-side quick filter
    const searchInput = document.getElementById('searchInput');
    searchInput.addEventListener('input', (e) => {
      const query = e.target.value.toLowerCase().trim();
      const allCards = document.querySelectorAll('[data-issue]');
      allCards.forEach(card => {
        const titleAndCategory = card.getAttribute('data-title') || '';
        const issueNum = card.getAttribute('data-issue') || '';
        if (!query || titleAndCategory.includes(query) || ('#' + issueNum).includes(query)) {
          card.style.display = '';
        } else {
          card.style.display = 'none';
        }
      });
    });
  </script>
</body>
</html>`;
}
