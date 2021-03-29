import React, { Component } from 'react';
import { 
	StyleSheet, 
	Text,
} from 'react-native';
import GlobalStyles from '@src/styles/GlobalStyles';
import { Dropdown, Row, Input } from '@src/components';
import translate from '@src/locales/i18n';
import { node } from 'prop-types';


const styles = StyleSheet.create({
	name: {
		fontSize: 12,
		fontFamily: 'NotoSans-SemiBold',
		fontWeight: '400'
	},
	balance: {
		fontSize: 12,
		color: GlobalStyles.color.GREY3
	},
});


interface Props {};
type State = {
    customNodeUrlInput: string
};


export default class MosaicDropdown extends Component<Props, State> {
    state = {
        customNodeUrlInput: ''
    };

    constructor(props) {
        super(props);
        this.dropdown = React.createRef();
    };

	renderItem = (item) => {
		return (
			<Row style={styles.root} justify ="space-between">
				<Text style={styles.name}>
					{item.label}
				</Text>
				<Text style={styles.balance}>
					{item.balance}
				</Text>
			</Row>
		);
	};

    renderModalInner = () => {
        return (
            <Input
                value={this.state.customNodeUrlInput}
                placeholder={translate('Settings.node.customNodeURLInputPlaceholder')}
                theme="light"
                onChangeText={text => this.onChangeText(text)}
            /> 
        );
    };

    onChangeText = (nodeUrl) => {
        this.setState({customNodeUrlInput: nodeUrl});
    };

    render = () => {
		const { ...rest } = this.props;

        return <Dropdown modalInnerRenderer={this.renderModalInner} ref={this.dropdown} {...rest} />
    };
}
