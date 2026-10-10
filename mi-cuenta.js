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
const btnActualizarElo = document.getElementById('btn-actualizar-elo');
let actualizando = false;

formActualizarElo.addEventListener('submit', async function (evento) {
  evento.preventDefault();

  if (actualizando) return;

  inputNuevoElo.classList.remove('invalido');
  const textoElo = inputNuevoElo.value.trim();

  if (!/^\d+$/.test(textoElo) || !Number.isSafeInteger(Number(textoElo))) {
    inputNuevoElo.classList.add('invalido');
    mensajeActualizarElo.textContent = 'El Elo debe ser un número entero, sin decimales ni signos.';
    return;
  }

  actualizando = true;
  btnActualizarElo.disabled = true;
  btnActualizarElo.textContent = 'Cargando...';
  mensajeActualizarElo.textContent = '';

  try {
    const respuesta = await fetch(APPS_SCRIPT_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify({
        accion: 'actualizar_elo',
        nick: nickCuenta,
        contrasena: contrasenaCuenta,
        nuevoElo: Number(textoElo)
      })
    });
    const resultado = await respuesta.json();

    if (resultado.status === 'ok') {
      eloActualEl.textContent = resultado.elo;
      categoriaActualEl.textContent = resultado.categoria;
      formActualizarElo.reset();
      mensajeActualizarElo.textContent = 'Elo actualizado. Tu categoría ahora es ' + resultado.categoria + '.';
    } else {
      mensajeActualizarElo.textContent = resultado.message || 'Error al actualizar.';
    }
  } catch (error) {
    mensajeActualizarElo.textContent = 'No se pudo conectar.';
  } finally {
    actualizando = false;
    btnActualizarElo.disabled = false;
    btnActualizarElo.textContent = 'Actualizar Elo';
  }
});