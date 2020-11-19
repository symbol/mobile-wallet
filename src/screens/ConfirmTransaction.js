import React, { Component } from 'react';
import { StyleSheet, ScrollView } from 'react-native';
import {
	Section,
	GradientBackground,
	TitleBar,
	Text,
	Button,
	TableView,
	LinkExplorer,
	Icon,
	Row,
	Col
} from '@src/components';
import translate from "@src/locales/i18n";
import Store from '@src/store';
import { Router } from '@src/Router';
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
        backgroundColor: '#fff5',
    },
});

type Props = {};

type State = {};

class ConfirmTransaction extends Component<Props, State> {
    state = {};

    submit = () => {
        const finishAction = () => {
            Store.dispatchAction({
                type: this.props.submitActionName,
                payload: this.props.transaction,
            });
        };

        const { isPinSet } = this.props;
        if (isPinSet) {
            Router.showPasscode(
                {
                    resetPasscode: false,
                    onSuccess: () => {
                        Router.goBack(this.props.componentId);
                        finishAction();
                    },
                },
                this.props.componentId
            );
        } else {
            finishAction();
        }
    };

    render = () => {
        const { isLoading, isError, errorMessage, isSuccessfullySent, transaction, onBack } = this.props;
		const {} = this.state;
		
		const hardCodedDataManager = {
			isLoading,
			isError,
			errorMessage,
		}

        const preview = Object.keys(transaction)
            .map(key => ({ key, value: transaction[key] }));

        const isPreviewShown = !isLoading && !isError && !isSuccessfullySent;

        const backFunction = isSuccessfullySent
            ? () => Router.goToDashboard()
            : typeof onBack === 'function'
                ? onBack
                : () => Router.goBack(this.props.componentId);

        return (
			<GradientBackground name="connector" theme="light" dataManager={hardCodedDataManager} onBack={onBack}>
				<TitleBar
					theme="light"
					onBack={backFunction}
					title="Confirm Transaction"
				/>
				{isPreviewShown &&
					<Section type="form" style={styles.list} isScrollable>
						<TableView data={preview} />
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
				{isSuccessfullySent &&
					<Section type="form">
						<Col justify="center" style={{marginTop: '15%'}}>
							<Section type="form-item">
								<Row justify="space-between" align="end">
									<Text type="alert" theme="light" style={{paddingBottom: 0}}>
										Success!
									</Text>
									<Icon name="success" size="big"/>
								</Row>
							</Section>
							<Section type="form-item">
									<Text type="bold" theme="light">
										Transaction succesfully sent. Pending to be confirmed by the network
									</Text>
							</Section>
							
							<Section type="form-item">
								<LinkExplorer type="transaction" value={transaction.hash} />
							</Section>
						</Col>
						
						
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
    isPinSet: state.settings.isPasscodeSelected,
}))(ConfirmTransaction);
