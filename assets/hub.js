/* ═══════════════════════════════════════════════════════════
   HUB — 첫 화면
   ═══════════════════════════════════════════════════════════ */
const Hub = { filter: 'all', q: '' };
function hubBoot() {
  Theme.init();
  const n = Legacy.run();
  if (n) setTimeout(() => toast(`이전 버전 문서 ${n}개를 새 형식으로 옮겼습니다. 원본은 그대로 보존됩니다.`, 'ok', 5000), 300);
  document.addEventListener('dh-settings', hubRender);
  hubRender();
  Shared.check();
  try { navigator.storage && navigator.storage.persist && navigator.storage.persist(); } catch (e) { }
}
function backupState(docs) {
  if (!docs.length) return null;
  const last = LS.get('dh_last_backup', 0); const newest = Math.max(...docs.map(d => d.updatedAt || 0));
  if (!last) return { lvl: 'warn', msg: `문서 ${docs.length}개가 이 브라우저에만 있습니다. 브라우저 데이터를 지우거나 기기를 바꾸면 사라지니 백업 파일을 받아 두세요.` };
  if (newest > last && Date.now() - last > 7 * 86400000) return { lvl: 'warn', msg: `마지막 백업이 ${fmtWhen(last)}입니다. 그 뒤에 고친 문서가 있습니다.` };
  return null;
}
function hubRender() {
  const docs = Store.list(); const legacy = Legacy.legacyKeys(); const bk = backupState(docs);
  const shown = docs.filter(d => (Hub.filter === 'all' || d.tool === Hub.filter) && (!Hub.q || (d.name || '').toLowerCase().includes(Hub.q.toLowerCase())));
  $('#topbar').innerHTML = `<a class="brand" href="${HUB_FILE}"><span class="brand-mark" style="background:var(--text);color:var(--bg)">D</span>Document Hub<small>v${DH_VERSION}</small></a>
    <div class="tb-actions">
      <button class="btn btn-ghost btn-sm" onclick="Backup.exportAll();hubRender()">⤒ <span class="btn-label">전체 백업</span></button>
      <button class="btn btn-ghost btn-sm" onclick="Backup.importFile(()=>hubRender())">⤓ <span class="btn-label">복원 · 가져오기</span></button>
      <button class="btn btn-ghost btn-sm" onclick="Settings.open()">⚙ <span class="btn-label">AI 설정</span></button>
      <button class="btn btn-ghost btn-sm btn-icon" title="테마 전환" onclick="Theme.cycle()">◐</button>
    </div>`;
  const toolCard = t => {
    const T = TOOLS[t]; const mine = docs.filter(d => d.tool === t);
    return `<div class="sec" style="--accent:var(--c-${t});display:flex;flex-direction:column">
      <div style="padding:20px 20px 14px;border-bottom:1px solid var(--line)">
        <div style="display:flex;align-items:center;gap:10px"><span class="brand-mark" style="background:var(--c-${t});width:30px;height:30px">${T.mark}</span>
          <div style="flex:1"><div style="font-weight:750;font-size:16px">${esc(T.name)}</div><div class="muted" style="font-size:12px">양식 ${T.templates.length}종${mine.length ? ` · 내 문서 ${mine.length}개` : ''}</div></div>
          <a class="btn btn-sm" href="${TOOL_FILES[t]}" style="color:var(--c-${t})">전체 보기 →</a></div>
      </div>
      <div style="padding:8px 10px 12px;flex:1">
        ${T.templates.map(id => { const p = TPL[id]; return `<div class="drow" style="border:none;border-radius:8px;padding:6px 8px;gap:8px">
          <a href="${TOOL_FILES[t]}?new=${id}" style="display:flex;align-items:center;gap:10px;flex:1;min-width:0;color:inherit;text-decoration:none" title="${esc(p.meta?.[2]?.[1] || '')}">
            <span style="width:22px;text-align:center;color:var(--c-${t});font-weight:700">${p.icon}</span><span class="dn" style="font-weight:600">${esc(p.name)}</span><span class="pill ${t}">${esc(p.tag)}</span></a>
          ${SAMPLES[id] ? `<a class="btn btn-xs btn-ghost" href="${TOOL_FILES[t]}?sample=${id}">예시</a>` : ''}</div>`; }).join('')}
      </div></div>`;
  };
  $('#main').innerHTML = `
    <section class="hero"><div class="hero-eyebrow">무료 · 로그인 없음 · 문서는 내 브라우저에만 저장</div>
      <h1>빈 문서 앞에서 막막할 때,<br>검증된 양식에서 시작하세요.</h1>
      <p>게임 기획서 · 역기획서 · 시스템 기획서 · 사업계획서(PSST) · 논문까지 14종의 양식을 제공합니다. 양식마다 <b>채워진 예시</b>, 빠진 항목을 잡아내는 <b>자동 점검</b>, 숫자를 맞춰 주는 <b>계산기</b>, 관점별 <b>AI 검토</b>가 들어 있고, 다 쓴 문서는 Word · PDF · 노션(Markdown) · 엑셀 표로 가져갈 수 있습니다.</p>
      <div class="btn-row" style="margin-top:18px"><a class="btn btn-pri" href="${TOOL_FILES.game}?sample=game-system">예시 문서 열어 보기</a><a class="btn" href="#templates">양식 고르기 ↓</a></div></section>

    <div class="steps">
      <div class="step"><i>01</i><b>양식을 고릅니다</b><span>목적이 다르면 항목도 다릅니다. 졸업작품엔 전시 회전율, 실무 시스템 기획서엔 예외 처리와 테스트 케이스가 있습니다.</span></div>
      <div class="step"><i>02</i><b>채우면서 점검받습니다</b><span>항목마다 작성 가이드와 근거가 있고, 필수 누락 · 모순된 숫자 · 모호한 표현을 자동으로 짚어 줍니다.</span></div>
      <div class="step"><i>03</i><b>쓰던 도구로 가져갑니다</b><span>표는 엑셀과 복사 · 붙여넣기가 되고, 문서는 Word · PDF · Markdown으로 내보내거나 링크 하나로 공유합니다.</span></div>
    </div>

    ${bk ? `<div class="blk co co-${bk.lvl}" style="margin-bottom:0"><span class="co-ic">!</span><div style="flex:1">${esc(bk.msg)} <button class="btn btn-xs" style="margin-left:6px" onclick="Backup.exportAll();hubRender()">지금 백업</button></div></div>` : ''}

    <div class="blk" id="templates"><div class="blk-hd"><h2>양식</h2><span class="muted">이름을 누르면 빈 양식, ‘예시’를 누르면 채워진 문서로 시작합니다</span></div>
      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));gap:16px;align-items:start">${['game', 'biz', 'paper'].map(toolCard).join('')}</div></div>

    <div class="blk"><div class="blk-hd"><h2>내 문서</h2><span class="muted">${docs.length}개</span>
      <div class="btn-row"><input type="search" id="hubQ" placeholder="문서 검색" value="${esc(Hub.q)}" style="width:200px;height:30px;padding:4px 10px;font-size:13px">
        <div class="seg">${[['all', '전체'], ['game', '게임'], ['biz', '사업'], ['paper', '논문']].map(([k, l]) => `<button class="${Hub.filter === k ? 'on' : ''}" onclick="Hub.filter='${k}';hubRender()">${l}</button>`).join('')}</div></div></div>
      <div class="dlist">${shown.length ? shown.slice(0, 40).map(d => {
    const t = tplOf(d); const st = t ? docStats(t, d.values || {}) : { pct: 0 };
    return `<a class="drow" href="${TOOL_FILES[d.tool]}?doc=${d.id}"><span class="pill ${d.tool}">${esc(TOOL_NAMES[d.tool])}</span><span class="dn">${esc(d.name || '제목 없음')}</span><span class="muted" style="font-size:12px;white-space:nowrap">${esc(t ? t.name : '')}</span><span class="minibar" style="--accent:var(--c-${d.tool})" title="작성률 ${st.pct}%"><i style="width:${st.pct}%"></i></span><span class="dt">${fmtWhen(d.updatedAt)}</span></a>`;
  }).join('') : `<div class="empty">${docs.length ? '조건에 맞는 문서가 없습니다.' : '아직 문서가 없습니다. 위에서 양식을 고르거나 예시를 열어 보세요.'}</div>`}</div>
      ${shown.length > 40 ? `<div class="muted" style="font-size:12px;margin-top:8px">외 ${shown.length - 40}개 — 검색으로 좁혀 보세요.</div>` : ''}
    </div>

    <div class="blk" style="display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:14px">
      <div class="sec" style="padding:18px 20px"><div style="font-weight:700;margin-bottom:6px">✦ AI 검토 ${Settings.aiReady() ? `<span class="pill" style="color:var(--ok)">${Settings.resolve() === 'shared' ? '공용 AI 사용 가능' : '내 키 사용 중'}</span>` : '<span class="pill" style="color:var(--warn)">미설정</span>'}</div>
        <div style="font-size:13px;color:var(--text-2)">${Shared.ok ? '설정 없이 바로 쓸 수 있습니다. 공용 AI는 하루 사용 횟수에 제한이 있고, 공개하면 안 되는 문서는 본인 API 키를 넣어 쓰는 것을 권합니다.' : 'API 키를 하나 넣으면 섹션별 검토 · 관점별 전체 검토 · 메모 자동 분류 · 문서 기반 채팅을 쓸 수 있습니다. Gemini는 무료 등급 키로도 동작합니다.'}</div>
        <button class="btn btn-sm" style="margin-top:12px" onclick="Settings.open()">AI 설정</button></div>
      <div class="sec" style="padding:18px 20px"><div style="font-weight:700;margin-bottom:6px">내 문서는 어디에 저장되나요</div>
        <div style="font-size:13px;color:var(--text-2)">서버가 아니라 <b>지금 쓰는 브라우저 안</b>에 저장됩니다. 회원가입이 없는 대신, 다른 기기에서는 보이지 않고 브라우저 데이터를 지우면 사라집니다. 백업 파일(JSON)을 받아 두면 어디서든 복원할 수 있습니다.</div>
        <div class="btn-row" style="margin-top:12px"><button class="btn btn-sm" onclick="Backup.exportAll();hubRender()">전체 백업</button><button class="btn btn-sm btn-ghost" onclick="openAbout()">자세히</button></div></div>
      <div class="sec" style="padding:18px 20px"><div style="font-weight:700;margin-bottom:6px">의견 · 양식 제안</div>
        <div style="font-size:13px;color:var(--text-2)">빠진 항목, 틀린 내용, 필요한 양식이 있으면 알려 주세요. 양식의 근거가 된 자료는 각 섹션의 ‘작성 가이드 · 근거’에 적혀 있습니다.</div>
        <a class="btn btn-sm" style="margin-top:12px" href="${REPO_URL}/issues" target="_blank" rel="noopener">GitHub에 의견 남기기 ↗</a></div>
    </div>
    ${legacy.length ? `<div class="blk co co-tip"><span class="co-ic">i</span><div style="flex:1">이전 버전(v2)의 저장 데이터 ${legacy.length}건이 브라우저에 남아 있습니다. 새 형식으로 이전은 끝났고, 원본은 안전을 위해 지우지 않았습니다.
      <div class="btn-row" style="margin-top:8px"><button class="btn btn-xs btn-danger" onclick="clearLegacy()">이전 버전 원본 데이터 삭제</button></div></div></div>` : ''}`;
  const q = $('#hubQ'); q.addEventListener('input', debounce(() => { Hub.q = q.value; hubRender(); const n = $('#hubQ'); n.focus(); n.setSelectionRange(n.value.length, n.value.length); }, 250));
}
function clearLegacy() {
  const ks = Legacy.legacyKeys();
  if (!confirm(`이전 버전 원본 데이터 ${ks.length}건을 삭제할까요?\n이미 새 형식으로 옮겨진 문서는 그대로 남습니다. 먼저 ‘전체 백업’을 권장합니다.`)) return;
  ks.forEach(k => LS.del(k)); toast('정리했습니다.', 'ok'); hubRender();
}
