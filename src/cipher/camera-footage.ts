import pedestrianStreet from '@/assets/fixed-street-3428.mp4.asset.json';
import rainyRoad from '@/assets/fixed-street-4331.mp4.asset.json';
import nightCrossing from '@/assets/fixed-street-4332.mp4.asset.json';
import tokyoStreet from '@/assets/fixed-street-4451.mp4.asset.json';

export const cameraFootage = [
  { url: pedestrianStreet.url, label: 'PEDESTRIAN ACCESS' },
  { url: rainyRoad.url, label: 'STREET LEVEL / WEST' },
  { url: nightCrossing.url, label: 'NIGHT CROSSING' },
  { url: tokyoStreet.url, label: 'EAST CONCOURSE' },
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