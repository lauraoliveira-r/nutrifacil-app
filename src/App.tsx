import React, { useState } from 'react';
import Home from './pages/Home';
import Cadastro from './pages/Cadastro';
import AjusteDieta from './pages/AjusteDieta';
import PainelUsuario from './pages/PainelUsuario';

// Função para gerar o plano alimentar (igual à do backend)
function gerarPlanoAlimentar(usuario: any) {
  const dietas: any = {
    "Low Carb": {
      descricao: "Reduz carboidratos, aumenta proteínas e gorduras boas.",
      sugestoes: [
        "Ovos", "Frango", "Abacate", "Brócolis", "Espinafre", "Queijo", "Peito de frango",
        "Carne bovina", "Peixe", "Azeite", "Couve-flor", "Cogumelos", "Nozes", "Amêndoas",
        "Sementes de chia", "Iogurte natural", "Tomate", "Pepino", "Alface", "Acelga"
      ],
    },
    "Vegetariana": {
      descricao: "Sem carne, foco em vegetais, grãos e leguminosas.",
      sugestoes: [
        "Feijão", "Lentilha", "Tofu", "Quinoa", "Grão-de-bico", "Ervilha", "Ovos", "Leite",
        "Queijo", "Iogurte", "Castanha-do-pará", "Nozes", "Amêndoas", "Brócolis", "Espinafre",
        "Cenoura", "Batata-doce", "Arroz integral", "Aveia", "Sementes de abóbora"
      ],
    },
    "Cetogênica": {
      descricao: "Muito baixo carboidrato, alto teor de gordura.",
      sugestoes: [
        "Ovos", "Abacate", "Salmão", "Azeite", "Carne bovina", "Frango", "Queijo", "Nozes",
        "Amêndoas", "Coco", "Sementes de chia", "Espinafre", "Brócolis", "Couve", "Peixe",
        "Manteiga", "Creme de leite", "Cogumelos"
      ],
    },
    "Flexível": {
      descricao: "Equilíbrio entre todos os grupos alimentares.",
      sugestoes: [
        "Arroz", "Frango", "Legumes", "Frutas", "Feijão", "Ovos", "Batata-doce", "Peixe",
        "Iogurte", "Aveia", "Carne bovina", "Abacate", "Tomate", "Cenoura", "Banana",
        "Maçã", "Pão integral", "Sementes", "Nozes"
      ],
    },
    "Mediterrânea": {
      descricao: "Baseada em alimentos frescos, azeite e peixes.",
      sugestoes: [
        "Azeite", "Peixe", "Tomate", "Grão-de-bico", "Berinjela", "Abobrinha", "Frango",
        "Nozes", "Amêndoas", "Iogurte", "Queijo feta", "Espinafre", "Alface", "Cebola",
        "Alho", "Laranja", "Uva", "Pão integral", "Lentilha", "Pepino"
      ],
    },
    "Paleolítica": {
      descricao: "Alimentos naturais, carnes, frutas e vegetais.",
      sugestoes: [
        "Carne", "Ovos", "Frutas", "Nozes", "Peixe", "Frango", "Batata-doce", "Cenoura",
        "Espinafre", "Brócolis", "Couve", "Abacate", "Sementes", "Cogumelos", "Banana",
        "Maçã", "Manga", "Mel", "Castanha-do-pará"
      ],
    },
    "DASH": {
      descricao: "Foco em pressão arterial, frutas, vegetais e laticínios magros.",
      sugestoes: [
        "Banana", "Iogurte desnatado", "Espinafre", "Peito de frango", "Aveia", "Leite desnatado",
        "Feijão", "Brócolis", "Cenoura", "Batata-doce", "Maçã", "Laranja", "Salmão", "Nozes",
        "Arroz integral", "Pão integral", "Tomate", "Pepino", "Sementes de abóbora"
      ],
    },
  };

  // Restrições por preferência
  const restricoes: Record<string, string[]> = {
    "Sem lactose": [
      "Leite", "Queijo", "Iogurte", "Iogurte natural", "Queijo feta", "Leite desnatado", "Creme de leite", "Manteiga"
    ],
    "Sem glúten": [
      "Pão", "Pão integral", "Trigo", "Cevada", "Centeio", "Aveia" // Aveia pode conter glúten por contaminação
    ],
    "Sem açúcar": [
      "Açúcar", "Mel"
    ],
    "Vegano": [
      "Ovos", "Frango", "Carne bovina", "Peixe", "Salmão", "Iogurte", "Leite", "Queijo", "Queijo feta",
      "Peito de frango", "Manteiga", "Creme de leite", "Iogurte desnatado", "Leite desnatado"
    ],
    "Vegetariano": [
      "Frango", "Peixe", "Salmão", "Peito de frango","Carne bovina",
    ],
  };

  const dieta = dietas[usuario.tipoDieta];
  if (!dieta) return "Dieta não encontrada.";

  // Monta lista de restrições do usuário
  let alimentosProibidos: string[] = [];
  if (usuario.preferencias && Array.isArray(usuario.preferencias)) {
    usuario.preferencias.forEach((pref: string) => {
      if (restricoes[pref]) {
        alimentosProibidos = alimentosProibidos.concat(restricoes[pref]);
      }
    });
  }

  // Remove duplicatas
  alimentosProibidos = [...new Set(alimentosProibidos)];

  const caloriasBase = usuario.peso * 25;
  let calorias = caloriasBase;
  if (usuario.objetivo === "Emagrecer") calorias -= 500;
  if (usuario.objetivo === "Ganhar Massa") calorias += 400;

  const sugestoesBase = dieta.sugestoes
    .filter((alimento: string) => !alimentosProibidos.includes(alimento));

  const sugestoesFinais =
    usuario.alimentosSelecionados && usuario.alimentosSelecionados.length > 0
      ? sugestoesBase.filter((alimento: string) =>
          usuario.alimentosSelecionados.includes(alimento)
        )
      : sugestoesBase;

  return `
Dieta: ${usuario.tipoDieta}
Descrição: ${dieta.descricao}
Calorias diárias: ${calorias}
Sugestões de alimentos: ${sugestoesFinais.join(", ") || "Nenhum alimento sugerido para as preferências selecionadas."}
  `;
}

const App: React.FC = () => {
  const [usuario, setUsuario] = useState(null);
  const [pagina, setPagina] = useState<'home' | 'cadastro' | 'dashboard' | 'ajuste'>('home');

  const handleLoginSucesso = (usuario: any) => {
    // Gere o plano alimentar ao fazer login
    const planoAlimentar = gerarPlanoAlimentar(usuario);
    setUsuario({ ...usuario, planoAlimentar });
    setPagina('dashboard');
  };

  const handleSalvarAjuste = async (novosDados: any) => {
    const planoAlimentar = gerarPlanoAlimentar(novosDados);

    // Salva no backend
    await fetch("http://localhost:5000/api/atualizar", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...novosDados, planoAlimentar }),
    });

    setUsuario({ ...novosDados, planoAlimentar });
    setPagina('dashboard');
  };

  return (
    <div className="App">
      {pagina === 'home' && (
        <Home
          onCadastrar={() => setPagina('cadastro')}
          onLoginSucesso={handleLoginSucesso}
        />
      )}
      {pagina === 'cadastro' && (
        <Cadastro onCadastroSucesso={() => setPagina('home')} />
      )}
      {pagina === 'dashboard' && usuario && (
        <PainelUsuario
          usuario={usuario}
          onSair={() => setPagina('home')}
          onAjustarDieta={() => setPagina('ajuste')}
        />
      )}
      {pagina === 'ajuste' && usuario && (
        <AjusteDieta
          usuario={usuario}
          onSalvar={handleSalvarAjuste}
          onCancelar={() => setPagina('dashboard')}
        />
      )}
    </div>
  );
};

export default App;