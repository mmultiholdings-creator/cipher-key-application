import { describe, expect, it } from 'vitest';
import { selectCameraClips } from '../cipher/camera-footage';

describe('camera visit selection', () => {
  it('assigns four distinct real clips on the first visit', () => {
    expect(selectCameraClips([], () => 0.5).sort()).toEqual([0, 1, 2, 3]);
  });
  it('changes every camera clip when reopened even if randomness repeats', () => {
    const first = selectCameraClips([], () => 0.5);
    const second = selectCameraClips(first, () => 0.5);
    expect(second.slice().sort()).toEqual([0, 1, 2, 3]);
    first.forEach((clip, index) => expect(second[index]).not.toBe(clip));
  });
});