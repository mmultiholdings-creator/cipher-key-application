import { describe, expect, it } from 'vitest';
import { loginProfile, canBurn, rotationRemaining, loadCorporateFiles } from '../cipher/operative-data';
describe('operative rules',()=>{
  it('requires touch verification before private access',()=>{expect(loginProfile('bLa2vB98P','RESTRICTED145',false)).toBeNull();expect(loginProfile('bLa2vB98P','RESTRICTED145',true)).toBe('private');});
  it('no longer accepts DURESS99 at the second login',()=>{expect(loginProfile('bLa2vB98P','DURESS99',true)).toBeNull();});
  it('rotates the key on a sixty-second cycle',()=>{expect(rotationRemaining(0)).toBe(60);expect(rotationRemaining(59)).toBe(1);expect(rotationRemaining(60)).toBe(60);});
  it('never burns a missing, last, or locked file',()=>{expect(canBurn({a:'a',b:'b'},'a',false)).toBe(true);expect(canBurn({a:'a'},'a',false)).toBe(false);expect(canBurn({a:'a',b:'b'},'a',true)).toBe(false);expect(canBurn({a:'a',b:'b'},'c',false)).toBe(false);});
  it('adds new corporate records without overwriting saved edits or user files',()=>{
    const files=loadCorporateFiles({'expenses.csv':'My reconciled expenses','my_notes.md':'Keep this note'});
    expect(files['expenses.csv']).toBe('My reconciled expenses');
    expect(files['my_notes.md']).toBe('Keep this note');
    expect(Object.hasOwn(files,'invoice_register.csv')).toBe(true);
    expect(Object.keys(loadCorporateFiles(null))).toHaveLength(16);
  });
  it('rejects malformed saved corporate records',()=>{
    expect(loadCorporateFiles({'expenses.csv':42})).toEqual(loadCorporateFiles(null));
    expect(loadCorporateFiles(['not a file map'])).toEqual(loadCorporateFiles(null));
  });
});
import { timerMinutes, formatCountdown } from '@/cipher/operative-data';
describe('exfiltration timer', () => {
  it('accepts 5, 10 or 15 minutes and defaults to 10', () => {
    expect(timerMinutes('5')).toBe(5); expect(timerMinutes('15')).toBe(15); expect(timerMinutes('7')).toBe(10); expect(timerMinutes('')).toBe(10);
  });
  it('formats remaining time as mm:ss', () => { expect(formatCountdown(65000)).toBe('01:05'); expect(formatCountdown(-5)).toBe('00:00'); });
});
