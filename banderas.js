        let countries = [];
        let currentCountry = null;
        let score = 0;
        let totalQuestions = 0;
        let usedCountries = [];
        let gameHistory = JSON.parse(localStorage.getItem('flagGameHistory')) || [];
        const API_URL = "https://restcountries.com/v3.1/all";

        let currentGameStats = {
            correct: 0,
            incorrect: 0,
            total: 0,
            startTime: null,
            username: 'admin' 
        };

        const flagImage = document.getElementById('flag-image');
        const optionsContainer = document.getElementById('options-container');
        const scoreElement = document.getElementById('score');
        const totalElement = document.getElementById('total');
        const feedbackElement = document.getElementById('feedback');
        const nextButton = document.getElementById('next-btn');
        const endButton = document.getElementById('end-btn');
        const difficultySelect = document.getElementById('difficulty');
        const historyEntries = document.getElementById('history-entries');

        async function initGame() {
            try {
                const response = await fetch(API_URL);
                countries = await response.json();
                startGame();
                displayGameHistory();
            } catch (error) {
                console.error("Error al cargar países:", error);
                alert("Error al cargar los datos. Por favor recarga la página.");
            }
        }

        function startGame() {
            score = 0;
            totalQuestions = 0;
            usedCountries = [];
            currentGameStats = { 
                correct: 0, 
                incorrect: 0, 
                total: 0, 
                startTime: null,
                username: 'admin'
            };
            updateScore();
            nextFlag();
        }

        function nextFlag() {
            if (nextButton.style.display === 'none' && currentGameStats.total === 0) {
                currentGameStats.startTime = new Date();
            }

            feedbackElement.textContent = '';
            feedbackElement.className = 'feedback';
            nextButton.style.display = 'none';

            let filteredCountries = filterCountriesByDifficulty();

            let availableCountries = filteredCountries.filter(c => !usedCountries.includes(c.cca2));
            
            if (availableCountries.length === 0) {
                usedCountries = [];
                availableCountries = filteredCountries;
            }

            currentCountry = availableCountries[Math.floor(Math.random() * availableCountries.length)];
            usedCountries.push(currentCountry.cca2);

            flagImage.src = currentCountry.flags.svg;
            flagImage.alt = `Bandera de ${currentCountry.name.common}`;

            generateOptions(currentCountry, filteredCountries);
            totalQuestions++;
            updateScore();
        }

        function filterCountriesByDifficulty() {
            const difficulty = difficultySelect.value;
            let countryCount = 250; 
            
            if (difficulty === 'easy') countryCount = 10;
            else if (difficulty === 'medium') countryCount = 25;
            else if (difficulty === 'hard') countryCount = 50;
            
            return [...countries]
                .sort(() => 0.5 - Math.random())
                .slice(0, countryCount);
        }

        function generateOptions(correctCountry, countryList) {
            optionsContainer.innerHTML = '';
            
            let options = [correctCountry];
            while (options.length < 4) {
                const randomCountry = countryList[Math.floor(Math.random() * countryList.length)];
                if (!options.includes(randomCountry)) {
                    options.push(randomCountry);
                }
            }
            options = options.sort(() => 0.5 - Math.random());

            options.forEach(country => {
                const button = document.createElement('button');
                button.className = 'option-btn';
                button.textContent = country.name.common;
                button.addEventListener('click', () => checkAnswer(country));
                optionsContainer.appendChild(button);
            });
        }

        function checkAnswer(selectedCountry) {
            document.querySelectorAll('.option-btn').forEach(btn => {
                btn.disabled = true;
                if (btn.textContent === currentCountry.name.common) {
                    btn.style.backgroundColor = '#0f9d58'; 
                } else if (btn.textContent === selectedCountry.name.common && selectedCountry !== currentCountry) {
                    btn.style.backgroundColor = '#db4437'; 
                }
            });

            const isCorrect = selectedCountry === currentCountry;
            if (isCorrect) {
                score++;
                feedbackElement.textContent = '¡Correcto! ✅';
                feedbackElement.className = 'feedback correct';
            } else {
                feedbackElement.textContent = `Incorrecto. Era ${currentCountry.name.common} ❌`;
                feedbackElement.className = 'feedback incorrect';
                
                document.querySelector('.game-container').style.animation = 'shake 0.5s';
                setTimeout(() => {
                    document.querySelector('.game-container').style.animation = '';
                }, 500);
            }

            currentGameStats.total++;
            if (isCorrect) {
                currentGameStats.correct++;
            } else {
                currentGameStats.incorrect++;
            }

            nextButton.style.display = 'inline-block';
            updateScore();
        }

        function endGame() {
            if (currentGameStats.total > 0) {
                saveGameResults();
            }
            startGame();
        }

        function saveGameResults() {
            const now = new Date();
            const accuracy = currentGameStats.total > 0 
                ? (currentGameStats.correct / currentGameStats.total * 100).toFixed(1)
                : 0;

            const gameResult = {
                date: now.toLocaleString('es-ES'),
                username: currentGameStats.username,
                correct: currentGameStats.correct,
                incorrect: currentGameStats.incorrect,
                accuracy: accuracy,
                timestamp: now.getTime()
            };

            gameHistory.unshift(gameResult);
            gameHistory = gameHistory.slice(0, 10);
            localStorage.setItem('flagGameHistory', JSON.stringify(gameHistory));
            displayGameHistory();
        }

        function displayGameHistory() {
            historyEntries.innerHTML = '';

            if (gameHistory.length === 0) {
                historyEntries.innerHTML = '<p>No hay partidas registradas aún.</p>';
                return;
            }

            gameHistory.forEach(game => {
                const entry = document.createElement('div');
                entry.className = 'history-entry';
                entry.innerHTML = `
                    🕒 ${game.date} | 👤 ${game.username} | 
                    ✅ Aciertos: ${game.correct} | ❌ Fallos: ${game.incorrect} | 
                    📊 ${game.accuracy}%
                `;
                historyEntries.appendChild(entry);
            });
        }

        function updateScore() {
            scoreElement.textContent = score;
            totalElement.textContent = totalQuestions;
        }

        nextButton.addEventListener('click', nextFlag);
        endButton.addEventListener('click', endGame);
        difficultySelect.addEventListener('change', startGame);

        document.addEventListener('DOMContentLoaded', initGame);