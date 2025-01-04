import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as ecr from 'aws-cdk-lib/aws-ecr';
import * as codebuild from 'aws-cdk-lib/aws-codebuild';
import * as codepipeline from 'aws-cdk-lib/aws-codepipeline';
import * as codepipeline_actions from 'aws-cdk-lib/aws-codepipeline-actions';
import { HttpsFargateApplicationLoadBalancedServiceStack } from './https-fargate-application-load-balanced-service-stack';

export class EcsPipelineGithub extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    //https://github.com/Ma11hewThomas/aws-cdk-https-fargate-application-load-balanced-service
    const httpsFargateService = new HttpsFargateApplicationLoadBalancedServiceStack(this, 'HttpsFargateApplicationLoadBalancedServiceStack', {
      certificateDomainName: "*.gameset.link",
      hostedZoneName: "gameset.link",
      hostedZoneId: "Z0760571A8YRISCK60YP",
      aRecordName: "api.gameset.link",
    });

    //Code pipeline
    const ecrRepo = new ecr.Repository(this, 'ecrRepo', {
      removalPolicy: cdk.RemovalPolicy.DESTROY
    });

    const githubUserName = new cdk.CfnParameter(this, "githubUserName", {
      type: "String",
      description: "Github username for source code repository",
      default: "harrispe001"
    })

    const githubRepository = new cdk.CfnParameter(this, "githubRespository", {
      type: "String",
      description: "Github source code repository",
      default: "GameSetMonoRepo"
    })

    const githubPersonalTokenSecretName = new cdk.CfnParameter(this, "githubPersonalTokenSecretName", {
      type: "String",
      description: "The name of the AWS Secrets Manager Secret which holds the GitHub Personal Access Token for this project.",
      default: "aws-samples/amazon-ecs-fargate-cdk-v2-cicd/github/personal_access_token"
    })

    const gitHubSource = codebuild.Source.gitHub({
      owner: githubUserName.valueAsString,
      repo: githubRepository.valueAsString,
      webhook: true, // optional, default: true if `webhookfilteres` were provided, false otherwise
      webhookFilters: [
        codebuild.FilterGroup.inEventOf(codebuild.EventAction.PUSH).andBranchIs('main'),
      ], // optional, by default all pushes and pull requests will trigger a build
    });

        // codebuild - project
        const project = new codebuild.Project(this, 'myProject', {
          projectName: `${this.stackName}`,
          source: gitHubSource,
          environment: {
            buildImage: codebuild.LinuxBuildImage.AMAZON_LINUX_2_2,
            privileged: true
          },
          environmentVariables: {
            'cluster_name': {
              value: `${httpsFargateService.fargateService.cluster.clusterName}`
            },
            'ecr_repo_uri': {
              value: `${ecrRepo.repositoryUri}`
            }
          },
          badge: true,
          // TODO - I had to hardcode tag here
          buildSpec: codebuild.BuildSpec.fromObject({
            version: "0.2",
            phases: {
              pre_build: {
                /*
                commands: [
                  'env',
                  'export tag=${CODEBUILD_RESOLVED_SOURCE_VERSION}'
                ]
                */
                commands: [
                  'env',
                  'export tag=latest'
                ]
              },
              build: {
                commands: [
                  'cd backend',
                  'cd GameSet',
                  `docker build -t $ecr_repo_uri:$tag .`,
                  '$(aws ecr get-login --no-include-email)',
                  'docker push $ecr_repo_uri:$tag'
                ]
              },
              post_build: {
                commands: [
                  'echo "in post-build stage"',
                  'cd ..',
                  'cd ..',
                  "printf '[{\"name\":\"gameset-backend\",\"imageUri\":\"%s\"}]' $ecr_repo_uri:$tag > imagedefinitions.json",
                  "pwd; ls -al; cat imagedefinitions.json"
                ]
              }
            },
            artifacts: {
              files: [
                'imagedefinitions.json'
              ]
            }
          })
        });
    // ***pipeline actions***

    const sourceOutput = new codepipeline.Artifact();
    const buildOutput = new codepipeline.Artifact();
    const nameOfGithubPersonTokenParameterAsString = githubPersonalTokenSecretName.valueAsString
    const sourceAction = new codepipeline_actions.GitHubSourceAction({
      actionName: 'github_source',
      owner: githubUserName.valueAsString,
      repo: githubRepository.valueAsString,
      branch: 'main',
      oauthToken: cdk.SecretValue.secretsManager(nameOfGithubPersonTokenParameterAsString),
      output: sourceOutput
    });

    const buildAction = new codepipeline_actions.CodeBuildAction({
      actionName: 'codebuild',
      project: project,
      input: sourceOutput,
      outputs: [buildOutput], // optional
    });

    const manualApprovalAction = new codepipeline_actions.ManualApprovalAction({
      actionName: 'approve',
    });

    const deployAction = new codepipeline_actions.EcsDeployAction({
      actionName: 'deployAction',
      service: httpsFargateService.fargateService.service,
      imageFile: new codepipeline.ArtifactPath(buildOutput, `imagedefinitions.json`)
    });



    // pipeline stages


    // NOTE - Approve action is commented out!
    new codepipeline.Pipeline(this, 'myecspipeline', {
      stages: [
        {
          stageName: 'source',
          actions: [sourceAction],
        },
        {
          stageName: 'build',
          actions: [buildAction],
        },
        {
          stageName: 'approve',
          actions: [manualApprovalAction],
        },
        {
          stageName: 'deploy-to-ecs',
          actions: [deployAction],
        }
      ]
    });


    ecrRepo.grantPullPush(project.role!)
    project.addToRolePolicy(new iam.PolicyStatement({
      actions: [
        "ecs:describecluster",
        "ecr:getauthorizationtoken",
        "ecr:batchchecklayeravailability",
        "ecr:batchgetimage",
        "ecr:getdownloadurlforlayer"
      ],
      resources: ["*"],
    }));


    new cdk.CfnOutput(this, "image", { value: ecrRepo.repositoryUri + ":latest" })
    new cdk.CfnOutput(this, 'loadbalancerdns', { value: httpsFargateService.fargateService.loadBalancer.loadBalancerDnsName });
  }  
}