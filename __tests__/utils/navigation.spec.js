import { Router } from '@src/Router';
import { createGoBack } from '@src/utils/navigation';

const mockGoBack = jest.fn();

beforeEach(() => {
    Router.goBack = mockGoBack;
    mockGoBack.mockClear();
});

describe('utils/navigation', () => {
    describe('createGoBack()', () => {
        test('creates a function which navigates to previous screen', () => {
            // Arrange:
            const componentId = 12;

            // Act:
            createGoBack(componentId)();

            // Assert:
            expect(mockGoBack).toBeCalledWith(componentId);
        });
    });
});
