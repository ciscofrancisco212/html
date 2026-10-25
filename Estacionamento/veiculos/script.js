const form = document.getElementById('form-estacionamento');
const listaVeiculos = document.getElementById('lista-veiculos');

// Carrega os veículos salvos ao abrir a página
document.addEventListener('DOMContentLoaded', exibirVeiculos);

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const placa = document.getElementById('placa').value.toUpperCase();
  const modelo = document.getElementById('modelo').value;
  const horaEntrada = new Date().toLocaleString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
    day: '2-digit',
    month: '2-digit'
  });

  const veiculo = { modelo, placa, horaEntrada };

  salvarVeiculo(veiculo);
  form.reset();
  exibirVeiculos();
});

function obterVeiculos() {
  return JSON.parse(localStorage.getItem('patio')) || [];
}

function salvarVeiculo(veiculo) {
  const patio = obterVeiculos();
  patio.push(veiculo);
  localStorage.setItem('patio', JSON.stringify(patio));
}

function removerVeiculo(placa) {
  let patio = obterVeiculos();
  patio = patio.filter(veiculo => veiculo.placa !== placa);
  localStorage.setItem('patio', JSON.stringify(patio));
  exibirVeiculos();
}

function exibirVeiculos() {
  const patio = obterVeiculos();
  listaVeiculos.innerHTML = '';

  patio.forEach((veiculo) => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${veiculo.modelo}</td>
      <td>${veiculo.placa}</td>
      <td>${veiculo.horaEntrada}</td>
      <td>
        <button class="btn-saida" onclick="removerVeiculo('${veiculo.placa}')">Saída</button>
      </td>
    `;
    listaVeiculos.appendChild(tr);
  });
}