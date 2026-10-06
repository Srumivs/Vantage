const APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwemVWKI6HUx5BAAXTEnSH8LcxgDVBa6PFBlDxRO5VIE9sSKZrInRLRCBglh2rtiIPS/exec";

const formLogin = document.getElementById('form-login-usuario');
const mensajeLogin = document.getElementById('mensaje-login');

const btnVerContrasenaLogin = document.getElementById('btn-ver-contrasena-login');
const inputContrasenaLogin = document.getElementById('contrasena-login');

// Mostrar / ocultar contraseña
btnVerContrasenaLogin.addEventListener('click', function () {
  if (inputContrasenaLogin.type === 'password') {
    inputContrasenaLogin.type = 'text';
    btnVerContrasenaLogin.textContent = '🙈';
  } else {
    inputContrasenaLogin.type = 'password';
    btnVerContrasenaLogin.textContent = '👁';
  }
});

// Envío del formulario
formLogin.addEventListener('submit', function (evento) {
  evento.preventDefault();

  const datos = {
    accion: 'login',
    nick: document.getElementById('nick-login').value,
    contrasena: inputContrasenaLogin.value
  };

  mensajeLogin.textContent = 'Verificando...';

  fetch(APPS_SCRIPT_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'text/plain;charset=utf-8' },
    body: JSON.stringify(datos)
  })
    .then(function (respuesta) {
      return respuesta.json();
    })
    .then(function (resultado) {
      if (resultado.status === 'ok') {
        localStorage.setItem('nickVantage', datos.nick);

        if (resultado.esAdmin) {
          localStorage.setItem('esAdminVantage', 'true');
          localStorage.setItem('contrasenaVantage', datos.contrasena);
          mensajeLogin.textContent = 'Sesión de administrador. Redirigiendo...';
          window.location.href = 'panel-admin.html';
        } else {
          localStorage.removeItem('esAdminVantage');
          localStorage.removeItem('contrasenaVantage');
          mensajeLogin.textContent = 'Sesión iniciada. Redirigiendo...';
          window.location.href = 'index.html';
        }
      } else {
        mensajeLogin.textContent = resultado.message || 'Error al iniciar sesión';
      }
    })
    .catch(function () {
      mensajeLogin.textContent = 'No se pudo conectar. Intenta de nuevo.';
    });
});