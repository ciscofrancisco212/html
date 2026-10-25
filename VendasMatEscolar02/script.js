// ========================================
// SISTEMA DE VENDAS - MATERIAL ESCOLAR
// ========================================

let carrinho = [];

// ----------------------------------------
// COLOCAR A DATA ATUAL AUTOMATICAMENTE
// ----------------------------------------

window.onload = function () {

    const data = new Date();

    const ano = data.getFullYear();
    const mes = String(data.getMonth() + 1).padStart(2, '0');
    const dia = String(data.getDate()).padStart(2, '0');

    document.getElementById("dataVenda").value =
        `${ano}-${mes}-${dia}`;
};


// ----------------------------------------
// ADICIONAR PRODUTO AO CARRINHO
// ----------------------------------------

function adicionarProduto() {

    const select = document.getElementById("produto");
    const quantidadeInput = document.getElementById("quantidade");

    if (select.value === "") {
        alert("Selecione um produto!");
        return;
    }

    const quantidade = parseInt(quantidadeInput.value);

    if (quantidade <= 0 || isNaN(quantidade)) {
        alert("Informe uma quantidade válida!");
        return;
    }

    const opcao = select.options[select.selectedIndex];

    const nomeProduto = opcao.value;
    const preco = parseFloat(opcao.dataset.preco);

    const produtoExistente = carrinho.find(
        produto => produto.nome === nomeProduto
    );

    if (produtoExistente) {

        produtoExistente.quantidade += quantidade;

    } else {

        carrinho.push({
            nome: nomeProduto,
            preco: preco,
            quantidade: quantidade
        });

    }

    atualizarTabela();

    select.value = "";
    quantidadeInput.value = 1;
}


// ----------------------------------------
// ATUALIZAR TABELA
// ----------------------------------------

function atualizarTabela() {

    const lista = document.getElementById("listaProdutos");

    lista.innerHTML = "";

    let totalVenda = 0;

    carrinho.forEach((produto, index) => {

        const totalProduto =
            produto.preco * produto.quantidade;

        totalVenda += totalProduto;

        const linha = document.createElement("tr");

        linha.innerHTML = `

            <td>${produto.nome}</td>

            <td>
                ${formatarMoeda(produto.preco)}
            </td>

            <td>
                ${produto.quantidade}
            </td>

            <td>
                ${formatarMoeda(totalProduto)}
            </td>

            <td>
                <button
                    class="btn-remover"
                    onclick="removerProduto(${index})">
                    🗑 Remover
                </button>
            </td>

        `;

        lista.appendChild(linha);

    });

    document.getElementById("totalVenda").textContent =
        formatarMoeda(totalVenda);
}


// ----------------------------------------
// REMOVER PRODUTO
// ----------------------------------------

function removerProduto(index) {

    carrinho.splice(index, 1);

    atualizarTabela();
}


// ----------------------------------------
// FORMATAR VALOR EM REAL
// ----------------------------------------

function formatarMoeda(valor) {

    return valor.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });
}


// ----------------------------------------
// CALCULAR TOTAL
// ----------------------------------------

function calcularTotal() {

    let total = 0;

    carrinho.forEach(produto => {

        total += produto.preco * produto.quantidade;

    });

    return total;
}


// ----------------------------------------
// SALVAR VENDA
// ----------------------------------------

function salvarVenda() {

    const data = document.getElementById("dataVenda").value;

    if (data === "") {

        alert("Informe a data da venda!");

        return;
    }

    if (carrinho.length === 0) {

        alert("Adicione pelo menos um produto!");

        return;
    }

    const venda = {

        data: data,

        produtos: carrinho,

        total: calcularTotal()

    };

    localStorage.setItem(
        "ultimaVenda",
        JSON.stringify(venda)
    );

    alert(
        "Venda salva com sucesso!\n\n" +
        "Total: " +
        formatarMoeda(venda.total)
    );
}


// ----------------------------------------
// IMPRIMIR VENDA
// ----------------------------------------

function imprimirVenda() {

    if (carrinho.length === 0) {

        alert("Não existem produtos para imprimir!");

        return;
    }

    const data = document.getElementById("dataVenda").value;

    let conteudo = "";

    conteudo += `
        <html>

        <head>

            <title>Comprovante de Venda</title>

            <style>

                body {
                    font-family: Arial;
                    margin: 40px;
                }

                h1 {
                    text-align: center;
                }

                .data {
                    margin-bottom: 20px;
                }

                table {
                    width: 100%;
                    border-collapse: collapse;
                }

                th, td {
                    border: 1px solid #000;
                    padding: 10px;
                    text-align: center;
                }

                th {
                    background: #ddd;
                }

                .total {
                    text-align: right;
                    margin-top: 20px;
                    font-size: 20px;
                    font-weight: bold;
                }

            </style>

        </head>

        <body>

            <h1>COMPROVANTE DE VENDA</h1>

            <div class="data">
                <strong>Data:</strong>
                ${formatarData(data)}
            </div>

            <table>

                <thead>

                    <tr>
                        <th>Produto</th>
                        <th>Preço Unit.</th>
                        <th>Quantidade</th>
                        <th>Total</th>
                    </tr>

                </thead>

                <tbody>
    `;

    carrinho.forEach(produto => {

        const totalProduto =
            produto.preco * produto.quantidade;

        conteudo += `

            <tr>

                <td>${produto.nome}</td>

                <td>
                    ${formatarMoeda(produto.preco)}
                </td>

                <td>
                    ${produto.quantidade}
                </td>

                <td>
                    ${formatarMoeda(totalProduto)}
                </td>

            </tr>

        `;

    });

    conteudo += `

                </tbody>

            </table>

            <div class="total">

                Total da Venda:
                ${formatarMoeda(calcularTotal())}

            </div>

            <br><br>

            <p style="text-align:center;">
                Obrigado pela preferência!
            </p>

        </body>

        </html>

    `;

    const janela =
        window.open("", "_blank");

    janela.document.write(conteudo);

    janela.document.close();

    janela.print();
}


// ----------------------------------------
// FORMATAR DATA
// ----------------------------------------

function formatarData(data) {

    if (!data) {
        return "";
    }

    const partes = data.split("-");

    return `${partes[2]}/${partes[1]}/${partes[0]}`;
}


// ----------------------------------------
// NOVA VENDA
// ----------------------------------------

function novaVenda() {

    if (carrinho.length > 0) {

        const confirmar = confirm(
            "Deseja realmente iniciar uma nova venda?"
        );

        if (!confirmar) {
            return;
        }
    }

    carrinho = [];

    atualizarTabela();

    document.getElementById("produto").value = "";

    document.getElementById("quantidade").value = 1;

    document.getElementById("totalVenda").textContent =
        "R$ 0,00";
}