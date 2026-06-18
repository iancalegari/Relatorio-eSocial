# 🧠 SKILL — RelatorioTestesTarefasPDF (PRODUÇÃO FINAL)

## 📌 OBJETIVO

Gerar automaticamente um PDF estilo dashboard corporativo profissional baseado em testes e tarefas realizadas.

Inclui:
- KPIs em cards
- Tabela de execução
- Nota automática
- Classificação de desempenho
- Feedback inteligente (IA)
- Layout corporativo estilo sistema real

---

## 📥 INPUT

{
  "extra_tasks": 0,
  "tasks": [
    {
      "id": "#0001",
      "task": "Login API",
      "employee": "João Silva",
      "date": "15/06/2026",
      "status": "Aprovado",
      "note": "OK"
    }
  ]
}

---

## 👤 TESTADOR (DINÂMICO DO CHAT)

- Nome do testador vem do contexto da conversa
- Se não informado:
  → "Testador não informado"

---

## REGRAS DE EMOJI
- Como foi utilizado emojis do discord, tudo que esta entre :: NÃO PODE SER UTILIZADO

Exemplo

:bounty: , 
:setinha~1: ,
:2_~2: ,
:1_~5: ,
:3_:,
:CHECK_CHECK_2: , 
:CHECK_CROSS_2: ,
:progresso: ,
:cacabugs: ,


Além disso, ignore tudo que for ## e ** Não necessita ser exibido no arquivo PDF
---

## 📅 DATA DE EMISSÃO

- Automática (DD/MM/AAAA HH:MM:SS)

---

## 📅 PERÍODO DO RELATÓRIO

- Início: 28/04/2026  
- Fim: data atual da geração

---

## 🧮 CÁLCULO DA NOTA

nota = (aprovados * 10) + (reprovados * 2) + (extra_tasks * 5)

---

## 🎯 CLASSIFICAÇÃO

- 0–30 → Baixo desempenho
- 31–70 → Bom desempenho
- 71–100 → Muito bom desempenho
- 100+ → Excelente desempenho

---

# 🧠 INTELIGÊNCIA ARTIFICIAL (OBRIGATÓRIO)

A IA deve obrigatoriamente executar:

## 1. CÁLCULO DA NOTA FINAL

nota = (aprovados * 10) + (reprovados * 2) + (extra_tasks * 5)

---

## 🧠 FEEDBACK AUTOMÁTICO (SEM IA) — VERSÃO SIMPLES

🔴 FAIXA: 0–30

Avaliação:
O desempenho está abaixo do esperado para o nível de execução das tarefas.

Recomendações:
Revisar os conceitos básicos e realizar novas execuções com mais atenção aos detalhes.

🟠 FAIXA: 31–70

Avaliação:
O desempenho está dentro do esperado, mas ainda apresenta inconsistências em algumas execuções.

Recomendações:
Atenção maior na validação das tarefas antes de finalizá-las e prática contínua para evolução.

🟡 FAIXA: 71–100

Avaliação:
O desempenho está bom, com boa consistência na execução das tarefas.

Recomendações:
Manter o padrão atual e continuar praticando para aprimorar ainda mais a precisão.

🟢 FAIXA: 100+

Avaliação:
O desempenho está excelente, com alto nível de consistência e qualidade.

Recomendações:
Continuar mantendo o padrão atual e explorar tarefas mais avançadas para evolução contínua.

score <= 30 → bloco vermelho
31–70 → bloco laranja
71–100 → bloco amarelo
100+ → bloco verde

---

## 🔴 0–30 — BAIXO DESEMPENHO
Indica dificuldades técnicas e necessidade de reforço em fundamentos.

---

## 🟠 31–70 — DESEMPENHO MÉDIO
Indica inconsistências e necessidade de maior atenção aos detalhes.

---

## 🟡 71–100 — BOM DESEMPENHO
Indica bom domínio com ajustes finos necessários.

---

## 🟢 100+ — EXCELENTE DESEMPENHO
Indica alto nível técnico, consistência e recomendação de desafios avançados.

---

# 📊 CARDS KPI

- Total de testes
- Aprovados
- Reprovados
- Taxa de aprovação
- Cards criados: 5

---

# 👤 BLOCO DO TESTADOR

- Nome
- Nota final
- Classificação
- Feedback da IA

---

# 📋 TABELA DE RESULTADOS

| ID | Tarefa | Funcionário | Data | Status |

---

# 🎨 DETALHAMENTO POR STATUS

## 🔴 REPROVADOS
- Motivo da falha

## 🟢 APROVADOS
- Observações positivas

---

# 🧾 HEADER DO PDF

- Nome do Testador
- Nota final
- Classificação
- Data de emissão
- Período do relatório

---

# 📦 ESTRUTURA FINAL DO PDF

[HEADER]
[CARDS KPI]
[NOTA + FEEDBACK IA]
[RESUMO GERAL]
[DETALHAMENTO POR STATUS]

---

# 🚀 RESULTADO FINAL

A skill deve gerar automaticamente:

✔ PDF estilo dashboard corporativo  
✔ KPIs automáticos  
✔ Nota inteligente  
✔ Feedback gerado por IA  
✔ Classificação automática  
✔ Relatório detalhado por status  
✔ Layout profissional baseado em sistema real
