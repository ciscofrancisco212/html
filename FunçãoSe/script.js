// 1. Dados Iniciais dos 20 Alunos
const alunosIniciais = [
  { id: 1, nome: "Ana Silva", nota: 8.5 },
  { id: 2, nome: "Bruno Costa", nota: 6.0 },
  { id: 3, nome: "Carla Souza", nota: 7.0 },
  { id: 4, nome: "Daniel Oliveira", nota: 4.5 },
  { id: 5, nome: "Eduarda Lima", nota: 9.2 },
  { id: 6, nome: "Felipe Alves", nota: 5.8 },
  { id: 7, nome: "Gabriela Rocha", nota: 7.5 },
  { id: 8, nome: "Henrique Santos", nota: 3.0 },
  { id: 9, nome: "Isabela Martins", nota: 10.0 },
  { id: 10, nome: "João Pedro", nota: 6.9 },
  { id: 11, nome: "Lucas Pereira", nota: 7.8 },
  { id: 12, nome: "Mariana Dias", nota: 8.0 },
  { id: 13, nome: "Nicolas Ferreira", nota: 5.0 },
  { id: 14, nome: "Olivia Castro", nota: 9.0 },
  { id: 15, nome: "Paulo Ribeiro", nota: 6.5 },
  { id: 16, nome: "Rafaela Mendes", nota: 7.2 },
  { id: 17, nome: "Sofia Barbosa", nota: 4.0 },
  { id: 18, nome: "Thiago Gomes", nota: 8.7 },
  { id: 19, nome: "Vinicius Carvalho", nota: 6.8 },
  { id: 20, nome: "Yasmin Cardoso", nota: 7.1 }
];

let alunos = JSON.parse(localStorage.getItem("alunos_dados")) || alunosIniciais;
let emModoEdicao = false;

// Elementos do DOM
const tabelaCorpo = document.getElementById("tabela-corpo");
const btnEditar = document.getElementById("btn-editar");
const btnSalvar = document.getElementById("btn-salvar");
const btnImprimir = document.getElementById("btn-imprimir");
const mensagemStatus = document.getElementById("mensagem-status");

// Elementos dos contadores
const elQtdTotal = document.getElementById("qtd-total");
const elQtdAprovados = document.getElementById("qtd-aprovados");
const elQtdReprovados = document.getElementById("qtd-reprovados");

// 2. Função para contar e exibir a quantidade de aprovados e reprovados
function atualizarEstatisticas() {
  let aprovados = 0;
  let reprovados = 0;

  alunos.forEach(aluno => {
    // CONDICIONAL "SE" (if / else) para contagem
    if (aluno.nota >= 7.0) {
      aprovados++;
    } else {
      reprovados++;
    }
  });

  elQtdTotal.textContent = alunos.length;
  elQtdAprovados.textContent = aprovados;
  elQtdReprovados.textContent = reprovados;
}

// 3. Função principal para renderizar a tabela
function renderizarTabela() {
  tabelaCorpo.innerHTML = "";

  alunos.forEach((aluno, index) => {
    let situacao = "";
    let classeCss = "";

    // CONDICIONAL "SE" (if / else) para situação do aluno
    if (aluno.nota >= 7.0) {
      situacao = "Aprovado";
      classeCss = "aprovado";
    } else {
      situacao = "Reprovado";
      classeCss = "reprovado";
    }

    const tr = document.createElement("tr");
    tr.className = aluno.nota >= 7.0 ? "linha-aprovado" : "linha-reprovado";

    const celulaNota = emModoEdicao
      ? `<input type="number" class="input-nota" value="${aluno.nota}" min="0" max="10" step="0.1" data-index="${index}">`
      : aluno.nota.toFixed(1);

    tr.innerHTML = `
      <td>${index + 1}</td>
      <td>${aluno.nome}</td>
      <td>${celulaNota}</td>
      <td><span class="status ${classeCss}">${situacao}</span></td>
    `;

    tabelaCorpo.appendChild(tr);
  });

  // Atualiza também os cartões de estatísticas no topo
  atualizarEstatisticas();

  // Escuta alterações em tempo real durante a edição
  if (emModoEdicao) {
    const inputs = document.querySelectorAll(".input-nota");
    inputs.forEach(input => {
      input.addEventListener("input", (e) => {
        const idx = e.target.getAttribute("data-index");
        let novaNota = parseFloat(e.target.value);

        if (isNaN(novaNota)) novaNota = 0;
        if (novaNota > 10) novaNota = 10;
        if (novaNota < 0) novaNota = 0;

        alunos[idx].nota = novaNota;

        // Atualização visual imediata da linha
        const linha = e.target.closest("tr");
        const statusTd = linha.querySelector(".status");

        if (novaNota >= 7.0) {
          statusTd.textContent = "Aprovado";
          statusTd.className = "status aprovado";
          linha.className = "linha-aprovado";
        } else {
          statusTd.textContent = "Reprovado";
          statusTd.className = "status reprovado";
          linha.className = "linha-reprovado";
        }

        // Recalcula o total de aprovados em tempo real
        atualizarEstatisticas();
      });
    });
  }
}

// 4. Botão Modificar Notas
btnEditar.addEventListener("click", () => {
  emModoEdicao = !emModoEdicao;
  btnEditar.textContent = emModoEdicao ? "🔒 Concluir Edição" : "✏️ Modificar Notas";
  btnEditar.classList.toggle("btn-warning", !emModoEdicao);
  btnEditar.classList.toggle("btn-primary", emModoEdicao);
  renderizarTabela();
});

// 5. Botão Salvar
btnSalvar.addEventListener("click", () => {
  if (emModoEdicao) {
    emModoEdicao = false;
    btnEditar.textContent = "✏️ Modificar Notas";
    btnEditar.className = "btn btn-warning";
  }

  localStorage.setItem("alunos_dados", JSON.stringify(alunos));
  renderizarTabela();
  exibirMensagem("Notas e estatísticas salvas com sucesso!");
});

// 6. Botão Imprimir Aprovados
btnImprimir.addEventListener("click", () => {
  if (emModoEdicao) {
    emModoEdicao = false;
    btnEditar.textContent = "✏️ Modificar Notas";
    btnEditar.className = "btn btn-warning";
    renderizarTabela();
  }

  document.body.classList.add("modo-impressao");
  window.print();
  document.body.classList.remove("modo-impressao");
});

function exibirMensagem(texto) {
  mensagemStatus.textContent = texto;
  mensagemStatus.className = "mensagem sucesso";
  setTimeout(() => {
    mensagemStatus.className = "mensagem hidden";
  }, 3000);
}

// Inicialização
renderizarTabela();