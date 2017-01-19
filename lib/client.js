'use babel';

import { Authenticate } from './authenticate';

const { EventEmitter } = require('events');
const MediumSDK = require('medium-sdk');

export class Client extends EventEmitter {
  constructor() {
    super();

    this.WRITTING = 0;
    this.DRAFTING = 1;
    this.POSTING  = 2;
    this.SUCCESS  = 3;
    this.FAILURE  = 4;
    this.auth = new Authenticate();

    this.auth.on('token', () => {
      this.me().then(user => {
        this.user = user;
        this.emit('user', user);
      });
    });

    this.auth.now();
  }

  publish(title, content) {
    return this._doPost(title, content, MediumSDK.PostPublishStatus.PUBLIC);
  }

  draft(title, content) {
    return this._doPost(title, content, MediumSDK.PostPublishStatus.DRAFT);
  }

  me() {
    return new Promise((resolve, reject) =>
      this.auth.client
        .getUser((err, user) => { (err) ? reject(err) : resolve(user); }));
  }

  _doPost(title, content, type) {
    return new Promise((resolve, reject) =>
      this.auth.client
        .createPost({
          userId: this.user.id,
          title: title,
          contentFormat: MediumSDK.PostContentFormat.MARKDOWN,
          content: content,
          publishStatus: type,
        }, (err, post) => { (err) ? reject(err) : resolve(post); }));
  }
}
