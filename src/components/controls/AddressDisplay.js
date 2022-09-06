import React from 'react';
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
});

const AddressDisplay = props => {
    const { children, addressBook, currentAddress, showRaw, style, theme, trunc } = props;
    const contact = addressBook.getContactByAddress(children);
    let truncType = trunc && 'address';
    let isBlocked = false;
    let textString = children;
    let prefixTextString = '';
    let suffixTextString = '';

    if (!showRaw && currentAddress === children) {
        prefixTextString = `${translate('unsortedKeys.currentAddress')} (`;
        suffixTextString = ')';
        truncType = trunc && 'address-short';
    } else if (!showRaw && contact) {
        isBlocked = contact.isBlackListed;
        textString = contact.name;
        truncType = trunc && 'contact';
    }

    return (
        <Row align="center">
            {isBlocked && (
                <Text type="bold" style={styles.labelBlocked}>
                    {translate('addressBook.addressBlocked')}
                </Text>
            )}
            <Text style={style} theme={theme}>
                {prefixTextString}
                <Trunc type={truncType} length={textString.length}>
                    {textString}
                </Trunc>
                {suffixTextString}
            </Text>
        </Row>
    );
};

export default connect(state => ({
    addressBook: state.addressBook.addressBook,
    currentAddress: state.account.selectedAccountAddress,
}))(AddressDisplay);
