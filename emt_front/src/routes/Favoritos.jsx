import React from 'react';
import FavoritosData from '../data/FavoritosData';
import { useCookies } from 'react-cookie';
import Header from '../components/Header';
import '../estilos/General.css'



function Favoritos() {
  const [cookies] = useCookies(['username']);

  return (
    <div>
      <Header />
      <FavoritosData username={cookies.username}/>
    </div>
  );
}

export default Favoritos;