function calcularIMC() {

    const sexo = document.getElementById("sexo").value;
    const peso = parseFloat(document.getElementById("peso").value);
    const altura = parseFloat(document.getElementById("altura").value);

    const resultado = document.getElementById("resultado");

    // Verificação dos dados
    if (sexo === "") {
        alert("Selecione o sexo.");
        return;
    }

    if (isNaN(peso) || peso <= 0) {
        alert("Digite um peso válido.");
        return;
    }

    if (isNaN(altura) || altura <= 0) {
        alert("Digite uma altura válida.");
        return;
    }

    // Cálculo do IMC
    const imc = peso / (altura * altura);

    let classificacao = "";

    // Classificação
    if (imc < 18.5) {

        classificacao = "Abaixo do peso";

    } else if (imc < 25) {

        classificacao = "Normal";

    } else if (imc < 30) {

        classificacao = "Sobrepeso";

    } else if (imc < 40) {

        classificacao = "Obeso";

    } else {

        classificacao = "Obesidade Mórbida";
    }

    // Exibição do resultado
    resultado.style.display = "block";

    resultado.innerHTML = `
        <h2>Resultado do IMC</h2>

        <p><strong>Sexo:</strong> ${sexo}</p>

        <p><strong>Peso:</strong> ${peso.toFixed(1)} kg</p>

        <p><strong>Altura:</strong> ${altura.toFixed(2)} m</p>

        <p><strong>IMC:</strong> ${imc.toFixed(2)}</p>

        <p><strong>Classificação:</strong> ${classificacao}</p>
    `;

    // Cor de acordo com a classificação
    if (classificacao === "Normal") {

        resultado.style.backgroundColor = "#d4edda";
        resultado.style.color = "#155724";

    } else if (classificacao === "Obeso") {

        resultado.style.backgroundColor = "#fff3cd";
        resultado.style.color = "#856404";

    } else if (classificacao === "Obesidade Mórbida") {

        resultado.style.backgroundColor = "#f8d7da";
        resultado.style.color = "#721c24";

    } else {

        resultado.style.backgroundColor = "#cce5ff";
        resultado.style.color = "#004085";
    }
}


function limparCampos() {

    document.getElementById("sexo").value = "";
    document.getElementById("peso").value = "";
    document.getElementById("altura").value = "";

    const resultado = document.getElementById("resultado");

    resultado.style.display = "none";
    resultado.innerHTML = "";
}