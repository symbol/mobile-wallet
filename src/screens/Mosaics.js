import React, { Component } from 'react';
import { StyleSheet, } from 'react-native';
import { Section, GradientBackground, TitleBar, MosaicDisplay } from '@src/components';
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
        backgroundColor: '#fffc',
    },
    list: {
        marginTop: 17,
    },
});

type Props = {
    componentId: string,
};

type State = {};

class Mosaics extends Component<Props, State> {
    state = {};

    render() {
        const { ownedMosaics } = this.props;
        const {} = this.state;

        return (
            <GradientBackground name="connector" fade={true}>
                <TitleBar theme="dark" title="Mosaics" />
                <Section type="list" style={styles.list}>
                    {ownedMosaics &&
                        ownedMosaics.map(mosaic => {
                            return <MosaicDisplay mosaic={mosaic} />;
                        })}
                </Section>
            </GradientBackground>
        );
    }
}

export default connect(state => ({
    ownedMosaics: state.account.ownedMosaics,
}))(Mosaics);
