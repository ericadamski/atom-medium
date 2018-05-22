'use babel';

import italic from '../lib/editor/italic';

describe('.italic', () => {
    it('should be a function with arity 1', () => {
        // Assert
        expect(typeof italic).toBe('function');
        expect(italic.length).toEqual(1);
    });

    it('it should return a markdown italic string', () => {
        // Arrange
        const str = 'sandwich';
        const expectedStr = `_${str}_`;

        // Act
        const result = italic(str);

        // Assert
        expect(result).toEqual(expectedStr);
    });

    it('should unitalic if the text is already italic', () => {
        // Arrange
        const expectedStr = 'sandwich';
        const str = `_${expectedStr}_`;

        // Act
        const result = italic(str);

        // Assert
        expect(result).toEqual(expectedStr);
    });
});
