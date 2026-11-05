function gerarTabuada() {
    const inputNumero = document.getElementById('numero');
    const divResultado = document.getElementById('resultado');
    const numero = Number(inputNumero.value);

    // Validação caso o campo esteja vazio
    if (inputNumero.value === '') {
        divResultado.innerHTML = '<p style="color: red;">Por favor, digite um número!</p>';
        return;
    }

    // Limpa o resultado anterior
    divResultado.innerHTML = '';

    // Loop para gerar a tabuada do 1 ao 10
    for (let i = 1; i <= 10; i++) {
        const item = document.createElement('div');
        item.className = 'item-tabuada';
        item.innerHTML = `${numero} x ${i} = <strong>${numero * i}</strong>`;
        divResultado.appendChild(item);
    }
}