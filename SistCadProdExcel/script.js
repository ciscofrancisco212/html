
const $ = id => document.getElementById(id);

const form = $("formProduto");
const arquivo = $("arquivo");
const campos = $("camposFormulario");
const tabela = $("tabelaProdutos");
const mensagem = $("mensagem");

const CHAVE = "sistema_cadastro_produtos_v1";

const colunasPadrao = [
    "Código",
    "Produto",
    "Categoria",
    "Quantidade",
    "Preço",
    "Fornecedor"
];

let colunas = [...colunasPadrao];
let produtos = [];
let indiceEdicao = null;

// Recupera os dados salvos anteriormente
try {
    produtos = JSON.parse(localStorage.getItem(CHAVE)) || [];
} catch {
    produtos = [];
}

function salvarDados() {
    try {
        localStorage.setItem(CHAVE, JSON.stringify(produtos));
        return true;
    } catch {
        avisar("Não foi possível salvar. Verifique o espaço disponível no navegador.", true);
        return false;
    }
}

function avisar(texto, erro = false) {
    mensagem.textContent = texto;
    mensagem.style.color = erro ? "#dc2626" : "#15803d";
}

function normalizar(texto) {
    return String(texto ?? "")
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .trim();
}

// Cria os campos com base nos cabeçalhos da planilha
function criarFormulario() {
    campos.replaceChildren();

    colunas.forEach((coluna, i) => {
        const div = document.createElement("div");
        div.className = "campo";

        const label = document.createElement("label");
        label.htmlFor = `campo_${i}`;
        label.textContent = coluna;

        const input = document.createElement("input");
        input.id = `campo_${i}`;
        input.name = `campo_${i}`;
        input.placeholder = `Digite ${coluna}`;
        input.required = i === 1 || colunas.length === 1;

        div.append(label, input);
        campos.appendChild(div);
    });
}

function desenharTabela() {
    const thead = tabela.querySelector("thead");
    const tbody = tabela.querySelector("tbody");

    thead.replaceChildren();
    tbody.replaceChildren();

    const linhaCabecalho = document.createElement("tr");

    [...colunas, "Ações"].forEach(nome => {
        const th = document.createElement("th");
        th.textContent = nome;
        linhaCabecalho.appendChild(th);
    });

    thead.appendChild(linhaCabecalho);

    const busca = normalizar($("pesquisa").value);
    let quantidadeVisivel = 0;

    produtos.forEach((produto, indice) => {
        const corresponde = colunas.some(coluna =>
            normalizar(produto[coluna]).includes(busca)
        );

        if (!corresponde) return;

        quantidadeVisivel++;

        const tr = document.createElement("tr");

        colunas.forEach(coluna => {
            const td = document.createElement("td");
            td.textContent = produto[coluna] ?? "";
            tr.appendChild(td);
        });

        const tdAcoes = document.createElement("td");
        tdAcoes.className = "acoes";

        const editar = document.createElement("button");
        editar.type = "button";
        editar.className = "btn-editar";
        editar.textContent = "Editar";
        editar.addEventListener("click", () => editarProduto(indice));

        const excluir = document.createElement("button");
        excluir.type = "button";
        excluir.className = "btn-excluir";
        excluir.textContent = "Excluir";
        excluir.addEventListener("click", () => excluirProduto(indice));

        tdAcoes.append(editar, excluir);
        tr.appendChild(tdAcoes);
        tbody.appendChild(tr);
    });

    $("total").textContent = produtos.length;

    if (quantidadeVisivel === 0) {
        const tr = document.createElement("tr");
        const td = document.createElement("td");
        td.colSpan = colunas.length + 1;
        td.textContent = "Nenhum produto encontrado.";
        tr.appendChild(td);
        tbody.appendChild(tr);
    }
}

function limparFormulario() {
    form.reset();
    indiceEdicao = null;
    $("btnSalvar").textContent = "💾 Salvar produto";
    $("btnCancelar").hidden = true;
}

// Cadastra ou atualiza um produto
form.addEventListener("submit", event => {
    event.preventDefault();

    const produto = {};

    colunas.forEach((coluna, i) => {
        produto[coluna] = $(`campo_${i}`).value.trim();
    });

    const indiceProduto = indiceEdicao;

    if (indiceProduto === null) {
        produtos.push(produto);
    } else {
        produtos[indiceProduto] = produto;
    }

    if (!salvarDados()) {
        if (indiceProduto === null) {
            produtos.pop();
        } else {
            // A atualização será revertida pela cópia abaixo
            avisar("Erro ao salvar os dados no navegador.", true);
        }
        return;
    }

    desenharTabela();
    limparFormulario();
    avisar(indiceProduto === null
        ? "Produto cadastrado com sucesso!"
        : "Produto atualizado com sucesso!");
});

function editarProduto(indice) {
    const produto = produtos[indice];

    colunas.forEach((coluna, i) => {
        $(`campo_${i}`).value = produto[coluna] ?? "";
    });

    indiceEdicao = indice;
    $("btnSalvar").textContent = "Atualizar produto";
    $("btnCancelar").hidden = false;

    form.scrollIntoView({ behavior: "smooth" });
}

function excluirProduto(indice) {
    if (!confirm("Deseja realmente excluir este produto?")) return;

    const removido = produtos.splice(indice, 1)[0];

    if (!salvarDados()) {
        produtos.splice(indice, 0, removido);
        return;
    }

    desenharTabela();
    avisar("Produto excluído com sucesso!");
}

$("btnCancelar").addEventListener("click", limparFormulario);
$("pesquisa").addEventListener("input", desenharTabela);

// Importa a primeira planilha do Excel ou um arquivo CSV
$("btnImportar").addEventListener("click", async () => {
    const file = arquivo.files[0];

    if (!file) {
        avisar("Selecione primeiro um arquivo Excel ou CSV.", true);
        return;
    }

    if (typeof XLSX === "undefined") {
        avisar("Biblioteca Excel indisponível. Verifique sua conexão com a internet.", true);
        return;
    }

    try {
        const dados = await file.arrayBuffer();

        const workbook = XLSX.read(dados, {
            type: "array",
            cellDates: true
        });

        const primeiraPlanilha = workbook.Sheets[workbook.SheetNames[0]];

        const linhas = XLSX.utils.sheet_to_json(primeiraPlanilha, {
            header: 1,
            defval: "",
            raw: false
        });

        if (linhas.length === 0) {
            avisar("A planilha está vazia.", true);
            return;
        }

        // A primeira linha deve conter os nomes das colunas
        const novosCabecalhos = linhas[0].map((valor, i) =>
            String(valor).trim() || `Coluna ${i + 1}`
        );

        if (!novosCabecalhos.length) {
            avisar("Não foram encontradas colunas.", true);
            return;
        }

        const novosProdutos = linhas.slice(1)
            .filter(linha => linha.some(valor => String(valor).trim() !== ""))
            .map(linha => {
                const produto = {};

                novosCabecalhos.forEach((coluna, i) => {
                    const valor = linha[i] ?? "";
                    produto[coluna] = valor instanceof Date
                        ? valor.toLocaleDateString("pt-BR")
                        : valor;
                });

                return produto;
            });

        if (!confirm(
            `Foram encontrados ${novosProdutos.length} produtos.\n` +
            "OK: substituir os registros atuais.\n" +
            "Cancelar: manter os atuais e acrescentar os importados."
        )) {
            produtos = [...produtos, ...novosProdutos];
        } else {
            produtos = novosProdutos;
        }

        colunas = novosCabecalhos;

        if (!salvarDados()) {
            avisar("Não foi possível salvar a importação. Os dados podem exceder o limite do navegador.", true);
            return;
        }

        criarFormulario();
        desenharTabela();
        limparFormulario();

        avisar(`${novosProdutos.length} produtos importados com sucesso!`);
    } catch (erro) {
        console.error(erro);
        avisar("Erro na leitura da planilha. Verifique o arquivo e tente novamente.", true);
    }
});

// Exporta os registros para Excel
$("btnExportar").addEventListener("click", () => {
    if (typeof XLSX === "undefined") {
        avisar("Biblioteca Excel indisponível.", true);
        return;
    }

    const planilha = XLSX.utils.json_to_sheet(produtos, {
        header: colunas
    });

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, planilha, "Produtos");

    XLSX.writeFile(workbook, "Cadastro_de_Produtos.xlsx");
    avisar("Arquivo Excel gerado!");
});

// Imprime a tabela
$("btnImprimir").addEventListener("click", () => {
    window.print();
});

// Inicialização
criarFormulario();
desenharTabela();