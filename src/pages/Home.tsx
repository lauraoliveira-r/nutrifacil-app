import React, { useState } from "react";

interface HomeProps {
    onCadastrar: () => void;
    onLoginSucesso: (usuario: any) => void;
}

const Home: React.FC<HomeProps> = ({ onCadastrar, onLoginSucesso }) => {
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");
    const [erro, setErro] = useState("");

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setErro("");
        try {
            const response = await fetch("http://localhost:5000/api/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, senha }), // ou { cpf, senha } se login for por CPF
            });
            if (response.ok) {
                const data = await response.json();
                onLoginSucesso(data);
            } else {
                const data = await response.json();
                setErro(data.mensagem || "Erro ao fazer login.");
            }
        } catch {
            setErro("Erro ao conectar com o servidor.");
        }
    };

    const handleSalvarAjuste = async (novosDados: any) => {
        const planoAlimentar = gerarPlanoAlimentar(novosDados);

        // Envie para o backend (ajuste a URL e os campos conforme seu backend)
        await fetch("http://localhost:5000/api/atualizar", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ...novosDados, planoAlimentar }),
        });

        setUsuario({ ...novosDados, planoAlimentar });
        setPagina("dashboard");
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 via-white to-purple-100 p-4">
            <div className="relative bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl p-8 w-full max-w-md transition-all duration-300 hover:shadow-2xl">
                <img
                    src="/2.png"
                    alt="Plano Alimentar App"
                    className="mx-auto mb-2 w-66 h-74 object-contain"
                />
                {/* Remova ou comente o <h1> antigo */}
                {/* <h1 className="text-3xl font-extrabold text-center text-gray-900 mb-2">
                    Plano Alimentar App
                </h1> */}
                <p className="text-center text-gray-600 mb-8">
                    Gerencie seu plano alimentar com facilidade e praticidade
                </p>
                <form className="space-y-6" onSubmit={handleLogin}>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            E-mail
                        </label>
                        <input
                            type="email"
                            className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            autoComplete="email"
                            placeholder="Digite seu e-mail"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Senha
                        </label>
                        <input
                            type="password"
                            className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200"
                            value={senha}
                            onChange={(e) => setSenha(e.target.value)}
                            required
                            autoComplete="current-password"
                            placeholder="Digite sua senha"
                        />
                    </div>
                    {erro && (
                        <div className="text-red-600 text-center">{erro}</div>
                    )}
                    <button
                        type="submit"
                        className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition duration-200"
                    >
                        Entrar
                    </button>
                    <button
                        type="button"
                        className="w-full text-indigo-600 font-medium hover:text-indigo-800 transition duration-200"
                        onClick={onCadastrar}
                    >
                        Criar uma conta
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Home;