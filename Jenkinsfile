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
        // specify branch to build
        BRANCH_TO_BUILD = "master"
        USER_CREDENTIALS = credentials('dockerhub-credentials')
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
            // Declare services here
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
