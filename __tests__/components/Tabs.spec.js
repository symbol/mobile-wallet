import React from 'react';
import { fireEvent, render } from '@testing-library/react-native';
import { StyleSheet } from 'react-native';
import Tabs from '@src/components/controls/Tabs';
import GlobalStyles from '@src/styles/GlobalStyles';

describe('components/Tabs', () => {
    // Arrange:
    const list = [
        {
            label: 'Tab 1',
            value: 1,
        },
        {
            label: 'Tab 2',
            value: 2,
        },
    ];
    const value = 1;
    const style = {
        backgroundColor: '#f00',
    };
    const testID = 'tabs';

    test('renders component', () => {
        // Arrange:
        const props = {
            list,
            value,
            style,
        };

        // Act:
        const screen = render(<Tabs testID={testID} {...props} />);
        const tabsElement = screen.getByTestId(testID);
        const selectedTabElement = screen.getByText('Tab 1').parent.parent.parent.parent;
        const notSelectedTabElement = screen.getByText('Tab 2').parent.parent.parent.parent;
        const tabsElementStyle = StyleSheet.flatten(tabsElement.props.style);
        const selectedTabElementStyle = StyleSheet.flatten(selectedTabElement.props.style);
        const notSelectedTabElementStyle = StyleSheet.flatten(notSelectedTabElement.props.style);

        // Assert:
        expect(tabsElementStyle).toHaveProperty('backgroundColor');
        expect(tabsElementStyle.backgroundColor).toBe('#f00');
        expect(selectedTabElementStyle).toHaveProperty('borderBottomColor');
        expect(selectedTabElementStyle.borderBottomColor).toBe(GlobalStyles.color.PINK);
        expect(notSelectedTabElementStyle).not.toHaveProperty('borderBottomColor');
    });

    test('emits onChange event when press on tab', () => {
        // Arrange:
        const mockOnChange = jest.fn();
        const props = {
            list,
            value,
            style,
            onChange: mockOnChange,
        };

        // Act:
        const screen = render(<Tabs testID={testID} {...props} />);
        const tabElement = screen.getByText('Tab 2');
        fireEvent.press(tabElement);

        // Assert:
        expect(mockOnChange).toBeCalledWith(2);
    });
});
