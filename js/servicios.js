const CLAVE_SERVICIOS = "servicios";
const MAX_MINUTOS = 24 * 60;

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

function parsearDuracion(texto) {
    const coincidencia = /^(\d{1,2}):([0-5]\d)$/.exec(texto.trim());
    if (!coincidencia) {
        return null;
    }
    const horas = parseInt(coincidencia[1], 10);
    const minutos = parseInt(coincidencia[2], 10);
    const total = horas * 60 + minutos;
    return total > 0 && total <= MAX_MINUTOS ? total : null;
}

// Convierte 90 minutos en "1:30".
function formatearDuracion(totalMinutos) {
    const horas = Math.floor(totalMinutos / 60);
    const minutos = totalMinutos % 60;
    return `${horas}:${String(minutos).padStart(2, "0")}`;
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
            <td>${escaparHtml(s.duracion)} h</td>
        </tr>`).join("");
}

function registrarServicio(evento) {
    evento.preventDefault();

    const nombre = document.getElementById("nombre").value.trim();
    const descripcion = document.getElementById("descripcion").value.trim();
    const precio = parseFloat(document.getElementById("precio").value);
    const duracionMinutos = parsearDuracion(
        document.getElementById("duracion").value
    );

    if (nombre === "") {
        mostrarMensaje("El nombre del servicio es obligatorio.", "danger");
        return;
    }
    if (isNaN(precio) || precio < 0) {
        mostrarMensaje("Ingresa un precio válido (0 o mayor).", "danger");
        return;
    }
    if (duracionMinutos === null) {
        mostrarMensaje(
            "Ingresa la duración en formato H:MM (ej: 1:30), mayor a 0 y hasta 24:00.",
            "danger"
        );
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

    servicios.push({
        id: nuevoId,
        nombre,
        descripcion,
        precio,
        duracion: formatearDuracion(duracionMinutos),
        duracionMinutos
    });
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