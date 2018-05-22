'use babel';

export default function bold(str) {
    return str.replace(/__.*__/, '') === str ? `__${str}__` : str.replace(/(__)(.*)(__)/, '$2');
}
