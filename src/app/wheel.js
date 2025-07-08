// Funcionalidad de la ruleta
let currentTopic = null;

const canvas = document.getElementById("wheelCanvas");
const ctx = canvas.getContext("2d");

// Función para ajustar el tamaño del canvas según el viewport
function resizeCanvas() {
  const container = canvas.parentElement;
  const maxSize = Math.min(container.clientWidth - 40, 600);

  canvas.width = maxSize;
  canvas.height = maxSize;

  // Redibujar la ruleta con el nuevo tamaño
  drawWheel();
}

// Ajustar tamaño inicial y en cambios de ventana
window.addEventListener("resize", resizeCanvas);

function drawWheel() {
  const radius = canvas.width / 2;
  const angleStep = (2 * Math.PI) / topics.length;

  for (let i = 0; i < topics.length; i++) {
    const start = i * angleStep;
    const end = start + angleStep;

    // Segmento de color
    ctx.beginPath();
    ctx.moveTo(radius, radius);
    ctx.fillStyle = `hsl(${(i * 360) / topics.length}, 70%, 60%)`;
    ctx.arc(radius, radius, radius, start, end);
    ctx.fill();

    // Línea separadora
    ctx.beginPath();
    ctx.moveTo(radius, radius);
    ctx.lineTo(
      radius + radius * Math.cos(start),
      radius + radius * Math.sin(start)
    );
    ctx.strokeStyle = "#fff";
    ctx.lineWidth = 2;
    ctx.stroke();

    // Texto del tema
    ctx.save();
    ctx.translate(radius, radius);
    ctx.rotate(start + angleStep / 2);
    ctx.textAlign = "center";
    ctx.fillStyle = "#000";

    // Calcular el tamaño de fuente óptimo basado en el espacio disponible
    const text = topics[i];
    const maxWidth = radius * 0.7; // Ancho máximo del texto
    const maxHeight = radius * 0.3; // Alto máximo disponible

    // Probar diferentes tamaños de fuente
    let fontSize = 24;
    let lines = [];
    let lineHeight = 0;

    while (fontSize > 12) {
      ctx.font = `bold ${fontSize}px Arial`;
      lineHeight = fontSize * 1.2;

      // Dividir texto en líneas
      const words = text.split(" ");
      lines = [];
      let currentLine = "";

      for (let word of words) {
        const testLine = currentLine + (currentLine ? " " : "") + word;
        const metrics = ctx.measureText(testLine);

        if (metrics.width > maxWidth && currentLine) {
          lines.push(currentLine);
          currentLine = word;
        } else {
          currentLine = testLine;
        }
      }
      if (currentLine) {
        lines.push(currentLine);
      }

      // Verificar si cabe en el alto disponible
      const totalHeight = lines.length * lineHeight;
      if (totalHeight <= maxHeight) {
        break; // Encontramos el tamaño óptimo
      }

      fontSize -= 2; // Reducir tamaño y probar de nuevo
    }

    // Dibujar líneas de texto
    const totalHeight = lines.length * lineHeight;
    const startY = -totalHeight / 2 + lineHeight / 2;

    for (let j = 0; j < lines.length; j++) {
      ctx.fillText(lines[j], radius * 0.45, startY + j * lineHeight);
    }

    ctx.restore();
  }
}

function spinWheel() {
  const spinDuration = 4000;
  const spins = 4 + Math.random() * 4;
  const anglePerSlice = (2 * Math.PI) / topics.length;
  let angle = 0;
  const start = performance.now();

  // Seleccionar un tema aleatorio
  let finalIndex = Math.floor(Math.random() * topics.length);

  // Ajuste de desfase: restar un pequeño offset
  const offset = anglePerSlice / 2;
  let targetAngle = finalIndex * anglePerSlice + anglePerSlice / 2 - offset;
  let finalAngle = 2 * Math.PI * spins - targetAngle;

  function animate(time) {
    const elapsed = time - start;
    const progress = Math.min(elapsed / spinDuration, 1);
    const eased = 1 - Math.pow(1 - progress, 4);
    angle = eased * finalAngle;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.rotate(angle);
    ctx.translate(-canvas.width / 2, -canvas.height / 2);
    drawWheel();
    ctx.restore();

    if (progress < 1) {
      requestAnimationFrame(animate);
    } else {
      // Compensar el centrado del segmento usando Math.floor y + anglePerSlice/2 - offset
      const normalizedAngle =
        ((angle % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);
      const selectedIndex =
        Math.floor(
          ((2 * Math.PI - normalizedAngle + anglePerSlice / 2 - offset) %
            (2 * Math.PI)) /
            anglePerSlice
        ) % topics.length;
      const selected = topics[selectedIndex];
      currentTopic = selected;
      speak(`El tema es: ${selected}`);
      // Mostrar modal después de 0.5 segundos
      setTimeout(() => showModal(selected), 500);
    }
  }

  requestAnimationFrame(animate);
}

// Función para obtener el tema actual
function getCurrentTopic() {
  return currentTopic;
}

// Inicializar la ruleta
resizeCanvas();
