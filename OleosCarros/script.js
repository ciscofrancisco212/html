
"use strict";

// ======================================
// 1. CADASTRO INICIAL DOS PRODUTOS
// ======================================

const produtosIniciais = [
    { codigo: "OL001", nome: "Óleo sintético", viscosidade: "0W-20", quantidade: 20, minimo: 5, preco: 45.90 },
    { codigo: "OL002", nome: "Óleo sintético", viscosidade: "0W-30", quantidade: 15, minimo: 5, preco: 49.90 },
    { codigo: "OL003", nome: "Óleo sintético", viscosidade: "5W-30", quantidade: 30, minimo: 8, preco: 42.90 },
    { codigo: "OL004", nome: "Óleo sintético", viscosidade: "5W-40", quantidade: 18, minimo: 5, preco: 46.90 },
    { codigo: "OL005", nome: "Óleo semissintético", viscosidade: "10W-40", quantidade: 25, minimo: 6, preco: 34.90 },
    { codigo: "OL006", nome: "Óleo mineral", viscosidade: "15W-40", quantidade: 22, minimo: 5, preco: 29.90 },
    { codigo: "OL007", nome: "Óleo mineral", viscosidade: "20W-50", quantidade: 12, minimo: 5, preco: 27.90 },
    { codigo: "OL008", nome: "Óleo sintético", viscosidade: "5W-20", quantidade: 10, minimo: 4, preco: 44.90 },
    { codigo: "OL009", nome: "Óleo sintético", viscosidade: "0W-40", quantidade: 8, minimo: 3, preco: 52.90 },
    { codigo: "OL010", nome: "Óleo semissintético", viscosidade: "10W-30", quantidade: 16, minimo: 5, preco: 32.90 }
];

// ======================================
// 2. ARMAZENAMENTO DOS DADOS
// ======================================

function carregarDados(chave, padrao) {
    try {
        const dados = localStorage.getItem(chave);
        return dados ? JSON.parse(dados) : padrao;
    } catch (erro) {
        console.error("Erro ao carregar dados:", erro);
        return padrao;
    }
}

let produtos = carregarDados(
    "autolub_produtos",
    produtosIniciais
);

let historico = carregarDados(
    "autolub_historico",
    []
);

function salvarDados() {
    try {
        localStorage.setItem(
            "autolub_produtos",
            JSON.stringify(produtos)
        );

        localStorage.setItem(
            "autolub_historico",
            JSON.stringify(historico)
        );

        return true;
    } catch (erro) {
        alert("Não foi possível salvar os dados. Verifique o espaço disponível no navegador.");
        console.error(erro);
        return false;
    }
}

// ======================================
// 3. FUNÇÕES AUXILIARES
// ======================================

const elemento = id => document.getElementById(id);

function moeda(valor) {
    return valor.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });
}

function dataLocal() {
    const agora = new Date();
    const ano = agora.getFullYear();
    const mes = String(agora.getMonth() + 1).padStart(2, "0");
    const dia = String(agora.getDate()).padStart(2, "0");

    return `${ano}-${mes}-${dia}`;
}

function formatarData(data) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(data)) {
        return data;
    }

    const [ano, mes, dia] = data.split("-");
    return `${dia}/${mes}/${ano}`;
}

// ======================================
// 4. LISTA DE PRODUTOS NO FORMULÁRIO
// ======================================

function atualizarListaProdutos() {
    const select = elemento("produto");
    const selecionado = select.value;

    select.replaceChildren();

    produtos.forEach(produto => {
        const opcao = document.createElement("option");

        opcao.value = produto.codigo;
        opcao.textContent =
            `${produto.codigo} - ${produto.viscosidade} - ${produto.nome}`;

        select.appendChild(opcao);
    });

    if (produtos.some(p => p.codigo === selecionado)) {
        select.value = selecionado;
    }
}

// ======================================
// 5. ATUALIZAR INDICADORES
// ======================================

function atualizarIndicadores() {
    const totalProdutos = produtos.length;

    const totalUnidades = produtos.reduce(
        (total, produto) => total + produto.quantidade,
        0
    );

    const valorTotal = produtos.reduce(
        (total, produto) =>
            total + produto.quantidade * produto.preco,
        0
    );

    const quantidadeEstoqueBaixo = produtos.filter(
        produto => produto.quantidade <= produto.minimo
    ).length;

    elemento("totalProdutos").textContent = totalProdutos;
    elemento("totalUnidades").textContent = totalUnidades;

    elemento("estoqueBaixo").textContent =
        quantidadeEstoqueBaixo;

    elemento("valorEstoque").textContent = moeda(valorTotal);
}

// ======================================
// 6. EXIBIR TABELA DE ESTOQUE
// ======================================

function renderizarEstoque() {
    const tabela = elemento("tabelaEstoque");
    const busca = elemento("pesquisa").value
        .trim()
        .toLowerCase();

    tabela.replaceChildren();

    const filtrados = produtos.filter(produto => {
        const texto =
            `${produto.codigo} ${produto.nome} ${produto.viscosidade}`
            .toLowerCase();

        return texto.includes(busca);
    });

    if (filtrados.length === 0) {
        const linha = tabela.insertRow();
        const celula = linha.insertCell();

        celula.colSpan = 8;
        celula.className = "vazio";
        celula.textContent = "Nenhum produto encontrado.";
        return;
    }

    filtrados.forEach(produto => {
        const linha = tabela.insertRow();

        const situacao =
            produto.quantidade === 0
                ? "Esgotado"
                : produto.quantidade <= produto.minimo
                    ? "Estoque baixo"
                    : "Normal";

        const classe =
            produto.quantidade === 0
                ? "zero"
                : produto.quantidade <= produto.minimo
                    ? "baixo"
                    : "ok";

        const valores = [
            produto.codigo,
            produto.nome,
            produto.viscosidade,
            produto.quantidade,
            produto.minimo,
            moeda(produto.preco),
            moeda(produto.quantidade * produto.preco)
        ];

        valores.forEach(valor => {
            const celula = linha.insertCell();
            celula.textContent = valor;
        });

        const celulaStatus = linha.insertCell();
        const etiqueta = document.createElement("span");

        etiqueta.className = `status ${classe}`;
        etiqueta.textContent = situacao;

        celulaStatus.appendChild(etiqueta);
    });
}

// ======================================
// 7. REGISTRAR ENTRADA OU SAÍDA
// ======================================

elemento("formMovimentacao").addEventListener(
    "submit",
    function(evento) {
        evento.preventDefault();

        const codigo = elemento("produto").value;
        const tipo = elemento("tipo").value;
        const quantidade = Number(
            elemento("quantidade").value
        );
        const data = elemento("dataMovimento").value;

        const produto = produtos.find(
            p => p.codigo === codigo
        );

        if (!produto) {
            alert("Selecione um produto válido.");
            return;
        }

        if (
            !Number.isSafeInteger(quantidade) ||
            quantidade <= 0
        ) {
            alert("Informe uma quantidade inteira maior que zero.");
            return;
        }

        if (
            !data ||
            !/^\d{4}-\d{2}-\d{2}$/.test(data) ||
            data > dataLocal()
        ) {
            alert("Informe uma data válida, que não seja futura.");
            return;
        }

        if (
            tipo === "saida" &&
            quantidade > produto.quantidade
        ) {
            alert(
                `Estoque insuficiente!\n\n` +
                `Produto: ${produto.viscosidade}\n` +
                `Disponível: ${produto.quantidade} unidade(s).`
            );
            return;
        }

        const quantidadeAnterior = produto.quantidade;

        if (tipo === "entrada") {
            produto.quantidade += quantidade;
        } else {
            produto.quantidade -= quantidade;
        }

        historico.push({
            data: data,
            codigo: produto.codigo,
            nome: produto.nome,
            viscosidade: produto.viscosidade,
            tipo: tipo,
            quantidade: quantidade
        });

        if (!salvarDados()) {
            // Reverte a movimentação se o salvamento falhar.
            produto.quantidade = quantidadeAnterior;
            historico.pop();
            return;
        }

        atualizarTudo();

        elemento("quantidade").value = "";
        elemento("dataMovimento").value = dataLocal();

        alert(
            `Movimentação registrada com sucesso!\n` +
            `Produto: ${produto.viscosidade}\n` +
            `Movimentação: ${tipo === "entrada" ? "Entrada" : "Saída"}\n` +
            `Quantidade: ${quantidade} unidade(s).`
        );
    }
);

// ======================================
// 8. HISTÓRICO DE MOVIMENTAÇÕES
// ======================================

function renderizarHistorico() {
    const tabela = elemento("historico");
    tabela.replaceChildren();

    if (historico.length === 0) {
        const linha = tabela.insertRow();
        const celula = linha.insertCell();

        celula.colSpan = 4;
        celula.className = "vazio";
        celula.textContent = "Nenhuma movimentação registrada.";
        return;
    }

    [...historico].reverse().forEach(item => {
        const linha = tabela.insertRow();

        const dados = [
            formatarData(item.data),
            `${item.codigo} - ${item.viscosidade}`,
            item.tipo === "entrada" ? "Entrada" : "Saída / Venda",
            `${item.tipo === "entrada" ? "+" : "-"}${item.quantidade}`
        ];

        dados.forEach((valor, indice) => {
            const celula = linha.insertCell();
            celula.textContent = valor;

            if (indice === 2) {
                celula.style.color =
                    item.tipo === "entrada" ? "#15803d" : "#dc2626";

                celula.style.fontWeight = "bold";
            }
        });
    });
}

// ======================================
// 9. ATUALIZAR TODO O SISTEMA
// ======================================

function atualizarTudo() {
    atualizarListaProdutos();
    atualizarIndicadores();
    renderizarEstoque();
    renderizarHistorico();
}

// ======================================
// 10. PESQUISA E IMPRESSÃO
// ======================================

elemento("pesquisa").addEventListener("input", () => {
    renderizarEstoque();
});

elemento("btnImprimir").addEventListener("click", () => {
    window.print();
});

// ======================================
// 11. INICIALIZAÇÃO
// ======================================

elemento("dataAtual").textContent =
    "Hoje: " + formatarData(dataLocal());

elemento("dataMovimento").value = dataLocal();
elemento("dataMovimento").max = dataLocal();

atualizarTudo();