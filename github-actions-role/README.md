# Welcome to your CDK TypeScript Construct Library project!

It demonstrates a CDK Construct Library that includes:

## construct `GithubActionsRole`
The construct creates an IAM role (`GithubActionsRole`) that will authorise **already existing in AWS** OIDC Provider for GitHub Actions workflows, which will run on a specific GitHub repository. Such a role can be used by the workflows instead of stored as secrets AWS access credentials, to access AWS.
The construct defines an interface (`GithubActionsRoleProps`) to configure the creation of the role.
The interface contains following fields, which should be passed as parameters, when initiatiing an instance of the construct:
    1. *stackOutputGitHubOidcProvider* (string): name of CloudFormation stack output for an existing OIDC Provider resource for GitHub in the AWS account;
    2. *deployRole* (string): name of the IAM role to be created;
    3. *githubRepoName* (string): name of GitHub repository, which to be included in the role name (in order it to be easily differentiated amongst other similar roles) 
    4. *githubRepoID* (string): GitHub ID of the repository, to be included in tagging of Role resources;
    5. *repositoryConfig* ({ owner: string; repo: string; filter?: string }[]): The string from the JWT token used to be validated by AWS. Appended in an IAM role trust relationship. Example:
        - repo:octo-org/octo-repo:ref:refs/heads/demo-branch - only allowed from `demo-branch`
        - repo:octo-org/octo-repo:ref:refs/tags/demo-tag - only allowed from `demo-tag`.
        - repo:octo-org/octo-repo:pull_request - only allowed from the `pull_request` event.
        - repo:octo-org/octo-repo:environment:Production - only allowd from `Production` environment name.;
        @see https://docs.github.com/en/actions/deployment/security-hardening-your-deployments/about-security-hardening-with-openid-connect#configuring-the-oidc-trust-with-the-cloud
    5. *rolePolicyDocumentJSON* (string): The JSON string repesentation of an inline IAM permissions policy to be attached to the role which will be created; this will define what actions on what AWS services the role will be authorised to do; if the value is 'none', then the managed AWS policy `AdministratorAcess` will be attached


## Useful commands

 * `npm run build`   compile typescript to js
 * `npm run watch`   watch for changes and compile
 * `npm run test`    perform the jest unit tests