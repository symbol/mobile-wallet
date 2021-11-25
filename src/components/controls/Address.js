import React, { Component } from 'react';
import { Text } from 'react-native';
import GlobalStyles from '../../styles/GlobalStyles';
import { Address } from 'symbol-sdk';
import { connect } from 'react-redux';

type Type = 'title' | 'title-small' | 'subtitle' | 'alert' | 'bold';

type Align = 'left' | 'center' | 'right';

type Theme = 'light' | 'dark';

interface Props {
    type: Type;
    align: Align;
    theme: Theme;
}

type State = {};

class AddressComponent extends Component<Props, State> {
    render() {
        const {
            children,
            type,
            style = {},
            align,
            theme,
            addressBook,
        } = this.props;
        let globalStyle = {};
        const address = Address.createFromRawAddress(children);
        let addressChange = children.slice(0, 13) + '...';
        addressBook.getAllContacts().map(contact => {
            if (address.address === contact.address) {
                addressChange = contact.name;
                if (addressChange.length > 16)
                    addressChange = contact.name.slice(0, 16) + '...';
            }
        });

        switch (type) {
            case 'title':
                globalStyle = { ...GlobalStyles.text.title };
                break;
            case 'subtitle':
                globalStyle = { ...GlobalStyles.text.subtitle };
                break;
            case 'alert':
                globalStyle = { ...GlobalStyles.text.alert };
                break;
            case 'bold':
                globalStyle = { ...GlobalStyles.text.bold };
                break;
            case 'regular':
                globalStyle = { ...GlobalStyles.text.regular };
                break;
            case 'title-small':
                globalStyle = { ...GlobalStyles.text.titleSmall };
                break;
        }

        if (typeof align === 'string') globalStyle.textAlign = align;

        if (theme === 'light')
            globalStyle.color = GlobalStyles.color.onLight.TEXT;
        else globalStyle.color = GlobalStyles.color.onDark.TEXT;

        return <Text style={[globalStyle, style]}>{addressChange}</Text>;
    }
}

export default connect(state => ({
    addressBook: state.addressBook.addressBook,
}))(AddressComponent);
