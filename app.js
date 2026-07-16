// ========================================
// Codex Skin Workshop — App Logic
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
      <div class="theme-card" data-id="${theme.id}">
        <img
          class="theme-preview"
          src="${theme.preview}"
          alt="${theme.name}"
          loading="lazy"
          onerror="this.src='data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%22680%22 height=%22400%22><rect fill=%22%2314141f%22 width=%22680%22 height=%22400%22/><text fill=%22%23808098%22 x=%22340%22 y=%22210%22 text-anchor=%22middle%22 font-family=%22sans-serif%22 font-size=%2216%22>Preview Not Available</text></svg>'"
        >
        <div class="theme-info">
          <div class="theme-name">
            ${theme.featured ? '⭐ ' : ''}${theme.name}
          </div>
          <div class="theme-author">by ${theme.author}</div>
          <div class="theme-tags">
            ${theme.tags.map(tag => `<span class="theme-tag">${tag}</span>`).join('')}
          </div>
          <div class="theme-actions">
            <button class="btn-download" onclick="downloadTheme('${theme.id}', '${theme.name}')">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
              下载主题
            </button>
            <button class="btn-preview" onclick="openPreview('${theme.preview}', '${theme.name}')">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/></svg>
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

  // 下载主题 zip 包
  window.downloadTheme = function (themeId, themeName) {
    const zipUrl = THEME_ZIP_URL + themeId + '.zip';
    const link = document.createElement('a');
    link.href = zipUrl;
    link.download = themeId + '.zip';
    link.click();
    setTimeout(() => showGuide(themeId, themeName), 500);
  };

  function showGuide(themeId, themeName) {
    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay';
    overlay.innerHTML = `
      <button class="modal-close" onclick="this.parentElement.remove()">✕</button>
      <div class="guide-modal">
        <h3>✅ 主题已下载！</h3>
        <p style="margin:8px 0 20px;color:var(--text-muted)">
          你选择了 <strong style="color:var(--text)">${themeName}</strong>
        </p>
        <div class="guide-steps">
          <div class="guide-step">
            <span class="guide-num">1</span>
            <div>
              <strong>解压并替换</strong>
              <p>在 Finder 双击下载的 <code>.zip</code> 解压，然后打开终端执行：</p>
              <pre style="background:var(--bg);padding:10px;border-radius:6px;font-size:12px;margin-top:6px;overflow-x:auto;line-height:1.8">cd ~/Downloads/${themeId}
cp theme.json ~/.codex/codex-skin-workshop/assets/
cp *.jpg ~/.codex/codex-skin-workshop/assets/</pre>
            </div>
          </div>
          <div class="guide-step">
            <span class="guide-num">2</span>
            <div>
              <strong>重启生效</strong>
              <p>双击桌面 <code>Codex Skin Workshop.command</code> 即可看到新主题</p>
            </div>
          </div>
        </div>
        <p style="margin-top:16px;font-size:12px;color:var(--text-muted)">
          首次使用？先 <a href="${INSTALL_SCRIPT_URL}" style="color:var(--primary)" target="_blank">下载安装 Codex Skin Workshop</a>
        </p>
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
