pipeline {
    agent any
    stages {
        stage("Init") {
            steps{
                echo 'loading init stage...'
            }
        }
        stage('build backend') {
            when {
                changeset "**/services/backend/*.*"
            }
            steps {
                echo 'building backend...'
            }
        }
        stage('build clientapp') {
            when {
                changeset "**/services/clientapp/*.*"
            }
            steps {
                echo 'building clientapp...'
            }
        }
    }
}