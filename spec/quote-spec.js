'use babel';

import quote from '../lib/editor/quote';

describe('.quote', () => {
    it('should be a function with arity 1', () => {
        // Assert
        expect(typeof quote).toBe('function');
        expect(quote.length).toEqual(1);
    });

    it('it should return a markdown quote string', () => {
        // Arrange
        const str = 'this should be a line sandwich';
        const expectedStr = `> ${str}`;

        // Act
        const result = quote(str);

        // Assert
        expect(result).toEqual(expectedStr);
    });

    it('should unquote if the line is already a quote', () => {
        // Arrange
        const expectedStr = 'this should be a line sandwich';
        const str = `> ${expectedStr}`;

        // Act
        const result = quote(str);

        // Assert
        expect(result).toEqual(expectedStr);
    });
});
