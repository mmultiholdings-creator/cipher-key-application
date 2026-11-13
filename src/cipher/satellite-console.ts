import earthAsset from '@/assets/orbital-earth.jpg.asset.json';
import { satellites, SATELLITE_CONNECT_MS, satelliteConnectionReady } from './satellite-data';

// Imported only after a browser action; no renderer or WebGL work during SSR.
export async function createSatelliteConsole(host: HTMLElement, readout: HTMLElement, location: string) {
  let disposed = false;
  let cleanup = () => {};
  const dispose = () => { disposed = true; cleanup(); };
  host.className = 'operative-visual satellite-console';
  host.innerHTML = '<div class="sat-scene"><div class="sat-caption">ORBITAL COMMAND <span>LOW EARTH NETWORK</span></div><div class="sat-canvas"></div><div class="sat-labels"></div><div class="sat-crosshair"></div><div class="sat-bottom">EARTH / 6371 KM <span>SECURE TRACKING</span></div></div><aside class="sat-details"><div class="sat-overline">ASSET DIRECTORY / 04</div><h3>Orbital network</h3><p class="sat-state">STANDBY · NO UPLINK</p><div class="sat-directory"></div><div class="sat-telemetry"></div></aside>';
  const container = host.querySelector<HTMLElement>('.sat-canvas');
  const labels = host.querySelector<HTMLElement>('.sat-labels');
  const directory = host.querySelector<HTMLElement>('.sat-directory');
  const detail = host.querySelector<HTMLElement>('.sat-telemetry');
  const state = host.querySelector<HTMLElement>('.sat-state');
  const heading = host.querySelector<HTMLElement>('h3');
  if (!container || !labels || !directory || !detail || !state || !heading) return dispose;
  const THREE = await import('three');
  if (disposed || !host.isConnected) return dispose;
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(43, 1, 0.1, 100);
  camera.position.set(0, 2.5, 7.8);
  camera.lookAt(0, 0, 0);
  let renderer: InstanceType<typeof THREE.WebGLRenderer>;
  try { renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true }); }
  catch { state.textContent = 'DISPLAY UNAVAILABLE'; return dispose; }
  const tokens = getComputedStyle(document.documentElement);
  const blue = tokens.getPropertyValue('--orbital-blue').trim();
  const cyan = tokens.getPropertyValue('--cyan').trim();
  const white = tokens.getPropertyValue('--white').trim();
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  container.append(renderer.domElement);
  const group = new THREE.Group(); scene.add(group);
  const texture = new THREE.TextureLoader().load(earthAsset.url);
  texture.colorSpace = THREE.SRGBColorSpace;
  const earth = new THREE.Mesh(new THREE.SphereGeometry(1.35, 64, 48), new THREE.MeshPhongMaterial({ map: texture, color: blue, emissive: blue, emissiveIntensity: .23, shininess: 18 }));
  group.add(earth);
  group.add(new THREE.Mesh(new THREE.SphereGeometry(1.39, 32, 20), new THREE.MeshBasicMaterial({ color: blue, wireframe: true, transparent: true, opacity: .12 })));
  group.add(new THREE.Mesh(new THREE.SphereGeometry(1.44, 48, 32), new THREE.MeshBasicMaterial({ color: blue, transparent: true, opacity: .07, side: THREE.BackSide })));
  scene.add(new THREE.AmbientLight(white, 1.1));
  const light = new THREE.DirectionalLight(white, 2.7); light.position.set(4, 3, 5); scene.add(light);
  let selected = -1, pending = -1, started = 0, raf = 0, focus = 0;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const pos = new THREE.Vector3();
  const entries = satellites.map((sat, i) => {
    const pivot = new THREE.Group(); pivot.rotation.z = (i - 1.5) * .48; pivot.rotation.x = i * .36; group.add(pivot);
    const radius = 1.9 + i * .17;
    const pts = Array.from({ length: 129 }, (_, n) => new THREE.Vector3(Math.cos(n / 128 * Math.PI * 2) * radius, 0, Math.sin(n / 128 * Math.PI * 2) * radius));
    const track = new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), new THREE.LineBasicMaterial({ color: blue, transparent: true, opacity: .42 })); pivot.add(track);
    const craft = new THREE.Group();
    craft.add(new THREE.Mesh(new THREE.BoxGeometry(.13, .13, .16), new THREE.MeshBasicMaterial({ color: white })));
    for (const x of [-.17, .17]) { const panel = new THREE.Mesh(new THREE.BoxGeometry(.19, .025, .15), new THREE.MeshBasicMaterial({ color: blue })); panel.position.x = x; craft.add(panel); }
    pivot.add(craft);
    const button = document.createElement('button'); button.type = 'button'; button.className = 'text-button sat-target'; button.textContent = sat.id; button.setAttribute('aria-label', 'Connect to ' + sat.id); labels.append(button);
    const row = document.createElement('button'); row.type = 'button'; row.className = 'text-button sat-row'; row.innerHTML = '<span>' + sat.id + '</span><small>' + sat.role + '</small>'; directory.append(row);
    const connect = () => {
      if (pending >= 0) return;
      selected = -1; pending = i; started = performance.now();
      heading.textContent = sat.id; state.textContent = 'ACQUIRING UPLINK…';
      host.classList.remove('sat-connected'); host.classList.add('sat-connecting');
      readout.textContent = location.toUpperCase() + ' · AUTHENTICATING ' + sat.id;
      detail.innerHTML = '<div class="sat-handshake"><span></span></div><p>HANDSHAKE / KEY EXCHANGE</p>';
      entries.forEach((e, n) => { e.row.classList.toggle('active', n === i); e.button.classList.toggle('active', n === i); e.row.disabled = true; e.button.disabled = true; });
    };
    button.onclick = connect; row.onclick = connect;
    return { craft, track, button, row, radius, phase: sat.phase };
  });
  const resize = () => { const w = container.clientWidth, h = container.clientHeight; if (!w || !h) return; renderer.setSize(w, h); camera.aspect = w / h; camera.updateProjectionMatrix(); };
  const observer = new ResizeObserver(resize); observer.observe(container); resize();
  const frame = (now: number) => {
    if (disposed) return;
    if (pending >= 0 && satelliteConnectionReady(now - started)) {
      selected = pending; pending = -1;
      const sat = satellites[selected];
      if (sat) {
        state.textContent = 'UPLINK SECURED · ' + sat.signal + '%'; host.classList.remove('sat-connecting'); host.classList.add('sat-connected');
        readout.textContent = sat.id + ' · TRACKING LOCKED · CHANNEL SECURE';
        detail.innerHTML = '<dl>' + [['MISSION',sat.role],['ALTITUDE',sat.altitude+' km'],['INCLINATION',sat.inclination+'°'],['ORBITAL PERIOD',sat.period+' min'],['DOWNLINK',sat.frequency],['ENCRYPTION',sat.cipher],['COVERAGE',sat.footprint],['GROUND STATION',location],['BATTERY','97% / SOLAR ARRAY ACTIVE'],['THERMAL','+18°C / NOMINAL']].map(([k,v])=>'<div><dt>'+k+'</dt><dd>'+v+'</dd></div>').join('') + '</dl>';
      }
      entries.forEach(e => { e.row.disabled = false; e.button.disabled = false; });
    }
    focus += ((selected >= 0 ? 1 : 0) - focus) * (reduced ? 1 : .025);
    group.scale.setScalar(1 + focus * .2);
    if (!reduced) earth.rotation.y = now * .000018;
    entries.forEach((e, i) => {
      const angle = e.phase + (reduced ? 0 : now * .000045 * (1 - i * .1));
      e.craft.position.set(Math.cos(angle) * e.radius, 0, Math.sin(angle) * e.radius);
      e.track.material.opacity = selected < 0 || selected === i ? .65 : .1;
      e.craft.scale.setScalar(selected === i ? 1.6 : 1);
      e.craft.getWorldPosition(pos); pos.project(camera);
      e.button.style.left = ((pos.x * .5 + .5) * 100) + '%'; e.button.style.top = ((-.5 * pos.y + .5) * 100) + '%';
      e.button.classList.toggle('sat-dim', selected >= 0 && selected !== i);
    });
    // Keep the blue globe visible while following the selected craft more closely.
    if (selected >= 0) {
      const entry = entries[selected];
      if (entry) { entry.craft.getWorldPosition(pos); const desired = pos.clone().multiplyScalar(.25 * focus); camera.position.lerp(new THREE.Vector3(desired.x, 2.5 + desired.y, 7.8 - focus * 2), reduced ? 1 : .035); camera.lookAt(desired); }
    } else { camera.position.lerp(new THREE.Vector3(0, 2.5, 7.8), .04); camera.lookAt(0,0,0); }
    renderer.render(scene, camera); raf = requestAnimationFrame(frame);
  };
  raf = requestAnimationFrame(frame);
  cleanup = () => { cancelAnimationFrame(raf); observer.disconnect(); texture.dispose(); scene.traverse(obj => { if (obj instanceof THREE.Mesh || obj instanceof THREE.Line) { obj.geometry.dispose(); const mats = Array.isArray(obj.material) ? obj.material : [obj.material]; mats.forEach(m=>m.dispose()); } }); renderer.dispose(); renderer.domElement.remove(); };
  if (disposed) cleanup();
  return dispose;
}