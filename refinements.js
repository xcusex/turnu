(() => {
 const widgets=[];
 document.querySelectorAll('#contact-form select').forEach((select,index)=>{
  const label=select.parentElement;
  const name=label.firstChild.textContent.trim();
  const wrap=document.createElement('div');wrap.className='choice';
  const trigger=document.createElement('button');trigger.type='button';trigger.className='choice-trigger';trigger.setAttribute('aria-haspopup','listbox');trigger.setAttribute('aria-expanded','false');trigger.setAttribute('aria-label',name);trigger.setAttribute('aria-controls',`choices-${index}`);
  const value=document.createElement('span');const arrow=document.createElement('i');arrow.textContent='↘';trigger.append(value,arrow);
  const panel=document.createElement('div');panel.className='choice-panel';panel.id=`choices-${index}`;panel.setAttribute('role','listbox');panel.setAttribute('aria-label',name);panel.hidden=true;
  // Replace the wrapping label to avoid nested interactive label activation.
  const field=document.createElement('div');field.className='choice-field';const caption=document.createElement('span');caption.className='choice-caption';caption.textContent=name;
  label.replaceWith(field);field.append(caption,select,wrap);wrap.append(trigger,panel);select.hidden=true;
  const descriptions={Свадьба:'Церемония · ужин · первый танец','Семейное торжество':'Крестины · юбилей · день рождения','Корпоративный вечер':'Команда · встречи · праздники',Проживание:'Остаться после праздника',Respiro:'36–72 гостя · руфтоп и бассейн',Colliseum:'До 180 гостей · круглый зал',Family:'До 100 гостей · семейный праздник'};
  const options=[...select.options].map((option,i)=>{
   const row=document.createElement('button');row.type='button';row.className='choice-option';row.setAttribute('role','option');row.tabIndex=-1;
   const num=document.createElement('span');num.className='choice-number';num.textContent=String(i+1).padStart(2,'0');const text=document.createElement('span');text.textContent=option.text;
   if(descriptions[option.text]){const small=document.createElement('small');small.textContent=descriptions[option.text];text.append(small)}
   const check=document.createElement('span');check.className='choice-check';check.textContent='✓';row.append(num,text,check);panel.append(row);
   row.addEventListener('click',()=>{select.selectedIndex=i;select.dispatchEvent(new Event('change',{bubbles:true}));close();trigger.focus()});
   row.addEventListener('keydown',e=>{let next=i;if(e.key==='ArrowDown')next=(i+1)%options.length;else if(e.key==='ArrowUp')next=(i+options.length-1)%options.length;else if(e.key==='Home')next=0;else if(e.key==='End')next=options.length-1;else return;e.preventDefault();options[next].focus()});
   return row;
  });
  function sync(){value.textContent=select.options[select.selectedIndex].text;options.forEach((o,i)=>o.setAttribute('aria-selected',String(i===select.selectedIndex)))}
  function close(){panel.hidden=true;trigger.setAttribute('aria-expanded','false');wrap.classList.remove('expanded')}
  function open(){widgets.forEach(w=>w.close());panel.hidden=false;trigger.setAttribute('aria-expanded','true');wrap.classList.add('expanded');options[select.selectedIndex].focus({preventScroll:true})}
  trigger.addEventListener('click',()=>panel.hidden?open():close());trigger.addEventListener('keydown',e=>{if(e.key==='ArrowDown'||e.key==='ArrowUp'){e.preventDefault();open()}});
  wrap.addEventListener('keydown',e=>{if(e.key==='Escape'){e.preventDefault();close();trigger.focus()}if(e.key==='Tab')setTimeout(()=>{if(!wrap.contains(document.activeElement))close()},0)});
  wrap.addEventListener('focusout',()=>setTimeout(()=>{if(!wrap.contains(document.activeElement))close()},0));
  select.addEventListener('change',sync);widgets.push({wrap,close,sync});sync();
 });
 document.addEventListener('pointerdown',e=>widgets.forEach(w=>{if(!w.wrap.contains(e.target))w.close()}));
 document.querySelectorAll('[data-book],[data-event]').forEach(b=>b.addEventListener('click',()=>widgets.forEach(w=>w.sync())));
 const faq=document.querySelector('.faq');
 const intro=document.createElement('div');intro.className='faq-intro';intro.innerHTML='<p class="eyebrow">ПЕРЕД ЗНАКОМСТВОМ</p><h2>Хороший<br><em>вопрос.</em></h2><p>Несколько деталей,<br>чтобы было проще решиться.</p><a href="tel:+37379449911">Обсудим лично <span>↗</span></a>';
 faq.querySelector(':scope > .eyebrow').replaceWith(intro);
 const list=document.createElement('div');list.className='faq-list';faq.append(list);
 faq.querySelectorAll('details').forEach((detail,i)=>{
  const title=detail.querySelector('summary').childNodes[0].textContent;const content=detail.querySelector('p');
  const item=document.createElement('article');item.className='faq-item';const button=document.createElement('button');button.type='button';button.className='faq-question';button.setAttribute('aria-expanded','false');button.setAttribute('aria-controls',`faq-answer-${i}`);button.id=`faq-question-${i}`;
  button.innerHTML=`<span class="faq-number">0${i+1}</span><span class="faq-title"></span><span class="faq-icon" aria-hidden="true">+</span>`;button.querySelector('.faq-title').textContent=title;
  const answer=document.createElement('div');answer.className='faq-answer';answer.id=`faq-answer-${i}`;answer.setAttribute('role','region');answer.setAttribute('aria-labelledby',button.id);answer.setAttribute('aria-hidden','true');answer.inert=true;const inner=document.createElement('div');inner.append(content);answer.append(inner);item.append(button,answer);list.append(item);detail.remove();
  button.addEventListener('click',()=>{const open=button.getAttribute('aria-expanded')!=='true';list.querySelectorAll('.faq-item').forEach(other=>{const active=other===item&&open;other.classList.toggle('open',active);other.querySelector('button').setAttribute('aria-expanded',String(active));other.querySelector('.faq-answer').setAttribute('aria-hidden',String(!active));other.querySelector('.faq-answer').inert=!active})});
 });
 const ring=document.querySelector('.pointer-ring');
 document.addEventListener('pointermove',e=>{const media=e.target.closest('[data-gallery],.moment-card');ring.querySelector('span').textContent=media?.matches('.moment-card')?'Выбрать ↗':'Открыть ↗';ring.classList.toggle('over-control',!!e.target.closest('a,button,input,summary'));},{passive:true});
 document.addEventListener('pointerdown',()=>ring.classList.add('pressed'));
 const release=()=>ring.classList.remove('pressed');document.addEventListener('pointerup',release);document.addEventListener('pointercancel',release);addEventListener('blur',release);
})();
