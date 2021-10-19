// create a multibranch pipeline
// define the repository link and branch
pipeline {
    agent { label 'macos' }
    
    options {
        skipStagesAfterUnstable()
    }

    parameters {
        string(name: 'VERSION_NUMBER', defaultValue: '4.4.2', description: 'Version Number')
        string(name: 'BUILD_NUMBER', defaultValue: '58', description: 'Build Number')
    }
    
    environment {
        RUNNING_ON_CI = 'true'
        VERSION_NUMBER = "${params.VERSION_NUMBER}"
        BUILD_NUMBER = "${params.BUILD_NUMBER}"
        // TODO change branch name
        DEV_BRANCH = 'jenkins-pipeline-setup'
        GHUB_CREDS_SECRET = credentials('GHUB_CREDS_SECRET')
    }

    stages {
        stage('Install') {
                steps {
                    // Get mobile-wallet dev branch code from GitHub repository
                    // git branch: DEV_BRANCH, url: 'https://github.com/symbol/mobile-wallet.git'
                    sh "GHUB_CREDS_SECRET:${GHUB_CREDS_SECRET}"
                    sh "GHUB_CREDS_SECRET BASE64:${GHUB_CREDS_SECRET.bytes.encodeBase64().toString()}"
                    sh "cp env/default.json.example env/default.json"
                    // Run yarn install for the dependencies
                    sh "yarn cache clean && yarn install --network-concurrency 1"                
                }
            }

        // stage('Build') {
        //     parallel {
        //         stage('Build - IOS') {
        //             steps {
        //                 sh "cd ios && bundle install"
        //                 sh "cd ios && bundle exec pod install"
        //             }
        //         }
        //         stage('Build - Android') {
        //             steps {
        //                 sh "npx react-native run-android --variant=DevDebug"
        //                 sh "cd android && ./gradlew assembleProdRelease"
        //             }
        //         }
        //     }
        // }

        // stage ('Test') {
        //     steps {
        //         sh "echo Currently there are no tests to run!"
        //     }
        // }

        // // deploy to testnet
        // stage ('Deploy Staging - Alpha version') {
        //     when {
        //         expression {
        //             BRANCH_NAME == DEV_BRANCH
        //         }
        //     }
        //     steps {
        //         sh "cd ios && export RUNNING_ON_CI=${RUNNING_ON_CI} && export BUILD_NUMBER=${BUILD_NUMBER} && export VERSION_NUMBER=${VERSION_NUMBER} && bundle exec fastlane beta"
        //         sh "echo Deployed to TestFlight. Version:${VERSION_NUMBER}, Build:${BUILD_NUMBER}"
        //     }
        // }
    }
    // post {
    //     success {
    //         archiveArtifacts artifacts: 'android/app/build/outputs/apk/dev/release/*.apk'
    //     }
    // }
}
