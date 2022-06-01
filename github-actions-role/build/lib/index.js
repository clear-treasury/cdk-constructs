"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GithubActionsRole = void 0;
const cdk = __importStar(require("aws-cdk-lib"));
const iam = __importStar(require("aws-cdk-lib/aws-iam"));
const constructs_1 = require("constructs");
class GithubActionsRole extends constructs_1.Construct {
    constructor(scope, id, props) {
        super(scope, id);
        // Define construct contents here
        const githubDomain = 'token.actions.githubusercontent.com';
        const cfnOIDCProviderArn = cdk.Fn.importValue(props.stackOutputGitHubOidcProvider);
        const iamRepoDeployAccess = props.repositoryConfig.map(r => { var _a; return `repo:${r.owner}/${r.repo}:${(_a = r.filter) !== null && _a !== void 0 ? _a : '*'}`; });
        // grant only requests coming from a specific GitHub repository.
        const conditions = {
            StringLike: {
                [`${githubDomain}:sub`]: iamRepoDeployAccess,
            },
        };
        const basicPolicyDocumentJSON = `
    {
      "Version": "2012-10-17",
      "Statement": [
                {
          "Action": [
              "sts:AssumeRole"
          ],
          "Resource": "arn:aws:iam::*:role/cdk-*",
          "Effect": "Allow"
        }
      ]
    }
    `;
        const gitHubOIDCRole = new iam.Role(this, 'Role', {
            assumedBy: new iam.WebIdentityPrincipal(cfnOIDCProviderArn, conditions),
            roleName: props.deployRole,
            description: 'This role is used by GitHub Actions to deploy with AWS CDK or Terraform on the target AWS account',
            maxSessionDuration: cdk.Duration.hours(1),
        });
        const basicPolicyJSONParsed = JSON.parse(basicPolicyDocumentJSON);
        const oidcRoleBasicPolicyDocument = iam.PolicyDocument.fromJson(basicPolicyJSONParsed);
        const oidcRoleBasicPolicy = new iam.Policy(this, 'RoleBasicPolicy', { document: oidcRoleBasicPolicyDocument, policyName: 'GitHubActionsRoleBasicPolicy' });
        gitHubOIDCRole.attachInlinePolicy(oidcRoleBasicPolicy);
        if (props.rolePolicyDocumentJSON) {
            const customPolicyJSONParsed = JSON.parse(props.rolePolicyDocumentJSON);
            const oidcRoleCustomPolicyDocument = iam.PolicyDocument.fromJson(customPolicyJSONParsed);
            const oidcRoleCustomPolicy = new iam.Policy(this, 'RoleCustomPolicy', { document: oidcRoleCustomPolicyDocument, policyName: 'GitHubActionsRoleCustomPolicy' });
            gitHubOIDCRole.attachInlinePolicy(oidcRoleCustomPolicy);
        }
        if ((props.githubRepoName) && (props.githubRepoID)) {
            cdk.Tags.of(gitHubOIDCRole).add('GitHubRepositoryName', props.githubRepoName);
            cdk.Tags.of(gitHubOIDCRole).add('GitHubRepositoryID', props.githubRepoID);
        }
    }
}
exports.GithubActionsRole = GithubActionsRole;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9saWIvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSxpREFBbUM7QUFDbkMseURBQTJDO0FBQzNDLDJDQUF1QztBQXlCdkMsTUFBYSxpQkFBa0IsU0FBUSxzQkFBUztJQUU5QyxZQUFZLEtBQWdCLEVBQUUsRUFBVSxFQUFFLEtBQTZCO1FBQ3JFLEtBQUssQ0FBQyxLQUFLLEVBQUUsRUFBRSxDQUFDLENBQUM7UUFFakIsaUNBQWlDO1FBQ2pDLE1BQU0sWUFBWSxHQUFHLHFDQUFxQyxDQUFDO1FBQzNELE1BQU0sa0JBQWtCLEdBQUcsR0FBRyxDQUFDLEVBQUUsQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDLDZCQUE2QixDQUFDLENBQUM7UUFDbkYsTUFBTSxtQkFBbUIsR0FBRyxLQUFLLENBQUMsZ0JBQWdCLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLFdBQUMsT0FBQSxRQUFRLENBQUMsQ0FBQyxLQUFLLElBQUksQ0FBQyxDQUFDLElBQUksSUFBSSxNQUFBLENBQUMsQ0FBQyxNQUFNLG1DQUFJLEdBQUcsRUFBRSxDQUFBLEVBQUEsQ0FBQyxDQUFDO1FBRTVHLGdFQUFnRTtRQUNoRSxNQUFNLFVBQVUsR0FBbUI7WUFDakMsVUFBVSxFQUFFO2dCQUNaLENBQUMsR0FBRyxZQUFZLE1BQU0sQ0FBQyxFQUFFLG1CQUFtQjthQUMzQztTQUNGLENBQUM7UUFFRixNQUFNLHVCQUF1QixHQUFHOzs7Ozs7Ozs7Ozs7O0tBYS9CLENBQUE7UUFDRCxNQUFNLGNBQWMsR0FBRyxJQUFJLEdBQUcsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLE1BQU0sRUFBRTtZQUNoRCxTQUFTLEVBQUUsSUFBSSxHQUFHLENBQUMsb0JBQW9CLENBQUMsa0JBQWtCLEVBQUUsVUFBVSxDQUFDO1lBQ3ZFLFFBQVEsRUFBRSxLQUFLLENBQUMsVUFBVTtZQUMxQixXQUFXLEVBQUUsbUdBQW1HO1lBQ2hILGtCQUFrQixFQUFFLEdBQUcsQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztTQUMxQyxDQUFDLENBQUM7UUFFSCxNQUFNLHFCQUFxQixHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsdUJBQXVCLENBQUMsQ0FBQztRQUNsRSxNQUFNLDJCQUEyQixHQUFHLEdBQUcsQ0FBQyxjQUFjLENBQUMsUUFBUSxDQUFDLHFCQUFxQixDQUFDLENBQUM7UUFDdkYsTUFBTSxtQkFBbUIsR0FBRyxJQUFJLEdBQUcsQ0FBQyxNQUFNLENBQUMsSUFBSSxFQUFFLGlCQUFpQixFQUFFLEVBQUMsUUFBUSxFQUFFLDJCQUEyQixFQUFFLFVBQVUsRUFBRSw4QkFBOEIsRUFBQyxDQUFDLENBQUM7UUFDekosY0FBYyxDQUFDLGtCQUFrQixDQUFDLG1CQUFtQixDQUFDLENBQUM7UUFFdkQsSUFBSyxLQUFLLENBQUMsc0JBQXNCLEVBQ2pDO1lBQ0UsTUFBTSxzQkFBc0IsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxzQkFBc0IsQ0FBQyxDQUFDO1lBQ3hFLE1BQU0sNEJBQTRCLEdBQUcsR0FBRyxDQUFDLGNBQWMsQ0FBQyxRQUFRLENBQUMsc0JBQXNCLENBQUMsQ0FBQztZQUN6RixNQUFNLG9CQUFvQixHQUFHLElBQUksR0FBRyxDQUFDLE1BQU0sQ0FBQyxJQUFJLEVBQUUsa0JBQWtCLEVBQUUsRUFBQyxRQUFRLEVBQUUsNEJBQTRCLEVBQUUsVUFBVSxFQUFFLCtCQUErQixFQUFDLENBQUMsQ0FBQztZQUM3SixjQUFjLENBQUMsa0JBQWtCLENBQUMsb0JBQW9CLENBQUMsQ0FBQztTQUN6RDtRQUVELElBQUssQ0FBRSxLQUFLLENBQUMsY0FBYyxDQUFFLElBQUksQ0FBRSxLQUFLLENBQUMsWUFBWSxDQUFFLEVBQ3ZEO1lBQ0UsR0FBRyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsY0FBYyxDQUFDLENBQUMsR0FBRyxDQUFDLHNCQUFzQixFQUFFLEtBQUssQ0FBQyxjQUFjLENBQUMsQ0FBQztZQUM5RSxHQUFHLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxjQUFjLENBQUMsQ0FBQyxHQUFHLENBQUMsb0JBQW9CLEVBQUUsS0FBSyxDQUFDLFlBQVksQ0FBQyxDQUFDO1NBQzNFO0lBQ0gsQ0FBQztDQUNGO0FBekRELDhDQXlEQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIGNkayBmcm9tICdhd3MtY2RrLWxpYic7XG5pbXBvcnQgKiBhcyBpYW0gZnJvbSAnYXdzLWNkay1saWIvYXdzLWlhbSc7XG5pbXBvcnQgeyBDb25zdHJ1Y3QgfSBmcm9tICdjb25zdHJ1Y3RzJztcblxuZXhwb3J0IGludGVyZmFjZSBHaXRodWJBY3Rpb25zUm9sZVByb3BzIHtcbiAgLy8gRGVmaW5lIGNvbnN0cnVjdCBwcm9wZXJ0aWVzIGhlcmVcbiAgcmVhZG9ubHkgc3RhY2tPdXRwdXRHaXRIdWJPaWRjUHJvdmlkZXI6IHN0cmluZztcbiAgcmVhZG9ubHkgZGVwbG95Um9sZTogc3RyaW5nO1xuICByZWFkb25seSBnaXRodWJSZXBvTmFtZTogc3RyaW5nO1xuICByZWFkb25seSBnaXRodWJSZXBvSUQ6IHN0cmluZztcbiAgLyoqXG4gICAqIFRoZSBzdWIgcHJlZml4IHN0cmluZyBmcm9tIHRoZSBKV1QgdG9rZW4gdXNlZCB0byBiZSB2YWxpZGF0ZWQgYnkgQVdTLiBBcHBlbmRlZCBhZnRlciBgcmVwbzoke293bmVyfS8ke3JlcG99OmBcbiAgICogaW4gYW4gSUFNIHJvbGUgdHJ1c3QgcmVsYXRpb25zaGlwLiBUaGUgZGVmYXVsdCB2YWx1ZSAnKicgaW5kaWNhdGVzIGFsbCBicmFuY2hlcyBhbmQgYWxsIHRhZ3MgZnJvbSB0aGlzIHJlcG8uXG4gICAqXG4gICAqIEV4YW1wbGU6XG4gICAqIHJlcG86b2N0by1vcmcvb2N0by1yZXBvOnJlZjpyZWZzL2hlYWRzL2RlbW8tYnJhbmNoIC0gb25seSBhbGxvd2VkIGZyb20gYGRlbW8tYnJhbmNoYFxuICAgKiByZXBvOm9jdG8tb3JnL29jdG8tcmVwbzpyZWY6cmVmcy90YWdzL2RlbW8tdGFnIC0gb25seSBhbGxvd2VkIGZyb20gYGRlbW8tdGFnYC5cbiAgICogcmVwbzpvY3RvLW9yZy9vY3RvLXJlcG86cHVsbF9yZXF1ZXN0IC0gb25seSBhbGxvd2VkIGZyb20gdGhlIGBwdWxsX3JlcXVlc3RgIGV2ZW50LlxuICAgKiByZXBvOm9jdG8tb3JnL29jdG8tcmVwbzplbnZpcm9ubWVudDpQcm9kdWN0aW9uIC0gb25seSBhbGxvd2QgZnJvbSBgUHJvZHVjdGlvbmAgZW52aXJvbm1lbnQgbmFtZS5cbiAgICpcbiAgICogQGRlZmF1bHQgJyonXG4gICAqIEBzZWUgaHR0cHM6Ly9kb2NzLmdpdGh1Yi5jb20vZW4vYWN0aW9ucy9kZXBsb3ltZW50L3NlY3VyaXR5LWhhcmRlbmluZy15b3VyLWRlcGxveW1lbnRzL2Fib3V0LXNlY3VyaXR5LWhhcmRlbmluZy13aXRoLW9wZW5pZC1jb25uZWN0I2NvbmZpZ3VyaW5nLXRoZS1vaWRjLXRydXN0LXdpdGgtdGhlLWNsb3VkXG4gICAqL1xuICByZWFkb25seSByZXBvc2l0b3J5Q29uZmlnOiB7IG93bmVyOiBzdHJpbmc7IHJlcG86IHN0cmluZzsgZmlsdGVyPzogc3RyaW5nIH1bXTtcbiAgcmVhZG9ubHkgcm9sZVBvbGljeURvY3VtZW50SlNPTj86IHN0cmluZ1xufVxuXG5leHBvcnQgY2xhc3MgR2l0aHViQWN0aW9uc1JvbGUgZXh0ZW5kcyBDb25zdHJ1Y3Qge1xuXG4gIGNvbnN0cnVjdG9yKHNjb3BlOiBDb25zdHJ1Y3QsIGlkOiBzdHJpbmcsIHByb3BzOiBHaXRodWJBY3Rpb25zUm9sZVByb3BzKSB7XG4gICAgc3VwZXIoc2NvcGUsIGlkKTtcblxuICAgIC8vIERlZmluZSBjb25zdHJ1Y3QgY29udGVudHMgaGVyZVxuICAgIGNvbnN0IGdpdGh1YkRvbWFpbiA9ICd0b2tlbi5hY3Rpb25zLmdpdGh1YnVzZXJjb250ZW50LmNvbSc7XG4gICAgY29uc3QgY2ZuT0lEQ1Byb3ZpZGVyQXJuID0gY2RrLkZuLmltcG9ydFZhbHVlKHByb3BzLnN0YWNrT3V0cHV0R2l0SHViT2lkY1Byb3ZpZGVyKTtcbiAgICBjb25zdCBpYW1SZXBvRGVwbG95QWNjZXNzID0gcHJvcHMucmVwb3NpdG9yeUNvbmZpZy5tYXAociA9PiBgcmVwbzoke3Iub3duZXJ9LyR7ci5yZXBvfToke3IuZmlsdGVyID8/ICcqJ31gKTtcblxuICAgIC8vIGdyYW50IG9ubHkgcmVxdWVzdHMgY29taW5nIGZyb20gYSBzcGVjaWZpYyBHaXRIdWIgcmVwb3NpdG9yeS5cbiAgICBjb25zdCBjb25kaXRpb25zOiBpYW0uQ29uZGl0aW9ucyA9IHtcbiAgICAgIFN0cmluZ0xpa2U6IHtcbiAgICAgIFtgJHtnaXRodWJEb21haW59OnN1YmBdOiBpYW1SZXBvRGVwbG95QWNjZXNzLFxuICAgICAgfSxcbiAgICB9O1xuICAgIFxuICAgIGNvbnN0IGJhc2ljUG9saWN5RG9jdW1lbnRKU09OID0gYFxuICAgIHtcbiAgICAgIFwiVmVyc2lvblwiOiBcIjIwMTItMTAtMTdcIixcbiAgICAgIFwiU3RhdGVtZW50XCI6IFtcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgXCJBY3Rpb25cIjogW1xuICAgICAgICAgICAgICBcInN0czpBc3N1bWVSb2xlXCJcbiAgICAgICAgICBdLFxuICAgICAgICAgIFwiUmVzb3VyY2VcIjogXCJhcm46YXdzOmlhbTo6Kjpyb2xlL2Nkay0qXCIsXG4gICAgICAgICAgXCJFZmZlY3RcIjogXCJBbGxvd1wiXG4gICAgICAgIH1cbiAgICAgIF1cbiAgICB9XG4gICAgYFxuICAgIGNvbnN0IGdpdEh1Yk9JRENSb2xlID0gbmV3IGlhbS5Sb2xlKHRoaXMsICdSb2xlJywge1xuICAgICAgYXNzdW1lZEJ5OiBuZXcgaWFtLldlYklkZW50aXR5UHJpbmNpcGFsKGNmbk9JRENQcm92aWRlckFybiwgY29uZGl0aW9ucyksXG4gICAgICByb2xlTmFtZTogcHJvcHMuZGVwbG95Um9sZSxcbiAgICAgIGRlc2NyaXB0aW9uOiAnVGhpcyByb2xlIGlzIHVzZWQgYnkgR2l0SHViIEFjdGlvbnMgdG8gZGVwbG95IHdpdGggQVdTIENESyBvciBUZXJyYWZvcm0gb24gdGhlIHRhcmdldCBBV1MgYWNjb3VudCcsXG4gICAgICBtYXhTZXNzaW9uRHVyYXRpb246IGNkay5EdXJhdGlvbi5ob3VycygxKSxcbiAgICB9KTtcbiAgICBcbiAgICBjb25zdCBiYXNpY1BvbGljeUpTT05QYXJzZWQgPSBKU09OLnBhcnNlKGJhc2ljUG9saWN5RG9jdW1lbnRKU09OKTtcbiAgICBjb25zdCBvaWRjUm9sZUJhc2ljUG9saWN5RG9jdW1lbnQgPSBpYW0uUG9saWN5RG9jdW1lbnQuZnJvbUpzb24oYmFzaWNQb2xpY3lKU09OUGFyc2VkKTtcbiAgICBjb25zdCBvaWRjUm9sZUJhc2ljUG9saWN5ID0gbmV3IGlhbS5Qb2xpY3kodGhpcywgJ1JvbGVCYXNpY1BvbGljeScsIHtkb2N1bWVudDogb2lkY1JvbGVCYXNpY1BvbGljeURvY3VtZW50LCBwb2xpY3lOYW1lOiAnR2l0SHViQWN0aW9uc1JvbGVCYXNpY1BvbGljeSd9KTtcbiAgICBnaXRIdWJPSURDUm9sZS5hdHRhY2hJbmxpbmVQb2xpY3kob2lkY1JvbGVCYXNpY1BvbGljeSk7XG5cbiAgICBpZiAoIHByb3BzLnJvbGVQb2xpY3lEb2N1bWVudEpTT04gKVxuICAgIHtcbiAgICAgIGNvbnN0IGN1c3RvbVBvbGljeUpTT05QYXJzZWQgPSBKU09OLnBhcnNlKHByb3BzLnJvbGVQb2xpY3lEb2N1bWVudEpTT04pO1xuICAgICAgY29uc3Qgb2lkY1JvbGVDdXN0b21Qb2xpY3lEb2N1bWVudCA9IGlhbS5Qb2xpY3lEb2N1bWVudC5mcm9tSnNvbihjdXN0b21Qb2xpY3lKU09OUGFyc2VkKTtcbiAgICAgIGNvbnN0IG9pZGNSb2xlQ3VzdG9tUG9saWN5ID0gbmV3IGlhbS5Qb2xpY3kodGhpcywgJ1JvbGVDdXN0b21Qb2xpY3knLCB7ZG9jdW1lbnQ6IG9pZGNSb2xlQ3VzdG9tUG9saWN5RG9jdW1lbnQsIHBvbGljeU5hbWU6ICdHaXRIdWJBY3Rpb25zUm9sZUN1c3RvbVBvbGljeSd9KTtcbiAgICAgIGdpdEh1Yk9JRENSb2xlLmF0dGFjaElubGluZVBvbGljeShvaWRjUm9sZUN1c3RvbVBvbGljeSk7XG4gICAgfVxuICAgIFxuICAgIGlmICggKCBwcm9wcy5naXRodWJSZXBvTmFtZSApICYmICggcHJvcHMuZ2l0aHViUmVwb0lEICkgKVxuICAgIHtcbiAgICAgIGNkay5UYWdzLm9mKGdpdEh1Yk9JRENSb2xlKS5hZGQoJ0dpdEh1YlJlcG9zaXRvcnlOYW1lJywgcHJvcHMuZ2l0aHViUmVwb05hbWUpO1xuICAgICAgY2RrLlRhZ3Mub2YoZ2l0SHViT0lEQ1JvbGUpLmFkZCgnR2l0SHViUmVwb3NpdG9yeUlEJywgcHJvcHMuZ2l0aHViUmVwb0lEKTtcbiAgICB9XG4gIH1cbn1cbiJdfQ==