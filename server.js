const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

// Conecte ao MongoDB (ajuste a string de conexão para o seu ambiente)
mongoose.connect("mongodb://localhost:27017/plano_alimentar", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Defina o schema do usuário
const usuarioSchema = new mongoose.Schema({
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

const Usuario = mongoose.model("Usuario", usuarioSchema);

app.post("/api/cadastro", async (req, res) => {
  const { cpf } = req.body;

  // Verifica se já existe usuário com o mesmo CPF
  const usuarioExistente = await Usuario.findOne({ cpf });
  if (usuarioExistente) {
    return res.status(400).json({ mensagem: "CPF já cadastrado" });
  }

  // Salva o novo usuário no MongoDB
  try {
    await Usuario.create(req.body);
    res.status(201).json({ mensagem: "Usuário cadastrado com sucesso" });
  } catch (err) {
    res.status(500).json({ mensagem: "Erro ao salvar no banco de dados" });
  }
});

app.post("/api/login", async (req, res) => {
  const { cpf, email, senha } = req.body;

  try {
    const usuario = await Usuario.findOne({
      $or: [
        { cpf: cpf || null },
        { email: email || null }
      ],
      senha
    });
    if (!usuario) {
      return res.status(401).json({ mensagem: "CPF/email ou senha inválidos" });
    }
    // Não envie a senha de volta!
    const { senha: _, ...usuarioSemSenha } = usuario.toObject();
    res.json(usuarioSemSenha);
  } catch (err) {
    res.status(500).json({ mensagem: "Erro ao conectar com o servidor" });
  }
});

app.post('/api/atualizar', async (req, res) => {
  const { email, cpf, ...novosDados } = req.body;
  await Usuario.updateOne(
    { $or: [{ email }, { cpf }] },
    { $set: novosDados }
  );
  res.json({ ok: true });
});

app.listen(5000, () => {
  console.log("Servidor rodando na porta 5000");
});
