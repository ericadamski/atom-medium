'use babel';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/bindNodeCallback';
import 'rxjs/add/observable/fromPromise';
import 'rxjs/add/operator/switchMap';

import { PostPublishStatus, PostContentFormat } from 'medium-sdk';

import { authenticate } from './authenticate';

export function user() {
    return authenticate().switchMap(client =>
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
        Observable.bindNodeCallback(client.createPost)({
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
