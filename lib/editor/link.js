'use babel';

export default function link(str) {
    return str.replace(/[.*](.*)/, '') === str
        ? `[${str}]()`
        : str.replace(/\[(.*)\]\(.*\)/, '$1');
}
