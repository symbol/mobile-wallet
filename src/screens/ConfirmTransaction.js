import React, { Component } from 'react';
import { StyleSheet, ScrollView } from 'react-native';
import {
	Section,
	GradientBackground,
	TitleBar,
	Text,
	Button
} from '@src/components';
import translate from "@src/locales/i18n";
import Store from '@src/store';
import { Router } from "@src/Router";
import { connect } from 'react-redux';


const styles = StyleSheet.create({
	transactionPreview: {
		width: '100%',
		height: 60,
		borderRadius: 6,
		marginTop: 4,
		marginBottom: 4,
		padding: 17,
		paddingTop: 8,
		backgroundColor: '#fff5'
	},
});

type Props = {};

type State = {};


class ConfirmTransaction extends Component<Props, State> {
	state = {};

	submit = () => {
		Store.dispatchAction({
			type: this.props.submitActionName,
			payload: this.props.transaction
		});
	};

    render = () => {
		const {
			isLoading,
			isError,
			isSuccessfullySent,
			transaction,
			onBack
		} = this.props;
		const {} = this.state;

		const preview = Object
			.keys(transaction)
			.map(key => ({key, value: transaction[key]}));

		const isPreviewShown = !isLoading
			&& !isError
			&& !isSuccessfullySent;

		const backFunction = isSuccessfullySent
			? () => Router.goToDashboard()
			: (typeof onBack === 'function'
			? onBack
			: ()=>Router.goBack(this.props.componentId));

        return (
			<GradientBackground name="connector_small" theme="light">
				<TitleBar
					theme="light"
					onBack={backFunction}
					title="Confirm Transaction"
				/>
					{isPreviewShown &&
						<Section type="form" style={styles.list} isScrollable>
							{preview.map(el => <Section type="form-item">
								<Text type="bold" theme="light">{el.key}:</Text>
								<Text type="regular" theme="light">{el.value}</Text>
							</Section>)}

							<Section type="form-bottom">
								<Button
									isLoading={false}
									isDisabled={false}
									text="Confirm"
									theme="light"
									onPress={() => this.submit()}
								/>
							</Section>
						</Section>
					}
					{isLoading &&
						<Section type="center">
							<Text type="bold" theme="light">
								Loading
							</Text>
						</Section>
					}
					{isError &&
						<Section type="center">
							<Text type="bold" theme="light">
								Error
							</Text>
						</Section>
					}
					{isSuccessfullySent &&
						<Section type="form">
							<Text type="alert" theme="light">
								Success!
							</Text>
							<Section type="form-bottom">
								<Button
									isLoading={false}
									isDisabled={false}
									text="Go to dashboard"
									theme="light"
									onPress={() => Router.goToDashboard()}
								/>
							</Section>
						</Section>
					}
			</GradientBackground>
        );
    };
}

export default connect(state => ({

}))(ConfirmTransaction);
