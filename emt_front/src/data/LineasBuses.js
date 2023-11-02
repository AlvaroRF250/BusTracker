import React, { useState, useEffect } from 'react';
import '../estilos/General.css'
import '../estilos/Lineas.css'


export function LineasBuses() {
  const [data, setData] = useState(null);

  const API_URL = `http://localhost:8000/emt/lineas/`;

  useEffect(() => {
    fetch(API_URL)
      .then(response => response.json())
      .then(data => {
        setData(data);
      })
      .catch(error => {
        console.error(error);
      });
  }, []);

  if (!data) {
    return <div id='contentCargando'>
      <div className="custom-loader"></div>
    </div>;
  }

  const lineas = Object.entries(data.lineas).sort(([, {label: a}], [, {label: b}]) => {
    const numA = parseInt(a);
    const numB = parseInt(b);
    if (!isNaN(numA) && !isNaN(numB)) {
      return numA - numB;
    } else if (!isNaN(numA)) {
      return -1;
    } else if (!isNaN(numB)) {
      return 1;
    } else if (a.startsWith("N") && b.startsWith("N")) {
      const numA = parseInt(a.substring(1));
      const numB = parseInt(b.substring(1));
      return numA - numB;
    } else {
      return a.localeCompare(b);
    }
      }).filter(([, {label}]) => label !== "001" && label !== "002" && label !== "C03" && label !== "E4" && label !== "E5" && label !== "N28"
      && label !== "SE709" && label !== "SE712" && label !== "SE718" && label !== "SE721" && label !== "SE727" && label !== "SE744" 
      && label !== "SE832" && label !== "908"); 
  
  const tableRows = [];
  const columnCount = 2;

  for (let i = 0; i < lineas.length; i += columnCount) {
    const row = lineas.slice(i, i + columnCount);
    tableRows.push(row);
  }

  return (
    <div id='contentLineas'>
    <div className='container'>
      <h1>Todas las líneas</h1>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%' }}>
          <tbody>
            {tableRows.map((row, index) => (
              <tr key={index}>
                {row.map(([key, { line, label, nameA, nameB }]) => (
                  <td key={key} style={{ textAlign: 'center', color: 'white' }} onClick={() => 
                  window.open(`https://www.mapamadrid.net/img/lineasbus/6${label < 10 ? `${line}` : label < 100 ? `${line}` : line}H1.jpg`, '_blank')}>
                    <div id='tabla'>
                      <div style={{ backgroundColor: '#0070d2', fontWeight: 'bold', padding: '5px', width: '85%', margin: '10px' }}>
                        {label}
                      </div>
                      <div>
                        <a>
                          {nameA} - {nameB}
                        </a>
                      </div>
                    </div>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </div>
  
  );
}

export default LineasBuses;