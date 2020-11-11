import React, { Component } from 'react';
import { StyleSheet, } from 'react-native';
import { Section, ImageBackground, TitleBar, MosaicDisplay } from '@src/components';
import { connect } from 'react-redux';

const styles = StyleSheet.create({
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
            <ImageBackground name="blue" fade={true}>
                <TitleBar theme="light" title="Mosaics" />
                <Section type="list" style={styles.list} isScrollable>
                    {ownedMosaics &&
                        ownedMosaics.map(mosaic => {
                            return <MosaicDisplay mosaic={mosaic} />;
                        })}
                </Section>
			</ImageBackground>
        );
    }
}

export default connect(state => ({
    ownedMosaics: state.account.ownedMosaics,
}))(Mosaics);
