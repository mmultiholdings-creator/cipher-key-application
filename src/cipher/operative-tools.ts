// Imperative browser-only panels, matching the original page's DOM ownership.
export function createOperativeTools() {
  const modal = document.getElementById('operative-modal');
  const body = document.getElementById('operative-body');
  const title = document.getElementById('operative-title');
  const close = document.getElementById('operative-close');
  let timer: ReturnType<typeof setInterval> | undefined;
  let returnFocus: HTMLElement | null = null;
  let raf = 0; let audio: { ctx: AudioContext; gain: GainNode; osc: OscillatorNode; noise: AudioBufferSourceNode; noiseGain: GainNode; lfo: OscillatorNode } | null = null;
  function stopAudio() { if(!audio) return; try { audio.osc.stop(); audio.noise.stop(); audio.lfo.stop(); audio.ctx.close(); } catch { /* already stopped */ } audio = null; }
  function stop() { if(timer) clearInterval(timer); timer=undefined; cancelAnimationFrame(raf); stopAudio(); }
  function dismiss() { stop(); modal?.classList.add('hidden'); returnFocus?.focus(); }
  close?.addEventListener('click',dismiss);
  document.addEventListener('keydown',e=>{if(e.key==='Escape' && !modal?.classList.contains('hidden')) dismiss();});
  function open(mode: string, target = 'ORION', location = 'Zurich') {
    if(!modal || !body || !title) return;
    stop(); returnFocus=document.activeElement instanceof HTMLElement ? document.activeElement : null;
    title.textContent=({scan:'SIGNAL INTERCEPT · WATERFALL',cams:'SURVEILLANCE RECON GRID',map:'TACTICAL GEOLOCATION',decrypt:'HEX DECRYPTION',satlink:'SATELLITE UPLINK',trace:'RELAY TRACE',burn:'ARCHIVE PURGE'} as Record<string,string>)[mode] || 'OPERATIONS';
    body.replaceChildren(); modal.classList.remove('hidden'); close?.focus();
    const readout=document.createElement('div'); readout.className='operative-readout'; body.append(readout);
    const visual=document.createElement('div'); visual.className='operative-visual'; body.append(visual);
    const action=document.createElement('button'); action.type='button'; action.className='text-button operative-action'; body.append(action);
    const log=document.createElement('pre'); log.className='operative-log'; body.append(log);
    if(mode==='scan') {
      let freq=146.2,locked=false,lockLevel=0,muted=false; const carrier=311.4;
      readout.textContent='SWEEP 88.0–450.0 MHz';
      visual.className='operative-visual scan-console';
      visual.innerHTML='<div class="scan-wf-wrap"><canvas class="scan-waterfall" width="720" height="170"></canvas><i class="scan-cursor"></i></div><canvas class="scan-wave" width="720" height="90"></canvas><div class="scan-controls"><label>FREQ <b class="scan-freq">146.2 MHz</b></label><input class="scan-dial" type="range" min="880" max="4500" value="1462" aria-label="Frequency"><div class="scan-lock"><span></span></div><button type="button" class="text-button scan-mute">Sound on</button></div>';
      const wf=visual.querySelector('.scan-waterfall') as HTMLCanvasElement, wv=visual.querySelector('.scan-wave') as HTMLCanvasElement;
      const dial=visual.querySelector('.scan-dial') as HTMLInputElement, fLabel=visual.querySelector('.scan-freq') as HTMLElement, meter=visual.querySelector('.scan-lock span') as HTMLElement, mute=visual.querySelector('.scan-mute') as HTMLButtonElement;
      const cursor=visual.querySelector('.scan-cursor') as HTMLElement; const wctx=wf.getContext('2d')!, vctx=wv.getContext('2d')!;
      const Ctx=(window as unknown as {AudioContext?:typeof AudioContext;webkitAudioContext?:typeof AudioContext}).AudioContext||(window as unknown as {webkitAudioContext?:typeof AudioContext}).webkitAudioContext;
      const startAudio=()=>{ if(audio||muted||!Ctx) return; try{ const ctx=new Ctx(); const gain=ctx.createGain(); gain.gain.value=0; gain.connect(ctx.destination);
        const osc=ctx.createOscillator(); osc.type='sine'; osc.frequency.value=620; const og=ctx.createGain(); og.gain.value=0; osc.connect(og); og.connect(gain);
        const lfo=ctx.createOscillator(); lfo.frequency.value=6; const lg=ctx.createGain(); lg.gain.value=0.5; lfo.connect(lg); lg.connect(og.gain);
        const buf=ctx.createBuffer(1,ctx.sampleRate*2,ctx.sampleRate); const d=buf.getChannelData(0); for(let i=0;i<d.length;i++) d[i]=Math.random()*2-1;
        const noise=ctx.createBufferSource(); noise.buffer=buf; noise.loop=true; const bp=ctx.createBiquadFilter(); bp.type='bandpass'; bp.frequency.value=1800; bp.Q.value=.7; const noiseGain=ctx.createGain(); noiseGain.gain.value=.5; noise.connect(bp); bp.connect(noiseGain); noiseGain.connect(gain);
        osc.start(); noise.start(); lfo.start(); gain.gain.setTargetAtTime(.06,ctx.currentTime,.3); audio={ctx,gain,osc,noise,noiseGain,lfo}; (audio as unknown as {og:GainNode}).og=og; void ctx.resume(); }catch{ audio=null; } };
      mute.onclick=()=>{ muted=!muted; mute.textContent=muted?'Sound off':'Sound on'; if(muted) stopAudio(); else startAudio(); };
      dial.oninput=()=>{ freq=+dial.value/10; startAudio(); };
      startAudio();
      action.textContent='Lock signal';
      let t=0;
      const draw=()=>{ t++;
        if(!locked && document.activeElement!==dial){ freq+=0.15; if(freq>450) freq=88; dial.value=String(Math.round(freq*10)); }
        const prox=Math.max(0,1-Math.abs(freq-carrier)/6);
        lockLevel=locked?1:prox; fLabel.textContent=freq.toFixed(1)+' MHz'; meter.style.width=Math.round(lockLevel*100)+'%';
        if(!locked) readout.textContent=freq.toFixed(1)+' MHz · '+(prox>.6?'ENCRYPTED CARRIER DETECTED':prox>0?'WEAK SIGNAL':'NOISE FLOOR');
        if(audio){ const og=(audio as unknown as {og:GainNode}).og; audio.osc.frequency.setTargetAtTime(420+lockLevel*480+Math.sin(t/9)*30,audio.ctx.currentTime,.05); og.gain.setTargetAtTime(lockLevel*.9,audio.ctx.currentTime,.1); audio.noiseGain.gain.setTargetAtTime(.55-lockLevel*.4,audio.ctx.currentTime,.1); }
        const W=wf.width,H=wf.height; const img=wctx.getImageData(0,0,W,H-2); wctx.putImageData(img,0,2);
        for(let x=0;x<W;x++){ const f=88+x/W*362; const peak=Math.exp(-Math.pow((f-carrier)/3,2))*(.4+.6*Math.abs(Math.sin(t/7+x/40))); const n=Math.random()*.35+peak; const c=Math.min(255,n*255);
          wctx.fillStyle='rgb('+Math.round(c*.3)+','+Math.round(c*.88)+','+Math.round(c*.85)+')'; wctx.fillRect(x,0,1,2); }
        cursor.style.left=((freq-88)/362*100)+'%';
        const VW=wv.width,VH=wv.height; vctx.clearRect(0,0,VW,VH); vctx.strokeStyle='rgba(115,224,216,.15)'; vctx.beginPath(); vctx.moveTo(0,VH/2); vctx.lineTo(VW,VH/2); vctx.stroke();
        vctx.strokeStyle='rgb(115,224,216)'; vctx.lineWidth=2; vctx.beginPath();
        for(let x=0;x<VW;x++){ const a=(VH*.42)*(lockLevel*Math.sin(x/9+t/2)*Math.sin(x/70+t/15)+(1-lockLevel)*(Math.random()-.5)*.6); x?vctx.lineTo(x,VH/2+a):vctx.moveTo(x,VH/2+a); }
        vctx.stroke(); raf=requestAnimationFrame(draw); };
      raf=requestAnimationFrame(draw);
      const msg='NIGHTGLASS / ORION / MEETING WINDOW 21:40 / WEST CONCOURSE';
      action.onclick=()=>{ startAudio(); if(!locked && Math.abs(freq-carrier)>6){ log.textContent='NO CARRIER AT '+freq.toFixed(1)+' MHz · TUNE CLOSER TO THE BRIGHT BAND'; return; }
        locked=!locked; action.textContent=locked?'Resume sweep':'Lock signal';
        if(locked){ freq=carrier; dial.value=String(carrier*10); readout.textContent='CARRIER LOCKED · '+carrier+' MHz'; log.textContent='DECODING RELAY 04…\n'; let i=0; if(timer) clearInterval(timer); timer=setInterval(()=>{ i++; log.textContent='DECODING RELAY 04…\n'+msg.slice(0,i)+(i<msg.length?'█':'\nCHECKSUM VERIFIED'); if(i>=msg.length&&timer){clearInterval(timer);timer=undefined;} },60); }
        else { if(timer){clearInterval(timer);timer=undefined;} log.textContent='SWEEP RESUMED'; } };
    } else if(mode==='cams') {
      const feeds=['CAM 01 · DOCK 12','CAM 02 · SUB-LEVEL 3 VAULT','CAM 03 · ZURICH CONCOURSE','CAM 04 · ROOFTOP RELAY'];
      let filter='normal';
      readout.textContent='4 FEEDS · LIVE';
      visual.className='operative-visual cam-grid';
      visual.innerHTML=feeds.map((f,i)=>'<button type="button" class="cam-feed cam-'+i+'"><span class="cam-scene"></span><span class="cam-id">'+f+'</span><span class="cam-rec">● REC</span><span class="cam-time"></span></button>').join('');
      const feedEls=[...visual.querySelectorAll<HTMLElement>('.cam-feed')];
      feedEls.forEach((el,i)=>el.onclick=()=>{ const on=!el.classList.contains('cam-focus'); feedEls.forEach(x=>x.classList.remove('cam-focus')); visual.classList.toggle('cam-zoomed',on); if(on) el.classList.add('cam-focus'); log.textContent=on?'FOCUS · '+feeds[i]+'\nMOTION: '+(i===2?'2 SUBJECTS':'NONE')+' · SIGNAL STABLE':''; });
      action.textContent='Night vision';
      action.onclick=()=>{ filter=filter==='normal'?'night':filter==='night'?'thermal':'normal'; visual.dataset.filter=filter; action.textContent=filter==='normal'?'Night vision':filter==='night'?'Thermal':'Standard'; readout.textContent='4 FEEDS · '+filter.toUpperCase(); };
      const tick=()=>{ const d=new Date().toISOString().replace('T',' ').slice(0,19)+' UTC'; visual.querySelectorAll('.cam-time').forEach(e=>e.textContent=d); };
      tick(); timer=setInterval(tick,1000);
    } else if(mode==='map') {
      const pts=[
        {n:'ORION',k:'target',x:62,y:68,c:'47.3769 N / 8.5417 E',w:'Overcast · 6°C',a:'Agent North (400 m)',s:'92%'},
        {n:'DROP-BOX GENEVA',k:'drop',x:18,y:86,c:'46.2044 N / 6.1432 E',w:'Clear · 9°C',a:'None',s:'64%'},
        {n:'SAFE HOUSE BERN',k:'safe',x:42,y:76,c:'46.9480 N / 7.4474 E',w:'Light rain · 7°C',a:'2 operatives',s:'88%'},
        {n:'RELAY FRANKFURT',k:'relay',x:58,y:14,c:'50.1109 N / 8.6821 E',w:'Fog · 4°C',a:'None',s:'71%'}];
      readout.textContent='EUROPEAN THEATRE · 4 MARKERS';
      visual.className='operative-visual tac-map';
      visual.innerHTML='<div class="map-grid"></div><div class="map-sweep"></div>'+pts.map((p,i)=>'<button type="button" class="map-pt map-'+p.k+'" data-i="'+i+'" style="left:'+p.x+'%;top:'+p.y+'%"><i></i><span>'+p.n+'</span></button>').join('');
      const show=(i:number)=>{ const p=pts[i]; if(!p) return; log.textContent=p.n+'\nCOORD   '+p.c+'\nWEATHER '+p.w+'\nPRESENCE '+p.a+'\nSIGNAL  '+p.s; visual.querySelectorAll('.map-pt').forEach(e=>e.classList.toggle('sel',(e as HTMLElement).dataset['i']===String(i))); };
      visual.querySelectorAll<HTMLElement>('.map-pt').forEach(e=>e.onclick=()=>show(Number(e.dataset['i'])));
      show(0); action.textContent='Center on ORION'; action.onclick=()=>show(0);
    } else if(mode==='decrypt') {
      readout.textContent='PACKET NG-041 · SEALED';
      visual.textContent='4E 49 47 48 54 47 4C 41 53 53\n4F 52 49 4F 4E 20 32 31 3A 34 30';
      action.textContent='Begin decryption';
      action.onclick=()=>{stop();let pass=0;action.disabled=true;timer=setInterval(()=>{pass++;readout.textContent='KEY PASS '+pass+' / 8 · '+Math.round(pass/8*100)+'%';log.textContent+='BLOCK '+pass+' / INTEGRITY VERIFIED\n';if(pass===8){stop();visual.textContent='NIGHTGLASS / ORION\nZurich west concourse · 21:40 CET\nRecipient: Agent North';readout.textContent='DECRYPTION COMPLETE';action.disabled=false;action.textContent='Run again';}},220);};
    } else if(mode==='satlink') {
      readout.textContent=location+' · RELAY CISSNA-07';
      visual.innerHTML='<div class="orbital-map"><span class="orbit-track"></span><span class="satellite-marker">◆</span><span class="ground-marker">＋</span></div>';
      let seconds=90;log.textContent='AZIMUTH 142° · ELEVATION 38°\nNEXT WINDOW: 90s';
      timer=setInterval(()=>{seconds=seconds<=0?90:seconds-1;log.textContent='AZIMUTH '+(142+Math.floor((90-seconds)/3))+'° · ELEVATION '+(38+Math.floor((90-seconds)/8))+'°\nNEXT WINDOW: '+seconds+'s\nCHANNEL 04 · '+(seconds<20?'UPLINK WINDOW OPEN':'ORBITAL TRACK CONFIRMED');},1000);
      action.textContent='Acquire uplink';action.onclick=()=>{readout.textContent=location+' · UPLINK ACQUIRED';action.textContent='Link secured';action.disabled=true;};
    } else if(mode==='trace') {
      readout.textContent='TARGET / '+target; action.textContent='Trace relays';
      const run=()=>{stop();visual.replaceChildren();log.textContent='';action.disabled=true;let hop=0;const cities=['Zurich','Geneva','Frankfurt','Reykjavik',target];timer=setInterval(()=>{const node=document.createElement('span');node.className='trace-node';node.textContent=(hop+1)+' · '+cities[hop];visual.append(node);log.textContent+='HOP '+(hop+1)+' / '+cities[hop]+' / '+(12+hop*17)+'ms\n';hop++;if(hop===cities.length){stop();readout.textContent='ROUTE RESOLVED · '+target;action.disabled=false;action.textContent='Trace again';}},350);}; action.onclick=run;run();
    } else {
      readout.textContent='PURGE COMPLETE'; visual.textContent=target;log.textContent='ARCHIVE REFERENCE REMOVED\nACTIVE COPY REMOVED\nVAULT MANIFEST SYNCHRONIZED';action.textContent='Close';action.onclick=dismiss;
    }
  }
  return {open,close:dismiss};
}