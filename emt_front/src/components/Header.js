import React from "react";
import { useCookies } from 'react-cookie';
import logoEMT from '../images/emt.png'
import imgPerfil from '../images/perfil.png'
import imgFav from '../images/busEstrella.png'
import imgCon from '../images/busConsulta.png'
import imgMaps from '../images/busMaps.png'
import { Dropdown } from 'react-bootstrap';
import '../estilos/Header.css'

function Header(){

  const [cookies, setCookies, removeCookies] = useCookies(['username']); 

  const handleLogout = () => {
    removeCookies('username', {path:'/'});
    window.location.href = '/'; 
  };

  

    return(
      
    <div>
      <div id="header">
        <div className="logo">
          <a href='/' className="custom-tooltip" title="Ir a la página principal">
            <img id='imagen' src={logoEMT} alt="Logo EMT" />
          </a>
        </div>
        <div id="consultas">
          {cookies.username &&(
            <a href={`/consultas/${cookies.username}`} className="custom-tooltip" title="Ir a tus consultas"><img id="imagen" src={imgCon} alt="Imagen consultas" /></a>
          )}
        </div>
        <div id="maps">
          {cookies.username &&(
            <a href={`/mapa`} className="custom-tooltip" title="Busca tu parada"><img id="imagen" src={imgMaps} alt="Imagen maps" /></a>
          )}
        </div>
        <div id="favoritos">
          {cookies.username &&(
            <a href={`/favoritos/${cookies.username}`} className="custom-tooltip" title="Ir a tus favoritos"><img id="imagen" src={imgFav} alt="Imagen favoritos" /></a>
          )}
        </div>
        <div className="login-button">
          {!cookies.username &&(
            <a href="/iniciar_sesion" className="btn btn-primary">Iniciar sesión</a>
          )}
          {cookies.username &&(
            <Dropdown>
            <Dropdown.Toggle variant="primary" id="dropdown-menu" style={{ backgroundColor: '#0070d2', border: 'none' }}>
              <div className="user-profile">
                  <img id="imagen" src={imgPerfil} alt="Imagen Perfil" />
              </div>
            </Dropdown.Toggle>
            <Dropdown.Menu style={{ backgroundColor: '#5ca9dd' }}>
              <Dropdown.Item href={`/iniciar_sesion/`}>Perfil</Dropdown.Item>
              <Dropdown.Item href={`/lineas/`}>Lineas</Dropdown.Item>
              <Dropdown.Item onClick={handleLogout}>Cerrar sesión</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
          )}
        </div>
      </div>
    </div>
    )

}

export default Header;