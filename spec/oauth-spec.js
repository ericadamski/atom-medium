'use babel';

import { Authenticate } from '../lib/authenticate';

describe('Authentication', () => {
  var auth;

  // jasmine.getEnv().defaultTimeoutInterval = 40000;

  beforeEach(() => auth = new Authenticate());

  it('should open a browser window and authenticate', () => {
    waitsForPromise(() =>
      auth.now()
        .then(token => expect(token).not.toBe(null),
        err => expect(err).not.toBe(null)));
  });
});
