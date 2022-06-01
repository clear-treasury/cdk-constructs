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
              "iam:AttachRolePolicy",
              "iam:GetRole",
              "iam:PassRole"
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9saWIvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSxpREFBbUM7QUFDbkMseURBQTJDO0FBQzNDLDJDQUF1QztBQXlCdkMsTUFBYSxpQkFBa0IsU0FBUSxzQkFBUztJQUU5QyxZQUFZLEtBQWdCLEVBQUUsRUFBVSxFQUFFLEtBQTZCO1FBQ3JFLEtBQUssQ0FBQyxLQUFLLEVBQUUsRUFBRSxDQUFDLENBQUM7UUFFakIsaUNBQWlDO1FBQ2pDLE1BQU0sWUFBWSxHQUFHLHFDQUFxQyxDQUFDO1FBQzNELE1BQU0sa0JBQWtCLEdBQUcsR0FBRyxDQUFDLEVBQUUsQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDLDZCQUE2QixDQUFDLENBQUM7UUFDbkYsTUFBTSxtQkFBbUIsR0FBRyxLQUFLLENBQUMsZ0JBQWdCLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLFdBQUMsT0FBQSxRQUFRLENBQUMsQ0FBQyxLQUFLLElBQUksQ0FBQyxDQUFDLElBQUksSUFBSSxNQUFBLENBQUMsQ0FBQyxNQUFNLG1DQUFJLEdBQUcsRUFBRSxDQUFBLEVBQUEsQ0FBQyxDQUFDO1FBRTVHLGdFQUFnRTtRQUNoRSxNQUFNLFVBQVUsR0FBbUI7WUFDakMsVUFBVSxFQUFFO2dCQUNaLENBQUMsR0FBRyxZQUFZLE1BQU0sQ0FBQyxFQUFFLG1CQUFtQjthQUMzQztTQUNGLENBQUM7UUFFRixNQUFNLHVCQUF1QixHQUFHOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7S0E2Qy9CLENBQUE7UUFDRCxNQUFNLGNBQWMsR0FBRyxJQUFJLEdBQUcsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLE1BQU0sRUFBRTtZQUNoRCxTQUFTLEVBQUUsSUFBSSxHQUFHLENBQUMsb0JBQW9CLENBQUMsa0JBQWtCLEVBQUUsVUFBVSxDQUFDO1lBQ3ZFLFFBQVEsRUFBRSxLQUFLLENBQUMsVUFBVTtZQUMxQixXQUFXLEVBQUUsbUdBQW1HO1lBQ2hILGtCQUFrQixFQUFFLEdBQUcsQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztTQUMxQyxDQUFDLENBQUM7UUFFSCxNQUFNLHFCQUFxQixHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsdUJBQXVCLENBQUMsQ0FBQztRQUNsRSxNQUFNLDJCQUEyQixHQUFHLEdBQUcsQ0FBQyxjQUFjLENBQUMsUUFBUSxDQUFDLHFCQUFxQixDQUFDLENBQUM7UUFDdkYsTUFBTSxtQkFBbUIsR0FBRyxJQUFJLEdBQUcsQ0FBQyxNQUFNLENBQUMsSUFBSSxFQUFFLGlCQUFpQixFQUFFLEVBQUMsUUFBUSxFQUFFLDJCQUEyQixFQUFFLFVBQVUsRUFBRSw4QkFBOEIsRUFBQyxDQUFDLENBQUM7UUFDekosY0FBYyxDQUFDLGtCQUFrQixDQUFDLG1CQUFtQixDQUFDLENBQUM7UUFFdkQsSUFBSyxLQUFLLENBQUMsc0JBQXNCLEtBQUssTUFBTSxFQUM1QztZQUNFLE1BQU0sc0JBQXNCLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsc0JBQXNCLENBQUMsQ0FBQztZQUN4RSxNQUFNLDRCQUE0QixHQUFHLEdBQUcsQ0FBQyxjQUFjLENBQUMsUUFBUSxDQUFDLHNCQUFzQixDQUFDLENBQUM7WUFDekYsTUFBTSxvQkFBb0IsR0FBRyxJQUFJLEdBQUcsQ0FBQyxNQUFNLENBQUMsSUFBSSxFQUFFLGtCQUFrQixFQUFFLEVBQUMsUUFBUSxFQUFFLDRCQUE0QixFQUFFLFVBQVUsRUFBRSwrQkFBK0IsRUFBQyxDQUFDLENBQUM7WUFDN0osY0FBYyxDQUFDLGtCQUFrQixDQUFDLG9CQUFvQixDQUFDLENBQUM7U0FDekQ7YUFFRDtZQUNFLGNBQWMsQ0FBQyxnQkFBZ0IsQ0FBQyxHQUFHLENBQUMsYUFBYSxDQUFDLHdCQUF3QixDQUFDLHFCQUFxQixDQUFDLENBQUMsQ0FBQztTQUNwRztRQUVELElBQUssQ0FBRSxLQUFLLENBQUMsY0FBYyxDQUFFLElBQUksQ0FBRSxLQUFLLENBQUMsWUFBWSxDQUFFLEVBQ3ZEO1lBQ0UsR0FBRyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsY0FBYyxDQUFDLENBQUMsR0FBRyxDQUFDLHNCQUFzQixFQUFFLEtBQUssQ0FBQyxjQUFjLENBQUMsQ0FBQztZQUM5RSxHQUFHLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxjQUFjLENBQUMsQ0FBQyxHQUFHLENBQUMsb0JBQW9CLEVBQUUsS0FBSyxDQUFDLFlBQVksQ0FBQyxDQUFDO1NBQzNFO0lBQ0gsQ0FBQztDQUNGO0FBN0ZELDhDQTZGQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIGNkayBmcm9tICdhd3MtY2RrLWxpYic7XG5pbXBvcnQgKiBhcyBpYW0gZnJvbSAnYXdzLWNkay1saWIvYXdzLWlhbSc7XG5pbXBvcnQgeyBDb25zdHJ1Y3QgfSBmcm9tICdjb25zdHJ1Y3RzJztcblxuZXhwb3J0IGludGVyZmFjZSBHaXRodWJBY3Rpb25zUm9sZVByb3BzIHtcbiAgLy8gRGVmaW5lIGNvbnN0cnVjdCBwcm9wZXJ0aWVzIGhlcmVcbiAgcmVhZG9ubHkgc3RhY2tPdXRwdXRHaXRIdWJPaWRjUHJvdmlkZXI6IHN0cmluZztcbiAgcmVhZG9ubHkgZGVwbG95Um9sZTogc3RyaW5nO1xuICByZWFkb25seSBnaXRodWJSZXBvTmFtZTogc3RyaW5nO1xuICByZWFkb25seSBnaXRodWJSZXBvSUQ6IHN0cmluZztcbiAgLyoqXG4gICAqIFRoZSBzdWIgcHJlZml4IHN0cmluZyBmcm9tIHRoZSBKV1QgdG9rZW4gdXNlZCB0byBiZSB2YWxpZGF0ZWQgYnkgQVdTLiBBcHBlbmRlZCBhZnRlciBgcmVwbzoke293bmVyfS8ke3JlcG99OmBcbiAgICogaW4gYW4gSUFNIHJvbGUgdHJ1c3QgcmVsYXRpb25zaGlwLiBUaGUgZGVmYXVsdCB2YWx1ZSAnKicgaW5kaWNhdGVzIGFsbCBicmFuY2hlcyBhbmQgYWxsIHRhZ3MgZnJvbSB0aGlzIHJlcG8uXG4gICAqXG4gICAqIEV4YW1wbGU6XG4gICAqIHJlcG86b2N0by1vcmcvb2N0by1yZXBvOnJlZjpyZWZzL2hlYWRzL2RlbW8tYnJhbmNoIC0gb25seSBhbGxvd2VkIGZyb20gYGRlbW8tYnJhbmNoYFxuICAgKiByZXBvOm9jdG8tb3JnL29jdG8tcmVwbzpyZWY6cmVmcy90YWdzL2RlbW8tdGFnIC0gb25seSBhbGxvd2VkIGZyb20gYGRlbW8tdGFnYC5cbiAgICogcmVwbzpvY3RvLW9yZy9vY3RvLXJlcG86cHVsbF9yZXF1ZXN0IC0gb25seSBhbGxvd2VkIGZyb20gdGhlIGBwdWxsX3JlcXVlc3RgIGV2ZW50LlxuICAgKiByZXBvOm9jdG8tb3JnL29jdG8tcmVwbzplbnZpcm9ubWVudDpQcm9kdWN0aW9uIC0gb25seSBhbGxvd2QgZnJvbSBgUHJvZHVjdGlvbmAgZW52aXJvbm1lbnQgbmFtZS5cbiAgICpcbiAgICogQGRlZmF1bHQgJyonXG4gICAqIEBzZWUgaHR0cHM6Ly9kb2NzLmdpdGh1Yi5jb20vZW4vYWN0aW9ucy9kZXBsb3ltZW50L3NlY3VyaXR5LWhhcmRlbmluZy15b3VyLWRlcGxveW1lbnRzL2Fib3V0LXNlY3VyaXR5LWhhcmRlbmluZy13aXRoLW9wZW5pZC1jb25uZWN0I2NvbmZpZ3VyaW5nLXRoZS1vaWRjLXRydXN0LXdpdGgtdGhlLWNsb3VkXG4gICAqL1xuICByZWFkb25seSByZXBvc2l0b3J5Q29uZmlnOiB7IG93bmVyOiBzdHJpbmc7IHJlcG86IHN0cmluZzsgZmlsdGVyPzogc3RyaW5nIH1bXTtcbiAgcmVhZG9ubHkgcm9sZVBvbGljeURvY3VtZW50SlNPTjogc3RyaW5nXG59XG5cbmV4cG9ydCBjbGFzcyBHaXRodWJBY3Rpb25zUm9sZSBleHRlbmRzIENvbnN0cnVjdCB7XG5cbiAgY29uc3RydWN0b3Ioc2NvcGU6IENvbnN0cnVjdCwgaWQ6IHN0cmluZywgcHJvcHM6IEdpdGh1YkFjdGlvbnNSb2xlUHJvcHMpIHtcbiAgICBzdXBlcihzY29wZSwgaWQpO1xuXG4gICAgLy8gRGVmaW5lIGNvbnN0cnVjdCBjb250ZW50cyBoZXJlXG4gICAgY29uc3QgZ2l0aHViRG9tYWluID0gJ3Rva2VuLmFjdGlvbnMuZ2l0aHVidXNlcmNvbnRlbnQuY29tJztcbiAgICBjb25zdCBjZm5PSURDUHJvdmlkZXJBcm4gPSBjZGsuRm4uaW1wb3J0VmFsdWUocHJvcHMuc3RhY2tPdXRwdXRHaXRIdWJPaWRjUHJvdmlkZXIpO1xuICAgIGNvbnN0IGlhbVJlcG9EZXBsb3lBY2Nlc3MgPSBwcm9wcy5yZXBvc2l0b3J5Q29uZmlnLm1hcChyID0+IGByZXBvOiR7ci5vd25lcn0vJHtyLnJlcG99OiR7ci5maWx0ZXIgPz8gJyonfWApO1xuXG4gICAgLy8gZ3JhbnQgb25seSByZXF1ZXN0cyBjb21pbmcgZnJvbSBhIHNwZWNpZmljIEdpdEh1YiByZXBvc2l0b3J5LlxuICAgIGNvbnN0IGNvbmRpdGlvbnM6IGlhbS5Db25kaXRpb25zID0ge1xuICAgICAgU3RyaW5nTGlrZToge1xuICAgICAgW2Ake2dpdGh1YkRvbWFpbn06c3ViYF06IGlhbVJlcG9EZXBsb3lBY2Nlc3MsXG4gICAgICB9LFxuICAgIH07XG4gICAgXG4gICAgY29uc3QgYmFzaWNQb2xpY3lEb2N1bWVudEpTT04gPSBgXG4gICAge1xuICAgICAgXCJWZXJzaW9uXCI6IFwiMjAxMi0xMC0xN1wiLFxuICAgICAgXCJTdGF0ZW1lbnRcIjogW1xuICAgICAgICB7XG4gICAgICAgICAgXCJBY3Rpb25cIjogW1xuICAgICAgICAgICAgXCJjbG91ZGZvcm1hdGlvbjpEZXNjcmliZVN0YWNrc1wiLFxuICAgICAgICAgICAgXCJjbG91ZGZvcm1hdGlvbjpHZXRUZW1wbGF0ZVwiXG4gICAgICAgICAgXSxcbiAgICAgICAgXCJSZXNvdXJjZVwiOiBcIipcIixcbiAgICAgICAgXCJFZmZlY3RcIjogXCJBbGxvd1wiXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICBcIkFjdGlvblwiOiBbXG4gICAgICAgICAgICBcInNzbTpHZXRQYXJhbWV0ZXJcIlxuICAgICAgICAgIF0sXG4gICAgICAgIFwiUmVzb3VyY2VcIjogXCIqXCIsXG4gICAgICAgIFwiRWZmZWN0XCI6IFwiQWxsb3dcIlxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgXCJBY3Rpb25cIjogW1xuICAgICAgICAgICAgICBcInNlY3JldHNtYW5hZ2VyOkdldFNlY3JldFZhbHVlXCJcbiAgICAgICAgICBdLFxuICAgICAgICAgIFwiUmVzb3VyY2VcIjogXCIqXCIsXG4gICAgICAgICAgXCJFZmZlY3RcIjogXCJBbGxvd1wiXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICBcIkFjdGlvblwiOiBbXG4gICAgICAgICAgICAgIFwiaWFtOkNyZWF0ZVBvbGljeSpcIixcbiAgICAgICAgICAgICAgXCJpYW06QXR0YWNoUm9sZVBvbGljeVwiLFxuICAgICAgICAgICAgICBcImlhbTpHZXRSb2xlXCIsXG4gICAgICAgICAgICAgIFwiaWFtOlBhc3NSb2xlXCJcbiAgICAgICAgICBdLFxuICAgICAgICAgIFwiUmVzb3VyY2VcIjogXCIqXCIsXG4gICAgICAgICAgXCJFZmZlY3RcIjogXCJBbGxvd1wiXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICBcIkFjdGlvblwiOiBbXG4gICAgICAgICAgICAgIFwic3RzOkFzc3VtZVJvbGVcIlxuICAgICAgICAgIF0sXG4gICAgICAgICAgXCJSZXNvdXJjZVwiOiBcImFybjphd3M6aWFtOjoqOnJvbGUvY2RrLSpcIixcbiAgICAgICAgICBcIkVmZmVjdFwiOiBcIkFsbG93XCJcbiAgICAgICAgfVxuICAgICAgXVxuICAgIH1cbiAgICBgXG4gICAgY29uc3QgZ2l0SHViT0lEQ1JvbGUgPSBuZXcgaWFtLlJvbGUodGhpcywgJ1JvbGUnLCB7XG4gICAgICBhc3N1bWVkQnk6IG5ldyBpYW0uV2ViSWRlbnRpdHlQcmluY2lwYWwoY2ZuT0lEQ1Byb3ZpZGVyQXJuLCBjb25kaXRpb25zKSxcbiAgICAgIHJvbGVOYW1lOiBwcm9wcy5kZXBsb3lSb2xlLFxuICAgICAgZGVzY3JpcHRpb246ICdUaGlzIHJvbGUgaXMgdXNlZCBieSBHaXRIdWIgQWN0aW9ucyB0byBkZXBsb3kgd2l0aCBBV1MgQ0RLIG9yIFRlcnJhZm9ybSBvbiB0aGUgdGFyZ2V0IEFXUyBhY2NvdW50JyxcbiAgICAgIG1heFNlc3Npb25EdXJhdGlvbjogY2RrLkR1cmF0aW9uLmhvdXJzKDEpLFxuICAgIH0pO1xuICAgIFxuICAgIGNvbnN0IGJhc2ljUG9saWN5SlNPTlBhcnNlZCA9IEpTT04ucGFyc2UoYmFzaWNQb2xpY3lEb2N1bWVudEpTT04pO1xuICAgIGNvbnN0IG9pZGNSb2xlQmFzaWNQb2xpY3lEb2N1bWVudCA9IGlhbS5Qb2xpY3lEb2N1bWVudC5mcm9tSnNvbihiYXNpY1BvbGljeUpTT05QYXJzZWQpO1xuICAgIGNvbnN0IG9pZGNSb2xlQmFzaWNQb2xpY3kgPSBuZXcgaWFtLlBvbGljeSh0aGlzLCAnUm9sZUJhc2ljUG9saWN5Jywge2RvY3VtZW50OiBvaWRjUm9sZUJhc2ljUG9saWN5RG9jdW1lbnQsIHBvbGljeU5hbWU6ICdHaXRIdWJBY3Rpb25zUm9sZUJhc2ljUG9saWN5J30pO1xuICAgIGdpdEh1Yk9JRENSb2xlLmF0dGFjaElubGluZVBvbGljeShvaWRjUm9sZUJhc2ljUG9saWN5KTtcblxuICAgIGlmICggcHJvcHMucm9sZVBvbGljeURvY3VtZW50SlNPTiAhPT0gJ25vbmUnIClcbiAgICB7XG4gICAgICBjb25zdCBjdXN0b21Qb2xpY3lKU09OUGFyc2VkID0gSlNPTi5wYXJzZShwcm9wcy5yb2xlUG9saWN5RG9jdW1lbnRKU09OKTtcbiAgICAgIGNvbnN0IG9pZGNSb2xlQ3VzdG9tUG9saWN5RG9jdW1lbnQgPSBpYW0uUG9saWN5RG9jdW1lbnQuZnJvbUpzb24oY3VzdG9tUG9saWN5SlNPTlBhcnNlZCk7XG4gICAgICBjb25zdCBvaWRjUm9sZUN1c3RvbVBvbGljeSA9IG5ldyBpYW0uUG9saWN5KHRoaXMsICdSb2xlQ3VzdG9tUG9saWN5Jywge2RvY3VtZW50OiBvaWRjUm9sZUN1c3RvbVBvbGljeURvY3VtZW50LCBwb2xpY3lOYW1lOiAnR2l0SHViQWN0aW9uc1JvbGVDdXN0b21Qb2xpY3knfSk7XG4gICAgICBnaXRIdWJPSURDUm9sZS5hdHRhY2hJbmxpbmVQb2xpY3kob2lkY1JvbGVDdXN0b21Qb2xpY3kpO1xuICAgIH1cbiAgICBlbHNlXG4gICAge1xuICAgICAgZ2l0SHViT0lEQ1JvbGUuYWRkTWFuYWdlZFBvbGljeShpYW0uTWFuYWdlZFBvbGljeS5mcm9tQXdzTWFuYWdlZFBvbGljeU5hbWUoJ0FkbWluaXN0cmF0b3JBY2Nlc3MnKSk7XG4gICAgfVxuICAgIFxuICAgIGlmICggKCBwcm9wcy5naXRodWJSZXBvTmFtZSApICYmICggcHJvcHMuZ2l0aHViUmVwb0lEICkgKVxuICAgIHtcbiAgICAgIGNkay5UYWdzLm9mKGdpdEh1Yk9JRENSb2xlKS5hZGQoJ0dpdEh1YlJlcG9zaXRvcnlOYW1lJywgcHJvcHMuZ2l0aHViUmVwb05hbWUpO1xuICAgICAgY2RrLlRhZ3Mub2YoZ2l0SHViT0lEQ1JvbGUpLmFkZCgnR2l0SHViUmVwb3NpdG9yeUlEJywgcHJvcHMuZ2l0aHViUmVwb0lEKTtcbiAgICB9XG4gIH1cbn1cbiJdfQ==