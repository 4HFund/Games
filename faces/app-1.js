'use strict';

  const PEOPLE = {
    bobby:{name:'Pastor Bobby Westfall',glyph:'BW',series:'LEADERSHIP',accent:'#ff762f',role:'Lead Pastor · Storyteller',mission:'Message Forge',tag:'Remember the flow. Build the message.',game:'bobby',category:['leadership'],art:'assets/bobby-card.webp',sprite:'assets/bobby-sprite.webp'},
    dave:{name:'Pastor Dave',glyph:'PD',series:'VISITATION + BIBLE STUDY',accent:'#f25b45',role:'Visitation Ministry · Wesleyan Bible Study · Sundays at 9:15',mission:'Soul Fire',tag:'Show up. Encourage. Know the Word.',game:'visit',category:['leadership','outreach']},
    smith:{name:'Ryan + Brooke Smith',glyph:'RS',series:'MARRIAGE MINISTRY',accent:'#d78fc8',role:'Marriage Ministry',mission:'Better Together',tag:'Listen well. Choose connection.',game:'bridge',category:['outreach']},
    cody:{name:'Cody Anne Michael',glyph:'CM',series:'CHURCH ADMINISTRATION',accent:'#88a9ff',role:'Church Admin · Secretary · Materials + Organization',mission:'Sunday Ops',tag:'Keep the moving pieces moving.',game:'sort',category:['behind']},
    beatty:{name:'Barb + Jay Beatty',glyph:'BJ',series:"GOD'S CHOICE + KENNY'S KLOSET",accent:'#ffbd66',role:"God's Choice Ministry · Founders of Kenny's Kloset",mission:'Kloset Origins',tag:'Start with an empty room. Build something that serves.',game:'sort',category:['outreach']},
    kelly:{name:'Kelly Harris',glyph:'KH',series:'KIDS + UPWARD',accent:'#f1c75f',role:'Kids Ministry Volunteer · Upward Coach · Always ready to help',mission:'Kids Crew',tag:'See the need. Jump in.',game:'tap',category:['kids','sports']},
    upward:{name:'Emily + Ryan Cook',glyph:'UC',series:'UPWARD SPORTS',accent:'#57b9ff',role:'Co-Leaders of Upward',mission:'Upward Game Day',tag:'Coach. Encourage. Shoot.',game:'basket',category:['sports','kids']},
    cook:{name:'John + Bev Cook',glyph:'JC',series:'FINANCE + FIRST IMPRESSIONS',accent:'#72c9c0',role:'John: Church Accounting · Bev: First Impressions',mission:'Sunday Starts Here',tag:'Balance the books. Open the doors.',game:'dual',category:['hospitality','behind']},
    vargo:{name:'The Vargo Family',glyph:'VF',series:'STAGE + ENVIRONMENT',accent:'#b08cff',role:'Stage Setup · Design · Physical Environment',mission:'Build the Room',tag:'Turn an empty stage into a Sunday environment.',game:'sequence',category:['behind']},
    walker:{name:'Rob + Janice Walker',glyph:'RW',series:'NEXT GEN + OUTDOORS',accent:'#73d08a',role:'Rob: Next Generation Kids + Hiking Ministry · Janice: serving alongside the family',mission:'Trail Guide',tag:'Find the markers. Dodge the rocks.',game:'trail',category:['kids','outreach']},
    mozingo:{name:'Sidney + Jacy Mozingo',glyph:'SM',series:'CREATIVE + OUTREACH',accent:'#ff7157',role:'Creative + Media · Kenny’s Kloset · God’s Choice · Events · Kids',mission:'Serve + Create',tag:'Different lanes. Same mission.',game:'reaction',category:['behind','outreach']},
    bailee:{name:'Bailee Steele',glyph:'BS',series:'CHILDREN\'S MINISTRY',accent:'#ffc759',role:'Stepped in to help keep Children’s Ministry moving',mission:'Keep It Moving',tag:'Show up when there is a need.',game:'sort',category:['kids']},
    riggs:{name:'Tyler + Alexis Riggs',glyph:'TR',series:'FITNESS + SERVE TEAM',accent:'#87df8f',role:'Tyler: Foundery Fitness · Tyler + Alexis: Serve Team Volunteers',mission:'Built to Serve',tag:'Move. Lift. Help. Repeat.',game:'fitness',category:['sports','behind']},
    parr:{name:'The Parr Family',glyph:'PF',series:'SPORTS + MEDIA + BUILDING CARE',accent:'#ff9e62',role:'Monday Volleyball · Sports Ministry · Camera · Building Care',mission:'Keep It Moving',tag:'Volleyball. Camera. Building. Serve.',game:'parr',category:['sports','behind']},
    sandy:{name:'Sandy Hart',glyph:'SH',series:"HOSPITALITY + KENNY'S KLOSET LEGACY",accent:'#f4b46b',role:"Sunday Hospitality · Kenny’s Kloset is named in memory of her husband, Ken Hart",mission:'Cookie Crew',tag:'A warm welcome can start with something simple.',game:'cookies',category:['hospitality']},
    penrod:{name:'Judy + Ron Penrod',glyph:'JP',series:'HOSPITALITY',accent:'#f0d27d',role:'Hospitality Ministry',mission:'Welcome Home',tag:'Open the doors. Notice people. Make them feel welcome.',game:'welcome',category:['hospitality']}
  };

  const SORT_DATA = {
    cody:{cats:['PRINT','CALENDAR','EVENTS','OFFICE'],items:[['Sunday brochures','PRINT','BR'],['Room request','CALENDAR','RR'],['Event signup','EVENTS','ES'],['Incoming paperwork','OFFICE','PW'],['Flyer revision','PRINT','FR'],['Meeting date','CALENDAR','MD'],['Volunteer list','EVENTS','VL'],['Church records','OFFICE','CR']]},
    beatty:{cats:['KIDS','ADULTS','SHOES','ACCESSORIES'],items:[['Kids hoodie','KIDS','KH'],['Adult coat','ADULTS','AC'],['Sneakers','SHOES','SN'],['Backpack','ACCESSORIES','BP'],['Girls jeans','KIDS','GJ'],['Mens shirt','ADULTS','MS'],['Boots','SHOES','BT'],['Purse','ACCESSORIES','PR']]},
    bailee:{cats:['CHECK-IN','ROOM','LESSON','SUPPLIES'],items:[['New family','CHECK-IN','NF'],['Volunteer room','ROOM','VR'],['Bible story','LESSON','BS'],['Crayons low','SUPPLIES','CR'],['Name tag','CHECK-IN','NT'],['Room change','ROOM','RC'],['Teaching guide','LESSON','TG'],['Snack cups','SUPPLIES','SC']]}
  };

  const $ = (s,root=document) => root.querySelector(s);
  const $$ = (s,root=document) => [...root.querySelectorAll(s)];
  const ids = Object.keys(PEOPLE);
  const safe = {
    get(k,f){try{const v=localStorage.getItem(k);return v==null?f:v}catch{return f}},
    set(k,v){try{localStorage.setItem(k,v)}catch{}},
    json(k,f){try{return JSON.parse(this.get(k,''))||f}catch{return f}}
  };
  const owned = new Set(Array.isArray(safe.json('facesOwned',[]))?safe.json('facesOwned',[]):[]);
  const results = safe.json('facesResults',{});
  let filter='all',currentId=null,sfxOn=safe.get('facesSfx','on')!=='off';

  const Runtime = {
    timeouts:new Set(),intervals:new Set(),rafs:new Set(),cleanups:new Set(),
    timeout(fn,ms){const id=setTimeout(()=>{this.timeouts.delete(id);fn()},ms);this.timeouts.add(id);return id},
    interval(fn,ms){const id=setInterval(fn,ms);this.intervals.add(id);return id},
    raf(fn){let id;const loop=t=>{this.rafs.delete(id);fn(t,next=>{id=requestAnimationFrame(loop);this.rafs.add(id);next?.()})};id=requestAnimationFrame(loop);this.rafs.add(id);return id},
    everyFrame(fn){let active=true,id;const tick=t=>{if(!active)return;fn(t);id=requestAnimationFrame(tick);this.rafs.add(id)};id=requestAnimationFrame(tick);this.rafs.add(id);this.cleanups.add(()=>{active=false});},
    on(el,ev,fn,opts){el.addEventListener(ev,fn,opts);this.cleanups.add(()=>el.removeEventListener(ev,fn,opts));},
    clear(){this.timeouts.forEach(clearTimeout);this.intervals.forEach(clearInterval);this.rafs.forEach(cancelAnimationFrame);this.cleanups.forEach(fn=>{try{fn()}catch{}});this.timeouts.clear();this.intervals.clear();this.rafs.clear();this.cleanups.clear();}
  };

  let audioCtx=null;
  function sfx(type){if(!sfxOn)return;try{audioCtx ||= new (window.AudioContext||window.webkitAudioContext)();const o=audioCtx.createOscillator(),g=audioCtx.createGain(),now=audioCtx.currentTime;const map={select:330,good:520,bad:120,go:660,clear:784};o.type=type==='bad'?'sawtooth':'square';o.frequency.setValueAtTime(map[type]||440,now);if(type==='go'||type==='clear')o.frequency.exponentialRampToValueAtTime(type==='go'?990:1174,now+.12);g.gain.setValueAtTime(.03,now);g.gain.exponentialRampToValueAtTime(.001,now+.12);o.connect(g);g.connect(audioCtx.destination);o.start();o.stop(now+.13)}catch{}}

  function render(){
    const grid=$('#cardGrid'),binder=$('#binderGrid');grid.innerHTML='';binder.innerHTML='';
    ids.forEach((id,i)=>{const p=PEOPLE[id],yes=owned.has(id);const visible=filter==='all'||p.category.includes(filter);if(visible){const card=document.createElement('button');card.className='card'+(yes?' owned':'');card.dataset.id=id;card.style.setProperty('--a',p.accent);card.innerHTML=`<div class="card__art"><div class="card__top"><span class="card__series">${p.series}</span><span class="card__no">#${String(i+1).padStart(2,'0')}</span></div><span class="card__state">${yes?'✓ COLLECTED':'PLAY TO UNLOCK'}</span><div class="card__emblem">${p.glyph}</div><div class="card__bottom"><div class="card__mission">${p.mission}</div><div class="card__name">${p.name}</div></div></div><div class="card__body"><div class="card__role">${p.role}</div><div class="card__play"><span>${yes?'REPLAY MISSION':'PLAY MISSION'}</span><b>▶</b></div></div>`;card.onclick=()=>openBrief(id);grid.appendChild(card)}
      const slot=document.createElement('div');slot.className='slot'+(yes?' owned':'');slot.innerHTML=`<div><strong>${yes?p.name:'LOCKED'}</strong><small>${yes?(results[id]||p.series):'COMPLETE THE MISSION'}</small></div><div class="slot__seal">${yes?p.glyph:'?'}</div>`;binder.appendChild(slot);
    });
    const count=owned.size,pct=Math.round(count/ids.length*100);$('#ownedCount').textContent=count;$('#totalCount').textContent=ids.length;$('#progressText').textContent=`${count} OF ${ids.length} COMPLETE`;$('#binderPct').textContent=`${pct}%`;$('#binderFill').style.width=`${pct}%`;$('#bootCount').textContent=`${count} / ${ids.length} CARDS`;$('#bootFill').style.width=`${pct}%`;
  }

  function renderFilters(){const cats=[['all','ALL 16'],['leadership','LEADERSHIP'],['kids','KIDS'],['hospitality','HOSPITALITY'],['sports','SPORTS'],['outreach','OUTREACH'],['behind','BEHIND THE SCENES']];$('#filters').innerHTML='';cats.forEach(([k,l])=>{const b=document.createElement('button');b.className='filter'+(filter===k?' active':'');b.textContent=l;b.onclick=()=>{filter=k;renderFilters();render();sfx('select')};$('#filters').appendChild(b)})}

  function showOverlay(){Runtime.clear();$('#overlay').classList.add('show');$('#overlay').setAttribute('aria-hidden','false');document.body.style.overflow='hidden'}
  function closeOverlay(){Runtime.clear();currentId=null;$('#overlay').classList.remove('show');$('#overlay').setAttribute('aria-hidden','true');document.body.style.overflow=''}
  function theme(id){const p=PEOPLE[id];currentId=id;$('#gameShell').style.setProperty('--a',p.accent);$('#gameTitle').textContent=p.mission;$('#gameSub').textContent=`${p.name} · ${p.series}`}
  function openBrief(id){showOverlay();theme(id);const p=PEOPLE[id],n=ids.indexOf(id)+1;$('#stage').innerHTML=`<div class="brief"><div class="brief__card ${p.art?'hasArt':''}" style="--a:${p.accent}"><div class="brief__emblem">${p.glyph}</div><footer><strong>${p.name}</strong><small>${p.series}</small></footer></div><div class="brief__copy"><span>STAGE ${String(n).padStart(2,'0')} / ${ids.length}</span><h3>${p.mission}</h3><p>${p.tag}</p><p>${p.role}</p>${results[id]?`<div class="lastRun"><b>LAST RUN</b><small>${results[id]}</small></div>`:''}<div class="brief__actions"><button id="startMission" class="primary">▶ START MISSION</button><button id="backMission" class="secondary">BACK</button></div></div></div>`;$('#startMission').onclick=()=>startGame(id);$('#backMission').onclick=closeOverlay;sfx('select')}
  function startGame(id){Runtime.clear();theme(id);const p=PEOPLE[id],n=ids.indexOf(id)+1;$('#stage').innerHTML=`<div class="ready"><div class="ready__box"><div class="ready__stage">STAGE ${String(n).padStart(2,'0')}</div><div class="ready__word">READY?</div><div class="ready__mission">${p.mission}</div><div class="ready__hint">GET SET...</div></div></div>`;Runtime.timeout(()=>{const w=$('.ready__word');if(w){w.textContent='GO!';w.classList.add('go');$('.ready__hint').textContent='PLAY!';sfx('go')}},520);Runtime.timeout(()=>runGame(id),950)}
  function gameHeader(id,title,copy){const p=PEOPLE[id];$('#stage').innerHTML=`<div class="gameHeader"><h3>${title}</h3><p>${copy}</p></div><div id="gameBody"></div>`;return $('#gameBody')}
  function fail(id,msg){if(currentId!==id)return;Runtime.clear();sfx('bad');$('#stage').innerHTML=`<div class="gameOver"><div class="gameOver__box"><div class="gameOver__small">STAGE FAILED</div><div class="gameOver__title">TRY AGAIN!</div><p>${msg}</p><div class="gameOver__actions"><button id="retry" class="primary">▶ RETRY</button><button id="exit" class="secondary">MISSION SELECT</button></div></div></div>`;$('#retry').onclick=()=>startGame(id);$('#exit').onclick=closeOverlay}
  function win(id,stats){if(currentId!==id)return;Runtime.clear();owned.add(id);results[id]=stats;safe.set('facesOwned',JSON.stringify([...owned]));safe.set('facesResults',JSON.stringify(results));render();sfx('clear');const p=PEOPLE[id];$('#stage').innerHTML=`<div class="reveal"><div class="reveal__box"><div class="reveal__card ${p.art?'hasArt':''}" style="--a:${p.accent}"><div class="reveal__emblem">${p.glyph}</div><footer><strong>${p.name}</strong><small>${p.role}</small></footer></div><h3>CARD UNLOCKED!</h3><p>${stats}</p><button id="done" class="primary">BACK TO COLLECTION</button></div></div>`;$('#done').onclick=closeOverlay}
  function feedback(el,msg,ok){el.className='feedback '+(ok?'good':'bad');el.textContent=msg;sfx(ok?'good':'bad');$('#gameShell').classList.remove('shake','flash');void $('#gameShell').offsetWidth;$('#gameShell').classList.add(ok?'flash':'shake');Runtime.timeout(()=>$('#gameShell').classList.remove('shake','flash'),220)}

  async function sleep(ms){return new Promise(res=>Runtime.timeout(res,ms))}
