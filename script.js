document.addEventListener('DOMContentLoaded', function () {
    const equipos = ['Equipo A', 'Equipo B', 'Equipo C', 'Equipo D', 'Equipo E', 'Equipo F', 'Equipo G', 'Equipo H', 'Equipo I', 'Equipo J'];
    const tecnicos = ['Oropeza', 'Garcia', 'Pereira', 'Frías', 'Torres', 'Gonzalez', 'Gutiérrez', 'Montaña', 'Mayobre', 'Nares', 'Gomes', 'Yoswell', 'Gil', 'Alexis Gil', 'Luis', 'Armando', 'Araujo', 'Darwin', 'Anthony', 'Villegas', 'Espinoza', 'Baptista'];
    let clientes = JSON.parse(localStorage.getItem('clientes')) || [];
    let contadorOrden = parseInt(localStorage.getItem('contadorOrden')) || 1;

    const equiposDiv = document.getElementById('equipos');

    // Función para inicializar los equipos y técnicos
    function inicializarEquipos() {
        equipos.forEach(equipo => {
            const equipoDiv = document.createElement('div');
            equipoDiv.classList.add('equipo');
            equipoDiv.innerHTML = `
                <h2>${equipo}</h2>
                <select id="${equipo.replace(' ', '-')}Tecnico1"><option value="">Seleccionar Técnico 1</option></select>
                <select id="${equipo.replace(' ', '-')}Tecnico2"><option value="">Seleccionar Técnico 2</option></select>
                <div id="${equipo.replace(' ', '-')}Instalaciones"></div>
            `;
            equiposDiv.appendChild(equipoDiv);

            tecnicos.forEach(tecnico => {
                const option1 = document.createElement('option');
                option1.value = tecnico;
                option1.textContent = tecnico;
                document.getElementById(`${equipo.replace(' ', '-')}Tecnico1`).appendChild(option1);

                const option2 = document.createElement('option');
                option2.value = tecnico;
                option2.textContent = tecnico;
                document.getElementById(`${equipo.replace(' ', '-')}Tecnico2`).appendChild(option2);
            });
        });
    }

    // Función para mostrar los clientes en la interfaz
    function mostrarClientes() {
        equipos.forEach(equipo => {
            const instalacionesDiv = document.getElementById(`${equipo.replace(' ', '-')}Instalaciones`);
            instalacionesDiv.innerHTML = '';
            clientes.forEach((cliente, index) => {
                if (cliente.equipo === equipo) {
                    const instalacionDiv = document.createElement('div');
                    instalacionDiv.classList.add('instalacion');
                    instalacionDiv.innerHTML = `
                        <span>${cliente.numeroOrden} - ${cliente.nombre} - ${cliente.ubicacion} - ${cliente.dia}</span>
                        <select id="estatus-${index}">
                            <option value="INSTALADO" ${cliente.estatus === 'INSTALADO' ? 'selected' : ''}>INSTALADO</option>
                            <option value="POR INSTALAR" ${cliente.estatus === 'POR INSTALAR' ? 'selected' : ''}>POR INSTALAR</option>
                            <option value="NO-FACTIBLE" ${cliente.estatus === 'NO-FACTIBLE' ? 'selected' : ''}>NO FACTIBLE</option>
                            <option value="NO-SE-OBTUVO-RESPUESTA" ${cliente.estatus === 'NO-SE-OBTUVO-RESPUESTA' ? 'selected' : ''}>NO SE OBTUVO RESPUESTA</option>
                            <option value="MOTIVOS-PERSONALES" ${cliente.estatus === 'MOTIVOS-PERSONALES' ? 'selected' : ''}>MOTIVOS PERSONALES</option>
                            <option value="YA-INSTALADO" ${cliente.estatus === 'YA-INSTALADO' ? 'selected' : ''}>YA INSTALADO</option>
                        </select>
                        <button onclick="editarCliente(${index})">Editar</button>
                        <button onclick="eliminarCliente(${index})">Eliminar</button>
                    `;
                    instalacionesDiv.appendChild(instalacionDiv);

                    document.getElementById(`estatus-${index}`).addEventListener('change', function () {
                        clientes[index].estatus = this.value;
                        localStorage.setItem('clientes', JSON.stringify(clientes));
                    });
                }
            });
        });
    }

    // Función para manejar el envío del formulario
    function manejarEnvioFormulario(event) {
        event.preventDefault();
        const nombre = document.getElementById('nombre').value;
        const contacto = document.getElementById('contacto').value;
        const ubicacion = document.getElementById('ubicacion').value;
        const dia = document.getElementById('dia').value;
        const asesor = document.getElementById('asesor').value;
        const equipo = document.getElementById('equipo').value;
        const numeroOrden = `SI-${contadorOrden.toString().padStart(4, '0')}`;

        clientes.push({ nombre, contacto, ubicacion, dia, asesor, equipo, numeroOrden, estatus: 'POR INSTALAR' });

        localStorage.setItem('clientes', JSON.stringify(clientes));
        contadorOrden++;
        localStorage.setItem('contadorOrden', contadorOrden.toString());
        mostrarClientes();
        event.target.reset();
    }

    // Función para exportar los datos a Excel
    function exportarAExcel() {
        const wb = XLSX.utils.book_new();
        const wsData = [
            ["PLANIFICACIÓN LUNES 24/02"],
            ["NUMERO DE ORDEN", "EQUIPO A", "EQUIPO B", "EQUIPO C", "EQUIPO D", "EQUIPO E", "EQUIPO F", "EQUIPO G", "EQUIPO H", "EQUIPO I", "EQUIPO J"]
        ];

        clientes.forEach(cliente => {
            const row = [
                cliente.numeroOrden,
                cliente.equipo === 'Equipo A' ? cliente.nombre : '',
                cliente.equipo === 'Equipo B' ? cliente.nombre : '',
                cliente.equipo === 'Equipo C' ? cliente.nombre : '',
                cliente.equipo === 'Equipo D' ? cliente.nombre : '',
                cliente.equipo === 'Equipo E' ? cliente.nombre : '',
                cliente.equipo === 'Equipo F' ? cliente.nombre : '',
                cliente.equipo === 'Equipo G' ? cliente.nombre : '',
                cliente.equipo === 'Equipo H' ? cliente.nombre : '',
                cliente.equipo === 'Equipo I' ? cliente.nombre : '',
                cliente.equipo === 'Equipo J' ? cliente.nombre : ''
            ];
            wsData.push(row);
        });

        const ws = XLSX.utils.aoa_to_sheet(wsData);
        XLSX.utils.book_append_sheet(wb, ws, "Instalaciones");
        XLSX.writeFile(wb, "instalaciones.xlsx");
    }

    // Función para buscar solicitudes por número de ticket
    function buscarSolicitudPorTicket() {
        const numeroTicket = document.getElementById('buscarTicket').value.trim().toUpperCase();
        if (!numeroTicket) {
            alert("Por favor, ingrese un número de ticket.");
            return;
        }

        const solicitudEncontrada = clientes.find(cliente => cliente.numeroOrden === numeroTicket);

        if (solicitudEncontrada) {
            // Mostrar la solicitud encontrada
            alert(`Solicitud encontrada:\n
                Número de Ticket: ${solicitudEncontrada.numeroOrden}\n
                Nombre: ${solicitudEncontrada.nombre}\n
                Contacto: ${solicitudEncontrada.contacto}\n
                Ubicación: ${solicitudEncontrada.ubicacion}\n
                Día: ${solicitudEncontrada.dia}\n
                Asesor: ${solicitudEncontrada.asesor}\n
                Equipo: ${solicitudEncontrada.equipo}\n
                Estatus: ${solicitudEncontrada.estatus}`);
        } else {
            alert("No se encontró ninguna solicitud con ese número de ticket.");
        }
    }

    // Funciones globales para editar y eliminar clientes
    window.editarCliente = function (index) {
        const cliente = clientes[index];
        document.getElementById('nombre').value = cliente.nombre;
        document.getElementById('contacto').value = cliente.contacto;
        document.getElementById('ubicacion').value = cliente.ubicacion;
        document.getElementById('dia').value = cliente.dia;
        document.getElementById('asesor').value = cliente.asesor;
        document.getElementById('equipo').value = cliente.equipo;
        clientes.splice(index, 1);
        localStorage.setItem('clientes', JSON.stringify(clientes));
        mostrarClientes();
    }

    window.eliminarCliente = function (index) {
        if (confirm("¿Está seguro de que desea eliminar esta solicitud?")) {
            clientes.splice(index, 1);
            localStorage.setItem('clientes', JSON.stringify(clientes));
            mostrarClientes();
        }
    }

    // Inicialización
    inicializarEquipos();
    mostrarClientes();

    // Event Listeners
    document.getElementById('clienteForm').addEventListener('submit', manejarEnvioFormulario);
    document.getElementById('exportarExcel').addEventListener('click', exportarAExcel);
    document.getElementById('botonBuscar').addEventListener('click', buscarSolicitudPorTicket);
    document.getElementById('buscarTicket').addEventListener('keypress', function (event) {
        if (event.key === 'Enter') {
            buscarSolicitudPorTicket();
        }
    });
});