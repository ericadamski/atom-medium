'use babel';

import MediumUploadView from './medium-upload-view';
import { CompositeDisposable } from 'atom';
import Client from './client';

function getPost() {
  let editor = atom.workspace.getActiveTextEditor();
  return {
    title: editor.gitTitle(),
    content: editor.getText(),
  };
}

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
    this.modalPanel = atom.workspace.addModalPanel({
      item: this.mediumUploadView.getElement(),
      visible: false,
    });

    // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    this.subscriptions = new CompositeDisposable();

    // Register command that toggles this view
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'medium-upload:publish': () => this.publish(),
      'medium-upload:draft': () => this.draft(),
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

  publish() {
    if (!this.client) this.client = new Client();
    let _this = this;

    let post = getPost();

    client.on('user', (user) => {
      _this.mediumUploadView.setUser(user, 'public');
      _this.modalPanel.show();
      _this.client
        .publish(post.title, post.content)
        .then(post => {
            _this.modalPanel.hide();
            atom.notifications
              .addSuccess('Success! Your post is now Public.');
          }, err => {

            _this.modalPanel.hide();
            atom.notifications
              .addError('There was an error making your post public.',
              {
                detail: ((typeof err === 'object') ? JSON.stringify(err) : err.toString()),
              });
          }
      );
    });
  },

  draft() {
    if (!this.client) this.client = new Client();
    let _this = this;

    let post = getPost();

    client.on('user', (user) => {
      _this.mediumUploadView.setUser(user, 'draft');
      _this.modalPanel.show();
      _this.client
        .publish(post.title, post.content)
        .then(post => {
            _this.modalPanel.hide();
            atom.notifications
              .addSuccess('Success! Your post is now a draft.');
          }, err => {

            _this.modalPanel.hide();
            atom.notifications
              .addError('There was an error creating your draft.',
              {
                detail: ((typeof err === 'object') ? JSON.stringify(err) : err.toString()),
              });
          }
      );
    });
  },

};
