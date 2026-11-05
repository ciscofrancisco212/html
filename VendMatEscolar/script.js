// Base de dados com 10 Itens de Material Escolar
const products = [
    {
        id: 1,
        name: "Caderno Universitário 10 Matérias",
        category: "cadernos",
        price: 24.90,
        image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=400&q=80"
    },
    {
        id: 2,
        name: "Kit Canetas Gel (12 Cores)",
        category: "escrita",
        price: 29.90,
        image: "https://images.unsplash.com/photo-1585336261026-875a60a1c92f?auto=format&fit=crop&w=400&q=80"
    },
    {
        id: 3,
        name: "Mochila Escolar Resistente",
        category: "mochilas",
        price: 119.90,
        image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=400&q=80"
    },
    {
        id: 4,
        name: "Estojo Duplo Escolar",
        category: "mochilas",
        price: 19.90,
        image: "https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?auto=format&fit=crop&w=400&q=80"
    },
    {
        id: 5,
        name: "Caixa Lápis de Cor 24 Cores",
        category: "escrita",
        price: 34.50,
        image: "https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?auto=format&fit=crop&w=400&q=80"
    },
    {
        id: 6,
        name: "Kit Marca-Texto Pastel (6 Cores)",
        category: "escrita",
        price: 22.00,
        image: "https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?auto=format&fit=crop&w=400&q=80"
    },
    {
        id: 7,
        name: "Agenda Escolar 2026",
        category: "cadernos",
        price: 18.90,
        image: "https://images.unsplash.com/photo-1506784983877-45594efa4cbe?auto=format&fit=crop&w=400&q=80"
    },
    {
        id: 8,
        name: "Tesoura Sem Ponta Escolar",
        category: "acessorios",
        price: 7.50,
        image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=400&q=80"
    },
    {
        id: 9,
        name: "Bloco de Notas Adesivas (Post-it)",
        category: "acessorios",
        price: 9.90,
        image: "https://images.unsplash.com/photo-1586075010923-2dd4570fb338?auto=format&fit=crop&w=400&q=80"
    },
    {
        id: 10,
        name: "Calculadora Científica",
        category: "acessorios",
        price: 49.90,
        image: "https://images.unsplash.com/photo-1611125832047-1d7ad1e8e48d?auto=format&fit=crop&w=400&q=80"
    }
];

// Estado da Aplicação
let cart = [];
let discountPercent = 0;
let currentCategory = 'todas';

// Elementos do DOM
const productsContainer = document.getElementById('productsContainer');
const searchInput = document.getElementById('searchInput');
const categoryButtons = document.querySelectorAll('.cat-btn');
const cartBadge = document.getElementById('cartBadge');
const openCartBtn = document.getElementById('openCartBtn');
const closeCartBtn = document.getElementById('closeCartBtn');
const cartModal = document.getElementById('cartModal');
const cartItemsContainer = document.getElementById('cartItemsContainer');
const subtotalVal = document.getElementById('subtotalVal');
const discountVal = document.getElementById('discountVal');
const discountRow = document.getElementById('discountRow');
const totalVal = document.getElementById('totalVal');
const couponInput = document.getElementById('couponInput');
const applyCouponBtn = document.getElementById('applyCouponBtn');
const checkoutBtn = document.getElementById('checkoutBtn');
const receiptModal = document.getElementById('receiptModal');
const receiptBody = document.getElementById('receiptBody');
const closeReceiptBtn = document.getElementById('closeReceiptBtn');
const toast = document.getElementById('toast');

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
    renderProducts(products);
    setupEvents();
});

// Renderizar Produtos
function renderProducts(items) {
    productsContainer.innerHTML = '';
    
    if (items.length === 0) {
        productsContainer.innerHTML = `<p style="grid-column: 1/-1; text-align: center; color: #64748b;">Nenhum produto encontrado.</p>`;
        return;
    }

    items.forEach(product => {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.innerHTML = `
            <img src="${product.image}" alt="${product.name}" class="product-img">
            <div class="product-info">
                <span class="product-cat">${product.category}</span>
                <h3 class="product-title">${product.name}</h3>
                <div class="product-bottom">
                    <span class="product-price">R$ ${product.price.toFixed(2).replace('.', ',')}</span>
                    <button class="add-btn" onclick="addToCart(${product.id})">
                        <i class="fa-solid fa-plus"></i>
                    </button>
                </div>
            </div>
        `;
        productsContainer.appendChild(card);
    });
}

// Configurar Eventos
function setupEvents() {
    // Busca em tempo real
    searchInput.addEventListener('input', filterProducts);

    // Filtro por Categoria
    categoryButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            categoryButtons.forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            currentCategory = e.target.getAttribute('data-cat');
            filterProducts();
        });
    });

    // Abrir/Fechar Carrinho
    openCartBtn.addEventListener('click', () => cartModal.classList.add('active'));
    closeCartBtn.addEventListener('click', () => cartModal.classList.remove('active'));

    // Aplicar Cupom
    applyCouponBtn.addEventListener('click', applyCoupon);

    // Finalizar Compra
    checkoutBtn.addEventListener('click', checkout);

    // Fechar Comprovante
    closeReceiptBtn.addEventListener('click', () => {
        receiptModal.classList.remove('active');
        cart = [];
        discountPercent = 0;
        couponInput.value = '';
        discountRow.style.display = 'none';
        updateCart();
    });
}

// Filtrar Produtos por Categoria e Busca
function filterProducts() {
    const searchTerm = searchInput.value.toLowerCase();
    
    const filtered = products.filter(product => {
        const matchesCategory = currentCategory === 'todas' || product.category === currentCategory;
        const matchesSearch = product.name.toLowerCase().includes(searchTerm);
        return matchesCategory && matchesSearch;
    });

    renderProducts(filtered);
}

// Adicionar ao Carrinho
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    const existingItem = cart.find(item => item.id === productId);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }

    updateCart();
    showToast(`"${product.name}" adicionado ao carrinho!`);
}

// Atualizar Carrinho
function updateCart() {
    // Atualizar Badge
    const totalCount = cart.reduce((acc, item) => acc + item.quantity, 0);
    cartBadge.textContent = totalCount;

    // Renderizar Itens no Modal
    cartItemsContainer.innerHTML = '';
    
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p style="text-align: center; color: #64748b;">Seu carrinho está vazio.</p>';
    } else {
        cart.forEach(item => {
            const itemElement = document.createElement('div');
            itemElement.className = 'cart-item';
            itemElement.innerHTML = `
                <div class="cart-item-info">
                    <h4>${item.name}</h4>
                    <p>R$ ${item.price.toFixed(2).replace('.', ',')}</p>
                </div>
                <div class="qty-controls">
                    <button class="qty-btn" onclick="changeQty(${item.id}, -1)">-</button>
                    <span>${item.quantity}</span>
                    <button class="qty-btn" onclick="changeQty(${item.id}, 1)">+</button>
                    <button class="remove-btn" onclick="removeFromCart(${item.id})">
                        <i class="fa-solid fa-trash"></i>
                    </button>
                </div>
            `;
            cartItemsContainer.appendChild(itemElement);
        });
    }

    // Calcular Totais
    const subtotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    const discount = subtotal * (discountPercent / 100);
    const total = subtotal - discount;

    subtotalVal.textContent = `R$ ${subtotal.toFixed(2).replace('.', ',')}`;
    discountVal.textContent = `- R$ ${discount.toFixed(2).replace('.', ',')}`;
    totalVal.textContent = `R$ ${total.toFixed(2).replace('.', ',')}`;
}

// Alterar Quantidade
function changeQty(productId, delta) {
    const item = cart.find(i => i.id === productId);
    if (item) {
        item.quantity += delta;
        if (item.quantity <= 0) {
            removeFromCart(productId);
        } else {
            updateCart();
        }
    }
}

// Remover do Carrinho
function removeFromCart(productId) {
    cart = cart.filter(i => i.id !== productId);
    updateCart();
}

// Aplicar Cupom
function applyCoupon() {
    const code = couponInput.value.trim().toUpperCase();
    if (code === 'ESCOLA10') {
        discountPercent = 10;
        discountRow.style.display = 'flex';
        showToast('Cupom de 10% aplicado!');
    } else if (code === 'VOLTA20') {
        discountPercent = 20;
        discountRow.style.display = 'flex';
        showToast('Cupom de 20% aplicado!');
    } else {
        showToast('Cupom inválido!');
        discountPercent = 0;
        discountRow.style.display = 'none';
    }
    updateCart();
}

// Finalizar Compra
function checkout() {
    if (cart.length === 0) {
        alert('Seu carrinho está vazio!');
        return;
    }

    const subtotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    const discount = subtotal * (discountPercent / 100);
    const total = subtotal - discount;
    const paymentMethod = document.getElementById('paymentMethod').value;

    const paymentText = {
        pix: 'Pix',
        cartao: 'Cartão de Crédito',
        dinheiro: 'Dinheiro na Entrega'
    }[paymentMethod];

    // Gerar Recibo
    let itemsSummaryHTML = cart.map(i => `
        <div style="display: flex; justify-content: space-between; font-size: 13px;">
            <span>${i.quantity}x ${i.name}</span>
            <span>R$ ${(i.price * i.quantity).toFixed(2).replace('.', ',')}</span>
        </div>
    `).join('');

    receiptBody.innerHTML = `
        <div><strong>Data:</strong> ${new Date().toLocaleDateString('pt-BR')} ${new Date().toLocaleTimeString('pt-BR')}</div>
        <div><strong>Forma de Pagamento:</strong> ${paymentText}</div>
        <hr style="margin: 10px 0; border: none; border-top: 1px solid #cbd5e1;">
        <div style="margin-bottom: 8px;"><strong>Itens:</strong></div>
        ${itemsSummaryHTML}
        <hr style="margin: 10px 0; border: none; border-top: 1px solid #cbd5e1;">
        ${discount > 0 ? `<div><strong>Desconto:</strong> - R$ ${discount.toFixed(2).replace('.', ',')}</div>` : ''}
        <div style="font-size: 16px; font-weight: bold; margin-top: 5px;">
            <strong>Total Pago:</strong> R$ ${total.toFixed(2).replace('.', ',')}
        </div>
    `;

    cartModal.classList.remove('active');
    receiptModal.classList.add('active');
}

// Toast de Notificação
function showToast(message) {
    toast.textContent = message;
    toast.classList.add('show');
    setTimeout(() => {
        toast.classList.remove('show');
    }, 2500);
}