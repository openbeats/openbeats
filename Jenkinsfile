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
        sh "kubectl apply -f k8s/deployments/${svcName}.yml"
        sh "kubectl apply -f k8s/svc/${svcName}.yml"
        sh "kubectl apply -f k8s/ingress/ingress.yml"
    }
}

pipeline {
    environment {
        BRANCH_TO_BUILD = "master"
        USER_CREDENTIALS = credentials('dockerhub-credentials')
        HAS_NEW_SERVICE_TO_ADD = "true"
        NEW_SERVICE_NAME = "playlist"
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
                        changeset "services/clientapp/**"
                    }
                    steps {
                        echo 'building clientapp...'
                        buildAndUpdateCluster("services/clientapp/", "obs-clientapp", "obs-clientapp")
                    }
                }
                stage('captainapp') {
                    when {
                        changeset "services/captainapp/**"
                    }
                    steps {
                        echo 'building captainapp...'
                        buildAndUpdateCluster("services/captianapp/", "obs-captianapp", "obs-captianapp")
                    }
                }
                stage('server') {
                    when {
                        changeset "services/server/**"
                    }
                    steps {
                        echo 'building server...'
                        buildAndUpdateCluster("services/server/", "obs-server", "obs-server")
                    }
                }
                stage('fallback') {
                    when {
                        changeset "services/fallback/**"
                    }
                    steps {
                        echo 'building fallback...'
                        buildAndUpdateCluster("services/fallback/", "obs-fallback", "obs-fallback")
                    }
                }
                stage('downcc') {
                    when {
                        changeset "services/downcc/**"
                    }
                    steps {
                        echo 'building downcc...'
                        buildAndUpdateCluster("services/downcc/", "obs-downcc", "obs-downcc")
                    }
                }
                stage('auth') {
                    when {
                        changeset "services/auth/**"
                    }
                    steps {
                        echo 'building downcc...'
                        buildAndUpdateCluster("services/auth/", "obs-auth", "obs-auth")
                    }
                }
                stage('playlist') {
                    when {
                        changeset "services/playlist/**"
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
