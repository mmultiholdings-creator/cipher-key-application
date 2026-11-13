export function createDecryptionConsole(visual: HTMLElement, readout: HTMLElement, action: HTMLButtonElement, log: HTMLElement) {
  visual.className = 'operative-visual decrypt-console';
  visual.innerHTML = '<div class="decrypt-top"><span>NG-041 / ENCRYPTED PAYLOAD</span><b class="decrypt-percent">00%</b></div><div class="decrypt-stage"><canvas width="720" height="210" aria-label="Encrypted data stream"></canvas><div class="decrypt-core"><span class="decrypt-ring"></span><strong class="decrypt-phase">SEALED</strong><small>256-BIT KEYSPACE</small></div></div><div class="decrypt-progress"><span></span></div><div class="decrypt-blocks"></div><div class="decrypt-output"><span>DECRYPTED INTELLIGENCE</span><pre>AWAITING KEY AUTHORIZATION</pre></div>';
  const canvas = visual.querySelector('canvas'); const ctx = canvas?.getContext('2d');
  const percent = visual.querySelector('.decrypt-percent'), phase = visual.querySelector('.decrypt-phase'), progress = visual.querySelector<HTMLElement>('.decrypt-progress span'), output = visual.querySelector('.decrypt-output pre'), blocks = visual.querySelector('.decrypt-blocks');
  if (!canvas || !ctx || !percent || !phase || !progress || !output || !blocks) return () => {};
  blocks.innerHTML = Array.from({length:24},(_,i)=>'<span>'+i.toString(16).padStart(2,'0').toUpperCase()+'</span>').join('');
  const cells = [...blocks.children];
  const tokens = getComputedStyle(document.documentElement), color = tokens.getPropertyValue('--cyan').trim(), bg = tokens.getPropertyValue('--bg').trim();
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  let raf = 0, running = false, started = 0, lastPaint = 0, lastStep = -1, complete = false;
  const message = 'NIGHTGLASS / ORION\nMEETING WINDOW 21:40 CET\nZURICH · WEST CONCOURSE\nRECIPIENT: AGENT NORTH';
  action.textContent = 'Authorize decryption';
  readout.textContent = 'CLASSIFIED PACKET · NG-041 · INTEGRITY SEALED';
  const draw = (now: number) => {
    const p = running ? Math.min(1,(now-started)/5600) : complete ? 1 : 0;
    if (now-lastPaint > (reduced ? 300 : 110)) {
      ctx.fillStyle = bg; ctx.fillRect(0,0,canvas.width,canvas.height); ctx.fillStyle = color; ctx.font = '12px monospace';
      for(let row=0;row<12;row++) for(let col=0;col<42;col++) { ctx.globalAlpha = complete ? .08 : .12 + ((col+row)%5)*.065; ctx.fillText(Math.floor(Math.random()*256).toString(16).padStart(2,'0').toUpperCase(),col*18,row*19+16); }
      ctx.globalAlpha = 1; lastPaint = now;
    }
    if (running) {
      const n = Math.floor(p*100); percent.textContent = String(n).padStart(2,'0')+'%'; progress.style.width = n+'%';
      cells.forEach((cell,i)=>cell.classList.toggle('unlocked',i<Math.floor(p*24)));
      const step = Math.min(3,Math.floor(p*4));
      if(step!==lastStep) { lastStep=step; phase.textContent=['ANALYZING','KEY DERIVATION','DECODING','VERIFYING'][step] ?? 'VERIFYING'; log.textContent += ['[01] PACKET SIGNATURE VERIFIED\n[02] KEYSPACE MAPPED\n','[03] SESSION KEY DERIVED\n[04] BLOCK CHAIN SYNCHRONIZED\n','[05] PAYLOAD BLOCKS UNSEALED\n','[06] AUTHENTICATION TAG MATCHED\n'][step] ?? ''; }
      readout.textContent = 'NG-041 · '+phase.textContent+' · '+n+'%';
      if(p>.5) { const count = Math.floor((p-.5)*2*message.length); output.textContent=message.slice(0,count)+(p<1?' ▌':''); }
      if(p===1) { running=false;complete=true;visual.classList.remove('decrypt-running');visual.classList.add('decrypt-complete');phase.textContent='VERIFIED';readout.textContent='DECRYPTION COMPLETE · CHECKSUM VERIFIED';log.textContent+='[07] INTEGRITY VERIFIED / 24 OF 24 BLOCKS\n[08] SECURE PAYLOAD RELEASED';action.disabled=false;action.textContent='Decrypt again'; }
    }
    raf=requestAnimationFrame(draw);
  };
  action.onclick=()=>{started=performance.now();running=true;complete=false;lastStep=-1;log.textContent='';output.textContent='RECOVERING PAYLOAD…';action.disabled=true;visual.classList.remove('decrypt-complete');visual.classList.add('decrypt-running');};
  raf=requestAnimationFrame(draw);
  return ()=>{cancelAnimationFrame(raf);action.onclick=null;};
}