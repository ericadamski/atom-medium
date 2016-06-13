'use babel';

import { Encryption } from '../lib/encryption';

describe('Encryption', () => {
  let e;
  it('should be able to encrypt', () => {
    e = Encryption.encrypt('Hello');
    expect(e).not.toBe(null);
  });
  it('should be able to encrypt', () => {
    expect(Encryption.decrypt(e)).toBe('Hello');
  });
});
