const form = document.getElementById('form-estacionamento');
const listaVeiculos = document.getElementById('lista-veiculos');
const listaHistorico = document.getElementById('lista-historico');

// Carrega os dados salvos ao abrir a página
document.addEventListener('DOMContentLoaded', () => {
  exibirVeiculos();
  exibirHistorico();
});

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const placa = document.getElementById('placa').value.toUpperCase();
  const modelo = document.getElementById('modelo').value;
  const entradaISO = new Date().toISOString(); // Salva em formato legível por data

  const veiculo = { modelo, placa, entradaISO };

  salvarVeiculo(veiculo);
  form.reset();
  exibirVeiculos();
});

// --- Funções do LocalStorage ---

function obterPatio() {
  return JSON.parse(localStorage.getItem('patio')) || [];
}

function obterHistorico() {
  return JSON.parse(localStorage.getItem('historico')) || [];
}

function salvarVeiculo(veiculo) {
  const patio = obterPatio();
  patio.push(veiculo);
  localStorage.setItem('patio', JSON.stringify(patio));
}

function darSaida(placa) {
  let patio = obterPatio();
  const veiculoSaindo = patio.find(v => v.placa === placa);

  if (veiculoSaindo) {
    // Registra horário de saída
    const saidaISO = new Date().toISOString();
    
    // Calcula o tempo de permanência em minutos/horas
    const tempoPermanencia = calcularTempo(veiculoSaindo.entradaISO, saidaISO);

    const registroHistorico = {
      ...veiculoSaindo,
      saidaISO,
      tempoPermanencia
    };

    // Salva no histórico
    const historico = obterHistorico();
    historico.unshift(registroHistorico); // Adiciona no início da lista
    localStorage.setItem('historico', JSON.stringify(historico));

    // Remove do pátio
    patio = patio.filter(v => v.placa !== placa);
    localStorage.setItem('patio', JSON.stringify(patio));

    exibirVeiculos();
    exibirHistorico();
  }
}

// --- Funções de Exibição ---

function formatarData(dataISO) {
  const data = new Date(dataISO);
  return data.toLocaleString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
    day: '2-digit',
    month: '2-digit'
  });
}

function calcularTempo(entrada, saida) {
  const inicio = new Date(entrada);
  const fim = new Date(saida);
  const diferencaMs = fim - inicio;
  
  const minutosTotais = Math.floor(diferencaMs / (1000 * 60));
  const horas = Math.floor(minutosTotais / 60);
  const minutos = minutosTotais % 60;

  if (horas > 0) {
    return `${horas}h ${minutos}m`;
  }
  return `${minutos}m`;
}

function exibirVeiculos() {
  const patio = obterPatio();
  listaVeiculos.innerHTML = '';

  patio.forEach((veiculo) => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${veiculo.modelo}</td>
      <td>${veiculo.placa}</td>
      <td>${formatarData(veiculo.entradaISO)}</td>
      <td>
        <button class="btn-saida" onclick="darSaida('${veiculo.placa}')">Saída</button>
      </td>
    `;
    listaVeiculos.appendChild(tr);
  });
}

function exibirHistorico() {
  const historico = obterHistorico();
  listaHistorico.innerHTML = '';

  historico.forEach((veiculo) => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${veiculo.modelo}</td>
      <td>${veiculo.placa}</td>
      <td>${formatarData(veiculo.entradaISO)}</td>
      <td>${formatarData(veiculo.saidaISO)}</td>
      <td>${veiculo.tempoPermanencia}</td>
    `;
    listaHistorico.appendChild(tr);
  });
}