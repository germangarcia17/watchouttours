(function(){
  var API = (document.documentElement.getAttribute('data-api') || '').replace(/\/?$/, '/');
  var FALLO = 'No hemos podido completar la inscripción. Inténtalo de nuevo en un momento o escríbenos por WhatsApp al +64 27 267 7006.';
  var $ = function(id){ return document.getElementById(id); };
  var form = $('form'), ok = $('ok'), btn = $('enviar'), formErr = $('form-error');

  // ---- Fecha del directo: viene de Supabase para que landing y correos digan lo mismo ----
  var ZONES = [
    ['España (península y Baleares)','Europe/Madrid'],['Canarias','Atlantic/Canary'],
    ['Argentina y Uruguay','America/Argentina/Buenos_Aires'],['Chile','America/Santiago'],
    ['Colombia, Perú y Ecuador','America/Bogota'],['México (Ciudad de México)','America/Mexico_City'],
    ['Estados Unidos (costa este)','America/New_York'],['Nueva Zelanda','Pacific/Auckland']
  ];
  function fmt(d, tz, o){ var opts = {timeZone: tz}; for (var k in o) opts[k] = o[k]; return new Intl.DateTimeFormat('es-ES', opts).format(d); }
  function cap(s){ return s.charAt(0).toUpperCase() + s.slice(1); }
  function hhmm(d, tz){ return fmt(d, tz, {hour:'2-digit', minute:'2-digit', hourCycle:'h23'}); }

  function closeSignup(){
    form.hidden = true;
    var p = document.createElement('p');
    p.className = 'success';
    p.textContent = 'Las inscripciones para este directo están cerradas. Escríbenos por WhatsApp y te avisamos del próximo.';
    form.parentNode.insertBefore(p, form);
  }

  function renderEvent(ev){
    var d = new Date(ev.starts_at);
    $('ev-day').textContent = cap(fmt(d, 'Europe/Madrid', {weekday:'long', day:'numeric', month:'long', year:'numeric'}));
    $('ev-hour').textContent = hhmm(d, 'Europe/Madrid') + ' hora de España';
    var tb = $('tz-body'); tb.textContent = '';
    ZONES.forEach(function(z){
      var tr = document.createElement('tr'), th = document.createElement('th'), td = document.createElement('td');
      th.scope = 'row'; th.textContent = z[0];
      td.className = 't'; td.textContent = cap(fmt(d, z[1], {weekday:'long', day:'numeric', month:'long'})) + ', ' + hhmm(d, z[1]);
      tr.appendChild(th); tr.appendChild(td); tb.appendChild(tr);
    });
    try {
      var tz = Intl.DateTimeFormat().resolvedOptions().timeZone || '';
      var local = $('local'); local.textContent = 'En tu zona horaria' + (tz ? ' (' + tz.replace(/_/g,' ') + ')' : '') + ' empieza el ';
      var s = document.createElement('strong');
      s.textContent = fmt(d, undefined, {weekday:'long', day:'numeric', month:'long', hour:'2-digit', minute:'2-digit', hourCycle:'h23'});
      local.appendChild(s); local.appendChild(document.createTextNode('.'));
    } catch (e) {}
    if (!ev.open) closeSignup();
  }

  var q = new URLSearchParams(location.search);
  var slug = q.get('evento') || '';
  if (slug) form.elements.evento.value = slug;
  fetch(API + 'directo-evento' + (slug ? '?evento=' + encodeURIComponent(slug) : ''))
    .then(function(r){ return r.ok ? r.json() : null; })
    .then(function(ev){ if (ev && ev.ok) renderEvent(ev); })
    .catch(function(){});

  // ---- Formulario ----
  var EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  function setError(field, msg){
    var input = form.elements[field], p = $(field + '-err');
    if (msg) { input.setAttribute('aria-invalid', 'true'); p.textContent = msg; p.hidden = false; }
    else { input.removeAttribute('aria-invalid'); p.textContent = ''; p.hidden = true; }
  }
  function showErrors(errs){
    var first = null;
    ['nombre','email'].forEach(function(f){ setError(f, errs[f]); if (errs[f] && !first) first = f; });
    if (first) form.elements[first].focus();
  }
  function showGeneral(msg){ formErr.textContent = msg; formErr.hidden = false; }
  function showSuccess(){
    form.hidden = true; ok.hidden = false; ok.focus();
    ok.scrollIntoView({block: 'center'});
  }

  var sending = false;
  form.addEventListener('submit', function(e){
    e.preventDefault();
    if (sending) return;
    formErr.hidden = true;
    var data = {
      nombre: form.elements.nombre.value.trim(),
      email: form.elements.email.value.trim(),
      novedades: form.elements.novedades.checked,
      web: form.elements.web.value,
      evento: form.elements.evento.value
    };
    var errs = {};
    if (!data.nombre) errs.nombre = 'Escribe tu nombre.';
    if (!data.email) errs.email = 'Escribe tu email.';
    else if (!EMAIL_RE.test(data.email)) errs.email = 'Revisa el email, parece que le falta algo.';
    showErrors(errs);
    if (errs.nombre || errs.email) return;

    sending = true; btn.setAttribute('aria-disabled', 'true'); btn.textContent = 'Enviando…';
    fetch(API + 'directo-inscripcion', { method: 'POST', headers: {'content-type': 'application/json'}, body: JSON.stringify(data) })
      .then(function(r){ return r.json().catch(function(){ return {}; }).then(function(j){ return {r: r, j: j}; }); })
      .then(function(res){
        if (res.r.ok && res.j.ok) showSuccess();
        else if (res.j.errors) showErrors(res.j.errors);
        else showGeneral(res.j.error || FALLO);
      })
      .catch(function(){ showGeneral(FALLO); })
      .then(function(){ sending = false; btn.removeAttribute('aria-disabled'); btn.textContent = 'Quiero asistir gratis'; });
  });

  // Vuelta desde el envío sin JavaScript
  if (q.get('ok') === '1') showSuccess();
  else if (q.get('error')) showGeneral(q.get('error'));

  // Los botones "Reservar mi plaza" llevan al formulario y ponen el foco en el nombre
  document.querySelectorAll('[data-focus-form]').forEach(function(a){
    a.addEventListener('click', function(e){
      if (form.hidden) return;
      e.preventDefault();
      $('inscripcion').scrollIntoView({behavior: 'smooth', block: 'start'});
      form.elements.nombre.focus({preventScroll: true});
    });
  });

  // Onda de puntos braille (decorativa)
  var svg = $('wave'), ns = 'http://www.w3.org/2000/svg', n = 0;
  for (var i = 0; i < 40; i++) {
    var h = Math.max(1, Math.round(Math.abs(Math.sin(i * 0.42) * Math.cos(i * 0.13)) * 5 + 1));
    for (var j = 0; j < h; j++) {
      var c = document.createElementNS(ns, 'circle');
      c.setAttribute('cx', 8 + i * 15.8);
      c.setAttribute('cy', 35 + (j % 2 ? 1 : -1) * Math.ceil(j / 2) * 10);
      c.setAttribute('r', 3.6);
      if (h >= 5) c.setAttribute('class', 'hot');
      c.style.setProperty('--i', n++);
      svg.appendChild(c);
    }
  }
})();
