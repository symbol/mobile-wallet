// create a multibranch pipeline
// define the repository link and branch
pipeline {
    agent { label 'macos' }
    
    options {
        skipStagesAfterUnstable()
    }

    environment {
        RUNNING_ON_CI = 'true'
    }
    stages {
        stage('Install') {
                steps {
                    // Get mobile-wallet dev branch code from GitHub repository
                    git branch: 'dev', url: 'https://github.com/symbol/mobile-wallet.git'

                    sh "cp env/default.json.example env/default.json"
                    // Run yarn install for the dependencies
                    sh "yarn cache clean && yarn install --network-concurrency 1"                
                }
            }

        stage('Build') {
            parallel {
                stage('Build - IOS') {
                    steps {
                        sh "cd ios && bundle install"
                        sh "cd ios && bundle exec pod install"
                    }
                }
                stage('Build - Android') {
                    steps {
                        sh "npx react-native run-android --variant=DevDebug"
                        sh "cd android && ./gradlew assembleDevRelease"
                    }
                }
            }
        }

        stage ('Test') {
            steps {
                sh "echo Currently there are no tests to run!"
            }
        }

        // deploy to testnet
        stage ('Deploy Staging - Alpha version') {
            steps {
                // TODO sh "cd ios && export BUILD_NUMBER=${BUILD_NUMBER} && export VERSION_NUMBER=4.2 && bundle exec fastlane ${FASTLANE_LANE}"

                sh "echo 'Deployed to TestFlight.'"
            }
        }

        // deploy to production
        stage ('Deploy Production - Release version') {
            steps {
                // TODO sh "cd ios && export BUILD_NUMBER=${BUILD_NUMBER} && export VERSION_NUMBER=4.2 && bundle exec fastlane ${FASTLANE_LANE}"
                input "waiting for the input to continue..."

                sh "echo 'Deployed to Production.'"
            }
        }
    }
    post {
        success {
            archiveArtifacts artifacts: 'android/app/build/outputs/apk/dev/release/*.apk'
        }
    }
}
