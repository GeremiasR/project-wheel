// Funciones principales y utilidades
function speak(text) {
  const msg = new SpeechSynthesisUtterance();
  msg.text = text;
  msg.lang = "es-ES";
  window.speechSynthesis.speak(msg);
}

// Mostrar modal de tema y cartas
function showModal(theme) {
  const overlay = document.getElementById("modal-overlay");
  const modalTheme = document.getElementById("modal-theme");
  const modalCardDeck = document.getElementById("modal-cardDeck");
  const modalQuestion = document.getElementById("modal-question");
  const cardsSection = document.getElementById("cards-section");

  modalTheme.textContent = `🎯 Tema: ${theme}`;
  modalQuestion.textContent = "";
  modalQuestion.classList.remove("has-text", "loading");

  // Ocultar sección de cartas normal
  if (cardsSection) cardsSection.style.display = "none";

  // Limpiar cartas voladoras previas
  const modalCardArea = document.getElementById("modal-cardArea");
  Array.from(modalCardArea.getElementsByClassName("fly-card")).forEach((card) =>
    card.remove()
  );

  // Mostrar modal
  overlay.style.display = "flex";

  // Animación y selección de carta en el modal
  modalCardDeck.onclick = function () {
    // Mostrar spinner de carga
    modalQuestion.textContent = "";
    modalQuestion.classList.remove("has-text");
    modalQuestion.classList.add("loading");
    // Animación de cartas volando
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
      modalCardArea.appendChild(card);
      setTimeout(() => card.remove(), 2000);
    }
    setTimeout(() => {
      const available = questions[theme].slice();
      const question = available[Math.floor(Math.random() * available.length)];
      modalQuestion.textContent = `📣 ${question}`;
      modalQuestion.classList.remove("loading");
      modalQuestion.classList.add("has-text");
      speak(question);
    }, 1700);
  };
}

function hideModal() {
  document.getElementById("modal-overlay").style.display = "none";
  const cardsSection = document.getElementById("cards-section");
  if (cardsSection) cardsSection.style.display = "";
}

// Configuración inicial
document.addEventListener("DOMContentLoaded", function () {
  // Configurar volumen de música y reproducir automáticamente
  const bgMusic = document.getElementById("bgMusic");
  bgMusic.volume = 0.2;

  // Intentar reproducir música automáticamente (requiere interacción del usuario)
  bgMusic.play().catch(function (error) {
    console.log(
      "La música se reproducirá cuando el usuario interactúe con la página"
    );
  });

  // Agregar event listener al botón de girar ruleta
  document.getElementById("spinButton").addEventListener("click", spinWheel);

  // Agregar event listeners para los botones de música
  document
    .getElementById("playMusicBtn")
    .addEventListener("click", function () {
      bgMusic.play().catch(function (error) {
        console.log("Error al reproducir música:", error);
      });
    });

  document
    .getElementById("pauseMusicBtn")
    .addEventListener("click", function () {
      bgMusic.pause();
    });

  // Intentar reproducir música en la primera interacción del usuario
  document.addEventListener(
    "click",
    function () {
      bgMusic.play().catch(function (error) {
        console.log("Error al reproducir música:", error);
      });
    },
    { once: true }
  );

  // Cerrar modal
  document.getElementById("closeModalBtn").addEventListener("click", hideModal);
  document
    .getElementById("modal-overlay")
    .addEventListener("click", function (e) {
      if (e.target === this) hideModal();
    });
});
