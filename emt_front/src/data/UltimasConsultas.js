import React, { useState, useEffect } from 'react';
import { useCookies } from 'react-cookie';
import '../estilos/General.css'
import '../estilos/Consultas.css'

function UltimasConsultas({ username }) {

  const [data, setData] = useState(null);
  const [lineasData, setLineasData] = useState([]);
  const [cookies] = useCookies(['username']);


  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`http://localhost:8000/emt/consultas/${cookies.username}/`);
        const responseData = await response.json();
        setData(responseData.consultas);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, [cookies.username]);

  useEffect(() => {
    const fetchLineas = async () => {
      if (data) {
        const lineasPromises = data.map(async (consultas) => {
          try {
            const response = await fetch(`http://localhost:8000/emt/tiempo_espera/${consultas.parada}/`);
            const responseData = await response.json();
            const estimates = Object.entries(responseData.estimateArrive).sort((a, b) => a[1] - b[1]);
            const lineas = estimates.map(([line, estimate]) => ({
              line,
              estimate
            }));
            return {
              parada: consultas.parada,
              lineas
            };
          } catch (error) {
            console.error(error);
            return {
              parada: consultas.parada,
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
    <div id='contentConsultas'>
      <div className='container'>
        <h1>Últimas consultas</h1>
        {data.length === 0 ? (
          <p>No tienes consultas</p>
        ) : (
          <div className="consultas-container" style={{ overflow: 'auto', }}>
            {[...new Set(data.map((consulta) => consulta.parada))].reverse().map((parada) => (
              <div key={parada} className="consulta-item">
                Número de parada:
                <a href={`http://localhost:3000/parada/${parada}`} className="parada-link">{parada}</a>
                {lineasData.find((item) => item.parada === parada)?.lineas?.length > 0 ? (
                  <div className="lineas-container">
                    Líneas:
                    {lineasData.find((item) => item.parada === parada).lineas.map((linea, i) => (
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

export default UltimasConsultas;
