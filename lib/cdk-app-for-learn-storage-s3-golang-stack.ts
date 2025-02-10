import * as cdk from 'aws-cdk-lib';
import {aws_cloudfront, aws_cloudfront_origins, aws_iam, CfnOutput} from 'aws-cdk-lib';
import * as s3 from 'aws-cdk-lib/aws-s3';
import {BucketEncryption} from 'aws-cdk-lib/aws-s3';
import {Construct} from 'constructs';
import {CfnAccessKey, Group, PolicyStatement, User} from "aws-cdk-lib/aws-iam";

// import * as sqs from 'aws-cdk-lib/aws-sqs';

export class CdkAppForLearnStorageS3GolangStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // The code that defines your stack goes here

    // example resource
    // const queue = new sqs.Queue(this, 'CdkAppForLearnStorageS3GolangQueue', {
    //   visibilityTimeout: cdk.Duration.seconds(300)
    // });

   const cliUser = new User(this, 'CdkAppForLearnStorageS3GolangUser', {
     userName: 'golanguser'
   })
    const group = new Group(this, 'CdkAppForLearnStorageS3GolangGroup', {
      groupName: "managers"
    })




      /*
      group.addManagedPolicy({
            managedPolicyArn: 'arn:aws:iam::aws:policy/AdministratorAccess'
      })
*/
      const policy = new aws_iam.ManagedPolicy(this, 'CdkAppForLearnStorageS3GolangPolicyM', {

            managedPolicyName: 'manager-from-home',
            statements: [
                new PolicyStatement({
                    sid: 'AllowAllActions',
                    actions: ['iam:*','s3:*','cloudfront:*'],
                    resources: ['*'],
                    effect: aws_iam.Effect.ALLOW,

                })
            ]
      } )

      const tubelyS3Policy = new aws_iam.ManagedPolicy(this, 'CdkAppForLearnStorageS3GolangPolicyTubelyS3', {

          managedPolicyName: 'tubely-s3',
          statements: [
              new PolicyStatement({
                  sid: 'AllowAllActions',
                  actions: ['s3:PutObject', 's3:GetObject', 's3:ListBucket', 's3:DeleteObject'],
                  resources: [ 'arn:aws:s3:::tubely-forgolang-s3-course/*', 'arn:aws:s3:::tubely-forgolang-s3-course'],
                  effect: aws_iam.Effect.ALLOW
              })
          ]
      } )

    const tubleS3Role = new aws_iam.Role(this, 'CdkAppForLearnStorageS3GolangRole', {

        assumedBy: new aws_iam.ServicePrincipal('ec2.amazonaws.com'),
        roleName: 'tubely-app',
        managedPolicies: [tubelyS3Policy]
    }   )

    group.addManagedPolicy(policy)
    group.addUser(cliUser)
    const accessKey = new CfnAccessKey(this, 'CdkAppForLearnStorageS3GolangAccessKey', {
        userName: cliUser.userName
    })

    new CfnOutput(this, "accessKeyId", {
        value: accessKey.ref
    })

    new CfnOutput(this,"secretAccessKey",{
        value: accessKey.attrSecretAccessKey
    })


      const s3BucketName= "tubely-forgolang-s3-course"

        const s3Bucket = new s3.Bucket(this, 'CdkAppForLearnStorageS3GolangBucket', {
            bucketName: s3BucketName,
            removalPolicy: cdk.RemovalPolicy.DESTROY,
            versioned: false,
            objectLockEnabled: false,
            blockPublicAccess: {
                blockPublicAcls: false,
                blockPublicPolicy: false,
                ignorePublicAcls: false,
                restrictPublicBuckets: false
            }
        })


        s3Bucket.addToResourcePolicy(new PolicyStatement({
            actions: ['s3:GetObject'],
            resources: [s3Bucket.arnForObjects('portrait/*'),
                        s3Bucket.arnForObjects('landscape/*')],
            principals: [new aws_iam.AnyPrincipal()],
        }))


        new CfnOutput(this, "s3BucketName", {

            value: s3Bucket.bucketName
        })

      const s3privateBucket = new s3.Bucket(this, 'CdkAppForLearnStorageS3GolangPrivateBucket', {
            bucketName: 'tubely-private-s3-course',
            removalPolicy: cdk.RemovalPolicy.DESTROY,
            versioned: false,
            objectLockEnabled: false,
            blockPublicAccess: {
                blockPublicAcls: true,
                blockPublicPolicy: true,
                ignorePublicAcls: true,
                restrictPublicBuckets: true
            }
      } )

      const cfnDistribution = new aws_cloudfront.Distribution(this, 'CdkAppForLearnStorageS3GolangDistribution', {
          defaultBehavior:{
              origin: aws_cloudfront_origins.S3BucketOrigin.withOriginAccessControl(s3privateBucket),
                allowedMethods: aws_cloudfront.AllowedMethods.ALLOW_GET_HEAD_OPTIONS,
              viewerProtocolPolicy: aws_cloudfront.ViewerProtocolPolicy.HTTPS_ONLY
          }
      } );


      new CfnOutput(this, "cloudFrontDomainName", {
            value: cfnDistribution.domainName
      })

}
}
