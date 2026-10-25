document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("form-estacionamento");
  const listaVeiculos = document.getElementById("lista-veiculos");
  const listaHistorico = document.getElementById("lista-historico");
  const btnLimparHistorico = document.getElementById("btn-limpar-historico");

  // Carrega dados do localStorage (se existirem)
  let patio = JSON.parse(localStorage.getItem("patio")) || [];
  let historico = JSON.parse(localStorage.getItem("historico")) || [];

  function salvar() {
    localStorage.setItem("patio", JSON.stringify(patio));
    localStorage.setItem("historico", JSON.stringify(historico));
  }

  function render() {
    listaVeiculos.innerHTML = "";
    patio.forEach((veiculo, index) => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${veiculo.modelo}</td>
        <td>${veiculo.placa}</td>
        <td>${veiculo.entrada}</td>
        <td>
          <button class="btn-saida" onclick="encerrar(${index})">Encerrar</button>
        </td>
      `;
      listaVeiculos.appendChild(row);
    });

    listaHistorico.innerHTML = "";
    historico.forEach((veiculo) => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${veiculo.modelo}</td>
        <td>${veiculo.placa}</td>
        <td>${veiculo.entrada}</td>
        <td>${veiculo.saida}</td>
        <td>${veiculo.permanencia}</td>
      `;
      listaHistorico.appendChild(row);
    });
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const placa = document.getElementById("placa").value;
    const modelo = document.getElementById("modelo").value;

    if (!placa || !modelo) return;

    const novoVeiculo = {
      placa: placa.toUpperCase(),
      modelo,
      entrada: new Date().toLocaleString("pt-BR")
    };

    patio.push(novoVeiculo);
    salvar();
    render();
    form.reset();
  });

  window.encerrar = function(index) {
    const veiculo = patio[index];
    const entrada = new Date(veiculo.entrada);
    const saida = new Date();
    
    // Cálculo do tempo de permanência em minutos
    const diffMs = Math.abs(saida - entrada);
    const diffMinutos = Math.floor(diffMs / (1000 * 60));

    const historicoItem = {
      ...veiculo,
      saida: saida.toLocaleString("pt-BR"),
      permanencia: `${diffMinutos} min`
    };

    historico.push(historicoItem);
    patio.splice(index, 1);
    salvar();
    render();
  };

  // --- LÓGICA DO BOTÃO LIMPAR HISTÓRICO ---
  btnLimparHistorico.addEventListener("click", () => {
    if (historico.length === 0) {
      alert("O histórico já está vazio.");
      return;
    }

    if (confirm("Tem certeza de que deseja apagar todo o histórico de saídas?")) {
      historico = [];
      salvar();
      render();
    }
  });

  render();
});