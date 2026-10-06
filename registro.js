const APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwemVWKI6HUx5BAAXTEnSH8LcxgDVBa6PFBlDxRO5VIE9sSKZrInRLRCBglh2rtiIPS/exec";

const formRegistro = document.getElementById('form-registro-usuario');
const mensajeRegistro = document.getElementById('mensaje-registro-usuario');

const btnVerContrasena = document.getElementById('btn-ver-contrasena');
const inputContrasena = document.getElementById('contrasena');

const btnUnirseWhatsapp = document.getElementById('btn-unirse-whatsapp');
const checkWhatsapp = document.getElementById('check-whatsapp');
const campoNumeroWhatsapp = document.getElementById('campo-numero-whatsapp');
const inputNumeroWhatsapp = document.getElementById('numero-whatsapp');

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

// Botón de WhatsApp marca el checkbox y muestra el campo de número
btnUnirseWhatsapp.addEventListener('click', function () {
  checkWhatsapp.checked = true;
  campoNumeroWhatsapp.style.display = 'block';
});

// El checkbox también puede mostrar/ocultar el campo por sí solo
checkWhatsapp.addEventListener('change', function () {
  if (checkWhatsapp.checked) {
    campoNumeroWhatsapp.style.display = 'block';
  } else {
    campoNumeroWhatsapp.style.display = 'none';
  }
});

// Envío del formulario
formRegistro.addEventListener('submit', function (evento) {
  evento.preventDefault();

  if (checkWhatsapp.checked && inputNumeroWhatsapp.value.trim() === '') {
    mensajeRegistro.textContent = 'Confirma tu número de WhatsApp para continuar';
    return;
  }

  const datos = {
    accion: 'registro',
    nick: document.getElementById('nick').value,
    contrasena: inputContrasena.value,
    elo: document.getElementById('elo').value,
    aoe2insights: document.getElementById('aoe2insights').value,
    pais: document.getElementById('pais').value,
    porque_ingresar: document.getElementById('porque-ingresar').value,
    objetivos: document.getElementById('objetivos').value,
    recomendo: document.getElementById('recomendo').value,
    ya_se_unio_whatsapp: checkWhatsapp.checked,
    numero_whatsapp: inputNumeroWhatsapp.value
  };

  mensajeRegistro.textContent = 'Enviando...';

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
        mensajeRegistro.textContent = 'Cuenta creada. Redirigiendo a login...';
        setTimeout(function () {
          window.location.href = 'login.html';
        }, 2000);
      } else {
        mensajeRegistro.textContent = resultado.message || 'Error al registrar';
      }
    })
    .catch(function () {
      mensajeRegistro.textContent = 'No se pudo conectar. Intenta de nuevo.';
    });
});