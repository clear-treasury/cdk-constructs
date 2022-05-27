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
        cdk.Tags.of(gitHubOIDCRole).add('GitHubRepositoryName', props.githubRepoName);
        cdk.Tags.of(gitHubOIDCRole).add('GitHubRepositoryID', props.githubRepoID);
    }
}
exports.GithubActionsRole = GithubActionsRole;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9saWIvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSxpREFBbUM7QUFDbkMseURBQTJDO0FBQzNDLDJDQUF1QztBQXlCdkMsTUFBYSxpQkFBa0IsU0FBUSxzQkFBUztJQUU5QyxZQUFZLEtBQWdCLEVBQUUsRUFBVSxFQUFFLEtBQTZCO1FBQ3JFLEtBQUssQ0FBQyxLQUFLLEVBQUUsRUFBRSxDQUFDLENBQUM7UUFFakIsaUNBQWlDO1FBQ2pDLE1BQU0sWUFBWSxHQUFHLHFDQUFxQyxDQUFDO1FBQ3pELE1BQU0sa0JBQWtCLEdBQUcsR0FBRyxDQUFDLEVBQUUsQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDLDZCQUE2QixDQUFDLENBQUM7UUFDbkYsTUFBTSxtQkFBbUIsR0FBRyxLQUFLLENBQUMsZ0JBQWdCLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLFdBQUMsT0FBQSxRQUFRLENBQUMsQ0FBQyxLQUFLLElBQUksQ0FBQyxDQUFDLElBQUksSUFBSSxNQUFBLENBQUMsQ0FBQyxNQUFNLG1DQUFJLEdBQUcsRUFBRSxDQUFBLEVBQUEsQ0FBQyxDQUFDO1FBRTVHLGdFQUFnRTtRQUNoRSxNQUFNLFVBQVUsR0FBbUI7WUFDakMsVUFBVSxFQUFFO2dCQUNaLENBQUMsR0FBRyxZQUFZLE1BQU0sQ0FBQyxFQUFFLG1CQUFtQjthQUMzQztTQUNGLENBQUM7UUFFRixNQUFNLGNBQWMsR0FBRyxJQUFJLEdBQUcsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLE1BQU0sRUFBRTtZQUNoRCxTQUFTLEVBQUUsSUFBSSxHQUFHLENBQUMsb0JBQW9CLENBQUMsa0JBQWtCLEVBQUUsVUFBVSxDQUFDO1lBQ3ZFLFFBQVEsRUFBRSxLQUFLLENBQUMsVUFBVTtZQUMxQixXQUFXLEVBQUUsbUdBQW1HO1lBQ2hILGtCQUFrQixFQUFFLEdBQUcsQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztTQUMxQyxDQUFDLENBQUM7UUFFSCxJQUFLLEtBQUssQ0FBQyxzQkFBc0IsS0FBSyxNQUFNLEVBQzVDO1lBQ0UsTUFBTSxnQkFBZ0IsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxzQkFBc0IsQ0FBQyxDQUFDO1lBQ2xFLE1BQU0sc0JBQXNCLEdBQUcsR0FBRyxDQUFDLGNBQWMsQ0FBQyxRQUFRLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztZQUM3RSxNQUFNLGNBQWMsR0FBRyxJQUFJLEdBQUcsQ0FBQyxNQUFNLENBQUMsSUFBSSxFQUFFLFlBQVksRUFBRSxFQUFDLFFBQVEsRUFBRSxzQkFBc0IsRUFBRSxVQUFVLEVBQUUsd0JBQXdCLEVBQUMsQ0FBQyxDQUFDO1lBQ3BJLGNBQWMsQ0FBQyxrQkFBa0IsQ0FBQyxjQUFjLENBQUMsQ0FBQztTQUNuRDthQUVEO1lBQ0UsY0FBYyxDQUFDLGdCQUFnQixDQUFDLEdBQUcsQ0FBQyxhQUFhLENBQUMsd0JBQXdCLENBQUMscUJBQXFCLENBQUMsQ0FBQyxDQUFDO1NBQ3BHO1FBRUQsR0FBRyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsY0FBYyxDQUFDLENBQUMsR0FBRyxDQUFDLHNCQUFzQixFQUFFLEtBQUssQ0FBQyxjQUFjLENBQUMsQ0FBQztRQUM5RSxHQUFHLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxjQUFjLENBQUMsQ0FBQyxHQUFHLENBQUMsb0JBQW9CLEVBQUUsS0FBSyxDQUFDLFlBQVksQ0FBQyxDQUFDO0lBQzlFLENBQUM7Q0FDRjtBQXZDRCw4Q0F1Q0MiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBjZGsgZnJvbSAnYXdzLWNkay1saWInO1xuaW1wb3J0ICogYXMgaWFtIGZyb20gJ2F3cy1jZGstbGliL2F3cy1pYW0nO1xuaW1wb3J0IHsgQ29uc3RydWN0IH0gZnJvbSAnY29uc3RydWN0cyc7XG5cbmV4cG9ydCBpbnRlcmZhY2UgR2l0aHViQWN0aW9uc1JvbGVQcm9wcyB7XG4gIC8vIERlZmluZSBjb25zdHJ1Y3QgcHJvcGVydGllcyBoZXJlXG4gIHJlYWRvbmx5IHN0YWNrT3V0cHV0R2l0SHViT2lkY1Byb3ZpZGVyOiBzdHJpbmc7XG4gIHJlYWRvbmx5IGRlcGxveVJvbGU6IHN0cmluZztcbiAgcmVhZG9ubHkgZ2l0aHViUmVwb05hbWU6IHN0cmluZztcbiAgcmVhZG9ubHkgZ2l0aHViUmVwb0lEOiBzdHJpbmc7XG4gIC8qKlxuICAgKiBUaGUgc3ViIHByZWZpeCBzdHJpbmcgZnJvbSB0aGUgSldUIHRva2VuIHVzZWQgdG8gYmUgdmFsaWRhdGVkIGJ5IEFXUy4gQXBwZW5kZWQgYWZ0ZXIgYHJlcG86JHtvd25lcn0vJHtyZXBvfTpgXG4gICAqIGluIGFuIElBTSByb2xlIHRydXN0IHJlbGF0aW9uc2hpcC4gVGhlIGRlZmF1bHQgdmFsdWUgJyonIGluZGljYXRlcyBhbGwgYnJhbmNoZXMgYW5kIGFsbCB0YWdzIGZyb20gdGhpcyByZXBvLlxuICAgKlxuICAgKiBFeGFtcGxlOlxuICAgKiByZXBvOm9jdG8tb3JnL29jdG8tcmVwbzpyZWY6cmVmcy9oZWFkcy9kZW1vLWJyYW5jaCAtIG9ubHkgYWxsb3dlZCBmcm9tIGBkZW1vLWJyYW5jaGBcbiAgICogcmVwbzpvY3RvLW9yZy9vY3RvLXJlcG86cmVmOnJlZnMvdGFncy9kZW1vLXRhZyAtIG9ubHkgYWxsb3dlZCBmcm9tIGBkZW1vLXRhZ2AuXG4gICAqIHJlcG86b2N0by1vcmcvb2N0by1yZXBvOnB1bGxfcmVxdWVzdCAtIG9ubHkgYWxsb3dlZCBmcm9tIHRoZSBgcHVsbF9yZXF1ZXN0YCBldmVudC5cbiAgICogcmVwbzpvY3RvLW9yZy9vY3RvLXJlcG86ZW52aXJvbm1lbnQ6UHJvZHVjdGlvbiAtIG9ubHkgYWxsb3dkIGZyb20gYFByb2R1Y3Rpb25gIGVudmlyb25tZW50IG5hbWUuXG4gICAqXG4gICAqIEBkZWZhdWx0ICcqJ1xuICAgKiBAc2VlIGh0dHBzOi8vZG9jcy5naXRodWIuY29tL2VuL2FjdGlvbnMvZGVwbG95bWVudC9zZWN1cml0eS1oYXJkZW5pbmcteW91ci1kZXBsb3ltZW50cy9hYm91dC1zZWN1cml0eS1oYXJkZW5pbmctd2l0aC1vcGVuaWQtY29ubmVjdCNjb25maWd1cmluZy10aGUtb2lkYy10cnVzdC13aXRoLXRoZS1jbG91ZFxuICAgKi9cbiAgcmVhZG9ubHkgcmVwb3NpdG9yeUNvbmZpZzogeyBvd25lcjogc3RyaW5nOyByZXBvOiBzdHJpbmc7IGZpbHRlcj86IHN0cmluZyB9W107XG4gIHJlYWRvbmx5IHJvbGVQb2xpY3lEb2N1bWVudEpTT046IHN0cmluZ1xufVxuXG5leHBvcnQgY2xhc3MgR2l0aHViQWN0aW9uc1JvbGUgZXh0ZW5kcyBDb25zdHJ1Y3Qge1xuXG4gIGNvbnN0cnVjdG9yKHNjb3BlOiBDb25zdHJ1Y3QsIGlkOiBzdHJpbmcsIHByb3BzOiBHaXRodWJBY3Rpb25zUm9sZVByb3BzKSB7XG4gICAgc3VwZXIoc2NvcGUsIGlkKTtcblxuICAgIC8vIERlZmluZSBjb25zdHJ1Y3QgY29udGVudHMgaGVyZVxuICAgIGNvbnN0IGdpdGh1YkRvbWFpbiA9ICd0b2tlbi5hY3Rpb25zLmdpdGh1YnVzZXJjb250ZW50LmNvbSc7XG4gICAgICBjb25zdCBjZm5PSURDUHJvdmlkZXJBcm4gPSBjZGsuRm4uaW1wb3J0VmFsdWUocHJvcHMuc3RhY2tPdXRwdXRHaXRIdWJPaWRjUHJvdmlkZXIpO1xuICAgICAgY29uc3QgaWFtUmVwb0RlcGxveUFjY2VzcyA9IHByb3BzLnJlcG9zaXRvcnlDb25maWcubWFwKHIgPT4gYHJlcG86JHtyLm93bmVyfS8ke3IucmVwb306JHtyLmZpbHRlciA/PyAnKid9YCk7XG5cbiAgICAgIC8vIGdyYW50IG9ubHkgcmVxdWVzdHMgY29taW5nIGZyb20gYSBzcGVjaWZpYyBHaXRIdWIgcmVwb3NpdG9yeS5cbiAgICAgIGNvbnN0IGNvbmRpdGlvbnM6IGlhbS5Db25kaXRpb25zID0ge1xuICAgICAgICBTdHJpbmdMaWtlOiB7XG4gICAgICAgIFtgJHtnaXRodWJEb21haW59OnN1YmBdOiBpYW1SZXBvRGVwbG95QWNjZXNzLFxuICAgICAgICB9LFxuICAgICAgfTtcblxuICAgICAgY29uc3QgZ2l0SHViT0lEQ1JvbGUgPSBuZXcgaWFtLlJvbGUodGhpcywgJ1JvbGUnLCB7XG4gICAgICAgIGFzc3VtZWRCeTogbmV3IGlhbS5XZWJJZGVudGl0eVByaW5jaXBhbChjZm5PSURDUHJvdmlkZXJBcm4sIGNvbmRpdGlvbnMpLFxuICAgICAgICByb2xlTmFtZTogcHJvcHMuZGVwbG95Um9sZSxcbiAgICAgICAgZGVzY3JpcHRpb246ICdUaGlzIHJvbGUgaXMgdXNlZCBieSBHaXRIdWIgQWN0aW9ucyB0byBkZXBsb3kgd2l0aCBBV1MgQ0RLIG9yIFRlcnJhZm9ybSBvbiB0aGUgdGFyZ2V0IEFXUyBhY2NvdW50JyxcbiAgICAgICAgbWF4U2Vzc2lvbkR1cmF0aW9uOiBjZGsuRHVyYXRpb24uaG91cnMoMSksXG4gICAgICB9KTtcbiAgICAgIFxuICAgICAgaWYgKCBwcm9wcy5yb2xlUG9saWN5RG9jdW1lbnRKU09OICE9PSAnbm9uZScgKVxuICAgICAge1xuICAgICAgICBjb25zdCBwb2xpY3lKU09OUGFyc2VkID0gSlNPTi5wYXJzZShwcm9wcy5yb2xlUG9saWN5RG9jdW1lbnRKU09OKTtcbiAgICAgICAgY29uc3Qgb2lkY1JvbGVQb2xpY3lEb2N1bWVudCA9IGlhbS5Qb2xpY3lEb2N1bWVudC5mcm9tSnNvbihwb2xpY3lKU09OUGFyc2VkKTtcbiAgICAgICAgY29uc3Qgb2lkY1JvbGVQb2xpY3kgPSBuZXcgaWFtLlBvbGljeSh0aGlzLCAnUm9sZVBvbGljeScsIHtkb2N1bWVudDogb2lkY1JvbGVQb2xpY3lEb2N1bWVudCwgcG9saWN5TmFtZTogJ0dpdEh1YkRlcGxveVJvbGVQb2xpY3knfSk7XG4gICAgICAgIGdpdEh1Yk9JRENSb2xlLmF0dGFjaElubGluZVBvbGljeShvaWRjUm9sZVBvbGljeSk7XG4gICAgICB9XG4gICAgICBlbHNlXG4gICAgICB7XG4gICAgICAgIGdpdEh1Yk9JRENSb2xlLmFkZE1hbmFnZWRQb2xpY3koaWFtLk1hbmFnZWRQb2xpY3kuZnJvbUF3c01hbmFnZWRQb2xpY3lOYW1lKCdBZG1pbmlzdHJhdG9yQWNjZXNzJykpO1xuICAgICAgfVxuICAgICAgXG4gICAgICBjZGsuVGFncy5vZihnaXRIdWJPSURDUm9sZSkuYWRkKCdHaXRIdWJSZXBvc2l0b3J5TmFtZScsIHByb3BzLmdpdGh1YlJlcG9OYW1lKTtcbiAgICAgIGNkay5UYWdzLm9mKGdpdEh1Yk9JRENSb2xlKS5hZGQoJ0dpdEh1YlJlcG9zaXRvcnlJRCcsIHByb3BzLmdpdGh1YlJlcG9JRCk7XG4gIH1cbn1cbiJdfQ==