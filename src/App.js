import React, { useEffect, useState } from 'react';
import  supabase  from './controller/supabase';

function App() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const { data: tableData, error } = await supabase
        .from('usuarios')
        .select('*');

      if (error) console.error(error);
      else setData(tableData);
    };

    fetchData();
  }, []);

  return (
    <div>
      <h1>Dados do Supabase</h1>
      <ul>
        {data.map(item => (
          <li key={item.id}>{item.nome}</li> // Ajuste conforme sua tabela
        ))}
      </ul>
    </div>
  );
}

export default App;
