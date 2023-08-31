# CHANGELOG
All notable changes to this project will be documented in this file.

The changelog format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

## [v1.4.3][v1.4.3] - 31-Aug-2023
### Changed
- Target Android SDK 31.

## [v1.4.2][v1.4.2] - 24-Oct-2022
### Changed
- Upgraded the dependency `symbol-sdk` version to `v2.0.3`.

## [v1.4.1][v1.4.1] - 1-Feb-2022
### Fixed
- Corrupted Paper Wallet Backup. [#284](https://github.com/symbol/mobile-wallet/issues/284)
- Backup saving error. [#145](https://github.com/symbol/mobile-wallet/issues/145)
- `okhttp` dependency is upgraded to fix Non-SDK errors reported by Google Play Console

### Changed
- Removed dashes from addresses. [#296](https://github.com/symbol/mobile-wallet/issues/296)
- Upgraded the dependency `symbol-sdk` version to `v1.0.3`.

## [v1.4.0][v1.4.0] - 12-Nov-2021
### Fixed
- Fixed behavior when node is down and application crashes[#259](https://github.com/symbol/mobile-wallet/issues/259)
- Fixed fees selector problems when recipient address is not provided [#254](https://github.com/symbol/mobile-wallet/issues/254)
### Changed
- Updated CI/CD pipeline
- Build Android version against SDK version30

## [v1.3.0][v1.3.0] - 1-Nov-2021

### Fixed
- Fix invalid accounts generated when importing private key instead mnemonics [#232](https://github.com/symbol/mobile-wallet/issues/232)
- Fix node list should not be hardcoded [#235](https://github.com/symbol/mobile-wallet/issues/235)
- Fix not able to send transaction with encrypted message [#236](https://github.com/symbol/mobile-wallet/issues/236)
- Hide news feed [#242](https://github.com/symbol/mobile-wallet/issues/242)
- Update explorer and faucet url. [#252](https://github.com/symbol/mobile-wallet/pull/252)

### Added
- Add Multisig multi-level support [#223](https://github.com/symbol/mobile-wallet/issues/223)
- Add harvesting verification if account importance is above zero [#234](https://github.com/symbol/mobile-wallet/issues/234)
- Display current account importance in Harvesting Page [#239](https://github.com/symbol/mobile-wallet/issues/239)
- Add Jenkins pipeline setup [#247](https://github.com/symbol/mobile-wallet/pull/247)

## [v1.2][v1.2] - 6-Oct-2021

### Fixed
- Remove the Sign button of Aggregate Bonded transaction. [#222](https://github.com/symbol/mobile-wallet/issues/222)
- Fix explorer links [#214](https://github.com/symbol/mobile-wallet/issues/214)
- Fix harvesting status [#134](https://github.com/symbol/mobile-wallet/issues/134)
- Minor translations update.

[v1.2]: https://github.com/symbol/mobile-wallet/releases/tag/1.2
[v1.3.0]: https://github.com/symbol/mobile-wallet/releases/tag/1.3.0
[v1.4.0]: https://github.com/symbol/mobile-wallet/releases/tag/1.4.0
[v1.4.1]: https://github.com/symbol/mobile-wallet/releases/tag/1.4.1
[v1.4.2]: https://github.com/symbol/mobile-wallet/releases/tag/1.4.2
[v1.4.3]: https://github.com/symbol/mobile-wallet/releases/tag/1.4.3
