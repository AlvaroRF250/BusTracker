import React from 'react';
import { useCookies } from 'react-cookie';
import UltimasConsultas from '../data/UltimasConsultas';
import Header from '../components/Header';


function Favoritos() {
  const [cookies] = useCookies(['username']);

  return (
    <div>
      <Header />
      <UltimasConsultas username={cookies.username}/>
    </div>
  );
}

export default Favoritos;