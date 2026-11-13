# Document Hub

게임 기획서 · 사업계획서 · 논문을 위한 문서 양식 도구. 설치 · 로그인 없이 브라우저에서 바로 쓰고, 문서는 사용자의 브라우저에만 저장됩니다.

- **양식 14종** — 게임(1페이지 · 졸업작품 · 인디 · 실무 · 시스템 기획서 · 역기획서 · 플레이테스트 보고서), 사업(PSST · 투자/표준 · 린 캔버스), 논문(실증 · 개발형 · 보고서 · 연구 계획서)
- **채워진 예시**, 필수 항목 · 모순 · 모호한 표현 **자동 점검**, 손익분기 · 시장 규모 · 테스트 커버리지 등 **계산기**
- 표는 **엑셀 · 구글 시트와 복사/붙여넣기**, 문서는 Word · PDF · Markdown(노션) · HTML로 내보내기
- 서버 없이 동작하는 **공유 링크**(문서가 링크 안에 압축되어 들어감)
- 관점별 **AI 검토**(공용 AI 또는 본인 API 키)

## 구조

```
index.html            허브(첫 화면)
GameDesign.html       게임 기획서 도구
BusinessPlan.html     사업 계획서 도구
Paper.html            논문 · 보고서 도구
assets/
  core.js             저장 · AI · 내보내기 · 공유 · 양식 엔진
  editor.js           편집 화면
  hub.js              첫 화면
  tpl-game.js / tpl-biz.js / tpl-paper.js   양식 정의
  samples.js          예시 문서
  app.css
functions/api/ai.js   공용 AI 프록시 (Cloudflare Pages Functions)
```

빌드 과정이 없습니다. 파일을 그대로 올리면 됩니다. 내 컴퓨터에서는 `index.html`을 더블클릭해도 동작합니다(공용 AI와 공유 링크 전달만 제외).

## 배포 (Cloudflare Pages · 무료)

1. Cloudflare 대시보드 → **Workers & Pages → Create → Pages → Connect to Git** → 이 저장소 선택
2. Build 설정: Framework preset **None**, Build command **비움**, Build output directory **`/`**
3. **Save and Deploy** → `https://<프로젝트 이름>.pages.dev` 주소가 생깁니다. 이후 `main`에 push하면 자동 재배포됩니다.

## 공용 AI 켜기 (선택 · 비용 0원으로 운영 가능)

방문자가 키 없이 AI 검토를 쓰게 하려면 서버에 Gemini 키를 넣습니다. 키는 브라우저로 내려가지 않습니다.

1. [Google AI Studio](https://aistudio.google.com/apikey)에서 API 키 발급. **결제(billing)를 연결하지 않은 프로젝트의 키**를 쓰면 무료 한도를 넘어도 과금되지 않고 그날 요청만 거절됩니다.
2. Cloudflare Pages 프로젝트 → **Settings → Variables and Secrets** → `GEMINI_API_KEY` 를 **Secret**으로 추가 → 재배포
3. 선택 변수: `GEMINI_MODEL`(기본 `gemini-3.5-flash-lite`), `DAILY_LIMIT`(IP당 하루 요청 수, 기본 30)
4. 선택: KV 네임스페이스를 만들어 `RATE` 이름으로 바인딩하면 IP당 한도를 정확히 셉니다.

무료 등급 키는 Google 정책상 입력이 서비스 개선에 쓰일 수 있어, 사이트 안에서 이 점을 안내하고 민감한 문서는 본인 키를 쓰도록 권합니다.

### 비용 참고 (2026-11 기준, 변동 가능)

| 모델 | 입력 / 출력 (100만 토큰당) | 무료 등급 |
|---|---|---|
| gemini-3.5-flash-lite | $0.30 / $2.50 | 있음 |
| gemini-2.5-flash-lite | $0.10 / $0.40 | 있음 |
| claude-haiku-5-5 | $0.10 / $0.50 | 없음 |

문서 전체 검토 1회는 대략 입력 8천 · 출력 1.5천 토큰으로, 유료로 써도 1회에 약 10원 안팎입니다.

## 데이터

- 문서 · 설정 · API 키: 브라우저 localStorage (`dh_` 접두사)
- 서버에 저장되는 것: 없음 (공용 AI 사용 시 IP별 하루 사용 횟수만 집계)

## 의견

빠진 항목, 틀린 내용, 필요한 양식은 Issues에 남겨 주세요.
