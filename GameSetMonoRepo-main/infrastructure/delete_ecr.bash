#!/bin/bash

# Set your AWS CLI profile and region
AWS_PROFILE="your_aws_profile"
AWS_REGION="us-east-1"

# List all repositories
repositories=$(aws ecr describe-repositories --region $AWS_REGION --query 'repositories[*].repositoryName' --output json)

# Loop through repositories and delete each one
for repo in $repositories; do

    repo=$(echo "$repo" | tr -d '"' | sed 's/,$//')

    echo "Deleting repository: $repo"
    aws ecr delete-repository --region $AWS_REGION --repository-name $repo --force
done

echo "All repositories deleted."
