import React, { useState, useEffect } from 'react';
import { useCookies } from 'react-cookie';
import '../estilos/General.css'
import '../estilos/Espera.css'

function TiempoEspera({ id_Stop }) {
  const [data, setData] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [cookies] = useCookies(['username']);
  const [showMessage, setShowMessage] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [prueba, setPrueba] = useState(0);


  let API_URL = `http://localhost:8000/emt/tiempo_espera/${id_Stop}/`;

  useEffect(() => {
    fetchData();
    checkFavoriteStatus();
  }, [id_Stop]);

  const fetchData = () => {
    fetch(API_URL)
      .then(response => response.json())
      .then(data => {
        setData(data);
      })
      .catch(error => {
        console.error(error);
      });
  };

  const checkFavoriteStatus = () => {
    const formData = new FormData();
    formData.append('username', cookies.username);
    formData.append('id_Stop', id_Stop);

    fetch('http://localhost:8000/emt/comprobar_favorito/', {
      method: 'POST',
      body: formData,
    })
      .then(response => response.json())
      .then(data => {
        if (data.error) {
          setErrorMessage(data.error);
        } else {
          setIsFavorite(data.is_favorite);
        }
      })
      .catch(error => {
        console.error(error);
      });
  };

  const handleToggleFavorite = (event) => {
    event.preventDefault();

    if (isFavorite) {
      handleRemoveFavorite();
    } else {
      handleSubmit();
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    window.location.href = `/parada/${id_Stop}`;

    const formData = new FormData();
    formData.append('username', cookies.username);
    formData.append('id_Stop', id_Stop);

    fetch('http://localhost:8000/emt/agregar_favorito/', {
      method: 'POST',
      body: formData,
    })
      .then(response => response.json())
      .then(data => {
        if (data.error) {
          setErrorMessage(data.error);
        } else {
          setShowMessage(true);
          setTimeout(() => {
            setShowMessage(false);
          }, 2000);
        }
      })
      .catch(error => {
        console.error(error);
      });
  };

  const handleRemoveFavorite = (event) => {
    event.preventDefault();
    window.location.href = `/parada/${id_Stop}`;

    const formData = new FormData();
    formData.append('username', cookies.username);
    formData.append('id_Stop', id_Stop);
  
    fetch('http://localhost:8000/emt/eliminar_favorito/', {
      method: 'POST',
      body: formData,
    })
      .then(response => response.json())
      .then(data => {
        if (data.error) {
          setErrorMessage(data.error);
        } else {
          setShowMessage(true);
          setTimeout(() => {
            setShowMessage(false);
          }, 2000);
        }
      })
      .catch(error => {
        console.error(error);
      });
  };  
  

  if (!data) {
    return (
      <div id='contentCargando'>
        <div className="custom-loader"></div>
      </div>
    );
  }

  const estimates = Object.entries(data.estimateArrive).sort((a, b) => a[1] - b[1]);

  return (
    <div id='contentEspera'>
      <div className='container'>
        <h1>Tiempo de espera en la parada {data.id_Stop}</h1>
        <div className="espera-container" style={{ overflow: 'auto' }}>
          <div className="espera-container">
            {estimates.map(([line, estimate]) => (
              <div key={line} className="espera-item">
                <div className="linea-info">
                  <span className="linea-nombre">{line}</span>
                  <span className="tiempo-espera">
                    {estimate < 60 ? "Llegando a la parada..." : "Llega en " + Math.round(estimate / 60) + " minutos"}
                  </span>
                </div>
                <div className="destino-info">Destino: {data.destination[line]}</div>
              </div>
            ))}
          </div>
        </div>
        <form onSubmit={isFavorite ? handleRemoveFavorite : handleSubmit}>
          {cookies.username && (
            <button className="btn btn-primary" type="submit">
              {isFavorite ? 'Eliminar de favoritos' : 'Agregar a favoritos'}
            </button>
          )}
        </form>

        {showMessage && (
          <div className="floating-message">
            <p>{isFavorite ? 'Eliminado de favoritos' : 'Agregado con éxito a favoritos'}</p>
          </div>
        )}
      </div>
    </div>

  );
}

export default TiempoEspera;

