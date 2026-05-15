import './style.css'

export function goTo(name) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'))
  document.getElementById('screen-' + name).classList.add('active')
  window.scrollTo({ top: 0, behavior: 'instant' })
}

export function goHome() {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'))
  document.getElementById('home').classList.add('active')
  window.scrollTo({ top: 0, behavior: 'instant' })
}

export function copyPwd(btn, pwd) {
  const orig = btn.innerHTML
  const done = () => {
    btn.innerHTML = '✅ Copiado!'
    btn.classList.add('copied')
    showToast('Senha copiada: ' + pwd)
    setTimeout(() => { btn.innerHTML = orig; btn.classList.remove('copied') }, 2200)
  }
  if (navigator.clipboard) {
    navigator.clipboard.writeText(pwd).then(done).catch(() => fallback(pwd, done))
  } else {
    fallback(pwd, done)
  }
}

function fallback(pwd, cb) {
  const el = document.createElement('textarea')
  el.value = pwd
  el.style.cssText = 'position:fixed;opacity:0;top:0;left:0'
  document.body.appendChild(el)
  el.select()
  try { document.execCommand('copy'); cb() } catch (e) {}
  document.body.removeChild(el)
}

function showToast(msg) {
  const t = document.getElementById('toast')
  t.textContent = msg
  t.classList.add('show')
  setTimeout(() => t.classList.remove('show'), 2600)
}

// Expõe funções no escopo global para uso nos atributos onclick do HTML
window.goTo = goTo
window.goHome = goHome
window.copyPwd = copyPwd
