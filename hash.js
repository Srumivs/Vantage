async function hashContrasena(nick, contrasena) {
  const texto = nick + ':' + contrasena + ':vantage';
  const bytes = new TextEncoder().encode(texto);
  const buffer = await crypto.subtle.digest('SHA-256', bytes);

  return Array.from(new Uint8Array(buffer))
    .map(function (b) { return b.toString(16).padStart(2, '0'); })
    .join('');
}