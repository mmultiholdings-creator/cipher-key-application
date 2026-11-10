// Imperative browser-only panels, matching the original page's DOM ownership.
export function createOperativeTools() {
  const modal = document.getElementById('operative-modal');
  const body = document.getElementById('operative-body');
  const title = document.getElementById('operative-title');
  const close = document.getElementById('operative-close');
  let timer: ReturnType<typeof setInterval> | undefined;
  let returnFocus: HTMLElement | null = null;
  function stop() { if(timer) clearInterval(timer); timer=undefined; }
  function dismiss() { stop(); modal?.classList.add('hidden'); returnFocus?.focus(); }
  close?.addEventListener('click',dismiss);
  document.addEventListener('keydown',e=>{if(e.key==='Escape' && !modal?.classList.contains('hidden')) dismiss();});
  function open(mode: string, target = 'ORION', location = 'Zurich') {
    if(!modal || !body || !title) return;
    stop(); returnFocus=document.activeElement instanceof HTMLElement ? document.activeElement : null;
    title.textContent=({scan:'SIGNAL INTERCEPT',decrypt:'HEX DECRYPTION',satlink:'SATELLITE UPLINK',trace:'RELAY TRACE',burn:'ARCHIVE PURGE'} as Record<string,string>)[mode] || 'OPERATIONS';
    body.replaceChildren(); modal.classList.remove('hidden'); close?.focus();
    const readout=document.createElement('div'); readout.className='operative-readout'; body.append(readout);
    const visual=document.createElement('div'); visual.className='operative-visual'; body.append(visual);
    const action=document.createElement('button'); action.type='button'; action.className='text-button operative-action'; body.append(action);
    const log=document.createElement('pre'); log.className='operative-log'; body.append(log);
    if(mode==='scan') {
      let band=86.4,locked=false;
      readout.textContent='CH 04 · SWEEP ACTIVE';
      visual.innerHTML='<div class="signal-bars">'+Array.from({length:32},(_,i)=>'<i class="signal-bar bar-'+i%4+'"></i>').join('')+'</div>';
      action.textContent='Lock signal';
      timer=setInterval(()=>{if(!locked){band+=.2; if(band>108)band=86.4; readout.textContent=band.toFixed(1)+' MHz · ENCRYPTED CARRIER';}},300);
      action.onclick=()=>{locked=!locked; action.textContent=locked?'Resume sweep':'Lock signal'; log.textContent=locked?'CARRIER LOCKED · '+band.toFixed(1)+' MHz\nDECODING RELAY 04…\nNIGHTGLASS / ORION / MEETING WINDOW 21:40\nCHECKSUM VERIFIED':'SWEEP RESUMED';};
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