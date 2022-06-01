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
            "cloudformation:DescribeStacks",
            "cloudformation:GetTemplate"
          ],
        "Resource": "*",
        "Effect": "Allow"
        },
        {
          "Action": [
            "ssm:GetParameter"
          ],
        "Resource": "*",
        "Effect": "Allow"
        },
        {
          "Action": [
              "secretsmanager:GetSecretValue"
          ],
          "Resource": "*",
          "Effect": "Allow"
        },
        {
          "Action": [
              "iam:CreatePolicy*",
              "iam:AttachRolePolicy"
          ],
          "Resource": "*",
          "Effect": "Allow"
        },
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
        if (props.rolePolicyDocumentJSON !== 'none') {
            const customPolicyJSONParsed = JSON.parse(props.rolePolicyDocumentJSON);
            const oidcRoleCustomPolicyDocument = iam.PolicyDocument.fromJson(customPolicyJSONParsed);
            const oidcRoleCustomPolicy = new iam.Policy(this, 'RoleCustomPolicy', { document: oidcRoleCustomPolicyDocument, policyName: 'GitHubActionsRoleCustomPolicy' });
            gitHubOIDCRole.attachInlinePolicy(oidcRoleCustomPolicy);
        }
        else {
            gitHubOIDCRole.addManagedPolicy(iam.ManagedPolicy.fromAwsManagedPolicyName('AdministratorAccess'));
        }
        if ((props.githubRepoName) && (props.githubRepoID)) {
            cdk.Tags.of(gitHubOIDCRole).add('GitHubRepositoryName', props.githubRepoName);
            cdk.Tags.of(gitHubOIDCRole).add('GitHubRepositoryID', props.githubRepoID);
        }
    }
}
exports.GithubActionsRole = GithubActionsRole;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9saWIvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSxpREFBbUM7QUFDbkMseURBQTJDO0FBQzNDLDJDQUF1QztBQXlCdkMsTUFBYSxpQkFBa0IsU0FBUSxzQkFBUztJQUU5QyxZQUFZLEtBQWdCLEVBQUUsRUFBVSxFQUFFLEtBQTZCO1FBQ3JFLEtBQUssQ0FBQyxLQUFLLEVBQUUsRUFBRSxDQUFDLENBQUM7UUFFakIsaUNBQWlDO1FBQ2pDLE1BQU0sWUFBWSxHQUFHLHFDQUFxQyxDQUFDO1FBQzNELE1BQU0sa0JBQWtCLEdBQUcsR0FBRyxDQUFDLEVBQUUsQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDLDZCQUE2QixDQUFDLENBQUM7UUFDbkYsTUFBTSxtQkFBbUIsR0FBRyxLQUFLLENBQUMsZ0JBQWdCLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLFdBQUMsT0FBQSxRQUFRLENBQUMsQ0FBQyxLQUFLLElBQUksQ0FBQyxDQUFDLElBQUksSUFBSSxNQUFBLENBQUMsQ0FBQyxNQUFNLG1DQUFJLEdBQUcsRUFBRSxDQUFBLEVBQUEsQ0FBQyxDQUFDO1FBRTVHLGdFQUFnRTtRQUNoRSxNQUFNLFVBQVUsR0FBbUI7WUFDakMsVUFBVSxFQUFFO2dCQUNaLENBQUMsR0FBRyxZQUFZLE1BQU0sQ0FBQyxFQUFFLG1CQUFtQjthQUMzQztTQUNGLENBQUM7UUFFRixNQUFNLHVCQUF1QixHQUFHOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0tBMkMvQixDQUFBO1FBQ0QsTUFBTSxjQUFjLEdBQUcsSUFBSSxHQUFHLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxNQUFNLEVBQUU7WUFDaEQsU0FBUyxFQUFFLElBQUksR0FBRyxDQUFDLG9CQUFvQixDQUFDLGtCQUFrQixFQUFFLFVBQVUsQ0FBQztZQUN2RSxRQUFRLEVBQUUsS0FBSyxDQUFDLFVBQVU7WUFDMUIsV0FBVyxFQUFFLG1HQUFtRztZQUNoSCxrQkFBa0IsRUFBRSxHQUFHLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7U0FDMUMsQ0FBQyxDQUFDO1FBRUgsTUFBTSxxQkFBcUIsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLHVCQUF1QixDQUFDLENBQUM7UUFDbEUsTUFBTSwyQkFBMkIsR0FBRyxHQUFHLENBQUMsY0FBYyxDQUFDLFFBQVEsQ0FBQyxxQkFBcUIsQ0FBQyxDQUFDO1FBQ3ZGLE1BQU0sbUJBQW1CLEdBQUcsSUFBSSxHQUFHLENBQUMsTUFBTSxDQUFDLElBQUksRUFBRSxpQkFBaUIsRUFBRSxFQUFDLFFBQVEsRUFBRSwyQkFBMkIsRUFBRSxVQUFVLEVBQUUsOEJBQThCLEVBQUMsQ0FBQyxDQUFDO1FBQ3pKLGNBQWMsQ0FBQyxrQkFBa0IsQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDO1FBRXZELElBQUssS0FBSyxDQUFDLHNCQUFzQixLQUFLLE1BQU0sRUFDNUM7WUFDRSxNQUFNLHNCQUFzQixHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLHNCQUFzQixDQUFDLENBQUM7WUFDeEUsTUFBTSw0QkFBNEIsR0FBRyxHQUFHLENBQUMsY0FBYyxDQUFDLFFBQVEsQ0FBQyxzQkFBc0IsQ0FBQyxDQUFDO1lBQ3pGLE1BQU0sb0JBQW9CLEdBQUcsSUFBSSxHQUFHLENBQUMsTUFBTSxDQUFDLElBQUksRUFBRSxrQkFBa0IsRUFBRSxFQUFDLFFBQVEsRUFBRSw0QkFBNEIsRUFBRSxVQUFVLEVBQUUsK0JBQStCLEVBQUMsQ0FBQyxDQUFDO1lBQzdKLGNBQWMsQ0FBQyxrQkFBa0IsQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDO1NBQ3pEO2FBRUQ7WUFDRSxjQUFjLENBQUMsZ0JBQWdCLENBQUMsR0FBRyxDQUFDLGFBQWEsQ0FBQyx3QkFBd0IsQ0FBQyxxQkFBcUIsQ0FBQyxDQUFDLENBQUM7U0FDcEc7UUFFRCxJQUFLLENBQUUsS0FBSyxDQUFDLGNBQWMsQ0FBRSxJQUFJLENBQUUsS0FBSyxDQUFDLFlBQVksQ0FBRSxFQUN2RDtZQUNFLEdBQUcsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLGNBQWMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxzQkFBc0IsRUFBRSxLQUFLLENBQUMsY0FBYyxDQUFDLENBQUM7WUFDOUUsR0FBRyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsY0FBYyxDQUFDLENBQUMsR0FBRyxDQUFDLG9CQUFvQixFQUFFLEtBQUssQ0FBQyxZQUFZLENBQUMsQ0FBQztTQUMzRTtJQUNILENBQUM7Q0FDRjtBQTNGRCw4Q0EyRkMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBjZGsgZnJvbSAnYXdzLWNkay1saWInO1xuaW1wb3J0ICogYXMgaWFtIGZyb20gJ2F3cy1jZGstbGliL2F3cy1pYW0nO1xuaW1wb3J0IHsgQ29uc3RydWN0IH0gZnJvbSAnY29uc3RydWN0cyc7XG5cbmV4cG9ydCBpbnRlcmZhY2UgR2l0aHViQWN0aW9uc1JvbGVQcm9wcyB7XG4gIC8vIERlZmluZSBjb25zdHJ1Y3QgcHJvcGVydGllcyBoZXJlXG4gIHJlYWRvbmx5IHN0YWNrT3V0cHV0R2l0SHViT2lkY1Byb3ZpZGVyOiBzdHJpbmc7XG4gIHJlYWRvbmx5IGRlcGxveVJvbGU6IHN0cmluZztcbiAgcmVhZG9ubHkgZ2l0aHViUmVwb05hbWU6IHN0cmluZztcbiAgcmVhZG9ubHkgZ2l0aHViUmVwb0lEOiBzdHJpbmc7XG4gIC8qKlxuICAgKiBUaGUgc3ViIHByZWZpeCBzdHJpbmcgZnJvbSB0aGUgSldUIHRva2VuIHVzZWQgdG8gYmUgdmFsaWRhdGVkIGJ5IEFXUy4gQXBwZW5kZWQgYWZ0ZXIgYHJlcG86JHtvd25lcn0vJHtyZXBvfTpgXG4gICAqIGluIGFuIElBTSByb2xlIHRydXN0IHJlbGF0aW9uc2hpcC4gVGhlIGRlZmF1bHQgdmFsdWUgJyonIGluZGljYXRlcyBhbGwgYnJhbmNoZXMgYW5kIGFsbCB0YWdzIGZyb20gdGhpcyByZXBvLlxuICAgKlxuICAgKiBFeGFtcGxlOlxuICAgKiByZXBvOm9jdG8tb3JnL29jdG8tcmVwbzpyZWY6cmVmcy9oZWFkcy9kZW1vLWJyYW5jaCAtIG9ubHkgYWxsb3dlZCBmcm9tIGBkZW1vLWJyYW5jaGBcbiAgICogcmVwbzpvY3RvLW9yZy9vY3RvLXJlcG86cmVmOnJlZnMvdGFncy9kZW1vLXRhZyAtIG9ubHkgYWxsb3dlZCBmcm9tIGBkZW1vLXRhZ2AuXG4gICAqIHJlcG86b2N0by1vcmcvb2N0by1yZXBvOnB1bGxfcmVxdWVzdCAtIG9ubHkgYWxsb3dlZCBmcm9tIHRoZSBgcHVsbF9yZXF1ZXN0YCBldmVudC5cbiAgICogcmVwbzpvY3RvLW9yZy9vY3RvLXJlcG86ZW52aXJvbm1lbnQ6UHJvZHVjdGlvbiAtIG9ubHkgYWxsb3dkIGZyb20gYFByb2R1Y3Rpb25gIGVudmlyb25tZW50IG5hbWUuXG4gICAqXG4gICAqIEBkZWZhdWx0ICcqJ1xuICAgKiBAc2VlIGh0dHBzOi8vZG9jcy5naXRodWIuY29tL2VuL2FjdGlvbnMvZGVwbG95bWVudC9zZWN1cml0eS1oYXJkZW5pbmcteW91ci1kZXBsb3ltZW50cy9hYm91dC1zZWN1cml0eS1oYXJkZW5pbmctd2l0aC1vcGVuaWQtY29ubmVjdCNjb25maWd1cmluZy10aGUtb2lkYy10cnVzdC13aXRoLXRoZS1jbG91ZFxuICAgKi9cbiAgcmVhZG9ubHkgcmVwb3NpdG9yeUNvbmZpZzogeyBvd25lcjogc3RyaW5nOyByZXBvOiBzdHJpbmc7IGZpbHRlcj86IHN0cmluZyB9W107XG4gIHJlYWRvbmx5IHJvbGVQb2xpY3lEb2N1bWVudEpTT046IHN0cmluZ1xufVxuXG5leHBvcnQgY2xhc3MgR2l0aHViQWN0aW9uc1JvbGUgZXh0ZW5kcyBDb25zdHJ1Y3Qge1xuXG4gIGNvbnN0cnVjdG9yKHNjb3BlOiBDb25zdHJ1Y3QsIGlkOiBzdHJpbmcsIHByb3BzOiBHaXRodWJBY3Rpb25zUm9sZVByb3BzKSB7XG4gICAgc3VwZXIoc2NvcGUsIGlkKTtcblxuICAgIC8vIERlZmluZSBjb25zdHJ1Y3QgY29udGVudHMgaGVyZVxuICAgIGNvbnN0IGdpdGh1YkRvbWFpbiA9ICd0b2tlbi5hY3Rpb25zLmdpdGh1YnVzZXJjb250ZW50LmNvbSc7XG4gICAgY29uc3QgY2ZuT0lEQ1Byb3ZpZGVyQXJuID0gY2RrLkZuLmltcG9ydFZhbHVlKHByb3BzLnN0YWNrT3V0cHV0R2l0SHViT2lkY1Byb3ZpZGVyKTtcbiAgICBjb25zdCBpYW1SZXBvRGVwbG95QWNjZXNzID0gcHJvcHMucmVwb3NpdG9yeUNvbmZpZy5tYXAociA9PiBgcmVwbzoke3Iub3duZXJ9LyR7ci5yZXBvfToke3IuZmlsdGVyID8/ICcqJ31gKTtcblxuICAgIC8vIGdyYW50IG9ubHkgcmVxdWVzdHMgY29taW5nIGZyb20gYSBzcGVjaWZpYyBHaXRIdWIgcmVwb3NpdG9yeS5cbiAgICBjb25zdCBjb25kaXRpb25zOiBpYW0uQ29uZGl0aW9ucyA9IHtcbiAgICAgIFN0cmluZ0xpa2U6IHtcbiAgICAgIFtgJHtnaXRodWJEb21haW59OnN1YmBdOiBpYW1SZXBvRGVwbG95QWNjZXNzLFxuICAgICAgfSxcbiAgICB9O1xuICAgIFxuICAgIGNvbnN0IGJhc2ljUG9saWN5RG9jdW1lbnRKU09OID0gYFxuICAgIHtcbiAgICAgIFwiVmVyc2lvblwiOiBcIjIwMTItMTAtMTdcIixcbiAgICAgIFwiU3RhdGVtZW50XCI6IFtcbiAgICAgICAge1xuICAgICAgICAgIFwiQWN0aW9uXCI6IFtcbiAgICAgICAgICAgIFwiY2xvdWRmb3JtYXRpb246RGVzY3JpYmVTdGFja3NcIixcbiAgICAgICAgICAgIFwiY2xvdWRmb3JtYXRpb246R2V0VGVtcGxhdGVcIlxuICAgICAgICAgIF0sXG4gICAgICAgIFwiUmVzb3VyY2VcIjogXCIqXCIsXG4gICAgICAgIFwiRWZmZWN0XCI6IFwiQWxsb3dcIlxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgXCJBY3Rpb25cIjogW1xuICAgICAgICAgICAgXCJzc206R2V0UGFyYW1ldGVyXCJcbiAgICAgICAgICBdLFxuICAgICAgICBcIlJlc291cmNlXCI6IFwiKlwiLFxuICAgICAgICBcIkVmZmVjdFwiOiBcIkFsbG93XCJcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgIFwiQWN0aW9uXCI6IFtcbiAgICAgICAgICAgICAgXCJzZWNyZXRzbWFuYWdlcjpHZXRTZWNyZXRWYWx1ZVwiXG4gICAgICAgICAgXSxcbiAgICAgICAgICBcIlJlc291cmNlXCI6IFwiKlwiLFxuICAgICAgICAgIFwiRWZmZWN0XCI6IFwiQWxsb3dcIlxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgXCJBY3Rpb25cIjogW1xuICAgICAgICAgICAgICBcImlhbTpDcmVhdGVQb2xpY3kqXCIsXG4gICAgICAgICAgICAgIFwiaWFtOkF0dGFjaFJvbGVQb2xpY3lcIlxuICAgICAgICAgIF0sXG4gICAgICAgICAgXCJSZXNvdXJjZVwiOiBcIipcIixcbiAgICAgICAgICBcIkVmZmVjdFwiOiBcIkFsbG93XCJcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgIFwiQWN0aW9uXCI6IFtcbiAgICAgICAgICAgICAgXCJzdHM6QXNzdW1lUm9sZVwiXG4gICAgICAgICAgXSxcbiAgICAgICAgICBcIlJlc291cmNlXCI6IFwiYXJuOmF3czppYW06Oio6cm9sZS9jZGstKlwiLFxuICAgICAgICAgIFwiRWZmZWN0XCI6IFwiQWxsb3dcIlxuICAgICAgICB9XG4gICAgICBdXG4gICAgfVxuICAgIGBcbiAgICBjb25zdCBnaXRIdWJPSURDUm9sZSA9IG5ldyBpYW0uUm9sZSh0aGlzLCAnUm9sZScsIHtcbiAgICAgIGFzc3VtZWRCeTogbmV3IGlhbS5XZWJJZGVudGl0eVByaW5jaXBhbChjZm5PSURDUHJvdmlkZXJBcm4sIGNvbmRpdGlvbnMpLFxuICAgICAgcm9sZU5hbWU6IHByb3BzLmRlcGxveVJvbGUsXG4gICAgICBkZXNjcmlwdGlvbjogJ1RoaXMgcm9sZSBpcyB1c2VkIGJ5IEdpdEh1YiBBY3Rpb25zIHRvIGRlcGxveSB3aXRoIEFXUyBDREsgb3IgVGVycmFmb3JtIG9uIHRoZSB0YXJnZXQgQVdTIGFjY291bnQnLFxuICAgICAgbWF4U2Vzc2lvbkR1cmF0aW9uOiBjZGsuRHVyYXRpb24uaG91cnMoMSksXG4gICAgfSk7XG4gICAgXG4gICAgY29uc3QgYmFzaWNQb2xpY3lKU09OUGFyc2VkID0gSlNPTi5wYXJzZShiYXNpY1BvbGljeURvY3VtZW50SlNPTik7XG4gICAgY29uc3Qgb2lkY1JvbGVCYXNpY1BvbGljeURvY3VtZW50ID0gaWFtLlBvbGljeURvY3VtZW50LmZyb21Kc29uKGJhc2ljUG9saWN5SlNPTlBhcnNlZCk7XG4gICAgY29uc3Qgb2lkY1JvbGVCYXNpY1BvbGljeSA9IG5ldyBpYW0uUG9saWN5KHRoaXMsICdSb2xlQmFzaWNQb2xpY3knLCB7ZG9jdW1lbnQ6IG9pZGNSb2xlQmFzaWNQb2xpY3lEb2N1bWVudCwgcG9saWN5TmFtZTogJ0dpdEh1YkFjdGlvbnNSb2xlQmFzaWNQb2xpY3knfSk7XG4gICAgZ2l0SHViT0lEQ1JvbGUuYXR0YWNoSW5saW5lUG9saWN5KG9pZGNSb2xlQmFzaWNQb2xpY3kpO1xuXG4gICAgaWYgKCBwcm9wcy5yb2xlUG9saWN5RG9jdW1lbnRKU09OICE9PSAnbm9uZScgKVxuICAgIHtcbiAgICAgIGNvbnN0IGN1c3RvbVBvbGljeUpTT05QYXJzZWQgPSBKU09OLnBhcnNlKHByb3BzLnJvbGVQb2xpY3lEb2N1bWVudEpTT04pO1xuICAgICAgY29uc3Qgb2lkY1JvbGVDdXN0b21Qb2xpY3lEb2N1bWVudCA9IGlhbS5Qb2xpY3lEb2N1bWVudC5mcm9tSnNvbihjdXN0b21Qb2xpY3lKU09OUGFyc2VkKTtcbiAgICAgIGNvbnN0IG9pZGNSb2xlQ3VzdG9tUG9saWN5ID0gbmV3IGlhbS5Qb2xpY3kodGhpcywgJ1JvbGVDdXN0b21Qb2xpY3knLCB7ZG9jdW1lbnQ6IG9pZGNSb2xlQ3VzdG9tUG9saWN5RG9jdW1lbnQsIHBvbGljeU5hbWU6ICdHaXRIdWJBY3Rpb25zUm9sZUN1c3RvbVBvbGljeSd9KTtcbiAgICAgIGdpdEh1Yk9JRENSb2xlLmF0dGFjaElubGluZVBvbGljeShvaWRjUm9sZUN1c3RvbVBvbGljeSk7XG4gICAgfVxuICAgIGVsc2VcbiAgICB7XG4gICAgICBnaXRIdWJPSURDUm9sZS5hZGRNYW5hZ2VkUG9saWN5KGlhbS5NYW5hZ2VkUG9saWN5LmZyb21Bd3NNYW5hZ2VkUG9saWN5TmFtZSgnQWRtaW5pc3RyYXRvckFjY2VzcycpKTtcbiAgICB9XG4gICAgXG4gICAgaWYgKCAoIHByb3BzLmdpdGh1YlJlcG9OYW1lICkgJiYgKCBwcm9wcy5naXRodWJSZXBvSUQgKSApXG4gICAge1xuICAgICAgY2RrLlRhZ3Mub2YoZ2l0SHViT0lEQ1JvbGUpLmFkZCgnR2l0SHViUmVwb3NpdG9yeU5hbWUnLCBwcm9wcy5naXRodWJSZXBvTmFtZSk7XG4gICAgICBjZGsuVGFncy5vZihnaXRIdWJPSURDUm9sZSkuYWRkKCdHaXRIdWJSZXBvc2l0b3J5SUQnLCBwcm9wcy5naXRodWJSZXBvSUQpO1xuICAgIH1cbiAgfVxufVxuIl19