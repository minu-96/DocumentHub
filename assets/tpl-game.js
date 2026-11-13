/* ═══════════════════════════════════════════════════════════
   GAME DESIGN TEMPLATES
   ═══════════════════════════════════════════════════════════ */
Object.assign(PERSONAS, {
  planner: { name: '시니어 게임 기획자', icon: '🎮', desc: '구조 · 코어 루프 · 누락', role: '너는 상용 게임을 여러 편 출시한 10년 차 시니어 게임 기획자다. 기획 구조의 허점, 코어 루프가 반복 동기를 만드는지, 시스템 간 충돌, 빠진 항목을 본다.', format: '### ① 구조적 문제\n### ② 코어 루프 · 재미의 위험\n### ③ 반드시 추가·구체화할 항목' },
  dev: { name: '개발 리드', icon: '💻', desc: '구현 난이도 · 범위 · 기술 리스크', role: '너는 Unity/Unreal로 소규모 팀 게임을 여러 번 완성한 개발 리드다. 문서에 적힌 팀 규모·기간을 기준으로 구현 난이도와 범위를 판단한다. 팀 규모가 안 적혀 있으면 그 자체를 지적한다.', format: '### ① 구현 난이도 과다 항목\n### ② 범위 축소 제안 (무엇을 빼거나 단순화할지)\n### ③ 프로토타입으로 먼저 검증할 기술 과제' },
  art: { name: '아트 디렉터', icon: '🎨', desc: '작업량 · 비주얼 방향', role: '너는 인디·중소 규모 게임의 아트 디렉터다. 문서의 아트 인원과 기간으로 에셋 작업량이 현실적인지, 비주얼 방향이 팀이 같은 그림을 그릴 만큼 구체적인지 본다.', format: '### ① 작업량 과다 항목 (대략적 에셋 수 추정 포함)\n### ② 비주얼 방향이 모호한 부분\n### ③ 재사용 · 단순화 제안' },
  market: { name: '퍼블리싱 · 마케팅', icon: '📢', desc: '훅 · 타깃 · 스토어 경쟁력', role: '너는 인디게임 퍼블리싱 담당자다. 스토어 페이지와 트레일러 첫 몇 초로 전달 가능한 훅이 있는지, 타깃이 구체적인지, 비교작 대비 포지션이 명확한지 본다. 시장 수치는 지어내지 않는다.', format: '### ① 훅 · 차별점\n### ② 타깃 유저의 구체성\n### ③ 출시 · 마케팅 걸림돌' },
  prof: { name: '지도교수 · 심사위원', icon: '🎓', desc: '완성 가능성 · 평가 · 시연', role: '너는 게임 학과 졸업작품 지도교수이자 심사위원이다. 학기 일정과 팀 구성 대비 완성 가능성, 기획 의도가 결과물에서 증명되는지, 전시 시연 중 실패할 위험을 본다.', format: '### ① 기간 내 완성 가능성\n### ② 기획 의도 · 평가 기준 대비 약점\n### ③ 전시 · 시연 리스크' },
  qa: { name: 'QA 리드', icon: '🧪', desc: '명세 누락 · 예외 처리', role: '너는 라이브 게임 QA 리드다. 기획서만 보고 테스트 케이스를 쓸 수 있는지 본다. 모호한 규칙, 경계값, 네트워크 끊김·중복 입력·재화 부족 같은 예외 처리 누락을 찾는다.', format: '### ① 모호하거나 테스트할 수 없는 규칙\n### ② 누락된 예외 처리 (시스템별)\n### ③ 추가해야 할 검수 기준' },
  player: { name: '타깃 플레이어', icon: '🕹️', desc: '첫 5분 · 재미 · 이탈 지점', role: '너는 이 문서에 적힌 타깃 유저에 해당하는 플레이어다. 문서만 읽고 실제로 해본다고 상상하며, 처음 5분에 무엇을 이해하고 어디서 재미를 느끼거나 그만둘지 솔직하게 말한다.', format: '### ① 처음 5분: 이해되는 것 / 헷갈리는 것\n### ② 재미있을 것 같은 지점\n### ③ 그만둘 것 같은 지점' },
});

const G = {
  GENRES: ['액션', '액션 어드벤처', '어드벤처', 'RPG', '로그라이크 · 로그라이트', '시뮬레이션', '전략', '퍼즐', '공포', '플랫포머', '생존 · 크래프팅', '리듬', '내러티브 · 비주얼노벨', '슈팅', '스포츠 · 레이싱', '파티 · 소셜', '카드 · 덱빌딩', '방치형', '기타'],
  PLATFORMS: ['PC', '모바일', '콘솔', 'PC + 모바일', 'PC + 콘솔', 'VR (독립형 · Quest 등)', 'PC VR', 'VR + PC', '웹'],
  PLAYERS: ['1인', '2인 (로컬)', '2인 (온라인)', '3~4인', '5인 이상', '비동기 멀티'],
  ENGINES: ['Unity', 'Unreal Engine', 'Godot', '기타'],
  MOSCOW: ['Must', 'Should', 'Could', "Won't"],
  aesthetics: (o = {}) => F.check('aesthetics', '목표 경험 (MDA의 8가지 미학)', [
    { k: 'sensation', l: '감각 (Sensation)', d: '보고 듣고 손맛으로 느끼는 즐거움' },
    { k: 'fantasy', l: '판타지 (Fantasy)', d: '다른 존재·세계가 되어보는 상상' },
    { k: 'narrative', l: '서사 (Narrative)', d: '전개되는 이야기' },
    { k: 'challenge', l: '도전 (Challenge)', d: '장애물을 극복하는 성취' },
    { k: 'fellowship', l: '교감 (Fellowship)', d: '함께하는 사회적 경험' },
    { k: 'discovery', l: '발견 (Discovery)', d: '미지의 것을 탐험·발견' },
    { k: 'expression', l: '표현 (Expression)', d: '자기표현·창작' },
    { k: 'submission', l: '몰입 소일거리 (Submission)', d: '부담 없이 시간을 보내는 즐거움' },
  ], { hint: '1~2개만 고르세요. 이 선택이 이후 모든 기능의 채택·삭제 기준이 됩니다.', ...o }),
  refs: () => F.table('refs', '레퍼런스', [C('work', '작품', 'text', { w: '22%' }), C('take', '가져올 것 (구조·시스템·연출)', 'area'), C('diff', '다르게 할 것', 'area')], { hint: '“분위기가 비슷하다”보다 “어떤 구조를 가져와 어떻게 바꾸는지”를 적어야 레퍼런스로 쓸모가 있습니다.' }),
  risks: (o = {}) => F.table('risks', '리스크 목록', [C('risk', '리스크', 'area'), C('impact', '영향', 'sel', { o: ['상', '중', '하'], w: '70px' }), C('prob', '가능성', 'sel', { o: ['상', '중', '하'], w: '70px' }), C('plan', '대응 · 완화책', 'area'), C('owner', '담당', 'text', { w: '80px' })], { minRows: 3, ...o }),
  sound: () => [
    F.area('bgm', '음악 (BGM) 방향', { ph: '예: 저음 앰비언트 중심, 추격 시 타악 레이어 추가 / 레퍼런스 곡', w: 'half' }),
    F.area('sfx', '핵심 효과음 (SFX)', { ph: '게임 손맛을 좌우하는 소리 5~10개: 발소리, 타격, 획득, UI 클릭…', w: 'half' }),
    F.area('amb', '환경음 · 앰비언스', { ph: '공간감을 만드는 배경 소리', w: 'half' }),
    F.area('voice', '음성 · 내레이션', { ph: '없으면 비워두세요', w: 'half' }),
    F.area('audioFb', '소리로 전달하는 정보', { ph: '예: 적 접근 시 심박음, 체력 낮음 경고음 — 소리 없이도 같은 정보가 보이는지(접근성) 함께 적기' }),
  ],
  vr: () => ({
    id: 'vr', title: 'VR 설계', showIf: { k: 'platform', has: 'VR' }, persona: 'dev',
    desc: '플랫폼에 VR이 포함되어 표시되는 섹션입니다. VR은 이동 · 입력 · 편의성(멀미) 설계가 평면 게임과 근본적으로 다릅니다.',
    guide: [
      '<b>멀미(VR sickness)</b>는 눈에 보이는 움직임과 몸(전정기관)이 느끼는 움직임이 어긋날 때 생깁니다. 인위적 가속·회전, 카메라 강제 이동을 줄이는 것이 기본 원칙입니다.',
      '<b>Meta Quest 스토어 등록 요건(VRC)</b>은 앱이 최소 72fps를 안정적으로 유지할 것을 요구합니다. Quest 3는 72·90·120Hz 주사율을 지원합니다. <span class="src">— Meta Horizon Store VRC, 출시 전 최신 문서로 재확인</span>',
      '머리에 고정된 HUD는 시선이 따라다녀 피로와 멀미를 키우기 쉽습니다. 손목 메뉴 · 월드 공간 UI가 일반적인 대안입니다.',
      '전시·시연이 있다면 페이스 커버 위생, 충전 교대, 가디언(경계) 재설정 시간을 플레이 시간과 별도로 잡으세요.',
    ],
    fields: [
      F.sel('vrLoco', '이동 방식', ['텔레포트', '스무스 이동 (조이스틱)', '텔레포트 + 스무스 선택 제공', '룸스케일 (실제 걸음)만', '물리 기반 이동 (클라이밍 · 팔 흔들기 등)', '고정 위치 (이동 없음)'], { w: 'half', req: true }),
      F.sel('vrTurn', '회전 방식', ['스냅 턴', '스무스 턴', '둘 다 옵션 제공', '몸 회전만 (인공 회전 없음)'], { w: 'half' }),
      F.sel('vrSpace', '플레이 자세 · 공간', ['좌식', '스탠딩 (제자리)', '룸스케일', '좌식 · 스탠딩 모두 지원'], { w: 'half' }),
      F.sel('vrFps', '목표 주사율', ['72Hz', '90Hz', '120Hz'], { w: 'half' }),
      F.check('vrComfort', '컴포트(멀미 완화) 옵션', ['이동 시 비네팅(시야 좁힘)', '스냅 턴 각도 설정', '이동 속도 조절', '좌식 모드 · 키 높이 보정', '카메라 강제 이동 · 회전 없음 (컷신 포함)', '화면 흔들림 · 헤드 밥 끄기', '주 사용 손 변경 · 한 손 조작', '자막 · 시각 신호 (소리에만 의존하지 않기)']),
      F.area('vrInteract', '손 · 컨트롤러 인터랙션', { ph: '예: 그립 버튼으로 잡기, 양손 잡기 시 회전, 핸드 트래킹 지원 여부, 물리 기반 상호작용 범위', req: true }),
      F.area('vrUi', 'VR UI 배치', { ph: '예: 왼손 손목 메뉴, 목표 안내는 월드 공간 표지판, 머리 고정 HUD 미사용', w: 'half' }),
      F.area('vrPerf', '성능 예산', { ph: '예: 목표 72fps, 드로우콜 150 이하, 실시간 그림자 최소화, 텍스처 2K 이하', w: 'half' }),
      F.area('vrSafety', '안전 · 신체 부담', { ph: '예: 격한 팔 동작 빈도, 1회 플레이 시간 상한, 가디언 경계 근처 경고, 전시 위생 관리' }),
    ],
  }),
};

/* ─── calculators ─── */
CALCS.boxleiter = {
  title: '비교작 판매량 추정 (리뷰 수 기반)',
  compute(v) {
    const rows = tableRows(v.comps).filter(r => isFinite(num(r.reviews)));
    if (!rows.length) return { kpis: [], note: '비교작 표에 <b>스팀 리뷰 수</b>를 숫자로 넣으면 추정 판매량 범위가 계산됩니다.' };
    const est = rows.map(r => ({ n: r.name || '?', rv: num(r.reviews), lo: num(r.reviews) * 30, hi: num(r.reviews) * 60, p: num(r.price) }));
    const sorted = est.map(e => e.rv).sort((a, b) => a - b); const med = sorted[Math.floor(sorted.length / 2)];
    return {
      kpis: [{ l: '비교작', v: rows.length + '개' }, { l: '리뷰 수 중앙값', v: fmtN(med) }, { l: '중앙값 기준 판매 추정', v: `${fmtN(med * 30)}~${fmtN(med * 60)}`, s: '장 (×30~60)' }],
      lines: est.map(e => `${esc(e.n)}: 리뷰 ${fmtN(e.rv)} → 약 ${fmtN(e.lo)}~${fmtN(e.hi)}장${isFinite(e.p) ? ` · 정가 기준 총매출 ${fmtWon(e.lo * e.p)}~${fmtWon(e.hi * e.p)}` : ''}`),
      note: '“리뷰 수 × 30~60”은 업계에서 흔히 쓰는 거친 추정법(Boxleiter 방식)입니다. 장르 · 가격 · 출시 연도 · 지역 · 할인 이력에 따라 편차가 매우 크므로 <b>범위로만</b> 쓰고, 비교작은 최소 5개 이상, 성공작만이 아니라 평범한 성과의 게임도 섞으세요.',
      docLines: est.map(e => `${e.n}: 리뷰 ${fmtN(e.rv)} → 추정 ${fmtN(e.lo)}~${fmtN(e.hi)}장`),
    };
  },
};
CALCS.indieBEP = {
  title: '손익분기 판매량',
  compute(v) {
    const budget = colSum(v.budget, 'amount'); const price = num(v.price); const fee = isFinite(num(v.feePct)) ? num(v.feePct) : 30;
    if (!budget || !isFinite(price) || price <= 0) return { kpis: budget ? [{ l: '총 개발 예산', v: fmtWon(budget) + '원' }] : [], note: '예산 표의 금액과 판매가를 입력하면 손익분기 판매량을 계산합니다.' };
    const net = price * (1 - fee / 100); const bep = Math.ceil(budget / net);
    const comps = tableRows(v.comps).map(r => num(r.reviews)).filter(isFinite).sort((a, b) => a - b);
    const med = comps.length ? comps[Math.floor(comps.length / 2)] : NaN;
    const k = [{ l: '총 개발 예산', v: fmtWon(budget) + '원' }, { l: '장당 순수익', v: fmtN(net) + '원', s: `플랫폼 수수료 ${fee}% 차감` }, { l: '손익분기 판매량', v: fmtN(bep) + '장', lvl: 'warn' }];
    if (isFinite(med)) k.push({ l: '비교작 중앙값 추정', v: `${fmtN(med * 30)}~${fmtN(med * 60)}장`, lvl: med * 30 >= bep ? 'ok' : med * 60 >= bep ? 'warn' : 'err', s: med * 30 >= bep ? '보수적 추정도 BEP 이상' : med * 60 >= bep ? '낙관적 추정에서만 BEP 도달' : '추정 범위가 BEP 미만' });
    return { kpis: k, note: '부가세 · 환불 · 지역별 가격 · 할인 판매 · 결제/송금 수수료 · 세금 · 퍼블리셔 몫은 반영하지 않았습니다. 실제 손익분기점은 이보다 <b>높습니다</b>. 팀원 인건비를 0으로 두지 말고 기회비용(아르바이트 시급 등)이라도 넣어 보세요.' };
  },
};
CALCS.capacity = {
  title: '팀 가용량 vs 작업량 (MoSCoW)',
  compute(v) {
    const team = tableRows(v.team); const n = team.length; const weeks = num(v.devWeeks); const buf = isFinite(num(v.bufferPct)) ? num(v.bufferPct) : 20;
    const hours = team.reduce((a, r) => a + (isFinite(num(r.hours)) ? num(r.hours) : 0), 0);
    const feats = tableRows(v.features);
    const sumBy = m => feats.filter(r => String(r.moscow || '').startsWith(m)).reduce((a, r) => a + (isFinite(num(r.est)) ? num(r.est) : 0), 0);
    const must = sumBy('Must'), should = sumBy('Should');
    if (!n || !isFinite(weeks)) return { kpis: [], note: '팀 표와 ‘실제 개발 주 수’를 채우면 가용량을 계산합니다.' };
    const cap = n * weeks * (1 - buf / 100);
    const k = [{ l: '팀원', v: n + '명' }, { l: '순 가용량', v: fmtN(cap, 1) + ' 인·주', s: `버퍼 ${buf}% 제외` }];
    if (hours) k.push({ l: '총 가용 시간', v: fmtN(hours * weeks) + 'h', s: `주 ${fmtN(hours)}h × ${weeks}주` });
    if (feats.length) {
      const ratio = must / cap;
      k.push({ l: 'Must 작업량', v: fmtN(must, 1) + ' 인·주', s: `가용량의 ${fmtN(ratio * 100)}%`, lvl: ratio <= .6 ? 'ok' : ratio <= 1 ? 'warn' : 'err' });
      k.push({ l: 'Must + Should', v: fmtN(must + should, 1) + ' 인·주', lvl: must + should <= cap ? 'ok' : 'warn' });
    }
    return { kpis: k, note: 'DSDM의 MoSCoW 지침은 <b>Must가 전체 가용 작업량의 60%를 넘지 않게</b> 잡을 것을 권합니다. 남는 여유로 Should·Could를 채우고, 일정이 밀리면 Could부터 버립니다. 시험 기간 · 방학 · 다른 과제 마감 주는 ‘실제 개발 주 수’에서 빼고 넣으세요.' };
  },
};
CALCS.booth = {
  title: '전시 부스 회전율',
  compute(v) {
    const e = num(v.explainMin), p = num(v.playMin), r = isFinite(num(v.resetMin)) ? num(v.resetMin) : 0;
    const st = isFinite(num(v.stations)) ? num(v.stations) : 1, per = isFinite(num(v.perSession)) ? num(v.perSession) : 1, h = num(v.hours);
    if (!isFinite(e) || !isFinite(p)) return { kpis: [], note: '설명 시간과 1판 플레이 시간을 넣으면 시간당 체험 가능 인원을 계산합니다.' };
    const cyc = e + p + r; const perHr = 60 / cyc * st * per;
    const k = [{ l: '1회 사이클', v: fmtN(cyc, 1) + '분', s: `설명 ${e} + 플레이 ${p} + 리셋 ${r}` }, { l: '시간당 체험 인원', v: fmtN(perHr, 1) + '명', s: `시연 세트 ${st}개 × 판당 ${per}명` }];
    if (isFinite(h)) k.push({ l: '하루 최대 체험 인원', v: fmtN(perHr * h) + '명', s: `운영 ${h}시간, 대기·휴식 미포함` });
    k.push({ l: '설명 시간 비중', v: fmtN(e / cyc * 100) + '%', lvl: e / cyc > .4 ? 'warn' : 'ok', s: e / cyc > .4 ? '설명이 플레이를 잡아먹음' : '' });
    return { kpis: k, note: '전시에서는 줄 선 관람객이 이탈하지 않는 것이 중요합니다. 설명 비중이 크면 대기열 영상 · 1장짜리 조작 안내 · 인게임 튜토리얼로 설명을 옮기는 것을 검토하세요.' };
  },
};
CALCS.gacha = {
  title: '확률 합계 검증',
  compute(v) {
    const rows = tableRows(v.gacha).filter(r => isFinite(num(r.rate)));
    if (!rows.length) return { kpis: [], note: '확률형 상품이 없다면 비워두세요.' };
    const sum = rows.reduce((a, r) => a + num(r.rate), 0); const ok = Math.abs(sum - 100) < 1e-6;
    const byG = {}; rows.forEach(r => { const g = r.grade || '(등급 없음)'; byG[g] = (byG[g] || 0) + num(r.rate); });
    return { kpis: [{ l: '확률 합계', v: fmtN(sum, 4) + '%', lvl: ok ? 'ok' : 'err', s: ok ? '100% 일치' : '100%가 아님 — 수정 필요' }, { l: '항목 수', v: rows.length + '개' }], lines: Object.entries(byG).map(([g, x]) => `${esc(g)}: ${fmtN(x, 4)}%`) };
  },
};

/* ─── 1) 1페이지 기획서 ─── */
registerTemplate({
  id: 'game-onepage', tool: 'game', name: '1페이지 기획서', icon: '①', tag: '아이디어 검증', titleKey: 'title',
  desc: '아이디어를 한 장으로 압축해 팀 · 교수 · 공모전 1차 심사에 공유합니다. 무엇을 만들지보다 <b>왜 재미있는지</b>와 <b>무엇을 검증할지</b>에 집중합니다.',
  meta: [['대상', '입문자 · 아이디어 단계 · 공모전 1차'], ['분량', 'A4 1~2쪽'], ['핵심 질문', '이 아이디어는 프로토타입을 만들 가치가 있는가?']],
  personas: ['planner', 'player', 'dev', 'market'],
  aiContext: '1페이지 기획서다. 세부 명세가 없는 것은 지적하지 말고, 핵심 재미와 검증 가능성에 집중하라.',
  sections: [
    {
      id: 'identity', title: '정체성', desc: '게임을 처음 듣는 사람이 10초 안에 그림을 떠올릴 수 있게 합니다.',
      guide: ['<b>한 줄 소개 공식</b>: [누가/무엇이 되어] + [핵심 행동] + [차별점]. 예: “소리를 내면 쫓기는 폐병원에서 손전등 배터리를 아끼며 탈출하는 2인 협동 공포 게임”.',
        '<b>1페이지 기획서</b>는 Stone Librande가 GDC 2010 “One-Page Designs”에서 소개한 방식으로, 팀이 실제로 읽는 짧은 문서를 지향합니다. 길게 쓰기보다 결정된 것만 적습니다.'],
      fields: [
        F.text('title', '게임 제목 (가제)', { req: true, ph: '예: Project Hollow', w: 'half' }),
        F.sel('genre', '장르', G.GENRES, { req: true, w: 'half' }),
        F.sel('platform', '플랫폼', G.PLATFORMS, { w: 'third' }), F.sel('players', '플레이 인원', G.PLAYERS, { w: 'third' }), F.sel('engine', '엔진', G.ENGINES, { w: 'third' }),
        F.area('pitch', '한 줄 소개', { req: true, rows: 2, count: 'chars', max: 80, ph: '[누가] + [핵심 행동] + [차별점]을 한 문장으로' }),
        F.text('audience', '타깃 유저', { req: true, ph: '예: Phasmophobia처럼 친구와 음성 대화하며 하는 공포 게임을 즐기는 사람', hint: '나이·성별보다 “어떤 게임을 즐겨 하는 사람인가”로 쓰면 디자인 판단에 쓸 수 있습니다.' }),
        F.text('art', '아트 스타일', { ph: '예: 저채도 3D 로우폴리, 손전등 광원 대비 강조' }),
        G.refs(),
      ],
    },
    {
      id: 'experience', title: '경험 목표 (MDA)', desc: '플레이어가 느낄 감정(미학)을 먼저 정하고, 그 감정을 만드는 플레이 양상(다이내믹스)과 규칙(메커닉스)을 역순으로 설계합니다.',
      guide: ['<b>MDA 프레임워크</b> (Hunicke, LeBlanc, Zubek, 2004): 디자이너는 메커닉스 → 다이내믹스 → 미학 순으로 만들지만, 플레이어는 미학부터 경험합니다. 그래서 목표 미학에서 거꾸로 설계합니다.',
        '예) 목표 미학 “교감” → 다이내믹스 “한 명은 정보를 보고 한 명은 행동해야 해서 계속 말을 걸게 됨” → 메커닉스 “지도는 A만, 조작은 B만 가능”.'],
      fields: [
        G.aesthetics({ req: true }),
        F.area('dynamics', '플레이 중 생기는 행동 패턴 (다이내믹스)', { rows: 3, ph: '규칙 때문에 플레이어가 자연스럽게 하게 되는 행동. 예: 소리를 내지 않으려고 걷기만 하다가, 추격당하면 일부러 소리를 내서 몬스터를 다른 쪽으로 유인' }),
        F.area('mechanics', '핵심 규칙 · 시스템 (메커닉스)', { req: true, rows: 5, ph: '[시스템] 플레이어 행동 → 게임 반응 → 피드백\n예: [소음] 달리기 → 소음 게이지 +30 → 화면 가장자리 붉어짐 + 몬스터 방향 전환' }),
      ],
    },
    {
      id: 'play', title: '플레이 구조', desc: '플레이어가 반복하는 행동의 순환과 한 판의 시작 · 끝을 정의합니다.',
      fields: [
        F.area('coreLoop', '코어 루프', { req: true, rows: 2, ph: '탐색 → 단서 수집 → 추격 회피 → 문 열기 → (다음 구역에서 다시) 탐색', hint: '마지막 단계가 처음으로 돌아가며, 돌 때마다 무언가 달라져야(보상·난이도·정보) 반복할 이유가 생깁니다.' }),
        F.text('session', '한 판 · 세션 길이', { w: 'half', ph: '예: 1판 15~20분' }),
        F.area('goal', '승리 · 클리어 · 실패 조건', { req: true, rows: 2, w: 'half', ph: '예: 3개 구역 탈출 시 클리어 / 둘 다 잡히면 실패' }),
        F.area('controls', '조작 요약', { rows: 3, ph: '예: WASD 이동, Shift 달리기(소음↑), F 손전등, E 상호작용' }),
        F.area('progression', '진행 · 성장', { rows: 3, ph: '판이 거듭될수록 무엇이 바뀌는가 (해금, 맵 변화, 난이도 상승 등). 없으면 “없음”이라고 명시' }),
      ],
    },
    {
      id: 'scope', title: '범위 & 검증', desc: '무엇을 만들지만큼 무엇을 만들지 않을지, 그리고 프로토타입으로 무엇을 확인할지 정합니다.',
      fields: [
        F.area('mustHave', '이것 없으면 이 게임이 아닌 것 (3개 이내)', { req: true, rows: 3 }),
        F.area('cutList', '이번에는 만들지 않는 것', { rows: 3, ph: '예: 스토리 컷신, 캐릭터 커스터마이징, 온라인 매칭' }),
        F.text('protoQ', '프로토타입으로 답할 질문 1개', { req: true, ph: '예: 손전등 배터리 압박만으로 긴장감이 생기는가?', hint: '“재미있는가?”처럼 막연한 질문 대신, 플레이테스트 후 예/아니오로 답할 수 있게 쓰세요.' }),
        F.area('risk', '가장 큰 위험', { rows: 2, ph: '예: 2인 음성 소통이 없으면 협동이 성립하지 않음 → 핑 시스템 필요 여부 검증' }),
      ],
    },
  ],
  checks(v) {
    const o = [];
    if (v.coreLoop && !/→|->|>/.test(v.coreLoop)) o.push({ lvl: 'warn', msg: '코어 루프가 순서(→)로 표현되지 않았습니다. 단계 사이의 인과가 보이게 쓰세요.', sec: 'play' });
    if ((v.aesthetics || []).length > 2) o.push({ lvl: 'warn', msg: `목표 미학을 ${(v.aesthetics || []).length}개 골랐습니다. 1~2개로 좁혀야 기능을 채택·삭제할 기준이 됩니다.`, sec: 'experience' });
    if (tableRows(v.refs).length && !tableRows(v.refs).some(r => r.diff)) o.push({ lvl: 'warn', msg: '레퍼런스마다 “다르게 할 것”을 적지 않으면 아류작처럼 보일 수 있습니다.', sec: 'identity' });
    return o;
  },
});

/* ─── 2) 인디게임 기획서 ─── */
registerTemplate({
  id: 'game-indie', tool: 'game', name: '인디게임 기획서', icon: '◆', tag: '출시 목표', titleKey: 'title',
  desc: '스팀 · 스토브 등에 실제로 출시하려는 1~5인 팀용. 재미 설계와 함께 <b>스코프 · 비교작 · 예산 · 출시 준비</b>를 숫자로 점검합니다.',
  meta: [['대상', '소규모 팀 · 상업 출시 · 지원사업 · 퍼블리셔 피칭'], ['분량', '10~20쪽 + 계산표'], ['핵심 질문', '이 범위로 출시해서 버틸 수 있는가?']],
  personas: ['market', 'dev', 'planner', 'art', 'player'],
  aiContext: '상업 출시를 목표로 하는 인디게임 기획서다. 재미뿐 아니라 스코프·시장성·예산의 현실성을 함께 보라.',
  sections: [
    {
      id: 'vision', title: '비전 & 훅', desc: '스토어 페이지 첫 화면에서 클릭을 받아낼 이유와, 개발 중 흔들리지 않을 판단 기준을 정합니다.',
      guide: ['<b>훅(hook)</b>은 캡슐 이미지 · 트레일러 첫 몇 초 · 스크린샷 한 장으로 전달되어야 합니다. 말로 설명해야만 알 수 있는 차별점은 스토어에서 전달되지 않습니다.',
        '<b>디자인 기둥(pillar)</b>은 3개 내외로, 기능 추가 요청이 올 때 “이 기능이 어떤 기둥에 기여하는가?”로 판단하는 기준입니다.'],
      fields: [
        F.text('title', '게임 제목 (가제)', { req: true, w: 'half' }), F.sel('genre', '장르', G.GENRES, { req: true, w: 'half' }),
        F.sel('platform', '출시 플랫폼', G.PLATFORMS, { req: true, w: 'third' }), F.sel('players', '플레이 인원', G.PLAYERS, { w: 'third' }), F.sel('engine', '엔진', G.ENGINES, { w: 'third' }),
        F.area('pitch', '한 줄 소개', { req: true, rows: 2, count: 'chars', max: 80 }),
        F.area('hook', '훅 — 스크린샷 한 장으로 보이는 차별점', { req: true, rows: 3, ph: '예: 화면 전체가 손전등이 비추는 원 하나뿐이고, 나머지는 소리 파형으로만 보인다' }),
        F.table('pillars', '디자인 기둥', [C('pillar', '기둥', 'text', { w: '22%' }), C('meaning', '의미', 'area'), C('test', '판단 기준 (예/아니오 질문)', 'area')], { minRows: 3, hint: '예: 기둥 “소리는 무기이자 위험” → 판단 기준 “이 기능이 소리를 내거나 듣게 만드는가?”' }),
        F.area('audience', '타깃 유저', { req: true, rows: 2, ph: '이 사람이 최근 산 게임 3개로 묘사하세요. 예: Lethal Company, Content Warning, R.E.P.O.를 친구들과 한 사람' }),
      ],
    },
    {
      id: 'market', title: '시장 & 비교작', desc: '내 게임과 가장 비슷한 출시작의 성과로 기대치를 잡습니다. 감이 아니라 공개된 숫자로 시작하세요.',
      guide: ['비교작은 <b>장르 · 가격대 · 아트 수준 · 팀 규모가 비슷한</b> 최근 3년 내 출시작 5개 이상을 고르세요. 대박작만 고르면 기대치가 왜곡됩니다.',
        '스팀 리뷰 수는 스토어 페이지에서 누구나 확인할 수 있는 공개 지표입니다. SteamDB · Gamalytic 등 서드파티 추정 도구도 있지만 각자 추정 방식이 다르므로 출처를 함께 적으세요.'],
      fields: [
        F.table('comps', '비교작', [C('name', '게임', 'text', { w: '18%' }), C('year', '출시', 'text', { w: '60px' }), C('price', '정가(원)', 'num', { w: '90px' }), C('reviews', '스팀 리뷰 수', 'num', { w: '100px' }), C('same', '비슷한 점', 'area'), C('diff', '우리가 다른 점', 'area')], { minRows: 3 }),
        F.calc('boxleiter'),
        F.area('positioning', '포지셔닝', { rows: 3, ph: '비교작 대비 우리 게임의 위치. 예: Lethal Company의 협동 공포 + 탐색 대신 “소리 관리”를 핵심 긴장으로' }),
      ],
    },
    {
      id: 'gameplay', title: '코어 게임플레이', desc: '반복되는 행동과 그 행동을 계속하게 만드는 이유를 설계합니다.',
      fields: [
        F.area('coreLoop', '코어 루프 (초~분 단위)', { req: true, rows: 2 }),
        F.area('metaLoop', '메타 루프 (판과 판 사이)', { rows: 2, ph: '예: 탈출 성공 → 획득 자원으로 장비 해금 → 다음 판 새 맵 해금' }),
        F.cards('mechanics', '핵심 시스템', [
          F.text('name', '시스템 이름', { w: 'twothird', req: true }), F.sel('moscow', 'MoSCoW', G.MOSCOW, { w: 'third' }),
          F.area('action', '플레이어 행동', { w: 'third' }), F.area('reaction', '게임 반응 (규칙 · 수치)', { w: 'third' }), F.area('feedback', '피드백 (연출 · 사운드)', { w: 'third' }),
        ], { addLabel: '시스템 추가', idxLabel: 'SYS ', tags: ['moscow'] }),
        F.area('controls', '조작', { rows: 3, w: 'half' }), F.text('session', '1회 플레이 길이', { w: 'half', ph: '예: 1판 20분, 엔딩까지 6~8시간' }),
        F.area('volume', '출시 시 콘텐츠 분량', { rows: 2, ph: '예: 맵 3종, 몬스터 4종, 엔딩까지 약 6시간 — 리뷰에서 가격 대비 분량을 판단하는 기준이 됩니다' }),
        F.area('replay', '재플레이 동기', { rows: 2, ph: '절차적 생성, 해금, 도전 과제, 멀티플레이 등' }),
      ],
    },
    {
      id: 'scope', title: '스코프 & MVP', desc: '인디 개발이 실패하는 가장 흔한 이유는 범위입니다. 먼저 출시 가능한 최소 단위를 정의합니다.',
      guide: ['<b>MoSCoW</b>(DSDM): Must(없으면 출시 불가) · Should(중요하지만 우회 가능) · Could(여유 있으면) · Won’t(이번엔 안 함). Must는 전체 작업량의 60% 이하로 잡는 것이 권장됩니다.',
        '<b>버티컬 슬라이스</b>: 게임의 한 구간을 출시 품질로 끝까지 만든 빌드. 퍼블리셔 · 지원사업 · 데모에서 가장 설득력 있는 증거입니다.',
        '<b>중단 기준(kill criteria)</b>을 미리 적어두면 매몰 비용 때문에 안 되는 프로젝트를 붙잡는 일을 줄일 수 있습니다.'],
      fields: [
        F.area('slice', '버티컬 슬라이스 정의', { req: true, rows: 3, ph: '예: 첫 번째 맵 1개, 몬스터 1종, 손전등 · 소음 시스템 완성, 최종 아트 품질, 10분 플레이' }),
        F.table('features', '기능 목록', [C('feat', '기능', 'area'), C('moscow', 'MoSCoW', 'sel', { o: G.MOSCOW, w: '90px' }), C('est', '예상 작업(인·주)', 'num', { w: '110px', sum: true }), C('owner', '담당', 'text', { w: '80px' })], { minRows: 4 }),
        F.area('cutList', 'Won’t — 이번엔 안 하는 것', { rows: 2 }),
        F.area('kill', '중단 · 피벗 기준', { rows: 3, ph: '예: 프로토타입 플레이테스트 10명 중 6명 이상이 “다시 하고 싶다”고 답하지 않으면 핵심 메커닉 재설계 / 스팀 페이지 공개 3개월 후 위시리스트가 목표치의 30% 미만이면 범위 축소' }),
      ],
    },
    {
      id: 'schedule', title: '일정 & 마일스톤', desc: '각 단계의 “완료 기준”을 검증 가능한 문장으로 적습니다.',
      guide: ['일반적인 단계: <b>프로토타입</b>(재미 검증) → <b>버티컬 슬라이스</b>(품질 검증) → <b>알파</b>(모든 기능 구현) → <b>베타</b>(모든 콘텐츠, 버그 수정) → <b>출시 후보</b> → <b>출시</b> → 패치.',
        '스팀은 출시 전 ‘출시 예정(Coming Soon)’ 페이지를 최소 2주 이상 공개해야 하고, 앱 등록비(Steam Direct) 결제 후 출시까지 30일 대기 기간이 있습니다. <span class="src">— Steamworks 문서, 출시 전 최신 규정 재확인</span>'],
      fields: [
        F.table('milestones', '마일스톤', [C('phase', '단계', 'sel', { o: ['프로토타입', '버티컬 슬라이스', '알파', '베타', '스토어 페이지 공개', '데모 · 페스티벌', '출시 후보', '출시', '출시 후 패치'], w: '140px' }), C('date', '목표일', 'date', { w: '140px' }), C('done', '완료 기준', 'area'), C('status', '상태', 'sel', { o: ['예정', '진행', '완료', '지연'], w: '80px' })], { minRows: 4 }),
      ],
    },
    {
      id: 'budget', title: '예산 & 손익', desc: '개발비와 판매가로 손익분기 판매량을 계산하고, 비교작 성과와 대조합니다.',
      guide: ['스팀 기본 수익 배분은 판매액의 30%가 플랫폼 몫이며, 한 게임의 매출이 1천만 달러를 넘는 구간은 25%, 5천만 달러를 넘는 구간은 20%로 낮아집니다. Steam Direct 등록비는 앱당 100달러이며 해당 앱의 조정 총매출이 1,000달러에 도달하면 돌려받습니다. <span class="src">— Steamworks 문서 기준, 변경 가능</span>'],
      fields: [
        F.table('budget', '개발 예산', [C('item', '항목', 'text'), C('basis', '산출 근거', 'area'), C('amount', '금액(원)', 'num', { w: '130px', sum: true })], { minRows: 4, hint: '인건비(기회비용 포함) · 외주(아트·사운드·번역) · 에셋 · 장비 · 소프트웨어 · 마케팅 · 행사 참가비 · 등록비' }),
        F.num('price', '판매가', { unit: '원', w: 'half', ph: '예: 15500' }), F.num('feePct', '플랫폼 수수료', { unit: '%', w: 'half', ph: '30', def: '' }),
        F.calc('indieBEP'),
        F.sel('funding', '자금 조달', ['자비', '정부 · 기관 지원사업', '퍼블리셔 계약', '크라우드펀딩', '복합'], { w: 'half' }),
        F.area('fundingNote', '조달 계획 상세', { rows: 2, w: 'half' }),
      ],
    },
    {
      id: 'launch', title: '출시 & 마케팅', desc: '인디게임 마케팅은 출시일이 아니라 스토어 페이지 공개일부터 시작됩니다.',
      guide: ['<b>확률형 아이템</b>: 게임산업진흥법 시행령 개정으로 2024년 3월 22일부터 확률형 아이템의 종류 · 확률 정보를 게임 내 · 홈페이지 · 광고물에 표시해야 합니다. 최근 3년 연평균 매출 1억 원 이하 사업자 등 일부는 예외입니다. <span class="src">— 문화체육관광부 발표(2024.1)</span>',
        '<b>등급분류</b>: 국내 유통 게임은 게임물관리위원회 등급분류 또는 자체등급분류사업자(오픈마켓)를 통한 분류가 필요합니다. 출시 플랫폼이 어떤 방식인지 미리 확인하세요.'],
      fields: [
        F.sel('store', '주 출시 스토어', ['Steam', 'STOVE', 'itch.io', 'Google Play', 'App Store', 'Meta Horizon Store', '콘솔 스토어', '복수 스토어'], { w: 'half' }),
        F.text('launchWindow', '목표 출시 시기', { w: 'half', ph: '예: 2027년 2분기, 데모는 Next Fest 6월 참가' }),
        F.check('launchCk', '출시 준비 체크리스트', ['스토어 페이지 ‘출시 예정’ 공개 (스팀 최소 2주)', '캡슐 이미지 · 스크린샷 · 트레일러', '플레이 가능한 데모', '페스티벌 · 행사 참가 (Next Fest, BIC, 지스타 인디 등)', '게임물 등급분류 방식 확인', '확률형 아이템 포함 시 확률 표시 검토', '지원 언어 · 현지화 범위 결정', '가격 · 지역별 가격 · 출시 할인', '커뮤니티 채널 (디스코드 등)', '보도자료 · 스트리머 · 미디어 목록', '출시 후 1개월 패치 계획']),
        F.area('marketing', '마케팅 계획', { rows: 4, ph: '채널별 계획: SNS(짧은 GIF), 스트리머 키 배포, 페스티벌, 커뮤니티 운영 주기' }),
        F.text('wishlistGoal', '출시 시점 목표 위시리스트', { w: 'half', ph: '목표치와 근거를 함께' }),
        F.text('languages', '지원 언어', { w: 'half', ph: '예: 한국어, 영어, 일본어, 중국어(간체)' }),
      ],
    },
    { id: 'art', title: '아트 & 사운드', desc: '팀 전원이 같은 그림을 그릴 수 있을 만큼 구체적으로.', fields: [F.area('art', '아트 디렉션', { rows: 4, ph: '스타일 · 팔레트 · 카메라 · 해상도 · 레퍼런스 이미지 링크' }), ...G.sound()] },
    G.vr(),
    { id: 'risk', title: '리스크', desc: '영향 × 가능성이 큰 것부터 대응책을 적습니다.', fields: [G.risks()] },
  ],
  checks(v) {
    const o = [];
    const comps = tableRows(v.comps); if (comps.length < 3) o.push({ lvl: 'warn', msg: `비교작이 ${comps.length}개입니다. 기대치를 잡으려면 5개 이상 권장합니다.`, sec: 'market' });
    if (comps.length && !comps.some(r => isFinite(num(r.reviews)))) o.push({ lvl: 'warn', msg: '비교작 리뷰 수가 비어 있어 판매량 추정이 불가능합니다.', sec: 'market' });
    const c = calcResult('capacity', v);
    const feats = tableRows(v.features); const must = feats.filter(r => String(r.moscow).startsWith('Must'));
    if (feats.length && must.length / feats.length > .6) o.push({ lvl: 'warn', msg: `기능 ${feats.length}개 중 Must가 ${must.length}개입니다. Must가 많으면 우선순위가 없는 것과 같습니다.`, sec: 'scope' });
    if (!tableRows(v.milestones).some(r => r.phase === '출시')) o.push({ lvl: 'warn', msg: '마일스톤에 ‘출시’ 단계가 없습니다.', sec: 'schedule' });
    if (colSum(v.budget, 'amount') <= 0) o.push({ lvl: 'warn', msg: '예산이 0원입니다. 인건비는 기회비용으로라도 넣어 보세요.', sec: 'budget' });
    if (tableRows(v.risks).length < 3) o.push({ lvl: 'warn', msg: '리스크가 3개 미만입니다. 일정 · 기술 · 시장 · 팀 리스크를 각각 검토하세요.', sec: 'risk' });
    return o;
  },
});

/* ─── 3) 졸업작품 기획서 ─── */
registerTemplate({
  id: 'game-capstone', tool: 'game', name: '졸업작품 기획서', icon: '🎓', tag: '학기 · 전시', titleKey: 'title',
  desc: '학기 일정 · 팀 역할 · 평가 기준 · <b>전시 시연</b>이 핵심입니다. 상업성보다 “정해진 기간 안에 완성해 처음 보는 사람에게 시연할 수 있는가”를 증명합니다.',
  meta: [['대상', '졸업작품 · 캡스톤 · 학기 프로젝트'], ['분량', '중간 · 최종 발표 기준 10~15쪽'], ['핵심 질문', '기간 안에 완성해 시연할 수 있는가?']],
  personas: ['prof', 'dev', 'planner', 'art', 'player'],
  aiContext: '대학 졸업작품 기획서다. 상업성보다 학기 일정 내 완성 가능성, 팀 역할 분담, 기획 의도의 증명, 전시 시연 안정성을 중심으로 보라.',
  sections: [
    {
      id: 'overview', title: '프로젝트 개요', desc: '왜 이 게임을 졸업작품으로 만드는지 — 무엇을 증명하고 싶은지부터 적습니다.',
      guide: ['심사위원은 결과물을 보며 “기획 의도가 실제로 구현됐는가”를 확인합니다. 의도는 측정 · 관찰할 수 있게 쓰세요. ✕ “몰입감 있는 협동” → ○ “두 사람이 대화하지 않으면 클리어할 수 없는 구조”.',
        '포트폴리오 관점에서 이 작품이 각 팀원의 무엇(기술 · 연출 · 디자인 역량)을 보여주는지도 정리해두면 이후 취업 · 진학 자료로 바로 쓸 수 있습니다.'],
      fields: [
        F.text('title', '작품 제목 (가제)', { req: true, w: 'half' }), F.sel('genre', '장르', G.GENRES, { req: true, w: 'half' }),
        F.sel('platform', '플랫폼', G.PLATFORMS, { req: true, w: 'third' }), F.sel('players', '플레이 인원', G.PLAYERS, { w: 'third' }), F.sel('engine', '엔진', G.ENGINES, { w: 'third' }),
        F.text('period', '제작 기간', { w: 'half', ph: '예: 3학년 2학기 ~ 4학년 1학기 (2학기)' }), F.text('device', '시연 기기', { w: 'half', ph: '예: Meta Quest 3 × 2대 / 게이밍 노트북' }),
        F.area('pitch', '한 줄 소개', { req: true, rows: 2, count: 'chars', max: 80 }),
        F.area('intent', '기획 의도 — 이 작품으로 증명할 것', { req: true, rows: 4, ph: '1) 게임 디자인: 두 사람의 정보 비대칭으로 대화를 강제하는 구조\n2) 기술: Unity Netcode 기반 2인 동기화\n3) 연출: …' }),
        G.aesthetics(),
        G.refs(),
      ],
    },
    {
      id: 'team', title: '팀 & 역할 (R&R)', desc: '누가 무엇을 끝까지 책임지는지 명확히 합니다. 겹치는 담당은 갈등의 원인이 됩니다.',
      guide: ['역할마다 <b>주 담당 1명</b>을 둡니다. “같이 한다”는 담당자가 없는 것과 같습니다.',
        '‘주당 가용 시간’은 수업 · 아르바이트 · 다른 과제를 뺀 현실적인 수치로 적고, 시험 기간 · 방학 · 축제 주간은 ‘실제 개발 주 수’에서 빼세요.'],
      fields: [
        F.table('team', '팀 구성', [C('name', '이름', 'text', { w: '90px' }), C('role', '역할', 'sel', { o: ['기획 · PM', '프로그래밍', '네트워크 · 서버', '2D 아트', '3D 모델링', '애니메이션', 'UI · UX', '사운드', '레벨 디자인', 'QA'], w: '130px' }), C('main', '주 담당 업무', 'area'), C('sub', '보조 업무', 'area'), C('hours', '주당 시간', 'num', { w: '80px', sum: true })], { minRows: 3 }),
        F.num('devWeeks', '실제 개발 주 수', { unit: '주', w: 'half', ph: '예: 26' }), F.num('bufferPct', '일정 버퍼', { unit: '%', w: 'half', ph: '20' }),
        F.calc('capacity'),
        F.area('collab', '협업 규칙 · 도구', { rows: 3, ph: '예: Git + LFS(main 직접 푸시 금지, 기능별 브랜치), 주 1회 정기 회의(월 20시), Notion 칸반, 디스코드 일일 진행 공유' }),
      ],
    },
    {
      id: 'gameplay', title: '핵심 게임플레이', desc: '처음 보는 사람이 짧은 설명만 듣고 바로 할 수 있는 수준으로 규칙을 정리합니다.',
      fields: [
        F.area('coreLoop', '코어 루프', { req: true, rows: 2 }),
        F.area('rules', '승패 · 클리어 규칙', { req: true, rows: 3 }),
        F.area('controls', '조작', { req: true, rows: 3, w: 'half' }),
        F.area('onboarding', '처음 보는 사람이 규칙을 이해하는 방법', { rows: 3, w: 'half', ph: '인게임 튜토리얼 / 첫 구간에서 자연스럽게 학습 / 스태프 설명 / 조작 안내 카드' }),
        F.cards('mechanics', '핵심 시스템', [
          F.text('name', '시스템 이름', { w: 'twothird', req: true }), F.sel('moscow', 'MoSCoW', G.MOSCOW, { w: 'third' }),
          F.area('action', '플레이어 행동', { w: 'third' }), F.area('reaction', '게임 반응 · 규칙', { w: 'third' }), F.area('feedback', '피드백 (연출 · 사운드)', { w: 'third' }),
          F.text('owner', '구현 담당', { w: 'half' }), F.text('verify', '검증 방법', { w: 'half', ph: '예: 2차 플레이테스트에서 확인' }),
        ], { addLabel: '시스템 추가', idxLabel: 'SYS ', tags: ['moscow', 'owner'] }),
      ],
    },
    {
      id: 'scope', title: '범위 (MoSCoW)', desc: '팀 가용량을 넘는 범위는 완성도를 떨어뜨립니다. 전시 시연에 꼭 필요한 것부터 확정합니다.',
      guide: ['Must는 “이것 없이는 시연 자체가 안 되는 것”으로만 한정하세요. 앞 섹션의 가용량 계산기가 Must 작업량이 가용량의 60%를 넘으면 경고합니다.',
        '네트워크 멀티플레이 · VR 인터랙션 · 물리 기반 조작처럼 <b>기술 불확실성이 큰 요소는 첫 4~6주 안에</b> 최소 프로토타입으로 검증해야 일정 전체가 무너지지 않습니다.'],
      fields: [
        F.table('features', '기능 목록', [C('feat', '기능', 'area'), C('moscow', 'MoSCoW', 'sel', { o: G.MOSCOW, w: '90px' }), C('owner', '담당', 'text', { w: '80px' }), C('est', '예상(인·주)', 'num', { w: '90px', sum: true }), C('status', '상태', 'sel', { o: ['예정', '진행', '완료', '보류', '삭제'], w: '80px' })], { minRows: 4 }),
        F.area('cutList', '만들지 않기로 한 것', { rows: 2 }),
        F.area('protoCheck', '기술 리스크 조기 검증 계획', { rows: 3, ph: '예: 2주차까지 Netcode로 두 플레이어 위치 동기화 확인, 4주차까지 Quest 3 두 대 로컬 연결 테스트' }),
      ],
    },
    {
      id: 'schedule', title: '일정', desc: '학사 일정(중간 · 최종 발표, 전시)을 기준으로 거꾸로 계획합니다.',
      fields: [
        F.date('midDate', '중간 발표', { w: 'third' }), F.date('finalDate', '최종 발표 · 심사', { w: 'third' }), F.date('exhibitDate', '졸업 전시', { w: 'third' }),
        F.table('weekly', '주차별 계획', [C('week', '주차 · 기간', 'text', { w: '110px' }), C('goal', '목표', 'area'), C('output', '산출물 (확인 가능한 결과)', 'area'), C('owner', '담당', 'text', { w: '80px' }), C('status', '상태', 'sel', { o: ['예정', '진행', '완료', '지연'], w: '80px' })], { minRows: 4 }),
        F.note('전시 2~3주 전부터는 <b>기능 동결(feature freeze)</b>하고 버그 수정 · 시연 안정화만 하는 기간으로 잡는 것이 안전합니다.', 'tip'),
      ],
    },
    {
      id: 'exhibit', title: '전시 & 시연 설계', desc: '졸업작품의 첫인상은 전시장에서 결정됩니다. 줄 선 관람객 기준으로 운영을 설계합니다.',
      guide: ['처음 보는 관람객은 긴 설명을 듣지 않습니다. 설명은 <b>조작 1장 + 목표 1문장</b>으로 줄이고 나머지는 게임 안에서 가르치세요.',
        '전시장 와이파이에 의존하지 마세요. 멀티플레이라면 로컬 네트워크(전용 공유기)나 오프라인 동작을 준비합니다.'],
      fields: [
        F.num('explainMin', '설명 시간', { unit: '분', w: 'third', ph: '3' }), F.num('playMin', '1판 플레이 시간', { unit: '분', w: 'third', ph: '8' }), F.num('resetMin', '리셋 · 장비 착용', { unit: '분', w: 'third', ph: '2' }),
        F.num('stations', '시연 세트 수', { unit: '세트', w: 'third', ph: '1' }), F.num('perSession', '판당 인원', { unit: '명', w: 'third', ph: '2' }), F.num('hours', '하루 운영 시간', { unit: '시간', w: 'third', ph: '6' }),
        F.calc('booth'),
        F.area('demoFlow', '시연 흐름', { rows: 4, ph: '1) 대기열에서 트레일러 시청 → 2) 조작 카드 30초 → 3) 장비 착용 → 4) 튜토리얼 구간 1분 → 5) 본 게임 → 6) 결과 화면 + 설문 QR' }),
        F.area('staffScript', '스태프 설명 스크립트', { rows: 3, w: 'half', ph: '실제로 읽을 문장 그대로' }),
        F.check('boothCk', '시연 준비 체크리스트', ['대기 화면용 트레일러 · 어트랙트 모드', '원클릭 재시작 · 리셋 기능', '크래시 시 복구 절차 (스태프용)', '시연 빌드 버전 고정 · 백업 빌드', '오프라인 · 로컬 네트워크 동작', '기기 충전 · 교대 계획', '장비 위생 (VR 페이스 커버 등)', '포스터 · 조작 안내 카드 · QR', '관람객 설문 수집 방법'], { w: 'half' }),
      ],
    },
    {
      id: 'playtest', title: '플레이테스트 & 평가', desc: '평가 기준표를 받아 그대로 옮기고, 항목마다 “무엇으로 증명할지”를 연결합니다.',
      guide: ['플레이테스트는 회차마다 <b>검증 질문 1~2개</b>를 정해두고 관찰합니다. 테스트 중에는 설명·변명하지 말고 막히는 지점을 기록하세요.',
        '사용성을 수치로 보이고 싶다면 SUS(System Usability Scale, Brooke 1996: 10문항, 0~100점, 평균은 약 68점으로 알려짐) 같은 검증된 설문을 쓰면 발표 · 논문에서 근거로 활용할 수 있습니다.'],
      fields: [
        F.table('playtests', '플레이테스트 계획 · 결과', [C('no', '회차', 'text', { w: '50px' }), C('date', '날짜', 'date', { w: '130px' }), C('who', '대상 · 인원', 'text', { w: '110px' }), C('q', '검증 질문', 'area'), C('result', '결과 · 조치', 'area')], { minRows: 3 }),
        F.table('evalMap', '평가 기준 대응표', [C('crit', '평가 항목 (학과 기준표)', 'area'), C('weight', '배점', 'text', { w: '60px' }), C('evidence', '우리 작품의 증거 · 보여줄 장면', 'area')], { minRows: 3 }),
      ],
    },
    {
      id: 'art', title: '아트 · 사운드 & 에셋', desc: '아트 작업량은 에셋 목록으로 관리해야 보입니다.',
      fields: [
        F.area('art', '아트 디렉션', { rows: 3 }),
        F.table('assets', '에셋 목록', [C('asset', '에셋', 'text'), C('kind', '종류', 'sel', { o: ['캐릭터', '환경 · 소품', '이펙트', 'UI', '애니메이션', '사운드', '외부 에셋'], w: '110px' }), C('owner', '담당', 'text', { w: '80px' }), C('qty', '수량', 'num', { w: '60px', sum: true }), C('license', '출처 · 라이선스', 'text'), C('status', '상태', 'sel', { o: ['예정', '진행', '완료'], w: '80px' })], { minRows: 3, hint: '외부(무료 · 유료) 에셋은 출처와 라이선스를 반드시 기록하세요. 졸업 전시 · 공모전 · 이후 출시에서 문제가 될 수 있습니다.' }),
        ...G.sound(),
      ],
    },
    G.vr(),
    {
      id: 'deliver', title: '산출물 & 리스크', desc: '최종 제출물과 프로젝트를 위협하는 요소를 정리합니다.',
      fields: [
        F.check('deliverCk', '최종 산출물', ['실행 빌드 (+ 백업 빌드)', '플레이 영상 (1~2분)', '발표 자료', '포스터', '최종 기획서', '정리된 저장소 · README', '팀원별 기여 내역', '설문 · 플레이테스트 결과 정리']),
        F.area('portfolio', '팀원별 포트폴리오 포인트', { rows: 3, ph: '예: 강OO — Netcode 동기화 구조 설계 및 구현, 지연 보정 / 이OO — 캐릭터 모델링 · 리깅 12종' }),
        G.risks(),
        F.check('riskCk', '자주 터지는 리스크 점검', ['팀원 휴학 · 이탈 시 인수인계 방법', '외부 에셋 라이선스 확인', '시연 기기 확보 (대여 · 고장 대비)', '전시장 네트워크 의존 제거', '빌드 · 저장소 백업', '마감 직전 대규모 기능 추가 금지']),
      ],
    },
  ],
  checks(v) {
    const o = [];
    const c = calcResult('capacity', v);
    const mk = c?.kpis?.find(k => k.l === 'Must 작업량');
    if (mk && mk.lvl === 'err') o.push({ lvl: 'err', msg: 'Must 작업량이 팀 가용량을 넘습니다. 범위를 줄이지 않으면 완성이 어렵습니다.', sec: 'scope' });
    else if (mk && mk.lvl === 'warn') o.push({ lvl: 'warn', msg: 'Must 작업량이 가용량의 60%를 넘습니다. 일정 지연 시 대응할 여유가 부족합니다.', sec: 'scope' });
    const team = tableRows(v.team); if (team.length && team.some(r => !r.main)) o.push({ lvl: 'warn', msg: '주 담당 업무가 비어 있는 팀원이 있습니다.', sec: 'team' });
    if (!v.exhibitDate && !v.finalDate) o.push({ lvl: 'warn', msg: '최종 발표 · 전시 날짜가 없습니다. 일정은 마감일에서 거꾸로 짜야 합니다.', sec: 'schedule' });
    if (tableRows(v.weekly).length < 4) o.push({ lvl: 'warn', msg: '주차별 계획이 4행 미만입니다.', sec: 'schedule' });
    if (!tableRows(v.playtests).length) o.push({ lvl: 'warn', msg: '플레이테스트 계획이 없습니다. 최소 2회(프로토타입 · 전시 전)를 권장합니다.', sec: 'playtest' });
    if (!tableRows(v.evalMap).length) o.push({ lvl: 'warn', msg: '평가 기준 대응표가 비어 있습니다. 학과 평가표를 받아 옮겨 두세요.', sec: 'playtest' });
    if (tableRows(v.assets).some(r => r.kind === '외부 에셋' && !r.license)) o.push({ lvl: 'err', msg: '라이선스가 기록되지 않은 외부 에셋이 있습니다.', sec: 'art' });
    return o;
  },
});

/* ─── 4) 실무 기획서 ─── */
registerTemplate({
  id: 'game-industry', tool: 'game', name: '실무 기획서', icon: '▣', tag: '상용 · 팀 개발', titleKey: 'title',
  desc: '회사 · 상용 프로젝트 기준. 컨셉 문서에 <b>시스템 명세 · 데이터 테이블 · UI 화면 목록 · 경제/BM · 라이브 지표 · QA</b>까지 담아 “개발자와 QA가 이 문서만 보고 일할 수 있는가”를 기준으로 씁니다.',
  meta: [['대상', '게임사 · 상용 프로젝트 · 기획 직무 포트폴리오'], ['분량', '컨셉 + 시스템별 명세 (분량 가변)'], ['핵심 질문', '개발자가 이 문서만 보고 구현 · 검수할 수 있는가?']],
  personas: ['planner', 'qa', 'dev', 'market', 'art'],
  aiContext: '실무(상용) 게임 기획서다. 명세의 구현 가능성 · 모호성 · 예외 처리 · 데이터 정의 · BM 법규 준수를 엄격하게 보라.',
  sections: [
    {
      id: 'docinfo', title: '문서 관리', desc: '실무 문서는 여러 사람이 동시에 참조합니다. 담당자 · 상태 · 변경 이력이 없으면 어느 버전이 맞는지 알 수 없습니다.',
      fields: [
        F.text('docOwner', '문서 담당자', { w: 'third' }), F.text('reviewers', '리뷰어', { w: 'third', ph: '예: 리드 기획, 클라 리드, QA' }), F.sel('docStatus', '문서 상태', ['초안', '리뷰 중', '확정', '개발 반영 완료', '폐기'], { w: 'third' }),
        F.area('related', '관련 문서 · 링크', { rows: 2, ph: '데이터 시트, 피그마, 지라 에픽 링크' }),
        F.table('changelog', '변경 이력', [C('ver', '버전', 'text', { w: '70px' }), C('date', '날짜', 'date', { w: '130px' }), C('change', '변경 내용', 'area'), C('author', '작성자', 'text', { w: '80px' })], { minRows: 1 }),
      ],
    },
    {
      id: 'concept', title: '컨셉', desc: '이 게임을 왜 만들고, 누구에게, 어떤 재미를 주는지. 이후 모든 시스템 결정의 근거가 됩니다.',
      fields: [
        F.text('title', '프로젝트명', { req: true, w: 'half' }), F.sel('genre', '장르', G.GENRES, { req: true, w: 'half' }),
        F.sel('platform', '플랫폼', G.PLATFORMS, { req: true, w: 'third' }), F.sel('bm', '비즈니스 모델', ['패키지 (유료 판매)', 'F2P + 인앱결제', 'F2P + 광고', 'F2P + 인앱결제 + 광고', '구독', '유료 + DLC · 시즌패스'], { req: true, w: 'third' }), F.sel('engine', '엔진', G.ENGINES, { w: 'third' }),
        F.area('pitch', '한 줄 소개', { req: true, rows: 2, count: 'chars', max: 80 }),
        F.area('audience', '타깃 유저', { req: true, rows: 2, ph: '플레이 성향 · 즐기는 게임 · 플레이 시간대/기기 · 과금 성향' }),
        F.area('intent', '기획 의도', { req: true, rows: 3 }),
        F.area('coreFun', '핵심 재미', { req: true, rows: 3, w: 'half' }), F.area('usp', 'USP (경쟁작 대비 차별점)', { rows: 3, w: 'half' }),
        F.table('comps', '경쟁작 분석', [C('name', '경쟁작', 'text', { w: '18%' }), C('sys', '핵심 시스템 · 루프', 'area'), C('bm', 'BM', 'text', { w: '110px' }), C('diff', '우리와의 차이', 'area')], { minRows: 2 }),
      ],
    },
    {
      id: 'structure', title: '게임 구조', desc: '분 단위 코어 루프, 일 · 주 단위 메타 루프, 장기 성장 구조를 구분합니다.',
      fields: [
        F.area('coreLoop', '코어 루프', { req: true, rows: 2 }), F.area('metaLoop', '메타 루프', { req: true, rows: 3 }),
        F.area('progression', '성장 구조', { rows: 3, ph: '레벨 · 장비 · 스킬 트리 · 수집 — 각 성장 축의 상한과 소요 기간' }),
        F.area('session', '세션 설계', { rows: 2, w: 'half', ph: '예: 1회 10~15분, 하루 3회 접속 가정' }), F.area('modes', '모드 구성', { rows: 2, w: 'half' }),
      ],
    },
    {
      id: 'systems', title: '시스템 명세', desc: '시스템마다 하나의 카드. 실무 시스템 기획서의 기본 흐름(목적 → 용어 → 규칙 → 데이터 → 예외 → UI → 리소스 → 검수)을 따릅니다.',
      guide: ['<b>규칙</b>은 조건문 수준으로: “~하면 ~한다”, “단, ~인 경우 ~”. “적당히”, “자연스럽게” 같은 표현은 구현자가 해석해야 하므로 수치나 조건으로 바꿉니다.',
        '<b>예외 처리</b>는 분기가 생기는 모든 곳에 적습니다: 재화 부족, 인벤토리 가득 참, 네트워크 끊김 · 재접속, 중복 입력(연타), 경계값(0, 최대치), 동시 발생, 서버 · 클라이언트 불일치.',
        '<b>검수 기준</b>은 QA가 그대로 테스트 케이스로 옮길 수 있는 문장이어야 합니다.'],
      fields: [
        F.cards('systems', '시스템', [
          F.text('name', '시스템명', { req: true, w: 'half' }), F.text('sysId', '시스템 ID', { w: 'third', ph: 'SYS_INVEN' }), F.text('owner', '담당', { w: 'third' }),
          F.sel('prio', '우선순위', ['P0 (필수)', 'P1 (중요)', 'P2 (차기)'], { w: 'third' }), F.sel('status', '상태', ['기획중', '리뷰', '개발중', '검수', '완료', '보류', '폐기'], { w: 'third' }),
          F.area('purpose', '목적 · 기획 의도', { req: true, rows: 2 }),
          F.area('terms', '용어 정의', { rows: 2, ph: '예: 슬롯 — 아이템 1종을 보관하는 칸. 스택 — 한 슬롯에 겹칠 수 있는 최대 수량' }),
          F.area('rules', '규칙 · 로직', { req: true, rows: 6, ph: '1. 플레이어가 아이템을 획득하면 동일 ID 슬롯을 먼저 찾는다.\n2. 스택 여유가 있으면 합친다. 없으면 빈 슬롯에 넣는다.\n3. 빈 슬롯이 없으면 → 예외 E1' }),
          F.area('data', '사용 데이터 · 수치', { rows: 3, w: 'half', ph: '참조 테이블과 컬럼, 기본값, 범위' }),
          F.area('exceptions', '예외 처리', { req: true, rows: 3, w: 'half', ph: 'E1. 인벤토리 가득 참 → 우편함으로 발송 + 토스트 “가방이 가득 찼습니다”\nE2. 획득 중 연결 끊김 → 서버 기준으로 지급, 재접속 시 동기화' }),
          F.area('ui', '연결 화면 (화면 ID)', { rows: 2, w: 'half' }), F.area('resources', '리소스 요청 (아트 · 연출 · 사운드)', { rows: 2, w: 'half' }),
          F.area('qa', '검수 기준', { rows: 3, ph: '- 슬롯 99개 상태에서 획득 시 우편함으로 발송되는가\n- 스택 최대치 경계(98/99/100)에서 정상 처리되는가' }),
        ], { addLabel: '시스템 추가', idxLabel: 'SYS ', tags: ['prio', 'status'] }),
      ],
    },
    {
      id: 'data', title: '데이터 테이블 정의', desc: '기획 데이터는 시트 → 클라이언트 테이블로 들어갑니다. 컬럼 정의가 곧 구현 명세입니다.',
      fields: [
        F.table('dataTables', '테이블 · 컬럼 정의', [C('tbl', '테이블', 'text', { w: '120px' }), C('col', '컬럼', 'text', { w: '120px' }), C('type', '타입', 'sel', { o: ['int', 'float', 'string', 'bool', 'enum', 'ID 참조', 'datetime', 'array'], w: '100px' }), C('key', 'PK/FK', 'sel', { o: ['PK', 'FK', ''], w: '70px' }), C('desc', '설명 · 범위 · 참조', 'area')], { minRows: 4 }),
        F.area('dataRules', '데이터 작성 규칙', { rows: 2, ph: '예: ID 체계(1xxxx 아이템, 2xxxx 몬스터), 확률은 만분율(10000=100%) 정수 사용, 시간은 초 단위' }),
      ],
    },
    {
      id: 'content', title: '콘텐츠 & 레벨', desc: '무엇이 얼마나 있는지(분량)와 언제 열리는지(해금)를 함께 관리합니다.',
      fields: [
        F.table('contents', '콘텐츠 목록', [C('name', '콘텐츠', 'text', { w: '20%' }), C('kind', '유형', 'sel', { o: ['스테이지', '던전', '퀘스트', '이벤트', '보스', '모드', '캐릭터', '아이템군'], w: '100px' }), C('unlock', '해금 조건', 'text'), C('reward', '보상', 'text'), C('volume', '분량 · 상세', 'area')], { minRows: 3 }),
        F.area('levelPrinciple', '레벨 디자인 원칙', { rows: 3, ph: '유도(시선 · 동선 유도) → 학습(안전한 환경에서 규칙 습득) → 응용(배운 규칙의 변형 조합)' }),
        F.area('difficulty', '난이도 곡선', { rows: 3, w: 'half' }), F.area('world', '세계관 · 스토리 요약', { rows: 3, w: 'half' }),
        F.area('characters', '캐릭터', { rows: 3 }),
      ],
    },
    {
      id: 'ui', title: 'UI / UX', desc: '화면마다 ID를 붙여 시스템 명세 · 아트 요청 · QA가 같은 화면을 가리키게 합니다.',
      fields: [
        F.table('screens', '화면 목록', [C('sid', '화면 ID', 'text', { w: '90px' }), C('name', '화면명', 'text', { w: '120px' }), C('entry', '진입 경로', 'text'), C('elems', '주요 구성 요소', 'area'), C('sys', '연결 시스템', 'text', { w: '110px' })], { minRows: 3 }),
        F.area('uiFlow', '화면 흐름', { rows: 3, ph: '타이틀 → 로비 → (모드 선택) → 매칭 → 인게임 → 결과 → 로비' }),
        F.area('hud', '인게임 HUD', { rows: 3, w: 'half' }), F.area('a11y', '접근성', { rows: 3, w: 'half', ph: '색약 대응(색 외 형태 구분), 자막 · 크기 조절, 키 리매핑, 화면 흔들림 끄기' }),
      ],
    },
    {
      id: 'economy', title: '경제 & BM', desc: '재화마다 획득처(Source)와 소모처(Sink)를 짝지어 인플레이션을 관리하고, 과금 상품의 법적 고지 의무를 확인합니다.',
      guide: ['재화가 들어오는 곳만 있고 나가는 곳이 없으면 재화 가치가 떨어집니다(인플레이션). 재화별로 하루 평균 획득량 · 소모량을 추정해 두세요.',
        '<b>확률형 아이템 정보 표시 의무</b>: 2024년 3월 22일부터 게임 내 · 홈페이지 · 광고물에 확률형 아이템의 종류와 확률을 표시해야 하며, 확률은 백분율로 표기하고 변경 시 사전 공지해야 합니다. <span class="src">— 게임산업진흥법 시행령 개정, 문화체육관광부(2024.1)</span>',
        '정확한 표시 방법 · 예외 대상은 시행령 별표와 문체부 고시를 기준으로 법무 검토를 받으세요. 이 도구의 체크리스트는 누락 방지용입니다.'],
      fields: [
        F.table('currencies', '재화', [C('name', '재화', 'text', { w: '100px' }), C('kind', '유형', 'sel', { o: ['소프트 (무료)', '하드 (유료)', '이벤트 한정', '시즌 한정'], w: '120px' }), C('source', '획득처 (Source)', 'area'), C('sink', '소모처 (Sink)', 'area'), C('cap', '보유 상한', 'text', { w: '80px' })], { minRows: 2 }),
        F.area('econNote', '경제 설계 메모', { rows: 2 }),
        F.table('products', '판매 상품', [C('name', '상품', 'text'), C('price', '가격', 'text', { w: '90px' }), C('items', '구성', 'area'), C('limit', '구매 제한', 'text', { w: '100px' })], { minRows: 1 }),
        F.table('gacha', '확률형 상품 확률표', [C('pool', '상품 · 풀', 'text', { w: '120px' }), C('item', '아이템', 'text'), C('grade', '등급', 'text', { w: '80px' }), C('rate', '확률(%)', 'num', { w: '90px', sum: true })], { minRows: 1 }),
        F.calc('gacha'),
        F.check('bmCk', 'BM 고지 · 정책 체크', ['확률 정보 게임 내 표시', '확률 정보 홈페이지 표시', '광고 · 홍보물 확률 표시', '확률 변경 시 사전 공지 절차', '청약철회(환불) 가능 여부 고지', '연령 등급별 결제 정책 확인', '천장 · 보장 시스템 명세']),
      ],
    },
    {
      id: 'live', title: '라이브 운영 & 지표', desc: '출시 후 무엇을 보고 판단할지 미리 정의해야, 그 데이터를 남기는 로그를 개발 단계에서 심을 수 있습니다.',
      guide: ['대표 지표 정의: <b>DAU/MAU</b>(일/월 순 이용자), <b>리텐션 D1·D7·D30</b>(설치 후 N일차에 다시 접속한 비율), <b>ARPDAU</b>(일 매출 ÷ DAU), <b>ARPPU</b>(매출 ÷ 결제 이용자), <b>PUR</b>(결제 이용자 비율).',
        '목표 수치는 장르 · 플랫폼 · 지역에 따라 크게 다릅니다. 출처가 있는 업계 리포트나 자사 이전 작품 데이터를 근거로 적으세요.'],
      fields: [
        F.table('kpis', '핵심 지표', [C('metric', '지표', 'text', { w: '110px' }), C('def', '정의 · 계산식', 'area'), C('target', '목표 · 근거', 'area'), C('tool', '측정 도구', 'text', { w: '110px' })], { minRows: 3 }),
        F.table('logs', '로그 이벤트 설계', [C('ev', '이벤트명', 'text', { w: '140px' }), C('when', '발생 시점', 'text'), C('params', '파라미터', 'area')], { minRows: 2 }),
        F.area('liveops', '라이브 운영 계획', { rows: 3, ph: '업데이트 주기, 시즌 · 이벤트 캘린더, 공지 · CS 대응 체계' }),
      ],
    },
    {
      id: 'tech', title: '기술 · 품질 요구사항', desc: '최소 사양 · 성능 목표 · 저장 방식 · 현지화 등 비기능 요구사항을 명시합니다.',
      fields: [
        F.area('tech', '기술 요구사항', { rows: 4, ph: '최소 · 권장 사양, 목표 FPS, 서버 구조(P2P/전용 서버), 저장(로컬/클라우드), 빌드 용량 제한' }),
        F.area('l10n', '현지화', { rows: 2, w: 'half' }), F.area('legal', '법 · 정책', { rows: 2, w: 'half', ph: '개인정보 수집 항목, 등급분류 일정, 오픈소스 라이선스' }),
        F.check('qaCk', '문서 완결성 체크', ['모든 P0 시스템에 예외 처리 명세', '모든 시스템에 검수 기준', '데이터 테이블 PK 중복 없음', '화면 ID ↔ 시스템 매핑 완료', '핵심 지표별 로그 이벤트 정의', '리소스 요청 목록 아트 · 사운드팀 공유', '등급분류 · 법무 검토 일정 확인']),
      ],
    },
    { id: 'sound', title: '사운드', desc: '', fields: G.sound() },
    G.vr(),
  ],
  checks(v) {
    const o = [];
    const sys = (v.systems || []).filter(r => r && Object.values(r).some(Boolean) && r.status !== '폐기');
    sys.forEach((s, i) => {
      const n = s.name || `${i + 1}번 시스템`;
      if (!s.purpose) o.push({ lvl: 'warn', msg: `‘${esc(n)}’ — 목적 · 기획 의도 없음`, sec: 'systems' });
      if (!s.rules) o.push({ lvl: 'err', msg: `‘${esc(n)}’ — 규칙 · 로직 없음`, sec: 'systems' });
      if (!s.exceptions) o.push({ lvl: 'err', msg: `‘${esc(n)}’ — 예외 처리 없음`, sec: 'systems' });
      if (!s.qa) o.push({ lvl: 'warn', msg: `‘${esc(n)}’ — 검수 기준 없음`, sec: 'systems' });
      if (/적당|자연스럽|적절|알맞게|어느 정도/.test(s.rules || '')) o.push({ lvl: 'warn', msg: `‘${esc(n)}’ 규칙에 해석이 필요한 표현(적당히 · 자연스럽게 등)이 있습니다. 수치나 조건으로 바꾸세요.`, sec: 'systems' });
    });
    if (!sys.length) o.push({ lvl: 'err', msg: '시스템 명세가 없습니다.', sec: 'systems' });
    const g = calcResult('gacha', v); if (g?.kpis?.[0]?.lvl === 'err') o.push({ lvl: 'err', msg: '확률표 합계가 100%가 아닙니다.', sec: 'economy' });
    if (tableRows(v.gacha).length && !(v.bmCk || []).length) o.push({ lvl: 'warn', msg: '확률형 상품이 있지만 고지 체크리스트가 비어 있습니다.', sec: 'economy' });
    if (/F2P/.test(v.bm || '') && tableRows(v.kpis).length < 3) o.push({ lvl: 'warn', msg: 'F2P 게임인데 핵심 지표 정의가 3개 미만입니다.', sec: 'live' });
    if (!tableRows(v.changelog).length) o.push({ lvl: 'warn', msg: '변경 이력이 비어 있습니다.', sec: 'docinfo' });
    const pks = tableRows(v.dataTables).filter(r => r.key === 'PK').map(r => (r.tbl || '') + '.' + (r.col || ''));
    if (new Set(pks).size !== pks.length) o.push({ lvl: 'err', msg: '데이터 테이블에 중복된 PK 정의가 있습니다.', sec: 'data' });
    return o;
  },
});

/* ─── 5) 시스템 기획서 (단일 시스템) ─── */
registerTemplate({
  id: 'game-system', tool: 'game', name: '시스템 기획서', icon: '⚙', tag: '실무 단위 문서', titleKey: 'sysName',
  desc: '실무 기획자가 가장 자주 쓰는 문서 — <b>시스템 하나</b>를 개발 · 아트 · QA에 넘길 수 있는 수준으로 정의합니다. 흐름 · 상태 · 규칙 · 데이터 · 문구 · 예외 · 테스트 케이스를 표로 관리하고 엑셀과 주고받을 수 있습니다.',
  meta: [['대상', '현업 기획자 · 기획 직무 포트폴리오 · 팀 프로젝트'], ['분량', '시스템 1개 = 문서 1개'], ['핵심 질문', '이 문서만 보고 구현하고 테스트할 수 있는가?']],
  personas: ['qa', 'dev', 'planner', 'art'],
  aiContext: '단일 시스템 기획서다. 규칙의 모호성, 상태 전이 누락, 예외 처리 누락, 테스트 케이스가 규칙을 모두 덮는지 엄격하게 보라.',
  sections: [
    {
      id: 'overview', title: '개요', desc: '무엇을, 왜 만드는지와 이 문서가 다루는 범위를 먼저 고정합니다.',
      guide: ['<b>목적</b>은 “유저가 무엇을 하게 만들기 위해 이 시스템이 있는가”로 씁니다. 기능 설명이 아닙니다. ✕ “아이템을 강화하는 시스템” → ○ “남는 재화의 소모처를 만들고, 장비 성장의 장기 목표를 제공한다”.',
        '<b>범위 제외</b>를 적어두면 리뷰에서 “이건 왜 없어요?”라는 질문이 줄고, 일정 논의가 쉬워집니다.'],
      fields: [
        F.text('sysName', '시스템명', { req: true, w: 'half' }), F.text('sysId', '시스템 ID', { w: 'third', ph: 'SYS_ENHANCE' }), F.text('project', '프로젝트', { w: 'third' }),
        F.text('owner', '담당 기획', { w: 'third' }), F.sel('status', '문서 상태', ['초안', '리뷰 중', '확정', '개발 반영 완료', '폐기'], { w: 'third' }), F.sel('prio', '우선순위', ['P0 (필수)', 'P1 (중요)', 'P2 (차기)'], { w: 'third' }),
        F.area('purpose', '목적 · 기획 의도', { req: true, rows: 3 }),
        F.area('goal', '성공 기준', { rows: 2, ph: '출시 후 무엇을 보면 이 시스템이 의도대로 동작한다고 판단할 수 있는가. 예: 30레벨 이상 유저의 60%가 주 1회 이상 사용' }),
        F.area('scopeIn', '범위 — 포함', { rows: 3, w: 'half' }), F.area('scopeOut', '범위 — 제외 (이번 버전에서 안 하는 것)', { rows: 3, w: 'half' }),
        F.table('terms', '용어 정의', [C('term', '용어', 'text', { w: '22%' }), C('def', '정의', 'area')], { minRows: 2, hint: '문서 안에서 같은 대상을 다른 이름으로 부르지 않도록 여기서 고정합니다.' }),
        F.area('related', '관련 문서 · 선행 시스템', { rows: 2 }),
      ],
    },
    {
      id: 'flow', title: '흐름 & 상태', desc: '유저가 거치는 단계와, 시스템이 가질 수 있는 상태를 빠짐없이 나열합니다.',
      guide: ['흐름은 <b>정상 경로(happy path)</b>부터 한 줄로 쓰고, 분기는 단계 표의 ‘조건’ 열에 적습니다.',
        '<b>상태</b>를 표로 적으면 “이 상태에서 저 버튼을 누르면?” 같은 누락이 드러납니다. 각 상태에서 가능한 입력을 모두 확인하세요.'],
      fields: [
        F.area('flowMain', '기본 흐름', { req: true, rows: 2, ph: '강화 메뉴 진입 → 장비 선택 → 재료 확인 → 강화 실행 → 결과 연출 → 결과 반영' }),
        F.table('steps', '단계별 처리', [C('no', '단계', 'text', { w: '60px' }), C('cond', '조건 · 분기', 'area'), C('proc', '처리', 'area'), C('result', '결과 · 다음 단계', 'area')], { minRows: 4 }),
        F.table('states', '상태 정의', [C('state', '상태', 'text', { w: '18%' }), C('enter', '진입 조건', 'area'), C('exit', '종료 · 전이', 'area'), C('ui', '화면 표시', 'area')], { minRows: 3 }),
      ],
    },
    {
      id: 'rules', title: '규칙 & 수치', desc: '규칙마다 ID를 붙이면 예외 처리 · 테스트 케이스 · 리뷰 코멘트가 같은 번호를 가리킬 수 있습니다.',
      guide: ['규칙은 조건문으로: “~이면 ~한다. 단, ~인 경우 ~한다.” 해석이 필요한 표현(적당히 · 자연스럽게 · 적절히)은 수치나 조건으로 바꿉니다.',
        '확률은 표기 단위(%, 만분율)와 반올림 방식을, 시간은 기준(서버 시각 · 로컬 시각)과 초기화 시점을 명시합니다.'],
      fields: [
        F.table('ruleList', '규칙', [C('id', 'ID', 'text', { w: '70px', ph: 'R-01' }), C('rule', '규칙', 'area'), C('note', '비고 · 의도', 'area')], { minRows: 4 }),
        F.area('formula', '공식', { rows: 3, ph: '예: 성공 확률(%) = 기본 확률[강화 단계] + 보정 아이템 합 (최대 100)' }),
        F.table('balance', '수치 테이블', [C('k', '항목 · 단계', 'text'), C('v1', '값 1', 'text'), C('v2', '값 2', 'text'), C('v3', '값 3', 'text'), C('note', '비고', 'text')], { minRows: 3, hint: '열 의미는 첫 행에 적으세요. 큰 테이블은 엑셀에서 작성해 붙여넣는 편이 빠릅니다.' }),
      ],
    },
    {
      id: 'data', title: '데이터', desc: '기획 데이터가 들어갈 테이블과 컬럼을 정의합니다.',
      fields: [
        F.table('dataTables', '테이블 · 컬럼 정의', [C('tbl', '테이블', 'text', { w: '120px' }), C('col', '컬럼', 'text', { w: '120px' }), C('type', '타입', 'sel', { o: ['int', 'float', 'string', 'bool', 'enum', 'ID 참조', 'datetime', 'array'], w: '100px' }), C('key', 'PK/FK', 'sel', { o: ['PK', 'FK', ''], w: '70px' }), C('desc', '설명 · 범위 · 참조', 'area')], { minRows: 4 }),
        F.area('saveData', '저장되는 유저 데이터', { rows: 2, ph: '서버/로컬 구분, 저장 시점. 예: 강화 단계(서버, 결과 확정 시), 마지막 강화 시각(서버)' }),
      ],
    },
    {
      id: 'ui', title: 'UI & 문구', desc: '화면 구성과 화면에 나오는 모든 글자. 문구를 표로 관리하면 현지화 · 검수가 쉬워집니다.',
      fields: [
        F.table('screens', '화면 · 구성 요소', [C('sid', '화면 ID', 'text', { w: '100px' }), C('elem', '구성 요소', 'text'), C('action', '동작 (입력 → 반응)', 'area'), C('note', '표시 조건 · 비고', 'area')], { minRows: 3 }),
        F.table('strings', '문구', [C('key', '문구 키', 'text', { w: '150px', ph: 'ENHANCE_FAIL_TOAST' }), C('text', '문구', 'area'), C('when', '노출 조건', 'area')], { minRows: 3 }),
        F.area('uiNote', '와이어프레임 · 피그마 링크', { rows: 2 }),
      ],
    },
    {
      id: 'except', title: '예외 처리', desc: '분기가 생기는 모든 지점에 대해 “그때 어떻게 되는가”와 “유저에게 무엇을 보여주는가”를 적습니다.',
      guide: ['자주 빠지는 예외: 재화 · 재료 부족 / 인벤토리 가득 참 / 최대 단계 도달 / 연타 · 중복 요청 / 처리 중 연결 끊김 · 앱 종료 / 서버 · 클라이언트 값 불일치 / 점검 · 날짜 변경 시점 / 동시에 다른 기기에서 접속.'],
      fields: [
        F.table('exceptions', '예외 처리', [C('id', 'ID', 'text', { w: '70px', ph: 'E-01' }), C('case', '상황', 'area'), C('handle', '처리', 'area'), C('msg', '유저 안내 (문구 키)', 'text')], { minRows: 4 }),
      ],
    },
    {
      id: 'handoff', title: '리소스 & 로그', desc: '아트 · 사운드 · 데이터 분석 담당자가 이 섹션만 보고 일감을 뽑을 수 있게 합니다.',
      fields: [
        F.table('resources', '리소스 요청', [C('kind', '종류', 'sel', { o: ['UI', '아이콘', '이펙트', '애니메이션', '사운드', '일러스트', '기타'], w: '100px' }), C('item', '내용', 'area'), C('qty', '수량', 'num', { w: '60px', sum: true }), C('owner', '담당', 'text', { w: '80px' }), C('due', '필요 시점', 'text', { w: '100px' })], { minRows: 2 }),
        F.table('logs', '로그 이벤트', [C('ev', '이벤트명', 'text', { w: '150px' }), C('when', '발생 시점', 'text'), C('params', '파라미터', 'area')], { minRows: 2 }),
      ],
    },
    {
      id: 'qa', title: '테스트 케이스 & 변경 이력', desc: '규칙과 예외 하나마다 최소 하나의 테스트 케이스가 대응해야 합니다.',
      fields: [
        F.table('tcs', '테스트 케이스', [C('id', 'TC', 'text', { w: '60px' }), C('ref', '대상 (R/E ID)', 'text', { w: '90px' }), C('pre', '사전 조건', 'area'), C('step', '절차', 'area'), C('expect', '기대 결과', 'area'), C('res', '결과', 'sel', { o: ['미실행', 'Pass', 'Fail', '보류'], w: '80px' })], { minRows: 4 }),
        F.calc('tcCoverage'),
        F.table('changelog', '변경 이력', [C('ver', '버전', 'text', { w: '70px' }), C('date', '날짜', 'date', { w: '130px' }), C('change', '변경 내용', 'area'), C('author', '작성자', 'text', { w: '80px' })], { minRows: 1 }),
      ],
    },
  ],
  checks(v) {
    const o = []; const rules = tableRows(v.ruleList), ex = tableRows(v.exceptions), tcs = tableRows(v.tcs);
    if (rules.length < 3) o.push({ lvl: 'warn', msg: `규칙이 ${rules.length}개입니다. 흐름의 각 단계가 규칙으로 풀려 있는지 확인하세요.`, sec: 'rules' });
    rules.forEach(r => { if (/적당|자연스럽|적절|알맞게|어느 정도|빠르게|충분히/.test(r.rule || '')) o.push({ lvl: 'warn', msg: `규칙 ${esc(r.id || '')} — 해석이 필요한 표현이 있습니다. 수치나 조건으로 바꾸세요.`, sec: 'rules' }); });
    if (ex.length < 3) o.push({ lvl: 'err', msg: `예외 처리가 ${ex.length}개입니다. 재화 부족 · 연타 · 연결 끊김 · 최대치 도달부터 점검하세요.`, sec: 'except' });
    if (ex.some(r => r.case && !r.handle)) o.push({ lvl: 'err', msg: '처리 방법이 비어 있는 예외가 있습니다.', sec: 'except' });
    const c = calcResult('tcCoverage', v); if (c && c.missing && c.missing.length) o.push({ lvl: 'warn', msg: `테스트 케이스가 없는 규칙 · 예외: ${esc(c.missing.slice(0, 8).join(', '))}${c.missing.length > 8 ? ' 외' : ''}`, sec: 'qa' });
    if (!tcs.length) o.push({ lvl: 'err', msg: '테스트 케이스가 없습니다.', sec: 'qa' });
    if (!tableRows(v.states).length) o.push({ lvl: 'warn', msg: '상태 정의가 비어 있습니다.', sec: 'flow' });
    return o;
  },
});
CALCS.tcCoverage = {
  title: '테스트 커버리지 (규칙 · 예외 ID 기준)',
  compute(v) {
    const ids = [...tableRows(v.ruleList), ...tableRows(v.exceptions)].map(r => String(r.id || '').trim()).filter(Boolean);
    if (!ids.length) return { kpis: [], note: '규칙 · 예외에 ID를 붙이고 테스트 케이스의 ‘대상’ 열에 그 ID를 적으면, 테스트가 빠진 항목을 찾아 줍니다.' };
    const refs = tableRows(v.tcs).map(r => String(r.ref || '')).join(' ');
    const missing = ids.filter(id => !new RegExp('(^|[^\\w-])' + id.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '($|[^\\w-])').test(refs));
    const pass = tableRows(v.tcs).filter(r => r.res === 'Pass').length, fail = tableRows(v.tcs).filter(r => r.res === 'Fail').length;
    return { missing, kpis: [{ l: '규칙 + 예외', v: ids.length + '개' }, { l: '테스트 연결됨', v: (ids.length - missing.length) + '개', lvl: missing.length ? 'warn' : 'ok', s: fmtN((ids.length - missing.length) / ids.length * 100) + '%' }, { l: 'Pass / Fail', v: `${pass} / ${fail}`, lvl: fail ? 'err' : '' }], lines: missing.length ? ['테스트 없음: ' + esc(missing.join(', '))] : [] };
  },
};

/* ─── 6) 역기획서 ─── */
registerTemplate({
  id: 'game-reverse', tool: 'game', name: '역기획서', icon: '⟲', tag: '취업 포트폴리오', titleKey: 'docTitle',
  desc: '출시된 게임의 시스템 하나를 뜯어 <b>구조 · 규칙 · 수치 · 의도</b>를 거꾸로 문서화합니다. 기획 직무 지원 포트폴리오의 기본 문서로, “관찰한 사실”과 “내 추론”을 구분해 쓰는 것이 핵심입니다.',
  meta: [['대상', '게임 기획 지망생 · 신입 포트폴리오 · 경쟁작 분석'], ['분량', '시스템 1개 기준 10~20쪽'], ['핵심 질문', '왜 이렇게 만들었는지 근거를 들어 설명할 수 있는가?']],
  personas: ['planner', 'qa', 'market', 'player'],
  aiContext: '역기획서(출시작 시스템 분석)다. 관찰 사실과 추론이 구분되는지, 수치의 출처(인게임 표기/실측/추정)가 명시됐는지, 개선 제안이 부작용까지 검토했는지 보라. 해당 게임에 대한 사실을 네가 새로 지어내지 말고 문서에 적힌 내용의 논리만 검토하라.',
  sections: [
    {
      id: 'scope', title: '분석 개요', desc: '무엇을, 어떤 버전에서, 어떤 방법으로 분석했는지. 재현할 수 있어야 신뢰받습니다.',
      guide: ['게임 전체가 아니라 <b>시스템 하나</b>(예: 강화, 가챠, 길드전, 일일 퀘스트)로 범위를 좁히세요. 넓게 얕은 분석보다 좁고 깊은 분석이 평가받습니다.',
        '라이브 게임은 패치로 수치가 바뀝니다. <b>분석 버전과 날짜</b>를 반드시 적으세요.',
        '직접 플레이로 확인한 것과 공식 공지 · 커뮤니티 자료에서 가져온 것을 구분하고, 가져온 자료는 출처를 남깁니다.'],
      guideOpen: true,
      fields: [
        F.text('docTitle', '문서 제목', { req: true, ph: '예: 〈게임명〉 장비 강화 시스템 역기획서' }),
        F.text('game', '분석 대상 게임', { req: true, w: 'half' }), F.text('gameVer', '분석 버전 · 날짜', { req: true, w: 'half', ph: '예: v2.4.1 (2026-11 기준)' }),
        F.sel('genre', '장르', G.GENRES, { w: 'third' }), F.sel('platform', '플랫폼', G.PLATFORMS, { w: 'third' }), F.text('bm', '비즈니스 모델', { w: 'third', ph: '예: F2P + 인앱결제' }),
        F.text('target', '분석 대상 시스템', { req: true, ph: '예: 장비 강화 (재료 수급 ~ 강화 실행 ~ 실패 보정)' }),
        F.area('why', '이 시스템을 고른 이유', { req: true, rows: 3, ph: '이 게임의 핵심 소모처이고, 실패 보정 설계가 동종 장르와 다르다는 점에 주목함' }),
        F.area('method', '분석 방법', { req: true, rows: 3, ph: '플레이 시간, 계정 레벨, 실측 횟수, 참고한 공식 자료. 예: 40시간 플레이(Lv.52), 강화 300회 기록, 공식 확률 공지 참조' }),
      ],
    },
    {
      id: 'structure', title: '시스템 구조', desc: '시스템이 무엇으로 이루어져 있고, 유저가 어떤 순서로 쓰며, 다른 시스템과 무엇을 주고받는지.',
      fields: [
        F.area('define', '한 문장 정의', { req: true, rows: 2, ph: '재화 A와 재료 B를 소모해 장비의 능력치 단계를 올리는 성장 시스템' }),
        F.table('parts', '구성 요소', [C('part', '요소', 'text', { w: '20%' }), C('role', '역할', 'area'), C('where', '등장 화면 · 위치', 'text')], { minRows: 3 }),
        F.area('unlock', '진입 · 해금 조건', { rows: 2 }),
        F.area('flowUser', '이용 흐름', { req: true, rows: 2, ph: '재료 수집 → 강화 메뉴 → 장비 선택 → 강화 실행 → 결과 확인 → (실패 시) 보정 누적' }),
        F.table('links', '다른 시스템과의 연결', [C('sys', '연결 시스템', 'text', { w: '20%' }), C('in', '받는 것 (재화 · 데이터)', 'area'), C('out', '주는 것', 'area')], { minRows: 2, hint: '이 표가 시스템의 “존재 이유”를 드러냅니다. 어디서 재화를 받고 어디에 성장치를 주는지.' }),
      ],
    },
    {
      id: 'rules', title: '규칙 & 수치 역산', desc: '관찰한 규칙과 수치를 정리하고, 근거 수준을 반드시 표시합니다.',
      guide: ['<b>근거 수준</b>을 세 가지로 구분하세요: <b>인게임 표기</b>(게임이 직접 보여주는 값) / <b>실측</b>(직접 반복해 기록한 값, 횟수 명시) / <b>추정</b>(패턴으로 추론한 값).',
        '확률을 실측할 때는 시행 횟수가 적으면 오차가 큽니다. 예: 실제 30% 확률을 100회로 측정하면 95% 신뢰구간이 대략 ±9%p입니다. 횟수와 함께 “추정”임을 밝히세요.',
        '확률형 아이템은 2024년 3월부터 확률 공개가 의무이므로 게임 내 · 홈페이지 공지에서 공식 수치를 찾을 수 있는 경우가 많습니다.'],
      fields: [
        F.table('ruleList', '규칙', [C('rule', '규칙', 'area'), C('basis', '근거', 'sel', { o: ['인게임 표기', '실측', '추정', '공식 공지'], w: '110px' }), C('how', '확인 방법 · 횟수', 'area')], { minRows: 4 }),
        F.table('numbers', '수치 테이블', [C('k', '항목 · 단계', 'text'), C('v1', '값 1', 'text'), C('v2', '값 2', 'text'), C('v3', '값 3', 'text'), C('basis', '근거', 'sel', { o: ['인게임 표기', '실측', '추정', '공식 공지'], w: '110px' })], { minRows: 4, hint: '첫 행에 열 의미를 적으세요. 엑셀에서 정리한 표를 그대로 붙여넣을 수 있습니다.' }),
        F.area('formula', '추정 공식', { rows: 3, ph: '예: 필요 골드 = 1,000 × 1.5^(단계-1) — 1~10단계 실측값과 오차 2% 이내' }),
        F.calc('sampleErr'),
        F.num('nTrials', '실측 횟수', { unit: '회', w: 'half' }), F.num('pObs', '관측된 비율', { unit: '%', w: 'half' }),
        F.area('limits', '측정의 한계', { rows: 2, ph: '확인하지 못한 것, 표본이 부족한 구간, 버전 차이 가능성' }),
      ],
    },
    {
      id: 'ux', title: 'UI / UX 분석', desc: '화면 구성과 조작 동선을 기록하고, 왜 그렇게 배치했는지 살핍니다.',
      fields: [
        F.table('screens', '화면 분석', [C('screen', '화면', 'text', { w: '18%' }), C('elems', '구성 요소', 'area'), C('good', '잘된 점', 'area'), C('bad', '불편한 점', 'area')], { minRows: 2 }),
        F.area('flowUi', '화면 이동 흐름', { rows: 2 }), F.text('depth', '핵심 행동까지의 단계 수', { ph: '예: 로비에서 강화 실행까지 터치 4회' }),
        F.area('feedbackNote', '연출 · 피드백', { rows: 3, ph: '성공/실패 연출의 길이, 스킵 가능 여부, 기대감을 만드는 장치' }),
      ],
    },
    {
      id: 'intent', title: '기획 의도 추론', desc: '역기획서의 핵심. 관찰한 설계에서 “왜”를 근거와 함께 추론합니다.',
      guide: ['추론은 <b>관찰 → 추론 → 근거</b>의 세 칸으로 씁니다. 근거 없는 추론(“재미를 위해서”)은 가치가 없습니다.',
        '의도를 볼 때 유용한 질문: 이 설계가 없으면 무엇이 무너지는가? 어떤 유저(무과금 · 소과금 · 고과금, 신규 · 복귀)를 위한 장치인가? 재화의 획득처 · 소모처 균형에서 어떤 역할인가?'],
      fields: [
        F.table('intents', '설계 의도', [C('obs', '관찰한 설계', 'area'), C('infer', '추론한 의도', 'area'), C('basis', '근거', 'area')], { minRows: 3 }),
        F.area('economy', '재화 순환에서의 역할', { rows: 3 }), F.area('userSeg', '유저층별 영향', { rows: 3 }),
        F.table('compare', '동종 게임과 비교', [C('game', '비교 게임', 'text', { w: '20%' }), C('same', '같은 점', 'area'), C('diff', '다른 점과 그 효과', 'area')], { minRows: 1 }),
      ],
    },
    {
      id: 'improve', title: '평가 & 개선 제안', desc: '문제를 지적하는 데서 끝내지 말고, 제안이 가져올 부작용까지 따져봅니다.',
      guide: ['개선 제안은 <b>문제 → 제안 → 기대 효과 → 부작용 · 리스크 → 검증 지표</b>까지 한 묶음입니다. 부작용을 검토하지 않은 제안은 “유저 건의”와 다르지 않습니다.',
        '매출 · 리텐션에 영향을 주는 장치(천장, 실패 페널티 등)를 없애자는 제안은 대안이 그 역할을 어떻게 대신하는지 설명해야 합니다.'],
      fields: [
        F.area('pros', '잘 설계된 점', { rows: 3, w: 'half' }), F.area('cons', '문제점', { req: true, rows: 3, w: 'half' }),
        F.cards('proposals', '개선 제안', [
          F.text('title', '제안', { req: true }), F.area('problem', '해결하려는 문제', { w: 'half' }), F.area('idea', '제안 내용', { w: 'half' }),
          F.area('effect', '기대 효과', { w: 'third' }), F.area('side', '부작용 · 리스크', { w: 'third' }), F.area('metric', '검증 지표', { w: 'third' }),
        ], { addLabel: '제안 추가', idxLabel: '제안 ' }),
        F.area('lesson', '결론 — 배운 점과 내 기획에 적용할 것', { req: true, rows: 3 }),
      ],
    },
  ],
  checks(v) {
    const o = [];
    if (tableRows(v.ruleList).some(r => r.rule && !r.basis)) o.push({ lvl: 'err', msg: '근거 수준(인게임 표기 · 실측 · 추정)이 표시되지 않은 규칙이 있습니다.', sec: 'rules' });
    if (tableRows(v.numbers).some(r => r.k && !r.basis)) o.push({ lvl: 'warn', msg: '근거가 표시되지 않은 수치가 있습니다.', sec: 'rules' });
    if (tableRows(v.ruleList).some(r => r.basis === '실측' && !/\d/.test(r.how || ''))) o.push({ lvl: 'warn', msg: '실측이라고 표시했지만 횟수가 없는 규칙이 있습니다.', sec: 'rules' });
    if (tableRows(v.intents).some(r => r.infer && !r.basis)) o.push({ lvl: 'err', msg: '근거 없는 의도 추론이 있습니다.', sec: 'intent' });
    if (tableRows(v.intents).length < 3) o.push({ lvl: 'warn', msg: '설계 의도 추론이 3개 미만입니다. 역기획서의 핵심 섹션입니다.', sec: 'intent' });
    const props = (v.proposals || []).filter(p => p && (p.title || p.idea));
    if (!props.length) o.push({ lvl: 'warn', msg: '개선 제안이 없습니다.', sec: 'improve' });
    props.forEach(p => { if (!p.side) o.push({ lvl: 'warn', msg: `제안 ‘${esc(p.title || '')}’ — 부작용 · 리스크 검토가 없습니다.`, sec: 'improve' }); });
    if (!tableRows(v.links).length) o.push({ lvl: 'warn', msg: '다른 시스템과의 연결이 비어 있습니다.', sec: 'structure' });
    return o;
  },
});
CALCS.sampleErr = {
  title: '실측 확률의 오차 범위',
  compute(v) {
    const n = num(v.nTrials), p = num(v.pObs) / 100;
    if (!isFinite(n) || !isFinite(p) || n <= 0 || p < 0 || p > 1) return { kpis: [], note: '직접 반복해서 잰 확률은 횟수가 적으면 오차가 큽니다. 아래에 실측 횟수와 관측된 비율을 넣으면 95% 신뢰구간(Wilson 방식)을 계산합니다.' };
    const z = 1.96, d = 1 + z * z / n, c = (p + z * z / (2 * n)) / d, h = z * Math.sqrt(p * (1 - p) / n + z * z / (4 * n * n)) / d;
    const lo = Math.max(0, c - h) * 100, hi = Math.min(1, c + h) * 100;
    return { kpis: [{ l: '관측값', v: fmtN(p * 100, 1) + '%', s: `${fmtN(n)}회 중 약 ${fmtN(n * p)}회` }, { l: '95% 신뢰구간', v: `${fmtN(lo, 1)}% ~ ${fmtN(hi, 1)}%`, lvl: hi - lo > 15 ? 'warn' : 'ok', s: hi - lo > 15 ? '범위가 넓음 — 횟수를 늘리세요' : '' }],
      note: '실제 확률이 이 범위 안에 있을 가능성이 높다는 뜻입니다. 문서에는 “약 30% (100회 실측, 95% CI 22~39%)”처럼 범위와 함께 적으면 신뢰도가 올라갑니다.' };
  },
};

/* ─── 7) 플레이테스트 보고서 ─── */
registerTemplate({
  id: 'game-playtest', tool: 'game', name: '플레이테스트 보고서', icon: '🧪', tag: '검증 기록', titleKey: 'ptTitle',
  desc: '테스트 전에 <b>검증 질문과 판정 기준</b>을 정하고, 관찰한 사실 · 해석 · 조치를 분리해 기록합니다. 졸업작품 심사, 지원사업 결과 보고, 팀 회고의 근거 자료가 됩니다.',
  meta: [['대상', '인디 · 졸업작품 · 동아리 프로젝트'], ['분량', '회차당 2~5쪽'], ['핵심 질문', '무엇을 확인하려 했고, 무엇이 확인됐고, 무엇을 고칠 것인가?']],
  personas: ['planner', 'player', 'prof', 'dev'],
  aiContext: '플레이테스트 보고서다. 검증 질문과 판정 기준이 사전에 정의됐는지, 관찰(사실)과 해석이 섞이지 않았는지, 참가자 수 대비 결론이 과하지 않은지, 조치에 담당과 기한이 있는지 보라.',
  sections: [
    {
      id: 'plan', title: '테스트 개요', desc: '테스트를 하기 전에 채우는 부분입니다.',
      guide: ['회차마다 <b>검증 질문은 1~3개</b>로 좁히고, 테스트 전에 판정 기준을 숫자로 정해두세요. 기준 없이 테스트하면 결과를 유리하게 해석하게 됩니다.',
        '사용성 문제를 찾는 목적이라면 소수 인원으로도 주요 문제가 반복해서 드러납니다(Nielsen은 5명 안팎의 반복 테스트를 권했습니다). 반대로 “재미있다 · 선호한다” 같은 비율을 주장하려면 훨씬 많은 인원이 필요합니다.',
        '진행 중에는 설명하거나 도와주지 말고, 막히는 지점과 표정 · 혼잣말을 기록합니다.'],
      guideOpen: true,
      fields: [
        F.text('ptTitle', '보고서 제목', { req: true, ph: '예: 〈게임명〉 2차 플레이테스트 — 튜토리얼 이해도' }),
        F.text('build', '빌드 버전', { w: 'third' }), F.date('ptDate', '테스트 날짜', { w: 'third' }), F.text('place', '장소 · 방식', { w: 'third', ph: '대면 / 온라인 / 전시 현장' }),
        F.text('host', '진행 · 기록 담당', { w: 'half' }), F.text('duration', '1인당 소요 시간', { w: 'half' }),
        F.area('purpose', '테스트 목적', { req: true, rows: 2 }),
        F.table('questions', '검증 질문과 판정 기준', [C('id', 'ID', 'text', { w: '60px', ph: 'Q1' }), C('q', '검증 질문', 'area'), C('criteria', '판정 기준 (사전 정의)', 'area')], { minRows: 2 }),
      ],
    },
    {
      id: 'who', title: '참가자 & 방법', desc: '',
      fields: [
        F.table('participants', '참가자', [C('id', 'ID', 'text', { w: '60px', ph: 'P1' }), C('type', '유형', 'sel', { o: ['타깃 유저', '비타깃', '팀 지인', '개발 관계자'], w: '110px' }), C('exp', '게임 경험', 'text'), C('note', '비고', 'text')], { minRows: 3, hint: '실명 대신 ID로 기록하세요. 팀원 · 지인은 호의적으로 평가하는 경향이 있으므로 유형을 구분해 둡니다.' }),
        F.calc('ptMix'),
        F.area('procedure', '진행 절차', { rows: 3, ph: '안내(1분) → 설명 없이 플레이(10분) → 설문(3분) → 인터뷰(5분)' }),
        F.check('collect', '수집 방법', ['진행자 관찰 기록', '화면 녹화', '소리 내어 생각하기(think-aloud)', '사후 설문', '사후 인터뷰', '인게임 로그 (클리어 시간 · 사망 위치 등)', '표준 척도 (SUS · GEQ 등)']),
        F.check('consent', '동의 · 개인정보', ['녹화 · 기록 사전 동의', '결과 활용 범위 안내', '실명 대신 ID로 기록']),
      ],
    },
    {
      id: 'obs', title: '관찰 결과', desc: '해석을 섞지 말고 본 것만 적습니다. ✕ “조작이 어려웠다” → ○ “5명 중 4명이 대시 버튼을 30초 이상 찾지 못함”.',
      fields: [
        F.table('observations', '관찰 기록', [C('where', '구간 · 시점', 'text', { w: '16%' }), C('what', '관찰한 행동 · 발언', 'area'), C('count', '해당 인원', 'text', { w: '80px', ph: '4/5' }), C('sev', '심각도', 'sel', { o: ['치명 (진행 불가)', '높음', '보통', '낮음', '긍정'], w: '120px' })], { minRows: 4 }),
        F.table('metrics', '정량 데이터', [C('metric', '지표', 'text'), C('value', '값', 'text', { w: '120px' }), C('note', '측정 방법 · 비고', 'area')], { minRows: 2 }),
        F.area('quotes', '기억할 발언', { rows: 3 }),
      ],
    },
    {
      id: 'act', title: '분석 & 조치', desc: '검증 질문마다 결론을 내리고, 고칠 것에 담당과 기한을 붙입니다.',
      fields: [
        F.table('verdicts', '검증 질문별 결론', [C('id', '질문 ID', 'text', { w: '70px' }), C('res', '판정', 'sel', { o: ['통과', '부분 통과', '실패', '판단 불가'], w: '100px' }), C('basis', '근거', 'area')], { minRows: 2 }),
        F.table('actions', '이슈 & 조치', [C('issue', '이슈', 'area'), C('sev', '심각도', 'sel', { o: ['치명', '높음', '보통', '낮음'], w: '80px' }), C('action', '조치', 'area'), C('owner', '담당', 'text', { w: '80px' }), C('due', '기한', 'date', { w: '130px' }), C('st', '상태', 'sel', { o: ['예정', '진행', '완료', '보류'], w: '80px' })], { minRows: 3 }),
        F.area('wontfix', '고치지 않기로 한 것과 이유', { rows: 2 }),
        F.area('next', '다음 테스트 계획', { rows: 2 }),
      ],
    },
  ],
  checks(v) {
    const o = []; const qs = tableRows(v.questions), vs = tableRows(v.verdicts), ps = tableRows(v.participants);
    if (!qs.length) o.push({ lvl: 'err', msg: '검증 질문이 없습니다.', sec: 'plan' });
    if (qs.some(q => q.q && !q.criteria)) o.push({ lvl: 'err', msg: '판정 기준이 없는 검증 질문이 있습니다.', sec: 'plan' });
    if (qs.length > 3) o.push({ lvl: 'warn', msg: `검증 질문이 ${qs.length}개입니다. 한 회차에 1~3개가 적당합니다.`, sec: 'plan' });
    const qid = qs.map(q => String(q.id || '').trim()).filter(Boolean), vid = vs.map(x => String(x.id || '').trim());
    const miss = qid.filter(i => !vid.includes(i)); if (tableRows(v.observations).length && miss.length) o.push({ lvl: 'warn', msg: `결론이 없는 검증 질문: ${esc(miss.join(', '))}`, sec: 'act' });
    if (ps.length && ps.length < 3) o.push({ lvl: 'warn', msg: `참가자가 ${ps.length}명입니다. 같은 문제가 반복되는지 보려면 3~5명 이상을 권장합니다.`, sec: 'who' });
    if (tableRows(v.actions).some(a => a.action && (!a.owner || !a.due))) o.push({ lvl: 'warn', msg: '담당 또는 기한이 없는 조치가 있습니다.', sec: 'act' });
    return o;
  },
});
CALCS.ptMix = {
  title: '참가자 구성',
  compute(v) {
    const ps = tableRows(v.participants); if (!ps.length) return { kpis: [] };
    const tgt = ps.filter(p => p.type === '타깃 유저').length, biased = ps.filter(p => /지인|관계자/.test(p.type || '')).length;
    return { kpis: [{ l: '참가자', v: ps.length + '명' }, { l: '타깃 유저', v: tgt + '명', lvl: tgt ? 'ok' : 'warn', s: tgt ? '' : '타깃 유저가 없음' }, { l: '지인 · 관계자', v: biased + '명', lvl: biased / ps.length > .5 ? 'warn' : '', s: biased / ps.length > .5 ? '호의적 평가 가능성' : '' }] };
  },
};

TOOLS.game = {
  id: 'game', name: '게임 기획서', mark: 'G', eyebrow: 'GAME DESIGN DOCUMENT',
  title: '목적에 맞는 기획 문서로 시작하세요',
  lead: '기획서는 읽는 사람과 목적에 따라 달라집니다. 전체 기획서 4종(1페이지 · 인디 · 졸업작품 · 실무)과, 실제 업무와 포트폴리오에서 가장 많이 쓰는 단위 문서 3종(시스템 기획서 · 역기획서 · 플레이테스트 보고서)을 골라 쓰세요. 양식마다 채워진 예시가 있습니다.',
  templates: ['game-onepage', 'game-capstone', 'game-indie', 'game-industry', 'game-system', 'game-reverse', 'game-playtest'],
  personas: ['planner', 'dev', 'art', 'market', 'prof', 'qa', 'player'],
};
