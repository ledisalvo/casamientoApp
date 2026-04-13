// ===== COUNTDOWN =====
(function () {
  const target = new Date('2025-11-15T20:30:00');

  function pad(n) { return String(n).padStart(2, '0'); }

  function tick() {
    const diff = target - Date.now();
    if (diff <= 0) {
      document.getElementById('days').textContent = '00';
      document.getElementById('hours').textContent = '00';
      document.getElementById('minutes').textContent = '00';
      document.getElementById('seconds').textContent = '00';
      return;
    }
    const d = Math.floor(diff / 86400000);
    const h = Math.floor((diff % 86400000) / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    const s = Math.floor((diff % 60000) / 1000);
    document.getElementById('days').textContent    = pad(d);
    document.getElementById('hours').textContent   = pad(h);
    document.getElementById('minutes').textContent = pad(m);
    document.getElementById('seconds').textContent = pad(s);
  }

  tick();
  setInterval(tick, 1000);
})();

// ===== GIFT INFO TOGGLE =====
function toggleGiftInfo() {
  const el = document.getElementById('giftInfo');
  el.classList.toggle('visible');
}

// ===== RSVP ATTEND BUTTONS =====
function selectAttend(btn, value) {
  document.querySelectorAll('.attend-btn').forEach(b => b.classList.remove('selected'));
  btn.classList.add('selected');
  document.getElementById('attendValue').value = value;
}

// ===== RSVP FORM SUBMIT =====
function submitRSVP(e) {
  e.preventDefault();
  const form = e.target;
  form.style.display = 'none';
  document.getElementById('rsvpSuccess').classList.add('visible');
}
