import React from 'react';
import { render } from '@testing-library/react-native';
import Trunc from '../../src/components/organisms/Trunc';

describe('components/Trunc', () => {
    const runTruncTest = (content, type, length, expectedResult) => {
        // Arrange:
        const props = {
            type,
            length,
        };

        // Act:
        const screen = render(<Trunc {...props}>{content}</Trunc>);
        const result = screen.baseElement.children[0].children[0];

        // Assert:
        expect(result).toBe(expectedResult);
    };

    describe('children prop is not a string', () => {
        // Arrange:
        const type = null;
        const length = 6;

        test('render empty string', () => {
            // Arrange:
            const content = 123;

            // Act + Assert:
            const expectedResult = '';
            runTruncTest(content, type, length, expectedResult);
        });
    });

    describe('custom type', () => {
        // Arrange:
        const type = null;
        const length = 6;

        test('render full string when its length is equal to length prop', () => {
            // Arrange:
            const content = '123456';

            // Act + Assert:
            const expectedResult = '123456';
            runTruncTest(content, type, length, expectedResult);
        });

        test('render truncated string when its length is greater than length prop', () => {
            // Arrange:
            const content = '12345678';

            // Act + Assert:
            const expectedResult = '123456...';
            runTruncTest(content, type, length, expectedResult);
        });
    });

    describe('defined types', () => {
        // Arrange:
        const length = null;
        const tests = [
            {
                type: 'address',
                content: 'TCHBDENCLKEBILBPWP3JPB2XNY64OE7PYHHE32I',
                expectedResult: 'TCHBDE...32I',
            },
            {
                type: 'address-short',
                content: 'TCHBDENCLKEBILBPWP3JPB2XNY64OE7PYHHE32I',
                expectedResult: '...32I',
            },
            {
                type: 'address-long',
                content: 'TCHBDENCLKEBILBPWP3JPB2XNY64OE7PYHHE32I',
                expectedResult: 'TCHBDENCLKEB...4OE7PYHHE32I',
            },
            {
                type: 'contact',
                content: 'Lorem ipsum dolor sit amet',
                expectedResult: 'Lorem ipsum dolor ...',
            },
            {
                type: 'contact-short',
                content: 'Lorem ipsum dolor sit amet',
                expectedResult: 'Lorem ipsum ...',
            },
            {
                type: 'contact-short',
                content: 'Lorem',
                expectedResult: 'Lorem',
            },
            {
                type: 'mosaicId',
                content: '0DB681FF69C40D36',
                expectedResult: '0DB681...C40D36',
            },
            {
                type: 'namespaceName',
                content: 'namespace',
                expectedResult: 'namespace',
            },
            {
                type: 'namespaceName',
                content: 'large.naaaaamespacename',
                expectedResult: 'large.naaa...espacename',
            },
        ];

        test('render string depending on its length and type prop', () => {
            // Act + Assert:
            tests.forEach(test => runTruncTest(test.content, test.type, length, test.expectedResult));
        });
    });
});
