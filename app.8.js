// ========================================
// Codex Skin Workshop — App Logic v2
// ========================================

(function () {
  'use strict';

  let activeFilter = 'all';

  const grid = document.getElementById('theme-grid');
  const filterBtns = document.querySelectorAll('.filter-btn');
  const statThemes = document.getElementById('stat-themes');
  const statDownloads = document.getElementById('stat-downloads');
  const statArtists = document.getElementById('stat-artists');

  function renderThemes(filter) {
    const filtered = filter === 'all'
      ? themes
      : themes.filter(t => t.tags.includes(filter));

    grid.innerHTML = filtered.map(theme => `
      <div class="theme-card${theme.featured ? ' theme-card-featured' : ''}" data-id="${theme.id}">
        <img
          class="theme-preview"
          src="${theme.preview}"
          alt="${theme.name}"
          loading="lazy"
          onerror="this.src='data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%22680%22 height=%22400%22><rect fill=%22%2314141f%22 width=%22680%22 height=%22400%22/><text fill=%22%23808098%22 x=%22340%22 y=%22210%22 text-anchor=%22middle%22 font-family=%22sans-serif%22 font-size=%2216%22>Preview Not Available</text></svg>'"
        >
        <div class="theme-info">
          <div class="theme-name">
            ${theme.name}
            ${theme.featured ? '<span class="theme-featured-badge">⭐ 精选</span>' : ''}
          </div>
          <div class="theme-author">by ${theme.author}</div>
          ${theme.description ? `<div class="theme-description">${theme.description}</div>` : ''}
          <div class="theme-tags">
            ${theme.tags.map(tag => `<span class="theme-tag">${tag}</span>`).join('')}
          </div>
          <div class="theme-actions">
            <button class="btn-download" onclick="downloadTheme('${theme.id}', '${theme.name}')">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
              下载主题
            </button>
            <button class="btn-preview" onclick="openPreview('${theme.preview}', '${theme.name}')">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/></svg>
              预览
            </button>
          </div>
        </div>
      </div>
    `).join('');

    if (statThemes) statThemes.textContent = filtered.length;
    if (statDownloads) {
      const total = filtered.reduce((sum, t) => sum + t.downloads, 0);
      statDownloads.textContent = total >= 1000 ? (total / 1000).toFixed(1) + 'k' : total;
    }
    if (statArtists) {
      const artists = new Set(filtered.map(t => t.author));
      statArtists.textContent = artists.size;
    }
  }

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeFilter = btn.dataset.filter;
      renderThemes(activeFilter);
    });
  });

  window.openPreview = function (src, name) {
    const existing = document.querySelector('.modal-overlay');
    if (existing) existing.remove();

    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay';
    overlay.innerHTML = `
      <button class="modal-close" onclick="this.parentElement.remove()">✕</button>
      <div class="modal-content">
        <img src="${src}" alt="${name}">
      </div>
    `;
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) overlay.remove();
    });
    document.body.appendChild(overlay);

    const onEsc = (e) => {
      if (e.key === 'Escape') {
        overlay.remove();
        document.removeEventListener('keydown', onEsc);
      }
    };
    document.addEventListener('keydown', onEsc);
  };

  window.downloadTheme = function (themeId, themeName) {
    const zipUrl = THEME_ZIP_URL + themeId + '.zip';
    const link = document.createElement('a');
    link.href = zipUrl;
    link.download = 'theme-' + themeId + '.zip';
    link.click();
    setTimeout(() => showGuide(themeId, themeName), 500);
  };

  function showGuide(themeId, themeName) {
    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay';

    const installCmd = `if [ ! -f "$HOME/.codex/codex-skin-workshop/Start Codex Skin Workshop.command" ]; then mkdir -p "$HOME/.codex/codex-skin-workshop" && curl -sL "https://github.com/Ryan-J-MAX/Codex-Skin-Workshop/releases/download/v1.0.0/Codex-Skin-Workshop.zip" -o /tmp/csw.zip && unzip -o /tmp/csw.zip -d "$HOME/.codex/codex-skin-workshop/" > /dev/null 2>&1 && rm /tmp/csw.zip && chmod +x "$HOME/.codex/codex-skin-workshop/"*.command "$HOME/.codex/codex-skin-workshop/scripts/"*.sh 2>/dev/null; fi && curl -sL "https://github.com/Ryan-J-MAX/Codex-Skin-Workshop/releases/download/v1.0.0/theme-${themeId}.zip" -o /tmp/t.zip && unzip -o /tmp/t.zip -d /tmp/tt > /dev/null 2>&1 && cp /tmp/tt/theme.json "$HOME/.codex/codex-skin-workshop/assets/" && cp /tmp/tt/*.jpg "$HOME/.codex/codex-skin-workshop/assets/" && rm -rf /tmp/t.zip /tmp/tt && open -a Terminal "$HOME/.codex/codex-skin-workshop/Start Codex Skin Workshop.command"`;

    overlay.innerHTML = `
      <button class="modal-close" onclick="this.parentElement.remove()">✕</button>
      <div class="guide-modal">
        <h3>✅ 即将安装「${themeName}」</h3>
        <p style="margin:8px 0 20px;color:var(--text-secondary);font-size:14px;line-height:1.5">
          复制下面一行命令，粘贴到终端按回车，自动完成所有操作
        </p>

        <div style="margin-bottom:20px;padding:16px;background:rgba(99,102,241,0.06);border-radius:10px;border:1px solid rgba(99,102,241,0.2)">
          <div style="display:flex;gap:8px;align-items:stretch">
            <pre id="install-cmd" style="flex:1;background:var(--bg);padding:14px;border-radius:8px;font-size:12px;overflow-x:auto;line-height:1.8;margin:0;white-space:pre-wrap;word-break:break-all;color:var(--text-secondary);border:1px solid var(--border)">${installCmd}</pre>
            <button onclick="navigator.clipboard.writeText(document.getElementById('install-cmd').textContent);this.textContent='✅ 已复制';setTimeout(()=>this.textContent='复制',2000)" style="flex-shrink:0;padding:10px 18px;background:var(--primary);border:none;border-radius:8px;color:#fff;font-size:13px;font-weight:600;cursor:pointer;font-family:inherit;transition:all 0.2s">复制</button>
          </div>
          <p style="margin-top:10px;font-size:12px;color:var(--text-muted);line-height:1.6">
            ⚡ 首次使用会自动下载工具，已有工具则直接安装主题
          </p>
        </div>

        <details style="padding:16px;background:rgba(244,114,182,0.06);border-radius:10px;border:1px solid rgba(244,114,182,0.15);cursor:pointer">
          <summary style="font-size:13px;font-weight:600;color:var(--accent);cursor:pointer">📦 或者下载 zip 手动安装</summary>
          <div style="margin-top:10px;font-size:12px;color:var(--text-muted);line-height:1.8">
            1. 下载 <code>theme-${themeId}.zip</code> 并解压<br>
            2. 双击 <code>双击安装.command</code><br>
            3. Mac 首次需去「系统设置 → 隐私与安全性」→ 点「仍要打开」
          </div>
        </details>
      </div>
    `;
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) overlay.remove();
    });
    document.body.appendChild(overlay);

    const onEsc = (e) => {
      if (e.key === 'Escape') {
        overlay.remove();
        document.removeEventListener('keydown', onEsc);
      }
    };
    document.addEventListener('keydown', onEsc);
  }

  document.getElementById('btn-sponsor')?.addEventListener('click', (e) => {
    e.preventDefault();
    window.open('https://github.com/sponsors/Ryan-J-MAX', '_blank');
  });

  document.getElementById('btn-buymeacoffee')?.addEventListener('click', (e) => {
    e.preventDefault();
    window.open('https://www.buymeacoffee.com/ryanjm', '_blank');
  });

  renderThemes('all');
})();