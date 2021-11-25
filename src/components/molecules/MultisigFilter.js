import React, { Component } from 'react';
import { Dropdown } from '@src/components';
import { connect } from 'react-redux';
import { shortifyAddress } from '@src/utils/format';
import translate from '@src/locales/i18n';

type Props = {
    selected: string,
    onSelect: (val: string) => {},
};

class MultisigFilter extends Component<Props> {
    formatAddress = address => {
        return (
            address.substring(0, 6) +
            '...' +
            address.substring(address.length - 3, address.length)
        );
    };
    render() {
        const {
            cosignatoryOf,
            selectedAccountAddress,
            selected,
            onSelect,
            ...rest
        } = this.props;
        const allMultisigAccounts = [
            {
                value: selectedAccountAddress,
                label: translate('history.mainAccount'),
            },
            ...cosignatoryOf.map(address => ({
                value: address,
                label: shortifyAddress(address),
            })),
        ];

        return (
            <Dropdown
                list={allMultisigAccounts}
                title={translate('history.accountFilter')}
                value={this.formatAddress(selected)}
                onChange={onSelect}
                {...rest}
            />
        );
    }
}

export default connect(state => ({
    selectedAccountAddress: state.account.selectedAccountAddress,
    cosignatoryOf: state.account.cosignatoryOf,
}))(MultisigFilter);
