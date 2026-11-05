const num1Input = document.getElementById('num1');
const num2Input = document.getElementById('num2');
const resultBox = document.getElementById('resultBox');
const resultValue = document.getElementById('resultValue');
const resultLabel = document.getElementById('resultLabel');
const btnClear = document.getElementById('btnClear');

document.querySelectorAll('.btn-op').forEach(button => {
  button.addEventListener('click', function () {
    const num1 = parseFloat(num1Input.value);
    const num2 = parseFloat(num2Input.value);

    if (isNaN(num1) || isNaN(num2)) {
      alert('Por favor, preencha os dois números.');
      return;
    }

    const operation = this.getAttribute('data-op');
    let result = 0;
    let symbol = '';

    switch (operation) {
      case 'add':
        result = num1 + num2;
        symbol = '+';
        break;
      case 'subtract':
        result = num1 - num2;
        symbol = '−';
        break;
      case 'multiply':
        result = num1 * num2;
        symbol = '×';
        break;
      case 'divide':
        if (num2 === 0) {
          alert('Divisão por zero não é permitida.');
          return;
        }
        result = num1 / num2;
        symbol = '÷';
        break;
    }

    resultLabel.textContent = `${num1} ${symbol} ${num2} =`;
    resultValue.textContent = Number.isInteger(result) ? result : result.toFixed(2);
    resultBox.classList.remove('hidden');
  });
});

btnClear.addEventListener('click', function () {
  num1Input.value = '';
  num2Input.value = '';
  resultBox.classList.add('hidden');
  num1Input.focus();
});