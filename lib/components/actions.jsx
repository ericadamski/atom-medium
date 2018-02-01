'use babel';

import React from 'react';
import styled from 'styled-components';
import path from 'path';
import { compose, map, join, split, replace } from 'ramda';

import { publish } from '../client';

const Container = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
`;

const ActionButton = styled.button.attrs({ className: 'btn' })`
    min-width: 6rem;
    margin: 0.25rem;
`;

const EXTS = { MD: '.md' };

const capitalize = str => `${str.charAt(0).toUpperCase()}${str.substr(1)}`;

const perparePostTitle = compose(
    join(' '),
    map(capitalize),
    split('.'),
    replace(/([^a-zA-Z0-9])+/g, '.')
);

function canPublish(editor) {
    const title = editor.getTitle();

    return isMarkdown(title);
}

function isMarkdown(title) {
    const sansExtension = path.basename(title, '.md');

    return title !== sansExtension;
}

function getTitle(editor) {
    return perparePostTitle(path.basename(editor.getTitle(), '.md'));
}

function getContent(editor) {
    return editor.getText();
}

function post(draft = true) {
    return () => {
        const editor = atom.workspace.getActiveTextEditor();

        if (canPublish(editor)) {
            return console.log({
                draft,
                title: getTitle(editor),
                content: getContent(editor),
            });
        }

        atom.notifications.addError(
            `Refusing to upload a non markdown file to Medium©.`
        );
    };
}

const Actions = () => (
    <Container>
        <ActionButton onClick={post()}>Draft</ActionButton>
        <ActionButton onClick={post(false)}>Publish</ActionButton>
    </Container>
);

export default Actions;
