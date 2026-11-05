
// ========================================
// AUTOPEÇAS EXPRESS - CONTROLE DE VENDAS
// ========================================

const pecasPorMarca = {
  "Volkswagen": [
    { nome: "Filtro de Óleo", preco: 35.00 },
    { nome: "Pastilha de Freio", preco: 120.00 },
    { nome: "Vela de Ignição", preco: 28.00 },
    { nome: "Correia Dentada", preco: 95.00 },
    { nome: "Filtro de Ar", preco: 42.00 }
  ],

  "Fiat": [
    { nome: "Filtro de Óleo", preco: 32.00 },
    { nome: "Pastilha de Freio", preco: 110.00 },
    { nome: "Vela de Ignição", preco: 25.00 },
    { nome: "Correia Dentada", preco: 88.00 },
    { nome: "Filtro de Ar", preco: 38.00 }
  ],

  "Chevrolet": [
    { nome: "Filtro de Óleo", preco: 34.00 },
    { nome: "Pastilha de Freio", preco: 115.00 },
    { nome: "Vela de Ignição", preco: 27.00 },
    { nome: "Correia Dentada", preco: 92.00 },
    { nome: "Filtro de Ar", preco: 40.00 }
  ],

  "Renault": [
    { nome: "Filtro de Óleo", preco: 36.00 },
    { nome: "Pastilha de Freio", preco: 125.00 },
    { nome: "Vela de Ignição", preco: 29.00 },
    { nome: "Correia Dentada", preco: 98.00 },
    { nome: "Filtro de Ar", preco: 43.00 }
  ],

  "Ford": [
    { nome: "Filtro de Óleo", preco: 33.00 },
    { nome: "Pastilha de Freio", preco: 118.00 },
    { nome: "Vela de Ignição", preco: 26.00 },
    { nome: "Correia Dentada", preco: 90.00 },
    { nome: "Filtro de Ar", preco: 39.00 }
  ]
};

const form = document.getElementById("form-venda");
const marca = document.getElementById("marca");
const peca = document.getElementById("peca");
const precoUnitario = document.getElementById("preco-unitario");
const quantidade = document.getElementById("quantidade");
const pagamento = document.getElementById("forma-pagamento");

const corpoVendas = document.getElementById("corpo-vendas");
const totalVendas = document.getElementById("total-vendas");
const quantidadeVendas = document.getElementById("quantidade-vendas");
const mensagem = document.getElementById("mensagem");

const STORAGE_KEY = "autopecas_express_vendas_v1";

let vendas = [];
let proximoId = 1;
let alteracoesPendentes = false;

// Formata valores em reais.
function moeda(valor) {
  return Number(valor).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL"
  });
}

// Formata a data e a hora.
function dataHoraAtual() {
  return new Date().toLocaleString("pt-BR");
}

// Exibe mensagens para o usuário.
function mostrarMensagem(texto) {
  mensagem.textContent = texto;
}

// Carrega as peças de acordo com a marca.
marca.addEventListener("change", function () {
  peca.innerHTML = "";

  const opcaoInicial = document.createElement("option");
  opcaoInicial.value = "";
  opcaoInicial.textContent = "Selecione uma peça";
  peca.appendChild(opcaoInicial);

  const lista = pecasPorMarca[marca.value] || [];

  lista.forEach(function (item) {
    const opcao = document.createElement("option");
    opcao.value = item.nome;
    opcao.textContent = `${item.nome} - ${moeda(item.preco)}`;
    peca.appendChild(opcao);
  });

  peca.disabled = lista.length === 0;
  precoUnitario.value = moeda(0);
});

// Atualiza o preço da peça escolhida.
peca.addEventListener("change", function () {
  const lista = pecasPorMarca[marca.value] || [];
  const item = lista.find(function (produto) {
    return produto.nome === peca.value;
  });

  precoUnitario.value = moeda(item ? item.preco : 0);
});

// Adiciona uma venda à lista em memória.
form.addEventListener("submit", function (evento) {
  evento.preventDefault();

  const lista = pecasPorMarca[marca.value] || [];
  const item = lista.find(function (produto) {
    return produto.nome === peca.value;
  });

  const qtd = Number(quantidade.value);

  if (!item) {
    mostrarMensagem("Selecione uma marca e uma peça válida.");
    return;
  }

  if (!Number.isSafeInteger(qtd) || qtd < 1) {
    mostrarMensagem("Informe uma quantidade inteira maior que zero.");
    quantidade.focus();
    return;
  }

  if (!pagamento.value) {
    mostrarMensagem("Selecione a forma de pagamento.");
    pagamento.focus();
    return;
  }

  const venda = {
    id: proximoId++,
    data: dataHoraAtual(),
    marca: marca.value,
    peca: item.nome,
    quantidade: qtd,
    pagamento: pagamento.value,
    precoUnitario: item.preco,
    total: Number((item.preco * qtd).toFixed(2))
  };

  vendas.push(venda);
  alteracoesPendentes = true;

  renderizarVendas();

  mostrarMensagem(
    "Venda adicionada! Clique em Salvar Vendas para gravá-la."
  );

  // Limpa os campos para uma nova venda.
  form.reset();
  peca.innerHTML =
    '<option value="">Selecione a marca primeiro</option>';
  peca.disabled = true;
  precoUnitario.value = moeda(0);
  quantidade.value = 1;
  marca.focus();
});

// Mostra todas as vendas e calcula o total.
function renderizarVendas() {
  corpoVendas.innerHTML = "";

  let totalGeral = 0;

  vendas.forEach(function (venda, indice) {
    totalGeral += Number(venda.total);

    const linha = document.createElement("tr");

    const valores = [
      indice + 1,
      venda.data,
      venda.marca,
      venda.peca,
      venda.quantidade,
      venda.pagamento,
      moeda(venda.precoUnitario),
      moeda(venda.total)
    ];

    valores.forEach(function (valor) {
      const celula = document.createElement("td");
      celula.textContent = valor;
      linha.appendChild(celula);
    });

    corpoVendas.appendChild(linha);
  });

  totalVendas.textContent = moeda(totalGeral);
  quantidadeVendas.textContent =
    `Itens vendidos: ${vendas.reduce(
      (soma, venda) => soma + venda.quantidade, 0
    )} | Registros: ${vendas.length}`;
}

// Salva as vendas no armazenamento local do navegador.
document.getElementById("btn-salvar").addEventListener("click", function () {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(vendas));
    alteracoesPendentes = false;

    mostrarMensagem(
      "Vendas salvas com sucesso neste navegador!"
    );
  } catch (erro) {
    mostrarMensagem(
      "Não foi possível salvar. Verifique o armazenamento do navegador."
    );
  }
});

// Recupera as vendas salvas ao abrir o sistema.
function carregarVendas() {
  try {
    const dados = localStorage.getItem(STORAGE_KEY);

    if (dados) {
      const registros = JSON.parse(dados);

      if (!Array.isArray(registros)) {
        throw new Error("Formato de dados inválido.");
      }

      vendas = registros.filter(function (venda) {
        return venda &&
          Number.isSafeInteger(venda.id) &&
          typeof venda.data === "string" &&
          typeof venda.marca === "string" &&
          typeof venda.peca === "string" &&
          Number.isSafeInteger(venda.quantidade) &&
          venda.quantidade > 0 &&
          typeof venda.pagamento === "string" &&
          Number.isFinite(venda.precoUnitario) &&
          Number.isFinite(venda.total);
      });

      proximoId = vendas.reduce(
        (maior, venda) => Math.max(maior, venda.id), 0
      ) + 1;
    }
  } catch (erro) {
    vendas = [];
    proximoId = 1;
    mostrarMensagem("Não foi possível carregar os registros salvos.");
  }

  renderizarVendas();
}

window.addEventListener("beforeunload", function (evento) {
  if (alteracoesPendentes) {
    evento.preventDefault();
    evento.returnValue = "";
  }
});

// Imprime o relatório ou permite salvar em PDF.
document.getElementById("btn-imprimir").addEventListener("click", function () {
  window.print();
});

// Exporta os registros para uma planilha CSV.
document.getElementById("btn-exportar").addEventListener("click", function () {
  if (vendas.length === 0) {
    mostrarMensagem("Não existem vendas para exportar.");
    return;
  }

  const cabecalho = [
    "Numero",
    "Data/Hora",
    "Marca",
    "Peca",
    "Quantidade",
    "Forma de Pagamento",
    "Preco Unitario",
    "Total"
  ];

  const linhas = vendas.map(function (venda, indice) {
    return [
      indice + 1,
      venda.data,
      venda.marca,
      venda.peca,
      venda.quantidade,
      venda.pagamento,
      venda.precoUnitario.toFixed(2).replace(".", ","),
      venda.total.toFixed(2).replace(".", ",")
    ];
  });

  // Escapa aspas e separadores do CSV.
  function campoCSV(valor) {
    return '"' + String(valor).replace(/"/g, '""') + '"';
  }

  const conteudo = [cabecalho, ...linhas]
    .map(linha => linha.map(campoCSV).join(";"))
    .join("\r\n");

  const blob = new Blob(
    ["\uFEFF" + conteudo],
    { type: "text/csv;charset=utf-8;" }
  );

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = "relatorio_vendas_autopecas.csv";

  document.body.appendChild(link);
  link.click();
  link.remove();

  URL.revokeObjectURL(url);

  mostrarMensagem("Arquivo CSV exportado com sucesso!");
});

// Inicializa o sistema.
carregarVendas();

