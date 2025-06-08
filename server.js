const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// Conexão com o MongoDB local
mongoose.connect("mongodb://localhost:27017/plano_alimentar", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Schema do usuário
const UsuarioSchema = new mongoose.Schema({
  nome: String,
  email: String,
  cpf: String,
  peso: Number,
  altura: Number,
  idade: Number,
  genero: String,
  objetivo: String,
  tempoMeta: String,
  tipoDieta: String,
  preferencias: [String],
  planoAlimentar: String,
  senha: String,
});

const Usuario = mongoose.model("Usuario", UsuarioSchema);

// Rota para cadastro
app.post("/api/cadastro", async (req, res) => {
  try {
    const usuario = new Usuario(req.body);
    await usuario.save();
    res.status(201).json({ message: "Usuário cadastrado com sucesso!" });
  } catch (error) {
    res.status(500).json({ error: "Erro ao cadastrar usuário." });
  }
});

app.listen(5000, () => {
  console.log("Servidor rodando na porta 5000");
});
