const APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwemVWKI6HUx5BAAXTEnSH8LcxgDVBa6PFBlDxRO5VIE9sSKZrInRLRCBglh2rtiIPS/exec";

const formLogin = document.getElementById('form-login-usuario');
const mensajeLogin = document.getElementById('mensaje-login');
const btnLogin = document.getElementById('btn-login');
const textoBtnLogin = btnLogin.querySelector('.texto-boton');

const btnVerContrasenaLogin = document.getElementById('btn-ver-contrasena-login');
const inputContrasenaLogin = document.getElementById('contrasena-login');

let enviando = false;

// Mensajes y estado de carga

function mostrarMensaje(texto, tipo) {
  mensajeLogin.textContent = texto;
  mensajeLogin.className = tipo || '';
}

function iniciarCarga() {
  enviando = true;
  btnLogin.disabled = true;
  btnLogin.classList.add('cargando');
  textoBtnLogin.textContent = 'Cargando...';
}

function terminarCarga() {
  enviando = false;
  btnLogin.disabled = false;
  btnLogin.classList.remove('cargando');
  textoBtnLogin.textContent = 'Entrar';
}

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
formLogin.addEventListener('submit', async function (evento) {
  evento.preventDefault();

  if (enviando) return;

  // se bloquea el botón antes de calcular el hash y mandar los datos
  iniciarCarga();
  mostrarMensaje('Verificando...');

  try {
    const nick = document.getElementById('nick-login').value;
    const contrasenaHash = await hashContrasena(nick, inputContrasenaLogin.value);

    const respuesta = await fetch(APPS_SCRIPT_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify({
        accion: 'login',
        nick: nick,
        contrasena: contrasenaHash
      })
    });
    const resultado = await respuesta.json();

    if (resultado.status === 'ok') {
      localStorage.setItem('nickVantage', nick);
      localStorage.setItem('contrasenaVantage', contrasenaHash);

      // el botón se queda bloqueado hasta el redireccionamiento
      if (resultado.esAdmin) {
        localStorage.setItem('esAdminVantage', 'true');
        mostrarMensaje('Sesión de administrador. Redirigiendo...', 'exito');
        window.location.href = 'panel-admin.html';
      } else {
        localStorage.removeItem('esAdminVantage');
        mostrarMensaje('Sesión iniciada. Redirigiendo...', 'exito');
        window.location.href = 'index.html';
      }
    } else {
      terminarCarga();
      mostrarMensaje(resultado.message || 'Error al iniciar sesión.', 'error');
    }
  } catch (error) {
    terminarCarga();
    mostrarMensaje('No se pudo conectar. Intenta de nuevo.', 'error');
  }
});