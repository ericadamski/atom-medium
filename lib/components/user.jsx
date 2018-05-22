'use babel';

import React, { Component } from 'react';
import styled from 'styled-components';

import { user } from '../client';
import Actions from './actions.jsx';

const Container = styled.div`
    display: flex;
`;

const Picture = styled.img`
    max-width: 100%;
`;

const MediumLink = styled.a`
    text-decoration: none;
    display: flex;

    &:hover {
        text-decoration: none;
    }
`;

const ProfilePicture = styled(({ className, src }) => (
    <div className={className}>
        <Picture src={src} />
    </div>
))`
    border-radius: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    width: 6rem;
    height: 6rem;
`;

const NameContainer = styled.div`
    display: flex;
    flex-direction: column;
    padding: 0.5rem;
    justify-content: center;
`;

const Name = styled.span``;

const Username = styled.span`
    font-size: 0.75rem;
`;

export default class User extends Component {
    state = { id: '', imageUrl: '', name: '', url: '', username: '' };

    componentDidMount() {
        user().subscribe(user => this.setState(user));
    }

    render() {
        const { imageUrl, name, username, url } = this.state;

        return (
            <Container>
                <MediumLink href={url}>
                    <ProfilePicture src={imageUrl} />
                    <NameContainer>
                        <Name>{name}</Name>
                        <Username>{username}</Username>
                    </NameContainer>
                </MediumLink>
                <Actions />
            </Container>
        );
    }
}
