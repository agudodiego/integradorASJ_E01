// VARIABLES
const $form = document.querySelector('form');

// TODO: Credenciales hardcodeadas, cambiar cuando tenga interaccion con BD
const USER = 'diego';
const PASS = '1234!';

window.addEventListener('DOMContentLoaded', ()=> {

    $form.addEventListener('submit', (e)=> {
        e.preventDefault();
        const usuarioIngresado = e.target[0].value;
        const passIngresada = e.target[1].value;

        if ( ( usuarioIngresado === USER) && ( passIngresada === PASS) ) {
            //console.log('ok')
            localStorage.setItem('usuario', usuarioIngresado);
            console.log(usuarioIngresado)
            window.location.href = '/screens/home.html';
        } else {
            Swal.fire('Credenciales incorrectas')
            //console.log('NO ok') background: 'red',
        }
    })
})