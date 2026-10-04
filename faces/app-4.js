  $('#closeBtn').onclick=closeOverlay;$('#restartBtn').onclick=()=>currentId&&startGame(currentId);$('#overlay').addEventListener('click',e=>{if(e.target===$('#overlay'))closeOverlay()});document.addEventListener('keydown',e=>{if(e.key==='Escape'&&$('#overlay').classList.contains('show'))closeOverlay()});
  $('#sfxBtn').onclick=()=>{sfxOn=!sfxOn;safe.set('facesSfx',sfxOn?'on':'off');$('#sfxBtn').textContent=sfxOn?'SFX ON':'SFX OFF';$('#sfxBtn').classList.toggle('off',!sfxOn);if(sfxOn)sfx('select')};$('#sfxBtn').textContent=sfxOn?'SFX ON':'SFX OFF';$('#sfxBtn').classList.toggle('off',!sfxOn);
  function dismissBoot(target){$('#boot').classList.add('hide');Runtime.timeout(()=>$('#boot').style.display='none',260);if(target)Runtime.timeout(()=>$(target)?.scrollIntoView({behavior:'smooth'}),280)}$('#bootStart').onclick=()=>dismissBoot('#missionSelect');$('#bootCollection').onclick=()=>dismissBoot('#collection');

  renderFilters();render();
  const direct=new URLSearchParams(location.search).get('person');if(direct&&PEOPLE[direct]){$('#boot').style.display='none';openBrief(direct)}
