import React, { Component } from 'react';
import { StyleSheet } from 'react-native';
import PopupModal from '@src/components/molecules/PopupModal';
import Input from '@src/components/controls/Input';
import { Button, Section } from '@src/components';

const styles = StyleSheet.create({});

type Props = {
    showModal: boolean,
    title: string,
    onSubmit: (value: string) => {},
    onClose: (value: string) => {},
};

export default class PasswordModal extends Component<Props> {
    state = {
        value: '',
    };

    componentDidMount = () => {
        this.setState({ value: '' });
    };

    onSubmit = () => {
        const { onSubmit } = this.props;
        const { value } = this.state;
        onSubmit(value);
        this.setState({ value: '' });
    };

    render = () => {
        const { showModal, title } = this.props;
        const { value } = this.state;

        return (
            <PopupModal
                isModalOpen={showModal}
                showTopbar={true}
                title={title}
                showClose={true}
                onClose={() => {
                    typeof this.props.onClose === 'function' &&
                        this.props.onClose();
                    this.setState({ showDecryptModal: false });
                }}
            >
                <Section type="form">
                    <Section type="form-item">
                        <Input
                            type="password"
                            value={value}
                            placeholder="Insert password"
                            theme="light"
                            editable={true}
                            secureTextEntry={true}
                            onChangeText={value => this.setState({ value })}
                        />
                    </Section>
                    <Section type="form-bottom">
                        <Button
                            text="Submit"
                            theme="light"
                            onPress={() => this.onSubmit()}
                        />
                    </Section>
                </Section>
            </PopupModal>
        );
    };
}
