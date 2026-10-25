
function avaliarPressao() {
    const sistolica = Number(
        document.getElementById("sistolica").value
    );

    const diastolica = Number(
        document.getElementById("diastolica").value
    );

    const resultado = document.getElementById("resultado");

    resultado.className = "resultado";

    if (
        document.getElementById("sistolica").value === "" ||
        document.getElementById("diastolica").value === ""
    ) {
        mostrarErro("Preencha os dois campos da pressão arterial.");
        return;
    }

    if (
        !Number.isFinite(sistolica) ||
        !Number.isFinite(diastolica) ||
        sistolica <= 0 ||
        diastolica <= 0 ||
        sistolica > 300 ||
        diastolica > 200 ||
        sistolica <= diastolica
    ) {
        mostrarErro(
            "Informe valores válidos. A pressão sistólica deve " +
            "ser maior que a diastólica."
        );
        return;
    }

    let classificacao = "";
    let classe = "";
    let orientacao = "";

    // Classificar pelo componente que atingir a faixa mais elevada.
    if (sistolica >= 180 || diastolica >= 110) {
        classificacao = "Pressão muito elevada — estágio 3";
        classe = "critica";
        orientacao =
            "Procure avaliação médica imediata. Se houver dor no " +
            "peito, falta de ar, fraqueza de um lado do corpo, " +
            "confusão ou alteração visual, procure emergência.";

    } else if (sistolica >= 160 || diastolica >= 100) {
        classificacao = "Pressão alta — estágio 2";
        classe = "muito-alta";
        orientacao =
            "Repita a medição após repouso e procure orientação " +
            "médica prontamente.";

    } else if (sistolica >= 140 || diastolica >= 90) {
        classificacao = "Pressão alta — estágio 1";
        classe = "alta";
        orientacao =
            "Uma medição isolada não confirma hipertensão. " +
            "Registre os valores e procure avaliação médica.";

    } else if (sistolica >= 130 || diastolica >= 85) {
        classificacao = "Pré-hipertensão";
        classe = "atencao";
        orientacao =
            "O resultado merece acompanhamento e avaliação dos " +
            "fatores de risco cardiovascular.";

    } else if (sistolica >= 120 || diastolica >= 80) {
        classificacao = "Pressão normal";
        classe = "normal";
        orientacao =
            "Resultado dentro da faixa normal desta classificação. " +
            "Continue acompanhando a pressão regularmente.";

    } else {
        classificacao = "Pressão ótima";
        classe = "ideal";
        orientacao =
            "Resultado na faixa ótima de referência para adultos.";
    }

    resultado.className = "resultado " + classe;

    resultado.innerHTML = `
        <h3>Resultado da avaliação</h3>
        <p><strong>Pressão medida:</strong>
            ${sistolica}/${diastolica} mmHg
        </p>
        <p><strong>Classificação:</strong>
            ${classificacao}
        </p>
        <p><strong>Orientação:</strong> ${orientacao}</p>
        <p><small>
            Esta classificação é educativa e não estabelece
            diagnóstico médico.
        </small></p>
    `;
}

function mostrarErro(mensagem) {
    const resultado = document.getElementById("resultado");

    resultado.className = "resultado atencao";
    resultado.textContent = mensagem;
}

function limparCampos() {
    document.getElementById("sistolica").value = "";
    document.getElementById("diastolica").value = "";

    const resultado = document.getElementById("resultado");

    resultado.className = "resultado";
    resultado.innerHTML = `
        <h3>Resultado da avaliação</h3>
        <p>Informe os dois valores para iniciar.</p>
    `;
}