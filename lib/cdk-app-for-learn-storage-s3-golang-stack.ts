import * as cdk from 'aws-cdk-lib';
import * as s3 from 'aws-cdk-lib/aws-s3';
import { Construct } from 'constructs';
import {CfnAccessKey, Group, Role, User} from "aws-cdk-lib/aws-iam";
import {aws_iam, CfnOutput} from "aws-cdk-lib";
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

  }
}
