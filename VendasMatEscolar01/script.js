let carrinho = [];

function adicionarProduto() {

    const select = document.getElementById("produto");
    const quantidade = Number(document.getElementById("quantidade").value);

    if (select.value == "0") {
        alert("Selecione um produto!");
        return;
    }

    if (quantidade <= 0) {
        alert("Informe uma quantidade válida!");
        return;
    }

    const nomeProduto =
        select.options[select.selectedIndex].text.split(" - ")[0];

    const preco = Number(select.value);

    const produto = {
        nome: nomeProduto,
        preco: preco,
        quantidade: quantidade,
        subtotal: preco * quantidade
    };

    carrinho.push(produto);

    atualizarCarrinho();

    select.value = "0";
    document.getElementById("quantidade").value = 1;
}


function atualizarCarrinho() {

    const lista = document.getElementById("listaCarrinho");

    lista.innerHTML = "";

    let total = 0;

    carrinho.forEach((produto, index) => {

        total += produto.subtotal;

        const linha = document.createElement("tr");

        linha.innerHTML = `
            <td>${produto.nome}</td>

            <td>
                R$ ${produto.preco.toFixed(2)}
            </td>

            <td>
                ${produto.quantidade}
            </td>

            <td>
                R$ ${produto.subtotal.toFixed(2)}
            </td>

            <td>
                <button 
                    class="remover"
                    onclick="removerProduto(${index})">
                    Remover
                </button>
            </td>
        `;

        lista.appendChild(linha);
    });

    document.getElementById("total").textContent =
        total.toFixed(2);
}


function removerProduto(index) {

    carrinho.splice(index, 1);

    atualizarCarrinho();
}


function finalizarVenda() {

    if (carrinho.length === 0) {
        alert("O carrinho está vazio!");
        return;
    }

    let total = 0;

    carrinho.forEach(produto => {
        total += produto.subtotal;
    });

    alert(
        "VENDA FINALIZADA!\n\n" +
        "Total da compra: R$ " +
        total.toFixed(2) +
        "\n\nObrigado pela compra!"
    );

    carrinho = [];

    atualizarCarrinho();
}