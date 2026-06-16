// OPTIONAL — only needed if calling NVIDIA NIM directly from the browser fails
// with a CORS / network error on GitHub Pages.
//
// Deploy free at https://workers.cloudflare.com  → "Create Worker" → paste this → Deploy.
// Then in src/lib/nimConfig.ts set:
//    export const NIM_PROXY = "https://<your-worker-name>.<account>.workers.dev/v1";
// and rebuild (or edit the same line inside index.html if you only have the built file).
//
// This forwards requests to NVIDIA and adds the CORS headers a browser requires.

const NIM = "https://integrate.api.nvidia.com";

export default {
  async fetch(request) {
    const cors = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    };
    if (request.method === "OPTIONS") return new Response(null, { headers: cors });

    const url = new URL(request.url);
    const target = NIM + url.pathname + url.search; // e.g. /v1/chat/completions

    const resp = await fetch(target, {
      method: request.method,
      headers: request.headers,
      body: request.method === "POST" ? await request.text() : undefined,
    });

    const out = new Response(resp.body, resp);
    Object.entries(cors).forEach(([k, v]) => out.headers.set(k, v));
    return out;
  },
};
