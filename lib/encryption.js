'use babel';

const crypto = require('crypto');
const algorithm = 'aes-256-ctr';
const password = 'aksiFIdm38';

export class Encryption {
  static encrypt (value) {
    let cipher = crypto.createCipher(algorithm, password);
    let crypted = cipher.update(value, 'utf8', 'hex');
    return (crypted + cipher.final('hex'));
  }

  static decrypt (value) {
    let decipher = crypto.createDecipher(algorithm, password);
    let dec = decipher.update(value, 'hex', 'utf8');
    return (dec + decipher.final('utf8'));
  }
};
