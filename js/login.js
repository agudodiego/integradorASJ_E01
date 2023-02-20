// VARIABLES
const $formLogin = document.getElementById('formLogin');
const $formRegistro = document.getElementById('formRegistro');
const $registro = document.querySelector('.txtRegistro');
const $contenedorRegistro = document.getElementById('contenedor-registro');
const $contenedorLogin = document.getElementById('contenedor-login');
const $logoLogin = document.getElementById('logo_login');
const $cancelar = document.querySelector('.txtCancelar');


window.addEventListener('DOMContentLoaded', () => {

    // const URL2 = "../plataformas.json"
    const URL = "http://localhost:8080/Series_app_backend-1.0-SNAPSHOT/api/plataformas"
    recuperarPlataformas(URL);

    document.addEventListener('click', (e) => {

        if (e.target.matches('.txtRegistro')) {
            $logoLogin.classList.add('hidden')
            $contenedorLogin.classList.add('hidden')
            $contenedorRegistro.classList.remove('hidden')
        }

        if (e.target.matches('.txtCancelar')) {
            window.location.href = 'index.html';
        }

    });

    $formLogin.addEventListener('submit', (e) => {
        e.preventDefault();

        const usuarioIngresado = {
            usuario: e.target[0].value,
            contrasenia: e.target[1].value
        }

        const endpoint = `http://localhost:8080/Series_app_backend-1.0-SNAPSHOT/api/usuario/login`;
        
        loginUsuario(endpoint, usuarioIngresado, e);
    })
    
    $formRegistro.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const usuario = {
            usuario: e.target[0].value,
            contrasenia: e.target[1].value,
            email: e.target[2].value
        }

        const endpoint = `http://localhost:8080/Series_app_backend-1.0-SNAPSHOT/api/usuario`;

        registroUsuario(endpoint, usuario, e);        
    })
})

//***************************** 
//         FUNCIONES
//*****************************

const recuperarPlataformas = async (url)=> {
    try {
        const response = await fetch(url);
        const data = await response.json();
        localStorage.setItem('plataformas', JSON.stringify(data));
    } catch (error) {
        console.error(error);
    }
}

const loginUsuario = async (url, usuarioIngresado, e)=> {
    try {
        const response = await fetch(url, {
            method: 'POST',
            cache: 'no-cache',
            headers: { 'content-type': 'application/json'},
            body: JSON.stringify(usuarioIngresado)
        });

        if (response.ok) {
            const usuario = await response.json();
            localStorage.setItem('usuario', JSON.stringify(usuario));
            window.location.href = '../screens/home.html';
        } else {
            Swal.fire('Credenciales incorrectas');
            e.target[0].value = '';
            e.target[1].value = '';
        }

    } catch (error) {
        console.error(error);
    }
}

const registroUsuario = async (url, registroUsuario, e)=> {
    try {
        const response = await fetch(url, {
            method: 'POST',
            cache: 'no-cache',
            headers: { 'content-type': 'application/json'},
            body: JSON.stringify(registroUsuario)
        });

        if (response.ok) {
            window.location.href = 'index.html';
        } else {
            Swal.fire('El usuario ya existe');
            e.target[0].value = '';
            e.target[1].value = '';
            e.target[2].value = '';
        }

    } catch (error) {
        console.error(error);
    }
}