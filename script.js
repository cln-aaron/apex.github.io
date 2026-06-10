/* APEX 2026 — Cyberpunk × Roblox interactions */

// Popup dismiss
(function(){
  const popup=document.getElementById('popup');
  const btn=document.getElementById('popupClose');
  if(!popup||!btn)return;
  btn.addEventListener('click',()=>{
    popup.classList.add('hidden');
    setTimeout(()=>popup.remove(),500);
  });
})();

// Floating background blocks
(function(){
  const c=document.querySelector('.bg-blocks');
  if(!c)return;
  const colors=['#00fff5','#ff2e93','#39ff14','#ff6b35','#b833ff'];
  for(let i=0;i<18;i++){
    const b=document.createElement('div');
    b.className='b';
    const s=Math.random()*40+15;
    b.style.width=s+'px';
    b.style.height=s+'px';
    b.style.left=Math.random()*100+'%';
    b.style.borderColor=colors[i%colors.length];
    b.style.animationDuration=(Math.random()*15+12)+'s';
    b.style.animationDelay=(-Math.random()*20)+'s';
    c.appendChild(b);
  }
})();

// Scroll reveal
(function(){
  const els=document.querySelectorAll('.reveal');
  if(!els.length)return;
  if(!('IntersectionObserver' in window)){els.forEach(e=>e.classList.add('visible'));return;}
  const io=new IntersectionObserver(entries=>{
    entries.forEach(en=>{if(en.isIntersecting){en.target.classList.add('visible');io.unobserve(en.target);}});
  },{threshold:0.1});
  els.forEach(e=>io.observe(e));
})();

// Nav active on scroll
(function(){
  const links=document.querySelectorAll('.hud-nav .nav-links a');
  if(!links.length)return;
  const secs=Array.from(links).map(a=>document.querySelector(a.getAttribute('href'))).filter(Boolean);
  function onScroll(){
    const y=window.scrollY+140;let idx=0;
    secs.forEach((s,i)=>{if(s.offsetTop<=y)idx=i;});
    links.forEach((a,i)=>a.classList.toggle('active',i===idx));
  }
  window.addEventListener('scroll',onScroll,{passive:true});
  onScroll();
})();

// Schedule tabs
(function(){
  const tabs=document.querySelectorAll('.tab-btn');
  const panels=document.querySelectorAll('.day-panel');
  tabs.forEach(t=>{
    t.addEventListener('click',()=>{
      const d=t.dataset.day;
      tabs.forEach(x=>x.classList.toggle('active',x===t));
      panels.forEach(p=>p.classList.toggle('active',p.dataset.day===d));
    });
  });
})();

// Count-up stats
(function(){
  const els=document.querySelectorAll('[data-count]');
  if(!els.length)return;
  const io=new IntersectionObserver(entries=>{
    entries.forEach(en=>{
      if(!en.isIntersecting)return;
      const el=en.target,end=parseFloat(el.dataset.count),suf=el.dataset.suffix||'',dur=1200,t0=performance.now();
      function step(t){
        const p=Math.min((t-t0)/dur,1),v=end*(1-Math.pow(1-p,3));
        el.textContent=(end>=10?Math.round(v).toLocaleString():v.toFixed(0))+suf;
        if(p<1)requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
      io.unobserve(el);
    });
  },{threshold:0.3});
  els.forEach(e=>io.observe(e));
})();

// Terminal type-on
(function(){
  const lines=document.querySelectorAll('#hero .console .ln');
  if(!lines.length)return;
  lines.forEach(l=>l.style.visibility='hidden');
  let i=0;
  function next(){if(i>=lines.length)return;lines[i].style.visibility='visible';i++;setTimeout(next,280);}
  setTimeout(next,400);
})();

// Track Intel expand/collapse
(function(){
  const blocks=document.querySelectorAll('.deep-block');
  blocks.forEach(block=>{
    const head=block.querySelector('.db-head');
    const wrap=block.querySelector('.db-body-wrap');
    if(!head||!wrap)return;
    // Force collapsed at load
    wrap.style.maxHeight='0px';
    wrap.style.opacity='0';
    block.dataset.expanded='false';
    head.setAttribute('aria-expanded','false');
    head.addEventListener('click',()=>{
      const isOpen=block.dataset.expanded==='true';
      if(isOpen){
        wrap.style.maxHeight=wrap.scrollHeight+'px';
        requestAnimationFrame(()=>{wrap.style.maxHeight='0px';wrap.style.opacity='0';});
        block.dataset.expanded='false';
        head.setAttribute('aria-expanded','false');
      }else{
        wrap.style.maxHeight=wrap.scrollHeight+'px';
        wrap.style.opacity='1';
        block.dataset.expanded='true';
        head.setAttribute('aria-expanded','true');
        // After animation completes, allow content to flex (handles window resize)
        setTimeout(()=>{if(block.dataset.expanded==='true')wrap.style.maxHeight='none';},600);
      }
    });
  });
  // Recalculate on resize
  window.addEventListener('resize',()=>{
    blocks.forEach(block=>{
      if(block.dataset.expanded!=='true')return;
      const wrap=block.querySelector('.db-body-wrap');
      if(wrap)wrap.style.maxHeight='none';
    });
  });
})();

// Waitlist form submission
(function(){
  const form=document.getElementById('waitlistForm');
  if(!form)return;
  const msg=document.getElementById('formMsg');
  const done=document.getElementById('waitlistDone');
  const submitBtn=document.getElementById('waitlistSubmit');
  form.addEventListener('submit',async (e)=>{
    e.preventDefault();
    // Basic validation
    if(!form.checkValidity()){
      msg.textContent='Please fill in the required fields.';
      msg.className='form-msg error';
      form.reportValidity();
      return;
    }
    const action=form.getAttribute('action')||'';
    // If endpoint not yet configured, simulate success so the UI still demos
    const unconfigured=action.includes('YOUR_FORM_ID');
    form.classList.add('sending');
    submitBtn.textContent='Sending...';
    msg.className='form-msg';
    msg.textContent='';
    try{
      if(!unconfigured){
        const res=await fetch(action,{
          method:'POST',
          headers:{'Accept':'application/json'},
          body:new FormData(form)
        });
        if(!res.ok)throw new Error('Submit failed');
      }else{
        // Small delay so the user sees the transition
        await new Promise(r=>setTimeout(r,700));
      }
      form.classList.add('done');
      done.classList.add('visible');
      done.scrollIntoView({behavior:'smooth',block:'center'});
    }catch(err){
      msg.className='form-msg error';
      msg.textContent='Something went wrong. Please email apex@hesedemet.asia instead.';
      form.classList.remove('sending');
      submitBtn.textContent='Join The Waitlist';
    }
  });
})();
