
const processadores = {
    "Celeron": {
        nome: "Intel Celeron",
        perfil: "Entrada",
        eficiencia: "Adequado para tarefas simples em modelos compatíveis e bem configurados.",
        desempenho: "Limitado em modelos básicos ou antigos. O resultado depende da geração e do modelo.",
        aplicacoes: [
            "Navegação na internet",
            "Edição simples de textos",
            "Estudos e atividades escolares",
            "Aplicativos leves"
        ],
        recomendado: "Usuários que precisam realizar tarefas básicas."
    },

    "Pentium": {
        nome: "Intel Pentium",
        perfil: "Entrada",
        eficiencia: "Pode oferecer bom resultado em tarefas leves, dependendo do modelo.",
        desempenho: "Varia entre gerações e modelos. Não deve ser avaliado apenas pelo nome.",
        aplicacoes: [
            "Pacote de escritório",
            "Navegação na internet",
            "Aulas e pesquisas",
            "Sistemas administrativos simples"
        ],
        recomendado: "Estudantes e usuários de aplicações básicas."
    },

    "i3": {
        nome: "Intel Core i3",
        perfil: "Básico a intermediário",
        eficiencia: "Pode equilibrar consumo de energia e desempenho em computadores domésticos.",
        desempenho: "Modelos recentes podem superar processadores antigos de categorias superiores.",
        aplicacoes: [
            "Estudos e trabalhos escolares",
            "Pacotes de escritório",
            "Programação básica",
            "Navegação com várias abas"
        ],
        recomendado: "Estudantes, escritórios e uso doméstico."
    },

    "i5": {
        nome: "Intel Core i5",
        perfil: "Intermediário a alto",
        eficiencia: "Depende da geração, do consumo configurado e do sistema de refrigeração.",
        desempenho: "Pode oferecer excelente equilíbrio entre processamento, multitarefa e jogos.",
        aplicacoes: [
            "Multitarefas",
            "Programação",
            "Jogos, com placa gráfica adequada",
            "Edição de imagens e vídeos"
        ],
        recomendado: "Usuários que precisam de versatilidade e bom desempenho."
    },

    "i7": {
        nome: "Intel Core i7",
        perfil: "Alto desempenho",
        eficiencia: "Modelos móveis econômicos diferem bastante dos modelos de desktop de alta potência.",
        desempenho: "Pode apresentar elevado desempenho em tarefas simultâneas e aplicações exigentes.",
        aplicacoes: [
            "Desenvolvimento de software",
            "Edição de vídeos",
            "Modelagem e projetos CAD",
            "Jogos e criação de conteúdo"
        ],
        recomendado: "Profissionais e usuários com cargas de trabalho exigentes."
    },

    "i9": {
        nome: "Intel Core i9",
        perfil: "Alto desempenho e entusiasta",
        eficiencia: "Os modelos mais potentes podem exigir mais energia e refrigeração robusta.",
        desempenho: "Projetado para oferecer alto desempenho em determinados modelos e cargas de trabalho.",
        aplicacoes: [
            "Renderização 3D",
            "Produção de vídeo profissional",
            "Simulações e processamento intensivo",
            "Jogos de alto desempenho e multitarefas"
        ],
        recomendado: "Profissionais e entusiastas que realmente necessitam de alto desempenho."
    },

    "Core Ultra": {
        nome: "Intel Core Ultra",
        perfil: "Varia conforme o modelo",
        eficiencia: "Alguns modelos priorizam eficiência energética e integram recursos especializados.",
        desempenho: "Varia entre séries, gerações e categorias de notebooks e desktops.",
        aplicacoes: [
            "Produtividade profissional",
            "Aplicações gráficas compatíveis",
            "Multitarefas",
            "Algumas tarefas de inteligência artificial aceleradas por hardware"
        ],
        recomendado: "Usuários que procuram recursos modernos e devem comparar as especificações do modelo."
    }
};

function consultarProcessador() {
    const selecao = document.getElementById("processador").value;
    const cpu = processadores[selecao];
    const resultado = document.getElementById("resultado");

    if (!cpu) {
        resultado.innerHTML = "<p>Selecione um processador válido.</p>";
        return;
    }

    resultado.innerHTML = `
        <h3>${cpu.nome}</h3>

        <p>
            <strong>Categoria geral:</strong>
            <span class="nivel">${cpu.perfil}</span>
        </p>

        <p><strong>Eficiência:</strong> ${cpu.eficiencia}</p>

        <p><strong>Desempenho:</strong> ${cpu.desempenho}</p>

        <h4>Principais aplicações</h4>

        <ul>
            ${cpu.aplicacoes.map(item => `<li>${item}</li>`).join("")}
        </ul>

        <p>
            <strong>Usuário recomendado:</strong>
            ${cpu.recomendado}
        </p>

        <p class="aviso">
            Importante: estas são descrições gerais da família.
            Para uma comparação precisa, consulte o modelo completo,
            a geração, os núcleos, os recursos gráficos, o consumo
            energético e testes de desempenho.
        </p>
    `;
}

// Apresenta informações iniciais ao abrir o programa.
consultarProcessador();