// ================================================
// 1. EXEMPLOS DE STRINGS NO JAVASCRIPT
// ================================================

// String com Aspas Simples
const texto1 = 'Olá! Isto é uma string com aspas simples.';

// String com Aspas Duplas
const texto2 = "Ela pode conter 'aspas simples' dentro dela sem problemas.";

// Template Literal / Template String (Usando Crases ``)
const nome = "Dev";
const texto3 = `Com Template Literals podemos intercalar variáveis como: ${nome}!`;

// Exibindo os exemplos na tela (Manipulação de String)
const divExemplos = document.getElementById('exemplos-strings');
divExemplos.innerHTML = `
  <p><strong>Aspas Simples:</strong> ${texto1}</p>
  <p><strong>Aspas Duplas:</strong> ${texto2}</p>
  <p><strong>Template Literal:</strong> ${texto3}</p>
`;


// ================================================
// 2. FUNÇÃO PARA DESTACAR STRINGS
// ================================================

function destacarTexto() {
  // Pega o texto original da página
  const textoOriginal = document.getElementById('texto-original').innerText;
  
  // Pega o valor digitado pelo usuário no campo de busca
  const termoBusca = document.getElementById('input-busca').value;
  
  const elementoResultado = document.getElementById('texto-resultado');

  // Se a busca estiver vazia, apenas limpa a área de resultado
  if (!termoBusca.trim()) {
    elementoResultado.innerHTML = textoOriginal;
    return;
  }

  // Cria uma Expressão Regular (RegEx) para buscar o termo
  // 'g' = global (substitui todas as ocorrências)
  // 'i' = case-insensitive (ignora maiúsculas/minúsculas)
  const regex = new RegExp(`(${termoBusca})`, 'gi');

  // Substitui a palavra encontrada por um HTML que aplica a classe CSS de destaque
  const textoComDestaque = textoOriginal.replace(
    regex, 
    '<span class="highlight">$1</span>'
  );

  // Insere o novo HTML formatado na tela
  elementoResultado.innerHTML = textoComDestaque;
}