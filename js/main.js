// Configuración: cambia aquí la fecha de la boda o el color de acento.
const CONFIG = {
  fechaBoda: '2026-09-12T13:00:00',
  colorAcento: '#5C705A',
  entradaAbiertaPorDefecto: false,
};

document.documentElement.style.setProperty('--acento', CONFIG.colorAcento);

// ---------- Cuenta atrás ----------

function actualizarCuentaAtras() {
  const objetivo = new Date(CONFIG.fechaBoda);
  let diff = objetivo.getTime() - Date.now();
  if (isNaN(diff) || diff < 0) diff = 0;

  const pad = (n) => String(n).padStart(2, '0');

  document.getElementById('dias').textContent = String(Math.floor(diff / 86400000));
  document.getElementById('horas').textContent = pad(Math.floor(diff / 3600000) % 24);
  document.getElementById('minutos').textContent = pad(Math.floor(diff / 60000) % 60);
  document.getElementById('segundos').textContent = pad(Math.floor(diff / 1000) % 60);
}
actualizarCuentaAtras();
setInterval(actualizarCuentaAtras, 1000);

// ---------- Cortina de entrada ----------

const curtain = document.getElementById('curtain');
const panelIzq = document.getElementById('panelIzq');
const panelDer = document.getElementById('panelDer');
const medallon = document.getElementById('medallon');

let abierta = false;
let animando = false;
let drag = null;
let progreso = 0;

function setTransform(p, conTransicion) {
  const t = conTransicion ? 'transform .95s cubic-bezier(.22,1,.36,1)' : 'none';
  panelIzq.style.transition = t;
  panelDer.style.transition = t;
  panelIzq.style.transform = `translateX(${-p * 105}%)`;
  panelDer.style.transform = `translateX(${p * 105}%)`;
  medallon.style.transition = conTransicion ? 'opacity .45s ease' : 'none';
  medallon.style.opacity = String(Math.max(0, 1 - p * 1.6));
}

function abrirCortina() {
  if (animando || abierta) return;
  animando = true;
  setTransform(1, true);
  setTimeout(() => {
    abierta = true;
    curtain.classList.add('is-open');
    curtain.setAttribute('aria-hidden', 'true');
  }, 980);
}

if (CONFIG.entradaAbiertaPorDefecto) {
  abierta = true;
  curtain.classList.add('is-open');
  curtain.style.display = 'none';
}

curtain.addEventListener('pointerdown', (e) => {
  if (animando || abierta) return;
  drag = { x0: e.clientX, ancho: Math.max(320, window.innerWidth), movido: false };
  try { curtain.setPointerCapture(e.pointerId); } catch (err) {}
});

curtain.addEventListener('pointermove', (e) => {
  if (!drag || animando || abierta) return;
  const dx = Math.abs(e.clientX - drag.x0);
  if (dx > 4) drag.movido = true;
  progreso = Math.min(1, dx / (drag.ancho * 0.45));
  setTransform(progreso, false);
});

function soltar() {
  if (!drag || animando || abierta) return;
  const fueToque = !drag.movido;
  drag = null;
  if (fueToque || progreso > 0.3) {
    abrirCortina();
  } else {
    progreso = 0;
    setTransform(0, true);
  }
}
curtain.addEventListener('pointerup', soltar);
curtain.addEventListener('pointercancel', soltar);

curtain.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault();
    abrirCortina();
  }
});

// ---------- RSVP ----------

const btnSi = document.getElementById('btnSi');
const btnNo = document.getElementById('btnNo');
const rsvpForm = document.getElementById('rsvpForm');
const rsvpThanks = document.getElementById('rsvpThanks');

btnSi.addEventListener('click', () => {
  btnSi.classList.add('is-active');
  btnNo.classList.remove('is-active');
});
btnNo.addEventListener('click', () => {
  btnNo.classList.add('is-active');
  btnSi.classList.remove('is-active');
});

rsvpForm.addEventListener('submit', (e) => {
  e.preventDefault();
  rsvpForm.hidden = true;
  rsvpThanks.hidden = false;
});
