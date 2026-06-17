/* NerdsIndia — shared weather + header logic for every page.
   Pages must include a <div id="headerMount"></div> right at the top of .page,
   and call niInitHeader(onRefresh) before building their own cards. */

// ---------- weather code -> icon type + label ----------
function niClassify(code){
  if(code === 0) return { type:'sun',   label:'Clear sky' };
  if(code === 1) return { type:'sun',   label:'Mostly clear' };
  if(code === 2) return { type:'cloud', label:'Partly cloudy' };
  if(code === 3) return { type:'cloud', label:'Overcast' };
  if(code === 45 || code === 48) return { type:'fog', label:'Foggy' };
  if([51,53,55,56,57].includes(code)) return { type:'rain', label:'Drizzle' };
  if([61,63,65,66,67].includes(code)) return { type:'rain', label:'Rain' };
  if([80,81,82].includes(code)) return { type:'rain', label:'Rain showers' };
  if([71,73,75,77].includes(code)) return { type:'snow', label:'Snow' };
  if([85,86].includes(code)) return { type:'snow', label:'Snow showers' };
  if([95,96,99].includes(code)) return { type:'storm', label:'Thunderstorm' };
  return { type:'sun', label:'Clear' };
}

function niTempTint(t){
  if(t == null) return 'rgba(148,163,184,0.18)';
  if(t < 15) return 'rgba(56,189,248,0.26)';
  if(t < 25) return 'rgba(99,102,241,0.18)';
  if(t < 32) return 'rgba(251,191,36,0.24)';
  return 'rgba(248,113,113,0.28)';
}

function niIconSVG(type){
  switch(type){
    case 'sun': return `
      <svg viewBox="0 0 64 64">
        <g class="sun-rays">
          <line x1="32" y1="4" x2="32" y2="13"/><line x1="32" y1="51" x2="32" y2="60"/>
          <line x1="4" y1="32" x2="13" y2="32"/><line x1="51" y1="32" x2="60" y2="32"/>
          <line x1="12" y1="12" x2="18.5" y2="18.5"/><line x1="45.5" y1="45.5" x2="52" y2="52"/>
          <line x1="12" y1="52" x2="18.5" y2="45.5"/><line x1="45.5" y1="18.5" x2="52" y2="12"/>
        </g>
        <circle class="sun-core" cx="32" cy="32" r="13"/>
      </svg>`;
    case 'cloud': return `
      <svg viewBox="0 0 64 64">
        <g class="cloud-float">
          <ellipse cx="25" cy="34" rx="15" ry="11" fill="#CBD5E1"/>
          <ellipse cx="40" cy="30" rx="12" ry="10" fill="#E2E8F0"/>
          <ellipse cx="33" cy="39" rx="19" ry="9" fill="#F1F5F9"/>
        </g>
      </svg>`;
    case 'rain': return `
      <svg viewBox="0 0 64 64">
        <g class="cloud-float">
          <ellipse cx="25" cy="26" rx="14" ry="10" fill="#94A3B8"/>
          <ellipse cx="39" cy="23" rx="11" ry="9" fill="#CBD5E1"/>
          <ellipse cx="33" cy="31" rx="18" ry="8" fill="#E2E8F0"/>
        </g>
        <line class="rain-drop d1" x1="20" y1="42" x2="17" y2="52"/>
        <line class="rain-drop d2" x1="31" y1="44" x2="28" y2="56"/>
        <line class="rain-drop d3" x1="42" y1="42" x2="39" y2="52"/>
        <line class="rain-drop d4" x1="26" y1="46" x2="23" y2="54"/>
      </svg>`;
    case 'snow': return `
      <svg viewBox="0 0 64 64">
        <g class="cloud-float">
          <ellipse cx="25" cy="26" rx="14" ry="10" fill="#CBD5E1"/>
          <ellipse cx="39" cy="23" rx="11" ry="9" fill="#E2E8F0"/>
          <ellipse cx="33" cy="31" rx="18" ry="8" fill="#F1F5F9"/>
        </g>
        <circle class="flake f1" cx="20" cy="46" r="2.4"/>
        <circle class="flake f2" cx="32" cy="50" r="2.4"/>
        <circle class="flake f3" cx="44" cy="46" r="2.4"/>
      </svg>`;
    case 'storm': return `
      <svg viewBox="0 0 64 64">
        <g class="cloud-float">
          <ellipse cx="25" cy="24" rx="14" ry="10" fill="#64748B"/>
          <ellipse cx="39" cy="21" rx="11" ry="9" fill="#7C8AA5"/>
          <ellipse cx="33" cy="29" rx="18" ry="8" fill="#94A3B8"/>
        </g>
        <polygon class="bolt" points="34,32 25,48 32,48 28,60 42,40 34,40"/>
      </svg>`;
    case 'fog': return `
      <svg viewBox="0 0 64 64">
        <rect class="fog-line l1" x="10" y="24" width="44" height="6" rx="3"/>
        <rect class="fog-line l2" x="6" y="34" width="52" height="6" rx="3"/>
        <rect class="fog-line l3" x="14" y="44" width="36" height="6" rx="3"/>
      </svg>`;
    default: return '';
  }
}

function niFormatUpdated(isoTime){
  if(!isoTime) return '';
  const timePart = isoTime.split('T')[1] || '';
  let [h, m] = timePart.split(':').map(Number);
  const suffix = h >= 12 ? 'PM' : 'AM';
  h = h % 12; if(h === 0) h = 12;
  return `Updated ${h}:${String(m).padStart(2,'0')} ${suffix} IST`;
}

// ---------- card grid ----------
// mode: 'state' (home page — title is the state, links through to loc.page if set)
//       'city'  (a state's own page — title is the city, no further linking)
function niBuildCards(grid, locations, opts){
  opts = opts || {};
  const mode = opts.mode || 'state';
  grid.innerHTML = '';

  locations.forEach((loc, i) => {
    const isLink = mode === 'state' && !!loc.page;
    const card = document.createElement(isLink ? 'a' : 'div');
    card.className = 'card';
    if(isLink) card.href = loc.page;
    card.dataset.index = i;
    card.dataset.search = (loc.state + ' ' + loc.city).toLowerCase();

    const eyebrow = mode === 'city' ? 'City' : 'State';
    const title = mode === 'city' ? loc.city : loc.state;
    const subtitle = mode === 'city' ? '' : loc.city;

    card.innerHTML = `
      <div class="card-glow" id="glow-${i}"></div>
      ${isLink ? '<svg class="card-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 6 15 12 9 18"/></svg>' : ''}
      <div class="card-top">
        <span class="eyebrow">${eyebrow}</span>
        <h3 class="state-name">${title}</h3>
        ${subtitle ? `<p class="city-name">${subtitle}</p>` : ''}
      </div>
      <div class="card-body">
        <div class="card-icon" id="icon-${i}"><div class="pulse-dot"></div></div>
        <div class="temp-block" id="temp-${i}"><div class="pulse-dot"></div></div>
      </div>
    `;
    grid.appendChild(card);
  });
}

function niRenderResult(i, currentWeather){
  const iconEl = document.getElementById(`icon-${i}`);
  const tempEl = document.getElementById(`temp-${i}`);
  const glowEl = document.getElementById(`glow-${i}`);
  if(!iconEl || !tempEl || !glowEl) return;

  if(!currentWeather){
    iconEl.innerHTML = '';
    tempEl.innerHTML = `<p class="unavailable">Data unavailable</p>`;
    return;
  }
  const { type, label } = niClassify(currentWeather.weathercode);
  const temp = Math.round(currentWeather.temperature);

  iconEl.innerHTML = niIconSVG(type);
  tempEl.innerHTML = `
    <div class="card-temp">${temp}°C</div>
    <p class="card-condition">${label}</p>
  `;
  glowEl.style.setProperty('--tint', niTempTint(temp));
}

async function niLoadWeather(locations, updatedAtEl, refreshBtnEl){
  if(updatedAtEl) updatedAtEl.textContent = 'Fetching latest readings…';
  if(refreshBtnEl) refreshBtnEl.disabled = true;

  const latStr = locations.map(l => l.lat).join(',');
  const lonStr = locations.map(l => l.lon).join(',');
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${latStr}&longitude=${lonStr}&current_weather=true&timezone=Asia%2FKolkata`;

  try{
    const res = await fetch(url);
    if(!res.ok) throw new Error('Network response was not ok');
    const data = await res.json();
    const list = Array.isArray(data) ? data : [data];

    list.forEach((entry, i) => {
      niRenderResult(i, entry && entry.current_weather ? entry.current_weather : null);
    });

    const firstTime = list[0] && list[0].current_weather ? list[0].current_weather.time : null;
    if(updatedAtEl) updatedAtEl.textContent = niFormatUpdated(firstTime) || 'Updated just now';
  }catch(err){
    locations.forEach((_, i) => niRenderResult(i, null));
    if(updatedAtEl) updatedAtEl.textContent = 'Could not load live data — tap Refresh to retry';
  }finally{
    if(refreshBtnEl) refreshBtnEl.disabled = false;
  }
}

// ---------- search filter (works against whatever cards are in the grid) ----------
function niWireSearch(grid, emptyState, queryEcho, searchInput){
  searchInput.addEventListener('input', () => {
    const q = searchInput.value.trim().toLowerCase();
    const cards = grid.querySelectorAll('.card');
    let visibleCount = 0;
    cards.forEach(card => {
      const match = card.dataset.search.includes(q);
      card.classList.toggle('is-hidden', !match);
      if(match) visibleCount++;
    });
    emptyState.classList.toggle('hidden', visibleCount !== 0 || q === '');
    queryEcho.textContent = searchInput.value.trim();
  });
}

// ---------- header: fetch the shared partial, inject it, wire up its controls ----------
// onRefresh: function called when the Refresh button is clicked.
// Returns { searchInput, refreshBtn, updatedAt } for the page to use.
async function niInitHeader(onRefresh){
  const mount = document.getElementById('headerMount');
  const res = await fetch('header.html');
  mount.innerHTML = await res.text();

  const root = document.documentElement;
  const themeToggle = document.getElementById('themeToggle');
  const searchToggle = document.getElementById('searchToggle');
  const searchRow = document.getElementById('searchRow');
  const searchInput = document.getElementById('searchInput');
  const refreshBtn = document.getElementById('refreshBtn');
  const updatedAt = document.getElementById('updatedAt');

  // theme: auto from system, override via button
  let userOverride = false;
  const colorSchemeQuery = window.matchMedia('(prefers-color-scheme: dark)');
  colorSchemeQuery.addEventListener('change', (e) => {
    if(!userOverride) root.setAttribute('data-theme', e.matches ? 'dark' : 'light');
  });
  themeToggle.addEventListener('click', () => {
    userOverride = true;
    root.setAttribute('data-theme', root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark');
  });

  // search panel: collapsed by default, opens from the header icon
  function closeSearch(){
    searchRow.classList.remove('open');
    searchToggle.setAttribute('aria-expanded', 'false');
    if(searchInput.value){
      searchInput.value = '';
      searchInput.dispatchEvent(new Event('input'));
    }
  }
  searchToggle.addEventListener('click', () => {
    const willOpen = !searchRow.classList.contains('open');
    searchRow.classList.toggle('open', willOpen);
    searchToggle.setAttribute('aria-expanded', String(willOpen));
    if(willOpen){
      setTimeout(() => searchInput.focus(), 150);
    }else{
      closeSearch();
    }
  });
  document.addEventListener('keydown', (e) => {
    if(e.key === 'Escape' && searchRow.classList.contains('open')) closeSearch();
  });

  if(onRefresh) refreshBtn.addEventListener('click', onRefresh);

  return { searchInput, refreshBtn, updatedAt };
}
