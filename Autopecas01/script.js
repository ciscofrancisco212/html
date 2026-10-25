// Banco de dados simulado (10 peças por marca com preços)
const bancoDeDados = {
  Volkswagen: [
    { id: 1, nome: "Filtro de Óleo Gol/Fox", preco: 35.00 },
    { id: 2, nome: "Pastilha de Freio Polo", preco: 120.00 },
    { id: 3, nome: "Vela de Ignição Golf", preco: 95.00 },
    { id: 4, nome: "Amortecedor Dianteiro Virtus", preco: 380.00 },
    { id: 5, nome: "Correia Dentada Saveiro", preco: 85.00 },
    { id: 6, nome: "Bomba de Água Jetta", preco: 250.00 },
    { id: 7, nome: "Disco de Freio Nivus", preco: 210.00 },
    { id: 8, nome: "Filtro de Ar T-Cross", preco: 45.00 },
    { id: 9, nome: "Junta do Cabeçote Voyage", preco: 110.00 },
    { id: 10, nome: "Palheta do Limpador Up!", preco: 40.00 }
  ],
  Fiat: [
    { id: 11, nome: "Filtro de Combustível Uno/Palio", preco: 28.00 },
    { id: 12, nome: "Kit de Embreagem Argo", preco: 450.00 },
    { id: 13, nome: "Farol Dianteiro Strada", preco: 320.00 },
    { id: 14, nome: "Pastilha de Freio Toro", preco: 160.00 },
    { id: 15, nome: "Radiador Mobi", preco: 290.00 },
    { id: 16, nome: "Sensor de Ré Cronos", preco: 75.00 },
    { id: 17, nome: "Amortecedor Traseiro Fiorino", preco: 230.00 },
    { id: 18, nome: "Filtro de Ar Condicionado Pulse", preco: 50.00 },
    { id: 19, nome: "Bateria 60A Siena", preco: 390.00 },
    { id: 20, nome: "Cabo de Vela Punto", preco: 90.00 }
  ],
  Chevrolet: [
    { id: 21, nome: "Óleo de Motor 5W30 Onix", preco: 45.00 },
    { id: 22, nome: "Disco de Freio Corsa/Celta", preco: 140.00 },
    { id: 23, nome: "Amortecedor Dianteiro Tracker", preco: 420.00 },
    { id: 24, nome: "Bomba de Combustível Cruze", preco: 310.00 },
    { id: 25, nome: "Filtro de Ar Spin", preco: 38.00 },
    { id: 26, nome: "Kit Correia Dentada Prisma", preco: 180.00 },
    { id: 27, nome: "Termostato S10", preco: 130.00 },
    { id: 28, nome: "Pastilha de Freio Astra", preco: 115.00 },
    { id: 29, nome: "Vela de Ignição Montana", preco: 80.00 },
    { id: 30, nome: "Retrovisor Lado Direito Cobalt", preco: 190.00 }
  ],
  Renault: [
    { id: 31, nome: "Filtro de Óleo Kwid/Sandero", preco: 32.00 },
    { id: 32, nome: "Kit Correia de Acessórios Logan", preco: 145.00 },
    { id: 33, nome: "Pastilha de Freio Duster", preco: 135.00 },
    { id: 34, nome: "Amortecedor Traseiro Captur", preco: 310.00 },
    { id: 35, nome: "Bomba de Água Clio", preco: 160.00 },
    { id: 36, nome: "Disco de Freio Master", preco: 280.00 },
    { id: 37, nome: "Vela de Ignição Oroch", preco: 105.00 },
    { id: 38, nome: "Filtro de Cabine Megane", preco: 42.00 },
    { id: 39, nome: "Bandeja de Suspensão Fluence", preco: 220.00 },
    { id: 40, nome: "Farol de Milha Scenic", preco: 115.00 }
  ],
  Ford: [
    { id: 41, nome: "Filtro de Óleo Ka/Fiesta", preco: 30.00 },
    { id: 42, nome: "Jogo de Velas EcoSport", preco: 120.00 },
    { id: 43, nome: "Pastilha de Freio Focus", preco: 150.00 },
    { id: 44, nome: "Amortecedor Dianteiro Ranger", preco: 510.00 },
    { id: 45, nome: "Disco de Freio Fusion", preco: 340.00 },
    { id: 46, nome: "Bomba de Combustível Courier", preco: 210.00 },
    { id: 47, nome: "Filtro de Ar Edge", preco: 65.00 },
    { id: 48, nome: "Junta da Tampa de Válvulas Escort", preco: 55.00 },
    { id: 49, nome: "Kit de Embreagem Territory", preco: 680.00 },
    { id: 50, nome: "Lampa de Farol H4 Transit", preco: 25.00 }
  ]
};

// Referências dos Elementos do DOM
const selectMarca = document.getElementById('marca');
const selectPeca = document.getElementById('peca');
const inputPreco = document.getElementById('preco-unitario');
const inputQuantidade = document.getElementById('quantidade');
const formVenda = document.getElementById('form-venda');
const tabelaVendasBody = document.querySelector('#tabela-vendas tbody');
const spanTotalVendas = document.getElementById('total-vendas');

// Estado da Aplicação
let vendasRealizadas = [];
let contadorVendas = 1;

// Evento: Atualizar Peças ao Selecionar uma Marca
selectMarca.addEventListener('change', function () {
  const marcaSelecionada = this.value;

  selectPeca.innerHTML = '<option value="">-- Selecione a Peça --</option>';
  inputPreco.value = 'R$ 0,00';

  if (marcaSelecionada && bancoDeDados[marcaSelecionada]) {
    selectPeca.disabled = false;

    bancoDeDados[marcaSelecionada].forEach(item => {
      const option = document.createElement('option');
      option.value = item.id;
      option.textContent = item.nome;
      option.dataset.preco = item.preco;
      selectPeca.appendChild(option);
    });
  } else {
    selectPeca.disabled = true;
    selectPeca.innerHTML = '<option value="">-- Selecione a Marca Primeiro --</option>';
  }
});

// Evento: Atualizar Preço ao Selecionar uma Peça
selectPeca.addEventListener('change', function () {
  const optionSelecionada = this.options[this.selectedIndex];
  
  if (optionSelecionada.value) {
    const preco = parseFloat(optionSelecionada.dataset.preco);
    inputPreco.value = formatarMoeda(preco);
  } else {
    inputPreco.value = 'R$ 0,00';
  }
});

// Evento: Enviar Formulário e Registrar a Venda
formVenda.addEventListener('submit', function (e) {
  e.preventDefault();

  const marca = selectMarca.value;
  const pecaOption = selectPeca.options[selectPeca.selectedIndex];
  const pecaNome = pecaOption.textContent;
  const precoUnitario = parseFloat(pecaOption.dataset.preco);
  const quantidade = parseInt(inputQuantidade.value);

  const valorTotal = precoUnitario * quantidade;

  // Captura e formatação da Data e Hora no momento exato do clique
  const agora = new Date();
  const dataHoraFormatada = agora.toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });

  // Criar objeto da venda com o campo dataHora
  const novaVenda = {
    id: contadorVendas++,
    dataHora: dataHoraFormatada,
    marca: marca,
    peca: pecaNome,
    quantidade: quantidade,
    precoUnitario: precoUnitario,
    total: valorTotal
  };

  // Salvar no histórico
  vendasRealizadas.push(novaVenda);

  // Atualizar Interface
  adicionarLinhaTabela(novaVenda);
  atualizarTotalGeral();

  // Resetar Formulário
  formVenda.reset();
  selectPeca.disabled = true;
  selectPeca.innerHTML = '<option value="">-- Selecione a Marca Primeiro --</option>';
  inputPreco.value = 'R$ 0,00';
});

// Função para Adicionar Linha na Tabela HTML
function adicionarLinhaTabela(venda) {
  const tr = document.createElement('tr');

  tr.innerHTML = `
    <td>${venda.id}</td>
    <td>${venda.dataHora}</td>
    <td>${venda.marca}</td>
    <td>${venda.peca}</td>
    <td>${venda.quantidade}</td>
    <td>${formatarMoeda(venda.precoUnitario)}</td>
    <td><strong>${formatarMoeda(venda.total)}</strong></td>
  `;

  tabelaVendasBody.appendChild(tr);
}

// Função para Atualizar a Soma Total das Vendas
function atualizarTotalGeral() {
  const totalGeral = vendasRealizadas.reduce((acc, item) => acc + item.total, 0);
  spanTotalVendas.textContent = formatarMoeda(totalGeral);
}

// Função Auxiliar para Formatar Números para Moeda (BRL)
function formatarMoeda(valor) {
  return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}