pipeline {
    agent any
    stages {
        stage('build matchengine') {
            when {
                changeset "**/matchengine/*.*"
            }
            steps {
                echo 'building match engine'
            }
        }
        stage('build posttrade') {
            when {
                changeset "**/posttrade/*.*"
            }
            steps {
                echo 'building post trade'
            }
        }
    }
}