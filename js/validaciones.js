
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
