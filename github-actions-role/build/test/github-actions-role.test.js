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
const assert_1 = require("@aws-cdk/assert");
const cdk = __importStar(require("aws-cdk-lib"));
const GithubActionsRole = __importStar(require("../lib/index"));
/*
 * Example test
 */
test('SNS Topic Created', () => {
    const app = new cdk.App();
    const stack = new cdk.Stack(app, "TestStack");
    const TestGithubActionsRoleProps = {
        stackOutputGitHubOidcProvider: 'example-stack-output-name',
        deployRole: 'GitHubDeploy@' + 'example-repo-name',
        githubRepoName: 'example-repo-name',
        githubRepoID: 'example-repo-id',
        repositoryConfig: [
            { owner: "example-owner", repo: 'example-repo-name' }
        ],
        rolePolicyDocumentJSON: 'none'
    };
    // WHEN
    new GithubActionsRole.GithubActionsRole(stack, 'MyTestConstruct', TestGithubActionsRoleProps);
    // THEN
    (0, assert_1.expect)(stack).to((0, assert_1.countResources)("AWS::SNS::Topic", 0));
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2l0aHViLWFjdGlvbnMtcm9sZS50ZXN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vdGVzdC9naXRodWItYWN0aW9ucy1yb2xlLnRlc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLDRDQUFzRTtBQUN0RSxpREFBbUM7QUFDbkMsZ0VBQWtEO0FBRWxEOztHQUVHO0FBQ0gsSUFBSSxDQUFDLG1CQUFtQixFQUFFLEdBQUcsRUFBRTtJQUM3QixNQUFNLEdBQUcsR0FBRyxJQUFJLEdBQUcsQ0FBQyxHQUFHLEVBQUUsQ0FBQztJQUMxQixNQUFNLEtBQUssR0FBRyxJQUFJLEdBQUcsQ0FBQyxLQUFLLENBQUMsR0FBRyxFQUFFLFdBQVcsQ0FBQyxDQUFDO0lBQzlDLE1BQU0sMEJBQTBCLEdBQThDO1FBQzVFLDZCQUE2QixFQUFFLDJCQUEyQjtRQUMxRCxVQUFVLEVBQUUsZUFBZSxHQUFHLG1CQUFtQjtRQUNqRCxjQUFjLEVBQUUsbUJBQW1CO1FBQ25DLFlBQVksRUFBRSxpQkFBaUI7UUFDL0IsZ0JBQWdCLEVBQUU7WUFDaEIsRUFBRSxLQUFLLEVBQUUsZUFBZSxFQUFFLElBQUksRUFBRSxtQkFBbUIsRUFBRTtTQUN0RDtRQUNELHNCQUFzQixFQUFFLE1BQU07S0FDL0IsQ0FBQTtJQUNELE9BQU87SUFDUCxJQUFJLGlCQUFpQixDQUFDLGlCQUFpQixDQUFDLEtBQUssRUFBRSxpQkFBaUIsRUFBRSwwQkFBMEIsQ0FBQyxDQUFDO0lBQzlGLE9BQU87SUFDUCxJQUFBLGVBQVMsRUFBQyxLQUFLLENBQUMsQ0FBQyxFQUFFLENBQUMsSUFBQSx1QkFBYyxFQUFDLGlCQUFpQixFQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDM0QsQ0FBQyxDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBleHBlY3QgYXMgZXhwZWN0Q0RLLCBjb3VudFJlc291cmNlcyB9IGZyb20gJ0Bhd3MtY2RrL2Fzc2VydCc7XG5pbXBvcnQgKiBhcyBjZGsgZnJvbSAnYXdzLWNkay1saWInO1xuaW1wb3J0ICogYXMgR2l0aHViQWN0aW9uc1JvbGUgZnJvbSAnLi4vbGliL2luZGV4JztcblxuLypcbiAqIEV4YW1wbGUgdGVzdFxuICovXG50ZXN0KCdTTlMgVG9waWMgQ3JlYXRlZCcsICgpID0+IHtcbiAgY29uc3QgYXBwID0gbmV3IGNkay5BcHAoKTtcbiAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKGFwcCwgXCJUZXN0U3RhY2tcIik7XG4gIGNvbnN0IFRlc3RHaXRodWJBY3Rpb25zUm9sZVByb3BzIDogR2l0aHViQWN0aW9uc1JvbGUuR2l0aHViQWN0aW9uc1JvbGVQcm9wcyA9IHtcbiAgICBzdGFja091dHB1dEdpdEh1Yk9pZGNQcm92aWRlcjogJ2V4YW1wbGUtc3RhY2stb3V0cHV0LW5hbWUnLFxuICAgIGRlcGxveVJvbGU6ICdHaXRIdWJEZXBsb3lAJyArICdleGFtcGxlLXJlcG8tbmFtZScsXG4gICAgZ2l0aHViUmVwb05hbWU6ICdleGFtcGxlLXJlcG8tbmFtZScsXG4gICAgZ2l0aHViUmVwb0lEOiAnZXhhbXBsZS1yZXBvLWlkJyxcbiAgICByZXBvc2l0b3J5Q29uZmlnOiBbXG4gICAgICB7IG93bmVyOiBcImV4YW1wbGUtb3duZXJcIiwgcmVwbzogJ2V4YW1wbGUtcmVwby1uYW1lJyB9XG4gICAgXSxcbiAgICByb2xlUG9saWN5RG9jdW1lbnRKU09OOiAnbm9uZSdcbiAgfVxuICAvLyBXSEVOXG4gIG5ldyBHaXRodWJBY3Rpb25zUm9sZS5HaXRodWJBY3Rpb25zUm9sZShzdGFjaywgJ015VGVzdENvbnN0cnVjdCcsIFRlc3RHaXRodWJBY3Rpb25zUm9sZVByb3BzKTtcbiAgLy8gVEhFTlxuICBleHBlY3RDREsoc3RhY2spLnRvKGNvdW50UmVzb3VyY2VzKFwiQVdTOjpTTlM6OlRvcGljXCIsMCkpO1xufSk7XG4iXX0=