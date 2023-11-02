import React, { useState, useEffect } from 'react';
import { useCookies } from 'react-cookie';
import '../estilos/General.css'
import '../estilos/Favoritos.css'

function FavoritosData({ username }) {
  const [data, setData] = useState(null);
  const [lineasData, setLineasData] = useState([]);
  const [cookies] = useCookies(['username']);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`http://localhost:8000/emt/favoritos/${cookies.username}/`);
        const responseData = await response.json();
        setData(responseData.favoritos);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, [cookies.username]);

  useEffect(() => {
    const fetchLineas = async () => {
      if (data) {
        const lineasPromises = data.map(async (favorito) => {
          try {
            const response = await fetch(`http://localhost:8000/emt/tiempo_espera/${favorito.parada}/`);
            const responseData = await response.json();
            const estimates = Object.entries(responseData.estimateArrive).sort((a, b) => a[1] - b[1]);
            const lineas = estimates.map(([line, estimate]) => ({
              line,
              estimate
            }));
            return {
              parada: favorito.parada,
              lineas
            };
          } catch (error) {
            console.error(error);
            return {
              parada: favorito.parada,
              lineas: []
            };
          }
        });

        const lineasResponses = await Promise.all(lineasPromises);
        setLineasData(lineasResponses);
      }
    };

    fetchLineas();
  }, [data]);

  if (!data) {
    return <div id='contentCargando'>
      <div className="custom-loader"></div>
    </div>;
  }

  return (
    <div id='contentFavoritos'>
  <div className='container'>
    <h1>Favoritos</h1>
    {data.length === 0 ? (
      <p>No tienes favoritos guardados.</p>
    ) : (
      <div className="favoritos-container" style={{ overflow: 'auto' }}>
        {data.map((favorito, index) => (
          <div key={favorito.parada} className="favorito-item">
            Número de parada:
            <a href={`http://localhost:3000/parada/${favorito.parada}`} className="parada-link">{favorito.parada}</a>
            {lineasData[index]?.lineas?.length > 0 ? (
              <div className="lineas-container">
                Líneas:
                {lineasData[index].lineas.map((linea, i) => (
                  <span key={linea.line} className="linea-item">
                    {i > 0 && ''}
                    {linea.line}
                  </span>
                ))}
              </div>
            ) : (
              <div className="lineas-container no-lineas">
                No hay líneas disponibles
              </div>
            )}
          </div>
        ))}
      </div>
    )}
  </div>
</div>

  );
}

export default FavoritosData;
