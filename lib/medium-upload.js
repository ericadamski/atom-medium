'use babel';

import MediumUploadView from './medium-upload-view';
import { CompositeDisposable } from 'atom';

import { Client } from './client';

const path = require('path');

function getPost() {
  let editor = atom.workspace.getActiveTextEditor();
  return {
    title: editor.getTitle(),
    content: editor.getText(),
  };
};

function getStateAsString (state) {
  switch (state) {
    case Client.WRITTING:
      return `Currently writting post ${getPost().title}`;
    case Client.DRAFTING:
      return `Uploading draft called ${getPost().title}`;
    case Client.POSTING:
      return `Uploading public story called ${getPost().title}`;
    case Client.SUCCESS:
      return `Upload successful!`;
    case Client.FAILURE:
      return `Error Uploading.`;
  }
};

export default {

  config: {
    access_token: { type: 'string' },
    refresh_token: { type: 'string' },
    expires_at: { type: 'integer' },
  },

  mediumUploadView: null,
  modalPanel: null,
  subscriptions: null,

  activate(state) {
    this.mediumUploadView = new MediumUploadView(state.mediumUploadViewState);
    this.modalPanel = atom.workspace.addBottomPanel({
      item: this.mediumUploadView.getElement(),
      visible: false
    });

    // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    this.subscriptions = new CompositeDisposable();

    // Register command that toggles this view
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'medium-upload:toggle': () => this.toggle()
    }));
  },

  deactivate() {
    this.modalPanel.destroy();
    this.subscriptions.dispose();
    this.mediumUploadView.destroy();
  },

  serialize() {
    return {
      mediumUploadViewState: this.mediumUploadView.serialize(),
    };
  },

  toggle() {
    if (path.basename(getPost().title, '.md') === getPost().title)
      return atom.notifications
        .addError('medium-upload : Can only operate on .md file extentions.');

    if (!this.client) this.client = new Client();
    let _this = this;

    this.client.on('user',
      (user) => _this.mediumUploadView
        .updateView(user, getStateAsString(Client.WRITTING)));

    this.mediumUploadView.attachHandlers(this);

    if (this.modalPanel.isVisible())
      this.modalPanel.hide();
    else
      this.modalPanel.show();
  },

  publish() {
    this.mediumUploadView.updateViewState(getStateAsString(Client.POSTING));
    let _this = this;

    let post = getPost();
    this.client
      .publish(post.title, post.content)
      .then(post => {
          _this.mediumUploadView.updateViewState(getStateAsString(Client.SUCCESS));
          atom.notifications
            .addSuccess('Success! Your post is now Public.');
          setTimeout(() => _this.modalPanel.hide(), 2000);
      }, err => {

        _this.mediumUploadView.updateViewState(getStateAsString(Client.FAILURE));
        atom.notifications
          .addError('There was an error making your post public.',
          {
            detail: ((typeof err === 'object') ? JSON.stringify(err) : err.toString()),
          });
        setTimeout(() => _this.modalPanel.hide(), 2000);
      }
    );
  },

  draft() {
    this.mediumUploadView.updateViewState(getStateAsString(Client.DRAFTING));
    let _this = this;

    let post = getPost();
    this.client
      .draft(post.title, post.content)
      .then(post => {
          _this.mediumUploadView.updateViewState(getStateAsString(Client.SUCCESS));
          atom.notifications
            .addSuccess(`Success! Your draft is waiting for you @ ${_this.client.user.url}.`);
          setTimeout(() => _this.modalPanel.hide(), 2000);
      }, err => {

        _this.mediumUploadView.updateViewState(getStateAsString(Client.FAILURE));
        atom.notifications
          .addError('There was an error drafting your post.',
          {
            detail: ((typeof err === 'object') ? JSON.stringify(err) : err.toString()),
          });
        setTimeout(() => _this.modalPanel.hide(), 2000);
      }
    );
  }
};
