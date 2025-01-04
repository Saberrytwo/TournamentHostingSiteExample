import * as cdk from 'aws-cdk-lib';
import {
  Certificate,
  CertificateValidation,
} from 'aws-cdk-lib/aws-certificatemanager';
import { Cluster, ContainerImage } from 'aws-cdk-lib/aws-ecs';
import { ApplicationLoadBalancedFargateService } from 'aws-cdk-lib/aws-ecs-patterns';
import { ApplicationProtocol } from 'aws-cdk-lib/aws-elasticloadbalancingv2';
import { HostedZone, ARecord, RecordTarget } from 'aws-cdk-lib/aws-route53';
import { LoadBalancerTarget } from 'aws-cdk-lib/aws-route53-targets';
import { Construct } from 'constructs';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as ecs from 'aws-cdk-lib/aws-ecs';
import { SubnetType } from 'aws-cdk-lib/aws-ec2';
import { Vpc } from 'aws-cdk-lib/aws-ec2';
import { SecurityGroup } from 'aws-cdk-lib/aws-ec2';
import { ApplicationLoadBalancer } from 'aws-cdk-lib/aws-elasticloadbalancingv2';
import { s3_cloudfront } from './s3-cloudfront-image-construct';

type HttpsFargateApplicationLoadBalancedServiceStackProps = {
  certificateDomainName: string;
  hostedZoneName: string;
  hostedZoneId: string;
  aRecordName: string;
};

//https://github.com/Ma11hewThomas/aws-cdk-https-fargate-application-load-balanced-service
//Example of how to setup https for the load balancer
export class HttpsFargateApplicationLoadBalancedServiceStack extends Construct {
  public readonly APP_PORT: number = 80;
  public fargateService: ApplicationLoadBalancedFargateService;
  constructor(
    scope: Construct,
    id: string,
    props: HttpsFargateApplicationLoadBalancedServiceStackProps
  ) {
    super(scope, id);

    const publicZone = HostedZone.fromHostedZoneAttributes(
      this,
      'HttpsFargateAlbPublicZone',
      {
        zoneName: props.hostedZoneName,
        hostedZoneId: props.hostedZoneId,
      }
    );

    const s3Construct = new s3_cloudfront(this, 's3cloudfrontConstruct', {
      domainName: 'gameset.link',
      siteSubDomain: 'cloudfront',
      zone: publicZone,
    });

    const certificate = new Certificate(this, 'HttpsFargateAlbCertificate', {
      domainName: props?.certificateDomainName,
      validation: CertificateValidation.fromDns(publicZone),
    });

    //Logging
    const logging = new ecs.AwsLogDriver({
      streamPrefix: 'ecs-logs',
    });

    //ECS Task Role
    const taskRole = new iam.Role(this, `ecs-taskrole-${cdk.Stack.name}`, {
      // roleName: `ecs-taskrole-${this.stackName}`,
      assumedBy: new iam.ServicePrincipal('ecs-tasks.amazonaws.com'),
    });

    const executionRolePolicy = new iam.PolicyStatement({
      effect: iam.Effect.ALLOW,
      resources: ['*'],
      actions: [
        'ecr:getauthorizationtoken',
        'ecr:batchchecklayeravailability',
        'ecr:getdownloadurlforlayer',
        'ecr:batchgetimage',
        'logs:createlogstream',
        'logs:putlogevents',
        'secretsmanager:GetSecretValue',
        'secretsmanager:ListSecrets',
      ],
    });

    const myBucketPolicy = new iam.PolicyStatement({
      effect: iam.Effect.ALLOW,
      // Specify the bucket ARN and an ARN for all objects within the bucket
      resources: [`${s3Construct.bucket.bucketArn}/*`],
      actions: ['s3:GetObject', 's3:PutObject', 's3:ListBucket'],
    });

    taskRole.addToPolicy(myBucketPolicy);
    taskRole.addToPolicy(executionRolePolicy);

    const vpc = new Vpc(this, 'VPCTest', {
      vpcName: 'myvpc',
      natGateways: 0,
      enableDnsHostnames: true,
      enableDnsSupport: true,
      maxAzs: 2,
      subnetConfiguration: [
        {
          mapPublicIpOnLaunch: true,
          cidrMask: 24,
          name: 'public-one',
          subnetType: SubnetType.PUBLIC,
        },
      ],
    });

    const sg = new SecurityGroup(this, 'SGTest', {
      vpc,
      securityGroupName: 'mysg',
      allowAllOutbound: true,
    });

    const lb = new ApplicationLoadBalancer(this, 'LB', {
      vpc,
      securityGroup: sg,
      internetFacing: true,
    });

    this.fargateService = new ApplicationLoadBalancedFargateService(
      this,
      'HttpsFargateAlbService',
      {
        taskImageOptions: {
          containerPort: this.APP_PORT,
          containerName: 'gameset-backend',
          enableLogging: true,
          image: ContainerImage.fromRegistry('amazon/amazon-ecs-sample'),
          logDriver: logging,
          taskRole: taskRole,
          executionRole: taskRole,
        },
        vpc,
        desiredCount: 1,
        protocol: ApplicationProtocol.HTTPS,
        loadBalancer: lb,
        assignPublicIp: true,
        publicLoadBalancer: true,
        certificate,
        redirectHTTP: true,
      }
    );

    // this.fargateService.targetGroup.configureHealthCheck({
    //     path: '/',
    // });

    const scaling = this.fargateService.service.autoScaleTaskCount({
      maxCapacity: 2,
    });
    scaling.scaleOnCpuUtilization('cpuscaling', {
      targetUtilizationPercent: 80,
      scaleInCooldown: cdk.Duration.seconds(60),
      scaleOutCooldown: cdk.Duration.seconds(60),
    });

    new ARecord(this, 'HttpsFargateAlbARecord', {
      zone: publicZone,
      recordName: props.aRecordName,
      target: RecordTarget.fromAlias(
        new LoadBalancerTarget(this.fargateService.loadBalancer)
      ),
    });
  }
}
