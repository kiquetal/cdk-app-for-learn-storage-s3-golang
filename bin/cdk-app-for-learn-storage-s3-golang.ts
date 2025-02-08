#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { CdkAppForLearnStorageS3GolangStack } from '../lib/cdk-app-for-learn-storage-s3-golang-stack';
import {CdkForLearnDev} from "../lib/cdk-for-learn-dev";

const app = new cdk.App();
cdk.Tags.of(app).add('project','golang-s3');
new CdkAppForLearnStorageS3GolangStack(app, 'CdkAppForLearnStorageS3GolangStack', {
    env:{
        account: process.env.CDK_DEFAULT_ACCOUNT,
        region: process.env.CDK_DEFAULT_REGION
    }
});



new CdkForLearnDev(app,'CdkAppForLearnDEv',{
    env:{
        account: process.env.CDK_DEFAULT_ACCOUNT,
        region: process.env.CDK_DEFAULT_REGION
    }
})
