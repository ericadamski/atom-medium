'use babel';

export default function quote(str) {
    return str.charAt(0) !== '>' ? `> ${str}` : str.substr(1).trim();
}
