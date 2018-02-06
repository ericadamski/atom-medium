'use babel';

import link from '../lib/editor/link';

describe('.link', () => {
    it('should be a function with arity 1', () => {
        // Assert
        expect(typeof link).toBe('function');
        expect(link.length).toEqual(1);
    });

    it('it should return a markdown link string', () => {
        // Arrange
        const str = 'sandwich';
        const expectedStr = `[${str}]()`;

        // Act
        const result = link(str);

        // Assert
        expect(result).toEqual(expectedStr);
    });

    it('should unlink if the text is already link', () => {
        // Arrange
        const expectedStr = 'sandwich';
        const str = `[${expectedStr}](http://google.ca)`;

        // Act
        const result = link(str);

        // Assert
        expect(result).toEqual(expectedStr);
    });

    it('should unlink if the text is already link, but empty', () => {
        // Arrange
        const expectedStr = 'sandwich';
        const str = `[${expectedStr}]()`;

        // Act
        const result = link(str);

        // Assert
        expect(result).toEqual(expectedStr);
    });
});
