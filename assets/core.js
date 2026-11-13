/* ═══════════════════════════════════════════════════════════
   DOCUMENT HUB v3 — core (storage · migration · AI · engine)
   ═══════════════════════════════════════════════════════════ */
'use strict';
const DH_VERSION = '4.0';
const REPO_URL = 'https://github.com/minu-96/DocumentHub';
const HUB_FILE = 'index.html';
const TOOL_FILES = { game: 'GameDesign.html', biz: 'BusinessPlan.html', paper: 'Paper.html' };
const TOOL_NAMES = { game: '게임 기획서', biz: '사업 계획서', paper: '논문 · 보고서' };

/* ─── utils ─── */
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
const today = () => { const d = new Date(); return new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 10); };
const debounce = (fn, ms) => { let t; return (...a) => { clearTimeout(t); t = setTimeout(() => fn(...a), ms); }; };
const num = v => { if (v == null || v === '') return NaN; const n = parseFloat(String(v).replace(/[, ₩원$%]/g, '')); return isFinite(n) ? n : NaN; };
const fmtN = (n, d = 0) => isFinite(n) ? n.toLocaleString('ko-KR', { maximumFractionDigits: d, minimumFractionDigits: 0 }) : '—';
const fmtWon = n => {
  if (!isFinite(n)) return '—';
  const a = Math.abs(n), s = n < 0 ? '-' : '';
  if (a >= 1e8) return s + fmtN(a / 1e8, 2) + '억';
  if (a >= 1e4) return s + fmtN(a / 1e4, 0) + '만';
  return s + fmtN(a);
};
const fmtWhen = ts => {
  if (!ts) return '';
  const diff = (Date.now() - ts) / 1000;
  if (diff < 60) return '방금';
  if (diff < 3600) return Math.floor(diff / 60) + '분 전';
  if (diff < 86400) return Math.floor(diff / 3600) + '시간 전';
  if (diff < 86400 * 7) return Math.floor(diff / 86400) + '일 전';
  return new Date(ts).toLocaleDateString('ko-KR', { year: '2-digit', month: 'short', day: 'numeric' });
};
const fmtTime = ts => new Date(ts).toLocaleString('ko-KR', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
const qs = k => new URLSearchParams(location.search).get(k);
const safeName = s => String(s || '문서').replace(/[\/\\?%*:|"<>]/g, '_').slice(0, 80);
function download(name, content, type) {
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([content], { type }));
  a.download = name;
  document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(a.href), 4000);
}

/* ─── storage ─── */
const LS = {
  get(k, d = null) { try { const v = localStorage.getItem(k); return v == null ? d : JSON.parse(v); } catch (e) { return d; } },
  set(k, v) {
    try { localStorage.setItem(k, JSON.stringify(v)); return true; }
    catch (e) { toast('브라우저 저장 공간이 부족하거나 저장이 차단되었습니다. 허브에서 백업 후 오래된 스냅샷을 정리하세요.', 'err', 6000); return false; }
  },
  del(k) { try { localStorage.removeItem(k); } catch (e) { } },
  keys(prefix) { const out = []; try { for (let i = 0; i < localStorage.length; i++) { const k = localStorage.key(i); if (k && k.startsWith(prefix)) out.push(k); } } catch (e) { } return out; },
  bytes() { let n = 0; try { for (let i = 0; i < localStorage.length; i++) { const k = localStorage.key(i); n += (k.length + (localStorage.getItem(k) || '').length) * 2; } } catch (e) { } return n; },
};
const Store = {
  list(tool) { return LS.keys('dh_doc_').map(k => LS.get(k)).filter(d => d && d.id && (!tool || d.tool === tool)).sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0)); },
  get(id) { return LS.get('dh_doc_' + id); },
  put(doc, touch = true) { if (touch) doc.updatedAt = Date.now(); return LS.set('dh_doc_' + doc.id, doc); },
  del(id) { LS.del('dh_doc_' + id); LS.del('dh_snap_' + id); },
  snaps(id) { return LS.get('dh_snap_' + id, []) || []; },
  addSnap(doc, label) {
    const s = Store.snaps(doc.id);
    s.unshift({ ts: Date.now(), label: label || '스냅샷', values: JSON.parse(JSON.stringify(doc.values || {})), customTpl: doc.customTpl ? JSON.parse(JSON.stringify(doc.customTpl)) : undefined });
    return LS.set('dh_snap_' + doc.id, s.slice(0, 30));
  },
};

/* ─── theme ─── */
const Theme = {
  init() { const t = LS.get('dh_theme', 'auto'); Theme.apply(t); },
  apply(t) { if (t === 'auto') document.documentElement.removeAttribute('data-theme'); else document.documentElement.setAttribute('data-theme', t); LS.set('dh_theme', t); },
  cycle() {
    const cur = LS.get('dh_theme', 'auto'); const nx = cur === 'auto' ? 'light' : cur === 'light' ? 'dark' : 'auto';
    Theme.apply(nx); toast({ auto: '테마: 시스템 설정 따름', light: '테마: 라이트', dark: '테마: 다크' }[nx]);
  },
};

/* ─── toast / modal ─── */
function toast(msg, type = '', ms = 2600) {
  let box = $('#toasts'); if (!box) { box = document.createElement('div'); box.id = 'toasts'; document.body.appendChild(box); }
  const t = document.createElement('div'); t.className = 'toast ' + type; t.textContent = msg; box.appendChild(t);
  setTimeout(() => { t.style.opacity = '0'; t.style.transition = 'opacity .3s'; setTimeout(() => t.remove(), 300); }, ms);
}
function openModal(id) { const m = document.getElementById(id); if (m) { m.classList.add('open'); document.body.style.overflow = 'hidden'; } }
function closeModal(id) { const m = document.getElementById(id); if (m) { m.classList.remove('open'); } if (!$$('.modal.open').length) document.body.style.overflow = ''; }
function modalShell(id, title, body, foot = '', wide = false) {
  let m = document.getElementById(id);
  if (!m) { m = document.createElement('div'); m.id = id; m.className = 'modal'; document.body.appendChild(m); m.addEventListener('mousedown', e => { if (e.target === m) closeModal(id); }); }
  m.innerHTML = `<div class="modal-box ${wide ? 'wide' : ''}"><div class="modal-hd"><h3>${title}</h3><button class="btn btn-ghost btn-sm btn-icon" onclick="closeModal('${id}')" aria-label="닫기">✕</button></div>
    <div class="modal-bd">${body}</div>${foot ? `<div class="modal-ft">${foot}</div>` : ''}</div>`;
  openModal(id); return m;
}
document.addEventListener('keydown', e => { if (e.key === 'Escape') { const open = $$('.modal.open'); if (open.length) closeModal(open[open.length - 1].id); } });

/* ─── mini markdown (for AI output) ─── */
function md(src) {
  const lines = String(src || '').replace(/\r/g, '').split('\n');
  let html = '', list = null, para = [];
  const inline = s => esc(s).replace(/`([^`]+)`/g, '<code>$1</code>').replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>').replace(/(^|[^*])\*([^*\n]+)\*/g, '$1<em>$2</em>');
  const flushP = () => { if (para.length) { html += '<p>' + para.map(inline).join('<br>') + '</p>'; para = []; } };
  const flushL = () => { if (list) { html += `</${list}>`; list = null; } };
  for (const raw of lines) {
    const l = raw.trimEnd();
    let m;
    if (!l.trim()) { flushP(); flushL(); continue; }
    if ((m = l.match(/^#{1,4}\s+(.*)/))) { flushP(); flushL(); html += '<h4>' + inline(m[1]) + '</h4>'; continue; }
    if ((m = l.match(/^\s*[-*•]\s+(.*)/))) { flushP(); if (list !== 'ul') { flushL(); html += '<ul>'; list = 'ul'; } html += '<li>' + inline(m[1]) + '</li>'; continue; }
    if ((m = l.match(/^\s*(\d+)[.)]\s+(.*)/))) { flushP(); if (list !== 'ol') { flushL(); html += '<ol>'; list = 'ol'; } html += '<li>' + inline(m[2]) + '</li>'; continue; }
    if ((m = l.match(/^>\s?(.*)/))) { flushP(); flushL(); html += '<blockquote>' + inline(m[1]) + '</blockquote>'; continue; }
    flushL(); para.push(l);
  }
  flushP(); flushL();
  return html;
}

/* ═══════════════════════════════════════════════════════════
   SETTINGS + AI
   ═══════════════════════════════════════════════════════════ */
const AI_PROVIDERS = {
  gemini: { name: 'Gemini', vendor: 'Google', models: ['gemini-3.5-flash-lite', 'gemini-3.8-flash', 'gemini-4-hydrogen'], def: 'gemini-3.5-flash-lite', keyUrl: 'https://aistudio.google.com/apikey' },
  claude: { name: 'Claude', vendor: 'Anthropic · 유료', models: ['claude-haiku-5-5', 'claude-sonnet-5-5', 'claude-opus-5-5'], def: 'claude-haiku-5-5', keyUrl: 'https://console.anthropic.com/' },
  openai: { name: 'GPT', vendor: 'OpenAI · 유료', models: ['gpt-6-luna', 'gpt-6-sol', 'gpt-6.1-sol'], def: 'gpt-6-luna', keyUrl: 'https://platform.openai.com/api-keys' },
};
/* 공용 AI — 사이트 운영자가 서버(functions/api/ai.js)에 넣어 둔 키를 쓰는 경로. 방문자는 설정이 필요 없다. */
const Shared = {
  ok: false, model: '', checked: false,
  async check() {
    if (Shared.checked) return Shared.ok; Shared.checked = true;
    if (!/^https?:$/.test(location.protocol)) return false;
    try {
      const c = sessionStorage.getItem('dh_shared'); if (c) { Object.assign(Shared, JSON.parse(c)); return Shared.ok; }
      const r = await fetch('api/ai', { method: 'GET' }); const d = r.ok ? await r.json() : {};
      Shared.ok = !!d.ok; Shared.model = d.model || '';
      sessionStorage.setItem('dh_shared', JSON.stringify({ ok: Shared.ok, model: Shared.model }));
    } catch (e) { Shared.ok = false; }
    if (Shared.ok) document.dispatchEvent(new Event('dh-settings'));
    return Shared.ok;
  },
};
const Settings = {
  get() {
    const s = LS.get('dh_settings', {}) || {};
    s.provider = s.provider || 'auto';
    s.keys = Object.assign({ gemini: '', claude: '', openai: '' }, s.keys || {});
    s.models = Object.assign({}, ...Object.entries(AI_PROVIDERS).map(([k, p]) => ({ [k]: p.def })), s.models || {});
    s.author = s.author || ''; s.team = s.team || '';
    return s;
  },
  save(s) { LS.set('dh_settings', s); },
  // 실제로 쓸 AI: 사용자가 고른 것 → (auto면) 본인 키가 있는 것 → 공용 AI
  resolve(p) {
    const s = Settings.get(); p = p || s.provider;
    if (p === 'shared') return Shared.ok ? 'shared' : null;
    if (p && p !== 'auto') return s.keys[p] ? p : (Shared.ok ? 'shared' : p);
    const own = Object.keys(AI_PROVIDERS).find(k => s.keys[k]);
    return own || (Shared.ok ? 'shared' : null);
  },
  aiReady() { return !!Settings.resolve() && (Settings.resolve() === 'shared' || !!Settings.get().keys[Settings.resolve()]); },
  open() {
    const s = Settings.get();
    const provRow = (k, p) => `
      <div style="border:1px solid var(--line);border-radius:10px;padding:12px 14px;margin-bottom:10px">
        <div style="display:flex;align-items:center;gap:8px;margin-bottom:8px"><b style="font-size:13.5px">${p.name}</b><span class="muted" style="font-size:12px">${p.vendor}</span>
          <a href="${p.keyUrl}" target="_blank" rel="noopener" style="margin-left:auto;font-size:12px">키 발급 ↗</a></div>
        <div class="grid" style="gap:8px 10px">
          <div class="f twothird"><input type="password" id="set-key-${k}" value="${esc(s.keys[k])}" placeholder="API 키" autocomplete="off"></div>
          <div class="f third"><input id="set-model-${k}" value="${esc(s.models[k])}" list="dl-${k}" placeholder="모델 ID"><datalist id="dl-${k}">${p.models.map(m => `<option value="${m}">`).join('')}</datalist></div>
        </div>
        <div class="btn-row" style="margin-top:8px"><button class="btn btn-xs" onclick="Settings.test('${k}')">연결 테스트</button><span id="set-test-${k}" class="muted" style="font-size:12px"></span></div>
      </div>`;
    modalShell('settingsModal', 'AI · 작성자 설정', `
      ${Shared.ok ? `<div class="co co-ok"><span class="co-ic">✓</span><div><b>공용 AI를 쓸 수 있습니다 — 아무것도 설정하지 않아도 됩니다.</b><br>운영자가 비용을 부담하므로 1인당 하루 사용 횟수에 제한이 있습니다(전체 검토는 더 적게). AI를 실행하면 해당 문서 내용이 이 사이트 서버를 거쳐 Google Gemini로 전송됩니다. 공개하면 안 되는 문서는 아래에 본인 키를 넣어 쓰세요.</div></div>`
        : `<div class="co co-tip"><span class="co-ic">i</span><div>이 환경에서는 공용 AI를 쓸 수 없습니다(파일로 직접 열었거나 서버에 키가 설정되지 않음). 아래에 본인 API 키를 하나 넣으면 AI 기능이 켜집니다.</div></div>`}
      <div class="co co-warn"><span class="co-ic">!</span><div>본인 API 키는 <b>이 브라우저에만</b> 저장되고 문서 파일·공유 링크에는 들어가지 않습니다. 공용 PC에서는 사용 후 지우세요.</div></div>
      <div class="f" style="margin-bottom:14px"><div class="f-lab">기본 AI</div>
        <div class="seg" id="set-prov">${[['auto', '자동'], ...(Shared.ok ? [['shared', '공용 AI']] : []), ...Object.entries(AI_PROVIDERS).map(([k, p]) => [k, p.name])].map(([k, l]) => `<button type="button" data-p="${k}" class="${s.provider === k ? 'on' : ''}">${l}</button>`).join('')}</div>
        <div class="f-hint">자동: 본인 키가 있으면 그것을, 없으면 공용 AI를 씁니다.</div></div>
      ${Object.entries(AI_PROVIDERS).map(([k, p]) => provRow(k, p)).join('')}
      <div class="f-hint" style="margin-bottom:16px">본인 키의 기본 모델은 2026년 11월 기준 각 사의 저가 모델입니다. 더 깊은 검토가 필요하면 상위 모델 ID로 바꾸세요. 모델이 종료되면 공식 문서의 최신 ID로 바꿔 넣으세요.</div>
      <div class="grid"><div class="f half"><div class="f-lab">기본 작성자</div><input id="set-author" value="${esc(s.author)}" placeholder="출력물 표지에 들어갈 이름"></div>
      <div class="f half"><div class="f-lab">기본 팀 / 소속</div><input id="set-team" value="${esc(s.team)}" placeholder="예: 스튜디오 OO / OO대학교"></div></div>`,
      `<button class="btn btn-danger btn-sm" onclick="Settings.clearKeys()">키 모두 삭제</button><span style="flex:1"></span><button class="btn" onclick="closeModal('settingsModal')">취소</button><button class="btn btn-pri" onclick="Settings.commit()">저장</button>`);
    $$('#set-prov button').forEach(b => b.onclick = () => { $$('#set-prov button').forEach(x => x.classList.remove('on')); b.classList.add('on'); });
  },
  read() {
    const s = Settings.get();
    const on = $('#set-prov button.on'); if (on) s.provider = on.dataset.p;
    for (const k of Object.keys(AI_PROVIDERS)) {
      const kk = $('#set-key-' + k), mm = $('#set-model-' + k);
      if (kk) s.keys[k] = kk.value.trim(); if (mm) s.models[k] = mm.value.trim() || AI_PROVIDERS[k].def;
    }
    const a = $('#set-author'), t = $('#set-team'); if (a) s.author = a.value.trim(); if (t) s.team = t.value.trim();
    return s;
  },
  commit() { Settings.save(Settings.read()); closeModal('settingsModal'); toast('설정을 저장했습니다.', 'ok'); document.dispatchEvent(new Event('dh-settings')); },
  clearKeys() { if (!confirm('저장된 API 키를 모두 삭제할까요?')) return; const s = Settings.get(); s.keys = { gemini: '', claude: '', openai: '' }; Settings.save(s); Settings.open(); toast('키를 삭제했습니다.'); },
  async test(k) {
    const s = Settings.read(); Settings.save(s);
    const out = $('#set-test-' + k);
    if (!s.keys[k]) { out.style.color = 'var(--err)'; out.textContent = '키를 먼저 입력하세요.'; return; }
    out.innerHTML = '<span class="spin"></span>';
    try { const r = await AI.call({ provider: k, system: '짧게 답하세요.', messages: [{ role: 'user', content: '"연결됨" 한 단어만 출력' }], maxTokens: 50 }); out.style.color = 'var(--ok)'; out.textContent = '✓ ' + r.slice(0, 40); }
    catch (e) { out.style.color = 'var(--err)'; out.textContent = '✕ ' + e.message.slice(0, 160); }
  },
};

const AI = {
  async call({ provider, system, messages, maxTokens = 4096, tier = 'lite' }) {
    const s = Settings.get(); const p = Settings.resolve(provider);
    if (!p) throw new Error('AI를 쓸 수 없습니다. ⚙ 설정에서 API 키를 입력하세요. ');
    if (p === 'shared') return AI.callShared({ system, messages, maxTokens, tier });
    const key = s.keys[p]; const model = s.models[p];
    if (!key) throw new Error(`${AI_PROVIDERS[p].name} API 키가 없습니다. 상단 ⚙ 설정에서 입력하세요.`);
    let res, d;
    try {
      if (p === 'gemini') {
        res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent`, {
          method: 'POST', headers: { 'Content-Type': 'application/json', 'x-goog-api-key': key },
          body: JSON.stringify({
            systemInstruction: system ? { parts: [{ text: system }] } : undefined,
            contents: messages.map(m => ({ role: m.role === 'assistant' ? 'model' : 'user', parts: [{ text: m.content }] })),
            generationConfig: { maxOutputTokens: maxTokens },
          }),
        });
        d = await res.json();
        if (d.error) throw new Error(d.error.message);
        const parts = d.candidates?.[0]?.content?.parts || [];
        const txt = parts.map(x => x.text || '').join('');
        if (!txt) throw new Error('빈 응답 (' + (d.candidates?.[0]?.finishReason || d.promptFeedback?.blockReason || '사유 불명') + ')');
        return txt;
      }
      if (p === 'claude') {
        res = await fetch('https://api.anthropic.com/v1/messages', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'x-api-key': key, 'anthropic-version': '2023-06-01', 'anthropic-dangerous-direct-browser-access': 'true' },
          body: JSON.stringify({ model, max_tokens: maxTokens, system: system || undefined, messages: messages.map(m => ({ role: m.role, content: m.content })) }),
        });
        d = await res.json();
        if (d.error) throw new Error(d.error.message);
        return (d.content || []).filter(c => c.type === 'text').map(c => c.text).join('') || '응답 없음';
      }
      res = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + key },
        body: JSON.stringify({ model, max_completion_tokens: Math.max(maxTokens, 2000) * 2, messages: [...(system ? [{ role: 'system', content: system }] : []), ...messages] }),
      });
      d = await res.json();
      if (d.error) throw new Error(d.error.message);
      return d.choices?.[0]?.message?.content || '응답 없음';
    } catch (e) {
      if (e instanceof TypeError) throw new Error('네트워크 오류 — 인터넷 연결 또는 브라우저 확장(광고 차단 등)을 확인하세요.');
      throw e;
    }
  },
  async callShared({ system, messages, maxTokens, tier }) {
    let res, d;
    try { res = await fetch('api/ai', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ system, messages, maxTokens, tier }) }); d = await res.json(); }
    catch (e) { throw new Error('공용 AI 서버에 연결하지 못했습니다. 잠시 후 다시 시도하거나 ⚙ 설정에서 본인 키를 쓰세요.'); }
    if (!res.ok || d.error) throw new Error(d.error || `공용 AI 오류 (${res.status})`);
    return d.text;
  },
  // 쓸 수 있는 AI만 보여준다 (공용 AI + 키가 들어 있는 것)
  provPicker(id, cur) {
    const s = Settings.get(); cur = Settings.resolve(cur);
    const opts = [...(Shared.ok ? [['shared', '공용 AI']] : []), ...Object.entries(AI_PROVIDERS).filter(([k]) => s.keys[k]).map(([k, p]) => [k, p.name])];
    if (!opts.length) return `<span id="${id}" class="muted" style="font-size:12px">AI 미설정 · <a onclick="Settings.open()" style="cursor:pointer">설정</a></span>`;
    return `<div class="seg" id="${id}">${opts.map(([k, l]) => `<button type="button" data-p="${k}" class="${cur === k ? 'on' : ''}">${l}</button>`).join('')}</div>`;
  },
  bindPicker(id) { $$('#' + id + ' button').forEach(b => b.onclick = () => { $$('#' + id + ' button').forEach(x => x.classList.remove('on')); b.classList.add('on'); }); },
  picked(id) { return $('#' + id + ' button.on')?.dataset.p || undefined; },
};
const AI_RULES = `공통 규칙:
- 칭찬·인사말·요약 반복 없이 바로 본론.
- 문서에 실제로 적힌 내용만 근거로 판단. 비어 있는 항목은 "미작성"이라고 지적.
- 통계·시장 규모·법규·논문 같은 외부 사실을 새로 지어내지 말 것. 필요하면 "확인 필요: 무엇을, 어디서"라고 표시.
- 지적마다 ①왜 문제인지 ②구체적 수정 예시(문장 또는 수치 형태)를 함께 제시.
- 한국어, 마크다운(소제목 + 목록).`;

/* ═══════════════════════════════════════════════════════════
   TEMPLATE DSL + REGISTRY
   ═══════════════════════════════════════════════════════════ */
const F = {
  text: (key, label, o = {}) => ({ type: 'text', key, label, ...o }),
  area: (key, label, o = {}) => ({ type: 'area', key, label, ...o }),
  sel: (key, label, options, o = {}) => ({ type: 'select', key, label, options, ...o }),
  num: (key, label, o = {}) => ({ type: 'number', key, label, ...o }),
  date: (key, label, o = {}) => ({ type: 'date', key, label, ...o }),
  table: (key, label, cols, o = {}) => ({ type: 'table', key, label, cols, ...o }),
  cards: (key, label, fields, o = {}) => ({ type: 'cards', key, label, fields, ...o }),
  check: (key, label, items, o = {}) => ({ type: 'check', key, label, items, ...o }),
  calc: (id, o = {}) => ({ type: 'calc', calc: id, key: '_calc_' + id, ...o }),
  note: (text, kind = 'tip', o = {}) => ({ type: 'note', text, kind, key: '_note_' + (o.id || Math.random().toString(36).slice(2, 8)), ...o }),
};
const C = (k, l, t = 'text', o = {}) => ({ k, l, t, ...o }); // table column
const TPL = {};       // id → template
const CALCS = {};     // id → { title, compute(values) → {kpis:[{l,v,s,lvl}], note, lines:[]} }
const SAMPLES = {};    // template id → { name, values, meta }  (채워진 예시 문서)
const PERSONAS = {};  // id → { name, icon, role, format }
const TOOLS = {};     // tool id → { id, name, icon, personas:[], templates:[], hero }
function registerTemplate(t) {
  t.sections.forEach((s, i) => { s.idx = i; s.fields.forEach(f => { f._sec = s.id; if (f.type === 'area' && /Loop$|Flow$|^flow/.test(f.key)) f.flow = true; }); });
  t._fields = t.sections.flatMap(s => s.fields);
  t._deps = new Set([...t._fields.filter(f => f.showIf).map(f => f.showIf.k), ...t.sections.filter(s => s.showIf).map(s => s.showIf.k)]);
  TPL[t.id] = t;
}
function visSecs(tpl, v) { return tpl.sections.filter(s => !s.showIf || showIfOk(s, v || {})); }
const itemKey = it => typeof it === 'string' ? it : it.k || it.l;
const itemLabel = it => typeof it === 'string' ? it : it.l;

/* ─── value helpers ─── */
function showIfOk(f, v) {
  const c = f.showIf; if (!c) return true;
  const x = v[c.k];
  if (c.has) return Array.isArray(x) ? x.some(i => String(i).includes(c.has)) : String(x || '').toUpperCase().includes(String(c.has).toUpperCase());
  if (c.eq != null) return x === c.eq;
  if (c.filled) return isFilledVal({ type: 'text' }, x);
  return true;
}
function isFilledVal(f, x) {
  if (x == null) return false;
  if (f.type === 'table') return Array.isArray(x) && x.some(r => r && Object.values(r).some(c => String(c ?? '').trim()));
  if (f.type === 'cards') return Array.isArray(x) && x.some(r => r && Object.values(r).some(c => String(c ?? '').trim()));
  if (f.type === 'check') return Array.isArray(x) && x.length > 0;
  return String(x).trim().length > 0;
}
const inputFields = sec => sec.fields.filter(f => !['note', 'calc'].includes(f.type));
function secStats(sec, v) {
  const fs = inputFields(sec).filter(f => showIfOk(f, v));
  const filled = fs.filter(f => isFilledVal(f, v[f.key])).length;
  const req = fs.filter(f => f.req); const reqFilled = req.filter(f => isFilledVal(f, v[f.key])).length;
  return { total: fs.length, filled, req: req.length, reqFilled };
}
function docStats(tpl, v) {
  let total = 0, filled = 0, req = 0, reqFilled = 0;
  visSecs(tpl, v).forEach(s => { const st = secStats(s, v); total += st.total; filled += st.filled; req += st.req; reqFilled += st.reqFilled; });
  const pct = total ? Math.round((reqFilled / Math.max(req, 1)) * 60 + (filled / total) * 40) : 0;
  return { total, filled, req, reqFilled, pct: Math.min(100, pct) };
}
function tableRows(x) { return Array.isArray(x) ? x.filter(r => r && Object.values(r).some(c => String(c ?? '').trim())) : []; }
function colSum(rows, k) { return tableRows(rows).reduce((a, r) => a + (isFinite(num(r[k])) ? num(r[k]) : 0), 0); }

/* ─── calc rendering ─── */
function calcResult(id, v) {
  const c = CALCS[id]; if (!c) return null;
  try { return c.compute(v || {}); } catch (e) { return { kpis: [], note: '계산 오류: ' + e.message }; }
}
function calcHTML(id, v) {
  const c = CALCS[id]; const r = calcResult(id, v); if (!c || !r) return '';
  return `<div class="calc-hd">▦ ${esc(c.title)}</div>
    ${r.kpis?.length ? `<div class="kpis">${r.kpis.map(k => `<div class="kpi ${k.lvl || ''}"><div class="kpi-l">${esc(k.l)}</div><div class="kpi-v">${esc(k.v)}</div>${k.s ? `<div class="kpi-s">${esc(k.s)}</div>` : ''}</div>`).join('')}</div>` : ''}
    ${r.lines?.length ? `<ul class="calc-list">${r.lines.map(l => `<li>${l}</li>`).join('')}</ul>` : ''}
    ${r.note ? `<div class="calc-note">${r.note}</div>` : ''}`;
}

/* ═══════════════════════════════════════════════════════════
   DOCUMENT OUTPUT (text · markdown · html)
   ═══════════════════════════════════════════════════════════ */
function tplOf(doc) { return doc.template === 'custom' ? buildCustomTpl(doc) : TPL[doc.template]; }
function valText(f, x) {
  if (!isFilledVal(f, x)) return '';
  if (f.type === 'table') return tableRows(x).map((r, i) => `${i + 1}) ` + f.cols.map(c => r[c.k] ? `${c.l}: ${r[c.k]}` : '').filter(Boolean).join(' / ')).join('\n');
  if (f.type === 'cards') return x.filter(r => r && Object.values(r).some(Boolean)).map((r, i) => `[${i + 1}] ` + f.fields.map(sf => r[sf.key] ? `${sf.label}: ${r[sf.key]}` : '').filter(Boolean).join('\n   ')).join('\n');
  if (f.type === 'check') { const lab = {}; f.items.forEach(it => lab[itemKey(it)] = itemLabel(it)); return x.map(k => '✓ ' + (lab[k] || k)).join(', '); }
  if (f.type === 'number') return x + (f.unit ? ' ' + f.unit : '');
  return String(x);
}
function docToText(doc, tpl, onlySec) {
  const v = doc.values || {};
  let out = `# ${doc.name}\n양식: ${tpl.name}\n`;
  visSecs(tpl, v).forEach(s => {
    if (onlySec && s.id !== onlySec) return;
    const parts = [];
    s.fields.forEach(f => {
      if (!showIfOk(f, v)) return;
      if (f.type === 'calc') { const r = calcResult(f.calc, v); if (r?.kpis?.length) parts.push(`- ${CALCS[f.calc].title}: ` + r.kpis.map(k => `${k.l} ${k.v}`).join(', ')); return; }
      if (f.type === 'note') return;
      const t = valText(f, v[f.key]);
      parts.push(`- ${f.label}: ${t ? (t.includes('\n') ? '\n' + t.replace(/^/gm, '    ') : t) : '(미작성)'}`);
    });
    out += `\n## ${s.title}\n${parts.join('\n')}\n`;
  });
  return out;
}
function docToMarkdown(doc, tpl, opt = {}) {
  const v = doc.values || {}, m = doc.meta || {};
  let o = opt.onlySec ? '' : `# ${doc.name}\n\n`;
  if (!opt.onlySec) o += `| 항목 | 내용 |\n|---|---|\n| 양식 | ${tpl.name} |\n` + [['작성자', m.author], ['팀/소속', m.team], ['버전', m.version], ['작성일', m.date]].filter(x => x[1]).map(([a, b]) => `| ${a} | ${b} |`).join('\n') + '\n\n';
  if (m.history && !opt.onlySec) o += `**개정 이력**\n\n${m.history}\n\n`;
  visSecs(tpl, v).forEach((s, si) => {
    if (opt.onlySec && s.id !== opt.onlySec) return;
    const body = [];
    s.fields.forEach(f => {
      if (!showIfOk(f, v) || f.type === 'note' || f.hideInDoc) return;
      if (f.type === 'calc') { const r = calcResult(f.calc, v); if (r?.docOnlyLines && r.docLines?.length) { body.push(`### ${CALCS[f.calc].title}\n\n` + r.docLines.join('\n\n')); return; } if (r?.kpis?.length) body.push(`**${CALCS[f.calc].title}**\n\n` + r.kpis.map(k => `- ${k.l}: **${k.v}**${k.s ? ` (${k.s})` : ''}`).join('\n')); return; }
      const x = v[f.key];
      if (!isFilledVal(f, x)) { if (opt.showEmpty) body.push(`### ${f.label}\n\n_(미작성)_`); return; }
      if (f.type === 'table') {
        const rows = tableRows(x);
        body.push(`### ${f.label}\n\n| ${f.cols.map(c => c.l).join(' | ')} |\n| ${f.cols.map(() => '---').join(' | ')} |\n` + rows.map(r => '| ' + f.cols.map(c => String(r[c.k] ?? '').replace(/\n/g, '<br>').replace(/\|/g, '\\|')).join(' | ') + ' |').join('\n'));
      } else if (f.type === 'cards') {
        body.push(`### ${f.label}\n\n` + x.filter(r => r && Object.values(r).some(Boolean)).map((r, i) => `#### ${i + 1}. ${r[f.fields[0].key] || '(이름 없음)'}\n\n` + f.fields.slice(1).filter(sf => r[sf.key]).map(sf => `- **${sf.label}**: ${String(r[sf.key]).replace(/\n/g, '\n  ')}`).join('\n')).join('\n\n'));
      } else body.push(`### ${f.label}\n\n${valText(f, x)}`);
    });
    if (body.length) o += `## ${si + 1}. ${s.title}\n\n${body.join('\n\n')}\n\n`;
  });
  if (opt.memos) { const mm = memoList(doc, tpl); if (mm.length) o += `## 부록. 결정 로그\n\n` + mm.map(x => `- **${x.label}**: ${x.memo}`).join('\n') + '\n'; }
  return o;
}
function memoList(doc, tpl) {
  const n = doc.notes || {}; const lab = {}; tpl._fields.forEach(f => lab[f.key] = f.label);
  return Object.entries(n).filter(([, m]) => String(m || '').trim()).map(([k, m]) => ({ key: k, label: lab[k] || k, memo: m }));
}
const DOC_CSS = `
.docv{font-family:'Pretendard Variable',Pretendard,-apple-system,'Apple SD Gothic Neo','Malgun Gothic',sans-serif;color:#1b1e25;line-height:1.75;font-size:14px;max-width:860px;margin:0 auto;padding:56px 60px;background:#fff;word-break:keep-all;overflow-wrap:anywhere}
.docv .cover{border-bottom:2px solid #1b1e25;padding-bottom:22px;margin-bottom:28px}
.docv .cover-k{font-size:11.5px;font-weight:700;letter-spacing:.08em;color:var(--dacc,#3b5bdb);text-transform:uppercase}
.docv .cover h1{font-size:30px;line-height:1.25;letter-spacing:-.02em;margin:8px 0 16px;font-weight:800}
.docv .meta{border-collapse:collapse;font-size:13px}
.docv .meta td{padding:3px 18px 3px 0;vertical-align:top}.docv .meta td:first-child{color:#6b7280;font-weight:600;white-space:nowrap}
.docv .hist{margin-top:14px;font-size:12.5px;color:#4b5563;background:#f6f7f9;border-radius:8px;padding:10px 14px;white-space:pre-wrap}
.docv .toc{background:#f6f7f9;border-radius:10px;padding:16px 20px;margin-bottom:34px;font-size:13px}
.docv .toc b{display:block;font-size:11.5px;color:#6b7280;letter-spacing:.06em;margin-bottom:6px}
.docv .toc ol{margin:0 0 0 18px;columns:2;column-gap:28px}.docv .toc li{margin:2px 0}
.docv h2{font-size:20px;font-weight:800;letter-spacing:-.015em;margin:40px 0 16px;padding-bottom:8px;border-bottom:2px solid var(--dacc,#3b5bdb);break-after:avoid}
.docv h3{font-size:13px;font-weight:750;color:#374151;margin:20px 0 6px;break-after:avoid}
.docv h4{font-size:14px;font-weight:750;margin:0 0 8px}
.docv p{margin:0 0 6px;white-space:pre-wrap}
.docv .empty{color:#9ca3af;font-style:italic}
.docv table.dt{width:100%;border-collapse:collapse;font-size:12.5px;margin:4px 0 10px}
.docv table.dt th{background:#f3f4f7;text-align:left;font-weight:700;padding:7px 9px;border:1px solid #e3e6eb}
.docv table.dt td{padding:7px 9px;border:1px solid #e3e6eb;vertical-align:top;white-space:pre-wrap}
.docv table.dt tfoot td{background:#f8f9fb;font-weight:700}
.docv .dcard{border:1px solid #e3e6eb;border-left:3px solid var(--dacc,#3b5bdb);border-radius:6px;padding:12px 16px;margin:10px 0;break-inside:avoid}
.docv .dcard dl{display:grid;grid-template-columns:130px 1fr;gap:4px 14px;font-size:13px;margin:0}
.docv .dcard dt{color:#6b7280;font-weight:600}.docv .dcard dd{margin:0;white-space:pre-wrap}
.docv .dcalc{display:flex;flex-wrap:wrap;gap:8px;margin:6px 0 12px}
.docv .dcalc div{border:1px solid #e3e6eb;border-radius:6px;padding:6px 12px;font-size:12px;color:#6b7280}
.docv .dcalc b{display:block;color:#1b1e25;font-size:15px}
.docv .ck{margin:0;padding:0;list-style:none;columns:2;font-size:13px}.docv .ck li{margin:2px 0}
.docv .memo{font-size:12px;color:#6b7280;border-left:2px solid #d1d5db;padding-left:10px;margin:4px 0 8px}
.docv .foot{margin-top:56px;padding-top:12px;border-top:1px solid #e3e6eb;font-size:11px;color:#9ca3af;text-align:center}
.docv .flow{display:flex;flex-wrap:wrap;align-items:center;gap:6px;margin:4px 0 10px}
.docv .flow-n{border:1.5px solid var(--dacc,#3b5bdb);border-radius:999px;padding:4px 12px;font-size:12.5px;font-weight:650;background:#fff}
.docv .flow-a{color:var(--dacc,#3b5bdb);font-weight:800}
.docv .canvas{display:grid;grid-template-columns:repeat(10,1fr);border:1.5px solid #1b1e25;font-size:12px;margin:8px 0 18px}
.docv .canvas>div{border:1px solid #c9ced6;padding:8px 10px;min-height:110px;white-space:pre-wrap}
.docv .canvas b{display:block;font-size:11px;color:var(--dacc,#3b5bdb);margin-bottom:4px}
.docv .canvas small{display:block;color:#6b7280;margin-top:6px}
@media print{.docv{padding:0;max-width:none}.docv h2{break-before:auto}@page{size:A4;margin:18mm 16mm}}`;
function cellHTML(t) { return esc(t ?? ''); }
/* "A → B → C" 형태의 줄을 단계 칩으로 그린다 (코어 루프 · 화면 흐름 등) */
const FLOW_RE = /\s*(?:→|->|=>|⇒)\s*/;
function flowParts(line) { const p = String(line || '').split(FLOW_RE).map(x => x.trim()).filter(Boolean); return p.length >= 3 ? p : null; }
function flowHTML(text) {
  const lines = String(text || '').split('\n'); if (!lines.some(flowParts)) return '';
  return lines.filter(l => l.trim()).map(l => { const p = flowParts(l); return p ? `<div class="flow">${p.map((x, i) => `<span class="flow-n">${esc(x)}</span>${i < p.length - 1 ? '<span class="flow-a">→</span>' : ''}`).join('')}</div>` : `<p>${esc(l)}</p>`; }).join('');
}
function buildDocHTML(doc, tpl, opt = {}) {
  const v = doc.values || {}, m = doc.meta || {};
  const accent = { game: '#3b5bdb', biz: '#0b8a5b', paper: '#6d47e0' }[doc.tool] || '#3b5bdb';
  let h = `<div class="docv" style="--dacc:${accent}">`;
  h += `<div class="cover"><div class="cover-k">${esc(TOOL_NAMES[doc.tool] || '')} · ${esc(tpl.name)}</div><h1>${esc(doc.name || '제목 없음')}</h1><table class="meta">`;
  [['작성자', m.author], ['팀 / 소속', m.team], ['버전', m.version], ['작성일', m.date], ['문서 상태', m.status]].forEach(([a, b]) => { if (b) h += `<tr><td>${a}</td><td>${esc(b)}</td></tr>`; });
  h += `</table>${m.history ? `<div class="hist"><b>개정 이력</b>\n${esc(m.history)}</div>` : ''}</div>`;
  const secs = visSecs(tpl, v).filter(s => opt.showEmpty || s.fields.some(f => showIfOk(f, v) && ((f.type === 'calc' && calcResult(f.calc, v)?.kpis?.length) || isFilledVal(f, v[f.key]))));
  if (tpl.docExtra) h += tpl.docExtra(v, doc) || '';
  if (secs.length > 2) h += `<div class="toc"><b>목차</b><ol>${secs.map(s => `<li>${esc(s.title)}</li>`).join('')}</ol></div>`;
  const notes = doc.notes || {};
  secs.forEach((s, si) => {
    h += `<h2>${si + 1}. ${esc(s.title)}</h2>`;
    s.fields.forEach(f => {
      if (!showIfOk(f, v) || f.type === 'note' || f.hideInDoc) return;
      if (f.type === 'calc') {
        const r = calcResult(f.calc, v);
        if (r?.docOnlyLines && r.docLines?.length) { h += `<h3>${esc(CALCS[f.calc].title)}</h3>` + r.docLines.map(l => `<p style="padding-left:2em;text-indent:-2em">${esc(l)}</p>`).join(''); return; }
        if (!r?.kpis?.length) return;
        h += `<h3>${esc(CALCS[f.calc].title)}</h3><div class="dcalc">${r.kpis.map(k => `<div>${esc(k.l)}<b>${esc(k.v)}</b></div>`).join('')}</div>`;
        if (r.docLines?.length) h += `<p>${r.docLines.map(esc).join('\n')}</p>`;
        return;
      }
      const x = v[f.key]; const filled = isFilledVal(f, x);
      if (!filled && !opt.showEmpty) return;
      h += `<h3>${esc(f.label)}</h3>`;
      if (!filled) { h += `<p class="empty">미작성</p>`; return; }
      if (f.type === 'table') {
        const rows = tableRows(x); const sums = f.cols.filter(c => c.sum);
        h += `<table class="dt"><thead><tr>${f.cols.map(c => `<th>${esc(c.l)}</th>`).join('')}</tr></thead><tbody>${rows.map(r => `<tr>${f.cols.map(c => `<td>${c.t === 'num' && isFinite(num(r[c.k])) ? fmtN(num(r[c.k]), 2) : cellHTML(r[c.k])}</td>`).join('')}</tr>`).join('')}</tbody>`;
        if (sums.length) h += `<tfoot><tr>${f.cols.map((c, i) => `<td>${c.sum ? fmtN(colSum(rows, c.k), 2) : i === 0 ? '합계' : ''}</td>`).join('')}</tr></tfoot>`;
        h += `</table>`;
      } else if (f.type === 'cards') {
        x.filter(r => r && Object.values(r).some(Boolean)).forEach((r, i) => {
          h += `<div class="dcard"><h4>${i + 1}. ${esc(r[f.fields[0].key] || '(이름 없음)')}</h4><dl>${f.fields.slice(1).filter(sf => String(r[sf.key] ?? '').trim()).map(sf => `<dt>${esc(sf.label)}</dt><dd>${esc(r[sf.key])}</dd>`).join('')}</dl></div>`;
        });
      } else if (f.type === 'check') {
        const sel = new Set(x);
        h += `<ul class="ck">${f.items.map(it => `<li>${sel.has(itemKey(it)) ? '☑' : '☐'} ${esc(itemLabel(it))}</li>`).join('')}</ul>`;
      } else h += (f.flow && flowHTML(x)) || `<p>${esc(valText(f, x))}</p>`;
      if (opt.memos && notes[f.key]) h += `<div class="memo">결정 메모 · ${esc(notes[f.key])}</div>`;
    });
  });
  if (opt.extraHTML) h += opt.extraHTML;
  h += `<div class="foot">${esc(doc.name)} ${esc(m.version || '')} · ${esc(m.date || '')} · Document Hub v${DH_VERSION}로 작성</div></div>`;
  return h;
}
function exportStandalone(doc, tpl, opt = {}) {
  const embed = JSON.stringify({ app: 'dochub', v: DH_VERSION, doc }).replace(/</g, '\\u003c');
  return `<!DOCTYPE html><html lang="ko"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(doc.name)} ${esc(doc.meta?.version || '')}</title>
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css">
<style>body{margin:0;background:#eef0f3}${DOC_CSS}@media screen{.docv{margin:24px auto;box-shadow:0 2px 16px rgba(0,0,0,.08);border-radius:6px}}</style></head>
<body>${buildDocHTML(doc, tpl, opt)}<script id="dh-embed" type="application/json">${embed}<\/script></body></html>`;
}
function exportWord(doc, tpl, opt = {}) {
  return `<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word" xmlns="http://www.w3.org/TR/REC-html40"><head><meta charset="UTF-8"><title>${esc(doc.name)}</title>
<style>${DOC_CSS.replace(/'Pretendard Variable',Pretendard,/g, '')} .docv{font-family:'Malgun Gothic',sans-serif;padding:0}</style></head><body>${buildDocHTML(doc, tpl, opt)}</body></html>`;
}

/* ═══════════════════════════════════════════════════════════
   MIGRATION  (v2 gd_/bp_/pp_ → v3 dh_doc_)
   ═══════════════════════════════════════════════════════════ */
const Legacy = {
  join(pairs) { return pairs.filter(([, x]) => String(x ?? '').trim()).map(([l, x]) => `${l}: ${String(x).trim()}`).join('\n'); },
  dump(obj, depth = 0) {
    if (obj == null) return '';
    if (typeof obj !== 'object') return String(obj);
    return Object.entries(obj).map(([k, x]) => {
      if (x == null || x === '') return '';
      if (Array.isArray(x)) return x.length ? `${k}:\n` + x.map((it, i) => `  ${i + 1}) ` + (typeof it === 'object' ? Object.entries(it).filter(([, y]) => y).map(([a, b]) => `${a}=${b}`).join(' / ') : it)).join('\n') : '';
      if (typeof x === 'object') { const inner = Legacy.dump(x, depth + 1); return inner.trim() ? `[${k}]\n${inner}` : ''; }
      return `${k}: ${x}`;
    }).filter(Boolean).join('\n');
  },
  mkDoc(tool, template, name, savedAt, values, origin) {
    return { id: uid(), v: 3, tool, template, name: name || TOOL_NAMES[tool], createdAt: savedAt || Date.now(), updatedAt: savedAt || Date.now(), values, notes: {}, meta: { version: 'v1.0 (이전 버전에서 이전)', date: today() }, origin };
  },
  fromGD(mode, data, slot = {}) {
    data = data || {};
    if (mode === 'simple') {
      const d = data;
      const values = { title: d.title, genre: d.genre, players: d.party, platform: d.platform, art: d.artstyle, pitch: d.pitch, audience: d.target, mechanics: d.systems, coreLoop: d.loop, goal: d.clear, refs: d.ref || d.refwhy ? [{ work: d.ref || '', take: d.refwhy || '' }] : [] };
      values._legacy = Legacy.dump(d);
      return Legacy.mkDoc('game', 'game-onepage', slot.name || d.title || '간단 기획서', slot.savedAt, values, 'gd-simple');
    }
    if (mode === 'custom') {
      const schema = slot.customSchema || data.customSchema || [];
      const wd = slot.customSchema ? (slot.data || {}) : (data.writeData || data || {});
      const tpl = { sections: schema.map(sec => ({ id: 's_' + sec.id, title: sec.name || '섹션', fields: (sec.fields || []).map(f => ({ key: 'c_' + f.id, label: f.label || '항목', type: f.type === 'text' ? 'text' : 'area' })) })) };
      const values = {};
      schema.forEach(sec => (sec.fields || []).forEach(f => {
        let x = wd[f.id];
        if (x && typeof x === 'object') x = Legacy.join(Object.entries(x));
        if (f.type === 'card') x = x || Legacy.join([['행동', wd[f.id + '-action']], ['결과', wd[f.id + '-result']], ['피드백', wd[f.id + '-feedback']]]);
        values['c_' + f.id] = x || '';
      }));
      const doc = Legacy.mkDoc('game', 'custom', slot.name || '커스텀 기획서', slot.savedAt, values, 'gd-custom');
      doc.customTpl = tpl; return doc;
    }
    // full
    const f1 = data.f1 || {}, f2 = data.f2 || {}, f3 = data.f3 || {}, f4 = data.f4 || {};
    const cards = slot.syscards || f3.syscards || [];
    const impl = f4.sysImpl || {};
    const prio = { must: 'P0 (필수)', nice: 'P1 (중요)', later: 'P2 (차기)' };
    const st = { active: '기획중', hold: '보류', cut: '폐기' };
    const systems = cards.map(s => {
      const x = impl[s.id] || (s.name ? impl[String(s.name).trim()] : null) || {};
      return {
        name: s.name || '', prio: prio[s.priority] || 'P0 (필수)', status: st[s.status] || '기획중', purpose: s.memo || '',
        rules: Legacy.join([['플레이어 행동', s.action], ['게임 반응', s.result], ['피드백', s.feedback], ['조작/입력', x.control]]),
        data: Legacy.join([['수치/파라미터', x.params], ['밸런스 메모', x.balance]]), exceptions: x.rules || '',
      };
    });
    const values = {
      title: f3.title || f1.idea, genre: f3.genre || f1.genre, platform: f3.platform, audience: f3.target, pitch: f3.pitch || f1.idea,
      intent: Legacy.join([['핵심 목표', f3.goal], ['클리어 조건', f3.clear]]), coreFun: f2.mood ? '분위기 키워드: ' + f2.mood : '',
      coreLoop: f3.flowLoop || f2.flow, metaLoop: Legacy.join([['시작 흐름', f3.flowStart], ['중간 변화', f3.flowMid], ['종료 흐름', f3.flowEnd]]),
      progression: f3.reward, systems,
      comps: f3.refTitle ? [{ name: f3.refTitle, sys: Legacy.join([['코어 루프', f3.refLoop], ['시스템', f3.refSys], ['보상', f3.refReward], ['UI', f3.refUi]]), diff: f3.refApply || '' }] : [],
      contents: [['플레이어', f3.cPlayer, f4.cChar], ['적/장애물', f3.cEnemy, f4.cEnemy], ['맵/스테이지', f3.cMap, ''], ['아이템', f3.cItem, f4.cItem], ['이벤트', f3.cEvent, f4.cBoss], ['퀘스트', '', f4.cQuest]]
        .filter(r => r[1] || r[2]).map(r => ({ name: r[0], kind: '', unlock: '', reward: '', volume: [r[1], r[2]].filter(Boolean).join('\n상세: ') })),
      levelPrinciple: Legacy.join([['유도', f4.lGuide], ['학습', f4.lLearn], ['반복/응용', f4.lRepeat], ['오브젝트 배치', f4.lObj]]),
      difficulty: Legacy.join([['초반', f4.lEarly], ['중반', f4.lMid], ['후반', f4.lLate], ['난이도 변화', f4.lDiff]]),
      world: Legacy.join([['배경', f4.wBg], ['시대/장소', f4.wPlace], ['세계 규칙', f4.wRule], ['스토리 배경', f4.wStory], ['분위기', f4.wMood]]),
      characters: f4.cChar, hud: Legacy.join([['HUD', f4.uiHud], ['피드백 요소', f4.uiFb]]), uiFlow: Legacy.join([['메인 화면', f4.uiMain], ['메뉴 구조', f4.uiMenu]]),
      bgm: f4.sndBgm, sfx: f4.sndSfx, amb: f4.sndAmb, voice: f4.sndVoice, audioFb: f4.sndFb,
      vrInteract: Legacy.join([['이동 방식', f4.vrLocomotion], ['손/컨트롤러', f4.vrHands], ['높이/스케일', f4.vrScale]]),
      vrUi: f4.vrUi, vrSafety: Legacy.join([['안전', f4.vrSafety], ['플레이 공간', f4.vrSpace], ['컴포트', f4.vrComfort]]),
    };
    values._legacy = Legacy.dump({ '0단계 아이디어 나열': f0Raw(data), '1단계': f1, '2단계': f2, '항목 메모': data.memos });
    const doc = Legacy.mkDoc('game', 'game-industry', slot.name || values.title || '풀 기획서', slot.savedAt, values, 'gd-full');
    return doc;
    function f0Raw(d) { return d.f0?.raw || ''; }
  },
  fromBP(docType, d, slot = {}) {
    d = d || {};
    if (docType === 'lean') {
      const l = d.lean || {};
      const values = { ...l, _legacy: '' };
      return Legacy.mkDoc('biz', 'biz-lean', slot.name || '린 캔버스', slot.savedAt, values, 'bp-lean');
    }
    const b1 = d.b1 || {}, b2 = d.b2 || {}, b3 = d.b3 || {}, b4 = d.b4 || {}, b5 = d.b5 || {}, b6 = d.b6 || {};
    const values = {
      name: b1.name, industry: b1.industry, bizType: b1.type, tagline: b1.tagline, problem: b1.problem, solution: b1.solution, uvp: b1.uvp,
      target: b2.target, pain: b2.pain, marketNote: Legacy.join([['TAM', b2.tam], ['SAM', b2.sam], ['SOM', b2.som]]), compNote: b2.competitors, advantage: b2.advantage,
      revenueType: b3.revenueType, revenueDetail: b3.revenueDetail, pricing: b3.pricing, costStructure: b3.cost, partners: Legacy.join([['핵심 자원', b3.resources], ['핵심 파트너', b3.partners]]),
      channels: b4.channels, ueNote: Legacy.join([['CAC', b4.cac], ['LTV', b4.ltv]]), message: b4.message, first100: b4.growthEarly, scale: b4.growthScale,
      fin: [['1년차', b5.revY1], ['2년차', b5.revY2], ['3년차', b5.revY3]].filter(r => r[1]).map(r => ({ year: r[0], basis: r[1] })),
      finNote: Legacy.join([['제품 개발비', b5.devCost], ['마케팅 초기 비용', b5.mktCost], ['월 운영비', b5.monthlyOpex], ['총 필요 자본', b5.totalNeed], ['손익분기점', b5.bep], ['흑자 전환', b5.profitTiming]]),
      fundingNote: b5.funding, teamNote: Legacy.join([['핵심 팀원', b6.team], ['채용 계획', b6.hiring], ['어드바이저', b6.advisors]]),
      milestones: [['3개월', b6.ms3], ['6개월', b6.ms6], ['12개월', b6.ms12]].filter(r => r[1]).map(r => ({ when: r[0], ms: r[1] })), riskNote: b6.risks,
    };
    values._legacy = Legacy.dump({ b1, b2, b3, b4, b5, b6 });
    return Legacy.mkDoc('biz', 'biz-ir', slot.name || b1.name || '사업 계획서', slot.savedAt, values, 'bp-standard');
  },
  fromPP(docType, d, slot = {}) {
    d = d || {};
    if (docType === 'report') {
      const r = d.report || {};
      const values = { title: r.title, authors: r.authors, org: r.org, submitDate: r.date, summary: r.summary, background: r.background, method: r.method, implementation: r.implementation, results: r.results, evaluation: r.evaluation, contribution: r.contribution, future: r.future, refsRaw: r.references };
      values._legacy = Legacy.dump(r);
      return Legacy.mkDoc('paper', 'paper-report', slot.name || r.title || '연구 보고서', slot.savedAt, values, 'pp-report');
    }
    const p1 = d.p1 || {}, p2 = d.p2 || {}, p3 = d.p3 || {}, p4 = d.p4 || {}, p5 = d.p5 || {}, p6 = d.p6 || {}, p7 = d.p7 || {};
    const values = {
      titleKo: p1.titleKo, titleEn: p1.titleEn, authors: p1.authors, affiliation: p1.affiliation, venue: p1.journal, year: p1.year, ptype: p1.type,
      abstractKo: p1.abstractKo, abstractEn: p1.abstractEn, keywordsKo: p1.keywords || p1.keywordsKo, keywordsEn: p1.keywordsEn,
      background: p2.background, problem: p2.necessity, objective: p2.objective, scope: p2.scope, structure: p2.structure,
      theory: p3.theory, reviewNote: [p3.review1, p3.review2, p3.review3].filter(Boolean).join('\n\n'), gap: p3.gap,
      design: p4.design, designDetail: p4.designDetail, participants: p4.participants, apparatus: p4.tools, collect: p4.dataCollection, analysis: p4.analysis, procedure: p4.procedure,
      result1: p5.result1, result2: p5.result2, result3: p5.result3, figuresNote: p5.figures,
      interpretation: p6.interpretation, contribution: p6.contribution, limitations: p6.limitations, future: p6.future, conclusion: p6.conclusion,
      refStyle: p7.style, refsRaw: p7.references,
    };
    values._legacy = '';
    return Legacy.mkDoc('paper', 'paper-empirical', slot.name || p1.titleKo || '학술 논문', slot.savedAt, values, 'pp-research');
  },
  clean(values) { Object.keys(values).forEach(k => { if (values[k] == null || values[k] === '' || (Array.isArray(values[k]) && !values[k].length)) delete values[k]; }); return values; },
  run() {
    const done = new Set(LS.get('dh_migrated_keys', []) || []);
    let n = 0;
    const add = (key, doc) => { if (!doc) return; Legacy.clean(doc.values); doc.legacyKey = key; Store.put(doc, false); done.add(key); n++; };
    LS.keys('gd_slot_').forEach(k => { if (done.has(k)) return; const s = LS.get(k); if (s) try { add(k, Legacy.fromGD(s.mode || 'full', s.data, s)); } catch (e) { console.warn(e); } });
    LS.keys('bp_slot_').forEach(k => { if (done.has(k)) return; const s = LS.get(k); if (s) try { add(k, Legacy.fromBP(s.docType || 'standard', s.data, s)); } catch (e) { console.warn(e); } });
    LS.keys('pp_slot_').forEach(k => { if (done.has(k)) return; const s = LS.get(k); if (s) try { add(k, Legacy.fromPP(s.docType || 'research', s.data, s)); } catch (e) { console.warn(e); } });
    // 저장(슬롯) 안 된 작업 버퍼도 복구 — 내용이 있을 때만
    const buf = [['gd_current_full', () => Legacy.fromGD('full', LS.get('gd_current_full'), { name: '(자동저장 복구) 풀 기획서', syscards: LS.get('gd_syscards') })],
    ['gd_current_simple', () => Legacy.fromGD('simple', LS.get('gd_current_simple'), { name: '(자동저장 복구) 간단 기획서' })],
    ['bp_current_standard', () => Legacy.fromBP('standard', LS.get('bp_current_standard'), { name: '(자동저장 복구) 사업 계획서' })],
    ['bp_current_lean', () => Legacy.fromBP('lean', LS.get('bp_current_lean'), { name: '(자동저장 복구) 린 캔버스' })],
    ['pp_current_research', () => Legacy.fromPP('research', LS.get('pp_current_research'), { name: '(자동저장 복구) 학술 논문' })],
    ['pp_current_report', () => Legacy.fromPP('report', LS.get('pp_current_report'), { name: '(자동저장 복구) 연구 보고서' })]];
    const slotJSON = new Set([...LS.keys('gd_slot_'), ...LS.keys('bp_slot_'), ...LS.keys('pp_slot_')].map(k => JSON.stringify((LS.get(k) || {}).data || {})));
    buf.forEach(([k, mk]) => {
      if (done.has(k)) return; const raw = LS.get(k); if (!raw) return;
      if (slotJSON.has(JSON.stringify(raw))) { done.add(k); return; }
      const hasText = JSON.stringify(raw).replace(/"[^"]*":/g, '').replace(/[\[\]{}",\s]|null|standard|research|report|lean/g, '').length > 3;
      if (!hasText) { done.add(k); return; }
      try { add(k, mk()); } catch (e) { console.warn(e); }
    });
    LS.set('dh_migrated_keys', [...done]);
    return n;
  },
  legacyKeys() { return ['gd_', 'bp_', 'pp_'].flatMap(p => LS.keys(p)); },
  fromEmbed(html) {
    let m = html.match(/<script[^>]*id="dh-embed"[^>]*>([\s\S]*?)<\/script>/);
    if (m) { const p = JSON.parse(m[1]); if (p.doc) { const d = p.doc; d.id = uid(); d.createdAt = Date.now(); return d; } }
    m = html.match(/<script[^>]*id="gd-embed"[^>]*data-mode="([^"]+)"[^>]*>([\s\S]*?)<\/script>/);
    if (m) { const mode = m[1], pl = JSON.parse(m[2]); const d = Legacy.fromGD(mode, mode === 'custom' ? pl : pl, mode === 'custom' ? { customSchema: pl.customSchema, data: pl.writeData } : { syscards: pl.f3?.syscards }); Legacy.clean(d.values); return d; }
    return null;
  },
};

/* ─── backup ─── */
const Backup = {
  exportAll() {
    const docs = Store.list(); const snaps = {}; docs.forEach(d => { const s = Store.snaps(d.id); if (s.length) snaps[d.id] = s; });
    download(`DocumentHub_백업_${today()}.json`, JSON.stringify({ app: 'dochub-backup', v: DH_VERSION, at: Date.now(), docs, snaps }, null, 1), 'application/json');
    LS.set('dh_last_backup', Date.now());
    toast(`문서 ${docs.length}개를 백업했습니다.`, 'ok');
  },
  importFile(onDone) {
    const inp = document.createElement('input'); inp.type = 'file'; inp.accept = '.json,.html,.htm';
    inp.onchange = () => {
      const f = inp.files[0]; if (!f) return; const r = new FileReader();
      r.onload = () => {
        try {
          const txt = String(r.result);
          if (/\.html?$/i.test(f.name)) {
            const d = Legacy.fromEmbed(txt); if (!d) throw new Error('Document Hub / Game Planner에서 내보낸 HTML이 아닙니다.');
            Store.put(d); toast(`"${d.name}" 문서를 가져왔습니다.`, 'ok'); onDone && onDone([d]); return;
          }
          const j = JSON.parse(txt);
          if (j.app === 'dochub-backup') {
            let n = 0, skip = 0; const exist = new Set(Store.list().map(d => d.id));
            j.docs.forEach(d => { if (exist.has(d.id) && !confirm(`"${d.name}" 문서가 이미 있습니다. 백업본으로 덮어쓸까요?`)) { skip++; return; } Store.put(d, false); if (j.snaps?.[d.id]) LS.set('dh_snap_' + d.id, j.snaps[d.id]); n++; });
            toast(`${n}개 복원${skip ? `, ${skip}개 건너뜀` : ''}`, 'ok'); onDone && onDone(j.docs); return;
          }
          if (j.app === 'dochub' && j.doc) { const d = j.doc; d.id = uid(); Store.put(d); toast(`"${d.name}" 문서를 가져왔습니다.`, 'ok'); onDone && onDone([d]); return; }
          throw new Error('알 수 없는 파일 형식입니다.');
        } catch (e) { toast('가져오기 실패: ' + e.message, 'err', 5000); }
      };
      r.readAsText(f);
    };
    inp.click();
  },
};

/* ═══════════════════════════════════════════════════════════
   CUSTOM TEMPLATE (user-built)
   ═══════════════════════════════════════════════════════════ */
function buildCustomTpl(doc) {
  const ct = doc.customTpl || { sections: [] };
  const t = {
    id: 'custom', tool: doc.tool, name: '커스텀 양식', icon: '✎', personas: (TOOLS[doc.tool]?.personas || []).slice(0, 3),
    sections: (ct.sections.length ? ct.sections : [{ id: 's_empty', title: '빈 양식', fields: [] }]).map(s => ({
      id: s.id, title: s.title, desc: s.desc || '',
      fields: s.fields.map(f => {
        if (f.type === 'table') return F.table(f.key, f.label, (f.cols && f.cols.length ? f.cols : ['항목', '내용']).map((c, i) => typeof c === 'string' ? C('c' + i, c, 'area') : C(c.k, c.l, c.t === 'num' ? 'num' : 'area')), { req: f.req });
        if (f.type === 'check') return F.check(f.key, f.label, f.items || [], { req: f.req });
        if (f.type === 'select') return F.sel(f.key, f.label, f.options || [], { req: f.req });
        return { type: f.type === 'text' ? 'text' : 'area', key: f.key, label: f.label, req: f.req, ph: f.ph || '' };
      }),
    })),
  };
  t.sections.forEach((s, i) => { s.idx = i; s.fields.forEach(f => f._sec = s.id); });
  t._fields = t.sections.flatMap(s => s.fields); t._deps = new Set();
  return t;
}
function tplToCustom(tpl) {
  return {
    sections: tpl.sections.map(s => ({
      id: 's_' + s.id, title: s.title, desc: s.desc || '',
      fields: s.fields.filter(f => ['text', 'area', 'select', 'number', 'date', 'table', 'cards', 'check'].includes(f.type)).map(f => {
        if (f.type === 'table') return { key: f.key, label: f.label, type: 'table', cols: f.cols.map(c => ({ k: c.k, l: c.l, t: c.t })), req: !!f.req };
        if (f.type === 'check') return { key: f.key, label: f.label, type: 'check', items: f.items.map(it => typeof it === 'string' ? it : { k: it.k || it.l, l: it.l }), req: !!f.req };
        if (f.type === 'select') return { key: f.key, label: f.label, type: 'select', options: f.options.slice(), req: !!f.req };
        return { key: f.key, label: f.label, type: f.type === 'area' || f.type === 'cards' ? 'area' : 'text', req: !!f.req, ph: f.ph || '' };
      }),
    })),
  };
}
// 기존 문서의 값을 커스텀 양식 구조로 변환 (cards → 텍스트)
function valuesToCustom(tpl, values) {
  const out = { ...values };
  tpl._fields.forEach(f => { if (f.type === 'cards' && Array.isArray(values[f.key])) out[f.key] = valText(f, values[f.key]); if (f.type === 'number' && values[f.key] != null) out[f.key] = String(values[f.key]); });
  return out;
}

/* ═══════════════════════════════════════════════════════════
   SHARE LINK — 문서를 압축해 URL(#s=)에 담는다. 서버에 아무것도 저장하지 않는다.
   ═══════════════════════════════════════════════════════════ */
const Share = {
  supported: typeof CompressionStream !== 'undefined',
  async pack(doc) {
    const slim = { n: doc.name, t: doc.tool, p: doc.template, v: doc.values, o: doc.notes, m: doc.meta, c: doc.customTpl };
    if (slim.v && slim.v._legacy) { slim.v = { ...slim.v }; delete slim.v._legacy; }
    const bytes = new TextEncoder().encode(JSON.stringify(slim));
    const buf = await new Response(new Blob([bytes]).stream().pipeThrough(new CompressionStream('deflate-raw'))).arrayBuffer();
    let bin = ''; new Uint8Array(buf).forEach(b => bin += String.fromCharCode(b));
    return btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  },
  async unpack(str) {
    const bin = atob(str.replace(/-/g, '+').replace(/_/g, '/')); const bytes = Uint8Array.from(bin, c => c.charCodeAt(0));
    const txt = await new Response(new Blob([bytes]).stream().pipeThrough(new DecompressionStream('deflate-raw'))).text();
    const s = JSON.parse(txt);
    if (!s || typeof s !== 'object' || !TOOL_FILES[s.t]) throw new Error('형식이 맞지 않습니다.');
    return { id: uid(), v: 3, name: String(s.n || '공유 문서'), tool: s.t, template: String(s.p || ''), values: s.v || {}, notes: s.o || {}, meta: s.m || {}, customTpl: s.c, createdAt: Date.now(), updatedAt: Date.now() };
  },
  async url(doc) { return new URL(TOOL_FILES[doc.tool], location.href).href.split(/[?#]/)[0] + '#s=' + await Share.pack(doc); },
  fromHash() { const m = location.hash.match(/^#s=([\w-]+)$/); return m ? m[1] : null; },
};
async function copyText(text, okMsg) {
  try { await navigator.clipboard.writeText(text); toast(okMsg || '복사했습니다.', 'ok'); return true; }
  catch (e) {
    const ta = document.createElement('textarea'); ta.value = text; ta.style.cssText = 'position:fixed;opacity:0'; document.body.appendChild(ta); ta.select();
    let ok = false; try { ok = document.execCommand('copy'); } catch (_) { } ta.remove();
    toast(ok ? (okMsg || '복사했습니다.') : '복사에 실패했습니다. 브라우저 권한을 확인하세요.', ok ? 'ok' : 'err'); return ok;
  }
}
/* 표 ↔ 엑셀 · 구글 시트 */
function tableToTSV(f, rows, withHeader = true) {
  const clean = x => String(x ?? '').replace(/\t/g, ' ').replace(/\r?\n/g, ' ');
  return [...(withHeader ? [f.cols.map(c => c.l).join('\t')] : []), ...tableRows(rows).map(r => f.cols.map(c => clean(r[c.k])).join('\t'))].join('\n');
}
function tableToCSV(f, rows) {
  const q = x => '"' + String(x ?? '').replace(/"/g, '""') + '"';
  return [f.cols.map(c => q(c.l)).join(','), ...tableRows(rows).map(r => f.cols.map(c => q(r[c.k])).join(','))].join('\r\n');
}
function parseTSV(text) {
  const rows = String(text).replace(/\r/g, '').replace(/\n+$/, '').split('\n').map(l => l.split('\t'));
  return rows.length > 1 || rows[0].length > 1 ? rows : null;
}

function openAbout() {
  const bytes = LS.bytes();
  modalShell('aboutModal', '데이터와 개인정보', `<div class="md" style="font-size:13.5px">
    <h4>문서</h4><p>작성한 문서는 이 브라우저의 저장 공간(localStorage)에만 기록됩니다. 운영자를 포함해 누구도 볼 수 없고, 서버로 전송되지 않습니다. 현재 사용량 ${(bytes / 1024).toFixed(0)}KB (브라우저 한도는 보통 약 5MB).</p>
    <h4>AI 기능을 쓸 때</h4><p>AI 검토 · 채팅 · 초안 채우기를 실행하면 그때 <b>해당 문서의 내용이 AI 제공사로 전송</b>됩니다.</p>
    <ul><li><b>공용 AI</b>: 이 사이트의 서버를 거쳐 Google Gemini로 전달됩니다. 서버는 내용을 저장하지 않고, 남용 방지를 위해 IP별 하루 사용 횟수만 셉니다. 전달된 내용의 처리 방식은 Google의 Gemini API 약관을 따릅니다.</li>
    <li><b>본인 API 키</b>: 브라우저에서 해당 회사(Google · Anthropic · OpenAI)로 직접 전송되며 이 사이트 서버를 거치지 않습니다. 키는 이 브라우저에만 저장됩니다.</li></ul>
    <p>미공개 프로젝트 · 개인정보가 들어간 문서는 본인 키를 쓰거나 AI 기능을 쓰지 않는 것을 권합니다. AI의 지적은 틀릴 수 있으니 수치와 법규는 직접 확인하세요.</p>
    <h4>공유 링크</h4><p>문서 내용이 링크 주소 안에 압축되어 들어갑니다. 서버에 저장되지 않지만, 링크를 가진 사람은 누구나 읽을 수 있습니다.</p>
    <h4>양식의 내용</h4><p>양식의 항목과 가이드는 공개된 자료(각 섹션의 ‘작성 가이드 · 근거’에 표시)를 바탕으로 만든 참고용입니다. 지원사업 양식 · 법규 · 스토어 정책은 바뀔 수 있으니 제출 · 출시 전에 공식 문서를 확인하세요. 예시 문서의 게임 · 서비스 · 수치는 모두 가상입니다.</p></div>`,
    `<a class="btn" href="${REPO_URL}" target="_blank" rel="noopener">소스 코드 ↗</a><button class="btn btn-pri" onclick="closeModal('aboutModal')">확인</button>`);
}
