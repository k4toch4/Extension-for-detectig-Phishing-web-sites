function analyzeURL(url) {
  const result = {
    url: url,
    suspicious: false,
    reasons: []
  };

  const parsed = new URL(url);
  const hostname = parsed.hostname;

  // Regla 1 — HTTP
  if (parsed.protocol === 'http:'){
  result.suspicious = true;
  result.reasons.push('It not using HTTPS protocol');
  }

  // Regla 2 — Subdominios
  const subdom = hostname.split('.');
  if (subdom.length > 4){
  result.suspicious = true;
  result.reasons.push('Too many subdomains');
  }

  // Regla 3 — URL larga
  if (url.length > 100){
  result.suspicious = true;
  result.reasons.push('URL too long');
  }

  // Regla 4 — Homógrafos
  if (!/^[a-zA-Z0-9.-]+$/.test(hostname)){
  result.suspicious = true;
  result.reasons.push('The hostname contains suspicious characters');
  }

  return result;
}
