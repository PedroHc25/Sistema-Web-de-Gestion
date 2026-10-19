const CLAVE_SERVICIOS = "servicios";

function obtenerServicios() {
    try {
        return JSON.parse(localStorage.getItem(CLAVE_SERVICIOS)) || [];
    } catch (error) {
        return [];
    }
}

function guardarServicios(servicios) {
    localStorage.setItem(CLAVE_SERVICIOS, JSON.stringify(servicios));
}

function escaparHtml(texto) {
    const div = document.createElement("div");
    div.textContent = texto;
    return div.innerHTML;
}

function mostrarMensaje(texto, tipo) {
    const contenedor = document.getElementById("mensaje");
    contenedor.innerHTML =
        `<div class="alert alert-${tipo}" role="alert">${escaparHtml(texto)}</div>`;
    setTimeout(() => {
        contenedor.innerHTML = "";
    }, 3000);
}

function listarServicios(filtro = "") {
    const tbody = document.getElementById("tablaServicios");
    const texto = filtro.trim().toLowerCase();
    const servicios = obtenerServicios()
        .filter(s => s.nombre.toLowerCase().includes(texto));

    if (servicios.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="5" class="text-center text-secondary">
                    No hay servicios para mostrar.
                </td>
            </tr>`;
        return;
    }

    tbody.innerHTML = servicios.map(s => `
        <tr>
            <td>${s.id}</td>
            <td>${escaparHtml(s.nombre)}</td>
            <td>${escaparHtml(s.descripcion)}</td>
            <td>S/ ${s.precio.toFixed(2)}</td>
            <td>${s.duracion} min</td>
        </tr>`).join("");
}

function registrarServicio(evento) {
    evento.preventDefault();

    const nombre = document.getElementById("nombre").value.trim();
    const descripcion = document.getElementById("descripcion").value.trim();
    const precio = parseFloat(document.getElementById("precio").value);
    const duracion = parseInt(document.getElementById("duracion").value, 10);

    if (nombre === "") {
        mostrarMensaje("El nombre del servicio es obligatorio.", "danger");
        return;
    }
    if (isNaN(precio) || precio < 0) {
        mostrarMensaje("Ingresa un precio válido (0 o mayor).", "danger");
        return;
    }
    if (isNaN(duracion) || duracion < 1) {
        mostrarMensaje("La duración debe ser de al menos 1 minuto.", "danger");
        return;
    }

    const servicios = obtenerServicios();
    const repetido = servicios.some(
        s => s.nombre.toLowerCase() === nombre.toLowerCase()
    );
    if (repetido) {
        mostrarMensaje("Ya existe un servicio con ese nombre.", "warning");
        return;
    }

    const nuevoId = servicios.length
        ? Math.max(...servicios.map(s => s.id)) + 1
        : 1;

    servicios.push({ id: nuevoId, nombre, descripcion, precio, duracion });
    guardarServicios(servicios);

    document.getElementById("formServicio").reset();
    listarServicios(document.getElementById("buscador").value);
    mostrarMensaje("Servicio registrado correctamente.", "success");
}

document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("formServicio")
        .addEventListener("submit", registrarServicio);
    document.getElementById("buscador")
        .addEventListener("input", (e) => listarServicios(e.target.value));
    listarServicios();
});