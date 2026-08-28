# 🎲 Ficha Interativa de GURPS 4ª Edição

Aplicação Web Interativa para preenchimento, cálculo automático, salvamento e exportação para PDF da Ficha de Personagem GURPS 4ª Edição (baseada nos modelos originais em Português).

---

## 🚀 Como Abrir e Usar

1. **Abrir no Navegador**:
   - Basta dar um duplo clique no arquivo `index.html` ou abrir no Google Chrome, Firefox, Edge, Safari ou navegador do celular/tablet.
   - Não requer instalação, Node.js ou internet! Funciona 100% offline.

2. **Funcionalidades Principais**:
   - **Cálculos Automáticos**: Ao alterar Força (ST), Destreza (DX), Inteligência (IQ) ou Vitalidade (HT), a ficha calcula automaticamente:
     - Pontos de Vida (PV), Percepção (PER), Vontade (VON), Fadiga (FAD).
     - Velocidade Básica `(HT+DX)/4`, Deslocamento Básico e Esquiva `(Vel Básica + 3)`.
     - Base de Carga `(ST × ST) / 10 kg` e limite de carga/levantamento.
     - Dano Golpe de Ponta (GDP) e Balanço (BAL) segundo a tabela oficial do GURPS.
     - Tabela de Fadiga, Carga e penalidades de Esquiva.
     - Resumo dos Pontos Totais (XP) e Custo/Peso total dos Equipamentos.
   - **Alternar Silhueta**: Escolha entre o modelo **Feminino** e **Masculino** ou faça upload da foto/avatar do personagem no botão `📷 Foto/Avatar`.
   - **Adicionar/Remover Linhas**: Botões `+ Adicionar` e `❌` nas tabelas de Perícias, Armas, Vantagens, Desvantagens e Equipamentos.

---

## 💾 Salvando e Compartilhando Fichas

- **Salvar Ficha (`.json`)**: Clique em `💾 Salvar (.json)`. O arquivo contendo todos os dados do personagem será baixado.
- **Carregar Ficha (`.json`)**: Clique em `📂 Carregar (.json)` para restaurar qualquer personagem salvo.
- **Exportar para PDF / Imprimir**:
  - Clique em `🖨️ Imprimir / Salvar PDF` (ou aperte `Ctrl + P`).
  - Na janela de impressão, escolha a opção **"Salvar como PDF"** (Save as PDF).
  - O documento é formatado automaticamente em **páginas A4 perfeitas**, ocultando os botões da barra superior.

---

## 📁 Estrutura de Arquivos

- `index.html`: Estrutura visual da ficha.
- `styles.css`: Estilização e regras de impressão A4 (`@media print`).
- `app.js`: Regras de cálculo do GURPS, importação/exportação e manipulação da página.
- `assets/`: Silhuetas feminina (`female_body.svg`) e masculina (`male_body.svg`).
