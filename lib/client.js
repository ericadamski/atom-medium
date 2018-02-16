'use babel';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/bindNodeCallback';
import 'rxjs/add/observable/fromPromise';
import 'rxjs/add/operator/switchMap';

import { PostPublishStatus, PostContentFormat } from 'medium-sdk';

import { authenticate } from './authenticate';

let _client;

export function user() {
    return authenticate()
        .do(client => (_client = client))
        .switchMap(client =>
            Observable.fromPromise(
                new Promise((resolve, reject) =>
                    client.getUser(
                        (err, user) => (err ? reject(err) : resolve(user))
                    )
                )
            )
        );
}

export function publish(title, content, draft = false) {
    return user().switchMap(({ id: userId }) =>
        Observable.fromPromise(
            new Promise((resolve, reject) =>
                _client.createPost(
                    {
                        userId,
                        title,
                        content,
                        publishStatus: draft
                            ? PostPublishStatus.DRAFT
                            : PostPublishStatus.PUBLIC,
                        contentFormat: PostContentFormat.MARKDOWN,
                    },
                    (err, post) => (err ? reject(err) : resolve(post))
                )
            )
        )
    );
}
