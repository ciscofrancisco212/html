
function calcularMedia() {

    let nome = document.getElementById("nome").value;
    let nota1 = document.getElementById("nota1").value;
    let nota2 = document.getElementById("nota2").value;
    let nota3 = document.getElementById("nota3").value;

    let resultado = document.getElementById("resultado");

    if (nome.trim() === "" || nota1 === "" ||
        nota2 === "" || nota3 === "") {
        resultado.style.color = "red";
        resultado.innerHTML = "Preencha todos os campos!";
        return;
    }

    nota1 = Number(nota1);
    nota2 = Number(nota2);
    nota3 = Number(nota3);

    if ([nota1, nota2, nota3].some(n =>
        !Number.isFinite(n) || n < 0 || n > 10)) {
        resultado.style.color = "red";
        resultado.innerHTML = "Informe notas de 0 a 10!";
        return;
    }

    let media = (nota1 + nota2 + nota3) / 3;

    if (media >= 7) {
        resultado.style.color = "green";
        resultado.innerHTML =
            "Aluno: " + nome +
            "<br>Média: " + media.toFixed(2) +
            "<br>Situação: APROVADO";
    } else {
        resultado.style.color = "red";
        resultado.innerHTML =
            "Aluno: " + nome +
            "<br>Média: " + media.toFixed(2) +
            "<br>Situação: REPROVADO";
    }
}

