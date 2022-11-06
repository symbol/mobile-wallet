import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { StyleSheet } from 'react-native';
import { Row, Text, Trunc } from '@src/components';
import translate from '@src/locales/i18n';
import GlobalStyles from '../../styles/GlobalStyles';

const styles = StyleSheet.create({
    labelBlocked: {
        fontSize: 8,
        lineHeight: 8,
        borderRadius: 7,
        backgroundColor: GlobalStyles.color.RED,
        textTransform: 'uppercase',
        color: GlobalStyles.color.WHITE,
        paddingTop: 3,
        paddingBottom: 1,
        paddingHorizontal: 5,
        marginRight: 5,
    },
    addressBlocked: {
        color: GlobalStyles.color.RED,
    },
});

export const AddressDisplay = props => {
    const { children, addressBook, currentAddress, plain, style, theme, trunc } = props;
    const contact = addressBook.getContactByAddress(children);
    let truncType = trunc && 'address';
    let isBlocked = false;
    let textString = children;
    let prefixTextString = '';
    let suffixTextString = '';

    if (!plain && currentAddress === children) {
        prefixTextString = `${translate('unsortedKeys.currentAddress')} (`;
        suffixTextString = ')';
        truncType = trunc && 'address-short';
    } else if (!plain && contact) {
        isBlocked = contact.isBlackListed;
        textString = contact.name;
        truncType = trunc && 'contact';
    } else if (contact) {
        isBlocked = contact.isBlackListed;
    }

    if (isBlocked && textString.length === 0) {
        textString = translate('addressBook.addressBlocked');
    }

    const textStyle = [isBlocked ? styles.addressBlocked : {}, style];

    return (
        <Row align="center">
            {isBlocked && (
                <Text type="bold" style={styles.labelBlocked}>
                    !
                </Text>
            )}
            <Text style={textStyle} theme={theme} testID="text-display">
                {prefixTextString}
                <Trunc type={truncType} length={textString.length}>
                    {textString}
                </Trunc>
                {suffixTextString}
            </Text>
        </Row>
    );
};

AddressDisplay.propsTypes = {
    children: PropTypes.string.isRequired,
    plain: PropTypes.bool,
    style: PropTypes.object,
    theme: PropTypes.oneOf(['light', 'dark']),
    trunc: PropTypes.bool,
};

export default connect(state => ({
    addressBook: state.addressBook.addressBook,
    currentAddress: state.account.selectedAccountAddress,
}))(AddressDisplay);
