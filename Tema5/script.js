// Mapeamento dos elementos da página
const tipoLacoSelect = document.getElementById('tipoLaco');
const limiteInput = document.getElementById('limite');
const btnExecutar = document.getElementById('btnExecutar');
const codigoTela = document.getElementById('codigoTela');
const resultadoDiv = document.getElementById('resultado');

// Função para atualizar o texto do código na tela
function atualizarCodigoPreview() {
  const tipo = tipoLacoSelect.value;
  const limite = limiteInput.value;

  if (tipo === 'for') {
    codigoTela.textContent = 
`for (let i = 1; i <= ${limite}; i++) {
  console.log("Iteração número: " + i);
}`;
  } else if (tipo === 'while') {
    codigoTela.textContent = 
`let i = 1;
while (i <= ${limite}) {
  console.log("Iteração número: " + i);
  i++;
}`;
  } else if (tipo === 'dowhile') {
    codigoTela.textContent = 
`let i = 1;
do {
  console.log("Iteração número: " + i);
  i++;
} while (i <= ${limite});`;
  }
}

// Função para executar a estrutura de repetição selecionada
function executarLaco() {
  const tipo = tipoLacoSelect.value;
  const limite = parseInt(limiteInput.value);

  // Limpa o terminal antes de executar
  resultadoDiv.innerHTML = '';

  if (isNaN(limite) || limite <= 0) {
    resultadoDiv.innerHTML = '<p style="color: #ff5555;">Por favor, insira um número válido maior que 0.</p>';
    return;
  }

  // --- ESTRUTURAS DE REPETIÇÃO ---
  
  // 1. Laço FOR
  if (tipo === 'for') {
    for (let i = 1; i <= limite; i++) {
      imprimirNoTerminal(`[FOR] Executando iteração nº: ${i}`);
    }
  } 
  
  // 2. Laço WHILE
  else if (tipo === 'while') {
    let i = 1;
    while (i <= limite) {
      imprimirNoTerminal(`[WHILE] Executando iteração nº: ${i}`);
      i++;
    }
  } 
  
  // 3. Laço DO...WHILE
  else if (tipo === 'dowhile') {
    let i = 1;
    do {
      imprimirNoTerminal(`[DO-WHILE] Executando iteração nº: ${i}`);
      i++;
    } while (i <= limite);
  }
}

// Função auxiliar para escrever linhas no "Terminal" da página
function imprimirNoTerminal(texto) {
  const p = document.createElement('p');
  p.textContent = texto;
  resultadoDiv.appendChild(p);
  // Rola automaticamente para o fim do terminal
  resultadoDiv.scrollTop = resultadoDiv.scrollHeight;
}

// Eventos dos controles
tipoLacoSelect.addEventListener('change', atualizarCodigoPreview);
limiteInput.addEventListener('input', atualizarCodigoPreview);
btnExecutar.addEventListener('click', executarLaco);

// Inicializa a pré-visualização ao carregar a página
atualizarCodigoPreview();