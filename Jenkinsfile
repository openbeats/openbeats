def buildAndUpdateCluster(String buildDir, String dockerImageName, String deploymentName) {
    String buildImageName = "thayalangr/" + dockerImageName + ":" + env.BUILD_NUMBER
    sh "docker build ${buildDir} -t ${buildImageName}"
    sh "docker push ${buildImageName}"
    withKubeConfig([credentialsId: 'kubeconfig']) {
        sh "kubectl set image deployments/${deploymentName} container=${buildImageName} -n default"
    }
}

def buildAndAddNewServiceToCluster(String buildDir, String dockerImageName, String deploymentName, String svcName) {
    String buildImageName = "thayalangr/" + dockerImageName
    sh "docker build ${buildDir} -t ${buildImageName}"
    sh "docker push ${buildImageName}"
    withKubeConfig([credentialsId: 'kubeconfig']) {
        sh "kubectl apply -f k8s/deployments/${svcName}.yml -n default"
        sh "kubectl apply -f k8s/svc/${svcName}.yml -n default"
        sh "kubectl apply -f k8s/ingress/ingress.yml -n default"
    }
}

pipeline {
    environment {
        BRANCH_TO_BUILD = "donotbuild"
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
                        buildAndUpdateCluster("services/clientapp/", "obs-clientapp", "obs-clientapp")
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
                        buildAndUpdateCluster("services/captainapp/", "obs-captainapp", "obs-captainapp")
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
                        buildAndUpdateCluster("services/core/", "obs-core", "obs-core")
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
                        buildAndUpdateCluster("services/fallback/", "obs-fallback", "obs-fallback")
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
                        buildAndUpdateCluster("services/downcc/", "obs-downcc", "obs-downcc")
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
                        buildAndUpdateCluster("services/auth/", "obs-auth", "obs-auth")
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
                        buildAndUpdateCluster("services/playlist/", "obs-playlist", "obs-playlist")
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
                        buildAndAddNewServiceToCluster("services/$NEW_SERVICE_NAME/", "obs-$NEW_SERVICE_NAME", "obs-$NEW_SERVICE_NAME", "$NEW_SERVICE_NAME")
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
