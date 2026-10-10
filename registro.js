const APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwemVWKI6HUx5BAAXTEnSH8LcxgDVBa6PFBlDxRO5VIE9sSKZrInRLRCBglh2rtiIPS/exec";

const formRegistro = document.getElementById('form-registro-usuario');
const mensajeRegistro = document.getElementById('mensaje-registro-usuario');
const btnRegistrar = document.getElementById('btn-registrar-usuario');
const textoBtnRegistrar = btnRegistrar.querySelector('.texto-boton');

const btnVerContrasena = document.getElementById('btn-ver-contrasena');
const inputContrasena = document.getElementById('contrasena');
const inputElo = document.getElementById('elo');
const inputAoe2 = document.getElementById('aoe2insights');

const btnUnirseWhatsapp = document.getElementById('btn-unirse-whatsapp');
const checkWhatsapp = document.getElementById('check-whatsapp');
const campoNumeroWhatsapp = document.getElementById('campo-numero-whatsapp');
const inputNumeroWhatsapp = document.getElementById('numero-whatsapp');

let enviando = false;

// Validaciones

function esEloValido(texto) {
  const limpio = texto.trim();
  return /^\d+$/.test(limpio) && Number.isSafeInteger(Number(limpio));
}

function esLinkAoe2Valido(texto) {
  const link = texto.trim();

  // es opcional
  if (link === '') return true;

  try {
    const url = new URL(link);
    return url.protocol === 'https:' &&
           url.hostname === 'www.aoe2insights.com' &&
           url.pathname.startsWith('/user/') &&
           url.pathname.length > '/user/'.length;
  } catch (error) {
    return false;
  }
}

// Mensajes y estado de carga

function mostrarMensaje(texto, tipo) {
  mensajeRegistro.textContent = texto;
  mensajeRegistro.className = tipo || '';
}

function iniciarCarga() {
  enviando = true;
  btnRegistrar.disabled = true;
  btnRegistrar.classList.add('cargando');
  textoBtnRegistrar.textContent = 'Cargando...';
}

function terminarCarga() {
  enviando = false;
  btnRegistrar.disabled = false;
  btnRegistrar.classList.remove('cargando');
  textoBtnRegistrar.textContent = 'Crear cuenta';
}

// Quitar el borde rojo cuando la persona corrige el campo
inputElo.addEventListener('input', function () {
  inputElo.classList.remove('invalido');
});

inputAoe2.addEventListener('input', function () {
  inputAoe2.classList.remove('invalido');
});

// Mostrar / ocultar contraseña
btnVerContrasena.addEventListener('click', function () {
  if (inputContrasena.type === 'password') {
    inputContrasena.type = 'text';
    btnVerContrasena.textContent = '🙈';
  } else {
    inputContrasena.type = 'password';
    btnVerContrasena.textContent = '👁';
  }
});

// El botón de WhatsApp marca el checkbox y muestra el campo de número
btnUnirseWhatsapp.addEventListener('click', function () {
  checkWhatsapp.checked = true;
  campoNumeroWhatsapp.style.display = 'block';
});

checkWhatsapp.addEventListener('change', function () {
  if (checkWhatsapp.checked) {
    campoNumeroWhatsapp.style.display = 'block';
  } else {
    campoNumeroWhatsapp.style.display = 'none';
  }
});

// Envío del formulario
formRegistro.addEventListener('submit', async function (evento) {
  evento.preventDefault();

  if (enviando) return;

  inputElo.classList.remove('invalido');
  inputAoe2.classList.remove('invalido');

  if (checkWhatsapp.checked && inputNumeroWhatsapp.value.trim() === '') {
    mostrarMensaje('Confirma tu número de WhatsApp para continuar.', 'error');
    return;
  }

  if (!esEloValido(inputElo.value)) {
    inputElo.classList.add('invalido');
    inputElo.focus();
    mostrarMensaje('El Elo debe ser un número entero, sin decimales ni signos.', 'error');
    return;
  }

  if (!esLinkAoe2Valido(inputAoe2.value)) {
    inputAoe2.classList.add('invalido');
    inputAoe2.focus();
    mostrarMensaje('El link debe verse así: https://www.aoe2insights.com/user/...', 'error');
    return;
  }

  // se bloquea el botón antes de calcular el hash y mandar los datos
  iniciarCarga();
  mostrarMensaje('Esto puede tardar unos segundos...');

  try {
    const nick = document.getElementById('nick').value;
    const contrasenaHash = await hashContrasena(nick, inputContrasena.value);

    const datos = {
      accion: 'registro',
      nick: nick,
      contrasena: contrasenaHash,
      elo: Number(inputElo.value.trim()),
      aoe2insights: inputAoe2.value.trim(),
      pais: document.getElementById('pais').value,
      porque_ingresar: document.getElementById('porque-ingresar').value,
      objetivos: document.getElementById('objetivos').value,
      recomendo: document.getElementById('recomendo').value,
      ya_se_unio_whatsapp: checkWhatsapp.checked,
      numero_whatsapp: inputNumeroWhatsapp.value
    };

    const respuesta = await fetch(APPS_SCRIPT_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(datos)
    });
    const resultado = await respuesta.json();

    if (resultado.status === 'ok') {
      // el botón se queda bloqueado hasta el redireccionamiento
      mostrarMensaje('Cuenta creada. Redirigiendo a login...', 'exito');
      setTimeout(function () {
        window.location.href = 'login.html';
      }, 2000);
    } else {
      terminarCarga();
      mostrarMensaje(resultado.message || 'Error al registrar.', 'error');
    }
  } catch (error) {
    terminarCarga();
    mostrarMensaje('No se pudo conectar. Intenta de nuevo.', 'error');
  }
});