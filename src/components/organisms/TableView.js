import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';
import {
    CopyView,
    Icon,
    Row,
    SecretView,
    Section,
    Text,
    Trunc,
} from '@src/components';
import translate from '@src/locales/i18n';
import GlobalStyles from '@src/styles/GlobalStyles';

const TRANSLATION_ROOT_KEY = 'table';
const renderTypeMap = {
    copyButton: [
        'address',
        'recipientAddress',
        'signerAddress',
        'linkedAccountAddress',
        'targetAddress',
        'metadataValue',
        'publicKey',
        'vrfPublicKey',
        'remotePublicKey',
        'linkedPublicKey',
        'nodePublicKey',
        'secret',
        'proof',
        '_restrictionAddressAdditions',
        '_restrictionAddressDeletions',
        '_addressAdditions',
        '_receivedCosignatures',
        '_addressDeletions',
    ],
    boolean: ['supplyMutable', 'transferable', 'restrictable'],
    amount: ['amount', 'resolvedFee'],
    secret: ['privateKey', 'remotePrivateKey', 'vrfPrivateKey'],
    mosaics: ['mosaics'],
    ecryption: ['messageEncrypted'],
    transactionType: [
        'transactionType',
        '_restrictionOperationAdditions',
        '_restrictionOperationDeletions',
    ],
    translate: [
        'registrationType',
        'aliasAction',
        'action',
        'restrictionType',
        'previousRestrictionType',
        'newRestrictionType',
        'linkAction',
    ],
};
const styles = StyleSheet.create({
    amount: {
        color: GlobalStyles.color.SECONDARY,
    },
    mosaic: {
        backgroundColor: GlobalStyles.color.DARKWHITE,
        borderRadius: 5,
        paddingVertical: 2,
        paddingHorizontal: 16,
        marginBottom: 2,
    },
});

interface Props {
    data: Object;
    smaller?: boolean;
    hideEmpty?: boolean;
}

class TableView extends Component<Props> {
    valueExists = value => {
        if (typeof value !== 'boolean' && value !== 0 && !value) {
            return false;
        }

        if (Array.isArray(value) && !value.length) {
            return false;
        }

        return true;
    };

    render_copyButton = value => {
        if (typeof value === 'string')
            return <CopyView theme="light">{value}</CopyView>;
        else
            return (
                <Text type="regular" theme="light">
                    {translate('table.null')}
                </Text>
            );
    };

    render_secret = value => {
        return (
            <SecretView
                componentId={this.props.componentId}
                title="Show "
                theme="light"
            >
                {value}
            </SecretView>
        );
    };

    render_boolean = value => {
        return <Icon name={value + '_light'} size="small" />;
    };

    render_ecryption = value => {
        return (
            <Text type="regular" theme="light">
                {translate('table.' + (value ? 'encrypted' : 'unencrypted'))}
            </Text>
        );
    };

    render_amount = value => {
        if (value === 0)
            return (
                <Text type="bold" theme="light" style={styles.amount}>
                    {value}
                </Text>
            );
        return (
            <Text type="bold" theme="light" style={styles.amount}>
                {value}
            </Text>
        );
    };

    render_transactionType = value => {
        return (
            <Text type="regular" theme="light">
                {translate('transactionTypes.transactionDescriptor_' + value)}
            </Text>
        );
    };

    render_translate = value => {
        return (
            <Text type="regular" theme="light">
                {translate(`${TRANSLATION_ROOT_KEY}.${value}`)}
            </Text>
        );
    };

    render_mosaics = value => {
        const mosaics = Array.isArray(value) ? value : [];
        if (mosaics.length)
            return mosaics.map((el, index) => (
                <Row
                    justify="space-between"
                    fullWidth
                    style={styles.mosaic}
                    key={'' + index + 'tv-mosaics'}
                >
                    <Row align="center">
                        <Icon
                            name="mosaic_custom"
                            size="small"
                            style={{ marginRight: 8 }}
                        />
                        <Text type="regular" theme="light">
                            <Trunc type="namespaceName">{el.mosaicName}</Trunc>
                        </Text>
                    </Row>
                    {this.render_amount(
                        el.amount / Math.pow(10, el.divisibility)
                    )}
                </Row>
            ));
        return (
            <Text type="regular" theme="light">
                {translate('table.null')}
            </Text>
        );
    };

    renderItem = (key, value) => {
        let ItemTemplate;

        Object.keys(renderTypeMap).forEach(itemType =>
            renderTypeMap[itemType].find(el => {
                if (el === key) {
                    const renderer = this['render_' + itemType];

                    if (typeof renderer === 'function') {
                        ItemTemplate = renderer(value);
                        return true;
                    } else {
                        console.error(
                            `Table item renderer "${'render_' +
                                itemType}" is not implemented`
                        );
                        return false;
                    }
                }
            })
        );

        if (!ItemTemplate && typeof value === 'object' && value !== null)
            return this.renderTable(value, key);
        return ItemTemplate ? (
            ItemTemplate
        ) : (
            <Text type="regular" theme="light">
                {value}
            </Text>
        );
    };

    renderTable = (data, key) => {
        const { smaller, hideEmpty, style } = this.props;
        const sectionStyle = smaller
            ? {
                  borderTopWidth: 1,
                  borderTopColor: GlobalStyles.color.DARKWHITE,
                  paddingVertical: 5,
              }
            : {};
        const sectionType = smaller ? null : 'form-item';
        const titleStyle = smaller ? { flex: 0.3 } : {};
        const contentStyle = smaller ? { flex: 0.7 } : {};
        const Item = smaller ? Row : View;
        let _data = data;

        if (data === null || typeof data !== 'object') return null;

        if (
            Array.isArray(data) &&
            data.length &&
            typeof data[0] !== 'object' &&
            key
        ) {
            return data.map(value => this.renderItem('_' + key, value));
        }

        if (!Array.isArray(data))
            _data = Object.keys(data)
                .filter(key => data[key] !== null && data[key] !== undefined)
                .map(key => ({
                    key,
                    value: data[key],
                }));
        return _data.map(
            (el, item) =>
                (!hideEmpty || this.valueExists(el.value)) && (
                    <Section
                        type={sectionType}
                        style={[sectionStyle, style]}
                        key={'' + item + 'table' + el.key}
                    >
                        <Item>
                            <Text type="bold" theme="light" style={titleStyle}>
                                {translate(`${TRANSLATION_ROOT_KEY}.${el.key}`)}
                                :
                            </Text>
                            <View style={contentStyle}>
                                {this.renderItem(el.key, el.value)}
                            </View>
                        </Item>
                    </Section>
                )
        );
    };

    render = () => {
        const { data } = this.props;

        return this.renderTable(data);
    };
}

export default TableView;
