document.addEventListener('DOMContentLoaded', () => {
    const toggleBtn = document.getElementById('toggle-btn');
    const inputContainer = document.getElementById('input-container');
    const iconContainer = document.getElementById('icon-container');
    const wrongAnswerMessage = document.getElementById('wrong-answer-message');
    const stageCompleteMessage = document.getElementById('stage-complete-message');
    const allStagesCompleteMessage = document.getElementById('all-stages-complete-message');
    const status = document.getElementById('status');

    let currentStage = 0;
    let currentVariation = 0;
    let canSubmit = true;

    // Load sounds
    const wrongSound = new Audio('wrong.mp3');
    wrongSound.preload = 'auto';
    wrongSound.volume = 0.5;

    const stageCompleteSound = new Audio('stage_complete.mp3');
    stageCompleteSound.preload = 'auto';
    stageCompleteSound.volume = 0.5;

    const gameCompleteSound = new Audio('game_complete.mp3');
    gameCompleteSound.preload = 'auto';
    gameCompleteSound.volume = 0.5;

    // Stage variations
    const stages = [
        // Stage 1: Clock
        [
            { icons: ['clock1.png', 'clock2.png', 'clock3.png'], answer: '12:34' },
            { icons: ['clock1.png', 'clock3.png', 'clock2.png'], answer: '17:35' },
            { icons: ['clock2.png', 'clock1.png', 'clock3.png'], answer: '09:12' },
            { icons: ['clock2.png', 'clock3.png', 'clock1.png'], answer: '09:13' },
            { icons: ['clock3.png', 'clock1.png', 'clock2.png'], answer: '23:17' },
            { icons: ['clock3.png', 'clock2.png', 'clock1.png'], answer: '03:32' }
        ],
        // Stage 2: Calendar
        [
            { icons: ['calendar1.png', 'calendar2.png', 'calendar3.png'], answer: '04.02.2003' },
            { icons: ['calendar1.png', 'calendar3.png', 'calendar2.png'], answer: '22.02.2022' },
            { icons: ['calendar2.png', 'calendar1.png', 'calendar3.png'], answer: '10.06.2025' },
            { icons: ['calendar2.png', 'calendar3.png', 'calendar1.png'], answer: '26.04.1986' },
            { icons: ['calendar3.png', 'calendar1.png', 'calendar2.png'], answer: '08.03.2013' },
            { icons: ['calendar3.png', 'calendar2.png', 'calendar1.png'], answer: '10.09.2001' }
        ],
        // Stage 3: Color
        [
            { icons: ['color1.png', 'color2.png', 'color3.png'], answer: '#32a852' },
            { icons: ['color1.png', 'color3.png', 'color2.png'], answer: '#4032a8' },
            { icons: ['color2.png', 'color1.png', 'color3.png'], answer: '#a87132' },
            { icons: ['color2.png', 'color3.png', 'color1.png'], answer: '#a83232' },
            { icons: ['color3.png', 'color1.png', 'color2.png'], answer: '#0a3d24' },
            { icons: ['color3.png', 'color2.png', 'color1.png'], answer: '#e6e3be' }
        ],
        // Stage 4: Camera (Text input)
        [
            { icons: ['camera1.png', 'camera2.png', 'camera3.png'], answer: 'майнкрафт' },
            { icons: ['camera1.png', 'camera3.png', 'camera2.png'], answer: 'горбатая гора' },
            { icons: ['camera2.png', 'camera1.png', 'camera3.png'], answer: 'пила 3' },
            { icons: ['camera2.png', 'camera3.png', 'camera1.png'], answer: 'бруталист' },
            { icons: ['camera3.png', 'camera1.png', 'camera2.png'], answer: 'жмурки' },
            { icons: ['camera3.png', 'camera2.png', 'camera1.png'], answer: 'смешарики начало' }
        ]
    ];

    function loadStage() {
        currentVariation = Math.floor(Math.random() * stages[currentStage].length);
        const variation = stages[currentStage][currentVariation];
        document.getElementById('icon1').src = variation.icons[0];
        document.getElementById('icon2').src = variation.icons[1];
        document.getElementById('icon3').src = variation.icons[2];
        status.textContent = `Этап ${currentStage + 1}`;
        inputContainer.innerHTML = '';
        inputContainer.style.display = 'none';
        toggleBtn.textContent = 'Открыть';
        canSubmit = true;
        wrongAnswerMessage.classList.remove('show');
        stageCompleteMessage.classList.remove('show');
        allStagesCompleteMessage.classList.remove('show');

        // Set up input based on stage
        if (currentStage === 0) {
            // Clock input
            inputContainer.innerHTML = `
                <input type="text" id="time-input" placeholder="Введите время (чч:мм)" maxlength="5">
                <button id="submit-btn">Отправить</button>
            `;
        } else if (currentStage === 1) {
            // Calendar input
            inputContainer.innerHTML = `
                <input type="text" id="date-input" placeholder="Введите дату (дд.мм.гггг)" maxlength="10">
                <button id="submit-btn">Отправить</button>
            `;
        } else if (currentStage === 2) {
            // Color input
            inputContainer.innerHTML = `
                <input type="text" id="color-input" placeholder="Введите код цвета (#xxxxxx)" maxlength="7">
                <button id="submit-btn">Отправить</button>
            `;
        } else if (currentStage === 3) {
            // Text input
            inputContainer.innerHTML = `
                <input type="text" id="text-input" placeholder="Введите название фильма">
                <button id="submit-btn">Отправить</button>
            `;
        }

        const submitBtn = document.getElementById('submit-btn');
        if (submitBtn) {
            submitBtn.addEventListener('click', checkAnswer);
            const input = inputContainer.querySelector('input');
            input.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') checkAnswer();
            });
        }
    }

    function checkAnswer() {
        if (!canSubmit) return;
        canSubmit = false;
        const variation = stages[currentStage][currentVariation];
        let input;
        let userAnswer;

        if (currentStage === 0) {
            input = document.getElementById('time-input');
            userAnswer = input.value.trim();
        } else if (currentStage === 1) {
            input = document.getElementById('date-input');
            userAnswer = input.value.trim();
        } else if (currentStage === 2) {
            input = document.getElementById('color-input');
            userAnswer = input.value.trim().toLowerCase();
        } else if (currentStage === 3) {
            input = document.getElementById('text-input');
            userAnswer = input.value.trim().toLowerCase();
        }

        if (userAnswer === variation.answer.toLowerCase()) {
            stageCompleteSound.currentTime = 0;
            stageCompleteSound.play().catch(error => console.error('Error playing stage complete sound:', error));
            stageCompleteMessage.classList.add('show');
            setTimeout(() => {
                stageCompleteMessage.classList.remove('show');
                currentStage++;
                if (currentStage >= stages.length) {
                    gameCompleteSound.currentTime = 0;
                    gameCompleteSound.play().catch(error => console.error('Error playing game complete sound:', error));
                    allStagesCompleteMessage.classList.add('show');
                    setTimeout(() => {
                        allStagesCompleteMessage.classList.remove('show');
                        currentStage = 0;
                        loadStage();
                    }, 5000);
                } else {
                    loadStage();
                }
            }, 3000);
        } else {
            wrongSound.currentTime = 0;
            wrongSound.play().catch(error => console.error('Error playing wrong sound:', error));
            wrongAnswerMessage.classList.add('show');
            setTimeout(() => {
                wrongAnswerMessage.classList.remove('show');
                currentStage = 0; // Reset to Stage 1
                currentVariation = Math.floor(Math.random() * stages[currentStage].length);
                loadStage();
            }, 2000);
        }
    }

    toggleBtn.addEventListener('click', () => {
        if (inputContainer.style.display === 'none') {
            inputContainer.style.display = 'block';
            toggleBtn.textContent = 'Закрыть';
        } else {
            inputContainer.style.display = 'none';
            toggleBtn.textContent = 'Открыть';
        }
    });

    // Initialize game
    loadStage();
});