const APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwemVWKI6HUx5BAAXTEnSH8LcxgDVBa6PFBlDxRO5VIE9sSKZrInRLRCBglh2rtiIPS/exec";

// ---------- NAV ----------

const nav = document.getElementById('nav-principal');
const logo = document.querySelector('.logo');
const btnHamburguesa = document.querySelector('.btn-hamburguesa');
const menu = document.querySelector('.menu');
const linksMenu = document.querySelectorAll('.menu a');

logo.addEventListener('click', function (evento) {
  evento.stopPropagation();
  nav.classList.toggle('expandido');

  if (!nav.classList.contains('expandido')) {
    menu.classList.remove('activo');
  }
});

document.addEventListener('click', function (evento) {
  const clickFueraDelNav = !nav.contains(evento.target);

  if (clickFueraDelNav) {
    nav.classList.remove('expandido');
    menu.classList.remove('activo');
  }
});

btnHamburguesa.addEventListener('click', function (evento) {
  evento.stopPropagation();
  menu.classList.toggle('activo');
});

linksMenu.forEach(function (link) {
  link.addEventListener('click', function () {
    nav.classList.remove('expandido');
    menu.classList.remove('activo');
  });
});

// ---------- INDICADOR DE SESIÓN ----------

const btnIrLogin = document.getElementById('btn-ir-login');
const sesionActiva = document.getElementById('sesion-activa');
const nickSesion = document.getElementById('nick-sesion');
const btnCerrarSesion = document.getElementById('btn-cerrar-sesion');

const nickGuardado = localStorage.getItem('nickVantage');

if (nickGuardado) {
  btnIrLogin.style.display = 'none';
  sesionActiva.style.display = 'flex';
  nickSesion.textContent = nickGuardado;
} else {
  btnIrLogin.style.display = 'inline-block';
  sesionActiva.style.display = 'none';
}

btnCerrarSesion.addEventListener('click', function () {
  localStorage.removeItem('nickVantage');
  window.location.reload();
});

// ---------- LINK DE PANEL ADMIN EN EL NAV ----------

const itemPanelAdmin = document.getElementById('item-panel-admin');

if (itemPanelAdmin && localStorage.getItem('esAdminVantage') === 'true') {
  itemPanelAdmin.style.display = 'list-item';
}

// ---------- NOVEDADES EN INICIO ----------

const listaNovedadesInicio = document.getElementById('lista-novedades-inicio');

if (listaNovedadesInicio) {
  fetch(APPS_SCRIPT_URL + '?accion=novedades')
    .then(function (respuesta) { return respuesta.json(); })
    .then(function (novedades) {
      novedades.forEach(function (novedad) {
        const li = document.createElement('li');
        li.innerHTML =
          '<span class="fecha">' + novedad.fecha + '</span>' +
          '<p>' + novedad.texto + '</p>';
        listaNovedadesInicio.appendChild(li);
      });
    });
}

// ---------- AVISOS EN INICIO (tarjetas clickeables) ----------

const listaAvisosInicio = document.getElementById('lista-avisos-inicio');

if (listaAvisosInicio) {
  fetch(APPS_SCRIPT_URL + '?accion=avisos')
    .then(function (respuesta) { return respuesta.json(); })
    .then(function (avisos) {
      avisos.forEach(function (aviso) {
        const li = document.createElement('li');
        li.innerHTML =
          '<a href="' + aviso.enlace + '" class="aviso-link">' +
            '<span class="fecha">' + aviso.titulo + '</span>' +
            '<p>' + aviso.texto + '</p>' +
          '</a>';
        listaAvisosInicio.appendChild(li);
      });
    });
}