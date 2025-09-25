// import { appConfig } from "../app-config";

import { Amplify } from "aws-amplify";
import { appConfig } from "../app-config";

const awsExports = {
  Auth: {
    Cognito: {
      userPoolId: appConfig.cognitoUserPoolId,
      userPoolClientId: appConfig.cognitoClientId,
    },
  },

  API: {
    GraphQL: {
      defaultAuthMode: "userPool",
      endpoint: appConfig.graphqlEndpoint,
      region: appConfig.graphqlRegion,
    },
  },
} as const;

Amplify.configure(awsExports);

export default awsExports;
