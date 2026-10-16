(() => {
  const body = document.body;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  let saved = false; try { saved = localStorage.getItem('turnul-motion') === 'off'; } catch {}
  let off = reduced.matches || saved;
  const toggle = document.querySelector('.motion-toggle');
  let lenis;
  const observed = [];
  document.querySelectorAll('h2').forEach(h => {
    // Keep semantic headings and line breaks while revealing complete words.
    const walk = node => [...node.childNodes].forEach(n => {
      if (n.nodeType === Node.TEXT_NODE) {
        const f = document.createDocumentFragment();
        n.textContent.split(/(\s+)/).forEach(part => {
          if (!part.trim()) { f.append(document.createTextNode(part)); return; }
          const wrap = document.createElement('span'); wrap.className='word-mask';
          const inner = document.createElement('span'); inner.textContent=part;
          wrap.append(inner); f.append(wrap);
        }); n.replaceWith(f);
      } else if (n.nodeType === Node.ELEMENT_NODE) walk(n);
    });
    walk(h); h.classList.add('text-motion');
    h.querySelectorAll('.word-mask').forEach((w,i)=>w.style.setProperty('--word',i));
    observed.push(h);
  });
  document.querySelectorAll('.hall-photo,.moment-card,.stay-image').forEach(el=>{el.classList.add('media-motion');observed.push(el)});
  body.classList.add('motion-ready');
  const hero = document.querySelector('.hero');
  const heroImg = document.querySelector('.hero-image');
  const sequence = document.querySelector('.cinema-sequence');
  const cinemaImg = document.querySelector('.interlude>img');
  const progress = document.querySelector('.reading-progress');
  const ring = document.querySelector('.pointer-ring');
  let pointerX=-100,pointerY=-100,ringX=-100,ringY=-100;
  const fine = matchMedia('(hover:hover) and (pointer:fine)').matches;
  const clamp = (x,a=0,b=1)=>Math.min(b,Math.max(a,x));
  function syncMotion() {
    body.classList.toggle('motion-off',off);
    toggle.setAttribute('aria-pressed',String(off));
    toggle.setAttribute('aria-label',off?'Включить анимации':'Отключить анимации');
    toggle.querySelector('span').textContent=off?'выкл.':'вкл.';
    if(lenis){lenis.destroy();lenis=null;}
    if(!off && fine && window.Lenis) lenis=new Lenis({duration:1.05,smoothWheel:true,anchors:true});
    if(off)observed.forEach(el=>el.classList.add('is-in'));
    update();
  }
  toggle.addEventListener('click',()=>{off=!off;try{localStorage.setItem('turnul-motion',off?'off':'on')}catch{}syncMotion()});
  reduced.addEventListener('change',e=>{off=e.matches;syncMotion()});
  let pending=false;
  function update(){
    pending=false;
    const vh=innerHeight;
    for(const el of observed){if(!el.classList.contains('is-in') && el.getBoundingClientRect().top<vh*.92)el.classList.add('is-in')}
    progress.style.transform=`scaleX(${clamp(scrollY/Math.max(1,document.documentElement.scrollHeight-vh))})`;
    if(off)return;
    const r=hero.getBoundingClientRect();
    if(r.bottom>0)heroImg.style.transform=`translateY(${clamp(-r.top*.18,0,170)}px)`;
    const cr=sequence.getBoundingClientRect();
    if(cr.top<vh&&cr.bottom>0){
      const t=clamp((vh-cr.top)/(vh+cr.height*.48));
      cinemaImg.style.setProperty('--cinema-inset',`${(1-t)*16}%`);
      cinemaImg.style.transform=`scale(${1.07-t*.07})`;
    }
  }
  function requestUpdate(){if(!pending){pending=true;requestAnimationFrame(update)}}
  addEventListener('scroll',requestUpdate,{passive:true});addEventListener('resize',requestUpdate);
  if(fine){
    addEventListener('pointermove',e=>{pointerX=e.clientX;pointerY=e.clientY;ring.style.opacity=off?'0':'1';ring.classList.toggle('over-media',!!e.target.closest('[data-gallery],.moment-card'));},{passive:true});
    document.documentElement.addEventListener('pointerleave',()=>ring.style.opacity='0');
  }
  function frame(time){
    if(!document.hidden&&!off){
      if(lenis)lenis.raf(time);
      if(fine){ringX+=(pointerX-ringX)*.17;ringY+=(pointerY-ringY)*.17;ring.style.transform=`translate3d(${ringX}px,${ringY}px,0)`}
    }
    requestAnimationFrame(frame);
  }
  document.querySelectorAll('a[href^="#"]').forEach(a=>a.addEventListener('click',e=>{
    if(!lenis)return;const hash=a.getAttribute('href');const target=hash==='#'?0:document.querySelector(hash);if(target!==null){e.preventDefault();lenis.scrollTo(target,{offset:-35,duration:1.3});history.replaceState(null,'',hash)}
  }));
  document.querySelectorAll('[data-book],[data-event]').forEach(b=>b.addEventListener('click',()=>{if(lenis)lenis.scrollTo('#contact',{offset:-35,duration:1.3})}));
  const gallery=document.querySelector('#gallery');
  new MutationObserver(()=>{if(lenis){if(gallery.open)lenis.stop();else lenis.start()}}).observe(gallery,{attributes:true,attributeFilter:['open']});
  document.querySelector('#hall-panel').addEventListener('hallchange',()=>{
    const panel=document.querySelector('#hall-panel');panel.classList.remove('switching');requestAnimationFrame(()=>requestAnimationFrame(()=>panel.classList.add('switching')));
  });
  syncMotion();requestAnimationFrame(frame);
})();

