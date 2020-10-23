/**
 * @format
 * @flow
 */
import React, { PureComponent } from 'react';
import { View } from 'react-native';

import type { ElementProps } from 'react';

import styles from './card.styl';

type Props = ElementProps<typeof View>;

class Card extends PureComponent<Props> {
  render() {
    const { children, style } = this.props;
    return <View style={[styles.card, style]}>{children}</View>;
  }
}

export default Card;
