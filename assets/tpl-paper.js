/* ═══════════════════════════════════════════════════════════
   PAPER / REPORT TEMPLATES
   ═══════════════════════════════════════════════════════════ */
Object.assign(PERSONAS, {
  reviewer: { name: '학술지 심사위원', icon: '🧐', desc: '기여 · 논리 · 게재 판정', role: '너는 이 분야 학술지의 심사위원이다. 연구 질문이 명확한지, 선행연구 대비 기여가 분명한지, 방법이 질문에 답할 수 있는지, 결론이 결과를 넘어서 주장하지 않는지 본다.', format: '### 판정 의견 (게재 가 / 수정 후 게재 / 수정 후 재심 / 게재 불가 중 하나와 이유)\n### ① 주요 수정 사항 (Major)\n### ② 부수 수정 사항 (Minor)' },
  method: { name: '연구방법론 전문가', icon: '🔬', desc: '설계 · 표본 · 측정 · 윤리', role: '너는 연구방법론 · 통계 전문가다. 연구 설계와 연구 문제의 정합성, 표본 크기 근거, 측정 도구의 신뢰도 · 타당도, 분석 방법의 적절성, 통계 보고 방식(효과크기 포함), 연구윤리(IRB · 동의)를 본다.', format: '### ① 설계 · 표본 문제\n### ② 측정 · 분석 문제\n### ③ 보고 방식 · 연구윤리' },
  editor: { name: '학술 글쓰기 편집자', icon: '✒️', desc: '구조 · 문장 · 인용', role: '너는 학술 논문 편집자다. 장 구성의 논리 흐름, 문단의 주제문, 모호하거나 과장된 표현, 인용이 필요한 주장, 용어 일관성, 초록의 구성(배경-목적-방법-결과-결론)을 본다.', format: '### ① 구조 · 흐름\n### ② 고쳐야 할 문장 (원문 → 수정안)\n### ③ 인용이 필요한 주장' },
  advisor: { name: '지도교수', icon: '🎓', desc: '범위 · 일정 · 실현 가능성', role: '너는 학부 · 대학원 연구 지도교수다. 연구 범위가 기간과 자원에 맞는지, 학생이 실제로 수행 가능한 방법인지, 제출 형식을 충족하는지 본다.', format: '### ① 범위 · 실현 가능성\n### ② 빠진 필수 요소\n### ③ 다음 미팅까지 할 일' },
});

const P = {
  TYPE: ['학술지 논문', '학술대회 발표 논문', '학위논문 (학사)', '학위논문 (석사)', '학위논문 (박사)', '연구 보고서'],
  DESIGN: ['실험 연구 (집단 비교)', '준실험 연구', '설문 조사 연구', '사용자 연구 (사용성 평가)', '사례 연구', '시스템 개발 및 평가', '문헌 연구 · 체계적 문헌고찰', '질적 연구 (인터뷰 · 관찰)', '혼합 연구', '기타'],
  INSTRUMENTS: [
    { name: 'SUS (System Usability Scale)', v: '사용성', items: '10문항 · 5점 척도 → 0~100점', src: 'Brooke (1996)', note: '평균 약 68점 (Sauro, 2011)' },
    { name: 'SSQ (Simulator Sickness Questionnaire)', v: '사이버 · 시뮬레이터 멀미', items: '16증상 · 0~3점, 메스꺼움 · 안구운동 · 방향감각 3하위척도', src: 'Kennedy et al. (1993)', note: 'VR 연구에서 사전 · 사후 측정이 일반적' },
    { name: 'IPQ (igroup Presence Questionnaire)', v: '프레즌스(현존감)', items: '14문항 · 7점, 일반 · 공간적 현존감 · 몰입 · 실재감', src: 'Schubert, Friedmann, & Regenbrecht (2001)', note: '' },
    { name: 'GEQ (Game Experience Questionnaire)', v: '게임 경험', items: '핵심 모듈 33문항 · 7개 요인 (5점, 0~4)', src: 'IJsselsteijn, de Kort, & Poels (2013)', note: '인게임 · 사후 모듈 별도' },
    { name: 'NASA-TLX', v: '작업 부하', items: '6개 하위척도', src: 'Hart & Staveland (1988)', note: '' },
    { name: 'UEQ (User Experience Questionnaire)', v: '사용자 경험', items: '26문항 · 6개 척도 (7점 의미분별)', src: 'Laugwitz, Held, & Schrepp (2008)', note: '' },
    { name: 'PENS (Player Experience of Need Satisfaction)', v: '플레이어 욕구 충족', items: '역량 · 자율성 · 관계성 · 현존감 · 직관적 조작', src: 'Ryan, Rigby, & Przybylski (2006)', note: '' },
  ],
  info: (extra = []) => ({
    id: 'info', title: '기본 정보 · 초록', desc: '제목 · 저자 · 초록 · 핵심어. 초록은 본문을 다 쓴 뒤 마지막에 다듬는 것이 일반적입니다.',
    guide: ['<b>초록 구성</b>: 배경(1~2문장) → 목적 → 방법(대상 · 도구 · 분석) → 주요 결과(수치 포함) → 결론 · 시사점. 초록만 읽고도 무엇을 했고 무엇을 발견했는지 알 수 있어야 합니다.',
      '<b>분량 · 형식은 투고 규정이 우선</b>입니다. 참고로 APA 7판은 영문 초록 250단어 이내, 핵심어 3~5개를 기본으로 합니다.'],
    fields: [
      F.text('titleKo', '논문 제목 (국문)', { req: true }), F.text('titleEn', '논문 제목 (영문)'),
      F.text('authors', '저자', { req: true, w: 'half', ph: '예: 홍길동, 김연구(교신저자)' }), F.text('affiliation', '소속', { w: 'half' }),
      F.text('venue', '투고 학술지 · 학회', { w: 'third' }), F.text('year', '연도', { w: 'third' }), F.sel('ptype', '논문 유형', P.TYPE, { w: 'third' }),
      ...extra,
      F.area('abstractKo', '국문 초록', { req: true, rows: 7, count: 'chars', hint: '투고 규정의 분량 제한을 확인하세요.' }),
      F.area('abstractEn', '영문 초록 (Abstract)', { rows: 7, count: 'words', max: 250 }),
      F.text('keywordsKo', '핵심어', { req: true, w: 'half', ph: '쉼표로 구분, 3~5개' }), F.text('keywordsEn', 'Keywords', { w: 'half' }),
    ],
  }),
  instruments: () => [
    F.table('instruments', '측정 도구', [C('name', '도구 · 척도', 'text', { w: '22%' }), C('variable', '측정 변인', 'text'), C('items', '문항 수 · 척도', 'text'), C('src', '출처', 'text'), C('alpha', '신뢰도 (α 등)', 'text', { w: '90px' })], { minRows: 1 }),
    F.note(`<b>검증된 척도 빠르게 추가</b> — 게임 · VR · HCI 연구에서 널리 쓰이는 도구입니다. 번안본을 쓴다면 번안 출처와 신뢰도를 따로 적으세요.<div class="btn-row" style="margin-top:8px">${P.INSTRUMENTS.map((x, i) => `<button type="button" class="btn btn-xs" onclick="addInstrument(${i})">${esc(x.name.split(' (')[0])}</button>`).join('')}</div>`, 'tip', { id: 'instlib' }),
  ],
  refs: () => ({
    id: 'refs', title: '참고문헌', desc: '항목별로 입력하면 선택한 인용 스타일로 정리된 목록을 만듭니다. 이미 정리된 목록이 있다면 아래 ‘직접 입력’ 칸에 붙여넣어도 됩니다.',
    guide: ['본문에 인용한 문헌은 모두 목록에 있어야 하고, 목록의 문헌은 모두 본문에 인용되어야 합니다.', 'APA 7판은 DOI가 있으면 https://doi.org/ 형식의 URL로 적습니다. 학술지명과 권(volume)은 기울임체로 표기하므로 최종 원고에서 서식을 적용하세요.', '국내 학술지는 자체 규정(국문 문헌 먼저, 영문 문헌 다음 등)을 두는 경우가 많으니 투고 규정을 확인하세요.'],
    fields: [
      F.sel('refStyle', '인용 스타일', ['APA 7판', 'IEEE', '학회 자체 규정'], { req: true, w: 'half' }),
      F.table('refList', '문헌 목록', [C('type', '유형', 'sel', { o: ['학술지', '학술대회', '단행본', '학위논문', '웹 · 보고서'], w: '100px' }), C('au', '저자', 'text', { ph: '홍길동, 김철수' }), C('yr', '연도', 'text', { w: '60px' }), C('title', '제목', 'area'), C('src', '학술지 · 학회 · 출판사', 'text'), C('vol', '권(호)', 'text', { w: '70px', ph: '18(2)' }), C('pp', '쪽', 'text', { w: '70px', ph: '45-58' }), C('doi', 'DOI · URL', 'text')], { minRows: 2, hideInDoc: true }),
      F.calc('refFormat'),
      F.area('refsRaw', '직접 입력한 참고문헌', { rows: 6, ph: '한 줄에 하나씩' }),
    ],
  }),
};
function addInstrument(i) {
  const x = P.INSTRUMENTS[i]; const v = App.doc.values; const rows = (v.instruments || []).filter(r => r && Object.values(r).some(c => String(c || '').trim()));
  if (rows.some(r => r.name === x.name)) return toast('이미 추가된 도구입니다.', 'warn');
  rows.push({ name: x.name, variable: x.v, items: x.items, src: x.src + (x.note ? ` · ${x.note}` : ''), alpha: '' });
  v.instruments = rows; rerenderField('instruments'); markDirty(); toast(`${x.name.split(' (')[0]} 추가 — 신뢰도는 본인 데이터로 계산해 넣으세요.`, 'ok', 3500);
}
function fmtRef(r, style, n) {
  const au = (r.au || '').trim(), yr = (r.yr || 'n.d.').trim(), t = (r.title || '').trim(), s = (r.src || '').trim(), vol = (r.vol || '').trim(), pp = (r.pp || '').trim();
  let doi = (r.doi || '').trim(); if (/^10\.\d+\//.test(doi)) doi = 'https://doi.org/' + doi;
  if (style === 'IEEE') {
    const m = vol.match(/^([^()]+)(?:\(([^)]+)\))?/); const v = m ? m[1].trim() : '', no = m && m[2] ? m[2] : '';
    if (r.type === '단행본') return `[${n}] ${au}, ${t}. ${s}, ${yr}.`;
    if (r.type === '학술대회') return `[${n}] ${au}, "${t}," in ${s}, ${yr}${pp ? `, pp. ${pp}` : ''}.${doi ? ' ' + doi : ''}`;
    if (r.type === '웹 · 보고서') return `[${n}] ${au}, "${t}," ${s}, ${yr}. [Online]. Available: ${doi}`;
    if (r.type === '학위논문') return `[${n}] ${au}, "${t}," Thesis, ${s}, ${yr}.`;
    return `[${n}] ${au}, "${t}," ${s}${v ? `, vol. ${v}` : ''}${no ? `, no. ${no}` : ''}${pp ? `, pp. ${pp}` : ''}, ${yr}${doi ? `, doi: ${doi.replace('https://doi.org/', '')}` : ''}.`;
  }
  const A = au ? `${au} (${yr}). ` : `${t}. (${yr}). `; const T = au ? `${t}. ` : '';
  if (r.type === '단행본') return `${A}${T}${s}.${doi ? ' ' + doi : ''}`;
  if (r.type === '학술대회') return `${A}${T}${s}${pp ? `, ${pp}` : ''}.${doi ? ' ' + doi : ''}`;
  if (r.type === '학위논문') return `${A}${t} [학위논문, ${s}].${doi ? ' ' + doi : ''}`;
  if (r.type === '웹 · 보고서') return `${A}${T}${s ? s + '. ' : ''}${doi}`;
  return `${A}${T}${s}${vol ? `, ${vol}` : ''}${pp ? `, ${pp}` : ''}.${doi ? ' ' + doi : ''}`;
}
CALCS.refFormat = {
  title: '정리된 참고문헌',
  compute(v) {
    const rows = tableRows(v.refList).filter(r => r.title || r.au); const style = v.refStyle === 'IEEE' ? 'IEEE' : 'APA';
    if (!rows.length) return { kpis: [], note: '문헌을 입력하면 여기에 정리된 목록이 생성됩니다. 출력 문서에는 이 목록이 들어갑니다.' };
    let list = rows.slice();
    if (style === 'APA') list.sort((a, b) => { const ha = /[가-힣]/.test(a.au || a.title) ? 0 : 1, hb = /[가-힣]/.test(b.au || b.title) ? 0 : 1; return ha - hb || String(a.au || a.title).localeCompare(String(b.au || b.title), 'ko'); });
    const out = list.map((r, i) => fmtRef(r, style, i + 1));
    const miss = rows.filter(r => !r.au || !r.yr || !r.title || !r.src).length;
    return { kpis: [{ l: '문헌 수', v: rows.length + '편' }, { l: '스타일', v: style === 'IEEE' ? 'IEEE (인용 순)' : 'APA 7 (국문→영문, 가나다·ABC순)' }, ...(miss ? [{ l: '필수 정보 누락', v: miss + '편', lvl: 'warn', s: '저자 · 연도 · 제목 · 출처' }] : [])], lines: out.map(esc), docLines: out, docOnlyLines: true };
  },
};
function paperChecks(v, o = []) {
  const kw = String(v.keywordsKo || '').split(/[,，;]/).map(s => s.trim()).filter(Boolean);
  if (kw.length && (kw.length < 3 || kw.length > 6)) o.push({ lvl: 'warn', msg: `핵심어가 ${kw.length}개입니다. 일반적으로 3~5개를 씁니다 (투고 규정 확인).`, sec: 'info' });
  const w = String(v.abstractEn || '').trim().split(/\s+/).filter(Boolean).length; if (w > 250) o.push({ lvl: 'warn', msg: `영문 초록이 ${w}단어입니다 (APA 기준 250단어 이내).`, sec: 'info' });
  if (v.abstractKo && !/\d/.test(v.abstractKo) && v.result1) o.push({ lvl: 'warn', msg: '국문 초록에 결과 수치가 없습니다. 주요 결과를 수치로 요약하세요.', sec: 'info' });
  const refs = tableRows(v.refList).length + String(v.refsRaw || '').split('\n').filter(s => s.trim()).length;
  if (refs < 5) o.push({ lvl: 'warn', msg: `참고문헌이 ${refs}편입니다.`, sec: 'refs' });
  return o;
}

/* ─── 1) 실증 연구 논문 (IMRaD) ─── */
const paperMethodSection = () => ({
  id: 'method', title: '연구 방법', desc: '다른 연구자가 같은 절차로 재현할 수 있을 만큼 구체적으로 씁니다.',
  guide: ['<b>표본 크기 근거</b>: 통계 검정을 한다면 G*Power 등으로 검정력 분석(효과크기 · 유의수준 · 검정력)을 해 필요한 표본 수를 제시하는 것이 일반적입니다.',
    '<b>연구윤리</b>: 사람을 대상으로 하는 연구는 소속 기관 생명윤리위원회(IRB)의 심의 또는 면제 확인이 필요할 수 있습니다(「생명윤리 및 안전에 관한 법률」). 학부 연구라도 투고 · 발표 전에 기관 규정을 확인하세요.'],
  fields: [
    F.sel('design', '연구 설계', P.DESIGN, { req: true, w: 'half' }), F.text('variables', '독립 · 종속 변인', { w: 'half', ph: '예: IV 이동 방식(텔레포트/스무스) · DV 멀미, 현존감' }),
    F.area('designDetail', '설계 상세', { rows: 3, ph: '집단 간/집단 내, 조건 수, 순서 효과 통제(역균형화) 등' }),
    F.area('participants', '연구 대상', { req: true, rows: 3, w: 'half', ph: 'N, 모집 방법, 포함 · 제외 기준, 인구통계' }),
    F.area('sampleRationale', '표본 크기 근거', { rows: 3, w: 'half', ph: '예: G*Power 3.1, 효과크기 f = 0.25, α = .05, 검정력 .80 → 최소 N = 34' }),
    ...P.instruments(),
    F.area('apparatus', '실험 환경 · 장비 · 소프트웨어', { rows: 3, ph: '예: Meta Quest 3, Unity 6000.0, XR Interaction Toolkit 3.x, 실험실 3×3m' }),
    F.area('procedure', '연구 절차', { req: true, rows: 4, ph: '동의 → 사전 설문 → 연습 → 과제 → 사후 설문 → 인터뷰 (소요 시간)' }),
    F.area('collect', '데이터 수집 방법', { rows: 3, w: 'half' }), F.area('analysis', '분석 방법', { req: true, rows: 3, w: 'half', ph: '예: SPSS 29, 대응표본 t-검정, 유의수준 .05, 효과크기 Cohen’s d' }),
    F.check('ethics', '연구윤리', ['IRB 승인 또는 면제 확인', '참여자 서면 동의', '중도 철회 권리 고지', '개인정보 비식별화', '데이터 보관 기간 · 폐기 방법 명시', '보상 내역 명시']),
    F.text('irbNo', 'IRB 승인 번호', { w: 'half' }),
  ],
});
registerTemplate({
  id: 'paper-empirical', tool: 'paper', name: '실증 연구 논문', icon: '∑', tag: 'IMRaD', titleKey: 'titleKo',
  desc: '서론 → 이론적 배경 → 방법 → 결과 → 논의의 <b>IMRaD</b> 구조. 실험 · 설문 · 사용자 연구로 가설을 검증하는 학술지 · 학위 논문용입니다.',
  meta: [['대상', '학술지 투고 · 학위논문 · 사용자 연구'], ['구조', 'Introduction · Method · Results · Discussion'], ['핵심 질문', '연구 질문에 데이터로 답했는가?']],
  personas: ['reviewer', 'method', 'editor', 'advisor'],
  aiContext: '실증 연구 논문(IMRaD)이다. 연구 질문 · 방법 · 결과 · 결론의 정합성을 엄격히 보라.',
  sections: [
    P.info(),
    {
      id: 'intro', title: '서론', desc: '넓은 배경에서 좁은 연구 질문으로 좁혀 들어갑니다.',
      guide: ['서론의 흐름: 배경 → 기존 연구의 한계(연구 공백) → 이 연구의 목적 → 연구 문제 · 가설 → 논문 구성.', '연구 문제는 방법 · 결과 섹션에서 하나씩 답해져야 합니다. 답하지 않을 질문은 쓰지 마세요.'],
      fields: [
        F.area('background', '연구 배경', { req: true, rows: 5 }), F.area('problem', '문제 제기 · 연구 필요성', { req: true, rows: 4 }),
        F.area('objective', '연구 목적', { req: true, rows: 3 }),
        F.table('rq', '연구 문제 · 가설', [C('kind', '구분', 'sel', { o: ['RQ', 'H'], w: '70px' }), C('text', '내용', 'area')], { minRows: 2 }),
        F.area('scope', '연구 범위', { rows: 2, w: 'half' }), F.area('structure', '논문 구성', { rows: 2, w: 'half' }),
      ],
    },
    {
      id: 'theory', title: '이론적 배경 · 선행연구', desc: '나열이 아니라, 선행연구를 비교 · 종합해 이 연구가 채울 공백을 드러냅니다.',
      guide: ['<b>문헌 매트릭스</b>로 선행연구를 같은 기준(대상 · 방법 · 결과)으로 정리하면 공백이 보입니다. 표의 마지막 열 “본 연구와의 관계”가 서론의 연구 필요성과 연결되어야 합니다.'],
      fields: [
        F.area('theory', '핵심 이론 · 개념', { req: true, rows: 5 }),
        F.table('reviews', '선행연구 매트릭스', [C('cite', '저자 (연도)', 'text', { w: '120px' }), C('subject', '대상 · 방법', 'area'), C('finding', '주요 결과', 'area'), C('relation', '본 연구와의 관계', 'area')], { minRows: 3 }),
        F.area('reviewNote', '선행연구 종합 서술', { rows: 5 }),
        F.area('gap', '연구 공백 (본 연구의 위치)', { req: true, rows: 3 }),
      ],
    },
    paperMethodSection(),
    {
      id: 'results', title: '연구 결과', desc: '해석 없이 결과만 제시합니다. 해석은 논의에서.',
      guide: ['통계 결과는 검정통계량 · 자유도 · p값 · 효과크기를 함께 보고합니다. 예: <i>t</i>(28) = 2.45, <i>p</i> = .021, <i>d</i> = 0.89 (APA 형식).', '연구 문제 순서대로 결과를 배치하면 읽는 사람이 따라가기 쉽습니다.'],
      fields: [
        F.area('descriptive', '기술통계 · 참여자 특성', { rows: 3 }),
        F.area('result1', '결과 1', { req: true, rows: 4 }), F.area('result2', '결과 2', { rows: 4 }), F.area('result3', '결과 3', { rows: 3 }),
        F.table('figures', '표 · 그림 목록', [C('no', '번호', 'text', { w: '70px', ph: '표 1' }), C('title', '제목', 'text'), C('note', '내용 · 비고', 'area')], { minRows: 1 }),
        F.area('figuresNote', '표 · 그림 메모', { rows: 2 }),
      ],
    },
    {
      id: 'discussion', title: '논의 · 결론', desc: '결과가 무엇을 의미하는지, 선행연구와 무엇이 같고 다른지, 무엇을 주장할 수 없는지.',
      fields: [
        F.area('interpretation', '결과 해석', { req: true, rows: 5 }), F.area('comparison', '선행연구와의 비교', { rows: 4 }),
        F.area('contribution', '학술적 · 실무적 시사점', { rows: 3 }), F.area('limitations', '연구의 한계', { req: true, rows: 3, w: 'half' }), F.area('future', '후속 연구 제안', { rows: 3, w: 'half' }),
        F.area('conclusion', '결론', { req: true, rows: 4 }),
      ],
    },
    P.refs(),
  ],
  checks(v) {
    const o = [];
    if (!tableRows(v.rq).length) o.push({ lvl: 'err', msg: '연구 문제 · 가설이 없습니다.', sec: 'intro' });
    if (!tableRows(v.instruments).length && /실험|설문|사용자|준실험/.test(v.design || '')) o.push({ lvl: 'warn', msg: '측정 도구가 정의되지 않았습니다.', sec: 'method' });
    if (/실험|설문|사용자|준실험|질적|혼합/.test(v.design || '') && !(v.ethics || []).length) o.push({ lvl: 'warn', msg: '사람을 대상으로 하는 설계인데 연구윤리 항목이 비어 있습니다.', sec: 'method' });
    if (!v.sampleRationale && /실험|설문|준실험/.test(v.design || '')) o.push({ lvl: 'warn', msg: '표본 크기 근거가 없습니다.', sec: 'method' });
    if (/p\s*[<=]/.test((v.result1 || '') + (v.result2 || '')) && !/[dηrfω]\s*=|효과크기|eta|η/.test((v.result1 || '') + (v.result2 || '') + (v.result3 || ''))) o.push({ lvl: 'warn', msg: 'p값은 있지만 효과크기 보고가 보이지 않습니다.', sec: 'results' });
    if (tableRows(v.reviews).length < 3) o.push({ lvl: 'warn', msg: '선행연구 매트릭스가 3편 미만입니다.', sec: 'theory' });
    return paperChecks(v, o);
  },
});

/* ─── 2) 개발 · 구현형 논문 ─── */
registerTemplate({
  id: 'paper-dev', tool: 'paper', name: '개발 · 구현형 논문', icon: '⌘', tag: '게임 · VR · 시스템', titleKey: 'titleKo',
  desc: '게임 · VR 콘텐츠 · 소프트웨어를 <b>설계 · 구현하고 평가</b>한 연구. 국내 학술대회 발표 논문과 공학 계열 학부 논문에서 많이 쓰는 구조입니다.',
  meta: [['대상', '학술대회 발표 · 공학 학부 논문 · 작품 논문'], ['구조', '서론 · 관련연구 · 설계 · 구현 · 평가 · 결론'], ['핵심 질문', '무엇을 새로 만들었고, 그것이 의도대로 작동함을 어떻게 보였는가?']],
  personas: ['reviewer', 'method', 'editor', 'advisor'],
  aiContext: '시스템 · 콘텐츠 개발형 논문이다. 기여(새로운 점)가 분명한지, 설계 결정에 근거가 있는지, 평가가 기여를 뒷받침하는지 보라. 단순 제작 보고서처럼 읽히는 부분을 지적하라.',
  sections: [
    P.info(),
    {
      id: 'intro', title: '서론', desc: '',
      guide: ['개발형 논문이 “제작 보고서”와 다른 점은 <b>기여(contribution)</b>입니다. 서론 끝에 “본 논문의 기여는 다음과 같다: (1)… (2)…”처럼 명시하세요.'],
      fields: [
        F.area('background', '연구 배경', { req: true, rows: 4 }), F.area('problem', '문제 · 필요성', { req: true, rows: 4 }), F.area('objective', '연구 목적', { req: true, rows: 3 }),
        F.table('contribs', '본 논문의 기여', [C('c', '기여', 'area')], { minRows: 2 }),
      ],
    },
    {
      id: 'related', title: '관련 연구', desc: '비슷한 시스템 · 콘텐츠와 비교해 무엇이 새로운지 표로 보여줍니다.',
      fields: [
        F.table('reviews', '관련 연구 · 사례', [C('cite', '저자 (연도) · 사례명', 'text', { w: '150px' }), C('subject', '내용 · 방식', 'area'), C('limit', '한계', 'area'), C('relation', '본 연구와의 차이', 'area')], { minRows: 3 }),
        F.area('reviewNote', '관련 연구 종합', { rows: 4 }), F.area('gap', '차별점', { req: true, rows: 3 }),
      ],
    },
    {
      id: 'design', title: '시스템 설계', desc: '요구사항에서 설계 결정까지 — 왜 그렇게 설계했는지가 핵심입니다.',
      fields: [
        F.table('requirements', '요구사항', [C('id', 'ID', 'text', { w: '60px', ph: 'R1' }), C('req', '요구사항', 'area'), C('kind', '유형', 'sel', { o: ['기능', '비기능 (성능 · 사용성 등)'], w: '140px' }), C('verify', '검증 방법', 'text')], { minRows: 3 }),
        F.area('architecture', '시스템 구조', { req: true, rows: 5, ph: '구성 요소와 데이터 흐름 (그림 1 참고 형식으로)' }),
        F.area('decisions', '주요 설계 결정과 근거', { rows: 4, ph: '예: 이동 방식으로 팔 흔들기를 택함 — 텔레포트 대비 현존감 유지, 스무스 이동 대비 멀미 감소를 보고한 선행연구 근거' }),
      ],
    },
    {
      id: 'impl', title: '구현', desc: '재현에 필요한 수준으로. 코드 나열보다 핵심 알고리즘 · 처리 흐름을 설명합니다.',
      fields: [
        F.area('apparatus', '개발 환경', { req: true, rows: 3, ph: '엔진 · SDK · 버전, 하드웨어, 주요 라이브러리' }),
        F.area('implementation', '핵심 구현', { req: true, rows: 6 }), F.area('algorithms', '핵심 알고리즘 · 수식', { rows: 4 }),
        F.table('figures', '표 · 그림 목록', [C('no', '번호', 'text', { w: '70px' }), C('title', '제목', 'text'), C('note', '내용', 'area')], { minRows: 1 }),
      ],
    },
    {
      id: 'eval', title: '평가', desc: '기여마다 그것을 뒷받침하는 평가가 있어야 합니다 — 성능 측정, 사용자 평가, 또는 둘 다.',
      guide: ['성능 평가: 측정 조건(기기 · 씬 · 반복 횟수)과 평균 · 표준편차를 함께 제시합니다. 예: 평균 71.8fps (SD 1.2), Quest 3, 5회 측정.',
        '사용자 평가는 실증 연구와 같은 기준(대상 · 도구 · 절차 · 분석 · 윤리)을 따릅니다. 아래 측정 도구 버튼으로 검증된 척도를 추가할 수 있습니다.'],
      fields: [
        F.area('evalGoal', '평가 목적 (어떤 기여를 검증하는가)', { req: true, rows: 2 }),
        F.area('perf', '성능 평가', { rows: 3 }),
        F.area('participants', '사용자 평가 참여자', { rows: 2, w: 'half' }), F.area('procedure', '평가 절차', { rows: 2, w: 'half' }),
        ...P.instruments(),
        F.area('analysis', '분석 방법', { rows: 2, w: 'half' }), F.check('ethics', '연구윤리', ['IRB 승인 또는 면제 확인', '참여자 서면 동의', '개인정보 비식별화'], { w: 'half' }),
        F.area('result1', '평가 결과', { req: true, rows: 5 }), F.area('result2', '정성 피드백 · 관찰', { rows: 3 }),
      ],
    },
    {
      id: 'discussion', title: '결론', desc: '',
      fields: [F.area('conclusion', '결론 · 요약', { req: true, rows: 4 }), F.area('limitations', '한계', { req: true, rows: 3, w: 'half' }), F.area('future', '향후 연구', { rows: 3, w: 'half' })],
    },
    P.refs(),
  ],
  checks(v) {
    const o = [];
    if (!tableRows(v.contribs).length) o.push({ lvl: 'err', msg: '기여(contribution)가 명시되지 않았습니다. 개발형 논문의 핵심입니다.', sec: 'intro' });
    if (!v.decisions) o.push({ lvl: 'warn', msg: '설계 결정의 근거가 없습니다. “왜 이렇게 만들었는가”가 없으면 제작 보고서로 읽힙니다.', sec: 'design' });
    if (tableRows(v.requirements).some(r => r.req && !r.verify)) o.push({ lvl: 'warn', msg: '검증 방법이 없는 요구사항이 있습니다.', sec: 'design' });
    return paperChecks(v, o);
  },
});

/* ─── 3) 연구 · 프로젝트 보고서 ─── */
registerTemplate({
  id: 'paper-report', tool: 'paper', name: '연구 · 프로젝트 보고서', icon: '▤', tag: '과제 제출', titleKey: 'title',
  desc: '수업 프로젝트 · 연구 과제 · 공모전 결과 보고서. 계획 대비 실적과 <b>역할별 기여</b>를 함께 보고합니다.',
  meta: [['대상', '수업 최종 보고서 · 과제 결과보고 · 공모전'], ['분량', '5~20쪽'], ['핵심 질문', '무엇을 계획했고, 무엇을 해냈고, 무엇을 배웠는가?']],
  personas: ['advisor', 'editor', 'reviewer'],
  sections: [
    {
      id: 'info', title: '기본 정보 · 요약', desc: '',
      fields: [
        F.text('title', '보고서 제목', { req: true }), F.text('authors', '작성자 · 팀', { w: 'half' }), F.text('org', '제출처 · 과목', { w: 'half' }),
        F.text('submitDate', '제출일', { w: 'half' }), F.text('advisor', '지도교수 · 담당자', { w: 'half' }),
        F.area('summary', '요약', { req: true, rows: 4, count: 'chars', hint: '목적 · 방법 · 핵심 결과를 한 문단으로' }),
      ],
    },
    {
      id: 'body', title: '목적 · 방법 · 수행 내용', desc: '',
      fields: [F.area('background', '목적 및 배경', { req: true, rows: 4 }), F.area('method', '수행 방법 · 도구', { req: true, rows: 4 }), F.area('implementation', '주요 수행 · 구현 내용', { req: true, rows: 6 })],
    },
    {
      id: 'results', title: '결과 · 평가', desc: '',
      fields: [
        F.area('results', '결과', { req: true, rows: 5 }), F.area('evaluation', '평가 · 검증', { rows: 4 }),
        F.table('planVsActual', '계획 대비 실적', [C('item', '항목', 'text'), C('plan', '계획', 'area'), C('actual', '실적', 'area'), C('rate', '달성', 'sel', { o: ['달성', '부분 달성', '미달성', '변경'], w: '100px' })], { minRows: 2 }),
      ],
    },
    {
      id: 'team', title: '역할 분담 · 회고', desc: '',
      fields: [
        F.table('roles', '역할 · 기여', [C('name', '이름', 'text', { w: '90px' }), C('role', '담당', 'area'), C('pct', '기여도(%)', 'num', { w: '90px', sum: true })], { minRows: 2 }),
        F.area('contribution', '기여점 · 의의', { rows: 3, w: 'half' }), F.area('future', '한계 · 향후 계획', { rows: 3, w: 'half' }),
        F.area('lessons', '배운 점 · 회고', { rows: 3 }),
      ],
    },
    P.refs(),
  ],
  checks(v) {
    const o = []; const pct = colSum(v.roles, 'pct');
    if (tableRows(v.roles).length && Math.abs(pct - 100) > 0.5) o.push({ lvl: 'warn', msg: `기여도 합계가 ${fmtN(pct, 1)}%입니다 (100% 기준).`, sec: 'team' });
    return o;
  },
});

/* ─── 4) 연구 계획서 ─── */
registerTemplate({
  id: 'paper-proposal', tool: 'paper', name: '연구 계획서', icon: '◇', tag: '제안 · 졸업논문 준비', titleKey: 'title',
  desc: '졸업논문 · 대학원 진학 · 연구 과제 신청 전 <b>무엇을, 왜, 어떻게, 언제까지</b> 할지 합의하는 문서. 지도교수 면담 전에 쓰면 면담 시간이 짧아집니다.',
  meta: [['대상', '졸업논문 계획 · 연구 과제 신청 · 대학원 지원'], ['분량', '3~8쪽'], ['핵심 질문', '이 질문에 이 방법으로 기간 안에 답할 수 있는가?']],
  personas: ['advisor', 'method', 'reviewer'],
  sections: [
    {
      id: 'info', title: '연구 개요', desc: '',
      fields: [F.text('title', '연구 제목 (가제)', { req: true }), F.text('authors', '연구자', { w: 'half' }), F.text('advisor', '지도교수', { w: 'half' }), F.area('summary', '연구 요약', { req: true, rows: 4 })],
    },
    {
      id: 'why', title: '배경 · 목적 · 연구 문제', desc: '',
      fields: [
        F.area('background', '연구 배경 · 필요성', { req: true, rows: 5 }), F.area('gap', '선행연구와 연구 공백', { rows: 4 }), F.area('objective', '연구 목적', { req: true, rows: 3 }),
        F.table('rq', '연구 문제 · 가설', [C('kind', '구분', 'sel', { o: ['RQ', 'H'], w: '70px' }), C('text', '내용', 'area')], { minRows: 2 }),
      ],
    },
    {
      id: 'how', title: '연구 방법', desc: '',
      fields: [
        F.sel('design', '연구 설계', P.DESIGN, { req: true, w: 'half' }), F.area('participants', '대상 · 자료', { rows: 2, w: 'half' }),
        F.area('procedure', '방법 · 절차', { req: true, rows: 5 }), ...P.instruments(), F.area('analysis', '분석 계획', { rows: 3 }),
        F.check('ethics', '윤리 · 승인', ['IRB 심의 필요 여부 확인', '데이터 수집 동의 계획', '개인정보 처리 계획']),
      ],
    },
    {
      id: 'when', title: '일정 · 기대 효과', desc: '',
      fields: [
        F.table('schedule', '연구 일정', [C('period', '기간', 'text', { w: '120px' }), C('task', '내용', 'area'), C('output', '산출물', 'text')], { minRows: 4 }),
        F.table('budget', '소요 예산 (해당 시)', [C('item', '항목', 'text'), C('basis', '산출 근거', 'area'), C('amount', '금액(원)', 'num', { w: '120px', sum: true })], { minRows: 1 }),
        F.area('expected', '기대 효과 · 활용 방안', { rows: 3 }),
      ],
    },
    P.refs(),
  ],
  checks(v) {
    const o = [];
    if (!tableRows(v.rq).length) o.push({ lvl: 'err', msg: '연구 문제가 없습니다.', sec: 'why' });
    if (tableRows(v.schedule).length < 3) o.push({ lvl: 'warn', msg: '연구 일정이 3단계 미만입니다.', sec: 'when' });
    return o;
  },
});

TOOLS.paper = {
  id: 'paper', name: '논문 · 보고서', mark: 'P', eyebrow: 'ACADEMIC WRITING',
  title: '연구 유형에 맞는 구조로 쓰세요',
  lead: '실증 연구는 IMRaD, 게임 · VR 같은 개발 연구는 설계 · 구현 · 평가, 과제 보고서는 계획 대비 실적이 뼈대입니다. 검증된 측정 도구(SUS · SSQ · IPQ · GEQ 등)를 바로 추가하고, 참고문헌은 항목별로 입력하면 APA 7 · IEEE 형식으로 정리됩니다.',
  templates: ['paper-empirical', 'paper-dev', 'paper-report', 'paper-proposal'],
  personas: ['reviewer', 'method', 'editor', 'advisor'],
};
