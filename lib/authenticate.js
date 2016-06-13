'use babel';

const MediumSDK = require('medium-sdk');
const moment = require('moment');
const { BrowserWindow } = require('electron').remote;
const { EventEmitter } = require('events');

import { Encryption } from './encryption';

const Medium = MediumSDK.MediumClient;
const STATE = 'Dont go in alone!';

const EXPIRES = 'expires_at';
const ACCESS = 'access_token';
const REFRESH = 'refresh_token';

export class Authenticate extends EventEmitter {
  constructor () {
    super();

    let client = new Medium({
      clientId: 'b8edd2dfb982',
      clientSecret: 'cc408c1033152cdcd977adc05193f1e7acdad5bb',
    });

    this.redirectUri = 'http://6tigers.ca/callback/medium';

    this.url = client.getAuthorizationUrl(STATE, this.redirectUri, [
      MediumSDK.Scope.BASIC_PROFILE,
      MediumSDK.Scope.PUBLISH_POST,
    ]);

    if (!this._hasToken())
    {
      this.browser = new BrowserWindow({ show: false });

      let _this = this;

      this.browser.webContents.on('will-navigate',
        (event, url) => _this._handleCallback(url));

      this.browser.webContents.on('did-get-redirect-request',
        (event, oldUrl, newUrl) => _this._handleCallback(newUrl));

      this.browser.on('close', () => _this.browser = null, false);
    }

    this.client = client;
  }

  now () {
    this.browser.loadURL(this.url);
    this.browser.show();

    let _this = this;

    return new Promise((resolve, reject) => {
      _this.on('err', (err) => reject(err));
      _this.on('code', (code) => _this._getToken(code));
      _this.on('token', (token) => resolve(token));
    });
  }

  client () { return this.client; }

  _getToken (code) {
    let _this = this;
    return new Promise((resolve, reject) =>
      _this.client.exchangeAuthorizationCode(code, _this.redirectUri,
        (err, token) =>
          (err) ? _this.emit('error', err) : _this.emit('token', _this._storeToken(token)))
    );
  }

  _hasToken () {
    if (!atom.config.get(ACCESS)) return false;
    let accessToken = Encryption.decrypt(atom.config.get(ACCESS));

    if (accessToken && !this._isTokenExpired())
    {
      this.accessToken = accessToken;
      _this.emit('token', this.accessToken);
      return true;
    }

    if (atom.config.get(REFRESH))
    {
      this._refresh();
      return true;
    }

    return false;
  }

  _isTokenExpired () {
    let expires = atom.config.get(EXPIRES);

    if (moment(expires).isSameOrAfter(moment()))
      return true;

    return false;
  }

  _refresh () {
    let refreshToken = Encryption.decrypt(atom.config.get(REFRESH));
    return this._getToken(refreshToken);
  }

  _storeToken (token) {
    this.accessToken = token.access_token;
    atom.config.set(ACCESS, Encryption.encrypt(token.access_token));
    atom.config.set(REFRESH, Encryption.encrypt(token.refresh_token));
    atom.config.set(EXPIRES, token.expires_at);
    return token;
  }

  _handleCallback (url) {
    let rawCode = /code=([^&]*)/.exec(url) || null;
    let code = (rawCode && rawCode.length > 1) ? rawCode[1] : null;
    let error = /\?error=(.+)$/.exec(url);

    if (code || error) this.browser.destroy();

    if (code) this.emit('code', code);
    else if (error) this.emit('error', error);
  }
};
