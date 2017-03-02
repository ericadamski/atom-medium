# Atom Medium

Write your Medium stories in Atom like a hacker and publish them to directly Medium as a draft or a public story.

![info-bar](https://raw.githubusercontent.com/ericadamski/atom-atom-medium/master/assets/info-bar.png)

## Usage

![menu item](https://raw.githubusercontent.com/ericadamski/atom-atom-medium/master/assets/menu-item.png)

On your first time toggling this package, you will be sent to login to Medium and authorize this package as an application. From then on in, your tokens will be stored in the config file (DO NOT SHARE THESE!). When the token expires, the package automatically fetches a new one, so don't worry about authentication after your first go.

The package currently looks for file names with the `.md` extension, and uses the file name as the post title.

ex. filename 'My-Post.md' story title 'My Post'

## Roadmap

- [ ] Implement Medium like editor inside Atom (without auto rendering)
- [ ] Allow for image upload (when the Medium Node SDK allows for it)
- [ ] Remove boilerplate code
- [ ] Also handle HTML files
- [ ] Tests
- [ ] Check files actually are Markdown / HTML
- [ ] Error handle
- [ ] Allow for more configuration of posts
- [ ] Updates to posts

## Collaborators

@ericadamski
- [Medium](https://medium.com/@ericadamski)
- [Twitter](https://twitter.com/zealigan)

@ChrisChinchilla
- [Medium](https://medium.com/@ChrisChinchilla)
- [Twitter](https://twitter.com/ChrisChinch)

## Development

This repository is for Atom plugin development!
