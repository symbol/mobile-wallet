pipeline {
    agent { label 'macos' }
    
    options {
        skipStagesAfterUnstable()
    }

    parameters {
        string(name: 'VERSION_NUMBER', defaultValue: '4.4.2', description: 'Version Number')
        string(name: 'BUILD_NUMBER', defaultValue: '58', description: 'Build Number')
        // TODO change to dev
        string(name: 'DEPLOY_BETA_BRANCH', defaultValue: 'jenkins-pipeline-setup', description: 'Deploy Beta Branch Name')
        choice(
            name: 'TARGET_OS',
            choices: ['All', 'IOS', 'Android'],
            description: 'Target Environment'
        )
    }
    
    environment {
        RUNNING_ON_CI = 'true'
        VERSION_NUMBER = "${params.VERSION_NUMBER}"
        BUILD_NUMBER = "${params.BUILD_NUMBER}"
        DEPLOY_BETA_BRANCH = "${params.DEPLOY_BETA_BRANCH}"
        TARGET_OS = "${params.TARGET_OS}"
        MATCH_GIT_BASIC_AUTHORIZATION = credentials('GHUB_CREDS_SECRET')
        MATCH_PASSWORD = credentials('MATCH_PASSWORD')
        FASTLANE_APPLE_APPLICATION_SPECIFIC_PASSWORD = credentials("FASTLANE_APPLE_APPLICATION_SPECIFIC_PASSWORD")
        FASTLANE_PASSWORD = credentials("FASTLANE_PASSWORD")
        FASTLANE_KEYCHAIN = 'fastlane.keychain'
        FASTLANE_KEYCHAIN_PASSWORD = credentials("FASTLANE_KEYCHAIN_PASSWORD")
    }

    stages {
        stage('Install') {
                steps {
                    sh "cp env/default.json.example env/default.json"
                    // Run yarn install for the dependencies
                    sh "yarn cache clean && yarn install --network-concurrency 1"
                    sh "npx jetify" // for android
                }
            }

        stage('Build') {
            steps {
                sh "cd ios && bundle install"
                sh "cd ios && bundle exec pod install"
            }
            
            // TODO uncomment below !!!

            // parallel {
            //     stage('Build - IOS') {
                    // when {
                    //     expression {
                    //         TARGET_OS == 'All' || TARGET_OS == 'IOS'
                    //     }
                    // }
            //         steps {
            //             sh "cd ios && bundle install"
            //             sh "cd ios && bundle exec pod install"
            //         }
            //     }
            //     stage('Build - Android') {
                    // when {
                    //     expression {
                    //         TARGET_OS == 'All' || TARGET_OS == 'Android'
                    //     }
                    // }                
            //         steps {
            //             sh "npx react-native run-android --variant=DevDebug"
            //             sh "cd android && ./gradlew assembleProdRelease"
            //         }
            //     }
            // }
        }

        stage ('Test') {
            steps {
                sh "echo Currently there are no tests to run!"
            }
        }

        // deploy to testnet
        stage ('Deploy IOS - Alpha version') {
            when {
                expression {
                    BRANCH_NAME == DEPLOY_BETA_BRANCH
                }
            }
            steps {
                // TODO remove below exports! && export FASTLANE_PASSWORD=${FASTLANE_PASSWORD} 
                sh 'cd ios && export FASTLANE_KEYCHAIN=${FASTLANE_KEYCHAIN} && export FASTLANE_KEYCHAIN_PASSWORD=${FASTLANE_KEYCHAIN_PASSWORD} && export FASTLANE_APPLE_APPLICATION_SPECIFIC_PASSWORD=${FASTLANE_APPLE_APPLICATION_SPECIFIC_PASSWORD} && export MATCH_PASSWORD=${MATCH_PASSWORD} && export MATCH_GIT_BASIC_AUTHORIZATION=${MATCH_GIT_BASIC_AUTHORIZATION} && export RUNNING_ON_CI=${RUNNING_ON_CI} && export BUILD_NUMBER=${BUILD_NUMBER} && export VERSION_NUMBER=${VERSION_NUMBER} && bundle exec fastlane beta'
                sh "echo Deployed to TestFlight. Version:${VERSION_NUMBER}, Build:${BUILD_NUMBER}"
            }
        }
    }
    post {
        success {
            archiveArtifacts artifacts: 'android/app/build/outputs/apk/dev/release/*.apk'
            archiveArtifacts artifacts: 'ios/output/*.ipa'
        }
        
        always { 
            cleanWs()
        }
    }
}
