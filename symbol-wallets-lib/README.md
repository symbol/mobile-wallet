# Symbol Wallets Lib

1. [Installation](#installation)
2. [Paper Wallet Usage](#paper-wallet-usage)

## Installation <a name="installation"></a>

To install the npm module on your typescript or node project run:

`npm install symbol-wallets-lib --save`

And install plugin dependencies:

`npm install symbol-sdk symbol-hd-wallets --save`


## Usage <a name="paper-wallet-usage"></a>

Prepare some constants for use the module:

```javascript
import { SymbolPaperWallet } from 'symbol-wallets-lib';

const hdRootAccount = {
    mnemonic: "guess welcome coconut forum cricket unfold welcome still ticket cluster buddy fan decrease cotton model drive student assault cloth protect random equal this congress",
    rootAccountPublicKey: "TC6B74-FLJ5MR-PSXPEM-WDBWX5-VDIXA5-L5UI36-MEA",
    rootAccountAddress: "1F032B727E910D69F1B6A3244AD1B065547AA0055BC41CF4285F662182DCC18A"
};

const privateKeyAccount = {
    name: "My private key account",
    address: "TCHBDE-NCLKEB-ILBPWP-3JPB2X-NY64OE-7PYHHE-32I",
    publicKey: "3B6A27BCCEB6A42D62A3A8D02A6F0D73653215771DE243A63AC048A18B59DA29",
    privateKey: "0000000000000000000000000000000000000000000000000000000000000000"
};

const paperWallet = new SymbolPaperWallet(hdRootAccount, [privateKeyAccount], NetworkType.TEST_NET, '57F7DA205008026C776CB6AED843393F04CD458E0AA2D9F1D5F31A402072B2D6')

const uint8Array = await paperWallet.toPdf();

```
