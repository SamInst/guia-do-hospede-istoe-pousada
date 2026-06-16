import './style.css'

/* ════════════════════════════════════════════════════════════
   Isto É Pousada — guia do hóspede
   Hash-based router + interactions (no framework)
   ════════════════════════════════════════════════════════════ */

const ROUTES = ['wifi', 'lanches', 'precos', 'regras', 'recepcao']
const screens = Array.from(document.querySelectorAll('.screen'))
const homeTitle = document.getElementById('home')?.dataset.title || document.title

/** Activate a screen by route name ('' → home). */
function render(route) {
  const id = route && ROUTES.includes(route) ? `screen-${route}` : 'home'
  const target = document.getElementById(id) || document.getElementById('home')

  screens.forEach((s) => {
    const active = s === target
    s.classList.toggle('is-active', active)
    s.toggleAttribute('hidden', !active)
  })

  document.title = target?.dataset.title || homeTitle
  window.scrollTo({ top: 0, behavior: 'instant' in document.body.style ? 'instant' : 'auto' })

  // Move focus to the freshly shown screen for keyboard/AT users.
  target?.querySelector('.back-btn')?.focus({ preventScroll: true })
}

/** Navigate by updating the hash (so the back button just works). */
function go(route) {
  const next = route === 'home' ? '' : route
  if (location.hash.slice(1) === next) render(next)
  else location.hash = next
}

window.addEventListener('hashchange', () => render(location.hash.slice(1)))

/* ── Event-delegated navigation & copy (no inline handlers) ── */
document.addEventListener('click', (e) => {
  const nav = e.target.closest('[data-go]')
  if (nav) {
    e.preventDefault()
    go(nav.dataset.go)
    return
  }
  const copyBtn = e.target.closest('[data-copy]')
  if (copyBtn) copyPassword(copyBtn, copyBtn.dataset.copy)
})

/* ── Copy-to-clipboard with graceful fallback ── */
function copyPassword(btn, value) {
  const restore = btn.innerHTML
  const done = () => {
    btn.innerHTML =
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg> Copiado'
    btn.classList.add('is-copied')
    showToast(`Senha copiada · ${value}`)
    setTimeout(() => {
      btn.innerHTML = restore
      btn.classList.remove('is-copied')
    }, 2200)
  }

  if (navigator.clipboard?.writeText) {
    navigator.clipboard.writeText(value).then(done).catch(() => legacyCopy(value, done))
  } else {
    legacyCopy(value, done)
  }
}

function legacyCopy(value, cb) {
  const el = document.createElement('textarea')
  el.value = value
  el.setAttribute('readonly', '')
  el.style.cssText = 'position:fixed;top:0;left:0;opacity:0'
  document.body.appendChild(el)
  el.select()
  try { document.execCommand('copy'); cb() } catch (_) { /* noop */ }
  document.body.removeChild(el)
}

/* ── Toast ── */
let toastTimer
function showToast(msg) {
  const t = document.getElementById('toast')
  if (!t) return
  t.innerHTML =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>' +
    `<span>${msg}</span>`
  t.classList.add('show')
  clearTimeout(toastTimer)
  toastTimer = setTimeout(() => t.classList.remove('show'), 2600)
}

/* ── Scroll-aware sticky headers (shadow appears once scrolled) ── */
const topbars = document.querySelectorAll('.topbar')
const onScroll = () => {
  const stuck = window.scrollY > 4
  topbars.forEach((bar) => bar.classList.toggle('is-stuck', stuck))
}
window.addEventListener('scroll', onScroll, { passive: true })
onScroll()

/* ── Boot ── */
render(location.hash.slice(1))
