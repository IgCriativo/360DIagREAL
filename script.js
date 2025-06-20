document.addEventListener('DOMContentLoaded', () => {
    // Mapeamento dos elementos principais da interface
    const startBtn = document.getElementById('start-btn');
    const welcomeScreen = document.getElementById('welcome-screen');
    const questionScreen = document.getElementById('question-screen');
    const reportScreen = document.getElementById('report-screen');
    const questionContainer = document.getElementById('question-slide-container');
    const progressBar = document.getElementById('progress-bar');
    const reportResultsContainer = document.getElementById('report-results');

    // Definição das perguntas do diagnóstico
    const questions = [
        {
            module: "Fundamentos & Estratégia",
            icon: "fas fa-flag",
            text: "Sua empresa possui um plano de negócios claro e documentado?",
            options: [{ text: "Sim, completo e atualizado", score: 3 }, { text: "Temos um, mas está desatualizado", score: 2 }, { text: "Não temos um plano formal", score: 1 }]
        },
        {
            module: "Operações & Eficiência",
            icon: "fas fa-cogs",
            text: "Seus processos operacionais são mapeados e otimizados continuamente?",
            options: [{ text: "Sim, usamos KPIs para otimizar", score: 3 }, { text: "Mapeamos, mas não otimizamos", score: 2 }, { text: "Não, são processos informais", score: 1 }]
        },
        {
            module: "Saúde Financeira",
            icon: "fas fa-chart-line",
            text: "Você tem um controle claro do seu fluxo de caixa e projeções financeiras?",
            options: [{ text: "Sim, com projeções para 12 meses", score: 3 }, { text: "Apenas controle básico do caixa", score: 2 }, { text: "Não tenho controle formal", score: 1 }]
        },
        {
            module: "Jurídico & Riscos",
            icon: "fas fa-shield-alt",
            text: "Seus contratos e práticas empresariais estão alinhados com a legislação atual?",
            options: [{ text: "Sim, temos assessoria jurídica constante", score: 3 }, { text: "Revisamos esporadicamente", score: 2 }, { text: "Não temos certeza da conformidade", score: 1 }]
        },
        {
            module: "Crescimento & Futuro",
            icon: "fas fa-rocket",
            text: "Existem estratégias ativas para inovação e expansão de mercado?",
            options: [{ text: "Sim, com orçamento dedicado", score: 3 }, { text: "Temos ideias, mas sem ação", score: 2 }, { text: "Não focamos em expansão no momento", score: 1 }]
        }
    ];

    let currentQuestionIndex = 0;
    const userAnswers = {};

    // Função para navegar entre as telas
    const navigateToScreen = (screenToShow) => {
        document.querySelectorAll('.app-screen').forEach(screen => {
            screen.classList.remove('active');
        });
        screenToShow.classList.add('active');
    };

    // Função para exibir a pergunta atual
    const showQuestion = (index) => {
        const question = questions[index];
        questionContainer.innerHTML = `
            <div class="question-slide">
                <i class="${question.icon} module-icon"></i>
                <h2 class="question-text">${question.text}</h2>
                <div class="answer-options">
                    ${question.options.map((opt, i) => `
                        <div class="answer-option" data-score="${opt.score}" data-module="${question.module}">
                            ${opt.text}
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
        // Adiciona os "ouvintes de clique" às novas opções de resposta
        document.querySelectorAll('.answer-option').forEach(option => {
            option.addEventListener('click', handleAnswerClick);
        });
    };

    // Função para lidar com o clique em uma resposta
    const handleAnswerClick = (e) => {
        const selectedOption = e.currentTarget;
        const score = parseInt(selectedOption.dataset.score);
        const module = selectedOption.dataset.module;

        // Armazena a resposta
        userAnswers[module] = score;

        // Animação de saída
        const questionSlide = questionContainer.querySelector('.question-slide');
        questionSlide.classList.add('slide-out');

        // Avança para a próxima pergunta ou gera o relatório
        setTimeout(() => {
            currentQuestionIndex++;
            if (currentQuestionIndex < questions.length) {
                updateProgressBar();
                showQuestion(currentQuestionIndex);
            } else {
                generateReport();
            }
        }, 500); // Mesmo tempo da animação de saída
    };

    // Função para atualizar a barra de progresso
    const updateProgressBar = () => {
        const progress = ((currentQuestionIndex) / questions.length) * 100;
        progressBar.style.width = `${progress}%`;
    };

    // Função para gerar o relatório final
    const generateReport = () => {
        reportResultsContainer.innerHTML = ''; // Limpa resultados anteriores
        
        // Mapeia a pontuação para o nível de maturidade
        const getMaturityLevel = (score) => {
            if (score === 3) return { level: 'ALTO', class: 'high', icon: 'fa-check-circle' };
            if (score === 2) return { level: 'MÉDIO', class: 'medium', icon: 'fa-exclamation-triangle' };
            return { level: 'BAIXO', class: 'low', icon: 'fa-times-circle' };
        };

        // Cria os cards de resultado
        questions.forEach(q => {
            const score = userAnswers[q.module] || 1;
            const maturity = getMaturityLevel(score);
            const cardHTML = `
                <div class="report-section">
                    <div class="report-section-header">
                        <i class="${q.icon}"></i>
                        <h3>${q.module}</h3>
                    </div>
                    <div class="level ${maturity.class}">
                        <i class="fas ${maturity.icon}"></i>
                        <span>Nível de Maturidade: ${maturity.level}</span>
                    </div>
                    <p>${getMaturityText(maturity.level)}</p>
                </div>
            `;
            reportResultsContainer.innerHTML += cardHTML;
        });

        navigateToScreen(reportScreen);
    };
    
    // Função auxiliar para gerar o texto descritivo do relatório
    const getMaturityText = (level) => {
        if (level === 'ALTO') return 'Esta é uma área de força. Seu foco em excelência aqui é um diferencial competitivo.';
        if (level === 'MÉDIO') return 'Há uma base sólida, mas otimizações estratégicas podem destravar um novo potencial de crescimento.';
        return 'Esta área merece atenção prioritária. Fortalecê-la pode mitigar riscos e impulsionar seus resultados.';
    };


    // Evento de clique no botão "Iniciar Diagnóstico"
    if (startBtn) {
        startBtn.addEventListener('click', () => {
            navigateToScreen(questionScreen);
            showQuestion(currentQuestionIndex);
        });
    }

});
