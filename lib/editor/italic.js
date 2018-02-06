'use babel';

export default function italic(str) {
    return str.replace(/_.*_/, '') === str
        ? `_${str}_`
        : str.replace(/(_)(.*)(_)/, '$2');
}
