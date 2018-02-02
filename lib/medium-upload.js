'use babel';

import MediumUploadView from './medium-upload-view';
import { CompositeDisposable } from 'atom';

export default {
    config: {
        access_token: { type: 'string', default: '' },
        refresh_token: { type: 'string', default: '' },
        expires_at: { type: 'integer', default: 0 },
    },

    mediumUploadView: null,
    panel: null,
    subscriptions: null,

    activate(state) {
        this.mediumUploadView = new MediumUploadView(
            state.mediumUploadViewState
        );

        this.panel = atom.workspace.addBottomPanel({
            item: this.mediumUploadView.getElement(),
            visible: false,
        });

        // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
        this.subscriptions = new CompositeDisposable();

        // Register command that toggles this view
        this.subscriptions.add(
            atom.commands.add('atom-workspace', {
                'medium-upload:toggle': () => this.toggle(),
            })
        );
    },

    deactivate() {
        this.panel.destroy();
        this.subscriptions.dispose();
        this.mediumUploadView.destroy();
    },

    serialize() {
        return {
            mediumUploadViewState: this.mediumUploadView.serialize(),
        };
    },

    toggle() {
        return this.panel.isVisible() ? this.panel.hide() : this.panel.show();
    },
};
