export const DURESS_CODE = 'DURESS99';
export const CORPORATE_STORE = 'cipher-corporate-v1';
export const ROTATION_SECONDS = 60;
export const operativeCodes = [
  {code:'/scan', description:'Intercept encrypted signal bands'},
  {code:'/decrypt', description:'Open hex decryption console'},
  {code:'/satlink', description:'Track orbital communications windows'},
  {code:'/trace', description:'Map relay hops for a target'},
  {code:'/burn', description:'Purge a named file after confirmation'},
];
export const intelFiles = {
  'dossier_target_orion.txt': 'CISSNA // ORION DOSSIER\nClassification: TOP SECRET\nStatus: OBSERVATION\nLocation: Zurich\n\nIdentity: [REDACTED:Elian Vale]\nMeeting point: [REDACTED:47.3769 N / 8.5417 E]\nWindow: 21:40 CET\n\nORION carries the NIGHTGLASS archive manifest. Maintain distance and await clearance.',
  'surveillance_brief.txt': 'CISSNA // GLASSHOUSE SURVEILLANCE\nClassification: TOP SECRET\nLocation: Geneva\n\nHandler: [REDACTED:Agent North]\nRelay: [REDACTED:PAPER MOON / CH 04]\n\nObservation log\n18:10 — Courier entered the west concourse.\n18:24 — Sealed packet exchanged.\n18:32 — ORION signal reacquired.\n\nNext review: Zurich station.',
};
export const corporateFiles = {
  'README.md': '# MMulti Holdings\n\nCorporate administration\nReporting period: Q4 2026\n\nOffice records and expense reconciliation.',
  'office_assets.csv': 'asset,department,quantity,status\nDesk monitor,Finance,12,In service\nOffice chair,Administration,24,In service\nPrinter,Reception,2,Maintenance scheduled',
  'expenses.csv': 'date,category,amount_chf,status\n2026-11-02,Office supplies,148.50,Approved\n2026-11-04,Meeting refreshments,62.00,Approved\n2026-11-06,Printer service,215.00,Pending',
  'office_memo.md': '# Office memo\n\nPlease submit November receipts to Finance by Friday.\nThe fourth-floor meeting room is reserved for the quarterly review.',
};
export function loginProfile(user: string, password: string, biometric: boolean): 'private' | 'corporate' | null {
  if (!biometric || user.trim() !== 'bLa2vB98P') return null;
  return password === 'RESTRICTED145' ? 'private' : null;
}
export function rotationRemaining(elapsed: number) { return ROTATION_SECONDS - Math.floor(elapsed) % ROTATION_SECONDS; }
export function canBurn(files: Record<string,string>, name: string, locked: boolean) {
  return !locked && Object.hasOwn(files, name) && Object.keys(files).length > 1;
}