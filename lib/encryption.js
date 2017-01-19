'use babel';

const crypto = require('crypto');
const algorithm = 'aes-256-ctr';
const password = 'aksiFIdm38';

export class Encryption {
  static encrypt(value) {
    const cipher = crypto.createCipher(algorithm, password);
    const crypted = cipher.update(value, 'utf8', 'hex');

    return (crypted + cipher.final('hex'));
  }

  static decrypt(value) {
    const decipher = crypto.createDecipher(algorithm, password);
    const dec = decipher.update(value, 'hex', 'utf8');

    return (dec + decipher.final('utf8'));
  }
}
