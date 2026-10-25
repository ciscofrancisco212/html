document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("form-estacionamento");
  const listaVeiculos = document.getElementById("lista-veiculos");
  const listaHistorico = document.getElementById("lista-historico");
  
  const btnSalvarHistorico = document.getElementById("btn-salvar-historico");
  const btnImprimirHistorico = document.getElementById("btn-imprimir-historico");
  const btnLimparHistorico = document.getElementById("btn-limpar-historico");

  // Carrega dados do localStorage
  let patio = JSON.parse(localStorage.getItem("patio")) || [];
  let historico = JSON.parse(localStorage.getItem("historico")) || [];

  function salvar() {
    localStorage.setItem("patio", JSON.stringify(patio));
    localStorage.setItem("historico", JSON.stringify(historico));
  }

  // --- FUNÇÃO PARA CALCULAR O TEMPO DE PERMANÊNCIA ---
  function calcularPermanencia(entradaISO, saidaISO) {
    const entrada = new Date(entradaISO);
    const saida = new Date(saidaISO);

    // Diferença total em milissegundos
    const diffMs = saida - entrada;

    // Converte para minutos e horas
    const totalMinutos = Math.floor(diffMs / (1000 * 60));
    const horas = Math.floor(totalMinutos / 60);
    const minutos = totalMinutos % 60;

    if (horas > 0) {
      return `${horas}h ${minutos}min`;
    }
    return `${minutos} min`;
  }

  function render() {
    listaVeiculos.innerHTML = "";
    patio.forEach((veiculo, index) => {
      // Exibe a data de entrada formatada para o usuário
      const entradaFormatada = new Date(veiculo.entrada).toLocaleString("pt-BR");

      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${veiculo.modelo}</td>
        <td>${veiculo.placa}</td>
        <td>${entradaFormatada}</td>
        <td>
          <button class="btn-saida" onclick="encerrar(${index})">Encerrar</button>
        </td>
      `;
      listaVeiculos.appendChild(row);
    });

    listaHistorico.innerHTML = "";
    historico.forEach((veiculo) => {
      const entradaFormatada = new Date(veiculo.entrada).toLocaleString("pt-BR");
      const saidaFormatada = new Date(veiculo.saida).toLocaleString("pt-BR");

      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${veiculo.modelo}</td>
        <td>${veiculo.placa}</td>
        <td>${entradaFormatada}</td>
        <td>${saidaFormatada}</td>
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

    // Armazenamos a data/hora em formato ISO para facilitar o cálculo depois
    const novoVeiculo = {
      placa: placa.toUpperCase(),
      modelo,
      entrada: new Date().toISOString()
    };

    patio.push(novoVeiculo);
    salvar();
    render();
    form.reset();
  });

  // --- ENCERRAR E CALCULAR A PERMANÊNCIA ---
  window.encerrar = function(index) {
    const veiculo = patio[index];
    const dataSaidaISO = new Date().toISOString();

    // Calcula a permanência com base nas datas exatas
    const tempoPermanencia = calcularPermanencia(veiculo.entrada, dataSaidaISO);

    const historicoItem = {
      ...veiculo,
      saida: dataSaidaISO,
      permanencia: tempoPermanencia
    };

    historico.push(historicoItem);
    patio.splice(index, 1);
    salvar();
    render();
  };

  // --- BOTÃO SALVAR (EXPORTAR CSV) ---
  btnSalvarHistorico.addEventListener("click", () => {
    if (historico.length === 0) {
      alert("Não há dados no histórico para salvar.");
      return;
    }

    let csvContent = "\uFEFFModelo;Placa;Entrada;Saida;Permanencia\n";

    historico.forEach((item) => {
      const entrada = new Date(item.entrada).toLocaleString("pt-BR");
      const saida = new Date(item.saida).toLocaleString("pt-BR");
      csvContent += `"${item.modelo}";"${item.placa}";"${entrada}";"${saida}";"${item.permanencia}"\n`;
    });

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `historico_estacionamento_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  });

  // --- BOTÃO IMPRIMIR ---
  btnImprimirHistorico.addEventListener("click", () => {
    if (historico.length === 0) {
      alert("Não há dados no histórico para imprimir.");
      return;
    }
    window.print();
  });

  // --- BOTÃO LIMPAR HISTÓRICO ---
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