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
                        sh "cd android && ./gradlew assembleProdRelease"
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
            when {
                expression {
                    // TODO Change branch name !!!
                    BRANCH_NAME == 'jenkins-pipeline-setup'
                }
            }
            steps {
                // TODO sh "cd ios && export BUILD_NUMBER=${BUILD_NUMBER} && export VERSION_NUMBER=4.2 && bundle exec fastlane ${FASTLANE_LANE}"
                sh "echo Deployed to TestFlight. Version:${VERSION_NUMBER}, Build:${BUILD_NUMBER}"
            }
        }
    }
    post {
        success {
            archiveArtifacts artifacts: 'android/app/build/outputs/apk/dev/release/*.apk'
        }
    }
}
