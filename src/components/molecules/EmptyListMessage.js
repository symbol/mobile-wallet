import React from 'react';
import { Col, Text } from '@src/components';
import translate from '@src/locales/i18n';

export default function EmptyListMessage(show, message) {
    return !!show ? (
        <Col fullHeight align="center" justify="center">
            <Text type="regular" theme="light">
                {message || translate('unsortedKeys.nothingToShow')}
            </Text>
        </Col>
    ) : (
        <></>
    );
}
