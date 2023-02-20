export class Serie {
    
    constructor(id_serie, titulo, temporadas, episodios, img_small, img_big, anio_lanzamiento, sitio_oficial, descripcion, genero, plataforma, temp_actual = 0, episod_actual = 0){
        this.id_serie = id_serie,
        this.titulo = titulo,
        this.temporadas = temporadas,
        this.episodios = episodios,
        this.img_small = img_small,
        this.img_big = img_big,
        this.anio_lanzamiento = anio_lanzamiento,
        this.sitio_oficial = sitio_oficial,
        this.descripcion = descripcion,
        this.temp_actual = temp_actual,
        this.episod_actual = episod_actual,
        this.genero = genero,
        this.plataforma = plataforma
    }
}