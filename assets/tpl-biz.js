/* ═══════════════════════════════════════════════════════════
   BUSINESS PLAN TEMPLATES
   ═══════════════════════════════════════════════════════════ */
Object.assign(PERSONAS, {
  judge: { name: '정부지원사업 심사위원', icon: '🏛️', desc: 'PSST 평가 관점', role: '너는 예비 · 초기창업패키지 같은 정부 창업지원사업의 서면평가 심사위원이다. 문제인식의 근거(통계 · 출처), 실현가능성(준비 정도와 협약 기간 내 일정), 성장전략(BM · 시장 · 자금 계획), 팀 역량을 본다.', format: '### ① 감점 요인 (항목별)\n### ② 근거가 부족한 주장 (출처 · 수치 필요)\n### ③ 가점을 받으려면 보강할 것' },
  vc: { name: 'VC 심사역', icon: '💼', desc: '시장 · 확장성 · 팀', role: '너는 초기 단계 벤처캐피털 심사역이다. 시장 크기 산정 방식, 왜 지금인지, 경쟁 우위의 지속 가능성, 단위 경제성, 팀이 이 문제를 풀 적임자인지 본다.', format: '### ① 투자를 망설이게 하는 점\n### ② 검증되지 않은 가정\n### ③ 다음 미팅 전에 가져와야 할 데이터' },
  cfo: { name: '재무 담당', icon: '📈', desc: '숫자의 일관성', role: '너는 스타트업 재무 담당자다. 매출 · 비용 · 고객 수 · 가격 · 손익분기 · 자금 소요가 서로 맞물리는지, 산출 근거가 있는지, 지나치게 낙관적인 가정이 있는지 계산으로 확인한다.', format: '### ① 서로 맞지 않는 숫자\n### ② 근거 없는 가정\n### ③ 수정 제안 (계산식 포함)' },
  customer: { name: '타깃 고객', icon: '🙋', desc: '정말 돈을 낼까', role: '너는 이 문서에 적힌 타깃 고객이다. 이 제품이 지금 쓰는 대안보다 나은지, 이 가격을 낼지, 어디서 처음 알게 될지 솔직하게 말한다.', format: '### ① 지금 쓰는 대안 대비 나은 점 / 아닌 점\n### ② 가격에 대한 반응\n### ③ 구매를 망설이게 하는 것' },
});
const B = {
  INDUSTRY: ['IT · 소프트웨어', '모바일 앱', '게임 · 콘텐츠', '이커머스', '푸드테크', '헬스케어', '에듀테크', '핀테크', '물류 · 모빌리티', '제조 · 하드웨어', '서비스업', '소셜임팩트', '기타'],
  TYPE: ['B2C', 'B2B', 'B2B2C', '플랫폼 · 마켓플레이스', 'SaaS', 'D2C'],
  REVENUE: ['구독 (월 · 연)', '거래 수수료', '광고', '단건 판매', '프리미엄 (무료 + 유료 기능)', '라이선싱', '용역 · 서비스', '복합 모델'],
  market: () => [
    F.num('tamCount', '잠재 고객 수 (전체)', { unit: '명/곳', w: 'half', ph: '예: 650000', hint: '예: 국내 일반음식점 사업체 수 — 통계 출처를 아래 메모에' }),
    F.num('arpa', '고객당 연간 지출액', { unit: '원', w: 'half', ph: '예: 348000' }),
    F.num('samPct', 'SAM 비율 (TAM 중 실제 공략 가능한 범위)', { unit: '%', w: 'half', ph: '예: 15' }),
    F.num('somPct', 'SOM 비율 (SAM 중 3년 내 확보 목표)', { unit: '%', w: 'half', ph: '예: 3' }),
    F.calc('tamsom'),
    F.area('marketNote', '산정 근거 · 출처', { rows: 3, ph: '각 숫자의 출처(기관명, 자료명, 연도)와 SAM · SOM 비율을 그렇게 잡은 이유' }),
  ],
};

CALCS.tamsom = {
  title: '시장 규모 (Bottom-up)',
  compute(v) {
    const n = num(v.tamCount), a = num(v.arpa), sp = num(v.samPct), op = num(v.somPct);
    if (!isFinite(n) || !isFinite(a)) return { kpis: [], note: '잠재 고객 수 × 고객당 연간 지출액으로 TAM을 계산합니다. 전체 산업 규모에서 비율로 깎아 내려오는 Top-down 방식보다, 고객 수 × 단가로 쌓아 올리는 <b>Bottom-up</b> 방식이 심사 · 투자 검토에서 더 설득력이 있습니다.' };
    const tam = n * a, sam = isFinite(sp) ? tam * sp / 100 : NaN, som = isFinite(sam) && isFinite(op) ? sam * op / 100 : NaN;
    return {
      kpis: [{ l: 'TAM', v: fmtWon(tam) + '원', s: `${fmtN(n)} × ${fmtWon(a)}원` }, { l: 'SAM', v: isFinite(sam) ? fmtWon(sam) + '원' : '—', s: isFinite(sp) ? `TAM의 ${sp}%` : '' }, { l: 'SOM', v: isFinite(som) ? fmtWon(som) + '원' : '—', s: isFinite(op) ? `SAM의 ${op}% · 고객 약 ${fmtN(n * (sp / 100) * (op / 100))}` : '' }],
      note: 'SOM은 “3년 차 매출 목표”와 같은 숫자여야 앞뒤가 맞습니다. 재무 계획의 매출과 비교해 보세요.',
    };
  },
};
CALCS.unitEcon = {
  title: '단위 경제성 (LTV · CAC)',
  compute(v) {
    const arpu = num(v.arpu), gm = num(v.gm), ch = num(v.churn), cac = num(v.cac);
    if (!isFinite(arpu) || !isFinite(ch) || ch <= 0) return { kpis: [], note: '고객당 월 매출 · 월 이탈률(필수), 매출총이익률 · 고객 획득 비용(선택)을 넣으면 계산합니다. 구독형이 아니면 “재구매 주기”를 월 단위로 환산해 쓰세요.' };
    const g = isFinite(gm) ? gm / 100 : 1; const life = 1 / (ch / 100); const ltv = arpu * g * life;
    const k = [{ l: '평균 고객 유지 기간', v: fmtN(life, 1) + '개월', s: '1 ÷ 월 이탈률' }, { l: 'LTV', v: fmtWon(ltv) + '원', s: isFinite(gm) ? `ARPU × 이익률 ${gm}% × 유지 기간` : '이익률 미입력 → 매출 기준' }];
    if (isFinite(cac) && cac > 0) {
      const r = ltv / cac, pb = cac / (arpu * g);
      k.push({ l: 'LTV : CAC', v: fmtN(r, 1) + ' : 1', lvl: r >= 3 ? 'ok' : r >= 1 ? 'warn' : 'err' });
      k.push({ l: 'CAC 회수 기간', v: fmtN(pb, 1) + '개월', lvl: pb <= 12 ? 'ok' : 'warn' });
    }
    return { kpis: k, note: '“LTV:CAC 3:1 이상, CAC 회수 12개월 이내”는 구독 · SaaS 업계에서 흔히 인용되는 경험칙입니다. 업종에 따라 다르므로 절대 기준이 아니라 점검용으로 쓰세요. 초기에는 이탈률 실측치가 없으므로 가정임을 명시해야 합니다.' };
  },
};
CALCS.bep = {
  title: '손익분기점 (BEP)',
  compute(v) {
    const fx = num(v.fixedMonthly), p = num(v.unitPrice), vc = isFinite(num(v.unitVarCost)) ? num(v.unitVarCost) : 0;
    if (!isFinite(fx) || !isFinite(p)) return { kpis: [], note: 'BEP 판매량 = 월 고정비 ÷ (단가 − 단위당 변동비)' };
    const cm = p - vc; if (cm <= 0) return { kpis: [{ l: '단위 공헌이익', v: fmtN(cm) + '원', lvl: 'err', s: '팔수록 손해 — 가격 · 원가 재검토' }] };
    const q = Math.ceil(fx / cm);
    return { kpis: [{ l: '단위 공헌이익', v: fmtN(cm) + '원', s: `공헌이익률 ${fmtN(cm / p * 100, 1)}%` }, { l: '월 BEP 판매량', v: fmtN(q) + '건/명' }, { l: '월 BEP 매출', v: fmtWon(q * p) + '원' }], note: '고정비에는 인건비(대표 본인 포함) · 임차료 · 서버 · 구독 툴 등 매출과 무관하게 나가는 비용을 모두 넣으세요.' };
  },
};
CALCS.runway = {
  title: '런웨이',
  compute(v) {
    const c = num(v.cash), b = num(v.burn);
    if (!isFinite(c) || !isFinite(b) || b <= 0) return { kpis: [], note: '보유 현금 ÷ 월 순소진액(지출 − 매출) = 버틸 수 있는 개월 수' };
    const m = c / b; return { kpis: [{ l: '런웨이', v: fmtN(m, 1) + '개월', lvl: m >= 12 ? 'ok' : m >= 6 ? 'warn' : 'err' }], note: '다음 자금 조달에는 보통 수개월이 걸리므로, 런웨이가 짧을수록 조달 준비를 일찍 시작해야 합니다.' };
  },
};
CALCS.psstBudget = {
  title: '사업비 비목별 구성',
  compute(v) {
    const rows = tableRows(v.budget); const tot = colSum(rows, 'amount'); if (!tot) return { kpis: [], note: '비목 · 산출 근거 · 금액을 입력하면 비목별 비율이 계산됩니다.' };
    const by = {}; rows.forEach(r => { const k = r.cat || '(비목 미지정)'; by[k] = (by[k] || 0) + (isFinite(num(r.amount)) ? num(r.amount) : 0); });
    return { kpis: [{ l: '총 사업비', v: fmtWon(tot) + '원' }], lines: Object.entries(by).sort((a, b) => b[1] - a[1]).map(([k, x]) => `${esc(k)}: ${fmtWon(x)}원 (${fmtN(x / tot * 100, 1)}%)`), note: '비목별 한도 · 집행 불가 항목은 해당 연도 공고문과 사업비 관리 지침을 따르세요.' };
  },
};

/* ─── 1) PSST (정부지원사업) ─── */
registerTemplate({
  id: 'biz-psst', tool: 'biz', name: '정부지원사업 (PSST)', icon: '🏛', tag: '예비 · 초기창업패키지', titleKey: 'itemName',
  desc: '창업지원사업 사업계획서의 <b>문제인식(Problem) · 실현가능성(Solution) · 성장전략(Scale-up) · 팀 구성(Team)</b> 구조. 2026년 예비창업패키지 기준 본문 10쪽 내외, 협약 기간 내 추진 일정과 사업비 집행 계획이 들어갑니다.',
  meta: [['대상', '예비 · 초기창업패키지, 청년창업사관학교 등'], ['분량', '본문 10쪽 내외 (공고 기준 확인)'], ['핵심 질문', '근거 있는 문제를, 협약 기간 안에, 이 팀이 풀 수 있는가?']],
  personas: ['judge', 'cfo', 'customer', 'vc'],
  aiContext: '정부 창업지원사업(PSST) 사업계획서다. 서면평가 심사 기준으로, 근거 · 출처가 없는 주장과 일정 · 예산의 구체성을 엄격히 보라.',
  sections: [
    {
      id: 'summary', title: '일반현황 & 개요(요약)', desc: '심사위원이 가장 먼저 읽는 1쪽 요약입니다. 본문을 다 쓴 뒤 마지막에 다듬으세요.',
      guide: ['<b>양식은 매년 바뀝니다.</b> 이 도구로 내용을 정리한 뒤, 최종 제출은 반드시 해당 연도 K-Startup 공고에 첨부된 양식(hwp)에 옮겨 적으세요. 공고의 작성 요령 · 분량 · 가점 항목이 우선입니다.',
        '개인정보(성명 · 성별 · 생년월일 · 학교명 등)를 블라인드 처리하도록 요구하는 경우가 많으니 공고의 작성 유의사항을 확인하세요.'],
      guideOpen: true,
      fields: [
        F.text('itemName', '창업 아이템명', { req: true, w: 'twothird', ph: '예: 소규모 식당용 AI 재고 · 발주 자동화 서비스' }),
        F.sel('category', '범주', ['제조', '지식서비스 (SW · 플랫폼 등)', '콘텐츠', '기타'], { w: 'third' }),
        F.area('summary', '아이템 개요', { req: true, rows: 3, ph: '핵심 기능 · 주요 고객 · 사용처를 2~3문장으로' }),
        F.area('problemSum', '문제인식 요약', { rows: 2, w: 'half' }), F.area('solutionSum', '실현가능성 요약', { rows: 2, w: 'half' }),
        F.area('scaleSum', '성장전략 요약', { rows: 2, w: 'half' }), F.area('teamSum', '팀 구성 요약', { rows: 2, w: 'half' }),
      ],
    },
    {
      id: 'problem', title: '1. 문제인식 (Problem)', desc: '창업 아이템의 배경과 필요성 — 왜 이 문제가 실재하고 중요한지를 <b>수치와 출처</b>로 보여줍니다.',
      guide: ['심사에서 가장 흔한 감점은 “근거 없는 주장”입니다. 시장 현황 · 고객 불편은 통계 · 보도 · 논문 · 직접 조사(인터뷰 · 설문) 결과로 뒷받침하고 출처를 명시하세요.',
        '외부적 배경(시장 · 사회 · 기술 변화)과 내부적 동기(대표자가 이 문제를 발견한 경험)를 구분해 쓰면 설득력이 높아집니다.'],
      fields: [
        F.area('background', '창업 배경 및 동기', { req: true, rows: 4 }),
        F.area('marketPain', '시장 현황 및 고객이 겪는 문제', { req: true, rows: 5 }),
        F.table('evidence', '근거 자료', [C('fact', '수치 · 사실', 'area'), C('source', '출처 (기관 · 자료명)', 'text'), C('year', '연도', 'text', { w: '70px' })], { minRows: 3 }),
        F.area('customerVoice', '고객 검증 (인터뷰 · 설문)', { rows: 3, ph: '예: 식당 사장 15명 인터뷰 중 11명이 “주 2회 이상 발주 실수” 경험 (2026.04, 직접 조사)' }),
      ],
    },
    {
      id: 'solution', title: '2. 실현가능성 (Solution)', desc: '현재 어디까지 준비됐고, 협약 기간 안에 무엇을 어떻게 만들지 구체적으로 보여줍니다.',
      guide: ['“준비 정도”는 시제품 · MVP · 특허 출원 · 고객 테스트 결과 등 <b>이미 있는 것</b>을 적습니다. 계획은 다음 칸에.',
        '협약 기간 내 일정은 표로 제시하는 것이 일반적입니다 (2026 예비창업패키지 협약 기간 약 8개월 기준).'],
      fields: [
        F.area('status', '현재 준비 정도', { req: true, rows: 4 }),
        F.area('solutionPlan', '실현 및 구체화 방안', { req: true, rows: 5, ph: '개발 방법 · 기술 스택 · 외주 범위 · 고객 피드백 반영 방법' }),
        F.table('diffTable', '경쟁 제품 대비 차별성', [C('item', '비교 항목', 'text', { w: '20%' }), C('ours', '우리', 'area'), C('compA', '경쟁사 A', 'area'), C('compB', '경쟁사 B', 'area')], { minRows: 3 }),
        F.table('schedule', '협약 기간 내 추진 일정', [C('task', '추진 내용', 'text'), C('period', '기간', 'text', { w: '130px' }), C('detail', '세부 내용 · 산출물', 'area')], { minRows: 4 }),
      ],
    },
    {
      id: 'scale', title: '3. 성장전략 (Scale-up)', desc: '비즈니스 모델 · 시장 진입 전략 · 사업비 집행 계획으로 사업화 가능성을 보여줍니다.',
      fields: [
        F.area('bm', '비즈니스 모델', { req: true, rows: 4, ph: '누가 · 무엇에 · 얼마를 · 어떤 방식으로 지불하는가' }),
        ...B.market(),
        F.area('gtm', '시장 진입 및 성과 창출 전략', { req: true, rows: 4, ph: '초기 고객 확보 채널, 첫 매출 시점, 협약 기간 내 목표 성과(고객 수 · 매출 · 투자 등)' }),
        F.area('roadmap', '중장기 로드맵 (협약 이후)', { rows: 3 }),
        F.table('budget', '사업비 집행 계획', [C('cat', '비목', 'sel', { o: ['재료비', '외주용역비', '기계장치', '특허권 등 무형자산 취득비', '인건비', '지급수수료', '여비', '교육훈련비', '광고선전비', '창업활동비', '기타'], w: '150px' }), C('basis', '산출 근거 (단가 × 수량)', 'area'), C('amount', '금액(원)', 'num', { w: '130px', sum: true })], { minRows: 4 }),
        F.calc('psstBudget'),
        F.area('fundingPlan', '추가 자금 조달 계획', { rows: 2, ph: '자기부담금, 후속 투자 · 지원사업 계획' }),
      ],
    },
    {
      id: 'team', title: '4. 팀 구성 (Team)', desc: '대표자와 팀이 이 아이템을 실현할 역량을 갖췄음을 보여줍니다.',
      fields: [
        F.area('ceo', '대표자 역량', { req: true, rows: 4, ph: '아이템과 직접 관련된 경력 · 기술 · 경험 (블라인드 규정 준수)' }),
        F.table('team', '팀원 현황 및 구성 계획', [C('role', '직위 · 역할', 'text', { w: '110px' }), C('duty', '담당 업무', 'area'), C('skill', '보유 역량 (경력 · 학위)', 'area'), C('state', '구성 상태', 'sel', { o: ['완료', '채용 예정', '협의 중'], w: '100px' })], { minRows: 2 }),
        F.area('hiring', '채용 계획', { rows: 2 }),
        F.table('partners', '협력 기관', [C('org', '기관명', 'text'), C('cap', '보유 역량', 'area'), C('plan', '협업 방안', 'area'), C('when', '협력 시기', 'text', { w: '90px' })], { minRows: 1 }),
      ],
    },
  ],
  checks(v) {
    const o = [];
    const ev = tableRows(v.evidence); if (ev.length < 2) o.push({ lvl: 'err', msg: '문제인식 근거 자료가 2개 미만입니다. 통계 · 조사 결과를 출처와 함께 넣으세요.', sec: 'problem' });
    if (ev.some(r => r.fact && !r.source)) o.push({ lvl: 'warn', msg: '출처가 비어 있는 근거가 있습니다.', sec: 'problem' });
    if (v.marketPain && !/\d/.test(v.marketPain)) o.push({ lvl: 'warn', msg: '‘시장 현황 및 고객 문제’에 수치가 하나도 없습니다.', sec: 'problem' });
    if (tableRows(v.schedule).length < 3) o.push({ lvl: 'warn', msg: '협약 기간 내 추진 일정이 3단계 미만입니다.', sec: 'solution' });
    if (colSum(v.budget, 'amount') <= 0) o.push({ lvl: 'err', msg: '사업비 집행 계획이 비어 있습니다.', sec: 'scale' });
    if (tableRows(v.budget).some(r => r.amount && !r.basis)) o.push({ lvl: 'warn', msg: '산출 근거(단가 × 수량)가 없는 사업비 항목이 있습니다.', sec: 'scale' });
    if (isFinite(num(v.samPct)) && num(v.samPct) > 100 || isFinite(num(v.somPct)) && num(v.somPct) > 100) o.push({ lvl: 'err', msg: 'SAM · SOM 비율이 100%를 넘습니다.', sec: 'scale' });
    if (!v.marketNote && isFinite(num(v.tamCount))) o.push({ lvl: 'warn', msg: '시장 규모 산정 근거 · 출처가 비어 있습니다.', sec: 'scale' });
    return o;
  },
});

/* ─── 2) IR / 표준 ─── */
registerTemplate({
  id: 'biz-ir', tool: 'biz', name: '투자 · 표준 사업계획서', icon: '◎', tag: 'IR · 공모전 · 수업', titleKey: 'name',
  desc: '투자 유치 · 창업 경진대회 · 수업 과제용 표준 구조. 회사 목적 → 문제 → 해결책 → <b>왜 지금</b> → 시장 → 경쟁 → 제품 · BM → 팀 → 재무 순서는 Sequoia Capital의 사업계획서 가이드를 따릅니다.',
  meta: [['대상', '엔젤 · 시드 투자, 경진대회, 경영학 수업'], ['분량', '10~20쪽 (IR 덱은 10~15장)'], ['핵심 질문', '큰 시장에서, 지금, 이 팀이 이길 수 있는가?']],
  personas: ['vc', 'cfo', 'customer', 'judge'],
  aiContext: '투자 · 경진대회용 표준 사업계획서다. 시장 산정 방식, 왜 지금인지, 단위 경제성, 숫자 간 일관성을 중점적으로 보라.',
  sections: [
    {
      id: 'company', title: '회사 & 목적', desc: '회사가 존재하는 이유를 한 문장으로.',
      fields: [
        F.text('name', '회사 · 서비스명', { req: true, w: 'half' }), F.sel('stage', '단계', ['아이디어', 'MVP · 베타', '초기 매출', '성장'], { w: 'half' }),
        F.sel('industry', '업종', B.INDUSTRY, { w: 'half' }), F.sel('bizType', '사업 형태', B.TYPE, { w: 'half' }),
        F.text('tagline', '한 줄 소개', { req: true, ph: '예: 소규모 식당 사장님의 발주 실수를 없애는 AI 재고 관리' }),
        F.area('purpose', '회사의 목적 (미션)', { rows: 2 }),
      ],
    },
    {
      id: 'problem', title: '문제 · 해결책 · 왜 지금', desc: '고객의 고통 → 우리의 해결 방식 → 이 해결이 지금 가능해진 이유.',
      guide: ['<b>왜 지금(Why now)</b>은 투자 검토에서 자주 묻는 질문입니다. 기술 변화(예: 비용 하락) · 규제 변화 · 고객 행동 변화 중 무엇 때문에 지금 가능해졌는지 답하세요. <span class="src">— Sequoia Capital, “Writing a Business Plan”</span>'],
      fields: [
        F.area('problem', '고객의 문제', { req: true, rows: 4 }), F.area('solution', '해결책', { req: true, rows: 4 }),
        F.area('whyNow', '왜 지금인가', { req: true, rows: 3 }), F.area('uvp', '핵심 가치 제안', { rows: 2 }),
      ],
    },
    {
      id: 'market', title: '시장', desc: '누가 고객이고, 그 고객이 얼마나 있는지.',
      fields: [F.text('target', '핵심 타깃 (초기 고객)', { req: true }), F.area('pain', '타깃의 페인 포인트', { rows: 3 }), ...B.market()],
    },
    {
      id: 'competition', title: '경쟁', desc: '직접 경쟁사뿐 아니라 고객이 지금 쓰는 대안(엑셀, 수작업, 아무것도 안 함)도 경쟁자입니다.',
      fields: [
        F.table('competitors', '경쟁 · 대체재', [C('name', '경쟁사 · 대안', 'text', { w: '18%' }), C('kind', '유형', 'sel', { o: ['직접 경쟁', '간접 경쟁', '현재 대안 (수작업 등)'], w: '130px' }), C('strength', '강점', 'area'), C('weakness', '약점', 'area'), C('price', '가격', 'text', { w: '90px' })], { minRows: 3 }),
        F.area('compNote', '경쟁 구도 요약', { rows: 3 }),
        F.area('advantage', '지속 가능한 경쟁 우위', { req: true, rows: 3, ph: '쉽게 복제할 수 없는 것: 데이터 · 네트워크 효과 · 독점 계약 · 전문성 · 비용 구조' }),
      ],
    },
    {
      id: 'model', title: '제품 & 비즈니스 모델', desc: '무엇을 팔고, 고객 한 명이 얼마의 가치를 만드는지.',
      fields: [
        F.area('product', '제품 · 서비스 설명', { rows: 4, ph: '핵심 기능, 개발 현황, 제품 로드맵' }),
        F.sel('revenueType', '수익 모델', B.REVENUE, { req: true, w: 'half' }), F.area('pricing', '가격 정책', { rows: 2, w: 'half' }),
        F.area('revenueDetail', '수익 구조 상세', { rows: 3 }),
        F.num('arpu', '고객당 월 매출 (ARPU)', { unit: '원', w: 'half' }), F.num('gm', '매출총이익률', { unit: '%', w: 'half' }),
        F.num('churn', '월 이탈률', { unit: '%', w: 'half' }), F.num('cac', '고객 획득 비용 (CAC)', { unit: '원', w: 'half' }),
        F.calc('unitEcon'),
        F.area('ueNote', '단위 경제성 가정 · 근거', { rows: 2 }),
        F.area('costStructure', '비용 구조', { rows: 3, w: 'half' }), F.area('partners', '핵심 자원 · 파트너', { rows: 3, w: 'half' }),
      ],
    },
    {
      id: 'gtm', title: '고객 확보 (Go-to-Market)', desc: '첫 100명의 고객을 어디서, 어떻게 데려올지.',
      fields: [
        F.area('channels', '채널', { req: true, rows: 3 }), F.area('first100', '첫 100명 확보 계획', { rows: 3 }),
        F.text('message', '핵심 메시지 (광고 카피)'), F.area('scale', '확장 전략', { rows: 3 }),
        F.text('northStar', '핵심 지표 (North Star Metric)', { ph: '예: 주간 자동 발주 건수' }),
      ],
    },
    {
      id: 'finance', title: '재무 계획', desc: '매출 · 비용 · 고객 수가 서로 맞물려야 합니다. 시장 섹션의 SOM과 3년 차 매출을 비교해 보세요.',
      fields: [
        F.table('fin', '연도별 추정', [C('year', '연도', 'text', { w: '80px' }), C('customers', '고객 수', 'num', { w: '90px' }), C('rev', '매출(원)', 'num', { w: '130px' }), C('cost', '비용(원)', 'num', { w: '130px' }), C('basis', '산출 근거', 'area')], { minRows: 3 }),
        F.num('fixedMonthly', '월 고정비', { unit: '원', w: 'third' }), F.num('unitPrice', '단가', { unit: '원', w: 'third' }), F.num('unitVarCost', '단위당 변동비', { unit: '원', w: 'third' }),
        F.calc('bep'),
        F.num('cash', '보유 현금', { unit: '원', w: 'half' }), F.num('burn', '월 순소진액', { unit: '원', w: 'half' }),
        F.calc('runway'),
        F.table('ask', '자금 요청 · 사용 계획', [C('use', '용도', 'text'), C('amount', '금액(원)', 'num', { w: '130px', sum: true }), C('note', '비고', 'area')], { minRows: 2 }),
        F.area('finNote', '재무 가정 메모', { rows: 3 }), F.area('fundingNote', '자금 조달 전략', { rows: 2 }),
      ],
    },
    {
      id: 'team', title: '팀 & 실행', desc: '왜 이 팀이 이 문제를 풀 적임자인지, 그리고 무엇을 언제까지 증명할지.',
      fields: [
        F.table('team', '핵심 팀', [C('name', '이름', 'text', { w: '90px' }), C('role', '역할', 'text', { w: '110px' }), C('exp', '관련 경력 · 역량', 'area')], { minRows: 2 }),
        F.area('teamNote', '채용 · 어드바이저', { rows: 2 }),
        F.table('milestones', '마일스톤', [C('when', '시점', 'text', { w: '90px' }), C('ms', '마일스톤', 'area'), C('metric', '측정 기준', 'text')], { minRows: 3 }),
        F.table('risks', '리스크 & 대응', [C('risk', '리스크', 'area'), C('plan', '대응', 'area')], { minRows: 2 }),
        F.area('riskNote', '리스크 메모', { rows: 2 }),
      ],
    },
  ],
  checks(v) {
    const o = [];
    const ue = calcResult('unitEcon', v); const r = ue?.kpis?.find(k => k.l === 'LTV : CAC');
    if (r && r.lvl !== 'ok') o.push({ lvl: 'warn', msg: `LTV:CAC가 ${r.v}입니다. 고객 한 명을 데려오는 비용 대비 가치가 낮습니다.`, sec: 'model' });
    const t = calcResult('tamsom', v); const fin = tableRows(v.fin);
    const som = isFinite(num(v.tamCount)) ? num(v.tamCount) * num(v.arpa) * num(v.samPct) / 100 * num(v.somPct) / 100 : NaN;
    const y3 = fin[2] ? num(fin[2].rev) : NaN;
    if (isFinite(som) && isFinite(y3) && (y3 > som * 1.5 || y3 < som * 0.5)) o.push({ lvl: 'warn', msg: `3년 차 매출(${fmtWon(y3)}원)과 SOM(${fmtWon(som)}원)이 크게 다릅니다. 둘 중 하나의 가정을 맞추세요.`, sec: 'finance' });
    fin.forEach(row => { const c = num(row.customers), rv = num(row.rev), ar = num(v.arpu); if (isFinite(c) && isFinite(rv) && isFinite(ar) && c > 0) { const implied = rv / c / 12; if (implied > ar * 2 || implied < ar * 0.5) o.push({ lvl: 'warn', msg: `${esc(row.year || '')} 매출 ÷ 고객 수 ÷ 12 = 월 ${fmtN(implied)}원으로 ARPU(${fmtN(ar)}원)와 맞지 않습니다.`, sec: 'finance' }); } });
    if (tableRows(v.competitors).length < 2) o.push({ lvl: 'warn', msg: '경쟁 · 대체재가 2개 미만입니다. “경쟁자가 없다”는 주장은 오히려 신뢰를 떨어뜨립니다.', sec: 'competition' });
    if (!fin.length) o.push({ lvl: 'warn', msg: '연도별 재무 추정이 없습니다.', sec: 'finance' });
    return o;
  },
});

/* ─── 3) Lean Canvas ─── */
registerTemplate({
  id: 'biz-lean', tool: 'biz', name: '린 캔버스', icon: '▦', tag: '가설 검증', titleKey: 'concept',
  desc: 'Ash Maurya의 <b>린 캔버스</b> 9칸을 권장 작성 순서대로 채우고, 가장 위험한 가설을 실험으로 검증하는 계획까지 세웁니다. 출력 시 캔버스 한 장이 표지에 들어갑니다.',
  meta: [['대상', '아이디어 초기 · 피벗 검토 · 팀 정렬'], ['분량', '캔버스 1장 + 실험 계획'], ['핵심 질문', '가장 위험한 가정은 무엇이고, 어떻게 싸게 검증할까?']],
  personas: ['vc', 'customer', 'cfo'],
  aiContext: '린 캔버스다. 각 칸이 서로 일관된지, 문제와 고객이 구체적인지, 가장 위험한 가정이 검증 계획에 들어가 있는지 보라.',
  sections: [
    {
      id: 'customer', title: '고객 & 문제', desc: '린 캔버스는 문제와 고객부터 채웁니다. 번호는 Ash Maurya가 권장한 작성 순서입니다.',
      guide: ['<b>기존 대안</b>: 고객이 지금 이 문제를 어떻게 해결하고 있는지. 이것이 진짜 경쟁자입니다.', '<b>얼리어답터</b>: 문제를 가장 절실하게 느끼고 불완전한 제품이라도 먼저 써볼 사람의 구체적 특징.'],
      fields: [
        F.area('problem', '① 문제 — 상위 1~3개', { req: true, rows: 4, w: 'half' }), F.area('customers', '② 고객군', { req: true, rows: 4, w: 'half' }),
        F.area('alternatives', '① 기존 대안', { rows: 3, w: 'half' }), F.area('earlyAdopters', '② 얼리어답터', { rows: 3, w: 'half' }),
      ],
    },
    {
      id: 'value', title: '가치 & 해결책', desc: '',
      fields: [
        F.area('uvp', '③ 고유 가치 제안 (UVP)', { req: true, rows: 2, ph: '처음 보는 사람이 왜 관심을 가져야 하는지 한 문장' }),
        F.text('concept', '③ 하이레벨 컨셉', { ph: '“X를 위한 Y” 형식. 예: 식당을 위한 쿠팡 로켓배송' }),
        F.area('solution', '④ 해결책 — 문제별 핵심 기능', { req: true, rows: 4 }),
        F.area('channels', '⑤ 채널', { rows: 3, w: 'half' }), F.area('advantage', '⑨ 경쟁 우위 (Unfair Advantage)', { rows: 3, w: 'half', ph: '쉽게 사거나 베낄 수 없는 것. 없다면 비워두는 것이 정직합니다.' }),
      ],
    },
    {
      id: 'numbers', title: '수익 · 비용 · 지표', desc: '',
      fields: [
        F.area('revenue', '⑥ 수익원', { req: true, rows: 3, w: 'half' }), F.area('cost', '⑦ 비용 구조', { rows: 3, w: 'half' }),
        F.area('metrics', '⑧ 핵심 지표', { rows: 3, ph: '사업이 잘 되고 있는지 알려주는 소수의 숫자. 예: 주간 활성 매장 수, 유료 전환율' }),
      ],
    },
    {
      id: 'validate', title: '가설 검증 계획', desc: '캔버스의 모든 칸은 아직 가설입니다. 가장 위험한 것부터 싸게 검증합니다.',
      fields: [
        F.area('riskiest', '가장 위험한 가정', { req: true, rows: 2, ph: '이게 틀리면 사업 전체가 무너지는 가정 하나' }),
        F.table('experiments', '실험 계획', [C('hyp', '가설', 'area'), C('method', '실험 방법', 'area'), C('criteria', '성공 기준 (수치)', 'text'), C('due', '기한', 'date', { w: '130px' }), C('result', '결과', 'area')], { minRows: 2 }),
      ],
    },
  ],
  docExtra(v) {
    const cell = (k, title, sub, area) => `<div style="grid-area:${area}"><b>${title}</b>${esc(v[k] || '')}${sub && v[sub.k] ? `<small><b style="display:inline;color:#6b7280">${sub.l}</b> ${esc(v[sub.k])}</small>` : ''}</div>`;
    return `<div class="canvas" style="grid-template-areas:'p p s s u u a a c c' 'p p m m u u h h c c' 'x x x x x r r r r r'">
      ${cell('problem', '① 문제', { k: 'alternatives', l: '기존 대안' }, 'p')}${cell('solution', '④ 해결책', null, 's')}${cell('metrics', '⑧ 핵심 지표', null, 'm')}
      ${cell('uvp', '③ 고유 가치 제안', { k: 'concept', l: '하이레벨 컨셉' }, 'u')}${cell('advantage', '⑨ 경쟁 우위', null, 'a')}${cell('channels', '⑤ 채널', null, 'h')}
      ${cell('customers', '② 고객군', { k: 'earlyAdopters', l: '얼리어답터' }, 'c')}${cell('cost', '⑦ 비용 구조', null, 'x')}${cell('revenue', '⑥ 수익원', null, 'r')}</div>`;
  },
  checks(v) {
    const o = [];
    if (!v.alternatives) o.push({ lvl: 'warn', msg: '기존 대안이 비어 있습니다. 고객이 지금 쓰는 해결 방법이 실제 경쟁자입니다.', sec: 'customer' });
    if (!v.earlyAdopters) o.push({ lvl: 'warn', msg: '얼리어답터가 비어 있습니다.', sec: 'customer' });
    if (!tableRows(v.experiments).some(r => r.criteria)) o.push({ lvl: 'warn', msg: '성공 기준(수치)이 있는 실험이 없습니다.', sec: 'validate' });
    return o;
  },
});

TOOLS.biz = {
  id: 'biz', name: '사업 계획서', mark: 'B', eyebrow: 'BUSINESS PLAN',
  title: '읽는 사람이 다르면 계획서도 달라야 합니다',
  lead: '정부지원사업 심사위원은 근거와 실행 일정을, 투자자는 시장과 왜 지금인지를, 초기 팀은 가장 위험한 가정을 봅니다. 시장 규모 · 단위 경제성 · 손익분기 · 런웨이는 입력한 숫자로 자동 계산되고, 숫자끼리 안 맞으면 경고합니다.',
  templates: ['biz-psst', 'biz-ir', 'biz-lean'],
  personas: ['judge', 'vc', 'cfo', 'customer'],
};
