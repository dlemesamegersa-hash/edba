// Defence in depth for downloaded HTML lessons. The WebView also runs with JavaScript disabled,
// a restrictive Content-Security-Policy, and blocks all navigation away from the page.
// Regex sanitising is not a perfect HTML parser: only publish HTML you control.
export function sanitizeHtml(html, registry = {}) {
  let out = String(html)
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/<\s*(script|iframe|frame|frameset|object|embed|applet|form|meta|base|link)\b[\s\S]*?<\s*\/\s*\1\s*>/gi, '')
    .replace(/<\s*(script|iframe|frame|object|embed|applet|form|meta|base|link|input|button)\b[^>]*>/gi, '')
    .replace(/\son[a-z]+\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi, '')
    .replace(/\s(href|src|xlink:href|action|formaction)\s*=\s*(["'])\s*(javascript|vbscript|data:text\/html)[^"']*\2/gi, '')
    .replace(/url\(\s*['"]?\s*(https?:)?\/\/[^)]*\)/gi, 'none')
    .replace(/@import[^;]+;/gi, '');
  // asset:<fileId> lets a lesson reference an image downloaded through the manifest.
  out = out.replace(/src\s*=\s*(["'])asset:([\w-]+)\1/gi, (m, q, id) =>
    registry[id] && registry[id].type === 'image' ? `src=${q}${registry[id].localPath}${q}` : '');
  const head = `<meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">` +
    `<meta http-equiv="Content-Security-Policy" content="default-src 'none'; img-src file: data:; style-src 'unsafe-inline'; font-src data:">` +
    `<style>body{font-family:sans-serif;line-height:1.6;padding:16px;word-wrap:break-word}img{max-width:100%;height:auto}</style>`;
  return `<!DOCTYPE html><html><head>${head}</head><body>${out}</body></html>`;
}
