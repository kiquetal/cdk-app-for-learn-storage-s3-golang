import * as cdk from 'aws-cdk-lib';
import {aws_iam, CfnOutput} from 'aws-cdk-lib';
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




      group.addManagedPolicy({
            managedPolicyArn: 'arn:aws:iam::aws:policy/AdministratorAccess'
      })


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

  }
}
