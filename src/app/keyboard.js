// Control de acciones por teclado

document.addEventListener("keydown", function (e) {
  const overlay = document.getElementById("modal-overlay");
  const isModalOpen = overlay && overlay.style.display === "flex";

  // Mute/desmute con 'm'
  if (e.key === "m" || e.key === "M") {
    const bgMusic = document.getElementById("bgMusic");
    if (bgMusic.paused) {
      bgMusic.play();
    } else {
      bgMusic.pause();
    }
    e.preventDefault();
  }

  // Cerrar modal con 'x'
  if ((e.key === "x" || e.key === "X") && isModalOpen) {
    const closeBtn = document.getElementById("closeModalBtn");
    if (closeBtn) closeBtn.click();
    e.preventDefault();
  }

  // Barra espaciadora
  if (e.code === "Space") {
    if (isModalOpen) {
      // Seleccionar tarjeta en el modal
      const modalCardDeck = document.getElementById("modal-cardDeck");
      if (modalCardDeck) modalCardDeck.click();
    } else {
      // Girar la rueda
      const spinBtn = document.getElementById("spinButton");
      if (spinBtn) spinBtn.click();
    }
    e.preventDefault();
  }
});
