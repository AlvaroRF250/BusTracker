import React, { useState, useEffect } from 'react';
import { useCookies } from 'react-cookie';
import '../estilos/Inicio.css';
import logoBus from '../images/BusTracker.png';
import Header from '../components/Header';
import FavoritosData from '../data/FavoritosData';
import UltimasConsultas from '../data/UltimasConsultas';
import MapaData from '../data/MapaData'
import '../estilos/General.css'



function Inicio() {
  const [errorMessage, setErrorMessage] = useState('');
  const [idStop, setIdStop] = useState('');
  const [username, setUsername] = useState('');
  const [cookies] = useCookies(['username']);

  const handleInputChange = (event) => {
    setIdStop(event.target.value);
  };

  const handleConsulta = (event) => {
    event.preventDefault();
  
    if (cookies.username) {
      const formData = new FormData();
      formData.append('username', cookies.username);
      formData.append('id_Stop', idStop);
  
      fetch(`http://localhost:8000/emt/agregar_consulta/`, {
        method: 'POST',
        body: formData
      })
        .then(response =>response.json())
        .then(data => {
          if(data.error){
            setErrorMessage(data.error);

          } else{
            console.log(data)
            window.location.href = `/parada/${idStop}`;

          }
        })
        .catch(error => {
          console.error('Error al realizar la llamada a la API:', error);
        });
    } else {
      window.location.href = `/parada/${idStop}`;
    }
  };
  

  useEffect(() => {
    const getUsernameFromCookies = () => {
      const cookiesUsername = cookies.username;
      setUsername(cookiesUsername);
    };

    getUsernameFromCookies();
  }, []);


  return (
    <div>
      <Header />

      <div id="contentInicio">
        <div className="container">
          <div className='col-md-4' id='izquierda'>
            {cookies.username && (
              <UltimasConsultas username={cookies.username}/>
            )}
            {!cookies.username &&(
              <MapaData />
            )}
          </div>
          <div className="col-md-4" id='centro'>
            <img id='imagen' src={logoBus} alt="Logo Bus" />
            <div className="search-box" style={{ display: 'flex' }}>
              <form id="formInicio" onSubmit={handleConsulta}>
                <input type="text" name="parada" placeholder="Introduce la parada:"
                  value={idStop} onChange={handleInputChange} required pattern="[0-9]+" />
                <input type="submit" value="➲" className="btn btn-primary" />
              </form>
            </div>
            {cookies.username &&(
              <div className="line-button">
              <a href="/lineas" className="btn btn-primary">Líneas</a>
              <a href="/mapa" className="btn btn-primary">Encuentra tu parada</a>
              </div>
            )}
            {!cookies.username &&(
              <div className="line-button">
              <a href="/lineas" className="btn btn-primary">Líneas</a>
              </div>
            )}
            
          </div>
          <div className="col-md-4" id='derecha'>
            {cookies.username && (
              <FavoritosData username={cookies.username}/>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Inicio;
