import { CfnOutput, Duration, RemovalPolicy } from "aws-cdk-lib";
import * as acm from "aws-cdk-lib/aws-certificatemanager";
import * as cloudfront from "aws-cdk-lib/aws-cloudfront";
import * as cloudfront_origins from "aws-cdk-lib/aws-cloudfront-origins";
import * as iam from "aws-cdk-lib/aws-iam";
import * as route53 from "aws-cdk-lib/aws-route53";
import * as targets from "aws-cdk-lib/aws-route53-targets";
import * as s3 from "aws-cdk-lib/aws-s3";
import { Construct } from "constructs";
import { aws_s3 } from "aws-cdk-lib";

export interface StaticSiteProps {
  domainName: string;
  siteSubDomain: string;
  zone: any;
}

/**
 * Static site infrastructure, which deploys site content to an S3 bucket.
 *
 * The site redirects from HTTP to HTTPS, using a CloudFront distribution,
 * Route53 alias record, and ACM certificate.
 */
export class s3_cloudfront extends Construct {
  constructor(parent: Construct, name: string, props: StaticSiteProps) {
    super(parent, name);

    const zone = props.zone;
    const siteDomain = props.siteSubDomain + "." + props.domainName;
    const cloudfrontOAI = new cloudfront.OriginAccessIdentity(
      this,
      "cloudfront-OAI",
      {
        comment: `OAI for ${name}`,
      }
    );

    //Create a second bucket with a lambda to resize images
    // const uploadBucket = new s3.Bucket(this, 'UploadBucket', {});

    // Content bucket
    const contentBucket = new s3.Bucket(this, "ContentBucket", {
      //   bucketName: siteDomain,
      publicReadAccess: false,
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,

      /**
       * The default removal policy is RETAIN, which means that cdk destroy will not attempt to delete
       * the new bucket, and it will remain in your account until manually deleted. By setting the policy to
       * DESTROY, cdk destroy will attempt to delete the bucket, but will error if the bucket is not empty.
       */
      removalPolicy: RemovalPolicy.DESTROY, // NOT recommended for production code

      /**
       * For sample purposes only, if you create an S3 bucket then populate it, stack destruction fails.  This
       * setting will enable full cleanup of the demo.
       */
      autoDeleteObjects: true, // NOT recommended for production code
    });

    const corsRule: s3.CorsRule = {
      allowedMethods: [
        s3.HttpMethods.GET,
        s3.HttpMethods.POST,
        s3.HttpMethods.PUT,
        s3.HttpMethods.DELETE,
      ],
      allowedOrigins: ["*"],

      // the properties below are optional
      allowedHeaders: ["*"],
      exposedHeaders: [""],
      // maxAge: 3000,
    };

    contentBucket.addCorsRule(corsRule);

    new CfnOutput(this, "Upload Bucket: ", {
      value: contentBucket.bucketDomainName,
    });

    // Grant access to cloudfront
    contentBucket.addToResourcePolicy(
      new iam.PolicyStatement({
        actions: ["s3:GetObject"],
        resources: [contentBucket.arnForObjects("*")],
        principals: [
          new iam.CanonicalUserPrincipal(
            cloudfrontOAI.cloudFrontOriginAccessIdentityS3CanonicalUserId
          ),
        ],
      })
    );
    new CfnOutput(this, "Bucket", { value: contentBucket.bucketName });

    // TLS certificate
    const certificate = new acm.Certificate(this, "SiteCertificate", {
      domainName: siteDomain,
      validation: acm.CertificateValidation.fromDns(zone),
    });

    new CfnOutput(this, "Certificate", { value: certificate.certificateArn });

    // CloudFront distribution
    const distribution = new cloudfront.Distribution(this, "SiteDistribution", {
      certificate: certificate,
      defaultRootObject: "index.html",
      domainNames: [siteDomain],
      minimumProtocolVersion: cloudfront.SecurityPolicyProtocol.TLS_V1_2_2021,
      errorResponses: [
        {
          httpStatus: 403,
          responseHttpStatus: 403,
          responsePagePath: "/error.html",
          ttl: Duration.minutes(30),
        },
      ],
      defaultBehavior: {
        origin: new cloudfront_origins.S3Origin(contentBucket, {
          originAccessIdentity: cloudfrontOAI,
        }),
        compress: true,
        allowedMethods: cloudfront.AllowedMethods.ALLOW_GET_HEAD_OPTIONS,
        viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
      },
    });

    new CfnOutput(this, "DistributionId", {
      value: distribution.distributionId,
    });

    // Route53 alias record for the CloudFront distribution
    new route53.ARecord(this, "SiteAliasRecord", {
      recordName: siteDomain,
      target: route53.RecordTarget.fromAlias(
        new targets.CloudFrontTarget(distribution)
      ),
      zone,
    });

    this.bucket = contentBucket;
  }
  public bucket: s3.Bucket;
}
