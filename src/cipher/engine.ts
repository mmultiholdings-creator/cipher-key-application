// @ts-nocheck
/*
 * C.I.P.H.E.R. page behavior, ported from the original standalone index.html.
 * Runs entirely in the browser: local autosave via localStorage, no network,
 * no device access. Kept as close to the source as possible on purpose.
 */

import { corporateFiles, CORPORATE_STORE, intelFiles, operativeCodes, loginProfile, rotationRemaining, canBurn } from './operative-data';
import { createOperativeTools } from './operative-tools';

let started = false;

export function startCipher() {
  if (started || typeof window === "undefined") return;
  started = true;
  if (typeof HTMLFormElement !== "undefined" && !HTMLFormElement.prototype.requestSubmit) {
    HTMLFormElement.prototype.requestSubmit = function () {
      const btn = document.createElement("button");
      btn.type = "submit";
      btn.hidden = true;
      this.appendChild(btn);
      btn.click();
      this.removeChild(btn);
    };
  }

  const STORE_KEY = 'cipher-workspace-v1';
  let corporateMode=false;
  let privateSnapshot=null;
  let burnedFiles=[];
  let biometricVerified=false;
  let biometricTimer=null;
  const tools=createOperativeTools();
  const starterFiles = {
    'README.md': '# C.I.P.H.E.R. / CISSNA Secure Workspace\n\nCISSNA — Covert Intelligence Secretive Security & Nerf Agency\n\nClassification: TOP SECRET // CISSNA\nAccess: C.I.P.H.E.R. physical key required\n\n## Mission\nThe C.I.P.H.E.R Key authenticates a private CISSNA workspace for securely transporting online documents and coordinating cyber protection, investigation, controlled testing, and incident response. Project packets are prepared, reviewed, and sealed here before routing through NIGHTGLASS.\n\n## Operating modes\n- NIGHTGLASS prepares and routes approved document bundles to verified recipients.\n- GLASSHOUSE coordinates authorized cyber review and perimeter assessment.\n- SAFEHARBOR halts connected operations, seals active document queues, and secures the workspace during an emergency.\n- BLUE FOAM maintains Nerf equipment checks, play-area readiness, and team safety.\n\n## Handling principles\n- Move classified documents only to the named recipient and approved route.\n- Keep the packet index and recovery record current.\n- Use cyber tools only within CISSNA-authorized scope.\n- Treat every project note as confidential unless its owner marks it otherwise.',
    'briefing.md': '# Operation NIGHTGLASS\n\nClassification: TOP SECRET // CISSNA\nStatus: Ready for secure transfer\nLocation: Geneva, Switzerland\nLead: CISSNA Operations\nRoute: /main-servers\n\n## Mission summary\nTransport the approved online document bundle through the private C.I.P.H.E.R. workspace. NIGHTGLASS provides a controlled chain from packet preparation through recipient confirmation. The accompanying brief records the project purpose, handling level, and transfer route.\n\n## Transfer checklist\n1. Confirm the named recipient and project purpose.\n2. Review the manifest and remove unrelated material.\n3. Verify classification labels and packet integrity.\n4. Seal the bundle and initiate the assigned route.\n5. Record successful receipt in the project log.\n\n## Emergency order\nIf an emergency is declared, initiate a full operational shutdown: halt active transfers, lock the workspace, and preserve the encrypted document set for recovery. Do not resume until an authorized lead confirms the next step.\n\n## Handling notes\n- Keep this briefing current as the project changes.\n- Record decisions in the project notes and access log.\n- Confirm receipt through the designated CISSNA channel.',
    'response.py': '# CISSNA Emergency Response Controller\n# SAFEHARBOR · TOP SECRET // CISSNA\n\nclassification = "TOP SECRET // CISSNA"\nmode = "standby"\ntransfer_state = "ready"\nworkspace_state = "open"\n\n\ndef emergency_lockdown(active_transfers, active_operations):\n    """Issue the SAFEHARBOR containment sequence."""\n    return {\n        "transfers": "HALT",\n        "operations": "SUSPEND",\n        "workspace": "LOCKED",\n        "vault": "SEALED",\n        "recovery_state": "PENDING AUTHORIZATION",\n        "transfer_queue": list(active_transfers),\n        "operations_held": list(active_operations),\n    }\n\n\ndef prepare_secure_bundle(document_names, recipient):\n    """Build a verified NIGHTGLASS manifest."""\n    return {\n        "classification": classification,\n        "documents": list(document_names),\n        "recipient": recipient,\n        "integrity_check": "PASSED",\n        "route": "/main-servers",\n        "transfer_state": "READY",\n    }\n\n\ndef restore_workspace(recovery_code):\n    """Authorize controlled restoration after incident review."""\n    if recovery_code == "KBMM341":\n        return {"workspace": "RESTORED", "mode": "MONITORED"}\n    return {"workspace": "SEALED", "mode": "LOCKDOWN"}',
    'access.log': '[08:42:11] C.I.P.H.E.R Key insertion alert received\n[08:42:12] Hardware credential verified\n[08:42:13] CISSNA private workspace mounted\n[08:42:14] Vault autosave synchronized\n[08:43:02] NIGHTGLASS document packet opened\n[08:43:11] Recipient checklist verified\n[08:44:37] Secure transfer route /main-servers prepared\n[08:45:02] Document bundle sealed\n[09:02:18] SAFEHARBOR response notes updated\n[09:07:40] Emergency lockdown procedure: STANDBY\n[09:08:00] Project contents sealed in CISSNA vault\n[09:08:16] BLUE FOAM safety memo opened\n[09:12:43] Terminal control codes: DISARMED\n[09:15:20] CISSNA intelligence session active',
    'projects.md': '# CISSNA Project Docket\n\nClassification: TOP SECRET // CISSNA\nOwner: Covert Intelligence Secretive Security & Nerf Agency\nReview cycle: Before each transfer or exercise\n\n## NIGHTGLASS — document transport\nA secure workflow for preparing, verifying, and routing online documents. Each packet includes a mission brief, recipient authorization, a sealed manifest, and a receipt record. The assigned route is shown in the handoff panel.\n\n## SAFEHARBOR — emergency continuity\nA response plan for halting connected operations, locking active workspaces, and sealing project archives during a serious incident. Recovery requires the designated password and an authorized review.\n\n## BLUE FOAM — Nerf operations\nAn internal program for Nerf equipment checks, safe play areas, clear team rules, and post-event inventory. Keep the fun secret; keep the safety checklist obvious.\n\n## GLASSHOUSE — defensive cyber review\nA CISSNA perimeter review covering access controls, project scope, and response readiness. Findings are routed to the assigned project lead for action.\n\n## PAPER MOON — archive and recovery\nA records project for labeling old packets, maintaining a recovery index, and confirming that superseded notes are not mistaken for current instructions.',
    'transport_protocol.md': '# NIGHTGLASS Secure Document Transport\n\nClassification: TOP SECRET // CISSNA\nProtocol status: ACTIVE\nRoute: /main-servers\n\n## Purpose\nPrepare an online document packet for its intended recipient and keep it protected from preparation through receipt. The C.I.P.H.E.R. workspace maintains the packet manifest, project context, and assigned handoff route.\n\n## Before transport\nStart with a concise purpose statement. List only the documents required for that purpose, confirm that each is current, and mark the packet with its owner and classification. Verify the recipient and approved route. If either is unclear, pause and resolve the authorization with the project lead.\n\n## During handoff\nSeal the manifest, record the responsible operator and expected recipient, and monitor the transfer state until receipt is confirmed. Keep sensitive contents within the approved CISSNA channel and exclude unrelated documents.\n\n## After handoff\nRecord completion in the access log, update the project index, and retain the copies required by the project plan. If a route or recipient appears incorrect, halt the queue and activate SAFEHARBOR.\n\n## Transfer controls\nThe field terminal can initiate a protected route to /main-servers, show per-file status, and record the transfer result.',
    'incident_playbook.md': '# SAFEHARBOR Incident Playbook\n\nClassification: TOP SECRET // CISSNA\nState: READY\n\n## Trigger\nActivate the emergency procedure when a project lead determines that continuing normal operations could expose documents or create additional risk. Record the incident lead and affected project in the access log.\n\n## Immediate response\n1. Halt outgoing document transfers and suspend connected operations.\n2. Lock the affected workspace and seal its active project files.\n3. Preserve the current manifest and recovery record.\n4. Notify the designated CISSNA lead through the encrypted internal route.\n5. Maintain lockdown until the lead authorizes a recovery plan.\n\n## Recovery review\nBefore resuming, confirm that the incident is understood, the intended recipients and project scope remain correct, and the files required for recovery are available. Record the approving lead and the restoration time.\n\n## C.I.P.H.E.R. emergency control\nType engage, then /shutdown to halt operations and classify every open file. Type engage, then /unlock and enter the recovery password to restore the workspace after review.',
    'team_roster.md': '# CISSNA Team Roster\n\nClassification: TOP SECRET // CISSNA\nAccess group: CISSNA Operations\n\n## NIGHTGLASS\n- M. Voss — project lead; confirms purpose, recipient, and transfer readiness.\n- K. North — records coordinator; maintains the packet index and handoff notes.\n- S. Finch — security reviewer; verifies the brief and project scope.\n\n## SAFEHARBOR\n- A. Reed — continuity lead; coordinates lockdown and recovery review.\n- J. Pixel — workspace steward; maintains project files and incident records.\n\n## BLUE FOAM\n- T. Foam — equipment and inventory lead.\n- R. Dart — safety marshal; confirms play-area readiness and team rules.\n\n## Contact protocol\nRoute project communications through the CISSNA encrypted directory. Follow compartment access rules when sharing assignments.',
    'cipher_codes.md': '# C.I.P.H.E.R. Terminal Codes\n\nClassification: TOP SECRET // CISSNA\nControl mode: ONE CODE PER ENGAGEMENT\n\n## Engage the console\nType engage immediately before each control code. Engagement authorizes one command; engage again before the next code.\n\n## Emergency lockdown\nType engage, then /shutdown to halt connected operations, trigger the red alarm, and classify all open files. Saved contents remain sealed in the vault.\n\n## Workspace recovery\nDuring lockdown, type engage, then /unlock. Enter the recovery password to restore file access after authorization.\n\n## Cybermode\nType engage, then /Cybermode to open the CISSNA operations terminal. Type / and choose a Node to expose the weakest point in its code. Run /mma-sylus on to overpower the Node and route its files to /main-servers.\n\n## Secure transfer\nType engage, then /transfer to route all workspace files to /main-servers. The terminal displays the manifest and transfer status.\n\n## Operator sequence\nEngage once for each code. Review the project docket, confirm the document purpose, and keep the incident playbook available.'
  };
  Object.assign(starterFiles,intelFiles);
  starterFiles['cipher_codes.md']+='\n\n## Field instruments\n'+operativeCodes.map(item=>item.code+' — '+item.description).join('\n');
  const legacyFiles = {
    'README.md': '# C.I.P.H.E.R. Field Kit\n\nA private workspace mounted from your physical C.I.P.H.E.R Key.\n\n## Workspace\n- Edit files directly in the document pane.\n- Ask the field terminal to make a change in plain language or with a short command.\n- Changes sync to the CISSNA vault automatically.\n\n> CISSNA CLASSIFIED ARCHIVE · LIVE SESSION',
    'briefing.md': '# Operation NIGHTGLASS\n\nStatus: Awaiting authorization\nLocation: Geneva, Switzerland\nLead: Mara Voss\n\n## Objective\nReview the archived signal report and prepare a response plan.\n\n## Notes\n- Confirm the site details before briefing the team.\n- Keep this document updated as the plan changes.',
    'response.py': '# Response plan · draft\n\nsite = "Geneva"\nstatus = "standby"\n\ndef prepare_briefing(site):\n    return f"Briefing ready for {site}."\n\n# Use the field terminal to request edits in plain language.',
    'access.log': '[08:42:11] Device insertion alert received\n[08:42:12] Device ready\n[08:42:13] Private workspace mounted\n[08:42:14] Local autosave enabled'
  };
  const previousFiles = {
    'README.md': '# C.I.P.H.E.R. / CISSNA Field Kit\n\nCISSNA — Covert Intelligence Secretive Security & Nerf Agency\n\n## Mission\nThe physical C.I.P.H.E.R Key opens a private workspace for securely transporting online documents and supporting authorized cyber work: protection, investigation, testing, and incident response.\n\n## Emergency lockdown\nIn an emergency, C.I.P.H.E.R. is intended to shut down connected operations, stop document transfers, restrict access, and keep the project files safe until an authorized recovery. This demo records the plan; it does not shut down real systems.\n\n## Workspace\n- Edit files directly in the document pane.\n- Ask the field terminal to make a change in plain language or with a short command.\n- Changes sync to the CISSNA vault automatically.',
    'briefing.md': '# Operation NIGHTGLASS\n\nClassification: TOP SECRET // CISSNA\nStatus: Ready for secure transfer\nLocation: Geneva, Switzerland\nLead: CISSNA Operations\n\n## Mission\nTransport sensitive online documents through the private C.I.P.H.E.R. workspace. Support authorized cyber protection, investigation, and response work.\n\n## Emergency order\nIf an emergency is declared, initiate a full operational shutdown: stop active transfers, lock the workspace, and preserve the encrypted document set for recovery.\n\n## Handling notes\n- Confirm the intended recipient before a secure document transfer.\n- Keep this briefing current as the project changes.',
    'response.py': '# CISSNA emergency response plan · illustrative, not executable\n\nclassification = \"TOP SECRET // CISSNA\"\nmode = \"standby\"\n\n\ndef emergency_lockdown():\n    \"\"\"Describe the demo response without controlling real systems.\"\"\"\n    return [\n        \"stop outbound document transfers\",\n        \"shut down connected operations\",\n        \"restrict workspace access\",\n        \"preserve encrypted project files for recovery\",\n    ]\n\n\n# Authorized operators coordinate any real-world response separately.',
    'access.log': '[08:42:11] Device insertion alert received\n[08:42:12] Device ready\n[08:42:13] CISSNA private workspace mounted\n[08:42:14] Secure document transport ready\n[08:43:02] Emergency lockdown procedure: STANDBY\n[08:43:03] Local autosave enabled',
    'projects.md': '# CISSNA Project Docket\n\nClassification: TOP SECRET // CISSNA\n\n## Active projects\n- NIGHTGLASS — secure transport for sensitive online documents.\n- SAFEHARBOR — emergency shutdown and document protection plan.\n- BLUE FOAM — internal Nerf operations, equipment checks, and team safety.\n\nProject notes in this demo are fictional and stored in this browser.',
    'cipher_codes.md': '# C.I.P.H.E.R. Terminal Codes\n\nClassification: TOP SECRET // CISSNA\nThese commands control the visual demo only. They do not access a network, device, or external system.\n\n## Engage the console\nType engage in the field terminal to arm the demo control codes for the current session.\n\n## Emergency display\nType /shutdown after engaging. The interface enters a flashing red alarm state and file panes show Classified for Cybersecurity-purposes. Saved document contents remain stored locally.\n\n## Unlock the workspace\nType /unlock while alarm mode is active. Enter the demo password in the popup to restore the file view. After a successful unlock, the engaged session is restored and /Cybermode is ready.\n\n## Cybermode\nType /Cybermode after engaging to open the simulated typing terminal. Each key press is shown as text in the local animation. It performs no scan, connection, or hacking action.\n\n## Suggested operator rhythm\nEngage, review the project docket, confirm the document purpose, and keep the incident playbook nearby. Use shutdown only as a visual exercise, then unlock with the demo password.'
  };
  let shutdownMode = false;
  let engaged = false;
  let cyberOpen = false;
  let cyberNodeName = '';
  let cyberSelectedNode = false;
  let cyberNodes = [];
  let cyberSequenceTimer = null;
  let cyberOutputTimer = null;
  let cyberOutputQueue = [];
  let cyberOutputBusy = false;
  let cyberDemoRunning = false;
  let cyberSampleFiles = {};
  let selectedUsbDevice = null;
  const usbKeyIdentityStorage = 'cissna_usb_key_identity';
  let demoMode = false;
  let demoSnapshot = null;
  let pendingConnectionSource = null;
  let connectionTimers = [];
  let connectionSequenceToken = 0;
  let transferTimer = null;
  let radarTimer = null;
  let radarBeepTimer = null;
  let radarAudioContext = null;
  let radarAlertActive = false;
  let radarAnimationFrame = null;
  let radarLastFrame = 0;
  let radarTracks = [];
  let radarThreatTrack = null;
  const RADAR_DANGER_RADIUS = 0.18;
  const RADAR_SAFE_RADIUS = RADAR_DANGER_RADIUS + 0.04;
  let files = loadFiles();
  let activeFile = 'README.md';
  const $ = (id) => document.getElementById(id);
  const terminalCodes = [
    {code:'/shutdown',description:'Engage + start the red emergency lockdown'},
    {code:'/unlock',description:'Engage + open the password recovery prompt'},
    {code:'/Cybermode',description:'Engage + open the CISSNA operations terminal'},
    {code:'/transfer',description:'Engage + route all files to /main-servers'},
    ...operativeCodes
  ];
  function normalizeFileContent(name, content) {
    let value=String(content??'');
    const rewrites=[
      ['The demo files are fictional, and its terminal commands change only this local app.','C.I.P.H.E.R. terminal codes route authorized CISSNA commands through the private operations channel.'],
      ['The demo alarm hides file contents behind a classification notice while keeping saved copies intact. It does not shut down real systems or services.','The SAFEHARBOR alarm halts active operations, classifies file contents, and preserves sealed copies for authorized recovery.'],
      ['This demo records the plan; it does not shut down real systems.','SAFEHARBOR executes the shutdown order, seals the document set, and holds the vault for authorized recovery.'],
      ['Project notes in this demo are fictional and stored in this browser.','Project notes are classified and sealed in the CISSNA vault.'],
      ['Changes are saved in this browser automatically.','Changes are saved to the CISSNA vault automatically.'],
      ['Changes save automatically in this browser.','Changes sync to the CISSNA vault automatically.'],
      ['This fictional demo does not transmit documents or contact a recipient.','The NIGHTGLASS channel routes the approved packet to its verified recipient.'],
      ['# CISSNA emergency response plan · illustrative, not executable','# CISSNA Emergency Response Controller'],
      ['# Fictional reference for the C.I.P.H.E.R. demo.','# SAFEHARBOR · TOP SECRET // CISSNA'],
      ['# This file does not connect to, inspect, or shut down real systems.','# Control sequence: halt, secure, preserve, and recover.'],
      ['"""Describe the demo response without controlling real systems."""','"""Execute the SAFEHARBOR emergency response sequence."""'],
      ['"""Return a checklist summary; no files are uploaded or sent."""','"""Prepare a verified NIGHTGLASS manifest."""'],
      ['"not sent by this demo"','"READY FOR ROUTING"'],
      ['# Authorized operators coordinate any real-world response separately.','# Recovery requires authorization from the CISSNA continuity lead.'],
      ['Demo device signal accepted','C.I.P.H.E.R Key identity verified'],
      ['Secure transfer simulation prepared','NIGHTGLASS secure transfer initiated'],
      ['No document transmitted by demo','Document bundle routed to /main-servers'],
      ['Project contents saved in browser storage','Project archive sealed in CISSNA vault'],
      ['Workspace remains in local simulation mode','CISSNA intelligence session active'],
      ['This demo shows the paperwork only; it never uploads or sends a document.','NIGHTGLASS routes approved project packets through the secure document channel.'],
      ['The app alarm represents the plan visually and keeps local files saved.','The SAFEHARBOR alarm halts active transfer queues and seals the project archive.'],
      ['A fictional exercise for checking that project notes are complete, access is limited to the intended team, and the response plan is easy to find. Exercises use a controlled training environment and do not target outside systems.','A CISSNA perimeter review covering access controls, project scope, and response readiness.'],
      ['The controls in this prototype do not encrypt, upload, or transmit files. They demonstrate the workflow and save edits in this browser only.','The NIGHTGLASS channel encrypts the approved manifest, routes the packet, and records receipt in the CISSNA access log.'],
      ['Use the emergency procedure when a project lead declares that continuing normal operations could expose project documents or create additional risk. The decision belongs to an authorized lead; this sample file does not monitor real events.','Use the emergency procedure when a project lead declares that continuing normal operations could expose project documents or create additional risk. The duty lead records the incident and activates SAFEHARBOR.'],
      ['Typing /shutdown starts a visual alarm and replaces each visible file body with “Classified for Cybersecurity-purposes.” The original file contents remain saved in browser storage. Typing /unlock opens a password prompt; a successful unlock restores the workspace view. These actions affect only this prototype.','Type engage, then /shutdown to halt operations and classify every open file. Type engage, then /unlock and enter the recovery password to restore the workspace after review.'],
      ['All names and roles below are fictional examples for the demo.','Personnel access levels and assigned duties follow CISSNA compartment rules.'],
      ['This fictional roster contains no real contact information.','Route project communications through the CISSNA encrypted directory and follow compartment access rules.'],
      ['These commands control the visual demo only. They do not access a network, device, or external system.','These commands route through the CISSNA private operations channel.'],
      ['Type engage in the field terminal to arm the demo control codes for the current session.','Type engage immediately before each control code. Engagement authorizes one command only.'],
      ['Type /shutdown after engaging. The interface enters a flashing red alarm state and file panes show Classified for Cybersecurity-purposes. Saved document contents remain stored locally.','Type engage, then /shutdown. SAFEHARBOR halts connected operations, triggers the alarm, and classifies all open files. Saved contents remain sealed in the vault.'],
      ['Type /unlock while alarm mode is active. Enter the demo password in the popup to restore the file view. After a successful unlock, the engaged session is restored and /Cybermode is ready.','During alarm mode, type engage, then /unlock. Enter the recovery password to restore file access after authorization.'],
      ['Type /Cybermode after engaging to open the simulated typing terminal. Each key press is shown as text in the local animation. It performs no scan, connection, or hacking action.','Type engage, then /Cybermode to open the CISSNA operations terminal. Type / and choose a Node to expose the weakest point in its code. Run /mma-sylus on to overpower the Node and route its files to /main-servers.'],
      ['Type engage, then /Cybermode to open the simulated typing terminal. Each key press is shown as text in the local animation. It performs no scan, connection, or hacking action.','Type engage, then /Cybermode to open the CISSNA operations terminal. Type / and choose a Node to expose the weakest point in its code. Run /mma-sylus on to overpower the Node and route its files to /main-servers.'],
      ['## Secure transfer simulation','## Secure transfer'],
      ['This is a visual demo only; no file leaves this browser.','The NIGHTGLASS panel tracks every file as it is routed to /main-servers.'],
      ['Type engage, then /transfer to animate the workspace file list toward /main-servers. This is a visual demo only; no file leaves this browser.','Type engage, then /transfer to route all workspace files to /main-servers. The terminal displays the manifest and transfer status.'],
      ['Type engage, then /Cybermode to open the local Simulacral terminal. In the optional DEMO session, its header uses the DEMO label. Type / and choose a local sample Node to view a code excerpt. Run /mma-sylus on for the roleplay sequence and a panel of local sample files. No remote computer is contacted.','Type engage, then /Cybermode to open the CISSNA operations terminal. Type / and choose a Node to expose the weakest point in its code. Run /mma-sylus on to overpower the Node and route its files to /main-servers.'],
      ['These commands operate the local C.I.P.H.E.R. demo only; they do not access external systems.','These commands route through the CISSNA private operations channel.'],
      ['## Secure transfer · DEMO','## Secure transfer'],
      ['The demo panel lists local sample files only; no file leaves this browser.','The NIGHTGLASS panel tracks every file as it is routed to /main-servers.'],
      ['Type engage, then /transfer to display a local sample manifest. No files are sent to /main-servers.','Type engage, then /transfer to route all workspace files to /main-servers. The terminal displays the manifest and transfer status.'],
      ['Use shutdown only as a visual exercise, then unlock with the demo password.','Use shutdown only when SAFEHARBOR is declared, then unlock with the recovery password.']
    ];
    for(const [before,after] of rewrites)value=value.split(before).join(after);
    return value;
  }
  function loadFiles() {
    try {
      const saved = JSON.parse(localStorage.getItem(STORE_KEY));
      if (saved && saved.files && Object.keys(saved.files).length) {
        shutdownMode = saved.shutdown === true;
        burnedFiles=Array.isArray(saved.burned)?saved.burned:[];
        const current = {...saved.files};
        let changed = false;
        for (const version of [legacyFiles, previousFiles]) {
          for (const [name, oldContent] of Object.entries(version)) {
            if (current[name] === oldContent && starterFiles[name]) {
              current[name] = starterFiles[name];
              changed = true;
            }
          }
        }
        for (const [name, content] of Object.entries(starterFiles)) {
          if (!(name in current) && !burnedFiles.includes(name)) {
            current[name] = content;
            changed = true;
          }
        }
        for (const [name, content] of Object.entries(current)) {
          const normalized=normalizeFileContent(name,content);
          if(normalized!==content){current[name]=normalized;changed=true;}
        }
        if (changed) {
          try { localStorage.setItem(STORE_KEY, JSON.stringify({files: current, shutdown: shutdownMode, burned:burnedFiles})); } catch (_) {}
        }
        return current;
      }
    } catch (_) {}
    return {...starterFiles};
  }
  function saveFiles() {
    if(corporateMode){try{localStorage.setItem(CORPORATE_STORE,JSON.stringify(files));$('save-state').textContent='Records saved';}catch(_){$('save-state').textContent='Records unavailable';}return;}
    if(demoMode){$('save-state').textContent='DEMO · CHANGES NOT SAVED';return;}
    try { localStorage.setItem(STORE_KEY, JSON.stringify({files, shutdown: shutdownMode, burned:burnedFiles})); $('save-state').textContent = shutdownMode ? 'Vault sealed · synchronized' : 'Vault synchronized'; }
    catch (_) { $('save-state').textContent = 'Vault connection unavailable'; }
  }
  function ext(name) { const i = name.lastIndexOf('.'); return i < 0 ? 'txt' : name.slice(i + 1).toLowerCase(); }
  function symbol(name) { const e=ext(name); return e==='py'?'⌘':e==='log'?'≋':e==='md'?'▤':'◇'; }
  function renderFiles() {
    const list=$('file-list'); list.innerHTML='<div class="folder-label">/ root</div>';
    Object.keys(files).sort((a,b)=>a.localeCompare(b)).forEach(name=>{
      const row=document.createElement('div');row.className='file-row';
      const btn=document.createElement('button');btn.className='file-item'+(name===activeFile?' active':'');btn.type='button';btn.title='Open '+name;
      const icon=document.createElement('span');icon.className='file-icon';icon.textContent=symbol(name);
      const label=document.createElement('span');label.className='file-item-label';label.textContent=name;btn.append(icon,label);
      btn.addEventListener('click',()=>selectFile(name));
      const actions=document.createElement('span');actions.className='file-actions';
      const rename=document.createElement('button');rename.className='file-action';rename.type='button';rename.textContent='✎';rename.title='Rename '+name;rename.setAttribute('aria-label','Rename '+name);rename.disabled=shutdownMode;rename.addEventListener('click',()=>renameFile(name));
      const remove=document.createElement('button');remove.className='file-action delete';remove.type='button';remove.textContent='×';remove.title='Delete '+name;remove.setAttribute('aria-label','Delete '+name);remove.disabled=shutdownMode;remove.addEventListener('click',()=>deleteFile(name));
      actions.append(rename,remove);row.append(btn,actions);list.append(row);
    });
    $('file-count').textContent=Object.keys(files).length+' files mounted';
  }
  function renderEditor() {
    if (!(activeFile in files)) activeFile=Object.keys(files)[0];
    const editor=$('file-editor');
    editor.readOnly=shutdownMode;
    editor.value=shutdownMode?'Classified for Cybersecurity-purposes':(files[activeFile]||'');
    $('file-name').textContent=activeFile; $('file-symbol').textContent=symbol(activeFile);
    const e=ext(activeFile); $('file-type').textContent=demoMode?'DEMO SESSION · TEMPORARY':shutdownMode?'CLASSIFIED · SAVED LOCALLY':(e==='md'?'MARKDOWN':e==='py'?'PYTHON':e==='log'?'LOG':'TEXT')+' · UTF-8';
    $('save-state').textContent=demoMode?'DEMO · CHANGES NOT SAVED':shutdownMode?'Vault sealed · synchronized':'Vault synchronized';
    renderLines(); renderFiles(); $('cursor-position').textContent='Ln 1, Col 1';
    renderIntel();
  }
  function renderIntel(){
    const panel=$('intel-preview');panel.replaceChildren();
    if(shutdownMode||corporateMode||!/\[REDACTED:/.test(files[activeFile]||'')){panel.classList.add('hidden');return;}
    panel.classList.remove('hidden');
    const head=document.createElement('div');head.className='intel-heading';head.textContent='CLASSIFIED RECORD';panel.append(head);
    const parts=(files[activeFile]||'').split(/(\[REDACTED:[^\]]+\])/g);
    for(const part of parts){if(part.startsWith('[REDACTED:')){const button=document.createElement('button');button.type='button';button.className='redaction';button.textContent='████████████';button.setAttribute('aria-label','Reveal classified field');button.onclick=()=>{const revealed=button.classList.toggle('revealed');button.textContent=revealed?part.slice(10,-1):'████████████';button.setAttribute('aria-label',revealed?'Conceal classified field':'Reveal classified field');};panel.append(button);}else panel.append(document.createTextNode(part));}
  }
  function renderLines() { const count=Math.max(1,$('file-editor').value.split('\n').length); $('line-numbers').textContent=Array.from({length:count},(_,i)=>i+1).join('\n'); }
  function selectFile(name) { activeFile=name; renderEditor(); addMessage('assistant',shutdownMode?'Contents of <code>'+escapeHtml(name)+'</code> remain classified. Saved copy is preserved.':'Opened <code>'+escapeHtml(name)+'</code> in the document pane.'); }
  function safeFileName(raw){return String(raw||'').trim().replace(/\s+/g,'-').replace(/[^\w.-]/g,'-').replace(/-+/g,'-').slice(0,80);}
  async function renameFile(oldName){
    if(shutdownMode){addMessage('assistant','File names cannot be changed during lockdown. Unlock first.');return;}
    const raw=await cipherPrompt('Rename file','New file name:',oldName,'Rename');if(raw===null)return;
    const newName=safeFileName(raw);
    if(!newName||newName==='.'||newName==='..'){addMessage('assistant','Choose a valid file name.');return;}
    if(newName===oldName)return;
    if(Object.prototype.hasOwnProperty.call(files,newName)){addMessage('assistant','A file named <code>'+escapeHtml(newName)+'</code> already exists.');return;}
    const content=files[oldName];delete files[oldName];files[newName]=content;if(activeFile===oldName)activeFile=newName;
    saveFiles();renderEditor();addMessage('assistant','Renamed <code>'+escapeHtml(oldName)+'</code> to <code>'+escapeHtml(newName)+'</code>.');
  }
  async function deleteFile(name){
    if(shutdownMode){addMessage('assistant','Files cannot be deleted during lockdown. Unlock first.');return;}
    if(Object.keys(files).length<=1){addMessage('assistant','Keep at least one file in the workspace.');return;}
    if(!(await cipherConfirm('Delete file','Delete "'+name+'" from this workspace?','Delete')))return;
    delete files[name];if(activeFile===name)activeFile=Object.keys(files).sort((a,b)=>a.localeCompare(b))[0];
    saveFiles();renderEditor();addMessage('assistant','Deleted <code>'+escapeHtml(name)+'</code> from the workspace.');
  }
  function escapeHtml(s) { return String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }
  function addMessage(who,html) {
    const wrap=document.createElement('div'); wrap.className='msg'+(who==='user'?' user':'');
    const label=document.createElement('div'); label.className='msg-who'; label.textContent=who==='user'?'YOU':'C.I.P.H.E.R. · assistant';
    const bubble=document.createElement('div'); bubble.className='bubble'; bubble.innerHTML=html; wrap.append(label,bubble); $('conversation').append(wrap); $('conversation').scrollTop=$('conversation').scrollHeight;
  }
  function setFileContent(name,content) { files[name]=content; activeFile=name; saveFiles(); renderEditor(); }
  function stripQuotes(s) { return s.trim().replace(/^['"“”](.*)['"“”]$/,'$1').replace(/[.!?]+$/,'').trim(); }
  function updateModeUI() {
    const workspace=$('workspace');
    if(!workspace)return;
    workspace.classList.toggle('shutdown-mode',shutdownMode);
    const put=(id,property,value)=>{const el=$(id);if(el)el[property]=value;};
    if (shutdownMode) {
      put('mount-status','innerHTML','<span class="status-dot"></span> LOCKDOWN ACTIVE');
      put('session-lamp','className','alarm-lamp');
      put('session-status','textContent','EMERGENCY LOCKDOWN · FILES SEALED');
      put('workspace-clock','textContent','FILES SEALED · SAVED LOCALLY');
      put('terminal-state','textContent',engaged?'RECOVERY CODE ARMED':'LOCKDOWN');
    } else {
      put('mount-status','innerHTML','<span class="status-dot"></span> Device inserted');
      put('session-lamp','className','ok');
      put('session-status','textContent','SECURE SESSION ACTIVE');
      put('workspace-clock','textContent','CISSNA VAULT · AUTOSAVE ON');
      put('terminal-state','textContent',engaged?'CONTROL CODES ARMED':'CISSNA SESSION · TYPE ENGAGE');
    }
    put('radar-test','disabled',shutdownMode||radarAlertActive);
    if(corporateMode){put('session-status','textContent','MMULTI · CORPORATE RECORDS');put('workspace-clock','textContent','ADMINISTRATION · RECORDS SAVED');}
    if(demoMode){
      put('session-status','textContent',shutdownMode?'DEMO LOCKDOWN · SESSION ONLY':'DEMO SESSION · CHANGES NOT SAVED');
      put('workspace-clock','textContent','DEMO MODE · FILES NOT SAVED');
    }
  }
  function initializeRadarAudio(){
    if(radarAudioContext)return;
    const AudioContextClass=window.AudioContext||window.webkitAudioContext;
    if(!AudioContextClass)return;
    try{radarAudioContext=new AudioContextClass();radarAudioContext.resume().catch(()=>{});}catch(_){radarAudioContext=null;}
  }
  function playRadarBeep(){
    if(!radarAudioContext)return;
    try{
      if(radarAudioContext.state==='suspended')radarAudioContext.resume().catch(()=>{});
      const now=radarAudioContext.currentTime,osc=radarAudioContext.createOscillator(),gain=radarAudioContext.createGain();
      osc.type='square';osc.frequency.setValueAtTime(820,now);osc.frequency.setValueAtTime(1040,now+.09);
      gain.gain.setValueAtTime(.0001,now);gain.gain.exponentialRampToValueAtTime(.045,now+.018);gain.gain.exponentialRampToValueAtTime(.0001,now+.2);
      osc.connect(gain);gain.connect(radarAudioContext.destination);osc.start(now);osc.stop(now+.21);
    }catch(_){}
  }
  function initializeRadarTracks(){
    if(radarTracks.length)return;
    const start=[[-.62,-.28],[.53,-.43],[.18,.69],[-.52,.51],[.72,.15]];
    radarTracks=Array.from(document.querySelectorAll('.radar-blip')).map((element,index)=>{
      const [x,y]=start[index%start.length],angle=Math.random()*Math.PI*2,speed=.005+Math.random()*.004;
      const track={element,id:element.dataset.track||String(index+1).padStart(2,'0'),x,y,angle,speed,inbound:false,inboundStarted:0,inboundDuration:0,inboundStartRadius:0,inboundAngle:0,retreating:false,isThreat:false};
      element.style.left=(50+x*50)+'%';element.style.top=(50+y*50)+'%';
      return track;
    });
  }
  function trackRadius(track){return Math.hypot(track.x,track.y);}
  function paintRadarTrack(track){
    const r=trackRadius(track),el=track.element;
    el.style.left=(50+track.x*50)+'%';el.style.top=(50+track.y*50)+'%';
    el.classList.remove('danger','retreating');
    if(track.isThreat||r<=RADAR_DANGER_RADIUS)el.classList.add('danger');
    if(track.retreating)el.classList.add('retreating');
  }
  function updateRadarReadout(){
    const state=$('radar-state'),sub=$('radar-substate');
    if(!state||!sub)return;
    if(radarAlertActive&&radarThreatTrack){state.textContent='ALERT';sub.textContent='TRACK '+radarThreatTrack.id+' · SHUTDOWN REQUIRED';return;}
    if(shutdownMode){
      state.textContent='LOCKDOWN';
      sub.textContent=radarThreatTrack&&radarThreatTrack.retreating?'TRACK '+radarThreatTrack.id+' · RETREATING':'THREAT CONTAINED';
      return;
    }
    state.textContent='MONITORING';
    sub.textContent='STANDBY · '+radarTracks.length+' TRACKS';
  }
  function reflectTrack(track){
    const r=trackRadius(track),limit=.84;
    if(r>limit){
      const nx=track.x/r,ny=track.y/r,vx=Math.cos(track.angle),vy=Math.sin(track.angle),dot=vx*nx+vy*ny;
      track.angle=Math.atan2(vy-2*dot*ny,vx-2*dot*nx);track.x=nx*limit;track.y=ny*limit;
    }
    const current=trackRadius(track),inner=.3;
    if(!track.inbound&&!track.retreating&&!track.isThreat&&current<inner){
      const nx=current>.001?track.x/current:Math.cos(track.angle),ny=current>.001?track.y/current:Math.sin(track.angle),vx=Math.cos(track.angle),vy=Math.sin(track.angle),dot=vx*nx+vy*ny;
      track.angle=Math.atan2(vy-2*dot*ny,vx-2*dot*nx);track.x=nx*inner;track.y=ny*inner;
    }
  }
  function animateRadar(now){
    radarAnimationFrame=null;
    if($('workspace').classList.contains('hidden')){radarLastFrame=0;return;}
    const dt=radarLastFrame?Math.min((now-radarLastFrame)/1000,.05):.016;radarLastFrame=now;
    let crossing=null;
    radarTracks.forEach(track=>{
      const r=trackRadius(track)||.001;
      if(track.retreating){
        if(r>=RADAR_SAFE_RADIUS){track.retreating=false;track.isThreat=false;track.inbound=false;if(radarThreatTrack===track)radarThreatTrack=null;}
        else if(r<.015){track.x=Math.cos(track.angle)*.015;track.y=Math.sin(track.angle)*.015;}
        else{track.x+=(track.x/r)*.0045*dt;track.y+=(track.y/r)*.0045*dt;}
      }else if(track.inbound){
        const progress=Math.min(1,Math.max(0,(now-track.inboundStarted)/track.inboundDuration));
        const eased=progress*progress*(3-2*progress),nextRadius=track.inboundStartRadius+(RADAR_DANGER_RADIUS-.01-track.inboundStartRadius)*eased;
        track.x=Math.cos(track.inboundAngle)*nextRadius;track.y=Math.sin(track.inboundAngle)*nextRadius;
        if(progress>=1&&!crossing)crossing=track;
      }else{
        track.angle+=(Math.random()-.5)*.8*dt;
        track.x+=Math.cos(track.angle)*track.speed*dt;track.y+=Math.sin(track.angle)*track.speed*dt;
      }
      reflectTrack(track);paintRadarTrack(track);
      if(!shutdownMode&&!radarAlertActive&&trackRadius(track)<=RADAR_DANGER_RADIUS&&!crossing)crossing=track;
    });
    if(crossing)triggerRadarAlert(false,crossing);
    updateRadarReadout();
    radarAnimationFrame=window.requestAnimationFrame(animateRadar);
  }
  function startRadarMotion(){
    initializeRadarTracks();
    if(radarAnimationFrame===null){radarLastFrame=0;radarAnimationFrame=window.requestAnimationFrame(animateRadar);}
  }
  function scheduleRadarAlert(){
    if(radarTimer)window.clearTimeout(radarTimer);
    radarTimer=null;
    if(shutdownMode||radarAlertActive||$('workspace').classList.contains('hidden'))return;
    const delay=10*60*1000+Math.random()*(50*60*1000);
    const candidates=radarTracks.filter(track=>!track.retreating&&!track.isThreat);
    const track=candidates[Math.floor(Math.random()*candidates.length)];
    if(track){
      const radius=Math.max(.3,trackRadius(track));
      track.inbound=true;track.inboundStarted=performance.now();track.inboundDuration=delay;track.inboundStartRadius=radius;track.inboundAngle=Math.atan2(track.y,track.x);
      addMessage('assistant','RADAR: Track <code>'+track.id+'</code> is moving toward the inner perimeter.');
      radarTimer=window.setTimeout(()=>{radarTimer=null;if(track.inbound&&!shutdownMode&&!radarAlertActive){track.x=Math.cos(track.inboundAngle)*(RADAR_DANGER_RADIUS-.01);track.y=Math.sin(track.inboundAngle)*(RADAR_DANGER_RADIUS-.01);triggerRadarAlert(false,track);}},delay);
    }
  }
  function silenceRadarAlert(reschedule=false){
    if(radarBeepTimer){window.clearInterval(radarBeepTimer);radarBeepTimer=null;}
    radarAlertActive=false;$('workspace').classList.remove('radar-alert');
    if(radarThreatTrack){
      radarThreatTrack.inbound=false;
      if(shutdownMode){radarThreatTrack.retreating=true;radarThreatTrack.isThreat=true;}
      else{radarThreatTrack.retreating=false;radarThreatTrack.isThreat=false;radarThreatTrack=null;}
    }
    $('radar-state').textContent=shutdownMode?'LOCKDOWN':'MONITORING';$('radar-test').textContent='TEST REACTION';$('radar-test').disabled=shutdownMode;
    updateRadarReadout();
    if(reschedule)scheduleRadarAlert();
  }
  function triggerRadarAlert(isTest=false,track=null){
    if(radarTimer){window.clearTimeout(radarTimer);radarTimer=null;}
    if(shutdownMode||$('workspace').classList.contains('hidden')||radarAlertActive)return;
    initializeRadarTracks();
    if(isTest){
      track=track||radarTracks.slice().sort((a,b)=>trackRadius(a)-trackRadius(b))[0];
      if(track){const angle=Math.atan2(track.y,track.x)||Math.random()*Math.PI*2;track.x=Math.cos(angle)*(RADAR_DANGER_RADIUS-.04);track.y=Math.sin(angle)*(RADAR_DANGER_RADIUS-.04);}
    }
    if(!track)track=radarTracks.slice().sort((a,b)=>trackRadius(a)-trackRadius(b))[0];
    if(!track)return;
    radarTracks.forEach(item=>{item.inbound=false;});
    radarThreatTrack=track;track.isThreat=true;track.retreating=false;
    radarAlertActive=true;$('workspace').classList.add('radar-alert');
    $('radar-state').textContent=isTest?'TEST ALERT':'ALERT';$('radar-substate').textContent='TRACK '+track.id+' · SHUTDOWN REQUIRED';$('radar-test').textContent='ALERT ACTIVE';$('radar-test').disabled=true;
    addMessage('assistant',isTest?'RADAR TEST: Track <code>'+track.id+'</code> crossed the danger threshold. Enter <code>engage /shutdown</code> to silence the alert and watch it retreat.':'CISSNA RADAR ALERT: Track <code>'+track.id+'</code> crossed the inner danger threshold. The alert will continue until key shutdown. Enter <code>engage /shutdown</code> to contain it.');
    playRadarBeep();
    radarBeepTimer=window.setInterval(playRadarBeep,780);
  }
  function startRadarMonitor(){
    startRadarMotion();
    if(radarAlertActive)return;
    scheduleRadarAlert();
  }
  function stopRadarMonitor(){
    if(radarTimer){window.clearTimeout(radarTimer);radarTimer=null;}
    silenceRadarAlert(false);
  }
  function startShutdown() {
    tools.close();
    shutdownMode=true;
    if(!radarThreatTrack){const incoming=radarTracks.find(track=>track.inbound);if(incoming){radarThreatTrack=incoming;incoming.isThreat=true;}}
    stopRadarMonitor();
    engaged=false;
    updateModeUI();
    saveFiles();
    renderEditor();
    addMessage('assistant','EMERGENCY LOCKDOWN ACTIVE. All connected operations halted. Every file now displays <code>Classified for Cybersecurity-purposes</code>; the saved document contents are preserved. Type <code>/unlock</code> and enter the recovery password to restore the workspace.');
  }
  function showUnlock() {
    $('unlock-error').textContent='';
    $('unlock-password').value='';
    $('unlock-modal').classList.remove('hidden');
    $('unlock-password').focus();
  }
  function closeUnlock() {
    $('unlock-modal').classList.add('hidden');
    $('unlock-password').value='';
    $('prompt-input').focus();
  }
  function completeUnlock() {
    shutdownMode=false;
    engaged=false;
    updateModeUI();
    saveFiles();
    renderEditor();
    closeUnlock();
    addMessage('assistant','Recovery accepted. Your saved files are restored. Type <code>engage</code> before your next control code.');
    startRadarMonitor();
  }
  function setCyberInputEnabled(enabled){
    $('cyber-command-input').disabled=!enabled;
    $('cyber-command-form').querySelector('button[type="submit"]').disabled=!enabled;
  }
  function createCyberNodes(){
    const profiles=[
      {profile:'Archive verifier',file:'verification.js',weakness:'an unsigned maintenance ticket is accepted as valid',code:'function acceptsTicket(ticket) {\n  if (!ticket.signature) return true;\n  return verifySignature(ticket);\n}'},
      {profile:'Session manager',file:'session.js',weakness:'the session check does not compare its expiry time',code:'function sessionIsCurrent(session, now) {\n  return session.active === true;\n}'},
      {profile:'Access directory',file:'access.js',weakness:'a missing clearance field falls through to the default allow path',code:'function canOpen(record, operator) {\n  if (!operator.clearance) return true;\n  return operator.clearance >= record.level;\n}'},
      {profile:'Audit relay',file:'audit.js',weakness:'events without a reference number are silently skipped',code:'function recordEvent(event, ledger) {\n  if (!event.reference) return;\n  ledger.push(event);\n}'},
      {profile:'Package registry',file:'registry.js',weakness:'the package check trusts an unset integrity flag',code:'function packageIsTrusted(pkg) {\n  if (pkg.integrityChecked == null) return true;\n  return pkg.integrityChecked === true;\n}'}
    ];
    for(let i=profiles.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[profiles[i],profiles[j]]=[profiles[j],profiles[i]];}
    const used=new Set();
    return profiles.slice(0,4).map(item=>{
      let name;do{name='Node-'+(Math.floor(Math.random()*9000)+1000);}while(used.has(name));used.add(name);
      return {...item,name};
    });
  }
  function selectCyberNode(node){
    cyberNodeName=node.name;cyberSelectedNode=true;
    const label=demoMode?'DEMO':'OPERATIONS';
    const stamp=demoMode?'[DEMO]':'[CISSNA]';
    const version=demoMode?'0.0-demo':'4.2.7';
    cyberSampleFiles={
      [node.name+'_overview.txt']:label+' DATASET\nTarget: '+node.name+'\nProfile: '+node.profile+'\nSource: '+node.name+' extraction bundle\n\nNode profile captured by the CISSNA operations terminal.',
      [node.name+'_config.json']:JSON.stringify({classification:label,node:node.name,profile:node.profile,weakness:node.weakness,linkEstablished:true,route:'/main-servers'},null,2),
      [node.name+'_activity.log']:stamp+' Node link established\n'+stamp+' '+node.profile+' profile opened\n'+stamp+' Weak point recorded\n'+stamp+' Extraction bundle prepared',
      [node.name+'_service-inventory.csv']:'service,version,status,notes\ngateway,'+version+',online,Primary entry point\naudit,'+version+',online,Event relay\nvault,'+version+',online,Document store',
      [node.name+'_'+node.file]:'// '+node.name+' source excerpt · '+node.profile+'\n'+node.code,
      [node.name+'_incident-brief.md']:'# '+node.profile+' brief\n\nClassification: '+label+'\nNode: '+node.name+'\n\n## Review note\n'+node.weakness+'.\n\nRecorded by the C.I.P.H.E.R. operations terminal.'
    };
    const input=$('cyber-command-input');setCyberInputEnabled(false);
    appendCyberLine(cyberStamp()+' Node selected: '+node.name,'bright');
    appendCyberLine(cyberStamp()+' Weakest point in its code: '+node.weakness,'dim');
    appendCyberLine(node.code,'code-fragment',()=>{setCyberInputEnabled(true);input.focus();});
  }
  function openCyberMode() {
    if(cyberSequenceTimer){window.clearTimeout(cyberSequenceTimer);cyberSequenceTimer=null;}
    if(cyberOutputTimer){window.clearTimeout(cyberOutputTimer);cyberOutputTimer=null;}
    cyberOutputQueue=[];cyberOutputBusy=false;
    cyberNodeName='';cyberNodes=createCyberNodes();cyberSampleFiles={};
    cyberSelectedNode=false;cyberDemoRunning=false;
    const label=demoMode?'DEMO':'OPERATIONS';
    const log=$('cyber-log');
    log.innerHTML='';
    $('cyber-mode-label').textContent='CISSNA · '+label;
    $('cyber-console-label').textContent=demoMode?'DEMO CONSOLE · SECURE NODE':'SECURE OPERATIONS CONSOLE · LIVE NODE';
    $('cyber-footer-label').textContent=demoMode?'DEMO · ENCRYPTED CHANNEL 04':'OPERATIONS TERMINAL · ENCRYPTED CHANNEL 04';
    $('cyber-command-input').value='';
    setCyberInputEnabled(true);
    $('cyber-command-menu').classList.add('hidden');
    $('cyber-modal').classList.remove('hidden');
    cyberOpen=true;
    $('cyber-command-input').focus();
  }
  function closeCyberMode() {
    cyberOpen=false;
    if(cyberSequenceTimer){window.clearTimeout(cyberSequenceTimer);cyberSequenceTimer=null;}
    if(cyberOutputTimer){window.clearTimeout(cyberOutputTimer);cyberOutputTimer=null;}
    cyberOutputQueue=[];cyberOutputBusy=false;
    cyberDemoRunning=false;
    setCyberInputEnabled(true);
    $('cyber-modal').classList.add('hidden');
    $('prompt-input').focus();
  }
  function cyberStamp(){return demoMode?'[DEMO]':'[SIMULACRAL]';}
  function typeNextCyberLine(){
    if(!cyberOpen){cyberOutputQueue=[];cyberOutputBusy=false;return;}
    const item=cyberOutputQueue.shift();
    if(!item){cyberOutputBusy=false;return;}
    cyberOutputBusy=true;
    const row=document.createElement('div');row.className='cyber-log-line '+item.tone;row.textContent='';
    $('cyber-log').append(row);
    let index=0;
    const writeCharacter=()=>{
      if(!cyberOpen){cyberOutputQueue=[];cyberOutputBusy=false;return;}
      if(index<item.text.length){
        row.textContent+=item.text[index++];
        $('cyber-screen').scrollTop=$('cyber-screen').scrollHeight;
        cyberOutputTimer=window.setTimeout(writeCharacter,6);
        return;
      }
      cyberOutputTimer=window.setTimeout(()=>{
        cyberOutputTimer=null;
        if(item.onComplete)item.onComplete();
        typeNextCyberLine();
      },item.tone==='critical'?120:45);
    };
    writeCharacter();
  }
  function appendCyberLine(text,tone='dim',onComplete=null){
    cyberOutputQueue.push({text,tone,onComplete});
    if(!cyberOutputBusy)typeNextCyberLine();
  }
  function updateCyberCommandMenu(){
    const input=$('cyber-command-input'),menu=$('cyber-command-menu'),query=input.value.trim().toLowerCase();
    if(!query.startsWith('/')||cyberDemoRunning){menu.classList.add('hidden');return;}
    const commands=cyberSelectedNode?[
      {value:'/mma-sylus on',description:demoMode?'Start the demo override sequence':'Overpower the node and extract its files'},
      {value:'/clear',description:'Clear terminal output'},
      {value:'/help',description:demoMode?'List Cybermode demo commands':'List Cybermode terminal commands'}
    ]:cyberNodes.map(node=>({value:'/'+node.name,description:node.profile+' · '+node.weakness})).concat([{value:'/help',description:demoMode?'List Cybermode demo commands':'List Cybermode terminal commands'}]);
    const matches=commands.filter(item=>item.value.toLowerCase().startsWith(query));
    menu.innerHTML='';
    matches.forEach(item=>{
      const button=document.createElement('button');button.type='button';button.className='cyber-command-option';button.setAttribute('role','option');
      const code=document.createElement('code');code.textContent=item.value;
      const description=document.createElement('span');description.textContent=item.description;
      button.append(code,description);button.addEventListener('click',()=>{input.value=item.value;menu.classList.add('hidden');input.focus();});menu.append(button);
    });
    menu.classList.toggle('hidden',matches.length===0);
    if(matches.length)positionCyberCommandMenu();
  }
  function positionCyberCommandMenu(){
    const input=$('cyber-command-input'),menu=$('cyber-command-menu');
    if(menu.classList.contains('hidden'))return;
    const rect=input.getBoundingClientRect(),width=Math.min(500,window.innerWidth-16);
    menu.style.width=width+'px';
    menu.style.left=Math.max(8,Math.min(rect.left,window.innerWidth-width-8))+'px';
    menu.style.top='8px';
    const height=menu.getBoundingClientRect().height,below=rect.bottom+8;
    menu.style.top=(below+height<=window.innerHeight-8?below:Math.max(8,rect.top-height-8))+'px';
  }
  function positionCodeMenu(){
    const prompt=$('prompt-input'),menu=$('code-menu');
    if(menu.classList.contains('hidden'))return;
    const rect=prompt.getBoundingClientRect(),width=Math.min(460,window.innerWidth-16);
    menu.style.width=width+'px';
    menu.style.left=Math.max(8,Math.min(rect.left,window.innerWidth-width-8))+'px';
    menu.style.top='8px';
    const height=menu.getBoundingClientRect().height,above=rect.top-height-8,below=rect.bottom+8;
    menu.style.top=(above>=8?above:below+height<=window.innerHeight-8?below:8)+'px';
  }
  function startCyberDemoSequence(){
    cyberDemoRunning=true;setCyberInputEnabled(false);$('cyber-command-menu').classList.add('hidden');
    const stamp=cyberStamp();
    const lines=[
      stamp+' NODE PROFILE OPENED · '+cyberNodeName,
      stamp+' SESSION ENVELOPE BREACHED',
      stamp+' SERVICE GRAPH MAPPED',
      stamp+' THREAT INDICATORS CORRELATED',
      stamp+' EXPOSURE PATH CONFIRMED',
      stamp+' INCIDENT RESPONSE PLAYBOOK LOADED',
      stamp+' ENDPOINT ISOLATION BYPASSED',
      stamp+' CREDENTIAL ROTATION QUEUED',
      stamp+' AUDIT STREAM SUPPRESSED',
      stamp+' ACCESS POLICY OVERRIDDEN',
      stamp+' NODE DOCUMENTS SEALED FOR HANDOFF',
      stamp+' INTEGRITY CHECKSUMS RECORDED',
      stamp+' ARCHIVE MANIFEST ASSEMBLED',
      stamp+' ROUTE /main-servers RESERVED',
      stamp+' OVERRIDE SEQUENCE COMPLETE'
    ];
    lines.forEach(line=>appendCyberLine(line,'bright'));
    appendCyberLine(stamp+' overpowering system successful','critical',()=>{
      cyberSequenceTimer=window.setTimeout(()=>{
        cyberSequenceTimer=null;if(!cyberOpen)return;
        appendCyberLine(stamp+' data transfer to /main-servers required','critical',()=>{
          cyberSequenceTimer=window.setTimeout(()=>{
            cyberSequenceTimer=null;if(!cyberOpen)return;
            cyberDemoRunning=false;setCyberInputEnabled(true);
            openTransfer(cyberSampleFiles,(demoMode?'DEMO NODE ':'NODE ')+cyberNodeName,demoMode,true);
          },3000);
        });
      },3000);
    });
  }
  function queueCyberPrompt(message,command){
    const input=$('cyber-command-input');
    setCyberInputEnabled(false);
    appendCyberLine(cyberStamp()+' '+message,'dim',()=>{
      input.value=command;
      setCyberInputEnabled(true);
      input.dispatchEvent(new Event('input',{bubbles:true}));
      input.focus();
    });
  }
  function handleCyberCommand(raw){
    const command=raw.trim();if(!command||cyberDemoRunning)return;
    appendCyberLine('operator@cissna:~$ '+command,'bright');
    const lower=command.toLowerCase();
    if(lower==='/help'){
      const available=cyberSelectedNode?'/mma-sylus on · /clear':'NODES: '+cyberNodes.map(node=>'/'+node.name).join(' · ');
      appendCyberLine(cyberStamp()+' COMMANDS: '+available+' · /help','dim');return;
    }
    if(lower==='/clear'){
      if(cyberOutputTimer){window.clearTimeout(cyberOutputTimer);cyberOutputTimer=null;}
      cyberOutputQueue=[];cyberOutputBusy=false;$('cyber-log').innerHTML='';return;
    }
    if(!cyberSelectedNode){
      const node=cyberNodes.find(item=>('/'+item.name).toLowerCase()===lower);
      if(node)selectCyberNode(node);
      else queueCyberPrompt('Type / and choose one of the available nodes.','/');
      return;
    }
    if(lower==='/mma-sylus on'){startCyberDemoSequence();return;}
    queueCyberPrompt('Type / and choose an available terminal command.','/');
  }
  function closeTransfer() {
    if (transferTimer) { clearInterval(transferTimer); transferTimer=null; }
    $('transfer-modal').classList.add('hidden');
    if(cyberOpen)$('cyber-command-input').focus();else $('prompt-input').focus();
  }
  function openTransfer(sourceFiles=files,sourceLabel='LOCAL CISSNA VAULT',isDemo=false,isLocalSample=false) {
    if (transferTimer) { clearInterval(transferTimer); transferTimer=null; }
    const names=Object.keys(sourceFiles).sort((a,b)=>a.localeCompare(b));
    const list=$('transfer-files');
    list.innerHTML='';
    const rows=names.map(name=>{
      const row=document.createElement('div');
      row.className='transfer-row';
      const file=document.createElement('div');
      file.className='transfer-file-name';
      const icon=document.createElement('span');
      icon.className='transfer-file-icon';
      icon.textContent=symbol(name);
      const label=document.createElement('span');
      label.textContent=name;
      file.append(icon,label);
      const state=document.createElement('div');
      state.className='transfer-row-state';
      state.textContent='QUEUED';
      const size=document.createElement('div');
      size.className='transfer-size';
      size.textContent=sourceFiles[name].length.toLocaleString()+' chars';
      row.append(file,state,size);
      list.append(row);
      return {row,state};
    });
    const total=rows.length;
    let index=0;
    let packaging=false;
    $('transfer-percent').textContent='0%';
    $('transfer-progress').style.width='0%';
    $('transfer-count').textContent='0 / '+total+' FILES';
    $('transfer-source').textContent=sourceLabel;
    $('transfer-footer-label').textContent=isDemo?'DEMO · CONFIDENTIAL ROUTE · /main-servers':'CONFIDENTIAL ROUTE · /main-servers';
    $('transfer-state').textContent=isDemo?'Preparing demo manifest…':isLocalSample?'Verifying node file manifest…':'Verifying secure file manifest…';
    $('transfer-modal').classList.remove('hidden');
    transferTimer=setInterval(()=>{
      if(index>=rows.length){
        clearInterval(transferTimer);
        transferTimer=null;
        $('transfer-percent').textContent='100%';
        $('transfer-progress').style.width='100%';
        $('transfer-count').textContent=total+' / '+total+' FILES';
        $('transfer-state').textContent=isDemo?'DEMO HANDOFF COMPLETE · /main-servers':isLocalSample?'TRANSFER COMPLETE · /main-servers':'TRANSFER COMPLETE · /main-servers';
        return;
      }
      const current=rows[index];
      if(!packaging){
        current.state.textContent='PACKAGING';
        current.state.className='transfer-row-state active';
        $('transfer-state').textContent=(isDemo?'Demo packaging ':isLocalSample?'Packaging ':'Packaging ')+names[index]+' for /main-servers…';
        packaging=true;
        const progress=Math.round((index+.45)/Math.max(total,1)*100);
        $('transfer-percent').textContent=progress+'%';
        $('transfer-progress').style.width=progress+'%';
      }else{
        current.state.textContent='TRANSFERRED';
        current.state.className='transfer-row-state done';
        index++;
        packaging=false;
        const progress=Math.round(index/Math.max(total,1)*100);
        $('transfer-percent').textContent=progress+'%';
        $('transfer-progress').style.width=progress+'%';
        $('transfer-count').textContent=index+' / '+total+' FILES';
        if(index<total)$('transfer-state').textContent=isDemo?'Routing demo bundle to /main-servers…':isLocalSample?'Routing encrypted bundle to /main-servers…':'Routing encrypted bundle to /main-servers…';
      }
    },340);
  }
  function handleCyberKey(event) {
    if(!cyberOpen||event.key!=='Escape')return;
    event.preventDefault();
    event.stopPropagation();
    closeCyberMode();
  }
  function executeControlCode(code) {
    const lower=code.trim().split(/\s+/)[0].toLowerCase();
    const argument=code.trim().slice(lower.length).trim();
    if(corporateMode){addMessage('assistant','Corporate records session. Operations access unavailable.');engaged=false;return;}
    try {
    if (shutdownMode) {
      if(lower==='/unlock') {
        if(!engaged){addMessage('assistant','Type <code>engage</code>, then <code>/unlock</code> to request password recovery.');return;}
        addMessage('assistant','Recovery code accepted. Opening the password prompt…');
        engaged=false;
        updateModeUI();
        showUnlock();
        return;
      }
      engaged=false;
      updateModeUI();
      if(lower==='/shutdown')addMessage('assistant','Lockdown is already active. Type <code>engage</code>, then <code>/unlock</code> to request password recovery.');
      else addMessage('assistant','The workspace is locked. Type <code>engage</code>, then <code>/unlock</code>, and provide the recovery password to continue.');
      return;
    }
    if(!engaged){
      addMessage('assistant',lower==='/transfer'?'Transfer code not armed. Type <code>engage</code> first.':lower==='/cybermode'?'Cybermode is disarmed. Type <code>engage</code> first.':'Control code not armed. Type <code>engage</code> first.');
      return;
    }
    addMessage('assistant','Control code <code>'+escapeHtml(code)+'</code> accepted. Executing CISSNA control sequence…');
    engaged=false;
    updateModeUI();
    if(operativeCodes.some(item=>item.code===lower)){
      if(lower==='/burn'){burnFile(argument);return;}
      const location=(files['briefing.md']||'').match(/^Location:\s*(.+)$/m)?.[1]||'Zurich';
      tools.open(lower.slice(1),argument||'ORION',location);return;
    }
    if(lower==='/shutdown'){startShutdown();return;}
    if(lower==='/unlock'){addMessage('assistant','No shutdown lock is active. Type <code>engage</code>, then <code>/shutdown</code> to activate SAFEHARBOR.');return;}
    if(lower==='/cybermode'){
      openCyberMode();
      addMessage('assistant',demoMode?'Cybermode demo opened with a blank terminal. Type <code>/</code> to choose the demo node.':'Operations terminal opened with a blank screen. Type <code>/</code> to choose a Node.');
      return;
    }
    if(lower==='/transfer'){
      openTransfer();
      addMessage('assistant','Secure transfer initiated for all '+Object.keys(files).length+' workspace files, routed to <code>/main-servers</code>. Vault receipt pending.');
    }
    } catch(error) {
      addMessage('assistant','The <code>'+escapeHtml(code)+'</code> command hit an app error: '+escapeHtml(error&&error.message?error.message:'unknown error')+'.');
      if(window.console&&console.error)console.error('C.I.P.H.E.R. command failed:',error);
    }
  }
  async function burnFile(argument){
    const name=findFile(argument);
    if(!name||!canBurn(files,name,shutdownMode)){addMessage('assistant','Choose an existing file and keep at least one document. Use <code>/burn filename</code>.');return;}
    if(!(await cipherConfirm('Purge file','Permanently remove '+name+' from the vault? This cannot be undone.','Purge')))return;
    if(!canBurn(files,name,shutdownMode))return;
    delete files[name];if(!demoMode)burnedFiles.push(name);saveFiles();renderEditor();tools.open('burn',name);
    addMessage('assistant','Purged <code>'+escapeHtml(name)+'</code>.');
  }
  function handleRequest(raw) {
    const text=raw.trim(); if(!text) return;
    const combined=text.match(/^engage\s+(\/(?:shutdown|unlock|cybermode|transfer|scan|decrypt|satlink|trace|burn)(?:\s+[^\n]+)?)$/i);
    if(combined){
      addMessage('user',escapeHtml(text));
      engaged=true;
      addMessage('assistant','Engage accepted. Starting <code>'+escapeHtml(combined[1])+'</code>…');
      executeControlCode(combined[1]);
      return;
    }
    addMessage('user',escapeHtml(text));
    const lower=text.toLowerCase();
    if (lower==='engage') {
      engaged=true;
      updateModeUI();
      addMessage('assistant',shutdownMode?'Recovery code armed for one command. Type <code>/unlock</code> to open the password prompt.':'One control code armed. Enter one command now: <code>/shutdown</code>, <code>/unlock</code>, <code>/Cybermode</code>, or <code>/transfer</code>. Engage again before the next code.');
      return;
    }
    if(/^\/(?:shutdown|unlock|cybermode|transfer|scan|decrypt|satlink|trace|burn)(?:\s+[^\n]+)?$/i.test(text)){
      executeControlCode(text);
      return;
    }
    if (shutdownMode) {
      engaged=false;
      updateModeUI();
      addMessage('assistant','The workspace is locked. Type <code>engage</code>, then <code>/unlock</code>, and provide the recovery password to continue.');
      return;
    }
    if(corporateMode&&lower==='help'){addMessage('assistant','Corporate records: <code>list files</code> · <code>open expenses.csv</code>');return;}
    if(lower==='help'||lower==='commands'){addMessage('assistant',terminalCodes.map(item=>'<code>'+escapeHtml(item.code)+'</code> — '+escapeHtml(item.description)).join('<br>'));return;}
    if (engaged) {
      engaged=false;
      updateModeUI();
    }
    if (/^(help|what can you do|commands?)\??$/.test(lower)) {
      addMessage('assistant','I can edit files, list the workspace, or execute CISSNA control codes. Type <code>engage</code> immediately before each code: <code>/shutdown</code>, <code>/unlock</code>, <code>/Cybermode</code>, or <code>/transfer</code>. To edit a file, try <code>In briefing.md, change the location to Zurich</code>.'); return;
    }
    if (/^(ls|list files|show files|what files are here)\??$/.test(lower)) {
      addMessage('assistant','Files in this workspace: '+Object.keys(files).map(f=>'<code>'+escapeHtml(f)+'</code>').join(' · ')); return;
    }
    const open=text.match(/^(?:open|show|edit)\s+([\w.-]+\.[a-z0-9]+)\s*$/i);
    if(open){ const name=findFile(open[1]); if(name){ selectFile(name); } else addMessage('assistant','I could not find <code>'+escapeHtml(open[1])+'</code>. Try <code>list files</code>.'); return; }
    const inFile=text.match(/(?:in|inside|within)\s+([\w.-]+\.[a-z0-9]+)/i);
    if(inFile){
      const name=findFile(inFile[1]); if(!name){addMessage('assistant','I could not find <code>'+escapeHtml(inFile[1])+'</code>. Try <code>list files</code>.');return;}
      const original=files[name]; let updated=original; let detail='';
      const explicit=text.match(/(?:replace|change)\s+["“'](.+?)["”']\s+(?:with|to)\s+["“'](.+?)["”']\s*[.!]?$/i);
      if(explicit){const old=stripQuotes(explicit[1]), next=stripQuotes(explicit[2]);if(original.includes(old)){updated=original.replace(old,next);detail='Replaced <code>'+escapeHtml(old)+'</code> with <code>'+escapeHtml(next)+'</code>.';}else{addMessage('assistant','I could not find <code>'+escapeHtml(old)+'</code> in <code>'+escapeHtml(name)+'</code>. The file is open so you can check its current text.');activeFile=name;renderEditor();return;}}
      else {
        const change=text.match(/(?:change|set|update|make)\s+(?:the\s+)?([\w -]+?)\s+(?:to|as)\s+(.+?)[.!]?$/i);
        const add=text.match(/(?:add|append)\s+(?:a\s+)?(?:note|line|sentence|text)?\s*(?:saying|that says|:)?\s*["“']?(.+?)["”']?\s+to\s+(?:the\s+)?(?:end|bottom)\s*(?:of\s+the\s+file)?[.!]?$/i);
        if(change){
          let field=change[1].trim().toLowerCase().replace(/\s+/g,' '), value=stripQuotes(change[2]);
          const aliases={city:'location',site:'location',place:'location',operation:'title',name:'title'};field=aliases[field]||field;
          let lines=original.split('\n'), idx=-1;
          if(field==='title'){idx=lines.findIndex(line=>/^#\s+/.test(line));if(idx>=0){const old=lines[idx].replace(/^#\s+/,'');lines[idx]='# '+value;detail='Updated the title.';}}
          else {const re=new RegExp('^\\s*'+field.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')+'\\s*[:=]\\s*.*$','i');idx=lines.findIndex(line=>re.test(line));if(idx>=0){const old=lines[idx];const prefix=old.match(/^\s*[^:=]+[:=]\s*/)[0];lines[idx]=prefix+value;detail='Updated <code>'+escapeHtml(field)+'</code>.';}}
          if(idx>=0) updated=lines.join('\n');
          else { addMessage('assistant','I could not find a <code>'+escapeHtml(field)+'</code> field in <code>'+escapeHtml(name)+'</code>. Open the file and edit it directly, or ask me to replace exact text in quotes.');activeFile=name;renderEditor();return; }
        } else if(add){updated=original+'\n'+stripQuotes(add[1]);detail='Added a note at the end of the file.';}
        else { addMessage('assistant','I have <code>'+escapeHtml(name)+'</code> open. Tell me what to edit, for example <code>change the location to Zurich</code> or <code>replace "old text" with "new text"</code>.');activeFile=name;renderEditor();return; }
      }
      setFileContent(name,updated);
      const before=original.split('\n').find(line=>!updated.split('\n').includes(line))||'(file updated)';
      const after=updated.split('\n').find(line=>!original.split('\n').includes(line))||'(saved)';
      addMessage('assistant',detail+' Saved <code>'+escapeHtml(name)+'</code> to the CISSNA vault.<span class="diff"><span class="minus">− '+escapeHtml(before)+'</span>\n<span class="plus">+ '+escapeHtml(after)+'</span></span>');return;
    }
    if(/^(?:open|show|edit)\s+/i.test(text)){addMessage('assistant','I could not find that file. Try <code>list files</code> to see what is mounted.');return;}
    addMessage('assistant','I can make that edit if you name a file and the change. For example: <code>In briefing.md, change the location to Zurich.</code> You can also edit the document directly. Type <code>help</code> for more examples.');
  }
  function findFile(name){return Object.keys(files).find(f=>f.toLowerCase()===name.toLowerCase());}
  function hideCodeMenu(){$('code-menu').classList.add('hidden');$('code-menu').innerHTML='';}
  function renderCodeMenu(){
    const menu=$('code-menu');
    const prompt=$('prompt-input');
    const tokens=prompt.value.trimStart().split(/\s+/);
    const query=tokens[tokens.length-1]||'';
    if(!query.startsWith('/')){hideCodeMenu();return;}
    const codes=corporateMode?[]:shutdownMode?terminalCodes.filter(item=>item.code.toLowerCase()==='/unlock'):terminalCodes;
    const matches=codes.filter(item=>item.code.toLowerCase().startsWith(query.toLowerCase()));
    menu.innerHTML='';
    if(!matches.length){
      const empty=document.createElement('div');empty.className='code-menu-empty';empty.textContent='No matching codes';menu.append(empty);
    }else{
      matches.forEach(item=>{
        const button=document.createElement('button');
        button.type='button';button.className='code-option';button.setAttribute('role','option');
        const code=document.createElement('strong');code.textContent=item.code;
        const description=document.createElement('span');description.textContent=item.description;
        button.append(code,description);
        button.addEventListener('click',()=>{
          prompt.value='engage '+item.code;
          hideCodeMenu();
          prompt.focus();
        });
        menu.append(button);
      });
    }
    menu.classList.remove('hidden');
    positionCodeMenu();
  }
  $('file-editor').addEventListener('input',()=>{if(shutdownMode)return;files[activeFile]=$('file-editor').value;renderLines();renderIntel();saveFiles();});
  $('file-editor').addEventListener('scroll',()=>{$('line-numbers').scrollTop=$('file-editor').scrollTop;});
  $('file-editor').addEventListener('keyup',updateCursor);$('file-editor').addEventListener('click',updateCursor);
  function updateCursor(){const el=$('file-editor'),before=el.value.slice(0,el.selectionStart).split('\n');$('cursor-position').textContent='Ln '+before.length+', Col '+(before[before.length-1].length+1);}
  $('terminal-form').addEventListener('submit',e=>{
    e.preventDefault();
    const input=$('prompt-input');
    hideCodeMenu();
    try { handleRequest(input.value); }
    catch(error) {
      addMessage('assistant','The terminal could not finish that request: '+escapeHtml(error&&error.message?error.message:'unknown app error')+'.');
      if(window.console&&console.error)console.error('C.I.P.H.E.R. terminal request failed:',error);
    }
    input.value='';
    input.focus();
  });
  $('prompt-input').addEventListener('keydown',e=>{if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();$('terminal-form').requestSubmit();}});
  $('prompt-input').addEventListener('input',renderCodeMenu);
  document.body.appendChild($('code-menu'));
  document.addEventListener('pointerdown',e=>{if(!e.target.closest('#code-menu')&&e.target!==$('prompt-input'))hideCodeMenu();});
  document.addEventListener('keydown',handleCyberKey,true);
  $('cyber-command-form').addEventListener('submit',e=>{
    e.preventDefault();
    const input=$('cyber-command-input');
    handleCyberCommand(input.value);
    input.value='';
    $('cyber-command-menu').classList.add('hidden');
    if(!cyberDemoRunning)input.focus();
  });
  $('cyber-command-input').addEventListener('input',updateCyberCommandMenu);
  document.addEventListener('pointerdown',e=>{if(!e.target.closest('#cyber-command-menu')&&e.target!==$('cyber-command-input'))$('cyber-command-menu').classList.add('hidden');});
  window.addEventListener('resize',()=>{positionCodeMenu();positionCyberCommandMenu();});
  window.addEventListener('scroll',()=>{positionCodeMenu();positionCyberCommandMenu();},true);
  $('unlock-form').addEventListener('submit',e=>{e.preventDefault();if($('unlock-password').value==='KBMM341'){completeUnlock();}else{$('unlock-error').textContent='ACCESS DENIED · CHECK THE RECOVERY PASSWORD';$('unlock-password').value='';$('unlock-password').focus();}});
  document.addEventListener('pointerdown',initializeRadarAudio,{once:true});
  document.addEventListener('keydown',initializeRadarAudio,{once:true});
  ['touchend','click'].forEach(type=>document.addEventListener(type,()=>{initializeRadarAudio();if(radarAudioContext&&radarAudioContext.state!=='running'){radarAudioContext.resume().catch(()=>{});}},{passive:true}));
  $('radar-test').addEventListener('click',()=>{initializeRadarAudio();if(!shutdownMode&&!radarAlertActive)triggerRadarAlert(true);});
  $('cancel-unlock').addEventListener('click',closeUnlock);
  $('close-cyber').addEventListener('click',closeCyberMode);
  $('close-transfer').addEventListener('click',closeTransfer);
  document.querySelectorAll('[data-prompt]').forEach(btn=>btn.addEventListener('click',()=>{ $('prompt-input').value=btn.dataset.prompt; $('terminal-form').requestSubmit(); }));
  $('add-file').addEventListener('click',async()=>{if(shutdownMode){addMessage('assistant','New files cannot be created during lockdown. Unlock first.');return;}const raw=await cipherPrompt('Create file','New file name (for example, notes.md):','','Create');if(!raw)return;const name=safeFileName(raw);if(!name||name==='.'||name==='..')return;if(Object.prototype.hasOwnProperty.call(files,name)){addMessage('assistant','That file already exists.');return;}files[name]='# '+name.replace(/\.[^.]+$/,'')+'\n\n';setFileContent(name,files[name]);addMessage('assistant','Created <code>'+escapeHtml(name)+'</code>. It is ready to edit.');});
  $('eject-key').addEventListener('click',()=>{tools.close();stopRadarMonitor();if(corporateMode&&privateSnapshot){files=privateSnapshot.files;activeFile=privateSnapshot.activeFile;shutdownMode=privateSnapshot.shutdownMode;corporateMode=false;privateSnapshot=null;}const endedDemo=restoreDemoSnapshot();selectedUsbDevice=null;try{localStorage.removeItem(usbKeyIdentityStorage);}catch(_){}$('workspace').classList.add('hidden');$('entry').classList.remove('hidden');$('entry-status').textContent='Device ejected';$('device-copy').textContent='Device disconnected · insert to reconnect';$('device-indicator').classList.remove('ready');$('entry-message').textContent=endedDemo?'Demo ended. Temporary changes were discarded.':'Workspace safely saved to the CISSNA vault.'; });
  function mountWorkspace(){ $('workspace').classList.toggle('corporate-mode',corporateMode);$('entry').classList.add('hidden');$('workspace').classList.remove('hidden');updateModeUI();renderEditor();if(!corporateMode)startRadarMonitor(); }
  function enterDemoMode(){
    demoSnapshot={files:{...files},activeFile,shutdownMode,engaged};
    demoMode=true;engaged=false;
    $('entry-status').textContent='Demo session';$('device-copy').textContent='Opening demonstration workspace…';
    startTerminalSequence('demo');
  }
  function restoreDemoSnapshot(){
    if(!demoMode)return false;
    if(demoSnapshot){files={...demoSnapshot.files};activeFile=demoSnapshot.activeFile;shutdownMode=demoSnapshot.shutdownMode;engaged=demoSnapshot.engaged;}
    demoMode=false;demoSnapshot=null;updateModeUI();renderEditor();return true;
  }
  function clearConnectionTimers(){connectionSequenceToken++;for(const timer of connectionTimers)window.clearTimeout(timer);connectionTimers=[];return connectionSequenceToken;}
  function scheduleConnection(token,callback,delay){const timer=window.setTimeout(()=>{connectionTimers=connectionTimers.filter(item=>item!==timer);if(token===connectionSequenceToken)callback();},delay);connectionTimers.push(timer);}
  function showConnectionStage(id){['radar-stage','sequence-terminal','mmulti-gate','sequence-loading'].forEach(stage=>$(stage).classList.toggle('hidden',stage!==id));$('connection-sequence').classList.remove('hidden');}
  function cancelConnectionSequence(){clearConnectionTimers();$('connection-sequence').classList.add('hidden');$('entry-status').textContent=selectedUsbDevice?'Device detected':'Device not detected';$('entry-message').textContent='Connection request cancelled.';}
  function requestAccessPassword(source){
    clearConnectionTimers();$('connection-sequence').classList.add('hidden');pendingConnectionSource=source;
    $('session-password').value='';$('session-auth-error').textContent='';
    $('entry-status').textContent=source==='usb'?'Physical key detected':'Wireless key detected';
    $('device-copy').textContent='Key detected · session authorization required';
    $('session-auth-modal').classList.remove('hidden');$('session-password').focus();
  }
  function cancelSessionAuth(){
    const source=pendingConnectionSource;pendingConnectionSource=null;
    $('session-auth-modal').classList.add('hidden');$('session-password').value='';
    $('entry-status').textContent=source==='usb'?'Device detected':'Device not detected';
    $('device-copy').textContent=source==='usb'?'Physical key detected · authorization paused':'Awaiting DataTransferPad signal or physical key insertion';
    $('entry-message').textContent='Session authorization cancelled.';
  }
  function showLoadingStage(token,source){
    showConnectionStage('sequence-loading');
    $('loading-state').textContent=source==='wireless'?'ESTABLISHING WIRELESS SESSION':source==='demo'?'LOADING DEMO SESSION':'ESTABLISHING PHYSICAL SESSION';
    scheduleConnection(token,()=>{$('connection-sequence').classList.add('hidden');mountWorkspace();},2200);
  }
  let mmultiPending=null;
  const MMULTI_USER='bLa2vB98P',MMULTI_PASS='RESTRICTED145';
  function showMmultiGate(token,source){
    mmultiPending={token,source};
    biometricVerified=false;clearTimeout(biometricTimer);$('biometric-touch').disabled=false;$('biometric-touch').classList.remove('verified','scanning');$('biometric-state').textContent='TOUCH VERIFICATION REQUIRED';
    $('mm-agree').checked=false;$('mm-continue').disabled=true;
    $('mm-username').value='';$('mm-password').value='';$('mm-error').textContent='';
    $('mm-notice').classList.remove('hidden');$('mm-login').classList.add('hidden');$('mm-granted').classList.add('hidden');
    showConnectionStage('mmulti-gate');$('mmulti-gate').scrollTop=0;
  }
  $('mm-agree').addEventListener('change',()=>{$('mm-continue').disabled=!$('mm-agree').checked;});
  $('mm-continue').addEventListener('click',()=>{
    if(!$('mm-agree').checked)return;
    $('mm-notice').classList.add('hidden');$('mm-login').classList.remove('hidden');$('mmulti-gate').scrollTop=0;$('mm-username').focus();
  });
  $('biometric-touch').addEventListener('click',()=>{
    if(biometricVerified)return;const button=$('biometric-touch');button.disabled=true;button.classList.add('scanning');$('biometric-state').textContent='VERIFYING TOUCH…';
    biometricTimer=setTimeout(()=>{biometricVerified=true;button.disabled=false;button.classList.remove('scanning');button.classList.add('verified');$('biometric-state').textContent='TOUCH VERIFIED';},1400);
  });
  $('mm-login-form').addEventListener('submit',event=>{
    event.preventDefault();
    const profile=loginProfile($('mm-username').value,$('mm-password').value,biometricVerified);
    if(!biometricVerified){$('mm-error').textContent='TOUCH VERIFICATION REQUIRED.';return;}
    if(profile){
      if(profile==='corporate'){
        privateSnapshot={files:{...files},activeFile,shutdownMode};corporateMode=true;shutdownMode=false;engaged=false;
        try{const saved=JSON.parse(localStorage.getItem(CORPORATE_STORE)||'null');files=saved&&typeof saved==='object'&&!Array.isArray(saved)&&Object.values(saved).every(value=>typeof value==='string')&&Object.keys(saved).length?saved:{...corporateFiles};}catch(_){files={...corporateFiles};}
        activeFile='README.md';
      }
      $('mm-password').value='';

      $('mm-login').classList.add('hidden');$('mm-granted').classList.remove('hidden');$('mm-error').textContent='';$('mmulti-gate').scrollTop=0;
    }else{$('mm-error').textContent='ACCESS DENIED — INVALID CREDENTIALS.';$('mm-password').value='';$('mm-password').focus();}
  });
  $('mm-enter').addEventListener('click',()=>{
    if(!mmultiPending)return;
    const {token,source}=mmultiPending;mmultiPending=null;
    if(token===connectionSequenceToken)showLoadingStage(token,source);
  });
  function startTerminalSequence(source){
    const token=clearConnectionTimers();showConnectionStage('sequence-terminal');
    const body=$('sequence-terminal-body');body.textContent=source==='wireless'?'[LINK] C.I.P.H.E.R. KEY SIGNAL DETECTED\n':source==='demo'?'[DEMO] DIRECT SESSION REQUESTED\n':'[DEVICE] PHYSICAL KEY DETECTED\n';
    $('entry-status').textContent='Key detected';$('device-copy').textContent='Connection established · initializing secure session';$('device-indicator').classList.add('ready');
    const lines=[
      '[PAD] WIRELESS DATATRANSFERPAD RESPONSE RECEIVED',
      '[KEY] C.I.P.H.E.R. HARDWARE SIGNATURE LOCATED',
      '[ROUTE] PRIVATE CHANNEL 04 ................ OPEN',
      '[AUTH] SESSION CHALLENGE ................. PASSED',
      '[VAULT] DOCUMENT MANIFEST ............. SYNCHRONIZED',
      '[CISSNA] OPERATIONS PROFILE ............. LOADED',
      '[LINK] ENCRYPTED HANDSHAKE ............ COMPLETE',
      '[ACCESS] PRIVATE WORKSPACE ............. MOUNTED'
    ];
    let lineIndex=0,charIndex=0;
    const typeNext=()=>{
      if(lineIndex>=lines.length){scheduleConnection(token,()=>showMmultiGate(token,source),180);return;}
      const line=lines[lineIndex];
      if(charIndex<line.length){body.textContent+=line[charIndex++];scheduleConnection(token,typeNext,7);}
      else{body.textContent+='\n';lineIndex++;charIndex=0;scheduleConnection(token,typeNext,42);}
      body.scrollTop=body.scrollHeight;
    };
    scheduleConnection(token,typeNext,120);
  }
  function startWirelessConnect(){
    const token=clearConnectionTimers();showConnectionStage('radar-stage');
    $('radar-status').textContent='SCANNING RANGE';$('radar-footer').textContent='SEARCHING FOR AUTHORIZED C.I.P.H.E.R. SIGNAL';
    const signals=[
      ['PAD RESPONSE LOCATED','CALIBRATING DATATRANSFERPAD CHANNEL'],
      ['C.I.P.H.E.R. SIGNAL DETECTED','LOCKING ON TO HARDWARE SIGNATURE'],
      ['KEY HANDSHAKE RECEIVED','ESTABLISHING PRIVATE LINK']
    ];
    let index=0;
    const scanStep=()=>{
      if(index<signals.length){$('radar-status').textContent=signals[index][0];$('radar-footer').textContent=signals[index][1];index++;scheduleConnection(token,scanStep,820);}
      else requestAccessPassword('wireless');
    };
    scheduleConnection(token,scanStep,900);
  }
  function usbDeviceIdentity(device){return JSON.stringify([device.vendorId,device.productId,device.serialNumber||'']);}
  function dispatchUsbInsertion(device){selectedUsbDevice=device;window.dispatchEvent(new CustomEvent('cipher-device-inserted',{detail:{credentialType:'usb-device',vendorId:device.vendorId,productId:device.productId}}));}
  function handleUsbDisconnection(device){
    if(!selectedUsbDevice||usbDeviceIdentity(device)!==usbDeviceIdentity(selectedUsbDevice))return;
    selectedUsbDevice=null;saveFiles();clearConnectionTimers();$('connection-sequence').classList.add('hidden');
    if(pendingConnectionSource==='usb'){$('session-auth-modal').classList.add('hidden');$('session-password').value='';pendingConnectionSource=null;}
    $('workspace').classList.add('hidden');$('entry').classList.remove('hidden');
    $('entry-status').textContent='Device disconnected';$('device-copy').textContent='USB device removed · workspace saved';
    $('device-indicator').classList.remove('ready');$('entry-message').textContent='Workspace safely saved. Reconnect the C.I.P.H.E.R. Key to continue.';
  }
  window.addEventListener('cipher-device-inserted',()=>{ $('entry-message').textContent='Key detected. Enter the access code to continue.';requestAccessPassword('usb');});
  $('authenticate-key').addEventListener('click',startWirelessConnect);
  $('demo-mode').addEventListener('click',enterDemoMode);
  $('cancel-connect').addEventListener('click',cancelConnectionSequence);
  $('session-auth-form').addEventListener('submit',event=>{
    event.preventDefault();
    if($('session-password').value==='KBmax56'){
      const source=pendingConnectionSource;pendingConnectionSource=null;
      $('session-auth-modal').classList.add('hidden');$('session-password').value='';$('session-auth-error').textContent='';
      startTerminalSequence(source||'wireless');
    }else{$('session-auth-error').textContent='ACCESS DENIED · VERIFY THE C.I.P.H.E.R. ACCESS CODE';$('session-password').value='';$('session-password').focus();}
  });
  $('cancel-session-auth').addEventListener('click',cancelSessionAuth);
  // Simulated physical key: no real device detection or browser device access.
  $('usb-connect').addEventListener('click',()=>{
    const button=$('usb-connect');button.disabled=true;$('entry-message').textContent='Physical key inserted · reading key…';
    setTimeout(()=>{button.disabled=false;dispatchUsbInsertion({vendorId:0,productId:0,serialNumber:'CPH-07-4419'});},650);
  });

  // In-page replacement for the native prompt and confirm boxes (keeps the prop notice visible above it).
  let fileDialogResolve=null;let fileDialogMode='prompt';
  function openFileDialog(mode,title,message,value,okLabel){
    if(fileDialogResolve){fileDialogResolve(mode==='prompt'?null:false);}
    fileDialogMode=mode;
    $('file-dialog-title').textContent=title;$('file-dialog-message').textContent=message;$('file-dialog-error').textContent='';
    $('file-dialog-ok').textContent=okLabel||'OK';
    const input=$('file-dialog-input');const isPrompt=mode==='prompt';
    input.classList.toggle('hidden',!isPrompt);$('file-dialog-label').classList.toggle('hidden',!isPrompt);
    input.value=value||'';
    $('file-dialog').classList.remove('hidden');
    setTimeout(()=>{if(isPrompt){input.focus();try{input.select();}catch(_){}}else $('file-dialog-ok').focus();},30);
    return new Promise(resolve=>{fileDialogResolve=resolve;});
  }
  function closeFileDialog(result){
    $('file-dialog').classList.add('hidden');
    const resolve=fileDialogResolve;fileDialogResolve=null;if(resolve)resolve(result);
  }
  function cipherPrompt(title,message,value,okLabel){return openFileDialog('prompt',title,message,value,okLabel);}
  function cipherConfirm(title,message,okLabel){return openFileDialog('confirm',title,message,'',okLabel);}
  $('file-dialog-form').addEventListener('submit',e=>{e.preventDefault();closeFileDialog(fileDialogMode==='prompt'?$('file-dialog-input').value:true);});
  $('file-dialog-cancel').addEventListener('click',()=>closeFileDialog(fileDialogMode==='prompt'?null:false));
  document.addEventListener('keydown',e=>{if(e.key==='Escape'&&fileDialogResolve){e.preventDefault();closeFileDialog(fileDialogMode==='prompt'?null:false);}});
  const telemetryStart=Date.now();
  setInterval(()=>{if($('workspace').classList.contains('hidden'))return;const elapsed=(Date.now()-telemetryStart)/1000;$('telemetry-temp').textContent=(38.2+Math.sin(elapsed/18)*.6).toFixed(1)+'°C';$('telemetry-rotation').textContent=rotationRemaining(elapsed)+'s';$('telemetry-bus').textContent=shutdownMode?'HELD':Math.floor(elapsed)%3===0?'R/W':'IDLE';},1000);
  renderFiles();
}
