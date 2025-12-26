/* =====================================================
   ALKE WALLET - JavaScript Principal
   Módulo 2: Fundamentos del desarrollo Front-end
   Tecnologías: JavaScript + jQuery
===================================================== */

$(document).ready(function () {

  // =====================================================
  // CONFIGURACIÓN INICIAL
  // =====================================================
  
  // Credenciales de prueba
  const USER_EMAIL = "ejemplo@example.com";
  const USER_PASSWORD = "12345";
  const SALDO_INICIAL = 60000;

  // Inicializar datos si no existen
  if (!localStorage.getItem("saldo")) {
    localStorage.setItem("saldo", SALDO_INICIAL);
  }

  if (!localStorage.getItem("contactos")) {
    const contactosIniciales = [
      { nombre: "Juan Pérez", cbu: "1234567890123456789012", alias: "juan.perez", banco: "Banco Nación" },
      { nombre: "María Gómez", cbu: "9876543210987654321098", alias: "maria.gomez", banco: "Banco Galicia" },
      { nombre: "Carlos López", cbu: "1122334455667788990011", alias: "carlos.lopez", banco: "Banco Santander" }
    ];
    localStorage.setItem("contactos", JSON.stringify(contactosIniciales));
  }

  if (!localStorage.getItem("movimientos")) {
    localStorage.setItem("movimientos", JSON.stringify([]));
  }

  // =====================================================
  // FUNCIONES UTILITARIAS
  // =====================================================

  // Función para mostrar alertas con animación jQuery
  function mostrarAlerta(mensaje, tipo, contenedor = "#alerta, #alert-container") {
    const $alerta = $(contenedor);
    $alerta
      .removeClass("d-none alert-success alert-danger alert-warning alert-info")
      .addClass("alert alert-" + tipo)
      .html('<i class="bi bi-' + getIconoAlerta(tipo) + '"></i> ' + mensaje)
      .hide()
      .fadeIn(300);

    // Auto-ocultar después de 5 segundos
    setTimeout(() => {
      $alerta.fadeOut(300, function() {
        $(this).addClass("d-none");
      });
    }, 5000);
  }

  // Obtener icono según tipo de alerta
  function getIconoAlerta(tipo) {
    const iconos = {
      'success': 'check-circle-fill',
      'danger': 'exclamation-triangle-fill',
      'warning': 'exclamation-circle-fill',
      'info': 'info-circle-fill'
    };
    return iconos[tipo] || 'info-circle';
  }

  // Formatear moneda chilena (CLP)
  function formatearMonto(monto) {
    return "$" + parseInt(monto).toLocaleString('es-CL');
  }

  // Obtener saldo actual
  function getSaldo() {
    return parseInt(localStorage.getItem("saldo")) || SALDO_INICIAL;
  }

  // Actualizar saldo con animación
  function actualizarSaldoConAnimacion(elemento, nuevoSaldo) {
    const $elemento = $(elemento);
    $elemento.fadeOut(200, function() {
      $(this).text(formatearMonto(nuevoSaldo)).fadeIn(200);
    });
  }

  // Registrar movimiento
  function registrarMovimiento(tipo, monto, contacto = null) {
    const movimientos = JSON.parse(localStorage.getItem("movimientos")) || [];
    const movimiento = {
      tipo: tipo,
      monto: monto,
      fecha: new Date().toLocaleString('es-AR'),
      contacto: contacto
    };
    movimientos.push(movimiento);
    localStorage.setItem("movimientos", JSON.stringify(movimientos));
  }

  // =====================================================
  // LOGIN (index.html)
  // =====================================================

  if ($("#loginForm").length) {
    
    // Animación de entrada del formulario
    $(".main-container").hide().fadeIn(500);

    $("#loginForm").on("submit", function (e) {
      e.preventDefault();

      const email = $("#email").val().trim();
      const password = $("#password").val().trim();

      // Validación
      if (!email || !password) {
        mostrarAlerta("Por favor completa todos los campos.", "warning");
        $("#loginForm").addClass("shake");
        setTimeout(() => $("#loginForm").removeClass("shake"), 500);
        return;
      }

      // Verificar credenciales
      if (email === USER_EMAIL && password === USER_PASSWORD) {
        
        mostrarAlerta("¡Inicio de sesión exitoso! Redirigiendo...", "success");
        
        // Animación de salida
        setTimeout(() => {
          $(".main-container").fadeOut(400, function() {
            window.location.href = "menu.html";
          });
        }, 1500);

      } else {
        mostrarAlerta("Credenciales incorrectas. Intenta de nuevo.", "danger");
        $("#loginForm").addClass("shake");
        setTimeout(() => $("#loginForm").removeClass("shake"), 500);
        $("#password").val("").focus();
      }
    });

    // Efecto focus en inputs
    $("input").on("focus", function() {
      $(this).parent().find("label").css("color", "#6C63FF");
    }).on("blur", function() {
      $(this).parent().find("label").css("color", "");
    });
  }

  // =====================================================
  // MENÚ PRINCIPAL (menu.html)
  // =====================================================

  if ($("#saldoCuenta").length) {
    
    // Animación de entrada
    $(".main-container").hide().fadeIn(500);
    $(".card-balance").hide().delay(200).slideDown(400);
    $(".btn-menu").each(function(index) {
      $(this).hide().delay(300 + (index * 100)).fadeIn(300);
    });

    // Mostrar saldo con animación
    const saldo = getSaldo();
    $("#saldoCuenta").text(formatearMonto(saldo));

    // Función para mostrar alerta del menú
    function mostrarAlertaMenu(mensaje, tipo) {
      $("#alertaMenu")
        .removeClass("d-none alert-success alert-danger alert-warning alert-info")
        .addClass("alert alert-" + tipo)
        .html('<i class="bi bi-' + getIconoAlerta(tipo) + '"></i> ' + mensaje)
        .hide()
        .slideDown(300);
    }

    // Botón Depositar con animación
    $("#btnDepositar").on("click", function () {
      $(this).addClass("pulse");
      mostrarAlertaMenu("Redirigiendo a Depositar...", "info");
      setTimeout(() => {
        $(".main-container").fadeOut(300, function() {
          window.location.href = "deposit.html";
        });
      }, 800);
    });

    // Botón Recibir Fondos (NUEVO)
    $("#btnRecibir").on("click", function () {
      $(this).addClass("pulse");
      
      // Simular recepción de fondos
      const montoRecibido = Math.floor(Math.random() * 5000) + 1000; // Entre 1000 y 6000
      const saldoActual = getSaldo();
      const nuevoSaldo = saldoActual + montoRecibido;
      
      localStorage.setItem("saldo", nuevoSaldo);
      registrarMovimiento("Transferencia recibida", montoRecibido, "Cuenta externa");
      
      mostrarAlertaMenu(`¡Has recibido ${formatearMonto(montoRecibido)}!`, "success");
      actualizarSaldoConAnimacion("#saldoCuenta", nuevoSaldo);
      
      setTimeout(() => $(this).removeClass("pulse"), 2000);
    });

    // Botón Enviar Dinero
    $("#btnEnviar").on("click", function () {
      $(this).addClass("pulse");
      mostrarAlertaMenu("Redirigiendo a Enviar Dinero...", "info");
      setTimeout(() => {
        $(".main-container").fadeOut(300, function() {
          window.location.href = "sendmoney.html";
        });
      }, 800);
    });

    // Botón Últimos Movimientos
    $("#btnMovimientos").on("click", function () {
      $(this).addClass("pulse");
      mostrarAlertaMenu("Redirigiendo a Movimientos...", "info");
      setTimeout(() => {
        $(".main-container").fadeOut(300, function() {
          window.location.href = "transactions.html";
        });
      }, 800);
    });
  }

  // =====================================================
  // DEPÓSITO (deposit.html)
  // =====================================================

  if ($("#depositForm").length) {
    
    // Animación de entrada
    $(".main-container").hide().fadeIn(500);

    // Mostrar saldo actual
    const saldoActual = getSaldo();
    $("#saldoActual").text(formatearMonto(saldoActual));

    $("#depositForm").on("submit", function (e) {
      e.preventDefault();

      const monto = parseInt($("#montoDeposito").val());

      // Validaciones
      if (isNaN(monto) || monto <= 0) {
        mostrarAlerta("Ingresa un monto válido mayor a $0.", "danger");
        $("#montoDeposito").addClass("shake").focus();
        setTimeout(() => $("#montoDeposito").removeClass("shake"), 500);
        return;
      }

      if (monto > 1000000) {
        mostrarAlerta("El monto máximo por depósito es $1.000.000.", "warning");
        return;
      }

      // Realizar depósito
      const nuevoSaldo = saldoActual + monto;
      localStorage.setItem("saldo", nuevoSaldo);

      // Registrar movimiento
      registrarMovimiento("Depósito", monto);

      // Mostrar mensaje de éxito
      $("#mensajeDeposito")
        .removeClass("d-none")
        .html('<i class="bi bi-check-circle"></i> Depositaste: ' + formatearMonto(monto))
        .hide()
        .fadeIn(300);

      mostrarAlerta("¡Depósito realizado con éxito!", "success");
      actualizarSaldoConAnimacion("#saldoActual", nuevoSaldo);

      // Limpiar formulario
      $("#montoDeposito").val("");

      // Redirigir después de 2 segundos
      setTimeout(() => {
        $(".main-container").fadeOut(400, function() {
          window.location.href = "menu.html";
        });
      }, 2000);
    });
  }

  // =====================================================
  // ENVIAR DINERO (sendmoney.html)
  // =====================================================

  if ($("#listaContactos").length) {
    
    // Animación de entrada
    $(".main-container").hide().fadeIn(500);

    // Mostrar saldo disponible
    $("#saldoDisponible").text(formatearMonto(getSaldo()));

    let contactoSeleccionado = null;

    // Función para renderizar contactos con animación
    function renderizarContactos(filtro = "") {
      const lista = $("#listaContactos");
      lista.empty();
      
      const contactos = JSON.parse(localStorage.getItem("contactos")) || [];
      const contactosFiltrados = contactos.filter(c => 
        c.nombre.toLowerCase().includes(filtro.toLowerCase()) ||
        (c.alias && c.alias.toLowerCase().includes(filtro.toLowerCase()))
      );

      if (contactosFiltrados.length === 0) {
        lista.append(`
          <li class="list-group-item text-center text-muted">
            <i class="bi bi-person-x"></i> No se encontraron contactos
          </li>
        `);
        return;
      }

      contactosFiltrados.forEach((c, index) => {
        const item = $(`
          <li class="list-group-item" data-index="${index}">
            <div class="form-check">
              <input class="form-check-input" type="radio" name="contacto" id="contacto${index}">
              <label class="form-check-label w-100" for="contacto${index}">
                <strong><i class="bi bi-person-circle"></i> ${c.nombre}</strong><br>
                <small class="text-muted">
                  <i class="bi bi-bank"></i> ${c.banco || 'Sin banco'} | 
                  <i class="bi bi-at"></i> ${c.alias || 'Sin alias'}
                </small>
              </label>
            </div>
          </li>
        `);
        item.hide();
        lista.append(item);
        item.delay(index * 50).fadeIn(200);
      });
    }

    renderizarContactos();

    // Autocomplete con jQuery UI
    if ($.ui && $.ui.autocomplete) {
      const contactos = JSON.parse(localStorage.getItem("contactos")) || [];
      const nombresContactos = contactos.map(c => c.nombre + " (" + c.alias + ")");
      
      $("#buscador").autocomplete({
        source: nombresContactos,
        minLength: 1,
        select: function(event, ui) {
          const nombreSeleccionado = ui.item.value.split(" (")[0];
          renderizarContactos(nombreSeleccionado);
        }
      });
    }

    // Filtrar contactos en tiempo real
    $("#buscador").on("input", function() {
      const termino = $(this).val();
      renderizarContactos(termino);
    });

    // Mostrar botón enviar al seleccionar contacto
    $(document).on("change", "input[name='contacto']", function() {
      const index = $(this).closest("li").data("index");
      const contactos = JSON.parse(localStorage.getItem("contactos")) || [];
      contactoSeleccionado = contactos[index];
      
      $("#btnEnviarDinero").slideDown(300);
    });

    // Abrir modal para agregar contacto
    $("#btnAgregarContacto").on("click", function () {
      const modal = new bootstrap.Modal($("#modalAgregarContacto"));
      modal.show();
    });

    // Guardar nuevo contacto
    $("#guardarContacto").on("click", function () {
      const nombre = $("#nombreContacto").val().trim();
      const cbu = $("#cbuContacto").val().trim();
      const alias = $("#aliasContacto").val().trim();
      const banco = $("#bancoContacto").val().trim();

      // Validaciones
      if (!nombre) {
        mostrarAlerta("El nombre es obligatorio.", "danger");
        return;
      }

      if (!cbu || !/^\d{12,22}$/.test(cbu)) {
        mostrarAlerta("El CBU debe tener entre 12 y 22 dígitos numéricos.", "danger");
        return;
      }

      // Guardar contacto
      let contactos = JSON.parse(localStorage.getItem("contactos")) || [];
      contactos.push({ nombre, cbu, alias, banco });
      localStorage.setItem("contactos", JSON.stringify(contactos));

      mostrarAlerta("¡Contacto agregado con éxito!", "success");
      
      // Limpiar buscador y renderizar todos los contactos
      $("#buscador").val("");
      renderizarContactos("");

      // Limpiar y cerrar modal
      $("#nombreContacto, #cbuContacto, #aliasContacto, #bancoContacto").val("");
      bootstrap.Modal.getInstance($("#modalAgregarContacto")).hide();
    });

    // Abrir modal para enviar dinero
    $("#btnEnviarDinero").on("click", function () {
      if (!contactoSeleccionado) {
        mostrarAlerta("Selecciona un contacto primero.", "warning");
        return;
      }

      $("#destinatarioInfo").html(`
        <strong>Enviar a:</strong> ${contactoSeleccionado.nombre}<br>
        <small class="text-muted">CBU: ${contactoSeleccionado.cbu}</small>
      `);

      const modal = new bootstrap.Modal($("#modalEnviarDinero"));
      modal.show();
    });

    // Confirmar envío de dinero
    $("#confirmarEnvio").on("click", function () {
      const monto = parseInt($("#montoEnvio").val());
      const saldoActual = getSaldo();

      // Validaciones
      if (isNaN(monto) || monto <= 0) {
        mostrarAlerta("Ingresa un monto válido.", "danger");
        return;
      }

      if (monto > saldoActual) {
        mostrarAlerta("Saldo insuficiente para realizar la transferencia.", "danger");
        return;
      }

      // Realizar transferencia
      const nuevoSaldo = saldoActual - monto;
      localStorage.setItem("saldo", nuevoSaldo);

      // Registrar movimiento
      registrarMovimiento("Transferencia enviada", monto, contactoSeleccionado.nombre);

      // Cerrar modal
      bootstrap.Modal.getInstance($("#modalEnviarDinero")).hide();

      mostrarAlerta(`¡Enviaste ${formatearMonto(monto)} a ${contactoSeleccionado.nombre}!`, "success");
      actualizarSaldoConAnimacion("#saldoDisponible", nuevoSaldo);

      // Limpiar
      $("#montoEnvio").val("");
      contactoSeleccionado = null;
      $("#btnEnviarDinero").slideUp(300);
      $("input[name='contacto']").prop("checked", false);

      // Redirigir
      setTimeout(() => {
        $(".main-container").fadeOut(400, function() {
          window.location.href = "menu.html";
        });
      }, 2000);
    });
  }

  // =====================================================
  // ÚLTIMOS MOVIMIENTOS (transactions.html)
  // =====================================================

  if ($("#listaMovimientos").length) {
    
    // Animación de entrada
    $(".main-container").hide().fadeIn(500);

    // Mostrar saldo
    $("#saldoTransacciones").text(formatearMonto(getSaldo()));

    // Función para mostrar movimientos con animación
    function mostrarMovimientos(tipoFiltro) {
      const lista = $("#listaMovimientos");
      lista.empty();

      const movimientos = JSON.parse(localStorage.getItem("movimientos")) || [];
      
      let filtrados = movimientos.slice();
      if (tipoFiltro === "deposito") {
        filtrados = filtrados.filter(m => m.tipo === "Depósito");
      } else if (tipoFiltro === "envio") {
        filtrados = filtrados.filter(m => m.tipo === "Transferencia enviada");
      } else if (tipoFiltro === "recepcion") {
        filtrados = filtrados.filter(m => m.tipo === "Transferencia recibida");
      }

      if (filtrados.length === 0) {
        $("#sinMovimientos").removeClass("d-none").hide().fadeIn(300);
        return;
      }

      $("#sinMovimientos").addClass("d-none");

      // Mostrar movimientos (más recientes primero)
      filtrados.slice().reverse().forEach((mov, index) => {
        let badgeClass = "badge-deposito";
        let icono = "bi-plus-circle";
        
        if (mov.tipo === "Transferencia enviada") {
          badgeClass = "badge-envio";
          icono = "bi-arrow-up-right";
        } else if (mov.tipo === "Transferencia recibida") {
          badgeClass = "badge-recepcion";
          icono = "bi-arrow-down-left";
        }

        const item = $(`
          <li class="list-group-item d-flex justify-content-between align-items-start">
            <div class="ms-2 me-auto">
              <div class="fw-bold">
                <i class="bi ${icono}"></i> ${mov.tipo}
              </div>
              <small class="text-muted">
                <i class="bi bi-calendar"></i> ${mov.fecha}
                ${mov.contacto ? '<br><i class="bi bi-person"></i> ' + mov.contacto : ''}
              </small>
            </div>
            <span class="badge ${badgeClass} rounded-pill fs-6">
              ${formatearMonto(mov.monto)}
            </span>
          </li>
        `);
        
        item.hide();
        lista.append(item);
        item.delay(index * 80).slideDown(200);
      });
    }

    // Mostrar todos los movimientos al cargar
    mostrarMovimientos("todos");

    // Filtrar movimientos dinámicamente
    $("#filtroMovimientos").on("change", function() {
      mostrarMovimientos(this.value);
    });
  }

});

