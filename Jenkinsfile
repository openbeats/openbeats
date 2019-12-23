pipeline {
    agent any
    stages {
        stage("Init") {
            steps {
                echo 'Pipeline Process Initiated..'
            }
        }
        stage("Branch Check"){
            // specify branch to build
            when {
                branch 'CICD'
            }
            // Declare services here
            stages{
                stage('Clientapp') {
                    when {
                        changeset "services/clientapp/**"
                    }
                    steps {
                        echo 'building clientapp...'
                    }
                }
                stage('backend') {
                    when {
                        changeset "services/backend/**"
                    }
                    steps {
                        echo 'building backend...'
                    }
                }
            }
        }
        stage("End") {
            steps {
                echo 'Pipeline Process Ended..'
            }
        }
    }
}