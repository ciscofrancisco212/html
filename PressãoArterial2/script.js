document.getElementById('bpForm').addEventListener('submit', function(event) {
    event.preventDefault();

    // Obter os valores digitados
    const sys = parseInt(document.getElementById('systolic').value);
    const dia = parseInt(document.getElementById('diastolic').value);

    // Elementos de Resultado
    const resultBox = document.getElementById('result');
    const statusTitle = document.getElementById('statusTitle');
    const statusDescription = document.getElementById('statusDescription');

    // Limpar classes de estilo anteriores
    resultBox.className = 'result-box';

    // Validação simples
    if (dia >= sys) {
        statusTitle.textContent = "Erro na Leitura";
        statusDescription.textContent = "A pressão sistólica (máxima) deve ser maior que a diastólica (mínima).";
        resultBox.classList.add('status-alta');
        resultBox.classList.remove('hidden');
        return;
    }

    let title = "";
    let description = "";
    let cssClass = "";

    // Lógica de Classificação da Pressão Arterial
    if (sys < 120 && dia < 80) {
        title = "Pressão Ótima / Ideal";
        description = "Sua pressão arterial está em níveis excelentes (Abaixo de 120/80 mmHg).";
        cssClass = "status-otima";
    } else if (sys <= 129 && dia <= 84) {
        title = "Pressão Normal";
        description = "Sua pressão arterial está dentro do intervalo considerado saudável.";
        cssClass = "status-normal";
    } else if ((sys >= 130 && sys <= 139) || (dia >= 85 && dia <= 89)) {
        title = "Pressão Limitrofe (Pré-hipertensão)";
        description = "Atenção: seus níveis estão levemente elevados. Recomenda-se praticar hábitos saudáveis.";
        cssClass = "status-limitrofe";
    } else if (sys >= 140 || dia >= 90) {
        title = "Pressão Alta (Hipertensão)";
        description = "Seus valores indicam pressão alta. É altamente recomendado consultar um médico para avaliação.";
        cssClass = "status-alta";
    }

    // Atualizar e exibir os resultados na página
    statusTitle.textContent = title;
    statusDescription.textContent = description;
    resultBox.classList.add(cssClass);
    resultBox.classList.remove('hidden');
});