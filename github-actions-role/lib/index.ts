import * as cdk from 'aws-cdk-lib';
import * as iam from 'aws-cdk-lib/aws-iam';
import { Construct } from 'constructs';

export interface GithubActionsRoleProps {
  // Define construct properties here
  readonly stackOutputGitHubOidcProvider: string;
  readonly deployRole: string;
  readonly githubRepoName: string;
  readonly githubRepoID: string;
  /**
   * The sub prefix string from the JWT token used to be validated by AWS. Appended after `repo:${owner}/${repo}:`
   * in an IAM role trust relationship. The default value '*' indicates all branches and all tags from this repo.
   *
   * Example:
   * repo:octo-org/octo-repo:ref:refs/heads/demo-branch - only allowed from `demo-branch`
   * repo:octo-org/octo-repo:ref:refs/tags/demo-tag - only allowed from `demo-tag`.
   * repo:octo-org/octo-repo:pull_request - only allowed from the `pull_request` event.
   * repo:octo-org/octo-repo:environment:Production - only allowd from `Production` environment name.
   *
   * @default '*'
   * @see https://docs.github.com/en/actions/deployment/security-hardening-your-deployments/about-security-hardening-with-openid-connect#configuring-the-oidc-trust-with-the-cloud
   */
  readonly repositoryConfig: { owner: string; repo: string; filter?: string }[];
  readonly rolePolicyDocumentJSON: string
}

export class GithubActionsRole extends Construct {

  constructor(scope: Construct, id: string, props: GithubActionsRoleProps) {
    super(scope, id);

    // Define construct contents here
    const githubDomain = 'token.actions.githubusercontent.com';
      const cfnOIDCProviderArn = cdk.Fn.importValue(props.stackOutputGitHubOidcProvider);
      const iamRepoDeployAccess = props.repositoryConfig.map(r => `repo:${r.owner}/${r.repo}:${r.filter ?? '*'}`);

      // grant only requests coming from a specific GitHub repository.
      const conditions: iam.Conditions = {
        StringLike: {
        [`${githubDomain}:sub`]: iamRepoDeployAccess,
        },
      };

      const gitHubOIDCRole = new iam.Role(this, 'Role', {
        assumedBy: new iam.WebIdentityPrincipal(cfnOIDCProviderArn, conditions),
        roleName: props.deployRole,
        description: 'This role is used by GitHub Actions to deploy with AWS CDK or Terraform on the target AWS account',
        maxSessionDuration: cdk.Duration.hours(1),
      });
      
      if ( props.rolePolicyDocumentJSON !== 'none' )
      {
        const policyJSONParsed = JSON.parse(props.rolePolicyDocumentJSON);
        const oidcRolePolicyDocument = iam.PolicyDocument.fromJson(policyJSONParsed);
        const oidcRolePolicy = new iam.Policy(this, 'RolePolicy', {document: oidcRolePolicyDocument, policyName: 'GitHubDeployRolePolicy'});
        gitHubOIDCRole.attachInlinePolicy(oidcRolePolicy);
      }
      else
      {
        gitHubOIDCRole.addManagedPolicy(iam.ManagedPolicy.fromAwsManagedPolicyName('AdministratorAccess'));
      }
      
      if ( props.githubRepoName !== '' && props.githubRepoID !== '')
      {
        cdk.Tags.of(gitHubOIDCRole).add('GitHubRepositoryName', props.githubRepoName);
        cdk.Tags.of(gitHubOIDCRole).add('GitHubRepositoryID', props.githubRepoID);
      }
  }
}
