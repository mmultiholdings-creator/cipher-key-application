import { describe, expect, it } from 'vitest';
import { loginProfile, canBurn, rotationRemaining } from '../cipher/operative-data';
describe('operative rules',()=>{
  it('requires touch verification before private access',()=>{expect(loginProfile('bLa2vB98P','RESTRICTED145',false)).toBeNull();expect(loginProfile('bLa2vB98P','RESTRICTED145',true)).toBe('private');});
  it('no longer accepts DURESS99 at the second login',()=>{expect(loginProfile('bLa2vB98P','DURESS99',true)).toBeNull();});
  it('rotates the key on a sixty-second cycle',()=>{expect(rotationRemaining(0)).toBe(60);expect(rotationRemaining(59)).toBe(1);expect(rotationRemaining(60)).toBe(60);});
  it('never burns a missing, last, or locked file',()=>{expect(canBurn({a:'a',b:'b'},'a',false)).toBe(true);expect(canBurn({a:'a'},'a',false)).toBe(false);expect(canBurn({a:'a',b:'b'},'a',true)).toBe(false);expect(canBurn({a:'a',b:'b'},'c',false)).toBe(false);});
});