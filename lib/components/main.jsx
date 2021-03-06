'use babel';

import React, { Component } from 'react';
import styled from 'styled-components';

import User from './user.jsx';
import Status from './status.jsx';

const Container = styled.div`
    max-height: 10rem;
    padding: 0.5rem;
    display: flex;
    flex-direction: column;
    justify-content: center;
`;

const StatusContainer = styled.div``;

export default class Main extends Component {
    render() {
        return (
            <Container>
                <Status />
                <User />
            </Container>
        );
    }
}
