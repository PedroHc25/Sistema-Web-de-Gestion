
document.addEventListener("DOMContentLoaded", () => {
    const formulario = document.getElementById("formularioCliente");
    const campoId = document.getElementById("clienteId");
    const campoNombre = document.getElementById("nombre");
    const campoDocumento = document.getElementById("documento");
    const campoTelefono = document.getElementById("telefono");
    const campoCorreo = document.getElementById("correo");

    const tablaClientes = document.getElementById("tablaClientes");
    const mensaje = document.getElementById("mensaje");
    const tituloFormulario = document.getElementById("tituloFormulario");
    const btnGuardar = document.getElementById("btnGuardar");
    const btnCancelar = document.getElementById("btnCancelar");

    const CLAVE_CLIENTES = "sistema_gestion_clientes";

    let clientes = cargarClientes();

    function cargarClientes() {
        try {
            const datos = JSON.parse(
                localStorage.getItem(CLAVE_CLIENTES) || "[]"
            );

            return Array.isArray(datos) ? datos : [];
        } catch (error) {
            console.error("Error al cargar los clientes:", error);
            return [];
        }
    }

    function guardarClientes() {
        try {
            localStorage.setItem(
                CLAVE_CLIENTES,
                JSON.stringify(clientes)
            );
            return true;
        } catch (error) {
            console.error("Error al guardar los clientes:", error);
            mostrarMensaje(
                "No se pudieron guardar los clientes en el navegador.",
                "danger"
            );
            return false;
        }
    }

    function mostrarMensaje(texto, tipo = "success") {
        mensaje.textContent = texto;
        mensaje.className = `alert alert-${tipo} mb-3`;
    }

    function limpiarMensaje() {
        mensaje.textContent = "";
        mensaje.className = "mb-3";
    }

    function escaparHTML(texto) {
        return String(texto ?? "").replace(/[&<>"']/g, caracter => {
            const entidades = {
                "&": "&amp;",
                "<": "&lt;",
                ">": "&gt;",
                '"': "&quot;",
                "'": "&#39;"
            };

            return entidades[caracter];
        });
    }

    function renderizarClientes() {
        tablaClientes.replaceChildren();

        if (clientes.length === 0) {
            const fila = document.createElement("tr");
            const celda = document.createElement("td");

            celda.colSpan = 5;
            celda.className = "text-center text-secondary";
            celda.textContent = "No hay clientes registrados.";

            fila.appendChild(celda);
            tablaClientes.appendChild(fila);
            return;
        }

        clientes.forEach(cliente => {
            const fila = document.createElement("tr");

            fila.innerHTML = `
                <td>${escaparHTML(cliente.nombre)}</td>
                <td>${escaparHTML(cliente.documento)}</td>
                <td>${escaparHTML(cliente.telefono)}</td>
                <td>${escaparHTML(cliente.correo)}</td>
                <td>
                    <div class="d-flex gap-2">
                        <button type="button"
                            class="btn btn-warning btn-sm"
                            data-accion="editar"
                            data-id="${escaparHTML(cliente.id)}">
                            Editar
                        </button>
                        <button type="button"
                            class="btn btn-danger btn-sm"
                            data-accion="eliminar"
                            data-id="${escaparHTML(cliente.id)}">
                            Eliminar
                        </button>
                    </div>
                </td>
            `;

            tablaClientes.appendChild(fila);
        });
    }

    function limpiarErrores() {
        [
            campoNombre,
            campoDocumento,
            campoTelefono,
            campoCorreo
        ].forEach(campo => {
            campo.classList.remove("is-invalid", "is-valid");
        });
    }

    function validarFormulario(cliente) {
        const errores = validarDatosCliente(cliente);

        const campos = {
            nombre: campoNombre,
            documento: campoDocumento,
            telefono: campoTelefono,
            correo: campoCorreo
        };

        limpiarErrores();

        Object.entries(campos).forEach(([nombre, campo]) => {
            campo.classList.add(
                errores[nombre] ? "is-invalid" : "is-valid"
            );
        });

        if (Object.keys(errores).length > 0) {
            mostrarMensaje(
                Object.values(errores).join(" "),
                "danger"
            );

            const primerCampoConError = Object.keys(errores)[0];
            campos[primerCampoConError].focus();

            return false;
        }

        return true;
    }

    function reiniciarFormulario() {
        formulario.reset();
        campoId.value = "";
        limpiarErrores();

        tituloFormulario.textContent = "Registrar cliente";
        btnGuardar.textContent = "Registrar cliente";
        btnCancelar.hidden = true;
    }

    formulario.addEventListener("submit", evento => {
        evento.preventDefault();
        limpiarMensaje();

        const cliente = {
            nombre: campoNombre.value.trim(),
            documento: campoDocumento.value.trim(),
            telefono: campoTelefono.value.trim(),
            correo: campoCorreo.value.trim()
        };

        if (!validarFormulario(cliente)) {
            return;
        }

        const idActual = campoId.value;

        const documentoDuplicado = clientes.some(
            existente =>
                existente.documento === cliente.documento &&
                existente.id !== idActual
        );

        if (documentoDuplicado) {
            mostrarMensaje(
                "Ya existe un cliente registrado con ese DNI.",
                "danger"
            );
            campoDocumento.focus();
            return;
        }

        if (idActual) {
            const indice = clientes.findIndex(
                existente => existente.id === idActual
            );

            if (indice === -1) {
                mostrarMensaje(
                    "No se encontró el cliente que deseas editar.",
                    "danger"
                );
                reiniciarFormulario();
                return;
            }

            clientes[indice] = {
                ...clientes[indice],
                ...cliente
            };

            if (!guardarClientes()) {
    return;
}

            mostrarMensaje("Cliente actualizado correctamente.");
        } else {
            const nuevoCliente = {
                id: String(Date.now()),
                ...cliente
            };

            clientes.push(nuevoCliente);

            if (!guardarClientes()) {
                clientes.pop();
                return;
            }

            mostrarMensaje("Cliente registrado correctamente.");
        }

        renderizarClientes();
        reiniciarFormulario();
    });

    tablaClientes.addEventListener("click", evento => {
        const boton = evento.target.closest("button[data-accion]");

        if (!boton) {
            return;
        }

        const id = boton.dataset.id;
        const accion = boton.dataset.accion;

        const cliente = clientes.find(
            existente => existente.id === id
        );

        if (!cliente) {
            mostrarMensaje("No se encontró el cliente.", "danger");
            return;
        }

        if (accion === "editar") {
            campoId.value = cliente.id;
            campoNombre.value = cliente.nombre;
            campoDocumento.value = cliente.documento;
            campoTelefono.value = cliente.telefono;
            campoCorreo.value = cliente.correo;

            limpiarErrores();
            limpiarMensaje();

            tituloFormulario.textContent = "Editar cliente";
            btnGuardar.textContent = "Guardar cambios";
            btnCancelar.hidden = false;

            campoNombre.focus();
            return;
        }

        if (accion === "eliminar") {
            const confirmar = window.confirm(
                `¿Deseas eliminar al cliente ${cliente.nombre}?`
            );

            if (!confirmar) {
                return;
            }

            const indice = clientes.findIndex(
                existente => existente.id === id
            );

            const clienteEliminado = clientes.splice(indice, 1)[0];

            if (!guardarClientes()) {
                clientes.splice(indice, 0, clienteEliminado);
                return;
            }

            renderizarClientes();
            reiniciarFormulario();
            mostrarMensaje("Cliente eliminado correctamente.");
        }
    });

    btnCancelar.addEventListener("click", () => {
        reiniciarFormulario();
        limpiarMensaje();
    });

    renderizarClientes();
});
