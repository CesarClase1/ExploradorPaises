        const capitals = [
            { country: "Portugal", capital: "Lisboa", x: 15, y: 85 },
            { country: "España", capital: "Madrid", x: 23, y: 82 },
            { country: "Francia", capital: "París", x: 32, y: 62 },
            { country: "Italia", capital: "Roma", x: 49, y: 79 },
            { country: "Alemania", capital: "Berlín", x: 43, y: 48 },
            { country: "Reino Unido", capital: "Londres", x: 27, y: 48 },
            { country: "Irlanda", capital: "Dublín", x: 17, y: 45 },
            { country: "Países Bajos", capital: "Ámsterdam", x: 36, y: 48 },
            { country: "Bélgica", capital: "Bruselas", x: 36, y: 53 },
            { country: "Luxemburgo", capital: "Luxemburgo", x: 38, y: 56 },
            { country: "Suiza", capital: "Berna", x: 40, y: 65 },
            { country: "Austria", capital: "Viena", x: 53, y: 61 },
            { country: "República Checa", capital: "Praga", x: 51, y: 57 },
            { country: "Polonia", capital: "Varsovia", x: 62, y: 49 },
            { country: "Dinamarca", capital: "Copenhague", x: 45, y: 35 },
            { country: "Suecia", capital: "Estocolmo", x: 57, y: 20 },
            { country: "Noruega", capital: "Oslo", x: 45, y: 20 },
            { country: "Finlandia", capital: "Helsinki", x: 65, y: 18 },
            { country: "Islandia", capital: "Reikiavik", x: 7, y: 11 },
            { country: "Estonia", capital: "Tallin", x: 70, y: 25 },
            { country: "Letonia", capital: "Riga", x: 68, y: 30 },
            { country: "Lituania", capital: "Vilna", x: 67, y: 37 },
            { country: "Bielorrusia", capital: "Minsk", x: 73, y: 43 },
            { country: "Ucrania", capital: "Kiev", x: 75, y: 54 },
            { country: "Moldavia", capital: "Chisináu", x: 74, y: 64 },
            { country: "Rumanía", capital: "Bucarest", x: 70, y: 68 },
            { country: "Bulgaria", capital: "Sofía", x: 67, y: 75 },
            { country: "Grecia", capital: "Atenas", x: 65, y: 87 },
            { country: "Albania", capital: "Tirana", x: 60, y: 82 },
            { country: "Macedonia del Norte", capital: "Skopie", x: 62, y: 79 },
            { country: "Serbia", capital: "Belgrado", x: 60, y: 69 },
            { country: "Croacia", capital: "Zagreb", x: 55, y: 69 },
            { country: "Eslovenia", capital: "Liubliana", x: 60, y: 59 },
            { country: "Hungría", capital: "Budapest", x: 60, y: 63 },
            { country: "Eslovaquia", capital: "Bratislava", x: 52, y: 67 },
            { country: "Bosnia y Herzegovina", capital: "Sarajevo", x: 57, y: 72 },
            { country: "Montenegro", capital: "Podgorica", x: 59, y: 75 },
            { country: "Chipre", capital: "Nicosia", x: 81, y: 96 },
            { country: "Malta", capital: "La Valeta", x: 51, y: 94 },
            { country: "Liechtenstein", capital: "Vaduz", x: 44, y: 64 },
            { country: "Mónaco", capital: "Mónaco", x: 39, y: 73 },
            { country: "San Marino", capital: "San Marino", x: 48, y: 72 },
            { country: "Ciudad del Vaticano", capital: "Ciudad del Vaticano", x: 48, y: 78 },
            { country: "Andorra", capital: "Andorra la Vieja", x: 30, y: 76 }
        ];

        let currentCapital = null;
        let score = { correct: 0, incorrect: 0 };
        let gameStarted = false;
        let usedCapitals = [];
        let toleranceRadius = 4; 
        let currentUser = null;

        const questionElement = document.getElementById('question');
        const feedbackElement = document.getElementById('feedback');
        const scoreElement = document.getElementById('score');
        const mapContainer = document.getElementById('map-container');
        const startBtn = document.getElementById('start-btn');
        const nextBtn = document.getElementById('next-btn');
        const endGameBtn = document.getElementById('end-game-btn');
        const mapImg = document.getElementById('europe-map');
        const toleranceInfo = document.getElementById('tolerance-info');
        const historyContainer = document.getElementById('history-container');
        const clearHistoryBtn = document.getElementById('clear-history-btn');
        const saveGameModal = document.getElementById('save-game-modal');
        const modalResultText = document.getElementById('modal-result-text');
        const saveGameBtn = document.getElementById('save-game-btn');
        const cancelSaveBtn = document.getElementById('cancel-save-btn');
        const usernameDisplay = document.getElementById('username-display');
        const logoutBtn = document.getElementById('logout-btn');
        const userInfoDiv = document.getElementById('user-info');

        function checkAuth() {
            const user = localStorage.getItem('currentUser');
            if (user) {
                currentUser = JSON.parse(user);
                usernameDisplay.textContent = currentUser.username;
                userInfoDiv.style.display = 'block';
                return true;
            } else {
                window.location.href = 'login.html';
                return false;
            }
        }

        function logout() {
            localStorage.removeItem('currentUser');
            window.location.href = 'login.html';
        }

        function initPage() {
            if (checkAuth()) {
                loadHistory();
            }
        }

        function selectRandomCapital() {
            if (usedCapitals.length === capitals.length) {
                usedCapitals = [];
                feedbackElement.textContent = "¡Has completado todas las capitales! Comenzando de nuevo.";
                feedbackElement.className = 'correct';
            }
            
            const availableCapitals = capitals.filter(c => 
                !usedCapitals.some(used => used.country === c.country && used.capital === c.capital)
            );
            
            const randomIndex = Math.floor(Math.random() * availableCapitals.length);
            currentCapital = availableCapitals[randomIndex];
            
            usedCapitals.push(currentCapital);
            
            questionElement.textContent = `Haz clic en la ubicación de: ${currentCapital.capital} (${currentCapital.country})`;
            
            feedbackElement.textContent = '';
            feedbackElement.className = '';
            
            nextBtn.style.display = 'none';
        }

        function updateQuestion() {
  if(currentIndex >= capitals.length) {
    countryEl.textContent = "¡Has terminado el juego!";
    inputEl.style.display = "none";
    checkBtn.style.display = "none";
    feedbackEl.textContent = "";
    progressEl.textContent = "";
    return;
  }
  countryEl.textContent = capitals[currentIndex].country;
  inputEl.value = "";
  inputEl.focus();
  feedbackEl.textContent = "";
  progressEl.textContent = `Pregunta ${currentIndex + 1} de ${capitals.length}`;
}

function checkAnswer() {
  const answer = inputEl.value.trim().toLowerCase();
  const correctAnswer = capitals[currentIndex].capital.toLowerCase();

  if (answer === "") {
    feedbackEl.textContent = "Por favor, escribe una capital.";
    feedbackEl.className = "incorrect";
    return;
  }

  if(answer === correctAnswer) {
    feedbackEl.textContent = "¡Correcto!";
    feedbackEl.className = "correct";
    currentIndex++;
    setTimeout(updateQuestion, 1200);
  } else {
    feedbackEl.textContent = `Incorrecto. Intenta otra vez.`;
    feedbackEl.className = "incorrect";
    inputEl.value = "";
    inputEl.focus();
  }
}


        function checkUserClick(clickX, clickY) {
            if (!currentCapital) return false;
            
            const distance = Math.sqrt(
                Math.pow(clickX - currentCapital.x, 2) + 
                Math.pow(clickY - currentCapital.y, 2)
            );
            
            return distance <= toleranceRadius;
        }

        function handleMapClick(e) {
            if (!gameStarted || !currentCapital) return;
            
            const rect = mapImg.getBoundingClientRect();
            const clickX = ((e.clientX - rect.left) / rect.width) * 100;
            const clickY = ((e.clientY - rect.top) / rect.height) * 100;
            
            const isCorrect = checkUserClick(clickX, clickY);
            
            if (isCorrect) {
                score.correct++;
                feedbackElement.textContent = "¡Correcto! Has acertado la ubicación.";
                feedbackElement.className = 'correct';
            } else {
                score.incorrect++;
                feedbackElement.textContent = "Incorrecto. Inténtalo de nuevo.";
                feedbackElement.className = 'incorrect';
            }
            
            updateScore();
            
            if (isCorrect) {
                nextBtn.style.display = 'inline-block';
                endGameBtn.style.display = 'inline-block';
            }
        }

        function updateScore() {
            scoreElement.textContent = `Aciertos: ${score.correct} | Fallos: ${score.incorrect}`;
        }

        function startGame() {
            gameStarted = true;
            score = { correct: 0, incorrect: 0 };
            usedCapitals = [];
            updateScore();
            selectRandomCapital();
            startBtn.textContent = "Reiniciar Juego";
            endGameBtn.style.display = 'inline-block';
        }

        function endGame() {
            if (score.correct === 0 && score.incorrect === 0) {
                alert("No has jugado ninguna partida todavía.");
                return;
            }
            
            modalResultText.textContent = `Aciertos: ${score.correct}, Fallos: ${score.incorrect}`;
            saveGameModal.style.display = 'flex';
        }

        function saveGameToHistory() {
            if (!currentUser) {
                alert("No se ha identificado al usuario.");
                saveGameModal.style.display = 'none';
                return;
            }
            
            const gameData = {
                userId: currentUser.id,
                username: currentUser.username,
                correct: score.correct,
                incorrect: score.incorrect,
                date: new Date().toISOString()
            };
            
            const history = JSON.parse(localStorage.getItem('gameHistory')) || [];
            
            history.push(gameData);
            
            localStorage.setItem('gameHistory', JSON.stringify(history));
            
            saveGameModal.style.display = 'none';
            
            loadHistory();
            
            startGame();
        }

        function loadHistory() {
            const history = JSON.parse(localStorage.getItem('gameHistory') || '[]');
            historyContainer.innerHTML = '';
            
            if (history.length === 0) {
                historyContainer.innerHTML = '<p>No hay partidas guardadas todavía.</p>';
                return;
            }
            
            const userHistory = history.filter(game => game.userId === currentUser.id);
            
            if (userHistory.length === 0) {
                historyContainer.innerHTML = '<p>No tienes partidas guardadas todavía.</p>';
                return;
            }
            
            userHistory.sort((a, b) => new Date(b.date) - new Date(a.date));
            
            userHistory.forEach(game => {
                const gameDate = new Date(game.date);
                const dateStr = gameDate.toLocaleDateString() + ' ' + gameDate.toLocaleTimeString();
                
                const gameElement = document.createElement('div');
                gameElement.className = 'history-item';
                gameElement.innerHTML = `
                    <div>
                        <span class="history-date">${dateStr}</span>
                    </div>
                    <div>
                        <span class="history-score history-correct">Aciertos: ${game.correct}</span>
                        <span class="history-score history-incorrect">Fallos: ${game.incorrect}</span>
                    </div>
                `;
                
                historyContainer.appendChild(gameElement);
            });
        }

        function clearHistory() {
            if (confirm("¿Estás seguro de que quieres borrar tu historial de partidas?")) {
                const history = JSON.parse(localStorage.getItem('gameHistory')) || [];
                
                const newHistory = history.filter(game => game.userId !== currentUser.id);
                
                localStorage.setItem('gameHistory', JSON.stringify(newHistory));
                loadHistory();
            }
        }

        function setupEvents() {
            startBtn.addEventListener('click', startGame);
            
            nextBtn.addEventListener('click', selectRandomCapital);
            
            endGameBtn.addEventListener('click', endGame);
            
            mapImg.addEventListener('click', handleMapClick);
            
            mapImg.addEventListener('error', function() {
                mapImg.src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA4MDAgNjUwIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ3aGl0ZSIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMjAiIGZpbGw9ImJsYWNrIj5NYXBhIGRlIEV1cm9wYSAobm8gc2UgY2FyZ8OzKTwvdGV4dD48L3N2Zz4=';
            });
            
            clearHistoryBtn.addEventListener('click', clearHistory);
            
            saveGameBtn.addEventListener('click', saveGameToHistory);
            
            cancelSaveBtn.addEventListener('click', function() {
                saveGameModal.style.display = 'none';
                startGame(); 
            });
            
            logoutBtn.addEventListener('click', logout);
        }

        window.addEventListener('DOMContentLoaded', function() {
            setupEvents();
            initPage();
        });

          updateQuestion();