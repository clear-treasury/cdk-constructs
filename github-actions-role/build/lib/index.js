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
        const gitHubOIDCRole = new iam.Role(this, 'Role', {
            assumedBy: new iam.WebIdentityPrincipal(cfnOIDCProviderArn, conditions),
            roleName: props.deployRole,
            description: 'This role is used by GitHub Actions to deploy with AWS CDK or Terraform on the target AWS account',
            maxSessionDuration: cdk.Duration.hours(1),
        });
        if (props.rolePolicyDocumentJSON !== 'none') {
            const policyJSONParsed = JSON.parse(props.rolePolicyDocumentJSON);
            const oidcRolePolicyDocument = iam.PolicyDocument.fromJson(policyJSONParsed);
            const oidcRolePolicy = new iam.Policy(this, 'RolePolicy', { document: oidcRolePolicyDocument, policyName: 'GitHubDeployRolePolicy' });
            gitHubOIDCRole.attachInlinePolicy(oidcRolePolicy);
        }
        else {
            gitHubOIDCRole.addManagedPolicy(iam.ManagedPolicy.fromAwsManagedPolicyName('AdministratorAccess'));
        }
        if (props.githubRepoName !== '' && props.githubRepoID !== '') {
            cdk.Tags.of(gitHubOIDCRole).add('GitHubRepositoryName', props.githubRepoName);
            cdk.Tags.of(gitHubOIDCRole).add('GitHubRepositoryID', props.githubRepoID);
        }
    }
}
exports.GithubActionsRole = GithubActionsRole;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9saWIvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSxpREFBbUM7QUFDbkMseURBQTJDO0FBQzNDLDJDQUF1QztBQXlCdkMsTUFBYSxpQkFBa0IsU0FBUSxzQkFBUztJQUU5QyxZQUFZLEtBQWdCLEVBQUUsRUFBVSxFQUFFLEtBQTZCO1FBQ3JFLEtBQUssQ0FBQyxLQUFLLEVBQUUsRUFBRSxDQUFDLENBQUM7UUFFakIsaUNBQWlDO1FBQ2pDLE1BQU0sWUFBWSxHQUFHLHFDQUFxQyxDQUFDO1FBQ3pELE1BQU0sa0JBQWtCLEdBQUcsR0FBRyxDQUFDLEVBQUUsQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDLDZCQUE2QixDQUFDLENBQUM7UUFDbkYsTUFBTSxtQkFBbUIsR0FBRyxLQUFLLENBQUMsZ0JBQWdCLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLFdBQUMsT0FBQSxRQUFRLENBQUMsQ0FBQyxLQUFLLElBQUksQ0FBQyxDQUFDLElBQUksSUFBSSxNQUFBLENBQUMsQ0FBQyxNQUFNLG1DQUFJLEdBQUcsRUFBRSxDQUFBLEVBQUEsQ0FBQyxDQUFDO1FBRTVHLGdFQUFnRTtRQUNoRSxNQUFNLFVBQVUsR0FBbUI7WUFDakMsVUFBVSxFQUFFO2dCQUNaLENBQUMsR0FBRyxZQUFZLE1BQU0sQ0FBQyxFQUFFLG1CQUFtQjthQUMzQztTQUNGLENBQUM7UUFFRixNQUFNLGNBQWMsR0FBRyxJQUFJLEdBQUcsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLE1BQU0sRUFBRTtZQUNoRCxTQUFTLEVBQUUsSUFBSSxHQUFHLENBQUMsb0JBQW9CLENBQUMsa0JBQWtCLEVBQUUsVUFBVSxDQUFDO1lBQ3ZFLFFBQVEsRUFBRSxLQUFLLENBQUMsVUFBVTtZQUMxQixXQUFXLEVBQUUsbUdBQW1HO1lBQ2hILGtCQUFrQixFQUFFLEdBQUcsQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztTQUMxQyxDQUFDLENBQUM7UUFFSCxJQUFLLEtBQUssQ0FBQyxzQkFBc0IsS0FBSyxNQUFNLEVBQzVDO1lBQ0UsTUFBTSxnQkFBZ0IsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxzQkFBc0IsQ0FBQyxDQUFDO1lBQ2xFLE1BQU0sc0JBQXNCLEdBQUcsR0FBRyxDQUFDLGNBQWMsQ0FBQyxRQUFRLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztZQUM3RSxNQUFNLGNBQWMsR0FBRyxJQUFJLEdBQUcsQ0FBQyxNQUFNLENBQUMsSUFBSSxFQUFFLFlBQVksRUFBRSxFQUFDLFFBQVEsRUFBRSxzQkFBc0IsRUFBRSxVQUFVLEVBQUUsd0JBQXdCLEVBQUMsQ0FBQyxDQUFDO1lBQ3BJLGNBQWMsQ0FBQyxrQkFBa0IsQ0FBQyxjQUFjLENBQUMsQ0FBQztTQUNuRDthQUVEO1lBQ0UsY0FBYyxDQUFDLGdCQUFnQixDQUFDLEdBQUcsQ0FBQyxhQUFhLENBQUMsd0JBQXdCLENBQUMscUJBQXFCLENBQUMsQ0FBQyxDQUFDO1NBQ3BHO1FBRUQsSUFBSyxLQUFLLENBQUMsY0FBYyxLQUFLLEVBQUUsSUFBSSxLQUFLLENBQUMsWUFBWSxLQUFLLEVBQUUsRUFDN0Q7WUFDRSxHQUFHLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxjQUFjLENBQUMsQ0FBQyxHQUFHLENBQUMsc0JBQXNCLEVBQUUsS0FBSyxDQUFDLGNBQWMsQ0FBQyxDQUFDO1lBQzlFLEdBQUcsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLGNBQWMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxvQkFBb0IsRUFBRSxLQUFLLENBQUMsWUFBWSxDQUFDLENBQUM7U0FDM0U7SUFDTCxDQUFDO0NBQ0Y7QUExQ0QsOENBMENDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgY2RrIGZyb20gJ2F3cy1jZGstbGliJztcbmltcG9ydCAqIGFzIGlhbSBmcm9tICdhd3MtY2RrLWxpYi9hd3MtaWFtJztcbmltcG9ydCB7IENvbnN0cnVjdCB9IGZyb20gJ2NvbnN0cnVjdHMnO1xuXG5leHBvcnQgaW50ZXJmYWNlIEdpdGh1YkFjdGlvbnNSb2xlUHJvcHMge1xuICAvLyBEZWZpbmUgY29uc3RydWN0IHByb3BlcnRpZXMgaGVyZVxuICByZWFkb25seSBzdGFja091dHB1dEdpdEh1Yk9pZGNQcm92aWRlcjogc3RyaW5nO1xuICByZWFkb25seSBkZXBsb3lSb2xlOiBzdHJpbmc7XG4gIHJlYWRvbmx5IGdpdGh1YlJlcG9OYW1lOiBzdHJpbmc7XG4gIHJlYWRvbmx5IGdpdGh1YlJlcG9JRDogc3RyaW5nO1xuICAvKipcbiAgICogVGhlIHN1YiBwcmVmaXggc3RyaW5nIGZyb20gdGhlIEpXVCB0b2tlbiB1c2VkIHRvIGJlIHZhbGlkYXRlZCBieSBBV1MuIEFwcGVuZGVkIGFmdGVyIGByZXBvOiR7b3duZXJ9LyR7cmVwb306YFxuICAgKiBpbiBhbiBJQU0gcm9sZSB0cnVzdCByZWxhdGlvbnNoaXAuIFRoZSBkZWZhdWx0IHZhbHVlICcqJyBpbmRpY2F0ZXMgYWxsIGJyYW5jaGVzIGFuZCBhbGwgdGFncyBmcm9tIHRoaXMgcmVwby5cbiAgICpcbiAgICogRXhhbXBsZTpcbiAgICogcmVwbzpvY3RvLW9yZy9vY3RvLXJlcG86cmVmOnJlZnMvaGVhZHMvZGVtby1icmFuY2ggLSBvbmx5IGFsbG93ZWQgZnJvbSBgZGVtby1icmFuY2hgXG4gICAqIHJlcG86b2N0by1vcmcvb2N0by1yZXBvOnJlZjpyZWZzL3RhZ3MvZGVtby10YWcgLSBvbmx5IGFsbG93ZWQgZnJvbSBgZGVtby10YWdgLlxuICAgKiByZXBvOm9jdG8tb3JnL29jdG8tcmVwbzpwdWxsX3JlcXVlc3QgLSBvbmx5IGFsbG93ZWQgZnJvbSB0aGUgYHB1bGxfcmVxdWVzdGAgZXZlbnQuXG4gICAqIHJlcG86b2N0by1vcmcvb2N0by1yZXBvOmVudmlyb25tZW50OlByb2R1Y3Rpb24gLSBvbmx5IGFsbG93ZCBmcm9tIGBQcm9kdWN0aW9uYCBlbnZpcm9ubWVudCBuYW1lLlxuICAgKlxuICAgKiBAZGVmYXVsdCAnKidcbiAgICogQHNlZSBodHRwczovL2RvY3MuZ2l0aHViLmNvbS9lbi9hY3Rpb25zL2RlcGxveW1lbnQvc2VjdXJpdHktaGFyZGVuaW5nLXlvdXItZGVwbG95bWVudHMvYWJvdXQtc2VjdXJpdHktaGFyZGVuaW5nLXdpdGgtb3BlbmlkLWNvbm5lY3QjY29uZmlndXJpbmctdGhlLW9pZGMtdHJ1c3Qtd2l0aC10aGUtY2xvdWRcbiAgICovXG4gIHJlYWRvbmx5IHJlcG9zaXRvcnlDb25maWc6IHsgb3duZXI6IHN0cmluZzsgcmVwbzogc3RyaW5nOyBmaWx0ZXI/OiBzdHJpbmcgfVtdO1xuICByZWFkb25seSByb2xlUG9saWN5RG9jdW1lbnRKU09OOiBzdHJpbmdcbn1cblxuZXhwb3J0IGNsYXNzIEdpdGh1YkFjdGlvbnNSb2xlIGV4dGVuZHMgQ29uc3RydWN0IHtcblxuICBjb25zdHJ1Y3RvcihzY29wZTogQ29uc3RydWN0LCBpZDogc3RyaW5nLCBwcm9wczogR2l0aHViQWN0aW9uc1JvbGVQcm9wcykge1xuICAgIHN1cGVyKHNjb3BlLCBpZCk7XG5cbiAgICAvLyBEZWZpbmUgY29uc3RydWN0IGNvbnRlbnRzIGhlcmVcbiAgICBjb25zdCBnaXRodWJEb21haW4gPSAndG9rZW4uYWN0aW9ucy5naXRodWJ1c2VyY29udGVudC5jb20nO1xuICAgICAgY29uc3QgY2ZuT0lEQ1Byb3ZpZGVyQXJuID0gY2RrLkZuLmltcG9ydFZhbHVlKHByb3BzLnN0YWNrT3V0cHV0R2l0SHViT2lkY1Byb3ZpZGVyKTtcbiAgICAgIGNvbnN0IGlhbVJlcG9EZXBsb3lBY2Nlc3MgPSBwcm9wcy5yZXBvc2l0b3J5Q29uZmlnLm1hcChyID0+IGByZXBvOiR7ci5vd25lcn0vJHtyLnJlcG99OiR7ci5maWx0ZXIgPz8gJyonfWApO1xuXG4gICAgICAvLyBncmFudCBvbmx5IHJlcXVlc3RzIGNvbWluZyBmcm9tIGEgc3BlY2lmaWMgR2l0SHViIHJlcG9zaXRvcnkuXG4gICAgICBjb25zdCBjb25kaXRpb25zOiBpYW0uQ29uZGl0aW9ucyA9IHtcbiAgICAgICAgU3RyaW5nTGlrZToge1xuICAgICAgICBbYCR7Z2l0aHViRG9tYWlufTpzdWJgXTogaWFtUmVwb0RlcGxveUFjY2VzcyxcbiAgICAgICAgfSxcbiAgICAgIH07XG5cbiAgICAgIGNvbnN0IGdpdEh1Yk9JRENSb2xlID0gbmV3IGlhbS5Sb2xlKHRoaXMsICdSb2xlJywge1xuICAgICAgICBhc3N1bWVkQnk6IG5ldyBpYW0uV2ViSWRlbnRpdHlQcmluY2lwYWwoY2ZuT0lEQ1Byb3ZpZGVyQXJuLCBjb25kaXRpb25zKSxcbiAgICAgICAgcm9sZU5hbWU6IHByb3BzLmRlcGxveVJvbGUsXG4gICAgICAgIGRlc2NyaXB0aW9uOiAnVGhpcyByb2xlIGlzIHVzZWQgYnkgR2l0SHViIEFjdGlvbnMgdG8gZGVwbG95IHdpdGggQVdTIENESyBvciBUZXJyYWZvcm0gb24gdGhlIHRhcmdldCBBV1MgYWNjb3VudCcsXG4gICAgICAgIG1heFNlc3Npb25EdXJhdGlvbjogY2RrLkR1cmF0aW9uLmhvdXJzKDEpLFxuICAgICAgfSk7XG4gICAgICBcbiAgICAgIGlmICggcHJvcHMucm9sZVBvbGljeURvY3VtZW50SlNPTiAhPT0gJ25vbmUnIClcbiAgICAgIHtcbiAgICAgICAgY29uc3QgcG9saWN5SlNPTlBhcnNlZCA9IEpTT04ucGFyc2UocHJvcHMucm9sZVBvbGljeURvY3VtZW50SlNPTik7XG4gICAgICAgIGNvbnN0IG9pZGNSb2xlUG9saWN5RG9jdW1lbnQgPSBpYW0uUG9saWN5RG9jdW1lbnQuZnJvbUpzb24ocG9saWN5SlNPTlBhcnNlZCk7XG4gICAgICAgIGNvbnN0IG9pZGNSb2xlUG9saWN5ID0gbmV3IGlhbS5Qb2xpY3kodGhpcywgJ1JvbGVQb2xpY3knLCB7ZG9jdW1lbnQ6IG9pZGNSb2xlUG9saWN5RG9jdW1lbnQsIHBvbGljeU5hbWU6ICdHaXRIdWJEZXBsb3lSb2xlUG9saWN5J30pO1xuICAgICAgICBnaXRIdWJPSURDUm9sZS5hdHRhY2hJbmxpbmVQb2xpY3kob2lkY1JvbGVQb2xpY3kpO1xuICAgICAgfVxuICAgICAgZWxzZVxuICAgICAge1xuICAgICAgICBnaXRIdWJPSURDUm9sZS5hZGRNYW5hZ2VkUG9saWN5KGlhbS5NYW5hZ2VkUG9saWN5LmZyb21Bd3NNYW5hZ2VkUG9saWN5TmFtZSgnQWRtaW5pc3RyYXRvckFjY2VzcycpKTtcbiAgICAgIH1cbiAgICAgIFxuICAgICAgaWYgKCBwcm9wcy5naXRodWJSZXBvTmFtZSAhPT0gJycgJiYgcHJvcHMuZ2l0aHViUmVwb0lEICE9PSAnJylcbiAgICAgIHtcbiAgICAgICAgY2RrLlRhZ3Mub2YoZ2l0SHViT0lEQ1JvbGUpLmFkZCgnR2l0SHViUmVwb3NpdG9yeU5hbWUnLCBwcm9wcy5naXRodWJSZXBvTmFtZSk7XG4gICAgICAgIGNkay5UYWdzLm9mKGdpdEh1Yk9JRENSb2xlKS5hZGQoJ0dpdEh1YlJlcG9zaXRvcnlJRCcsIHByb3BzLmdpdGh1YlJlcG9JRCk7XG4gICAgICB9XG4gIH1cbn1cbiJdfQ==