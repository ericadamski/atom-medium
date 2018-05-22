'use babel';

import bold from '../lib/editor/bold';

describe('.bold', () => {
    it('should be a function with arity 1', () => {
        // Assert
        expect(typeof bold).toBe('function');
        expect(bold.length).toEqual(1);
    });

    it('it should return a markdown bolded string', () => {
        // Arrange
        const str = 'sandwich';
        const expectedStr = `__${str}__`;

        // Act
        const result = bold(str);

        // Assert
        expect(result).toEqual(expectedStr);
    });

    it('should unbold if the text is already bold', () => {
        // Arrange
        const expectedStr = 'sandwich';
        const str = `__${expectedStr}__`;

        // Act
        const result = bold(str);

        // Assert
        expect(result).toEqual(expectedStr);
    });
});
