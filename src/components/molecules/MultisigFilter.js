import React, { Component } from 'react';
import { Dropdown } from '@src/components';
import { connect } from 'react-redux';

type Props = {
    selected: string,
    onSelect: (val: string) => {},
};

class MultisigFilter extends Component<Props> {
    render() {
        const { cosignatoryOf, selected, onSelect } = this.props;
        const allMultisigAccounts = [
            { value: null, label: 'Main account' },
            ...cosignatoryOf.map(address => ({
                value: address,
                label: address,
            })),
        ];

        return <Dropdown list={allMultisigAccounts} title={'Select Account'} value={selected} onChange={onSelect} />;
    }
}

export default connect(state => ({
    cosignatoryOf: state.account.cosignatoryOf,
}))(MultisigFilter);
