// ========================================
// Codex Skin Workshop — App Logic
// ========================================

(function () {
  'use strict';

  // --- State ---
  let activeFilter = 'all';

  // --- DOM ---
  const grid = document.getElementById('theme-grid');
  const filterBtns = document.querySelectorAll('.filter-btn');
  const statThemes = document.getElementById('stat-themes');
  const statDownloads = document.getElementById('stat-downloads');
  const statArtists = document.getElementById('stat-artists');

  // --- Render ---
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
            <button class="btn-download" onclick="downloadInstallScript('${theme.name}')">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
              下载安装脚本
            </button>
            <button class="btn-preview" onclick="openPreview('${theme.preview}', '${theme.name}')">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/></svg>
              预览
            </button>
          </div>
        </div>
      </div>
    `).join('');

    // Update stats
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

  // --- Filter ---
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeFilter = btn.dataset.filter;
      renderThemes(activeFilter);
    });
  });

  // --- Preview Modal ---
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

  // --- 下载安装脚本 ---
  window.downloadInstallScript = function (themeName) {
    // 直接下载 Release zip（保留执行权限）
    const link = document.createElement('a');
    link.href = INSTALL_SCRIPT_URL;
    link.download = 'Codex-Skin-Workshop.zip';
    link.click();

    // 弹出使用指南
    setTimeout(() => showGuide(themeName), 500);
  };

  // --- 使用指南弹窗 ---
  function showGuide(themeName) {
    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay';
    overlay.innerHTML = `
      <button class="modal-close" onclick="this.parentElement.remove()">✕</button>
      <div class="guide-modal">
        <h3>✅ 下载完成！</h3>
        <p style="margin:8px 0 20px;color:var(--text-muted)">
          你选择了 <strong style="color:var(--text)">${themeName}</strong>，三步搞定：
        </p>
        <div class="guide-steps">
          <div class="guide-step">
            <span class="guide-num">1</span>
            <div>
              <strong>找到下载的文件</strong>
              <p>在 Finder 的「下载」文件夹找到 <code>Codex-Skin-Workshop.zip</code>，双击解压</p>
            </div>
          </div>
          <div class="guide-step">
            <span class="guide-num">2</span>
            <div>
              <strong>双击运行</strong>
              <p>Mac 会提示「无法验证开发者」，按下面步骤操作：</p>
              <div style="margin-top:4px;padding:8px;background:rgba(244,114,182,0.08);border-radius:6px;font-size:12px;color:var(--accent);line-height:1.6">
                ⚠️ 打开「系统设置 → 隐私与安全性」<br>
                往下翻找到该文件 → 点击「仍要打开」<br>
                或右键文件 → 选择「打开」确认
              </div>
            </div>
          </div>
          <div class="guide-step">
            <span class="guide-num">3</span>
            <div>
              <strong>选图安装</strong>
              <p>脚本会自动安装并弹出文件选择器，选一张你喜欢的图即可</p>
            </div>
          </div>
        </div>
        <p style="margin-top:16px;font-size:13px;color:var(--text-muted)">
          换图请双击 <code>Customize Codex Skin Workshop.command</code><br>
          恢复原样请双击 <code>Restore Codex Skin Workshop.command</code>
        </p>
        <a href="https://github.com/Ryan-J-MAX/Codex-Skin-Workshop" target="_blank" class="btn btn-primary" style="margin-top:16px">
          查看详细说明 →
        </a>
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

  // --- Sponsor ---
  document.getElementById('btn-sponsor')?.addEventListener('click', (e) => {
    e.preventDefault();
    window.open('https://github.com/sponsors/Ryan-J-MAX', '_blank');
  });

  document.getElementById('btn-buymeacoffee')?.addEventListener('click', (e) => {
    e.preventDefault();
    window.open('https://www.buymeacoffee.com/ryanjm', '_blank');
  });

  // --- Init ---
  renderThemes('all');
})();