// Clase Carrera
class Carrera {
    constructor(nombre, departamento, fecha, cupo = 30) {
        this.nombre = nombre;
        this.departamento = departamento;
        this.fecha = new Date(fecha); // Asegurarse de que la fecha sea un objeto Date
        this.cupo = cupo;
    }

    // Formato toString para mostrar los detalles de la carrera
    toString() {
        return  "\n" 
                + "Carrera: " + this.nombre + " en " + this.departamento + " el " + this.fecha.toDateString() + " Cupo: " + this.cupo;
    }
}

// Clase Patrocinadores
class Patrocinadores {
    constructor(nombre, rubro) {
        this.nombre = nombre;
        this.rubro = rubro;
        this.carreras = [];
    }

    // Formato toString para mostrar los detalles del patrocinador
}

// Clase Corredor
class Corredor {
    constructor(nombre, edad, cedula, fechaFicha, tipo) {
        this.nombre = nombre;
        this.edad = edad;
        this.cedula = cedula;
        this.fechaFicha = new Date(fechaFicha); // Asegurarse de que la fecha sea un objeto Date
        this.tipo = tipo;
    }

    // Formato toString para mostrar los detalles del corredor
    toString() {
        return  "\nNombre: " + this.nombre + " " + this.edad + " años" + ", CI: " + this.cedula + ", Fecha medica: " + this.fechaFicha.toDateString() + 
                "\n" + this.tipo;
    }
}

// Clase Inscripcion
class Inscripcion {
    constructor(corredor, carrera, numero) {
        this.corredor = corredor;
        this.carrera = carrera;
        this.numero = numero; // Se le asigna en cada carrera
    }
}

// Clase Sistema
class Sistema {
    constructor() {
        this.carreras = [];
        this.patrocinadores = [];
        this.corredores = [];
        this.inscripciones = [];
    }

    // Métodos para agregar carreras, patrocinadores y corredores
    agregarCarrera(unaCarrera) {
        this.carreras.push(unaCarrera);
    }
    
    agregarPatrocinador(unPatrocinador) {
        this.patrocinadores.push(unPatrocinador);
    }
    
    agregarCorredor(unCorredor) {
        this.corredores.push(unCorredor);
    }
    
    // Métodos para verificar la existencia de carreras, patrocinadores y corredores
    existeCedula(cedula) {
        // Si ya existe una carrera con el nombre tira true
        for (let corredor of this.corredores) {
            if (corredor.cedula === cedula) {
                return true
            }
        }
        return false
    }
    
    actualizarPatrocinador(nombre, rubro, carreraArray) {
        // Si ya existe, actualiza su rubro y carrera, avisa si fue actualizado
        let update = false
        for (let patrocinador of this.patrocinadores) {
            if (patrocinador.nombre === nombre) {
                patrocinador.rubro = rubro;

                // vaciar y volver a cargar
                patrocinador.carreras = [];
                for (let carre of carreraArray) {
                    patrocinador.carreras.push(carre);
                }
                update = true;
                break;  // Si entro al if significa que ya lo encontro
            } 
        }
        if (!update) {
            let nuevoPatrocinador = new Patrocinadores(nombre, rubro, carreraArray);
            for (let carre of carreraArray) nuevoPatrocinador.carreras.push(carre);
            this.patrocinadores.push(nuevoPatrocinador);
        }
        return update
    }
    
    existeCarrera(nombre) {
        // Si ya existe una carrera con el nombre tira true
        for (let carrera of this.carreras) {
            if (carrera.nombre === nombre) {
                return true
            }
        }
        return false
    }
    
    // Métodos de validación y utilidades
    validarCupo(cupoNum) {
        if (cupoNum < 1 || cupoNum > 1000) {
            return false;
        }
        return true;
    }
    
    validarCedula(cedula) {
        if (cedula.length < 6 || cedula.length > 8) {
            return false;
        }
        for (let c of cedula) {
            if (c < '0' || c > '9') {
                return false;
            }
        }
        return true;
    }
    
    validarEdad(edadCorredor) {
        if (edadCorredor < 18) {
            return false
        }
        return true
    }
    
    validarCapacidadCupo(carrera) {
        if (this.contadorInscriptos(carrera) >= carrera.cupo) {
            return false;
        }
        return true;
    }
    
    ordenarPorNombre(lista) {
        lista.sort(function (a, b) {
            return a.nombre.localeCompare(b.nombre); // Si da 1, a empieza por una letra posterior a b; si da -1, a empieza por una letra anterior a b y si da 0, son iguales
        });
    }

    ordenarPorNombreTABLE(lista) {
        // Variante para ordenar la table
        lista.sort(function (a, b) {
            return a.corredor.nombre.localeCompare(b.corredor.nombre); // Si da 1, a empieza por una letra posterior a b; si da -1, a empieza por una letra anterior a b y si da 0, son iguales
        });
    }

    ordenarPorFecha(lista) {
        lista.sort(function (a, b) {
            return a.fecha - b.fecha; // Si da 1, a es posterior a b; si da -1, a es anterior a b y si da 0, son iguales
        });
    }

    ordenarPorNumeroDeInscripto(lista) {
        lista.sort(function (a, b) {
            return a.numero - b.numero; // Si da 1, a es mayor que b; si da -1, a es menor que b y si da 0, son iguales
        });
    }

    validarFechaFicha(corredor, carrera) {
        if (carrera.fecha > corredor.fechaFicha) { // Si la fecha de la carrera es posterior a la fecha de la ficha médica
            return false;
        }
        return true;
    }

    buscarCarreraPorNombre(nombre) {
        return this.carreras.find(function(carrera) {  // Busca y devuelve el primer match (solo un objeto) y termina
            return carrera.nombre === nombre;
        })
    }

    buscarPatrocinadoresPorCarrera(carrera) {
        return this.patrocinadores.filter(function(patrocinador) {  // Busca y devuelve todos los matchs (array)
            return patrocinador.carreras.includes(carrera);
        });
    }

    separarCarrerasDelArray() {
        // Separa los corredores del array de objetos y evita duplicados
        let resultado = [];
        for (let inscripcion of this.inscripciones) {
            let yaEsta = false;
            for (let r of resultado) {
                if (r.nombre === inscripcion.carrera.nombre) {
                    yaEsta = true;
                    break; // Si ya está, no lo agrego de nuevo
                }
            }
            if (!yaEsta) {
                resultado.push(inscripcion.carrera);
            }
        }
        return resultado;
    }

    carrerasSelectPatrocinador(carrerasPatrocinadorObj) {
        let carrerasSeleccionadas  = [];
        for (let opcion of carrerasPatrocinadorObj.options) {
            if (opcion.selected) {
                carrerasSeleccionadas.push(opcion.value);
            }
        }
        return carrerasSeleccionadas
    }

    separarCarrerasPatrocinador(carrerasSeleccionadas) {
        // Poner carreras seleccionadas en un array
        let carrerasPatrocinador = [];
        for (let carreraNombre of carrerasSeleccionadas) {
            const carreraEncontrada = sistema.buscarCarreraPorNombre(carreraNombre);
            carrerasPatrocinador.push(carreraEncontrada);
        }
        
        // Generar un texto para alert
        let textoCarreras = "";
        for (let carrera of carrerasPatrocinador) { textoCarreras += carrera.nombre + ", "; }
        if (textoCarreras.length > 0) { textoCarreras = textoCarreras.slice(0, -2); } // saco la última coma

        return {
            array: carrerasPatrocinador,
            texto: textoCarreras
        }
    }
    
    contadorInscriptos(carrera) {
        // Cuenta la cantidad de inscriptos en una carrera específica
        let contadorInscriptos = 0;
        for (let inscripcion of this.inscripciones) {
            if (inscripcion.carrera === carrera) {
                contadorInscriptos++;
            }
        }
        return contadorInscriptos;
    }

    //Inscripción
    
    inscribirCorredorPorCedula(cedulaCorredor, nombreCarrera) {
        // Busca el corredor por su cédula y la carrera por su nombre
        let corredorInscripto = null;
        let carreraInscripcion = null;
        
        for (let corredor of this.corredores) {
            if (corredor.cedula === cedulaCorredor) {
                corredorInscripto = corredor;
            }
        }
        for (let carrera of this.carreras) {
            if (carrera.nombre === nombreCarrera) {
                carreraInscripcion = carrera;
            }
        }
        
        // Verifica si el corredor no esta inscripto en la carrera
        for (let inscripcion of this.inscripciones) {
            if (inscripcion.corredor.cedula === cedulaCorredor && inscripcion.carrera.nombre === nombreCarrera) {
                return { mensaje: "Error: el corredor ya está inscripto en esta carrera.", error: true};
            }
        }
        
        // Verifica si el corredor puede entrar a la carrera
        if (!this.validarFechaFicha(corredorInscripto, carreraInscripcion)) {
            return { mensaje: "Error: ficha médica vencida.", error: true };
        }
        
        if (!this.validarCapacidadCupo(carreraInscripcion)) {
            return { mensaje: "Error: ya inscripto", error: true };
        }
        
        let numeroInscripcion = this.contadorInscriptos(carreraInscripcion) + 1;
        this.inscripciones.push(new Inscripcion(corredorInscripto, carreraInscripcion, numeroInscripcion));
        
        return { 
            mensaje: this.mostrarDatosInscripcion(corredorInscripto, carreraInscripcion),
            corredor: corredorInscripto,
            carrera: carreraInscripcion,
            numero: numeroInscripcion,
            error: false
        }
    }
    
    mostrarDatosInscripcion(corredor, carrera) {
        // Busca numero de inscripto
        let inscripcionEncontrada = null;
        for (let numInsc of this.inscripciones) {
            if (numInsc.corredor === corredor && numInsc.carrera === carrera) {
                inscripcionEncontrada = numInsc;
            break;
            }
        }
        
        // Concatena mensaje con numero de inscripcion
        let mensaje = "Numero de corredor asignado: " + inscripcionEncontrada.numero + 
        corredor.toString() + 
        carrera.toString() + "\n";
        
        
        // Busca patrocinadores de la carrera y los suma al mensaje
        const patrocinadores = this.buscarPatrocinadoresPorCarrera(carrera);
        let textoPatrocinadores = "";
        for (let p of patrocinadores) { textoPatrocinadores += p.nombre + ", "; }
        if (textoPatrocinadores.length > 0) { textoPatrocinadores = textoPatrocinadores.slice(0, -2); } // quitar coma final
            
        let cantidad = "Patrocinador: ";
        if (textoPatrocinadores.length > 1) { cantidad = "Patrocinadores: "; }
        else if (textoPatrocinadores === "") { cantidad = ""; }

        mensaje += cantidad + textoPatrocinadores;
        return mensaje;
    }
    
    // Métodos estadísticas

    promedioInscripcionesPorCarrera() {
        // Calcula el promedio de inscripciones por carrera
        let totalInscriptos = 0;
        for (let carrera of this.carreras) {
            totalInscriptos += this.contadorInscriptos(carrera);
        }
        if (this.carreras.length === 0) return 0; //Evitar dividir por 0
        return totalInscriptos / this.carreras.length;
    }

    compararCarrerasPorInscripciones() {
        let masCant = -1;
        let carrerasMasInscriptos = [];
        let carrerasSinInscritos = [];
        for (let carrera of this.carreras) {
            let cantidad = this.contadorInscriptos(carrera);
            if (cantidad === 0) {
                carrerasSinInscritos.push(carrera);
            }
            if (cantidad > masCant) {
                masCant = cantidad;
                carrerasMasInscriptos = [carrera];
            } else if (cantidad === masCant) {
                carrerasMasInscriptos.push(carrera);
            }
        }

        this.ordenarPorFecha(carrerasMasInscriptos);
        this.ordenarPorFecha(carrerasSinInscritos);
        return {
            mas: carrerasMasInscriptos,
            sin: carrerasSinInscritos
        }
    }

    porcentajeElite() {
        // Calcula promedio de Élites inscriptos
        let totalInscriptos = this.inscripciones.length;
        if (totalInscriptos === 0) return 0;
        let totalElite = 0;
        for (let inscripcion of this.inscripciones) {
            if (inscripcion.corredor.tipo === "Élite") {
                totalElite++;
            }
        }
        return (totalElite / totalInscriptos) * 100;
    }

    // Mapa
    
    contarCarrerasPorDepartamento() {
        // Busca carreras en el mismo dpto y cuenta el total
        let conteo = {};
        for (let carrera of sistema.carreras) { 
            let departamento = carrera.departamento;
            if (departamento) {
                if (!conteo[departamento]) { // Si no existe conteo para UY-MO, le doy valor cero
                    conteo[departamento] = 0;
                }
                conteo[departamento]++; // Le sumo 1
            }
        }
        return conteo; 
    }
    
    contarInscripcionesPorDepartamento() {
        // Busca en inscripciones la carreras de cada dpto
        let conteo = {};
        for (let inscripcion of sistema.inscripciones) {
            let departamento = inscripcion.carrera.departamento;
            if (departamento) {
                if (!conteo[departamento]) {
                    conteo[departamento] = 0;
                }
                    conteo[departamento]++;
            }
        }
        return conteo;
    }
}

