
// Array que armazenará os alunos
let alunos = [];


// ==========================================
// CADASTRAR ALUNO
// ==========================================

function cadastrarAluno() {

    let data = document.getElementById("data").value;
    let nome = document.getElementById("nome").value.trim();

    let nota1 = Number(document.getElementById("nota1").value);
    let nota2 = Number(document.getElementById("nota2").value);
    let nota3 = Number(document.getElementById("nota3").value);


    // Verificar campos
    if (
        data === "" ||
        nome === "" ||
        document.getElementById("nota1").value === "" ||
        document.getElementById("nota2").value === "" ||
        document.getElementById("nota3").value === ""
    ) {

        alert("Preencha todos os campos!");
        return;
    }


    // Verificar notas
    if (
        nota1 < 0 || nota1 > 10 ||
        nota2 < 0 || nota2 > 10 ||
        nota3 < 0 || nota3 > 10
    ) {

        alert("As notas devem estar entre 0 e 10!");
        return;
    }


    // Calcular média
    let media = (nota1 + nota2 + nota3) / 3;


    // Definir situação
    let situacao;

    if (media >= 7) {
        situacao = "APROVADO";
    } else {
        situacao = "REPROVADO";
    }


    // Criar objeto do aluno
    let aluno = {

        data: data,
        nome: nome,
        nota1: nota1,
        nota2: nota2,
        nota3: nota3,
        media: media,
        situacao: situacao

    };


    // Adicionar aluno ao array
    alunos.push(aluno);


    // Atualizar tabela
    atualizarTabela();


    // Limpar campos para próximo cadastro
    novoAluno();


    alert("Aluno cadastrado com sucesso!");

}


// ==========================================
// ATUALIZAR TABELA
// ==========================================

function atualizarTabela() {

    let tabela = document.getElementById("listaAlunos");

    tabela.innerHTML = "";


    alunos.forEach(function(aluno) {

        let linha = tabela.insertRow();


        // Data
        let colunaData = linha.insertCell();
        colunaData.textContent = aluno.data;


        // Nome
        let colunaNome = linha.insertCell();
        colunaNome.textContent = aluno.nome;


        // Nota 1
        let colunaNota1 = linha.insertCell();
        colunaNota1.textContent = aluno.nota1.toFixed(1);


        // Nota 2
        let colunaNota2 = linha.insertCell();
        colunaNota2.textContent = aluno.nota2.toFixed(1);


        // Nota 3
        let colunaNota3 = linha.insertCell();
        colunaNota3.textContent = aluno.nota3.toFixed(1);


        // Média
        let colunaMedia = linha.insertCell();
        colunaMedia.textContent = aluno.media.toFixed(2);


        // Situação
        let colunaSituacao = linha.insertCell();
        colunaSituacao.textContent = aluno.situacao;


        // Cor da situação
        if (aluno.situacao === "APROVADO") {

            colunaSituacao.className = "aprovado";

        } else {

            colunaSituacao.className = "reprovado";

        }

    });

}


// ==========================================
// NOVO ALUNO
// ==========================================

function novoAluno() {

    document.getElementById("nome").value = "";
    document.getElementById("nota1").value = "";
    document.getElementById("nota2").value = "";
    document.getElementById("nota3").value = "";

    document.getElementById("nome").focus();

}


// ==========================================
// LIMPAR TODOS OS REGISTROS
// ==========================================

function limparRegistros() {

    if (alunos.length === 0) {

        alert("Não existem registros para limpar.");
        return;

    }


    let confirmar = confirm(
        "Deseja realmente apagar todos os registros?"
    );


    if (confirmar) {

        alunos = [];

        atualizarTabela();

        novoAluno();

        document.getElementById("data").value = "";

        alert("Todos os registros foram apagados.");

    }

}


// ==========================================
// IMPRIMIR LISTA FINAL
// ==========================================

function imprimirLista() {

    if (alunos.length === 0) {

        alert("Não existem alunos cadastrados para imprimir.");
        return;

    }

    window.print();

}


// ==========================================
// AVANÇAR PARA O PRÓXIMO CAMPO COM ENTER
// ==========================================

const campos = [
    "data",
    "nome",
    "nota1",
    "nota2",
    "nota3"
];

campos.forEach(function(id, indice) {

    const campo = document.getElementById(id);

    campo.addEventListener("keydown", function(event) {

        // Verifica se a tecla pressionada foi ENTER
        if (event.key === "Enter") {

            // Impede o comportamento padrão do Enter
            event.preventDefault();

            // Verifica se existe um próximo campo
            if (indice < campos.length - 1) {

                // Vai para o próximo campo
                document.getElementById(
                    campos[indice + 1]
                ).focus();

            } else {

                // No último campo, cadastra o aluno
                cadastrarAluno();

            }

        }

    });

});

