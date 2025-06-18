# 🥗 NutriFácil

![License](https://img.shields.io/badge/license-MIT-green)
![Tech](https://img.shields.io/badge/feito%20com-React%20%7C%20Node.js-blue)

**NutriFácil** é uma aplicação web criada para facilitar o planejamento alimentar com base no perfil do usuário. O app oferece planos alimentares personalizados, cálculo de metas nutricionais e sugestões de receitas, promovendo hábitos saudáveis de forma prática.

---

## 🧠 Funcionalidades
> Cadastro de perfil alimentar

> Geração automática de plano nutricional

> Cálculo de TMB, IMC e ingestão diária de água

> Sugestões de alimentos e receitas

> Acompanhamento de ingestão calórica e hídrica

> Recomendação de exercícios físicos

---

## 📁 Estrutura
```md
plano_alimentar_app/
├── frontend/
│   ├── src/
│   │   ├── App.tsx
│   │   ├── index.tsx
│   │   ├── components/
│   │   ├── pages/
│   │   ├── styles/
│   │   └── types/
│   ├── public/
│   ├── package.json
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   └── tsconfig.json
├── backend/
│   ├── server.js / app.js
│   ├── routes/
│   ├── models/
│   ├── controllers/
│   └── config/
└── README.md
```
---

## 🚀 Instalação e Uso

### 🔧 Pré-requisitos

- Node.js
- MongoDB

### ▶️ Rodar o Frontend

```bash
cd frontend
npm install
npm run dev
```
### ▶️ Rodar o Backend

```bash
cd backend
npm install
# .env deve conter MONGODB_URI e PORT
npm run dev
```
Acesse a aplicação em: [http://localhost:3000](http://localhost:3000)

## 
---
## 🛠️ Tecnologias

### Frontend

- React  
- TypeScript  
- Vite  
- Tailwind CSS

### Backend

- Node.js  
- Express  
- MongoDB  
- Mongoose
---
## 👥 Equipe

| Nome                        | RA        |
|-----------------------------|-----------|
| Laura Oliveira Rodrigues    | 422141258 |
| Eduarda Alves Dutra         | 42210335  |
| Raphael Yuri Gomes da Silva | 422136008 |
---
## ⚖️ Licença

Este projeto está licenciado sob a [Licença MIT](LICENSE).
