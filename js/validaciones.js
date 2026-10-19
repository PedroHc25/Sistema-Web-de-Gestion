
function validarReserva(datos) {
    if (!datos.cliente.trim()) {
        return "Ingrese el nombre del cliente.";
    }

    if (!datos.servicio.trim()) {
        return "Ingrese el servicio solicitado.";
    }

    if (!datos.fecha || !datos.hora) {
        return "Seleccione la fecha y la hora de la reserva.";
    }

    const ahora = new Date();
    const fechaHoraReserva = new Date(
        `${datos.fecha}T${datos.hora}:00`
    );

    if (Number.isNaN(fechaHoraReserva.getTime())) {
        return "La fecha o la hora ingresada no es válida.";
    }

    if (fechaHoraReserva < ahora) {
        return "La fecha y hora deben ser futuras.";
    }

    if (
        !Number.isInteger(datos.duracion) ||
        datos.duracion < 1 ||
        datos.duracion > 24
    ) {
        return "La duración debe ser de 1 a 24 horas.";
    }

    if (!Number.isFinite(datos.precio) || datos.precio <= 0) {
        return "El precio debe ser mayor que cero.";
    }

    return "";
function validarNombre(nombre) {
    return nombre.trim().length >= 2 &&
        /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]+$/.test(nombre.trim());
}

function validarDni(dni) {
    return /^\d{8}$/.test(dni.trim());
}

function validarTelefono(telefono) {
    return /^\d{9}$/.test(telefono.trim());
}

function validarCorreo(correo) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo.trim());
}

function validarDatosCliente(cliente) {
    const errores = {};

    if (!validarNombre(cliente.nombre)) {
        errores.nombre =
            "Ingresa un nombre válido de al menos 2 caracteres.";
    }

    if (!validarDni(cliente.documento)) {
        errores.documento = "El DNI debe tener exactamente 8 dígitos.";
    }

    if (!validarTelefono(cliente.telefono)) {
        errores.telefono =
            "El teléfono debe tener exactamente 9 dígitos.";
    }

    if (!validarCorreo(cliente.correo)) {
        errores.correo = "Ingresa un correo electrónico válido.";
    }

    return errores;
}
}