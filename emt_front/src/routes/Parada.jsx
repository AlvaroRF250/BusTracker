import React from 'react';
import { useParams } from 'react-router-dom';
import TiempoEspera from '../data/TiempoEspera';
import Header from '../components/Header';

function Parada() {
    const { id_Stop } = useParams();
    return (
      <div>
        <Header />
        <TiempoEspera id_Stop={id_Stop} />
      </div>
    );
  }

export default Parada;
