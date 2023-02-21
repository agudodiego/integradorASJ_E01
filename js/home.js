import { Serie } from "../model/serie.class.js";

const $nombreUsuario = document.getElementById('nombre-usuario');
const $divSeriesBuscadas = document.getElementById('cont-card-busqueda');
const $inputBuscador = document.getElementById('inputBuscador');
const $seriesSeleccionadas = document.getElementById('seriesSeleccionadas');

// carrousel
const $btnNext = document.getElementById('btnNext');
const $btnPrev = document.getElementById('btnPrev');

// card detalles
const $detalleSerie = document.getElementById('detalleSerie');
const $close = document.getElementById('close');
const $titulo = document.getElementById('titulo');
const $anio = document.getElementById('anio');
const $genero = document.getElementById('genero');
const $descripcion = document.getElementById('descripcion');
const $detSerie = document.getElementById('detSerie');
const $sumarT = document.getElementById('sumarT');
const $restarT = document.getElementById('restarT');
const $sumarE = document.getElementById('sumarE');
const $restarE = document.getElementById('restarE');
const $TA = document.getElementById('TA');
const $TT = document.getElementById('TT');
const $EA = document.getElementById('EA');
const $ET = document.getElementById('ET');
const $sitioOficial = document.getElementById('sitioOficial');
const $btnEliminar = document.getElementById('btnEliminar');
const $btnGuardar = document.getElementById('btnGuardar');
const $selPlataforma = document.getElementById('selPlataforma');

let plataformas = [];
let arraySeriesBuscadas = [];

window.addEventListener('DOMContentLoaded', () => {

  // ************* ACCIONES INICIALES ALCARGAR LA PAGINA *****

        //*************   carrousel   ****************************** */
        let containerDimensiones = $seriesSeleccionadas.getBoundingClientRect();
        let containerWidth = containerDimensiones.width;

        $btnNext.addEventListener('click', () => {
          $seriesSeleccionadas.scrollLeft += containerWidth;
        })

        $btnPrev.addEventListener('click', () => {
          $seriesSeleccionadas.scrollLeft -= containerWidth;
        })
        //********************************************************** */

        const usuario = JSON.parse(localStorage.getItem('usuario'));
        $nombreUsuario.textContent += usuario.usuario;

        plataformas = JSON.parse(localStorage.getItem('plataformas'));

        // misSeries = usuario.series;
        pintarSeriesSeleccionadas($seriesSeleccionadas, usuario.series);


  // ************* INTERACCION CON LA PAGINA ******************

  document.addEventListener('click', (e) => {

    // Accion boton LOGOUT
    if (e.target.matches('#btnLogout')) {
      localStorage.setItem('usuario', JSON.stringify({ user: '', pass: '' }));
      window.location.href = '../index.html';
    }

    // Accion boton BUSCAR
    if (e.target.matches('#lupa')) {
      const terminoBusqueda = $inputBuscador.value;
      $inputBuscador.value = '';

      if (terminoBusqueda != '') {
        let url = `https://api.tvmaze.com/search/shows?q=${terminoBusqueda}`;
        pintarSeriesBuscadas($divSeriesBuscadas, url);
      }
    }

    // Accion boton AGREGAR A MIS SERIES
    if (e.target.matches('#btnAdd')) {
      // obtengo el id de la serie sobre la cual se clickeo
      let idSerie = e.target.getAttribute('data-id');

      // obtengo la serie del array de resutados de la API
      let resultado = arraySeriesBuscadas.find((serie) => serie.show.id == idSerie);

      // compruebo si la serie ya la tiene el usuario
      let yaEsta = false;
      usuario.series.forEach(s => {
        if (s.id_serie == idSerie) {
          yaEsta = true;
        }
      });
      if (!yaEsta) {
        agregarAMisSeries(resultado, usuario);
      } else {
        Swal.fire('Ya tienes agregada la serie!');
      }
    }

    // Accion boton MAS INFORMACION
    if (e.target.matches('#mas')) {
      $detalleSerie.classList.remove('hidden');

      // obtengo el id de la serie sobre la cual se clickeo
      let idSerie = e.target.getAttribute('data-id');

      // obtengo la serie del array de series del usuario
      let resultado = usuario.series.find((serie) => serie.id_serie == idSerie);
      
      // le seteo el id de la serie en el data-atribute del boton eliminar y guardar
      $btnEliminar.setAttribute('data-id', idSerie);
      $btnGuardar.setAttribute('data-id', idSerie);
      llenarCardDetalleSeries(resultado, $titulo, $anio, $genero, $descripcion, $detSerie, $TA, $TT, $EA, $ET,  $sitioOficial, $selPlataforma, plataformas);

    }

    //************************************ 
    //       CARD DETALLE SERIES
    //************************************ 

    // Acciones de los BOTONES SUMAR Y RESTAR
    if (e.target.matches('#sumarT')) { 
      let tempActual = parseInt($TA.textContent);
      sumar($TA, tempActual);
    }
    
    if (e.target.matches('#restarT')) { 
      let tempActual = parseInt($TA.textContent);
      restar($TA, tempActual);      
    }
    
    if (e.target.matches('#sumarE')) { 
      let episodActual = parseInt($EA.textContent);
      sumar($EA, episodActual);
    }

    if (e.target.matches('#restarE')) { 
      let episodActual = parseInt($EA.textContent);
      restar($EA, episodActual);
    }

    // Accion boton GUARDAR
    if (e.target.matches('#btnGuardar')) {
      const seleccion = $selPlataforma.value;
      const plataforma = plataformas.find((pl) => pl.plataforma == seleccion);

      // obtengo el id de la serie sobre la cual se clickeo
      let idSerie = e.target.getAttribute('data-id');

      // obtengo la serie del array de series del usuario
      let resultado = usuario.series.find((serie) => serie.id_serie == idSerie);      

      // chequeo que el usuario haya cambiado la plataforma
      if (resultado.plataforma.plataforma != seleccion) {
        
        resultado.plataforma.id_plataforma = plataforma.id_plataforma;
        resultado.plataforma.plataforma = seleccion;
        resultado.plataforma.url = plataforma.url;

      }
      
      resultado.temp_actual = parseInt($TA.textContent);   
      resultado.episod_actual = parseInt($EA.textContent);   
      
      actualizarSerie(resultado, usuario);
    }

    // Accion boton ELIMINAR
    if (e.target.matches('#btnEliminar')) {
      // obtengo el id de la serie sobre la cual se clickeo
      let idSerie = e.target.getAttribute('data-id');

      quitarSerie(idSerie, usuario);
    }

    // Accion boton CERRAR POP-UP DETALLES
    if (e.target.matches('#close')) {
      $detalleSerie.classList.add('hidden');
      $descripcion.classList.remove('estilosDescripcion');
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
            ${serie.plataforma.id_plataforma != 1 ? `<a href="${serie.plataforma.url}" target="_blank" id="btnPlataforma">${serie.plataforma.plataforma}</a>` : `<a id="btnPlataforma">${serie.plataforma.plataforma}</a>`}            
            ${serie.img_small ? `<img src="${serie.img_small}" alt="">` : `<img src="https://via.placeholder.com/210x297/CCC/FF0000/?text=${serie.titulo}" alt="">`}
            <div id="pieImagen">
                <p id="txtPie">T${serie.temp_actual}-E${serie.episod_actual}</p>
                <div id="mas" data-id=${serie.id_serie}>+</div>
            </div>
        </div>
        `;
  })
}

const agregarAMisSeries = async (resultado, usuario) => {

  try {
    // hago una nueva consulta con las particularidades de la serie (devuelve un array con cada temporada)
    const serieElegida = await fetchSeriesDeAPI(`https://api.tvmaze.com/shows/${resultado.show.id}/seasons`);
    
    // cuento los elementos del array
    const temporadasTotales = serieElegida.length;

    // itero dentro de cada temporada contando los episodios
    const episodiosTotales = serieElegida.reduce((total, episodios) => {
      return total + episodios.episodeOrder;
    }, 0);

    const plat = {
      id_plataforma: 1,
      plataforma: 'Sin Plataforma',
      url: null
    }

    let descripcion;
    if (resultado.show.summary) {
      descripcion = cortarDescripcion(resultado.show.summary);
    } else {
      descripcion = null;
    }

    // construyo el objeto "serie"
    const serie = new Serie(resultado.show.id,
      resultado.show.name,
      temporadasTotales,
      episodiosTotales,
      resultado.show.image?.medium,
      resultado.show.image?.original,
      resultado.show?.premiered.substring(0,4),
      resultado.show?.officialSite,
      descripcion,
      resultado.show.genres,
      plat,
      true
    );    

    await agregarSerieBD(serie, usuario);

  } catch (error) {
    console.log(error)
  }

}

const llenarCardDetalleSeries = (serie, $titulo, $anio, $genero, $descripcion, $detSerie, $TA, $TT, $EA, $ET, $sitioOficial, $selPlataforma, plataformas) => {
  
  $detSerie.style.backgroundImage = `url('${serie.img_big}')`;

  $titulo.textContent = serie.titulo;

  $anio.textContent = serie.anio_lanzamiento.substring(0, 4);

  $genero.textContent = '';
  if (serie.genero != null) {
    serie.genero.forEach((g) => {
      $genero.textContent += `${g} `;
    })
  }

  $TA.textContent = serie.temp_actual;
  $TT.textContent = serie.temporadas;
  $EA.textContent = serie.episod_actual;
  $ET.textContent = serie.episodios;
  
  $descripcion.innerHTML = '';
  if (serie.descripcion != 'null') {

    if ( serie.descripcion.length < 255 ) {
      $descripcion.innerHTML = serie.descripcion;
      $descripcion.classList.add('estilosDescripcion');
    } else {      
      $descripcion.innerHTML = cortarDescripcion(serie.descripcion);
      $descripcion.classList.add('estilosDescripcion');
    }
  }

  $sitioOficial.setAttribute('href', serie.sitio_oficial);
  $sitioOficial.setAttribute('target', '_blamk');

  $selPlataforma.innerHTML = '';
  plataformas.forEach((pl) => {
    if (pl.plataforma == serie.plataforma.plataforma) {
      $selPlataforma.innerHTML += `<option value="${serie.plataforma.plataforma}" selected>${serie.plataforma.plataforma}</option>`;
    } else {
      $selPlataforma.innerHTML += `<option value="${pl.plataforma}">${pl.plataforma}</option>`;
    };
  });
}

const agregarSerieBD = async (serie, usuario) => {

  const URL = 'http://localhost:8080/Series_app_backend-1.0-SNAPSHOT/api/serie';

  try {
    let response = await fetch(URL, {
      method: 'POST',
      cache: 'no-cache',
      headers: {'content-type': 'application/json'},
      body: JSON.stringify(serie)
    });
    
    const respuesta = await response.json();
    console.log(respuesta.msg)
    relacionarUsuarioSerie(serie, usuario);

  } catch (error) {
    console.dir(error);
  }
}

const relacionarUsuarioSerie = async (serie, usuario)=> {
  const URL = `http://localhost:8080/Series_app_backend-1.0-SNAPSHOT/api/usuario/serie/${usuario.id_usuario}`;

  try {
    let response = await fetch(URL, {
      method: 'POST',
      cache: 'no-cache',
      headers: {'content-type': 'application/json'},
      body: JSON.stringify(serie)
    });
    
    const respuesta = await response.json();
    console.log(respuesta.msg);

    traerDatosActualizados(usuario.usuario, $seriesSeleccionadas);

  } catch (error) {
    console.dir(error);
  }
}

const cortarDescripcion = (descripcion)=> {
  let stringAux = descripcion.substring(0,255);
  let indiceUltimoPunto = stringAux.lastIndexOf('.');
  let stringCortado = `${descripcion.substring(0, indiceUltimoPunto)}.</p>`;
  return stringCortado
}

const quitarSerie = async (idSerie, usuario)=> {

  // obtengo la serie del array de series del usuario
  let resultado = usuario.series.find((serie) => serie.id_serie == idSerie);
  resultado.activa = false;

  const URL = `http://localhost:8080/Series_app_backend-1.0-SNAPSHOT/api/usuario/serie/${usuario.id_usuario}`;

  try {
    let response = await fetch(URL, {
      method: 'PUT',
      cache: 'no-cache',
      headers: {'content-type': 'application/json'},
      body: JSON.stringify(resultado)
    });
    
    const respuesta = await response.json();
    console.log(respuesta.msg);

    // obtengo el indice del elemento recuperado en el array de series guardadas
    let index = usuario.series.indexOf(resultado);
    
    // quito del array la serie a eliminar segun el indice obtenido
    usuario.series.splice(index, 1);
    localStorage.setItem('usuario', JSON.stringify(usuario));

    pintarSeriesSeleccionadas($seriesSeleccionadas, usuario.series);

    $detalleSerie.classList.add('hidden');
    $descripcion.classList.remove('estilosDescripcion');
  } catch (error) {
    console.dir(error);
  }

}

const actualizarSerie = async (resultado, usuario)=> {

  const URL = `http://localhost:8080/Series_app_backend-1.0-SNAPSHOT/api/usuario/serie/${usuario.id_usuario}`;

  try {
    let response = await fetch(URL, {
      method: 'PUT',
      cache: 'no-cache',
      headers: {'content-type': 'application/json'},
      body: JSON.stringify(resultado)
    });
    
    const respuesta = await response.json();
    console.log(respuesta.msg);

    // obtengo el indice del elemento recuperado en el array de series guardadas
    let index = usuario.series.indexOf(resultado);
    
    // actualizo en el array la serie
    usuario.series.splice(index, 1, resultado);
    localStorage.setItem('usuario', JSON.stringify(usuario));

    pintarSeriesSeleccionadas($seriesSeleccionadas, usuario.series);

    $detalleSerie.classList.add('hidden');
    $descripcion.classList.remove('estilosDescripcion');
  } catch (error) {
    console.dir(error);
  }

}

const traerDatosActualizados = async (nombre,$seriesSeleccionadas)=> {

  const url = `http://localhost:8080/Series_app_backend-1.0-SNAPSHOT/api/usuario/${nombre}`;

  try {
      const response = await fetch(url);
      const usuario = await response.json();
      localStorage.setItem('usuario', JSON.stringify(usuario));
      
      pintarSeriesSeleccionadas($seriesSeleccionadas, usuario.series);
      window.location.reload();

  } catch (error) {
      console.error(error);
  }
}

const sumar = (elementoHTML, variable)=> {
    variable++;
    elementoHTML.textContent = variable;
}

const restar = (elementoHTML, variable)=> {
  variable--;
  elementoHTML.textContent = variable;
}