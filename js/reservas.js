
const formulario = document.getElementById("formReserva");
const tablaReservas = document.getElementById("tablaReservas");
const mensaje = document.getElementById("mensaje");
const buscar = document.getElementById("buscar");
const filtroFecha = document.getElementById("filtroFecha");

let reservas = JSON.parse(
    localStorage.getItem("reservas") || "[]"
);

function mostrarMensaje(texto, tipo = "success") {
    mensaje.textContent = texto;
    mensaje.className = `alert alert-${tipo}`;
}

function ocultarMensaje() {
    mensaje.textContent = "";
    mensaje.className = "alert d-none";
}

function guardarReservas() {
    localStorage.setItem("reservas", JSON.stringify(reservas));
}

function crearCelda(fila, texto) {
    const celda = document.createElement("td");
    celda.textContent = texto;
    fila.appendChild(celda);
    return celda;
}

function renderizarReservas() {
    tablaReservas.replaceChildren();

    const textoBusqueda = buscar.value.trim().toLowerCase();
    const fechaFiltro = filtroFecha.value;

    const reservasFiltradas = reservas.filter(reserva => {
        const coincideTexto =
            reserva.cliente.toLowerCase().includes(textoBusqueda) ||
            reserva.servicio.toLowerCase().includes(textoBusqueda);

        const coincideFecha =
            !fechaFiltro || reserva.fecha === fechaFiltro;

        return coincideTexto && coincideFecha;
    });

    if (reservasFiltradas.length === 0) {
        const fila = document.createElement("tr");
        const celda = crearCelda(
            fila,
            "No se encontraron reservas."
        );

        celda.colSpan = 9;
        celda.className = "text-center text-secondary";
        tablaReservas.appendChild(fila);
        return;
    }

    reservasFiltradas.forEach(reserva => {
        const fila = document.createElement("tr");

        crearCelda(fila, String(reserva.id));
        crearCelda(fila, reserva.cliente);
        crearCelda(fila, reserva.servicio);
        crearCelda(fila, reserva.fecha);
        crearCelda(fila, reserva.hora);
        crearCelda(fila, `${reserva.duracion} hora(s)`);
        crearCelda(
            fila,
            `S/ ${reserva.precio.toFixed(2)}`
        );
        crearCelda(
            fila,
            reserva.observaciones || "—"
        );

        const celdaAcciones = document.createElement("td");
        const botonEliminar = document.createElement("button");

        botonEliminar.type = "button";
        botonEliminar.textContent = "Eliminar";
        botonEliminar.className = "btn btn-sm btn-danger";

        botonEliminar.addEventListener("click", () => {
            eliminarReserva(reserva.id);
        });

        celdaAcciones.appendChild(botonEliminar);
        fila.appendChild(celdaAcciones);
        tablaReservas.appendChild(fila);
    });
}

formulario.addEventListener("submit", evento => {
    evento.preventDefault();
    ocultarMensaje();

    const datos = {
        cliente: document.getElementById("cliente").value.trim(),
        servicio: document.getElementById("servicio").value.trim(),
        fecha: document.getElementById("fecha").value,
        hora: document.getElementById("hora").value,
        duracion: Number(
            document.getElementById("duracion").value
        ),
        precio: Number(
            document.getElementById("precio").value
        ),
        observaciones: document
            .getElementById("observaciones")
            .value.trim()
    };

    const error = validarReserva(datos);

    if (error) {
        mostrarMensaje(error, "danger");
        return;
    }

    const nuevaReserva = {
        id: Date.now(),
        ...datos
    };

    reservas.push(nuevaReserva);
    guardarReservas();
    renderizarReservas();

    formulario.reset();
    mostrarMensaje("Reserva registrada correctamente.");
});

function eliminarReserva(id) {
    const confirmar = window.confirm(
        "¿Está seguro de eliminar esta reserva?"
    );

    if (!confirmar) {
        return;
    }

    reservas = reservas.filter(reserva => reserva.id !== id);
    guardarReservas();
    renderizarReservas();

    mostrarMensaje("Reserva eliminada correctamente.");
}

buscar.addEventListener("input", renderizarReservas);
filtroFecha.addEventListener("change", renderizarReservas);

formulario.addEventListener("reset", ocultarMensaje);

renderizarReservas();
