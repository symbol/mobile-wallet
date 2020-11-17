import React, { Component } from 'react';
import { Dropdown } from '@src/components';
import { connect } from 'react-redux';
import { shortifyAddress } from '@src/utils/format';

type Props = {
    selected: string,
    onSelect: (val: string) => {},
};

class MultisigFilter extends Component<Props> {
    render() {
        const { cosignatoryOf, selectedAccountAddress, selected, onSelect, ...rest } = this.props;
        const allMultisigAccounts = [
            { value: selectedAccountAddress, label: 'Main account' },
            ...cosignatoryOf.map(address => ({
                value: address,
                label: shortifyAddress(address),
            })),
        ];

        return <Dropdown list={allMultisigAccounts} title={'Select Account'} value={selected} onChange={onSelect} {...rest} />;
    }
}

export default connect(state => ({
    selectedAccountAddress: state.account.selectedAccountAddress,
    cosignatoryOf: state.account.cosignatoryOf,
}))(MultisigFilter);
