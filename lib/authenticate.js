'use babel';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/empty';
import 'rxjs/add/observable/of';

import { config } from 'atom';
import moment from 'moment';
import MediumSDK from 'medium-sdk';
import { remote } from 'electron';

import { Encryption } from './encryption';

const Medium = MediumSDK.MediumClient;
const STATE = 'Dont go in alone!';

const THIS = 'medium-upload';
const EXPIRES = `${THIS}:expires_at`;
const ACCESS = `${THIS}:access_token`;
const REFRESH = `${THIS}:refresh_token`;

const CLIENT = new Medium({
    clientId: 'e789916f9247',
    clientSecret: '6fd13cdbd973e79c92b161249928a41cd5c9e4e7',
});

const REDIRECT_URI = 'http://6tigers.ca/callback/medium';

function tokenIsExpired() {
    return moment(config.get(EXPIRES)).isSameOrBefore(moment());
}

function refreshToken() {
    return Observable.bindCallback(CLIENT, exchangeRefreshToken)(
        Encryption.decrypt(config.get(REFRESH))
    );
}

function hasToken() {
    const token = config.get(ACCESS);

    if (!token) return Observable.empty();

    const accessToken = Encryption.decrypt(token);

    if (accessToken && !tokenIsExpired()) {
        CLIENT.setAccessToken(accessToken);

        return Observable.of(accessToken);
    }

    if (config.get(REFRESH)) {
        const token$ = refreshToken();

        storeToken(token$);

        return token$;
    }

    return Observable.empty();
}

function openBrowser() {
    const URL = CLIENT.getAuthorizationUrl(STATE, REDIRECT_URI, [
        MediumSDK.Scope.BASIC_PROFILE,
        MediumSDK.Scope.PUBLISH_POST,
    ]);

    const { webContents } = (browser = new remote.BrowserWindow({
        show: false,
    }));

    browser.loadURL(URL).show();

    return Observable.fromEvent('will-navigate', webContents)
        .merge(Observable.fromEvent('did-get-redirect-request', webContents))
        .map((event, url) => {
            const rawCode = /code=([^&]*)/.exec(url) || null;
            const code = rawCode && rawCode.length > 1 ? rawCode[1] : null;
            const error = /\?error=(.+)$/.exec(url);

            if (code || error) browser.destroy();

            if (code) return code;
            else if (error) throw new Error(error);
        });
}

function storeToken(token$) {
    token$.subscribe(({ access_token, refresh_token, expires_at }) => {
        CLIENT.setAccessToken(access_token);
        config.set(ACCESS, Encryption.encrypt(access_token));
        config.set(REFRESH, Encryption.encrypt(refresh_token));
        config.set(EXPIRES, expires_at);
    });
}

export function authenticate() {
    return hasToken().switchMap(
        token =>
            !token
                ? openBrowser().switchMap(code => {
                      const token$ = Observable.bindCallback(
                          CLIENT,
                          exchangeAuthorizationCode
                      )(code, REDIRECT_URI);

                      storeToken(token$);

                      return token$;
                  })
                : token
    ).mapTo(CLIENT);
}
