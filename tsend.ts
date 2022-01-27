'use strict';
/*
 *
 * Copyright 2018-present NEM
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */
// Object.defineProperty(exports, '__esModule', { value: true });
// const operators_1 = require('rxjs/operators');
// const symbol_sdk_1 = require('symbol-sdk');
// /* start block 01 */
// const validTransaction = (transaction, publicAccount) => {
//   return (
//     transaction instanceof symbol_sdk_1.TransferTransaction &&
//     transaction.signer.equals(publicAccount) &&
//     transaction.mosaics.length === 1 &&
//     transaction.mosaics[0].id.equals(
//       new symbol_sdk_1.MosaicId('5E62990DCAC5BE8A') ||
//         transaction.mosaics[0].id.equals(
//           new symbol_sdk_1.NamespaceId('symbol.xym'),
//         ),
//     ) &&
//     transaction.mosaics[0].amount.compare(
//       symbol_sdk_1.UInt64.fromUint(100 * Math.pow(10, 6)),
//     ) < 0
//   );
// };
// // const cosignAggregateBondedTransaction = (transaction, account) => {
// //   const cosignatureTransaction = symbol_sdk_1.CosignatureTransaction.create(
// //     transaction,
// //   );
// //   return account.signCosignatureTransaction(cosignatureTransaction);
// // };
// // replace with network type
// const networkType = symbol_sdk_1.NetworkType.TEST_NET;
// // replace with private key
// const privateKey =
//   '0000000000000000000000000000000000000000000000000000000000000000';
// const account = symbol_sdk_1.Account.createFromPrivateKey(
//   privateKey,
//   networkType,
// );
// // replace with node endpoint
// const nodeUrl = 'https://401-joey-dual.symboltest.net:3001';
// const repositoryFactory = new symbol_sdk_1.RepositoryFactoryHttp(nodeUrl);
// const transactionHttp = repositoryFactory.createTransactionRepository();
// const listener = repositoryFactory.createListener();
// listener.open().then(() => {
//   listener
//     .aggregateBondedAdded(account.address)
//     .pipe(
//       operators_1.filter((_) => _.innerTransactions.length === 2),
//       operators_1.filter((_) => !_.signedByAccount(account.publicAccount)),
//       operators_1.filter(
//         (_) =>
//           validTransaction(_.innerTransactions[0], account.publicAccount) ||
//           validTransaction(_.innerTransactions[1], account.publicAccount),
//       ),
//       operators_1.map((transaction) =>
//         cosignAggregateBondedTransaction(transaction, account),
//       ),
//       operators_1.mergeMap((signedCosignatureTransaction) =>
//         transactionHttp.announceAggregateBondedCosignature(
//           signedCosignatureTransaction,
//         ),
//       ),
//     )
//     .subscribe(
//       (announcedTransaction) => {
//         console.log(announcedTransaction);
//         listener.close();
//       },
//       (err) => console.error(err),
//     );
// });
// /* end block 01 */




   
'use strict';
/*
 *
 * Copyright 2018-present NEM
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */
Object.defineProperty(exports, '__esModule', { value: true });
const symbol_sdk_1 = require('symbol-sdk');
// Retrieve from node's /network/properties or RepositoryFactory
const epochAdjustment = 123456789;
// replace network type
const networkType = symbol_sdk_1.NetworkType.TEST_NET;
// replace with cosignatory private key
const cosignatoryPrivateKey =
  '5455288C17E433647E3962367B780EBDBEB02F46D2F3E3510EA1A6270364EF8D';
const cosignatoryAccount = symbol_sdk_1.Account.createFromPrivateKey(
  cosignatoryPrivateKey,
  networkType,
);

// replace with multisig account public key
const multisigAccountPublicKey =
  '3A537D5A1AF51158C42F80A199BB58351DBF3253C4A6A1B7BD1014682FB595EA';
const multisigAccount = symbol_sdk_1.PublicAccount.createFromPublicKey(
  multisigAccountPublicKey,
  networkType,
);

const bondedReceiver = symbol_sdk_1.PublicAccount.createFromPublicKey("8A1C442CF3EA9D33AF3E5F12AD5A2BAE425BAAC2817D066BE256C220290C1861", networkType);
const bondedAnnouncer = symbol_sdk_1.Account.createFromPrivateKey("5455288C17E433647E3962367B780EBDBEB02F46D2F3E3510EA1A6270364EF8D", networkType);
const bondedAnnouncePublicAccount = symbol_sdk_1.PublicAccount.createFromPublicKey("489365A9F4AEA162DE49548D61AAF1C1CC10A6FDCB368C0F08D6CAB257090A9A", networkType);

// replace with recipient address
const recipientRawAddress = 'TCUGP5-HFF7NJ-Z3DMYT-55CGTZ-5GEPP3-SYHZML-7UQ';
const recipientAddress = symbol_sdk_1.Address.createFromRawAddress(
  recipientRawAddress,
);
const bondedAnnouncerAddress = symbol_sdk_1.Address.createFromRawAddress(
  'TBGIUTPISLJMY46YZSDILIZZCB4235Y5RQ5F4XI',
);

// replace with symbol.xym id
const networkCurrencyMosaicId = new symbol_sdk_1.MosaicId('3A8416DB2D53B6C8');

// replace with network currency divisibility
const networkCurrencyDivisibility = 6;
const transferTransaction = symbol_sdk_1.TransferTransaction.create(
  symbol_sdk_1.Deadline.create(epochAdjustment),
  recipientAddress,
  [
    new symbol_sdk_1.Mosaic(
      networkCurrencyMosaicId,
      symbol_sdk_1.UInt64.fromUint(
        10 * Math.pow(10, networkCurrencyDivisibility),
      ),
    ),
  ],
  symbol_sdk_1.PlainMessage.create('sending 10 symbol.xym'),
  networkType,
);
const transferTransaction2 = symbol_sdk_1.TransferTransaction.create(
  symbol_sdk_1.Deadline.create(epochAdjustment),
  bondedAnnouncerAddress,
  [
    new symbol_sdk_1.Mosaic(
      networkCurrencyMosaicId,
      symbol_sdk_1.UInt64.fromUint(
        1000 * Math.pow(10, networkCurrencyDivisibility),
      ),
    ),
  ],
  symbol_sdk_1.PlainMessage.create('sending 1000 symbol.xym'),
  networkType,
);
/* start block 01 */
const aggregateTransaction = symbol_sdk_1.AggregateTransaction.createBonded(
  symbol_sdk_1.Deadline.create(epochAdjustment),
  [transferTransaction.toAggregate(bondedAnnouncePublicAccount)],
  [transferTransaction2.toAggregate(bondedAnnouncer)],
  networkType,
  [],
  symbol_sdk_1.UInt64.fromUint(2000000),
);
// replace with meta.networkGenerationHash (nodeUrl + '/node/info')
const networkGenerationHash =
  '1DFB2FAA9E7F054168B0C5FCB84F4DEB62CC2B4D317D861F3168D161F54EA78B';
const signedTransaction = cosignatoryAccount.sign(
  aggregateTransaction,
  networkGenerationHash,
);
// console.log(signedTransaction.hash);
/* end block 01 */
/* start block 02 */
const hashLockTransaction = symbol_sdk_1.HashLockTransaction.create(
  symbol_sdk_1.Deadline.create(epochAdjustment),
  new symbol_sdk_1.Mosaic(
    networkCurrencyMosaicId,
    symbol_sdk_1.UInt64.fromUint(
      10 * Math.pow(10, networkCurrencyDivisibility),
    ),
  ),
  symbol_sdk_1.UInt64.fromUint(480),
  signedTransaction,
  networkType,
  symbol_sdk_1.UInt64.fromUint(2000000),
);
const signedHashLockTransaction = cosignatoryAccount.sign(
  hashLockTransaction,
  networkGenerationHash,
);
// replace with node endpoint
const nodeUrl = 'https://401-joey-dual.symboltest.net:3001';
const repositoryFactory = new symbol_sdk_1.RepositoryFactoryHttp(nodeUrl);
const listener = repositoryFactory.createListener();
const receiptHttp = repositoryFactory.createReceiptRepository();
const transactionHttp = repositoryFactory.createTransactionRepository();
const transactionService = new symbol_sdk_1.TransactionService(
  transactionHttp,
  receiptHttp,
);
listener.open().then(() => {
  transactionService
    .announceHashLockAggregateBonded(
      signedHashLockTransaction,
      signedTransaction,
      listener,
    )
    .subscribe(
      (x) => console.log(x),
      (err) => console.log(err),
      () => listener.close(),
    );
});
/* end block 02 */