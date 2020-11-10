import React, { Component } from 'react';

type Type = 'address'
	| 'mosaicId'
	| 'namespaceName';

interface Props {
    type: Type
};

export default class Transaction extends Component<Props> {
	trunc = (text, cut, lengthFirst, lengthSecond) => {
		if(cut === 'middle')
			return text.substring(0, lengthFirst) 
			+ '...' 
			+ text.substring(text.length - lengthSecond, text.length);
		if(cut === 'end')
			return text.substring(0, lengthFirst) + '...';
	};

    render = () => {
		const { type, children } = this.props;
		if(typeof children !== 'string') {
			console.error(`Failed to trunc text. ${typeof children} is not a "string"`);
			return '';
		}
        switch (type) {
			case 'address': return this.trunc(children, 'middle', 6, 3);
			case 'mosaicId': return this.trunc(children, 'middle', 6, 3);
			case 'namespaceName': return this.trunc(children, 'middle', 6, 3);
			default: return this.trunc(children, 'end', 5);
        }
    };
}
