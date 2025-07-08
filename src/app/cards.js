// Funcionalidad de las cartas
const usedQuestions = {};

function drawCard() {
  if (!getCurrentTopic()) {
    alert("Primero girá la ruleta para obtener un tema.");
    return;
  }

  const area = document.getElementById("cardArea");

  // Efecto de cartas volando
  for (let i = 0; i < 15; i++) {
    const card = document.createElement("div");
    card.classList.add("fly-card");
    const x = Math.floor(Math.random() * 400 - 200);
    const y = Math.floor(Math.random() * -300 - 100);
    const r = Math.floor(Math.random() * 720 - 360) + "deg";
    card.style.setProperty("--x", `${x}px`);
    card.style.setProperty("--y", `${y}px`);
    card.style.setProperty("--r", r);
    card.style.left = "0px";
    card.style.top = "0px";
    card.style.animationDelay = `${i * 0.05}s`;
    area.appendChild(card);
    setTimeout(() => card.remove(), 2000);
  }

  // Mostrar pregunta después del efecto
  setTimeout(() => {
    const currentTopic = getCurrentTopic();

    if (!usedQuestions[currentTopic]) {
      usedQuestions[currentTopic] = [];
    }

    const available = questions[currentTopic].filter(
      (q) => !usedQuestions[currentTopic].includes(q)
    );

    if (available.length === 0) {
      usedQuestions[currentTopic] = [];
    }

    const freshList = questions[currentTopic].filter(
      (q) => !usedQuestions[currentTopic].includes(q)
    );
    const question = freshList[Math.floor(Math.random() * freshList.length)];
    usedQuestions[currentTopic].push(question);

    document.getElementById("question").textContent = `📣 ${question}`;
    speak(question);
  }, 1700);
}
