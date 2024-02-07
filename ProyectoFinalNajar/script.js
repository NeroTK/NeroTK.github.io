// Definición de usuarios registrados en formato JSON
const jsonRegistrados = `[{
    "nombre": "juan",
    "apellidos": "garcía",
    "edad": 23,
    "sexo": "Masculino",
    "email": "juan.garcia@gmail.com",
    "contraseña": "abcde"},  
{
    "nombre": "lucia",
    "apellidos": "martinez",
    "edad": 25,
    "sexo": "Femenino",
    "email": "lucia.martinez@gmail.com",
    "contraseña":"1234"
}]`

// Parseo de la cadena JSON a un array de objetos de usuarios
const registrados = JSON.parse(jsonRegistrados);

// Definición de la clase Registrado para representar a un usuario
class Registrado {
    constructor(nombre, apellidos, edad, sexo, email, contraseña){
        this.nombre = nombre;
        this.apellidos = apellidos;
        this.edad = edad;
        this.sexo = sexo;
        this.email = email;
        this.contraseña = contraseña;
    }
}

// Creación de una colección de objetos 'Registrado' a partir del array de usuarios registrados
const coleccion_registrados = registrados.map(usuario => new Registrado(
    usuario.nombre,
    usuario.apellidos,
    usuario.edad,
    usuario.sexo,
    usuario.email,
    usuario.contraseña
));

// Función para filtrar usuarios de la colección según los valores del formulario
const filter_user_from_collection = () => {
    const nombre = document.getElementById('nombre').value.trim().toLowerCase();
    const apellidos = document.getElementById('apellidos').value.trim().toLowerCase();
    const edad = document.getElementById('edad').value.trim().toLowerCase();
    const genero = document.getElementById('genero').value.trim().toLowerCase();
    const email = document.getElementById('email').value.trim().toLowerCase();
    const contraseña = document.getElementById('contraseña').value.trim();

    const formularioFiltro = {
        nombre,
        apellidos,
        edad,
        sexo: genero === 'seleccionar' ? '' : genero,
        email,
        contraseña
    };

    const usuariosFiltrados = coleccion_registrados.filter(usuario => {
        const nombreValido = !formularioFiltro.nombre || usuario.nombre.toLowerCase().includes(formularioFiltro.nombre);
        const apellidosValidos = !formularioFiltro.apellidos || usuario.apellidos.toLowerCase().includes(formularioFiltro.apellidos);
        const edadValida = !formularioFiltro.edad || usuario.edad.toString() === formularioFiltro.edad;
        const sexoValido = formularioFiltro.sexo === '' || usuario.sexo.toLowerCase() === formularioFiltro.sexo;
        const emailValido = !formularioFiltro.email || usuario.email.toLowerCase().includes(formularioFiltro.email);
        const contraseñaValida = !formularioFiltro.contraseña || usuario.contraseña === formularioFiltro.contraseña;

        // Verificar si todos los campos coinciden
        const todosLosCamposCoinciden = nombreValido && apellidosValidos && edadValida && sexoValido && emailValido && contraseñaValida;

        return todosLosCamposCoinciden;
    });

    // Si hay coincidencias, devuelve la colección filtrada, de lo contrario, devuelve una colección vacía
    return usuariosFiltrados.length > 0 ? usuariosFiltrados : [];
}

//Inicializar imagen
function initialize_img () {
    const submitContainer = document.querySelector('.submit-container');

    if (submitContainer) {
        const spanElement = document.createElement('span');
        const imgElement = document.createElement('img');

        imgElement.alt = 'check-icon';
        imgElement.id = 'img';

        imgElement.style.width = '20px';
        imgElement.style.height = '20px';
        imgElement.style.display = 'none';

        spanElement.appendChild(imgElement);
        submitContainer.appendChild(spanElement); // Agregar el span al contenedor del botón
    } else {
        console.error('No se pudo encontrar el contenedor del botón.');
    }
};
document.addEventListener('DOMContentLoaded', initialize_img);

//Comprobar campos rellenos
function comprobarCamposRellenos() {
    const campos = ['contraseña', 'email', 'genero', 'edad', 'apellidos', 'nombre'];

    let todosRellenos = true;

    campos.forEach(campo => {
        const valorCampo = document.getElementById(campo).value.trim();

        if (valorCampo === '') {
            const mensajeError = `El campo ${campo.charAt(0).toUpperCase() + campo.slice(1)} no puede estar vacío`;
            document.getElementById('errorcase').textContent = mensajeError;

            document.getElementById(campo).focus();

            todosRellenos = false;
        }
    });
    return todosRellenos;
}

// Función para borrar los campos del formulario 
function borrarCampos() {
    const campos = ['nombre', 'apellidos', 'edad', 'genero', 'email', 'contraseña'];

    campos.forEach(campo => {
        document.getElementById(campo).value = '';
    });

    document.getElementById('errorcase').textContent = '';
}

//Mostrar imagen
function mostrarImagen (rutaImagen) {
    const imgElement = document.getElementById('img');
    if (imgElement) {
        imgElement.src = rutaImagen;
        imgElement.style.display = 'inline'; // Mostrar la imagen
    } else {
        console.error('El elemento de imagen no se ha inicializado correctamente.');
    }
};

function ocultarImagen() {
    const imgElement = document.getElementById('img');
    if (imgElement) {
        imgElement.style.display = 'none'; // Ocultar la imagen
    } else {
        console.error('No se pudo encontrar la imagen para ocultar.');
    }
};

//Función principal de validación
function validar() {
    if (comprobarCamposRellenos()) {
        const usuariosFiltrados = filter_user_from_collection();
        
        if (usuariosFiltrados.length === 0) {
            mostrarImagen('./imgs/error.png');
            document.getElementById('errorcase').textContent = 'Usuario no registrado';

            setTimeout(() => {
                ocultarImagen(); // Ocultar la imagen de error después del tiempo especificado
                borrarCampos();
            }, 2000);
        } else {
            mostrarImagen('./imgs/success.png');

            const mensajeExito = document.createElement('p');
            mensajeExito.textContent = 'Usuario registrado correctamente';
            document.querySelector('.form-register').appendChild(mensajeExito);

            setTimeout(() => {
                ocultarImagen(); // Ocultar la imagen de éxito después del tiempo especificado
                window.location.href = 'src/dashboard.html';
            }, 3000);
        }
    }
}

const botonInicio = document.querySelector('.botons');

// Cambio de color del botón al pasar el ratón por encima
botonInicio.addEventListener('mouseover', function() {
    this.style.backgroundColor = '#056d28';
});

// Evento al quitar el ratón: Cambiar el color al original '#083eb2'
botonInicio.addEventListener('mouseout', function() {
    this.style.backgroundColor = '#083eb2';
});


// Validación al pulsar Enter y flechas arriba y abajo para cambiar de campo
document.querySelector('.form-register').addEventListener('keydown', function (event) {
    if (event.key === 'Enter') {
        validar();
    }
});

document.addEventListener('keydown', function(event) {
    const camposFormulario = Array.from(document.querySelectorAll('.controls'));
    const indexActual = camposFormulario.indexOf(document.activeElement);

    if (indexActual !== -1) {
        if (event.key === 'ArrowUp') {
            event.preventDefault();
            if (indexActual === 0) {
                camposFormulario[camposFormulario.length - 1].focus();
            } else {
                camposFormulario[indexActual - 1].focus();
            }
        } else if (event.key === 'ArrowDown') {
            event.preventDefault();
            if (indexActual === camposFormulario.length - 1) {
                camposFormulario[0].focus();
            } else {
                camposFormulario[indexActual + 1].focus();
            }
        }
    }
});


// Cambio de color del borde de los campos del nombre y placeholder
document.getElementById("nombre").addEventListener("focus", function() {
    this.style.borderColor = "#083eb2";
    this.placeholder = "";
});

document.getElementById("nombre").addEventListener("blur", function() {
    this.style.borderColor = "#1f53c5";
    this.placeholder = "Ingrese su Nombre"; 
});

// Cambio de color del borde de los campos de los apellidos y placeholder
document.getElementById("apellidos").addEventListener("focus", function() {
    this.style.borderColor = "#083eb2";
    this.placeholder = "";
});

document.getElementById("apellidos").addEventListener("blur", function() {
    this.style.borderColor = "#1f53c5";
    this.placeholder = "Ingrese sus Apellidos";
});

// Cambio de color del borde de los campos de la edad y placeholder
document.getElementById("edad").addEventListener("focus", function() {
    this.style.borderColor = "#083eb2";
    this.placeholder = "";
});

document.getElementById("edad").addEventListener("blur", function() {
    this.style.borderColor = "#1f53c5";
    this.placeholder = "Ingrese su Edad";
});

// Cambio de color del borde de los campos del sexo y placeholder
document.getElementById("genero").addEventListener("focus", function() {
    this.style.borderColor = "#083eb2";
});

document.getElementById("genero").addEventListener("blur", function() {
    this.style.borderColor = "#1f53c5";
});

// Cambio de color del borde de los campos del email y placeholder
document.getElementById("email").addEventListener("focus", function() {
    this.style.borderColor = "#083eb2"; // Cambia el color del borde al enfocar
    this.placeholder = ""; // Borra el placeholder al enfocar
});

document.getElementById("email").addEventListener("blur", function() {
    this.style.borderColor = "#1f53c5";
    this.placeholder = "Ingrese su Email";
});

// Cambio de color del borde de los campos de la contraseña y placeholder
document.getElementById("contraseña").addEventListener("focus", function() {
    this.style.borderColor = "#083eb2";
    this.placeholder = "";
});

document.getElementById("contraseña").addEventListener("blur", function() {
    this.style.borderColor = "#1f53c5";
    this.placeholder = "Ingrese su Contraseña";
});