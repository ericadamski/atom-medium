'use babel';

import React from 'react';
import { render } from 'react-dom';

import Main from './components/main.jsx';

export default class MediumUploadView {
    constructor(serializedState) {
        // Create root element
        this.element = document.createElement('div');
        this.element.classList.add('medium-upload');

        // Mount DOM
        render(<Main />, this.element);
    }

    // Returns an object that can be retrieved when package is activated
    serialize() {}

    // Tear down any state and detach
    destroy() {
        this.element.remove();
    }

    getElement() {
        return this.element;
    }
}
