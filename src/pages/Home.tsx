import React, { useState } from "react";

interface HomeProps {
    onCadastrar: () => void;
}

const Home: React.FC<HomeProps> = ({ onCadastrar }) => {
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        // Lógica de autenticação aqui
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 via-white to-purple-100 p-4">
            <div className="relative bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl p-8 w-full max-w-md transition-all duration-300 hover:shadow-2xl">
                <h1 className="text-3xl font-extrabold text-center text-gray-900 mb-2">
                    Plano Alimentar App
                </h1>
                <p className="text-center text-gray-600 mb-8">
                    Gerencie seu plano alimentar com facilidade e praticidade
                </p>
                <div className="space-y-6">
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
                    <button
                        type="button"
                        onClick={handleLogin}
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
                </div>
            </div>
        </div>
    );
};

export default Home;