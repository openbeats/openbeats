def buildAndUpdateCluster(String svcName) {
    String buildImageName = "thayalangr/obs-" + svcName + ":" + env.BUILD_NUMBER
    sh "docker build services/${svcName}/ -t ${buildImageName}"
    sh "docker push ${buildImageName}"
    withKubeConfig([credentialsId: 'kubeconfig']) {
        sh "kubectl set image deployments/obs-${svcName} container=${buildImageName} -n default"
    }        
}

def buildAndAddNewServiceToCluster(String svcName) {
    String buildImageName = "thayalangr/obs-" + svcName
    sh "docker build services/${svcName} -t ${buildImageName}"
    sh "docker push ${buildImageName}"
    withKubeConfig([credentialsId: 'kubeconfig']) {
        sh "kubectl apply -f k8s/deployments/${svcName}.yml -n default"
        sh "kubectl apply -f k8s/svc/${svcName}.yml -n default"
        sh "kubectl apply -f k8s/ingress/ingress.yml -n default"
    }
}

pipeline {
    environment {
        BRANCH_TO_BUILD = "master"
        USER_CREDENTIALS = credentials('dockerhub-credentials')

        HAS_NEW_SERVICE_TO_ADD = "false"
        NEW_SERVICE_NAME = "nothing"

        forceBuild_clientapp = "false"
        forceBuild_captainapp = "false"
        forceBuild_core = "false"
        forceBuild_fallback = "false"
        forceBuild_downcc = "false"
        forceBuild_auth = "false"
        forceBuild_playlist = "false"
        forceBuild_cron = "false"
    }
    agent any
    stages {
        stage("Init") {
            steps {
                echo 'Pipeline Process Initiated..'
                sh "docker login -u $USER_CREDENTIALS_USR -p $USER_CREDENTIALS_PSW"
            }
        }
        stage("Branch Check"){
            when {
                branch "$BRANCH_TO_BUILD"
            }
            stages{
                stage('clientapp') {
                    when {
                        anyOf{
                            changeset "services/clientapp/**"
                            expression { forceBuild_clientapp == "true" }
                        }
                    }
                    steps {
                        echo 'building clientapp...'
                        buildAndUpdateCluster("clientapp")
                    }
                }
                stage('captainapp') {
                    when {
                        anyOf{
                            changeset "services/captainapp/**"
                            expression { forcebuild_captainapp == "true"}

                        }
                    }
                    steps {
                        echo 'building captainapp...'
                        buildAndUpdateCluster("captainapp")
                    }
                }
                stage('core') {
                    when {
                        anyOf{
                            changeset "services/core/**"
                            expression { forcebuild_core == "true"}

                        }
                    }
                    steps {
                        echo 'building core...'
                        buildAndUpdateCluster("core")
                    }
                }
                stage('fallback') {
                    when {
                        anyOf{
                            changeset "services/fallback/**"
                            expression { forcebuild_fallback == "true"}

                        }
                    }
                    steps {
                        echo 'building fallback...'
                        buildAndUpdateCluster("fallback")
                    }
                }
                stage('downcc') {
                    when {
                        anyOf{
                            changeset "services/downcc/**"
                            expression { forcebuild_downcc == "true"}

                        }
                    }
                    steps {
                        echo 'building downcc...'
                        buildAndUpdateCluster("downcc")
                    }
                }
                stage('auth') {
                    when {
                        anyOf{
                            changeset "services/auth/**"
                            expression { forcebuild_auth == "true"}

                        }
                    }
                    steps {
                        echo 'building downcc...'
                        buildAndUpdateCluster("auth")
                    }
                }
                stage('playlist') {
                    when {
                        anyOf{
                            changeset "services/playlist/**"
                            expression { forcebuild_playlist == "true"}

                        }
                    }
                    steps {
                        echo 'building playlist...'
                        buildAndUpdateCluster("playlist")
                    }
                }
                stage('cron') {
                    when {
                        anyOf{
                            changeset "services/cron/**"
                            expression { forcebuild_cron == "true"}
                        }
                    }
                    steps {
                        echo 'building cron...'
                        buildAndUpdateCluster("cron")
                    }
                }
            }
        }
        stage("Check for New Service"){
            when {
                expression { HAS_NEW_SERVICE_TO_ADD == "true" }
            }
            stages{
                stage("Build And Deploy New Service to cluster"){
                    steps {
                        echo 'Building and Adding new Service to the cluster...'
                        buildAndAddNewServiceToCluster("$NEW_SERVICE_NAME")
                    }
                }
            }
        }
        stage("End") {
            steps {
                sh 'docker system prune -af'
                echo 'Pipeline Process Ended..'
            }
        }
    }
}
