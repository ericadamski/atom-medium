'use babel';

import { curry, range } from 'ramda';

const header = curry(function header(depth, str) {
    return str.charAt(0) !== '#'
        ? `${range(0, depth)
              .map(() => '#')
              .join('')} ${str}`
        : str.replace(/[#]+ /, '').trim();
});

export default header;
