/* ═══════════════════════════════════════════════════════════
   EDITOR — tool page (game / biz / paper)
   ═══════════════════════════════════════════════════════════ */
const App = { tool: null, doc: null, tpl: null, sec: null, opt: { showEmpty: false, memos: true }, chat: [], openMemos: new Set() };

function boot(toolId) {
  Theme.init();
  App.tool = toolId;
  document.body.dataset.tool = toolId;
  const migrated = Legacy.run();
  if (migrated) setTimeout(() => toast(`이전 버전 문서 ${migrated}개를 새 형식으로 옮겼습니다. 원본은 그대로 보존됩니다.`, 'ok', 5000), 300);
  window.addEventListener('beforeunload', () => { if (App.doc) Store.put(App.doc); });
  window.addEventListener('popstate', route);
  document.addEventListener('dh-settings', () => { if (App.doc && !App.readonly) { renderTopbar(); const b = $('#chatProvBox'); if (b) { b.innerHTML = AI.provPicker('chatProv'); AI.bindPicker('chatProv'); } } });
  initChat();
  route();
  Shared.check();
  try { navigator.storage && navigator.storage.persist && navigator.storage.persist(); } catch (e) { }
  window.addEventListener('hashchange', () => { if (Share.fromHash()) route(); });
}
function route() {
  if (Share.fromHash()) return openShared(Share.fromHash());
  const id = qs('doc'), nt = qs('new'), sm = qs('sample');
  if ((sm && SAMPLES[sm]) || (nt && (TPL[nt] || nt === 'custom'))) history.replaceState(null, '', location.pathname); // 새로고침 · 뒤로가기로 문서가 또 생기지 않게
  if (sm && SAMPLES[sm]) return newDoc(sm, true);
  if (id) { const d = Store.get(id); if (d) return openDoc(d.id, true); toast('문서를 찾을 수 없습니다.', 'warn'); }
  if (nt && (TPL[nt] || nt === 'custom')) return newDoc(nt);
  renderHome();
}
function setURL(params) {
  const u = new URL(location.href); u.search = '';
  Object.entries(params).forEach(([k, v]) => v && u.searchParams.set(k, v));
  history.pushState(null, '', u);
}

/* ─── topbar ─── */
function renderTopbar() {
  const T = TOOLS[App.tool]; const tb = $('#topbar');
  if (!App.doc) {
    tb.innerHTML = `<a class="brand" href="${HUB_FILE}"><span class="brand-mark">${T.mark}</span>${esc(T.name)}<small>Document Hub</small></a>
      <div class="tb-actions">
        <a class="btn btn-ghost btn-sm" href="${HUB_FILE}">⊞ <span class="btn-label">허브</span></a>
        <button class="btn btn-ghost btn-sm" onclick="Backup.importFile(()=>renderHome())">⤓ <span class="btn-label">가져오기</span></button>
        <button class="btn btn-ghost btn-sm btn-icon" title="AI 설정" onclick="Settings.open()">⚙</button>
        <button class="btn btn-ghost btn-sm btn-icon" title="테마 전환" onclick="Theme.cycle()">◐</button>
      </div>`;
    return;
  }
  tb.innerHTML = `<button class="brand" style="border:none;background:none;cursor:pointer" onclick="closeDoc()" title="${esc(T.name)} 목록으로"><span class="brand-mark">${T.mark}</span></button>
    <div class="tb-doc"><input id="docName" value="${esc(App.doc.name)}" aria-label="문서 이름"><span class="tb-tpl">${esc(App.tpl.name)}</span><span class="tb-status" id="saveStat">저장됨</span></div>
    <div class="tb-actions">
      <button class="btn btn-ghost btn-sm" onclick="openShare()" title="링크로 공유">🔗 <span class="btn-label">공유</span></button>
      <button class="btn btn-ghost btn-sm" onclick="openSnapshots()" title="버전 기록">⟲ <span class="btn-label">버전</span></button>
      <button class="btn btn-ai btn-sm" onclick="openReviewAll()">✦ <span class="btn-label">AI 검토</span></button>
      <button class="btn btn-pri btn-sm" onclick="goSec('_review')">↓ <span class="btn-label">출력</span></button>
      <div style="position:relative"><button class="btn btn-ghost btn-sm btn-icon" onclick="toggleMenu(event)" title="더보기">⋯</button>
        <div id="moreMenu" class="hidden" style="position:absolute;right:0;top:36px;background:var(--surface);border:1px solid var(--line);border-radius:10px;box-shadow:var(--shadow-2);padding:6px;min-width:210px;z-index:60;display:flex;flex-direction:column">
          ${[['openBrainDump()', '✦ 메모에서 초안 채우기'], [App.doc.template === 'custom' ? 'openBuilder()' : 'convertToCustom()', App.doc.template === 'custom' ? '✎ 양식 편집' : '✎ 이 문서 양식 직접 편집'], ['copyDocMarkdown()', '⧉ 전체 Markdown 복사 (노션 · 깃허브)'], ['duplicateDoc()', '⧉ 문서 복제'], ['exportJSON()', '{ } 이 문서 JSON 저장'], ['Settings.open()', '⚙ AI · 작성자 설정'], ['Theme.cycle()', '◐ 테마 전환'], ['deleteDoc(App.doc.id,true)', '🗑 문서 삭제']]
      .map(([fn, l]) => `<button class="btn btn-ghost btn-sm" style="justify-content:flex-start" onclick="hideMenu();${fn}">${l}</button>`).join('')}
        </div></div>
    </div>`;
  $('#docName').addEventListener('input', e => { App.doc.name = e.target.value; App.doc.autoName = false; scheduleSave(); });
}
function toggleMenu(e) { e.stopPropagation(); $('#moreMenu').classList.toggle('hidden'); }
function hideMenu() { $('#moreMenu')?.classList.add('hidden'); }
document.addEventListener('click', e => { if (!e.target.closest('#moreMenu')) hideMenu(); });

/* ─── home ─── */
function renderHome() {
  App.doc = null; App.tpl = null; renderTopbar();
  $('#chatFab').classList.remove('show'); $('#chat').classList.remove('open');
  const T = TOOLS[App.tool];
  const docs = Store.list(App.tool);
  $('#main').innerHTML = `
    <section class="hero"><div class="hero-eyebrow">${esc(T.eyebrow)}</div><h1>${T.title}</h1><p>${T.lead}</p></section>
    <div class="tgal">
      ${T.templates.map(id => TPL[id]).map(t => `
        <div class="tcard" role="button" tabindex="0" onclick="newDoc('${t.id}')" onkeydown="if(event.key==='Enter')newDoc('${t.id}')">
          <div class="tcard-top"><span class="tcard-ic">${t.icon}</span><h3>${esc(t.name)}</h3>${t.tag ? `<span class="tag">${esc(t.tag)}</span>` : ''}</div>
          <p>${t.desc}</p>
          <dl class="tmeta">${(t.meta || []).map(([a, b]) => `<dt>${esc(a)}</dt><dd>${esc(b)}</dd>`).join('')}</dl>
          <div class="tcard-ft"><span class="btn btn-pri btn-sm">빈 양식으로 시작</span>${SAMPLES[t.id] ? `<button class="btn btn-sm" onclick="event.stopPropagation();newDoc('${t.id}',true)">채워진 예시 보기</button>` : ''}</div>
        </div>`).join('')}
      <button class="tcard" onclick="newDoc('custom')" style="border-style:dashed">
        <div class="tcard-top"><span class="tcard-ic">✎</span><h3>커스텀 양식</h3><span class="tag">자유 구성</span></div>
        <p>섹션과 항목을 직접 설계합니다. 빈 양식에서 시작하거나 위 양식 중 하나를 복제해 필요 없는 부분을 지우고 쓸 수 있습니다.</p>
        <dl class="tmeta"><dt>항목 유형</dt><dd>짧은 글 · 긴 글 · 선택 · 표 · 체크리스트</dd></dl>
      </button>
    </div>
    <div class="blk"><div class="blk-hd"><h2>내 문서</h2><span class="muted">${docs.length}개 · 이 브라우저에 저장됨</span>
      <div class="btn-row"><button class="btn btn-sm" onclick="Backup.importFile(()=>renderHome())">⤓ 파일 가져오기</button></div></div>
      ${docs.length ? `<div class="dlist">${docs.map(docRow).join('')}</div>` : `<div class="dlist"><div class="empty">아직 문서가 없습니다. 위에서 양식을 골라 시작하세요.<br>이전 버전에서 내보낸 HTML 파일도 ‘파일 가져오기’로 불러올 수 있습니다.</div></div>`}
    </div>`;
  window.scrollTo(0, 0);
}
function docRow(d) {
  const t = tplOf(d); const st = t ? docStats(t, d.values || {}) : { pct: 0 };
  return `<div class="drow"><a href="?doc=${d.id}" onclick="event.preventDefault();openDoc('${d.id}')" style="display:flex;align-items:center;gap:12px;flex:1;min-width:0;color:inherit;text-decoration:none">
      <span class="dn">${esc(d.name || '제목 없음')}</span><span class="pill">${esc(t ? t.name : d.template)}</span>
      <span class="minibar" title="작성률 ${st.pct}%"><i style="width:${st.pct}%"></i></span><span class="dt">${fmtWhen(d.updatedAt)}</span></a>
    <button class="btn btn-ghost btn-xs" onclick="duplicateDoc('${d.id}')" title="복제">⧉</button>
    <button class="btn btn-ghost btn-xs" onclick="deleteDoc('${d.id}')" title="삭제">✕</button></div>`;
}

/* ─── doc lifecycle ─── */
function newDoc(tplId, sample) {
  const s = Settings.get();
  if (sample && SAMPLES[tplId]) {
    const sm = SAMPLES[tplId];
    const d = { id: uid(), v: 3, tool: App.tool, template: tplId, name: '[예시] ' + sm.name, autoName: false, sample: true, createdAt: Date.now(), updatedAt: Date.now(),
      values: JSON.parse(JSON.stringify(sm.values)), notes: JSON.parse(JSON.stringify(sm.notes || {})), meta: { author: '예시 작성자', team: sm.team || '', version: 'v1.0', date: today(), status: '확정', history: sm.history || '' } };
    Store.put(d); openDoc(d.id); toast('예시 문서를 내 문서로 복사했습니다. 자유롭게 고쳐 쓰세요. (내용은 설명용 가상 사례입니다)', '', 4500); return;
  }
  const doc = {
    id: uid(), v: 3, tool: App.tool, template: tplId, name: tplId === 'custom' ? '새 커스텀 문서' : TPL[tplId].name + ' — 새 문서', autoName: true,
    createdAt: Date.now(), updatedAt: Date.now(), values: {}, notes: {},
    meta: { author: s.author, team: s.team, version: 'v0.1', date: today(), status: '초안', history: '' },
  };
  if (tplId === 'custom') doc.customTpl = { sections: [{ id: 's_' + uid(), title: '개요', fields: [{ key: 'c_' + uid(), label: '제목', type: 'text' }, { key: 'c_' + uid(), label: '내용', type: 'area' }] }] };
  Store.put(doc);
  openDoc(doc.id);
  if (tplId === 'custom') setTimeout(() => openBuilder(true), 50);
}
function openDoc(id, fromRoute) {
  const d = Store.get(id); if (!d) return;
  App.doc = d; App.doc.values = d.values || {}; App.doc.notes = d.notes || {}; App.doc.meta = d.meta || {};
  App.tpl = tplOf(d);
  if (!App.tpl) { toast('양식을 찾을 수 없습니다: ' + d.template, 'err'); return renderHome(); }
  App.sec = (d.lastSec && (d.lastSec === '_review' || App.tpl.sections.some(s => s.id === d.lastSec))) ? d.lastSec : App.tpl.sections[0].id;
  App.chat = []; App.openMemos = new Set(); App.readonly = false;
  if (!fromRoute) setURL({ doc: id });
  renderTopbar();
  $('#main').innerHTML = `<div class="editor"><aside class="side" id="side"></aside><div id="pane"></div></div>`;
  bindPane();
  renderSide(); renderPane();
  $('#chatFab').classList.add('show'); resetChat();
}
function closeDoc() { if (App.doc) Store.put(App.doc); setURL({}); renderHome(); }
function duplicateDoc(id) {
  const src = id ? Store.get(id) : App.doc; if (!src) return;
  const d = JSON.parse(JSON.stringify(src)); d.id = uid(); d.name = (src.name || '') + ' (복사본)'; d.createdAt = Date.now(); delete d.legacyKey;
  Store.put(d); toast('복제했습니다.', 'ok');
  if (App.doc) openDoc(d.id); else renderHome();
}
function deleteDoc(id, current) {
  const d = Store.get(id); if (!d) return;
  if (!confirm(`"${d.name}" 문서를 삭제할까요?\n버전 기록도 함께 삭제되며 복구할 수 없습니다. (필요하면 먼저 허브에서 백업하세요)`)) return;
  Store.del(id); toast('삭제했습니다.');
  if (current) { App.doc = null; setURL({}); }
  renderHome();
}
function exportJSON() { download(safeName(App.doc.name) + '.json', JSON.stringify({ app: 'dochub', v: DH_VERSION, doc: App.doc }, null, 1), 'application/json'); }

/* ─── save ─── */
const scheduleSave = debounce(() => {
  if (!App.doc) return;
  if (Store.put(App.doc)) { const el = $('#saveStat'); if (el) el.textContent = '저장됨 ' + new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit', second: '2-digit' }); }
}, 450);
const refreshSideSoon = debounce(() => renderSide(), 350);
function markDirty() { const el = $('#saveStat'); if (el) el.textContent = '저장 중…'; scheduleSave(); refreshSideSoon(); }

/* ─── sidebar ─── */
function renderSide() {
  if (!App.doc) return;
  const v = App.doc.values; const st = docStats(App.tpl, v);
  $('#side').innerHTML = `
    <div class="side-hd">작성 진행</div>
    <div class="prog"><div class="prog-bar"><i style="width:${st.pct}%"></i></div><div class="prog-txt"><span>필수 ${st.reqFilled}/${st.req}</span><span>전체 ${st.filled}/${st.total}</span></div></div>
    <div class="nav">${visSecs(App.tpl, v).map((s, i) => {
    const x = secStats(s, v); const p = x.total ? x.filled / x.total : 0;
    const done = x.total && x.reqFilled === x.req && p >= .6;
    return `<button class="nav-it ${App.sec === s.id ? 'on' : ''}" onclick="goSec('${s.id}')"><span class="nav-num">${String(i + 1).padStart(2, '0')}</span><span class="nav-name">${esc(s.title)}</span>
        <span class="nav-dot ${done ? 'done' : p > 0 ? 'part' : ''}" style="--p:${Math.round(p * 100)}%">${done ? '✓' : ''}</span></button>`;
  }).join('')}
      <div class="nav-div"></div>
      <button class="nav-it ${App.sec === '_review' ? 'on' : ''}" onclick="goSec('_review')"><span class="nav-num">✓</span><span class="nav-name">검토 & 출력</span></button>
    </div>`;
}
function goSec(id) {
  if (!App.doc) return;
  App.sec = id; App.doc.lastSec = id; scheduleSave();
  renderSide(); renderPane(); window.scrollTo({ top: 0, behavior: 'smooth' });
}

/* ─── field rendering ─── */
function fieldCtl(f, x) {
  const ph = f.ph ? ` placeholder="${esc(f.ph)}"` : '';
  switch (f.type) {
    case 'text': return `<input type="text" data-k="${f.key}" value="${esc(x ?? '')}"${ph}>`;
    case 'area': return `<textarea data-k="${f.key}" rows="${f.rows || 4}"${ph}>${esc(x ?? '')}</textarea>`;
    case 'number': return `<div class="unit-wrap"><input type="text" inputmode="decimal" data-k="${f.key}" value="${esc(x ?? (f.def ?? ''))}"${ph}>${f.unit ? `<span>${esc(f.unit)}</span>` : ''}</div>`;
    case 'date': return `<input type="date" data-k="${f.key}" value="${esc(x ?? '')}">`;
    case 'select': {
      const opts = f.options.slice(); if (x && !opts.includes(x)) opts.push(x);
      return `<select data-k="${f.key}"><option value="">선택</option>${opts.map(o => `<option${o === x ? ' selected' : ''}>${esc(o)}</option>`).join('')}</select>`;
    }
    case 'check': {
      const sel = new Set(Array.isArray(x) ? x : []);
      return `<div class="checks">${f.items.map(it => { const k = itemKey(it); const on = sel.has(k); return `<label class="ck ${on ? 'on' : ''}"><input type="checkbox" data-ck="${f.key}" data-item="${esc(k)}"${on ? ' checked' : ''}><span>${esc(itemLabel(it))}${it.d ? `<small>${esc(it.d)}</small>` : ''}</span></label>`; }).join('')}</div>`;
    }
    case 'table': return tableCtl(f, x);
    case 'cards': return cardsCtl(f, x);
    case 'calc': return `<div class="calc" data-calc="${f.calc}">${calcHTML(f.calc, App.doc.values)}</div>`;
    case 'note': return `<div class="co co-${f.kind}"><span class="co-ic">${f.kind === 'warn' ? '!' : f.kind === 'ok' ? '✓' : 'i'}</span><div>${f.text}</div></div>`;
  }
  return '';
}
function cellCtl(c, val, attrs) {
  const ph = c.ph ? ` placeholder="${esc(c.ph)}"` : '';
  if (c.t === 'sel') { const o = (c.o || []).slice(); if (val && !o.includes(val)) o.push(val); return `<select ${attrs}><option value=""></option>${o.map(x => `<option${x === val ? ' selected' : ''}>${esc(x)}</option>`).join('')}</select>`; }
  if (c.t === 'area') return `<textarea ${attrs} rows="1"${ph}>${esc(val ?? '')}</textarea>`;
  if (c.t === 'date') return `<input type="date" ${attrs} value="${esc(val ?? '')}">`;
  if (c.t === 'num') return `<input type="text" inputmode="decimal" ${attrs} value="${esc(val ?? '')}"${ph} style="text-align:right;font-family:var(--mono)">`;
  return `<input type="text" ${attrs} value="${esc(val ?? '')}"${ph}>`;
}
function tableCtl(f, rows) {
  if (!Array.isArray(rows) || !rows.length) { rows = Array.from({ length: f.minRows || 1 }, () => ({})); if (f.seed) rows = JSON.parse(JSON.stringify(f.seed)); App.doc.values[f.key] = rows; }
  const sums = f.cols.some(c => c.sum);
  return `<div class="tbl-wrap"><table class="tbl"><thead><tr><th class="rn">#</th>${f.cols.map(c => `<th${c.w ? ` style="width:${c.w}"` : ''}>${esc(c.l)}</th>`).join('')}<th class="ra"></th></tr></thead>
    <tbody>${rows.map((r, i) => `<tr><td class="rn">${i + 1}</td>${f.cols.map(c => `<td>${cellCtl(c, r?.[c.k], `data-t="${f.key}" data-r="${i}" data-c="${c.k}"`)}</td>`).join('')}
      <td class="ra"><button class="row-btn" data-act="row-up" data-t="${f.key}" data-r="${i}" title="위로">↑</button><button class="row-btn" data-act="row-down" data-t="${f.key}" data-r="${i}" title="아래로">↓</button><button class="row-btn del" data-act="row-del" data-t="${f.key}" data-r="${i}" title="행 삭제">✕</button></td></tr>`).join('')}</tbody>
    ${sums ? `<tfoot><tr><td></td>${f.cols.map((c, i) => `<td id="sum-${f.key}-${c.k}" style="${c.t === 'num' ? 'text-align:right;font-family:var(--mono)' : ''}">${c.sum ? fmtN(colSum(rows, c.k), 2) : i === 0 ? '합계' : ''}</td>`).join('')}<td></td></tr></tfoot>` : ''}
    </table></div><div class="tbl-tools"><button class="btn btn-sm" data-act="row-add" data-t="${f.key}">＋ 행 추가</button><span class="spacer"></span>
      <span class="muted tbl-tip">엑셀 · 시트에서 복사한 셀을 칸에 붙여넣으면 여러 행이 한 번에 채워집니다</span>
      <button class="btn btn-xs btn-ghost" data-act="tbl-copy" data-t="${f.key}">표 복사</button><button class="btn btn-xs btn-ghost" data-act="tbl-csv" data-t="${f.key}">CSV</button></div>`;
}
function cardsCtl(f, arr) {
  if (!Array.isArray(arr) || !arr.length) { arr = [{}]; App.doc.values[f.key] = arr; }
  return `<div class="cards">${arr.map((r, i) => cardHTML(f, r || {}, i)).join('')}</div>
    <button class="btn btn-sm tbl-add" data-act="card-add" data-cd="${f.key}">＋ ${esc(f.addLabel || '항목 추가')}</button>`;
}
function cardHTML(f, r, i) {
  const first = f.fields[0];
  const tags = (f.tags || []).map(k => r[k] ? `<span class="tg">${esc(r[k])}</span>` : '').join('');
  return `<div class="rcard${r._fold ? ' collapsed' : ''}" data-card="${f.key}:${i}">
    <div class="rcard-hd"><span class="idx">${esc(f.idxLabel || '#')}${i + 1}</span><span class="ttl" data-ttl="${f.key}:${i}">${esc(r[first.key] || '(이름 없음)')}</span>${tags}
      <button class="row-btn" data-act="card-fold" data-cd="${f.key}" data-i="${i}" title="접기/펼치기">${r._fold ? '▸' : '▾'}</button>
      <button class="row-btn" data-act="card-up" data-cd="${f.key}" data-i="${i}" title="위로">↑</button><button class="row-btn" data-act="card-down" data-cd="${f.key}" data-i="${i}" title="아래로">↓</button>
      <button class="row-btn del" data-act="card-del" data-cd="${f.key}" data-i="${i}" title="삭제">✕</button></div>
    <div class="rcard-bd"><div class="grid">${f.fields.map(sf => {
    const a = `data-cd="${f.key}" data-i="${i}" data-sk="${sf.key}"`; const x = r[sf.key]; const ph = sf.ph ? ` placeholder="${esc(sf.ph)}"` : '';
    let ctl;
    if (sf.type === 'area') ctl = `<textarea ${a} rows="${sf.rows || 3}"${ph}>${esc(x ?? '')}</textarea>`;
    else if (sf.type === 'select') { const o = sf.options.slice(); if (x && !o.includes(x)) o.push(x); ctl = `<select ${a}><option value="">선택</option>${o.map(z => `<option${z === x ? ' selected' : ''}>${esc(z)}</option>`).join('')}</select>`; }
    else ctl = `<input type="text" ${a} value="${esc(x ?? '')}"${ph}>`;
    return `<div class="f ${sf.w || ''}"><div class="f-lab">${esc(sf.label)}${sf.req ? '<span class="req">*</span>' : ''}</div>${ctl}${sf.hint ? `<div class="f-hint">${sf.hint}</div>` : ''}</div>`;
  }).join('')}</div></div></div>`;
}
function countText(f, x) {
  if (!f.count) return '';
  const s = String(x || '');
  const n = f.count === 'words' ? (s.trim() ? s.trim().split(/\s+/).length : 0) : s.replace(/\s/g, '').length;
  const lim = f.max ? ` / ${f.max}` : '';
  const unit = f.count === 'words' ? '단어' : '자(공백 제외)';
  const over = f.max && n > f.max; const under = f.min && n < f.min && n > 0;
  return `<div class="f-count ${over ? 'over' : ''}" data-cnt="${f.key}">${n}${lim} ${unit}${under ? ` · 최소 ${f.min} 권장` : ''}</div>`;
}
function fieldHTML(f) {
  const v = App.doc.values;
  if (!showIfOk(f, v)) return '';
  if (f.type === 'note' || f.type === 'calc') return `<div class="f ${f.w || ''}">${fieldCtl(f, null)}</div>`;
  const x = v[f.key]; const memo = App.doc.notes[f.key];
  const showMemo = memo || App.openMemos.has(f.key);
  return `<div class="f ${f.w || ''}" data-fk="${f.key}">
    <div class="f-lab"><span>${esc(f.label)}</span>${f.req ? '<span class="req" title="필수">*</span>' : ''}${f.badge ? `<span class="pill" style="font-size:10px">${esc(f.badge)}</span>` : ''}
      <button type="button" class="memo-btn ${memo ? 'has' : ''}" data-act="memo" data-mk="${f.key}" title="이 항목을 왜 이렇게 정했는지 기록 (출력 시 결정 로그로 포함 가능)">${memo ? '✎ 메모' : '＋ 메모'}</button></div>
    ${fieldCtl(f, x)}
    ${f.flow ? `<div class="flow-prev" data-flow="${f.key}">${flowHTML(x)}</div>` : ''}
    ${countText(f, x)}
    ${f.hint ? `<div class="f-hint">${f.hint}</div>` : ''}
    ${showMemo ? `<div class="memo-box"><textarea data-memo="${f.key}" placeholder="결정 근거 / 변경 이유 — 예: 플레이테스트 5명 중 4명이 조작을 어려워해서 단순화">${esc(memo || '')}</textarea></div>` : ''}
  </div>`;
}

/* ─── section pane ─── */
function renderPane() {
  if (App.sec === '_review') return renderReview();
  const v = App.doc.values; const list = visSecs(App.tpl, v);
  const s = list.find(x => x.id === App.sec) || list[0]; App.sec = s.id;
  const i = list.indexOf(s), n = list.length;
  const prev = list[i - 1], next = list[i + 1];
  $('#pane').innerHTML = `<div class="sec">
    <div class="sec-hd"><div class="sec-eyebrow">SECTION ${String(i + 1).padStart(2, '0')} / ${String(n).padStart(2, '0')}</div><h2>${esc(s.title)}</h2>${s.desc ? `<p>${s.desc}</p>` : ''}
      <div class="sec-tools"><button class="btn btn-ai btn-sm" data-act="sec-ai">✦ 이 섹션 AI 검토</button><button class="btn btn-sm" data-act="sec-copy" title="노션 · 깃허브 · 디스코드에 붙여넣을 수 있는 Markdown으로 복사">⧉ 이 섹션 복사</button>${i === 0 ? `<button class="btn btn-sm" onclick="openBrainDump()">✦ 메모에서 초안 채우기</button>` : ''}</div></div>
    <div class="sec-bd">
      ${i === 0 && v._legacy ? `<details class="legacy"><summary>이전 버전(v2)에서 가져온 원본 내용 — 새 양식에 옮겨지지 않은 항목은 여기서 복사하세요</summary><pre>${esc(v._legacy)}</pre>
        <div style="padding:0 16px 12px"><button class="btn btn-xs btn-danger" onclick="if(confirm('원본 패널을 지울까요? (원래 v2 데이터는 브라우저에 그대로 남아 있습니다)')){delete App.doc.values._legacy;markDirty();renderPane();}">원본 패널 닫기</button></div></details>` : ''}
      ${s.guide?.length ? `<details class="guide"${s.guideOpen ? ' open' : ''}><summary>작성 가이드 · 근거</summary><div class="guide-bd"><ul>${s.guide.map(g => `<li>${g}</li>`).join('')}</ul></div></details>` : ''}
      <div class="grid">${s.fields.map(fieldHTML).join('')}</div>
      <div id="secAI"></div>
    </div>
    <div class="sec-ft">${prev ? `<button class="btn" onclick="goSec('${prev.id}')">← ${esc(prev.title)}</button>` : '<span></span>'}
      ${next ? `<button class="btn btn-pri" onclick="goSec('${next.id}')">${esc(next.title)} →</button>` : `<button class="btn btn-pri" onclick="goSec('_review')">검토 & 출력 →</button>`}</div>
  </div>`;
  autosizeAll();
}
function autosizeAll() { $$('#pane .tbl textarea').forEach(autosize); }
function autosize(t) { t.style.height = 'auto'; t.style.height = Math.min(t.scrollHeight + 2, 320) + 'px'; }
function refreshCalcs() { $$('#pane [data-calc]').forEach(el => { el.innerHTML = calcHTML(el.dataset.calc, App.doc.values); }); }

function bindPane() {
  const pane = $('#pane');
  pane.addEventListener('input', e => {
    const el = e.target; const v = App.doc.values;
    if (el.dataset.k) {
      v[el.dataset.k] = el.value;
      const f = App.tpl._fields.find(x => x.key === el.dataset.k);
      if (f?.count) { const c = $(`[data-cnt="${f.key}"]`); if (c) c.outerHTML = countText(f, el.value); }
      if (f?.flow) { const fp = $(`[data-flow="${f.key}"]`); if (fp) fp.innerHTML = flowHTML(el.value); }
      if (App.doc.autoName && App.tpl.titleKey === el.dataset.k && el.value.trim()) { App.doc.name = el.value.trim(); const n = $('#docName'); if (n) n.value = App.doc.name; }
      if (el.tagName !== 'SELECT' && !App.tpl._deps.has(el.dataset.k)) refreshCalcs();
      markDirty(); return;
    }
    if (el.dataset.t) {
      const rows = v[el.dataset.t] = v[el.dataset.t] || []; const r = +el.dataset.r; rows[r] = rows[r] || {}; rows[r][el.dataset.c] = el.value;
      const f = App.tpl._fields.find(x => x.key === el.dataset.t);
      f?.cols.filter(c => c.sum).forEach(c => { const s = $(`#sum-${f.key}-${c.k}`); if (s) s.textContent = fmtN(colSum(rows, c.k), 2); });
      if (el.tagName === 'TEXTAREA') autosize(el);
      refreshCalcs(); markDirty(); return;
    }
    if (el.dataset.cd) {
      const arr = v[el.dataset.cd] = v[el.dataset.cd] || []; const i = +el.dataset.i; arr[i] = arr[i] || {}; arr[i][el.dataset.sk] = el.value;
      const f = App.tpl._fields.find(x => x.key === el.dataset.cd);
      if (f && f.fields[0].key === el.dataset.sk) { const t = $(`[data-ttl="${f.key}:${i}"]`); if (t) t.textContent = el.value || '(이름 없음)'; }
      refreshCalcs(); markDirty(); return;
    }
    if (el.dataset.memo) {
      App.doc.notes[el.dataset.memo] = el.value;
      const b = $(`[data-act="memo"][data-mk="${el.dataset.memo}"]`); if (b) { b.classList.toggle('has', !!el.value.trim()); b.textContent = el.value.trim() ? '✎ 메모' : '＋ 메모'; }
      scheduleSave(); return;
    }
    if (el.dataset.meta) { App.doc.meta[el.dataset.meta] = el.value; scheduleSave(); refreshPreviewSoon(); return; }
  });
  pane.addEventListener('paste', e => {
    const el = e.target; if (!el.dataset || !el.dataset.t) return;
    const grid = parseTSV((e.clipboardData || window.clipboardData).getData('text')); if (!grid) return;
    const f = App.tpl._fields.find(x => x.key === el.dataset.t); if (!f) return;
    e.preventDefault();
    const rows = App.doc.values[f.key] = App.doc.values[f.key] || []; const r0 = +el.dataset.r; const c0 = f.cols.findIndex(c => c.k === el.dataset.c);
    // 첫 줄이 이 표의 머리글과 같으면 건너뛴다
    if (grid.length > 1 && grid[0].every((x, i) => !f.cols[c0 + i] || x.trim() === f.cols[c0 + i].l)) grid.shift();
    grid.forEach((cells, i) => { const row = rows[r0 + i] = rows[r0 + i] || {}; cells.forEach((val, j) => { const col = f.cols[c0 + j]; if (col) row[col.k] = col.t === 'sel' ? val.trim() : val; }); });
    rerenderField(f.key); refreshCalcs(); markDirty(); toast(`${grid.length}행을 붙여넣었습니다.`, 'ok');
  });
  pane.addEventListener('change', e => {
    const el = e.target;
    if (el.dataset.ck) {
      const arr = new Set(App.doc.values[el.dataset.ck] || []);
      el.checked ? arr.add(el.dataset.item) : arr.delete(el.dataset.item);
      App.doc.values[el.dataset.ck] = [...arr]; el.closest('.ck')?.classList.toggle('on', el.checked);
      if (App.tpl._deps.has(el.dataset.ck)) { renderPane(); renderSide(); } else refreshCalcs();
      markDirty(); return;
    }
    if (el.dataset.k && App.tpl._deps.has(el.dataset.k)) { renderPane(); renderSide(); }
    else if (el.dataset.k) refreshCalcs();
  });
  pane.addEventListener('click', e => {
    const b = e.target.closest('[data-act]'); if (!b) return;
    const act = b.dataset.act; const v = App.doc.values;
    if (act === 'memo') { const k = b.dataset.mk; App.openMemos.has(k) && !App.doc.notes[k] ? App.openMemos.delete(k) : App.openMemos.add(k); rerenderField(k); setTimeout(() => $(`[data-memo="${k}"]`)?.focus(), 0); return; }
    if (act.startsWith('row-')) {
      const k = b.dataset.t, r = +b.dataset.r; const rows = v[k] = v[k] || [];
      if (act === 'row-add') rows.push({});
      if (act === 'row-del') { if (rows[r] && Object.values(rows[r]).some(x => String(x || '').trim()) && !confirm(`${r + 1}행을 삭제할까요?`)) return; rows.splice(r, 1); }
      if (act === 'row-up' && r > 0) [rows[r - 1], rows[r]] = [rows[r], rows[r - 1]];
      if (act === 'row-down' && r < rows.length - 1) [rows[r + 1], rows[r]] = [rows[r], rows[r + 1]];
      rerenderField(k); refreshCalcs(); markDirty();
      if (act === 'row-add') setTimeout(() => { const last = $$(`[data-t="${k}"][data-r="${rows.length - 1}"]`)[0]; last?.focus(); }, 0);
      return;
    }
    if (act.startsWith('card-')) {
      const k = b.dataset.cd, i = +b.dataset.i; const arr = v[k] = v[k] || [];
      if (act === 'card-add') arr.push({});
      if (act === 'card-del') { if (!confirm(`${i + 1}번 항목을 삭제할까요?`)) return; arr.splice(i, 1); }
      if (act === 'card-up' && i > 0) [arr[i - 1], arr[i]] = [arr[i], arr[i - 1]];
      if (act === 'card-down' && i < arr.length - 1) [arr[i + 1], arr[i]] = [arr[i], arr[i + 1]];
      if (act === 'card-fold') { arr[i]._fold = !arr[i]._fold; }
      rerenderField(k); refreshCalcs(); markDirty(); return;
    }
    if (act === 'sec-ai') return runSectionAI();
    if (act === 'sec-copy') return copyText(docToMarkdown(App.doc, App.tpl, { onlySec: App.sec, memos: false }).trim() || '(이 섹션은 아직 비어 있습니다)', '이 섹션을 Markdown으로 복사했습니다.');
    if (act === 'tbl-copy') { const f = App.tpl._fields.find(x => x.key === b.dataset.t); return copyText(tableToTSV(f, v[f.key]), '표를 복사했습니다. 엑셀 · 구글 시트에 그대로 붙여넣으세요.'); }
    if (act === 'tbl-csv') { const f = App.tpl._fields.find(x => x.key === b.dataset.t); return download(safeName(App.doc.name + '_' + f.label) + '.csv', '\ufeff' + tableToCSV(f, v[f.key]), 'text/csv;charset=utf-8'); }
  });
}
function rerenderField(k) {
  const f = App.tpl._fields.find(x => x.key === k); const box = $(`[data-fk="${k}"]`);
  if (f && box) { const tmp = document.createElement('div'); tmp.innerHTML = fieldHTML(f); box.replaceWith(tmp.firstElementChild); autosizeAll(); }
}

/* ─── review & export ─── */
function runChecks() {
  const v = App.doc.values, out = [];
  visSecs(App.tpl, v).forEach(s => s.fields.forEach(f => { if (f.req && showIfOk(f, v) && !isFilledVal(f, v[f.key])) out.push({ lvl: 'err', msg: `‘${f.label}’ 미작성 (필수)`, sec: s.id }); }));
  if (App.tpl.checks) { try { out.push(...App.tpl.checks(v, App.doc)); } catch (e) { console.warn(e); } }
  return out;
}
const refreshPreviewSoon = debounce(() => { const p = $('#previewBox'); if (p) p.innerHTML = buildDocHTML(App.doc, App.tpl, App.opt); }, 300);
function renderReview() {
  const checks = runChecks(); const m = App.doc.meta;
  const errs = checks.filter(c => c.lvl === 'err').length, warns = checks.filter(c => c.lvl === 'warn').length;
  const secTitle = id => App.tpl.sections.find(s => s.id === id)?.title || '';
  $('#pane').innerHTML = `<div class="sec">
    <div class="sec-hd"><div class="sec-eyebrow">FINAL</div><h2>검토 & 출력</h2><p>필수 항목과 양식별 점검 규칙을 확인한 뒤 원하는 형식으로 내보내세요. 출력물에는 이 화면의 문서 정보(작성자·버전·개정 이력)가 표지로 들어갑니다.</p></div>
    <div class="sec-bd">
      <div class="no-print">
      <h3 style="font-size:14px;margin-bottom:10px">품질 점검 <span class="muted" style="font-weight:500;font-size:12.5px">— 오류 ${errs} · 주의 ${warns}</span></h3>
      <div class="qc">${checks.length ? checks.map(c => `<div class="qc-it ${c.lvl}"><span class="ic">${c.lvl === 'err' ? '!' : c.lvl === 'warn' ? '?' : '✓'}</span><span>${c.msg}</span>${c.sec ? `<a onclick="goSec('${c.sec}')">${esc(secTitle(c.sec))} →</a>` : ''}</div>`).join('') : `<div class="qc-it ok"><span class="ic">✓</span><span>필수 항목과 점검 규칙을 모두 통과했습니다.</span></div>`}</div>
      <h3 style="font-size:14px;margin:26px 0 10px">문서 정보</h3>
      <div class="grid">
        <div class="f third"><div class="f-lab">작성자</div><input data-meta="author" value="${esc(m.author || '')}"></div>
        <div class="f third"><div class="f-lab">팀 / 소속</div><input data-meta="team" value="${esc(m.team || '')}"></div>
        <div class="f third"><div class="f-lab">문서 상태</div><select data-meta="status">${['초안', '검토 중', '확정', '제출본'].map(o => `<option${o === m.status ? ' selected' : ''}>${o}</option>`).join('')}</select></div>
        <div class="f third"><div class="f-lab">버전</div><input data-meta="version" value="${esc(m.version || '')}" placeholder="v0.1"></div>
        <div class="f third"><div class="f-lab">작성일</div><input type="date" data-meta="date" value="${esc(m.date || '')}"></div>
        <div class="f"><div class="f-lab">개정 이력</div><textarea data-meta="history" rows="3" placeholder="v0.1 2026-10-08 초안\nv0.2 2026-10-15 시스템 명세 보완">${esc(m.history || '')}</textarea></div>
      </div>
      <h3 style="font-size:14px;margin:26px 0 10px">출력</h3>
      <div class="btn-row" style="margin-bottom:10px">
        <label class="ck ${App.opt.showEmpty ? 'on' : ''}" style="padding:6px 10px"><input type="checkbox" ${App.opt.showEmpty ? 'checked' : ''} onchange="App.opt.showEmpty=this.checked;this.parentNode.classList.toggle('on',this.checked);refreshPreviewSoon()"><span>빈 항목도 표시 (검토용)</span></label>
        <label class="ck ${App.opt.memos ? 'on' : ''}" style="padding:6px 10px"><input type="checkbox" ${App.opt.memos ? 'checked' : ''} onchange="App.opt.memos=this.checked;this.parentNode.classList.toggle('on',this.checked);refreshPreviewSoon()"><span>결정 메모 포함</span></label>
      </div>
      <div class="btn-row">
        <button class="btn btn-pri" onclick="doExport('html')">HTML 문서</button>
        <button class="btn" onclick="doExport('print')">인쇄 / PDF 저장</button>
        <button class="btn" onclick="doExport('doc')">Word(.doc)</button>
        <button class="btn" onclick="doExport('md')">Markdown</button>
        <button class="btn btn-ghost" onclick="exportJSON()">JSON</button>
        <span class="spacer"></span>
        <button class="btn" onclick="copyDocMarkdown()">⧉ Markdown 복사</button>
        <button class="btn" onclick="openShare()">🔗 링크로 공유</button>
      </div>
      <div class="f-hint" style="margin-top:8px"><b>노션 · 깃허브 위키</b>에는 ‘Markdown 복사’ 후 붙여넣기, <b>한글(hwp) 제출 양식</b>에는 Word(.doc)로 받아 한글에서 열거나 섹션별 복사로 옮기세요. HTML 출력물은 원본 데이터가 함께 들어 있어 나중에 ‘파일 가져오기’로 다시 편집할 수 있습니다.</div>
      <h3 style="font-size:14px;margin:26px 0 10px">미리보기</h3>
      </div>
      <div class="preview-frame"><style>${DOC_CSS}</style><div id="previewBox">${buildDocHTML(App.doc, App.tpl, App.opt)}</div></div>
    </div></div>`;
}
function doExport(kind) {
  Store.put(App.doc);
  const base = `${safeName(App.doc.name)}_${safeName(App.doc.meta.version || '')}_${App.doc.meta.date || today()}`;
  if (kind === 'html') download(base + '.html', exportStandalone(App.doc, App.tpl, App.opt), 'text/html;charset=utf-8');
  if (kind === 'doc') download(base + '.doc', '﻿' + exportWord(App.doc, App.tpl, App.opt), 'application/msword');
  if (kind === 'md') download(base + '.md', docToMarkdown(App.doc, App.tpl, App.opt), 'text/markdown;charset=utf-8');
  if (kind === 'print') { if (App.sec !== '_review') goSec('_review'); setTimeout(() => window.print(), 150); return; }
  toast('내보냈습니다.', 'ok');
}

/* ─── snapshots ─── */
function flatValues(values, tpl) {
  const out = {};
  tpl._fields.forEach(f => { if (['note', 'calc'].includes(f.type)) return; const t = valText(f, values?.[f.key]); if (t) out[f.label + ' · ' + (tpl.sections.find(s => s.id === f._sec)?.title || '')] = t; });
  return out;
}
function openSnapshots() {
  const snaps = Store.snaps(App.doc.id);
  modalShell('snapModal', '버전 기록', `
    <div class="btn-row" style="margin-bottom:12px"><input id="snapLabel" placeholder="이번 버전 설명 — 예: 중간발표 제출본" style="flex:1;min-width:200px"><button class="btn btn-pri" onclick="saveSnapshot()">현재 상태 저장</button></div>
    <div class="f-hint" style="margin-bottom:12px">자동 저장은 항상 최신 상태만 덮어씁니다. 발표·제출처럼 되돌아올 시점은 여기서 이름을 붙여 저장하세요 (최대 30개). 두 개를 체크하면 비교, 하나만 체크하면 현재와 비교합니다.</div>
    <div style="display:flex;flex-direction:column;gap:6px;max-height:320px;overflow:auto">${snaps.length ? snaps.map((s, i) => `
      <div style="display:flex;align-items:center;gap:10px;padding:9px 12px;border:1px solid var(--line);border-radius:9px">
        <input type="checkbox" class="snap-ck" value="${i}" style="accent-color:var(--accent)">
        <div style="flex:1;min-width:0"><div style="font-weight:650;font-size:13px">${esc(s.label)}</div><div class="muted mono" style="font-size:11px">${fmtTime(s.ts)}</div></div>
        <button class="btn btn-xs" onclick="restoreSnapshot(${i})">되돌리기</button><button class="btn btn-xs btn-ghost" onclick="delSnapshot(${i})">✕</button></div>`).join('') : '<div class="empty">저장된 버전이 없습니다.</div>'}</div>
    <div id="diffOut" style="margin-top:14px"></div>`,
    `<button class="btn" onclick="compareSnaps()">⇄ 비교</button><button class="btn" onclick="closeModal('snapModal')">닫기</button>`, true);
}
function saveSnapshot() { const l = $('#snapLabel').value.trim() || `${App.doc.meta.version || ''} 수동 저장`.trim(); Store.put(App.doc); Store.addSnap(App.doc, l); toast('버전을 저장했습니다.', 'ok'); openSnapshots(); }
function delSnapshot(i) { const s = Store.snaps(App.doc.id); if (!confirm(`"${s[i].label}" 버전을 지울까요?`)) return; s.splice(i, 1); LS.set('dh_snap_' + App.doc.id, s); openSnapshots(); }
function restoreSnapshot(i) {
  const s = Store.snaps(App.doc.id)[i]; if (!s) return;
  if (!confirm(`"${s.label}" (${fmtTime(s.ts)}) 상태로 되돌릴까요?\n현재 상태는 ‘되돌리기 전 자동 백업’으로 먼저 저장됩니다.`)) return;
  Store.addSnap(App.doc, '되돌리기 전 자동 백업');
  App.doc.values = JSON.parse(JSON.stringify(s.values)); if (s.customTpl) App.doc.customTpl = s.customTpl;
  Store.put(App.doc); closeModal('snapModal'); openDoc(App.doc.id, true); toast('되돌렸습니다.', 'ok');
}
function compareSnaps() {
  const snaps = Store.snaps(App.doc.id); const ck = $$('.snap-ck:checked').map(x => +x.value);
  if (!ck.length || ck.length > 2) return toast('비교할 버전을 1~2개 체크하세요.', 'warn');
  const tplA = App.tpl;
  const [a, b] = ck.length === 2 ? [snaps[Math.max(...ck)], snaps[Math.min(...ck)]] : [snaps[ck[0]], { label: '현재', ts: Date.now(), values: App.doc.values }];
  const A = flatValues(a.values, tplA), B = flatValues(b.values, tplA);
  const keys = [...new Set([...Object.keys(A), ...Object.keys(B)])].filter(k => (A[k] || '') !== (B[k] || ''));
  $('#diffOut').innerHTML = `<div style="font-size:12.5px;font-weight:700;margin-bottom:6px">${esc(a.label)} → ${esc(b.label)} · 변경 ${keys.length}개 항목</div>` +
    (keys.length ? keys.map(k => `<div class="diff-row"><b>${esc(k)}</b><div class="diff-old">${esc(A[k] || '(없음)')}</div><div class="diff-new">${esc(B[k] || '(삭제됨)')}</div></div>`).join('') : '<div class="muted">차이가 없습니다.</div>');
}

/* ─── AI: section review / full review / brain dump ─── */
function personaSystem(pid, extra = '') {
  const p = PERSONAS[pid];
  return `${p.role}\n\n${AI_RULES}\n${extra}\n출력 형식:\n${p.format}\n마지막 줄: **가장 먼저 고칠 1가지:** (한 문장)`;
}
async function runSectionAI() {
  const s = App.tpl.sections.find(x => x.id === App.sec); const pid = s.persona || App.tpl.personas[0];
  const box = $('#secAI');
  box.innerHTML = `<div class="ai-out"><div class="ai-out-hd"><span class="spin"></span> ${esc(PERSONAS[pid].name)} 관점으로 ‘${esc(s.title)}’ 검토 중…</div></div>`;
  const ctx = docToText(App.doc, App.tpl, s.id);
  const head = `[문서 핵심]\n${App.tpl.sections[0].fields.filter(f => ['text', 'area', 'select'].includes(f.type)).slice(0, 6).map(f => `${f.label}: ${App.doc.values[f.key] || '(미작성)'}`).join('\n')}`;
  try {
    const r = await AI.call({ system: personaSystem(pid, `이번엔 문서 전체가 아니라 ‘${s.title}’ 섹션만 검토합니다. 양식: ${App.tpl.name}. ${s.ai || ''} 400~700자 분량.`), messages: [{ role: 'user', content: head + '\n\n[검토할 섹션]\n' + ctx }] });
    box.innerHTML = `<div class="ai-out"><div class="ai-out-hd">${PERSONAS[pid].icon} ${esc(PERSONAS[pid].name)} · ${esc(s.title)}<span style="flex:1"></span><button class="btn btn-xs" onclick="chatFrom(this)">채팅으로 이어가기</button></div><div class="ai-out-bd md">${md(r)}</div></div>`;
    box.querySelector('.ai-out').dataset.raw = r;
  } catch (e) { box.innerHTML = `<div class="co co-err"><span class="co-ic">!</span><div>${esc(e.message)} ${/키|쓸 수 없|공용 AI/.test(e.message) ? '<button class="btn btn-xs" onclick="Settings.open()">설정 열기</button>' : ''}</div></div>`; }
}
function openReviewAll() {
  const ps = App.tpl.personas;
  modalShell('reviewModal', 'AI 전체 검토', `
    <div class="f-hint" style="margin-bottom:12px">선택한 관점마다 문서 전체를 따로 검토합니다. 칭찬은 빼고 문제점·누락·근거 없는 주장 중심으로 답하도록 설정되어 있습니다. AI도 틀릴 수 있으니 수치·법규 지적은 직접 확인하세요.</div>
    <div class="f-lab">검토 관점</div>
    <div class="checks" id="rvPersonas" style="margin-bottom:14px">${ps.map((pid, i) => `<label class="ck ${i < 2 ? 'on' : ''}"><input type="checkbox" value="${pid}" ${i < 2 ? 'checked' : ''} onchange="this.parentNode.classList.toggle('on',this.checked)"><span>${PERSONAS[pid].icon} ${esc(PERSONAS[pid].name)}<small>${esc(PERSONAS[pid].desc || '')}</small></span></label>`).join('')}</div>
    <div class="f-lab">AI</div>${AI.provPicker('rvProv')}
    <div id="rvOut" style="margin-top:14px"></div>`,
    `<button class="btn" onclick="closeModal('reviewModal')">닫기</button><button class="btn btn-pri" id="rvRun" onclick="runReviewAll()">검토 시작</button>`, true);
  AI.bindPicker('rvProv');
}
async function runReviewAll() {
  const pids = $$('#rvPersonas input:checked').map(x => x.value); if (!pids.length) return toast('관점을 하나 이상 고르세요.', 'warn');
  const prov = AI.picked('rvProv'); const out = $('#rvOut'); const btn = $('#rvRun'); btn.disabled = true;
  const text = docToText(App.doc, App.tpl).slice(0, 60000);
  out.innerHTML = '';
  for (const pid of pids) {
    const p = PERSONAS[pid]; const card = document.createElement('div'); card.className = 'ai-out';
    card.innerHTML = `<div class="ai-out-hd"><span class="spin"></span> ${p.icon} ${esc(p.name)}</div><div class="ai-out-bd md"></div>`; out.appendChild(card);
    try {
      const r = await AI.call({ provider: prov, system: personaSystem(pid, `검토 대상 양식: ${App.tpl.name}. ${App.tpl.aiContext || ''}`), messages: [{ role: 'user', content: text }] });
      card.querySelector('.ai-out-hd').innerHTML = `${p.icon} ${esc(p.name)}<span style="flex:1"></span><button class="btn btn-xs" onclick="chatFrom(this)">채팅으로 이어가기</button>`;
      card.dataset.raw = r; card.querySelector('.ai-out-bd').innerHTML = md(r);
    } catch (e) { card.querySelector('.ai-out-hd').textContent = `${p.icon} ${p.name} — 실패`; card.querySelector('.ai-out-bd').innerHTML = `<span style="color:var(--err)">${esc(e.message)}</span>`; if (/키가 없/.test(e.message)) break; }
  }
  btn.disabled = false;
}
function fillableFields() { return App.tpl._fields.filter(f => ['text', 'area', 'select', 'number'].includes(f.type) && !f.key.startsWith('_')); }
function openBrainDump() {
  modalShell('dumpModal', '메모에서 초안 채우기', `
    <div class="f-hint" style="margin-bottom:10px">머릿속 아이디어를 형식 없이 붙여넣으면 AI가 이 양식(${esc(App.tpl.name)})의 항목별로 나눠 줍니다. <b>메모에 없는 내용은 만들지 않도록</b> 지시하며, 적용 전에 항목마다 확인하고 고를 수 있습니다.</div>
    <textarea id="dumpText" rows="10" placeholder="예: 2인 협동 VR 게임. 한 명은 지도를 보고 한 명은 직접 움직임. 서로 말로만 소통. 전시에서 5분 안에 끝나야 함. 아트는 로우폴리..."></textarea>
    <div class="btn-row" style="margin-top:10px">${AI.provPicker('dumpProv')}<span class="spacer"></span><button class="btn btn-pri" id="dumpRun" onclick="runBrainDump()">✦ 항목별로 나누기</button></div>
    <div id="dumpOut" style="margin-top:14px"></div>`, '', true);
  AI.bindPicker('dumpProv');
}
async function runBrainDump() {
  const txt = $('#dumpText').value.trim(); if (!txt) return toast('메모를 입력하세요.', 'warn');
  const fs = fillableFields(); const out = $('#dumpOut'); $('#dumpRun').disabled = true;
  out.innerHTML = '<div class="muted"><span class="spin"></span> 분류 중…</div>';
  const spec = fs.map(f => `${f.key} | ${f.label}${f.type === 'select' ? ' | 선택지: ' + f.options.join(' / ') : ''}`).join('\n');
  try {
    const r = await AI.call({
      provider: AI.picked('dumpProv'), maxTokens: 6000,
      system: `너는 문서 작성 보조다. 사용자의 자유 메모를 아래 양식 항목에 배분한다.\n규칙:\n- 메모에 근거가 있는 항목만 채운다. 근거 없는 항목은 아예 키를 넣지 않는다.\n- 내용을 지어내거나 수치를 추정하지 않는다. 메모 표현을 정리·요약하는 것은 허용.\n- select 항목은 반드시 선택지 중 하나의 문자열을 그대로 쓴다. 맞는 선택지가 없으면 생략.\n- 출력은 JSON 객체 하나만. 키는 항목 key, 값은 문자열. 설명·코드펜스 금지.\n\n항목 목록 (key | 라벨):\n${spec}`,
      messages: [{ role: 'user', content: txt }],
    });
    const m = r.match(/\{[\s\S]*\}/); if (!m) throw new Error('AI 응답에서 JSON을 찾지 못했습니다.');
    const obj = JSON.parse(m[0]); const keys = Object.keys(obj).filter(k => fs.some(f => f.key === k) && String(obj[k]).trim());
    if (!keys.length) { out.innerHTML = '<div class="muted">채울 수 있는 항목을 찾지 못했습니다.</div>'; return; }
    App._dump = obj;
    out.innerHTML = `<div class="f-lab">적용할 항목 선택 (${keys.length}개)</div><div style="display:flex;flex-direction:column;gap:6px;max-height:360px;overflow:auto">${keys.map(k => {
      const f = fs.find(x => x.key === k); const cur = App.doc.values[k]; const has = String(cur || '').trim();
      return `<label class="ck on" style="align-items:flex-start"><input type="checkbox" class="dump-ck" value="${k}" checked onchange="this.parentNode.classList.toggle('on',this.checked)"><span><b>${esc(f.label)}</b> <span class="muted" style="font-size:11px">· ${esc(App.tpl.sections.find(s => s.id === f._sec).title)}</span>${has ? ' <span class="pill" style="font-size:10px;color:var(--warn)">기존 내용 있음 → 아래에 덧붙임</span>' : ''}<small style="white-space:pre-wrap;color:var(--text-2);font-size:12.5px">${esc(obj[k])}</small></span></label>`;
    }).join('')}</div><div class="btn-row" style="margin-top:12px"><span class="spacer"></span><button class="btn btn-pri" onclick="applyBrainDump()">선택 항목 적용</button></div>`;
  } catch (e) { out.innerHTML = `<div class="co co-err"><span class="co-ic">!</span><div>${esc(e.message)}</div></div>`; }
  finally { $('#dumpRun').disabled = false; }
}
function applyBrainDump() {
  const ks = $$('.dump-ck:checked').map(x => x.value); const v = App.doc.values;
  ks.forEach(k => { const nv = String(App._dump[k]).trim(); const f = App.tpl._fields.find(x => x.key === k); const cur = String(v[k] || '').trim(); v[k] = cur && f.type !== 'select' ? cur + '\n' + nv : nv; });
  if (App.doc.autoName && App.tpl.titleKey && ks.includes(App.tpl.titleKey)) { App.doc.name = String(v[App.tpl.titleKey]).split('\n')[0]; renderTopbar(); }
  Store.addSnap(App.doc, 'AI 초안 적용 후'); markDirty(); closeModal('dumpModal'); renderSide(); renderPane(); toast(`${ks.length}개 항목에 적용했습니다.`, 'ok');
}

/* ─── chat ─── */
function initChat() {
  const fab = document.createElement('button'); fab.id = 'chatFab'; fab.innerHTML = '✦ AI 채팅'; fab.onclick = () => { $('#chat').classList.toggle('open'); $('#chatIn')?.focus(); };
  const c = document.createElement('div'); c.id = 'chat';
  c.innerHTML = `<div class="chat-hd"><b>AI 조언</b><span id="chatProvBox"></span><button class="btn btn-ghost btn-sm btn-icon" onclick="$('#chat').classList.remove('open')">✕</button></div>
    <div class="chat-msgs" id="chatMsgs"></div>
    <div class="chat-in"><textarea id="chatIn" rows="1" placeholder="문서에 대해 질문하세요 (Enter 전송, Shift+Enter 줄바꿈)"></textarea><button class="btn btn-pri btn-icon" onclick="sendChat()">↑</button></div>`;
  document.body.append(fab, c);
  $('#chatIn').addEventListener('keydown', e => { if (e.key === 'Enter' && !e.shiftKey && !e.isComposing) { e.preventDefault(); sendChat(); } });
  $('#chatIn').addEventListener('input', e => autosize(e.target));
}
function resetChat() {
  App.chat = [];
  $('#chatProvBox').innerHTML = AI.provPicker('chatProv'); AI.bindPicker('chatProv');
  $('#chatMsgs').innerHTML = `<div class="cmsg a">“${esc(App.doc.name)}” 문서 전체를 읽고 답합니다. 문제점·대안 중심으로 답하며, 확인되지 않은 수치는 만들지 않습니다.</div>`;
}
function chatFrom(btn) {
  const raw = btn.closest('.ai-out').dataset.raw || '';
  closeModal('reviewModal'); $('#chat').classList.add('open');
  App.chat.push({ role: 'assistant', content: raw });
  addMsg('a', raw); $('#chatIn').focus();
}
function addMsg(who, text) {
  const d = document.createElement('div'); d.className = 'cmsg ' + who;
  if (who === 'a') { d.classList.add('md'); d.innerHTML = md(text); } else d.textContent = text;
  $('#chatMsgs').appendChild(d); $('#chatMsgs').scrollTop = 1e9; return d;
}
async function sendChat() {
  const inp = $('#chatIn'); const q = inp.value.trim(); if (!q) return;
  inp.value = ''; autosize(inp); addMsg('u', q); App.chat.push({ role: 'user', content: q });
  const wait = addMsg('a', ''); wait.innerHTML = '<span class="spin"></span>';
  try {
    const sys = `너는 ${TOOLS[App.tool].name} 작성을 돕는 조언가다. 양식: ${App.tpl.name}.\n${AI_RULES}\n- 사용자의 질문에 먼저 직접 답하고, 그 답이 가져올 위험이나 대안을 짧게 덧붙인다.\n- 문서 내용과 충돌하는 제안이면 반드시 그 점을 지적한다.\n\n[현재 문서]\n${docToText(App.doc, App.tpl).slice(0, 40000)}`;
    const r = await AI.call({ provider: AI.picked('chatProv'), system: sys, messages: App.chat.slice(-12) });
    wait.innerHTML = md(r); App.chat.push({ role: 'assistant', content: r });
  } catch (e) { wait.innerHTML = `<span style="color:var(--err)">${esc(e.message)}</span>`; App.chat.pop(); }
  $('#chatMsgs').scrollTop = 1e9;
}

/* ─── custom template builder ─── */
let BDraft = null;
function convertToCustom() {
  if (!confirm(`이 문서를 ‘커스텀 양식’으로 전환하면 섹션·항목을 자유롭게 추가·삭제할 수 있습니다.\n대신 자동 계산기와 양식별 점검 규칙은 빠집니다. (전환 전 상태는 버전 기록에 저장됩니다)\n\n전환할까요?`)) return;
  Store.addSnap(App.doc, `커스텀 전환 전 (${App.tpl.name})`);
  App.doc.customTpl = tplToCustom(App.tpl); App.doc.values = valuesToCustom(App.tpl, App.doc.values);
  App.doc.baseTemplate = App.doc.template; App.doc.template = 'custom'; App.doc.lastSec = null;
  Store.put(App.doc); openDoc(App.doc.id, true); openBuilder();
}
function openBuilder(isNew) {
  BDraft = JSON.parse(JSON.stringify(App.doc.customTpl || { sections: [] }));
  modalShell('builderModal', '양식 편집', `
    ${isNew ? `<div class="btn-row" style="margin-bottom:14px"><span class="muted" style="font-size:12.5px">기존 양식에서 시작:</span>${TOOLS[App.tool].templates.map(id => `<button class="btn btn-xs" onclick="builderFrom('${id}')">${esc(TPL[id].name)}</button>`).join('')}</div>` : ''}
    <div class="f-hint" style="margin-bottom:12px">항목 유형: <b>짧은 글</b> · <b>긴 글</b> · <b>선택</b>(옵션을 쉼표로) · <b>표</b>(열 이름을 쉼표로) · <b>체크리스트</b>(항목을 쉼표로). 항목을 지워도 이미 입력한 값은 버전 기록에서 되살릴 수 있습니다.</div>
    <div id="bBody"></div><button class="btn btn-sm" onclick="bAddSec()">＋ 섹션 추가</button>`,
    `<button class="btn" onclick="closeModal('builderModal')">취소</button><button class="btn btn-pri" onclick="bSave()">양식 저장</button>`, true);
  bRender();
}
function builderFrom(id) { if (!confirm(`‘${TPL[id].name}’ 구조로 바꿀까요? 지금 편집 중인 구조는 사라집니다.`)) return; BDraft = tplToCustom(TPL[id]); bRender(); }
const B_TYPES = [['text', '짧은 글'], ['area', '긴 글'], ['select', '선택'], ['table', '표'], ['check', '체크리스트']];
function bExtra(f) { return f.type === 'select' ? (f.options || []).join(', ') : f.type === 'table' ? (f.cols || []).map(c => typeof c === 'string' ? c : c.l).join(', ') : f.type === 'check' ? (f.items || []).map(itemLabel).join(', ') : (f.ph || ''); }
function bRender() {
  $('#bBody').innerHTML = BDraft.sections.map((s, si) => `<div class="bsec"><div class="bsec-hd"><span class="mono muted" style="font-size:11px">${si + 1}</span>
      <input value="${esc(s.title)}" oninput="BDraft.sections[${si}].title=this.value" style="flex:1;height:32px;font-weight:650">
      <button class="row-btn" onclick="bMove(${si},-1)">↑</button><button class="row-btn" onclick="bMove(${si},1)">↓</button><button class="row-btn del" onclick="bDelSec(${si})">✕</button></div>
    <div class="bsec-bd">${s.fields.map((f, fi) => `<div class="bfield">
      <input value="${esc(f.label)}" placeholder="항목 이름" oninput="BDraft.sections[${si}].fields[${fi}].label=this.value">
      <select onchange="bSetType(${si},${fi},this.value)">${B_TYPES.map(([k, l]) => `<option value="${k}"${(f.type === k) ? ' selected' : ''}>${l}</option>`).join('')}</select>
      <input value="${esc(bExtra(f))}" placeholder="${f.type === 'select' ? '옵션1, 옵션2' : f.type === 'table' ? '열1, 열2, 열3' : f.type === 'check' ? '항목1, 항목2' : '입력 안내 문구 (선택)'}" oninput="bSetExtra(${si},${fi},this.value)">
      <span style="display:flex;gap:2px;align-items:center"><label title="필수" style="font-size:11px;display:flex;gap:3px;align-items:center;margin-right:4px"><input type="checkbox" ${f.req ? 'checked' : ''} onchange="BDraft.sections[${si}].fields[${fi}].req=this.checked">필수</label>
      <button class="row-btn" onclick="bMoveF(${si},${fi},-1)">↑</button><button class="row-btn" onclick="bMoveF(${si},${fi},1)">↓</button><button class="row-btn del" onclick="BDraft.sections[${si}].fields.splice(${fi},1);bRender()">✕</button></span></div>`).join('')}
      <button class="btn btn-xs" style="align-self:flex-start" onclick="BDraft.sections[${si}].fields.push({key:'c_'+uid(),label:'',type:'area'});bRender()">＋ 항목</button></div></div>`).join('') || '<div class="empty">섹션이 없습니다.</div>';
}
function bAddSec() { BDraft.sections.push({ id: 's_' + uid(), title: '새 섹션', fields: [{ key: 'c_' + uid(), label: '', type: 'area' }] }); bRender(); }
function bDelSec(i) { if (!confirm(`‘${BDraft.sections[i].title}’ 섹션을 지울까요?`)) return; BDraft.sections.splice(i, 1); bRender(); }
function bMove(i, d) { const a = BDraft.sections, j = i + d; if (j < 0 || j >= a.length) return; [a[i], a[j]] = [a[j], a[i]]; bRender(); }
function bMoveF(si, i, d) { const a = BDraft.sections[si].fields, j = i + d; if (j < 0 || j >= a.length) return; [a[i], a[j]] = [a[j], a[i]]; bRender(); }
function bSetType(si, fi, t) { const f = BDraft.sections[si].fields[fi]; f.type = t; if (t === 'table' && !f.cols) f.cols = ['항목', '내용']; if (t === 'check' && !f.items) f.items = []; if (t === 'select' && !f.options) f.options = []; bRender(); }
function bSetExtra(si, fi, val) {
  const f = BDraft.sections[si].fields[fi]; const parts = val.split(',').map(x => x.trim()).filter(Boolean);
  if (f.type === 'select') f.options = parts;
  else if (f.type === 'table') { const old = (f.cols || []).map((c, i) => typeof c === 'string' ? { k: 'c' + i, l: c } : c); f.cols = parts.map(l => old.find(c => c.l === l) || { k: 'c_' + Math.random().toString(36).slice(2, 7), l }); }
  else if (f.type === 'check') { const old = f.items || []; f.items = parts.map(l => old.find(it => itemLabel(it) === l) || l); }
  else f.ph = val;
}
function bSave() {
  BDraft.sections.forEach(s => { s.fields = s.fields.filter(f => f.label.trim()); s.title = s.title.trim() || '섹션'; });
  if (!BDraft.sections.length) return toast('섹션이 최소 1개 필요합니다.', 'warn');
  App.doc.customTpl = BDraft; Store.put(App.doc); closeModal('builderModal'); openDoc(App.doc.id, true); toast('양식을 저장했습니다.', 'ok');
}

/* ─── share ─── */
function copyDocMarkdown() { return copyText(docToMarkdown(App.doc, App.tpl, { memos: App.opt.memos }), '문서 전체를 Markdown으로 복사했습니다. 노션 · 깃허브에 붙여넣으세요.'); }
async function openShare() {
  if (!Share.supported) return toast('이 브라우저는 링크 공유를 지원하지 않습니다. HTML 파일로 내보내 전달하세요.', 'warn', 4500);
  Store.put(App.doc);
  const url = await Share.url(App.doc); const local = !/^https?:$/.test(location.protocol); const kb = (url.length / 1024).toFixed(1);
  modalShell('shareModal', '링크로 공유', `
    ${local ? `<div class="co co-warn"><span class="co-ic">!</span><div>지금은 파일을 직접 연 상태라 이 링크는 <b>내 컴퓨터에서만</b> 열립니다. 다른 사람에게 보내려면 배포된 사이트 주소에서 문서를 열어 공유하거나, HTML 파일로 내보내 전달하세요.</div></div>` : ''}
    <div class="f-hint" style="margin-bottom:10px">문서 내용 전체가 링크 안에 압축되어 들어갑니다. <b>서버에는 아무것도 저장되지 않으며</b>, 링크를 가진 사람은 누구나 읽을 수 있습니다. 받는 사람은 읽기 전용으로 보고, 원하면 자기 문서로 복사해 편집할 수 있습니다. 공유 후 내가 고친 내용은 반영되지 않으니 수정하면 링크를 다시 보내세요.</div>
    <textarea id="shareUrl" rows="4" readonly style="font-family:var(--mono);font-size:11.5px;word-break:break-all">${esc(url)}</textarea>
    <div class="f-hint">링크 길이 ${kb}KB${url.length > 60000 ? ' — <b style="color:var(--warn)">꽤 깁니다. 일부 메신저에서 잘릴 수 있으니 HTML 파일 전달을 권장합니다.</b>' : url.length > 8000 ? ' — 카카오톡 등 일부 메신저에서는 긴 링크가 잘릴 수 있습니다. 잘리면 메일 · 디스코드 · 노션으로 보내세요.' : ''}</div>`,
    `<button class="btn" onclick="closeModal('shareModal')">닫기</button><button class="btn btn-pri" onclick="copyText($('#shareUrl').value,'공유 링크를 복사했습니다.')">링크 복사</button>`);
}
async function openShared(code) {
  let d; try { d = await Share.unpack(code); } catch (e) { toast('공유 링크를 열 수 없습니다: 링크가 잘렸거나 손상되었습니다.', 'err', 6000); history.replaceState(null, '', location.pathname); return renderHome(); }
  const tpl = tplOf(d); if (!tpl) { toast('이 버전에서 지원하지 않는 양식입니다.', 'err'); history.replaceState(null, '', location.pathname); return renderHome(); }
  App.doc = null; App.tpl = null; App.readonly = true; App.sharedDoc = d;
  $('#chatFab').classList.remove('show'); $('#chat').classList.remove('open');
  const T = TOOLS[App.tool];
  $('#topbar').innerHTML = `<a class="brand" href="${TOOL_FILES[App.tool]}"><span class="brand-mark">${T.mark}</span>${esc(T.name)}<small>공유받은 문서 · 읽기 전용</small></a>
    <div class="tb-actions"><button class="btn btn-sm" onclick="window.print()">인쇄 / PDF</button><button class="btn btn-pri btn-sm" onclick="adoptShared()">내 문서로 복사해 편집</button></div>`;
  $('#main').innerHTML = `<div class="co co-tip no-print" style="max-width:860px;margin:0 auto 16px"><span class="co-ic">i</span><div>링크로 공유받은 문서입니다. 이 화면은 읽기 전용이며, ‘내 문서로 복사해 편집’을 누르면 이 브라우저에 사본이 저장됩니다. 문서 내용은 링크 자체에 들어 있고 서버에 저장되지 않습니다.</div></div>
    <div class="preview-frame" style="max-width:980px;margin:0 auto"><style>${DOC_CSS}</style>${buildDocHTML(d, tpl, { memos: true })}</div>`;
  document.title = d.name + ' — Document Hub'; window.scrollTo(0, 0);
}
function adoptShared() {
  const d = App.sharedDoc; if (!d) return; d.name = d.name + ' (공유본)'; Store.put(d);
  history.replaceState(null, '', location.pathname); App.readonly = false; openDoc(d.id); toast('내 문서로 복사했습니다.', 'ok');
}
