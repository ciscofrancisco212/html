document.addEventListener('DOMContentLoaded', () => {

    // ==============================================
    // 1. ANALISADOR DE SENHAS
    // ==============================================
    const passwordInput = document.getElementById('passwordInput');
    const togglePassBtn = document.getElementById('togglePassBtn');
    const strengthBar = document.getElementById('strengthBar');
    const strengthText = document.getElementById('strengthText');
    const crackTime = document.getElementById('crackTime');

    const reqs = {
        length: document.querySelector('[data-req="length"]'),
        upper: document.querySelector('[data-req="upper"]'),
        lower: document.querySelector('[data-req="lower"]'),
        number: document.querySelector('[data-req="number"]'),
        symbol: document.querySelector('[data-req="symbol"]')
    };

    // Alternar Visibilidade da Senha
    togglePassBtn.addEventListener('click', () => {
        const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordInput.setAttribute('type', type);
        togglePassBtn.textContent = type === 'password' ? '👁️' : '🙈';
    });

    // Validar Senha em Tempo Real
    passwordInput.addEventListener('input', () => {
        const val = passwordInput.value;

        const checks = {
            length: val.length >= 8,
            upper: /[A-Z]/.test(val),
            lower: /[a-z]/.test(val),
            number: /[0-9]/.test(val),
            symbol: /[^A-Za-z0-9]/.test(val)
        };

        let passedCount = 0;

        // Atualiza Lista de Requisitos
        for (const req in checks) {
            if (checks[req]) {
                reqs[req].classList.add('valid');
                reqs[req].textContent = reqs[req].textContent.replace('❌', '✅');
                passedCount++;
            } else {
                reqs[req].classList.remove('valid');
                reqs[req].textContent = reqs[req].textContent.replace('✅', '❌');
            }
        }

        // Atualiza Barra de Força e Estimativa
        updateStrengthMeter(passedCount, val.length);
    });

    function updateStrengthMeter(score, length) {
        if (length === 0) {
            strengthBar.style.width = '0%';
            strengthText.textContent = 'Aguardando...';
            crackTime.textContent = '-';
            return;
        }

        let width = (score / 5) * 100;
        strengthBar.style.width = width + '%';

        if (score <= 2) {
            strengthBar.style.backgroundColor = '#ff3366'; // Fraca
            strengthText.textContent = 'Muito Fraca';
            crackTime.textContent = 'Instântaneo';
        } else if (score <= 4) {
            strengthBar.style.backgroundColor = '#ffcc00'; // Média
            strengthText.textContent = 'Média';
            crackTime.textContent = 'Alguns dias / meses';
        } else {
            strengthBar.style.backgroundColor = '#00ff66'; // Forte
            strengthText.textContent = 'Muito Forte!';
            crackTime.textContent = 'Séculos / Milênios';
        }
    }

    // ==============================================
    // 2. GERADOR DE SENHAS
    // ==============================================
    const lengthSlider = document.getElementById('lengthSlider');
    const lengthVal = document.getElementById('lengthVal');
    const generateBtn = document.getElementById('generateBtn');
    const generatedPassword = document.getElementById('generatedPassword');
    const copyBtn = document.getElementById('copyBtn');

    lengthSlider.addEventListener('input', (e) => {
        lengthVal.textContent = e.target.value;
    });

    generateBtn.addEventListener('click', generatePassword);

    function generatePassword() {
        const length = parseInt(lengthSlider.value);
        const incUpper = document.getElementById('incUpper').checked;
        const incLower = document.getElementById('incLower').checked;
        const incNum = document.getElementById('incNum').checked;
        const incSym = document.getElementById('incSym').checked;

        const upperChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        const lowerChars = 'abcdefghijklmnopqrstuvwxyz';
        const numChars = '0123456789';
        const symChars = '!@#$%^&*()_+-=[]{}|;:,.<>?';

        let allowedChars = '';
        if (incUpper) allowedChars += upperChars;
        if (incLower) allowedChars += lowerChars;
        if (incNum) allowedChars += numChars;
        if (incSym) allowedChars += symChars;

        if (allowedChars === '') {
            alert('Selecione pelo menos um tipo de caractere!');
            return;
        }

        let password = '';
        for (let i = 0; i < length; i++) {
            const randomIndex = Math.floor(Math.random() * allowedChars.length);
            password += allowedChars[randomIndex];
        }

        generatedPassword.value = password;
    }

    // Copiar para Área de Transferência
    copyBtn.addEventListener('click', () => {
        if (!generatedPassword.value) return;

        navigator.clipboard.writeText(generatedPassword.value);
        const originalText = copyBtn.textContent;
        copyBtn.textContent = 'Copiado! ✓';
        setTimeout(() => {
            copyBtn.textContent = originalText;
        }, 1500);
    });

    // ==============================================
    // 3. SIMULADOR ANTI-PHISHING
    // ==============================================
    const btnLegit = document.getElementById('btnLegit');
    const btnPhishing = document.getElementById('btnPhishing');
    const phishingFeedback = document.getElementById('phishingFeedback');

    btnLegit.addEventListener('click', () => {
        phishingFeedback.className = 'feedback incorrect';
        phishingFeedback.classList.remove('hidden');
        phishingFeedback.innerHTML = `
            <strong>Ops, resposta errada!</strong> Este é um e-mail de phishing clássico.<br>
            <strong>Sinais de Alerta:</strong> Domínio falso (banc0 com número zero), senso de urgência/ameaça ("bloqueado em 24h") e link externo suspeito.
        `;
    });

    btnPhishing.addEventListener('click', () => {
        phishingFeedback.className = 'feedback correct';
        phishingFeedback.classList.remove('hidden');
        phishingFeedback.innerHTML = `
            <strong>Excelente! Você identificou o ataque! 🎯</strong><br>
            <strong>Análise dos Riscos:</strong> O e-mail utiliza o domínio falso <code>banc0-seguro-atualiza.com</code> (com zero), usa pressão psicológica de urgência e solicita dados sensíveis via link inseguro (HTTP).
        `;
    });

    // ==============================================
    // 4. PESQUISA NO GLOSSÁRIO
    // ==============================================
    const searchGlossary = document.getElementById('searchGlossary');
    const glossaryCards = document.querySelectorAll('.glossary-card');

    searchGlossary.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase();

        glossaryCards.forEach(card => {
            const term = card.getAttribute('data-term');
            const text = card.textContent.toLowerCase();

            if (term.includes(query) || text.includes(query)) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    });

});