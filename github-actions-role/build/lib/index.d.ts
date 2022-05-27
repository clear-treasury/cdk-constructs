import { Construct } from 'constructs';
export interface GithubActionsRoleProps {
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
    readonly repositoryConfig: {
        owner: string;
        repo: string;
        filter?: string;
    }[];
    readonly rolePolicyDocumentJSON: string;
}
export declare class GithubActionsRole extends Construct {
    constructor(scope: Construct, id: string, props: GithubActionsRoleProps);
}
