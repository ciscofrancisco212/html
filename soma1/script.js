function somar() {
    // Obtém os valores dos campos de texto
    const num1 = parseFloat(document.getElementById('numero1').value);
    const num2 = parseFloat(document.getElementById('numero2').value);

    // Valida se os campos foram preenchidos corretamente
    if (isNaN(num1) || isNaN(num2)) {
        alert("Por favor, digite números válidos em ambos os campos!");
        return;
    }

    // Realiza a soma
    const total = num1 + num2;

    // Exibe o resultado no HTML
    document.getElementById('resultado').textContent = total;
}

function limpar() {
    // Limpa os campos de input
    document.getElementById('numero1').value = '';
    document.getElementById('numero2').value = '';
    
    // Reseta o resultado para zero
    document.getElementById('resultado').textContent = '0';
}