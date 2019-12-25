def buildAndUpdateCluster(String buildDir, String dockerImageName, String deploymentName) {
    String buildImageName = "thayalangr/" + dockerImageName + ":" + env.BUILD_NUMBER
    // build docker image
    sh "docker build ${buildDir} -t ${buildImageName}"
    // push docker image to hub
    sh "docker push ${buildImageName}"
    // rollout cluster
    withKubeConfig([credentialsId: 'kubeconfig']) {
        sh "kubectl set image deployments/${deploymentName} container=${buildImageName} -n default"
    }
}

pipeline {
    environment {
        BRANCH_TO_BUILD = "master"
        USER_CREDENTIALS = credentials('dockerhub-credentials')
    }
    agent any
    stages {
        stage("Init") {
            steps {
                echo 'Pipeline Process Initiated..'
                sh "docker login -u $USER_CREDENTIALS_USR -p $USER_CREDENTIALS_PSW"
                withKubeConfig([credentialsId: 'kubeconfig']) {
                    sh "kubectl get deployments -n default"
                }
            }
        }
        stage("Branch Check"){
            // specify branch to build
            when {
                branch "$BRANCH_TO_BUILD"
            }
            // Declare services here
            stages{
                stage('Clientapp') {
                    when {
                        changeset "services/clientapp/**"
                    }
                    steps {
                        echo 'building clientapp...'
                        buildAndUpdateCluster("services/clientapp/", "obs-clientapp", "obs-clientapp")
                    }
                }
                stage('backend') {
                    when {
                        changeset "services/server/**"
                    }
                    steps {
                        echo 'building backend...'
                        buildAndUpdateCluster("services/server/", "obs-server", "obs-server")
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
