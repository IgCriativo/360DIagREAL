document.addEventListener('DOMContentLoaded', function() {
    // --- Definição do Questionário (Simulando o Banco de Dados) ---
    const questionnaire = [
        {
            module: "Estratégia e Gestão",
            question: "Os objetivos estratégicos da sua empresa são claros e mensuráveis?",
            options: [
                { text: "Sim, e são revisados periodicamente.", score: 3 },
                { text: "Temos objetivos, mas não são claros para todos.", score: 2 },
                { text: "Não temos objetivos formais definidos.", score: 1 }
            ]
        },
        {
            module: "Eficiência Operacional",
            question: "Os processos internos da sua empresa são bem definidos e otimizados?",
            options: [
                { text: "Sim, são padronizados e buscamos melhoria contínua.", score: 3 },
                { text: "Alguns são, mas muitos dependem de pessoas específicas.", score: 2 },
                { text: "Não, operamos de forma reativa e apagando incêndios.", score: 1 }
            ]
        },
        {
            module: "Saúde Jurídica e Compliance",
            question: "Como você descreveria a gestão de contratos na sua empresa?",
            options: [
                { text: "Temos um processo robusto de criação, revisão e armazenamento.", score: 3 },
                { text: "Gerenciamos, mas de forma descentralizada e sem padrão.", score: 2 },
                { text: "Não há um processo formal, os contratos são tratados caso a caso.", score: 1 }
            ]
        },
        {
            module: "Gestão de Riscos",
            question: "Sua empresa identifica e planeja proativamente como mitigar riscos (operacionais, financeiros, legais)?",
            options: [
                { text: "Sim, temos um processo formal de gestão de riscos.", score: 3 },
                { text: "Identificamos riscos, mas de forma informal e reativa.", score: 2 },
                { text: "Não temos nenhuma prática de gestão de riscos.", score: 1 }
            ]
        }
    ];

    // --- Variáveis de Estado do Aplicativo ---
    let currentQuestionIndex = 0;
    const userAnswers = {};

    // --- Referências aos Elementos do DOM ---
    const screens = document.querySelectorAll('.app-screen');
    const startBtn = document.getElementById('start-btn');
    const nextBtn = document.getElementById('next-btn');
    const submitLeadBtn = document.getElementById('submit-lead-btn');

    const progressBar = document.getElementById('progress-bar');
    const moduleTitle = document.getElementById('module-title');
    const questionText = document.getElementById('question-text');
    const answerOptionsContainer = document.getElementById('answer-options');
    const reportResultsContainer = document.getElementById('report-results');

    // --- Funções do Aplicativo ---
    function showScreen(screenId) {
        screens.forEach(screen => {
            screen.classList.remove('active');
        });
        document.getElementById(screenId).classList.add('active');
    }

    function renderQuestion() {
        const currentQuestion = questionnaire[currentQuestionIndex];
        moduleTitle.textContent = currentQuestion.module;
        questionText.textContent = currentQuestion.question;

        answerOptionsContainer.innerHTML = '';
        currentQuestion.options.forEach((option, index) => {
            answerOptionsContainer.innerHTML += `
                <div>
                    <input type="radio" id="option${index}" name="answer" value="${option.score}">
                    <label for="option${index}">${option.text}</label>
                </div>
            `;
        });

        const progress = ((currentQuestionIndex + 1) / questionnaire.length) * 100;
        progressBar.style.width = `${progress}%`;
    }

    function generateReport() {
        reportResultsContainer.innerHTML = '';
        const modules = {};

        for (const key in userAnswers) {
            const question = questionnaire[key];
            if (!modules[question.module]) {
                modules[question.module] = { totalScore: 0, count: 0 };
            }
            modules[question.module].totalScore += userAnswers[key];
            modules[question.module].count++;
        }

        for (const moduleName in modules) {
            const avgScore = modules[moduleName].totalScore / modules[moduleName].count;
            let feedback = '';
            let level = '';

            if (avgScore >= 2.7) {
                feedback = "Excelente maturidade nesta área. Continue com as boas práticas e busque a inovação contínua.";
                level = "Nível de Maturidade: ALTO";
            } else if (avgScore >= 1.7) {
                feedback = "Área com bom potencial, mas existem oportunidades claras de melhoria para otimizar processos e reduzir riscos.";
                level = "Nível de Maturidade: MÉDIO (Ponto de Atenção)";
            } else {
                feedback = "Esta área representa um risco significativo e requer atenção estratégica urgente para garantir a segurança e o crescimento do negócio.";
                level = "Nível de Maturidade: BAIXO (Requer Análise Urgente)";
            }

            reportResultsContainer.innerHTML += `
                <div class="report-section">
                    <h3>${moduleName}</h3>
                    <p><strong>${level}</strong></p>
                    <p>${feedback}</p>
                </div>
            `;
        }
        showScreen('report-screen');
    }

    // --- Event Listeners ---
    if(startBtn) {
        startBtn.addEventListener('click', () => {
            renderQuestion();
            showScreen('questionnaire-screen');
        });
    }

    if(nextBtn) {
        nextBtn.addEventListener('click', () => {
            const selectedOption = document.querySelector('input[name="answer"]:checked');
            if (!selectedOption) {
                alert("Por favor, selecione uma opção.");
                return;
            }

            userAnswers[currentQuestionIndex] = parseInt(selectedOption.value, 10);

            currentQuestionIndex++;
            if (currentQuestionIndex < questionnaire.length) {
                renderQuestion();
            } else {
                showScreen('lead-capture-screen');
            }
        });
    }
    
    if(submitLeadBtn) {
        submitLeadBtn.addEventListener('click', () => {
             const userName = document.getElementById('user-name').value;
             const userEmail = document.getElementById('user-email').value;

             if (userName.trim() === '' || userEmail.trim() === '') {
                 alert('Por favor, preencha seu nome e e-mail.');
                 return;
             }
             console.log('Lead Capturado:', { name: userName, email: userEmail, answers: userAnswers });

             generateReport();
        });
    }
});
