'use babel';

import React, { Component } from 'react';
import styled from 'styled-components';

const Message = styled.h4`
    padding: 1rem 0;
    margin: 0;
`;

export default class Status extends Component {
    state = { post: 'Untitled' };

    componentDidMount() {
        const editor = atom.workspace.getActiveTextEditor();

        atom.workspace.onDidChangeActiveTextEditor(
            editor => editor && this.setState({ post: editor.getTitle() })
        );

        editor.onDidChangeTitle(title => this.setState({ post: title }));

        this.setState({ post: editor.getTitle() });
    }

    render() {
        return <Message>Currently writting post - {this.state.post}</Message>;
    }
}
