import React, { useState, useEffect } from 'react';
import Formulario from './components/Formulario';
import ListaImagenes from './components/ListaImagenes';

function App() {

  const [busqueda, guardarBusqueda] = useState('');
  const [imagenes, guardarImagenes] = useState([]);
  const [paginaactual, guardarPaginaActual] = useState(1);
  const [totalpaginas, guardarTotalPaginas] = useState(5);


  useEffect(() => {
    const consultarAPI = async () => {
      if(busqueda === '') return;

      const imagenesPorPagina = 30;
      const key = '17727508-23a9d07770ef01e61940503a5';
      const url = `https://pixabay.com/api/?key=${key}&q=${busqueda}&per_page=${imagenesPorPagina}&page=${paginaactual}`;

      const respuesta = await fetch(url);
      const resultado = await respuesta.json();

      guardarImagenes(resultado.hits);

      // calcular el total de páginas
      const calcularTotalPaginas = Math.ceil(resultado.totalHits / imagenesPorPagina);
      guardarTotalPaginas(calcularTotalPaginas);

      // mover la pantalla hacia arriba
      const jumbotron = document.querySelector('.jumbotron');
      jumbotron.scrollIntoView({behavior: 'smooth'});
    }
    consultarAPI();
  }, [busqueda, paginaactual])

  // definir la pagina anterior
  const paginaAnterior = () => {
    const nuevaPaginaActual = paginaactual - 1;

    if(nuevaPaginaActual === 0) return;

    guardarPaginaActual(nuevaPaginaActual);
  }

  // definir la pagina siguiente
  const paginaSiguiente = () => {
    const nuevaPaginaActual = paginaactual + 1;

    if(nuevaPaginaActual > totalpaginas) return;

    guardarPaginaActual(nuevaPaginaActual);  }

  return (
    <div className="container">
      <div className="jumbotron">
        <p className="lead text-center">Buscador de Imágenes</p>
        <Formulario
          guardarBusqueda={guardarBusqueda}
        />
      </div>

      <div className="row justify-content-center">
        <ListaImagenes 
          imagenes={imagenes}
        />

        {(paginaactual === 1) ? null : 
          <button 
            type="button"
            className="btn btn-info mr-1 mb-3"
            onClick={paginaAnterior}
          >&laquo; Anterior</button>
        }

        {(paginaactual === totalpaginas || busqueda === '') ? null : 
          <button 
          type="button"
          className="btn btn-info mb-3"
          onClick={paginaSiguiente}
        >Siguiente &raquo;</button>
        }

      </div>
    </div>
  );
}

export default App;
