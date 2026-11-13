import { describe, expect, it } from 'vitest';
import { satelliteConnectionReady } from '../cipher/satellite-data';

describe('satellite connection delay', () => {
  it('waits about a second before releasing connected details', () => {
    expect(satelliteConnectionReady(999)).toBe(false);
    expect(satelliteConnectionReady(1199)).toBe(false);
    expect(satelliteConnectionReady(1200)).toBe(true);
  });
});