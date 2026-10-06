const APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwemVWKI6HUx5BAAXTEnSH8LcxgDVBa6PFBlDxRO5VIE9sSKZrInRLRCBglh2rtiIPS/exec";

// ---------- SESIÓN ----------

const esAdmin = localStorage.getItem('esAdminVantage');
const nickAdmin = localStorage.getItem('nickVantage');
const contrasenaAdmin = localStorage.getItem('contrasenaVantage');

if (esAdmin !== 'true') {
  window.location.href = 'login.html';
}

document.getElementById('nick-admin-sesion').textContent = nickAdmin;

document.getElementById('btn-cerrar-sesion-admin').addEventListener('click', function () {
  localStorage.removeItem('nickVantage');
  localStorage.removeItem('esAdminVantage');
  localStorage.removeItem('contrasenaVantage');
  window.location.href = 'login.html';
});

// ---------- PESTAÑAS ----------

const tabsAdmin = document.querySelectorAll('.tab-admin');
const panelesContenido = document.querySelectorAll('.panel-contenido');

tabsAdmin.forEach(function (tab) {
  tab.addEventListener('click', function () {
    tabsAdmin.forEach(function (t) { t.classList.remove('activo'); });
    panelesContenido.forEach(function (p) { p.classList.remove('activo'); });

    tab.classList.add('activo');
    document.getElementById(tab.dataset.panel).classList.add('activo');
  });
});

// ---------- NOVEDADES ----------

const formNovedad = document.getElementById('form-novedad');
const mensajeNovedad = document.getElementById('mensaje-novedad');
const listaNovedades = document.getElementById('lista-novedades');
const inputNovedadFecha = document.getElementById('novedad-fecha');
const inputNovedadTexto = document.getElementById('novedad-texto');
const btnGuardarNovedad = document.getElementById('btn-guardar-novedad');

let idNovedadEnEdicion = null;

function cargarNovedades() {
  fetch(APPS_SCRIPT_URL + '?accion=novedades')
    .then(function (respuesta) { return respuesta.json(); })
    .then(function (novedades) {
      listaNovedades.innerHTML = '';

      novedades.forEach(function (novedad) {
        const item = document.createElement('div');
        item.className = 'item-admin';
        item.innerHTML =
          '<div class="item-texto">' +
            '<span class="etiqueta">' + novedad.fecha + '</span>' +
            '<p>' + novedad.texto + '</p>' +
          '</div>' +
          '<div class="item-acciones">' +
            '<button class="btn-editar">Editar</button>' +
            '<button class="btn-eliminar">Eliminar</button>' +
          '</div>';

        item.querySelector('.btn-editar').addEventListener('click', function () {
          idNovedadEnEdicion = novedad.id;
          inputNovedadFecha.value = novedad.fecha;
          inputNovedadTexto.value = novedad.texto;
          btnGuardarNovedad.textContent = 'Guardar cambios';
        });

        item.querySelector('.btn-eliminar').addEventListener('click', function () {
          if (!confirm('¿Eliminar esta novedad?')) return;

          fetch(APPS_SCRIPT_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'text/plain;charset=utf-8' },
            body: JSON.stringify({
              accion: 'eliminar_novedad',
              id: novedad.id,
              nickAdmin: nickAdmin,
              contrasenaAdmin: contrasenaAdmin
            })
          })
            .then(function (respuesta) { return respuesta.json(); })
            .then(function (resultado) {
              if (resultado.status === 'ok') {
                cargarNovedades();
              } else {
                alert(resultado.message || 'No se pudo eliminar');
              }
            });
        });

        listaNovedades.appendChild(item);
      });
    });
}

formNovedad.addEventListener('submit', function (evento) {
  evento.preventDefault();

  const datos = {
    accion: idNovedadEnEdicion ? 'editar_novedad' : 'crear_novedad',
    id: idNovedadEnEdicion,
    fecha: inputNovedadFecha.value,
    texto: inputNovedadTexto.value,
    nickAdmin: nickAdmin,
    contrasenaAdmin: contrasenaAdmin
  };

  mensajeNovedad.textContent = 'Guardando...';

  fetch(APPS_SCRIPT_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'text/plain;charset=utf-8' },
    body: JSON.stringify(datos)
  })
    .then(function (respuesta) { return respuesta.json(); })
    .then(function (resultado) {
      if (resultado.status === 'ok') {
        mensajeNovedad.textContent = '';
        formNovedad.reset();
        idNovedadEnEdicion = null;
        btnGuardarNovedad.textContent = 'Agregar novedad';
        cargarNovedades();
      } else {
        mensajeNovedad.textContent = resultado.message || 'Error al guardar';
      }
    })
    .catch(function () {
      mensajeNovedad.textContent = 'No se pudo conectar.';
    });
});

// ---------- AVISOS ----------

const formAviso = document.getElementById('form-aviso');
const mensajeAviso = document.getElementById('mensaje-aviso');
const listaAvisos = document.getElementById('lista-avisos');
const inputAvisoTitulo = document.getElementById('aviso-titulo');
const inputAvisoTexto = document.getElementById('aviso-texto');
const inputAvisoEnlace = document.getElementById('aviso-enlace');
const btnGuardarAviso = document.getElementById('btn-guardar-aviso');

let idAvisoEnEdicion = null;

function cargarAvisos() {
  fetch(APPS_SCRIPT_URL + '?accion=avisos')
    .then(function (respuesta) { return respuesta.json(); })
    .then(function (avisos) {
      listaAvisos.innerHTML = '';

      avisos.forEach(function (aviso) {
        const item = document.createElement('div');
        item.className = 'item-admin';
        item.innerHTML =
          '<div class="item-texto">' +
            '<span class="etiqueta">' + aviso.titulo + '</span>' +
            '<p>' + aviso.texto + '</p>' +
          '</div>' +
          '<div class="item-acciones">' +
            '<button class="btn-editar">Editar</button>' +
            '<button class="btn-eliminar">Eliminar</button>' +
          '</div>';

        item.querySelector('.btn-editar').addEventListener('click', function () {
          idAvisoEnEdicion = aviso.id;
          inputAvisoTitulo.value = aviso.titulo;
          inputAvisoTexto.value = aviso.texto;
          inputAvisoEnlace.value = aviso.enlace;
          btnGuardarAviso.textContent = 'Guardar cambios';
        });

        item.querySelector('.btn-eliminar').addEventListener('click', function () {
          if (!confirm('¿Eliminar este aviso?')) return;

          fetch(APPS_SCRIPT_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'text/plain;charset=utf-8' },
            body: JSON.stringify({
              accion: 'eliminar_aviso',
              id: aviso.id,
              nickAdmin: nickAdmin,
              contrasenaAdmin: contrasenaAdmin
            })
          })
            .then(function (respuesta) { return respuesta.json(); })
            .then(function (resultado) {
              if (resultado.status === 'ok') {
                cargarAvisos();
              } else {
                alert(resultado.message || 'No se pudo eliminar');
              }
            });
        });

        listaAvisos.appendChild(item);
      });
    });
}

formAviso.addEventListener('submit', function (evento) {
  evento.preventDefault();

  const datos = {
    accion: idAvisoEnEdicion ? 'editar_aviso' : 'crear_aviso',
    id: idAvisoEnEdicion,
    titulo: inputAvisoTitulo.value,
    texto: inputAvisoTexto.value,
    enlace: inputAvisoEnlace.value,
    nickAdmin: nickAdmin,
    contrasenaAdmin: contrasenaAdmin
  };

  mensajeAviso.textContent = 'Guardando...';

  fetch(APPS_SCRIPT_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'text/plain;charset=utf-8' },
    body: JSON.stringify(datos)
  })
    .then(function (respuesta) { return respuesta.json(); })
    .then(function (resultado) {
      if (resultado.status === 'ok') {
        mensajeAviso.textContent = '';
        formAviso.reset();
        idAvisoEnEdicion = null;
        btnGuardarAviso.textContent = 'Agregar aviso';
        cargarAvisos();
      } else {
        mensajeAviso.textContent = resultado.message || 'Error al guardar';
      }
    })
    .catch(function () {
      mensajeAviso.textContent = 'No se pudo conectar.';
    });
});

// ---------- CARGA INICIAL ----------

cargarNovedades();
cargarAvisos();