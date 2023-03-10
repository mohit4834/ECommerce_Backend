pipeline {

agent any

environment {
    scannerHome = tool name: 'Test_Sonar'
    KUBECONFIG = 'C:/Users/mohitgoyal/.kube/config'
}

tools {
    nodejs 'nodejs'
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
        stage('Kubernetes Deployment') {
            steps{
                echo "environment variable path ${KUBECONFIG}"
                echo "workspace path is ${env.WORKSPACE}"
                powershell "kubectl --kubeconfig=${KUBECONFIG} apply -f deployment-definition.yaml"
            }
        }
    }
}
