import React, { useState, useEffect } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

interface PainelUsuarioProps {
  usuario: any;
  onSair: () => void;
  onAjustarDieta: () => void;
}

const PainelUsuario: React.FC<PainelUsuarioProps> = ({ usuario, onSair, onAjustarDieta }) => {
  const [aba, setAba] = useState<
  "plano" | "registro" | "alimentos" | "recomendacoes" | "configuracoes" | "hidratese"
>("plano");
  const [alimentosExtras, setAlimentosExtras] = useState<{ nome: string; kcal: string; dieta: string }[]>(() => {
  const salvos = localStorage.getItem("alimentosExtras");
  return salvos ? JSON.parse(salvos) : [];
});

  useEffect(() => {
    const salvos = localStorage.getItem("alimentosExtras");
    if (salvos) {
      setAlimentosExtras(JSON.parse(salvos));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("alimentosExtras", JSON.stringify(alimentosExtras));
  }, [alimentosExtras]);

  const [menuAberto, setMenuAberto] = useState(false);
  const [registros, setRegistros] = useState<
    {
      data: string;
      peso: string;
      observacao: string;
      tipoAlimentacao: string;
      alimentos: { tipoDieta: string; alimento: string; quantidade: string; calorias: number }[];
      caloriasTotais: number;
    }[]
 >(() => {
    const salvos = localStorage.getItem("registrosDesenvolvimento");
    return salvos ? JSON.parse(salvos) : [];
  });

  // Exemplo de cálculo de dias restantes (ajuste conforme sua lógica)
  const diasRestantes = usuario.tempoMeta
    ? Number(usuario.tempoMeta) * 30
    : "N/A";

  // Junta alimentos do plano + extras
  const alimentosPlano = (usuario.planoAlimentar?.match(/Sugestões de alimentos: (.*)/)?.[1] || "")
    .split(",")
    .map((alimento: string) => alimento.trim())
    .filter((alimento: string) => alimento);

  const alimentosExtrasDaDieta = usuario.tipoDieta === "Dieta Personalizada"
    ? alimentosExtras.map(a => a.nome)
    : [];

  const todosAlimentos = [
    ...alimentosPlano,
    ...alimentosExtrasDaDieta.filter(nome => !alimentosPlano.includes(nome)),
  ];

  // Formata o plano alimentar para exibição
  const planoFormatado =
  usuario.tipoDieta === "Dieta Personalizada"
    ? [
        <div key="personalizada">
          <span className="font-semibold">Plano Alimentar:</span>
          <span> Dieta criada e personalizada pelo próprio usuário</span>
        </div>,
      ]
    : usuario.planoAlimentar
    ? usuario.planoAlimentar
        .split("\n")
        .filter((linha: string) => linha.trim() !== "")
        .map((linha: string, idx: number) => {
          const [titulo, ...resto] = linha.split(":");
          if (resto.length > 0) {
            if (titulo.trim().toLowerCase().includes("sugestões de alimentos")) {
              return (
                <div key={idx}>
                  <span className="font-semibold">{titulo}:</span>
                  <span> {todosAlimentos.join(", ")}</span>
                </div>
              );
            }
            return (
              <div key={idx}>
                <span className="font-semibold">{titulo}:</span>
                <span> {resto.join(":").trim()}</span>
              </div>
            );
          }
          return <div key={idx}>{linha}</div>;
        })
    : null;

  // Conteúdo motivacional, receitas e exercícios por dieta/objetivo
  const motivacional = [
    "💡 Lembre-se: cada pequena escolha saudável conta!",
    "🥗 Varie as cores do seu prato para mais nutrientes.",
    "🚰 Beba água ao longo do dia.",
    "😴 Durma bem para potencializar seus resultados.",
    "📅 Registre seu progresso diariamente para se motivar!"
  ];

  const receitasPorDieta: Record<string, { nome: string; descricao: string; imagem: string; link: string }[]> = {
    "Low Carb": [
      {
        nome: "Omelete de Espinafre",
        descricao: "Ovos, espinafre, queijo e temperos. Bata tudo e leve à frigideira.",
        imagem: "https://www.receiteria.com.br/wp-content/uploads/omelete-de-espinafre-730x548.jpeg",
        link: "https://www.receiteria.com.br/receita/omelete-de-espinafre/"
      },
      {
        nome: "Frango com Brócolis",
        descricao: "Peito de frango grelhado com brócolis refogado no azeite.",
        imagem: "https://www.receiteria.com.br/wp-content/uploads/frango-com-brocolis-730x548.jpeg",
        link: "https://www.receiteria.com.br/receita/frango-com-brocolis/"
      },
      {
        nome: "Panqueca Low Carb",
        descricao: "Panqueca feita com ovos, farinha de amêndoas e recheio de frango.",
        imagem: "https://www.receiteria.com.br/wp-content/uploads/panqueca-low-carb-730x548.jpeg",
        link: "https://www.receiteria.com.br/receita/panqueca-low-carb/"
      }
    ],
    "Vegetariana": [
      {
        nome: "Salada de Quinoa",
        descricao: "Quinoa cozida, tomate, pepino, azeite e limão.",
        imagem: "https://www.receiteria.com.br/wp-content/uploads/salada-de-quinoa-730x548.jpeg",
        link: "https://www.receiteria.com.br/receita/salada-de-quinoa/"
      },
      {
        nome: "Tofu Grelhado",
        descricao: "Tofu temperado e grelhado, servido com legumes.",
        imagem: "https://www.receiteria.com.br/wp-content/uploads/tofu-grelhado-730x548.jpeg",
        link: "https://www.receiteria.com.br/receita/tofu-grelhado/"
      },
      {
        nome: "Hambúrguer de Lentilha",
        descricao: "Hambúrguer feito com lentilha, aveia e temperos.",
        imagem: "https://www.receiteria.com.br/wp-content/uploads/hamburguer-de-lentilha-730x548.jpeg",
        link: "https://www.receiteria.com.br/receita/hamburguer-de-lentilha/"
      }
    ],
    // Adicione mais receitas para as outras dietas seguindo o mesmo padrão...
    "Dieta Personalizada": [
      {
        nome: "Monte sua receita!",
        descricao: "Use os alimentos cadastrados para criar receitas do seu jeito.",
        imagem: "https://img.freepik.com/fotos-gratis/ingredientes-frescos-para-cozinhar-em-um-fundo-de-mesa-de-madeira-vista-superior_123827-20721.jpg",
        link: "#"
      }
    ]
  };

  const exerciciosPorObjetivo: Record<string, {
    nome: string;
    series: string;
    grupo: string;
    descricao: string;
    imagem: string; // Novo campo
  }[]> = {
    "Emagrecimento": [
      {
        nome: "Agachamento Livre",
        series: "3 x 15 repetições",
        grupo: "Pernas e Glúteos",
        descricao: "Agache flexionando os joelhos, mantendo as costas retas e volte à posição inicial.",
        imagem: "https://www.mundoboaforma.com.br/wp-content/uploads/2020/10/agachamento-livre.jpg"
      },
      {
        nome: "Polichinelo",
        series: "3 x 30 segundos",
        grupo: "Corpo inteiro",
        descricao: "Salte abrindo pernas e braços, retornando à posição inicial.",
        imagem: "https://www.tuasaude.com/media/article/rt/1h/polichinelo-exercicio-beneficios_21993_l.jpg"
      },
      {
        nome: "Corrida parada",
        series: "3 x 1 minuto",
        grupo: "Cardio/Corpo inteiro",
        descricao: "Simule corrida sem sair do lugar, elevando bem os joelhos.",
        imagem: "https://www.hipertrofia.org/blog/wp-content/uploads/2018/12/corrida-parada.jpg"
      },
      {
        nome: "Abdominal supra",
        series: "3 x 20 repetições",
        grupo: "Abdômen",
        descricao: "Deite de costas, flexione o tronco tirando os ombros do chão.",
        imagem: "https://www.tuasaude.com/media/article/np/ab/abdominal-supra_21997_l.jpg"
      }
    ],
    "Ganho de Massa": [
      {
        nome: "Flexão de Braço",
        series: "4 x 10 repetições",
        grupo: "Peito, Ombros e Tríceps",
        descricao: "Apoie as mãos no chão, corpo reto, desça e suba controlando o movimento.",
        imagem: "https://static1.minhavida.com.br/articles/ca/83/c8/ce/lio-putrashutterstock-article_m-1.jpg"
      },
      {
        nome: "Afundo",
        series: "3 x 12 repetições (cada perna)",
        grupo: "Pernas e Glúteos",
        descricao: "Dê um passo à frente e flexione ambos os joelhos, alternando as pernas.",
        imagem: "https://static1.minhavida.com.br/articles/d2/32/ee/43/shutterstocklio-putra-orig-1.jpg"
      },
      {
        nome: "Prancha Isométrica",
        series: "3 x 30 segundos",
        grupo: "Core (abdômen e lombar)",
        descricao: "Apoie antebraços e pontas dos pés no chão, mantenha o corpo alinhado.",
        imagem: "https://p2.trrsf.com/image/fget/cf/774/0/images.terra.com/2024/07/19/701504867-istock-1408890102.jpg"
      },
      {
        nome: "Tríceps no banco",
        series: "3 x 12 repetições",
        grupo: "Tríceps",
        descricao: "Apoie as mãos em uma cadeira, flexione e estenda os cotovelos.",
        imagem: "https://www.fitness4all.pt/wp-content/uploads/2023/09/Triceps-no-Banco-e1694188449597.jpg"
      }
    ],
    "Saúde/Manutenção": [
      {
        nome: "Alongamento de corpo inteiro",
        series: "2 x 30 segundos cada grupo",
        grupo: "Corpo inteiro",
        descricao: "Inclua alongamentos para pernas, braços, costas e pescoço.",
        imagem: "https://lh4.googleusercontent.com/proxy/kmFhKtrUPVkB0vpIpT0dwbvDwzUxBh33sKD5UQZrLoeoWhJaUJwtwKxkrJ5RW7QviOW8DINzBpFQHYMGzfnqdw4"
      },
      {
        nome: "Agachamento livre",
        series: "2 x 12 repetições",
        grupo: "Pernas e Glúteos",
        descricao: "Agache flexionando os joelhos, mantendo as costas retas e volte à posição inicial.",
        imagem: "https://static.wixstatic.com/media/2edbed_562fb03408db47b0bd2c960e012ec4ea~mv2.jpg/v1/fill/w_239,h_211,al_c,q_80,enc_avif,quality_auto/2edbed_562fb03408db47b0bd2c960e012ec4ea~mv2.jpg"
      },
      {
        nome: "Caminhada no lugar",
        series: "3 x 2 minutos",
        grupo: "Cardio/Corpo inteiro",
        descricao: "Caminhe sem sair do lugar, elevando os joelhos.",
        imagem: "https://cdn.shopify.com/s/files/1/0636/7749/7600/files/woman-doing-run-in-place-exercise-free-vector_480x480.jpg?v=1719999060"
      },
      {
        nome: "Elevação de panturrilha",
        series: "3 x 15 repetições",
        grupo: "Panturrilhas",
        descricao: "Em pé, eleve os calcanhares e retorne devagar.",
        imagem: "https://p2.trrsf.com/image/fget/cf/774/0/images.terra.com/2024/04/19/396374473-istock-1390409405.jpg"
      }
    ]
  };

  const [dieta, setDieta] = useState(usuario.tipoDieta || "");

  const [imagemModal, setImagemModal] = useState<string | null>(null);

  // IMC = peso (kg) / (altura (m) * altura (m))
  const imc = usuario.peso && usuario.altura
    ? (usuario.peso / ((usuario.altura / 100) ** 2)).toFixed(2)
    : null;

  // TMB (Mifflin-St Jeor)
  // Homem: 88.36 + (13.4 × peso) + (4.8 × altura) - (5.7 × idade)
  // Mulher: 447.6 + (9.2 × peso) + (3.1 × altura) - (4.3 × idade)
  let tmb = null;
  if (usuario.peso && usuario.altura && usuario.idade && usuario.genero) {
    if (usuario.genero.toLowerCase() === "masculino") {
      tmb = (88.36 + (13.4 * usuario.peso) + (4.8 * usuario.altura) - (5.7 * usuario.idade)).toFixed(0);
    } else {
      tmb = (447.6 + (9.2 * usuario.peso) + (3.1 * usuario.altura) - (4.3 * usuario.idade)).toFixed(0);
    }
  }

  // Quantidade recomendada em litros (35 ml por kg de peso)
  const aguaRecomendadaLitros = usuario.peso ? (usuario.peso * 35 / 1000).toFixed(2) : null;

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-green-100 via-white to-blue-100">
      {/* Botão retrátil sempre visível no topo esquerdo */}
      {!menuAberto && (
        <button
          className="fixed top-4 left-4 z-50 bg-blue-600 text-white p-2 rounded shadow"
          onClick={() => setMenuAberto(true)}
          aria-label="Abrir menu"
        >
          ☰
        </button>
      )}
      {/* Overlay e Sidebar só aparecem quando menuAberto for true */}
      {menuAberto && (
        <>
          {/* Overlay para fechar o menu */}
          <div
            className="fixed inset-0 bg-black bg-opacity-30 z-40"
            onClick={() => setMenuAberto(false)}
          />
          {/* Sidebar retrátil */}
          <div className="fixed z-50 top-0 left-0 h-full bg-white shadow-lg w-56 transition-transform duration-300 translate-x-0">
            <div className="flex flex-col h-full">
              <div className="flex items-center justify-between p-4 border-b">
                <span className="font-bold text-lg text-green-700">Menu</span>
                <button className="text-2xl" onClick={() => setMenuAberto(false)} aria-label="Fechar menu">×</button>
              </div>
              <button className={`p-4 text-left ${aba === "plano" ? "bg-blue-100 font-bold" : ""}`} onClick={() => { setAba("plano"); setMenuAberto(false); }}>Plano Alimentar</button>
              <button className={`p-4 text-left ${aba === "registro" ? "bg-blue-100 font-bold" : ""}`} onClick={() => { setAba("registro"); setMenuAberto(false); }}>Registro de Desenvolvimento</button>
              <button className={`p-4 text-left ${aba === "alimentos" ? "bg-blue-100 font-bold" : ""}`} onClick={() => { setAba("alimentos"); setMenuAberto(false); }}>Registro de Alimentos</button>
              <button
                className={`p-4 text-left ${aba === "recomendacoes" ? "bg-blue-100 font-bold" : ""}`}
                onClick={() => { setAba("recomendacoes"); setMenuAberto(false); }}
              >
                Para Você
              </button>
              <button
                className={`p-4 text-left ${aba === "hidratese" ? "bg-blue-100 font-bold" : ""}`}
                onClick={() => { setAba("hidratese"); setMenuAberto(false); }}
              >
                Hidrate-se
              </button>
              <button
                className={`p-4 text-left ${aba === "configuracoes" ? "bg-blue-100 font-bold" : ""}`}
                onClick={() => { setAba("configuracoes"); setMenuAberto(false); }}
              >
                Configurações
              </button>
              <div className="flex-1" />
              <div className="p-4 text-xs text-gray-400 text-center">Nutri Facil</div>
            </div>
          </div>
        </>
      )}
      {/* Conteúdo principal */}
      <div className="flex-1 flex flex-col items-center justify-center transition-all duration-300">
        <div
          id="painel-usuario-pdf"
          className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-lg mt-8"
        >
          <h2 className="text-3xl font-bold mb-4 text-center">
            Olá, {usuario.nome}!
          </h2>
          <p className="mb-4 text-center text-lg">
            Seu objetivo: <span className="font-semibold">{usuario.objetivo}</span>
          </p>
          <div className="mb-4">
            <div className="flex flex-wrap gap-4 justify-center">
              <div className="bg-blue-50 rounded p-4 shadow text-center">
                <div className="text-sm text-gray-500">Dieta</div>
                <div className="text-xl font-bold">{usuario.tipoDieta}</div>
              </div>
              <div className="bg-green-50 rounded p-4 shadow text-center">
                <div className="text-sm text-gray-500">Dias para meta</div>
                <div className="text-xl font-bold">{diasRestantes}</div>
              </div>
              <div className="bg-yellow-50 rounded p-4 shadow text-center">
                <div className="text-sm text-gray-500">Preferências</div>
                <div className="text-base">
                  {usuario.preferencias && usuario.preferencias.length > 0
                    ? usuario.preferencias.join(", ")
                    : "Nenhuma"}
                </div>
              </div>
              <div className="bg-pink-50 rounded p-4 shadow text-center relative group cursor-pointer">
  <div className="text-sm text-gray-500 font-semibold flex items-center justify-center gap-1">
    IMC
    <span className="ml-1 text-gray-400">ⓘ</span>
  </div>
  <div className="text-xl font-bold">{imc ?? "N/A"}</div>
  {/* Tooltip IMC */}
  <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 w-64 bg-white border border-gray-300 rounded shadow-lg p-3 text-xs text-gray-700 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50">
    <b>IMC (Índice de Massa Corporal):</b><br />
    Mede a relação entre peso e altura.<br />
    <b>Fórmula:</b> peso (kg) / [altura (m)]²<br />
    <b>Status:</b> {getStatusIMC(imc ? Number(imc) : null)}
    <ul className="mt-2">
      <li>Abaixo de 18,5: Abaixo do peso</li>
      <li>18,5 a 24,9: Peso normal</li>
      <li>25 a 29,9: Sobrepeso</li>
      <li>30 a 34,9: Obesidade I</li>
      <li>35 a 39,9: Obesidade II</li>
      <li>40 ou mais: Obesidade III</li>
    </ul>
  </div>
</div>
<div className="bg-orange-50 rounded p-4 shadow text-center relative group cursor-pointer">
  <div className="text-sm text-gray-500 font-semibold flex items-center justify-center gap-1">
    TMB
    <span className="ml-1 text-gray-400">ⓘ</span>
  </div>
  <div className="text-xl font-bold">{tmb ?? "N/A"} kcal/dia</div>
  {/* Tooltip TMB */}
  <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 w-64 bg-white border border-gray-300 rounded shadow-lg p-3 text-xs text-gray-700 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50">
    <b>TMB (Taxa Metabólica Basal):</b><br />
    Estima quantas calorias seu corpo gasta em repouso.<br />
    <b>Fórmula (Mifflin-St Jeor):</b><br />
    Homem: 88,36 + (13,4 × peso) + (4,8 × altura) - (5,7 × idade)<br />
    Mulher: 447,6 + (9,2 × peso) + (3,1 × altura) - (4,3 × idade)
  </div>
</div>
            </div>
          </div>
          {/* Conteúdo das abas */}
          {aba === "plano" ? (
            <>
              <div className="mb-4">
                <div className="bg-gray-100 rounded p-4">
                  <div className="font-semibold mb-2">Resumo do Plano Alimentar:</div>
                  <div className="mb-2">
                    <span className="font-semibold">IMC:</span> {imc ?? "N/A"}
                    <div className="text-xs text-gray-600 ml-2">
                      Status: {getStatusIMC(imc ? Number(imc) : null)}
                    </div>
                  </div>
                  <div className="mb-2">
                    <span className="font-semibold">TMB:</span> {tmb ?? "N/A"} kcal/dia
                  </div>
                  <div className="space-y-1">{planoFormatado}</div>
                </div>
              </div>
              <div className="mb-4">
                <div className="bg-gray-100 rounded p-4">
                  <div className="font-semibold mb-2">Tabela de Alimentos Sugeridos (Kcal por 100g):</div>
                  <table className="min-w-full text-sm text-left">
                    <thead>
                      <tr>
                        <th className="font-bold pr-4">Alimento</th>
                        <th className="font-bold">Kcal/100g</th>
                      </tr>
                    </thead>
                    <tbody>
                      {todosAlimentos.map((alimento: string) => (
                        <tr key={alimento}>
                          <td className="pr-4">{alimento}</td>
                          <td>
                            {tabelaCalorias[alimento] ??
                              alimentosExtras.find(a => a.nome === alimento)?.kcal ??
                              "N/A"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              {/* Botões de ação - agora só aparecem na aba Plano Alimentar */}
              <div className="flex flex-col gap-2 mt-6">
                <button
                  className="bg-red-600 text-white py-2 rounded hover:bg-red-700 transition"
                  onClick={() => exportarPDF(usuario)}
                >
                  Exportar para PDF
                </button>
                <button
                  className="bg-green-600 text-white py-2 rounded hover:bg-green-700 transition"
                  onClick={onAjustarDieta}
                >
                  Trocar dieta/ajustar alimentos
                </button>
                <button
                  className="bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 transition"
                  onClick={() => {
                    window.open("https://wa.me/5531973047087", "_blank");
                  }}
                >
                  Suporte via WhatsApp
                </button>
                <button
                  className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
                  onClick={onSair}
                >
                  Sair
                </button>
              </div>
            </>
          ) : aba === "registro" ? (
            <div className="mb-4">
              <div className="bg-gray-100 rounded p-4">
                <div className="font-semibold mb-2">Registro de Desenvolvimento:</div>
                <div className="text-sm text-gray-500">
                  Aqui você pode adicionar suas anotações e progresso em relação ao plano alimentar.
                </div>
                <RegistroDesenvolvimento
                  alimentosExtras={alimentosExtras}
                  registros={registros}
                  setRegistros={setRegistros}
                />
              </div>
            </div>
          ) : aba === "alimentos" ? (
            <div className="mb-4">
              <div className="bg-gray-100 rounded p-4">
                <div className="font-semibold mb-2">Registro de Alimentos:</div>
                <div className="text-sm text-gray-500 mb-2">
                  Registre aqui alimentos que não estão na lista principal.
                </div>
                <RegistroAlimentos
                  alimentosExtras={alimentosExtras}
                  setAlimentosExtras={setAlimentosExtras}
                />
              </div>
            </div>
          ) : aba === "recomendacoes" ? (
            <div className="mb-4">
              <Recomendacoes
                motivacional={motivacional}
                receitasPorDieta={receitasPorDieta}
                usuario={usuario}
                exerciciosPorObjetivo={exerciciosPorObjetivo}
                dicasPorDieta={dicasPorDieta}
              />
            </div>
          ) : aba === "configuracoes" ? (
  <Configuracoes />
) : aba === "hidratese" ? (
  <div className="mb-4">
    <div className="bg-blue-50 rounded p-6 shadow text-center">
      <div className="mb-6">
        <div className="text-lg font-bold text-blue-900 mb-1">Sua recomendação diária personalizada:</div>
        <div className="text-3xl font-extrabold text-blue-700 mb-2">
          {aguaRecomendadaLitros
            ? <>{aguaRecomendadaLitros} litros</>
            : <>Informe seu peso para calcular</>
          }
        </div>
        <div className="text-xs text-gray-500">
          (Cálculo: 35 ml de água por kg de peso corporal)
        </div>
      </div>
      <h3 className="text-2xl font-bold mb-2 text-blue-700">Hidrate-se!</h3>
      <p className="mb-4">
        A água é essencial para o bom funcionamento do seu corpo.<br />
        Lembre-se de beber água ao longo do dia!
      </p>
      <ul className="mb-4 text-left mx-auto max-w-xs text-blue-900">
        <li>💧 Ajuda na digestão e absorção de nutrientes</li>
        <li>💧 Melhora o desempenho físico e mental</li>
        <li>💧 Auxilia na eliminação de toxinas</li>
        <li>💧 Mantém a pele saudável</li>
      </ul>
    </div>
  </div>
) : null}
        </div>
      </div>
      {imagemModal && (
  <div
    className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50"
    onClick={() => setImagemModal(null)}
    style={{ cursor: "zoom-out" }}
  >
    <img
      src={imagemModal}
      alt="Exercício ampliado"
      className="max-w-full max-h-[90vh] rounded shadow-lg border-4 border-white"
      onClick={e => e.stopPropagation()}
    />
  </div>
)}
    </div>
  );
};

// Componente para registro de alimentos extras
const RegistroAlimentos: React.FC<{
  alimentosExtras: { nome: string; kcal: string; dieta: string }[];
  setAlimentosExtras: React.Dispatch<React.SetStateAction<{ nome: string; kcal: string; dieta: string }[]>>;
}> = ({ alimentosExtras, setAlimentosExtras }) => {
  const [nome, setNome] = useState("");
  const [kcal, setKcal] = useState("");

  const handleAdicionar = () => {
    if (!nome.trim() || !kcal.trim()) {
      alert("Preencha o nome do alimento e as calorias.");
      return;
    }
    if (alimentosExtras.some(a => a.nome.toLowerCase() === nome.trim().toLowerCase())) {
      alert("Este alimento já foi adicionado.");
      return;
    }
    setAlimentosExtras([...alimentosExtras, { nome: nome.trim(), kcal, dieta }]);
    setNome("");
    setKcal("");
  };

  const handleExcluir = (idx: number) => {
    setAlimentosExtras(alimentosExtras.filter((_, i) => i !== idx));
  };

  return (
    <div>
      <div className="flex flex-col gap-2 mb-4">
        <input
          type="text"
          placeholder="Nome do alimento"
          value={nome}
          onChange={e => setNome(e.target.value)}
          className="border rounded p-2"
        />
        <input
          type="number"
          placeholder="Kcal por 100g"
          value={kcal}
          onChange={e => setKcal(e.target.value)}
          className="border rounded p-2"
        />
        <button
          onClick={handleAdicionar}
          className="bg-green-600 text-white rounded px-4 py-2 hover:bg-green-700 transition w-full"
        >
          Adicionar alimento
        </button>
      </div>
      <div className="space-y-2">
        {alimentosExtras.length === 0 && (
          <div className="text-gray-500">Nenhum alimento registrado ainda.</div>
        )}
        {alimentosExtras.map((item, idx) => (
          <div key={idx} className="bg-white rounded p-3 flex justify-between items-center shadow">
            <div>
              <span className="font-semibold">{item.nome}</span> — {item.kcal} kcal/100g
            </div>
            <button
              onClick={() => handleExcluir(idx)}
              className="bg-red-600 text-white rounded px-2 py-1 hover:bg-red-700 transition"
            >
              Apagar
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

interface RegistroDesenvolvimentoProps {
  alimentosExtras: { nome: string; kcal: string; dieta: string }[];
  registros: {
    data: string;
    peso: string;
    observacao: string;
    tipoAlimentacao: string;
    alimentos: { tipoDieta: string; alimento: string; quantidade: string; calorias: number }[];
    caloriasTotais: number;
  }[];
  setRegistros: React.Dispatch<React.SetStateAction<any[]>>;
}

const RegistroDesenvolvimento: React.FC<RegistroDesenvolvimentoProps> = ({
  alimentosExtras,
  registros,
  setRegistros
}) => {
  const [peso, setPeso] = useState("");
  const [observacao, setObservacao] = useState("");
  const [tipoAlimentacao, setTipoAlimentacao] = useState("");
  const [alimentos, setAlimentos] = useState<
    { tipoDieta: string; alimento: string; quantidade: string }[]
  >([{ tipoDieta: "", alimento: "", quantidade: "" }]);
  const [editIdx, setEditIdx] = useState<number | null>(null);
  const [editPeso, setEditPeso] = useState("");
  const [editObs, setEditObs] = useState("");
  const [editTipoAlimentacao, setEditTipoAlimentacao] = useState("");
  const [editAlimentos, setEditAlimentos] = useState<
    { tipoDieta: string; alimento: string; quantidade: string }[]
  >([]);
  const [filtroData, setFiltroData] = useState("");

  const opcoesAlimentacao = [
    "Café da manhã",
    "Almoço",
    "Café da tarde",
    "Jantar"
  ];

  const opcoesTipoDieta = [
    "Low Carb",
    "Vegetariana",
    "Cetogênica",
    "Flexível",
    "Mediterrânea",
    "Paleolítica",
    "DASH",
    "Dieta Personalizada"
  ];

  const alimentosPorDieta: Record<string, string[]> = {
    "Low Carb": [
      "Ovos", "Frango", "Abacate", "Brócolis", "Espinafre", "Queijo", "Peito de frango", "Carne bovina", "Peixe", "Azeite"
    ],
    "Vegetariana": [
      "Brócolis", "Espinafre", "Queijo", "Cogumelos", "Nozes", "Amêndoas", "Sementes de chia", "Iogurte natural", "Tomate", "Pepino", "Alface", "Acelga", "Feijão", "Lentilha", "Tofu", "Quinoa", "Grão-de-bico", "Ervilha", "Leite", "Castanha-do-pará"
    ],
    "Cetogênica": [
      "Ovos", "Frango", "Abacate", "Queijo", "Peito de frango", "Carne bovina", "Peixe", "Azeite", "Nozes", "Amêndoas", "Sementes de chia", "Coco", "Manteiga", "Creme de leite"
    ],
    "Flexível": [
      "Ovos", "Frango", "Abacate", "Brócolis", "Espinafre", "Queijo", "Peito de frango", "Carne bovina", "Peixe", "Azeite", "Feijão", "Lentilha", "Tofu", "Quinoa", "Grão-de-bico", "Ervilha", "Leite", "Castanha-do-pará", "Arroz integral", "Aveia", "Sementes de abóbora", "Salmão", "Coco", "Couve", "Manteiga", "Creme de leite", "Legumes", "Frutas", "Banana", "Maçã", "Pão integral", "Sementes"
    ],
    "Mediterrânea": [
      "Peixe", "Azeite", "Brócolis", "Espinafre", "Queijo", "Tomate", "Pepino", "Alface", "Acelga", "Feijão", "Lentilha", "Tofu", "Quinoa", "Grão-de-bico", "Ervilha", "Leite", "Castanha-do-pará", "Cenoura", "Batata-doce", "Arroz integral", "Aveia", "Sementes de abóbora", "Salmão", "Coco", "Couve", "Legumes", "Frutas", "Banana", "Maçã", "Pão integral", "Sementes"
    ],
    "Paleolítica": [
      "Ovos", "Frango", "Abacate", "Brócolis", "Espinafre", "Peito de frango", "Carne bovina", "Peixe", "Azeite", "Nozes", "Amêndoas", "Sementes de chia", "Coco", "Couve", "Legumes", "Frutas", "Banana", "Maçã"
    ],
    "DASH": [
      "Brócolis", "Espinafre", "Queijo", "Cogumelos", "Nozes", "Amêndoas", "Sementes de chia", "Iogurte natural", "Tomate", "Pepino", "Alface", "Acelga", "Feijão", "Lentilha", "Tofu", "Quinoa", "Grão-de-bico", "Ervilha", "Leite", "Castanha-do-pará", "Cenoura", "Batata-doce", "Arroz integral", "Aveia", "Sementes de abóbora", "Couve", "Legumes", "Frutas", "Banana", "Maçã", "Pão integral", "Sementes"
    ],
    "Dieta Personalizada": alimentosExtras.map((a) => a.nome)
  };

  function getAlimentosDisponiveis(tipoDieta: string) {
    if (tipoDieta === "Dieta Personalizada") {
      return alimentosExtras.map((a) => a.nome);
    }
    return tipoDieta ? alimentosPorDieta[tipoDieta] || [] : [];
  }

  function getCaloriasAlimento(nome: string) {
    if (tabelaCalorias[nome] !== undefined) {
      return tabelaCalorias[nome];
    }
    const extra = alimentosExtras.find(a => a.nome === nome);
    if (extra && !isNaN(Number(extra.kcal))) {
      return Number(extra.kcal);
    }
    return 0;
  }

  const handleAddAlimento = () => {
    setAlimentos([...alimentos, { tipoDieta: "", alimento: "", quantidade: "" }]);
  };

  const handleRemoveAlimento = (idx: number) => {
    setAlimentos(alimentos.filter((_, i) => i !== idx));
  };

  const handleAlimentoChange = (
    idx: number,
    field: "tipoDieta" | "alimento" | "quantidade",
    value: string
  ) => {
    setAlimentos(alimentos.map((a, i) =>
      i === idx
        ? {
            ...a,
            [field]: value,
            ...(field === "tipoDieta" ? { alimento: "" } : {})
          }
        : a
    ));
  };

  const calcularCaloriasTotais = (alimentosArr: { alimento: string; quantidade: string }[]) => {
    return alimentosArr.reduce((total, item) => {
      const kcal100g = getCaloriasAlimento(item.alimento);
      const qtd = parseFloat(item.quantidade.replace(",", "."));
      if (!item.alimento || isNaN(qtd)) return total;
      return total + Math.round((kcal100g * qtd) / 100);
    }, 0);
  };

  const handleAdicionarRegistro = () => {
    if (
      peso.trim() === "" ||
      tipoAlimentacao === "" ||
      alimentos.some(a => !a.tipoDieta || !a.alimento || !a.quantidade)
    ) {
      alert("Preencha todos os campos obrigatórios e todos os alimentos.");
      return;
    }
    const alimentosComCalorias = alimentos.map(item => {
      const kcal100g = getCaloriasAlimento(item.alimento);
      const qtd = parseFloat(item.quantidade.replace(",", "."));
      return {
        tipoDieta: item.tipoDieta,
        alimento: item.alimento,
        quantidade: item.quantidade,
        calorias: isNaN(qtd) ? 0 : Math.round((kcal100g * qtd) / 100)
      };
    });
    const caloriasTotais = calcularCaloriasTotais(alimentos);

    const novoRegistro = {
      data: new Date().toLocaleDateString(),
      peso,
      observacao,
      tipoAlimentacao,
      alimentos: alimentosComCalorias,
      caloriasTotais,
    };
    setRegistros([...registros, novoRegistro]);
    setPeso("");
    setObservacao("");
    setTipoAlimentacao("");
    setAlimentos([{ tipoDieta: "", alimento: "", quantidade: "" }]);
  };

  // Funções para edição
  const handleEditar = (idx: number) => {
    setEditIdx(idx);
    setEditPeso(registros[idx].peso);
    setEditObs(registros[idx].observacao);
    setEditTipoAlimentacao(registros[idx].tipoAlimentacao);
    setEditAlimentos(
      registros[idx].alimentos.map(a => ({
        tipoDieta: a.tipoDieta,
        alimento: a.alimento,
        quantidade: a.quantidade
      }))
    );
  };

  const handleEditAlimentoChange = (
    idx: number,
    field: "tipoDieta" | "alimento" | "quantidade",
    value: string
  ) => {
    setEditAlimentos(editAlimentos.map((a, i) =>
      i === idx
        ? { ...a, [field]: value, ...(field === "tipoDieta" ? { alimento: "" } : {}) }
        : a
    ));
  };

  const handleEditAddAlimento = () => {
    setEditAlimentos([...editAlimentos, { tipoDieta: "", alimento: "", quantidade: "" }]);
  };

  const handleEditRemoveAlimento = (idx: number) => {
    setEditAlimentos(editAlimentos.filter((_, i) => i !== idx));
  };

  const handleSalvarEdicao = (idx: number) => {
    if (
      editPeso.trim() === "" ||
      editTipoAlimentacao === "" ||
      editAlimentos.some(a => !a.tipoDieta || !a.alimento || !a.quantidade)
    ) {
      alert("Preencha todos os campos obrigatórios e todos os alimentos.");
      return;
    }
    const alimentosComCalorias = editAlimentos.map(item => {
      const kcal100g = getCaloriasAlimento(item.alimento);
      const qtd = parseFloat(item.quantidade.replace(",", "."));
      return {
        tipoDieta: item.tipoDieta,
        alimento: item.alimento,
        quantidade: item.quantidade,
        calorias: isNaN(qtd) ? 0 : Math.round((kcal100g * qtd) / 100)
      };
    });
    const caloriasTotais = calcularCaloriasTotais(editAlimentos);

    const novos = [...registros];
    novos[idx] = {
      ...novos[idx],
      peso: editPeso,
      observacao: editObs,
      tipoAlimentacao: editTipoAlimentacao,
      alimentos: alimentosComCalorias,
      caloriasTotais,
    };
    setRegistros(novos);
    setEditIdx(null);
    setEditPeso("");
    setEditObs("");
    setEditTipoAlimentacao("");
    setEditAlimentos([]);
  };

  const handleCancelarEdicao = () => {
    setEditIdx(null);
    setEditPeso("");
    setEditObs("");
    setEditTipoAlimentacao("");
    setEditAlimentos([]);
  };

  const handleExcluirRegistro = (idx: number) => {
    setRegistros(registros.filter((_, i) => i !== idx));
  };

  useEffect(() => {
    localStorage.setItem("registrosDesenvolvimento", JSON.stringify(registros));
  }, [registros]);

  return (
    <div className="max-w-md mx-auto">
      <div className="flex flex-col gap-2 mb-4">
        <input
          type="number"
          placeholder="Peso (kg)"
          value={peso}
          onChange={(e) => setPeso(e.target.value)}
          className="border rounded p-2"
        />
        <select
          value={tipoAlimentacao}
          onChange={e => setTipoAlimentacao(e.target.value)}
          className="border rounded p-2"
        >
          <option value="">Selecione o tipo de alimentação</option>
          {opcoesAlimentacao.map(op => (
            <option key={op} value={op}>{op}</option>
          ))}
        </select>
        {/* Alimentos dinâmicos */}
        <div className="flex flex-col gap-2">
          {alimentos.map((item, idx) => (
            <div key={idx} className="flex gap-2 items-center">
              <select
                value={item.tipoDieta}
                onChange={e => handleAlimentoChange(idx, "tipoDieta", e.target.value)}
                className="border rounded p-2"
              >
                <option value="">Tipo de dieta</option>
                {opcoesTipoDieta.map(op => (
                  <option key={op} value={op}>{op}</option>
                ))}
              </select>
              <select
                value={item.alimento}
                onChange={e => handleAlimentoChange(idx, "alimento", e.target.value)}
                className="border rounded p-2 flex-1"
                disabled={!item.tipoDieta}
              >
                <option value="">Alimento</option>
                {getAlimentosDisponiveis(item.tipoDieta).map(alimento => (
                  <option key={alimento} value={alimento}>{alimento}</option>
                ))}
              </select>
              <input
                type="number"
                placeholder="Qtd (g)"
                value={item.quantidade}
                onChange={e => handleAlimentoChange(idx, "quantidade", e.target.value)}
                className="border rounded p-2 w-28"
                min={0}
              />
              {alimentos.length > 1 && (
                <button
                  type="button"
                  className="bg-red-500 text-white rounded px-2 py-1"
                  onClick={() => handleRemoveAlimento(idx)}
                >
                  -
                </button>
              )}
              {idx === alimentos.length - 1 && (
                <button
                  type="button"
                  className="bg-blue-500 text-white rounded px-2 py-1"
                  onClick={handleAddAlimento}
                >
                  +
                </button>
              )}
            </div>
          ))}
        </div>
        <input
          type="text"
          placeholder="Observação ou dieta do dia (opcional)"
          value={observacao}
          onChange={(e) => setObservacao(e.target.value)}
          className="border rounded p-2"
        />
        <button
          onClick={handleAdicionarRegistro}
          className="bg-green-600 text-white rounded px-4 py-2 hover:bg-green-700 transition w-full"
        >
          Adicionar
        </button>
      </div>
      <div className="mb-4">
  <label className="block text-sm font-semibold mb-1">Filtrar por data:</label>
  <input
    type="date"
    value={filtroData}
    onChange={e => setFiltroData(e.target.value)}
    className="border rounded p-2 w-full"
  />
</div>
      <div className="space-y-6">
        {registros.length === 0 && (
          <div className="text-gray-500">Nenhum registro ainda.</div>
        )}
        {registros
          .filter(registro => !filtroData || registro.data.split("/").reverse().join("-") === filtroData)
          .map((registro, idx) => (
          <div
            key={idx}
            className="bg-gray-100 rounded p-4 flex flex-col gap-2 shadow border border-gray-200"
          >
            {editIdx === idx ? (
              <>
                <input
                  type="number"
                  value={editPeso}
                  onChange={e => setEditPeso(e.target.value)}
                  className="border rounded p-1 mb-1"
                  placeholder="Peso (kg)"
                />
                <select
                  value={editTipoAlimentacao}
                  onChange={e => setEditTipoAlimentacao(e.target.value)}
                  className="border rounded p-1 mb-1"
                >
                  <option value="">Selecione o tipo de alimentação</option>
                  {opcoesAlimentacao.map(op => (
                    <option key={op} value={op}>{op}</option>
                  ))}
                </select>
                <div className="flex flex-col gap-2">
                  {editAlimentos.map((item, i) => (
                    <div key={i} className="flex gap-2 items-center">
                      <select
                        value={item.tipoDieta}
                        onChange={e => handleEditAlimentoChange(i, "tipoDieta", e.target.value)}
                        className="border rounded p-1"
                      >
                        <option value="">Tipo de dieta</option>
                        {opcoesTipoDieta.map(op => (
                          <option key={op} value={op}>{op}</option>
                        ))}
                      </select>
                      <select
                        value={item.alimento}
                        onChange={e => handleEditAlimentoChange(i, "alimento", e.target.value)}
                        className="border rounded p-1 flex-1"
                        disabled={!item.tipoDieta}
                      >
                        <option value="">Alimento</option>
                        {getAlimentosDisponiveis(item.tipoDieta).map(alimento => (
                          <option key={alimento} value={alimento}>{alimento}</option>
                        ))}
                      </select>
                      <input
                        type="number"
                        placeholder="Qtd (g)"
                        value={item.quantidade}
                        onChange={e => handleEditAlimentoChange(i, "quantidade", e.target.value)}
                        className="border rounded p-1 w-20"
                        min={0}
                      />
                      {editAlimentos.length > 1 && (
                        <button
                          type="button"
                          className="bg-red-500 text-white rounded px-2 py-1"
                          onClick={() => handleEditRemoveAlimento(i)}
                        >
                          -
                        </button>
                      )}
                      {i === editAlimentos.length - 1 && (
                        <button
                          type="button"
                          className="bg-blue-500 text-white rounded px-2 py-1"
                          onClick={handleEditAddAlimento}
                        >
                          +
                        </button>
                      )}
                    </div>
                  ))}
                </div>
                <input
                  type="text"
                  value={editObs}
                  onChange={e => setEditObs(e.target.value)}
                  className="border rounded p-1 mb-1"
                  placeholder="Observação"
                />
                <div className="flex gap-2 mt-2">
                  <button
                    onClick={() => handleSalvarEdicao(idx)}
                    className="bg-green-600 text-white rounded px-2 py-1 hover:bg-green-700 transition"
                  >
                    Salvar
                  </button>
                  <button
                    onClick={handleCancelarEdicao}
                    className="bg-gray-400 text-white rounded px-2 py-1 hover:bg-gray-500 transition"
                  >
                    Cancelar
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="font-semibold">{registro.data}</div>
                <div>Peso: {registro.peso} kg</div>
                <div>Tipo de alimentação: {registro.tipoAlimentacao || "-"}</div>
                <div>
                  <span className="font-semibold">Alimentos consumidos:</span>
                  <ul className="list-disc ml-6">
                    {registro.alimentos.map((a, i) => (
                      <li key={i}>
                        {a.alimento} ({a.tipoDieta}) — {a.quantidade}g ({a.calorias} kcal)
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="font-semibold">
                  Calorias Diárias Consumidas: {registro.caloriasTotais} kcal
                </div>
                {registro.observacao && (
                  <div>Observação: {registro.observacao}</div>
                )}
                <div className="flex gap-2 mt-2">
                  <button
                    onClick={() => handleEditar(idx)}
                    className="bg-yellow-500 text-white rounded px-2 py-1 hover:bg-yellow-600 transition"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleExcluirRegistro(idx)}
                    className="bg-red-600 text-white rounded px-2 py-1 hover:bg-red-700 transition"
                  >
                    Apagar
                  </button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

const Recomendacoes: React.FC<{
  motivacional: string[];
  receitasPorDieta: Record<string, { nome: string; descricao: string }[]>;
  usuario: any;
  exerciciosPorObjetivo: Record<string, {
    nome: string;
    series: string;
    grupo: string;
    descricao: string;
    imagem: string;
  }[]>;
  dicasPorDieta: Record<string, string[]>;
}> = ({ motivacional, receitasPorDieta, usuario, exerciciosPorObjetivo, dicasPorDieta }) => {
  const [abaRec, setAbaRec] = useState<"dicas" | "exercicios" | "receitas">("dicas");
  const [imagemModal, setImagemModal] = useState<string | null>(null);

  return (
    <>
      {imagemModal && (
        <div
          className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50"
          onClick={() => setImagemModal(null)}
          style={{ cursor: "zoom-out" }}
        >
          <img
            src={imagemModal}
            alt="Exercício ampliado"
            className="max-w-full max-h-[90vh] rounded shadow-lg border-4 border-white"
            onClick={e => e.stopPropagation()}
          />
        </div>
      )}
      <div className="bg-gray-100 rounded p-4">
        <div className="flex gap-2 mb-4">
          <button
            className={`px-4 py-2 rounded ${abaRec === "dicas" ? "bg-green-600 text-white" : "bg-white border"}`}
            onClick={() => setAbaRec("dicas")}
          >
            Dicas
          </button>
          <button
            className={`px-4 py-2 rounded ${abaRec === "exercicios" ? "bg-green-600 text-white" : "bg-white border"}`}
            onClick={() => setAbaRec("exercicios")}
          >
            Exercícios
          </button>
          <button
            className={`px-4 py-2 rounded ${abaRec === "receitas" ? "bg-green-600 text-white" : "bg-white border"}`}
            onClick={() => setAbaRec("receitas")}
          >
            Receitas
          </button>
        </div>
        {abaRec === "dicas" && (
          <div>
            <div className="font-semibold mb-2">
              Dicas para sua dieta: <span className="text-blue-700">{usuario.tipoDieta}</span>
            </div>
            <ul className="list-disc ml-6 text-green-700 mb-4">
              {(dicasPorDieta[usuario.tipoDieta] || dicasPorDieta["Dieta Personalizada"]).map((dica, i) => (
                <li key={i}>{dica}</li>
              ))}
            </ul>
            <div className="font-semibold mb-1">Dicas gerais:</div>
            <ul className="list-disc ml-6 text-green-700">
              {motivacional.map((dica, i) => (
                <li key={i}>{dica}</li>
              ))}
            </ul>
          </div>
        )}
        {abaRec === "exercicios" && (
          <div>
            {(exerciciosPorObjetivo[usuario.objetivo] || exerciciosPorObjetivo["Saúde/Manutenção"]).map((ex, i) => (
              <div key={i} className="mb-4 p-3 bg-white rounded shadow flex gap-4 items-center">
                <img
                  src={ex.imagem}
                  alt={ex.nome}
                  className="w-24 h-24 object-cover rounded border cursor-pointer"
                  style={{ minWidth: 96, minHeight: 96 }}
                  onClick={() => setImagemModal(ex.imagem)}
                />
                <div>
                  <div className="font-bold text-green-700">{ex.nome}</div>
                  <div><span className="font-semibold">Séries:</span> {ex.series}</div>
                  <div><span className="font-semibold">Grupo muscular:</span> {ex.grupo}</div>
                  <div><span className="font-semibold">Como fazer:</span> {ex.descricao}</div>
                </div>
              </div>
            ))}
          </div>
        )}
        {abaRec === "receitas" && (
          <div className="grid gap-4">
            {(receitasPorDieta[usuario.tipoDieta] || receitasPorDieta["Dieta Personalizada"]).map((rec, i) => (
              <div key={i} className="flex gap-4 bg-white rounded shadow p-3 items-center">
                <img
                  src={rec.imagem}
                  alt={rec.nome}
                  className="w-24 h-24 object-cover rounded border"
                  style={{ minWidth: 96, minHeight: 96 }}
                />
                <div>
                  <div className="font-bold text-green-700">{rec.nome}</div>
                  <div className="mb-1">{rec.descricao}</div>
                  <a
                    href={rec.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 underline text-sm"
                  >
                    Ver receita completa
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

function exportarPDF(usuario: any) {
  const painel = document.getElementById("painel-usuario-pdf");
  if (!painel) return;

  html2canvas(painel, { scale: 2 }).then((canvas) => {
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "px",
      format: [canvas.width, canvas.height],
    });
    pdf.addImage(imgData, "PNG", 0, 0, canvas.width, canvas.height);
    pdf.save("plano-alimentar.pdf");
  });
}

const tabelaCalorias: Record<string, number> = {
  "Ovos": 143,
  "Frango": 165,
  "Abacate": 160,
  "Brócolis": 34,
  "Espinafre": 23,
  "Queijo": 402,
  "Peito de frango": 165,
  "Carne bovina": 250,
  "Peixe": 206,
  "Azeite": 884,
  "Couve-flor": 25,
  "Cogumelos": 22,
  "Nozes": 654,
  "Amêndoas": 579,
  "Sementes de chia": 486,
  "Iogurte natural": 61,
  "Tomate": 18,
  "Pepino": 16,
  "Alface": 15,
  "Acelga": 19,
  "Feijão": 76,
  "Lentilha": 116,
  "Tofu": 76,
  "Quinoa": 120,
  "Grão-de-bico": 164,
  "Ervilha": 81,
  "Leite": 42,
  "Castanha-do-pará": 656,
  "Cenoura": 41,
  "Batata-doce": 86,
  "Arroz integral": 111,
  "Aveia": 389,
  "Sementes de abóbora": 559,
  "Salmão": 208,
  "Coco": 354,
  "Couve": 35,
  "Manteiga": 717,
  "Creme de leite": 195,
  "Legumes": 35,
  "Frutas": 52,
  "Banana": 89,
  "Maçã": 52,
  "Pão integral": 247,
  "Sementes": 500,
  "Berinjela": 25,
  "Abobrinha": 17,
  "Queijo feta": 264,
  "Cebola": 40,
  "Alho": 149,
  "Laranja": 47,
  "Uva": 69,
  "Mel": 304,
  "Iogurte desnatado": 41,
  "Leite desnatado": 35,
};

const dicasPorDieta: Record<string, string[]> = {
  "Low Carb": [
    "Faça 3 a 5 refeições por dia, evitando longos períodos em jejum.",
    "Prefira lanches ricos em proteínas e gorduras boas entre as refeições.",
    "Evite pular o café da manhã para manter o metabolismo ativo."
  ],
  "Vegetariana": [
    "Faça refeições a cada 3 horas para garantir aporte de nutrientes.",
    "Inclua fontes de proteína vegetal em todas as refeições.",
    "Lanches intermediários ajudam a evitar deficiências nutricionais."
  ],
  "Cetogênica": [
    "Coma quando sentir fome, mas evite beliscar fora das refeições principais.",
    "Normalmente 2 a 3 refeições ao dia são suficientes.",
    "Mantenha-se hidratado e monitore sinais de fome real."
  ],
  "Flexível": [
    "Faça de 3 a 6 refeições por dia, conforme sua rotina.",
    "Inclua todos os grupos alimentares e ajuste os horários conforme sua fome.",
    "Evite grandes intervalos sem comer para não exagerar na próxima refeição."
  ],
  "Mediterrânea": [
    "Prefira 3 refeições principais e 2 lanches leves ao dia.",
    "Inclua frutas, castanhas e azeite nos lanches intermediários.",
    "Mantenha horários regulares para as refeições."
  ],
  "Paleolítica": [
    "Coma quando sentir fome, respeitando sinais do corpo.",
    "Normalmente 3 a 4 refeições ao dia são suficientes.",
    "Evite alimentos processados e priorize alimentos naturais."
  ],
  "DASH": [
    "Faça 5 a 6 refeições pequenas ao dia para controlar a pressão arterial.",
    "Inclua frutas e vegetais em todas as refeições.",
    "Evite longos períodos em jejum."
  ],
  "Dieta Personalizada": [
    "Monte seus horários de acordo com sua rotina e preferências.",
    "O importante é manter regularidade e equilíbrio nas refeições.",
    "Se possível, consulte um nutricionista para um plano ainda mais ajustado."
  ]
};

const Configuracoes: React.FC = () => {
  const [abaConfig, setAbaConfig] = useState<"tema" | "assinatura" | "notificacao">("tema");
  const [assinaturaAtiva, setAssinaturaAtiva] = useState(false);
  const [pagando, setPagando] = useState(false);

  const handleAssinar = () => {
    setPagando(true);
    setTimeout(() => {
      setAssinaturaAtiva(true); // Isso desbloqueia as funções!
      setPagando(false);
    }, 2000);
  };

  return (
    <div className="bg-gray-100 rounded p-4">
      <div className="flex gap-2 mb-4">
        <button
          className={`px-4 py-2 rounded ${abaConfig === "tema" ? "bg-green-600 text-white" : "bg-white border"}`}
          onClick={() => setAbaConfig("tema")}
        >
          Tema
        </button>
        <button
          className={`px-4 py-2 rounded ${abaConfig === "assinatura" ? "bg-green-600 text-white" : "bg-white border"}`}
          onClick={() => setAbaConfig("assinatura")}
        >
          Assinatura
        </button>
        <button
          className={`px-4 py-2 rounded ${abaConfig === "notificacao" ? "bg-green-600 text-white" : "bg-white border"}`}
          onClick={() => setAbaConfig("notificacao")}
        >
          Notificação
        </button>
      </div>
      {abaConfig === "tema" && (
        <div>
          <div className="font-semibold mb-2">Tema</div>
          <p>Configurações de tema (claro/escuro) vão aqui.</p>
        </div>
      )}
      {abaConfig === "assinatura" && (
        <div>
          <div className="font-semibold mb-2">Assinatura</div>
          {assinaturaAtiva ? (
            <div className="text-green-700 font-bold mb-2">Sua assinatura está ativa!</div>
          ) : (
            <div>
              <p className="mb-2">Assine para desbloquear todos os recursos premium do NutriFacil.</p>
              <button
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
                onClick={handleAssinar}
                disabled={pagando}
              >
                {pagando ? "Processando..." : "Assinar por R$ 19,90/mês"}
              </button>
            </div>
          )}
        </div>
      )}
      {abaConfig === "notificacao" && (
        <div>
          <div className="font-semibold mb-2">Notificação</div>
          <p>Configurações de notificação vão aqui.</p>
        </div>
      )}
    </div>
  );
};

function getStatusIMC(imc: number | null) {
  if (imc === null) return "N/A";
  if (imc < 18.5) return "Abaixo do peso";
  if (imc < 25) return "Peso normal";
  if (imc < 30) return "Sobrepeso";
  if (imc < 35) return "Obesidade grau I";
  if (imc < 40) return "Obesidade grau II";
  return "Obesidade grau III";
}

export default PainelUsuario;