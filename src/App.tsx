import React, { useState } from 'react';
import Home from './pages/Home';
import Cadastro from './pages/Cadastro';

const App: React.FC = () => {
  const [pagina, setPagina] = useState<'home' | 'cadastro'>('home');

  return (
    <div className="App">
      {pagina === 'home' && <Home onCadastrar={() => setPagina('cadastro')} />}
      {pagina === 'cadastro' && <Cadastro />}
    </div>
  );
};

export default App;