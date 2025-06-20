# Testes de Funcionalidade – NutriFácil

---

## Funcionalidade: Cadastro de Novo Usuário

### Cenário: Novo usuário realiza cadastro com sucesso

```gherkin
Funcionalidade: Cadastro de usuário

  Cenário: Novo usuário realiza cadastro com sucesso
    Dado que o visitante acessa a página de cadastro
    Quando preenche nome, e-mail, senha e confirma a senha
    E clica no botão "Cadastrar"
    Então o sistema deve criar a conta e redirecionar para a tela de login
```

---

## Funcionalidade: Seleção de Dieta

### Cenário: Usuário escolhe dieta Mediterrânea

```gherkin
Funcionalidade: Seleção de Dieta

  Cenário: Usuário escolhe dieta Mediterrânea
    Dado que o usuário seleciona a dieta "Mediterrânea"
    E informa peso "70", altura "170", idade "30" e sexo "Feminino"
    Quando solicita o plano alimentar
    Então o sistema deve sugerir refeições com azeite, peixes e grãos integrais
```

### Cenário: Usuário escolhe dieta Low Carb

```gherkin
Funcionalidade: Seleção de Dieta

  Cenário: Usuário escolhe dieta Low Carb
    Dado que o usuário seleciona a dieta "Low Carb"
    E informa peso "70", altura "170", idade "30" e sexo "Feminino"
    Quando solicita o plano alimentar
    Então o sistema deve sugerir refeições com baixo teor de carboidratos, como ovos, carnes magras e vegetais verdes
```

---

## Funcionalidade: Cálculo de TMB

### Cenário: Cálculo correto da Taxa Metabólica Basal (TMB)

```gherkin
Funcionalidade: Cálculo de TMB

  Cenário: Cálculo correto da Taxa Metabólica Basal (TMB)
    Dado que o usuário preenche seus dados: peso "80", altura "180", idade "25" e sexo "Masculino"
    Quando o sistema realiza o cálculo da TMB
    Então o resultado deve corresponder à fórmula de Harris-Benedict para homens
```

---

## Funcionalidade: Seleção de Alimentos Preferidos

### Cenário: Selecionar alimentos preferidos

```gherkin
Funcionalidade: Seleção de alimentos preferidos

  Cenário: Selecionar alimentos preferidos
    Dado que o usuário está na tela de seleção de alimentos
    Quando escolhe "frango", "brócolis" e "arroz integral" como preferências
    Então o sistema deve considerar essas escolhas ao montar o plano alimentar
```

---

## Funcionalidade: Sugestão de Exercícios

### Cenário: Exibir sugestões de exercícios físicos

```gherkin
Funcionalidade: Sugestão de exercícios

  Cenário: Exibir sugestões de exercícios físicos
    Dado que o usuário concluiu o preenchimento do plano alimentar
    Quando acessa a aba "Atividades"
    Então o sistema deve exibir exercícios compatíveis com seu objetivo nutricional
```
# Casos de Teste – Funcionalidade NutriFácil

| EU IA  | Funcionalidade               | Pré-Condição                                    | Passos                                                                                      | Dados de entrada                                             | Resultado Esperado                                                                                   | Resultado Obtido | Estado | Observações |
|--------|-------------------------------|--------------------------------------------------|---------------------------------------------------------------------------------------------|--------------------------------------------------------------|--------------------------------------------------------------------------------------------------------|------------------|--------|-------------|
| FT-01  | Seleção de Dieta Mediterrânea | Usuário autenticado e na tela de seleção         | 1. Acessar tela de dieta<br>2. Selecionar "Mediterrânea"<br>3. Preencher Peso, Altura, etc<br>4. Clicar "Solicitar Plano Alimentar" | Dieta: Mediterrânea<br>Peso: 70<br>Altura: 170<br>Idade: 30<br>Sexo: Feminino | Exibir plano com refeições ricas em azeite, peixes e grãos integrais                                  |                  | ✅/❌   |             |
| FT-02  | Cálculo de TMB                | Dados pessoais informados                        | 1. Preencher Peso, Altura, Idade, Sexo<br>2. Clicar em “Calcular TMB”                      | Peso: 80<br>Altura: 180<br>Idade: 25<br>Sexo: Masculino       | Exibir TMB baseado na fórmula de Harris-Benedict                                                     |                  | ✅/❌   |             |
| FT-03  | Seleção de Alimentos Preferidos| Perfil alimentar preenchido                      | 1. Ir à aba “Preferências”<br>2. Selecionar 3 alimentos por categoria<br>3. Salvar          | Frango, Brócolis, Arroz integral                             | Sistema prioriza os alimentos selecionados no plano alimentar                                         |                  | ✅/❌   |             |
| FT-04  | Registro de Intolerâncias     | Usuário autenticado e na aba de restrições       | 1. Acessar aba “Intolerâncias”<br>2. Marcar “lactose”<br>3. Salvar                          | Intolerância: Lactose                                        | Sistema não inclui laticínios nas recomendações                                                      |                  | ✅/❌   |             |
| FT-05  | Sugestão de Exercícios        | Plano alimentar gerado                           | 1. Acessar aba “Atividades”<br>2. Visualizar sugestões                                      | -                                                            | Exibir exercícios compatíveis com os dados do usuário                                                 |                  | ✅/❌   |             |

## Critérios de Aceitação

- **Passou:** Resultado Obtido = Resultado Esperado
- **Falhou:** Resultado Obtido ≠ Resultado Esperado

# Registro de Bugs

| ID      | Caso de Teste Relacionado | Descrição do Problema                            | Severidade | Status     | Responsável | Link para issue no GitHub                                         |
|---------|----------------------------|--------------------------------------------------|------------|------------|-------------|--------------------------------------------------------------------|
| BUG-01  | FT-02                      | TMB calculado incorretamente para valores extremos| Alta       | Em aberto  | Raphael      | https://github.com/Raphael-yuri?tab=repositories               |
| BUG-02  | FT-04                      | Sistema não remove alimentos com lactose         | Média      | Em análise | Laura       | https://github.com/lauraoliveira-r?tab=repositories               |