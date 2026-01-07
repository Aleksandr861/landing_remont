
(function(){
  const burger = document.querySelector('[data-burger]');
  const mobileMenu = document.querySelector('[data-mobile-menu]');
  if(burger && mobileMenu){
    burger.addEventListener('click', ()=> mobileMenu.classList.toggle('open'));
  }

  // Modal
  const modal = document.querySelector('[data-modal]');
  const openButtons = document.querySelectorAll('[data-open-modal]');
  const closeButtons = document.querySelectorAll('[data-close-modal]');
  function openModal(){
    modal?.classList.add('open');
    document.body.style.overflow='hidden';
  }
  function closeModal(){
    modal?.classList.remove('open');
    document.body.style.overflow='';
  }
  openButtons.forEach(b=>b.addEventListener('click', (e)=>{e.preventDefault(); openModal();}));
  closeButtons.forEach(b=>b.addEventListener('click', (e)=>{e.preventDefault(); closeModal();}));
  modal?.addEventListener('click', (e)=>{
    if(e.target === modal) closeModal();
  });
  document.addEventListener('keydown', (e)=>{
    if(e.key === 'Escape') closeModal();
  });

  // FAQ
  document.querySelectorAll('.faq-item button').forEach(btn=>{
    btn.addEventListener('click', ()=>{
      btn.closest('.faq-item')?.classList.toggle('open');
    });
  });

  // Quiz
  const steps = [
    {q:'Какой тип ремонта нужен?', opts:[
      {t:'Косметический', d:'Быстро и аккуратно'},
      {t:'Капитальный', d:'Замена коммуникаций'},
      {t:'Дизайнерский', d:'Под ключ со стилем'},
      {t:'Новостройка', d:'С нуля до мебели'},
    ]},
    {q:'Площадь квартиры?', opts:[
      {t:'До 40 м²', d:'Студия / 1к'},
      {t:'40–60 м²', d:'1–2к'},
      {t:'60–90 м²', d:'2–3к'},
      {t:'90+ м²', d:'Большая площадь'},
    ]},
    {q:'Когда планируете старт?', opts:[
      {t:'Срочно', d:'В ближайшие 2 недели'},
      {t:'В течение месяца', d:'Планово'},
      {t:'Через 1–3 месяца', d:'Есть время'},
      {t:'Не знаю', d:'Нужна консультация'},
    ]},
    {q:'Как удобнее связаться?', form:true}
  ];
  let idx = 0;
  const qTitle = document.querySelector('[data-q-title]');
  const options = document.querySelector('[data-options]');
  const progress = document.querySelector('[data-progress]');
  const btnBack = document.querySelector('[data-quiz-back]');
  const btnNext = document.querySelector('[data-quiz-next]');
  const resultBox = document.querySelector('[data-quiz-result]');

  const state = { answers: [] };

  function render(){
    const pct = Math.round((idx)/(steps.length-1)*100);
    if(progress) progress.style.width = `${pct}%`;
    const step = steps[idx];
    if(!step) return;

    if(qTitle) qTitle.textContent = step.q;

    // buttons
    if(btnBack) btnBack.disabled = (idx===0);
    if(btnNext) btnNext.style.display = (idx < steps.length-1) ? 'inline-flex' : 'none';

    if(options){
      options.innerHTML = '';
      if(step.form){
        const wrap = document.createElement('div');
        wrap.innerHTML = `
          <div class="form-row">
            <input class="input" data-name placeholder="Ваше имя" />
            <input class="input" data-phone placeholder="Телефон / WhatsApp" />
          </div>
          <div style="margin-top:10px">
            <input class="input" data-comment placeholder="Коротко: что важно? (опционально)" />
          </div>
          <div style="margin-top:12px; display:flex; gap:10px; flex-wrap:wrap; justify-content:flex-end">
            <button class="btn" data-submit>Получить смету</button>
          </div>
          <div class="small-note" style="margin-top:10px">
            Нажимая кнопку, вы соглашаетесь на обработку данных. (Демо — без отправки)
          </div>
        `;
        options.appendChild(wrap);

        wrap.querySelector('[data-submit]').addEventListener('click', ()=>{
          const name = wrap.querySelector('[data-name]').value.trim();
          const phone = wrap.querySelector('[data-phone]').value.trim();
          const comment = wrap.querySelector('[data-comment]').value.trim();
          if(!phone){
            alert('Введите телефон/мессенджер — это обязательное поле.');
            return;
          }
          state.answers[3] = {name, phone, comment};
          showResult();
        });
      } else {
        step.opts.forEach((o, i)=>{
          const el = document.createElement('div');
          el.className='opt';
          el.innerHTML = `<strong>${o.t}</strong><span>${o.d}</span>`;
          el.addEventListener('click', ()=>{
            state.answers[idx] = o.t;
            idx = Math.min(idx+1, steps.length-1);
            render();
          });
          options.appendChild(el);
        });
      }
    }
  }

  function showResult(){
    if(!resultBox) return;
    const a1 = state.answers[0] || '—';
    const a2 = state.answers[1] || '—';
    const a3 = state.answers[2] || '—';
    const form = state.answers[3] || {};
    const text = `Заявка (демо)\nТип ремонта: ${a1}\nПлощадь: ${a2}\nСтарт: ${a3}\nИмя: ${form.name||'—'}\nКонтакт: ${form.phone||'—'}\nКомментарий: ${form.comment||'—'}`;
    resultBox.textContent = text;
    resultBox.style.display='block';
    resultBox.scrollIntoView({behavior:'smooth', block:'start'});
  }

  btnBack?.addEventListener('click', ()=>{
    idx = Math.max(idx-1, 0);
    render();
  });
  btnNext?.addEventListener('click', ()=>{
    idx = Math.min(idx+1, steps.length-1);
    render();
  });

  render();
})();
