import React, { useState } from "react";

const Cadastro: React.FC = () => {
    const [nome, setNome] = useState("");
    const [email, setEmail] = useState("");
    const [cpf, setCpf] = useState("");
    const [peso, setPeso] = useState("");
    const [altura, setAltura] = useState("");
    const [idade, setIdade] = useState("");
    const [genero, setGenero] = useState("");
    const [objetivo, setObjetivo] = useState("");
    const [tempoMeta, setTempoMeta] = useState("");
    const [tipoDieta, setTipoDieta] = useState("");
    const [preferencias, setPreferencias] = useState<string[]>([]);
    const [senha, setSenha] = useState("");

    const opcoesGenero = ["Masculino", "Feminino", "Outro"];
    const opcoesObjetivo = ["Emagrecer", "Ganhar Massa", "Manter Peso"];
    const opcoesTipoDieta = ["Low Carb", "Vegetariana", "Cetogênica", "Flexível"];
    const opcoesPreferencias = [
        "Sem lactose",
        "Sem glúten",
        "Sem açúcar",
        "Vegano",
        "Vegetariano",
    ];

    const handlePreferencias = (pref: string) => {
        setPreferencias((prev) =>
            prev.includes(pref)
                ? prev.filter((p) => p !== pref)
                : [...prev, pref]
        );
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const dados = {
            nome,
            email,
            cpf,
            peso: parseFloat(peso),
            altura: parseFloat(altura),
            idade: parseInt(idade),
            genero,
            objetivo,
            tempoMeta,
            tipoDieta,
            preferencias,
            planoAlimentar: "Plano será gerado futuramente",
            senha,
        };
        try {
            const response = await fetch('http://localhost:5000/api/cadastro', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(dados),
            });
            if (response.ok) {
                alert('Cadastro realizado com sucesso!');
            } else {
                alert('Erro ao cadastrar.');
            }
        } catch (error) {
            alert('Erro ao conectar com o servidor.');
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <form
                onSubmit={handleSubmit}
                className="bg-white p-8 rounded shadow-md w-full max-w-md"
            >
                <h2 className="text-2xl font-bold mb-6 text-center">Cadastro</h2>
                <div className="mb-3">
                    <label className="block mb-1">Nome</label>
                    <input type="text" className="w-full border rounded px-3 py-2" value={nome} onChange={e => setNome(e.target.value)} required />
                </div>
                <div className="mb-3">
                    <label className="block mb-1">E-mail</label>
                    <input type="email" className="w-full border rounded px-3 py-2" value={email} onChange={e => setEmail(e.target.value)} required />
                </div>
                <div className="mb-3">
                    <label className="block mb-1">CPF</label>
                    <input type="text" className="w-full border rounded px-3 py-2" value={cpf} onChange={e => setCpf(e.target.value)} required />
                </div>
                <div className="mb-3 flex gap-2">
                    <div className="flex-1">
                        <label className="block mb-1">Peso (kg)</label>
                        <input type="number" className="w-full border rounded px-3 py-2" value={peso} onChange={e => setPeso(e.target.value)} required />
                    </div>
                    <div className="flex-1">
                        <label className="block mb-1">Altura (cm)</label>
                        <input type="number" className="w-full border rounded px-3 py-2" value={altura} onChange={e => setAltura(e.target.value)} required />
                    </div>
                </div>
                <div className="mb-3">
                    <label className="block mb-1">Idade</label>
                    <input type="number" className="w-full border rounded px-3 py-2" value={idade} onChange={e => setIdade(e.target.value)} required />
                </div>
                <div className="mb-3">
                    <label className="block mb-1">Gênero</label>
                    <select className="w-full border rounded px-3 py-2" value={genero} onChange={e => setGenero(e.target.value)} required>
                        <option value="">Selecione</option>
                        {opcoesGenero.map((g) => (
                            <option key={g} value={g}>{g}</option>
                        ))}
                    </select>
                </div>
                <div className="mb-3">
                    <label className="block mb-1">Objetivo</label>
                    <select className="w-full border rounded px-3 py-2" value={objetivo} onChange={e => setObjetivo(e.target.value)} required>
                        <option value="">Selecione</option>
                        {opcoesObjetivo.map((o) => (
                            <option key={o} value={o}>{o}</option>
                        ))}
                    </select>
                </div>
                <div className="mb-3">
                    <label className="block mb-1">Tempo para meta (meses)</label>
                    <input type="text" className="w-full border rounded px-3 py-2" value={tempoMeta} onChange={e => setTempoMeta(e.target.value)} required />
                </div>
                <div className="mb-3">
                    <label className="block mb-1">Tipo de Dieta</label>
                    <select className="w-full border rounded px-3 py-2" value={tipoDieta} onChange={e => setTipoDieta(e.target.value)} required>
                        <option value="">Selecione</option>
                        {opcoesTipoDieta.map((t) => (
                            <option key={t} value={t}>{t}</option>
                        ))}
                    </select>
                </div>
                <div className="mb-3">
                    <label className="block mb-1">Preferências</label>
                    <div className="flex flex-wrap gap-2">
                        {opcoesPreferencias.map((pref) => (
                            <label key={pref} className="flex items-center gap-1">
                                <input
                                    type="checkbox"
                                    checked={preferencias.includes(pref)}
                                    onChange={() => handlePreferencias(pref)}
                                />
                                {pref}
                            </label>
                        ))}
                    </div>
                </div>
                <div className="mb-3">
                    <label className="block mb-1">Senha</label>
                    <input type="password" className="w-full border rounded px-3 py-2" value={senha} onChange={e => setSenha(e.target.value)} required />
                </div>
                <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition">
                    Cadastrar
                </button>
            </form>
        </div>
    );
};

export default Cadastro;