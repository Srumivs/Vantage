const nickMiembros = localStorage.getItem('nickVantage');
const contrasenaMiembros = localStorage.getItem('contrasenaVantage');

if (!nickMiembros || !contrasenaMiembros) {
  window.location.href = 'login.html';
}

const listaMiembros = document.getElementById('lista-miembros');
const contadorMiembros = document.getElementById('contador-miembros');
const mensajeMiembros = document.getElementById('mensaje-miembros');

mensajeMiembros.textContent = 'Cargando miembros...';

fetch(APPS_SCRIPT_URL, {
  method: 'POST',
  headers: { 'Content-Type': 'text/plain;charset=utf-8' },
  body: JSON.stringify({
    accion: 'obtener_miembros',
    nick: nickMiembros,
    contrasena: contrasenaMiembros
  })
})
  .then(function (respuesta) { return respuesta.json(); })
  .then(function (resultado) {
    if (resultado.status !== 'ok') {
      mensajeMiembros.textContent = resultado.message || 'No se pudo cargar la lista';
      return;
    }

    mensajeMiembros.textContent = '';
    contadorMiembros.textContent = resultado.miembros.length + ' miembros';

    resultado.miembros.forEach(function (nombre) {
      const li = document.createElement('li');
      const span = document.createElement('span');
      span.className = 'nombre-miembro';
      span.textContent = nombre;
      li.appendChild(span);
      listaMiembros.appendChild(li);
    });
  })
  .catch(function () {
    mensajeMiembros.textContent = 'No se pudo conectar.';
  });