# S3 Storage Infrastructure for Golang Project

This CDK TypeScript project was created to be used for another golang project to put/retrieve data from S3.

## Infrastructure Resources

This CDK stack creates the following AWS resources:

* **S3 Buckets**:
  * `tubely-forgolang-s3-course` - Public bucket for storing and retrieving data
  * `tubely-private-s3-course` - Private bucket with CloudFront distribution
* **IAM Resources**:
  * User `golanguser` with access keys for programmatic access
  * Group `managers` with appropriate permissions
  * Role `tubely-app` with S3 access policies
  * Custom policies for S3 operations
* **CloudFront Distribution**:
  * Distribution for secure access to the private S3 bucket

## Useful commands

* `npm run build`   compile typescript to js
* `npm run watch`   watch for changes and compile
* `npm run test`    perform the jest unit tests
* `npx cdk deploy`  deploy this stack to your default AWS account/region
* `npx cdk diff`    compare deployed stack with current state
* `npx cdk synth`   emits the synthesized CloudFormation template

### Use the profile devKiquetal to everything related to infra
