(function (root, factory) {
  'use strict';
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else {
    root.DKFlowerVote = api;
    if (root.document) api.mount(root.document, root.DK_FLOWER_VOTE_CONFIG || {});
  }
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';

  const POLL_ID = 'dk6184-flowers-20261109';
  const COLORS = Object.freeze([
    { id: 'sakura', name: '初櫻', flower: '粉櫻', body: '乾燥玫瑰', swatch: '#D59AA0', meaning: '重新開始', story: '把重新開始的勇氣，繡成腳邊的一枝春天。', shape: '瓣端帶缺口的淡粉五瓣櫻花，搭配細長花梗與少量嫩葉。', culture: '櫻花在日本文化中與希望、更新相連。「重新開始的勇氣」是本款延伸的 DK 設計寓意。', sources: [{ title: 'JICC：櫻花文化', url: 'https://www.us.emb-japan.go.jp/jicc/doc/Teaching%20Tuesday/2016/03-22-16-sakura-history.pdf' }, { title: 'Kew：花形辨識', url: 'https://www.kew.org/read-and-watch/blossom-quiz' }] },
    { id: 'forgetmenot', name: '相伴', flower: '勿忘我', body: '霧藍', swatch: '#AFCAE2', meaning: '珍惜相伴', story: '把珍惜的人與時光，留在每天相伴的步伐裡。', shape: '小型藍色五裂花冠，中央一點黃眼，沿細莖成簇。', culture: 'RHS 的花卉象徵資料將勿忘我與真愛連結。本款將這份情感延伸為珍惜親友與相伴時光。', sources: [{ title: 'RHS：花卉象徵', url: 'https://www.rhs.org.uk/education-learning/school-gardening/resources/curriculum-linked/the-meaning-of-flowers' }, { title: 'RHS：勿忘我形態', url: 'https://www.rhs.org.uk/plants/41558/myosotis-sylvatica/details' }] },
    { id: 'daisy', name: '小晴', flower: '白雛菊', body: '鼠尾草', swatch: '#AEC0A0', meaning: '日常小快樂', story: '平常的一天，也值得為小小的快樂停留。', shape: '細長白色舌瓣圍住暖黃花盤，輕盈小花各有獨立細莖。', culture: '雛菊在不同文獻中與純真、簡單等意象相連。「日常小快樂」是 DK 依其明亮花形延伸的設計寓意。', sources: [{ title: 'RHS：花卉象徵', url: 'https://www.rhs.org.uk/education-learning/school-gardening/resources/curriculum-linked/the-meaning-of-flowers' }, { title: '牛津大學：雛菊', url: 'https://herbaria.plants.ox.ac.uk/bol/plants400/Profiles/AB/Bellis' }] },
    { id: 'lavender', name: '留白', flower: '薰衣草', body: '淡紫', swatch: '#C7BBDD', meaning: '從容留白', story: '為忙碌留一點空白，按自己的節奏慢慢走。', shape: '高低錯落的細長紫色花穗，配窄長灰綠葉，穗間保留空隙。', culture: 'RHS 將薰衣草的象徵列為 devotion，帶有忠誠與專注的含意。本款另從疏落穗形與柔和紫色延伸「從容留白」，並非把平靜視為固定花語。', sources: [{ title: 'RHS：花卉象徵', url: 'https://www.rhs.org.uk/education-learning/school-gardening/resources/curriculum-linked/the-meaning-of-flowers' }, { title: 'RHS：英國薰衣草', url: 'https://www.rhs.org.uk/plants/91398/lavandula-angustifolia/details' }] },
    { id: 'osmanthus', name: '桂謝', flower: '金桂', body: '燕麥奶茶', swatch: '#C9BDA6', meaning: '收穫與感謝', story: '把一路累積的收穫，化成一句溫暖的謝謝。', shape: '金黃色四裂小花聚成花簇，藏在成對葉片與短枝之間。', culture: '桂花與秋季、折桂及成就的文化意象相連。「收穫與感謝」是 DK 的現代延伸，並非桂花的統一花語。', sources: [{ title: '中研院：桂花專題', url: 'https://digiarch.sinica.edu.tw/content/subject/resource_content.jsp?id=461' }, { title: '南港區農會：桂花種類', url: 'https://www.nkfa.org.tw/characteristic_3.htm' }] },
    { id: 'plum', name: '冬晴', flower: '白梅', body: '石墨灰', swatch: '#626770', meaning: '韌性', story: '即使走過寒冷，也保留再次開花的力量。', shape: '五片圓潤白瓣與細花蕊，疏落地貼近轉折木枝，點綴圓花苞。', culture: '梅花傲霜耐雪的意象見於傳統器物與文學文化。本款以「再次開花的力量」轉譯這份韌性。', sources: [{ title: '故宮：歲寒三友', url: 'https://digitalarchive.npm.gov.tw/opendata/Pub/DetailEng/35962?dep=U&mode=full' }, { title: 'RHS：梅花形態', url: 'https://www.rhs.org.uk/plants/25783/prunus-mume/details' }] }
  ]);
  const SYMBOLISM = Object.freeze({
    sakura: { label: '文化象徵', text: '希望・更新' },
    forgetmenot: { label: '花語', text: '真愛' },
    daisy: { label: '花語', text: '純真' },
    lavender: { label: '花語', text: '忠誠・專注' },
    osmanthus: { label: '文化象徵', text: '折桂・成就' },
    plum: { label: '文化象徵', text: '堅韌・傲霜耐雪' }
  });
  const IDS = COLORS.map(c => c.id);
  const ERROR_MESSAGES = Object.freeze({
    ALREADY_VOTED: '這個部門與姓名已有投票紀錄。若要改票，請使用原瀏覽器；需要協助請聯絡票選負責人。',
    STALE_REVISION: '已同步這份投票的最新紀錄。請確認目前選擇，再決定是否改票。',
    POLL_CLOSED: '本次票選已結束，感謝你的參與。',
    WRONG_POLL: '目前票選設定不一致，請重新整理頁面或聯絡票選負責人。',
    BAD_IDENTITY: '請確認部門與姓名皆已完整填寫。',
    BAD_CHOICE: '請先選擇六款提案中的其中一款。',
    BAD_RECEIPT: '此瀏覽器的修改憑證無法使用，請聯絡票選負責人。',
    BAD_REQUEST_ID: '送出識別資料無法使用，請重新整理頁面。',
    BAD_REVISION: '投票版本資料無法使用，請聯絡票選負責人。',
    REQUEST_REUSED: '這次送出的資料與先前請求不一致，請聯絡票選負責人確認。',
    NOT_READY: '票選尚未開放，請稍後再來。',
    BUSY: '目前有其他同事正在投票，請稍後重試確認。'
  });

  class VoteError extends Error {
    constructor(message, code, uncertain) { super(message); this.name = 'VoteError'; this.code = code; this.uncertain = Boolean(uncertain); }
  }

  function normalizeIdentity(dept, name) {
    const normalize = value => String(value || '').normalize('NFKC').trim().replace(/\s+/g, ' ').toLocaleLowerCase('en-US');
    return normalize(dept) + '\n' + normalize(name).replace(/\s/g, '');
  }

  function validateIdentity(dept, name) {
    if (typeof dept !== 'string' || typeof name !== 'string' || !dept.trim() || !name.trim()) return '請填寫部門及姓名。';
    if (dept.trim().length > 40 || name.trim().length > 40) return '部門與姓名皆請在 40 字內。';
    if (/[\u0000-\u001f\u007f]/.test(dept + name)) return '部門與姓名請使用一般文字，不要換行。';
    return '';
  }

  function normalizeStats(data, pollId) {
    if (!data || data.ok !== true || (data.pollId && data.pollId !== pollId) || !data.counts || typeof data.counts !== 'object') throw new VoteError('無法確認目前票數，請稍後更新。', 'INVALID_STATS', false);
    const counts = {};
    for (const id of IDS) {
      const value = data.counts[id];
      if (!Number.isSafeInteger(value) || value < 0) throw new VoteError('無法確認目前票數，請稍後更新。', 'INVALID_STATS', false);
      counts[id] = value;
    }
    const total = IDS.reduce((sum, id) => sum + counts[id], 0);
    if (!Number.isSafeInteger(data.total) || data.total !== total) throw new VoteError('目前票數尚未同步，請稍後更新。', 'INVALID_STATS', false);
    return { counts, total, closed: data.closed === true };
  }

  function assertConfirmation(data, payload) {
    if (!data || data.ok !== true || (data.pollId && data.pollId !== payload.pollId) || data.requestId !== payload.requestId || data.choice !== payload.choice || !Number.isSafeInteger(data.revision) || data.revision < 1 || data.revision < payload.expectedRevision) {
      throw new VoteError('尚未取得這一票的確認回覆。請按「重試確認這一票」，不會重複計票。', 'UNCONFIRMED', true);
    }
    let stats;
    try { stats = normalizeStats(data, payload.pollId); }
    catch (_) { throw new VoteError('回覆資料尚未完整，請重試確認這一票。', 'UNCONFIRMED', true); }
    return { choice: data.choice, revision: data.revision, requestId: data.requestId, stats };
  }

  function isConfigured(endpoint) {
    try { return new URL(endpoint).protocol === 'https:'; }
    catch (_) { return false; }
  }

  async function requestJSON(endpoint, options, fetcher, timeoutMs) {
    if (!isConfigured(endpoint)) throw new VoteError('票選尚未開放，請稍後再來。', 'NOT_READY', false);
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), timeoutMs || 25000);
    const post = Boolean(options && options.method === 'POST');
    try {
      const response = await (fetcher || fetch)(endpoint, { credentials: 'omit', cache: 'no-store', redirect: 'follow', ...options, signal: controller.signal });
      if (response.type === 'opaque') throw new Error('Unreadable response');
      const data = await response.json();
      if (!data || typeof data.ok !== 'boolean') throw new Error('Invalid response');
      // Business errors use their real HTTP status (for example 409 for duplicates).
      // Only a readable, structured rejection is definite; transport failures stay uncertain.
      if (!data.ok && typeof data.code !== 'string') throw new Error('Invalid rejection');
      if (!response.ok && data.ok) throw new Error('Invalid success status');
      return data;
    } catch (error) {
      if (error instanceof VoteError) throw error;
      const message = post ? '目前尚未確認送出結果。請檢查連線後重試確認，同一份請求不會重複計票。' : '暫時無法讀取票數，請稍後更新。';
      throw new VoteError(message, error.name === 'AbortError' ? 'TIMEOUT' : 'NETWORK', post);
    } finally { clearTimeout(timeout); }
  }

  function randomHex(cryptoApi, bytes) {
    const data = new Uint8Array(bytes);
    cryptoApi.getRandomValues(data);
    return Array.from(data, value => value.toString(16).padStart(2, '0')).join('');
  }

  async function identityDigest(cryptoApi, identity) {
    const data = await cryptoApi.subtle.digest('SHA-256', new TextEncoder().encode(identity));
    return Array.from(new Uint8Array(data), value => value.toString(16).padStart(2, '0')).join('');
  }

  function parseReceipt(raw) {
    try {
      const value = JSON.parse(raw);
      if (!value || !/^[a-f0-9]{64}$/.test(value.token) || !Number.isSafeInteger(value.revision) || value.revision < 0) return null;
      if (value.identityDigest != null && !/^[a-f0-9]{64}$/.test(value.identityDigest)) return null;
      if (value.choice != null && !IDS.includes(value.choice)) return null;
      const pending = value.pending;
      if (pending && (!/^[a-f0-9]{32}$/.test(pending.requestId) || !IDS.includes(pending.choice) || !Number.isSafeInteger(pending.expectedRevision) || pending.expectedRevision < 0)) return null;
      return { token: value.token, revision: value.revision, choice: value.choice || null, identityDigest: value.identityDigest || null, pending: pending || null };
    } catch (_) { return null; }
  }

  function escapeHtml(value) { return String(value).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c])); }

  function mount(document, config) {
    const win = document.defaultView;
    const pollId = config.pollId || POLL_ID;
    const endpoint = config.endpoint || '';
    const receiptKey = 'dk-flower-vote:' + pollId + ':receipt-v1';
    const sessionKey = 'dk-flower-vote:' + pollId + ':identity-v1';
    const $ = id => document.getElementById(id);
    const form = $('vote-form');
    const submit = $('submit-vote');
    const deptInput = $('department');
    const nameInput = $('voter-name');
    const status = $('vote-status');
    const grid = $('color-grid');
    const results = $('results-disclosure');
    let receipt = null;
    let pendingPayload = null;
    let selected = null;
    let busy = false;
    let closed = false;
    let statsLoading = false;
    let statsCache = null;
    let lastDialogTrigger = null;

    try { receipt = parseReceipt(win.localStorage.getItem(receiptKey)); } catch (_) { /* Storage is checked again before sending. */ }
    try {
      const saved = JSON.parse(win.sessionStorage.getItem(sessionKey));
      if (saved && !validateIdentity(saved.dept, saved.name)) { deptInput.value = saved.dept; nameInput.value = saved.name; }
    } catch (_) { /* Names are optional session-only state. */ }

    grid.innerHTML = COLORS.map((c, index) => `
      <article class="color-card" data-card="${c.id}" style="--swatch:${c.swatch}">
        <button class="image-open" type="button" data-image="${c.id}" aria-label="放大查看${c.name}：${c.flower}與${c.body}"><img src="assets/${c.id}.jpg" alt="${c.name}：${c.flower}刺繡與${c.body}鞋面的 AI 設計示意" width="1254" height="1254" loading="lazy" decoding="async"><span class="image-hint" aria-hidden="true">放大細節 ＋</span></button>
        <div class="card-content">
          <div class="card-top"><span class="card-number">${String(index + 1).padStart(2, '0')}</span><span class="color-chip" aria-hidden="true"></span></div>
          <h3>${c.name}</h3><p class="flower-label">${c.flower} × ${c.body}</p>
          <p class="symbolism"><span>${SYMBOLISM[c.id].label}</span><strong>${SYMBOLISM[c.id].text}</strong></p>
          <p class="meaning">DK 設計寓意<strong>${c.meaning}</strong></p><p class="card-story">${c.story}</p>
          <div class="card-bottom"><details class="story-source"><summary>花的故事與來源</summary><p>${c.shape}</p><p>${c.culture}</p><div class="source-links">${c.sources.map(source => `<a href="${escapeHtml(source.url)}" target="_blank" rel="noopener noreferrer">${escapeHtml(source.title)} ↗</a>`).join('')}</div></details>
          <label class="select-choice"><input type="radio" form="vote-form" name="choice" value="${c.id}" required aria-label="選擇${c.name}：${c.flower}與${c.body}"><span class="choice-label">選這款</span><span class="selection-icon" aria-hidden="true">＋</span></label></div>
        </div>
      </article>`).join('');

    const radios = Array.from(document.querySelectorAll('input[name="choice"]'));

    function showStatus(message, kind, focus) {
      status.textContent = message;
      status.className = 'vote-status' + (kind ? ' is-' + kind : '');
      if (focus) status.focus({ preventScroll: false });
    }

    function saveReceipt() {
      try {
        const serialized = JSON.stringify(receipt);
        win.localStorage.setItem(receiptKey, serialized);
        if (win.localStorage.getItem(receiptKey) !== serialized) throw new Error('Storage unavailable');
      } catch (_) { throw new VoteError('瀏覽器目前無法保存修改憑證，因此尚未送出。請允許此網站儲存資料，再重試。', 'STORAGE', false); }
    }

    function rememberIdentity(dept, name) {
      try { win.sessionStorage.setItem(sessionKey, JSON.stringify({ dept, name })); } catch (_) { /* Optional; receipt contains no name or department. */ }
    }

    function applySelection(id) {
      selected = IDS.includes(id) ? id : null;
      radios.forEach(radio => {
        const active = radio.value === selected;
        radio.checked = active;
        const card = radio.closest('.color-card');
        card.classList.toggle('is-selected', active);
        card.querySelector('.choice-label').textContent = active ? '已選擇這款' : '選這款';
        card.querySelector('.selection-icon').textContent = active ? '✓' : '＋';
      });
      const c = COLORS.find(item => item.id === selected);
      $('selection-summary').innerHTML = c ? `<span class="selection-kicker">你的選擇</span><strong>${c.name} · ${c.meaning}</strong><span>${c.flower} × ${c.body}</span>` : '<span class="selection-kicker">你的選擇</span><strong>尚未選擇</strong><span>請先從上方六款提案中，選一款最喜歡的設計。</span>';
      updateControls();
    }

    function updateControls() {
      const unresolved = Boolean(receipt && receipt.pending);
      radios.forEach(radio => { radio.disabled = busy || unresolved || closed; });
      const haveSavedIdentity = Boolean(receipt && (receipt.revision > 0 || unresolved) && deptInput.value.trim() && nameInput.value.trim());
      deptInput.readOnly = haveSavedIdentity;
      nameInput.readOnly = haveSavedIdentity;
      deptInput.disabled = busy;
      nameInput.disabled = busy;
      submit.disabled = busy || closed || !isConfigured(endpoint);
      if (busy) submit.textContent = '正在確認這一票…';
      else if (closed) submit.textContent = '本次票選已結束';
      else if (unresolved) submit.textContent = '重試確認這一票 ↗';
      else if (receipt && receipt.revision > 0) submit.textContent = '更新我的選擇 ↗';
      else submit.textContent = '送出我的一票 ↗';
      $('receipt-note').hidden = !(receipt && receipt.revision > 0);
    }

    function showStats(stats) {
      statsCache = stats;
      if (stats.closed) { closed = true; updateControls(); }
      $('results-status').textContent = '目前共 ' + stats.total + ' 票' + (stats.closed ? ' · 票選已結束' : '') + ' · 只呈現統計，不公開姓名';
      $('results-list').innerHTML = COLORS.map(c => {
        const count = stats.counts[c.id];
        const percentage = stats.total ? (count / stats.total * 100) : 0;
        return `<li><div class="result-top"><strong>${c.name} <span>${c.flower}</span></strong><span>${count} 票 · ${Math.round(percentage)}%</span></div><div class="result-track" aria-hidden="true"><div class="result-bar" style="width:${percentage}%"></div></div></li>`;
      }).join('');
    }

    async function loadStats() {
      if (statsLoading) return;
      if (!isConfigured(endpoint)) { $('results-status').textContent = '票選尚未開放，暫無可讀取的票數。'; return; }
      statsLoading = true;
      $('refresh-results').disabled = true;
      $('results-status').textContent = '正在讀取目前票數…';
      try {
        const url = new URL(endpoint);
        url.searchParams.set('pollId', pollId);
        url.searchParams.set('_', Date.now().toString());
        const data = await requestJSON(url.href, { method: 'GET' }, win.fetch.bind(win), config.timeoutMs);
        if (!data.ok) throw new VoteError(ERROR_MESSAGES[data.code] || '暫時無法讀取票數，請稍後更新。', data.code, false);
        showStats(normalizeStats(data, pollId));
      } catch (error) {
        $('results-status').textContent = (statsCache ? '上次票數保留供參考。' : '') + error.message;
      } finally { statsLoading = false; $('refresh-results').disabled = false; }
    }

    async function preparePayload() {
      const dept = deptInput.value.trim();
      const name = nameInput.value.trim();
      const invalid = validateIdentity(dept, name);
      if (invalid) throw new VoteError(invalid, 'BAD_IDENTITY', false);
      if (!selected) throw new VoteError('請先選擇一款花意配色。', 'BAD_CHOICE', false);
      if (!win.crypto || !win.crypto.subtle || !win.crypto.getRandomValues) throw new VoteError('此瀏覽器無法建立投票憑證，請使用最新版 Chrome、Edge 或 Safari。', 'CRYPTO', false);
      const digest = await identityDigest(win.crypto, normalizeIdentity(dept, name));
      if (receipt && receipt.identityDigest && receipt.identityDigest !== digest) throw new VoteError('此瀏覽器已保留另一份部門與姓名的投票憑證。請使用原本填寫的身分，或聯絡票選負責人。', 'IDENTITY_MISMATCH', false);
      if (!receipt) receipt = { token: randomHex(win.crypto, 32), revision: 0, choice: null, identityDigest: null, pending: null };
      if (!receipt.pending) receipt.pending = { choice: selected, requestId: randomHex(win.crypto, 16), expectedRevision: receipt.revision };
      receipt.identityDigest = digest;
      // Persist the token and same request ID before any network request. No names are stored here.
      saveReceipt();
      rememberIdentity(dept, name);
      return { pollId, dept, name, choice: receipt.pending.choice, receiptToken: receipt.token, requestId: receipt.pending.requestId, expectedRevision: receipt.pending.expectedRevision };
    }

    async function submitVote(event) {
      event.preventDefault();
      if (busy || closed) return;
      if (!isConfigured(endpoint)) { showStatus('票選尚未開放，請稍後再來。', 'error', true); return; }
      if (!form.reportValidity()) return;
      busy = true;
      updateControls();
      showStatus('正在送出並等待確認，請稍候。', '', false);
      let payload;
      try {
        payload = pendingPayload || await preparePayload();
        pendingPayload = payload;
        updateControls();
        const data = await requestJSON(endpoint, { method: 'POST', headers: { 'Content-Type': 'text/plain;charset=UTF-8' }, body: JSON.stringify(payload) }, win.fetch.bind(win), config.timeoutMs);
        if (!data.ok) {
          if (data.code === 'STALE_REVISION' && IDS.includes(data.choice) && Number.isSafeInteger(data.revision) && data.revision > 0) {
            receipt.choice = data.choice;
            receipt.revision = data.revision;
            receipt.pending = null;
            pendingPayload = null;
            saveReceipt();
            applySelection(data.choice);
          } else if (data.code !== 'BUSY') {
            receipt.pending = null;
            if (receipt.revision === 0) receipt.identityDigest = null;
            pendingPayload = null;
            saveReceipt();
          }
          if (data.code === 'POLL_CLOSED') closed = true;
          throw new VoteError(ERROR_MESSAGES[data.code] || '這次投票未完成，請稍後重試或聯絡票選負責人。', data.code, data.code === 'BUSY');
        }
        const confirmed = assertConfirmation(data, payload);
        const updated = receipt.revision > 0;
        receipt.choice = confirmed.choice;
        receipt.revision = confirmed.revision;
        receipt.pending = null;
        pendingPayload = null;
        let savedConfirmation = true;
        try { saveReceipt(); } catch (_) { savedConfirmation = false; }
        applySelection(confirmed.choice);
        showStats(confirmed.stats);
        const c = COLORS.find(item => item.id === confirmed.choice);
        showStatus((updated ? '你的選擇已更新：' : '你的票已收到：') + c.name + '。謝謝你一起決定花意配色的下一步。' + (savedConfirmation ? '' : '但此瀏覽器未能保存最新修改紀錄；如需改票，請聯絡票選負責人。'), 'success', true);
      } catch (error) {
        if (!payload && receipt && receipt.revision === 0 && error.code === 'STORAGE') { receipt = null; pendingPayload = null; }
        showStatus(error.message || '尚未確認投票結果，請稍後重試。', 'error', true);
      } finally { busy = false; updateControls(); }
    }

    radios.forEach(radio => radio.addEventListener('change', () => {
      applySelection(radio.value);
      if (status.classList.contains('is-success')) showStatus('已改選，按「更新我的選擇」才會更新票數。', '', false);
    }));
    form.addEventListener('submit', submitVote);
    results.addEventListener('toggle', () => { if (results.open) loadStats(); });
    $('refresh-results').addEventListener('click', loadStats);

    const dialog = $('image-dialog');
    function closeDialog() { dialog.close(); }
    grid.addEventListener('click', event => {
      const trigger = event.target.closest('button[data-image]');
      if (!trigger) return;
      const c = COLORS.find(item => item.id === trigger.dataset.image);
      if (!c) return;
      lastDialogTrigger = trigger;
      $('dialog-title').textContent = c.name + '｜' + c.flower + ' × ' + c.body;
      $('dialog-image').src = 'assets/' + c.id + '.jpg';
      $('dialog-image').alt = c.name + '配色刺繡大圖；' + c.shape;
      $('dialog-caption').textContent = c.story;
      dialog.showModal();
      document.body.classList.add('dialog-open');
    });
    $('close-dialog').addEventListener('click', closeDialog);
    dialog.addEventListener('click', event => {
      if (event.target !== dialog) return;
      const rect = dialog.getBoundingClientRect();
      if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) closeDialog();
    });
    dialog.addEventListener('close', () => { document.body.classList.remove('dialog-open'); if (lastDialogTrigger) lastDialogTrigger.focus({ preventScroll: true }); });

    if (!isConfigured(endpoint)) {
      $('service-notice').hidden = false;
      $('service-notice').textContent = '票選尚未開放，現在可以先看六款設計提案。';
    }
    if (receipt && receipt.pending) {
      applySelection(receipt.pending.choice);
      showStatus('上一次送出尚待確認。請填回原本的部門與姓名，再按「重試確認這一票」。', '', false);
    } else if (receipt && receipt.choice) {
      applySelection(receipt.choice);
      showStatus('此瀏覽器已保存你的投票。可以選擇另一款，再更新這一票。', '', false);
    } else updateControls();

    return { loadStats };
  }

  return { POLL_ID, COLORS, SYMBOLISM, IDS, VoteError, normalizeIdentity, validateIdentity, normalizeStats, assertConfirmation, isConfigured, requestJSON, randomHex, identityDigest, parseReceipt, mount };
});
