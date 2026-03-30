exports.handler = async (event) => {
  const headers = event.headers || {};
  const accept = String(headers.accept || headers.Accept || "").toLowerCase();

  const queryParams = event.queryStringParameters || {};
  const qs = new URLSearchParams(
    Object.entries(queryParams).reduce((acc, [k, v]) => {
      if (v == null) return acc;
      acc[k] = Array.isArray(v) ? v[0] : String(v);
      return acc;
    }, {})
  ).toString();

  const target = `/callback${qs ? `?${qs}` : ""}`;

  const basicAuthHeader =
    headers.authorization || headers.Authorization || headers.AUTHORIZATION || null;

  let basicAuthOk = false;
  if (typeof basicAuthHeader === "string" && basicAuthHeader.toLowerCase().startsWith("basic ")) {
    // Basic auth 검증은 “통과용”으로만 수행하고, 실패해도 무조건 200을 반환합니다.
    // (보안상 실제 사용자/비밀번호 비교 로직은 여기서 하시면 안 됩니다.)
    try {
      const token = basicAuthHeader.slice(6);
      const decoded = Buffer.from(token, "base64").toString("utf8");
      basicAuthOk = decoded.includes(":");
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

