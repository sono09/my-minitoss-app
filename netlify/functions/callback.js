exports.handler = async (event) => {
  const headers = event.headers || {};
  const accept = String(headers.accept || headers.Accept || "").toLowerCase();

  const queryParams = event.queryStringParameters || {};

  const getBodyParams = () => {
    if (!event.body) return {};

    const rawBody = event.isBase64Encoded
      ? Buffer.from(event.body, "base64").toString("utf8")
      : String(event.body);

    const contentTypeHeader = headers["content-type"] || headers["Content-Type"] || "";
    const contentType = String(contentTypeHeader).toLowerCase();

    try {
      if (contentType.includes("application/json")) {
        const parsed = JSON.parse(rawBody);
        if (!parsed || typeof parsed !== "object") return {};
        const out = {};
        for (const [k, v] of Object.entries(parsed)) {
          if (v == null) continue;
          out[k] = Array.isArray(v) ? v[0] : typeof v === "string" ? v : String(v);
        }
        return out;
      }

      // x-www-form-urlencoded or plain querystring body
      const sp = new URLSearchParams(rawBody);
      const out = {};
      for (const [k, v] of sp.entries()) {
        out[k] = v;
      }
      return out;
    } catch {
      return {};
    }
  };

  const bodyParams = getBodyParams();

  const mergedParams = {
    ...(Object.entries(queryParams).reduce((acc, [k, v]) => {
      if (v == null) return acc;
      acc[k] = Array.isArray(v) ? v[0] : String(v);
      return acc;
    }, {})),
    ...(bodyParams || {}),
  };

  const qs = new URLSearchParams(mergedParams).toString();
  const target = `/callback-ui${qs ? `?${qs}` : ""}`;

  const basicAuthHeader =
    headers.authorization || headers.Authorization || headers.AUTHORIZATION || null;

  let basicAuthOk = false;
  if (typeof basicAuthHeader === "string" && basicAuthHeader.toLowerCase().startsWith("basic ")) {
    // Basic auth 검증은 “통과용”으로만 수행하고, 실패해도 무조건 200을 반환합니다.
    // (보안상 실제 사용자/비밀번호 비교 로직은 여기서 하시면 안 됩니다.)
    try {
      const token = basicAuthHeader.slice(6);
      const decoded = Buffer.from(token, "base64").toString("utf8");
      const idx = decoded.indexOf(":");
      const user = idx >= 0 ? decoded.slice(0, idx) : "";
      const pass = idx >= 0 ? decoded.slice(idx + 1) : "";

      const expectedUser = process.env.BASIC_AUTH_USER;
      const expectedPass = process.env.BASIC_AUTH_PASS;
      if (expectedUser && expectedPass) {
        basicAuthOk = user === expectedUser && pass === expectedPass;
      } else {
        // 환경변수가 없으면 “헤더 존재 + 기본형식(user:pass)만” 검증합니다.
        basicAuthOk = idx >= 0;
      }
    } catch {
      basicAuthOk = false;
    }
  }

  const wantsHtml = accept.includes("text/html") || accept.includes("application/xhtml+xml");

  const jsonBody = JSON.stringify({
    ok: true,
    method: event.httpMethod || "UNKNOWN",
    basicAuthProvided: Boolean(basicAuthHeader),
    basicAuthOk,
    redirectedTo: target,
  });

  const htmlBody = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Callback</title>
  </head>
  <body>
    <script>
      window.location.replace(${JSON.stringify(target)});
    </script>
    <noscript>
      <a href="${target}">Go to callback</a>
    </noscript>
  </body>
</html>`;

  // 요청이 무엇이든(GET/POST) “무조건 200 OK”로 통과시키기 위해 statusCode를 고정합니다.
  return {
    statusCode: 200,
    headers: {
      "content-type": wantsHtml ? "text/html; charset=utf-8" : "application/json; charset=utf-8",
      "cache-control": "no-store",
      "access-control-allow-origin": "*",
      "access-control-allow-methods": "GET,POST,OPTIONS",
      "access-control-allow-headers": "authorization,content-type",
    },
    body: wantsHtml ? htmlBody : jsonBody,
  };
};

