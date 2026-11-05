
"use strict";

// Banco de dados local do navegador
const CHAVE = "techServiceOrdensV1";

let ordens = carregarOrdens();
let editando = null;

const $ = id => document.getElementById(id);
const form = $("formOS");

function carregarOrdens() {
    try {
        const dados = JSON.parse(localStorage.getItem(CHAVE) || "[]");
        return Array.isArray(dados) ? dados : [];
    } catch {
        return [];
    }
}

function gravarOrdens() {
    try {
        localStorage.setItem(CHAVE, JSON.stringify(ordens));
        return true;
    } catch (erro) {
        alert("Não foi possível gravar os dados. Exporte um backup e verifique o espaço disponível no navegador.");
        return false;
    }
}

function dinheiro(valor) {
    return Number(valor || 0).toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });
}

function dataHoje() {
    const agora = new Date();
    const local = new Date(
        agora.getTime() - agora.getTimezoneOffset() * 60000
    );
    return local.toISOString().slice(0, 10);
}

function dataBR(data) {
    if (!data) return "-";
    const partes = data.split("-");
    return partes.length === 3
        ? `${partes[2]}/${partes[1]}/${partes[0]}`
        : data;
}

function escapar(valor) {
    return String(valor ?? "").replace(/[&<>"']/g, caractere => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
    })[caractere]);
}

function proximoNumero() {
    const maior = ordens.reduce((max, os) => {
        const numero = Number(os.numero);
        return Number.isFinite(numero) ? Math.max(max, numero) : max;
    }, 1000);

    return maior + 1;
}

function calcularTotal() {
    const maoObra = Math.max(0, Number($("maoObra").value) || 0);
    const pecas = Math.max(0, Number($("pecas").value) || 0);
    const desconto = Math.max(0, Number($("desconto").value) || 0);

    const total = Math.max(0, maoObra + pecas - desconto);
    $("total").value = total.toLocaleString("pt-BR", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
}

["maoObra", "pecas", "desconto"].forEach(id => {
    $(id).addEventListener("input", calcularTotal);
});

function limparFormulario() {
    form.reset();
    editando = null;

    $("numero").value = proximoNumero();
    $("data").value = dataHoje();
    $("maoObra").value = "0";
    $("pecas").value = "0";
    $("desconto").value = "0";
    $("total").value = "0,00";
    $("status").value = "Recebido";
    $("situacaoPagamento").value = "Pendente";
    $("btnSalvar").textContent = "Salvar OS";
    $("mensagem").textContent = "";

    window.scrollTo({ top: 0, behavior: "smooth" });
}

function obterFormulario() {
    const numero = Number($("numero").value);

    const maoObra = Math.max(0, Number($("maoObra").value) || 0);
    const pecas = Math.max(0, Number($("pecas").value) || 0);
    const desconto = Math.max(0, Number($("desconto").value) || 0);

    return {
        numero,
        data: $("data").value,
        cliente: $("cliente").value.trim(),
        telefone: $("telefone").value.trim(),
        tipo: $("tipo").value,
        modelo: $("modelo").value.trim(),
        serie: $("serie").value.trim(),
        processador: $("processador").value.trim(),
        ram: $("ram").value.trim(),
        armazenamento: $("armazenamento").value.trim(),
        defeito: $("defeito").value.trim(),
        diagnostico: $("diagnostico").value.trim(),
        servicos: $("servicos").value.trim(),
        acessorios: $("acessorios").value.trim(),
        maoObra,
        pecas,
        desconto,
        total: Math.max(0, maoObra + pecas - desconto),
        status: $("status").value,
        pagamento: $("pagamento").value,
        situacaoPagamento: $("situacaoPagamento").value,
        previsao: $("previsao").value,
        observacoes: $("observacoes").value.trim()
    };
}

form.addEventListener("submit", evento => {
    evento.preventDefault();

    const dados = obterFormulario();

    if (!dados.cliente || !dados.data || !dados.tipo || !dados.defeito) {
        alert("Preencha os campos obrigatórios.");
        return;
    }

    if (dados.desconto > dados.maoObra + dados.pecas) {
        alert("O desconto não pode ser maior que a soma dos serviços e peças.");
        return;
    }

    const anterior = editando === null
        ? null
        : ordens.find(os => os.numero === editando);

    const registro = {
        ...dados,
        criadoEm: anterior?.criadoEm || new Date().toISOString(),
        atualizadoEm: new Date().toISOString()
    };

    const copiaAnterior = [...ordens];

    if (editando !== null) {
        const indice = ordens.findIndex(os => os.numero === editando);

        if (indice < 0) {
            alert("Esta ordem não foi encontrada. Atualize a lista.");
            return;
        }

        ordens[indice] = registro;
    } else {
        registro.numero = proximoNumero();
        ordens.push(registro);
    }

    if (!gravarOrdens()) {
        ordens = copiaAnterior;
        return;
    }

    $("mensagem").textContent =
        `OS ${registro.numero} salva com sucesso!`;

    atualizarLista();
    limparFormulario();
});

function atualizarLista() {
    const termo = $("busca").value.trim().toLowerCase();
    const filtro = $("filtroStatus").value;

    const filtradas = ordens.filter(os => {
        const texto = [
            os.numero, os.cliente, os.telefone,
            os.modelo, os.tipo, os.serie
        ].join(" ").toLowerCase();

        return texto.includes(termo) &&
            (!filtro || os.status === filtro);
    });

    filtradas.sort((a, b) => b.numero - a.numero);

    $("listaOS").innerHTML = filtradas.map(os => `
        <tr>
            <td>${escapar(os.numero)}</td>
            <td>${escapar(dataBR(os.data))}</td>
            <td>${escapar(os.cliente)}</td>
            <td>${escapar(os.tipo)} - ${escapar(os.modelo)}</td>
            <td>${escapar(dinheiro(os.total))}</td>
            <td>${escapar(os.status)}</td>
            <td>
                <div class="acoes">
                    <button type="button" class="btnEditar"
                        data-acao="editar" data-numero="${escapar(os.numero)}">
                        Editar
                    </button>
                    <button type="button"
                        data-acao="imprimir" data-numero="${escapar(os.numero)}">
                        Imprimir
                    </button>
                    <button type="button" class="btnExcluir"
                        data-acao="excluir" data-numero="${escapar(os.numero)}">
                        Excluir
                    </button>
                </div>
            </td>
        </tr>
    `).join("");

    if (filtradas.length === 0) {
        $("listaOS").innerHTML =
            '<tr><td colspan="7">Nenhuma ordem encontrada.</td></tr>';
    }

    $("qtdOS").textContent = ordens.length;
    $("valorOS").textContent = dinheiro(
        ordens.reduce((soma, os) => soma + Number(os.total || 0), 0)
    );
}

function editarOS(numero) {
    const os = ordens.find(item => item.numero === numero);
    if (!os) return;

    editando = numero;

    Object.keys(os).forEach(campo => {
        const elemento = $(campo);
        if (elemento && campo !== "criadoEm" && campo !== "atualizadoEm") {
            elemento.value = os[campo] ?? "";
        }
    });

    $("btnSalvar").textContent = "Atualizar OS";
    $("mensagem").textContent = `Editando a OS ${numero}.`;

    window.scrollTo({ top: 0, behavior: "smooth" });
}

function excluirOS(numero) {
    const os = ordens.find(item => item.numero === numero);
    if (!os) return;

    if (!confirm(
        `Deseja realmente excluir a OS ${numero} do cliente ${os.cliente}?`
    )) return;

    const anterior = [...ordens];
    ordens = ordens.filter(item => item.numero !== numero);

    if (!gravarOrdens()) {
        ordens = anterior;
        return;
    }

    if (editando === numero) limparFormulario();

    atualizarLista();
}

$("listaOS").addEventListener("click", evento => {
    const botao = evento.target.closest("button[data-acao]");
    if (!botao) return;

    const numero = Number(botao.dataset.numero);

    if (botao.dataset.acao === "editar") editarOS(numero);
    if (botao.dataset.acao === "imprimir") imprimirOS(numero);
    if (botao.dataset.acao === "excluir") excluirOS(numero);
});

$("busca").addEventListener("input", atualizarLista);
$("filtroStatus").addEventListener("change", atualizarLista);
$("btnNovo").addEventListener("click", limparFormulario);

function imprimirOS(numero) {
    const os = numero === undefined
        ? obterFormulario()
        : ordens.find(item => item.numero === numero);

    if (!os) {
        alert("Ordem de serviço não encontrada.");
        return;
    }

    if (!os.cliente || !os.tipo || !os.defeito) {
        alert("Preencha e salve uma OS com cliente, equipamento e defeito antes de imprimir.");
        return;
    }

    // Para imprimir um registro da lista, carregamos seus dados
    // temporariamente no formulário, sem alterar o cadastro.
    const atual = obterFormulario();
    const numeroAtual = editando;

    if (numero !== undefined) {
        Object.keys(os).forEach(campo => {
            if ($(campo)) $(campo).value = os[campo] ?? "";
        });
    }

    window.print();

    // A impressão é iniciada pelo navegador.
    // Os registros salvos permanecem no armazenamento local.
}

$("btnImprimir").addEventListener("click", () => {
    if (editando === null) {
        const dados = obterFormulario();

        if (!dados.cliente || !dados.tipo || !dados.defeito) {
            alert("Preencha cliente, equipamento e defeito para imprimir.");
            return;
        }
    }

    imprimirOS(editando === null ? undefined : editando);
});

$("btnExportar").addEventListener("click", () => {
    const arquivo = new Blob(
        [JSON.stringify(ordens, null, 2)],
        { type: "application/json;charset=utf-8" }
    );

    const url = URL.createObjectURL(arquivo);
    const link = document.createElement("a");

    link.href = url;
    link.download = `backup-tech-service-${dataHoje()}.json`;
    link.click();

    setTimeout(() => URL.revokeObjectURL(url), 1000);
});

$("btnImportar").addEventListener("click", () => {
    $("arquivoBackup").click();
});

$("arquivoBackup").addEventListener("change", async evento => {
    const arquivo = evento.target.files[0];
    if (!arquivo) return;

    try {
        const texto = await arquivo.text();
        const dados = JSON.parse(texto);

        if (!Array.isArray(dados) || !dados.every(os =>
            os && typeof os === "object" &&
            Number.isFinite(Number(os.numero)) &&
            typeof os.cliente === "string" &&
            typeof os.data === "string" &&
            typeof os.defeito === "string" &&
            typeof os.tipo === "string" &&
            Number.isFinite(Number(os.total))
        )) {
            throw new Error("Formato inválido");
        }

        if (!confirm(
            "A importação substituirá todas as OS atuais. Faça um backup antes. Deseja continuar?"
        )) return;

        const anterior = ordens;
        ordens = dados;

        if (!gravarOrdens()) {
            ordens = anterior;
            return;
        }

        limparFormulario();
        atualizarLista();
        alert("Backup importado com sucesso!");
    } catch {
        alert("Não foi possível importar. Verifique se o arquivo JSON é válido.");
    } finally {
        evento.target.value = "";
    }
});

// Inicialização
limparFormulario();
atualizarLista();
