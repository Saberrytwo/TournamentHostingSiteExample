# Welcome to your CDK TypeScript project

This project pulls heavily from two different projects:

1. https://github.com/aws-samples/amazon-ecs-fargate-cdk-v2-cicd/tree/main/cdk-v2
   This is an aws sample project that creates an ApplicationLoadBalancedFargateService and a codepipeline to update the task definitions

2. https://github.com/Ma11hewThomas/aws-cdk-https-fargate-application-load-balanced-service
   This is an example that shows how to make a ApplicationLoadBalancedFargateService use https

3. S3 bucket with changes
   //https://github.com/willdady/aws-cdn-image-resizer/blob/main/lambda/image-processor/index.ts
   //guide https://kieron-mckenna.medium.com/s3-image-optimization-and-compression-with-the-cdk-a-typescript-lambda-and-sharp-894b272d2d8e

//https://github.com/aws-samples/aws-cdk-examples/blob/master/typescript/static-site/static-site.ts#L37

Some variations that were made:

1. This uses my github project
2. The .fromRegistry container and the container that gets pushed to the ECR repo need to run on the same port
3. Make sure that the health check is set so the ALB knows the fargate tasks are healthy
4. You need to register a domain or not use the https load balancer things.

This is a blog to only run the code pipeline when certain folders get pushed to in the monorepo (not yet followed)
https://aws.amazon.com/blogs/devops/integrate-github-monorepo-with-aws-codepipeline-to-run-project-specific-ci-cd-pipelines/

## Useful commands

- `npm run build` compile typescript to js
- `npm run watch` watch for changes and compile
- `npm run test` perform the jest unit tests
- `cdk deploy` deploy this stack to your default AWS account/region
- `cdk diff` compare deployed stack with current state
- `cdk synth` emits the synthesized CloudFormation template
