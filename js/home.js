const $nombreUsuario = document.getElementById('nombre-usuario');
const $divSeriesBuscadas = document.getElementById('cont-card-busqueda');
const $inputBuscador = document.getElementById('inputBuscador');

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
            alert('agregar serie')
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
        const arraySeriesBuscadas = await fetchSeriesDeAPI(url);
        arraySeriesBuscadas.forEach(serie => {
            // console.log(serie.show.name)
            elementoHTML.innerHTML += `
            <div id="card-busqueda">
                ${serie.show.image ? `<img src="${serie.show.image.medium}" alt="">` : `<img src="https://via.placeholder.com/57x80/CCC/FF0000/?text=X" alt="">` }
                <div id="card-busqueda-textos">
                <h3>${serie.show.name}</h3>
                <h5>${serie.show.premiered}</h5>
                </div>
                <div id="add">+</div>
                </div>
            `;
        });        
    } catch (error) {
        console.log(error)        
    }
}