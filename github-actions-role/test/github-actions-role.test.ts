import { expect as expectCDK, countResources } from '@aws-cdk/assert';
import * as cdk from 'aws-cdk-lib';
import * as GithubActionsRole from '../lib/index';

/*
 * Example test
 */
test('SNS Topic Created', () => {
  const app = new cdk.App();
  const stack = new cdk.Stack(app, "TestStack");
  const TestGithubActionsRoleProps : GithubActionsRole.GithubActionsRoleProps = {
    stackOutputGitHubOidcProvider: 'example-stack-output-name',
    deployRole: 'GitHubDeploy@' + 'example-repo-name',
    githubRepoName: 'example-repo-name',
    githubRepoID: 'example-repo-id',
    repositoryConfig: [
      { owner: "example-owner", repo: 'example-repo-name' }
    ],
    rolePolicyDocumentJSON: 'none'
  }
  // WHEN
  new GithubActionsRole.GithubActionsRole(stack, 'MyTestConstruct', TestGithubActionsRoleProps);
  // THEN
  expectCDK(stack).to(countResources("AWS::SNS::Topic",0));
});
