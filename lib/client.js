'use babel';

import { PostPublishStatus, PostContentFormat } from 'medium-sdk';

import { authenticate } from './authenticate';

export function user() {
    return authenticate().switchMap(client =>
        Observable.bindNodeCallback(client, getUser)()
    );
}

export function publish(title, content, draft = false) {
    return user().switchMap(({ id: userId }) =>
        Observable.bindNodeCallback(client, createPost)({
            userId,
            title,
            content,
            publishStatus: draft
                ? PostPublishStatus.DRAFT
                : PostPublishStatus.PUBLIC,
            contentFormat: PostContentFormat.MARKDOWN,
        })
    );
}
