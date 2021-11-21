pipeline {
    agent { label 'macos' }
    
    options {
        skipStagesAfterUnstable()
    }

    parameters {
        string(name: 'VERSION_NUMBER', defaultValue: '4.4.3', description: 'Version Number')
        string(name: 'DEPLOY_BETA_BRANCH', defaultValue: 'dev', description: 'Deploy Beta Branch Name')
        choice(
            name: 'TARGET_OS',
            choices: ['All', 'IOS', 'Android'],
            description: 'Target Environment'
        )
    }
    
    environment {
        RUNNING_ON_CI = 'true'
        VERSION_NUMBER = "${params.VERSION_NUMBER}"
        BUILD_NUMBER = sh(script: "echo `date +%y%m.%d.%H%M`", returnStdout: true).trim()
        DEPLOY_BETA_BRANCH = "${params.DEPLOY_BETA_BRANCH}"
        TARGET_OS = "${params.TARGET_OS}"
        MATCH_GIT_BASIC_AUTHORIZATION = credentials('GHUB_CREDS_SECRET')
        MATCH_PASSWORD = credentials('MATCH_PASSWORD')
        FASTLANE_KEYCHAIN = 'fastlane.keychain'
        FASTLANE_KEYCHAIN_PASSWORD = credentials("FASTLANE_KEYCHAIN_PASSWORD")
        APP_STORE_CONNECT_API_KEY_KEY_ID = credentials("APP_STORE_CONNECT_API_KEY_KEY_ID")
        APP_STORE_CONNECT_API_KEY_ISSUER_ID = credentials("APP_STORE_CONNECT_API_KEY_ISSUER_ID")
        APP_STORE_CONNECT_API_KEY_KEY = credentials("APP_STORE_CONNECT_API_KEY_KEY")
    }

    stages {
        stage('Install') {
            steps {
                withCredentials([file(credentialsId: 'ENV_FILE_ZIP', variable: 'default_env_zip')]) {
                    sh "cp $default_env_zip default_whitelist_zip.zip"
                }
                script {
                    unzip zipFile: 'default_whitelist_zip.zip', quiet: true
                    def jsonWhitelist = readJSON file: 'default_whitelist.json'
                    def json = readJSON file: 'env/default.json.example'
                    json.optInWhiteList = jsonWhitelist.optInWhiteList
                    writeJSON file: 'env/default.json', json: json
                }
                sh "rm -f default_whitelist_zip.zip && rm -f default_whitelist.json"
                // Run yarn install for the dependencies
                sh "yarn cache clean && yarn install --network-concurrency 1"
                sh "npx jetify" // for android
            }
        }

        stage('Build') {
            parallel {
                stage('Build - IOS') {
                    when {
                        expression {
                            BRANCH_NAME == DEPLOY_BETA_BRANCH && (TARGET_OS == 'All' || TARGET_OS == 'IOS')
                        }
                    }
                    steps {
                        sh "cd ios && bundle install"
                        sh "cd ios && bundle exec pod install"
                    }
                }
                stage('Build - Android') {
                    when {
                        expression {
                            TARGET_OS == 'All' || TARGET_OS == 'Android'
                        }
                    }
                    steps {
                        // copy key.properties and copy keystore file
                        withCredentials([file(credentialsId: 'ANDROID_KEY_PROPERTIES', variable: 'android_key_properties'),
                                        file(credentialsId: 'ANDROID_KEY_PROPERTIES_STORE_FILE', variable: 'release_keystore')]) {
                            sh 'cp $android_key_properties ./android/app/key.properties'
                            sh 'cp $release_keystore ./android/app/release.keystore'
                            sh "cd android && ./gradlew assembleProdRelease -PBUILD_NUMBER=${BUILD_NUMBER}"
                            sh "echo 'Build completed and .apk file is generated. Version:${VERSION_NUMBER}, Build:${BUILD_NUMBER}'"
                        }
                    }
                }
            }
        }

        stage ('Test') {
            steps {
                sh "echo 'Currently there are no tests to run!'"
            }
        }

        stage('Upload Android') {
            when {
                expression {
                    TARGET_OS == 'All' || TARGET_OS == 'Android'
                }
            }
            steps {
                // upload apk artifact to folder(env.branch_name) in AWS S3 bucket (s3://symbol-mobile-builds/branches) 
                // note that there is a s3 bucket retention policy deleting the files older than 60 days
                sh "aws s3 cp android/app/build/outputs/apk/prod/release/ s3://symbol-mobile-builds/branches/\$BRANCH_NAME --recursive --exclude '*' --include '*.apk'"
            }
        }

        // deploy to testnet
        stage ('Deploy IOS - Alpha version') {
            when {
                expression {
                    BRANCH_NAME == DEPLOY_BETA_BRANCH && (TARGET_OS == 'All' || TARGET_OS == 'IOS')
                }
            }
            steps {
                sh '''
                    cd ios && export APP_STORE_CONNECT_API_KEY_KEY_ID=${APP_STORE_CONNECT_API_KEY_KEY_ID} \
                           && export APP_STORE_CONNECT_API_KEY_ISSUER_ID=${APP_STORE_CONNECT_API_KEY_ISSUER_ID} \
                           && export APP_STORE_CONNECT_API_KEY_KEY=${APP_STORE_CONNECT_API_KEY_KEY} \
                           && export FASTLANE_KEYCHAIN=${FASTLANE_KEYCHAIN} \
                           && export FASTLANE_KEYCHAIN_PASSWORD=${FASTLANE_KEYCHAIN_PASSWORD} \
                           && export RUNNING_ON_CI=${RUNNING_ON_CI} \
                           && export BUILD_NUMBER=${BUILD_NUMBER} \
                           && export VERSION_NUMBER=${VERSION_NUMBER} \
                           && bundle exec fastlane beta
                '''
                sh "echo 'Deployed to TestFlight. Version:${VERSION_NUMBER}, Build:${BUILD_NUMBER}'"
            }
        }
    }
    post {
        always {
            archiveArtifacts artifacts: 'android/app/build/outputs/apk/prod/release/*.apk', allowEmptyArchive: true
            archiveArtifacts artifacts: 'ios/output/*.ipa', allowEmptyArchive: true
            cleanWs()
        }
    }
}
