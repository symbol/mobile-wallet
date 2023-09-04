# Symbol wallet (nem-catapult-wallet)

Official Android and iOS applications for NEM2(a.k.a Catapult).


## Getting Started

This application is built on `React Native` and therefore assumes you have all the necessary CLI tools to run and manage this project. If not, please [set up react native](https://facebook.github.io/react-native/docs/getting-started.html) (choose tab **React Native CLI Quickstart**).

### Prerequisites

- The **default network configuration** is fetched from the `env/default.json` file, and as part of the first-time setup, you should provide these. Check the `env/default.json.example` file to see what keys are required.
- Node version should be from **16.x** to **17.9.1**.
- [Hermes](https://hermesengine.dev/) is disabled [because of Realm dependency]
- Android hosts 2 different product flavors - `dev` and `prod`, so you will need to specify this when building/releasing the application for android.
- [Yarn](https://yarnpkg.com/en/) is preferred over **NPM** as a package manager.

That's it. Now you can clone, build and run this project.

### Installing

```sh
$ git clone <url/to/this/project>
$ cd <path/to/this/project>
$ cp env/default.json.example env/default.json # now add your network configuration
$ yarn install # or npm install
```

> **Important**: Post upgrading to 0.60.5+, the react-native-cli has issues with the `run-android` command **which won't start the node server on Ubuntu/linux**. As a work around, you will need to start it on your own by issuing the following command.

Open a new tab and

```sh
$ react-native start # --resetCache (for a clean build)
```

To run,

```sh
$ react-native run-android --variant=devDebug # or react-native run-ios (if you are on macOS)
```

## Running the tests

```sh
$ yarn jest # add -i if you prefer to run this in band
```

> **Important**: When running test suites from a cloud environment like jenkins or circleci, make sure to copy the .env.example as .env, which you can add as a setup step, and should happen before `yarn jest` command.

## Build

### Android

Android has 2 flavors

- `Dev`
- `Prod`

For creating a release or debug build type, run `assemble{flavorName}{buildType}` where buildType can be one of `(Debug|Release)`. Visit [this page](https://developer.android.com/studio/build/build-variants) for more details.

```sh
$ cd android/
$ ./gradlew assembleDevRelease # or any of `assembleDevRelease` | `assembleProdDebug` | `assembleProdRelease`
```

> **Note**: apk(s) will be generated at `app/build/outputs/apk/{flavor}/{buildType}` folder depending on what flavor you built.

### iOS

#### Set up the environment

Install [Xcode](https://itunes.apple.com/us/app/xcode/id497799835?mt=12) and make sure your using latest Xcode.

##### Installing cocoaPods

All new(0.60+) react native apps use Cocoapods by default, so we need that as well
Install cocoapods use following steps

##### Step 1: Install rubygems

If you already have RubyGems, make sure it's updated to the latest version. To update it, run the following command:

```sh
$ gem update --system
```

##### Step 2: Install cocoaPods

Run the two commands below to install CocoaPods.

```sh
$ sudo gem install cocoapods
$ pod setup
```

##### Step 3: Installing dependencies

```sh
$ cd <path/to/this/project/>
$ cd ios && pod install && cd ..
```

##### Running on a device

If you want to run the app on an actual physical iOS device, please follow the instructions [here](https://reactnative.dev/docs/running-on-device)

## Contributing

Please setup your local environment for [signing commits](https://help.github.com/en/github/authenticating-to-github/signing-commits).
Also, read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct, and the process for submitting pull requests to us.

## Versioning

We use [SemVer](http://semver.org/) for versioning. For the versions available, see the [tags on this repository](https://github.com/hatioin/nem-catapult-wallet/tags).

## License

This project is licensed under **Apache License 2.0**.
