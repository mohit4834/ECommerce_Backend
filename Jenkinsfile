pipeline {

agent any

environment {
    scannerHome = tool name: 'Test_Sonar'
    KUBECONFIG = '/home/goyalmohit_test1/.kube/config'
    // KUBECONFIG = 'C:/Users/mohitgoyal/.kube/config'
    CHROME_BIN='/usr/bin/google-chrome'
    HOME = '.'
}

tools {
    nodejs 'nodejs'
    dockerTool 'dockerMohit'
}

    stages {
        stage('Build') {
            steps {
				powershell 'npm install'
            }
        }
        // stage('Test Case Execution') {
        //     when {
        //         branch 'master'
        //     }
        //     steps {
        //         powershell 'npm run test'
        //     }
        // }
        stage('Build & Push Docker Image') {
            steps {
                script {
                    dockerImage = docker.build("goyalmohit48/ecommerce-backend-2")
                    docker.withRegistry('', 'dockerHubCredentials') {
                        dockerImage.push()
                }
            }
        }
        }
        stage('Kubernetes Deployment') {
            steps{
                echo "environment variable path ${KUBECONFIG}"
                echo "workspace path is ${env.WORKSPACE}"
                powershell "kubectl --kubeconfig=${KUBECONFIG} apply -f deployment-definition.yaml"
            }
        }
    }
}
