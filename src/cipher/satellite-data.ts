export const SATELLITE_CONNECT_MS = 1200;
export const satellites = [
  { id: 'CISSNA-07', role: 'Encrypted communications', altitude: 642, inclination: 51.6, period: 97.4, frequency: '14.225 GHz', footprint: 'EUROPE / NORTH ATLANTIC', cipher: 'AES-256 / CHANNEL 04', signal: 98, phase: 0.4 },
  { id: 'NIGHTGLASS-02', role: 'Optical reconnaissance', altitude: 518, inclination: 97.5, period: 94.8, frequency: '8.450 GHz', footprint: 'CENTRAL EUROPE', cipher: 'AES-256 / CHANNEL 12', signal: 94, phase: 2.2 },
  { id: 'ARGUS-11', role: 'Wide-band relay', altitude: 890, inclination: 63.4, period: 103.2, frequency: '26.500 GHz', footprint: 'NORTHERN HEMISPHERE', cipher: 'AES-256 / CHANNEL 08', signal: 96, phase: 4.1 },
  { id: 'POLARIS-04', role: 'Telemetry & navigation', altitude: 720, inclination: 35.2, period: 99.2, frequency: '2.210 GHz', footprint: 'GLOBAL RELAY NETWORK', cipher: 'AES-256 / CHANNEL 16', signal: 92, phase: 5.4 },
];

export function satelliteConnectionReady(elapsed: number) {
  return elapsed >= SATELLITE_CONNECT_MS;
}