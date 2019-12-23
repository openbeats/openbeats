pipeline {
    agent any
    stages {
        stage('build matchengine') {
            when {
                changeset "**/services/backend/*.*"
            }
            steps {
                echo 'building match engine'
            }
        }
        stage('build posttrade') {
            when {
                changeset "**/services/clientapp/*.*"
            }
            steps {
                echo 'building post trade'
            }
        }
    }
}