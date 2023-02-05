const $nombreUsuario = document.getElementById('nombre-usuario');
const $divSeriesBuscadas = document.getElementById('cont-card-busqueda');
const $inputBuscador = document.getElementById('inputBuscador');

let misSeries = [];
let arraySeriesBuscadas = [];

window.addEventListener('DOMContentLoaded', ()=> {
    const usuario = localStorage.getItem('usuario');
    $nombreUsuario.textContent += usuario;

    document.addEventListener('click', (e)=> {

        if (e.target.matches('#btnLogout')) {
            localStorage.setItem('usuario','');
            window.location.href = '../index.html';
        }

        if (e.target.matches('#lupa')) {
            const terminoBusqueda = $inputBuscador.value;
            $inputBuscador.value = '';

            if (terminoBusqueda != '') {
                let url = `https://api.tvmaze.com/search/shows?q=${terminoBusqueda}`;
                pintarSeriesBuscadas($divSeriesBuscadas, url);
            }
        }
        
        if (e.target.matches('#add')) {
            let idSerie = e.target.getAttribute('data-id');

            let resultado = arraySeriesBuscadas.find((serie) => serie.show.id == idSerie);
            console.log(resultado);

            // TODO Antes del push deberia hacer instanciar un objeto con los miembros necesarios para la BD
            /* Para ver cuantas temoradas y capitulos tiene la serie debo hacer una nueva consulta a:
               https://api.tvmaze.com/shows/ACA_VA_ID/seasons Consultar con profes si vale la pena
            */
            misSeries.push(resultado);

            // TODO Crear funcion para pintar la serie en el div sectorSeries
            
        }
    });
});




//***************************** 
//         FUNCIONES
//***************************** 

const fetchSeriesDeAPI = async (url)=> {
    
    try {
        const response = await fetch(url);
        const data = await response.json();
        // console.log(data)
        return data;
    } catch (error) {
        console.log(error)
    }
}

const pintarSeriesBuscadas = async (elementoHTML, url)=> {
    elementoHTML.innerHTML = '';
    try {
        arraySeriesBuscadas = await fetchSeriesDeAPI(url);
        arraySeriesBuscadas.forEach(serie => {
            // console.log(serie.show.name)
            elementoHTML.innerHTML += `
            <div id="card-busqueda" >
                ${serie.show.image ? `<img src="${serie.show.image.medium}" alt="">` : `<img src="https://via.placeholder.com/57x80/CCC/FF0000/?text=X" alt="">` }
                <div id="card-busqueda-textos">
                <h3>${serie.show.name}</h3>
                <h5>${serie.show.premiered}</h5>
                </div>
                <div id="add" data-id=${serie.show.id}>+</div>
            </div>
            `;
        });        
    } catch (error) {
        console.log(error)        
    }
}