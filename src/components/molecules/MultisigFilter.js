import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Dropdown, Trunc } from '@src/components';
import translate from '@src/locales/i18n';

function MultisigFilter(props) {
    const { cosignatoryOf, selectedAccountAddress, value, style, theme, onChange } = props;

    const list = [
        {
            value: selectedAccountAddress,
            label: translate('unsortedKeys.currentAccount'),
        },
        ...cosignatoryOf.map(address => ({
            value: address,
            // notranslate
            label: `Multisig (${Trunc({ type: 'address-short', children: address })})`,
        })),
    ];

    return (
        <Dropdown list={list} title={translate('history.accountFilter')} value={value} style={style} theme={theme} onChange={onChange} />
    );
}

MultisigFilter.propsTypes = {
    value: PropTypes.string,
    style: PropTypes.object,
    theme: PropTypes.string,
    onChange: PropTypes.func.isRequired,
};

export default connect(state => ({
    selectedAccountAddress: state.account.selectedAccountAddress,
    cosignatoryOf: state.account.cosignatoryOf,
}))(MultisigFilter);
