// VARIABLES
const $formLogin = document.getElementById('formLogin');
const $formRegistro = document.getElementById('formRegistro');
const $registro = document.querySelector('.txtRegistro');
const $contenedorRegistro = document.getElementById('contenedor-registro');
const $contenedorLogin = document.getElementById('contenedor-login');
const $logoLogin = document.getElementById('logo_login');
const $cancelar = document.querySelector('.txtCancelar');

// TODO: Credenciales hardcodeadas, cambiar cuando tenga interaccion con BD

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
        // Recupero el objeto del localstorage
        const credenciales = JSON.parse(localStorage.getItem('credenciales'));

        //  Si hay un objeto comparo el user y pass con las ingresadas por el usuario
        if (credenciales != null) {

            const { user, pass } = JSON.parse(localStorage.getItem('credenciales'));

            const usuarioIngresado = e.target[0].value;
            const passIngresada = e.target[1].value;

            if ((usuarioIngresado === user) && (passIngresada === pass)) {
                window.location.href = '/screens/home.html';
            } else {
                Swal.fire('Credenciales incorrectas')
            }
        }

        //  En caso de que este vacio 
        Swal.fire('Credenciales incorrectas');
        e.target[0].value = '';
        e.target[1].value = '';
    })

    $formRegistro.addEventListener('submit', (e) => {
        e.preventDefault();
        const usuarioIngresado = e.target[0].value;
        const passIngresada = e.target[1].value;
        const emailIngresado = e.target[2].value;

        const credenciales = { user: usuarioIngresado, pass: passIngresada, email: emailIngresado };
        localStorage.setItem('credenciales', JSON.stringify(credenciales));
        window.location.href = 'index.html';
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