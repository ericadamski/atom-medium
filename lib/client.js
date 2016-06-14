'use babel';

import { Authenticate } from './authenticate';

const { EventEmitter } = require('events');
const MediumSDK = require('medium-sdk');

export class Client extends EventEmitter {
  constructor () {
    super();

    this.WRITTING = 0;
    this.DRAFTING = 1;
    this.POSTING  = 2;
    this.SUCCESS  = 3;
    this.FAILURE  = 4;

    let _this = this;
    this.auth = new Authenticate();

    this.auth.on('token', (token) => {
      _this.me().then(user => {
        _this.user = user;
        _this.emit('user', user);
      });
    });

    this.auth.now()
      .then(auth => console.log(auth), err => console.log(err));
  }

  publish (title, content) {
    return this._doPost(title, content, MediumSDK.PostPublishStatus.PUBLIC);
  }

  draft (title, content) {
    return this._doPost(title, content, MediumSDK.PostPublishStatus.DRAFT);
  }

  me () {
    let _this = this;
    return new Promise((resolve, reject) =>
      _this.auth.client
        .getUser((err, user) => (err) ? reject(err) : resolve(user)));
  }

  _doPost (title, content, type) {
    let _this = this;
    return new Promise((resolve, reject) =>
      _this.auth.client
        .createPost({
          userId: _this.user.id,
          title: title,
          contentFormat: MediumSDK.PostContentFormat.MARKDOWN,
          content: content,
          publishStatus: type,
        }, (err, post) => (err) ? reject(err) : resolve(post)));
  }
};
