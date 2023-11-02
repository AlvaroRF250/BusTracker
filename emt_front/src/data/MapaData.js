import React, { useState, useEffect } from 'react';
import { GoogleMap, LoadScript, Marker, InfoWindow } from '@react-google-maps/api';
import '../estilos/Mapas.css'
import imgBus from '../images/BusTracker.png'

const Map = () => {
  const containerStyle = {
    width: '400px',
    height: '400px',
  };

  const center = {
    lat: 40.419992,
    lng: -3.688737,
  };

  const [paradas, setParadas] = useState([]);
  const [selectedParada, setSelectedParada] = useState(null);

  useEffect(() => {
    fetch('http://localhost:8000/emt/paradas/')
      .then(response => response.json())
      .then(data => {
        console.log(data);
  
        if (Array.isArray(data)) {
          setParadas(data);
        } else if (typeof data === 'object' && data !== null) {
          setParadas([data]);
        } else {
          console.error('Los datos recibidos no son un arreglo o un objeto válido:', data);
        }
      })
      .catch(error => console.error(error));
  }, []);
  
  const handleMarkerClick = (parada) => {
    setSelectedParada(parada);
  };

  const handleParadaButtonClick = (idStop) => {
    window.location.href = `/parada/${idStop}`;
  };

  return (
    <div id='contentMapa'>
      <div className='container'>
        <LoadScript
          googleMapsApiKey="AIzaSyAaltrQYIuiD1NM2vNX3iSeJ2pi6wL0QuU"
        >
          <GoogleMap
            mapContainerStyle={containerStyle}
            center={center}
            zoom={17}
          >
            {paradas.map(parada => (
              <Marker
                key={parada.numero_parada}
                position={{ lat: parada.latitud, lng: parada.longitud }}
                onClick={() => handleMarkerClick(parada)}
                icon={{
                  url: imgBus,
                  scaledSize: new window.google.maps.Size(50, 50),
                  anchor: new window.google.maps.Point(16, 16),
                }}

              />
            ))}

            {selectedParada && (
              <InfoWindow
                position={{ lat: selectedParada.latitud, lng: selectedParada.longitud }}
                onCloseClick={() => setSelectedParada(null)}
              >
                <div>
                  <h5>Parada</h5>
                  <h6>
                    <button className="btn btn-primary" onClick={() => handleParadaButtonClick(selectedParada.numero_parada)}>
                      {selectedParada.numero_parada}
                    </button>
                  </h6>
                  <p>Nombre parada: {selectedParada.direccion}</p>
                </div>
              </InfoWindow>
            )}
          </GoogleMap>
        </LoadScript>
      </div>
    </div>
  );
};

export default Map;
