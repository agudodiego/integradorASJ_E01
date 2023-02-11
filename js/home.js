import { Serie } from "../model/serie.class.js";

const $nombreUsuario = document.getElementById('nombre-usuario');
const $divSeriesBuscadas = document.getElementById('cont-card-busqueda');
const $inputBuscador = document.getElementById('inputBuscador');
const $seriesSeleccionadas = document.getElementById('seriesSeleccionadas');

let misSeries = [];
let arraySeriesBuscadas = [];

window.addEventListener('DOMContentLoaded', () => {
  const credenciales = JSON.parse(localStorage.getItem('credenciales'));
  $nombreUsuario.textContent += credenciales.user;

  document.addEventListener('click', (e) => {
    // console.log(e.target)

    if (e.target.matches('#btnLogout')) {
      localStorage.setItem('credenciales', JSON.stringify({ user: '', pass: '' }));
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

    if (e.target.matches('#btnAdd')) {
      // obtengo el id de la serie sobre la cual se clickeo
      let idSerie = e.target.getAttribute('data-id');

      // obtengo la serie del array de resutados de la API
      let resultado = arraySeriesBuscadas.find((serie) => serie.show.id == idSerie);

      agregarAMisSeries(resultado);
    }
  });
});




//***************************** 
//         FUNCIONES
//***************************** 

const fetchSeriesDeAPI = async (url) => {

  try {

    const response = await fetch(url);
    const data = await response.json();
    return data;

  } catch (error) {
    console.log(error)
  }
}

const pintarSeriesBuscadas = async (elementoHTML, url) => {
  elementoHTML.innerHTML = '';
  try {
    arraySeriesBuscadas = await fetchSeriesDeAPI(url);
    arraySeriesBuscadas.forEach(serie => {
      // console.log(serie.show.name)
      elementoHTML.innerHTML += `
            <div id="card-busqueda" >
                ${serie.show.image ? `<img src="${serie.show.image.medium}" alt="">` : `<img src="https://via.placeholder.com/57x80/CCC/FF0000/?text=X" alt="">`}
                <div id="card-busqueda-textos">
                <h3>${serie.show.name}</h3>
                ${serie.show.premiered ? `<h5>${serie.show.premiered.substring(0, 4)}</h5>` : `<h5> sin datos </h5>`}
                </div>
                <div id="add"><img id="btnAdd" data-id=${serie.show.id} src="../assets/add.svg" alt="add"></div>
            </div>
            `;
    });
  } catch (error) {
    console.log(error)
  }
}

const pintarSeriesSeleccionadas = (elementoHTML, array) => {

  elementoHTML.innerHTML = '';
  array.forEach((serie) => {
    elementoHTML.innerHTML += `
        <div id="cards_seleccionadas">
            <div id="btnPlataforma">ir a Plataforma</div>
            ${serie.img_small ? `<img src="${serie.img_small}" alt="">` : `<img src="https://via.placeholder.com/210x297/CCC/FF0000/?text=${serie.titulo}" alt="">`}
            <div id="pieImagen">
                <p id="txtPie">T0-E0</p>
                <div id="mas" data-id=${serie.id}>+</div>
            </div>
        </div>
        `;
  })
}

const agregarAMisSeries = async (resultado) => {

  try {
    // hago una nueva consulta con las particularidades de la serie (devuelve un array con cada temporada)
    const serieElegida = await fetchSeriesDeAPI(`https://api.tvmaze.com/shows/${resultado.show.id}/seasons`);

    // cuento los elementos del array
    const temporadasTotales = serieElegida.length;

    // itero dentro de cada temporada contando los episodios
    const episodiosTotales = serieElegida.reduce((total, episodios) => {
      return total + episodios.episodeOrder;
    }, 0);

    // construyo el objeto "serie"
    const serie = new Serie(resultado.show.id,
      resultado.show.name,
      temporadasTotales,
      episodiosTotales,
      resultado.show.image?.medium,
      resultado.show.image?.original,
      resultado.show?.premiered,
      resultado.show?.officialSite,
      resultado.show?.summary,
      null,
      resultado.show.genres
    );

    misSeries.push(serie);
    console.log(serie);

    pintarSeriesSeleccionadas($seriesSeleccionadas, misSeries);

  } catch (error) {
    console.log(error)
  }

}