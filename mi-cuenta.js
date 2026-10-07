const nickCuenta = localStorage.getItem('nickVantage');
const contrasenaCuenta = localStorage.getItem('contrasenaVantage');

if (!nickCuenta || !contrasenaCuenta) {
  window.location.href = 'login.html';
}

const eloActualEl = document.getElementById('elo-actual');
const categoriaActualEl = document.getElementById('categoria-actual');
const formActualizarElo = document.getElementById('form-actualizar-elo');
const inputNuevoElo = document.getElementById('nuevo-elo');
const mensajeActualizarElo = document.getElementById('mensaje-actualizar-elo');

// Cargar datos actuales al abrir la página
fetch(APPS_SCRIPT_URL, {
  method: 'POST',
  headers: { 'Content-Type': 'text/plain;charset=utf-8' },
  body: JSON.stringify({
    accion: 'obtener_datos',
    nick: nickCuenta,
    contrasena: contrasenaCuenta
  })
})
  .then(function (respuesta) { return respuesta.json(); })
  .then(function (resultado) {
    if (resultado.status === 'ok') {
      eloActualEl.textContent = resultado.elo;
      categoriaActualEl.textContent = resultado.categoria;
    } else {
      mensajeActualizarElo.textContent = resultado.message || 'No se pudieron cargar tus datos';
    }
  })
  .catch(function () {
    mensajeActualizarElo.textContent = 'No se pudo conectar.';
  });

// Actualizar Elo
formActualizarElo.addEventListener('submit', function (evento) {
  evento.preventDefault();

  mensajeActualizarElo.textContent = 'Actualizando...';

  fetch(APPS_SCRIPT_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'text/plain;charset=utf-8' },
    body: JSON.stringify({
      accion: 'actualizar_elo',
      nick: nickCuenta,
      contrasena: contrasenaCuenta,
      nuevoElo: inputNuevoElo.value
    })
  })
    .then(function (respuesta) { return respuesta.json(); })
    .then(function (resultado) {
      if (resultado.status === 'ok') {
        eloActualEl.textContent = resultado.elo;
        categoriaActualEl.textContent = resultado.categoria;
        formActualizarElo.reset();
        mensajeActualizarElo.textContent = 'Elo actualizado. Tu categoría ahora es ' + resultado.categoria + '.';
      } else {
        mensajeActualizarElo.textContent = resultado.message || 'Error al actualizar';
      }
    })
    .catch(function () {
      mensajeActualizarElo.textContent = 'No se pudo conectar.';
    });
});