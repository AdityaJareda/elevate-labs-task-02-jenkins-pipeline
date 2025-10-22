pipeline {
	agent any

	environment {
		DOCKERHUB_CREDENTIALS_ID = 'dockerhub-credentials'
		DOCKERHUB_USERNAME = 'adityajareda'
		DOCKER_IMAGE_NAME = 'nodejs-demo-app'
	}

	stages {
		stage('Install Dependencies') {
			steps {
				echo 'Installing Node.js dependencies ...'
				sh 'npm ci --only=production'
			}
		}

		stage('Run Tests') {
			steps {
				echo 'Running tests...'
				sh 'npm test'
			}
		}

		stage('Build Docker Image') {
			steps {
				echo 'Building the Docker image...'
				sh "docker build -t ${DOCKERHUB_USERNAME}/${DOCKER_IMAGE_NAME}:latest ."
			}
		}

		stage('Push to Docker Hub') {
			steps {
				echo 'Pushing image to Docker Hub...'
				withCredentials([usernamePassword(credentialsId: DOCKERHUB_CREDENTIALS_ID, usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
					sh "echo ${DOCKER_PASS} | docker login -u ${DOCKER_USER} --password-stdin"
					sh "docker push ${DOCKERHUB_USERNAME}/${DOCKER_IMAGE_NAME}:latest"
				}
			}
		}

		stage('Deploy and Test') {
			steps {
				script {
					def containerName = "nodejs-test-${BUILD_NUMBER}"
					def testPort = "90${BUILD_NUMBER}"

					echo "Deploying test container: ${containerName} on port ${testPort}"
					sh "docker run --rm -d -p ${testPort}:8080 --name ${containerName} ${DOCKERHUB_USERNAME}/${DOCKER_IMAGE_NAME}:latest"

					echo 'Pausing for 5 seconds to allow the application to start...'
					sh 'sleep 5'

					echo 'Testing application endpoint...'
					sh "curl -f http://localhost:${testPort} || exit 1"

					echo 'Test successful! Stopping container...'
					sh "docker stop ${containerName}"
				}
			}
		}
				
	}

	post {
		always {
			echo 'Pipeline finished. Cleaning up...'
			sh 'docker logout'
		}
	}
}
