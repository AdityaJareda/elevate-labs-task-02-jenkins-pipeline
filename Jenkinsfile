pipeline {
	agent any

	tools {
	}

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
				sh "docker build -t ${DOCKERHUB_USERNAME}/${DOCKERHUB_IMAGE_NAME}:latest ."
			}
		}

		stage('Push toDecker Hub') {
			steps {
				echo 'Pushing image to Docker Hub...'
				withCredentials([usernamePassword(credentialsId: DOCKERHUB_CREDENTIALS_ID, usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
					sh "echo ${DOCKER_PASS} | docker login -u ${DOCKER_USER} --password-stdin"
					sh "docker push ${DOCKERHUB_USERNAME}/${DOCKER_IMAGE_NAME}:latest"
				}
			}
		}
	}

	post {
		always {
			echo 'Pipeline finished. Cleaning up...'
			sh 'docker logout'
		}

		cleanup {
			sh "docker rmi ${DOCKERHUB_USERNAME}/${DOCKER_IMAGE_NAME}:latest"
                }
	}
}
