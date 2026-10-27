//INICIO

window.addEventListener("load",inicio);

function inicio() {
    //Botones nav
    document.getElementById("btnDatos").addEventListener("click", mostrarDatos);
    document.getElementById("btnEstadisticas").addEventListener("click", mostrarEstadisticas);

    // Mostrar datos y ocultar estadísticas al cargar la página
    document.getElementById("datos").style.display = "block";
    document.getElementById("estadisticas").style.display = "none";
    document.getElementById("btnDatos").className = "activo";
    document.getElementById("btnEstadisticas").className = "";

    // Botón para scroll arriba
    document.getElementById("subir").addEventListener("click", volverArriba);
    document.getElementById("BotonCarrera").addEventListener("click", agregarCarrera);

    // Botones y utilidades de formularios
    document.getElementById("BotonPatrocinador").addEventListener("click", agregarPatrocinador);
    document.getElementById("BotonCorredor").addEventListener("click", agregarCorredor);
    document.getElementById("BotonInscripcion").addEventListener("click", inscribirCorredor);
    document.getElementById("ListaCarrerasIns").addEventListener("change", tablaInscriptos);
    document.getElementById("OrdenName").addEventListener("click", tablaInscriptos);
    document.getElementById("OrdenNum").addEventListener("click", tablaInscriptos);
}

//UTILIDADES

// Al tocar el botón de datos, muestra los datos y oculta las estadísticas
function mostrarDatos() {
    // Se muestra la sección de datos y se oculta la de estadísticas
    document.getElementById("datos").style.display = "block";
    document.getElementById("estadisticas").style.display = "none";

    // Se cambia la clase de los botones para resaltar el activo
    document.getElementById("btnDatos").className = "activo";
    document.getElementById("btnEstadisticas").className = "";
}

// Al tocar el botón de estadísticas, muestra las estadísticas y oculta los datos
function mostrarEstadisticas() {
    // Se muestra la sección de estadísticas y se oculta la de datos
    document.getElementById("datos").style.display = "none";
    document.getElementById("estadisticas").style.display = "block";

    // Se cambia la clase de los botones para resaltar el activo
    document.getElementById("btnDatos").className = "";
    document.getElementById("btnEstadisticas").className = "activo";
}

// Funcionalidad de scroll al inicio de la pagina
window.addEventListener("scroll", function() { // Escuchamos el scroll del nav
    if (window.scrollY > 150) { // Revisamos haber hecho scroll mas de 150px hacia abajo - es arbitrario el 300
        document.getElementById("subir").style.display = "block"; // hacemos visible el button con display block
    } else {
        document.getElementById("subir").style.display = "none"; // si no subimos, dejamos display none (invisible)
    }
});

function volverArriba() {
    window.scrollTo({ top: 0, behavior: "smooth" });
}

// Indice para combos
const departamentos = {
    1: "Montevideo",
    2: "Canelones",
    3: "Maldonado",
    4: "Rocha",
    5: "Treinta y Tres",
    6: "Cerro Largo",
    7: "Rivera",
    8: "Artigas",
    9: "Salto",
    10: "Paysandú",
    11: "Río Negro",
    12: "Soriano",
    13: "Colonia",
    14: "San José",
    15: "Flores",
    16: "Florida",
    17: "Lavalleja",
    18: "Durazno",
    19: "Tacuarembó"
}; // con esto vinculo cada value del departamento con un nombre

const nombresRubros = {
    1: "Alimenticio",
    2: "Banco",
    3: "Bebidas",
    4: "Farmacia",
    5: "Ropa Deportiva",
    6: "Estatal",
    7: "General"
}; // con esto vinculo cada value del rubro con un nombre

const sistema = new Sistema(); // Declarada en clases

// DATOS

function agregarCarrera() {
    // Obtiene los valores de los campos del formulario
    const nombre = document.getElementById("NombreCarrera").value;
    const departamento = document.getElementById("DptoCarrera").value;
    const fecha = document.getElementById("FechaCarrera").value;
    const cupo = document.getElementById("cupo").value;
    const cupoNum = parseInt(cupo);
    
    // Transforma el value del departamento al nombre del departamento con indice
    const nombreDepartamento = departamentos[departamento]; 
    
    // Verifica que el nombre de la carrera no exista
    if(sistema.existeCarrera(nombre)){
        alert("Ya existe una carrera con ese nombre");
        return;
    }
    
    // Validaciones de campos
    let errores = [];
    let campos = {
        "Nombre": nombre,
        "Departamento": departamento,
        "Fecha": fecha,
        "Cupo": cupo
    };
    for (let campo in campos) {
        if (!campos[campo]) {
            errores.push(campo);
        }
    } 
    if (!sistema.validarCupo(cupoNum)) {
        errores.push("Cupo de carrera no valido, tiene que ser entre 1 y 1000");
    }  
    
    // Si hay errores, los muestra al usuario
    if (errores.length > 0){
        alert("Los siguientes campos estan incompletos:\n- " + errores.join("\n- ")+
        "\nPor favor, completalos para avanzar")
        return;
    }
    
    // Crea una nueva carrera y la agrega al sistema
    const nuevaCarrera = new Carrera(nombre, nombreDepartamento, fecha, cupoNum);
    sistema.agregarCarrera(nuevaCarrera);
    agregarComboCarrera(sistema.carreras); // Actualiza el combo de carreras
    actualizarListaCarrerasPatrocinador(); // Actualiza el combo de patrocinadores
    
    // Borra los campos para que el usuario no tenga que hacerlo
    document.getElementById("FormCarrera").reset();
}

function agregarCorredor(){
    // Obtiene los valores de los campos del formulario
    const nombreCorredor = document.getElementById("NombreCorredor").value;
    const edadCorredor = document.getElementById("edad").value;
    const cedula = document.getElementById("cedula").value;
    const fechaFicha = document.getElementById("FechaFicha").value;
    const tipoCorredor = document.getElementById("DepElite").checked ? "Élite" : "Común";
    
    // Validaciones de campos
    let errores = [];
    let campos = {
        "Nombre": nombreCorredor,
        "Edad": edadCorredor,
        "Cedula": cedula,
        "Fecha de vencimiento de ficha médica": fechaFicha,
        "Tipo de corredor": tipoCorredor
    };
    for (let campo in campos) {
        if (!campos[campo]) errores.push(campo);
    }
    
    // Verifica la cedula
    if (!sistema.validarCedula(cedula)) errores.push("Cédula inválida: debe tener entre 6 y 8 dígitos numéricos");

    // Verifica que la cédula no exista
    if(sistema.existeCedula(cedula)) errores.push("Ya existe un corredor asociado con esa cedula intente de nuevo");

    // Verifica que sea mayor de edad
    if (!sistema.validarEdad(edadCorredor)) errores.push("Para ser asociado se tiene que ser mayor de edad");

    // Verifica que no este vencida la ficha
    if (new Date(fechaFicha + "T00:00") < new Date()) errores.push("Ficha medica vencida");

    // Si hay errores, los muestra al usuario
    if (errores.length > 0) {
        alert("Los siguientes campos estan incompletos:\n- " + errores.join("\n- ")+
        "\nPor favor, completalos para avanzar")
        return;
    }

    // Crea un nuevo corredor y lo agrega al sistema
    const nuevoCorredor= new Corredor(nombreCorredor, edadCorredor, cedula, fechaFicha, tipoCorredor);
    sistema.agregarCorredor(nuevoCorredor);
    agregarComboCorredor(sistema.corredores); // Actualiza el combo de corredores

    // Borra los campos para que el usuario no tenga que hacerlo
    document.getElementById("FormCorredores").reset();
}

function agregarPatrocinador() {
    const nombrePatrocinador = document.getElementById("NombrePatrocinadores").value;
    const rubroPatrocinador = document.getElementById("rubro").value;
    const carrerasPatrocinadorObj = document.getElementById("ListaCarreras");

    // Separa las carreras seleccionadas
    const carrerasSeleccionadas  = sistema.carrerasSelectPatrocinador(carrerasPatrocinadorObj);

    // Transforma el value del rubro al nombre con indice
    const nombreRubro = nombresRubros[rubroPatrocinador];

    // Validaciones de campos
    const errores = [];
    if (!nombrePatrocinador) errores.push("Nombre");
    if (!rubroPatrocinador) errores.push("Rubro");
    if (carrerasSeleccionadas.length === 0) errores.push("Carreras");

    if (errores.length > 0) {
        alert("Faltan completar los siguientes campos:\n- " + errores.join("\n- "));
        return;
    }

    // Creo array y texto con carreras seleccionadas
    const carrerasPatrocinador = sistema.separarCarrerasPatrocinador(carrerasSeleccionadas);

    // Añado a sistema y si es el mismo patrocinador actualizo info
    const update = sistema.actualizarPatrocinador(nombrePatrocinador, nombreRubro, carrerasPatrocinador.array);

    if (update) alert("Patrocinador actualizado.\n" + "Actualización --> Carrera/as: " + carrerasPatrocinador.texto + " - " + "Rubro: " + nombreRubro);

    document.getElementById("FormPatrocinadores").reset();
}

function inscribirCorredor() {
    const cedulaCorredor = document.getElementById("ComboCorredor").value;
    const nombreCarrera = document.getElementById("ComboCarrera").value;
    
    // Verifica ficha medica del corredor y que haya cupo, si es asi entonces inscribe
    let result = sistema.inscribirCorredorPorCedula(cedulaCorredor, nombreCarrera);
    
    // Muestra el resultado de la inscripción
    if (result.error) {
        alert("Inscripción fallida.\n" + result.mensaje);
        return;
    } else {
        alert("Inscripción exitosa.\n" + result.mensaje);
    }
    
    document.getElementById("FormInscripciones").reset();
    
    // Actualiza el combo de carreras inscriptos y datos gen
    datosGenerales();
    agregarComboCarreraInscriptos();

    // Descarga hace y descarga PDF
    generarCertificado(result.corredor, result.carrera, result.numero)
}

// COMBOS

function actualizarListaCarrerasPatrocinador() {
    const select = document.getElementById("ListaCarreras");
    select.innerHTML = "";

    sistema.carreras.sort((a, b) => a.nombre.localeCompare(b.nombre));

    for (let carrera of sistema.carreras) {
        const option = document.createElement("option");
        option.textContent = carrera.nombre;
        option.value = carrera.nombre;
        select.appendChild(option);
    }
}

function agregarComboCorredor(listaCorredores) {
    const selectCorredores = document.getElementById("ComboCorredor");
    selectCorredores.innerHTML = ""; // Limpiar opciones anteriores
    
    // Ordenar por nombre
    sistema.ordenarPorNombre(listaCorredores);
    
    // Poner un value para que se vea bonito al agregar corredor
    let disable = document.createElement("option");
    disable.textContent = "-- Seleccionar --";
    disable.value = "";
    disable.disabled = true; // no permite seleccionarlo como opción válida
    disable.selected = true; // aparece seleccionado por defecto
    selectCorredores.appendChild(disable);
    
    // Agregar las opciones al select
    for (let elemento of listaCorredores) {
        let nodoC = document.createElement("option");
        let texto = elemento.nombre + " - CI: " + elemento.cedula;
        nodoC.textContent = texto;
        nodoC.value = elemento.cedula; // Usar el value para identificarlo luego
        selectCorredores.appendChild(nodoC);
    }
}

function agregarComboCarrera(listaCarreras) {
    // Actualiza el combo de carreras
    const selectCarreras = document.getElementById("ComboCarrera");
    selectCarreras.innerHTML = ""; // Limpiar opciones anteriores
    
    // Ordenar por nombre
    sistema.ordenarPorNombre(listaCarreras);
    
    // Poner un value para que se vea bonito al agregar carreras
    let disable = document.createElement("option");
    disable.textContent = "-- Seleccionar --";
    disable.value = "";
    disable.disabled = true; // no permite seleccionarlo como opción válida
    disable.selected = true; // aparece seleccionado por defecto
    selectCarreras.appendChild(disable);
    
    // Agregar las opciones al select
    for (let elemento of listaCarreras) {
        let nuevaOption = document.createElement("option");
        let texto = elemento.nombre;
        nuevaOption.textContent = texto;
        nuevaOption.value = elemento.nombre; // Usar el value para identificarlo luego
        selectCarreras.appendChild(nuevaOption);
    }
}

function agregarComboCarreraInscriptos() {
    const selectCarrerasInscriptos = document.getElementById("ListaCarrerasIns");
    selectCarrerasInscriptos.innerHTML = ""; // Limpiar opciones anteriores
    
    // Como estoy en un array con objetos, recorro el array y creo un nuevo array con los nombres de las carreras, buscando unicidad
    let listaCarrerasConInscriptos = sistema.separarCarrerasDelArray(sistema.inscripciones);
    
    // Ordenar por nombre
    sistema.ordenarPorNombre(listaCarrerasConInscriptos);
    
    // Poner un value para que se vea bonito al agregar carreras
    let disable = document.createElement("option");
    disable.textContent = "-- Seleccionar --";
    disable.value = "";
    disable.disabled = true; // no permite seleccionarlo como opción válida
    disable.selected = true; // aparece seleccionado por defecto
    selectCarrerasInscriptos.appendChild(disable);
    
    // Agregar las opciones al select
    for (let elemento of listaCarrerasConInscriptos) {
        let nuevaOption = document.createElement("option");
        nuevaOption.textContent = elemento.nombre;
        nuevaOption.value = elemento.nombre; // Usar el value para identificarlo luego
        selectCarrerasInscriptos.appendChild(nuevaOption);
    }
    
    // Forzar ejecución de tabla
    tablaInscriptos();
}

const { jsPDF } = window.jspdf;

function generarCertificado(corredor, carrera, numero) {
    const doc = new jsPDF();
    const patrocinadores = sistema.buscarPatrocinadoresPorCarrera(carrera)

    // título
    doc.setFontSize(16);
    doc.text("CERTIFICADO DE INSCRIPCIÓN A LA CARRERA", 20, 20);     // , eje x, eje y) usa hoja A4 asi que son de 595 x 842 pt

    // Subtitulo de Patrocinadores
    doc.setFontSize(13);
    doc.text("Datos:", 20, 30);

    // datos del corredor con concatenación tradicional
    doc.setFontSize(12);
    doc.text("Numero de corredor asignado: " + numero, 20, 38);
    doc.text("Nombre: " + corredor.nombre + " - CI: " + corredor.cedula + " - Edad: " + corredor.edad,  20, 45);
    doc.text("Tipo: " + corredor.tipo, 20, 52)

    // datos de la carrera
    doc.text("Carrera: " + carrera.nombre + " - Fecha: " + carrera.fecha.toLocaleDateString(), 20, 59);

    let saltoFinal = 69;
    if (patrocinadores.length > 0) {
        saltoFinal = 92;
        
        doc.setFontSize(12);
        let saltolinea = 81;
        if (patrocinadores.length > 1) {
            // Subtitulo de Patrocinadores
            doc.setFontSize(13);
            doc.text("Patrocinadores:", 20, 74);
            let contador = 1;
            for (p of patrocinadores) {
                doc.text(contador +"- " + p.nombre + " (" + p.rubro + ")", 20, saltolinea);
                contador += 1;
                saltolinea += 7;
                saltoFinal += 9;
            }
        } else { 
            // Subtitulo de Patrocinadores
            doc.setFontSize(13);
            doc.text("Patrocinador:", 20, 74);
            doc.text("- " + patrocinadores[0].nombre + " (" + patrocinadores[0].rubro + ")", 20, saltolinea);
        }
    }     

    doc.text("¡Gracias por participar!", 20, saltoFinal);

    // descarga
    doc.save("certificado_" + corredor.nombre + ".pdf");
}

// ESTADISTICAS

function datosGenerales() {
    
    // Promedio de inscripciones por carrera
    if (sistema.carreras.length > 0) {
        let promedioTexto = sistema.promedioInscripcionesPorCarrera().toFixed(2);
        document.getElementById("promedio").innerText = promedioTexto;
    }

    // Meto en const para llamar solo una vez
    const carrerasComparadas = sistema.compararCarrerasPorInscripciones();

    // Carreras con mayor cantidad de inscriptos
    const carrerasMasInscriptos = carrerasComparadas.mas;
    const liMas = document.getElementById("masInscriptos");
    if (carrerasMasInscriptos.length > 0) {
        liMas.innerHTML = ""; // limpiar

        for (let carreraMas of carrerasMasInscriptos) {
            let cantidadInscriptos = sistema.contadorInscriptos(carreraMas);
            let nuevaLi = document.createElement("li");
            nuevaLi.textContent = carreraMas.nombre + " (" + cantidadInscriptos + " inscriptos)";
            liMas.appendChild(nuevaLi);
        }
    }

    // Carreras sin inscriptos
    const carrerasSinInscriptos = carrerasComparadas.sin;
    const liSin = document.getElementById("sinInscriptos");
    if (carrerasSinInscriptos.length > 0 ) {
        liSin.innerHTML = ""; // limpiar

        for (let carreraSin of carrerasSinInscriptos) {
            let cantidadInscriptos = sistema.contadorInscriptos(carreraSin);
            let nuevaLi = document.createElement("li");
            nuevaLi.textContent = carreraSin.nombre + " con " + cantidadInscriptos + " inscriptos";
            liSin.appendChild(nuevaLi);
        }
    }

    // Porcentaje de corredores Élite
    let porcentajeElite = sistema.porcentajeElite();
            document.getElementById("porcentajeElite").innerText = porcentajeElite.toFixed(2) + "% del total de corredores."      ;
}

function tablaInscriptos() {
    const carreraSeleccionada = document.getElementById("ListaCarrerasIns").value;
    const ordenPorNumero = document.getElementById("OrdenNum").checked;  
    const tabla = document.getElementById("tbodyInscriptos");
    tabla.innerHTML = ""; // Limpiar la tabla antes de agregar nuevos datos
    
    // Sacar inscriptos de la carrera seleccionada
    let inscriptosEstaCarrera = [];
    for (let inscripcion of sistema.inscripciones) {
        if (inscripcion.carrera.nombre === carreraSeleccionada) {
            inscriptosEstaCarrera.push({
                corredor: inscripcion.corredor,
                numero: inscripcion.numero
            });
        }
    }

    // Ordenar los inscriptos según la preferencia del usuario
    if (ordenPorNumero) {
        sistema.ordenarPorNumeroDeInscripto(inscriptosEstaCarrera);
    } else {
        sistema.ordenarPorNombreTABLE(inscriptosEstaCarrera); 
    }

    // Agregar los inscriptos a la tabla
    for (let corredorInscripto of inscriptosEstaCarrera) {
        let nuevaRow = document.createElement("tr");

        // Si el corredor es Élite, se resalta la row (el color está en la clase "elite" del CSS)
        if (corredorInscripto.corredor.tipo === "Élite") {
            nuevaRow.className = "elite";
        }

        // Crear celdas para cada dato del corredor
        let nombreCell = document.createElement("td");
        nombreCell.textContent = corredorInscripto.corredor.nombre;
        let edadCell = document.createElement("td");
        edadCell.textContent = corredorInscripto.corredor.edad;
        let cedulaCell = document.createElement("td");
        cedulaCell.textContent = corredorInscripto.corredor.cedula;
        let fichaCell = document.createElement("td");
        fichaCell.textContent = corredorInscripto.corredor.fechaFicha.toLocaleDateString();
        let numeroCell = document.createElement("td");
        numeroCell.textContent = corredorInscripto.numero;
        nuevaRow.appendChild(nombreCell);
        nuevaRow.appendChild(edadCell);
        nuevaRow.appendChild(cedulaCell);
        nuevaRow.appendChild(fichaCell);
        nuevaRow.appendChild(numeroCell);
        tabla.appendChild(nuevaRow);
    }
}