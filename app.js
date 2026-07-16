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
    link.download = 'theme-' + themeId + '.zip';
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
          你选择了 <strong style="color:var(--text)">${themeName}</strong>，两种安装方式：
        </p>
        <div style="margin-bottom:16px;padding:14px;background:rgba(99,102,241,0.08);border-radius:8px;border:1px solid rgba(99,102,241,0.3)">
          <p style="font-size:13px;font-weight:600;color:var(--primary);margin-bottom:6px">🚀 方式一：复制命令到终端（推荐）</p>
          <p style="font-size:12px;color:var(--text-muted);margin-bottom:6px">打开终端（Cmd+空格 → 输入 terminal），粘贴以下命令回车：</p>
          <div style="display:flex;gap:6px;align-items:stretch">
            <pre id="install-cmd" style="flex:1;background:var(--bg-card);padding:10px;border-radius:6px;font-size:11px;overflow-x:auto;line-height:1.7;margin:0;white-space:pre-wrap;word-break:break-all">curl -sL "https://github.com/Ryan-J-MAX/Codex-Skin-Workshop/releases/download/v1.0.0/theme-${themeId}.zip" -o /tmp/t.zip && unzip -o /tmp/t.zip -d /tmp/tt && cp /tmp/tt/theme.json ~/.codex/codex-skin-workshop/assets/ && cp /tmp/tt/*.jpg ~/.codex/codex-skin-workshop/assets/ && rm -rf /tmp/t.zip /tmp/tt && open ~/.codex/codex-skin-workshop/Start\ Codex\ Skin\ Workshop.command</pre>
            <button onclick="navigator.clipboard.writeText(document.getElementById('install-cmd').textContent);this.textContent='✅ 已复制'" style="flex-shrink:0;padding:8px 12px;background:var(--primary);border:none;border-radius:6px;color:#fff;font-size:12px;cursor:pointer;font-family:inherit">复制</button>
          </div>
        </div>
        <div style="padding:14px;background:rgba(244,114,182,0.08);border-radius:8px;border:1px solid rgba(244,114,182,0.2)">
          <p style="font-size:13px;font-weight:600;color:var(--accent);margin-bottom:6px">📦 方式二：下载后手动安装</p>
          <p style="font-size:12px;color:var(--text-muted);margin-bottom:4px">
            1. 解压下载的 <code>theme-${themeId}.zip</code><br>
            2. 双击文件夹中的 <code>双击安装.command</code><br>
            3. Mac 首次需去「系统设置 → 隐私与安全性」→ 点「仍要打开」
          </p>
        </div>
        <p style="margin-top:16px;font-size:12px;color:var(--text-muted)">
          💡 首次使用才需下载工具，之后只需替换主题文件即可
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
