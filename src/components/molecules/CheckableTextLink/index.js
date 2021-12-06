/**
 * @format
 * @flow
 */

import React from 'react';
import { Text, View } from 'react-native';
import CheckBox from 'react-native-check-box';

import styles from './checkabletextlink.styl';
import TextLink from '../../atoms/TextLink';

import type { ElementProps } from 'react';

type Link = {
    text: string,
    active: boolean,
    href: () => void,
};

type LinkMap = {
    [key: string]: Link,
};

type Props = {
    ...ElementProps<typeof View>,
    linksMap: LinkMap,
    isChecked: boolean,
    onChecked: () => void,
};

const CheckableTextLink = (props: Props) => {
    const { isChecked, onChecked, children, linksMap } = props;
    if (children === undefined || children === null) {
        throw new Error('children cannot be null or undefined for a checkableTextLink!');
    }

    const content = children.split(/{(\w+)}/gi).map(item => {
        const linkInfo = linksMap[item];
        if (linkInfo !== undefined) {
            return (
                <TextLink key={`${item}`} disabled={!linkInfo.active} href={linkInfo.href}>
                    {linkInfo.text}
                </TextLink>
            );
        }

        // if item is a not whitespace
        if (/\S+/.test(item)) {
            return (
                <Text key={`${item}`} testID={testIDs.textNormal}>
                    {item}
                </Text>
            );
        }

        return null;
    });

    return (
        <View style={styles.checkboxContainer}>
            <CheckBox
                testID="checkbox"
                style={styles.checkbox}
                onClick={onChecked}
                isChecked={isChecked}
                uncheckedCheckBoxColor="#ff00ff"
                checkedCheckBoxColor="#ff00ff"
            />
            <View testID={testIDs.textContainer} style={styles.checkableText}>
                {content}
            </View>
        </View>
    );
};

export const testIDs = {
    textContainer: 'text-container',
    textNormal: 'text-normal',
};

export default CheckableTextLink;
