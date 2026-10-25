// Dados dos produtos
const produtos = [
    { id: 1, nome: "Caderno 10 Matérias", preco: 24.90 },
    { id: 2, nome: "Caixa de Lápis de Cor", preco: 18.50 },
    { id: 3, nome: "Caneta Esferográfica Azul", preco: 2.50 },
    { id: 4, nome: "Mochila Escolar", preco: 119.90 },
    { id: 5, nome: "Estojo Duplo", preco: 29.90 },
    { id: 6, nome: "Borracha Branca", preco: 1.50 },
    { id: 7, nome: "Apontador com Depósito", preco: 3.00 },
    { id: 8, nome: "Lápis de Cor 12 Unidades", preco: 12.00 }
];

let carrinho = [];

// Elementos do DOM
const containerProdutos = document.getElementById("lista-produtos");
const containerCarrinho = document.getElementById("itens-carrinho");
const elementoTotal = document.getElementById("valor-total");
const btnFinalizar = document.getElementById("btn-finalizar");

// Renderizar lista de produtos
function renderizarProdutos() {
    containerProdutos.innerHTML = "";
    
    produtos.forEach(produto => {
        const card = document.createElement("div");
        card.className = "card-produto";
        card.innerHTML = `
            <h3>${produto.nome}</h3>
            <p class="preco">R$ ${produto.preco.toFixed(2)}</p>
            <button onclick="adicionarAoCarrinho(${produto.id})">Adicionar</button>
        `;
        containerProdutos.appendChild(card);
    });
}

// Adicionar produto ao carrinho
function adicionarAoCarrinho(idProduto) {
    const produto = produtos.find(p => p.id === idProduto);
    carrinho.push(produto);
    atualizarCarrinho();
}

// Atualizar interface do carrinho
function atualizarCarrinho() {
    containerCarrinho.innerHTML = "";
    let total = 0;

    carrinho.forEach((item, index) => {
        total += item.preco;
        const li = document.createElement("li");
        li.innerHTML = `
            <span>${item.nome}</span>
            <span>R$ ${item.preco.toFixed(2)}</span>
        `;
        containerCarrinho.appendChild(li);
    });

    elementoTotal.innerText = total.toFixed(2);
}

// Finalizar compra
btnFinalizar.addEventListener("click", () => {
    if (carrinho.length === 0) {
        alert("Seu carrinho está vazio!");
        return;
    }
    
    alert(`Compra finalizada com sucesso! Total: R$ ${elementoTotal.innerText}`);
    carrinho = [];
    atualizarCarrinho();
});

// Inicialização
renderizarProdutos();