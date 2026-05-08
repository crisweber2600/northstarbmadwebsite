// Pyramid layer interaction
(function(){
  const layers = document.querySelectorAll('.layer');
  const panel = document.getElementById('layerPanel');
  const closeBtn = panel.querySelector('.panel-close');

  // capture default content so we can restore
  const defaultHTML = panel.querySelector('[data-content="default"]').outerHTML;

  function showLevel(level){
    const tpl = document.getElementById('tpl-' + level);
    if(!tpl) return;
    // remove active state from all
    layers.forEach(l => {
      l.classList.toggle('active', l.dataset.level === String(level));
      l.setAttribute('aria-expanded', l.dataset.level === String(level) ? 'true' : 'false');
    });

    // replace panel content
    const wrap = panel.querySelector('[data-content]');
    if (wrap) wrap.remove();
    const container = document.createElement('div');
    container.setAttribute('data-content', level);
    container.appendChild(tpl.content.cloneNode(true));
    panel.appendChild(container);
    panel.classList.add('has-selection');

    // smooth scroll panel into view on small screens
    if (window.innerWidth < 1024) {
      panel.scrollIntoView({behavior:'smooth', block:'center'});
    }
  }

  function reset(){
    layers.forEach(l => {
      l.classList.remove('active');
      l.setAttribute('aria-expanded','false');
    });
    const wrap = panel.querySelector('[data-content]');
    if (wrap) wrap.remove();
    panel.insertAdjacentHTML('beforeend', defaultHTML);
    panel.classList.remove('has-selection');
  }

  layers.forEach(l => {
    l.addEventListener('click', () => {
      const lvl = l.dataset.level;
      if (l.classList.contains('active')) { reset(); return; }
      showLevel(lvl);
    });
  });

  closeBtn.addEventListener('click', reset);
})();
