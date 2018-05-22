'use babel';

import header from '../lib/editor/header';

describe('.header', () => {
    it('should be a function with arity 1', () => {
        // Assert
        expect(typeof header).toBe('function');
        expect(header.length).toEqual(2);
    });

    it('it should return a markdown header string', () => {
        // Arrange
        const str = 'this should be a line sandwich';
        const expectedStr = `# ${str}`;

        // Act
        const result = header(1, str);

        // Assert
        expect(result).toEqual(expectedStr);
    });

    it('it should return a markdown header (2) string', () => {
        // Arrange
        const str = 'this should be a line sandwich';
        const expectedStr = `## ${str}`;

        // Act
        const result = header(2, str);

        // Assert
        expect(result).toEqual(expectedStr);
    });

    it('should unheader if the line is already a header', () => {
        // Arrange
        const expectedStr = 'this should be a line sandwich';
        const str = `## ${expectedStr}`;

        // Act
        const result = header(1, str);

        // Assert
        expect(result).toEqual(expectedStr);
    });
});
