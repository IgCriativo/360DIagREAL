document.addEventListener('DOMContentLoaded', function() {
    const questionnaire = [
        {
            module: "Fundamentos & Estratégia",
            icon: "fa-solid fa-flag-checkered",
            question: "Qual frase melhor descreve o estágio atual do seu negócio?",
            options: [
                { text: "Estamos no início, validando o modelo de negócio.", score: 1 },
                { text: "Temos uma base de clientes, mas buscamos estabilidade.", score: 2 },
                { text: "Estamos estáveis e prontos para escalar.", score: 3 }
            ]
        },
        {
            module: "Fundamentos & Estratégia",
            icon: "fa-solid fa-flag-checkered",
            question: "A sua visão de futuro para a empresa é clara e compartilhada com a equipe?",
            options: [
                { text: "Sim, é a nossa principal diretriz.", score: 3 },
                { text: "Existe, mas poderia ser melhor comunicada.", score: 2 }
            ]
        },
        {
            module: "Operações & Eficiência",
            icon: "fa-solid fa-gears",
            question: "Seus processos-chave dependem mais de pessoas específicas ou de sistemas bem definidos?",
            options: [
                { text: "Dependemos muito de pessoas-chave.", score: 1 },
                { text: "Temos um balanço, mas buscamos mais sistemas.", score: 2 },
                { text: "Nossos sistemas garantem a continuidade.", score: 3 }
            ]
        },
        {
            module: "Operações & Eficiência",
            icon: "fa-solid fa-gears",
            question: "Você utiliza tecnologia para automatizar tarefas e obter dados para decisão?",
            options: [
                { text: "Sim, é uma parte central da nossa operação.", score: 3 },
                { text: "Pouco ou nada, ainda somos muito manuais.", score: 1 }
            ]
        },
        {
            module: "Saúde Financeira",
            icon: "fa-solid fa-chart-pie",
            question: "Você tem clareza sobre qual parte da sua operação gera mais lucro?",
            options: [
                { text: "Sim, monitoro a rentabilidade por produto/serviço.", score: 3 },
                { text: "Tenho uma ideia geral, mas não dados precisos.", score: 2 },
                { text: "Não, foco apenas no faturamento total.", score: 1 }
            ]
        },
        {
            module: "Saúde Financeira",
            icon: "fa-solid fa-chart-pie",
            question: "Como você descreveria o controle do seu fluxo de caixa?",
            options: [
                { text: "Rigoroso, com projeções futuras.", score: 3 },
                { text: "Básico, apenas controlando entradas e saídas.", score: 2 }
            ]
        },
        {
            module: "Jurídico & Riscos",
            icon: "fa-solid fa-gavel",
            question: "Seus contratos (com clientes, fornecedores, sócios) foram elaborados ou revisados por um especialista?",
            options: [
                { text: "Sim, todos são customizados para nossa proteção.", score: 3 },
                { text: "Não, utilizamos modelos padrão da internet.", score: 1 }
            ]
        },
        {
            module: "Jurídico & Riscos",
            icon: "fa-solid fa-gavel",
            question: "Sua empresa possui um plano para lidar com possíveis disputas ou conflitos?",
            options: [
                { text: "Sim, temos cláusulas de mediação e um plano de ação.", score: 3 },
                { text: "Não, resolvemos os problemas conforme aparecem.", score: 1 }
            ]
        },
        {
            module: "Crescimento & Futuro",
            icon: "fa-solid fa-rocket",
            question: "Qual o principal obstáculo que impede sua empresa de crescer mais rápido hoje?",
            options: [
                { text: "Falta de processos escaláveis.", score: 1 },
                { text: "Insegurança jurídica ou riscos não gerenciados.", score: 2 },
                { text: "Dificuldade em planejar os próximos passos.", score: 3 }
            ]
        }
    ];

    let currentQuestionIndex = 0;
    const userAnswers = {};

    const screens = {
        welcome: document.getElementById('welcome-screen'),
        questionnaire: document.getElementById('questionnaire-screen'),
        report: document.getElementById('report-screen')
    };
    
    const startBtn = document.getElementById('start-btn');
    const progressBar = document.getElementById('progress-bar');
    const questionContainer = document.getElementById('question-slide-container');
    const reportResultsContainer = document.getElementById('report-results');
    
    function switchScreen(hideScreen, showScreen) {
        if (hideScreen) hideScreen.classList.add('exiting');
        
        setTimeout(() => {
            if (hideScreen) {
                hideScreen.classList.remove('active');
                hideScreen.classList.remove('exiting');
            }
            if (showScreen) showScreen.classList.add('active');
        }, 500);
    }

    function renderQuestion() {
        if (currentQuestionIndex >= questionnaire.length) {
            generateReport();
            return;
        }
        const questionData = questionnaire[currentQuestionIndex];
        const slide = document.createElement('div');
        slide.className = 'question-slide';
        let optionsHTML = '';
        questionData.options.forEach((option, index) => {
            optionsHTML += `<div class="answer-option" data-score="${option.score}">${option.text}</div>`;
        });
        slide.innerHTML = `<i class="module-icon ${questionData.icon}"></i><h2 class="question-text">${questionData.question}</h2><div class="answer-options">${optionsHTML}</div>`;
        questionContainer.innerHTML = '';
        questionContainer.appendChild(slide);
        document.querySelectorAll('.answer-option').forEach(option => {
            option.addEventListener('click', handleAnswerClick);
        });
        const progress = ((currentQuestionIndex) / questionnaire.length) * 100;
        progressBar.style.width = `${progress}%`;
    }

    function handleAnswerClick(event) {
        const selectedOption = event.currentTarget;
        const score = parseInt(selectedOption.dataset.score, 10);
        userAnswers[currentQuestionIndex] = score;
        selectedOption.classList.add('selected');
        const oldSlide = document.querySelector('.question-slide');
        if (oldSlide) { oldSlide.classList.add('slide-out'); }
        setTimeout(() => {
            currentQuestionIndex++;
            renderQuestion();
        }, 500);
    }

    function generateReport() {
        progressBar.style.width = `100%`;
        switchScreen(screens.questionnaire, screens.report);

        const modules = {};
        questionnaire.forEach((q, index) => {
            if (!modules[q.module]) {
                modules[q.module] = { scores: [], icon: q.icon };
            }
            if (userAnswers[index] !== undefined) {
                modules[q.module].scores.push(userAnswers[index]);
            }
        });
        
        reportResultsContainer.innerHTML = '';
        for (const moduleName in modules) {
            const moduleData = modules[moduleName];
            const avgScore = moduleData.scores.reduce((a, b) => a + b, 0) / moduleData.scores.length;
            let feedback = '', level = '', levelClass = '', statusIcon = '';

            if (avgScore >= 2.7) {
                level = "ALTO"; levelClass = "high"; statusIcon = "fa-solid fa-circle-check";
                feedback = "Esta é uma área de força. Seu foco em excelência aqui é um diferencial competitivo.";
            } else if (avgScore >= 1.8) {
                level = "MÉDIO"; levelClass = "medium"; statusIcon = "fa-solid fa-triangle-exclamation";
                feedback = "Há uma base sólida, mas otimizações estratégicas podem destravar um novo potencial de crescimento.";
            } else {
                level = "BAIXO"; levelClass = "low"; statusIcon = "fa-solid fa-circle-xmark";
                feedback = "Esta área merece atenção prioritária. Fortalecê-la pode mitigar riscos e impulsionar seus resultados.";
            }
            
            reportResultsContainer.innerHTML += `
                <div class="report-section">
                    <div class="report-section-header">
                        <i class="${moduleData.icon}"></i>
                        <h3>${moduleName}</h3>
                    </div>
                    <p class="level ${levelClass}"><i class="${statusIcon}"></i> Nível de Maturidade: ${level}</p>
                    <p>${feedback}</p>
                </div>`;
        }
    }

    if (startBtn) {
        startBtn.addEventListener('click', () => {
            switchScreen(screens.welcome, screens.questionnaire);
            setTimeout(renderQuestion, 200);
        });
    }
});
