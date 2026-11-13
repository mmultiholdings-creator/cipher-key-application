import nightJunction from '@/assets/city-11.mp4.asset.json';
import nightAvenue from '@/assets/city-44690.mp4.asset.json';
import cityLights from '@/assets/city-1151.mp4.asset.json';
import daytimeTraffic from '@/assets/city-56.mp4.asset.json';

export const cameraFootage = [
  { url: nightJunction.url, label: 'NORTH INTERCHANGE' },
  { url: nightAvenue.url, label: 'CENTRAL AVENUE' },
  { url: cityLights.url, label: 'CITY PERIMETER' },
  { url: daytimeTraffic.url, label: 'EAST ACCESS ROAD' },
];

// Every camera changes clips between visits, including unlucky random draws.
export function selectCameraClips(previous: number[], random = Math.random): number[] {
  const order = cameraFootage.map((_, i) => i);
  for (let i = order.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    const current = order[i];
    const other = order[j];
    if (current !== undefined && other !== undefined) {
      order[i] = other; order[j] = current;
    }
  }
  if (order.some((clip, i) => clip === previous[i])) {
    const shift = 1 + Math.floor(random() * (cameraFootage.length - 1));
    return previous.map((_, i) => previous[(i + shift) % previous.length] ?? order[i] ?? 0);
  }
  return order;
}