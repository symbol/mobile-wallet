export default function(props) {
    const { type, length = 5, children } = props;

    const trunc = (text, cut, lengthFirst, lengthSecond) => {
        if (cut === 'start' && lengthFirst < text.length) {
            return '...' + text.substring(text.length - lengthFirst, text.length);
        }
        if (cut === 'middle' && lengthFirst + lengthSecond < text.length) {
            return text.substring(0, lengthFirst) + '...' + text.substring(text.length - lengthSecond, text.length);
        }
        if (cut === 'end' && lengthFirst < text.length) {
            return text.substring(0, lengthFirst) + '...';
        }

        return text;
    };

    if (typeof children !== 'string') {
        console.error(`Failed to trunc text. ${typeof children} is not a "string"`);
        return '';
    }

    switch (type) {
        case 'address':
            return trunc(children, 'middle', 6, 3);
        case 'address-short':
            return trunc(children, 'start', 3);
        case 'contact':
            return trunc(children, 'end', 18);
        case 'contact-short':
            return trunc(children, 'end', 12);
        case 'mosaicId':
            return trunc(children, 'middle', 6, 6);
        case 'namespaceName':
            return trunc(children, 'middle', 10, 10);
        default:
            return trunc(children, 'end', length);
    }
}
