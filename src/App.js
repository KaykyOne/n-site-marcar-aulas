import React, { useEffect, useState } from 'react';
import { supabase } from './supabaseClient';

function App() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const { data: tableData, error } = await supabase
        .from('sua_tabela')
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
