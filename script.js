const q=(s,c=document)=>c.querySelector(s), qa=(s,c=document)=>[...c.querySelectorAll(s)];

// Menu
const menuBtn=q('#menuBtn'), drawer=q('#drawer');
menuBtn.addEventListener('click',()=>{const open=drawer.classList.toggle('open');menuBtn.setAttribute('aria-expanded',open);drawer.setAttribute('aria-hidden',!open);document.body.classList.toggle('lock',open)});
qa('#drawer a').forEach(a=>a.addEventListener('click',()=>{drawer.classList.remove('open');document.body.classList.remove('lock');menuBtn.setAttribute('aria-expanded','false')}));

// Reveal + chapter rail
const revealObs=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting)e.target.classList.add('visible')}),{threshold:.12});qa('.reveal').forEach(el=>revealObs.observe(el));
const sections=qa('section[data-chapter]'), dots=qa('.chapter-dot');
const secObs=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){const id=e.target.id;dots.forEach(d=>d.classList.toggle('active',d.getAttribute('href')===`#${id}`))}}),{rootMargin:'-35% 0px -55% 0px'});sections.forEach(s=>secObs.observe(s));

// Technology tabs
qa('.tech-tab').forEach(btn=>btn.addEventListener('click',()=>{qa('.tech-tab').forEach(b=>b.classList.remove('active'));qa('.panel').forEach(p=>p.classList.remove('active'));btn.classList.add('active');q(`#${btn.dataset.panel}`).classList.add('active')}));

// Calculator
const market=q('#marketSize'), share=q('#share'), capture=q('#capture'), margin=q('#margin');
const money=v=>v>=1000?`$${(v/1000).toFixed(1)}B`:`$${v.toFixed(1)}M`;
function calc(){
  const m=+market.value*1000,s=+share.value/100,c=+capture.value/100,g=+margin.value/100;
  const reachable=m*s, monetised=reachable*c, revenue=monetised*g;
  q('#marketOut').textContent=`$${(+market.value).toFixed(1)}B`;q('#shareOut').textContent=`${(+share.value).toFixed(2)}%`;q('#captureOut').textContent=`${capture.value}%`;q('#marginOut').textContent=`${margin.value}%`;
  q('#reachable').textContent=money(reachable);q('#monetised').textContent=money(monetised);q('#revenue').textContent=money(revenue);
  q('#barFill').style.width=`${Math.min(100,20+(+share.value/3)*80)}%`;
  q('#scenarioText').textContent=`At ${(+share.value).toFixed(2)}% share, ${capture.value}% partner capture and ${margin.value}% royalty-equivalent margin, the illustrative annual revenue is ${money(revenue)}.`;
}
[market,share,capture,margin].forEach(i=>i.addEventListener('input',calc));calc();

// Deck viewer
const titles=['Vision','Motivation','Motivation','Solution','Technical feasibility','Next update','After next update','Future direction','Innovation','Market analysis','Competition & market gap','Competition & market gap','Growth strategy','Technology protection','Limitations & revenue impact','Financial plan & financing strategy','Use of funds & milestone strategy','Our team','Acknowledgements','Contact us'];
let current=0;const deckImg=q('#deckImage'), deckCount=q('#deckCount'), deckTitle=q('#deckTitle'), thumbs=q('#deckThumbs');
for(let i=0;i<20;i++){const b=document.createElement('button');b.className='thumb'+(i===0?' active':'');b.innerHTML=`<img loading="lazy" src="assets/slides/slide-${String(i+1).padStart(2,'0')}.webp" alt="Slide ${i+1}">`;b.addEventListener('click',()=>showSlide(i));thumbs.appendChild(b)}
function showSlide(i){current=(i+20)%20;deckImg.src=`assets/slides/slide-${String(current+1).padStart(2,'0')}.webp`;deckImg.alt=`FreunDo pitch deck slide ${current+1}`;deckCount.textContent=`${String(current+1).padStart(2,'0')} / 20`;deckTitle.textContent=titles[current];qa('.thumb',thumbs).forEach((t,j)=>t.classList.toggle('active',j===current));qa('.thumb',thumbs)[current].scrollIntoView({behavior:'smooth',inline:'center',block:'nearest'})}
q('#prevSlide').addEventListener('click',()=>showSlide(current-1));q('#nextSlide').addEventListener('click',()=>showSlide(current+1));
let sx=0;deckImg.addEventListener('touchstart',e=>sx=e.touches[0].clientX,{passive:true});deckImg.addEventListener('touchend',e=>{const d=e.changedTouches[0].clientX-sx;if(Math.abs(d)>50)showSlide(current+(d<0?1:-1))},{passive:true});

// Keyboard deck control when section is visible
window.addEventListener('keydown',e=>{const r=q('#deck').getBoundingClientRect();if(r.top<innerHeight&&r.bottom>0){if(e.key==='ArrowRight')showSlide(current+1);if(e.key==='ArrowLeft')showSlide(current-1)}});
