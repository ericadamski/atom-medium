/* eslint-disable no-undef */

'use babel';

const MediumSDK = require('medium-sdk');
const moment = require('moment');
const { BrowserWindow } = require('electron').remote;
const { EventEmitter } = require('events');

import { Encryption } from './encryption';

const Medium = MediumSDK.MediumClient;
const STATE = 'Dont go in alone!';

const THIS = 'medium-upload';
const EXPIRES = `${THIS}:expires_at`;
const ACCESS = `${THIS}:access_token`;
const REFRESH = `${THIS}:refresh_token`;

export class Authenticate extends EventEmitter {
  constructor() {
    super();

    const client = new Medium({
      clientId: 'e789916f9247',
      clientSecret: '6fd13cdbd973e79c92b161249928a41cd5c9e4e7',
    });

    this.redirectUri = 'http://6tigers.ca/callback/medium';

    this.url = client.getAuthorizationUrl(STATE, this.redirectUri, [
      MediumSDK.Scope.BASIC_PROFILE,
      MediumSDK.Scope.PUBLISH_POST,
    ]);

    this.browser = new BrowserWindow({ show: false });

    this.browser.webContents.on('will-navigate',
      (event, url) => this._handleCallback(url));

    this.browser.webContents.on('did-get-redirect-request',
      (event, oldUrl, newUrl) => this._handleCallback(newUrl));

    this.browser.on('close', () => this.browser = null, false);

    this.on('code', code => this._getToken(code));

    this.client = client;
  }

  now() {
    if (!this._hasToken()) {
      this.browser.loadURL(this.url);
      this.browser.show();
    }

    return new Promise((resolve, reject) => {
      this.on('err', err => reject(err));
      resolve(this);
    });
  }

  _getToken(code) {
    //  XXX: not sure why this doesn't get resolved?
    return new Promise(resolve =>
      this.client.exchangeAuthorizationCode(code, this.redirectUri,
        (err, token) => {
          return (err) ? this.emit('error', err) : this.emit('token', this._storeToken(token));
        })
    );
  }

  _hasToken() {
    if (!atom.config.get(ACCESS)) return false;
    const accessToken = Encryption.decrypt(atom.config.get(ACCESS));

    if (accessToken && !this._isTokenExpired()) {
      this.client.setAccessToken(accessToken);
      this.emit('token', this.accessToken);

      return true;
    }

    if (atom.config.get(REFRESH)) {
      this._refresh();

      return true;
    }

    return false;
  }

  _isTokenExpired() {
    const expires = atom.config.get(EXPIRES);

    if (moment(expires).isSameOrBefore(moment()))
      return true;

    return false;
  }

  _refresh() {
    const refreshToken = Encryption.decrypt(atom.config.get(REFRESH));
    const _this = this;

    return new Promise((resolve, reject) => {
      _this.client.exchangeRefreshToken(refreshToken, (err, token) => {
        if (err) reject(err);
        resolve(_this._storeToken(token));
      });
    });
  }

  _storeToken(token) {
    this.client.setAccessToken(token.access_token);
    atom.config.set(ACCESS, Encryption.encrypt(token.access_token));
    atom.config.set(REFRESH, Encryption.encrypt(token.refresh_token));
    atom.config.set(EXPIRES, token.expires_at);

    return token;
  }

  _handleCallback(url) {
    const rawCode = /code=([^&]*)/.exec(url) || null;
    const code = (rawCode && rawCode.length > 1) ? rawCode[1] : null;
    const error = /\?error=(.+)$/.exec(url);

    if (code || error) this.browser.destroy();

    if (code) this.emit('code', code);
    else if (error) this.emit('error', error);
  }
}
