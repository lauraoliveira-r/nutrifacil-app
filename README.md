🥗 NutriFácil
NutriFácil é uma aplicação web criada para ajudar pessoas a planejarem suas refeições de forma prática, personalizada e acessível. O app gera planos alimentares conforme os objetivos, preferências e restrições alimentares dos usuários, incentivando uma alimentação saudável e um estilo de vida equilibrado.

🎯 Objetivo
Criar uma ferramenta gratuita, baseada em navegador e intuitiva, que:

Auxilia na organização das refeições;

Gera recomendações realistas baseadas em dados;

Estimula escolhas alimentares mais saudáveis e naturais.

🚀 Funcionalidades
📋 Formulário de perfil alimentar personalizado

🧮 Cálculo de TMB, IMC e recomendação de ingestão de água

🍽 Geração automática de plano alimentar com calorias e porções

📊 Acompanhamento da ingestão de calorias e água

🍲 Sugestões de receitas baseadas na dieta do usuário

🏃 Sugestões de atividades físicas para um estilo de vida completo

🔐 Autenticação e persistência de dados via banco de dados

🧱 Estrutura do Projeto
csharp
Copiar
Editar
plano_alimentar_app
├── src
│   ├── App.tsx            # Componente principal
│   ├── index.tsx          # Ponto de entrada
│   ├── components/        # Componentes reutilizáveis
│   │   └── index.ts
│   ├── pages/             # Páginas do app
│   │   └── Home.tsx
│   ├── styles/            # Estilos (Tailwind)
│   │   └── tailwind.css
│   └── types/             # Tipagens e interfaces
│       └── index.ts
├── public/
│   └── index.html         # Template HTML
├── package.json           # Dependências e scripts
├── tailwind.config.js     # Configuração do Tailwind
├── postcss.config.js      # Configuração do PostCSS
├── tsconfig.json          # Configuração do TypeScript
└── README.md              # Documentação
🛠️ Tecnologias Utilizadas
Frontend
React

TypeScript

Vite

Tailwind CSS

Backend
Node.js

Express

MongoDB

Mongoose

📦 Instalação
Clone o repositório e instale as dependências:

bash
Copiar
Editar
git clone https://github.com/seu-usuario/nutrifacil.git
cd nutrifacil
npm install
▶️ Uso
Para iniciar o servidor de desenvolvimento:

bash
Copiar
Editar
npm start
Abra seu navegador e acesse:
📍 http://localhost:3000

✅ Resultados Alcançados
Interface web responsiva e amigável

Cálculos alimentares personalizados por perfil

Acompanhamento de ingestão calórica e hídrica

Sugestões de receitas e exercícios

Armazenamento persistente dos dados do usuário

Possibilidade de expansão com novas funcionalidades (ex: gráficos, histórico, gamificação)

💡 Melhorias Futuras
Histórico de alimentação e progresso

Visualização com gráficos e estatísticas

Suporte a múltiplos perfis

Integração com dispositivos de saúde

Notificações de lembrete de refeições

👥 Contribuição
Sinta-se à vontade para contribuir com melhorias e correções.
Para isso:

Faça um fork do repositório

Crie uma branch para sua funcionalidade (git checkout -b feature/nome-da-funcionalidade)

Faça um commit (git commit -m 'feat: nova funcionalidade')

Envie um pull request

⚖️ Licença
Este projeto está licenciado sob os termos da Licença MIT.
Consulte o arquivo LICENSE para mais detalhes.

👩‍💻 Desenvolvedores
Laura Oliveira Rodrigues – 422141258

Eduarda Alves Dutra – 42210335

Raphael Yuri Gomes da Silva – 422136008

