import React from 'react';
import MapaData from '../data/MapaData';
import Header from '../components/Header';
import '../estilos/General.css'

function Mapa() {

  return (
    <div>
      <Header />
      <MapaData />
    </div>
  );
}

export default Mapa;