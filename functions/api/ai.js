/**
 * 공용 AI 프록시 — Cloudflare Pages Functions
 *
 * 방문자가 API 키 없이 AI 검토를 쓸 수 있게, 서버에 넣어 둔 Gemini 키로 대신 호출한다.
 * 키는 Cloudflare 환경 변수(Secret)에만 있고 브라우저로 내려가지 않는다.
 *
 * 환경 변수
 *   GEMINI_API_KEY  (필수, Secret)  Google AI Studio에서 발급한 키. 결제를 연결하지 않은 무료 등급 키를 쓰면
 *                                   한도를 넘어도 과금되지 않고 그날 요청이 거절될 뿐이다.
 *   GEMINI_MODEL    (선택)          기본 gemini-3.5-flash-lite
 *   DAILY_LIMIT     (선택)          IP당 하루 요청 수. 기본 30
 * KV 바인딩 (선택)
 *   RATE            있으면 IP당 하루 한도를 정확히 센다. 없으면 서버 인스턴스 메모리로 대략 센다.
 */
const FALLBACK_MODELS = ['gemini-3.5-flash-lite', 'gemini-3.1-flash-lite', 'gemini-2.5-flash-lite'];
const MAX_INPUT_CHARS = 120000;
const MAX_OUTPUT_TOKENS = 6000;
const mem = new Map(); // key → count (인스턴스가 살아 있는 동안만)

const json = (obj, status = 200) => new Response(JSON.stringify(obj), { status, headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' } });

export async function onRequestGet({ env }) {
  return json({ ok: !!env.GEMINI_API_KEY, model: env.GEMINI_MODEL || FALLBACK_MODELS[0] });
}

export async function onRequestPost({ request, env }) {
  if (!env.GEMINI_API_KEY) return json({ error: '공용 AI가 설정되지 않았습니다. 설정에서 본인 API 키를 사용하세요.' }, 503);

  // 다른 사이트가 이 주소를 끌어다 쓰는 것을 막는다 (같은 출처의 요청만 허용)
  const origin = request.headers.get('Origin') || request.headers.get('Referer') || '';
  try { if (new URL(origin).host !== new URL(request.url).host) throw 0; } catch (e) { return json({ error: '허용되지 않은 출처입니다.' }, 403); }

  let body; try { body = await request.json(); } catch (e) { return json({ error: '잘못된 요청입니다.' }, 400); }
  const system = typeof body.system === 'string' ? body.system : '';
  const messages = Array.isArray(body.messages) ? body.messages.filter(m => m && typeof m.content === 'string').slice(-14) : [];
  if (!messages.length) return json({ error: '내용이 없습니다.' }, 400);
  const size = system.length + messages.reduce((a, m) => a + m.content.length, 0);
  if (size > MAX_INPUT_CHARS) return json({ error: '문서가 너무 깁니다. 섹션별 검토를 쓰거나 본인 API 키를 사용하세요.' }, 413);

  // IP당 하루 한도
  const limit = parseInt(env.DAILY_LIMIT || '30', 10);
  const ip = request.headers.get('CF-Connecting-IP') || 'unknown';
  const key = `r:${new Date().toISOString().slice(0, 10)}:${ip}`;
  let used = 0;
  if (env.RATE) { used = parseInt((await env.RATE.get(key)) || '0', 10); }
  else { used = mem.get(key) || 0; if (mem.size > 5000) mem.clear(); }
  if (used >= limit) return json({ error: `오늘 공용 AI 사용 한도(${limit}회)를 다 썼습니다. 내일 다시 쓰거나 설정에서 본인 API 키를 넣으세요.` }, 429);
  if (env.RATE) await env.RATE.put(key, String(used + 1), { expirationTtl: 90000 }); else mem.set(key, used + 1);

  const payload = {
    systemInstruction: system ? { parts: [{ text: system }] } : undefined,
    contents: messages.map(m => ({ role: m.role === 'assistant' ? 'model' : 'user', parts: [{ text: m.content }] })),
    generationConfig: { maxOutputTokens: Math.min(parseInt(body.maxTokens, 10) || 4096, MAX_OUTPUT_TOKENS) },
  };
  const models = [...new Set([env.GEMINI_MODEL, ...FALLBACK_MODELS].filter(Boolean))];
  let lastErr = 'AI 호출에 실패했습니다.';
  for (const model of models) {
    let res, d;
    try {
      res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent`, {
        method: 'POST', headers: { 'Content-Type': 'application/json', 'x-goog-api-key': env.GEMINI_API_KEY }, body: JSON.stringify(payload),
      });
      d = await res.json();
    } catch (e) { lastErr = 'AI 서버에 연결하지 못했습니다.'; continue; }
    if (res.status === 404) { lastErr = `모델 ${model}을 찾을 수 없습니다.`; continue; } // 종료된 모델이면 다음 후보로
    if (res.status === 429) return json({ error: '오늘 공용 AI의 무료 한도가 모두 소진되었습니다. 내일 다시 쓰거나 설정에서 본인 API 키를 넣으세요.' }, 429);
    if (!res.ok || d.error) return json({ error: 'AI 오류: ' + String(d.error?.message || res.status).slice(0, 200) }, 502);
    const text = (d.candidates?.[0]?.content?.parts || []).map(p => p.text || '').join('');
    if (!text) return json({ error: '빈 응답입니다 (' + (d.candidates?.[0]?.finishReason || d.promptFeedback?.blockReason || '사유 불명') + ').' }, 502);
    return json({ text, model });
  }
  return json({ error: lastErr }, 502);
}
