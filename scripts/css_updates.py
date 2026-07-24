import os

base = '/home/josemr21/Proyectos/Portafolio/mi-portafolio/src'

# === 1. Project.css: modal fade-in + tab fade transition ===
pcss = open(f'{base}/components/Project.css').read()

# Modal backdrop fade
old = '''.modal-backdrop {
  position: fixed;
  inset: 0;
  z-index: 2000;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(8px);
  padding: 2rem;
}'''
new = '''.modal-backdrop {
  position: fixed;
  inset: 0;
  z-index: 2000;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(8px);
  padding: 2rem;
  animation: modal-fade-in 0.2s ease;
}

@keyframes modal-fade-in {
  from { opacity: 0; }
  to { opacity: 1; }
}'''
pcss = pcss.replace(old, new)

# Modal window scale in
old = '''.modal-window {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 12px;
  width: 100%;
  max-width: 820px;
  max-height: 90vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  box-shadow: 0 25px 60px rgba(0, 0, 0, 0.5);
}'''
new = '''.modal-window {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 12px;
  width: 100%;
  max-width: 820px;
  max-height: 90vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  box-shadow: 0 25px 60px rgba(0, 0, 0, 0.5);
  animation: modal-scale-in 0.25s ease;
}

@keyframes modal-scale-in {
  from { opacity: 0; transform: scale(0.95); }
  to { opacity: 1; transform: scale(1); }
}'''
pcss = pcss.replace(old, new)

# Tab transition: fade on grid
old = '''.projects-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.2rem;
}'''
new = '''.projects-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.2rem;
  animation: grid-fade-in 0.25s ease;
}

@keyframes grid-fade-in {
  from { opacity: 0; }
  to { opacity: 1; }
}'''
pcss = pcss.replace(old, new)

open(f'{base}/components/Project.css', 'w').write(pcss)

# === 2. index.css: button press ===
pcss = open(f'{base}/index.css').read()
if '.btn-primary:active' not in pcss:
    pcss += '''
.btn-primary:active {
  transform: translateY(-1px) scale(0.97);
}

.btn-outline:active {
  transform: translateY(-1px) scale(0.97);
}
'''
open(f'{base}/index.css', 'w').write(pcss)

print('OK - all CSS updates done')