   const sentences = {
      español: ["Buenos días", "Me gusta el chocolate", "¿Cómo estás?"],
      inglés: ["Good morning", "I like chocolate", "How are you?"],
      francés: ["Bonjour", "J'aime le chocolat", "Comment ça va ?"],
      alemán: ["Guten Morgen", "Ich mag Schokolade", "Wie geht's dir?"],
      italiano: ["Buongiorno", "Mi piace il cioccolato", "Come stai?"],
      portugués: ["Bom dia", "Gosto de chocolate", "Tudo bem?"],
      japonés: ["おはよう", "チョコレートが好き", "元気ですか？"],
      chino: ["早上好", "我喜欢巧克力", "你好吗？"],
      ruso: ["Доброе утро", "Я люблю шоколад", "Как дела?"],
      árabe: ["صباح الخير", "أنا أحب الشوكولاتة", "كيف حالك؟"],
      hindi: ["सुप्रभात", "मुझे चॉकलेट पसंद है", "कैसे हो?"],
      coreano: ["좋은 아침", "나는 초콜릿을 좋아해", "잘 지냈어?"],
      griego: ["Καλημέρα", "Μου αρέσει η σοκολάτα", "Τι κάνεις;"],
      turco: ["Günaydın", "Çikolatayı severim", "Nasılsın?"],
      sueco: ["God morgon", "Jag gillar choklad", "Hur mår du?"],
      noruego: ["God morgen", "Jeg liker sjokolade", "Hvordan har du det?"],
      danés: ["Godmorgen", "Jeg kan lide chokolade", "Hvordan går det?"],
      finlandés: ["Hyvää huomenta", "Pidän suklaasta", "Mitä kuuluu?"],
      neerlandés: ["Goedemorgen", "Ik hou van chocolade", "Hoe gaat het?"],
      polaco: ["Dzień dobry", "Lubię czekoladę", "Jak się masz?"],
      checo: ["Dobré ráno", "Mám rád čokoládu", "Jak se máš?"],
      húngaro: ["Jó reggelt", "Szeretem a csokoládét", "Hogy vagy?"],
      rumano: ["Bună dimineața", "Îmi place ciocolata", "Ce faci?"],
      ucraniano: ["Доброго ранку", "Я люблю шоколад", "Як справи?"],
      hebreo: ["בוקר טוב", "אני אוהב שוקולד", "מה שלומך?"],
      tailandés: ["สวัสดีตอนเช้า", "ฉันชอบช็อกโกแลต", "คุณเป็นอย่างไรบ้าง?"],
      vietnamita: ["Chào buổi sáng", "Tôi thích sô cô la", "Bạn khỏe không?"],
      indonesio: ["Selamat pagi", "Saya suka cokelat", "Apa kabar?"],
      filipino: ["Magandang umaga", "Gusto ko ng tsokolate", "Kamusta ka?"],
      eslovaco: ["Dobré ráno", "Mám rád čokoládu", "Ako sa máš?"]
    };

    let aciertos = 0;
    let fallos = 0;
    let currentAnswer = "";
    let user = null;

    const phraseEl = document.getElementById("phrase");
    const optionsEl = document.getElementById("options");
    const scoreEl = document.getElementById("score");
    const feedbackEl = document.getElementById("feedback");
    const historyEl = document.getElementById("history");

    function updateScore() {
      scoreEl.textContent = `Aciertos: ${aciertos} | Fallos: ${fallos}`;
    }

function updateHistory() {
  if (!user || !user.nombre) {
    historyEl.innerHTML = "<strong>No hay usuario identificado.</strong>";
    return;
  }
  const userGames = JSON.parse(localStorage.getItem("games") || "{}");
  const partidas = userGames[user.nombre] || [];
  if (partidas.length === 0) {
    historyEl.innerHTML = "<strong>No hay partidas finalizadas aún.</strong>";
    return;
  }
  historyEl.innerHTML = "<strong>Partidas finalizadas:</strong><ul>" +
    partidas.slice(-5).reverse().map(p => `
      <li>
        🕒 ${p.fecha} | 👤 ${p.usuario} | ✅ Aciertos: ${p.aciertos} | ❌ Fallos: ${p.fallos} | 📊 ${p.porcentaje}
      </li>
    `).join("") +
    "</ul>";
}



function saveGame(finalizado = false) {
  const userGames = JSON.parse(localStorage.getItem('games') || '{}');
  const userKey = user.nombre;
  if (!userGames[userKey]) userGames[userKey] = [];

  const total = aciertos + fallos;
  const porcentaje = total > 0 ? ((aciertos / total) * 100).toFixed(1) : "0.0";

  if (finalizado) {
    userGames[userKey].push({
      usuario: user.nombre,
      fecha: new Date().toLocaleString(),
      aciertos,
      fallos,
      porcentaje: porcentaje + "%"
    });
    localStorage.setItem('games', JSON.stringify(userGames));
    updateHistory();
    aciertos = 0;
    fallos = 0;
    updateScore();
    feedbackEl.textContent = "🎉 Partida finalizada. ¡Buena suerte en la siguiente!";
  } else {
    localStorage.setItem('games', JSON.stringify(userGames));
  }
}


    function endGame() {
      if (aciertos === 0 && fallos === 0) {
        alert("Debes jugar al menos una ronda antes de finalizar la partida.");
        return;
      }
      saveGame(true);
    }

    function generateQuestion() {
      const langs = Object.keys(sentences);
      const randomLang = langs[Math.floor(Math.random() * langs.length)];
      const options = new Set([randomLang]);

      while (options.size < 4) {
        const random = langs[Math.floor(Math.random() * langs.length)];
        options.add(random);
      }

      const shuffledOptions = Array.from(options).sort(() => Math.random() - 0.5);
      currentAnswer = randomLang;
      const sentenceList = sentences[randomLang];
      const sentence = sentenceList[Math.floor(Math.random() * sentenceList.length)];
      phraseEl.textContent = sentence;

      optionsEl.innerHTML = "";
      shuffledOptions.forEach(opt => {
        const btn = document.createElement("button");
        btn.textContent = opt;
        btn.addEventListener("click", () => {
          if (opt === currentAnswer) {
            aciertos++;
            feedbackEl.textContent = "✅ ¡Correcto!";
          } else {
            fallos++;
            feedbackEl.textContent = `❌ Era ${currentAnswer}`;
          }
          updateScore();
          generateQuestion();
        });
        optionsEl.appendChild(btn);
      });
    }

document.addEventListener("DOMContentLoaded", () => {
  const storedUser = localStorage.getItem("currentUser");
  if (!storedUser) {
    window.location.href = "login.html";
    return;
  }43
  user = JSON.parse(storedUser);
  updateScore();
  updateHistory();
  generateQuestion();
});
